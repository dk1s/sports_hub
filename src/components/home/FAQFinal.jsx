import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronDown, FaArrowRight } from 'react-icons/fa'
import { faqs } from '../../data/seed'
import { SectionHeading } from '../ui/misc'
import { useSettingsStore } from '../../context/AppContext'

export function FAQSection() {
  const [open, setOpen] = useState(0)
  return (
    <section className="container-x py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading
            eyebrow="FAQs"
            title="Questions? Answered."
            sub="Everything people usually ask before ordering — gear, custom jerseys, delivery and returns."
            action={null}
          />
          <p className="mt-4 text-sm text-ink/60">
            Still unsure? Message us on WhatsApp or drop by the store — we’re happy to help you pick the right kit.
          </p>
          <Link to="/contact" className="btn-dark mt-6 text-sm">
            Talk to us <FaArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-ink/8 rounded-2xl border border-ink/10 bg-white">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-brand-50/40"
                aria-expanded={open === i}
              >
                <span className="font-display font-semibold text-brand-900">{f.q}</span>
                <FaChevronDown
                  className={`shrink-0 text-ink/40 transition duration-200 ${open === i ? 'rotate-180 text-accent' : ''}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink/70">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  const { settings } = useSettingsStore()
  return (
    <section className="container-x pb-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent-600 to-accent-800 p-10 text-center text-white sm:p-14">
        <div className="absolute inset-0 bg-grid-dark opacity-60" />
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />
        <div className="relative">
          <h2 className="text-balance font-display text-4xl font-bold sm:text-5xl">
            Ready to hit the crease?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Shop online with Cash on Delivery, or visit {settings?.name} on {settings?.address?.split(',')[0]}. Same-day pickup for stock items.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/shop" className="btn bg-white text-accent-700 hover:bg-accent-50">
              Start Shopping
            </Link>
            <Link to="/customize" className="btn border-2 border-white/60 text-white hover:bg-white/10">
              Design My Jersey
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}