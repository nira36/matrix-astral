'use client'

import React, { useState, useRef } from 'react'
import type { NatalChartData, PlanetPosition, Aspect, AspectType, ZodiacSign } from '@/lib/astrology'
import { ZODIAC_SIGNS, ZODIAC_GLYPHS, ZODIAC_PATHS, ZODIAC_ELEMENTS, ZODIAC_INFO, PLANET_GLYPHS, ASPECT_COLORS, ASPECT_SYMBOLS, getPlanetInterpretation } from '@/lib/astrology'

// ─── Layout constants ──────────────────────────────────────────────────────
// New layout: outermost = houses, then zodiac ring, then planets inside, then aspects
const SIZE = 720
const CX = SIZE / 2
const CY = SIZE / 2

const OUTER_R = 340        // Outer boundary
const HOUSE_LABEL_R = 325  // House number text
const SIGN_OUTER_R = 310   // Zodiac sign ring outer edge
const SIGN_INNER_R = 275   // Zodiac sign ring inner edge (with degree ticks)
const PLANET_R = 245       // Planet glyphs ring
const CUSP_INNER_R = 210   // House cusp lines end here
const ASPECT_R = 210       // Aspect lines connect at cusp inner ring (no gap)

function degToRad(d: number) { return (d * Math.PI) / 180 }

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = degToRad(deg)
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
}


// ─── Quadrant-stretched angle mapping ──────────────────────────────────────
function makeChartAngle(ascLng: number, mcLng: number) {
  const dscLng = (ascLng + 180) % 360
  const icLng = (mcLng + 180) % 360
  const quads = [
    { eStart: mcLng,  eEnd: ascLng, cStart: 90,  cEnd: 180 },
    { eStart: ascLng, eEnd: icLng,  cStart: 180, cEnd: 270 },
    { eStart: icLng,  eEnd: dscLng, cStart: 270, cEnd: 360 },
    { eStart: dscLng, eEnd: mcLng,  cStart: 0,   cEnd: 90  },
  ]
  return (longitude: number): number => {
    const lng = ((longitude % 360) + 360) % 360
    for (const q of quads) {
      const start = ((q.eStart % 360) + 360) % 360
      const end = ((q.eEnd % 360) + 360) % 360
      let span = end - start
      if (span <= 0) span += 360
      let offset = lng - start
      if (offset < 0) offset += 360
      if (offset >= 0 && offset < span) {
        return (q.cStart + (offset / span) * (q.cEnd - q.cStart) + 360) % 360
      }
    }
    return ((longitude - ascLng + 180 + 360) % 360)
  }
}

// ─── Planet overlap spreading ──────────────────────────────────────────────
function spreadAngles(items: { chartAngle: number; planet: string }[], minGap: number) {
  const sorted = [...items].sort((a, b) => a.chartAngle - b.chartAngle)
  const result = sorted.map(p => ({ ...p, displayAngle: p.chartAngle }))
  for (let pass = 0; pass < 5; pass++) {
    for (let i = 1; i < result.length; i++) {
      let diff = result[i].displayAngle - result[i - 1].displayAngle
      if (diff < 0) diff += 360
      if (diff < minGap) result[i].displayAngle = (result[i - 1].displayAngle + minGap) % 360
    }
    if (result.length > 1) {
      let diff = result[0].displayAngle + 360 - result[result.length - 1].displayAngle
      if (diff < minGap) result[result.length - 1].displayAngle = (result[0].displayAngle + 360 - minGap) % 360
    }
  }
  return result
}

// ─── Aspect filter types ───────────────────────────────────────────────────
type AspectFilter = 'all' | AspectType

const FILTER_BUTTONS: { filter: AspectFilter; label: string; symbol: string; color: string }[] = [
  { filter: 'all',         label: 'All',           symbol: '●', color: '#94a3b8' },
  { filter: 'Conjunction', label: 'Conjunctions',  symbol: '☌', color: '#c4b5fd' },
  { filter: 'Opposition',  label: 'Oppositions',   symbol: '☍', color: '#ef4444' },
  { filter: 'Square',      label: 'Squares',        symbol: '□', color: '#ef4444' },
  { filter: 'Trine',       label: 'Trines',          symbol: '△', color: '#3b82f6' },
  { filter: 'Sextile',     label: 'Sextiles',        symbol: '⚹', color: '#3b82f6' },
]

