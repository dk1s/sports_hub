import React, { useState } from 'react'
import {
  FaPhoneAlt, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheck
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useSettingsStore } from '../context/AppContext'
import { messagesApi } from '../services/api'
import { cn } from '../utils/format'

export default function Contact() {
  const { settings } = useSettingsStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Your name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
    if (form.phone && !/^[+\d][\d\s-]{9,14}$/.test(form.phone)) errs.phone = 'Enter a valid phone.'
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return toast.error('Please fix the highlighted fields.')
    setBusy(true)
    try {
      await messagesApi.submit(form)
      setSent(true)
      toast.success('Message sent! We’ll get back within a few hours.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  const cards = [
    { icon: <FaPhoneAlt />, label: 'Call / SMS', value: settings?.phone, hint: 'Store line, Mon–Sat 10am–9pm', href: `tel:${settings?.phone?.replace(/\s/g, '')}` },
    { icon: <FaWhatsapp />, label: 'WhatsApp', value: 'Chat with us', hint: 'Fastest replies — 9am to 10pm', href: `https://wa.me/${settings?.whatsapp}?text=Hi Sports Hub Purnea!`, accent: true },
    { icon: <FaEnvelope />, label: 'Email', value: settings?.email, hint: 'Orders, bulk quotes & feedback', href: `mailto:${settings?.email}` },
  ]

  return (
    <div className="container-x py-10">
      <div className="max-w-2xl">
        <p className="eyebrow">Contact us</p>
        <h1 className="section-title mt-1">Talk to the team at Sports Hub, Purnea</h1>
        <p className="mt-2 text-ink/60">
          Questions about a bat, a bulk jersey order for your tournament, or anything at all — we answer fast,
          usually within the hour during store hours.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${c.accent ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-50 text-brand-700'} group-hover:bg-accent group-hover:text-white transition`}>
              {c.icon}
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-ink/40">{c.label}</p>
            <p className="mt-1 font-display font-bold text-brand-900">{c.value}</p>
            <p className="mt-0.5 text-xs text-ink/50">{c.hint}</p>
          </a>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* form */}
        <div className="card p-6 sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><FaCheck size={28} /></span>
              <h2 className="font-display text-2xl font-bold text-brand-900">Message received!</h2>
              <p className="mt-2 max-w-sm text-sm text-ink/60">Thanks {form.name.split(' ')[0]}! We reply on WhatsApp/email within store hours. For anything urgent, call us directly.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }} className="btn-outline mt-6 text-sm">Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="font-display text-xl font-bold text-brand-900">Send us a message</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Your name *</label>
                  <input value={form.name} onChange={set('name')} className={cn('field', errors.name && 'border-red-400')} placeholder="Your name" />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="field-label">Phone</label>
                  <input value={form.phone} onChange={set('phone')} className={cn('field', errors.phone && 'border-red-400')} placeholder="+91 98765 43210" />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="field-label">Email *</label>
                <input type="email" value={form.email} onChange={set('email')} className={cn('field', errors.email && 'border-red-400')} placeholder="you@example.com" />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="field-label">Subject</label>
                <input value={form.subject} onChange={set('subject')} className="field" placeholder="e.g. Bulk order for school team" />
              </div>
              <div>
                <label className="field-label">Message *</label>
                <textarea value={form.message} onChange={set('message')} rows="4" className={cn('field resize-none', errors.message && 'border-red-400')} placeholder="Tell us what you need…" />
                {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
              </div>
              <button type="submit" disabled={busy} className="btn-primary w-full py-3 text-sm">
                <FaPaperPlane /> {busy ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* store info + map */}
        <div className="space-y-6">
          <div className="card overflow-hidden p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-brand-900"><FaMapMarkerAlt className="text-accent" /> Visit the store</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{settings?.address}</p>
            <div className="mt-4 space-y-2 text-sm text-ink/70">
              <p className="flex items-center gap-2"><FaClock className="text-accent" /> {settings?.timings}</p>
              <p className="flex items-center gap-2"><FaPhoneAlt className="text-accent" /> {settings?.phone}</p>
            </div>
            <div className="mt-5 h-56 w-full overflow-hidden rounded-2xl ring-1 ring-ink/10">
              <iframe
                src={settings?.mapEmbed}
                title="Sports Hub, Purnea location"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={`https://wa.me/${settings?.whatsapp}?text=Hi Sports Hub, is this product in stock?`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-4 w-full bg-emerald-500 py-2.5 text-sm text-white hover:bg-emerald-600"
            >
              <FaWhatsapp /> Get directions & check stock on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}