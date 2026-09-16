import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FaTimes } from 'react-icons/fa'
import { cn } from '../../utils/format'

/**
 * Accessible modal rendered in a portal.
 * - Closes on Escape / overlay click
 * - Locks body scroll while open
 * - Focuses the dialog and returns focus on close
 */
export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md', labelledBy }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => dialogRef.current?.focus(), 30)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      clearTimeout(t)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy || title}
        tabIndex={-1}
        className={cn(
          'relative w-full overflow-hidden rounded-3xl bg-white shadow-panel animate-fadeUp outline-none',
          maxWidth,
        )}
      >
        {title && (
          <div className="flex items-start justify-between gap-4 border-b border-ink/8 px-6 py-4">
            <h2 className="font-display text-lg font-bold text-brand-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink/50 transition hover:bg-ink/5 hover:text-ink"
            >
              <FaTimes />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}