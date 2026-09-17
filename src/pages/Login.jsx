import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FaMobileAlt, FaShieldAlt, FaEye, FaChevronLeft, FaTruck, FaTshirt, FaKey } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, toastOpts } from '../context/AppContext'
import { cn } from '../utils/format'

const DEMO_ACCOUNTS = [
  { label: 'Admin', sub: 'Store Admin', phone: '+91 70000 00001' },
  { label: 'Customer', sub: 'Rahul (seeded)', phone: '+91 98765 43210' },
  { label: 'Customer 2', sub: 'Arjun (seeded)', phone: '+91 87654 32109' },
]

export default function Login() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { user, sendOtp, verifyOtp } = useAuth()

  const [step, setStep] = useState('phone') // 'phone' | 'otp'
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [demoCode, setDemoCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const handledRef = useRef(null)

  /* Redirect deterministically once auth state exists — works for every
     login mode and for signed-in users who land on /login directly. */
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

  /* resend countdown */
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const startCooldown = () => setCooldown(30)

  const getOtp = async () => {
    if (!phone.trim()) return toast.error('Enter your phone number.')
    setBusy(true)
    try {
      const res = await sendOtp(phone)
      setIsNew(res.isNew)
      setDemoCode(res.demoCode)
      toast.success(`OTP sent to ${res.phone}`)
      setStep('otp')
      startCooldown()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  const verify = async () => {
    if (!/^\d{6}$/.test(otp.trim())) return toast.error('Enter the 6-digit OTP.')
    setBusy(true)
    try {
      const u = await verifyOtp({ phone, code: otp.trim(), name })
      toast.success(`Welcome, ${u.name.split(' ')[0]}!`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  const backToPhone = () => {
    setStep('phone')
    setOtp('')
    setDemoCode('')
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
              Premium cricket &amp; sports equipment, custom team jerseys, and swift delivery across Purnea.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3"><FaMobileAlt className="text-accent" /> Quick sign-in with your phone number</li>
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
                {step === 'phone' ? 'Sign in with your phone' : 'Verify your number'}
              </h1>
              <p className="mt-1 text-sm text-ink/50">
                {step === 'phone'
                  ? 'Enter your phone number to get a one-time password. New numbers get an account automatically.'
                  : `We sent a 6-digit code to ${phone || 'your number'}.`}
              </p>

              {step === 'phone' ? (
                <>
                  <div className="mt-6">
                    <label className="field-label">Phone number</label>
                    <div className="relative">
                      <FaMobileAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ''))}
                        placeholder="+91 98765 43210"
                        inputMode="tel"
                        autoComplete="tel"
                        onKeyDown={(e) => e.key === 'Enter' && getOtp()}
                        className="field pl-10"
                      />
                    </div>
                  </div>
                  <button onClick={getOtp} disabled={busy} className="btn-primary mt-4 w-full py-3 text-sm">
                    <FaKey /> {busy ? 'Sending…' : 'Get OTP'}
                  </button>

                  <div className="mt-6 rounded-xl border border-dashed border-ink/15 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/40">Demo accounts (no real SMS)</p>
                    <div className="space-y-1.5">
                      {DEMO_ACCOUNTS.map((d, i) => (
                        <button
                          key={i}
                          onClick={() => setPhone(d.phone)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-xs hover:bg-brand-100',
                            phone === d.phone && 'ring-2 ring-accent',
                          )}
                        >
                          <span className="font-semibold text-brand-800">{d.phone}</span>
                          <b className="text-brand-700">{d.label}</b>
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] text-ink/40">Tap one to fill the number, then hit “Get OTP”. The code is shown on screen for this preview.</p>
                  </div>
                </>
              ) : (
                <>
                  {demoCode && (
                    <div className="mt-5 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
                      <FaShieldAlt className="text-lg text-amber-600" />
                      <div className="text-sm">
                        <p className="font-semibold text-amber-800">Demo OTP (no SMS in this preview)</p>
                        <p className="font-mono text-lg font-bold tracking-[0.4em] text-amber-900">{demoCode}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-5">
                    <label className="field-label">Enter 6-digit OTP</label>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="••••••"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      onKeyDown={(e) => e.key === 'Enter' && verify()}
                      className="field text-center font-mono text-lg tracking-[0.5em]"
                    />
                  </div>

                  {isNew && (
                    <div className="mt-3">
                      <label className="field-label">Your name <span className="text-ink/40">(optional — new number)</span></label>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Kumar" className="field" />
                    </div>
                  )}

                  <button onClick={verify} disabled={busy} className="btn-primary mt-4 w-full py-3 text-sm">
                    <FaShieldAlt /> {busy ? 'Verifying…' : 'Verify & Continue'}
                  </button>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <button onClick={backToPhone} className="font-semibold text-ink/50 hover:text-brand-700">← Change number</button>
                    <button
                      onClick={getOtp}
                      disabled={cooldown > 0 || busy}
                      className="font-semibold text-accent-600 hover:underline disabled:cursor-not-allowed disabled:text-ink/30"
                    >
                      {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </>
              )}

              <p className="mt-6 text-center text-xs text-ink/40">
                Need help? <Link to="/contact" className="underline">Message us on WhatsApp</Link>.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-ink/30 lg:hidden">© {new Date().getFullYear()} Sports Hub Purnea</p>
        </main>
      </div>
    </div>
  )
}