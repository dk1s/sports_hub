import React, { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaFilter, FaTimes, FaSortAmountDown, FaArrowRight, FaSearch } from 'react-icons/fa'
import ProductCard from '../components/ui/ProductCard'
import SelectDropdown from '../components/ui/SelectDropdown'
import { ProductCardSkeleton, EmptyState } from '../components/ui/misc'
import { categories, subcategoriesFor } from '../data/products'
import { useGetCatalogQuery } from '../services/apiSlice'
import { inr, cn } from '../utils/format'

const sizesAll = ['S', 'M', 'L', 'XL', 'XXL', 'Short Handle', 'Long Handle']

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹4,000', min: 2000, max: 4000 },
  { label: 'Over ₹4,000', min: 4000, max: Infinity },
]

const sorters = [
  { id: 'popular', label: 'Popularity' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest' },
  { id: 'rating', label: 'Top Rated' },
]

function useQueryParams() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const subcategory = params.get('subcategory') || ''
  const brand = params.get('brand') || ''
  const size = params.get('size') || ''
  const sort = params.get('sort') || 'popular'
  const priceKey = params.get('price') || ''
  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }
  return { q, category, subcategory, brand, size, sort, priceKey, set }
}

const FilterGroup = ({ children }) => (
  <div className="border-b border-ink/8 px-5 py-4 last:border-0">
    {children}
  </div>
)

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

