import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaCartPlus, FaBolt, FaCheck, FaTruck, FaShieldAlt, FaInfoCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import ProductImage from '../components/ui/ProductImage'
import { Stars, StockBadge, DiscountBadge, QtyStepper, SectionHeading, TrustIcons } from '../components/ui/misc'
import ProductCard from '../components/ui/ProductCard'
import { Spinner } from '../components/ui/misc'
import { inr, cn } from '../utils/format'
import { useAuth, useCart, useSettingsStore } from '../context/AppContext'
import { useGetCatalogQuery, useGetMyWishlistQuery, useToggleWishlistMutation } from '../services/apiSlice'

const sizeChart = {
  S: '36" – 38"', M: '38" – 40"', L: '40" – 42"', XL: '42" – 44"', XXL: '44" – 46"',
  'Short Handle': 'Approx. 33.5"', 'Long Handle': 'Approx. 34.5"',
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { data: catalog = [] } = useGetCatalogQuery()
  const product = useMemo(() => catalog.find((p) => p.id === slug || p.slug === slug), [catalog, slug])
  const { add } = useCart()
  const { user } = useAuth()
  const { settings } = useSettingsStore()
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const intent = searchParams.get('intent') // addToCart | buyNow
  const intentQty = Number(searchParams.get('intentQty') || 1)
  const intentSize = searchParams.get('intentSize') || ''
  const intentHandledRef = useRef('')
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('')
  const [variant, setVariant] = useState(0)

  const uid = user?._id
  const { data: wishlist = [] } = useGetMyWishlistQuery(uid, { skip: !user })
  const [toggleWishlist] = useToggleWishlistMutation()
  const loved = Boolean(product && wishlist.includes(product.id))

  useEffect(() => {
    setQty(1)
    setSize(product?.sizes?.[0] || '')
    setVariant(0)
  }, [product?.id])

  useEffect(() => {
    if (product?.id && !size) setSize(product.sizes?.[0] || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  /* Resolve an Add to Cart / Buy Now / Wishlist intent started before login */
  useEffect(() => {
    if (!user || !product) return
    if (intent === 'addToCart' || intent === 'buyNow') {
      if (intentHandledRef.current === intent) return
      intentHandledRef.current = intent
      const s = intentSize || product.sizes?.[0] || ''
      const q = Math.max(1, intentQty || 1)
      if (product.sizes?.length && s && !product.sizes.includes(s)) return
      add(product.id, { qty: q, size: product.sizes?.length ? s || undefined : undefined })
      toast.success('Added to cart')
      if (intent === 'buyNow') {
        setTimeout(() => nav('/checkout'), 400)
      } else {
        nav(`/product/${product.slug}`, { replace: true })
      }
    } else if (intent === 'addToWishlist') {
      if (intentHandledRef.current === 'addToWishlist') return
      intentHandledRef.current = 'addToWishlist'
      toggleWishlist({ productId: product.id, uid })
        .unwrap()
        .then((items) => {
          toast.success(items.includes(product.id) ? 'Saved to wishlist' : 'Removed from wishlist')
          nav(`/product/${product.slug}`, { replace: true })
        })
        .catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, product, intent])

  if (!catalog.length) return <div className="container-x flex justify-center py-24"><Spinner /></div>

  if (!product) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="section-title">Product not found</h1>
        <p className="mt-2 text-ink/60">This product may have been removed.</p>
        <Link to="/shop" className="btn-primary mt-6">Back to Shop</Link>
      </div>
    )
  }

  const pct = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0
  const out = product.stock <= 0
  const related = catalog.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const bigger = size && sizeChart[size]

  const toggleWish = async () => {
    if (!user) return nav('/login?next=' + encodeURIComponent(`/product/${product.slug}?intent=addToWishlist`))
    const added = (await toggleWishlist({ productId: product.id, uid }).unwrap()).includes(product.id)
    toast.success(added ? 'Saved to wishlist' : 'Removed from wishlist')
  }

  const loginForIntent = (which) => {
    const params = new URLSearchParams({ intent: which, intentQty: String(qty), intentSize: size || '' })
    nav('/login?next=' + encodeURIComponent(`/product/${product.slug}?${params.toString()}`))
  }

  const doAdd = () => {
    if (product.sizes?.length && !size) return toast.error('Please select a size.')
    if (!user) return loginForIntent('addToCart')
    add(product.id, { qty, size })
  }

  const buyNow = () => {
    if (product.sizes?.length && !size) return toast.error('Please select a size.')
    if (!user) return loginForIntent('buyNow')
    add(product.id, { qty, size })
    setTimeout(() => nav('/checkout'), 350)
  }

  return (
    <div className="container-x py-8">
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: [`/product/${product.slug}`],
          description: product.description,
          brand: { '@type': 'Brand', name: product.brand },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews },
          offers: { '@type': 'Offer', priceCurrency: 'INR', price: product.price, availability: out ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' },
        })}
      </script>

      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-ink/40">
        <Link to="/" className="hover:text-accent">Home</Link> / <Link to={`/shop?category=${product.category}`} className="hover:text-accent">{product.categoryName}</Link> /{' '}
        <Link to={`/shop?category=${product.category}&subcategory=${product.subcategory}`} className="hover:text-accent">{product.subcategory}</Link> /{' '}
        <span className="text-ink/70">{product.name}</span>
      </p>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="card relative overflow-hidden">
            <ProductImage product={product} variant={variant} className="aspect-square w-full" />
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.badge && (
                <span className={cn('chip text-white', product.badge === 'Bestseller' && 'bg-accent', product.badge === 'New' && 'bg-brand-700', product.badge === 'Low stock' && 'bg-amber-600')}>
                  {product.badge}
                </span>
              )}
              {pct > 0 && <DiscountBadge mrp={product.mrp} price={product.price} />}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={cn('card overflow-hidden transition', variant === v ? 'ring-2 ring-accent ring-offset-2' : 'opacity-70 hover:opacity-100')}
                aria-label={`View ${v + 1}`}
              >
                <div className="aspect-square w-full">
                  <ProductImage product={product} variant={v} className="h-full w-full" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow">{product.brand} · {product.subcategory}</p>
          <h1 className="mt-1 text-balance font-display text-3xl font-bold text-brand-900 sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Stars rating={product.rating} />
            <span className="text-sm text-ink/60">{product.rating} · {product.reviews} reviews</span>
            <span className="text-sm text-ink/40">·</span>
            <span className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-200">{product.categoryName}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="font-display text-4xl font-bold text-brand-900">{inr(product.price)}</span>
            {pct > 0 && (
              <>
                <span className="text-xl text-ink/40 line-through">{inr(product.mrp)}</span>
                <span className="chip bg-accent text-white">Save {pct}%</span>
              </>
            )}
          </div>
          <p className="mt-1 text-sm text-emerald-600">
            + Inclusive of all taxes · {settings?.freeDeliveryAbove ? `Free delivery above ${inr(settings.freeDeliveryAbove)}` : 'Free delivery available'}
          </p>

          <div className="mt-5">
            <StockBadge stock={product.stock} />
          </div>

          {/* Size */}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="field-label !mb-0">Select Size</span>
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-accent-600">
                  <FaInfoCircle /> Size chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      'min-w-[52px] rounded-xl border-2 px-4 py-2.5 font-display text-sm font-bold transition',
                      size === s ? 'border-brand-700 bg-brand-700 text-white shadow-lift' : 'border-ink/15 text-ink/70 hover:border-brand-500',
                    )}
                  >
                    {s}
                    <span className="block text-[10px] font-medium opacity-70">{sizeChart[s] || ''}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={setQty} />
            <button onClick={doAdd} disabled={out} className="btn-dark flex-1 min-w-[180px]">
              <FaCartPlus /> {out ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button onClick={buyNow} disabled={out} className="btn-primary flex-1 min-w-[180px]">
              <FaBolt /> Buy Now — COD
            </button>
            <button onClick={toggleWish} aria-label="Wishlist" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink/10 text-ink/60 transition hover:border-red-300 hover:text-red-500">
              {loved ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>

          {/* Trust */}
          <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-ink/10 bg-white p-4">
            {[
              { icon: <FaTruck />, t: 'Free ship', d: 'above ₹999' },
              { icon: <FaShieldAlt />, t: 'COD available', d: 'pay on delivery' },
              { icon: <FaCheck />, t: '7-day returns', d: 'unused & tagged' },
            ].map((x) => (
              <div key={x.t} className="flex flex-col items-center text-center">
                <span className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{x.icon}</span>
                <p className="text-xs font-bold text-brand-900">{x.t}</p>
                <p className="text-[10px] text-ink/50">{x.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-brand-900">About this product</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{product.description}</p>
            {product.features?.length > 0 && (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-ink/70">
                    <FaCheck className="shrink-0 text-emerald-600" /> {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading eyebrow="More to explore" title={`More ${product.categoryName}`} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}