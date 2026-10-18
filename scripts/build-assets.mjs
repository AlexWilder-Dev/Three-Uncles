// One-off asset build: web images, brand masks, favicons, og.jpg and the CJK font subset.
// Sources are the research copies of Three Uncles' own photos and graphics in research/images.
// Run with `npm run assets`. Outputs are committed, so the site build doesn't need this.

import sharp from 'sharp'
import { mkdir, writeFile, readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const src = (f) => path.join(root, 'research/images', f)
const pub = (f) => path.join(root, 'public', f)
const cache = path.join(root, 'scripts/.cache')

const COBALT = '#0b52b8'
const CREAM = '#f4e5db'
const INK = '#3058a4'

await mkdir(pub('img'), { recursive: true })
await mkdir(cache, { recursive: true })

// ---------------------------------------------------------------- photos
// name in public/img  <-  research file, optional crop as [left, top, width, height] fractions
const photos = {
  'brixton-shopfront': ['brixton-shopfront.jpg'],
  'brixton-arcade': ['brixton-shopfront-arcade-diners.jpg'],
  'brixton-dishes': ['brixton-dishes-timeout-post.jpg'],
  'ls-hanging-ducks': ['liverpool-st-hanging-ducks-2019.jpg'],
  'ls-neon-sign': ['liverpool-st-neon-sign-2019.jpg'],
  'ls-neon-kitchen': ['liverpool-st-neon-kitchen-2019.jpg'],
  'ls-queue': ['liverpool-st-queue-2019.jpg'],
  'ls-chef': ['liverpool-st-chef-cleaver-2019.jpg'],
  'ls-bags': ['liverpool-st-neon-bags-2019.jpg'],
  'camden-queue': ['camden-queue-neon-2021.jpg'],
  'char-siu-hanging': ['char-siu-hanging.jpg'],
  'stpauls-shopfront': ['stpauls-shopfront-square.jpg'],
  'uncles-hoarding': ['uncles-stpauls-hoarding.jpg'],
  'childhood': ['childhood-friends-halftone.jpg'],
  'halftone-portrait': ['halftone-family-portrait.jpg'],
  'chef-pastries': ['chef-char-siu-pastries-2021.jpg'],
  'ealing-interior': ['ealing-interior-counter-2025.jpg'],
  'ealing-long': ['ealing-interior-long-2025.jpg'],
  'ealing-specials': ['ealing-specials-spread.jpg'],
  'ealing-cheung-fun': ['ealing-cheung-fun.jpg'],
  'roast-duck-plate': ['roast-duck-plate.jpg'],
  'duck-lo-mein': ['duck-char-siu-lo-mein-box.jpg'],
  'bao': ['char-siu-bao-steamer.jpg'],
  'dim-sum': ['dim-sum-steamer.jpg'],
  'fishballs': ['curry-fishballs.jpg'],
  'catering-platter': ['catering-platter-duck-pork.jpg'],
  'rice-boxes': ['rice-boxes-flatlay.jpg'],
}

for (const [name, [file, crop]] of Object.entries(photos)) {
  const base = sharp(src(file)).rotate()
  const meta = await base.metadata()
  let pipeline = base
  if (crop) {
    const [l, t, w, h] = crop
    pipeline = pipeline.extract({
      left: Math.round(l * meta.width),
      top: Math.round(t * meta.height),
      width: Math.round(w * meta.width),
      height: Math.round(h * meta.height),
    })
  }
  const buf = await pipeline.toBuffer()
  for (const w of [640, 1280]) {
    await sharp(buf)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: w > 700 ? 72 : 76 })
      .toFile(pub(`img/${name}-${w}.webp`))
  }
}

// ---------------------------------------------------------------- brand graphics
// Their lockups and line icons, kept as alpha masks so the site can colour them.
await sharp(src('logo-horizontal-blue.png')).resize({ width: 900 }).png().toFile(pub('img/logo-h.png'))
await sharp(src('logo-vertical-cream.png')).resize({ width: 420 }).png().toFile(pub('img/logo-v.png'))

const icons = await sharp(src('icons-duck-pig-chicken.png')).metadata()
const iconCuts = { duck: [0, 0.31], pig: [0.31, 0.68], chicken: [0.68, 1] }
for (const [name, [a, b]] of Object.entries(iconCuts)) {
  await sharp(src('icons-duck-pig-chicken.png'))
    .extract({ left: Math.round(a * icons.width), top: 0, width: Math.round((b - a) * icons.width), height: icons.height })
    .trim()
    .resize({ height: 160 })
    .png()
    .toFile(pub(`img/icon-${name}.png`))
}

// 三叔 column from the horizontal lockup.
const logo = await sharp(src('logo-horizontal-blue.png')).metadata()
const chars = await sharp(src('logo-horizontal-blue.png'))
  .extract({ left: Math.round(0.4 * logo.width), top: 0, width: Math.round(0.166 * logo.width), height: logo.height })
  .trim()
  .toBuffer()
