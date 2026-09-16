import React from 'react'
import { FaExclamationTriangle, FaRedoAlt, FaTshirt } from 'react-icons/fa'
import { Spinner, Skeleton } from './misc'
import { cn } from '../../utils/format'

/** Friendly full-page loader used as the route-level Suspense fallback. */
export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6">
      <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-brand-950 text-accent shadow-lift">
        <FaTshirt size={22} />
      </span>
      <p className="text-sm font-semibold text-ink/60">{label}</p>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-ink/10">
        <div className="h-full w-1/2 animate-shimmer rounded-full bg-accent" />
      </div>
    </div>
  )
}

export function InlinePageLoader() {
  return (
    <div className="space-y-4 p-2">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-[400px] w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  )
}

/** Error state card with a retry button. */
export function ErrorState({ error, onRetry, title = 'Something went wrong', className }) {
  return (
    <div className={cn('card flex flex-col items-center px-6 py-14 text-center', className)}>
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 ring-1 ring-red-100">
        <FaExclamationTriangle size={26} />
      </span>
      <h3 className="font-display text-lg font-bold text-brand-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-ink/60">
        {error?.message || 'We could not load this right now. Please try again — your data is safe.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-6 text-sm">
          <FaRedoAlt /> Try again
        </button>
      )}
    </div>
  )
}

/**
 * Async — state-aware renderer.
 *   loading -> skeleton (or <Spinner />)
 *   error   -> <ErrorState /> with retry
 *   success -> children(data)
 */
export function Async({ state, loading, errorTitle, children }) {
  if (state.status === 'loading') return loading || <Spinner />
  if (state.status === 'error') return <ErrorState error={state.error} onRetry={state.retry} title={errorTitle} />
  return children(state.data)
}