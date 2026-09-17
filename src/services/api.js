import bcrypt from 'bcryptjs'
import { products } from '../data/products'
import {
  seedUsers,
  seedOrders,
  seedCustomOrders,
  seedMessages,
  seedSettings,
  seedAddresses,
  coupons,
} from '../data/seed'
import { wait, uid, formatDate } from '../utils/format'

const KEYS = {
  users: 'sh:users',
  session: 'sh:session',
  orders: 'sh:orders',
  custom: 'sh:customOrders',
  messages: 'sh:messages',
  settings: 'sh:settings',
  addresses: 'sh:addresses',
  wishlist: 'sh:wishlist',
  coupons: 'sh:coupons',
  otps: 'sh:otps',
}

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

/* ---------------- seeding ---------------- */
const ensureSeed = () => {
  if (!localStorage.getItem(KEYS.users)) {
    const users = Object.fromEntries(seedUsers.map((u) => [u._id, u]))
    users.u_admin.passwordHash = bcrypt.hashSync('admin123', 10)
    users.u_customer.passwordHash = bcrypt.hashSync('customer123', 10)
    users.u_arjun.passwordHash = bcrypt.hashSync('customer123', 10)
    write(KEYS.users, users)
    write(KEYS.orders, seedOrders)
    write(KEYS.custom, seedCustomOrders)
    write(KEYS.messages, seedMessages)
    write(KEYS.settings, seedSettings)
    write(KEYS.addresses, seedAddresses)
    write(KEYS.wishlist, {})
    write(KEYS.coupons, coupons)
    write(KEYS.otps, {})
  }

  const settings = read(KEYS.settings, null)
  if (settings && (settings.whatsapp === '919000000000' || settings.phone === '+91 90000 00000')) {
    write(KEYS.settings, { ...settings, phone: '+91 82102 93271', whatsapp: '918210293271' })
  }
}

const after = (fn) => async (...args) => {
  ensureSeed()
  await wait(80 + Math.random() * 120)
  return fn(...args)
}

/* ---------------- in-memory cache (dedupe + TTL) ----------------
   Read-only endpoints go through `afterCached`, so repeated calls in the
   same tick share ONE promise, and repeat visits within the TTL return the
   cached value instantly instead of hitting "the network" again.
   Mutations invalidate the relevant keys explicitly. */
const cache = new Map()

export const invalidate = (...keys) => keys.forEach((k) => cache.delete(k))
export const invalidatePrefix = (prefix) => {
  cache.forEach((_, k) => {
    if (String(k).startsWith(prefix)) cache.delete(k)
  })
}
export const invalidateAll = () => cache.clear()

const cached = (key, fn, ttl) => {
  const hit = cache.get(key)
  const now = Date.now()
  if (hit) {
    if (hit.p) return hit.p // in-flight request — dedupe
    if (now - hit.t < ttl) return Promise.resolve(hit.v) // fresh value
    cache.delete(key)
  }
  const p = Promise.resolve(fn()).then((v) => {
    cache.set(key, { t: Date.now(), v })
    return v
  })
  cache.set(key, { p })
  const settle = () => {
    const cur = cache.get(key)
    if (cur && cur.p === p) delete cur.p
  }
  p.then(settle, settle)
  return p
}

const afterCached = (keyOrFn, ttl) => (fn) => async (...args) => {
  ensureSeed()
  const key = typeof keyOrFn === 'function' ? keyOrFn(...args) : keyOrFn
  const make = async () => {
    await wait(80 + Math.random() * 120)
    return fn(...args)
  }
  return cached(key, make, ttl)
}

/* ---------------- session helpers ---------------- */
export const getSession = () => read(KEYS.session, null)
const setSession = (session) => write(KEYS.session, session)
export const destroySession = () => localStorage.removeItem(KEYS.session)

const publicUser = ({ _id, name, email, role, phone, blocked, createdAt }) => ({
  _id, name, email, role, phone, blocked, createdAt,
})

