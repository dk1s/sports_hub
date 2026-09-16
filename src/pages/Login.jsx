import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt, FaChevronLeft, FaTruck, FaTshirt } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, toastOpts } from '../context/AppContext'
import { cn } from '../utils/format'

export default function Login() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { user, login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [errors, setErrors] = useState({})
  const handledRef = useRef(null)

  /* Redirect deterministically once auth state exists — works for login,
     register, and signed-in users who land on /login directly. */
  useEffect(() => {
    if (user && handledRef.current !== user._id) {
      handledRef.current = user._id
      const next = params.get('next')
      if (next === '/admin' && user.role !== 'admin') {
        toast.warning('The admin portal is for admin accounts only — signed you into your customer account instead.')
        nav('/dashboard')
      } else {
        nav(next || (user.role === 'admin' ? '/admin' : '/dashboard'))
      }
    }
  }, [user, params, nav])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (mode === 'register') {
      if (!form.name.trim()) errs.name = 'Full name is required.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
    } else {
      if (!form.email.trim()) errs.email = 'Email is required.'
    }
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.'
    if (mode === 'register' && form.phone && !/^[+\d][\d\s-]{9,14}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    try {
      const u = mode === 'login' ? await login({ email: form.email, password: form.password })
        : await register({ name: form.name, email: form.email, password: form.password, phone: form.phone })
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  const quickFill = (email, password) => {
    setMode('login')
    setForm((f) => ({ ...f, email, password }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster toastOptions={toastOpts} />
      <div className="lg:grid lg:min-h-screen lg:grid-cols-2">
        {/* Brand panel — hidden on small screens */}
        <aside className="relative hidden overflow-hidden bg-brand-950 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

          <Link to="/" className="relative inline-flex">
            <svg viewBox="0 0 240 36" className="h-9 w-auto">
              <rect x="0" y="4" width="28" height="28" rx="6" fill="#FF6B2C" />
              <path d="M8 14 L14 24 L20 14" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="14" cy="10" r="2.5" fill="#fff" />
              <text x="36" y="24" fontFamily="System-ui" fontSize="16" fontWeight="700" fill="#fff">Sports Hub</text>
              <text x="164" y="24" fontFamily="System-ui" fontSize="14" fontWeight="500" fill="#FF6B2C">Purnea</text>
            </svg>
          </Link>

          <div className="relative">
            <h2 className="font-display text-4xl font-bold leading-tight text-white">Gear up.<br />Play better.</h2>
            <p className="mt-4 max-w-sm text-white/60">
              Premium cricket & sports equipment, custom team jerseys, and swift delivery across Purnea.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3"><FaShieldAlt className="text-accent" /> Secure accounts & live order tracking</li>
              <li className="flex items-center gap-3"><FaTshirt className="text-accent" /> Save your custom jersey designs</li>
              <li className="flex items-center gap-3"><FaTruck className="text-accent" /> Fast doorstep delivery, cash on delivery</li>
            </ul>
          </div>

          <p className="relative text-xs text-white/40">© {new Date().getFullYear()} Sports Hub Purnea · All rights reserved.</p>
        </aside>

        {/* Form panel */}
        <main className="flex min-h-screen flex-col px-5 py-6 sm:px-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
              <FaChevronLeft size={11} /> Back to store
            </Link>
            <Link to="/" className="lg:hidden">
              <svg viewBox="0 0 240 36" className="h-8 w-auto">
                <rect x="0" y="4" width="28" height="28" rx="6" fill="#FF6B2C" />
                <path d="M8 14 L14 24 L20 14" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="14" cy="10" r="2.5" fill="#fff" />
                <text x="36" y="24" fontFamily="System-ui" fontSize="16" fontWeight="700" fill="#101828">Sports Hub</text>
                <text x="164" y="24" fontFamily="System-ui" fontSize="14" fontWeight="500" fill="#FF6B2C">Purnea</text>
              </svg>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-md">
              <h1 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
                {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
              </h1>
              <p className="mt-1 text-sm text-ink/50">
                {mode === 'login' ? 'Welcome back to Sports Hub Purnea.' : 'Join us to track orders & save your designs.'}
              </p>

              <div className="mt-6 grid grid-cols-2 rounded-full bg-brand-50 p-1">
                {['login', 'register'].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setErrors({}) }}
                    className={cn('rounded-full py-2 text-sm font-bold capitalize transition', mode === m ? 'bg-brand-700 text-white shadow' : 'text-ink/60')}
                  >
                    {m === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="field-label">Full name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                      <input value={form.name} onChange={set('name')} placeholder="e.g. Rahul Kumar" className={cn('field pl-10', errors.name && 'border-red-400')} />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>
                )}

                <div>
                  <label className="field-label">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                    <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" className={cn('field pl-10', errors.email && 'border-red-400')} />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="field-label">Phone (optional)</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                      <input value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className={cn('field pl-10', errors.phone && 'border-red-400')} />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>
                )}

                <div>
                  <label className="field-label">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                    <input type={show ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className={cn('field pl-10 pr-10', errors.password && 'border-red-400')} />
                    <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink">
                      {show ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <button type="submit" disabled={busy} className="btn-primary w-full py-3 text-sm">
                  {busy ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 rounded-xl border border-dashed border-ink/15 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/40">Demo logins (for preview)</p>
                <div className="space-y-1.5">
                  <button onClick={() => quickFill('admin@sportshubpurnea.com', 'admin123')} className="flex w-full items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-xs hover:bg-brand-100">
                    <span className="flex items-center gap-1.5 font-semibold text-brand-800"><FaShieldAlt /> Admin — admin@sportshubpurnea.com</span>
                    <b className="text-brand-700">admin123</b>
                  </button>
                  <button onClick={() => quickFill('rahul@example.com', 'customer123')} className="flex w-full items-center justify-between rounded-lg bg-accent-50 px-3 py-2 text-xs hover:bg-accent-100/60">
                    <span className="font-semibold text-accent-800">Customer — rahul@example.com</span>
                    <b className="text-accent-700">customer123</b>
                  </button>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-ink/40">
                Forgot password? This demo uses recovery via WhatsApp — <Link to="/contact" className="underline">message us</Link>.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-ink/30 lg:hidden">© {new Date().getFullYear()} Sports Hub Purnea</p>
        </main>
      </div>
    </div>
  )
}