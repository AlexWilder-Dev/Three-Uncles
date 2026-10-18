import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { catering, group, locations } from '../data/threeUncles'
import { money, pounds } from '../lib/format'
import { londonNow } from '../lib/hours'
import { BrandIcon, Icon, Picture, Rule } from '../components/bits'
import { FaqList } from '../components/Sections'

type PackageId = (typeof catering.packages)[number]['id']
type Route = 'deliveroo' | 'collection' | 'delivery'

const { rules } = catering

function routeFor(total: number): Route {
  if (total >= rules.deliveryMin) return 'delivery'
  if (total >= rules.collectionMin) return 'collection'
  return 'deliveroo'
}

function earliestDate(hours: number) {
  const today = londonNow().date
  const d = new Date(`${today}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + Math.ceil(hours / 24))
  return d
}

const longDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const isoDate = (d: Date) => d.toISOString().slice(0, 10)

export function Catering() {
  const [pkgId, setPkgId] = useState<PackageId>('platter-16')
  const [people, setPeople] = useState(30)
  const [extras, setExtras] = useState<Record<string, number>>({})
  const [dimSum, setDimSum] = useState<string[]>([])
  const formRef = useRef<HTMLDivElement>(null)

  const pkg = catering.packages.find((p) => p.id === pkgId)!
  const extrasTotal = catering.byWeight.reduce((n, x) => n + (extras[x.id] ?? 0) * x.price, 0)
  const total = pkg.perHead * people + extrasTotal
  const route = routeFor(total)
  const notice = total < rules.largeOrder ? rules.noticeSmall : rules.noticeLarge
  const earliest = earliestDate(route === 'deliveroo' ? rules.deliverooNoticeHours : notice)

  const pickDimSum = (d: string) =>
    setDimSum((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : cur.length >= pkg.dimSumChoices ? [...cur.slice(1), d] : [...cur, d]))

  const bump = (id: string, by: number) =>
    setExtras((e) => {
      const n = Math.max(0, Math.min(20, (e[id] ?? 0) + by))
      const next = { ...e, [id]: n }
      if (!n) delete next[id]
      return next
    })

  const peopleToDelivery = Math.max(0, Math.ceil((rules.deliveryMin - extrasTotal) / pkg.perHead) - people)

  return (
    <div className="page catering">
      <section className="cater-hero">
        <div className="wrap cater-hero__in">
          <div>
            <Rule label="Office & event catering" icons tone="cream" />
            <h1>Roast meat platters for London offices and parties.</h1>
            <p>{catering.intro}</p>
            <p className="cater-hero__clients">
              Clients include <strong>{catering.clients.join(', ')}</strong>
            </p>
          </div>
          <figure className="photo cater-hero__photo">
            <Picture src="img/catering-platter" alt="Roast duck, crispy pork belly and char siu on blue-and-white platters on a red cloth" ratio={0.8} sizes="(min-width: 900px) 36vw, 100vw" eager />
          </figure>
        </div>
      </section>

      <section className="section" aria-labelledby="calc-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Price it up</p>
            <h2 id="calc-title">How many are you feeding?</h2>
            <p>Pick a platter and a headcount. You’ll see the estimate, whether it’s collection or delivery, and how much notice the kitchen needs.</p>
          </div>

          <div className="calc">
            <div className="calc__inputs">
              <fieldset className="calc__packages">
                <legend className="calc__legend">Platter</legend>
                {catering.packages.map((p) => (
                  <label key={p.id} className={`pkg${p.id === pkgId ? ' is-on' : ''}`}>
                    <input type="radio" name="pkg" value={p.id} checked={p.id === pkgId} onChange={() => setPkgId(p.id)} />
                    <span className="pkg__price">
                      {pounds(p.perHead)}
                      <small>a head</small>
                    </span>
                    <span className="pkg__name">{p.name}</span>
                    <span className="pkg__inc">{p.includes[0]}</span>
                  </label>
                ))}
              </fieldset>

              <div className="calc__people">
                <label htmlFor="people" className="calc__legend">
                  People
                </label>
                <div className="people">
                  <button type="button" onClick={() => setPeople((n) => Math.max(1, n - 5))} aria-label="Five fewer people">
                    <Icon name="minus" />
                  </button>
                  <input
                    id="people"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={1000}
                    value={people}
                    onChange={(e) => setPeople(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
                  />
                  <button type="button" onClick={() => setPeople((n) => Math.min(1000, n + 5))} aria-label="Five more people">
                    <Icon name="plus" />
                  </button>
                </div>
                <input
                  className="people__range"
                  type="range"
                  min={5}
                  max={200}
                  step={1}
                  value={Math.min(200, people)}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  aria-label="People"
                />
              </div>

              <details className="calc__extras">
                <summary>
                  Add whole ducks or meat by weight <Icon name="plus" size={16} />
                </summary>
                <ul>
                  {catering.byWeight.map((x) => (
                    <li key={x.id}>
                      <span>{x.name}</span>
                      <span className="price">{money(x.price)}</span>
                      <span className="stepper">
                        <button type="button" onClick={() => bump(x.id, -1)} disabled={!extras[x.id]} aria-label={`One less ${x.name}`}>
                          <Icon name="minus" size={14} />
                        </button>
                        <span>{extras[x.id] ?? 0}</span>
                        <button type="button" onClick={() => bump(x.id, 1)} aria-label={`One more ${x.name}`}>
                          <Icon name="plus" size={14} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            <div className="calc__result" aria-live="polite">
              <p className="eyebrow">Estimate</p>
              <p className="calc__total price">{pounds(total)}</p>
              <p className="calc__sum">
                {people} × {pounds(pkg.perHead)}
                {extrasTotal > 0 && ` + ${money(extrasTotal)} by weight`}
              </p>
              <Rule tone="cream" />
              <div className={`route route--${route}`}>
                <p className="route__title">
                  {route === 'delivery' && 'Free delivery to your office or venue'}
                  {route === 'collection' && 'Collection from any branch'}
                  {route === 'deliveroo' && 'Under £300: order on Deliveroo'}
                </p>
                <p>
                  {route === 'delivery' && `Orders of ${pounds(rules.deliveryMin)} or more (about ${rules.deliveryHeadcount} people) are delivered free, anywhere in London.`}
                  {route === 'collection' &&
                    `Orders from ${pounds(rules.collectionMin)} to ${pounds(rules.deliveryMin)} are collected from the branch you choose. ${
                      peopleToDelivery > 0 ? `${peopleToDelivery} more people at this platter would get free delivery.` : ''
                    }`}
                  {route === 'deliveroo' && `For smaller orders, place an advance order on Deliveroo with at least ${rules.deliverooNoticeHours} hours’ notice.`}
                </p>
              </div>
              <div className="notice">
                <p className="route__title">{route === 'deliveroo' ? `${rules.deliverooNoticeHours} hours’ notice` : `Ideally ${notice} hours’ notice`}</p>
                <p>Earliest date: {longDate(earliest)}.</p>
              </div>
              {route === 'deliveroo' ? (
                <a className="btn btn--cream" href={group.deliveroo} target="_blank" rel="noreferrer">
                  Order on Deliveroo <Icon name="external" size={16} />
                </a>
              ) : (
                <button type="button" className="btn btn--cream" onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  Send this as an enquiry <Icon name="arrow" size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="pkgdetail">
            <div>
              <p className="eyebrow">Every platter</p>
              <ul className="pkgdetail__list">
                {pkg.meats.map((m) => (
                  <li key={m}>{m}</li>
                ))}
                {pkg.includes.slice(1).map((m) => (
                  <li key={m}>{m}</li>
                ))}
                <li>{pkg.veg}</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">
                Choose {pkg.dimSumChoices} dim sum <span className="pkgdetail__count">{dimSum.length}/{pkg.dimSumChoices}</span>
              </p>
              <ul className="chips">
                {catering.dimSum.map((d) => (
                  <li key={d}>
                    <button type="button" className={`chip${dimSum.includes(d) ? ' is-on' : ''}`} aria-pressed={dimSum.includes(d)} onClick={() => pickDimSum(d)}>
                      {d}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Or individual boxes</p>
              <p>{catering.boxes}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section byweight" aria-labelledby="weight-title">
        <div className="wrap">
          <Rule label={<span id="weight-title">Whole ducks &amp; meat by weight</span>} mark="燒味" />
          <ul className="weights">
            {catering.byWeight.map((x) => (
              <li key={x.id}>
                <span>{x.name}</span>
                <span className="board__dots" aria-hidden />
                <span className="price">{money(x.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div ref={formRef} className="enquiry-anchor">
        <Enquiry pkgLabel={`${pkg.name}, ${pounds(pkg.perHead)} a head`} people={people} total={total} route={route} dimSum={dimSum} earliest={earliest} extras={extras} />
      </div>

      <section className="section" aria-labelledby="cfaq-title">
        <div className="wrap faq-wrap">
          <h2 id="cfaq-title">Catering questions</h2>
          <FaqList items={catering.faq} />
        </div>
      </section>
    </div>
  )
}

function Enquiry({
  pkgLabel,
  people,
  total,
  route,
  dimSum,
  earliest,
  extras,
}: {
  pkgLabel: string
  people: number
  total: number
  route: Route
  dimSum: string[]
  earliest: Date
  extras: Record<string, number>
}) {
  const [sent, setSent] = useState<null | { name: string; email: string; date: string }>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [how, setHow] = useState<'delivery' | 'collection'>(route === 'delivery' ? 'delivery' : 'collection')
  useEffect(() => setHow(route === 'delivery' ? 'delivery' : 'collection'), [route])
  const extrasText = useMemo(
    () =>
      catering.byWeight
        .filter((x) => extras[x.id])
        .map((x) => `${extras[x.id]} × ${x.name}`)
        .join(', '),
    [extras],
  )

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const errs: Record<string, string> = {}
    const name = String(f.get('name') ?? '').trim()
    const email = String(f.get('email') ?? '').trim()
    const date = String(f.get('date') ?? '')
    if (!name) errs.name = 'Who should we reply to?'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'We need an email to send the quote to.'
    if (!date) errs.date = 'Pick a date.'
    if (how === 'delivery' && !String(f.get('postcode') ?? '').trim()) errs.postcode = 'Where are we delivering to?'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSent({ name, email, date })
  }

  return (
    <section className="section enquiry" aria-labelledby="enq-title">
      <div className="wrap enquiry__in">
        <div className="enquiry__side">
          <Rule label="Enquiry" tone="cream" icons />
          <h2 id="enq-title">Send it straight to the catering team.</h2>
          <p>{catering.replyPromise} London only. Pay by invoice or payment link.</p>
          <dl className="enquiry__summary">
            <div>
              <dt>Platter</dt>
              <dd>{pkgLabel}</dd>
            </div>
            <div>
              <dt>People</dt>
              <dd>{people}</dd>
            </div>
            {dimSum.length > 0 && (
              <div>
                <dt>Dim sum</dt>
                <dd>{dimSum.join(', ')}</dd>
              </div>
            )}
            {extrasText && (
              <div>
                <dt>By weight</dt>
                <dd>{extrasText}</dd>
              </div>
            )}
            <div>
              <dt>Estimate</dt>
              <dd className="price">{pounds(total)}</dd>
            </div>
          </dl>
          <p className="enquiry__mail">
            Urgent? <a href={`mailto:${catering.email}`}>{catering.email}</a>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="done" className="enquiry__done" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <BrandIcon name="duck" size={44} />
              <p className="enquiry__big">Thanks, {sent.name.split(' ')[0]}.</p>
              <p>
                Your enquiry for {people} people on {new Date(sent.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} is with the
                catering team. Expect a quote at {sent.email} within 24 hours.
              </p>
              <p className="demo-note">Demo: this form doesn’t send anything yet. Live, it would land in {catering.email} with everything above attached.</p>
              <button type="button" className="textlink" onClick={() => setSent(null)}>
                Start another
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" className="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="form__row">
                <Field label="Your name" name="name" autoComplete="name" error={errors.name} />
                <Field label="Company (optional)" name="company" autoComplete="organization" />
              </div>
              <div className="form__row">
                <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
                <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
              </div>
              <div className="form__row">
                <Field label="Date" name="date" type="date" min={isoDate(earliest)} error={errors.date} hint={`Earliest with ideal notice: ${longDate(earliest)}`} />
                <Field label="Time" name="time" type="time" />
              </div>
              <fieldset className="form__how">
                <legend>Delivery or collection</legend>
                <label className={how === 'delivery' ? 'is-on' : ''}>
                  <input type="radio" name="how" checked={how === 'delivery'} onChange={() => setHow('delivery')} disabled={route !== 'delivery'} />
                  Delivery {route !== 'delivery' && <small>from {pounds(rules.deliveryMin)}</small>}
                </label>
                <label className={how === 'collection' ? 'is-on' : ''}>
                  <input type="radio" name="how" checked={how === 'collection'} onChange={() => setHow('collection')} />
                  Collection
                </label>
              </fieldset>
              {how === 'delivery' ? (
                <Field label="Delivery postcode" name="postcode" autoComplete="postal-code" error={errors.postcode} />
              ) : (
                <label className="field">
                  <span className="field__label">Collect from</span>
                  <select name="branch" defaultValue={locations[1].slug}>
                    {locations.map((l) => (
                      <option key={l.slug} value={l.slug}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="field">
                <span className="field__label">Anything else? Vegetarians, allergies, plates, timings</span>
                <textarea name="notes" rows={4} />
              </label>
              <button type="submit" className="btn btn--neon">
                Send enquiry <Icon name="arrow" size={18} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  type = 'text',
  error,
  hint,
  ...rest
}: {
  label: string
  name: string
  type?: string
  error?: string
  hint?: string
  autoComplete?: string
  min?: string
}) {
  const id = `f-${name}`
  return (
    <label className={`field${error ? ' has-error' : ''}`} htmlFor={id}>
      <span className="field__label">{label}</span>
      <input id={id} name={name} type={type} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} {...rest} />
      {hint && !error && (
        <span className="field__hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="form-error" id={`${id}-err`}>
          {error}
        </span>
      )}
    </label>
  )
}
