<<<<<<< HEAD
# 🏏 Sports Hub, Purnea — Frontend

A professional, modern **frontend-only e-commerce store** for a sports goods store in
Purnea, Bihar. Built with **React (Vite) + Tailwind CSS**, with a fully mocked
data/persistence layer (localStorage) so the entire experience — store, checkout,
admin panel and custom T-shirt designer — runs end-to-end inside the browser.

> Design language inspired by easyapply.com: bold dark hero, numbered step cards,
> stats band, testimonial & FAQ sections, strong CTAs and a clean multi-column footer.

---

## ✨ Features

**Storefront**
- Home (hero, marquee, stats, how-it-works steps, categories, bestsellers, custom-jersey CTA, testimonials, FAQ, final CTA)
- Shop with **filters** (category, subcategory, price, brand, size), **sorting** (popular, price, newest, rating) and **live search**
- Product detail page: multi-view gallery, size chart, stock status, quantity, Add to Cart / **Buy Now**
- **Custom T-Shirt / Jersey Studio**:
  1. **Interactive canvas designer** (fabric.js) — base colour, garment type, upload logo (drag/resize/rotate), name/number/team text, front/back views, live preview, save & add to cart as a custom product
  2. **Simple requirement form** — type, fabric, colour, sizes, quantity, player name/number, team name, logo upload, special notes
- Cart (persistent localStorage, per-user when logged in), coupon codes (`SHUB10`, `WIN20`, `JERSEY50`), free-delivery progress
- Checkout with **Cash on Delivery only**, saved addresses + order confirmation with status timeline
- User accounts: register/login, profile, change password, wishlist, address book, order history, custom-order tracking

**Admin panel (`/admin`)**
- Dashboard: totals, revenue, pending orders, low-stock alerts, orders-by-status chart, recent orders
- Products: full CRUD, bulk stock update, category/subcategory, live persistence
- Orders: all orders, update status, customer & shipping detail
- Custom orders: review each design (preview + details), status flow, admin notes
- Users: list, block/unblock
- Contact messages: inbox, mark read/resolved, reply, delete
- Settings: edit store phone, WhatsApp, email, address, map, timings — **live on the public footer & Contact page**

---

## 🚀 Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

## ⚡ Performance & reliability (done for the PR)

- **Route code-splitting** — every page (including each admin page) is `React.lazy` + `Suspense`. The main bundle is ~110 kB gzip; the heavy fabric.js designer chunk (~99 kB gzip) loads **only** when visiting `/customize`.
- **Reduced API calls** — `src/services/api.js` has a promise-dedupe + TTL in-memory cache. Repeated calls in the same tick share one request, repeat visits within the TTL return instantly, and every mutation invalidates exactly the affected keys. Simulated latency was also halved.
- **Optimistic updates** — status changes, notes, block/unblock, message handling and catalog edits update local UI state immediately instead of refetching whole lists.
- **Uniform data states** — a shared `useAsync` hook + `<Async>` renderer give every data view a **loader**, a friendly **retryable error card**, and a **"no data" empty state** (no more white screens).
- **Confirmation modals** — all destructive actions (`window.confirm` removed) now use the accessible `ConfirmDialog` provider (Esc/overlay cancel, focus management, success/warning/danger tones) — including a **"Place order (COD)?"** confirmation at checkout.
- **Error boundary** — a global `ErrorBoundary` catches any uncaught render error and shows a polished fallback instead of a blank page.

## 🔐 Admin access control

The admin portal is **not reachable by URL alone**:

- Signed out → `/admin` redirects to `/login?next=/admin`.
- Signed in as a **customer** (or any non-admin) → a branded **403 Access denied** screen (no sidebar, no data) with a "switch account" action.
- Signed in as **admin** → full portal. The "Admin Panel" link appears in the profile menu **only for admins**, and the old floating wrench shortcut was removed.
- All admin data endpoints double-check the session role server-side (the mock `assertAdmin()`), so even calling the API directly returns a rejection.

## 🎬 Demo logs

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@sportshubpurnea.com` | `admin123` |
| Customer | `rahul@example.com` | `customer123` |

Quick-fill buttons are also shown on the Login page. **Change the admin password on
first real use** (Account → Profile → Change password).

---

## 🗂️ Project structure

```
src/
  data/            # products (30 seeded), categories, seed users/orders/settings
  services/api.js  # localStorage-backed mock API (auth, orders, custom, etc.)
  context/         # Auth, Cart, Settings providers (React Context)
  components/
    layout/        # Header (search/cart/menu), Footer, WhatsApp float
    ui/            # ProductCard, ProductImage (SVG), badges, skeletons, misc
    home/          # hero, steps, categories, rows (sections for the homepage)
  pages/           # Home, Shop, ProductDetail, Customize, Designer, Cart, Checkout,
                   # OrderConfirmed, Account, Login, Contact, About, NotFound
  admin/           # AdminLayout + pages (Dashboard, Products, Orders, Custom, Users, Messages, Settings)
```

---

## 🔧 Tech notes

- **Designer** uses `fabric.js` v5 (browser canvas). Designs are saved as JSON + a PNG data-URL preview and stored in the cart / custom orders.
- **Products** are seeded in `src/data/products.js`. Admin changes to the catalog persist to `localStorage` (`sh:catalog`) and appear on the storefront instantly.
- **COD only** — no online payment gateway is wired; the checkout ends with "Pay on delivery".
- Placeholder **SVG product images** are generated locally (offline-safe), colour-coded per product using each product's `gradient`.
- Cart/sware, auth tokens, orders, messages and settings all live in browser `localStorage` — refresh-safe for a demo, no network required.

## 📝 Customize real store details

Contact details, map link, phone, WhatsApp and timings are **editable from
Admin → Settings**. Replace the placeholder Purnea address / phone with your real
store details and they will reflect across the footer, Contact page and order emails.

---

## 💡 Notes for a production version

This is intentionally **frontend-only** with a mock persistence layer. To go live,
hook `src/services/api.js` to a real backend (Express + MongoDB) while keeping the
same function signatures — the entire UI already treats it as async (cache,
skeletons, toasts, error states). The in-memory cache layer can be swapped for
React Query/SWR. Online payments (Razorpay), image uploads (Multer) and SMTP
password reset can then replace the simulated equivalents.

© Sports Hub, Purnea
=======
# sports_hub
E-commerce website for sports items 
>>>>>>> 24e8697285ed5cd55ea513250ed68c8d8b101f6a
