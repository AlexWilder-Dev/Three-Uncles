import { useState } from 'react'
import type { Location, MenuItem, MenuSection } from '../data/threeUncles'
import { money } from '../lib/format'
import { Rule } from './bits'

const hasVeg = (s: MenuSection) => s.groups.some((g) => g.items.some((i) => i.tags?.includes('v')))

export function MenuBoard({ loc }: { loc: Location }) {
  const [vegOnly, setVegOnly] = useState(false)
  const vegCount = loc.menu.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.items.filter((i) => i.tags?.includes('v')).length, 0), 0)
  const sections = vegOnly ? loc.menu.filter(hasVeg) : loc.menu

  return (
    <div className="board">
      <div className="board__bar">
        <nav className="board__jump" aria-label={`${loc.name} menu sections`}>
          {loc.menu.map((s) => (
            <a key={s.id} href={`#m-${loc.slug}-${s.id}`} onClick={(e) => jump(e, `m-${loc.slug}-${s.id}`)}>
              <span className="hk" aria-hidden>
                {s.mark}
              </span>
              {s.title}
            </a>
          ))}
        </nav>
        {vegCount > 0 && (
          <label className="board__veg">
            <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
            <span className="board__switch" aria-hidden />
            Vegetarian only
          </label>
        )}
      </div>

      <div className="board__cols">
        {sections.map((section) => (
          <section key={section.id} id={`m-${loc.slug}-${section.id}`} className="board__section" aria-labelledby={`mh-${loc.slug}-${section.id}`}>
            <Rule label={<span id={`mh-${loc.slug}-${section.id}`}>{section.title}</span>} mark={section.mark} icons={section.id === 'roasted'} as="h3" />
            {section.kicker && <p className="board__kicker">{section.kicker}</p>}
            {section.unavailable && <p className="board__unavailable">{section.unavailable}</p>}
            {section.groups.map((g, gi) => {
              const items = vegOnly ? g.items.filter((i) => i.tags?.includes('v')) : g.items
              if (!items.length) return null
              return (
                <div key={gi} className="board__group">
                  {g.title && <p className="board__grouptitle">{g.title}</p>}
                  <ul>
                    {items.map((item) => (
                      <Line key={item.name} item={item} />
                    ))}
                  </ul>
                </div>
              )
            })}
            {section.sauces && !vegOnly && (
              <div className="board__sauces">
                <p>
                  <span>Add a Special Sauce</span>
                  <span className="board__dots" aria-hidden />
                  <span className="price">{money(section.sauces.price)}</span>
                </p>
                <p className="board__saucelist">{section.sauces.names.join(' · ')}</p>
              </div>
            )}
            {section.lines?.map((l) => (
              <p key={l} className="board__line">
                {l}
              </p>
            ))}
            {section.note && <p className="board__note">{section.note}</p>}
          </section>
        ))}
      </div>
      <p className="board__legend">
        <span className="tag tag--v">v</span> vegetarian <span className="tag tag--n">n</span> contains nuts. Marked as on each site’s own menu; please ask the team
        about allergens.
      </p>
    </div>
  )
}

function Line({ item }: { item: MenuItem }) {
  return (
    <li className="board__item">
      <p className="board__row">
        <span className="board__name">
          {item.name}
          {item.tags?.map((t) => (
            <span key={t} className={`tag tag--${t}`}>
              {t}
            </span>
          ))}
        </span>
        <span className="board__dots" aria-hidden />
        <span className="price">{money(item.price)}</span>
      </p>
      {item.detail && <p className="board__detail">{item.detail}</p>}
    </li>
  )
}

function jump(e: React.MouseEvent, id: string) {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  const y = el.getBoundingClientRect().top + window.scrollY - 120
  window.scrollTo({ top: y, behavior: 'smooth' })
}
