import React, { useState, useRef, useEffect } from 'react'
import { FaChevronDown, FaTimes, FaSearch } from 'react-icons/fa'
import { cn } from '../../utils/format'

/**
 * Brand-styled select dropdown.
 * - single OR multiple selection (multi renders removable chips)
 * - optional inline search, custom left icon, top/bottom menu, compact size
 * - click-outside + Escape to close, ARIA labelling
 * value: string | string[] ; onChange receives string | string[]
 */
export default function SelectDropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  variant = 'brand',
  className = '',
  itemStyle = '',
  menuStyle = '',
  leftIcon,
  isSearch = false,
  multiple = false,
  isMandatory = false,
  labelClassName = '',
  menuPosition = 'bottom',
  compact = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const boxRef = useRef(null)
  const searchRef = useRef(null)

  const singleValue = !multiple && typeof value === 'string' ? value : ''
  const multiValues = multiple && Array.isArray(value) ? value : []
  const selectedOption = options.find((o) => o.value === singleValue)
  const selectedOptions = options.filter((o) => multiValues.includes(o.value))

  const query = search.trim().toLowerCase()
  const filtered = query ? options.filter((o) => String(o.label).toLowerCase().includes(query)) : options

  useEffect(() => {
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setIsOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    if (isOpen && isSearch) setTimeout(() => searchRef.current?.focus(), 0)
  }, [isOpen, isSearch])

  const toggleOption = (val) => {
    if (!multiple) return
    onChange(multiValues.includes(val) ? multiValues.filter((v) => v !== val) : [...multiValues, val])
  }

  const pick = (val) => {
    if (multiple) toggleOption(val)
    else {
      onChange(val)
      setIsOpen(false)
    }
  }

  const variantClasses = {
    brand: 'border-brand-600 bg-brand-700 text-white',
    light: 'border-ink/15 bg-white text-ink',
    plain: 'border-transparent bg-transparent text-ink hover:bg-brand-50',
    accent: 'border-accent bg-accent-600 text-white',
  }[variant]

  return (
    <div className={cn('relative w-full', compact ? '' : 'min-w-28')} ref={boxRef}>
      {label && (
        <label className={cn('field-label mb-1.5', labelClassName)}>
          {label}
          {isMandatory && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-xl border font-display text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60',
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5',
          variantClasses,
          className,
        )}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 text-left">
          {leftIcon && <span className="shrink-0 opacity-80">{leftIcon}</span>}
          {multiple ? (
            selectedOptions.length > 0 ? (
              selectedOptions.map((opt) => (
                <span key={opt.value} className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold inline-flex items-center gap-1">
                  {opt.label}
                  <FaTimes
                    className="h-3 w-3 cursor-pointer opacity-80 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleOption(opt.value)
                    }}
                  />
                </span>
              ))
            ) : (
              <span className="opacity-70">{placeholder}</span>
            )
          ) : (
            <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          )}
        </span>
        <FaChevronDown className={cn('h-3.5 w-3.5 shrink-0 opacity-70 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={cn(
            'absolute z-50 w-full origin-top overflow-hidden rounded-xl border bg-white shadow-panel',
            menuPosition === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
            menuStyle,
          )}
        >
          {isSearch && (
            <div className="border-b border-ink/10 p-2">
              <div className="flex items-center gap-2 rounded-lg bg-ink/5 px-2.5 py-1.5">
                <FaSearch className="shrink-0 text-ink/40" size={12} />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="w-full bg-transparent text-sm text-ink placeholder-ink/40 focus:outline-none"
                />
              </div>
            </div>
          )}
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length > 0 ? (
              filtered.map((opt) => {
                const isSelected = multiple
                  ? multiValues.includes(opt.value)
                  : singleValue === opt.value
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => pick(opt.value)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition',
                      isSelected ? 'bg-brand-700 font-semibold text-white' : 'text-ink/80 hover:bg-brand-50',
                      itemStyle,
                    )}
                  >
                    {opt.icon && <span className="shrink-0 opacity-70">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </li>
                )
              })
            ) : (
              <li className="px-4 py-3 text-center text-sm text-ink/40">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}