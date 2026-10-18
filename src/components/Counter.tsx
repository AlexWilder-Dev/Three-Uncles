import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { group } from '../data/threeUncles'
import { dimSumOf, findItem, money } from '../lib/format'
import { useSite } from '../lib/site'
import { Icon, Rule } from './bits'
import { Cleaver, hanging, Slice, type MeatId } from './meats'

const MEATS: { id: MeatId; name: string; hk: string; itemId: string }[] = [
  { id: 'duck', name: 'Roast Duck', hk: '燒鴨', itemId: 'duck-rice' },
  { id: 'char-siu', name: 'Char Siu BBQ Pork', hk: '叉燒', itemId: 'char-siu-rice' },
  { id: 'pork-belly', name: 'Crispy Pork Belly', hk: '燒肉', itemId: 'pork-belly-rice' },
  { id: 'chicken', name: 'Hainan Chicken', hk: '海南雞', itemId: 'hainan-rice' },
]

const SAUCE_COLOURS = ['#3b1f12', '#b4652d', '#8fa34a', '#e0602f', '#a51f17']

// Where each pick lands on the plate: [x, y] centres for one, two or three meats.
const SLOTS: [number, number][][] = [[[150, 104]], [[118, 104], [186, 104]], [[100, 110], [152, 92], [204, 110]]]

