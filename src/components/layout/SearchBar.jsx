import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { searchProducts } from '../../data/products'
import ProductImage from '../ui/ProductImage'
import { inr } from '../../utils/format'

export default function SearchBar({ autoFocus = false, onDone }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const nav = useNavigate()
  const boxRef = useRef(null)
  const results = q.trim() ? searchProducts(q).slice(0, 6) : []

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const go = (to) => {
    setOpen(false)
    setQ('')
    nav(to)
    onDone?.()
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      if (active >= 0 && results[active]) return go(`/product/${results[active].slug}`)
      return go(`/shop?q=${encodeURIComponent(q)}`)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, -1))
    }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-white px-4 py-2.5 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
        <FaSearch className="shrink-0 text-ink/40" />
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search bats, balls, jerseys, kit…"
          className="w-full bg-transparent text-sm text-ink placeholder-ink/40 focus:outline-none"
          aria-label="Search products"
        />
        {q && (
          <button onClick={() => setQ('')} className="text-xs font-semibold text-ink/40 hover:text-ink">
            Clear
          </button>
        )}
      </div>

      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-panel">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink/50">
              No matches for “{q}”. Try “bat”, “jersey” or “ball”.
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-ink/5 overflow-auto py-1">
              {results.map((p, i) => (
                <li key={p.id}>
                  <button
                    onClick={() => go(`/product/${p.slug}`)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                      active === i ? 'bg-brand-50' : 'hover:bg-brand-50/60'
                    }`}
                  >
                    <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg">
                      <ProductImage product={p} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-ink/50">
                        {p.brand} · {p.subcategory}
                      </p>
                    </div>
                    <span className="shrink-0 font-display text-sm font-bold text-brand-700">{inr(p.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => go(`/shop?q=${encodeURIComponent(q)}`)}
            className="block w-full border-t border-ink/5 bg-brand-50/50 px-4 py-3 text-center text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            See all results for “{q}”
          </button>
        </div>
      )}
    </div>
  )
}