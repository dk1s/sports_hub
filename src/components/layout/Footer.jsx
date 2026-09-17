import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaWhatsapp,
  FaInstagram, FaFacebookF, FaPaperPlane, FaShieldAlt, FaCcVisa, FaCcMastercard
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useSettingsStore } from '../../context/AppContext'
import { categories } from '../../data/products'

export default function Footer() {
  const { settings } = useSettingsStore()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  const subscribe = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error('Please enter a valid email.')
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      setEmail('')
      toast.success('You’re on the squad! Watch for launch offers. 🏏')
    }, 700)
  }

  return (
    <footer className="mt-20 bg-brand-950 text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
                <path d="M6 13 L9.5 21 L12 12 L18 15 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-none">Sports Hub</p>
              <p className="text-xs font-medium text-accent">Purnea</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {settings?.tagline || 'Gear Up. Play Hard. Win Big.'} Purnea’s trusted store for cricket kit, apparel and custom team jerseys.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href={settings?.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-accent transition">
              <FaInstagram />
            </a>
            <a href={settings?.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-accent transition">
              <FaFacebookF />
            </a>
            <a href={`https://wa.me/${settings?.whatsapp || '918210293271'}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-accent">Shop</h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?category=${c.slug}`} className="hover:text-white transition">
                  {c.name}
                </Link>
              </li>
            ))}
            <li><Link to="/customize" className="text-accent hover:text-white transition">Custom T-Shirt / Jersey</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-accent">Company</h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/shop" className="hover:text-white">Bestsellers</Link></li>
            <li><Link to="/shop?sort=newest" className="hover:text-white">New Arrivals</Link></li>
            <li><Link to="/login" className="hover:text-white">My Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-accent">Get in touch</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-2.5"><FaMapMarkerAlt className="mt-0.5 shrink-0 text-accent" /> {settings?.address}</li>
            <li className="flex gap-2.5"><FaPhoneAlt className="mt-0.5 shrink-0 text-accent" /> {settings?.phone}</li>
            <li className="flex gap-2.5"><FaEnvelope className="mt-0.5 shrink-0 text-accent" /> {settings?.email}</li>
            <li className="flex gap-2.5"><FaClock className="mt-0.5 shrink-0 text-accent" /> {settings?.timings}</li>
          </ul>
          <a
            href={`https://wa.me/${settings?.whatsapp || '918210293271'}?text=Hi Sports Hub, I have a question.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-5 w-full bg-emerald-500 py-2.5 text-sm text-white hover:bg-emerald-600"
          >
            <FaWhatsapp /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-white/10 bg-brand-900/50">
        <div className="container-x flex flex-col items-start justify-between gap-5 py-8 lg:flex-row lg:items-center">
          <div>
            <h3 className="font-display text-xl font-bold">Join the Sports Hub squad</h3>
            <p className="mt-1 text-sm text-white/60">New arrivals, match offers & custom jersey deals. No spam, ever.</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
            <button type="submit" disabled={busy} className="btn-primary shrink-0 px-5">
              {busy ? 'Joining…' : <FaPaperPlane />}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Sports Hub, Purnea. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5"><FaShieldAlt className="text-accent" /> Cash on Delivery</span>
            <span className="flex items-center gap-1"><FaCcVisa /> <FaCcMastercard /> UPI</span>
            <span className="hidden sm:inline">Made with 🏏 in Bihar</span>
          </div>
        </div>
      </div>
    </footer>
  )
}