await sharp(chars).png().toFile(pub('img/mark-sanshuk.png'))

async function iconTile(size, pad) {
  const inner = size - pad * 2
  const glyph = await sharp(chars)
    .resize({ height: inner, width: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()
  // recolour the blue glyph to cream using its alpha
  const { data, info } = await sharp(glyph).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 0xf4
    data[i + 1] = 0xe5
    data[i + 2] = 0xdb
  }
  const cream = await sharp(data, { raw: info }).png().toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: COBALT } })
    .composite([{ input: cream, gravity: 'centre' }])
    .png()
}
await (await iconTile(180, 26)).toFile(pub('apple-touch-icon.png'))
await (await iconTile(64, 8)).toFile(pub('favicon.png'))
await (await iconTile(512, 70)).toFile(pub('icon-512.png'))

// ---------------------------------------------------------------- fonts (Google Fonts, OFL)
async function fetchText(url, ua) {
  const res = await fetch(url, { headers: { 'User-Agent': ua } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}
async function fetchBuf(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return Buffer.from(await res.arrayBuffer())
}
async function cached(file, make) {
  const p = path.join(cache, file)
  try {
    await access(p)
  } catch {
    await writeFile(p, await make())
  }
  return p
}

// Every character the site uses, subset into one small file per weight.
const CJK = '三叔烤麵點心喝餐馆館燒味见证鴨豬雞叉肉海南'
const MODERN_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
await mkdir(path.join(root, 'src/assets/fonts'), { recursive: true })
for (const weight of [400, 700]) {
  const css = await fetchText(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+HK:wght@${weight}&text=${encodeURIComponent(CJK)}`,
    MODERN_UA,
  )
  const url = css.match(/url\((https:[^)]+)\)/)[1]
  await writeFile(path.join(root, `src/assets/fonts/noto-sans-hk-${weight}.woff2`), await fetchBuf(url))
}

// TTF of Red Hat Mono for text baked into og.jpg.
const monoTtf = await cached('RedHatMono-600.ttf', async () => {
  const css = await fetchText('https://fonts.googleapis.com/css2?family=Red+Hat+Mono:wght@600', 'Mozilla/4.0')
  return fetchBuf(css.match(/url\((https:[^)]+\.ttf)\)/)[1])
})

// ---------------------------------------------------------------- og.jpg 1200x630
// Left: cream panel with their blue lockup. Right: the Brixton shopfront.
const W = 1200
const H = 630
const panelW = 430

const shop = await sharp(src('brixton-shopfront.jpg')).metadata()
const photo = await sharp(src('brixton-shopfront.jpg'))
  .extract({ left: 0, top: Math.round(shop.height * 0.02), width: shop.width, height: Math.round(shop.height * 0.62) })
  .resize({ width: W - panelW, height: H, fit: 'cover', position: 'centre' })
  .toBuffer()

const lockup = await sharp(src('logo-horizontal-blue.png')).resize({ width: panelW - 96 }).toBuffer()
const lockupMeta = await sharp(lockup).metadata()

const text = (t, size, colour, width) =>
  sharp({
    text: {
      text: `<span foreground="${colour}">${t}</span>`,
      font: `Red Hat Mono ${size}`,
      fontfile: monoTtf,
      width,
      rgba: true,
      spacing: Math.round(size * 0.35),
    },
  })
    .png()
    .toBuffer()

const line1 = await text('CANTONESE ROAST MEAT', 22, INK, panelW - 96)
const line2 = await text('Brixton Village and six more London sites. Chopped to order.', 19, '#1d2b4f', panelW - 96)

const rules = Buffer.from(
  `<svg width="${panelW - 96}" height="10" xmlns="http://www.w3.org/2000/svg">
     <rect y="0" width="100%" height="1.5" fill="${INK}"/>
     <rect y="4" width="100%" height="1.5" fill="${INK}"/>
     <rect y="8" width="100%" height="1.5" fill="${INK}"/>
   </svg>`,
)

await sharp({ create: { width: W, height: H, channels: 3, background: CREAM } })
  .composite([
    { input: photo, left: panelW, top: 0 },
    { input: Buffer.from(`<svg width="8" height="${H}"><rect width="8" height="${H}" fill="${COBALT}"/></svg>`), left: panelW - 4, top: 0 },
    { input: lockup, left: 48, top: 72 },
    { input: rules, left: 48, top: 72 + lockupMeta.height + 34 },
    { input: line1, left: 48, top: 72 + lockupMeta.height + 66 },
    { input: line2, left: 48, top: 72 + lockupMeta.height + 112 },
  ])
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(pub('og.jpg'))

const og = await sharp(pub('og.jpg')).metadata()
const ogSize = (await readFile(pub('og.jpg'))).length
console.log(`og.jpg ${og.width}x${og.height} ${(ogSize / 1024).toFixed(0)}KB`)
