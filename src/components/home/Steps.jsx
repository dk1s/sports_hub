import React from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingBag, FaTshirt, FaTruck, FaArrowRight } from 'react-icons/fa'
import { SectionHeading } from '../ui/misc'

const steps = [
  {
    num: '01',
    icon: <FaShoppingBag />,
    title: 'Shop the Gear',
    desc: 'Browse cricket kit, apparel and other sports from 500+ products. Filter by price, size, brand and compare ratings.',
    cta: 'Browse Shop',
    to: '/shop',
    accent: '#FF6B2C',
  },
  {
    num: '02',
    icon: <FaTshirt />,
    title: 'Customize Your Jersey',
    desc: 'Use our canvas designer to drop your logo, add names and numbers, pick colours — or just tell us your requirement as a simple form.',
    cta: 'Start Designing',
    to: '/customize',
    accent: '#1E805F',
  },
  {
    num: '03',
    icon: <FaTruck />,
    title: 'Get Delivered',
    desc: 'Pay cash on delivery. Track your order from Pending to Delivered. Pickup at our Purnea store is always welcome.',
    cta: 'How it works',
    to: '/contact',
    accent: '#101828',
  },
]

export default function Steps() {
  return (
    <section className="container-x py-16 lg:py-20">
      <SectionHeading
        eyebrow="How it works"
        title="From net practice to match day"
        sub="Three steps between you and ready-to-play gear. We keep it simple, like sports should be."
        center
      />
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.num}
            className="card group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="absolute -right-6 -top-8 font-display text-[7rem] font-bold leading-none text-ink/5 transition group-hover:text-ink/10">
              {s.num}
            </div>
            <div className="relative">
              <span
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lift"
                style={{ background: s.accent }}
              >
                <span className="text-lg">{s.icon}</span>
              </span>
              <h3 className="font-display text-xl font-bold text-brand-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.desc}</p>
              <Link to={s.to} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent-600 hover:text-accent-700">
                {s.cta} <FaArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}