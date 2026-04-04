'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

export interface PlaceSelection {
  display: string
  lat: number
  lon: number
  country: string
  tz: number // base UTC offset (standard time, no DST)
}

interface BirthPlaceInputProps {
  value: string
  onChange: (val: string) => void
  onSelect: (place: PlaceSelection) => void
  selectedPlace: PlaceSelection | null
}

interface GeoResult {
  display: string
  lat: number
  lon: number
  country: string
  tz: number
}

export default function BirthPlaceInput({ value, onChange, onSelect, selectedPlace }: BirthPlaceInputProps) {
  const [results, setResults] = useState<GeoResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
      const data: GeoResult[] = await res.json()
      setResults(data)
      setOpen(data.length > 0)
      setActiveIdx(-1)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleInput(val: string) {
    onChange(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 300)
  }

  function handleSelect(r: GeoResult) {
    onChange(r.display)
    onSelect(r)
    setOpen(false)
    setResults([])
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      handleSelect(results[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function formatCoord(lat: number, lon: number): string {
    const latD = Math.abs(lat)
    const latDir = lat >= 0 ? 'N' : 'S'
    const lonD = Math.abs(lon)
    const lonDir = lon >= 0 ? 'E' : 'W'
    return `${latD.toFixed(2)}°${latDir}, ${lonD.toFixed(2)}°${lonDir}`
  }

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-[11px] font-semibold tracking-widest uppercase text-slate-500">
        Birth Place
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="e.g. Rome, Ivano-Frankivsk, New York..."
          value={value}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="w-full bg-[#1f2937] border border-white/[0.08] rounded-xl
                     px-4 py-3 text-white placeholder-slate-600 text-sm outline-none
                     transition-all duration-200
                     focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-slate-600 border-t-accent-purple rounded-full animate-spin" />
          </div>
        )}

        {/* Dropdown */}
        {open && results.length > 0 && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1 rounded-xl border border-white/[0.08] bg-[#1a1f2e] shadow-2xl shadow-black/60 overflow-hidden">
            {results.map((r, i) => (
              <button
                key={`${r.lat}-${r.lon}-${i}`}
                type="button"
                onClick={() => handleSelect(r)}
                className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors
                  ${i === activeIdx ? 'bg-accent-purple/10' : 'hover:bg-white/[0.04]'}
                  ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-slate-300 truncate">{r.display}</span>
                  <span className="text-[10px] font-mono text-slate-600">{formatCoord(r.lat, r.lon)}</span>
                </div>
                {r.country && (
                  <span className="text-[9px] font-bold text-slate-600 uppercase shrink-0">{r.country}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Show selected coordinates */}
      {selectedPlace && (
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
          <svg className="w-3 h-3 text-emerald-500/60" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{formatCoord(selectedPlace.lat, selectedPlace.lon)}</span>
        </div>
      )}
    </div>
  )
}
