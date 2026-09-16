import React, { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FaTachometerAlt, FaBoxOpen, FaShoppingBag, FaTshirt, FaUsers, FaEnvelopeOpen, FaCog, FaStore, FaBars, FaTimes, FaSignOutAlt, FaShieldAlt, FaBan
} from 'react-icons/fa'
import { Toaster } from 'react-hot-toast'
import { useAuth, toastOpts } from '../context/AppContext'
import { InlinePageLoader } from '../components/ui/Async'
import { cn, initials } from '../utils/format'

const links = [
  { to: '/admin', end: true, label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/admin/products', label: 'Products', icon: <FaBoxOpen /> },
  { to: '/admin/orders', label: 'Orders', icon: <FaShoppingBag /> },
  { to: '/admin/custom', label: 'Custom T-Shirt Orders', icon: <FaTshirt /> },
  { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
  { to: '/admin/messages', label: 'Contact Messages', icon: <FaEnvelopeOpen /> },
  { to: '/admin/settings', label: 'Settings', icon: <FaCog /> },
]

/** 403 for signed-in non-admin accounts. */
function AccessDenied({ user }) {
  const { logout } = useAuth()
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-950 px-6 py-14">
      <div className="w-full max-w-md rounded-3xl bg-white/5 p-8 text-center ring-1 ring-white/10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 ring-1 ring-red-500/30">
          <FaBan size={24} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-white">Access restricted</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          You are signed in as <b className="text-white/90">{user.name}</b> ({user.email}) — a{' '}
          <b className="text-accent">{user.role}</b> account. The admin portal is available to{' '}
          <b className="text-white/90">admin</b> accounts only.
        </p>
        <div className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-xs text-white/50">
          Tip: sign out below and sign in with an admin account.
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link to="/" className="btn border border-white/20 bg-white/5 py-2.5 text-sm text-white hover:bg-white/10">
            <FaStore /> Back to store
          </Link>
          <button onClick={() => logout()} className="btn bg-accent py-2.5 text-sm text-white hover:bg-accent-600">
            <FaSignOutAlt /> Switch account
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)

  // Not signed in -> send to login with a return path. Non-admin -> AccessDenied.
  useEffect(() => {
    if (!loading && !user) nav('/login?next=/admin', { replace: true })
  }, [loading, user, nav])

  useEffect(() => {
    setOpen(false)
  }, [nav])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', open)
    return () => document.body.classList.remove('overflow-hidden')
  }, [open])

  if (loading) return <InlinePageLoader />
  if (!user) return null
  if (user.role !== 'admin') return <AccessDenied user={user} />

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
          <FaTshirt />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold text-white">Sports Hub, Purnea</p>
          <p className="flex items-center gap-1 text-[11px] text-white/50">
            <FaShieldAlt className="text-accent" /> Admin Panel
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
          {initials(user.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="truncate text-[11px] text-white/40">{user.email}</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition',
                isActive ? 'bg-accent text-white shadow-lift' : 'text-white/70 hover:bg-white/10 hover:text-white',
              )
            }
          >
            {l.icon} {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white">
          <FaStore /> View Storefront
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/20">
          <FaSignOutAlt /> Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F4F5F3]">
      <Toaster toastOptions={toastOpts} />
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-brand-950 lg:block">{Sidebar}</aside>

      {/* mobile topbar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-brand-950 px-4 py-3 text-white lg:hidden">
        <p className="font-display text-sm font-bold">Sports Hub Admin</p>
        <button onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
          <FaBars />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-brand-950/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto bg-brand-950 shadow-panel">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10">
              <FaTimes />
            </button>
            {Sidebar}
          </div>
        </div>
      )}

      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-8">
        <Suspense fallback={<InlinePageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}