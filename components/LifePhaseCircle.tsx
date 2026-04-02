'use client'

import { useEffect, useState } from 'react'
import type { NumerologyResult } from '@/lib/numerology'

interface LifePhasePoint {
  age: number
  pinnacle: number
  challenge: number
  cycle: number
}
import { MASTER_NUMBERS } from '@/lib/numerology'

// ─── SVG constants ────────────────────────────────────────────────────────────
const SIZE = 520
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER_R = 185    // outer ring for age labels
const TICK_R = 170    // tick marks end
const MIN_R = 20     // minimum node radius (for value 0)
const MAX_R = 155    // maximum node radius (for value 9)

const COLORS = {
  pinnacle: '#fbbf24',  // amber
  challenge: '#f87171',  // coral
  cycle: '#34d399',  // emerald
  masc: '#60a5fa',  // blue
  fem: '#f472b6',  // pink
  ring: 'rgba(255,255,255,0.04)',
  spoke: 'rgba(255,255,255,0.06)',
  label: 'rgba(255,255,255,0.45)',
}

const AGES = [0, 10, 20, 30, 40, 50, 60, 70]

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function getPos(index: number, r: number) {
  // Clockwise from top: index 0 = 12 o'clock
  const angle = (index * 45 - 90) * (Math.PI / 180)
  return {
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  }
}

function valueToRadius(n: number): number {
  const capped = MASTER_NUMBERS.has(n) ? 9 : Math.min(9, Math.max(0, n))
  return MIN_R + (capped / 9) * (MAX_R - MIN_R)
}

