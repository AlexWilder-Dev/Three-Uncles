import { Link } from 'react-router-dom'
import { awards, catering, locations, method, press } from '../data/threeUncles'
import { findItem, money, pounds } from '../lib/format'
import { useSite } from '../lib/site'
import { Icon, Picture, Rule } from '../components/bits'
import { Counter } from '../components/Counter'
import { Fascia } from '../components/Fascia'
import { InstagramBand, Newsletter, PressList } from '../components/Sections'
import { NearestButton, SignRow } from '../components/Signs'

export function Home() {
  const { site, statusOf } = useSite()
  const openCount = locations.filter((l) => statusOf(l).isOpen).length
  const picks = site.highlights.map((id) => findItem(site, id)).filter(Boolean)

  return (
    <div className="page home">
      {/* First screen: which site, open or not, what's good. */}
      <div className="first">
        <Fascia loc={site} />
        <section className="window-board" aria-labelledby="good-title">
          <div className="wrap window-board__in">
            <div className="window-board__menu">
              <Rule label={<span id="good-title">What’s good here</span>} mark="烤" />
              <ul className="goods">
                {picks.map((item) => (
                  <li key={item!.name}>
                    <p className="goods__row">
                      <span className="goods__name">
                        {item!.name}
                        {item!.tags?.map((t) => (
                          <span key={t} className={`tag tag--${t}`}>
                            {t}
                          </span>
                        ))}
                      </span>
                      <span className="board__dots" aria-hidden />
                      <span className="price">{money(item!.price)}</span>
                    </p>
                    {item!.detail && <p className="goods__detail">{item!.detail}</p>}
                  </li>
                ))}
              </ul>
              <div className="window-board__links">
                <Link className="btn btn--solid" to={`/sites/${site.slug}#menu`}>
                  Full {site.name} menu
                </Link>
                <a className="textlink" href="#counter">
                  Build a plate
                </a>
              </div>
            </div>
            <figure className="window-board__photo photo">
              <Picture src={site.photos[0].src} alt={site.photos[0].alt} ratio={site.photos[0].ratio} sizes="(min-width: 900px) 40vw, 100vw" eager />
            </figure>
          </div>
        </section>
      </div>

      {/* The street of signs. */}
      <section className="night section" aria-labelledby="signs-title">
        <div className="wrap night__head">
          <p className="eyebrow">Seven sites · {openCount} open now</p>
          <h2 id="signs-title">Which Three Uncles?</h2>
          <p>Lit signs are open right now. Tap one and its menu, prices and directions follow you round the site.</p>
          <NearestButton />
        </div>
        <SignRow />
        <div className="wrap night__foot">
          <Link className="textlink" to="/sites">
            All sites, hours and addresses
          </Link>
        </div>
      </section>

      {/* The glass counter. */}
      <section className="section counter-section" id="counter" aria-labelledby="counter-title">
        <div className="wrap">
          <div className="section-head">
            <Rule label="The glass counter" mark="燒味" icons />
            <h2 id="counter-title">Build a plate</h2>
          </div>
          <Counter />
        </div>
      </section>

      {/* Siu mei, and the three who brought it out of Chinatown. */}
      <section className="section story-teaser" aria-labelledby="story-title">
        <div className="wrap story-teaser__in">
          <figure className="story-teaser__photo">
            <Picture src="img/childhood" alt="The three uncles as childhood friends in Hong Kong" ratio={0.662} sizes="(min-width: 900px) 34vw, 80vw" />
          </figure>
          <div>
            <Rule label="Siu mei" mark="三叔" />
            <h2 id="story-title" className="big-statement">
              Three friends from Hong Kong, bringing everyday roast meat out of Chinatown.
            </h2>
            <p>
              Uncle Lim, Uncle Sidney and Uncle Mo grew up watching the chefs chop roast duck and char siu in the cafés near Wan Chai market. In 2019 they opened a tiny counter near Liverpool Street. The method is the classic Cantonese one:
            </p>
            <ol className="method-inline">
              {method.map((m) => (
                <li key={m.step}>{m.step}</li>
              ))}
            </ol>
            <Link className="textlink" to="/story">
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* One group: growth and recognition. */}
      <section className="section growth" aria-labelledby="growth-title">
        <div className="wrap">
          <div className="growth__numbers">
            <p>
              <span className="growth__big">2019</span>
              <span>one roast meat counter near Liverpool Street</span>
            </p>
            <span className="growth__arrow" aria-hidden>
              <Icon name="arrow" size={28} />
            </span>
            <p>
              <span className="growth__big">7</span>
              <span>sites to walk into across London, plus a delivery kitchen in Bermondsey</span>
            </p>
          </div>
          <h2 id="growth-title" className="visually-hidden">
            Awards and press
          </h2>
          <ul className="growth__awards">
            {awards.slice(0, 4).map((a) => (
              <li key={a.text}>
                <span className="awards__label">{a.label}</span>
                {a.text}
              </li>
            ))}
          </ul>
          <PressList quotes={press.slice(0, 4)} compact />
          <Link className="textlink" to="/story#awards">
            Every award and review
          </Link>
        </div>
      </section>

      {/* Catering. */}
      <section className="section cater-teaser" aria-labelledby="cater-title">
        <div className="wrap cater-teaser__in">
          <div>
            <Rule label="Office & event catering" icons tone="cream" />
            <h2 id="cater-title">Roast meat platters for the whole office.</h2>
            <p>
              {pounds(catering.packages[0].perHead)} or {pounds(catering.packages[1].perHead)} a head, with dim sum, rice and lo mein. Collection from {pounds(catering.rules.collectionMin)}, free
              delivery from {pounds(catering.rules.deliveryMin)}. Clients include {catering.clients.join(', ')}.
            </p>
            <Link className="btn btn--cream" to="/catering">
              Price it up <Icon name="arrow" size={18} />
            </Link>
          </div>
          <figure className="photo cater-teaser__photo">
            <Picture src="img/catering-platter" alt="Roast duck, crispy pork belly and char siu on blue-and-white platters" ratio={0.8} sizes="(min-width: 900px) 34vw, 90vw" />
          </figure>
        </div>
      </section>

      <section className="section follow" aria-label="Newsletter and Instagram">
        <div className="wrap follow__in">
          <Newsletter />
          <InstagramBand />
        </div>
      </section>
    </div>
  )
}
