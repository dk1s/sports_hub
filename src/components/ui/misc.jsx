import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar, FaMinus, FaPlus, FaShieldAlt } from 'react-icons/fa'
import { inr, cn } from '../../utils/format'

export function Stars({ rating = 0, size = 'text-sm', className }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-amber-400', className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        if (rating >= i) return <FaStar key={i} className={size} />
        if (rating >= i - 0.5) return <FaStarHalfAlt key={i} className={size} />
        return <FaRegStar key={i} className={`${size} text-ink/20`} />
      })}
    </span>
  )
}

export function StockBadge({ stock }) {
  if (stock <= 0)
    return <span className="chip bg-red-50 text-red-700 ring-1 ring-red-200">Out of stock</span>
  if (stock <= 10)
    return <span className="chip bg-amber-50 text-amber-700 ring-1 ring-amber-200">Only {stock} left</span>
  return <span className="chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">In stock</span>
}

export function DiscountBadge({ mrp, price, className }) {
  const pct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0
  if (!pct) return null
  return (
    <span className={cn('chip bg-accent text-white', className)} title={`Save ${inr(mrp - price)}`}>
      {pct}% OFF
    </span>
  )
}

const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 ring-blue-200',
  Shipped: 'bg-violet-50 text-violet-700 ring-violet-200',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 ring-red-200',
  New: 'bg-amber-50 text-amber-700 ring-amber-200',
  Read: 'bg-slate-100 text-slate-600 ring-slate-200',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Blocked: 'bg-red-50 text-red-700 ring-red-200',
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'In Review': 'bg-blue-50 text-blue-700 ring-blue-200',
  'Approved — Printing': 'bg-violet-50 text-violet-700 ring-violet-200',
}

export function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 ring-slate-200'
  return <span className={cn('chip ring-1', cls)}>{status}</span>
}

export function QtyStepper({ value, onChange, max = 20, small = false }) {
  return (
    <div className={cn('inline-flex items-center rounded-full border border-ink/15 bg-white', small ? 'h-8' : 'h-10')}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-full w-8 items-center justify-center text-ink/60 transition hover:text-accent disabled:opacity-40"
        disabled={value <= 1}
      >
        <FaMinus size={small ? 10 : 12} />
      </button>
      <span className={cn('text-center font-semibold tabular-nums', small ? 'w-7 text-sm' : 'w-9')}>{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-full w-8 items-center justify-center text-ink/60 transition hover:text-accent disabled:opacity-40"
        disabled={value >= max}
      >
        <FaPlus size={small ? 10 : 12} />
      </button>
    </div>
  )
}

export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-brand-900">{title}</h3>
      {subtitle && <p className="mt-1 max-w-sm text-sm text-ink/60">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, sub, action, center = false, dark = false }) {
  return (
    <div className={cn('mb-8 flex flex-wrap items-end justify-between gap-4', center && 'flex-col items-center text-center')}>
      <div className={cn(center && 'flex flex-col items-center')}>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className={cn('section-title', dark && 'text-white')}>{title}</h2>
        {sub && <p className={cn('mt-2 max-w-xl text-[15px]', dark ? 'text-white/70' : 'text-ink/60')}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function Spinner({ className = 'h-8 w-8 text-accent' }) {
  return (
    <div className="flex items-center justify-center py-10">
      <svg className={cn('animate-spin', className)} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-90" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-xl bg-gradient-to-r from-ink/8 via-ink/12 to-ink/8 bg-[length:600px_100%]',
        className,
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export function TrustIcons() {
  const items = [
    { icon: <FaShieldAlt />, label: 'COD Available' },
    { icon: <FaShieldAlt />, label: 'Free ship above ₹999' },
    { icon: <FaShieldAlt />, label: '7-day returns' },
    { icon: <FaShieldAlt />, label: 'Auth. products' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-2 text-sm text-ink/70">
          <FaShieldAlt className="text-brand-600" />
          {it.label}
        </span>
      ))}
    </div>
  )
}