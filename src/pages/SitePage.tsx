import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { group, locations, press, type Location } from '../data/threeUncles'
import { telHref } from '../lib/format'
import { spanText } from '../lib/hours'
import { findLocation, useSite } from '../lib/site'
import { Icon, Picture, Rule, StatusLine } from '../components/bits'
import { Fascia } from '../components/Fascia'
import { MenuBoard } from '../components/MenuBoard'
import { FaqList, HoursTable, PressList } from '../components/Sections'

export function SitePage() {
  const { slug } = useParams()
  const loc = findLocation(slug)
  const { setSite, site } = useSite()

  // Visiting a site's page makes it the chosen site.
  useEffect(() => {
    if (loc && loc.slug !== site.slug) setSite(loc.slug)
  }, [loc, site.slug, setSite])

  if (!loc) return <Navigate to="/sites" replace />

  const isLead = loc.slug === 'brixton-village'
  const quotes = press.filter((q) => q.about?.includes(loc.slug))

  return (
    <div className={`page sitepage${isLead ? ' sitepage--lead' : ''}`}>
      <div className="sitepage__top">
        <Fascia loc={loc} showSwitch={false} />
        <figure className="sitepage__hero photo">
          <Picture src={loc.photos[0].src} alt={loc.photos[0].alt} ratio={loc.photos[0].ratio} sizes="(min-width: 900px) 50vw, 100vw" eager />
        </figure>
      </div>

      <section className="section sitepage__info" aria-label={`Visiting ${loc.name}`}>
        <div className="wrap info-grid">
          <div>
            <Rule label="Hours" mark="餐馆" />
            <HoursTable loc={loc} />
          </div>
          <div>
            <Rule label="Find us" />
            <address className="findus">
              {loc.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <ul className="contact">
              <li>
                <a href={loc.mapUrl} target="_blank" rel="noreferrer">
                  <Icon name="arrow" /> Directions on Google Maps
                </a>
              </li>
              {loc.phone && (
                <li>
                  <a href={telHref(loc.phone.tel)}>
                    <Icon name="phone" /> {loc.phone.display}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${loc.email}`}>
                  <Icon name="mail" /> {loc.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <Rule label="How it works" />
            <ul className="howitworks">
              {loc.serviceNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            {!isLead && <p className="sitepage__intro">{loc.intro}</p>}
          </div>
        </div>
      </section>

      {isLead && <BrixtonRoom loc={loc} />}

      <section className="section sitepage__menu" id="menu" aria-labelledby="menu-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Prices at {loc.name}</p>
            <h2 id="menu-title">The {loc.name} menu</h2>
            <p>
              Traditional Cantonese roast meats, chopped to order. Prices differ a little between sites; these are {loc.name}’s.{' '}
              <Link to="/counter">Build a plate</Link> to see what yours comes to.
            </p>
          </div>
          <MenuBoard loc={loc} />
        </div>
      </section>

      {loc.photos.length > 1 && (
        <section className="section sitepage__photos" aria-label={`Photos of ${loc.name}`}>
          <div className="wrap photo-strip">
            {loc.photos.slice(1).map((p) => (
              <figure key={p.src} className="photo" style={{ aspectRatio: String(p.ratio) }}>
                <Picture src={p.src} alt={p.alt} ratio={p.ratio} sizes="(min-width: 900px) 40vw, 90vw" />
              </figure>
            ))}
          </div>
        </section>
      )}

      {quotes.length > 0 && (
        <section className="section sitepage__press" aria-labelledby="press-title">
          <div className="wrap">
            <Rule label={<span id="press-title">What they said</span>} mark="见证" />
            <PressList quotes={quotes} />
          </div>
        </section>
      )}

      {loc.faq && (
        <section className="section sitepage__faq" aria-labelledby="faq-title">
          <div className="wrap faq-wrap">
            <h2 id="faq-title">{loc.name} questions</h2>
            <FaqList items={loc.faq} />
          </div>
        </section>
      )}

      <section className="section sitepage__more" aria-labelledby="more-title">
        <div className="wrap">
          <h2 id="more-title" className="eyebrow">
            The other kitchens
          </h2>
          <OtherSites current={loc} />
          <p className="sitepage__source">
            Delivery: see which kitchens reach you on{' '}
            <a href={group.deliveroo} target="_blank" rel="noreferrer">
              Deliveroo
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}

function BrixtonRoom({ loc }: { loc: Location }) {
  return (
    <section className="section room" aria-labelledby="room-title">
      <div className="wrap room__in">
        <div className="room__text">
          <Rule label="The room" mark="燒味" tone="cream" />
          <h2 id="room-title">Our first sit-down restaurant, in the middle of the market.</h2>
          <p>
            We opened in Brixton Village in {loc.opened}, in the old Tiger and Pig unit: Unit 19 &amp; 20, off the covered arcade and about five minutes’ walk from
            Brixton tube. It was the first Three Uncles you could sit down in, and the first with dishes you couldn’t get at the counters.
          </p>
          <p>
            Inside it’s white tiles and red neon, the ducks and char siu hanging in the window and the kitchen in full view. Outside, there are more tables in the arcade
            itself. On a Saturday night the market is loud; we’re the steady bit in the middle of it.
          </p>
          <ul className="room__facts">
            <li>
              <span>Lunch</span> Expect a queue. It moves.
            </li>
            <li>
              <span>Monday</span> Shorter day: we close at 6:30pm.
            </li>
            <li>
              <span>Fri & Sat</span> Open till 10:30pm.
            </li>
            <li>
              <span>Cold days</span> Arcade tables are outdoors in all but name. Bring a coat.
            </li>
          </ul>
        </div>
        <figure className="room__photo photo">
          <Picture src="img/brixton-arcade" alt="Diners at tables in the Brixton Village arcade outside Three Uncles" ratio={0.804} sizes="(min-width: 900px) 40vw, 100vw" />
        </figure>
      </div>
      <div className="wrap room__specials">
        <figure className="photo">
          <Picture src="img/brixton-dishes" alt="Roast duck and char siu noodle soup, char siu, mushroom mapo tofu and fried wontons" ratio={1.5} sizes="(min-width: 900px) 60vw, 100vw" />
        </figure>
        <div>
          <p className="eyebrow">Brixton specials</p>
          <p className="room__specialtext">
            The Three Treasures Platter for two (duck, char siu and crispy pork on one plate), and the Roast Duck &amp; Char Siu Noodle Soup: lai fun rice noodles in a broth
            made from our roast duck bones. Plus two vegetarian specials, Salt &amp; Pepper Broccoli and Mushroom Mapo Tofu.
          </p>
          <a className="textlink" href="#m-brixton-village-specials">
            See prices
          </a>
        </div>
      </div>
    </section>
  )
}

export function OtherSites({ current }: { current?: Location }) {
  const { statusOf, setSite, now } = useSite()
  return (
    <ul className="others">
      {locations
        .filter((l) => l.slug !== current?.slug)
        .map((l) => (
          <li key={l.slug}>
            <Link to={`/sites/${l.slug}`} onClick={() => setSite(l.slug)}>
              <span className="others__name">{l.name}</span>
              <StatusLine status={statusOf(l)} />
              <span className="others__addr">{l.address[l.address.length - 1]}</span>
              <span className="others__today">Today {spanText(l.hours[now.day])}</span>
            </Link>
          </li>
        ))}
    </ul>
  )
}
