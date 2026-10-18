import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { method, storyLetter, storySignOff, uncles } from '../data/threeUncles'
import { BrandIcon, Picture, Rule } from '../components/bits'
import { AwardsList, PressList, Timeline } from '../components/Sections'

export function Story() {
  const reduce = useReducedMotion()
  return (
    <div className="page story">
      <section className="story-open">
        <div className="wrap story-open__in">
          <figure className="story-open__photo">
            <Picture src="img/childhood" alt="The three uncles as children in Hong Kong, printed in blue line-screen" ratio={0.662} sizes="(min-width: 900px) 36vw, 90vw" eager />
            <figcaption>The three of us as children.</figcaption>
          </figure>
          <div className="story-open__text">
            <Rule label="Our story" mark="三叔" />
            <h1>Three childhood friends. One roast meat counter. Eight kitchens.</h1>
            <div className="letter">
              {storyLetter.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
              <p className="letter__sign">{storySignOff}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section uncles" aria-labelledby="uncles-title">
        <div className="wrap uncles__in">
          <figure className="photo uncles__photo">
            <Picture src="img/uncles-hoarding" alt="The three uncles outside the St Paul’s site before it opened, with their childhood photo on the hoarding" ratio={0.804} sizes="(min-width: 900px) 40vw, 100vw" />
            <figcaption>Outside St Paul’s before it opened, the childhood photo on the hoarding.</figcaption>
          </figure>
          <div>
            <h2 id="uncles-title">The uncles</h2>
            <ul className="uncles__list">
              {uncles.map((u) => (
                <li key={u.name}>
                  <p className="uncles__nick">{u.nickname}</p>
                  <p className="uncles__name">{u.name}</p>
                  <p>{u.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section method" aria-labelledby="method-title">
        <div className="wrap">
          <div className="section-head">
            <Rule label="The method" mark="烤" icons tone="cream" />
            <h2 id="method-title">Marinate inside, rub outside, hang, dry, roast, rest, chop.</h2>
            <p>The classic Cantonese technique, for every roast. From marinade to chopping board it takes about three days, which is why siu mei is the one thing we specialise in.</p>
          </div>
          <ol className="method__steps">
            {method.map((m, i) => (
              <motion.li
                key={m.step}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <span className="method__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="method__step">{m.step}</span>
                <span className="method__detail">{m.detail}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section asides" aria-label="Two stories from the early days">
        <div className="wrap asides__in">
          <figure className="photo asides__photo">
            <Picture src="img/ls-queue" alt="A queue inside the door at Liverpool Street in 2019" ratio={2.11} sizes="(min-width: 900px) 50vw, 100vw" />
            <figcaption>Liverpool Street, October 2019.</figcaption>
          </figure>
          <div className="asides__text">
            <div>
              <p className="eyebrow">The shop that never opened</p>
              <p>
                Our first shop was meant to be in Holloway. It closed before it started, over food hall licensing. We could have given up; instead we signed a lease just off
                Bishopsgate, and Liverpool Street was an instant hit.
              </p>
            </div>
            <div>
              <p className="eyebrow">The fire alarm</p>
              <p>
                The first few weeks were a disaster, in a good way: queues down the street, and every time the crispy pork went in, the fire alarm went off. One of the team
                more or less lived underneath it until we fixed it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section growth-full" aria-labelledby="time-title">
        <div className="wrap">
          <div className="section-head">
            <Rule label="2019 – 2026" mark="餐馆" />
            <h2 id="time-title">From one counter to eight kitchens</h2>
          </div>
          <Timeline />
        </div>
      </section>

      <section className="section awards-section" id="awards" aria-labelledby="awards-title">
        <div className="wrap awards-section__in">
          <div>
            <Rule label={<span id="awards-title">Awards</span>} icons />
            <AwardsList />
          </div>
          <div>
            <Rule label="Press" mark="见证" />
            <PressList />
          </div>
        </div>
      </section>

      <section className="section story-end">
        <div className="wrap story-end__in">
          <BrandIcon name="duck" size={40} />
          <BrandIcon name="pig" size={40} />
          <BrandIcon name="chicken" size={40} />
          <p>Come and see it chopped.</p>
          <Link className="btn btn--solid" to="/sites">
            Find a Three Uncles
          </Link>
        </div>
      </section>
    </div>
  )
}
