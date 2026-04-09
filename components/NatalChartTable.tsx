'use client'

import React, { useState } from 'react'
import type { NatalChartData, Aspect, AspectType, PlanetPosition, ZodiacSign } from '@/lib/astrology'
import {
  ZODIAC_GLYPHS, PLANET_GLYPHS, ASPECT_SYMBOLS, ASPECT_COLORS, ZODIAC_ELEMENTS,
  getPlanetInterpretation, getAspectInterpretation, ELEMENT_EXCESS, ELEMENT_LACK,
  HOUSE_INTERPRETATIONS,
} from '@/lib/astrology'

// ─── Collapsible Section ───────────────────────────────────────────────────

function Section({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card shadow-xl shadow-black/30 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors"
      >
        <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500">{title}</h3>
        <svg
          className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  )
}

// ─── Panoramica ────────────────────────────────────────────────────────────

function Overview({ data }: { data: NatalChartData }) {
  const realPlanets = data.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
  const sun = data.planets.find(p => p.planet === 'Sun')!
  const moon = data.planets.find(p => p.planet === 'Moon')!
  const asc = data.planets.find(p => p.planet === 'Ascendant')!

  // Elements count
  const elements = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  realPlanets.forEach(p => { elements[ZODIAC_ELEMENTS[p.sign]]++ })
  const total = realPlanets.length

  // Dominant element
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1])
  const dominant = sorted[0]
  const weakest = sorted[sorted.length - 1]

  // Dominant planets (those with most aspects)
  const aspectCount: Record<string, number> = {}
  data.aspects.filter(a => a.orb <= 6).forEach(a => {
    aspectCount[a.planet1] = (aspectCount[a.planet1] || 0) + 1
    aspectCount[a.planet2] = (aspectCount[a.planet2] || 0) + 1
  })
  const dominantPlanets = Object.entries(aspectCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([p]) => p)

  const elementColors: Record<string, { bar: string; text: string }> = {
    Fire: { bar: '#EF4444', text: 'text-red-400' },
    Earth: { bar: '#F59E0B', text: 'text-amber-400' },
    Air: { bar: '#38BDF8', text: 'text-sky-400' },
    Water: { bar: '#6366F1', text: 'text-indigo-400' },
  }

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-7 shadow-xl shadow-black/30">
      <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-5">Overview</h3>

      {/* Synthesis paragraph */}
      <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
        Sun in <span className="text-white font-semibold">{sun.sign}</span>,
        Moon in <span className="text-white font-semibold">{moon.sign}</span>,
        Ascendant <span className="text-white font-semibold">{asc.sign}</span>.
        {' '}Dominant element: <span className={`font-semibold ${elementColors[dominant[0]].text}`}>{dominant[0]}</span> ({dominant[1]}/{total}).
        {dominantPlanets.length > 0 && (
          <> Dominant planets by aspects: <span className="text-white font-semibold">{dominantPlanets.join(' and ')}</span>.</>
        )}
        {' '}The {sun.sign}/{asc.sign} combination suggests an {getElementQuality(ZODIAC_ELEMENTS[sun.sign])} inner core filtered through a {getElementQuality(ZODIAC_ELEMENTS[asc.sign])} social mask.
        {moon.sign !== sun.sign && (
          <> Moon in {moon.sign} introduces a {getElementQuality(ZODIAC_ELEMENTS[moon.sign])} emotional need that is not always visible externally.</>
        )}
      </p>

      {/* Element bars */}
      <div className="flex flex-col gap-3 mb-5">
        {sorted.map(([el, count]) => (
          <div key={el} className="flex items-center gap-3">
            <span className="text-[10px] font-bold w-12 text-right" style={{ color: elementColors[el].bar }}>
              {el}
            </span>
            <div className="flex-1 h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(count / total) * 100}%`, backgroundColor: elementColors[el].bar, opacity: 0.6 }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 w-6 text-right">{count}</span>
          </div>
        ))}
      </div>

      {/* Element commentary */}
      <div className="flex flex-col gap-2">
        {dominant[1] >= 4 && (
          <p className="text-[10px] text-slate-500 leading-relaxed border-l-2 pl-3" style={{ borderColor: elementColors[dominant[0]].bar }}>
            {ELEMENT_EXCESS[dominant[0]]}
          </p>
        )}
        {weakest[1] <= 1 && (
          <p className="text-[10px] text-slate-500 leading-relaxed border-l-2 pl-3" style={{ borderColor: elementColors[weakest[0]].bar }}>
            {ELEMENT_LACK[weakest[0]]}
          </p>
        )}
      </div>
    </div>
  )
}

