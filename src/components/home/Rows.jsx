import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaFire, FaTshirt, FaStar, FaCheck } from 'react-icons/fa'
import ProductCard from '../ui/ProductCard'
import { SectionHeading, ProductCardSkeleton } from '../ui/misc'
import { useSettingsStore } from '../../context/AppContext'
import { useGetCatalogQuery } from '../../services/apiSlice'

export function Bestsellers() {
  const { data: catalog = [], isLoading } = useGetCatalogQuery()
  const items = catalog.filter((p) => p.bestseller || p.badge === 'Bestseller').slice(0, 4)
  return (
    <section className="bg-white py-16 lg:py-20 border-y border-ink/5">
      <div className="container-x">
        <SectionHeading
          eyebrow="Bestsellers"
          title="Most-loved this season"
          sub="The gear everyone in Purnea is buying right now."
          action={
            <Link to="/shop?sort=popular" className="btn-outline text-sm">
              View all <FaArrowRight size={12} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : items.map((p) => <ProductCard key={p.id} product={p} compact />)}
        </div>
      </div>
    </section>
  )
}

export function CustomCta() {
  const { settings } = useSettingsStore()
  return (
    <section className="container-x py-16 lg:py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-950 text-white">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:p-16">
          <div>
            <p className="eyebrow mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 ring-1 ring-white/10">
              <FaFire className="text-accent" /> Custom T-Shirt & Jersey Studio
            </p>
            <h2 className="text-balance font-display text-4xl font-bold leading-tight sm:text-5xl">
              Your team. Your colours. <br />
              <span className="bg-gradient-to-r from-accent to-amber-300 bg-clip-text text-transparent">Your name on the back.</span>
            </h2>
            <p className="mt-4 max-w-lg text-white/70">
              Upload your logo, pick colours and fabric, add numbers — our designer canvas previews it live.
              Prefer to keep it easy? Tell us what you need in a simple form and we&apos;ll handle the design.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
              {['Logo on chest', 'Name & number on back', '11 fabric + colour options', '5–7 day turnaround'].map((t) => (
                <li key={t} className="flex items-center gap-2"><FaCheck className="text-volt" /> {t}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/customize" className="btn-primary"><FaTshirt /> Open the Designer</Link>
              <Link to="/customize?tab=form" className="btn-light">Simple Requirement Form</Link>
            </div>
            <p className="mt-4 text-xs text-white/40">Bulk team orders · School & club discounts offered in store.</p>
          </div>
          {/* mini jersey preview */}
          <div className="relative mx-auto w-full max-w-xs">
            <div className="absolute -inset-4 rounded-3xl bg-white/5 blur" />
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/50">
                <span>Front</span>
                <span>{settings?.phone?.replace('+91 ', '')}</span>
              </div>
              <svg viewBox="0 0 200 220" className="mx-auto mt-2 w-40">
                <path d="M40 20 L12 44 24 96 62 74 62 200 H138 V74 L176 96 188 44 160 20 110 36 Z" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="3" />
                <path d="M40 20 L12 44 24 96 62 74Z" fill="rgba(255,255,255,.12)" />
                <path d="M160 20 L188 44 176 96 138 74Z" fill="rgba(255,255,255,.12)" />
                <rect x="96" y="64" width="28" height="28" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2" />
                <text x="100" y="88" fontFamily="System-ui" fontSize="16" fontWeight="800" textAnchor="middle" fill="#fff">07</text>
                <text x="100" y="140" fontFamily="System-ui" fontSize="14" fontWeight="700" textAnchor="middle" fill="#fff">PURNEA</text>
                <text x="100" y="158" fontFamily="System-ui" fontSize="8" textAnchor="middle" fill="rgba(255,255,255,.6)">PANTHERS</text>
              </svg>
              <p className="mt-3 text-center text-xs text-white/50">Live preview from the canvas designer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  const items = [
    { initials: 'AS', color: '#1E805F', name: 'Amit Singh', role: 'Captain, Purnea Panthers', quote: 'Played our entire district league in jerseys designed on this site. The print quality stunned everyone — rival teams asked us for the contact.' },
    { initials: 'RK', color: '#FF6B2C', name: 'Rohit Kumar', role: 'Father of a junior cricketer', quote: 'Ordered a junior kit + pads for my son. Next-day delivery in Purnea, COD made it stress-free. Genuine products at honest prices.' },
    { initials: 'PV', color: '#101828', name: 'Priya Verma', role: 'Badminton academy coach', quote: 'Bought shuttles, rackets and nets in bulk for our academy. The admin helped me pick the right grip. Best sports shop in the region, hands down.' },
  ]
  return (
    <section className="bg-white py-16 lg:py-20 border-y border-ink/5">
      <div className="container-x">
        <SectionHeading
          eyebrow="Testimonials"
          title="Purnea plays with us"
          sub="From gully cricket to district tournaments — here’s what locals say."
          center
        />
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="card flex h-full flex-col p-6">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} size={14} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/80">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-bold text-white" style={{ background: t.color }}>
                  {t.initials}
                </span>
                <div>
                  <p className="font-semibold text-brand-900">{t.name}</p>
                  <p className="text-xs text-ink/50">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}