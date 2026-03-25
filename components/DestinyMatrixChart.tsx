'use client'

import { useEffect, useState } from 'react'
import type { DestinyMatrixResult, MatrixPosition } from '@/lib/destinyMatrix'
import { CHAKRA_INFO } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'

// ─── SVG constants ────────────────────────────────────────────────────────────
const SIZE      = 580
const CX        = SIZE / 2
const CY        = SIZE / 2
const OUTER_R   = 200   // radius of outer node centers
const LABEL_R   = 240   // radius of position labels
const NODE_R    = 22    // outer node circle radius
const CENTER_R  = 30    // center node radius

// ─── Geometry ─────────────────────────────────────────────────────────────────

/** Convert an octagram angle (0=North, clockwise) to SVG x,y */
function polar(angleDeg: number, r: number): { x: number; y: number } {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function positionById(positions: MatrixPosition[], key: string): MatrixPosition | undefined {
  return positions.find(p => p.key === key)
}

// ─── Label anchor helper ──────────────────────────────────────────────────────

function labelAnchor(angle: number): 'middle' | 'start' | 'end' {
  // Determine text-anchor based on position around the circle
  const a = ((angle % 360) + 360) % 360
  if (a > 340 || a < 20)  return 'middle'   // North
  if (a < 70)             return 'start'    // NE
  if (a < 110)            return 'start'    // East
  if (a < 160)            return 'start'    // SE
  if (a < 200)            return 'middle'   // South
  if (a < 250)            return 'end'      // SW
  if (a < 290)            return 'end'      // West
  if (a < 340)            return 'end'      // NW
  return 'middle'
}

function labelOffset(angle: number): { dx: number; dy: number } {
  // Extra nudge so label doesn't collide with node
  const a = ((angle % 360) + 360) % 360
  if (a > 340 || a < 20)  return { dx:  0, dy: -8 }
  if (a < 70)             return { dx:  6, dy: -6 }
  if (a < 110)            return { dx:  8, dy:  0 }
  if (a < 160)            return { dx:  6, dy:  6 }
  if (a < 200)            return { dx:  0, dy:  8 }
  if (a < 250)            return { dx: -6, dy:  6 }
  if (a < 290)            return { dx: -8, dy:  0 }
  return                          { dx: -6, dy: -6 }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface AxisLinesProps {
  positions: MatrixPosition[]
  axes: DestinyMatrixResult['axes']
  animated: boolean
}

function AxisLines({ positions, axes, animated }: AxisLinesProps) {
  return (
    <g>
      {axes.map(axis => {
        const from = positionById(positions, axis.from)
        const to   = positionById(positions, axis.to)
        if (!from || !to) return null
        const a = polar(from.angle, OUTER_R)
        const b = polar(to.angle, OUTER_R)
        const gradId = `grad-${axis.from}-${axis.to}`
        const fromColor = CHAKRA_INFO[from.chakra].color
        const toColor   = CHAKRA_INFO[to.chakra].color
        return (
          <g key={axis.from + axis.to}>
            <defs>
              <linearGradient id={gradId} x1={a.x} y1={a.y} x2={b.x} y2={b.y} gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor={fromColor} stopOpacity="0.6" />
                <stop offset="50%"  stopColor="#ffffff"   stopOpacity="0.1" />
                <stop offset="100%" stopColor={toColor}   stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={`url(#${gradId})`}
              strokeWidth="1"
              strokeDasharray="600"
              strokeDashoffset={animated ? '0' : '600'}
              style={{ transition: 'stroke-dashoffset 1.4s ease' }}
            />
          </g>
        )
      })}
    </g>
  )
}

function DiamondShapes({ positions }: { positions: MatrixPosition[] }) {
  // Diamond 1: N-E-S-W (angles 0, 90, 180, 270)
  const d1Keys   = ['north', 'east', 'south', 'west']
  const d1Points = d1Keys
    .map(k => positionById(positions, k))
    .filter(Boolean)
    .map(p => polar(p!.angle, OUTER_R))
    .map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')

  // Diamond 2: NE-SE-SW-NW (angles 45, 135, 225, 315)
  const d2Keys   = ['ne', 'se', 'sw', 'nw']
  const d2Points = d2Keys
    .map(k => positionById(positions, k))
    .filter(Boolean)
    .map(p => polar(p!.angle, OUTER_R))
    .map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')

  return (
    <g>
      <polygon points={d1Points} fill="rgba(139,92,246,0.04)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" />
      <polygon points={d2Points} fill="rgba(6,182,212,0.04)"  stroke="rgba(6,182,212,0.25)"  strokeWidth="1" />
    </g>
  )
}

function ConcentriRings() {
  return (
    <g>
      {[50, 100, 150, OUTER_R].map(r => (
        <circle key={r} cx={CX} cy={CY} r={r}
          fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}
    </g>
  )
}

interface NodeProps {
  position: MatrixPosition
  animated: boolean
  delay: number
}

function Node({ position, animated, delay }: NodeProps) {
  const { x, y }  = polar(position.angle, OUTER_R)
  const chakra     = CHAKRA_INFO[position.chakra]
  const arcana     = getArcana(position.number)
  const color      = chakra.color
  const lx         = polar(position.angle, LABEL_R)
  const anchor     = labelAnchor(position.angle)
  const { dx, dy } = labelOffset(position.angle)

  return (
    <g
      opacity={animated ? 1 : 0}
      style={{ transition: `opacity 0.5s ease ${delay}s` }}
    >
      {/* Glow halo */}
      <circle cx={x} cy={y} r={NODE_R + 8} fill={color} fillOpacity="0.08" />
      {/* Node ring */}
      <circle cx={x} cy={y} r={NODE_R} fill="#0a0a14"
        stroke={color} strokeWidth="1.5" />
      {/* Number */}
      <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
        fontSize={position.number >= 10 ? '11' : '13'}
        fontWeight="700" fill={color}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {position.number}
      </text>

      {/* Position label */}
      <text
        x={lx.x + dx} y={lx.y + dy}
        textAnchor={anchor}
        fontSize="8.5" fill={color} fillOpacity="0.85"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600" letterSpacing="0.07em"
        style={{ textTransform: 'uppercase' }}
      >
        {position.label.toUpperCase()}
      </text>
      {/* Arcana name below label */}
      <text
        x={lx.x + dx} y={lx.y + dy + 11}
        textAnchor={anchor}
        fontSize="7.5" fill="rgba(255,255,255,0.3)"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {arcana.name}
      </text>
    </g>
  )
}

interface CenterNodeProps {
  position: MatrixPosition
  animated: boolean
}

function CenterNode({ position, animated }: CenterNodeProps) {
  const arcana = getArcana(position.number)
  const color  = '#c084fc'

  return (
    <g opacity={animated ? 1 : 0} style={{ transition: 'opacity 0.6s ease 0.9s' }}>
      {/* Outer glow rings */}
      <circle cx={CX} cy={CY} r={CENTER_R + 20} fill={color} fillOpacity="0.04" />
      <circle cx={CX} cy={CY} r={CENTER_R + 10} fill={color} fillOpacity="0.07" />
      {/* Main node */}
      <circle cx={CX} cy={CY} r={CENTER_R} fill="#0a0a14"
        stroke={color} strokeWidth="2" />
      {/* Number */}
      <text x={CX} y={CY - 5} textAnchor="middle" dominantBaseline="middle"
        fontSize="15" fontWeight="800" fill={color}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {position.number}
      </text>
      {/* Arcana hint */}
      <text x={CX} y={CY + 10} textAnchor="middle"
        fontSize="6.5" fill="rgba(192,132,252,0.5)"
        fontFamily="Inter, system-ui, sans-serif"
        letterSpacing="0.1em"
      >
        {arcana.name.toUpperCase()}
      </text>
    </g>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DestinyMatrixChartProps {
  result: DestinyMatrixResult
}

export default function DestinyMatrixChart({ result }: DestinyMatrixChartProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setAnimated(false)
    const t = setTimeout(() => setAnimated(true), 80)
    return () => clearTimeout(t)
  }, [result])

  return (
    <div className="flex flex-col gap-4">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-lg mx-auto"
        role="img"
        aria-label="Destiny Matrix octagram chart"
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%">
            <stop offset="0%"   stopColor="#c084fc" stopOpacity="0.15" />
            <stop offset="70%"  stopColor="#1a0a2e" stopOpacity="0.3"  />
            <stop offset="100%" stopColor="#03040d" stopOpacity="0"    />
          </radialGradient>
          <filter id="glow-soft">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background haze */}
        <circle cx={CX} cy={CY} r={OUTER_R + 20} fill="url(#centerGlow)" />

        {/* Structural layers */}
        <ConcentriRings />
        <DiamondShapes positions={result.positions} />
        <AxisLines positions={result.positions} axes={result.axes} animated={animated} />

        {/* Nodes */}
        {result.positions.map((pos, i) => (
          <Node key={pos.key} position={pos} animated={animated} delay={0.1 + i * 0.08} />
        ))}

        {/* Center */}
        <CenterNode position={result.center} animated={animated} />
      </svg>

      {/* Axes legend */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {result.axes.map(axis => (
          <div key={axis.label} className="flex items-center gap-1.5">
            <div className="w-5 h-px" style={{ background: axis.color }} />
            <span className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold">
              {axis.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
