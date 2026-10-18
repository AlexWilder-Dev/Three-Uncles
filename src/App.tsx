import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ActionBar, Footer, Header, SitePicker } from './components/Chrome'
import { Counter } from './components/Counter'
import { Rule } from './components/bits'
import { SiteProvider } from './lib/site'
import { Catering } from './pages/Catering'
import { Home } from './pages/Home'
import { SitePage } from './pages/SitePage'
import { MenuPage, Sites } from './pages/Sites'
import { Story } from './pages/Story'

const TITLES: Record<string, string> = {
  '/sites': 'Sites',
  '/menu': 'Menu',
  '/counter': 'The glass counter',
  '/catering': 'Catering',
  '/story': 'Story & awards',
}

/** Scroll to top on page change, or to the element named in the hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const t = window.setTimeout(() => {
        const el = document.getElementById(id)
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' })
      }, 120)
      return () => window.clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  useEffect(() => {
    const base = 'Three Uncles · Cantonese roast meat, chopped to order'
    const name = TITLES[pathname]
    document.title = name ? `${name} · Three Uncles` : base
  }, [pathname])
  return null
}

function CounterPage() {
  return (
    <div className="page">
      <section className="section counter-section">
        <div className="wrap">
          <div className="section-head">
            <Rule label="The glass counter" mark="燒味" icons />
            <h1 className="counter-page__title">Build a plate</h1>
          </div>
          <Counter />
        </div>
      </section>
    </div>
  )
}

function Pages() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        id="main"
        tabIndex={-1}
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/sites/:slug" element={<SitePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/counter" element={<CounterPage />} />
          <Route path="/catering" element={<Catering />} />
          <Route path="/story" element={<Story />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <SiteProvider>
        <button
          type="button"
          className="skip"
          onClick={() => {
            const main = document.getElementById('main')
            main?.focus()
            main?.scrollIntoView()
          }}
        >
          Skip to content
        </button>
        <ScrollManager />
        <Header />
        <Pages />
        <Footer />
        <ActionBar />
        <SitePicker />
      </SiteProvider>
    </HashRouter>
  )
}