function polygonPoints(points: Array<{ x: number; y: number }>): string {
  return points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Rings() {
  const radii = [40, 80, 120, TICK_R]
  return (
    <>
      {radii.map(r => (
        <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke={COLORS.ring} strokeWidth="1" />
      ))}
    </>
  )
}

function Spokes() {
  return (
    <>
      {AGES.map((_, i) => {
        const { x, y } = getPos(i, TICK_R)
        return (
          <line
            key={i}
            x1={CX} y1={CY}
            x2={x} y2={y}
            stroke={COLORS.spoke}
            strokeWidth="1"
          />
        )
      })}
    </>
  )
}

function AgeLabels() {
  return (
    <>
      {AGES.map((age, i) => {
        const { x, y } = getPos(i, OUTER_R)
        return (
          <text
            key={age}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill={COLORS.label}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500"
            letterSpacing="0.05em"
          >
            {age}
          </text>
        )
      })}
    </>
  )
}

interface DiagonalLinesProps { animated: boolean }
function DiagonalLines({ animated }: DiagonalLinesProps) {
  // Masculine: index 1 (NE, age 10) → index 5 (SW, age 50)
  const mascA = getPos(1, TICK_R)
  const mascB = getPos(5, TICK_R)
  // Feminine: index 7 (NW, age 70) → index 3 (SE, age 30)
  const femA = getPos(7, TICK_R)
  const femB = getPos(3, TICK_R)

  const lineProps = {
    strokeWidth: '1.5',
    strokeDasharray: '500',
    strokeDashoffset: animated ? '0' : '500',
    style: { transition: 'stroke-dashoffset 1.2s ease' },
  }

  return (
    <g opacity="0.6">
      {/* Masculine line */}
      <line x1={mascA.x} y1={mascA.y} x2={mascB.x} y2={mascB.y}
        stroke={COLORS.masc} {...lineProps} />
      <text x={(mascA.x + mascB.x) / 2 + 22} y={(mascA.y + mascB.y) / 2 - 8}
        fontSize="9" fill={COLORS.masc} fontFamily="Inter, system-ui"
        textAnchor="middle" letterSpacing="0.12em" fontWeight="600"
        opacity={animated ? 1 : 0} style={{ transition: 'opacity 0.6s ease 0.8s' }}
      >
        MASCULINE
      </text>

      {/* Feminine line */}
      <line x1={femA.x} y1={femA.y} x2={femB.x} y2={femB.y}
        stroke={COLORS.fem} {...lineProps} />
      <text x={(femA.x + femB.x) / 2 - 22} y={(femA.y + femB.y) / 2 - 8}
        fontSize="9" fill={COLORS.fem} fontFamily="Inter, system-ui"
        textAnchor="middle" letterSpacing="0.12em" fontWeight="600"
        opacity={animated ? 1 : 0} style={{ transition: 'opacity 0.6s ease 0.8s' }}
      >
        FEMININE
      </text>
    </g>
  )
}

interface PhasePolygonProps {
  points: LifePhasePoint[]
  type: 'pinnacle' | 'challenge' | 'cycle'
  color: string
  animated: boolean
}

function PhasePolygon({ points, type, color, animated }: PhasePolygonProps) {
  const vertices = points.map((p, i) => {
    const r = valueToRadius(p[type])
    return getPos(i, r)
  })

  const pathD = vertices
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x.toFixed(2)} ${v.y.toFixed(2)}`)
    .join(' ') + ' Z'

  return (
    <g>
      {/* Filled area */}
      <path
        d={pathD}
        fill={color}
        fillOpacity={animated ? 0.08 : 0}
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity={animated ? 0.8 : 0}
        style={{ transition: 'fill-opacity 0.8s ease, stroke-opacity 0.8s ease' }}
      />
    </g>
  )
}

interface NodeDotProps {
  point: LifePhasePoint
  index: number
  type: 'pinnacle' | 'challenge' | 'cycle'
  color: string
  animated: boolean
}

function NodeDot({ point, index, type, color, animated }: NodeDotProps) {
  const value = point[type]
  const r = valueToRadius(value)
  const pos = getPos(index, r)
  const DOT_R = 14

  if (value === 0) return null

  return (
    <g
      opacity={animated ? 1 : 0}
      style={{ transition: `opacity 0.4s ease ${0.3 + index * 0.08}s` }}
    >
      <circle cx={pos.x} cy={pos.y} r={DOT_R + 4} fill={color} fillOpacity="0.1" />
      <circle cx={pos.x} cy={pos.y} r={DOT_R} fill="#0d0f1e" stroke={color} strokeWidth="1.5" />
      <text
        x={pos.x} y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={MASTER_NUMBERS.has(value) ? '9' : '11'}
        fontWeight="700"
        fill={color}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {value}
      </text>
    </g>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface LifePhaseCircleProps {
  result: NumerologyResult
}

export default function LifePhaseCircle({ result }: LifePhaseCircleProps) {
  const [animated, setAnimated] = useState(false)
  const { lifePhasePoints } = result

  useEffect(() => {
    setAnimated(false)
    const t = setTimeout(() => setAnimated(true), 60)
    return () => clearTimeout(t)
  }, [result])

  const types = [
    { key: 'pinnacle' as const, color: COLORS.pinnacle },
    { key: 'challenge' as const, color: COLORS.challenge },
    { key: 'cycle' as const, color: COLORS.cycle },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-500">
        Life Phase Circle
      </h3>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-md mx-auto"
        role="img"
        aria-label="Circular numerology life phase chart"
      >
        {/* Background radial gradient */}
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1a1040" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#03040d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY} r={OUTER_R} fill="url(#bgGrad)" />

        <Rings />
        <Spokes />
        <DiagonalLines animated={animated} />

        {/* Phase polygons (behind nodes) */}
        {types.map(t => (
          <PhasePolygon
            key={t.key}
            points={lifePhasePoints}
            type={t.key}
            color={t.color}
            animated={animated}
          />
        ))}

        {/* Node dots (per age, per type) */}
        {types.map(t =>
          lifePhasePoints.map((p, i) => (
            <NodeDot
              key={`${t.key}-${i}`}
              point={p}
              index={i}
              type={t.key}
              color={t.color}
              animated={animated}
            />
          ))
        )}

        <AgeLabels />

        {/* Center label */}
        <text
          x={CX} y={CY - 6}
          textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.2)"
          fontFamily="Inter" letterSpacing="0.15em"
        >
          LIFE
        </text>
        <text
          x={CX} y={CY + 7}
          textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.2)"
          fontFamily="Inter" letterSpacing="0.15em"
        >
          PATH
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 flex-wrap">
        {[
          { label: 'Pinnacle', color: COLORS.pinnacle },
          { label: 'Challenge', color: COLORS.challenge },
          { label: 'Life Cycle', color: COLORS.cycle },
          { label: 'Masculine', color: COLORS.masc },
          { label: 'Feminine', color: COLORS.fem },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-[10px] text-slate-500 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
