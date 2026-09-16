import React, { useMemo } from 'react'

const shade = (hex, amt) => {
  const h = hex.replace('#', '')
  const n = parseInt(h, 16)
  const r = Math.min(255, Math.max(0, ((n >> 16) & 255) + amt))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amt))
  const b = Math.min(255, Math.max(0, (n & 255) + amt))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

const iconPath = (kind) => {
  switch (kind) {
    case 'bat':
      return (
        <g transform="translate(300 300)">
          <rect x="-26" y="-190" width="52" height="90" rx="10" fill="rgba(255,255,255,.16)" />
          <rect x="-16" y="-96" width="32" height="70" rx="6" fill="rgba(255,255,255,.22)" />
          <path d="M-16 -26 L-9 6 9 -4 16 8" stroke="rgba(255,255,255,.55)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <rect x="-22" y="-196" width="8" height="18" rx="4" fill="rgba(255,255,255,.7)" />
          <rect x="14" y="-196" width="8" height="18" rx="4" fill="rgba(255,255,255,.7)" />
        </g>
      )
    case 'ball':
      return (
        <g transform="translate(300 300)">
          <circle r="92" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.5)" strokeWidth="4" />
          <path d="M0 -92 C48 -40 48 40 0 92 M0 -92 C-48 -40 -48 40 0 92" stroke="rgba(255,255,255,.62)" strokeWidth="3" fill="none" />
          <ellipse cx="-60" cy="-18" rx="52" ry="20" transform="rotate(-18 -60 -18)" fill="rgba(255,255,255,.22)" />
          <ellipse cx="60" cy="18" rx="52" ry="20" transform="rotate(78 60 18)" fill="rgba(255,255,255,.22)" />
        </g>
      )
    case 'pads':
      return (
        <g transform="translate(300 300)">
          <rect x="-70" y="-130" width="52" height="230" rx="18" fill="rgba(255,255,255,.17)" />
          <rect x="18" y="-130" width="52" height="230" rx="18" fill="rgba(255,255,255,.17)" />
          <rect x="-62" y="-60" width="36" height="120" rx="12" fill="rgba(255,255,255,.3)" />
          <rect x="26" y="-60" width="36" height="120" rx="12" fill="rgba(255,255,255,.3)" />
        </g>
      )
    case 'gloves':
      return (
        <g transform="translate(300 300)">
          <rect x="-70" y="-60" width="56" height="150" rx="16" fill="rgba(255,255,255,.2)" />
          <rect x="14" y="-60" width="56" height="150" rx="16" fill="rgba(255,255,255,.2)" />
          <circle cx="-42" cy="-78" r="14" fill="rgba(255,255,255,.26)" />
          <circle cx="42" cy="-78" r="14" fill="rgba(255,255,255,.26)" />
        </g>
      )
    case 'helmet':
      return (
        <g transform="translate(300 300)">
          <path d="M-96 40 C-96 -56 -30 -118 30 -118 C90 -118 96 -76 96 40 Z" fill="rgba(255,255,255,.16)" />
          <path d="M-92 40 H92 V76 C92 82 38 100 0 100 C-38 100 -92 82 -92 76 Z" fill="rgba(255,255,255,.26)" />
          <path d="M14 -96 H70" stroke="rgba(255,255,255,.5)" strokeWidth="5" strokeLinecap="round" />
          {[-64, -30, 4, 40].map((x) => (
            <rect key={x} x={x} y={-46} width="22" height="72" rx="6" fill="rgba(255,255,255,.32)" />
          ))}
        </g>
      )
    case 'jersey':
      return (
        <g transform="translate(300 300)">
          <path d="M-40 -120 L-78 -96 -66 -22 -26 -52 -26 120 H26 V-52 L66 -22 78 -96 40 -120 -26 -118 Z" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.36)" strokeWidth="4" />
          <circle cx="0" cy="-30" r="34" fill="rgba(255,255,255,.52)" />
          <text x="0" y="-18" fontFamily="System-ui" fontSize="30" fontWeight="800" textAnchor="middle" fill="#101828">07</text>
        </g>
      )
    case 'football':
      return (
        <g transform="translate(300 300)">
          <circle r="92" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.5)" strokeWidth="4" />
          <path d="M0 -40 L38 -12 L24 34 L-24 34 L-38 -12 Z" fill="rgba(255,255,255,.34)" />
          <circle cx="0" cy="-40" r="10" fill="rgba(255,255,255,.7)" />
          <circle cx="38" cy="-12" r="10" fill="rgba(255,255,255,.7)" />
          <circle cx="0" cy="64" r="10" fill="rgba(255,255,255,.7)" />
        </g>
      )
    case 'shuttle':
      return (
        <g transform="translate(300 300)">
          <path d="M0 -110 L-14 -30 0 40 14 -30 Z" fill="rgba(255,255,255,.36)" />
          <circle cx="0" cy="56" r="24" fill="rgba(255,255,255,.5)" />
          {[-1, 1].map((s) => (
            <path key={s} d={`M0 ${s * 40} L${s * 130} 150`} stroke="rgba(255,255,255,.6)" strokeWidth="4" strokeLinecap="round" />
          ))}
        </g>
      )
    case 'guards':
      return (
        <g transform="translate(300 300)">
          <ellipse cx="0" cy="-40" rx="74" ry="96" fill="rgba(255,255,255,.17)" />
          <ellipse cx="0" cy="60" rx="40" ry="52" fill="rgba(255,255,255,.32)" />
        </g>
      )
    default:
      return (
        <g transform="translate(300 300)">
          <circle r="80" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.4)" strokeWidth="4" />
          <path d="M-28 -44 L52 0 -28 44 Z" fill="rgba(255,255,255,.6)" />
        </g>
      )
  }
}

