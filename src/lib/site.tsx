import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { leadSlug, locations, type Location } from '../data/threeUncles'
import { londonNow, status, type LondonNow, type Status } from './hours'

const KEY = 'three-uncles:site'

interface SiteState {
  site: Location
  setSite: (slug: string) => void
  /** True once the visitor has picked a site (or we found the nearest). */
  chosen: boolean
  now: LondonNow
  statusOf: (loc: Location) => Status
  pickerOpen: boolean
  setPickerOpen: (open: boolean) => void
}

const Ctx = createContext<SiteState | null>(null)

function readStored(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string>(() => {
    const stored = readStored()
    return stored && locations.some((l) => l.slug === stored) ? stored : leadSlug
  })
  const [chosen, setChosen] = useState(() => readStored() !== null)
  const [now, setNow] = useState(() => londonNow())
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(londonNow()), 30_000)
    return () => clearInterval(t)
  }, [])

  const setSite = useCallback((next: string) => {
    if (!locations.some((l) => l.slug === next)) return
    setSlug(next)
    setChosen(true)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* private mode: the choice lasts for this visit */
    }
  }, [])

  const value = useMemo<SiteState>(
    () => ({
      site: locations.find((l) => l.slug === slug)!,
      setSite,
      chosen,
      now,
      statusOf: (loc) => status(loc, now),
      pickerOpen,
      setPickerOpen,
    }),
    [slug, setSite, chosen, now, pickerOpen],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSite() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useSite outside SiteProvider')
  return v
}

export const findLocation = (slug: string | undefined) => locations.find((l) => l.slug === slug)
