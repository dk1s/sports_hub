import React from 'react'
import { categories } from '../../data/products'

export default function Marquee() {
  const items = categories.flatMap((c) => c.subcategories.map((s) => ({ s, c: c.name })))
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-ink/5 bg-brand-900 py-3">
      <div className="flex w-max animate-marquee items-center gap-8">
        {row.map((it, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-semibold uppercase tracking-widest text-white/60">
            {it.s} <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-white/30">{it.c}</span>
          </span>
        ))}
      </div>
    </div>
  )
}