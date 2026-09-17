import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaPaperPlane, FaCheck, FaUpload, FaTag } from 'react-icons/fa'
import { customOrdersApi } from '../services/api'
import { garmentTypes, shirtColors } from './Designer'

const tshirtTypes = garmentTypes.map((g) => g.label)
const fabrics = garmentTypes.map((g) => g.fabric)
const forms = ['Round Neck', 'Polo', 'V Neck', 'Sublimated Jersey']

const previewTshirt = (base = '#0E4637', text = 'TEAM NAME', number = '') => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">` +
    `<rect width="320" height="320" fill="#F3F4F1"/>` +
    `<path d="M160 36 L108 28 L72 52 L77 96 L108 90 L108 283 L212 283 L212 90 L243 96 L248 52 L212 28 Z" fill="${base}" stroke="rgba(16,24,40,.2)" stroke-width="2"/>` +
    (number ? `<text x="160" y="200" font-family="System-ui" font-size="52" font-weight="800" text-anchor="middle" fill="#fff">${number}</text>` : '') +
    `<text x="160" y="132" font-family="System-ui" font-size="18" font-weight="700" text-anchor="middle" fill="#fff">${text}</text>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export default function SimpleForm({ initialDesign = null }) {
  const nav = useNavigate()
  const [form, setForm] = useState({
    tshirtType: initialDesign?.tshirtType || 'Round-Neck T-Shirt',
    fabric: initialDesign?.fabric || 'Combed Cotton 180 GSM',
    color: initialDesign?.color || '#0E4637',
    neckType: initialDesign?.neckType || '',
    sizes: initialDesign?.sizes || ['M'],
    qty: initialDesign?.qty || 1,
    playerName: initialDesign?.playerName || '',
    number: initialDesign?.number || '',
    teamName: initialDesign?.teamName || '',
    logo: initialDesign?.logo || null,
    notes: initialDesign?.notes || '',
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const fileRef = useRef(null)
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please upload an image file.')
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, logo: { name: file.name, src: reader.result } }))
    reader.readAsDataURL(file)
  }

  const toggleSize = (s) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }))

  const validate = () => {
    const errs = {}
    if (!form.tshirtType) errs.tshirtType = 'Select a T-shirt type.'
    if (!form.fabric) errs.fabric = 'Select a fabric.'
    if (!form.sizes.length) errs.sizes = 'Choose at least one size.'
    if (form.qty < 1) errs.qty = 'Enter a valid quantity.'
    if (!form.teamName && !form.playerName) errs.playerName = 'Add a player/team name so we know what to print.'
    if (/[<>]/.test(form.playerName + form.teamName + form.notes)) errs.playerName = 'Remove special characters like < >.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return toast.error('Please fix the highlighted fields.')
    setBusy(true)
    const design = {
      type: 'tshirt',
      view: 'front',
      baseColor: form.color,
      textColor: '#fff',
      text: form.teamName || form.playerName,
      number: form.number,
      team: form.teamName,
      fabric: form.fabric,
    }
    const payload = {
      name: `${form.teamName || form.playerName} — ${form.tshirtType}`,
      design,
      garment: { type: form.tshirtType, size: form.sizes, color: forms.length && form.neckType },
      qty: Number(form.qty),
      price: garmentTypes.find((g) => g.label === form.tshirtType)?.price || 449,
      sizeChart: 'S: 36-38", M: 38-40", L: 40-42", XL: 42-44", XXL: 44-46"',
      specialNotes: [form.neckType && `Collar style: ${form.neckType}`, form.notes].filter(Boolean).join(' · '),
      logo: form.logo ? { name: form.logo.name } : null,
      preview: previewTshirt(form.color, (form.teamName || form.playerName || '').toUpperCase().slice(0, 12), form.number),
      playerName: form.playerName,
      number: form.number,
      teamName: form.teamName,
    }
    try {
      const rec = await customOrdersApi.submit(payload)
      setSubmitted(rec)
      toast.success('Custom order submitted!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (submitted) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <FaCheck size={28} />
        </span>
        <h2 className="font-display text-2xl font-bold text-brand-900">Order received!</h2>
        <p className="mt-2 text-sm text-ink/60">
          Request <b>{submitted.no}</b> is now <b>Pending</b>. We’ll review your design and confirm on WhatsApp within 24 hours.
        </p>
        <div className="mt-5 rounded-2xl bg-brand-50 p-4 text-left">
          <p className="text-sm text-ink/70">Status: <span className="font-bold text-amber-600">Pending → In Review → Approved / Printing → Shipped</span></p>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => nav('/customize?tab=form')} className="btn-outline text-sm">New order</button>
          <button onClick={() => nav('/account?tab=custom')} className="btn-primary text-sm">Track in My Account</button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <form onSubmit={submit} className="space-y-6">
        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-brand-900">1 · Pick your T-shirt</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">T-shirt type *</label>
              <select value={form.tshirtType} onChange={set('tshirtType')} className={`field ${errors.tshirtType ? 'border-red-400' : ''}`}>
                {tshirtTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {errors.tshirtType && <p className="mt-1 text-xs text-red-600">{errors.tshirtType}</p>}
            </div>
            <div>
              <label className="field-label">Fabric *</label>
              <select value={form.fabric} onChange={set('fabric')} className={`field ${errors.fabric ? 'border-red-400' : ''}`}>
                {fabrics.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
              {errors.fabric && <p className="mt-1 text-xs text-red-600">{errors.fabric}</p>}
            </div>
            <div>
              <label className="field-label">Collar / neck style</label>
              <select value={form.neckType} onChange={set('neckType')} className="field">
                <option value="">Standard</option>
                {forms.filter((x) => x !== 'Sublimated Jersey').map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Base colour *</label>
              <div className="flex flex-wrap gap-2">
                {shirtColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    style={{ background: c }}
                    className={`h-8 w-8 rounded-full ring-2 ring-offset-1 ${form.color === c ? 'ring-accent' : 'ring-transparent'} ${c === '#FFFFFF' || c === '#F1F5F9' ? 'border border-ink/10' : ''}`}
                    aria-label={`Colour ${c}`}
                  />
                ))}
                <input type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="h-8 w-9 cursor-pointer rounded border border-ink/10" />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-brand-900">2 · Sizes & quantity</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Sizes required *</label>
              <div className="flex flex-wrap gap-1.5">
                {allSizes.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSize(s)} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${form.sizes.includes(s) ? 'border-brand-700 bg-brand-700 text-white' : 'border-ink/15 text-ink/70'}`}>
                    {s}
                  </button>
                ))}
              </div>
              {errors.sizes && <p className="mt-1 text-xs text-red-600">{errors.sizes}</p>}
            </div>
            <div>
              <label className="field-label">Quantity (approx. per size) *</label>
              <input type="number" min="1" max="500" value={form.qty} onChange={set('qty')} className={`field ${errors.qty ? 'border-red-400' : ''}`} />
              {errors.qty && <p className="mt-1 text-xs text-red-600">{errors.qty}</p>}
              <p className="mt-1 text-xs text-ink/50">Bulk orders of 10+ get a discount — we’ll confirm the quote.</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-brand-900">3 · Text on the shirt</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="field-label">Player name</label>
              <input value={form.playerName} onChange={set('playerName')} placeholder="e.g. RAMESH" className={`field ${errors.playerName ? 'border-red-400' : ''}`} />
              {errors.playerName && <p className="mt-1 text-xs text-red-600">{errors.playerName}</p>}
            </div>
            <div>
              <label className="field-label">Number</label>
              <input value={form.number} onChange={set('number')} placeholder="e.g. 07" maxLength="2" className="field" />
            </div>
            <div>
              <label className="field-label">Team name</label>
              <input value={form.teamName} onChange={set('teamName')} placeholder="e.g. PANTHERS" className="field" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-brand-900">4 · Logo & notes</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="field-label">Logo / artwork (optional)</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onLogo} />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline w-full py-3 text-sm">
                <FaUpload /> {form.logo ? `Replace logo — ${form.logo.name}` : 'Upload logo or team crest'}
              </button>
              {form.logo && (
                <img src={form.logo.src} alt="logo preview" className="mt-3 h-16 rounded-lg border border-ink/10 object-contain" />
              )}
            </div>
            <div>
              <label className="field-label">Special instructions</label>
              <textarea value={form.notes} onChange={set('notes')} rows="3" placeholder="Font style, sponsor name, date needed by, stitching preferences…" className="field resize-none" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={busy} className="btn-primary w-full py-3.5 text-sm">
          <FaPaperPlane /> {busy ? 'Submitting…' : 'Submit Custom Order Request'}
        </button>
      </form>

      <div>
        <div className="card lg:sticky lg:top-40 overflow-hidden">
          <div className="bg-brand-950 p-6 text-center">
            <div className="mx-auto max-w-[240px]">
              <svg viewBox="0 0 320 320" className="w-full">
                <path d="M160 36 L108 28 L72 52 L77 96 L108 90 L108 283 L212 283 L212 90 L243 96 L248 52 L212 28 Z" fill={form.color} stroke="rgba(16,24,40,.25)" strokeWidth="2" />
                <text x="160" y="132" fontFamily="System-ui" fontSize="18" fontWeight="700" textAnchor="middle" fill="#fff">
                  {(form.teamName || form.playerName || 'YOUR NAME').toUpperCase().slice(0, 12)}
                </text>
                {form.number && (
                  <text x="160" y="205" fontFamily="System-ui" fontSize="52" fontWeight="800" textAnchor="middle" fill="#fff">
                    {form.number}
                  </text>
                )}
              </svg>
            </div>
            <p className="mt-3 text-xs text-white/50">Live preview</p>
          </div>
          <div className="space-y-3 p-5">
            {[
              ['Type', form.tshirtType],
              ['Fabric', form.fabric],
              ['Sizes', form.sizes.join(', ') || '—'],
              ['Qty', `${form.qty} (approx.)`],
              ['Est. price', `₹${(garmentTypes.find((g) => g.label === form.tshirtType)?.price || 449) * Number(form.qty || 0)}`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span className="text-ink/50">{k}</span>
                <span className="max-w-[60%] truncate font-semibold text-ink">{v}</span>
              </div>
            ))}
            <div className="border-t border-ink/10 pt-3 text-xs text-ink/50">
              <p className="flex items-center gap-1.5"><FaTag className="text-accent" /> We confirm the design & final quote on WhatsApp within 24 hours. No advance needed for COD.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}