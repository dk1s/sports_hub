import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaCheck, FaMapMarkerAlt, FaMoneyBillWave, FaLock, FaPlus, FaTshirt, FaArrowRight } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useCart, useAuth, useSettingsStore } from '../context/AppContext'
import { useGetMyAddressesQuery, useSaveAddressMutation, useCreateOrderMutation } from '../services/apiSlice'
import { useConfirm } from '../components/ui/ConfirmDialog'
import { ThumbImage } from '../components/ui/ProductImage'
import { Spinner } from '../components/ui/misc'
import { inr, cn } from '../utils/format'

const emptyAddress = { label: 'Home', name: '', phone: '', line1: '', line2: '', city: 'Purnea', state: 'Bihar', pincode: '', isDefault: false }

export default function Checkout() {
  const { items, subtotal, flatDiscount, mrpTotal, coupon, couponDiscount, clear } = useCart()
  const { user } = useAuth()
  const { settings } = useSettingsStore()
  const nav = useNavigate()
  const confirm = useConfirm()

  const [step, setStep] = useState(1)
  const [selectedId, setSelectedId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyAddress)
  const [errors, setErrors] = useState({})
  const [savingAddr, setSavingAddr] = useState(false)

  const freeAt = settings?.freeDeliveryAbove ?? 999
  const shipping = subtotal - flatDiscount - couponDiscount >= freeAt ? 0 : 49
  const total = subtotal - couponDiscount + shipping

  const uid = user?._id
  const {
    data: saved = [],
    isLoading: addrLoading,
    isError: addrError,
    refetch: refetchAddresses,
  } = useGetMyAddressesQuery(uid, { skip: !user })
  const [saveAddress] = useSaveAddressMutation()
  const [createOrder, { isLoading: placing }] = useCreateOrderMutation()

  useEffect(() => {
    if (user && saved.length > 0 && !selectedId) {
      setSelectedId(saved.find((a) => a.isDefault)?.id || saved[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, saved.length])

  // redirect if cart's empty
  useEffect(() => {
    if (!placing && items.length === 0) nav('/cart')
  }, [items.length, nav, placing])

  if (items.length === 0) return <Spinner />

  const select = saved.find((a) => a.id === selectedId)

  const validate = (f) => {
    const errs = {}
    if (!f.name.trim()) errs.name = 'Full name is required.'
    if (!/^[+\d][\d\s-]{9,14}$/.test(f.phone)) errs.phone = 'Enter a valid 10-digit phone number.'
    if (!f.line1.trim()) errs.line1 = 'Address is required.'
    if (!f.city.trim()) errs.city = 'City is required.'
    if (!/^\d{6}$/.test(f.pincode)) errs.pincode = 'Enter a valid 6-digit PIN code.'
    if (!f.state.trim()) errs.state = 'State is required.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const saveNewAddress = async () => {
    if (!validate(form)) return toast.error('Please fix the highlighted address fields.')
    setSavingAddr(true)
    try {
      const savedAddr = await saveAddress(form).unwrap()
      setSelectedId(savedAddr.id)
      setShowForm(false)
      setForm(emptyAddress)
      toast.success('Address saved')
    } catch (e) {
      toast.error(e?.data?.message || e?.message)
    } finally {
      setSavingAddr(false)
    }
  }

  const placeOrder = async () => {
    const addr = user ? select : form
    if (!addr) {
      setStep(1)
      return toast.error('Please add a delivery address.')
    }
    if (user && !validate(addr)) {
      setStep(1)
      return toast.error('Your saved address has missing details. Please edit it.')
    }
    if (!user && !validate(form)) {
      setStep(1)
      return toast.error('Please fix the highlighted address fields.')
    }
    const ok = await confirm({
      title: 'Place this order?',
      message: `You'll pay ${inr(total)} in cash on delivery. We'll call you to confirm before shipping.`,
      confirmLabel: 'Place order',
      tone: 'info',
    })
    if (!ok) return
    try {
      const order = await createOrder({
        items,
        address: addr,
        couponCode: coupon?.code,
        paymentMethod: 'COD',
        note: '',
      }).unwrap()
      clear()
      toast.success(`Order placed! Pay ${inr(order.totals.total)} on delivery. 🛵`)
      setTimeout(() => nav(`/order/${order.no}`), 300)
    } catch (err) {
      toast.error(err?.data?.message || err?.message)
    }
  }

  return (
    <div className="container-x py-10">
      <h1 className="section-title">Checkout</h1>

      {/* steps */}
      <div className="mt-6 flex items-center gap-2 text-sm">
        {[['1', 'Address'], ['2', 'Review'], ['3', 'COD Pay']].map(([n, label], i) => (
          <React.Fragment key={n}>
            <button onClick={() => setStep(i + 1)} className={cn('flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition', step === i + 1 ? 'bg-brand-700 text-white' : 'bg-white text-ink/60')}>
              <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold', step > i + 1 ? 'bg-accent text-white' : 'bg-ink/10')}>
                {step > i + 1 ? <FaCheck /> : n}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < 2 && <span className="h-px flex-1 bg-ink/15" />}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          {/* STEP 1 address */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900"><FaMapMarkerAlt className="text-accent" /> Delivery Address</h2>

              {!user && (
                <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
                  Not signed in?{' '}
                  <Link to="/login?next=/checkout" className="font-bold underline">Sign in</Link> to save addresses & track orders. (You can still continue as guest.)
                </div>
              )}

              {user && addrLoading && <p className="mt-4 animate-pulse text-sm text-ink/40">Loading your saved addresses…</p>}

              {user && addrError && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  Could not load your addresses.{' '}
                  <button onClick={refetchAddresses} className="font-bold underline">Retry</button>
                </p>
              )}

              {user && saved.length > 0 && !showForm && (
                <div className="mt-5 space-y-3">
                  {saved.map((a) => (
                    <label key={a.id} className={cn('flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition', selectedId === a.id ? 'border-brand-600 bg-brand-50' : 'border-ink/10 hover:border-ink/25')}>
                      <input type="radio" checked={selectedId === a.id} onChange={() => setSelectedId(a.id)} className="mt-1 h-4 w-4 accent-accent" />
                      <span className="flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <b className="text-sm">{a.label}</b>
                          {a.isDefault && <span className="chip bg-accent text-white">Default</span>}
                        </span>
                        <span className="mt-1 block text-sm text-ink/70">
                          {a.name} · {a.phone}<br />{a.line1}{a.line2 ? ', ' + a.line2 : ''}, {a.city}, {a.state} — {a.pincode}
                        </span>
                      </span>
                    </label>
                  ))}
                  <button onClick={() => setShowForm(true)} className="btn-outline text-sm"><FaPlus /> Add new address</button>
                </div>
              )}

              {(showForm || !user || saved.length === 0) && (
                <div className={cn('mt-5', user && saved.length > 0 && 'rounded-2xl border border-ink/10 p-4')}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="field-label">Full name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={cn('field', errors.name && 'border-red-400')} placeholder={user?.name || 'Your name'} />
                      {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="field-label">Phone *</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={cn('field', errors.phone && 'border-red-400')} placeholder="10-digit mobile" />
                      {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="field-label">Address (House no, street, area) *</label>
                      <input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className={cn('field', errors.line1 && 'border-red-400')} placeholder="House 12, Nehru Nagar Colony, Line Bazar Road" />
                      {errors.line1 && <p className="mt-1 text-xs text-red-600">{errors.line1}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="field-label">Landmark (optional)</label>
                      <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="field" placeholder="Near Clock Tower" />
                    </div>
                    <div>
                      <label className="field-label">City *</label>
                      <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={cn('field', errors.city && 'border-red-400')} />
                      {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="field-label">PIN code *</label>
                      <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })} maxLength="6" className={cn('field', errors.pincode && 'border-red-400')} placeholder="854301" />
                      {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="field-label">State *</label>
                      <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={cn('field', errors.state && 'border-red-400')} />
                      {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {user && (
                      <button type="button" onClick={saveNewAddress} disabled={savingAddr} className="btn-primary text-sm">
                        <FaCheck /> {savingAddr ? 'Saving…' : 'Save address'}
                      </button>
                    )}
                    {user && saved.length > 0 && (
                      <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancel</button>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button onClick={() => setStep(2)} className="btn-primary w-full py-3 text-sm">
                  Continue to Review <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 review */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-brand-900">Review Order</h2>
              <div className="mt-5 space-y-4">
                {items.map((it) => (
                  <div key={it.cartKey} className="flex items-center gap-4">
                    <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg">
                      <ThumbImage src={it.image} gradient={it.gradient} name={it.name} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{it.name}</p>
                      <p className="text-xs text-ink/50">
                        {it.size ? `Size ${it.size} · ` : ''}Qty {it.qty}
                        {it.type === 'custom' && <span className="ml-1 text-accent-600"><FaTshirt className="mr-0.5 inline" />Custom</span>}
                      </p>
                    </div>
                    <span className="font-display text-sm font-bold text-brand-900">{inr(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-brand-50 p-4">
                <p className="flex items-start gap-2 text-sm text-brand-900">
                  <FaMapMarkerAlt className="mt-0.5 text-accent" />
                  <span>
                    <b>Deliver to:</b> {(user ? select || saved[0] : form)?.name}, {(user ? select || saved[0] : form)?.line1}, {(user ? select || saved[0] : form)?.city} — {(user ? select || saved[0] : form)?.pincode}
                  </span>
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline text-sm">← Edit Address</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 text-sm">Continue to Payment</button>
              </div>
            </div>
          )}

          {/* STEP 3 COD */}
          {step === 3 && (
            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900"><FaMoneyBillWave className="text-emerald-600" /> Payment — Cash on Delivery</h2>
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-emerald-600 bg-emerald-50 p-5">
                <input type="radio" checked readOnly className="mt-1 h-4 w-4 accent-emerald-600" />
                <span>
                  <span className="flex items-center gap-2">
                    <b className="text-sm text-emerald-800">Cash on Delivery (COD)</b>
                    <span className="chip bg-emerald-600 text-white">Available</span>
                  </span>
                  <span className="mt-1 block text-sm text-emerald-800/80">
                    Pay {inr(total)} in cash when your order arrives. Keep change ready if you can 😉
                  </span>
                </span>
              </label>

              <div className="mt-4 rounded-2xl border border-ink/10 p-4 text-sm text-ink/60">
                <p className="font-semibold text-ink">Other payment methods</p>
                <p className="mt-1">UPI & card payments are coming soon — at the moment we accept <b>Cash on Delivery</b> only, for your safety and convenience.</p>
              </div>

              <button onClick={placeOrder} disabled={placing} className="btn-primary mt-6 w-full py-3.5 text-sm">
                <FaLock /> {placing ? 'Placing order…' : `Place Order — Pay ${inr(total)} on Delivery`}
              </button>
              <p className="mt-3 text-center text-xs text-ink/50">By placing this order you agree to our 7-day return policy.</p>
            </div>
          )}
        </div>

        {/* summary */}
        <div>
          <div className="card sticky top-40 p-6">
            <h2 className="font-display text-lg font-bold text-brand-900">Price Details</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-ink/70"><dt>MRP ({items.length} item{items.length > 1 ? 's' : ''})</dt><dd className="line-through">{inr(mrpTotal)}</dd></div>
              {flatDiscount > 0 && <div className="flex justify-between text-emerald-600"><dt>Product discount</dt><dd>− {inr(flatDiscount)}</dd></div>}
              {couponDiscount > 0 && <div className="flex justify-between text-emerald-600"><dt>Coupon ({coupon?.code})</dt><dd>− {inr(couponDiscount)}</dd></div>}
              <div className="flex justify-between text-ink/70"><dt>Shipping</dt><dd>{shipping === 0 ? <span className="font-semibold text-emerald-600">FREE</span> : inr(shipping)}</dd></div>
              <div className="flex items-center justify-between border-t border-ink/10 pt-3">
                <dt className="font-display font-bold text-brand-900">Total</dt>
                <dd className="font-display text-xl font-bold text-brand-900">{inr(total)}</dd>
              </div>
            </dl>
            <div className="mt-5 rounded-xl bg-brand-50 p-3 text-xs font-semibold text-brand-800">
              <FaMoneyBillWave className="mr-1 inline text-accent" />
              Pay <b>{inr(total)}</b> cash on delivery. To pay later, use COD too — you keep the option open till delivery.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}