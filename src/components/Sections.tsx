import { motion, useReducedMotion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { awards, DAYS, DAY_NAMES, group, locations, newsletter, press, timeline, type Faq, type Location, type Quote } from '../data/threeUncles'
import { spanText } from '../lib/hours'
import { useSite } from '../lib/site'
import { Icon, Rule } from './bits'

export function HoursTable({ loc }: { loc: Location }) {
  const { now } = useSite()
  return (
    <div className="hours">
      <table>
        <caption className="visually-hidden">Opening hours, {loc.name}</caption>
        <tbody>
          {DAYS.map((d) => (
            <tr key={d} className={d === now.day ? 'is-today' : ''}>
              <th scope="row">
                {DAY_NAMES[d]}
                {d === now.day && <span className="hours__today">Today</span>}
              </th>
              <td className="price">{spanText(loc.hours[d])}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loc.lastOrdersText && <p className="hours__note">{loc.lastOrdersText}</p>}
    </div>
  )
}

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>
            <span>{f.q}</span>
            <Icon name="plus" size={18} />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  )
}

export function PressList({ quotes = press, compact = false }: { quotes?: Quote[]; compact?: boolean }) {
  return (
    <ul className={`press${compact ? ' press--compact' : ''}`}>
      {quotes.map((q) => (
        <li key={q.source + q.text.slice(0, 12)}>
          <blockquote>
            <p>“{q.text}”</p>
          </blockquote>
          <p className="press__source">
            {q.source}
            {q.author && <span>{q.author}</span>}
            {q.note && <span>{q.note}</span>}
          </p>
        </li>
      ))}
    </ul>
  )
}

export function AwardsList() {
  return (
    <ul className="awards">
      {awards.map((a) => (
        <li key={a.text}>
          <span className="awards__label">{a.label}</span>
          <a href={a.url} target="_blank" rel="noreferrer">
            {a.text}
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Year by year, each new kitchen's sign switches on. */
export function Timeline() {
  const reduce = useReducedMotion()
  const names: Record<string, string> = Object.fromEntries(locations.map((l) => [l.slug, l.name]))
  names.bermondsey = 'Bermondsey'
  return (
    <ol className="timeline">
      {timeline.map((m, i) => {
        const before = timeline.slice(0, i).flatMap((t) => t.opens ?? [])
        return (
          <motion.li
            key={m.year}
            className="timeline__item"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.45 }}
          >
            <p className="timeline__year">{m.year}</p>
            <div className="timeline__body">
              <h3>{m.title}</h3>
              <p>{m.body}</p>
              <div className="timeline__lights" aria-label={`${before.length + (m.opens?.length ?? 0)} kitchens by the end of ${m.year}`}>
                {before.map((s) => (
                  <span key={s} className="bulb is-on" title={names[s]} />
                ))}
                {(m.opens ?? []).map((s) => (
                  <motion.span
                    key={s}
                    className="bulb is-new"
                    title={names[s]}
                    initial={reduce ? false : { opacity: 0.15 }}
                    whileInView={{ opacity: [0.15, 1, 0.4, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                ))}
                <span className="timeline__count">
                  {before.length + (m.opens?.length ?? 0)} {before.length + (m.opens?.length ?? 0) === 1 ? 'kitchen' : 'kitchens'}
                </span>
              </div>
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}

export function Newsletter() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('That email doesn’t look right.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <div className="news">
      <Rule label={newsletter.title} mark="三叔" tone="cream" />
      {sent ? (
        <div className="news__done" role="status">
          <p className="news__big">You’re on the list.</p>
          <p>We’ll email {email} when there’s a new site, a new dish or something worth knowing.</p>
          <p className="demo-note">Demo: nothing has been sent or stored.</p>
        </div>
      ) : (
        <form className="news__form" onSubmit={submit} noValidate>
          <p>New sites, new dishes, the odd offer. Not often.</p>
          <div className="news__fields">
            <label>
              <span className="visually-hidden">Email</span>
              <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <label>
              <span className="visually-hidden">Phone (optional)</span>
              <input type="tel" placeholder="Phone (optional)" autoComplete="tel" />
            </label>
          </div>
          <label className="news__consent">
            <input type="checkbox" defaultChecked /> {newsletter.consent}
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn--cream">
            Sign up
          </button>
        </form>
      )}
    </div>
  )
}

export function InstagramBand() {
  return (
    <a className="insta" href={group.instagram.url} target="_blank" rel="noreferrer">
      <span className="insta__handle">{group.instagram.handle}</span>
      <span className="insta__text">The ducks, the queues, the new sites, first on Instagram.</span>
      <span className="insta__go">
        Follow <Icon name="external" size={14} />
      </span>
    </a>
  )
}
