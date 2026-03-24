'use client'

import { MASTER_NUMBERS, NUMBER_MEANINGS } from '@/lib/numerology'
import Tooltip from './Tooltip'

interface NumberCardProps {
  label: string
  value: number
  tooltip: string
  color?: string
  delay?: number
}

export default function NumberCard({
  label,
  value,
  tooltip,
  color = '#8b5cf6',
  delay = 0,
}: NumberCardProps) {
  const isMaster = MASTER_NUMBERS.has(value)
  const meaning  = NUMBER_MEANINGS[value] ?? ''

  return (
    <div
      className="
        relative rounded-2xl border border-white/[0.07] bg-bg-card
        p-5 flex flex-col gap-3 overflow-hidden
        transition-transform duration-300 hover:-translate-y-0.5
        hover:border-white/[0.15]
      "
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <Tooltip content={tooltip}>
        <div className="flex items-center gap-1.5 cursor-help w-fit">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">
            {label}
          </span>
          <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </Tooltip>

      {value === 0 ? (
        <div className="text-slate-600 text-sm italic">requires name</div>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span
              className="text-5xl font-bold tabular-nums leading-none"
              style={{ color }}
            >
              {value}
            </span>
            {isMaster && (
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full border"
                style={{ color, borderColor: `${color}44`, background: `${color}11` }}
              >
                master
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{meaning}</p>
        </>
      )}
    </div>
  )
}
