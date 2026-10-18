import type { CSSProperties, ReactNode } from 'react'
import type { Status } from '../lib/hours'

const BASE = import.meta.env.BASE_URL

export const asset = (path: string) => `${BASE}${path}`

/** Their triple-rule section divider, with an optional label, icons and character mark. */
export function Rule({
  label,
  mark,
  icons,
  tone,
  as: Tag = 'div',
}: {
  label?: ReactNode
  mark?: string
  icons?: boolean
  tone?: 'cream' | 'neon'
  as?: 'div' | 'h2' | 'h3'
}) {
  return (
    <Tag className={`rule${tone ? ` rule--${tone}` : ''}`}>
      {label && <span className="rule__label">{label}</span>}
      <span className="rule__lines" aria-hidden />
      {icons && (
        <>
          <span className="rule__icons" aria-hidden>
            <BrandIcon name="duck" size={22} />
            <BrandIcon name="pig" size={22} />
            <BrandIcon name="chicken" size={22} />
          </span>
          <span className="rule__lines" aria-hidden />
        </>
      )}
      {mark && (
        <span className="rule__mark" lang="zh-Hant" aria-hidden>
          {mark}
        </span>
      )}
    </Tag>
  )
}

const ICON_RATIO = { duck: 1.22, pig: 1.46, chicken: 1.26 } as const

export function BrandIcon({ name, size = 28, style }: { name: 'duck' | 'pig' | 'chicken'; size?: number; style?: CSSProperties }) {
  return (
    <span
      className="icon-mask"
      aria-hidden
      style={{
        width: Math.round(size * ICON_RATIO[name]),
        height: size,
        ['--icon' as string]: `url(${asset(`img/icon-${name}.png`)})`,
        ...style,
      }}
    />
  )
}

/** Their lockup, as a mask so it can be cream on cobalt or blue on cream. */
export function Logo({ height = 26, vertical = false, label = 'Three Uncles' }: { height?: number; vertical?: boolean; label?: string }) {
  const ratio = vertical ? 0.5 : 3.27
  return (
    <span
      className="icon-mask logo"
      role="img"
      aria-label={label}
      style={{
        width: Math.round(height * ratio),
        height,
        ['--icon' as string]: `url(${asset(vertical ? 'img/logo-v.png' : 'img/logo-h.png')})`,
      }}
    />
  )
}

export function Picture({
  src,
  alt,
  ratio,
  sizes = '100vw',
  eager = false,
  className,
  style,
}: {
  src: string
  alt: string
  ratio: number
  sizes?: string
  eager?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <img
      className={className}
      style={style}
      src={asset(`${src}-1280.webp`)}
      srcSet={`${asset(`${src}-640.webp`)} 640w, ${asset(`${src}-1280.webp`)} 1280w`}
      sizes={sizes}
      alt={alt}
      width={1280}
      height={Math.round(1280 / ratio)}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

export function StatusLine({ status, long = false, className = '' }: { status: Status; long?: boolean; className?: string }) {
  return (
    <span className={`status status--${status.state} ${className}`}>
      <span className="status__dot" aria-hidden />
      <span>{long ? status.long : status.short}</span>
    </span>
  )
}

type IconName = 'arrow' | 'phone' | 'mail' | 'chevron' | 'external' | 'locate' | 'close' | 'plus' | 'minus' | 'check' | 'down'

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...common}>
          <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A17 17 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
          <path d="M3.5 6.5 12 13l8.5-6.5" />
        </svg>
      )
    case 'chevron':
      return (
        <svg {...common}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      )
    case 'down':
      return (
        <svg {...common}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      )
    case 'external':
      return (
        <svg {...common}>
          <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
      )
    case 'locate':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="6.5" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      )
    case 'close':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      )
    case 'minus':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      )
  }
}

/** Three horizontal lines: their divider doubles as the menu button. */
export function TripleLines({ width = 22 }: { width?: number }) {
  return (
    <svg width={width} height={14} viewBox={`0 0 ${width} 14`} aria-hidden>
      <rect width={width} height={2} y={0} fill="currentColor" />
      <rect width={width} height={2} y={6} fill="currentColor" />
      <rect width={width} height={2} y={12} fill="currentColor" />
    </svg>
  )
}