function getElementQuality(el: string): string {
  const map: Record<string, string> = {
    Fire: 'impulsive and vital',
    Earth: 'concrete and pragmatic',
    Air: 'intellectual and communicative',
    Water: 'emotional and intuitive',
  }
  return map[el] || ''
}

// ─── Planet Cards ──────────────────────────────────────────────────────────

function PlanetCards({ data }: { data: NatalChartData }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const ordered: PlanetPosition[] = [
    ...data.planets.filter(p => p.planet === 'Ascendant' || p.planet === 'MC'),
    ...data.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC'),
  ]

  const planetAspects = (planet: string): Aspect[] =>
    data.aspects.filter(a => a.orb <= 6 && (a.planet1 === planet || a.planet2 === planet))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {ordered.map(p => {
        const isOpen = expanded === p.planet
        const element = ZODIAC_ELEMENTS[p.sign]
        const aspects = planetAspects(p.planet)
        const elementColors: Record<string, string> = {
          Fire: 'border-red-500/20', Earth: 'border-amber-500/20', Air: 'border-sky-500/20', Water: 'border-indigo-500/20',
        }
        const elementBgs: Record<string, string> = {
          Fire: 'bg-red-500/[0.03]', Earth: 'bg-amber-500/[0.03]', Air: 'bg-sky-500/[0.03]', Water: 'bg-indigo-500/[0.03]',
        }

        return (
          <div
            key={p.planet}
            className={`rounded-xl border ${elementColors[element] || 'border-white/[0.07]'} ${elementBgs[element] || 'bg-white/[0.02]'} overflow-hidden transition-colors`}
          >
            {/* Header - always visible */}
            <button
              onClick={() => setExpanded(isOpen ? null : p.planet)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
            >
              <span className="text-lg text-white/50">{PLANET_GLYPHS[p.planet] || '·'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">{p.planet}</span>
                  {p.retrograde && <span className="text-[7px] font-bold text-red-400/70 bg-red-400/10 px-1 py-0.5 rounded">R</span>}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-white/40">{ZODIAC_GLYPHS[p.sign]}</span>
                  <span className="text-[10px] text-slate-500">{p.sign}</span>
                  <span className="text-[10px] font-mono text-slate-600">{p.signDegree}°{p.minute.toString().padStart(2, '0')}'</span>
                  <span className="text-[10px] text-slate-600">· Casa {p.house}</span>
                </div>
              </div>
              <svg
                className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded content */}
            {isOpen && (
              <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/[0.04]">
                <p className="text-[11px] text-slate-400 leading-relaxed pt-3">
                  {getPlanetInterpretation(p.planet, p.sign)}
                </p>

                {aspects.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black tracking-widest uppercase text-slate-600">Aspects</span>
                    {aspects.map((a, i) => {
                      const other = a.planet1 === p.planet ? a.planet2 : a.planet1
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <span style={{ color: ASPECT_COLORS[a.type] }} className="text-xs">{ASPECT_SYMBOLS[a.type]}</span>
                          <span className="text-[10px] text-slate-400">{other}</span>
                          <span className="text-[10px] font-mono text-slate-600">{a.orb}°</span>
                          <span className="text-[9px] text-slate-600">{a.type}</span>
                        </div>
                      )
                    })}
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

// ─── Houses Table ──────────────────────────────────────────────────────────

function HousesTable({ data }: { data: NatalChartData }) {
  const realPlanets = data.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="py-2.5 px-3 text-[9px] font-black tracking-widest uppercase text-slate-600 w-12">Casa</th>
            <th className="py-2.5 px-3 text-[9px] font-black tracking-widest uppercase text-slate-600">Sign</th>
            <th className="py-2.5 px-3 text-[9px] font-black tracking-widest uppercase text-slate-600">Planets</th>
            <th className="py-2.5 px-3 text-[9px] font-black tracking-widest uppercase text-slate-600">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {data.houses.map((h, i) => {
            const planetsInHouse = realPlanets.filter(p => p.house === h.house)
            const isCardinal = [1, 4, 7, 10].includes(h.house)
            return (
              <tr key={i} className={`border-b border-white/[0.03] ${isCardinal ? 'bg-white/[0.02]' : ''}`}>
                <td className="py-2.5 px-3">
                  <span className={`text-xs font-bold ${isCardinal ? 'text-white/50' : 'text-white/25'}`}>{h.house}</span>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-white/40">{ZODIAC_GLYPHS[h.sign]}</span>
                    <span className="text-[10px] text-slate-400">{h.sign}</span>
                    <span className="text-[10px] font-mono text-slate-600">{h.degree}°</span>
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  {planetsInHouse.length > 0 ? (
                    <div className="flex items-center gap-1.5">
                      {planetsInHouse.map(p => (
                        <span key={p.planet} className="text-[10px] text-slate-400" title={p.planet}>
                          {PLANET_GLYPHS[p.planet]} {p.planet}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-700">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3">
                  <p className="text-[10px] text-slate-500 leading-relaxed">{HOUSE_INTERPRETATIONS[i]}</p>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Aspects Section ───────────────────────────────────────────────────────

function AspectsSection({ aspects }: { aspects: Aspect[] }) {
  const major = aspects.filter(a => a.orb <= 6)

  const groups: { type: AspectType; label: string; items: Aspect[] }[] = [
    { type: 'Conjunction', label: 'Conjunctions', items: major.filter(a => a.type === 'Conjunction') },
    { type: 'Opposition', label: 'Oppositions', items: major.filter(a => a.type === 'Opposition') },
    { type: 'Square', label: 'Squares', items: major.filter(a => a.type === 'Square') },
    { type: 'Trine', label: 'Trines', items: major.filter(a => a.type === 'Trine') },
    { type: 'Sextile', label: 'Sextiles', items: major.filter(a => a.type === 'Sextile') },
  ]

  return (
    <div className="flex flex-col gap-5">
      {groups.map(g => {
        if (g.items.length === 0) return null
        return (
          <div key={g.type}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: ASPECT_COLORS[g.type] }} className="text-sm">{ASPECT_SYMBOLS[g.type]}</span>
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: ASPECT_COLORS[g.type] }}>{g.label}</span>
              <span className="text-[10px] text-slate-600">({g.items.length})</span>
            </div>
            <div className="flex flex-col gap-2">
              {g.items.map((a, i) => {
                const interp = getAspectInterpretation(a.planet1, a.planet2, a.type)
                return (
                  <div key={i} className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">{PLANET_GLYPHS[a.planet1]}</span>
                      <span className="text-[10px] font-bold text-slate-300">{a.planet1}</span>
                      <span style={{ color: ASPECT_COLORS[a.type] }} className="text-xs">{ASPECT_SYMBOLS[a.type]}</span>
                      <span className="text-[10px] font-bold text-slate-300">{a.planet2}</span>
                      <span className="text-xs text-white/50">{PLANET_GLYPHS[a.planet2]}</span>
                      <span className="text-[10px] font-mono text-slate-600 ml-auto">orb {a.orb}°</span>
                      <span className={`text-[8px] font-bold uppercase tracking-wider ${a.applying ? 'text-emerald-400/60' : 'text-slate-600'}`}>
                        {a.applying ? 'Applying' : 'Separating'}
                      </span>
                    </div>
                    {interp && (
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{interp}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function NatalChartTable({ data }: { data: NatalChartData }) {
  return (
    <div className="flex flex-col gap-6">
      <Overview data={data} />

      <Section title="Planets, Psychological Portrait" defaultOpen={true}>
        <PlanetCards data={data} />
      </Section>

      <Section title="The 12 Houses" defaultOpen={false}>
        <HousesTable data={data} />
      </Section>

      <Section title="Aspects, Inner Dynamics" defaultOpen={false}>
        <AspectsSection aspects={data.aspects} />
      </Section>
    </div>
  )
}
