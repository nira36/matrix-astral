'use client'

import type { DestinyMatrixResult, ChakraKey } from '@/lib/destinyMatrix'
import { CHAKRA_INFO } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'
import Tooltip from './Tooltip'

// Map chakra to the matrix position key that activates it
const CHAKRA_TO_POSITION: Record<ChakraKey, string> = {
  root:       'se',
  sacral:     'south',
  solar:      'sw',
  heart:      'east',
  throat:     'ne',
  third_eye:  'west',
  crown:      'north',
  soul_star:  'center',
}

// Ordered from base to crown
const CHAKRA_ORDER: ChakraKey[] = [
  'root', 'sacral', 'solar', 'heart', 'throat', 'third_eye', 'crown', 'soul_star',
]

interface ChakraRowProps {
  chakraKey: ChakraKey
  arcanaNumber: number
  delay: number
}

function ChakraRow({ chakraKey, arcanaNumber, delay }: ChakraRowProps) {
  const chakra = CHAKRA_INFO[chakraKey]
  const arcana = getArcana(arcanaNumber)
  const color  = chakra.color

  return (
    <Tooltip content={`${chakra.nameFull} · ${chakra.description}`}>
      <div
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 border cursor-help
                   transition-all duration-300 hover:border-white/10"
        style={{
          borderColor: `${color}20`,
          animationDelay: `${delay}s`,
          animationFillMode: 'both',
        }}
      >
        {/* Chakra indicator */}
        <div className="flex flex-col items-center gap-0.5 w-16 shrink-0">
          <div
            className="w-4 h-4 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
          />
          <span className="text-[8px] font-semibold tracking-wide" style={{ color }}>
            {chakra.name.toUpperCase()}
          </span>
          <span className="text-[7px] text-slate-700">{chakra.nameFull}</span>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-white/[0.04]" />

        {/* Arcana */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
            style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}
          >
            {arcanaNumber}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-300 truncate">{arcana.name}</div>
            <div className="text-[9px] text-slate-600 truncate">
              {arcana.keywords.slice(0, 2).join(' · ')}
            </div>
          </div>
        </div>

        {/* Energy indicator */}
        <div className="shrink-0">
          <span
            className="text-[7px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full"
            style={{
              color,
              background: `${color}10`,
              border: `1px solid ${color}20`,
            }}
          >
            {arcana.energy === 'masculine' ? 'M' : arcana.energy === 'feminine' ? 'F' : '∞'}
          </span>
        </div>
      </div>
    </Tooltip>
  )
}

interface ChakraDisplayProps {
  result: DestinyMatrixResult
}

export default function ChakraDisplay({ result }: ChakraDisplayProps) {
  const allPositions = [...result.positions, result.center]

  function getNumber(key: string): number {
    return allPositions.find(p => p.key === key)?.number ?? 0
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">
        Chakra Alignment
      </h3>
      <p className="text-[11px] text-slate-600 leading-relaxed -mt-2">
        Each energy center of your matrix maps to a chakra, revealing where specific arcana energies flow.
      </p>
      <div className="flex flex-col gap-2">
        {[...CHAKRA_ORDER].reverse().map((chakraKey, i) => {
          const positionKey  = CHAKRA_TO_POSITION[chakraKey]
          const arcanaNumber = getNumber(positionKey)
          return (
            <ChakraRow
              key={chakraKey}
              chakraKey={chakraKey}
              arcanaNumber={arcanaNumber}
              delay={i * 0.06}
            />
          )
        })}
      </div>

      {/* Personal Year */}
      <div className="rounded-xl border border-white/[0.06] p-4 mt-2 flex flex-col gap-2">
        <div className="text-[9px] font-bold tracking-widest uppercase text-slate-500">
          Personal Year {new Date().getFullYear()}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl border"
            style={{ color: '#a855f7', borderColor: 'rgba(168,85,247,0.25)', background: 'rgba(168,85,247,0.08)' }}>
            {result.personalYear}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{getArcana(result.personalYear).name}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {getArcana(result.personalYear).keywords.slice(0, 2).join(' · ')}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          {getArcana(result.personalYear).description}
        </p>
      </div>
    </div>
  )
}
