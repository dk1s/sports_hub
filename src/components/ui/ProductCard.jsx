import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaCartPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'
import ProductImage from './ProductImage'
import { Stars, StockBadge, DiscountBadge } from './misc'
import { inr, discountPct, cn } from '../../utils/format'
import { useAuth, useCart } from '../../context/AppContext'
import { wishlistApi } from '../../services/api'

export default function ProductCard({ product, compact = false }) {
  const { add } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loved, setLoved] = useState(false)
  const pct = discountPct(product.mrp, product.price)

  const addToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.sizes?.length) {
      navigate(`/product/${product.slug}`)
      toast('Choose a size first', { icon: '📏' })
      return
    }
    if (!user) {
      const next = `/product/${product.slug}?intent=addToCart&intentQty=1`
      return navigate('/login?next=' + encodeURIComponent(next))
    }
    add(product.id)
  }

  const toggleWish = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return navigate('/login?next=' + encodeURIComponent(`/product/${product.slug}?intent=addToWishlist`))
    try {
      await wishlistApi.toggle({ productId: product.id })
      setLoved((v) => !v)
    } catch {
      /* noop */
    }
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="card group relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <ProductImage product={product} className="h-full w-full transition duration-500 group-hover:scale-[1.06]" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span
              className={cn(
                'chip text-white',
                product.badge === 'Bestseller' && 'bg-accent',
                product.badge === 'New' && 'bg-brand-700',
                product.badge === 'Low stock' && 'bg-amber-600',
              )}
            >
              {product.badge}
            </span>
          )}
          {pct > 0 && <DiscountBadge mrp={product.mrp} price={product.price} />}
        </div>
        <button
          onClick={toggleWish}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink/70 shadow-card backdrop-blur transition hover:text-red-500"
        >
          {loved ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-brand-950/90 to-transparent p-4 pt-8 transition duration-300 group-hover:translate-y-0">
          <button onClick={addToCart} className="btn-primary w-full py-2.5 text-sm">
            <FaCartPlus /> {product.sizes?.length ? 'Choose Size' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide text-ink/50">{product.brand}</span>
          <span className="inline-flex items-center gap-1 text-ink/70">
            <Stars rating={product.rating} size="text-[10px]" /> <span className="text-ink/50">({product.reviews})</span>
          </span>
        </div>
        <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-brand-900 group-hover:text-accent-600">
          {product.name}
        </h3>
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-brand-900">{inr(product.price)}</span>
            {pct > 0 && <span className="text-sm text-ink/40 line-through">{inr(product.mrp)}</span>}
          </div>
          <div className="mt-1">
            <StockBadge stock={product.stock} />
          </div>
        </div>
      </div>
    </Link>
  )
}