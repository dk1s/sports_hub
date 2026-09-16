import React, { useEffect, useState } from 'react'
import { FaSave, FaStore, FaWhatsapp, FaCheck, FaUndo } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { settingsApi } from '../../services/api'
import { useSettingsStore, useCart } from '../../context/AppContext'
import { storeDefaults } from '../../data/seed'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { PageLoader } from '../../components/ui/Async'
import { inr } from '../../utils/format'

export default function AdminSettings() {
  const { settings, refresh, setSettings } = useSettingsStore()
  const { setCoupon } = useCart()
  const [form, setForm] = useState(settings)
  const [busy, setBusy] = useState(false)
  const confirm = useConfirm()

  // Keep the draft in sync if settings arrive/change after mount.
  useEffect(() => {
    if (!settings) return
    setForm((current) => (current ? current : settings))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  if (!settings) return <PageLoader label="Loading store settings…" />

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      return toast.error('Store name, phone and email are required.')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error('Enter a valid email.')
    setBusy(true)
    try {
      const next = await settingsApi.update(form)
      setSettings(next)
      refresh()
      toast.success('Store settings saved — live on the public site now.')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  const reset = async () => {
    const ok = await confirm({
      title: 'Reset settings to defaults?',
      message: 'Your current store settings will be replaced with the demo defaults.',
      confirmLabel: 'Reset settings',
      tone: 'warning',
    })
    if (!ok) return
    setForm(storeDefaults)
  }

  const Group = ({ title, icon, children }) => (
    <div className="card p-6">
      <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-brand-900">{icon} {title}</h2>
      {children}
    </div>
  )

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Configuration</p>
          <h1 className="font-display text-2xl font-bold text-brand-900">Store Settings</h1>
          <p className="text-sm text-ink/50">These values reflect instantly on the public Contact page, footer and checkout.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="btn-outline py-2 text-sm"><FaUndo /> Reset defaults</button>
          <button onClick={save} disabled={busy} className="btn-primary py-2 text-sm"><FaSave /> {busy ? 'Saving…' : 'Save settings'}</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Group title="Store identity" icon={<FaStore className="text-accent" />}>
          <div className="space-y-4">
            <div><label className="field-label">Store name</label><input value={form.name} onChange={set('name')} className="field" /></div>
            <div><label className="field-label">Tagline</label><input value={form.tagline} onChange={set('tagline')} className="field" /></div>
            <div><label className="field-label">Address (as shown on footer & contact)</label><textarea value={form.address} onChange={set('address')} rows="2" className="field resize-none" /></div>
          </div>
        </Group>

        <Group title="Contact details" icon={<FaWhatsapp className="text-emerald-500" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="field-label">Phone (+91…)</label><input value={form.phone} onChange={set('phone')} className="field" placeholder="+91 90000 00000" /></div>
            <div><label className="field-label">WhatsApp (digits only, with country code)</label><input value={form.whatsapp} onChange={set('whatsapp')} className="field" placeholder="919000000000" /></div>
            <div className="sm:col-span-2"><label className="field-label">Email</label><input value={form.email} onChange={set('email')} className="field" /></div>
            <div><label className="field-label">Instagram URL</label><input value={form.instagram} onChange={set('instagram')} className="field" /></div>
            <div><label className="field-label">Facebook URL</label><input value={form.facebook} onChange={set('facebook')} className="field" /></div>
            <div className="sm:col-span-2"><label className="field-label">Store timings</label><input value={form.timings} onChange={set('timings')} className="field" /></div>
          </div>
        </Group>

        <Group title="Map & delivery" icon={<FaStore className="text-accent" />}>
          <div className="space-y-4">
            <div>
              <label className="field-label">Google Maps embed URL</label>
              <input value={form.mapEmbed} onChange={set('mapEmbed')} className="field" />
              <p className="mt-1 text-xs text-ink/40">Tip: use <code>https://www.google.com/maps?q=YOUR+PLACE&output=embed</code></p>
            </div>
            <div>
              <label className="field-label">Free delivery above (₹)</label>
              <input type="number" value={form.freeDeliveryAbove} onChange={(e) => setForm({ ...form, freeDeliveryAbove: Number(e.target.value) || 0 })} className="field" />
              <p className="mt-1 text-xs text-ink/40">Currently: free shipping on orders above {inr(form.freeDeliveryAbove)}</p>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink/10 p-4">
              <input type="checkbox" checked={form.codAvailable} onChange={(e) => setForm({ ...form, codAvailable: e.target.checked })} className="h-4 w-4 accent-accent" />
              <span>
                <b className="block text-sm text-ink">Cash on Delivery available</b>
                <span className="block text-xs text-ink/50">Toggles the COD mention across the store.</span>
              </span>
            </label>
          </div>
        </Group>

        <Group title="Live preview" icon={<FaCheck className="text-emerald-500" />}>
          <div className="rounded-2xl bg-brand-950 p-5 text-white">
            <p className="font-display font-bold">{form.name}</p>
            <p className="text-sm text-accent">{form.tagline}</p>
            <div className="mt-3 space-y-1.5 text-sm text-white/70">
              <p>📞 {form.phone || '—'}</p>
              <p>💬 WhatsApp: +{form.whatsapp || '—'}</p>
              <p>✉️ {form.email || '—'}</p>
              <p>📍 {form.address || '—'}</p>
              <p>🕒 {form.timings || '—'}</p>
            </div>
            <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/60">
              This is exactly what customers see on the Contact page & footer. Replace placeholders with your real Purnea details.
            </p>
          </div>
        </Group>
      </div>

      <div className="mt-6 text-center">
        <button onClick={() => { setCoupon(null); toast.success('Coupon cleared') }} className="text-xs font-semibold text-ink/40 hover:text-ink">Clear active coupon (demo)</button>
      </div>
    </div>
  )
}