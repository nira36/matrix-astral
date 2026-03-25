'use client'

import type { DestinyMatrixResult, MatrixPosition } from '@/lib/destinyMatrix'
import { CHAKRA_INFO, POSITION_INTERPRETATIONS } from '@/lib/destinyMatrix'
import { getArcana, ELEMENT_SYMBOLS } from '@/lib/arcana'
import Tooltip from './Tooltip'

interface ArcanaCardProps {
  position: MatrixPosition
  highlighted?: boolean
}

function ArcanaCard({ position, highlighted }: ArcanaCardProps) {
  const arcana = getArcana(position.number)
  const chakra = CHAKRA_INFO[position.chakra]
  const color  = chakra.color
  const interp = POSITION_INTERPRETATIONS[position.key] ?? ''

  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3 transition-all duration-300"
      style={{
        borderColor: highlighted ? `${color}44` : 'rgba(255,255,255,0.06)',
        background:  highlighted ? `${color}08`  : 'transparent',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[9px] font-bold tracking-widest uppercase mb-0.5"
            style={{ color }}>
            {position.label}
          </div>
          <div className="text-[8px] text-slate-600 tracking-wide">
            {position.sublabel}
          </div>
        </div>
        {/* Chakra dot */}
        <Tooltip content={`${chakra.nameFull} — ${chakra.description}`}>
          <div className="flex items-center gap-1 cursor-help shrink-0">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-[8px] text-slate-600">{chakra.name}</span>
          </div>
        </Tooltip>
      </div>

      {/* Number + Arcana name */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border"
          style={{ borderColor: `${color}30`, background: `${color}10` }}
        >
          <span className="text-[8px] text-slate-600 leading-none">{arcana.roman}</span>
          <span className="text-xl font-bold leading-none mt-0.5" style={{ color }}>
            {position.number}
          </span>
        </div>
        <div>
          <div className="text-sm font-semibold text-white leading-tight">
            {arcana.name}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">
            {arcana.planet} · {ELEMENT_SYMBOLS[arcana.element]}
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-1">
        {arcana.keywords.slice(0, 3).map(kw => (
          <span
            key={kw}
            className="text-[8px] px-1.5 py-0.5 rounded-full border"
            style={{ color, borderColor: `${color}30`, background: `${color}10` }}
          >
            {kw}
          </span>
        ))}
      </div>

      {/* Interpretation */}
      <p className="text-[10px] text-slate-500 leading-relaxed">
        {interp}
      </p>

      {/* Arcana description */}
      <p className="text-[10px] text-slate-600 leading-relaxed border-t border-white/[0.04] pt-2">
        {arcana.description}
      </p>
    </div>
  )
}

interface ArcanaGridProps {
  result: DestinyMatrixResult
}

// Layout order for the grid: approximates the octagram layout visually
const DISPLAY_ORDER = ['north', 'nw', 'ne', 'west', 'center', 'east', 'sw', 'south', 'se']

export default function ArcanaGrid({ result }: ArcanaGridProps) {
  const allPositions = [...result.positions, result.center]
  const ordered = DISPLAY_ORDER.map(key => allPositions.find(p => p.key === key)).filter(Boolean) as MatrixPosition[]

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">
        Arcana Positions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ordered.map(pos => (
          <ArcanaCard
            key={pos.key}
            position={pos}
            highlighted={pos.key === 'center' || pos.key === 'north'}
          />
        ))}
      </div>
    </div>
  )
}
