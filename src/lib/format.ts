import type { Location, MenuItem } from '../data/threeUncles'

export const money = (n: number) => `£${n.toFixed(2)}`

/** "£1,200" for whole pounds, "£1,212.50" otherwise. */
export const pounds = (n: number) =>
  `£${n.toLocaleString('en-GB', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`

export function findItem(loc: Location, id: string): MenuItem | undefined {
  for (const section of loc.menu) {
    for (const group of section.groups) {
      const hit = group.items.find((i) => i.id === id)
      if (hit) return hit
    }
  }
  return undefined
}

export function dimSumOf(loc: Location): MenuItem[] {
  return loc.menu.find((s) => s.id === 'dimsum')?.groups.flatMap((g) => g.items) ?? []
}

export const telHref = (tel: string) => `tel:${tel}`

/** Kilometres between two points. */
export function distanceKm(a: [number, number], b: [number, number]) {
  const R = 6371
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(b[0] - a[0])
  const dLon = rad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export const distanceText = (km: number) => (km < 1 ? `${Math.round(km * 1000 / 50) * 50} m` : `${km.toFixed(1)} km`)
