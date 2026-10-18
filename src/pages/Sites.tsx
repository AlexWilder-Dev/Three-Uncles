import { Link } from 'react-router-dom'
import { bermondsey, locations } from '../data/threeUncles'
import { spanText } from '../lib/hours'
import { telHref } from '../lib/format'
import { useSite } from '../lib/site'
import { Icon, Picture, StatusLine } from '../components/bits'
import { MenuBoard } from '../components/MenuBoard'
import { NearestButton, SignRow } from '../components/Signs'

export function Sites() {
  const { statusOf, now, setSite } = useSite()
  const open = locations.filter((l) => statusOf(l).isOpen)

  return (
    <div className="page sites">
      <section className="night night--page" aria-labelledby="sites-title">
        <div className="wrap night__head">
          <p className="eyebrow">{open.length ? `${open.length} of ${locations.length} open now` : 'All closed right now'}</p>
          <h1 id="sites-title">Seven sites across London</h1>
          <p>No bookings at any of them: just turn up. Lit signs are open now.</p>
          <NearestButton />
        </div>
        <SignRow />
      </section>

      <section className="section" aria-label="Every site">
        <div className="wrap">
          <ul className="sitecards">
            {locations.map((l) => (
              <li key={l.slug} className="sitecard">
                <Link to={`/sites/${l.slug}`} className="sitecard__photo photo" onClick={() => setSite(l.slug)} tabIndex={-1} aria-hidden>
                  <Picture src={l.photos[0].src} alt="" ratio={l.photos[0].ratio} sizes="(min-width: 900px) 30vw, 40vw" />
                </Link>
                <div className="sitecard__body">
                  <h2>
                    <Link to={`/sites/${l.slug}`} onClick={() => setSite(l.slug)}>
                      {l.name}
                    </Link>
                  </h2>
                  <StatusLine status={statusOf(l)} long />
                  <p className="sitecard__addr">{l.address.join(', ')}</p>
                  <p className="sitecard__line">{l.tagline}</p>
                  <p className="sitecard__today">Today {spanText(l.hours[now.day])}</p>
                  <div className="sitecard__actions">
                    <a className="btn btn--small" href={l.mapUrl} target="_blank" rel="noreferrer">
                      <Icon name="arrow" size={15} /> Directions
                    </a>
                    {l.phone && (
                      <a className="btn btn--small" href={telHref(l.phone.tel)}>
                        <Icon name="phone" size={15} /> Call
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
            <li className="sitecard sitecard--delivery">
              <div className="sitecard__photo photo" aria-hidden>
                <Picture src="img/ls-bags" alt="" ratio={0.667} sizes="(min-width: 900px) 30vw, 40vw" />
              </div>
              <div className="sitecard__body">
                <h2>{bermondsey.name}</h2>
                <p className="sitecard__line">{bermondsey.note}</p>
                <div className="sitecard__actions">
                  <a className="btn btn--small btn--solid" href={bermondsey.url} target="_blank" rel="noreferrer">
                    Order on Deliveroo <Icon name="external" size={14} />
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export function MenuPage() {
  const { site, setPickerOpen } = useSite()
  return (
    <div className="page menupage">
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Menu and prices for</p>
            <h1 className="menupage__title">
              <button type="button" onClick={() => setPickerOpen(true)}>
                {site.name}
                <Icon name="down" size={26} />
              </button>
            </h1>
            <p>Each kitchen has its own menu and prices. Switch site to see theirs.</p>
          </div>
          <MenuBoard loc={site} />
        </div>
      </section>
    </div>
  )
}
