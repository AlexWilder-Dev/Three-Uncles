import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { bermondsey, group, locations } from '../data/threeUncles'
import { spanText } from '../lib/hours'
import { telHref } from '../lib/format'
import { useSite } from '../lib/site'
import { BrandIcon, Icon, Logo, Rule, StatusLine, TripleLines } from './bits'
import { NearestButton, SignRow } from './Signs'

const NAV = [
  { to: '/sites', label: 'Sites', mark: '餐馆' },
  { to: '/menu', label: 'Menu', mark: '烤' },
  { to: '/counter', label: 'Counter', mark: '燒味' },
  { to: '/catering', label: 'Catering', mark: '' },
  { to: '/story', label: 'Story', mark: '三叔' },
]

export function Header() {
  const { site, statusOf, setPickerOpen } = useSite()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <>
      <header className="hdr">
        <div className="hdr__in wrap">
          <Link to="/" className="hdr__logo" aria-label="Three Uncles, home">
            <Logo height={22} />
          </Link>
          <nav className="hdr__nav" aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className="hdr__link">
                {n.label}
              </NavLink>
            ))}
          </nav>
          <button type="button" className="hdr__site" onClick={() => setPickerOpen(true)} aria-haspopup="dialog">
            <StatusLine status={statusOf(site)} className="hdr__dot" />
            <span className="hdr__sitename">{site.name}</span>
            <Icon name="down" size={14} />
          </button>
          <button
            type="button"
            className="hdr__menu"
            aria-expanded={menuOpen}
            aria-controls="nav-sheet"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <Icon name="close" size={22} /> : <TripleLines />}
            <span className="visually-hidden">Menu</span>
          </button>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="nav-sheet"
            className="navsheet"
            aria-label="Main"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="wrap">
              {NAV.map((n, i) => (
                <motion.li key={n.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <NavLink to={n.to} className="navsheet__link">
                    <span>{n.label}</span>
                    <span className="navsheet__lines" aria-hidden />
                    {n.mark ? (
                      <span className="navsheet__mark hk" aria-hidden>
                        {n.mark}
                      </span>
                    ) : (
                      <span className="navsheet__icons" aria-hidden>
                        <BrandIcon name="duck" size={20} />
                        <BrandIcon name="pig" size={20} />
                      </span>
                    )}
                  </NavLink>
                </motion.li>
              ))}
              <li>
                <a className="navsheet__small" href={group.deliveroo} target="_blank" rel="noreferrer">
                  Delivery on Deliveroo <Icon name="external" size={14} />
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

/** The sheet of signs, opened from the header pill or any "change site" link. */
export function SitePicker() {
  const { pickerOpen, setPickerOpen } = useSite()

  useEffect(() => {
    if (!pickerOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPickerOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [pickerOpen, setPickerOpen])

  return (
    <AnimatePresence>
      {pickerOpen && (
        <motion.div className="picker" role="dialog" aria-modal="true" aria-labelledby="picker-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="picker__scrim" aria-label="Close" onClick={() => setPickerOpen(false)} />
          <motion.div
            className="picker__panel"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <div className="picker__head wrap">
              <h2 id="picker-title" className="picker__title">
                Which Three Uncles?
              </h2>
              <button type="button" className="picker__close" onClick={() => setPickerOpen(false)} aria-label="Close">
                <Icon name="close" size={22} />
              </button>
            </div>
            <p className="picker__hint wrap">Lit signs are open now. Your pick sets the menu, prices and directions across the site.</p>
            <SignRow onPicked={() => window.setTimeout(() => setPickerOpen(false), 450)} />
            <div className="wrap">
              <NearestButton onPicked={() => window.setTimeout(() => setPickerOpen(false), 1600)} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Phone-only bar: the three things a hungry person needs, for the chosen site. */
export function ActionBar() {
  const { site } = useSite()
  const { pathname } = useLocation()
  if (pathname.startsWith('/catering')) return null
  return (
    <div className="actionbar" role="navigation" aria-label={`${site.name} quick actions`}>
      <a href={site.mapUrl} target="_blank" rel="noreferrer">
        <Icon name="arrow" size={18} />
        <span>Directions</span>
      </a>
      {site.phone ? (
        <a href={telHref(site.phone.tel)}>
          <Icon name="phone" size={18} />
          <span>Call</span>
        </a>
      ) : (
        <a href={`mailto:${site.email}`}>
          <Icon name="mail" size={18} />
          <span>Email</span>
        </a>
      )}
      <Link to={`/sites/${site.slug}#menu`}>
        <span className="actionbar__mark hk" aria-hidden>
          烤
        </span>
        <span>Menu</span>
      </Link>
    </div>
  )
}

export function Footer() {
  const { now, statusOf, setSite } = useSite()
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__top">
          <Logo height={40} />
          <p className="ftr__line">Cantonese roast meat, chopped to order, at seven London sites.</p>
        </div>
        <Rule tone="cream" icons mark="餐馆" />
        <ul className="ftr__sites">
          {locations.map((l) => (
            <li key={l.slug}>
              <Link to={`/sites/${l.slug}`} onClick={() => setSite(l.slug)}>
                {l.name}
              </Link>
              <StatusLine status={statusOf(l)} />
              <span className="ftr__today">Today {spanText(l.hours[now.day])}</span>
            </li>
          ))}
          <li>
            <a href={bermondsey.url} target="_blank" rel="noreferrer">
              {bermondsey.name}
            </a>
            <span className="ftr__today">Delivery only, on Deliveroo</span>
          </li>
        </ul>
        <div className="ftr__cols">
          <div>
            <p className="eyebrow">Contact</p>
            <a href={`mailto:${group.email}`}>{group.email}</a>
            <a href="mailto:catering@threeuncles.co.uk">catering@threeuncles.co.uk</a>
          </div>
          <div>
            <p className="eyebrow">Follow</p>
            <a href={group.instagram.url} target="_blank" rel="noreferrer">
              Instagram {group.instagram.handle}
            </a>
            <a href={group.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href={group.deliveroo} target="_blank" rel="noreferrer">
              Deliveroo
            </a>
          </div>
        </div>
        <div className="ftr__base">
          <span>© {group.legalName}</span>
          <span>Identity by {group.identityBy}</span>
          <span>Site by AlexWilder-Dev</span>
        </div>
      </div>
    </footer>
  )
}
