import { Link } from 'react-router-dom'
import { locations, type Location } from '../data/threeUncles'
import { telHref } from '../lib/format'
import { useSite } from '../lib/site'
import { Icon, StatusLine } from './bits'

/**
 * The shopfront fascia: cobalt board, cream inset frame, the site's name and whether it's open.
 * Answers "which Three Uncles, and is it open" before anything else.
 */
export function Fascia({ loc, heading = 'h1', showSwitch = true }: { loc: Location; heading?: 'h1' | 'h2'; showSwitch?: boolean }) {
  const { statusOf, setPickerOpen } = useSite()
  const st = statusOf(loc)
  const H = heading
  const openElsewhere = !st.isOpen ? locations.filter((l) => l.slug !== loc.slug && statusOf(l).isOpen) : []

  return (
    <section className="fascia" aria-labelledby={`fascia-${loc.slug}`}>
      <div className="fascia__frame">
        <div className="fascia__top">
          <p className="eyebrow">{loc.area}</p>
          {showSwitch && (
            <button type="button" className="fascia__switch" onClick={() => setPickerOpen(true)}>
              Change site <Icon name="down" size={14} />
            </button>
          )}
        </div>
        <H className="fascia__name" id={`fascia-${loc.slug}`}>
          {loc.name}
        </H>
        <StatusLine status={st} long className="fascia__status" />
        <p className="fascia__address">{loc.address.join(', ')}</p>
        <div className="fascia__actions">
          <a className="btn btn--cream" href={loc.mapUrl} target="_blank" rel="noreferrer">
            <Icon name="arrow" size={18} /> Directions
          </a>
          {loc.phone ? (
            <a className="btn btn--ghost-cream" href={telHref(loc.phone.tel)}>
              <Icon name="phone" size={17} /> {loc.phone.display}
            </a>
          ) : (
            <a className="btn btn--ghost-cream" href={`mailto:${loc.email}`}>
              <Icon name="mail" size={17} /> Email
            </a>
          )}
        </div>
        <p className="fascia__service">{loc.tagline}</p>
        {openElsewhere.length > 0 && (
          <p className="fascia__elsewhere">
            Open now:{' '}
            {openElsewhere.map((l, i) => (
              <span key={l.slug}>
                {i > 0 && ', '}
                <Link to={`/sites/${l.slug}`}>{l.name}</Link>
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  )
}