export default function NatalChartWheel({ data }: { data: NatalChartData }) {
  const [hovered, setHovered] = useState<PlanetPosition | null>(null)
  const [hoveredAspect, setHoveredAspect] = useState<Aspect | null>(null)
  const [selectedSign, setSelectedSign] = useState<{ sign: ZodiacSign; x: number; y: number } | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const [aspectFilter, setAspectFilter] = useState<AspectFilter>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!filterOpen) return
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterOpen])

  const ascLng = data.ascendantLongitude
  const toAngle = makeChartAngle(ascLng, data.mcLongitude)

  const allPlanets = data.planets.map(p => ({ ...p, chartAngle: toAngle(p.longitude) }))
  const realPlanets = allPlanets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
  const glyphPlanets = spreadAngles(
    allPlanets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC'), 10
  )

  const visibleAspects = data.aspects.filter(a => {
    if (a.orb > 8) return false
    return aspectFilter === 'all' || a.type === aspectFilter
  })

  const aspectCounts: Record<string, number> = {}
  data.aspects.filter(a => a.orb <= 8).forEach(a => { aspectCounts[a.type] = (aspectCounts[a.type] || 0) + 1 })

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* ─── Aspect filter (compact) ─── */}
      {(() => {
        const activeBtn = FILTER_BUTTONS.find(b => b.filter === aspectFilter) ?? FILTER_BUTTONS[0]
        const totalCount = data.aspects.filter(a => a.orb <= 8).length
        const activeCount = aspectFilter === 'all' ? totalCount : (aspectCounts[aspectFilter] || 0)
        return (
          <div className="relative inline-flex justify-center" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(v => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider
                         border border-white/[0.1] bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] transition-all"
            >
              <span style={{ color: activeBtn.color }} className="text-sm">{activeBtn.symbol}</span>
              <span>{activeBtn.label}</span>
              <span className="text-slate-500">({activeCount})</span>
              <svg width="10" height="10" viewBox="0 0 10 10" className={`ml-1 text-slate-500 transition-transform ${filterOpen ? 'rotate-180' : ''}`}>
                <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {filterOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-white/[0.08] bg-[#131825] shadow-2xl shadow-black/60 overflow-hidden animate-fade-up">
                {FILTER_BUTTONS.map(({ filter, label, symbol, color }) => {
                  const count = filter === 'all' ? totalCount : (aspectCounts[filter] || 0)
                  const isActive = aspectFilter === filter
                  return (
                    <button
                      key={filter}
                      onClick={() => { setAspectFilter(isActive ? 'all' : filter); setFilterOpen(false) }}
                      className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-all
                        ${isActive ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-300'}
                        ${filter !== 'all' ? 'border-t border-white/[0.05]' : ''}`}
                    >
                      <span style={{ color }} className="text-sm w-4 text-center">{symbol}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider flex-1">{label}</span>
                      <span className="text-[9px] text-slate-500">({count})</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })()}

      {/* ─── SVG Chart ─── */}
      <div className="relative flex items-center justify-center w-full" ref={chartRef}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[720px] max-sm:max-w-[360px] h-auto" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

          {/* ─── Defs: glow + animations ─── */}
          <defs>
            <radialGradient id="chartGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.06)" />
              <stop offset="40%" stopColor="rgba(100,120,180,0.03)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <style>{`
              @keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes spinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
              @keyframes breathe { 0%,100% { opacity: 0.2; } 50% { opacity: 0.35; } }
              @keyframes dashFlow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -20; } }
              @keyframes aspectGlow {
                0%   { opacity: var(--lo); }
                50%  { opacity: var(--hi); }
                100% { opacity: var(--lo); }
              }
              .ring-cw { animation: spinCW 600s linear infinite; transform-origin: ${CX}px ${CY}px; }
              .ring-ccw { animation: spinCCW 480s linear infinite; transform-origin: ${CX}px ${CY}px; }
              .ring-breathe { animation: breathe 8s ease-in-out infinite; }
              .dash-flow { animation: dashFlow 30s linear infinite; }
              .aspect-pulse {
                animation: aspectGlow var(--dur) cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
                animation-delay: var(--delay);
                opacity: var(--lo);
              }
            `}</style>
          </defs>
          <circle cx={CX} cy={CY} r={OUTER_R + 10} fill="url(#chartGlow)" />

          {/* ─── Rings ─── */}
          <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" className="ring-ccw" />
          <circle cx={CX} cy={CY} r={SIGN_OUTER_R} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={SIGN_INNER_R} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={ASPECT_R} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" className="ring-breathe" />

          {/* ─── Degree ticks (full width across zodiac ring, slow clockwise rotation) ─── */}
          <g className="ring-cw">
            {Array.from({ length: 360 }, (_, deg) => {
              if (deg % 30 === 0) return null
              const angle = toAngle(deg)
              const isMajor = deg % 10 === 0
              const isMid = deg % 5 === 0
              // Ticks span from sign inner to sign outer (full ring width)
              // Major (10°): full width, Mid (5°): 60% width, Minor (1°): 30% width
              const ringWidth = SIGN_OUTER_R - SIGN_INNER_R
              const tickLen = isMajor ? ringWidth : isMid ? ringWidth * 0.5 : ringWidth * 0.25
              const p1 = polar(CX, CY, SIGN_INNER_R, angle)
              const p2 = polar(CX, CY, SIGN_INNER_R + tickLen, angle)
              return (
                <line key={`d${deg}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={isMajor ? 'rgba(255,255,255,0.25)' : isMid ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}
                  strokeWidth={isMajor ? '0.8' : '0.5'} />
              )
            })}
          </g>

          {/* ─── Zodiac sign ring with SVG icons ─── */}
          {ZODIAC_SIGNS.map((sign, i) => {
            const startAngle = toAngle(i * 30)
            const midAngle = toAngle(i * 30 + 15)
            const p1 = polar(CX, CY, SIGN_OUTER_R, startAngle)
            const p2 = polar(CX, CY, SIGN_INNER_R, startAngle)
            const iconPos = polar(CX, CY, (SIGN_OUTER_R + SIGN_INNER_R) / 2, midAngle)

            const isSelected = selectedSign?.sign === sign
            return (
              <g key={sign}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                {/* SVG icon (standard zodiac glyph) */}
                <g
                  transform={`translate(${iconPos.x - 9}, ${iconPos.y - 9})`}
                  onClick={(e) => {
                    if (isSelected) { setSelectedSign(null); return }
                    const rect = chartRef.current?.getBoundingClientRect()
                    if (!rect) return
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    setSelectedSign({ sign, x, y })
                  }}
                  className="cursor-pointer"
                >
                  {/* Invisible hit area */}
                  <rect x="0" y="0" width="18" height="18" fill="transparent" />
                  {ZODIAC_PATHS[sign].map((d, pi) => (
                    <path key={pi} d={d}
                      fill="none"
                      stroke={isSelected ? '#a78bfa' : 'rgba(255,255,255,0.55)'}
                      strokeWidth={isSelected ? 1.8 : 1.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </g>
              </g>
            )
          })}

          {/* ─── House cusp lines (from sign inner ring inward) + numbers outside ─── */}
          {data.houses.map((h, i) => {
            const angle = toAngle(h.longitude)
            const pOuter = polar(CX, CY, SIGN_INNER_R, angle)
            const pInner = polar(CX, CY, CUSP_INNER_R, angle)
            const isCardinal = i === 0 || i === 3 || i === 6 || i === 9

            // House number between sign outer ring and outer boundary
            const nextAngle = toAngle(data.houses[(i + 1) % 12].longitude)
            let midA = (angle + nextAngle) / 2
            if (Math.abs(nextAngle - angle) > 180) midA = (angle + nextAngle + 360) / 2
            midA = midA % 360
            const labelPos = polar(CX, CY, HOUSE_LABEL_R, midA)

            return (
              <g key={`h${i}`}>
                <line x1={pOuter.x} y1={pOuter.y} x2={pInner.x} y2={pInner.y}
                  stroke={isCardinal ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isCardinal ? '1.2' : '0.5'} />
                <text x={labelPos.x} y={labelPos.y}
                  fill={isCardinal ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)'}
                  fontSize="10" fontWeight="700"
                  textAnchor="middle" dominantBaseline="middle">
                  {h.house}
                </text>
              </g>
            )
          })}

          {/* ─── AC / MC / DC / IC labels ─── */}
          {[
            { label: 'AC', angle: 180, bold: true },
            { label: 'DC', angle: 0, bold: false },
            { label: 'MC', angle: 90, bold: true },
            { label: 'IC', angle: 270, bold: false },
          ].map(({ label, angle, bold }) => {
            const pos = polar(CX, CY, OUTER_R + 14, angle)
            return (
              <text key={label} x={pos.x} y={pos.y}
                fill={bold ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)'}
                fontSize="10" fontWeight="800"
                textAnchor="middle" dominantBaseline="middle">
                {label}
              </text>
            )
          })}

          {/* ─── AC-DC and MC-IC axis lines (dashes flow) ─── */}
          {[180, 90].map(angle => {
            const p1 = polar(CX, CY, SIGN_INNER_R, angle)
            const p2 = polar(CX, CY, SIGN_INNER_R, (angle + 180) % 360)
            return <line key={`ax${angle}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" strokeDasharray="6 4"
              className="dash-flow" />
          })}

          {/* ─── Aspect lines (innermost) ─── */}
          {visibleAspects.map((asp, i) => {
            const p1 = realPlanets.find(p => p.planet === asp.planet1)
            const p2 = realPlanets.find(p => p.planet === asp.planet2)
            if (!p1 || !p2) return null
            const pt1 = polar(CX, CY, ASPECT_R, p1.chartAngle)
            const pt2 = polar(CX, CY, ASPECT_R, p2.chartAngle)
            const isHov = hoveredAspect === asp
            const color = ASPECT_COLORS[asp.type]
            const isTense = asp.type === 'Square' || asp.type === 'Opposition'
            const isFiltered = aspectFilter !== 'all'
            const loOp = isHov ? 0.9 : isFiltered ? 0.5 : 0.15
            const hiOp = isHov ? 1 : isFiltered ? 0.9 : 0.55
            // Pseudo-random duration (5–12s) and delay (0–10s) per line
            const dur = 5 + ((i * 37 + 13) % 8)
            const delay = ((i * 53 + 7) % 11)
            const isDashed = asp.type === 'Sextile'
            return (
              <line key={`a${i}`} x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y}
                stroke={color}
                strokeWidth={isHov ? '2.5' : isFiltered ? '1.5' : isTense ? '1' : '0.7'}
                strokeDasharray={isDashed ? '3 2' : undefined}
                className={`${isDashed ? 'dash-flow ' : ''}aspect-pulse`}
                onMouseEnter={() => setHoveredAspect(asp)}
                onMouseLeave={() => setHoveredAspect(null)}
                style={{
                  cursor: 'pointer',
                  '--lo': loOp,
                  '--hi': hiOp,
                  '--dur': `${dur}s`,
                  '--delay': `${delay}s`,
                } as React.CSSProperties} />
            )
          })}

          {/* ─── Planet glyphs (INSIDE zodiac ring) ─── */}
          {glyphPlanets.map((p) => {
            const gPos = polar(CX, CY, PLANET_R, p.displayAngle)
            // Tick from planet to sign inner ring at real angle
            const tickTo = polar(CX, CY, SIGN_INNER_R, p.chartAngle)
            const tickFrom = polar(CX, CY, PLANET_R + 14, p.chartAngle)
            const isHov = hovered?.planet === p.planet
            const pd = allPlanets.find(ap => ap.planet === p.planet)!
            const isSec = ['North Node', 'Lilith', 'Chiron', 'Fortune'].includes(p.planet)
            const gr = isSec ? (isHov ? 10 : 8) : (isHov ? 13 : 11)
            const gf = isSec ? '10' : '13'

            // Degree label position (between planet glyph and sign ring)
            const degPos = polar(CX, CY, PLANET_R + (isSec ? 12 : 16), p.displayAngle)

            return (
              <g key={p.planet}
                onMouseEnter={() => setHovered(pd)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer">

                {/* Tick line from planet to sign ring */}
                <line x1={tickFrom.x} y1={tickFrom.y} x2={tickTo.x} y2={tickTo.y}
                  stroke={isHov ? 'rgba(255,255,255,0.5)' : isSec ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="0.6" />

                {/* Glyph circle */}
                <circle cx={gPos.x} cy={gPos.y} r={gr}
                  fill={isHov ? 'rgba(139,92,246,0.15)' : 'rgba(0,0,0,0.6)'}
                  stroke={isHov ? 'rgba(139,92,246,0.6)' : isSec ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.25)'}
                  strokeWidth={isHov ? '1.5' : '0.7'}
                  className="transition-all duration-200" />

                {/* Planet symbol */}
                <text x={gPos.x} y={gPos.y + 1}
                  fill={isHov ? 'white' : isSec ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.75)'}
                  fontSize={gf} textAnchor="middle" dominantBaseline="middle"
                  className="transition-all duration-200">
                  {PLANET_GLYPHS[p.planet] || p.planet[0]}
                </text>

                {/* Retrograde */}
                {pd.retrograde && (
                  <text x={gPos.x + (isSec ? 7 : 10)} y={gPos.y - (isSec ? 5 : 8)}
                    fill="rgba(248,113,113,0.8)" fontSize="6" fontWeight="800">R</text>
                )}

                {/* Degree label */}
                {!isSec && (
                  <text x={degPos.x} y={degPos.y}
                    fill="rgba(255,255,255,0.3)" fontSize="7"
                    textAnchor="middle" dominantBaseline="middle">
                    {pd.signDegree}°{pd.minute.toString().padStart(2, '0')}'
                  </text>
                )}
              </g>
            )
          })}

          <circle cx={CX} cy={CY} r="2" fill="rgba(255,255,255,0.15)" />
        </svg>

        {/* ─── Tooltip ─── */}
        {hovered && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+12px)] z-50
                          bg-[#0f0f1e] border border-white/10 rounded-xl px-5 py-4 shadow-2xl shadow-black/50
                          min-w-[260px] max-w-[320px] pointer-events-none animate-fade-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{PLANET_GLYPHS[hovered.planet]}</span>
              <div>
                <span className="text-sm font-bold text-white">{hovered.planet}</span>
                {hovered.retrograde && <span className="ml-1.5 text-[9px] text-red-400 font-bold">℞ Retrograde</span>}
                <p className="text-[10px] text-slate-400">
                  {ZODIAC_GLYPHS[hovered.sign]} {hovered.sign} {hovered.signDegree}°{hovered.minute.toString().padStart(2, '0')}' · House {hovered.house}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              {getPlanetInterpretation(hovered.planet, hovered.sign)}
            </p>
          </div>
        )}

        {selectedSign && !hovered && (() => {
          const s = selectedSign.sign
          const info = ZODIAC_INFO[s]
          const containerW = chartRef.current?.offsetWidth ?? 720
          const containerH = chartRef.current?.offsetHeight ?? 720
          const flipX = selectedSign.x > containerW / 2
          const flipY = selectedSign.y > containerH * 0.65
          return (
            <div
              className="absolute z-50 bg-[#0f0f1e] border border-white/10 rounded-xl px-4 py-3 shadow-2xl shadow-black/50
                          w-[220px] animate-fade-up pointer-events-none"
              style={{
                left: flipX ? undefined : selectedSign.x + 12,
                right: flipX ? containerW - selectedSign.x + 12 : undefined,
                top: flipY ? undefined : selectedSign.y - 10,
                bottom: flipY ? containerH - selectedSign.y + 12 : undefined,
              }}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-xl">{ZODIAC_GLYPHS[s]}</span>
                <div>
                  <span className="text-xs font-bold text-white">{s}</span>
                  <p className="text-[9px] text-slate-400">
                    {info.dates} · {ZODIAC_ELEMENTS[s]} · {info.quality}
                  </p>
                </div>
              </div>
              <p className="text-[9px] text-slate-500 leading-relaxed mb-0.5">
                <span className="text-slate-400 font-semibold">Ruler:</span> {PLANET_GLYPHS[info.ruler]} {info.ruler}
              </p>
              <p className="text-[9px] text-slate-500 leading-relaxed">
                {info.keywords}
              </p>
            </div>
          )
        })()}

        {hoveredAspect && !hovered && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                          bg-[#0f0f1e] border border-white/10 rounded-xl px-4 py-3 shadow-2xl shadow-black/50
                          pointer-events-none animate-fade-up">
            <div className="flex items-center gap-2">
              <span style={{ color: ASPECT_COLORS[hoveredAspect.type] }} className="text-lg">
                {ASPECT_SYMBOLS[hoveredAspect.type]}
              </span>
              <div>
                <span className="text-xs font-bold text-white">
                  {hoveredAspect.planet1} {ASPECT_SYMBOLS[hoveredAspect.type]} {hoveredAspect.planet2}
                </span>
                <p className="text-[10px] text-slate-500">
                  {hoveredAspect.type} · Orb {hoveredAspect.orb}° · {hoveredAspect.applying ? 'Applying' : 'Separating'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Triangular Aspect Grid ─── */}
      <AspectGrid data={data} />
    </div>
  )
}

// ─── Aspect Grid Component (triangular matrix) ────────────────────────────

const GRID_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'North Node', 'Lilith', 'Chiron', 'Ascendant', 'MC']

function AspectGrid({ data }: { data: NatalChartData }) {
  const [hoveredCell, setHoveredCell] = useState<{ p1: string; p2: string; asp: Aspect } | null>(null)

  const aspectMap = new Map<string, Aspect>()
  data.aspects.filter(a => a.orb <= 8).forEach(a => {
    aspectMap.set(`${a.planet1}-${a.planet2}`, a)
    aspectMap.set(`${a.planet2}-${a.planet1}`, a)
  })

  const planets = GRID_PLANETS.filter(name => data.planets.some(p => p.planet === name))
  const [cellSize, setCellSize] = useState(36)
  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setCellSize(w < 400 ? 20 : w < 640 ? 24 : 36)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const aspectsByType: Record<string, Aspect[]> = {}
  data.aspects.filter(a => a.orb <= 8).forEach(a => {
    if (!aspectsByType[a.type]) aspectsByType[a.type] = []
    aspectsByType[a.type].push(a)
  })

  const aspectTypeOrder: AspectType[] = ['Conjunction', 'Opposition', 'Square', 'Trine', 'Sextile']
  const aspectTypeNames: Record<string, string> = {
    Conjunction: 'Conjunctions', Opposition: 'Oppositions', Square: 'Squares', Trine: 'Trines', Sextile: 'Sextiles'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-start w-full lg:justify-items-stretch">
      {/* ─── Left: Triangular grid ─── */}
      <div className="overflow-x-auto">
        <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-3">Aspect Grid</h3>
        <div className="inline-block">
          {planets.map((rowPlanet, rowIdx) => {
            if (rowIdx === 0) return null
            const rowData = data.planets.find(p => p.planet === rowPlanet)
            return (
              <div key={rowPlanet} className="flex items-center">
                <div style={{ width: cellSize, height: cellSize }} className="flex items-center justify-center shrink-0" title={rowPlanet}>
                  <span className="text-[10px] sm:text-sm text-slate-400">{PLANET_GLYPHS[rowPlanet] || rowPlanet[0]}</span>
                  {rowData?.retrograde && <span className="text-[4px] sm:text-[6px] text-red-400/70 ml-0.5">R</span>}
                </div>
                {planets.slice(0, rowIdx).map((colPlanet) => {
                  const asp = aspectMap.get(`${rowPlanet}-${colPlanet}`)
                  const isHov = hoveredCell?.p1 === rowPlanet && hoveredCell?.p2 === colPlanet
                  return (
                    <div key={colPlanet} style={{ width: cellSize, height: cellSize }}
                      className={`flex items-center justify-center border transition-colors duration-150
                        ${asp ? 'border-white/[0.12] cursor-pointer hover:bg-white/[0.08]' : 'border-white/[0.06]'}
                        ${isHov ? 'bg-white/[0.1] border-white/[0.2]' : ''}`}
                      onMouseEnter={() => asp && setHoveredCell({ p1: rowPlanet, p2: colPlanet, asp })}
                      onMouseLeave={() => setHoveredCell(null)}>
                      {asp && (
                        <span style={{ color: ASPECT_COLORS[asp.type], fontSize: cellSize < 24 ? '10px' : undefined }} className="text-xs sm:text-base font-bold">
                          {ASPECT_SYMBOLS[asp.type]}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
          <div className="flex">
            <div style={{ width: cellSize }} />
            {planets.slice(0, planets.length - 1).map(colPlanet => {
              const pd = data.planets.find(p => p.planet === colPlanet)
              return (
                <div key={colPlanet} style={{ width: cellSize, height: cellSize }} className="flex items-center justify-center" title={colPlanet}>
                  <span className="text-[10px] sm:text-sm text-slate-400">{PLANET_GLYPHS[colPlanet] || colPlanet[0]}</span>
                  {pd?.retrograde && <span className="text-[4px] sm:text-[6px] text-red-400/70 ml-0.5">R</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Hover detail below grid */}
        <div className="h-8 mt-2">
          {hoveredCell && (
            <div className="flex items-center gap-2 text-[11px] animate-fade-up">
              <span className="text-slate-400">{PLANET_GLYPHS[hoveredCell.p1]}</span>
              <span className="text-slate-300 font-bold">{hoveredCell.p1}</span>
              <span style={{ color: ASPECT_COLORS[hoveredCell.asp.type] }} className="text-base">
                {ASPECT_SYMBOLS[hoveredCell.asp.type]}
              </span>
              <span className="text-slate-300 font-bold">{hoveredCell.p2}</span>
              <span className="text-slate-400">{PLANET_GLYPHS[hoveredCell.p2]}</span>
              <span className="text-slate-600 ml-1">
                {hoveredCell.asp.type} · {hoveredCell.asp.orb}° · {hoveredCell.asp.applying ? 'App' : 'Sep'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ─── Right: Aspect summary (2-col, right-aligned) ─── */}
      <div className="flex flex-col gap-3 lg:ml-auto">
        <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500">Aspect Summary</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 sm:gap-y-3">
          {aspectTypeOrder.map(type => {
            const list = aspectsByType[type] || []
            if (list.length === 0) return null
            return (
              <div key={type} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span style={{ color: ASPECT_COLORS[type] }} className="text-xs sm:text-sm">{ASPECT_SYMBOLS[type]}</span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">{aspectTypeNames[type]}</span>
                  <span className="text-[10px] sm:text-[11px] text-slate-600">({list.length})</span>
                </div>
                {list.map((a, i) => (
                  <div key={i} className="flex items-center gap-1 sm:gap-1.5 ml-3 sm:ml-4 text-[10px] sm:text-[11px] leading-tight">
                    <span className="text-slate-500">{PLANET_GLYPHS[a.planet1]}</span>
                    <span style={{ color: ASPECT_COLORS[a.type] }}>{ASPECT_SYMBOLS[a.type]}</span>
                    <span className="text-slate-500">{PLANET_GLYPHS[a.planet2]}</span>
                    <span className="text-slate-600 font-mono ml-0.5">{a.orb}°</span>
                    <span className={`text-[9px] sm:text-[10px] ${a.applying ? 'text-emerald-500/50' : 'text-slate-700'}`}>
                      {a.applying ? 'app' : 'sep'}
                    </span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
