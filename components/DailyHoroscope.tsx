'use client'

import { useState, useMemo } from 'react'
import {
  ZODIAC_SIGNS,
  getZodiacSign,
  getHoroscopeText,
  formatHoroscopeDate,
  toDateKey,
} from '@/lib/horoscope'
import type { ZodiacSignName } from '@/lib/horoscope'

interface Props {
  /** Birth date string in DD/MM/YYYY format, or empty */
  birthDate?: string
}

export default function DailyHoroscope({ birthDate }: Props) {
  const today = useMemo(() => new Date(), [])
  const dateKey = toDateKey(today)
  const formattedDate = formatHoroscopeDate(today)

  // Derive sign from birth date if available
  const birthSign = useMemo(() => {
    if (!birthDate) return null
    const parts = birthDate.split('/')
    if (parts.length < 2) return null
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    if (!day || !month) return null
    return getZodiacSign(day, month)
  }, [birthDate])

  const [selectedSign, setSelectedSign] = useState<ZodiacSignName | null>(null)

  // Active sign: manual selection overrides birth sign
  const activeSign = selectedSign
    ? ZODIAC_SIGNS.find(s => s.name === selectedSign)!
    : birthSign

  const horoscopeText = activeSign
    ? getHoroscopeText(activeSign.name as ZodiacSignName, dateKey)
    : null

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-6 md:p-8 shadow-xl shadow-black/30 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Daily Horoscope
          </h3>
          <p className="text-[11px] text-slate-600 font-medium">{formattedDate}</p>
        </div>

        {/* Sign selector */}
        <div className="relative">
          <select
            value={selectedSign ?? (birthSign?.name ?? '')}
            onChange={e => setSelectedSign(e.target.value as ZodiacSignName)}
            className="appearance-none bg-[#1f2937] border border-white/[0.08] rounded-xl
                       px-4 py-2.5 pr-10 text-white text-sm outline-none cursor-pointer
                       transition-all duration-200
                       focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
          >
            {!birthSign && !selectedSign && (
              <option value="" disabled>Select your sign</option>
            )}
            {ZODIAC_SIGNS.map(sign => (
              <option key={sign.name} value={sign.name}>
                {sign.symbol} {sign.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 4.5L6 7.5L9 4.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeSign ? (
        <div className="flex gap-5 items-start">
          {/* Sign symbol */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.08))',
              border: '1px solid rgba(139,92,246,0.15)',
            }}
          >
            {activeSign.symbol}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-black text-white uppercase tracking-wide">
                {activeSign.name}
              </span>
            </div>
            <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
              {horoscopeText}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-slate-500 font-medium">
            Enter your birth date above to see your horoscope, or select a sign from the dropdown.
          </p>
        </div>
      )}
    </div>
  )
}
