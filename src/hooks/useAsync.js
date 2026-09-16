import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useAsync — declarative data-fetching hook with loading/success/error states
 * and a stable retry. The fetch function re-runs whenever `deps` change.
 */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [attempt, setAttempt] = useState(0)
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    let alive = true
    Promise.resolve()
      .then(() => fnRef.current())
      .then((data) => {
        if (alive) setState({ status: 'success', data, error: null })
      })
      .catch((error) => {
        if (alive) setState({ status: 'error', data: null, error })
      })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  /** Optimistically replace data (used after mutations) without refetching. */
  const setData = useCallback((updater) => {
    setState((s) => ({ ...s, status: 'success', data: typeof updater === 'function' ? updater(s.data) : updater }))
  }, [])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])

  return { ...state, setData, retry }
}