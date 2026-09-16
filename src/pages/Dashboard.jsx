import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  FaBox, FaTshirt, FaHeart, FaMapMarkerAlt, FaArrowRight, FaShoppingBag, FaStore, FaCheckCircle, FaHourglassHalf
} from 'react-icons/fa'
import { useAuth } from '../context/AppContext'
import {
  useGetOrdersMineQuery,
  useGetCustomMineQuery,
  useGetMyWishlistQuery,
  useGetMyAddressesQuery,
} from '../services/apiSlice'
import { StatusBadge, EmptyState } from '../components/ui/misc'
import { formatDate, initials } from '../utils/format'

const ORDER_STATUS_ICON = { Delivered: FaCheckCircle, Shipped: FaCheckCircle, Confirmed: FaHourglassHalf }

export default function Dashboard() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login?next=/dashboard" replace />
  const uid = user._id

  const ordersQ = useGetOrdersMineQuery(uid)
  const customQ = useGetCustomMineQuery(uid)
  const wishQ = useGetMyWishlistQuery(uid)
  const addrQ = useGetMyAddressesQuery(uid)

  const orders = ordersQ.data ?? []
  const custom = customQ.data ?? []
  const wishlist = wishQ.data ?? []
  const addresses = addrQ.data ?? []

  const stats = [
    { label: 'Orders', value: orders.length, icon: <FaBox />, tone: 'bg-brand-50 text-brand-700', to: '/account?tab=orders' },
    { label: 'Custom Designs', value: custom.length, icon: <FaTshirt />, tone: 'bg-accent-50 text-accent-700', to: '/account?tab=custom' },
    { label: 'Wishlist', value: wishlist.length, icon: <FaHeart />, tone: 'bg-red-50 text-red-600', to: '/account?tab=wishlist' },
    { label: 'Addresses', value: addresses.length, icon: <FaMapMarkerAlt />, tone: 'bg-emerald-50 text-emerald-700', to: '/account?tab=addresses' },
  ]

  const recent = [...orders]
    .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
    .slice(0, 3)

  return (
    <div className="container-x py-8">
      {/* greeting */}
      <div className="card overflow-hidden bg-brand-950">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-white">
              {initials(user.name)}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Welcome back</p>
              <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
              <p className="mt-0.5 text-sm text-white/60">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/shop" className="btn bg-white py-2.5 text-sm text-brand-950 hover:bg-white/90"><FaStore /> Shop Now</Link>
            <Link to="/customize" className="btn bg-accent py-2.5 text-sm text-white hover:bg-accent-600"><FaTshirt /> Design Jersey</Link>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-panel">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tone}`}>{s.icon}</span>
            <div>
              <p className="font-display text-2xl font-bold text-brand-900">{s.value}</p>
              <p className="text-xs font-semibold text-ink/50">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* recent orders */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-brand-900">Recent Orders</h2>
          <Link to="/account?tab=orders" className="inline-flex items-center gap-1 text-sm font-bold text-accent-600 hover:text-accent-700">
            View all <FaArrowRight size={11} />
          </Link>
        </div>

        {ordersQ.isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={<FaShoppingBag size={26} />}
            title="No orders yet"
            subtitle="When you place an order it will show up here."
            action={<Link to="/shop" className="btn-primary text-sm">Start shopping</Link>}
          />
        ) : (
          <div className="space-y-3">
            {recent.map((o) => {
              const Icon = ORDER_STATUS_ICON[o.status] || FaHourglassHalf
              return (
                <Link key={o._id} to={`/order/${o.no}`} className="card flex items-center gap-4 p-5 transition hover:shadow-panel">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Icon /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display font-bold text-brand-900">{o.no}</p>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-ink/50">{formatDate(o.placedAt)} · {o.items.length} item{o.items.length === 1 ? '' : 's'}</p>
                  </div>
                  <span className="text-sm font-bold text-brand-800">₹{o.totals?.total?.toLocaleString('en-IN')}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}