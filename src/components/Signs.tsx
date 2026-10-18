import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { bermondsey, locations, type Location } from '../data/threeUncles'
import { distanceKm, distanceText } from '../lib/format'
import { useSite } from '../lib/site'
import { Icon } from './bits'

/**
 * A street of vertical shop signs, one per site, in the stacked-letter style of their own
 * THREE 三叔 UNCLES neon. A sign is lit when that site is open right now.
 */
export function SignRow({ onPicked, label = 'Choose a Three Uncles' }: { onPicked?: (loc: Location) => void; label?: string }) {
  const { site, setSite, statusOf } = useSite()
  const rowRef = useRef<HTMLDivElement>(null)

  // Bring the chosen sign into view inside the row, without moving the page.
  useEffect(() => {
    const row = rowRef.current
    const el = row?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!row || !el) return
    const left = el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2
    row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [site.slug])

  const pick = (loc: Location) => {
    setSite(loc.slug)
    onPicked?.(loc)
  }

  return (
    <div className="street">
      <div className="street__rail" aria-hidden />
      <div className="street__row" ref={rowRef} role="group" aria-label={label}>
        {locations.map((loc, i) => (
          <Sign key={loc.slug} loc={loc} index={i} lit={statusOf(loc).isOpen} selected={loc.slug === site.slug} onPick={() => pick(loc)} />
        ))}
        <a className="sign sign--delivery" href={bermondsey.url} target="_blank" rel="noreferrer" aria-label="Bermondsey, delivery only, order on Deliveroo">
          <span className="sign__arms" aria-hidden />
          <span className="sign__board">
            <span className="sign__top hk" aria-hidden>
              三叔
            </span>
            <span className="sign__tubes sign__tubes--blue" aria-hidden>
              {bermondsey.sign.join('\n')}
            </span>
          </span>
          <span className="sign__plate">
            Delivery only <Icon name="external" size={12} />
          </span>
        </a>
      </div>
    </div>
  )
}

function Sign({ loc, index, lit, selected, onPick }: { loc: Location; index: number; lit: boolean; selected: boolean; onPick: () => void }) {
  const { statusOf } = useSite()
  const reduce = useReducedMotion()
  const st = statusOf(loc)
  const longest = Math.max(...loc.sign.map((w) => w.length))
  const size = longest > 8 ? 'sm' : longest > 6 ? 'md' : 'lg'

  return (
    <button
      type="button"
      className={`sign${lit ? ' is-lit' : ''}${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      aria-label={`${loc.name}: ${st.long}`}
      onClick={onPick}
    >
      <span className="sign__arms" aria-hidden />
      <span className="sign__board">
        <span className="sign__top hk" aria-hidden>
          三叔
        </span>
        <motion.span
          className={`sign__tubes sign__tubes--${size}`}
          aria-hidden
          initial={false}
          animate={lit && !reduce ? { opacity: [0.15, 1, 0.35, 1, 0.7, 1] } : { opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.25 + index * 0.12, times: [0, 0.12, 0.2, 0.38, 0.5, 1] }}
        >
          {loc.sign.join('\n')}
        </motion.span>
      </span>
      <span className="sign__plate">
        {selected && <Icon name="check" size={12} />}
        {st.short}
      </span>
    </button>
  )
}

type GeoState = { kind: 'idle' } | { kind: 'busy' } | { kind: 'done'; text: string } | { kind: 'error'; text: string }

/** Asks for location only when tapped, then picks the nearest open site (or the nearest at all). */
export function NearestButton({ onPicked, tone = 'cream' }: { onPicked?: (loc: Location) => void; tone?: 'cream' | 'ink' }) {
  const { setSite, statusOf } = useSite()
  const [geo, setGeo] = useState<GeoState>({ kind: 'idle' })

  const find = () => {
    if (!('geolocation' in navigator)) {
      setGeo({ kind: 'error', text: 'Your browser can’t share a location. Tap a sign instead.' })
      return
    }
    setGeo({ kind: 'busy' })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        const ranked = locations
          .map((loc) => ({ loc, km: distanceKm(here, loc.coords), open: statusOf(loc).isOpen }))
          .sort((a, b) => a.km - b.km)
        const best = ranked.find((r) => r.open) ?? ranked[0]
        setSite(best.loc.slug)
        onPicked?.(best.loc)
        const nearest = ranked[0]
        let text = `${best.loc.name} is ${best.open ? 'the nearest open now' : 'the nearest'}, ${distanceText(best.km)} away.`
        if (best.open && nearest.loc.slug !== best.loc.slug) {
          text += ` (${nearest.loc.name} is closer but closed.)`
        }
        if (best.km > 40) text = `You’re a way out of London. ${best.loc.name} is the nearest${best.open ? ' open' : ''}.`
        setGeo({ kind: 'done', text })
      },
      () => setGeo({ kind: 'error', text: 'No location shared. Tap the sign you want instead.' }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }

  return (
    <div className={`nearest nearest--${tone}`}>
      <button type="button" className={`btn btn--small ${tone === 'cream' ? 'btn--ghost-cream' : ''}`} onClick={find} disabled={geo.kind === 'busy'}>
        <Icon name="locate" size={16} />
        {geo.kind === 'busy' ? 'Finding you…' : 'Nearest to me'}
      </button>
      <p className="nearest__msg" aria-live="polite">
        {geo.kind === 'done' || geo.kind === 'error' ? geo.text : ''}
      </p>
    </div>
  )
}