export default function Shop() {
  const { q, category, subcategory, brand, size, sort, priceKey, set } = useQueryParams()
  const { data: catalog = [], isLoading } = useGetCatalogQuery()
  const [mobileFilters, setMobileFilters] = useState(false)
  const [sizesSel, setSizesSel] = useState(size ? [size] : [])
  const [range, setRange] = useState(priceKey ? Number(priceKey) : 1)
  const [cats, setCats] = useState(category ? [category] : [])

  const filtered = useMemo(() => {
    let list = [...catalog]
    if (q) {
      const t = q.toLowerCase()
      list = list.filter((p) =>
        [p.name, p.brand, p.subcategory, p.categoryName, (p.tags || []).join(' ')].join(' ').toLowerCase().includes(t),
      )
    }
    if (cats.length) list = list.filter((p) => cats.includes(p.category))
    if (subcategory) list = list.filter((p) => p.subcategory === subcategory)
    if (brand) list = list.filter((p) => p.brand === brand)
    if (sizesSel.length) list = list.filter((p) => !p.sizes || (p.sizes.some((s) => sizesSel.includes(s))))
    const r = priceRanges[range - 1]
    if (r) list = list.filter((p) => p.price >= r.min && p.price < r.max)
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'newest': list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'popular':
      default: list.sort((a, b) => b.reviews - a.reviews)
    }
    return list
  }, [q, category, subcategory, brand, size, sort, priceKey, sizesSel, range, cats, catalog])

  const loading = isLoading

  const activeCat = categories.find((c) => c.slug === category)
  const activeSubs = subcategoriesFor(category || '')
  const brandList = useMemo(() => [...new Set(catalog.map((p) => p.brand))].sort(), [catalog])

  const clearAll = () => {
    set('q', ''); set('category', ''); set('subcategory', ''); set('brand', ''); set('size', ''); set('price', '')
    setSizesSel([]); setRange(1); setCats([])
  }

  const hasFilters = q || category || subcategory || brand || sizesSel.length || priceKey

  const Filters = (
    <div className="space-y-0">
      <FilterGroup>
        <label className="field-label mb-2 !text-xs uppercase tracking-wider text-ink/50">Search</label>
        <div className="flex items-center gap-2 rounded-xl border border-ink/15 px-3 py-2.5">
          <FaSearch className="text-ink/40" />
          <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search here…" className="w-full bg-transparent text-sm focus:outline-none" />
        </div>
      </FilterGroup>

      <FilterGroup>
        <p className="field-label mb-2.5 !text-xs uppercase tracking-wider text-ink/50">Category</p>
        <div className="space-y-1.5">
          {categories.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={cats.includes(c.slug)}
                onChange={(e) => {
                  const next = e.target.checked ? [...cats, c.slug] : cats.filter((x) => x !== c.slug)
                  setCats(next)
                  set('category', next.length === 1 ? next[0] : '')
                }}
                className="h-4 w-4 rounded accent-accent"
              />
              {c.name}
            </label>
          ))}
        </div>
      </FilterGroup>

      {activeCat && activeSubs.length > 0 && (
        <FilterGroup>
          <p className="field-label mb-2.5 !text-xs uppercase tracking-wider text-ink/50">Sub-category</p>
          <div className="flex flex-wrap gap-1.5">
            {activeSubs.map((s) => (
              <button
                key={s}
                onClick={() => set('subcategory', subcategory === s ? '' : s)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                  subcategory === s
                    ? 'border-brand-700 bg-brand-700 text-white'
                    : 'border-ink/15 text-ink/70 hover:border-brand-500',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup>
        <p className="field-label mb-2.5 !text-xs uppercase tracking-wider text-ink/50">Price</p>
        <div className="space-y-1.5">
          {priceRanges.map((r, i) => (
            <label key={r.label} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/80">
              <input type="radio" name="price" checked={range === i + 1} onChange={() => setRange(i + 1)} className="h-4 w-4 accent-accent" />
              {r.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup>
        <p className="field-label mb-2.5 !text-xs uppercase tracking-wider text-ink/50">Brand</p>
        <div className="space-y-1.5">
          {brandList.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/80">
              <input type="checkbox" checked={brand === b} onChange={(e) => set('brand', e.target.checked ? b : '')} className="h-4 w-4 accent-accent" />
              {b}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup>
        <p className="field-label mb-2.5 !text-xs uppercase tracking-wider text-ink/50">Size</p>
        <div className="flex flex-wrap gap-1.5">
          {sizesAll.map((s) => (
            <button
              key={s}
              onClick={() => setSizesSel((prev) => toggle(prev, s))}
              className={cn(
                'rounded-lg border px-2.5 py-1 text-xs font-semibold transition',
                sizesSel.includes(s) ? 'border-brand-700 bg-brand-700 text-white' : 'border-ink/15 text-ink/70 hover:border-brand-500',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      {hasFilters && (
        <div className="px-5 py-4">
          <button onClick={clearAll} className="text-sm font-semibold text-accent-600 hover:text-accent-700">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )

  const activeFilterChips = [
    q && `“${q}”`,
    ...cats,
    subcategory,
    brand,
    ...sizesSel,
    priceKey && priceRanges[range - 1]?.label,
  ].filter(Boolean)

  const breadcrumb = activeCat ? `${activeCat.name}${subcategory ? ' · ' + subcategory : ''}` : q ? `Search: “${q}”` : 'All Products'

  return (
    <div className="container-x py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink/40">
            <Link to="/" className="hover:text-accent">Home</Link> / <span className="text-ink/70">{breadcrumb}</span>
          </p>
          <h1 className="section-title mt-1">{activeCat?.name || (q ? 'Search Results' : 'Shop All Sports')}</h1>
          <p className="mt-1 text-sm text-ink/50">
            {loading ? 'Loading…' : `${filtered.length} product${filtered.length === 1 ? '' : 's'} found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileFilters(true)} className="btn-outline py-2 text-sm lg:hidden">
            <FaFilter /> Filters {activeFilterChips.length > 0 && `(${activeFilterChips.length})`}
          </button>
          <SelectDropdown
            value={sort}
            onChange={(v) => set('sort', v)}
            options={sorters.map((s) => ({ value: s.id, label: s.label }))}
            leftIcon={<FaSortAmountDown size={12} />}
            variant="light"
            compact
            menuPosition="bottom"
            className="w-44 px-3 py-2 pl-3"
            placeholder="Sort by"
          />
        </div>
      </div>

      {activeFilterChips.length > 0 && !mobileFilters && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {activeFilterChips.map((c) => (
            <span key={c} className="chip bg-brand-50 text-brand-800 ring-1 ring-brand-200">{c}</span>
          ))}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-40 overflow-hidden">{Filters}</div>
        </aside>

        {mobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm" onClick={() => setMobileFilters(false)} />
            <aside className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white shadow-panel animate-fadeUp">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-white px-5 py-4">
                <h3 className="font-display font-bold text-brand-900">Filters</h3>
                <button onClick={() => setMobileFilters(false)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-ink/5">
                  <FaTimes className="text-ink/60" />
                </button>
              </div>
              {Filters}
              <div className="border-t border-ink/10 p-4">
                <button onClick={() => setMobileFilters(false)} className="btn-primary w-full py-2.5 text-sm">
                  Show {filtered.length} results <FaArrowRight size={12} />
                </button>
              </div>
            </aside>
          </div>
        )}

        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<FaTimes size={28} />}
              title="No products match"
              subtitle="Try removing a filter or searching for something else."
              action={<button onClick={clearAll} className="btn-primary text-sm">Clear filters</button>}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}