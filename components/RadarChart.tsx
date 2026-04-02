'use client'

import React from 'react'
import type { CoreNumbers } from '@/lib/numerology'

export default function RadarChart({ core }: { core: CoreNumbers }) {
  // Map core numbers to 6-axis radar points
  const points = [
    { label: 'LP', value: core.lifePath },
    { label: 'EX', value: core.expression },
    { label: 'SU', value: core.soulUrge },
    { label: 'PE', value: core.personality },
    { label: 'BD', value: core.birthDayNumber },
    { label: 'MA', value: core.maturityNumber },
  ]

  const size = 180
  const center = size / 2
  const radius = (size / 2) * 0.75

  // Calculate coordinates for each axis point
  const getCoordinates = (val: number, i: number, total: number) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2
    // Normalize value 1-33 to radius (0.1 to 1.0)
    const factor = val === 0 ? 0.05 : 0.1 + (val / 33) * 0.9
    const r = radius * Math.min(factor, 1.1)
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const polygonPoints = points
    .map((p, i) => {
      const { x, y } = getCoordinates(p.value, i, points.length)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background hex/circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((f) => (
          <circle
            key={f}
            cx={center}
            cy={center}
            r={radius * f}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {points.map((_, i) => {
          const { x, y } = getCoordinates(33, i, points.length)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          )
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(139, 92, 246, 0.25)"
          stroke="#8b5cf6"
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(139,92,246,0.4)] transition-all duration-700"
        />

        {/* Labels */}
        {points.map((p, i) => {
          const { x, y } = getCoordinates(45, i, points.length) // Place labels slightly outside
          return (
            <text
              key={i}
              x={x}
              y={y}
              fill={(p.value ?? 0) > 0 ? "#94a3b8" : "#334155"}
              fontSize="9"
              fontWeight="900"
              textAnchor="middle"
              dominantBaseline="middle"
              className="uppercase tracking-widest transition-colors duration-300"
            >
              {p.label}
            </text>
          )
        })}
      </svg>
      {/* Legend */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-2 text-[8px] uppercase tracking-widest text-slate-600 font-black text-center w-full max-w-[240px]">
        <span>LP: Life Path</span>
        <span>EX: Expression</span>
        <span>SU: Soul Urge</span>
        <span>PE: Personality</span>
        <span>BD: Birth Day</span>
        <span>MA: Maturity</span>
      </div>
    </div>
  )
}
