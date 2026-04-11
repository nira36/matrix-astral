'use client'

import React from 'react'
import type { DestinyMatrixResult, MatrixPoint } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'

const CATEGORIES = [
  { name: 'Punti Cardine', keys: ['A', 'B', 'C', 'D', 'E'] },
  { name: 'Talenti e Spirito', keys: ['K', 'P', 'T', 'J', 'S', 'O'] },
  { name: 'Amore e Denaro', keys: ['L', 'Q', 'R', 'R1', 'R2'] },
  { name: 'Karma e Radici', keys: ['M', 'N', 'F', 'G', 'H', 'I'] },
  { name: 'Eredità e Potenziale', keys: ['F1', 'F2', 'G1', 'G2', 'H1', 'H2', 'I1', 'I2', 'L1', 'L2'] },
]

function ArcanaMiniCard({ point }: { point: MatrixPoint }) {
  const arcana = getArcana(point.number)
  const color = arcana?.color ?? point.color
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:border-white/[0.1] transition-all">
      <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-sm"
        style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
        {point.number}
      </div>
      <div className="flex flex-col min-w-0">
        <div className="text-[10px] uppercase font-bold tracking-tight text-slate-500 flex items-center gap-1">
          {point.key} <span className="opacity-40">·</span> {point.label}
        </div>
        <div className="text-[11px] font-bold text-slate-300 truncate tracking-tight">{arcana.name}</div>
      </div>
    </div>
  )
}

export default function ArcanaGrid({ result }: { result: DestinyMatrixResult }) {
  return (
    <div className="flex flex-col gap-6">
      {CATEGORIES.map((cat) => (
        <div key={cat.name} className="flex flex-col gap-3">
          <div className="text-[11px] font-black tracking-[0.2em] uppercase text-slate-600 border-b border-white/[0.03] pb-1">
            {cat.name}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {cat.keys.map(key => {
              const point = result.points[key]
              if (!point) return null
              return <ArcanaMiniCard key={key} point={point} />
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
