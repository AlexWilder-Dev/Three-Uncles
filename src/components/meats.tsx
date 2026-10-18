// Line drawings in the weight of their duck / pig / chicken icons: one stroke colour, round caps.
import type { ReactElement } from 'react'

export type MeatId = 'duck' | 'char-siu' | 'pork-belly' | 'chicken'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const Hook = ({ y = 24 }: { y?: number }) => <path {...stroke} d={`M50 0 V${y - 12} q-7 0 -7 6 q0 6 6 6`} />

export const hanging: Record<MeatId, ReactElement> = {
  // Hung by the neck, wings tucked with the tip sticking out, drumsticks at the bottom.
  duck: (
    <g>
      <Hook y={22} />
      <path
        {...stroke}
        fill="var(--meat-fill, #fff)"
        d="M47 22 C46 31 45 39 45 46 C36 52 29 63 26 80 C22 101 24 122 31 138 C34 146 39 150 45 150 L55 150 C61 150 66 146 69 138 C76 122 78 101 74 80 C71 63 64 52 55 46 C55 39 54 31 53 22 Z"
      />
      <path {...stroke} fill="var(--meat-fill, #fff)" d="M33 72 C27 88 21 103 16 119 C23 117 28 112 31 105 C34 95 37 85 39 76" />
      <path {...stroke} strokeWidth={1.8} opacity={0.5} d="M62 62 C68 76 70 94 68 112" />
      <path {...stroke} d="M41 149 L35 170 M59 149 L65 170" />
      <circle cx="34.5" cy="172" r="2.6" fill="currentColor" />
      <circle cx="65.5" cy="172" r="2.6" fill="currentColor" />
    </g>
  ),
  // Strips on a rack, charred at the edges.
  'char-siu': (
    <g>
      <path {...stroke} d="M50 0 V12" />
      <path {...stroke} d="M18 14 H82" />
      <path {...stroke} d="M30 14 V26 M50 14 V24 M70 14 V26" />
      <path
        {...stroke}
        fill="var(--meat-fill, #fff)"
        d="M23 28 C21 60 22 104 25 150 C26 160 29 166 32 160 C34 154 33 148 36 140 C37 104 38 62 37 28 Q30 24 23 28 Z"
      />
      <path
        {...stroke}
        fill="var(--meat-fill, #fff)"
        d="M43 26 C42 58 43 98 45 136 C46 146 49 150 52 146 C55 140 54 132 56 126 C57 94 57 60 57 26 Q50 22 43 26 Z"
      />
      <path
        {...stroke}
        fill="var(--meat-fill, #fff)"
        d="M63 28 C62 62 63 108 65 156 C66 166 70 170 72 164 C74 156 73 150 76 144 C77 108 78 64 77 28 Q70 24 63 28 Z"
      />
      <path {...stroke} strokeWidth={1.7} d="M25 50 l4 2 M25 84 l4 2 M26 118 l4 2 M45 46 l4 2 M45 80 l4 2 M46 112 l4 2 M65 52 l4 2 M65 90 l4 2 M66 128 l4 2" />
    </g>
  ),
  // A slab on one hook: crackling on top, then fat and meat in layers.
  'pork-belly': (
    <g>
      <path {...stroke} d="M50 0 V20 q-6 0 -6 6 q0 6 6 6" />
      <path
        {...stroke}
        fill="var(--meat-fill, #fff)"
        d="M18 36 Q18 30 24 30 H76 Q82 30 82 36 V138 Q82 146 74 146 H26 Q18 146 18 138 Z"
      />
      <path {...stroke} strokeWidth={2} d="M18 48 L24 44 L30 48 L36 44 L42 48 L48 44 L54 48 L60 44 L66 48 L72 44 L78 48 L82 46" />
      <path {...stroke} strokeWidth={1.6} d="M26 37 h3 M36 38 h3 M46 37 h3 M56 38 h3 M66 37 h3" />
      <path {...stroke} strokeWidth={2} d="M18 74 C32 70 48 78 64 72 C72 70 78 72 82 72" />
      <path {...stroke} strokeWidth={2} d="M18 100 C30 96 46 104 60 98 C70 95 76 98 82 98" />
      <path {...stroke} strokeWidth={2} d="M18 124 C34 120 50 128 66 122 C74 120 78 122 82 122" />
    </g>
  ),
  // Hainan chicken: plump, short neck, the drumsticks hanging free.
  chicken: (
    <g>
      <Hook y={22} />
      <path
        {...stroke}
        fill="var(--meat-fill, #fff)"
        d="M47 22 C46 29 45 35 45 41 C33 46 24 57 22 75 C20 95 26 113 36 121 C42 126 58 126 64 121 C74 113 80 95 78 75 C76 57 67 46 55 41 C55 35 54 29 53 22 Z"
      />
      <path {...stroke} d="M29 66 C25 80 27 92 33 100 C35 90 37 80 39 72" />
      <path {...stroke} fill="var(--meat-fill, #fff)" d="M37 117 C31 127 29 139 31 149 C32 155 38 156 40 151 C42 143 43 131 45 123" />
      <path {...stroke} fill="var(--meat-fill, #fff)" d="M63 117 C69 127 71 139 69 149 C68 155 62 156 60 151 C58 143 57 131 55 123" />
      <path {...stroke} d="M33 155 l-3 7 M38 156 l1 7 M67 155 l3 7 M62 156 l-1 7" />
      <path {...stroke} strokeWidth={1.6} opacity={0.45} d="M40 60 h2 M50 56 h2 M60 62 h2 M36 86 h2 M48 82 h2 M62 88 h2 M44 104 h2 M56 102 h2" />
    </g>
  ),
}

/** Colours of a chopped slice: [skin, flesh, edge]. */
const SLICE: Record<MeatId, [string, string, string]> = {
  duck: ['#7c2f17', '#c98a6c', '#4a1a0b'],
  'char-siu': ['#a7271b', '#e5927f', '#4c110a'],
  'pork-belly': ['#d9a457', '#f6eee2', '#b07a3a'],
  chicken: ['#efd99c', '#fbf3e0', '#cdb27a'],
}

export function Slice({ meat, x, y, r }: { meat: MeatId; x: number; y: number; r: number }) {
  const [skin, flesh, edge] = SLICE[meat]
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x={-17} y={-7} width={34} height={14} rx={3} fill={flesh} stroke={edge} strokeWidth={1.2} />
      <rect x={-17} y={-7} width={34} height={5} rx={2.5} fill={skin} />
      {meat === 'pork-belly' && <rect x={-17} y={2} width={34} height={5} rx={2} fill="#d99a88" />}
      {meat === 'char-siu' && <rect x={-17} y={3} width={34} height={4} rx={2} fill={skin} opacity={0.8} />}
    </g>
  )
}

export function Cleaver() {
  return (
    <svg viewBox="0 0 120 60" width="96" height="48" aria-hidden>
      <path d="M8 6 H82 Q90 6 90 14 V44 Q90 52 82 52 H14 Q8 52 8 46 Z" fill="#e9eef7" stroke="#3058a4" strokeWidth="2.6" />
      <circle cx="78" cy="16" r="4" fill="none" stroke="#3058a4" strokeWidth="2" />
      <path d="M90 22 H114 Q118 22 118 26 V32 Q118 36 114 36 H90" fill="#3058a4" />
    </svg>
  )
}
