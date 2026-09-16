import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import {
  FaShoppingBag, FaUserCircle, FaBars, FaTimes, FaPhoneAlt,
  FaWhatsapp, FaChevronRight, FaSignOutAlt, FaCog, FaTshirt, FaSearch
} from 'react-icons/fa'
import SearchBar from './SearchBar'
import { useAuth, useCart, useSettingsStore } from '../../context/AppContext'
import { navLinks } from '../../data/seed'
import { inr } from '../../utils/format'

const Logo = () => (
  <svg viewBox="0 0 240 36" className="h-8 w-auto sm:h-9">
    <rect x="0" y="4" width="28" height="28" rx="6" fill="#FF6B2C" />
    <path d="M8 14 L14 24 L20 14" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="14" cy="10" r="2.5" fill="#fff" />
    <text x="36" y="24" fontFamily="System-ui" fontSize="16" fontWeight="700" fill="#101828">Sports Hub</text>
    <text x="164" y="24" fontFamily="System-ui" fontSize="14" fontWeight="500" fill="#FF6B2C">Purnea</text>
  </svg>
)

export default function Header() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const { settings } = useSettingsStore()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname, search } = useLocation()

  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
  }, [pathname, search])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', open)
    return () => document.body.classList.remove('overflow-hidden')
  }, [open])

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl ring-1 ring-ink/5">
      {/* Top strip */}
      <div className="hidden bg-brand-900 text-xs text-white/80 sm:block">
        <div className="container-x flex items-center justify-between py-1.5">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <FaPhoneAlt className="text-accent" /> {settings?.phone || '+91 90000 00000'}
            </span>
            <a
              href={`https://wa.me/${settings?.whatsapp || '919000000000'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
            >
              <FaWhatsapp /> WhatsApp us
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery available</span>
            <span className="text-white/40">·</span>
            <span>Free delivery above ₹999</span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-x flex items-center gap-3 py-2">
        <button onClick={() => setOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-brand-50 lg:hidden">
          <FaBars className="text-xl text-ink" />
        </button>

        <Link to="/" className="shrink-0" aria-label="Home">
          <Logo />
        </Link>

        <div className="mx-4 hidden max-w-md flex-1 lg:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button onClick={() => setSearchOpen((v) => !v)} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-brand-50 lg:hidden" aria-label="Search">
            <FaSearch className="text-lg text-ink/60" />
          </button>

          {user ? (
            <div className="relative group">
              <button className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-brand-50 sm:flex">
                <FaUserCircle className="text-lg text-brand-700" />
                <span className="max-w-[100px] truncate text-ink/80">{user.name.split(' ')[0]}</span>
              </button>
              <div className="invisible absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-2xl border border-ink/10 bg-white py-2 shadow-panel transition group-hover:visible">
                <p className="px-4 pb-2 text-xs text-ink/50">Signed in as <span className="font-medium text-ink/80">{user.email}</span></p>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-brand-50"><FaUserCircle /> Dashboard</Link>
                <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-brand-50"><FaUserCircle /> My Account</Link>
                <Link to="/account?tab=orders" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-brand-50"><FaShoppingBag /> My Orders</Link>
                <Link to="/customize" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-brand-50"><FaTshirt /> Custom Jersey</Link>
                {user.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-brand-50"><FaCog /> Admin Panel</Link>}
                <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><FaSignOutAlt /> Sign Out</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-brand-50 sm:flex">
              <FaUserCircle className="text-lg text-ink/60" />
              <span className="hidden text-ink/80 md:inline">Sign In</span>
            </Link>
          )}

          <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-brand-50">
            <FaShoppingBag className="text-xl text-ink/70" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search drawer */}
      {searchOpen && (
        <div className="border-t border-ink/5 bg-white px-4 py-3 lg:hidden">
          <SearchBar autoFocus onDone={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Desktop nav */}
      <nav className="hidden border-t border-ink/5 bg-white/70 backdrop-blur lg:block">
        <div className="container-x flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-semibold text-ink/70 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile drawer — portals to <body> so backdrop-filter on the
          sticky header (a containing block for `position: fixed`) can't
          trap the drawer inside the header strip. */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="relative flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-panel">
              <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
                <Logo />
                <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-ink/5">
                  <FaTimes className="text-ink/60" />
                </button>
              </div>
              <div className="border-b border-ink/10 px-4 py-3">
                <SearchBar onDone={() => setOpen(false)} />
              </div>
              <nav className="min-h-0 flex-1 overflow-y-auto py-2">
                {navLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="flex items-center justify-between px-5 py-2.5 text-sm font-semibold text-ink/80 hover:bg-brand-50 hover:text-brand-700">
                    {l.label} <FaChevronRight className="text-ink/30" />
                  </Link>
                ))}
              </nav>
              <div className="border-t border-ink/10 p-4 space-y-2">
                {user ? (
                  <>
                    <p className="text-xs text-ink/50">Signed in as <b className="text-ink/80">{user.email}</b></p>
                    <Link to="/account" className="btn-primary w-full text-sm py-2.5">My Account</Link>
                    <button onClick={logout} className="btn-outline w-full text-sm py-2.5">Sign Out</button>
                  </>
                ) : (
                  <Link to="/login" className="btn-primary w-full text-sm py-2.5">Sign In / Register</Link>
                )}
                <a
                  href={`https://wa.me/${settings?.whatsapp || '919000000000'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-full border border-emerald-500 bg-emerald-500 text-sm py-2.5 text-white hover:bg-emerald-600"
                >
                  <FaWhatsapp /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  )
}