/* ---------------- auth (phone + OTP) ----------------
   There is no SMS gateway in this demo, so `sendOtp` returns the code
   (`demoCode`) and the UI shows it to the user. Any phone that is not in
   the user list automatically creates a customer account on verify. */
const digitsOf = (p) => String(p || '').replace(/\D/g, '')
export const normalizePhone = (p) => {
  let d = digitsOf(p)
  if (d.length === 11 && d.startsWith('0')) d = '91' + d.slice(1)
  return d
}
export const formatPhone = (p) => {
  const d = normalizePhone(p)
  return d.length === 12 && d.startsWith('91') ? `+91 ${d.slice(2, 7)} ${d.slice(7)}` : `+${d}`
}

const OTP_TTL = 5 * 60 * 1000 // 5 minutes
const OTP_COOLDOWN = 30 * 1000 // 30s between sends

export const authApi = {
  sendOtp: after(async ({ phone }) => {
    const digits = normalizePhone(phone)
    if (digits.length < 10 || digits.length > 13) throw new Error('Please enter a valid phone number.')
    const users = read(KEYS.users, {})
    const existing = Object.values(users).some((u) => normalizePhone(u.phone) === digits)
    const otps = read(KEYS.otps, {})
    const now = Date.now()
    const prev = otps[digits]
    if (prev && now < prev.expiresAt && now - prev.sentAt < OTP_COOLDOWN)
      throw new Error(`Please wait ${Math.ceil((OTP_COOLDOWN - (now - prev.sentAt)) / 1000)}s before requesting another OTP.`)
    const code = String(Math.floor(100000 + Math.random() * 900000))
    otps[digits] = { code, sentAt: now, expiresAt: now + OTP_TTL }
    write(KEYS.otps, otps)
    return { phone: formatPhone(digits), demoCode: code, isNew: !existing }
  }),
  verifyOtp: after(async ({ phone, code, name }) => {
    const digits = normalizePhone(phone)
    const otps = read(KEYS.otps, {})
    const rec = otps[digits]
    if (!rec) throw new Error('No OTP was sent to this number. Request one first.')
    if (Date.now() > rec.expiresAt) {
      delete otps[digits]
      write(KEYS.otps, otps)
      throw new Error('This OTP has expired. Request a new one.')
    }
    if (String(rec.code) !== String(code || '').trim()) throw new Error('Incorrect OTP. Please check and try again.')
    delete otps[digits]
    write(KEYS.otps, otps)
    const users = read(KEYS.users, {})
    let user = Object.values(users).find((u) => normalizePhone(u.phone) === digits)
    if (!user) {
      user = {
        _id: uid('u'),
        name: (name || '').trim() || `Shopper ${digits.slice(-4)}`,
        email: `${digits}@otp.sportshub.local`,
        phone: formatPhone(digits),
        role: 'customer',
        blocked: false,
        createdAt: new Date().toISOString(),
      }
      users[user._id] = user
      write(KEYS.users, users)
    }
    const token = `sh_${user._id}_${Date.now().toString(36)}`
    setSession({ token, user: publicUser(user) })
    invalidateAll()
    return { token, user: publicUser(user) }
  }),
  me: () => getSession(),
  logout: () => {
    destroySession()
    invalidateAll()
  },
}

