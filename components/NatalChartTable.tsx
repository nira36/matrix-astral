'use client'

import React, { useState } from 'react'
import type { NatalChartData, Aspect } from '@/lib/astrology'
import { ZODIAC_GLYPHS, PLANET_GLYPHS, ASPECT_SYMBOLS, ASPECT_COLORS, ZODIAC_ELEMENTS, getPlanetInterpretation } from '@/lib/astrology'

// ─── Planet Positions Table ─────────────────────────────────────────────────

function PlanetTable({ data }: { data: NatalChartData }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  // Show actual planets first, then AC/MC
  const ordered = [
    ...data.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC'),
    ...data.planets.filter(p => p.planet === 'Ascendant' || p.planet === 'MC'),
  ]

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card overflow-hidden shadow-xl shadow-black/30">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500">Planetary Positions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.05] bg-white/[0.01]">
              <th className="py-3 px-4 text-[9px] font-black tracking-widest uppercase text-slate-600">Planet</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-widest uppercase text-slate-600">Sign</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-widest uppercase text-slate-600 text-center">Degree</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-widest uppercase text-slate-600 text-center">House</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-widest uppercase text-slate-600 text-center">Element</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((p) => {
              const isExpanded = expanded === p.planet
              const element = ZODIAC_ELEMENTS[p.sign]
              const elementColors: Record<string, string> = {
                Fire: 'text-red-400', Earth: 'text-amber-400', Air: 'text-sky-400', Water: 'text-blue-400',
              }

              return (
                <React.Fragment key={p.planet}>
                  <tr
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : p.planet)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base text-white/60">{PLANET_GLYPHS[p.planet] || '·'}</span>
                        <span className="text-xs font-bold text-slate-300">{p.planet}</span>
                        {p.retrograde && <span className="text-[8px] font-bold text-red-400/70 bg-red-400/10 px-1.5 py-0.5 rounded">R</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-white/50">{ZODIAC_GLYPHS[p.sign]}</span>
                        <span className="text-xs text-slate-400">{p.sign}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-mono text-slate-400">
                        {p.signDegree}°{p.minute.toString().padStart(2, '0')}'
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-bold text-white/40">{p.house}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold ${elementColors[element] || 'text-slate-500'}`}>{element}</span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-white/[0.03]">
                      <td colSpan={5} className="px-4 py-3 bg-white/[0.01]">
                        <p className="text-[11px] text-slate-500 leading-relaxed pl-8">
                          {getPlanetInterpretation(p.planet, p.sign)}
                        </p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Aspects Table ──────────────────────────────────────────────────────────

function AspectsTable({ aspects }: { aspects: Aspect[] }) {
  const majorAspects = aspects.filter(a => a.orb <= 6).slice(0, 15)

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card overflow-hidden shadow-xl shadow-black/30">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500">Major Aspects</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.05] bg-white/[0.01]">
              <th className="py-3 px-4 text-[9px] font-black tracking-widest uppercase text-slate-600">Aspect</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-widest uppercase text-slate-600">Type</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-widest uppercase text-slate-600 text-center">Orb</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-widest uppercase text-slate-600 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {majorAspects.map((asp, i) => (
              <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{PLANET_GLYPHS[asp.planet1]}</span>
                    <span style={{ color: ASPECT_COLORS[asp.type] }} className="text-sm">{ASPECT_SYMBOLS[asp.type]}</span>
                    <span className="text-xs text-slate-400">{PLANET_GLYPHS[asp.planet2]}</span>
                    <span className="text-[10px] text-slate-500 ml-1">{asp.planet1}–{asp.planet2}</span>
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <span className="text-[10px] font-bold" style={{ color: ASPECT_COLORS[asp.type] }}>{asp.type}</span>
                </td>
                <td className="py-2.5 px-4 text-center">
                  <span className="text-[10px] font-mono text-slate-500">{asp.orb}°</span>
                </td>
                <td className="py-2.5 px-4 text-center">
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${asp.applying ? 'text-emerald-400/60' : 'text-slate-600'}`}>
                    {asp.applying ? 'Applying' : 'Separating'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Element / Modality Breakdown ───────────────────────────────────────────

function ElementBreakdown({ data }: { data: NatalChartData }) {
  const realPlanets = data.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')

  const elements = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  realPlanets.forEach(p => { elements[ZODIAC_ELEMENTS[p.sign]]++ })

  const total = realPlanets.length
  const bars: { label: string; count: number; color: string }[] = [
    { label: 'Fire', count: elements.Fire, color: '#EF4444' },
    { label: 'Earth', count: elements.Earth, color: '#F59E0B' },
    { label: 'Air', count: elements.Air, color: '#38BDF8' },
    { label: 'Water', count: elements.Water, color: '#6366F1' },
  ]

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 shadow-xl shadow-black/30">
      <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-5">Elemental Balance</h3>
      <div className="flex flex-col gap-3">
        {bars.map(b => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="text-[10px] font-bold w-10 text-right" style={{ color: b.color }}>{b.label}</span>
            <div className="flex-1 h-3 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(b.count / total) * 100}%`, backgroundColor: b.color, opacity: 0.6 }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 w-6 text-right">{b.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── House Overview ─────────────────────────────────────────────────────────

function HouseOverview({ data }: { data: NatalChartData }) {
  const HOUSE_THEMES = [
    'Self & Identity', 'Values & Resources', 'Communication & Mind',
    'Home & Roots', 'Creativity & Romance', 'Health & Service',
    'Partnership & Others', 'Transformation & Crisis', 'Philosophy & Travel',
    'Career & Public Image', 'Community & Vision', 'Unconscious & Endings',
  ]

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 shadow-xl shadow-black/30">
      <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-5">Houses</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {data.houses.map((h, i) => {
          const planetsInHouse = data.planets.filter(p => p.house === h.house && p.planet !== 'Ascendant' && p.planet !== 'MC')
          return (
            <div key={i} className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/30">{h.house}</span>
                <span className="text-[10px] text-slate-600">{ZODIAC_GLYPHS[h.sign]} {h.degree}°</span>
              </div>
              <span className="text-[8px] text-slate-600 uppercase tracking-wider">{HOUSE_THEMES[i]}</span>
              {planetsInHouse.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {planetsInHouse.map(p => (
                    <span key={p.planet} className="text-[10px] text-white/50">{PLANET_GLYPHS[p.planet]}</span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function NatalChartTable({ data }: { data: NatalChartData }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PlanetTable data={data} />
        <AspectsTable aspects={data.aspects} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ElementBreakdown data={data} />
        <HouseOverview data={data} />
      </div>
    </div>
  )
}
