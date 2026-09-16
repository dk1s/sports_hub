import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FaShoppingBag, FaRupeeSign, FaTshirt, FaExclamationTriangle, FaWallet, FaBoxOpen, FaRedoAlt
} from 'react-icons/fa'
import { useGetStatsQuery, useGetAdminOrdersQuery, useGetCustomAllQuery, useGetCatalogQuery } from '../../services/apiSlice'
import { ErrorState } from '../../components/ui/Async'
import { Spinner, StatusBadge } from '../../components/ui/misc'
import { formatDate, inr, cn } from '../../utils/format'

const statusColor = (s) => {
  const map = {
    Pending: 'bg-amber-500', Confirmed: 'bg-blue-500', Shipped: 'bg-violet-500',
    Delivered: 'bg-emerald-500', Cancelled: 'bg-red-400',
  }
  return map[s] || 'bg-ink/30'
}

export default function Dashboard() {
  const statsQ = useGetStatsQuery()
  const ordersQ = useGetAdminOrdersQuery()
  const customQ = useGetCustomAllQuery()
  const catalogQ = useGetCatalogQuery()

  const stats = statsQ.data
  const orders = ordersQ.data || []
  const custom = customQ.data || []
  const catalog = catalogQ.data || []

  const loading = statsQ.isLoading || ordersQ.isLoading || customQ.isLoading || catalogQ.isLoading
  const hasError = statsQ.isError || ordersQ.isError || customQ.isError || catalogQ.isError
  const refresh = () => [statsQ, ordersQ, customQ, catalogQ].forEach((q) => q.refetch())

  const lowStock = useMemo(() => catalog.filter((p) => p.stock <= 10), [catalog])
  const pendingCustom = custom.filter((c) => !['Approved — Printing', 'Shipped'].includes(c.status)).length

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: <FaShoppingBag />, color: 'bg-brand-700', to: '/admin/orders' },
    { label: 'Revenue (excl. cancelled)', value: inr(stats?.totalRevenue ?? 0), icon: <FaRupeeSign />, color: 'bg-emerald-600', to: '/admin/orders' },
    { label: 'Pending Orders', value: stats?.pendingCount ?? '—', icon: <FaWallet />, color: 'bg-amber-500', to: '/admin/orders' },
    { label: 'Custom Orders (active)', value: pendingCustom, icon: <FaTshirt />, color: 'bg-violet-600', to: '/admin/custom' },
    { label: 'Low Stock Products', value: lowStock.length, icon: <FaExclamationTriangle />, color: 'bg-red-500', to: '/admin/products' },
  ]

  const maxStatus = Math.max(1, ...(stats?.byStatus || []).map((s) => s.count))

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admin · Overview</p>
          <h1 className="font-display text-2xl font-bold text-brand-900">Dashboard</h1>
          <p className="text-sm text-ink/50">A live snapshot of your store.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products" className="btn-outline py-2 text-xs">+ Add product</Link>
          <Link to="/" className="btn-dark py-2 text-xs">View store</Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : hasError ? (
        <ErrorState title="Could not load dashboard stats" onRetry={refresh} />
      ) : (
        <>
          {/* stat cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {statCards.map((c) => (
              <Link key={c.label} to={c.to} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white', c.color)}>{c.icon}</span>
                <p className="font-display text-xl font-bold text-brand-900 sm:text-2xl">{c.value}</p>
                <p className="text-xs font-semibold text-ink/50">{c.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            {/* orders by status chart */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-brand-900">Orders by Status</h2>
                <button onClick={refresh} title="Refresh stats" className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/40 transition hover:bg-brand-50 hover:text-brand-700">
                  <FaRedoAlt />
                </button>
              </div>
              {stats?.byStatus.every((s) => s.count === 0) ? (
                <p className="py-10 text-center text-sm text-ink/50">No orders yet — they will appear here.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {stats?.byStatus.map((s) => (
                    <div key={s.status} className="flex items-center gap-3">
                      <span className="w-24 text-xs font-semibold text-ink/60">{s.status}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink/8">
                        <div
                          className={cn('h-full rounded-full transition-all', statusColor(s.status))}
                          style={{ width: `${(s.count / maxStatus) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-display text-sm font-bold text-brand-900">{s.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* low stock */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-ink/8 px-6 py-4">
                <h2 className="font-display font-bold text-brand-900">Low Stock Alerts</h2>
                <span className="chip bg-red-50 text-red-700 ring-1 ring-red-200">{lowStock.length} item{lowStock.length === 1 ? '' : 's'}</span>
              </div>
              {lowStock.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-ink/50">All products are well stocked. 🎉</p>
              ) : (
                <ul className="divide-y divide-ink/8">
                  {lowStock.slice(0, 5).map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 px-6 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                        <p className="text-xs text-ink/50">{p.brand}</p>
                      </div>
                      <span className={cn('chip shrink-0', p.stock <= 5 ? 'bg-red-50 text-red-700 ring-red-200' : 'bg-amber-50 text-amber-700 ring-amber-200')}><FaBoxOpen className="mr-1" />{p.stock}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* recent orders */}
          <div className="card mt-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink/8 px-6 py-4">
              <h2 className="font-display font-bold text-brand-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm font-bold text-accent-600 hover:underline">View all →</Link>
            </div>
            {orders.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-ink/50">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink/8 text-left text-xs font-bold uppercase tracking-wider text-ink/40">
                      <th className="px-6 py-3">Order</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {orders.slice(0, 6).map((o) => (
                      <tr key={o._id} className="hover:bg-brand-50/40">
                        <td className="px-6 py-3 font-bold text-brand-800">#{o.no}</td>
                        <td className="px-6 py-3">{o._customer}</td>
                        <td className="px-6 py-3 text-ink/50">{formatDate(o.placedAt)}</td>
                        <td className="px-6 py-3 font-semibold">{inr(o.totals.total)}</td>
                        <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}