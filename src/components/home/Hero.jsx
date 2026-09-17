import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaTshirt, FaBolt, FaShieldAlt, FaStar } from 'react-icons/fa'
import ProductImage from '../ui/ProductImage'
import { Stars, StockBadge } from '../ui/misc'
import { inr } from '../../utils/format'
import { useCart, useSettingsStore, useAuth } from '../../context/AppContext'
import { useGetCatalogQuery } from '../../services/apiSlice'

function ShowcaseCard() {
  const { add } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: catalog = [] } = useGetCatalogQuery()
  const product = catalog.find((p) => p.featured) || catalog[0] || null
  if (!product) return null
  const onAdd = () => {
    if (!user) {
      const next = `/product/${product.slug}?intent=addToCart&intentQty=1`
      return navigate('/login?next=' + encodeURIComponent(next))
    }
    add(product.id)
  }
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-accent/20 blur-3xl" />
      <div className="card relative overflow-hidden p-3">
        <div className="relative overflow-hidden rounded-2xl">
          <ProductImage product={product} className="aspect-[4/4.4] w-full" />
          <span className="chip absolute left-3 top-3 bg-accent text-white">Featured</span>
          <span className="chip absolute right-3 top-3 bg-brand-900/90 text-white">{product.brand}</span>
        </div>
        <div className="px-2 pb-2 pt-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="line-clamp-1 font-display text-base font-bold text-brand-900">{product.name}</h3>
            <span className="flex items-center gap-1 text-amber-500">
              <FaStar /> <span className="text-xs font-bold text-ink">{product.rating}</span>
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="font-display text-xl font-bold text-brand-900">{inr(product.price)}</span>
              <span className="ml-2 text-sm text-ink/40 line-through">{inr(product.mrp)}</span>
            </div>
            <button onClick={onAdd} className="btn-primary px-4 py-2 text-xs">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {/* floating chips */}
      <div className="animate-float absolute -left-6 top-10 hidden rounded-2xl border border-ink/5 bg-white px-4 py-3 shadow-lift sm:block">
        <p className="flex items-center gap-2 text-xs font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700"><FaTshirt /></span>
          Custom Jersey ready in 5–7 days
        </p>
      </div>
      <div className="animate-float absolute -bottom-5 -right-4 hidden rounded-2xl border border-ink/5 bg-white px-4 py-3 shadow-lift sm:block" style={{ animationDelay: '.8s' }}>
        <p className="flex items-center gap-2 text-xs font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><FaShieldAlt /></span>
          Cash on Delivery available
        </p>
      </div>
    </div>
  )
}

export default function Hero() {
  const { settings } = useSettingsStore()
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-20">
        <div>
          <p className="eyebrow mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 ring-1 ring-white/10">
            <FaBolt className="text-accent" /> Purnea&apos;s no.1 sports store — {settings?.phone}
          </p>
          <h1 className="text-balance font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Gear Up.
            <br />
            Play Hard.
            <br />
            <span className="bg-gradient-to-r from-accent to-amber-300 bg-clip-text text-transparent">Win Big.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/70">
            Bats, balls, pads — and team jerseys printed exactly how you imagine them. Trusted by clubs
            and academies across Purnea. Walk in or order online, <b className="text-white">COD supported</b>.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/shop" className="btn-primary">
              Shop the Range <FaArrowRight />
            </Link>
            <Link to="/customize" className="btn-light">
              <FaTshirt /> Design a Jersey
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
            <span className="inline-flex items-center gap-2"><FaShieldAlt className="text-emerald-400" /> 100% genuine products</span>
            <span className="inline-flex items-center gap-2"><FaBolt className="text-accent" /> Free delivery over ₹999</span>
            <span className="inline-flex items-center gap-2"><FaStar className="text-amber-400" /> 4.8/5 from 1,200+ orders</span>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <ShowcaseCard />
        </div>
      </div>
    </section>
  )
}