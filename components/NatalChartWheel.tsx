'use client'

import React, { useState } from 'react'
import type { NatalChartData, PlanetPosition, Aspect, ZodiacSign } from '@/lib/astrology'
import { ZODIAC_SIGNS, ZODIAC_GLYPHS, PLANET_GLYPHS, ASPECT_COLORS, ASPECT_SYMBOLS, getPlanetInterpretation } from '@/lib/astrology'

const SIZE = 600
const CX = SIZE / 2
const CY = SIZE / 2

const OUTER_R = 270
const SIGN_R = 245
const HOUSE_R = 200
const INNER_R = 180
const PLANET_R = 150
const ASPECT_R = 110

function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  // Astrological convention: 0° Aries = left (9 o'clock), counter-clockwise
  // We rotate so ASC (left) is at 180° in SVG
  const rad = degToRad(angleDeg)
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad), // SVG y is inverted
  }
}

// Convert ecliptic longitude to chart angle (ASC on left)
function toChartAngle(longitude: number, ascLng: number): number {
  return ((longitude - ascLng + 180 + 360) % 360)
}

export default function NatalChartWheel({ data }: { data: NatalChartData }) {
  const [hovered, setHovered] = useState<PlanetPosition | null>(null)
  const [hoveredAspect, setHoveredAspect] = useState<Aspect | null>(null)

  const ascLng = data.ascendantLongitude

  // Compute chart angles for all planets
  const planetAngles = data.planets.map(p => ({
    ...p,
    chartAngle: toChartAngle(p.longitude, ascLng),
  }))

  // Separate actual planets from AC/MC for aspect rendering
  const realPlanets = planetAngles.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')

  // Spread overlapping planets slightly
  const spreadPlanets = (() => {
    const sorted = [...planetAngles].sort((a, b) => a.chartAngle - b.chartAngle)
    const result = sorted.map(p => ({ ...p, displayAngle: p.chartAngle }))
    for (let i = 1; i < result.length; i++) {
      const diff = result[i].displayAngle - result[i - 1].displayAngle
      if (diff < 8 && diff >= 0) {
        result[i].displayAngle = result[i - 1].displayAngle + 8
      }
    }
    return result
  })()

  return (
    <div className="relative flex items-center justify-center w-full">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[600px] h-auto"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* ─── Outer ring: Zodiac signs ─── */}
        <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx={CX} cy={CY} r={SIGN_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

        {/* Sign divisions (every 30°) and glyphs */}
        {ZODIAC_SIGNS.map((sign, i) => {
          const startAngle = toChartAngle(i * 30, ascLng)
          const midAngle = toChartAngle(i * 30 + 15, ascLng)
          const p1 = polarToXY(CX, CY, OUTER_R, startAngle)
          const p2 = polarToXY(CX, CY, SIGN_R, startAngle)
          const labelPos = polarToXY(CX, CY, (OUTER_R + SIGN_R) / 2, midAngle)

          return (
            <g key={sign}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill="rgba(255,255,255,0.4)"
                fontSize="14"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {ZODIAC_GLYPHS[sign]}
              </text>
            </g>
          )
        })}

        {/* ─── House ring ─── */}
        <circle cx={CX} cy={CY} r={HOUSE_R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

        {/* House cusp lines */}
        {data.houses.map((h, i) => {
          const angle = toChartAngle(h.longitude, ascLng)
          const p1 = polarToXY(CX, CY, SIGN_R, angle)
          const p2 = polarToXY(CX, CY, INNER_R, angle)
          const isCardinal = i === 0 || i === 3 || i === 6 || i === 9

          // House number label
          const nextAngle = toChartAngle(data.houses[(i + 1) % 12].longitude, ascLng)
          let midA = (angle + nextAngle) / 2
          if (nextAngle < angle) midA = (angle + nextAngle + 360) / 2
          const labelPos = polarToXY(CX, CY, (HOUSE_R + INNER_R) / 2, midA)

          return (
            <g key={`house-${i}`}>
              <line
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={isCardinal ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}
                strokeWidth={isCardinal ? '1' : '0.5'}
              />
              <text
                x={labelPos.x} y={labelPos.y}
                fill="rgba(255,255,255,0.15)"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {h.house}
              </text>
            </g>
          )
        })}

        {/* ─── ASC / MC axis lines ─── */}
        {(() => {
          const ascAngle = toChartAngle(ascLng, ascLng) // = 180°
          const descAngle = (ascAngle + 180) % 360
          const pAsc1 = polarToXY(CX, CY, OUTER_R + 4, ascAngle)
          const pAsc2 = polarToXY(CX, CY, OUTER_R + 4, descAngle)
          const mcAngle = toChartAngle(data.mcLongitude, ascLng)
          const icAngle = (mcAngle + 180) % 360
          const pMc1 = polarToXY(CX, CY, OUTER_R + 4, mcAngle)
          const pMc2 = polarToXY(CX, CY, OUTER_R + 4, icAngle)

          const ascLabel = polarToXY(CX, CY, OUTER_R + 18, ascAngle)
          const mcLabel = polarToXY(CX, CY, OUTER_R + 18, mcAngle)

          return (
            <g>
              <line x1={pAsc1.x} y1={pAsc1.y} x2={pAsc2.x} y2={pAsc2.y} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="4 3" />
              <line x1={pMc1.x} y1={pMc1.y} x2={pMc2.x} y2={pMc2.y} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="4 3" />
              <text x={ascLabel.x} y={ascLabel.y} fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="800" textAnchor="middle" dominantBaseline="middle">AC</text>
              <text x={mcLabel.x} y={mcLabel.y} fill="rgba(255,255,255,0.35)" fontSize="9" fontWeight="800" textAnchor="middle" dominantBaseline="middle">MC</text>
            </g>
          )
        })()}

        {/* ─── Aspect lines (inner circle) ─── */}
        {data.aspects.slice(0, 20).map((asp, i) => {
          const p1 = realPlanets.find(p => p.planet === asp.planet1)
          const p2 = realPlanets.find(p => p.planet === asp.planet2)
          if (!p1 || !p2) return null

          const a1 = toChartAngle(p1.longitude, ascLng)
          const a2 = toChartAngle(p2.longitude, ascLng)
          const pt1 = polarToXY(CX, CY, ASPECT_R, a1)
          const pt2 = polarToXY(CX, CY, ASPECT_R, a2)

          const isHovered = hoveredAspect === asp
          const color = ASPECT_COLORS[asp.type]

          return (
            <line
              key={`asp-${i}`}
              x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y}
              stroke={color}
              strokeWidth={isHovered ? '1.5' : '0.5'}
              opacity={isHovered ? 0.9 : 0.25}
              className="transition-all duration-200"
              onMouseEnter={() => setHoveredAspect(asp)}
              onMouseLeave={() => setHoveredAspect(null)}
              style={{ cursor: 'pointer' }}
            />
          )
        })}

        {/* ─── Planet glyphs ─── */}
        {spreadPlanets.map((p) => {
          const pos = polarToXY(CX, CY, PLANET_R, p.displayAngle)
          const isAcMc = p.planet === 'Ascendant' || p.planet === 'MC'
          const isHov = hovered?.planet === p.planet

          return (
            <g
              key={p.planet}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Hit area */}
              <circle cx={pos.x} cy={pos.y} r={14} fill="transparent" />

              {/* Glyph background */}
              {!isAcMc && (
                <circle
                  cx={pos.x} cy={pos.y} r={isHov ? 13 : 11}
                  fill={isHov ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.6)'}
                  stroke={isHov ? 'white' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={isHov ? '1.5' : '0.8'}
                  className="transition-all duration-200"
                />
              )}

              {/* Glyph */}
              <text
                x={pos.x}
                y={pos.y + 1}
                fill={isHov ? 'white' : 'rgba(255,255,255,0.7)'}
                fontSize={isAcMc ? '9' : '13'}
                fontWeight={isAcMc ? '800' : '400'}
                textAnchor="middle"
                dominantBaseline="middle"
                className="transition-all duration-200"
              >
                {PLANET_GLYPHS[p.planet] || p.planet[0]}
              </text>

              {/* Retrograde marker */}
              {p.retrograde && (
                <text
                  x={pos.x + 10} y={pos.y - 8}
                  fill="rgba(248,113,113,0.7)"
                  fontSize="7"
                  fontWeight="800"
                >
                  R
                </text>
              )}
            </g>
          )
        })}

        {/* ─── Center dot ─── */}
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

      {/* Aspect tooltip */}
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
  )
}