/* ---------------- profile / users ---------------- */
export const usersApi = {
  me: afterCached('auth:me', 3000)(() => {
    const s = getSession()
    if (!s) return null
    const users = read(KEYS.users, {})
    const u = users[s.user._id]
    return u ? publicUser(u) : null
  }),
  updateProfile: after(async ({ name, phone }) => {
    const s = getSession()
    if (!s) throw new Error('Not signed in.')
    const users = read(KEYS.users, {})
    if (users[s.user._id]) {
      if (name) users[s.user._id].name = name
      if (phone !== undefined) users[s.user._id].phone = phone
      write(KEYS.users, users)
      setSession({ token: s.token, user: publicUser(users[s.user._id]) })
      invalidate('auth:me')
    }
    return publicUser(users[s.user._id])
  }),
  changePassword: after(async ({ current, next }) => {
    const s = getSession()
    if (!s) throw new Error('Not signed in.')
    const users = read(KEYS.users, {})
    const u = users[s.user._id]
    if (!u.passwordHash) throw new Error('Password login is disabled for this account — use phone OTP to sign in.')
    if (!bcrypt.compareSync(current || '', u.passwordHash)) throw new Error('Current password is incorrect.')
    if (!next || next.length < 6) throw new Error('New password must be at least 6 characters.')
    u.passwordHash = bcrypt.hashSync(next, 10)
    write(KEYS.users, users)
    invalidate('auth:me')
    return true
  }),
  all: afterCached('admin:users', 15000)(() => {
    assertAdmin()
    const users = read(KEYS.users, {})
    return Object.values(users).map(publicUser)
  }),
  toggleBlock: after(async ({ userId }) => {
    assertAdmin()
    const users = read(KEYS.users, {})
    const u = users[userId]
    if (!u) throw new Error('User not found.')
    if (u.role === 'admin') throw new Error('Admin accounts cannot be blocked.')
    u.blocked = !u.blocked
    write(KEYS.users, users)
    invalidate('admin:users')
    return publicUser(u)
  }),
}

/* ---------------- addresses & wishlist ---------------- */
export const addressesApi = {
  list: afterCached(() => `addr:${getSession()?.user?._id || 'guest'}`, 10000)(() => {
    const s = getSession()
    const all = read(KEYS.addresses, [])
    return s ? all.filter((a) => a.userId === s.user._id) : []
  }),
  save: after(async (address) => {
    const s = getSession()
    if (!s) throw new Error('Sign in to save addresses.')
    const all = read(KEYS.addresses, [])
    const list = all.filter((a) => a.userId === s.user._id)
    const payload = { id: address.id || uid('addr'), userId: s.user._id, ...address }
    const idx = list.findIndex((a) => a.id === payload.id)
    if (idx >= 0) list[idx] = payload
    else list.push(payload)
    if (payload.isDefault) list.forEach((a) => (a.isDefault = a.id === payload.id))
    write(KEYS.addresses, all.filter((a) => a.userId !== s.user._id).concat(list))
    invalidate(`addr:${s.user._id}`)
    return payload
  }),
  remove: after(({ id }) => {
    const s = getSession()
    if (!s) return
    write(KEYS.addresses, read(KEYS.addresses, []).filter((a) => !(a.id === id && a.userId === s.user._id)))
    invalidate(`addr:${s.user._id}`)
  }),
}

export const wishlistApi = {
  list: afterCached(() => `wl:${getSession()?.user?._id || 'guest'}`, 10000)(() => {
    const s = getSession()
    const all = read(KEYS.wishlist, {})
    if (!s) return []
    return all[s.user._id] || []
  }),
  toggle: after(({ productId }) => {
    const s = getSession()
    if (!s) throw new Error('Sign in to save items to your wishlist.')
    const all = read(KEYS.wishlist, {})
    const list = all[s.user._id] || []
    const has = list.includes(productId)
    all[s.user._id] = has ? list.filter((id) => id !== productId) : [...list, productId]
    write(KEYS.wishlist, all)
    invalidate(`wl:${s.user._id}`)
    return all[s.user._id]
  }),
}

/* ---------------- cart sync (bestseller data) ---------------- */
export const cartKey = () => {
  const s = getSession()
  return s ? `sh:cart:${s.user._id}` : 'sh:cart:guest'
}
export const loadCart = () => read(cartKey(), [])
export const saveCart = (items) => write(cartKey(), items)

const hydrateItems = (items) =>
  items.map((it) => {
    const p = products.find((pr) => pr.id === it.productId) || {}
    return {
      productId: it.productId,
      name: it.name || p.name,
      image: it.image ?? p.gradient?.[0],
      gradient: p.gradient || null,
      qty: it.qty,
      size: it.size || null,
      color: it.color || null,
      price: it.price || p.price,
      mrp: it.mrp || p.mrp,
      type: it.type || 'product',
      design: it.design || null,
    }
  })

