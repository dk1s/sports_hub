import React, { createContext, useCallback, useContext, useState } from 'react'
import { FaExclamationTriangle, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa'
import Modal from './Modal'
import { cn } from '../../utils/format'

const ConfirmContext = createContext(() => Promise.resolve(false))

/** useConfirm() -> (opts) => Promise<boolean>  (open a confirmation dialog) */
export const useConfirm = () => useContext(ConfirmContext)

const ICONS = {
  danger: { icon: <FaExclamationTriangle size={22} />, cls: 'bg-red-50 text-red-500 ring-red-100' },
  warning: { icon: <FaExclamationTriangle size={22} />, cls: 'bg-amber-50 text-amber-500 ring-amber-100' },
  info: { icon: <FaQuestionCircle size={22} />, cls: 'bg-brand-50 text-brand-600 ring-brand-100' },
  success: { icon: <FaCheckCircle size={22} />, cls: 'bg-emerald-50 text-emerald-500 ring-emerald-100' },
}

export function ConfirmProvider({ children }) {
  const [cfg, setCfg] = useState(null)

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        setCfg({
          title: 'Are you sure?',
          message: '',
          confirmLabel: 'Confirm',
          cancelLabel: 'Cancel',
          tone: 'danger',
          confirmTextClassName: '',
          ...opts,
          resolve,
        })
      }),
    [],
  )

  const close = useCallback((value) => {
    setCfg((c) => {
      c?.resolve?.(value)
      return null
    })
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {cfg && (
        <Modal open onClose={() => close(false)} maxWidth="max-w-sm">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1', ICONS[cfg.tone]?.cls)}>
                {ICONS[cfg.tone]?.icon}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold text-brand-900">{cfg.title}</h3>
                {cfg.message && <p className="mt-1 text-sm leading-relaxed text-ink/60">{cfg.message}</p>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => close(false)} className="btn-ghost py-2.5 text-sm">
                {cfg.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className={cn(
                  'py-2.5 text-sm',
                  cfg.tone === 'danger' ? 'btn bg-red-500 text-white hover:bg-red-600' : 'btn-primary',
                  cfg.confirmTextClassName,
                )}
              >
                {cfg.confirmLabel}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </ConfirmContext.Provider>
  )
}