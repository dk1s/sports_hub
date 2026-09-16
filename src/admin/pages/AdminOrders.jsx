import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaBox, FaEye, FaFilter, FaRedoAlt, FaExclamationTriangle } from 'react-icons/fa'
import { allStatuses } from '../../services/api'
import { useGetAdminOrdersQuery, useSetOrderStatusMutation } from '../../services/apiSlice'
import { ErrorState } from '../../components/ui/Async'
import { ThumbImage } from '../../components/ui/ProductImage'
import { StatusBadge } from '../../components/ui/misc'
import { inr, formatDate, cn } from '../../utils/format'

export default function AdminOrders() {
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [detail, setDetail] = useState(null)
  const [saving, setSaving] = useState(null)

  const { data: orders = [], isLoading, isError, refetch } = useGetAdminOrdersQuery()
  const [setOrderStatus] = useSetOrderStatusMutation()

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})
  const tabs = [{ s: 'All', n: orders.length }, ...allStatuses.map((s) => ({ s, n: counts[s] || 0 }))]
  const list = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  const setStatus = async (id, status) => {
    setSaving(id)
    try {
      await setOrderStatus({ id, status }).unwrap()
      if (detail?._id === id) setDetail((d) => (d ? { ...d, status } : d))
      toast.success(`Order marked ${status}`)
    } catch (e) {
      toast.error(e?.data?.message || e?.message)
    } finally {
      setSaving(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Sales</p>
          <h1 className="font-display text-2xl font-bold text-brand-900">Orders</h1>
          <p className="text-sm text-ink/50">{orders.length} total</p>
        </div>
        <button onClick={refetch} className="btn-outline py-2 text-xs"><FaRedoAlt /> Refresh</button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.s}
            onClick={() => setFilter(t.s)}
            className={cn('chip rounded-full px-4 py-2 text-xs font-bold transition', filter === t.s ? 'bg-brand-700 text-white' : 'bg-white text-ink/60 ring-1 ring-ink/10 hover:text-ink')}
          >
            {t.s} <span className={cn('ml-1 rounded-full px-1.5', filter === t.s ? 'bg-white/20' : 'bg-ink/5')}>{t.n}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}
        </div>
      ) : isError ? (
        <ErrorState title="Could not load orders" onRetry={refetch} />
      ) : orders.length === 0 ? (
        <div className="card px-6 py-16 text-center">
          <FaBox className="mx-auto mb-3 text-ink/20" size={30} />
          <p className="font-display font-bold text-brand-900">No orders yet</p>
          <p className="mt-1 text-sm text-ink/50">When customers place orders, they'll show up here.</p>
        </div>
      ) : list.length === 0 ? (
        <div className="card px-6 py-14 text-center text-sm text-ink/50">
          <FaFilter className="mx-auto mb-2 text-ink/20" size={24} /> No {filter} orders.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((o) => (
            <div key={o._id} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><FaBox /></span>
                  <div>
                    <p className="font-bold text-brand-900">#{o.no} <span className="ml-1 text-xs font-normal text-ink/40">· {formatDate(o.placedAt, { withTime: true })}</span></p>
                    <p className="text-xs text-ink/50">{o._customer} · {o.customer?.phone} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display font-bold text-brand-900">{inr(o.totals.total)}</span>
                  <StatusBadge status={o.status} />
                  <button onClick={() => setDetail(detail?._id === o._id ? null : o)} className="btn-outline px-3 py-1.5 text-xs"><FaEye /> Details</button>
                </div>
              </div>

              {detail?._id === o._id && (
                <div className="border-t border-ink/8 bg-brand-50/30 px-5 py-4">
                  <div className="grid gap-5 lg:grid-cols-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Items</p>
                      <ul className="mt-2 space-y-2">
                        {o.items.map((it, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <div className="h-9 w-8 shrink-0 overflow-hidden rounded"><ThumbImage src={it.image} gradient={it.gradient} name={it.name} className="h-full w-full" /></div>
                            <span className="min-w-0 flex-1 truncate text-ink/80">{it.name}{it.size ? ` (${it.size})` : ''} × {it.qty}</span>
                            <b className="text-xs">{inr(it.price * it.qty)}</b>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Customer & Delivery</p>
                      <p className="mt-2 text-sm text-ink/80">{o.customer?.name}<br />{o.customer?.phone}{o.customer?.email ? ` · ${o.customer.email}` : ''}</p>
                      {o.address ? (
                        <p className="mt-1 text-xs text-ink/60">{o.address.line1}{o.address.line2 ? ', ' + o.address.line2 : ''}, {o.address.city}, {o.address.state} — {o.address.pincode}</p>
                      ) : <p className="mt-1 text-xs text-ink/40">No address recorded.</p>}
                      <p className="mt-1 text-xs text-ink/60">Payment: <b>{o.payment.method}</b> ({o.payment.status}){o.coupon ? ` · coupon: ${o.coupon}` : ''}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Billing</p>
                      <dl className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between text-ink/70"><dt>Subtotal</dt><dd>{inr(o.totals.subtotal)}</dd></div>
                        <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>− {inr(o.totals.discount)}</dd></div>
                        <div className="flex justify-between text-ink/70"><dt>Shipping</dt><dd>{o.totals.shipping === 0 ? 'Free' : inr(o.totals.shipping)}</dd></div>
                        <div className="flex justify-between border-t border-ink/10 pt-1 font-bold text-brand-900"><dt>Total</dt><dd>{inr(o.totals.total)}</dd></div>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-ink/40">Update status:</span>
                    {allStatuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(o._id, s)}
                        disabled={s === o.status || saving === o._id}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-50',
                          s === o.status ? 'bg-brand-700 text-white' : 'bg-white text-ink/60 ring-1 ring-ink/15 hover:bg-brand-50',
                        )}
                      >
                        {s === o.status ? `✓ ${s}` : s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {isError && (
        <p className="mt-4 flex items-center gap-2 text-xs text-amber-600"><FaExclamationTriangle /> Your latest changes are safe — try refreshing.</p>
      )}
    </div>
  )
}