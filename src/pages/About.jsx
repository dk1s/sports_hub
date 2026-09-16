import React from 'react'
import { Link } from 'react-router-dom'
import { FaTshirt, FaStore, FaHandshake, FaTrophy, FaWhatsapp, FaChessKnight } from 'react-icons/fa'
import { useSettingsStore } from '../context/AppContext'

const values = [
  { icon: <FaStore />, title: 'Real store, real stock', desc: 'Touch, feel and try before you buy. Our MG Road shop always has the range we advertise online.' },
  { icon: <FaHandshake />, title: 'Straightforward prices', desc: 'No inflated MRPs and fake discounts. We price like a local store should — fair, clear and negotiable on bulk.' },
  { icon: <FaTshirt />, title: 'Custom jersey experts', desc: 'From village tournaments to district leagues, we’ve printed for 200+ teams across Purnea and nearby.' },
  { icon: <FaTrophy />, title: 'For every player', desc: 'From first-time gully cricketers to academy professionals, we stock the right gear for your level.' },
]

export default function About() {
  const { settings } = useSettingsStore()
  const milestones = [
    ['2018', 'Sports Hub opens on MG Road, Purnea with a single showcase of bats.'],
    ['2020', 'Custom jersey printing studio added — our most loved service today.'],
    ['2023', '1,000th team jersey order delivered across North Bihar.'],
    ['2025', '500+ products live online with COD across Bihar & India.'],
  ]
  return (
    <div className="container-x py-10">
      <div className="max-w-3xl">
        <p className="eyebrow">About us</p>
        <h1 className="section-title mt-1">The store behind Purnea’s match days</h1>
        <p className="mt-3 text-lg text-ink/60">
          {settings?.name} started with a simple idea: the district deserved proper sports equipment and
          honest advice — without travelling to Patna or ordering blind from another city.
        </p>
      </div>

      {/* story */}
      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-950 p-8 text-white">
            <div className="absolute inset-0 bg-grid-dark" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent"><FaChessKnight /></span>
                <p className="font-display text-lg font-bold">Since 2018</p>
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold leading-snug">
                “If it helps someone play better, we stock it. If they’re just starting, we guide them.”
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Whether it’s a ₹250 tennis ball or a ₹5,000 English willow bat, every customer gets the same
                attention — because we know who that gear is going to be used against.
              </p>
              <Link to="/shop" className="btn btn-primary mt-6 py-2 text-sm">Shop the store</Link>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          {milestones.map(([y, t]) => (
            <div key={y} className="card flex gap-4 p-4">
              <span className="font-display text-xl font-bold text-accent-600">{y}</span>
              <p className="text-sm leading-relaxed text-ink/70">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* values */}
      <div className="mt-16">
        <p className="eyebrow mb-3 text-center">What we stand for</p>
        <h2 className="section-title text-center">More than a shop</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-accent group-hover:text-white">
                {v.icon}
              </span>
              <h3 className="font-display text-lg font-bold text-brand-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-[2rem] bg-brand-950 p-10 text-center text-white sm:p-14">
        <h2 className="text-balance font-display text-3xl font-bold sm:text-4xl">Drop in, say hi</h2>
        <p className="max-w-xl text-white/70">{settings?.address}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn-primary text-sm">Contact us</Link>
          <a href={`https://wa.me/${settings?.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn border border-white/30 text-white hover:bg-white/10 text-sm">
            <FaWhatsapp /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}