/* ---------------- orders ---------------- */
const orderStatusFlow = ['Pending', 'Confirmed', 'Shipped', 'Delivered']
const allStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export const ordersApi = {
  create: after(async ({ items, address, couponCode, paymentMethod = 'COD', note }) => {
    const s = getSession()
    const orders = read(KEYS.orders, [])
    const hydrated = hydrateItems(items)
    if (!hydrated.length) throw new Error('Your cart is empty.')
    const coupon = couponCode ? read(KEYS.coupons, []).find((c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.active) : null
    const subtotal = hydrated.reduce((sum, it) => sum + it.price * it.qty, 0)
    const mrpTotal = hydrated.reduce((sum, it) => sum + (it.mrp || it.price) * it.qty, 0)
    const flatDiscount = mrpTotal - subtotal
    const couponDiscount =
      coupon && subtotal >= coupon.minOrder
        ? Math.round(coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value)
        : 0
    const settings = read(KEYS.settings, seedSettings)
    const shipping = subtotal - flatDiscount - couponDiscount >= settings.freeDeliveryAbove ? 0 : 49
    const total = subtotal - couponDiscount + shipping
    const no = `SH-${1000 + orders.length + 1}`
    const order = {
      _id: uid('o'),
      no,
      userId: s?.user._id || null,
      items: hydrated,
      totals: { subtotal, discount: flatDiscount + couponDiscount, shipping, total },
      customer: {
        name: address?.name || (s?.user.name),
        phone: address?.phone || '',
        email: s?.user.email,
      },
      address,
      payment: { method: paymentMethod, status: 'pending' },
      status: 'Pending',
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      coupon: coupon ? coupon.code : null,
      note: note || '',
    }
    orders.unshift(order)
    write(KEYS.orders, orders)
    invalidatePrefix('ord:mine:')
    invalidate('admin:orders', 'admin:stats')
    return order
  }),
  mine: afterCached(() => `ord:mine:${getSession()?.user?._id || 'guest'}`, 15000)(() => {
    const s = getSession()
    if (!s) return []
    return read(KEYS.orders, [])
      .filter((o) => o.userId === s.user._id)
      .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
  }),
  byId: afterCached(({ id }) => `ord:byId:${id}`, 10000)(({ id }) => read(KEYS.orders, []).find((o) => o._id === id || o.no === id) || null),
  all: afterCached('admin:orders', 15000)(() => {
    assertAdmin()
    return read(KEYS.orders, [])
      .map((o) => ({ ...o, _customer: o.customer?.name || (read(KEYS.users, {})[o.userId]?.name || 'Guest'), _email: o.customer?.email }))
      .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
  }),
  updateStatus: after(async ({ id, status }) => {
    assertAdmin()
    const orders = read(KEYS.orders, [])
    const order = orders.find((o) => o._id === id)
    if (!order) throw new Error('Order not found.')
    if (!allStatuses.includes(status)) throw new Error('Invalid status.')
    order.status = status
    order.updatedAt = new Date().toISOString()
    write(KEYS.orders, orders)
    invalidate(`ord:byId:${id}`, 'admin:orders', 'admin:stats')
    invalidatePrefix('ord:mine:')
    return order
  }),
  stats: afterCached('admin:stats', 15000)(() => {
    assertAdmin()
    const orders = read(KEYS.orders, [])
    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totals.total, 0)
    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingCount: orders.filter((o) => o.status === 'Pending').length,
      deliveredCount: orders.filter((o) => o.status === 'Delivered').length,
      cancelledCount: orders.filter((o) => o.status === 'Cancelled').length,
      byStatus: allStatuses.map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length })),
    }
  }),
}

/* ---------------- custom t-shirt orders ---------------- */
export const customStatusFlow = ['Pending', 'In Review', 'Approved — Printing', 'Shipped']

