export const inr = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0)

export const inrExact = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0)

export const formatDate = (iso, { withTime = false } = {}) => {
  if (!iso) return '—'
  const d = new Date(iso)
  const opts = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }
  return d.toLocaleDateString('en-IN', opts)
}

export const timeAgo = (iso) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} day${d > 1 ? 's' : ''} ago`
  return formatDate(iso)
}

export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

export const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms))

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

export const discountPct = (mrp, price) =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

export const cn = (...args) => args.filter(Boolean).join(' ')