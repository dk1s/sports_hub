import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import ProductImage from '../ui/ProductImage'

const statItems = [
  { value: '500+', label: 'Products in store' },
  { value: '1,200+', label: 'Happy customers' },
  { value: '5–7 days', label: 'Custom jersey turnaround' },
  { value: '100%', label: 'Cash on Delivery' },
]

export default function Stats() {
  return (
    <section className="border-t border-ink/5 bg-white">
      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-4xl font-bold text-brand-900">{s.value}</p>
            <p className="mt-1 text-sm font-medium text-ink/50">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function CategoriesSection() {
  const cats = [
    { slug: 'cricket-kit', name: 'Cricket Kit', tagline: 'Bats · Balls · Pads · Gloves · Helmets · Kit Bags', product: 'p001' },
    { slug: 'cricket-apparel', name: 'Cricket Apparel', tagline: 'T-Shirts · Shirts · Lowers · Jerseys', product: 'p020' },
    { slug: 'other-sports', name: 'Other Sports', tagline: 'Football · Badminton · Basketball', product: 'p022' },
  ]
  return (
    <section className="container-x py-16 lg:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Shop by category</p>
          <h2 className="section-title">Everything for the game</h2>
        </div>
        <Link to="/shop" className="btn-outline text-sm">View all products <FaArrowRight size={12} /></Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {cats.map((c, i) => (
          <Link
            key={c.slug}
            to={`/shop?category=${c.slug}`}
            className={`group relative overflow-hidden rounded-3xl ${i === 1 ? 'md:row-span-1' : ''}`}
          >
            <ProductImage product={{ id: c.product, name: c.name, gradient: categoriesGrad(c.slug) }} className="aspect-[4/3] w-full transition duration-500 group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="font-display text-2xl font-bold text-white">{c.name}</h3>
              <p className="mt-1 text-sm text-white/70">{c.tagline}</p>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold text-white transition group-hover:gap-3">
                Explore <FaArrowRight size={10} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

const categoriesGrad = (slug) => {
  const map = { 'cricket-kit': ['#0E4637', '#08251F'], 'cricket-apparel': ['#C93C07', '#822C10'], 'other-sports': ['#1E3A8A', '#101828'] }
  return map[slug]
}