export const customOrdersApi = {
  submit: after(async (payload) => {
    const s = getSession()
    const custom = read(KEYS.custom, [])
    const base = {
      _id: uid('c'),
      no: `CT-${5000 + custom.length + 1}`,
      userId: s?.user._id || null,
      status: 'Pending',
      adminNotes: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
    const record = { ...base, ...payload }
    custom.unshift(record)
    write(KEYS.custom, custom)
    invalidatePrefix('cust:mine:')
    invalidate('admin:custom')
    return record
  }),
  mine: afterCached(() => `cust:mine:${getSession()?.user?._id || 'guest'}`, 15000)(() => {
    const s = getSession()
    if (!s) return []
    return read(KEYS.custom, [])
      .filter((c) => c.userId === s.user._id)
      .sort((a, b) => new Date(b.created) - new Date(a.created))
  }),
  all: afterCached('admin:custom', 15000)(() => {
    assertAdmin()
    return read(KEYS.custom, []).sort((a, b) => new Date(b.created) - new Date(a.created))
  }),
  updateStatus: after(async ({ id, status }) => {
    assertAdmin()
    const custom = read(KEYS.custom, [])
    const rec = custom.find((c) => c._id === id)
    if (!rec) throw new Error('Order not found.')
    rec.status = status
    rec.updated = new Date().toISOString()
    write(KEYS.custom, custom)
    invalidate('admin:custom')
    invalidatePrefix('cust:mine:')
    return rec
  }),
  setNotes: after(async ({ id, notes }) => {
    assertAdmin()
    const custom = read(KEYS.custom, [])
    const rec = custom.find((c) => c._id === id)
    if (!rec) throw new Error('Order not found.')
    rec.adminNotes = notes
    rec.updated = new Date().toISOString()
    write(KEYS.custom, custom)
    invalidate('admin:custom')
    invalidatePrefix('cust:mine:')
    return rec
  }),
}

/* ---------------- contact messages ---------------- */
export const messagesApi = {
  submit: after(async (payload) => {
    const messages = read(KEYS.messages, [])
    const rec = {
      _id: uid('m'),
      ...payload,
      status: 'new',
      created: new Date().toISOString(),
    }
    messages.unshift(rec)
    write(KEYS.messages, messages)
    invalidate('admin:messages')
    return rec
  }),
  all: afterCached('admin:messages', 15000)(() => {
    assertAdmin()
    return read(KEYS.messages, []).sort((a, b) => new Date(b.created) - new Date(a.created))
  }),
  setStatus: after(async ({ id, status }) => {
    assertAdmin()
    const messages = read(KEYS.messages, [])
    const rec = messages.find((m) => m._id === id)
    if (!rec) throw new Error('Message not found.')
    rec.status = status
    write(KEYS.messages, messages)
    invalidate('admin:messages')
    return rec
  }),
  remove: after(async ({ id }) => {
    assertAdmin()
    write(KEYS.messages, read(KEYS.messages, []).filter((m) => m._id !== id))
    invalidate('admin:messages')
  }),
}

/* ---------------- settings ---------------- */
export const settingsApi = {
  get: afterCached('settings', 60000)(() => read(KEYS.settings, seedSettings)),
  update: after(async (patch) => {
    assertAdmin()
    const settings = { ...read(KEYS.settings, seedSettings), ...patch }
    write(KEYS.settings, settings)
    invalidate('settings')
    return settings
  }),
}

export const couponsApi = {
  list: afterCached('coupons', 60000)(() => read(KEYS.coupons, [])),
  validate: after(({ code }) => {
    const c = read(KEYS.coupons, []).find((c) => c.code.toUpperCase() === (code || '').trim().toUpperCase())
    if (!c || !c.active) throw new Error('Invalid coupon code.')
    return c
  }),
}

/* ---------------- admin guard ---------------- */
const assertAdmin = () => {
  const s = getSession()
  if (!s || s.user.role !== 'admin')
    throw new Error('You must be logged in as an admin to do that.')
}

export const adminSeedReset = () => {
  ;['users', 'session', 'orders', 'custom', 'messages', 'settings', 'addresses', 'wishlist', 'coupons', 'otps'].forEach((k) =>
    localStorage.removeItem(KEYS[k]),
  )
  invalidateAll()
}

export { orderStatusFlow, allStatuses, formatDate }