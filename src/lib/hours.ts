import { DAYS, DAY_NAMES, type Day, type Location, type Span } from '../data/threeUncles'

export interface LondonNow {
  day: Day
  minutes: number
  /** yyyy-mm-dd in London. */
  date: string
}

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'short',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export function londonNow(at: Date = new Date()): LondonNow {
  const parts = Object.fromEntries(fmt.formatToParts(at).map((p) => [p.type, p.value]))
  const day = (parts.weekday as string).slice(0, 3).toLowerCase() as Day
  return {
    day,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    date: `${parts.year}-${parts.month}-${parts.day}`,
  }
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** 11:45 -> "11:45am", 22:00 -> "10pm". */
export function clock(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, '0')}${suffix}`
}

export const spanText = (s: Span | null) => (s ? `${clock(s.open)} – ${clock(s.close)}` : 'Closed')

export type StatusState = 'open' | 'closing' | 'later' | 'closed'

export interface Status {
  state: StatusState
  isOpen: boolean
  /** Short, for signs and pills: "Open till 10pm". */
  short: string
  /** Longer, for the fascia: "Open now · until 10pm today". */
  long: string
}

const nextDay = (d: Day) => DAYS[(DAYS.indexOf(d) + 1) % 7]

export function status(loc: Location, now: LondonNow): Status {
  const today = loc.hours[now.day]
  if (today) {
    const open = toMinutes(today.open)
    const close = toMinutes(today.close)
    if (now.minutes >= open && now.minutes < close) {
      const left = close - now.minutes
      const lastOrders = loc.lastOrdersMinutes ? close - loc.lastOrdersMinutes : null
      if (lastOrders !== null && now.minutes >= lastOrders) {
        return {
          state: 'closing',
          isOpen: false,
          short: `Last orders gone`,
          long: `Last orders were ${clock(minutesToHHMM(lastOrders))} · closes ${clock(today.close)}`,
        }
      }
      if (left <= 45) {
        const lo = lastOrders !== null ? ` · last orders ${clock(minutesToHHMM(lastOrders))}` : ''
        return {
          state: 'closing',
          isOpen: true,
          short: `Closes ${clock(today.close)}`,
          long: `Open now, closing at ${clock(today.close)}${lo}`,
        }
      }
      return {
        state: 'open',
        isOpen: true,
        short: `Open till ${clock(today.close)}`,
        long: `Open now · until ${clock(today.close)} today`,
      }
    }
    if (now.minutes < open) {
      return {
        state: 'later',
        isOpen: false,
        short: `Opens ${clock(today.open)}`,
        long: `Closed now · opens at ${clock(today.open)} today`,
      }
    }
  }
  // Find the next day with hours.
  let d = nextDay(now.day)
  for (let i = 1; i <= 7; i++) {
    const s = loc.hours[d]
    if (s) {
      const when = i === 1 ? 'tomorrow' : DAY_NAMES[d]
      return {
        state: 'closed',
        isOpen: false,
        short: `Opens ${i === 1 ? 'tmrw' : DAY_NAMES[d].slice(0, 3)} ${clock(s.open)}`,
        long: `Closed now · opens ${when} at ${clock(s.open)}`,
      }
    }
    d = nextDay(d)
  }
  return { state: 'closed', isOpen: false, short: 'Closed', long: 'Closed' }
}

export function minutesToHHMM(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
}

/** Group consecutive days with the same hours: "Tue–Thu 11:45am – 10pm". */
export function groupedHours(loc: Location): { days: string; hours: string; includes: Day[] }[] {
  const out: { days: string; hours: string; includes: Day[] }[] = []
  for (const d of DAYS) {
    const text = spanText(loc.hours[d])
    const last = out[out.length - 1]
    if (last && last.hours === text) {
      last.includes.push(d)
    } else {
      out.push({ days: '', hours: text, includes: [d] })
    }
  }
  for (const g of out) {
    const first = DAY_NAMES[g.includes[0]].slice(0, 3)
    const end = DAY_NAMES[g.includes[g.includes.length - 1]].slice(0, 3)
    g.days = g.includes.length === 7 ? 'Every day' : g.includes.length === 1 ? first : `${first}–${end}`
  }
  return out
}