export function Counter() {
  const { site, setPickerOpen } = useSite()
  const reduce = useReducedMotion()
  const [meats, setMeats] = useState<MeatId[]>([])
  const [sauces, setSauces] = useState<string[]>([])
  const [steamer, setSteamer] = useState<Record<string, number>>({})
  const [notice, setNotice] = useState('')
  const [chops, setChops] = useState(0)
  const ticketNo = useRef(String(1000 + Math.floor(Math.random() * 8999))).current

  const saucesDef = site.menu.find((s) => s.sauces)?.sauces
  const dimSum = useMemo(() => dimSumOf(site), [site])
  const treasures = findItem(site, 'three-treasures')

  // Steamer quantities only make sense for the current site's list.
  useEffect(() => {
    setSteamer((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => dimSum.some((d) => d.id === id))))
  }, [site.slug, dimSum])

  const toggleMeat = (id: MeatId) => {
    setNotice('')
    if (meats.includes(id)) {
      setMeats(meats.filter((m) => m !== id))
      return
    }
    if (meats.length === 3) {
      setNotice('Three meats is the most on one plate.')
      return
    }
    setMeats([...meats, id])
    setChops((c) => c + 1)
  }

  const toggleSauce = (name: string) =>
    setSauces((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]))

  const bump = (id: string, d: number) =>
    setSteamer((s) => {
      const n = Math.max(0, Math.min(9, (s[id] ?? 0) + d))
      const next = { ...s, [id]: n }
      if (!n) delete next[id]
      return next
    })

  const lines = useMemo(() => {
    const out: { label: string; sub?: string; price: number }[] = []
    if (meats.length === 1) {
      const item = findItem(site, MEATS.find((m) => m.id === meats[0])!.itemId)
      if (item) out.push({ label: item.name, price: item.price })
    } else if (meats.length > 1) {
      const item = findItem(site, meats.length === 2 ? 'combo-2' : 'combo-3')
      if (item) out.push({ label: item.name, sub: meats.map((m) => MEATS.find((x) => x.id === m)!.name).join(' + '), price: item.price })
    }
    if (meats.length && saucesDef) {
      for (const s of sauces) out.push({ label: s, price: saucesDef.price })
    }
    for (const d of dimSum) {
      const q = steamer[d.id!]
      if (q) out.push({ label: `${q} × ${d.name}`, price: q * d.price })
    }
    return out
  }, [meats, sauces, steamer, site, saucesDef, dimSum])

  const total = lines.reduce((n, l) => n + l.price, 0)
  const isTreasures = treasures && meats.length === 3 && ['duck', 'char-siu', 'pork-belly'].every((m) => meats.includes(m as MeatId))
  const plateHeadline =
    meats.length === 0 ? 'Pick a meat to start' : meats.length === 1 ? 'One meat with rice' : meats.length === 2 ? 'Two meats with rice' : 'Three meats with rice'

  return (
    <div className="counter">
      <div className="counter__intro">
        <p>
          Everything is chopped to order behind the glass. Pick one, two or three meats; they come with pak choi and steamed jasmine rice. Prices are{' '}
          <button type="button" className="counter__site" onClick={() => setPickerOpen(true)}>
            {site.name}’s
            <Icon name="down" size={14} />
          </button>
        </p>
      </div>

      <div className="counter__grid">
        <div className="counter__build">
          <p className="counter__step">
            <span>1</span> Pick your meats
          </p>
          <div className="window">
            <div className="window__frame tiles">
              <div className="window__rail" aria-hidden />
              <ul className="window__hooks">
                {MEATS.map((m) => {
                  const on = meats.includes(m.id)
                  const price = findItem(site, m.itemId)?.price
                  return (
                    <li key={m.id}>
                      <button type="button" className={`hook${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => toggleMeat(m.id)}>
                        <motion.svg
                          viewBox="0 0 100 180"
                          className="hook__meat"
                          aria-hidden
                          style={{ originX: '50%', originY: '0%' }}
                          animate={on && !reduce ? { rotate: [0, -9, 7, -4, 2, 0] } : { rotate: 0 }}
                          transition={{ duration: 0.9 }}
                          whileHover={reduce ? undefined : { rotate: [0, 3, -2, 0], transition: { duration: 0.8 } }}
                        >
                          {hanging[m.id]}
                        </motion.svg>
                        <span className="hook__hk hk" lang="zh-Hant">
                          {m.hk}
                        </span>
                        <span className="hook__name">{m.name}</span>
                        {price !== undefined && <span className="hook__price price">{money(price)}</span>}
                        <span className="hook__tick" aria-hidden>
                          <Icon name={on ? 'check' : 'plus'} size={14} />
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className="window__glass" aria-hidden />
            </div>
          </div>
          <p className="counter__notice" aria-live="polite">
            {notice}
          </p>

          <div className="plate">
            <div className="plate__art">
              <svg viewBox="0 0 300 200" role="img" aria-label={meats.length ? `A plate with ${meats.length} meat${meats.length > 1 ? 's' : ''} on rice` : 'An empty plate of rice'}>
                <ellipse cx="150" cy="112" rx="142" ry="82" fill="#fff" stroke="#3058a4" strokeWidth="2.6" />
                <ellipse cx="150" cy="112" rx="128" ry="72" fill="none" stroke="#3058a4" strokeWidth="1.6" strokeDasharray="1 7" strokeLinecap="round" />
                <ellipse cx="150" cy="112" rx="116" ry="64" fill="none" stroke="#3058a4" strokeWidth="1" />
                <ellipse cx="150" cy="118" rx="78" ry="40" fill="#fbf7ee" stroke="#e2d6c4" strokeWidth="1.5" />
                {Array.from({ length: 26 }).map((_, i) => (
                  <path
                    key={i}
                    d={`M${100 + ((i * 37) % 100)} ${100 + ((i * 23) % 34)} l4 1`}
                    stroke="#e4d8c5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ))}
                <g transform="translate(232 128)">
                  <path d="M0 0 C10 -18 30 -16 34 -2 C24 6 8 8 0 0 Z" fill="#5d9443" stroke="#2f5d25" strokeWidth="1.2" />
                  <path d="M-6 6 C4 -6 22 0 24 12 C14 16 0 14 -6 6 Z" fill="#78ad57" stroke="#2f5d25" strokeWidth="1.2" />
                </g>
                <AnimatePresence>
                  {meats.map((m, i) => {
                    const [x, y] = SLOTS[meats.length - 1][i]
                    return (
                      <motion.g
                        key={m}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 26, delay: reduce ? 0 : 0.28 }}
                      >
                        {[-1.5, -0.5, 0.5, 1.5].map((k, j) => (
                          <Slice key={j} meat={m} x={x + k * 8} y={y + Math.abs(k) * 3} r={-24 + k * 6} />
                        ))}
                      </motion.g>
                    )
                  })}
                </AnimatePresence>
              </svg>
              <AnimatePresence>
                {!reduce && chops > 0 && (
                  <motion.div
                    key={chops}
                    className="plate__cleaver"
                    initial={{ y: -50, opacity: 0, rotate: -8 }}
                    animate={{ y: [-50, 0, -30, 0, -30, 0, -60], opacity: [0, 1, 1, 1, 1, 1, 0] }}
                    transition={{ duration: 0.7, times: [0, 0.14, 0.3, 0.44, 0.6, 0.74, 1] }}
                  >
                    <Cleaver />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="plate__headline">{plateHeadline}</p>
          </div>

          {saucesDef && (
            <>
              <p className="counter__step">
                <span>2</span> Add a special sauce <em>{money(saucesDef.price)} each</em>
              </p>
              <ul className="sauces">
                {saucesDef.names.map((name, i) => {
                  const on = sauces.includes(name)
                  return (
                    <li key={name}>
                      <button type="button" className={`saucer${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => toggleSauce(name)} disabled={!meats.length}>
                        <span className="saucer__dish" style={{ ['--sauce' as string]: SAUCE_COLOURS[i] }} aria-hidden />
                        <span className="saucer__name">{name}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              {!meats.length && <p className="counter__hint">Sauces go on a plate, so pick a meat first.</p>}
            </>
          )}

          {dimSum.length > 0 && (
            <>
              <p className="counter__step">
                <span>3</span> Something from the steamer?
              </p>
              <ul className="steamer">
                {dimSum.map((d) => {
                  const q = steamer[d.id!] ?? 0
                  return (
                    <li key={d.id} className={q ? 'is-on' : ''}>
                      <span className="steamer__name">
                        {d.name}
                        {d.tags?.map((t) => (
                          <span key={t} className={`tag tag--${t}`}>
                            {t}
                          </span>
                        ))}
                      </span>
                      <span className="price">{money(d.price)}</span>
                      <span className="stepper">
                        <button type="button" onClick={() => bump(d.id!, -1)} disabled={!q} aria-label={`One less ${d.name}`}>
                          <Icon name="minus" size={14} />
                        </button>
                        <span aria-live="polite">{q}</span>
                        <button type="button" onClick={() => bump(d.id!, 1)} aria-label={`One more ${d.name}`}>
                          <Icon name="plus" size={14} />
                        </button>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>

        <aside className="ticket-wrap" aria-label="Your order">
          <div className="ticket">
            <div className="ticket__head">
              <span className="ticket__brand">
                THREE <span className="hk">三叔</span> UNCLES
              </span>
              <span className="ticket__no">#{ticketNo}</span>
            </div>
            <p className="ticket__site">{site.name}</p>
            <Rule />
            {lines.length === 0 ? (
              <p className="ticket__empty">Nothing on the ticket yet.</p>
            ) : (
              <ul className="ticket__lines">
                <AnimatePresence initial={false}>
                  {lines.map((l) => (
                    <motion.li key={l.label} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                      <span className="ticket__label">
                        {l.label}
                        {l.sub && <small>{l.sub}</small>}
                      </span>
                      <span className="price">{money(l.price)}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
            {meats.length > 0 && <p className="ticket__served">Served with Pak Choi and steamed Jasmine rice</p>}
            <div className="ticket__total">
              <span>Total</span>
              <Ticker value={money(total)} />
            </div>
            <AnimatePresence>
              {isTreasures && treasures && (
                <motion.p className="ticket__tip" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  Two of you? The {treasures.name} ({treasures.detail?.toLowerCase()}) is {money(treasures.price)} at {site.name}.
                </motion.p>
              )}
            </AnimatePresence>
            <div className="ticket__how">
              <p className="ticket__howtitle">{site.service === 'table' ? 'Take a seat and tell your server' : 'Order at the counter'}</p>
              <p>
                {site.service === 'table'
                  ? 'No booking needed. Show them this ticket, or just say what’s on it.'
                  : site.slug === 'kings-cross'
                    ? 'Order and pay at the counter, then collect your food when we call your number.'
                    : 'Show this ticket at the counter, or just say what’s on it.'}
              </p>
              <div className="ticket__actions">
                <Link className="btn btn--solid btn--small" to={`/sites/${site.slug}`}>
                  Find {site.name}
                </Link>
                <a className="btn btn--small" href={group.deliveroo} target="_blank" rel="noreferrer">
                  Deliveroo <Icon name="external" size={14} />
                </a>
              </div>
            </div>
          </div>
          {lines.length > 0 && (
            <button
              type="button"
              className="ticket__clear"
              onClick={() => {
                setMeats([])
                setSauces([])
                setSteamer({})
                setNotice('')
              }}
            >
              Clear the ticket
            </button>
          )}
        </aside>
      </div>
    </div>
  )
}

function Ticker({ value }: { value: string }) {
  return (
    <span className="ticker price" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-70%', opacity: 0 }} transition={{ duration: 0.22 }}>
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
