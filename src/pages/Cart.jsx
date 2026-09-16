import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingBag, FaTrash, FaTag, FaArrowRight, FaTshirt, FaRocket } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useCart, useSettingsStore } from '../context/AppContext'
import { ThumbImage } from '../components/ui/ProductImage'
import { QtyStepper, EmptyState } from '../components/ui/misc'
import { inr } from '../utils/format'

export default function Cart() {
  const {
    items, updateQty, remove, clear, subtotal, flatDiscount, mrpTotal,
    coupon, applyCoupon, couponDiscount,
  } = useCart()
  const { settings } = useSettingsStore()
  const nav = useNavigate()
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)

  const freeAt = settings?.freeDeliveryAbove ?? 999
  const shipping = subtotal - flatDiscount - couponDiscount >= freeAt ? 0 : 49
  const total = subtotal - couponDiscount + shipping
  const remaining = freeAt - (subtotal - flatDiscount)
  const progress = Math.min(100, ((subtotal - flatDiscount) / freeAt) * 100)

  const applyCouponCode = async () => {
    if (!code.trim()) return
    setChecking(true)
    try {
      const c = await applyCoupon(code)
      toast.success(`Coupon ${c.code} applied — save ${inr(c.type === 'percent' ? (subtotal * c.value) / 100 : c.value)}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="container-x py-10">
      <h1 className="section-title">Your Cart</h1>
      <p className="mt-1 text-sm text-ink/50">
        {items.length === 0 ? 'Nothing here yet' : `${items.length} item${items.length > 1 ? 's' : ''} · Cash on Delivery available`}
      </p>

      {items.length === 0 ? (
        <EmptyState
          icon={<FaShoppingBag size={30} />}
          title="Your cart is empty"
          subtitle="Browse the range or design a custom jersey — get ready for match day."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/shop" className="btn-primary text-sm">Start shopping</Link>
              <Link to="/customize" className="btn-dark text-sm"><FaTshirt /> Design a jersey</Link>
            </div>
          }
        />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* items */}
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.cartKey} className="card flex gap-4 p-4">
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl">
                  <ThumbImage src={it.image} gradient={it.gradient} name={it.name} className="h-full w-full" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-sm font-bold text-brand-900 sm:text-base">{it.name}</h3>
                      <p className="mt-0.5 text-xs text-ink/50">
                        {it.size && <span>Size: <b className="text-ink/70">{it.size}</b> · </span>}
                        {it.type === 'custom' ? <span className="text-accent-600"><FaTshirt className="mr-0.5 inline" />Custom design</span> : 'In-store product'}
                      </p>
                      {it.type === 'custom' && (
                        <Link to="/account?tab=custom" className="mt-0.5 inline-block text-[11px] font-semibold text-accent-600 hover:underline">
                          Track this design →
                        </Link>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-display text-base font-bold text-brand-900">{inr(it.price * it.qty)}</p>
                      {it.mrp > it.price && <p className="text-xs text-ink/40 line-through">{inr(it.mrp * it.qty)}</p>}
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QtyStepper small value={it.qty} onChange={(q) => updateQty(it.cartKey, q)} />
                    <button onClick={() => remove(it.cartKey)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600">
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/shop" className="btn-outline py-2.5 text-sm"><FaArrowRight className="rotate-180" /> Continue shopping</Link>
              <button onClick={clear} className="btn text-sm text-ink/50 hover:text-red-600">Clear cart</button>
            </div>
          </div>

          {/* summary */}
          <div>
            <div className="card sticky top-40 p-6">
              <h2 className="font-display text-lg font-bold text-brand-900">Order Summary</h2>

              {/* free delivery progress */}
              {remaining > 0 ? (
                <div className="mt-4 rounded-xl bg-brand-50 p-3">
                  <p className="flex items-center gap-2 text-xs font-semibold text-brand-800">
                    <FaRocket className="text-accent" /> You’re {inr(remaining)} away from free delivery!
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                  <FaRocket className="mr-1 inline" /> You’ve unlocked FREE delivery 🎉
                </p>
              )}

              {/* coupon */}
              <div className="mt-4">
                <label className="field-label">Coupon code</label>
                <div className="flex gap-2">
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SHUB10" className="field uppercase" />
                  <button onClick={applyCouponCode} disabled={checking} className="btn-dark shrink-0 px-4 py-2 text-xs">
                    {checking ? '…' : 'Apply'}
                  </button>
                </div>
                {coupon && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <FaTag /> {coupon.code} applied — {inr(coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value)} off
                  </p>
                )}
              </div>

              <dl className="mt-5 space-y-2.5 border-t border-ink/10 pt-4 text-sm">
                <div className="flex justify-between text-ink/70"><dt>MRP</dt><dd className="line-through">{inr(mrpTotal)}</dd></div>
                {flatDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600"><dt>Product discount</dt><dd>− {inr(flatDiscount)}</dd></div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600"><dt>Coupon ({coupon.code})</dt><dd>− {inr(couponDiscount)}</dd></div>
                )}
                <div className="flex justify-between text-ink/70"><dt>Shipping</dt><dd>{shipping === 0 ? <span className="font-semibold text-emerald-600">FREE</span> : inr(shipping)}</dd></div>
              </dl>

              <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                <span className="font-display font-bold text-brand-900">Total</span>
                <span className="font-display text-2xl font-bold text-brand-900">{inr(total)}</span>
              </div>
              <p className="mt-1 text-right text-xs text-ink/50">Pay on delivery · incl. all taxes</p>

              <button onClick={() => nav('/checkout')} className="btn-primary mt-5 w-full py-3.5 text-sm">
                Proceed to Checkout <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}