import { useEffect, useMemo, useRef, useState } from 'react'
import { HiChevronDown, HiMagnifyingGlass } from 'react-icons/hi2'
import { countries } from '../../data/countries'
import Flag from './Flag'

/*
 * Phone field with a searchable country-code picker. No external dependency —
 * a native-styled combobox that matches the site's dark form controls.
 *
 * Controlled: `country` (a {n,c,d} object) + `number` (national digits string),
 * with `onCountryChange` / `onNumberChange`. Compose the E.164 value with
 * `+${country.d}${number}` on submit.
 */
export default function CountryPhoneInput({
  id = 'phone',
  country,
  number,
  onCountryChange,
  onNumberChange,
  invalid = false,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef(null)
  const searchRef = useRef(null)

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (open) searchRef.current?.focus()
    else setQuery('')
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return countries
    const qDigits = q.replace(/[^\d]/g, '')
    return countries.filter(
      (c) => c.n.toLowerCase().includes(q) || (qDigits && c.d.includes(qDigits)),
    )
  }, [query])

  const pick = (c) => {
    onCountryChange(c)
    setOpen(false)
  }

  const borderClass = invalid ? 'border-vivid' : 'border-line focus-within:border-acid'

  return (
    <div className="relative" ref={rootRef}>
      <div
        className={`flex items-stretch bg-ink-800 border rounded-xs transition-colors ${borderClass}`}
      >
        {/* Country trigger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country code: ${country.n} +${country.d}`}
          className="flex items-center gap-1.5 pl-4 pr-3 py-3 font-body text-sm text-fg border-r border-line hover:text-acid transition-colors shrink-0"
        >
          <Flag code={country.c} />
          <span className="tabular-nums">+{country.d}</span>
          <HiChevronDown className={`text-fg-dim transition-transform ${open ? 'rotate-180' : ''}`} size={14} />
        </button>

        {/* National number */}
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
          placeholder="5X XXX XXXX"
          className="flex-1 min-w-0 bg-transparent px-4 py-3 font-body text-sm text-fg placeholder:text-fg-dim focus:outline-none"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 mt-2 w-full sm:w-80 max-w-[calc(100vw-3rem)] rounded-sm border border-line-strong bg-ink-900 shadow-2xl shadow-black/50 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-line-soft">
            <HiMagnifyingGlass className="text-fg-dim shrink-0" size={15} />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              className="w-full bg-transparent font-body text-sm text-fg placeholder:text-fg-dim focus:outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 font-body text-sm text-fg-dim">No matches</li>
            )}
            {filtered.map((c) => {
              const selected = c.c === country.c && c.d === country.d
              return (
                <li key={`${c.c}-${c.d}`} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => pick(c)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left font-body text-sm transition-colors hover:bg-ink-700 ${
                      selected ? 'text-acid' : 'text-fg-muted'
                    }`}
                  >
                    <Flag code={c.c} />
                    <span className="flex-1 truncate">{c.n}</span>
                    <span className="text-fg-dim tabular-nums">+{c.d}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
