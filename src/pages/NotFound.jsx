import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaTshirt, FaSearch } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-display text-[7rem] font-bold leading-none text-brand-700/15 sm:text-[10rem]">404</p>
      <h1 className="mt-2 -translate-y-8 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
        That ball went for six…<br />out of bounds.
      </h1>
      <p className="mt-1 max-w-md -translate-y-6 text-ink/60">
        The page you’re looking for doesn’t exist or has been moved. Let’s get you back in the game.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link to="/" className="btn-primary text-sm"><FaHome /> Back to Home</Link>
        <Link to="/shop" className="btn-outline text-sm"><FaSearch /> Browse the shop</Link>
        <Link to="/customize" className="btn-dark text-sm"><FaTshirt /> Design a jersey</Link>
      </div>
    </div>
  )
}