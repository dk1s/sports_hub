import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  authApi,
  usersApi,
  settingsApi,
  couponsApi,
  loadCart,
  saveCart,
  getSession,
  destroySession,
} from '../services/api'
import { getCatalog } from '../data/products'

/* ---------------- Auth ---------------- */
export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const boot = async () => {
      const s = getSession()
      if (s) {
        const fresh = await usersApi.me().catch(() => null)
        if (fresh && !fresh.blocked) {
          setSession(s)
          setUser(fresh)
        } else {
          destroySession()
        }
      }
      setLoading(false)
    }
    boot()
  }, [])

  const sendOtp = useCallback(async (phone) => {
    const res = await authApi.sendOtp({ phone })
    return res
  }, [])

  const verifyOtp = useCallback(async ({ phone, code, name }) => {
    const res = await authApi.verifyOtp({ phone, code, name })
    setSession({ token: res.token })
    setUser(res.user)
    return res.user
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setSession(null)
    setUser(null)
    toast.success('Signed out. See you on the field!')
  }, [])

  const updateProfile = useCallback(
    async (patch) => {
      const updated = await usersApi.updateProfile(patch)
      setUser(updated)
      return updated
    },
    [],
  )

  const value = useMemo(
    () => ({ user, session, loading, sendOtp, verifyOtp, logout, updateProfile }),
    [user, session, loading, sendOtp, verifyOtp, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* ---------------- Cart ---------------- */
export const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [coupon, setCoupon] = useState(null)
  const cartKeyRef = React.useRef('sh:cart:guest')
  const { user } = useAuth()

  useEffect(() => {
    cartKeyRef.current = user ? `sh:cart:${user._id}` : 'sh:cart:guest'
    setItems(loadCart())
    setCoupon(null)
  }, [user])

  const persist = useCallback((next) => {
    setItems(next)
    saveCart(next)
  }, [])

  const add = useCallback(
    (product, { qty = 1, size, color, custom = null } = {}) => {
      const p = product ? getCatalog().find((x) => x.id === product) || { id: product } : null
      const key = custom
        ? `custom:${custom.kind}:${size || 'std'}:${Date.now().toString(36)}`
        : `${p.id}:${size || 'std'}`
      setItems((current) => {
        let next
        const existing = p ? current.find((it) => it.cartKey === key) : null
        if (existing) {
          next = current.map((it) =>
            it.cartKey === key ? { ...it, qty: Math.min(it.qty + qty, 20) } : it,
          )
        } else {
          const item = custom
            ? {
                cartKey: key,
                productId: 'custom',
                name: `${custom.name} (${size || 'std'})`,
                price: custom.price,
                mrp: custom.price,
                qty,
                size: size || null,
                color: null,
                gradient: null,
                image: custom.preview || null,
                type: 'custom',
                design: custom,
              }
            : {
                cartKey: key,
                productId: p.id,
                name: p.name,
                price: p.price,
                mrp: p.mrp,
                qty,
                size: size || null,
                color: color || (p.colors ? p.colors[0] : null),
                gradient: p.gradient || null,
                image: null,
                type: 'product',
                design: null,
              }
          next = [...current, item]
        }
        saveCart(next)
        toast.success(custom ? 'Custom design added to cart' : 'Added to cart')
        return next
      })
    },
    [],
  )

  const updateQty = useCallback(
    (key, qty) => {
      if (qty < 1) {
        setItems((c) => c.filter((it) => it.cartKey !== key))
        saveCart(items.filter((it) => it.cartKey !== key))
        return
      }
      setItems((c) => {
        const next = c.map((it) => (it.cartKey === key ? { ...it, qty: Math.min(qty, 20) } : it))
        saveCart(next)
        return next
      })
    },
    [items],
  )

  const remove = useCallback((key) => {
    setItems((c) => {
      const next = c.filter((it) => it.cartKey !== key)
      saveCart(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setItems([])
    saveCart([])
  }, [])

  const count = items.reduce((n, it) => n + it.qty, 0)

  const subtotal = items.reduce((n, it) => n + it.price * it.qty, 0)
  const mrpTotal = items.reduce((n, it) => n + (it.mrp || it.price) * it.qty, 0)
  const flatDiscount = mrpTotal - subtotal
  const couponDiscount = coupon
    ? coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value
    : 0

  const applyCoupon = useCallback(
    async (code) => {
      if (!code || !code.trim()) throw new Error('Enter a coupon code.')
      const c = await couponsApi.validate({ code })
      if (subtotal < c.minOrder) throw new Error(`This coupon needs an order above ₹${c.minOrder}.`)
      setCoupon(c)
      return c
    },
    [subtotal],
  )

  return (
    <CartContext.Provider
      value={{
        items, add, updateQty, remove, clear, count, subtotal, flatDiscount, mrpTotal,
        coupon, applyCoupon, setCoupon, couponDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

/* ---------------- Settings (store info) ---------------- */
export const SettingsContext = createContext(null)
export const useSettingsStore = () => useContext(SettingsContext)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [coupons, setCoupons] = useState([])

  const refresh = useCallback(async () => {
    const s = await settingsApi.get()
    const c = await couponsApi.list()
    setSettings(s)
    setCoupons(c)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ settings, coupons, refresh, setSettings }),
    [settings, coupons, refresh],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

/* global toast default config */
export const toastOpts = {
  duration: 2600,
  position: 'top-center',
  style: {
    background: '#0A342A',
    color: '#fff',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '12px',
  },
}