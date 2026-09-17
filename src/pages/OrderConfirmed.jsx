import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaWhatsapp, FaHome, FaTshirt, FaPrint } from 'react-icons/fa'
import { useGetOrderByIdQuery } from '../services/apiSlice'
import { ThumbImage } from '../components/ui/ProductImage'
import { Spinner, StatusBadge } from '../components/ui/misc'
import { useSettingsStore } from '../context/AppContext'
import { inr, formatDate } from '../utils/format'

const Steps = ({ status }) => {
  const flow = ['Pending', 'Confirmed', 'Shipped', 'Delivered']
  const idx = flow.indexOf(status)
  return (
    <div className="mt-8 flex items-center">
      {flow.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                i <= idx ? 'bg-emerald-600 text-white' : 'border-2 border-ink/15 text-ink/40'
              }`}
            >
              {i < idx ? <FaCheckCircle /> : i + 1}
            </span>
            <span className={`mt-1.5 text-[10px] font-semibold ${i <= idx ? 'text-emerald-700' : 'text-ink/40'}`}>{s}</span>
          </div>
          {i < flow.length - 1 && (
            <span className={`mx-1 mb-5 h-0.5 flex-1 ${i < idx ? 'bg-emerald-600' : 'bg-ink/15'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function OrderConfirmed() {
  const { no } = useParams()
  const nav = useNavigate()
  const { settings } = useSettingsStore()

  const { data: order, isLoading, isError, refetch } = useGetOrderByIdQuery(no)

  if (isLoading) {
    return (
      <div className="container-x flex max-w-3xl justify-center py-24 text-center">
        <Spinner />
        <p className="mt-4 text-sm text-ink/50">Loading your order…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container-x max-w-3xl py-16 text-center">
        <h1 className="section-title">Could not load this order</h1>
        <p className="mt-2 text-sm text-ink/60">Something went wrong while fetching #{no}.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={refetch} className="btn-outline text-sm">Retry</button>
          <Link to="/account?tab=orders" className="btn-primary text-sm">Go to My Orders</Link>
        </div>
      </div>
    )
  }

  if (!order) {
    setTimeout(() => nav('/404'), 1200)
    return (
      <div className="container-x max-w-3xl py-16 text-center">
        <Spinner />
        <p className="mt-4 text-sm text-ink/50">Order not found — taking you back…</p>
      </div>
    )
  }

  const waLink = `https://wa.me/${settings?.whatsapp || '918210293271'}?text=Hi, I just placed order ${order.no} (${inr(order.totals.total)}). Please confirm it.`

  return (
    <div className="container-x max-w-3xl py-12">
      <div className="card overflow-hidden">
        <div className="bg-emerald-600 p-8 text-center text-white">
          <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <FaCheckCircle size={34} />
          </span>
          <h1 className="font-display text-3xl font-bold">Order placed! 🎉</h1>
          <p className="mt-1 text-emerald-50">Thanks for shopping at {settings?.name || 'Sports Hub, Purnea'}</p>
          <p className="mt-4 text-sm text-emerald-100">
            Order number: <b className="text-base text-white">{order.no}</b>
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="text-ink/60">Placed on <b className="text-ink">{formatDate(order.placedAt, { withTime: true })}</b></p>
            <StatusBadge status={order.status} />
          </div>

          <div className="mt-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200">
            <b>Cash on Delivery:</b> keep ₹{order.totals.total.toLocaleString('en-IN')} ready. We’ll call you at {order.customer.phone} before delivery.
          </div>

          <Steps status={order.status} />

          <div className="mt-8">
            <h3 className="font-display font-bold text-brand-900">Items in this order</h3>
            <div className="mt-3 divide-y divide-ink/8 rounded-2xl border border-ink/10">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg">
                    <ThumbImage src={it.image} gradient={it.gradient} name={it.name} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{it.name}</p>
                    <p className="text-xs text-ink/50">{it.size ? `Size ${it.size} · ` : ''}Qty {it.qty}{it.type === 'custom' && ' · Custom'}</p>
                  </div>
                  <span className="font-display text-sm font-bold">{inr(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          <dl className="mt-6 space-y-2 rounded-2xl bg-brand-50 p-5 text-sm">
            <div className="flex justify-between text-ink/70"><dt>Subtotal</dt><dd>{inr(order.totals.subtotal)}</dd></div>
            {order.totals.discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>− {inr(order.totals.discount)}</dd></div>}
            <div className="flex justify-between text-ink/70"><dt>Shipping</dt><dd>{order.totals.shipping === 0 ? 'FREE' : inr(order.totals.shipping)}</dd></div>
            <div className="flex justify-between border-t border-ink/10 pt-2 font-bold text-brand-900"><dt>Total (COD)</dt><dd>{inr(order.totals.total)}</dd></div>
          </dl>

          {order.address && (
            <div className="mt-6">
              <h3 className="font-display font-bold text-brand-900">Delivering to</h3>
              <p className="mt-1 text-sm text-ink/70">
                {order.address.name} · {order.address.phone}<br />
                {order.address.line1}{order.address.line2 ? ', ' + order.address.line2 : ''}, {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm"><FaWhatsapp /> Confirm on WhatsApp</a>
            <button onClick={() => window.print()} className="btn-outline text-sm"><FaPrint /> Print</button>
            {order.userId && <Link to="/account?tab=orders" className="btn-dark text-sm"><FaHome /> Track in My Account</Link>}
            <Link to="/shop" className="btn-primary text-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-brand-950 p-6 text-white">
          <h3 className="flex items-center gap-2 font-display font-bold"><FaTshirt className="text-accent" /> Ordered a custom design?</h3>
          <p className="mt-1 text-sm text-white/60">Track its printing status from <Link to="/account?tab=custom" className="font-semibold text-accent underline">My Account → Custom Orders</Link>. We’ll message you on WhatsApp once printing starts.</p>
        </div>
    </div>
  )
}