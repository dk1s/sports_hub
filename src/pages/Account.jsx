import React, { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import {
  FaBox, FaTshirt, FaUserCog, FaHeart, FaMapMarkerAlt, FaSignOutAlt, FaEye, FaTrash, FaPlus, FaCheck, FaMobileAlt
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AppContext'
import { customStatusFlow } from '../services/api'
import {
  useGetOrdersMineQuery,
  useGetCustomMineQuery,
  useGetMyWishlistQuery,
  useGetMyAddressesQuery,
  useGetCatalogQuery,
  useSaveAddressMutation,
  useDeleteAddressMutation,
} from '../services/apiSlice'
import { ErrorState } from '../components/ui/Async'
import { useConfirm } from '../components/ui/ConfirmDialog'
import { ThumbImage } from '../components/ui/ProductImage'
import { Spinner, StatusBadge, EmptyState } from '../components/ui/misc'
import ProductCard from '../components/ui/ProductCard'
import { inr, formatDate, cn, initials } from '../utils/format'

const TABS = [
  { id: 'orders', label: 'Orders', icon: <FaBox /> },
  { id: 'custom', label: 'Custom Designs', icon: <FaTshirt /> },
  { id: 'profile', label: 'Profile', icon: <FaUserCog /> },
  { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
  { id: 'addresses', label: 'Addresses', icon: <FaMapMarkerAlt /> },
]

export default function Account() {
  const { user, logout, updateProfile } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'orders'
  const [expanded, setExpanded] = useState(null)

  if (!user) return <Navigate to="/login?next=/account" replace />
  const uid = user._id

  const ordersQ = useGetOrdersMineQuery(uid)
  const customQ = useGetCustomMineQuery(uid)
  const wishQ = useGetMyWishlistQuery(uid)
  const addrQ = useGetMyAddressesQuery(uid)
  const catalogQ = useGetCatalogQuery()

  const orders = ordersQ.data ?? []
  const custom = customQ.data ?? []
  const wishlist = wishQ.data ?? []
  const addresses = addrQ.data ?? []
  const catalog = catalogQ.data ?? []

  const loading = ordersQ.isLoading || customQ.isLoading || wishQ.isLoading || addrQ.isLoading || catalogQ.isLoading
  const error = ordersQ.isError && !orders.length
    ? ordersQ.error
    : customQ.isError && !custom.length
      ? customQ.error
      : wishQ.isError && !wishlist.length
        ? wishQ.error
        : addrQ.isError && !addresses.length
          ? addrQ.error
          : null
  const retry = () => {
    ordersQ.refetch(); customQ.refetch(); wishQ.refetch(); addrQ.refetch(); catalogQ.refetch()
  }

  return (
    <div className="container-x py-10">
      {/* header */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 font-display text-lg font-bold text-white">
          {initials(user.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold text-brand-900">{user.name}</h1>
          <p className="text-sm text-ink/50">{user.email} · Member since {formatDate(user.createdAt)}</p>
        </div>
        <button onClick={logout} className="btn-outline py-2 text-sm"><FaSignOutAlt /> Sign out</button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* tabs */}
        <aside className="card h-fit overflow-hidden p-2 lg:sticky lg:top-40">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setParams(tab === t.id ? {} : { tab: t.id })}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition',
                tab === t.id ? 'bg-brand-700 text-white shadow-lift' : 'text-ink/70 hover:bg-brand-50',
              )}
            >
              <span className="text-base">{t.icon}</span>
              {t.label}
              {t.id === 'orders' && <span className="ml-auto text-xs opacity-70">{orders.length}</span>}
              {t.id === 'custom' && <span className="ml-auto text-xs opacity-70">{custom.length}</span>}
              {t.id === 'wishlist' && <span className="ml-auto text-xs opacity-70">{wishlist.length}</span>}
            </button>
          ))}
        </aside>

        <div className="min-w-0">
          {loading ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : error ? (
            <ErrorState title="Could not load your account" onRetry={retry} />
          ) : (
            <>
              {tab === 'orders' && (
                <section>
                  <h2 className="section-title text-2xl">My Orders</h2>
                  {orders.length === 0 ? (
                    <EmptyState icon={<FaBox size={28} />} title="No orders yet" subtitle="Your future match-day haul will appear here." action={<Link to="/shop" className="btn-primary text-sm">Start shopping</Link>} />
                  ) : (
                    <div className="mt-5 space-y-4">
                      {orders.map((o) => (
                        <div key={o._id} className="card overflow-hidden">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/8 bg-brand-50/50 px-5 py-3">
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <Link to={`/order/${o.no}`} className="font-bold text-brand-800 hover:underline">#{o.no}</Link>
                              <span className="text-ink/50">{formatDate(o.placedAt)}</span>
                              <span className="chip bg-white text-ink/70 ring-1 ring-ink/10">{o.payment?.method} · {inr(o.totals.total)}</span>
                            </div>
                            <StatusBadge status={o.status} />
                          </div>
                          <div className="divide-y divide-ink/8 px-5">
                            {o.items.slice(0, expanded === o._id ? o.items.length : 2).map((it, i) => (
                              <div key={i} className="flex items-center gap-3 py-3">
                                <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg">
                                  <ThumbImage src={it.image} gradient={it.gradient} name={it.name} className="h-full w-full" />
                                </div>
                                <p className="min-w-0 flex-1 truncate text-sm">{it.name} <span className="text-ink/40">× {it.qty}{it.size ? ` (${it.size})` : ''}</span></p>
                                <span className="text-sm font-bold">{inr(it.price * it.qty)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between px-5 py-3">
                            <button onClick={() => setExpanded(expanded === o._id ? null : o._id)} className="text-sm font-semibold text-accent-600 hover:underline">
                              {o.items.length > 2 && expanded !== o._id ? `+${o.items.length - 2} more items` : '−'}
                              {o.items.length <= 2 && expanded === o._id ? ' Hide details' : ''}
                            </button>
                            <Link to={`/order/${o.no}`} className="btn-outline px-4 py-2 text-xs"><FaEye /> View invoice</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {tab === 'custom' && <CustomDesigns list={custom} />}

              {tab === 'wishlist' && (
                <section>
                  <h2 className="section-title text-2xl">My Wishlist</h2>
                  {wishlist.length === 0 ? (
                    <EmptyState icon={<FaHeart size={28} />} title="Wishlist is empty" subtitle="Tap the heart on any product to save it here." action={<Link to="/shop" className="btn-primary text-sm">Explore products</Link>} />
                  ) : (
                    <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
                      {wishlist.map((pid) => {
                        const p = catalog.find((x) => x.id === pid)
                        return p ? <ProductCard key={pid} product={p} compact /> : null
                      })}
                    </div>
                  )}
                </section>
              )}

              {tab === 'addresses' && <AddressBook addresses={addresses} uid={uid} />}

              {tab === 'profile' && <ProfileCard user={user} updateProfile={updateProfile} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- Custom designs ---------- */
function CustomDesigns({ list }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <section>
      <h2 className="section-title text-2xl">Custom Designs</h2>
      <p className="mt-1 text-sm text-ink/50">Track your custom print requests here.</p>
      {list.length === 0 ? (
        <EmptyState icon={<FaTshirt size={28} />} title="No custom orders yet" subtitle="Design a garment in the studio or send us a requirement." action={<Link to="/customize" className="btn-primary text-sm">Design now</Link>} />
      ) : (
        <div className="mt-5 space-y-4">
          {list.map((c) => (
            <div key={c._id} className="card overflow-hidden">
              <div className="grid gap-4 p-5 sm:grid-cols-[110px_1fr]">
                <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-ink/10">
                  <img src={c.preview} alt={c.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-brand-900">{c.name}</h3>
                    <span className="chip bg-white text-ink/50 ring-1 ring-ink/10">#{c.no}</span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-ink/60">
                    <p><b className="text-ink/80">{c.qty} pcs</b> · {c.garment?.type} · {(c.garment?.size || []).join(', ')}</p>
                    <p className="truncate">
                      Design: {c.design?.text || c.teamName || '—'}
                      {c.design?.number ? ` · No. ${c.design.number}` : ''}
                    </p>
                    <p className="text-xs text-ink/40">Submitted {formatDate(c.created)} · Est. ₹{c.price * c.qty}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge status={c.status} />
                    {c.specialNotes && <span className="chip bg-amber-50 text-amber-700 ring-1 ring-amber-200">Has instructions</span>}
                  </div>
                </div>
              </div>
              <CustomStepBar status={c.status} />
              <div className="border-t border-ink/8 px-5 py-3">
                <button onClick={() => setExpanded(expanded === c._id ? null : c._id)} className="text-sm font-semibold text-accent-600 hover:underline">
                  {expanded === c._id ? 'Hide details' : 'View design details'}
                </button>
              </div>
              {expanded === c._id && (
                <div className="grid gap-4 border-t border-ink/8 bg-brand-50/40 px-5 py-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Design snapshot</p>
                    <p className="mt-1 text-sm text-ink/70">
                      Base colour: <span className="font-semibold">{c.design?.baseColor}</span> · Fabric: {c.design?.fabric}
                    </p>
                    <p className="text-sm text-ink/70">Text: <b>{c.design?.text || c.teamName || '—'}</b> · No: <b>{c.design?.number || '—'}</b></p>
                    {c.logo && <p className="text-sm text-ink/70">Logo: <b>{c.logo.name || 'Uploaded'}</b></p>}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Notes</p>
                    {c.specialNotes ? <p className="mt-1 text-sm text-ink/70">“{c.specialNotes}”</p> : <p className="mt-1 text-sm text-ink/40">No special notes.</p>}
                    {c.adminNotes && <p className="mt-2 rounded-lg bg-white p-2 text-xs text-ink/60 ring-1 ring-ink/10"><b>Admin note:</b> {c.adminNotes}</p>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function CustomStepBar({ status }) {
  const idx = customStatusFlow.indexOf(status)
  return (
    <div className="flex items-center gap-1 px-5 pb-4">
      {customStatusFlow.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center">
            <span className={cn('h-2.5 w-2.5 rounded-full', i <= idx ? 'bg-accent' : 'bg-ink/15')} />
            <span className={cn('mt-1 hidden w-max text-[9px] font-semibold sm:block', i <= idx ? 'text-accent-700' : 'text-ink/30')}>{s.replace('Approved — ', '')}</span>
          </div>
          {i < customStatusFlow.length - 1 && <span className={cn('mb-4 h-0.5 flex-1', i < idx ? 'bg-accent' : 'bg-ink/10')} />}
        </React.Fragment>
      ))}
    </div>
  )
}

/* ---------- Address book ---------- */
function AddressBook({ addresses, uid }) {
  const confirm = useConfirm()
  const [editing, setEditing] = useState(null)
  const blank = { label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false }
  const [form, setForm] = useState(blank)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const [saveAddress] = useSaveAddressMutation()
  const [deleteAddress] = useDeleteAddressMutation()

  const startNew = () => { setEditing('new'); setForm(blank); setErrors({}) }
  const startEdit = (a) => { setEditing(a.id); setForm(a); setErrors({}) }

  const validate = () => {
    const errs = {}
    if (!form.name?.trim()) errs.name = 'Required.'
    if (!/^[+\d][\d\s-]{9,14}$/.test(form.phone || '')) errs.phone = 'Invalid phone.'
    if (!form.line1?.trim()) errs.line1 = 'Required.'
    if (!form.city?.trim()) errs.city = 'Required.'
    if (!/^\d{6}$/.test(form.pincode || '')) errs.pincode = 'Invalid PIN.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const save = async () => {
    if (!validate()) return
    setBusy(true)
    try {
      await saveAddress({ ...form, uid }).unwrap()
      setEditing(null)
      toast.success('Address saved')
    } catch (e) {
      toast.error(e?.data?.message || e?.message)
    } finally {
      setBusy(false)
    }
  }

  const setDefault = async (a) => {
    try {
      await saveAddress({ ...a, isDefault: true, uid }).unwrap()
      toast.success('Set as default')
    } catch (e) {
      toast.error(e?.data?.message || e?.message)
    }
  }

  const removeAddr = async (id) => {
    const ok = await confirm({
      title: 'Remove this address?',
      message: 'It will be removed from your saved addresses.',
      confirmLabel: 'Remove address',
      tone: 'danger',
    })
    if (!ok) return
    try {
      await deleteAddress({ id, uid }).unwrap()
      toast.success('Address removed')
    } catch (e) {
      toast.error(e?.data?.message || e?.message)
    }
  }

  return (
    <section>
      <h2 className="section-title text-2xl">Saved Addresses</h2>
      <div className="mt-5 space-y-3">
        {addresses.map((a) => (
          <div key={a.id} className="card flex flex-wrap items-start justify-between gap-3 p-5">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-accent" />
                <b>{a.label}</b>
                {a.isDefault && <span className="chip bg-accent text-white">Default</span>}
              </div>
              <p className="mt-1 text-sm text-ink/70">{a.name} · {a.phone}<br />{a.line1}{a.line2 ? ', ' + a.line2 : ''}, {a.city}, {a.state} — {a.pincode}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDefault({ ...a, isDefault: true })} className="text-xs font-semibold text-ink/50 hover:text-brand-700">Make default</button>
              <button onClick={() => startEdit(a)} className="text-xs font-semibold text-accent-600">Edit</button>
              <button onClick={() => removeAddr(a.id)} className="text-xs font-semibold text-red-500"><FaTrash /></button>
            </div>
          </div>
        ))}

        {editing ? (
          <div className="card p-5">
            <h3 className="font-display font-bold text-brand-900">{editing === 'new' ? 'Add address' : 'Edit address'}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="field-label">Label</label>
                <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="field">
                  <option>Home</option><option>Office</option><option>Other</option>
                </select>
              </div>
              <div><label className="field-label">Full name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={cn('field', errors.name && 'border-red-400')} /></div>
              <div className="sm:col-span-2"><label className="field-label">Phone *</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={cn('field', errors.phone && 'border-red-400')} /></div>
              <div className="sm:col-span-2"><label className="field-label">Address *</label><input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className={cn('field', errors.line1 && 'border-red-400')} /></div>
              <div className="sm:col-span-2"><label className="field-label">Landmark</label><input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="field" /></div>
              <div><label className="field-label">City *</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={cn('field', errors.city && 'border-red-400')} /></div>
              <div><label className="field-label">PIN *</label><input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })} maxLength="6" className={cn('field', errors.pincode && 'border-red-400')} /></div>
              <div className="sm:col-span-2"><label className="field-label">State *</label><input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={cn('field', errors.state && 'border-red-400')} /></div>
              <label className="flex items-center gap-2 text-sm text-ink/70 sm:col-span-2">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="h-4 w-4 accent-accent" /> Set as default delivery address
              </label>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={save} disabled={busy} className="btn-primary text-sm"><FaCheck /> {busy ? 'Saving…' : 'Save'}</button>
              <button onClick={() => setEditing(null)} className="btn-ghost text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={startNew} className="btn-outline text-sm"><FaPlus /> Add new address</button>
        )}
      </div>
    </section>
  )
}

/* ---------- Profile ---------- */
function ProfileCard({ user, updateProfile }) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [busy, setBusy] = useState(false)

  const saveProfile = async () => {
    if (!name.trim()) return toast.error('Name cannot be empty.')
    setBusy(true)
    try {
      await updateProfile({ name, phone })
      toast.success('Profile updated')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-brand-900">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="field-label">Full name</label><input value={name} onChange={(e) => setName(e.target.value)} className="field" /></div>
          <div><label className="field-label">Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="field" placeholder="+91 98765 43210" /></div>
          <div className="sm:col-span-2"><label className="field-label">Email (can't change)</label><input value={user.email} disabled className="field bg-ink/5 text-ink/50" /></div>
        </div>
        <button onClick={saveProfile} disabled={busy} className="btn-primary mt-4 text-sm">{busy ? 'Saving…' : 'Save changes'}</button>
      </div>

      <div className="card p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900">
          <FaMobileAlt className="text-brand-700" /> Sign-in method
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900">
          <span className="chip bg-brand-700 text-white">Phone + OTP</span>
          <span>You sign in with your number {user.phone ? <b>{user.phone}</b> : ''} — no password needed.</span>
        </div>
        <p className="mt-3 text-xs text-ink/50">
          To use a different number, just sign out and log in again with the new one — it gets linked to a fresh account automatically.
        </p>
      </div>
    </section>
  )
}