const kindFor = (product) => {
  if (!product) return 'default'
  const s = (product.subcategory || product.category || '').toLowerCase()
  if (s.includes('bat')) return 'bat'
  if (s.includes('ball')) return 'ball'
  if (s.includes('pad')) return 'pads'
  if (s.includes('glove')) return 'gloves'
  if (s.includes('helmet')) return 'helmet'
  if (s.includes('jersey') || s.includes('t-shirt') || s.includes('tee') || s.includes('shirt') || s.includes('lower')) return 'jersey'
  if (s.includes('football')) return 'football'
  if (s.includes('badminton') || s.includes('shuttle')) return 'shuttle'
  if (s.includes('guard')) return 'guards'
  return 'default'
}

export default function ProductImage({ product, variant = 0, className = '' }) {
  const kind = product?.kind || kindFor(product)
  const c1 = product?.gradient?.[0] || '#0E4637'
  const c2 = product?.gradient?.[1] || shade(c1, -48)
  const acc = product?.gradient?.[2] || product?.accent || '#FF6B2C'
  const name = product?.name || 'Sports Hub'

  const uid1 = `g${variant}${c1.replace('#', '')}`
  const uid2 = `glow${variant}`

  const dy = (variant % 3) * -18
  const dx = variant % 2 ? 10 : -10

  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      role="img"
      aria-label={name}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={uid1} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <radialGradient id={uid2} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor={shade(c1, 38)} stopOpacity=".85" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="600" height="600" fill={`url(#${uid1})`} />
      <g stroke="rgba(255,255,255,.06)">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 44} y1="0" x2={i * 44} y2="600" />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 44} x2="600" y2={i * 44} />
        ))}
      </g>
      <circle cx="300" cy="300" r={330} fill={`url(#${uid2})`} />
      <g transform={`rotate(${(variant % 3) * 8 - 8} 270 330)`}>
        <circle cx="270" cy="330" r="230" fill="rgba(0,0,0,.12)" />
      </g>
      <g transform={`translate(${dx} ${dy})`}>{iconPath(kind)}</g>
      <circle cx="512" cy="92" r="118" fill={acc} opacity="0.92" />
      <circle cx="512" cy="92" r="118" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="10" />
      <rect x="70" y="516" width="216" height="44" rx="22" fill="rgba(0,0,0,.24)" />
      <text x="178" y="546" fontFamily="System-ui" fontSize="20" fontWeight="700" textAnchor="middle" fill="#fff">
        {name.length > 28 ? name.slice(0, 26) + '…' : name}
      </text>
    </svg>
  )
}

/* Renders a data-URI image or the placeholder SVG generator */
export function ThumbImage({ src, gradient, kind, name, className = 'h-16 w-16' }) {
  if (src && (src.startsWith('data:') || src.startsWith('http'))) {
    return <img src={src} alt={name || 'item'} className={`${className} object-cover`} />
  }
  if (src && src.startsWith('#')) gradient = src
  return <ProductImage product={{ gradient, kind, name }} className={`${className} shrink-0`} />
}