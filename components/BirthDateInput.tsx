'use client'

import { useState, useRef } from 'react'

interface BirthDateInputProps {
  value: string
  onChange: (val: string) => void
}

/** Auto-formats input as DD/MM/YYYY while typing */
export default function BirthDateInput({ value, onChange }: BirthDateInputProps) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d/]/g, '')

    // Auto-insert slashes at positions 2 and 5
    let formatted = raw.replace(/\//g, '')
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2)
    }
    if (formatted.length > 5) {
      formatted = formatted.slice(0, 5) + '/' + formatted.slice(5)
    }
    formatted = formatted.slice(0, 10)
    onChange(formatted)
  }

  const isValid = /^\d{2}\/\d{2}\/\d{4}$/.test(value)
  const hasValue = value.length > 0

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold tracking-widest uppercase text-slate-500">
        Birth Date
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          placeholder="DD / MM / YYYY"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={10}
          className="
            w-full bg-bg-elevated border rounded-xl px-4 py-3
            text-white placeholder-slate-600 font-mono text-base
            outline-none transition-all duration-200
            tracking-widest
          "
          style={{
            borderColor: focused
              ? '#8b5cf6'
              : hasValue && isValid
              ? '#34d399'
              : hasValue
              ? '#f87171'
              : 'rgba(255,255,255,0.08)',
            boxShadow: focused ? '0 0 0 3px rgba(139,92,246,0.15)' : 'none',
          }}
        />
        {/* Calendar icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
