'use client'

import React, { useState } from 'react'
import type { NatalChartData, Aspect } from '@/lib/astrology'
import { PLANET_GLYPHS, ZODIAC_GLYPHS, ASPECT_SYMBOLS, ASPECT_COLORS } from '@/lib/astrology'
import { PLANET_DESCRIPTIONS, PLANET_SUBTITLES, PLANET_IN_SIGN_READINGS, PLANET_IN_HOUSE_READINGS, GENERATIONAL_PLANETS } from '@/lib/natal-readings'

const READING_ORDER = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
  'Uranus', 'Neptune', 'Pluto', 'North Node', 'Lilith', 'Chiron',
]

export default function NatalReadings({ data }: { data: NatalChartData }) {
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>('Sun')

  // Build aspect lookup per planet
  const aspectsByPlanet: Record<string, Aspect[]> = {}
  data.aspects.filter(a => a.orb <= 8).forEach(a => {
    if (!aspectsByPlanet[a.planet1]) aspectsByPlanet[a.planet1] = []
    if (!aspectsByPlanet[a.planet2]) aspectsByPlanet[a.planet2] = []
    aspectsByPlanet[a.planet1].push(a)
    aspectsByPlanet[a.planet2].push(a)
  })

  const planets = READING_ORDER.filter(name => data.planets.some(p => p.planet === name))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500">
          Interpretations — Planets in Signs and Houses
        </h3>
      </div>

      <div className="text-[10px] text-slate-600 leading-relaxed mb-2 max-w-2xl">
        Planets show <span className="text-slate-400 font-bold">WHAT</span> happens;
        signs show <span className="text-slate-400 font-bold">HOW</span> it happens;
        houses show <span className="text-slate-400 font-bold">WHERE</span> it happens.
      </div>

      {planets.map(name => {
        const pd = data.planets.find(p => p.planet === name)
        if (!pd) return null
        const isOpen = expandedPlanet === name
        const aspects = aspectsByPlanet[name] || []
        const isGenerational = GENERATIONAL_PLANETS.includes(name)
        const signReading = PLANET_IN_SIGN_READINGS[name]?.[pd.sign] || ''
        const houseReading = PLANET_IN_HOUSE_READINGS[name]?.[pd.house] || ''
        const subtitle = PLANET_SUBTITLES[name] || ''
        const description = PLANET_DESCRIPTIONS[name] || ''

        return (
          <div key={name} className="border-b border-white/[0.04] last:border-b-0">
            {/* Header — always visible */}
            <button
              onClick={() => setExpandedPlanet(isOpen ? null : name)}
              className="w-full flex items-center gap-3 py-3 px-1 text-left hover:bg-white/[0.02] transition-colors group"
            >
              <span className="text-lg text-white/50 w-6 text-center">{PLANET_GLYPHS[name] || '·'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{name}</span>
                  {pd.retrograde && <span className="text-[7px] font-bold text-red-400/70 bg-red-400/10 px-1 py-0.5 rounded">R</span>}
                  <span className="text-[10px] text-slate-600">— {subtitle}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                  <span>{ZODIAC_GLYPHS[pd.sign]} {pd.sign}</span>
                  <span className="font-mono">{pd.signDegree}°{pd.minute.toString().padStart(2, '0')}'</span>
                  <span className="text-slate-600">·</span>
                  <span>House {pd.house}</span>
                </div>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded content */}
            {isOpen && (
              <div className="pl-9 pr-2 pb-5 flex flex-col gap-5 animate-fade-up">
                {/* Planet description */}
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  {description}
                </p>

                {/* Planet in Sign */}
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-2">
                    {name} in {pd.sign}
                  </h4>
                  {isGenerational && (
                    <p className="text-[9px] text-amber-500/50 mb-2 italic">
                      Note: {name} is a slow transpersonal planet. The sign description applies to an entire generation. The individual characteristic should be sought in the house placement.
                    </p>
                  )}
                  <p className="text-[12px] text-slate-400 leading-[1.7]">
                    {signReading}
                  </p>
                </div>

                {/* Planet in House */}
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-2">
                    {name} in {getHouseName(pd.house)}
                  </h4>
                  <p className="text-[12px] text-slate-400 leading-[1.7]">
                    {houseReading}
                  </p>
                </div>

                {/* Aspects of this planet */}
                {aspects.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-2">
                      {name} — Aspects
                    </h4>
                    <div className="flex flex-col gap-1">
                      {aspects.map((a, i) => {
                        const other = a.planet1 === name ? a.planet2 : a.planet1
                        return (
                          <div key={i} className="flex items-center gap-2 text-[11px]">
                            <span style={{ color: ASPECT_COLORS[a.type] }}>{ASPECT_SYMBOLS[a.type]}</span>
                            <span className="text-slate-500">{a.type}</span>
                            <span className="text-slate-400">{other}</span>
                            <span className="text-slate-600 font-mono">({a.orb}°, {a.applying ? 'applying' : 'separating'})</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function getHouseName(h: number): string {
  const names: Record<number, string> = {
    1: 'First House', 2: 'Second House', 3: 'Third House', 4: 'Fourth House',
    5: 'Fifth House', 6: 'Sixth House', 7: 'Seventh House', 8: 'Eighth House',
    9: 'Ninth House', 10: 'Tenth House', 11: 'Eleventh House', 12: 'Twelfth House',
  }
  return names[h] || `House ${h}`
}
