'use client'

import { useMemo, useState } from 'react'
import type { NatalChartData } from '@/lib/astrology'
import { calcNatalChart } from '@/lib/astrology'
import type { VedicChart, VedicPlanet } from '@/lib/vedic-astrology'
import { calcVedicChart } from '@/lib/vedic-astrology'
import { RASHI_DATA, LAGNA_PROFILES, GRAHA_DATA, type NakshatraData, type Graha } from '@/lib/vedic-data'
import { calcVimshottariDasha, DASHA_INTERPRETATIONS, type VimshottariDasha, type DashaPeriod } from '@/lib/vedic-dasha'
import {
  detectAllYogas, calcVedicAspects, calcNavamsa, calcDashamsha,
  type Yoga, type VedicAspect, type DivisionalChart,
} from '@/lib/vedic-advanced'
import {
  calcAshtakootMilan, moonRashiFromLng, moonNakshatraFromLng,
  type AshtakootResult,
} from '@/lib/vedic-compat'

interface Props {
  natal: NatalChartData | null
  dateStr: string
  birthTime: string
}

function parseDateAndTime(dateStr: string, timeStr: string): Date | null {
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)
  if (!day || !month || !year) return null
  let hour = 12, minute = 0
  if (timeStr) {
    const tp = timeStr.split(':')
    hour = parseInt(tp[0], 10) || 12
    minute = parseInt(tp[1], 10) || 0
  }
  return new Date(year, month - 1, day, hour, minute, 0)
}

export default function VedicAstrology({ natal, dateStr, birthTime }: Props) {
  // Partner state for Ashtakoot Milan
  const [partnerDate, setPartnerDate] = useState('')
  const [partnerTime, setPartnerTime] = useState('')

  const vedic: VedicChart | null = useMemo(() => {
    if (!natal || !dateStr) return null
    const parts = dateStr.split('/')
    if (parts.length !== 3) return null
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const year = parseInt(parts[2], 10)
    if (!day || !month || !year) return null
    try {
      return calcVedicChart(natal, year, month, day)
    } catch {
      return null
    }
  }, [natal, dateStr])

  const dasha: VimshottariDasha | null = useMemo(() => {
    if (!vedic) return null
    const moon = vedic.planets.find(p => p.graha === 'Moon')
    if (!moon) return null
    const birthDate = parseDateAndTime(dateStr, birthTime)
    if (!birthDate) return null
    return calcVimshottariDasha(moon.longitude, birthDate, vedic.janmaNakshatra.name)
  }, [vedic, dateStr, birthTime])

  const yogas: Yoga[] = useMemo(() => vedic ? detectAllYogas(vedic) : [], [vedic])
  const aspects: VedicAspect[] = useMemo(() => vedic ? calcVedicAspects(vedic) : [], [vedic])
  const navamsa: DivisionalChart | null = useMemo(() => vedic ? calcNavamsa(vedic) : null, [vedic])
  const dashamsha: DivisionalChart | null = useMemo(() => vedic ? calcDashamsha(vedic) : null, [vedic])

  // Ashtakoot Milan
  const ashtakoot: AshtakootResult | null = useMemo(() => {
    if (!vedic || !partnerDate) return null
    const parts = partnerDate.split('/')
    if (parts.length !== 3) return null
    const pDay = parseInt(parts[0], 10)
    const pMonth = parseInt(parts[1], 10)
    const pYear = parseInt(parts[2], 10)
    if (!pDay || !pMonth || !pYear) return null
    let pHour = 12, pMin = 0
    if (partnerTime) {
      const tp = partnerTime.split(':')
      pHour = parseInt(tp[0], 10) || 12
      pMin = parseInt(tp[1], 10) || 0
    }
    try {
      // Compute partner's natal (Moon position is location-independent, use defaults)
      const partnerNatal = calcNatalChart(pDay, pMonth, pYear, pHour, pMin, 41.9, 12.5, 1)
      const partnerVedic = calcVedicChart(partnerNatal, pYear, pMonth, pDay)
      const pMoon = partnerVedic.planets.find(p => p.graha === 'Moon')
      const myMoon = vedic.planets.find(p => p.graha === 'Moon')
      if (!pMoon || !myMoon) return null
      // User = bride (could be either; convention here)
      return calcAshtakootMilan(
        moonRashiFromLng(myMoon.longitude),
        moonNakshatraFromLng(myMoon.longitude),
        moonRashiFromLng(pMoon.longitude),
        moonNakshatraFromLng(pMoon.longitude),
      )
    } catch {
      return null
    }
  }, [vedic, partnerDate, partnerTime])

  if (!natal || !vedic) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-6 text-center max-w-lg mx-auto">
        <p className="text-sm text-amber-400/80 mb-2 font-semibold">Missing Data</p>
        <p className="text-[11px] text-amber-400/60 leading-relaxed">
          Vedic chart requires <strong>birth date, time, and place</strong>. Enter all three in the form above and recalculate.
        </p>
      </div>
    )
  }

  const lagnaProfile = LAGNA_PROFILES[vedic.lagna.rashi]
  const lagnaRashi = RASHI_DATA[vedic.lagna.rashi]

  return (
    <div className="flex flex-col gap-12">
      {/* ── Header ── */}
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Vedic <span className="text-accent-purple">Jyotisha</span>
        </h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
          Your sidereal chart according to the Indian tradition. Lahiri ayanamsa, Whole Sign houses, and the 27 Nakshatras of the Moon.
        </p>
        <p className="text-[10px] font-mono text-slate-600 mt-1">
          Ayanamsa (Lahiri): {vedic.ayanamsaDms}
        </p>
      </div>

      {/* ── Section 1: North Indian Chart ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Rashi <span className="text-accent-purple">Chakra</span></SectionLabel>
        <div className="flex justify-center">
          <NorthIndianChart vedic={vedic} />
        </div>
        <p className="text-[10px] text-slate-600 text-center font-mono">
          North Indian style · Lagna fixed at top diamond · Whole Sign houses
        </p>
      </section>

      {/* ── Section 2: Lagna Profile ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Your <span className="text-accent-purple">Lagna</span></SectionLabel>
        <Card>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2 md:w-48">
              <div
                className="w-32 h-32 rounded-2xl flex items-center justify-center border-2"
                style={{
                  borderColor: lagnaRashi.color,
                  background: `${lagnaRashi.color}11`,
                  boxShadow: `0 0 40px ${lagnaRashi.color}33`,
                }}
              >
                <span className="text-7xl" style={{ color: lagnaRashi.color }}>{lagnaRashi.symbol}</span>
              </div>
              <div className="text-center">
                <p className="text-lg font-black" style={{ color: lagnaRashi.color }}>{vedic.lagna.rashi}</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{lagnaRashi.english}</p>
                <p className="text-[10px] font-mono text-slate-600 mt-1">
                  {vedic.lagna.signDegree}°{String(vedic.lagna.signMinute).padStart(2, '0')}'
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div>
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Lagna Archetype</p>
                <h3 className="text-2xl font-black tracking-tight" style={{ color: lagnaRashi.color }}>
                  {lagnaProfile.archetype}
                </h3>
                <p className="text-[11px] text-slate-500 italic mt-1">Ruled by {lagnaRashi.ruler} ({lagnaRashi.rulerSk})</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{lagnaProfile.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {lagnaProfile.qualities.map(q => (
                  <span key={q} className="px-2 py-0.5 rounded text-[9px] text-slate-400 border border-white/[0.06] bg-white/[0.02]">{q}</span>
                ))}
              </div>

              <p className="text-[10px] text-slate-500 italic border-l-2 border-white/[0.07] pl-3 mt-1">
                <strong className="text-slate-400">Body:</strong> {lagnaProfile.body}
              </p>

              <div className="flex items-center gap-2 mt-1 pt-3 border-t border-white/[0.05]">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Lagna Nakshatra:</span>
                <span className="text-[10px] font-bold" style={{ color: vedic.lagna.nakshatra.color }}>
                  {vedic.lagna.nakshatra.name}
                </span>
                <span className="text-[9px] text-slate-600">· Pada {vedic.lagna.pada}</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Section 3: Janma Nakshatra (Moon) ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Janma <span className="text-accent-purple">Nakshatra</span></SectionLabel>
        <Card>
          <NakshatraView nakshatra={vedic.janmaNakshatra} pada={vedic.janmaPada} isJanma />
        </Card>
      </section>

      {/* ── Section 4: All Planets Table ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>The Nine <span className="text-accent-purple">Grahas</span></SectionLabel>
        <Card>
          <PlanetsTable vedic={vedic} />
        </Card>
      </section>

      {/* ── Section 5: Houses (Bhavas) ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>The Twelve <span className="text-accent-purple">Bhavas</span></SectionLabel>
        <Card>
          <BhavasTable vedic={vedic} />
        </Card>
      </section>

      {/* ── Section 6: Vimshottari Dasha ── */}
      {dasha && (
        <section className="flex flex-col gap-6">
          <SectionLabel>Vimshottari <span className="text-accent-purple">Dasha</span></SectionLabel>
          <Card>
            <DashaView dasha={dasha} />
          </Card>
        </section>
      )}

      {/* ── Section 7: Yogas ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Planetary <span className="text-accent-purple">Yogas</span></SectionLabel>
        <Card>
          <YogasView yogas={yogas} />
        </Card>
      </section>

      {/* ── Section 8: Vedic Aspects (Drishti) ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Vedic <span className="text-accent-purple">Drishti</span></SectionLabel>
        <Card>
          <AspectsView aspects={aspects} />
        </Card>
      </section>

      {/* ── Section 9: Divisional Charts ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Divisional <span className="text-accent-purple">Vargas</span></SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {navamsa && <Card><DivisionalView chart={navamsa} /></Card>}
          {dashamsha && <Card><DivisionalView chart={dashamsha} /></Card>}
        </div>
      </section>

      {/* ── Section 10: Ashtakoot Milan ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Ashtakoot <span className="text-accent-purple">Milan</span></SectionLabel>
        <Card>
          <AshtakootForm
            partnerDate={partnerDate} setPartnerDate={setPartnerDate}
            partnerTime={partnerTime} setPartnerTime={setPartnerTime}
          />
          {ashtakoot && (
            <div className="mt-6">
              <AshtakootView result={ashtakoot} />
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

// ─── North Indian Chart ─────────────────────────────────────────────────────
// Diamond-in-square layout. Houses are FIXED positions (1=top diamond, 4=left,
// 7=bottom, 10=right), and signs rotate based on Lagna.

function NorthIndianChart({ vedic }: { vedic: VedicChart }) {
  const SIZE = 480
  const HALF = SIZE / 2

  // House center positions in the North Indian diamond layout
  // Standard arrangement: H1 top diamond, then anticlockwise around
  const housePositions: { x: number; y: number }[] = [
    { x: HALF,         y: HALF * 0.55 },  // 1 — top diamond center
    { x: HALF * 0.55,  y: HALF * 0.35 },  // 2 — top left triangle
    { x: HALF * 0.35,  y: HALF * 0.55 },  // 3 — left top triangle
    { x: HALF * 0.55,  y: HALF },         // 4 — left diamond center
    { x: HALF * 0.35,  y: HALF * 1.45 },  // 5 — left bottom triangle
    { x: HALF * 0.55,  y: HALF * 1.65 },  // 6 — bottom left triangle
    { x: HALF,         y: HALF * 1.45 },  // 7 — bottom diamond center
    { x: HALF * 1.45,  y: HALF * 1.65 },  // 8 — bottom right triangle
    { x: HALF * 1.65,  y: HALF * 1.45 },  // 9 — right bottom triangle
    { x: HALF * 1.45,  y: HALF },         // 10 — right diamond center
    { x: HALF * 1.65,  y: HALF * 0.55 },  // 11 — right top triangle
    { x: HALF * 1.45,  y: HALF * 0.35 },  // 12 — top right triangle
  ]

  // Group planets by bhava
  const planetsByHouse = new Map<number, VedicPlanet[]>()
  for (const p of vedic.planets) {
    if (!planetsByHouse.has(p.bhava)) planetsByHouse.set(p.bhava, [])
    planetsByHouse.get(p.bhava)!.push(p)
  }

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="max-w-full h-auto">
      {/* Outer square */}
      <rect x="0" y="0" width={SIZE} height={SIZE} fill="#0a0a0f" stroke="#475569" strokeWidth="1.5" />

      {/* Diagonals */}
      <line x1="0" y1="0" x2={SIZE} y2={SIZE} stroke="#475569" strokeWidth="1" />
      <line x1={SIZE} y1="0" x2="0" y2={SIZE} stroke="#475569" strokeWidth="1" />

      {/* Inner diamond (rotated square) */}
      <polygon
        points={`${HALF},0 ${SIZE},${HALF} ${HALF},${SIZE} 0,${HALF}`}
        fill="none"
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Render each house */}
      {housePositions.map((pos, i) => {
        const houseNum = i + 1
        const rashi = vedic.houses[i].rashi
        const rashiData = RASHI_DATA[rashi]
        const planets = planetsByHouse.get(houseNum) ?? []
        const isLagna = houseNum === 1

        return (
          <g key={houseNum}>
            {/* Sign number (1-12 = rashi index + 1) */}
            <text
              x={pos.x}
              y={pos.y - 30}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
              fontFamily="monospace"
            >
              {vedic.houses[i].rashiIndex + 1}
            </text>

            {/* Rashi symbol */}
            <text
              x={pos.x}
              y={pos.y - 14}
              textAnchor="middle"
              fontSize="20"
              fill={rashiData.color}
              fontWeight="bold"
            >
              {rashiData.symbol}
            </text>

            {/* House number badge */}
            {isLagna && (
              <text
                x={pos.x}
                y={pos.y + 2}
                textAnchor="middle"
                fontSize="8"
                fill="#a78bfa"
                fontWeight="bold"
              >
                LAGNA
              </text>
            )}

            {/* Planets */}
            {planets.map((p, j) => (
              <text
                key={p.graha}
                x={pos.x}
                y={pos.y + 14 + j * 11}
                textAnchor="middle"
                fontSize="10"
                fill={p.data.color}
                fontWeight="bold"
                fontFamily="monospace"
              >
                {p.data.shortGlyph}
                {p.retrograde && <tspan fontSize="7" dy="-2">℞</tspan>}
              </text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

// ─── Nakshatra View ─────────────────────────────────────────────────────────

function NakshatraView({
  nakshatra, pada, isJanma = false,
}: {
  nakshatra: NakshatraData
  pada: number
  isJanma?: boolean
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2 md:w-48">
        <div
          className="w-32 h-32 rounded-2xl flex items-center justify-center border-2"
          style={{
            borderColor: nakshatra.color,
            background: `${nakshatra.color}11`,
            boxShadow: `0 0 40px ${nakshatra.color}33`,
          }}
        >
          <span className="text-3xl font-black text-center px-2" style={{ color: nakshatra.color }}>
            {nakshatra.index}
          </span>
        </div>
        <div className="text-center">
          <p className="text-lg font-black" style={{ color: nakshatra.color }}>{nakshatra.name}</p>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Pada {pada}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {isJanma && (
          <p className="text-[9px] font-bold text-accent-purple uppercase tracking-widest">
            ★ Moon's Birth Star — Your Janma Nakshatra
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NakshatraField label="Symbol" value={nakshatra.symbol} />
          <NakshatraField label="Deity" value={nakshatra.deity} />
          <NakshatraField label="Ruler" value={nakshatra.ruler} />
          <NakshatraField label="Yoni" value={nakshatra.yoni} />
          <NakshatraField label="Gana" value={nakshatra.gana} />
          <NakshatraField label="Caste" value={nakshatra.caste} />
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mt-2">{nakshatra.description}</p>
      </div>
    </div>
  )
}

function NakshatraField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">{label}</p>
      <p className="text-[10px] text-slate-300 font-bold">{value}</p>
    </div>
  )
}

// ─── Planets Table ──────────────────────────────────────────────────────────

const DIGNITY_COLORS: Record<VedicPlanet['dignity'], string> = {
  'Exalted':       '#10b981',
  'Own Sign':      '#06b6d4',
  'Friendly':      '#84cc16',
  'Neutral':       '#94a3b8',
  'Enemy':         '#f97316',
  'Debilitated':   '#ef4444',
}

function PlanetsTable({ vedic }: { vedic: VedicChart }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-white/[0.07] text-slate-500 font-bold uppercase tracking-widest">
            <th className="text-left py-2 px-2">Graha</th>
            <th className="text-left py-2 px-2">Sk</th>
            <th className="text-left py-2 px-2">Rashi</th>
            <th className="text-right py-2 px-2">Degree</th>
            <th className="text-left py-2 px-2">Nakshatra</th>
            <th className="text-center py-2 px-2">Pada</th>
            <th className="text-center py-2 px-2">House</th>
            <th className="text-left py-2 px-2">Dignity</th>
          </tr>
        </thead>
        <tbody>
          {vedic.planets.map(p => {
            const rashiData = RASHI_DATA[p.rashi]
            return (
              <tr key={p.graha} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="py-2 px-2 font-bold" style={{ color: p.data.color }}>
                  {p.data.symbol} {p.graha}
                  {p.retrograde && <span className="text-[8px] text-slate-500 ml-1">℞</span>}
                </td>
                <td className="py-2 px-2 text-slate-500 italic">{p.data.sanskrit}</td>
                <td className="py-2 px-2">
                  <span style={{ color: rashiData.color }}>{rashiData.symbol}</span>
                  <span className="text-slate-400 ml-1">{p.rashi}</span>
                </td>
                <td className="py-2 px-2 text-right font-mono text-slate-400">
                  {p.signDegree}°{String(p.signMinute).padStart(2, '0')}'
                </td>
                <td className="py-2 px-2 text-slate-300" style={{ color: p.nakshatra.color }}>
                  {p.nakshatra.name}
                </td>
                <td className="py-2 px-2 text-center text-slate-500 font-mono">{p.pada}</td>
                <td className="py-2 px-2 text-center font-bold text-accent-purple">{p.bhava}</td>
                <td className="py-2 px-2">
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                    style={{
                      color: DIGNITY_COLORS[p.dignity],
                      background: `${DIGNITY_COLORS[p.dignity]}15`,
                    }}
                  >
                    {p.dignity}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Bhavas Table ───────────────────────────────────────────────────────────

const BHAVA_MEANINGS: { num: number; sanskrit: string; meaning: string }[] = [
  { num: 1,  sanskrit: 'Tanu',     meaning: 'Self, body, personality, vitality' },
  { num: 2,  sanskrit: 'Dhana',    meaning: 'Wealth, family, speech, food' },
  { num: 3,  sanskrit: 'Sahaja',   meaning: 'Siblings, courage, short journeys, communication' },
  { num: 4,  sanskrit: 'Sukha',    meaning: 'Mother, home, comfort, vehicles, education' },
  { num: 5,  sanskrit: 'Putra',    meaning: 'Children, creativity, romance, intelligence' },
  { num: 6,  sanskrit: 'Ari',      meaning: 'Enemies, debts, illness, service' },
  { num: 7,  sanskrit: 'Yuvati',   meaning: 'Spouse, partnerships, business, public' },
  { num: 8,  sanskrit: 'Randhra',  meaning: 'Longevity, transformation, occult, inheritance' },
  { num: 9,  sanskrit: 'Dharma',   meaning: 'Father, guru, fortune, religion, higher learning' },
  { num: 10, sanskrit: 'Karma',    meaning: 'Career, status, public action, authority' },
  { num: 11, sanskrit: 'Labha',    meaning: 'Gains, friends, hopes, elder siblings' },
  { num: 12, sanskrit: 'Vyaya',    meaning: 'Loss, foreign lands, liberation, expenditure' },
]

function BhavasTable({ vedic }: { vedic: VedicChart }) {
  // Group planets by bhava
  const byHouse = new Map<number, VedicPlanet[]>()
  for (const p of vedic.planets) {
    if (!byHouse.has(p.bhava)) byHouse.set(p.bhava, [])
    byHouse.get(p.bhava)!.push(p)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {BHAVA_MEANINGS.map(b => {
        const house = vedic.houses[b.num - 1]
        const rashiData = RASHI_DATA[house.rashi]
        const occupants = byHouse.get(b.num) ?? []

        return (
          <div
            key={b.num}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-accent-purple">{b.num}</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase">{b.sanskrit}</p>
                  <p className="text-[8px] text-slate-600">House {b.num}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg" style={{ color: rashiData.color }}>{rashiData.symbol}</span>
                <span className="text-[9px] text-slate-500">{house.rashi}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug italic">{b.meaning}</p>
            {occupants.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2 border-t border-white/[0.05]">
                {occupants.map(o => (
                  <span
                    key={o.graha}
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold border"
                    style={{
                      color: o.data.color,
                      borderColor: `${o.data.color}44`,
                      background: `${o.data.color}0d`,
                    }}
                  >
                    {o.data.shortGlyph} {o.retrograde && '℞'}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Vimshottari Dasha View ─────────────────────────────────────────────────

function DashaView({ dasha }: { dasha: VimshottariDasha }) {
  const fmtYear = (d: Date) => d.getFullYear().toString()
  const fmtAge = (a: number) => Math.floor(a).toString()

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-white/[0.05]">
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Vimshottari Dasha — the 120-year cycle of planetary periods activated by your Moon's nakshatra.
          Each Mahadasha shapes a major chapter of life; Antardashas refine the timing within.
        </p>
        <div className="flex flex-wrap gap-4 text-[10px] text-slate-500 mt-1 font-mono">
          <span>Janma Nakshatra: <strong className="text-slate-300">{dasha.moonNakshatraName}</strong></span>
          <span>Starting lord: <strong style={{ color: GRAHA_DATA[dasha.startingLord].color }}>{dasha.startingLord}</strong></span>
          <span>Balance at birth: <strong className="text-slate-300">{dasha.balanceYears.toFixed(2)} years</strong></span>
        </div>
      </div>

      {/* Current MD highlight */}
      {dasha.currentMahadasha && (
        <div
          className="rounded-2xl border-2 p-5 flex flex-col gap-3"
          style={{
            borderColor: `${GRAHA_DATA[dasha.currentMahadasha.lord].color}66`,
            background: `${GRAHA_DATA[dasha.currentMahadasha.lord].color}0d`,
            boxShadow: `0 0 40px ${GRAHA_DATA[dasha.currentMahadasha.lord].color}22`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Current Mahadasha</p>
              <h3 className="text-2xl font-black mt-1" style={{ color: GRAHA_DATA[dasha.currentMahadasha.lord].color }}>
                {GRAHA_DATA[dasha.currentMahadasha.lord].symbol} {dasha.currentMahadasha.lord}
              </h3>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                {fmtYear(dasha.currentMahadasha.startDate)}–{fmtYear(dasha.currentMahadasha.endDate)} ·
                Age {fmtAge(dasha.currentMahadasha.ageStart)}–{fmtAge(dasha.currentMahadasha.ageEnd)}
              </p>
            </div>
            {dasha.currentAntardasha && (
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Antardasha</p>
                <h4 className="text-lg font-black mt-1" style={{ color: GRAHA_DATA[dasha.currentAntardasha.lord].color }}>
                  {GRAHA_DATA[dasha.currentAntardasha.lord].symbol} {dasha.currentAntardasha.lord}
                </h4>
                <p className="text-[9px] font-mono text-slate-500 mt-0.5">
                  until {fmtYear(dasha.currentAntardasha.endDate)}
                </p>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed border-t border-white/[0.05] pt-3">
            {DASHA_INTERPRETATIONS[dasha.currentMahadasha.lord]}
          </p>
        </div>
      )}

      {/* All Mahadashas timeline */}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">All Mahadashas (120 years)</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {dasha.mahadashas.map((md, i) => {
            const isCurrent = md === dasha.currentMahadasha
            const color = GRAHA_DATA[md.lord].color
            return (
              <div
                key={i}
                className="rounded-xl border bg-bg-card p-3 flex flex-col gap-1"
                style={{
                  borderColor: isCurrent ? `${color}88` : 'rgba(255,255,255,0.07)',
                  boxShadow: isCurrent ? `0 0 16px ${color}33` : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold" style={{ color }}>
                    {GRAHA_DATA[md.lord].symbol} {md.lord}
                  </span>
                  <span className="text-[8px] font-mono text-slate-600">{md.years.toFixed(1)}y</span>
                </div>
                <p className="text-[9px] font-mono text-slate-500">
                  {fmtYear(md.startDate)}–{fmtYear(md.endDate)}
                </p>
                <p className="text-[8px] font-mono text-slate-600">
                  Age {fmtAge(md.ageStart)}–{fmtAge(md.ageEnd)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Current MD's antardashas */}
      {dasha.currentMahadasha && dasha.currentAntardashas.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Antardashas in current {dasha.currentMahadasha.lord} Mahadasha
          </p>
          <div className="flex flex-col gap-1">
            {dasha.currentAntardashas.map((ad, i) => {
              const isCurrent = ad === dasha.currentAntardasha
              const color = GRAHA_DATA[ad.lord].color
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border"
                  style={{
                    borderColor: isCurrent ? `${color}66` : 'rgba(255,255,255,0.05)',
                    background: isCurrent ? `${color}11` : 'rgba(255,255,255,0.01)',
                  }}
                >
                  <span className="text-[10px] font-bold flex-shrink-0 w-20" style={{ color }}>
                    {GRAHA_DATA[ad.lord].symbol} {ad.lord}
                  </span>
                  <span className="flex-1 text-[9px] font-mono text-slate-500">
                    {ad.startDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })} →
                    {' '}{ad.endDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-[8px] font-mono text-slate-600 flex-shrink-0">
                    {ad.years.toFixed(2)}y
                  </span>
                  {isCurrent && (
                    <span className="text-[7px] font-black uppercase tracking-widest text-accent-purple px-1.5 py-0.5 rounded bg-accent-purple/15">
                      Now
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Yogas View ─────────────────────────────────────────────────────────────

const YOGA_CATEGORY_COLORS: Record<Yoga['category'], string> = {
  Raj:          '#a855f7',
  Dhana:        '#f59e0b',
  Mahapurusha:  '#10b981',
  Lunar:        '#cbd5e1',
  Solar:        '#f97316',
  Special:      '#ec4899',
  Cancellation: '#06b6d4',
}

function YogasView({ yogas }: { yogas: Yoga[] }) {
  if (yogas.length === 0) {
    return <p className="text-[11px] text-slate-500 italic">No major classical yogas detected.</p>
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] text-slate-400 leading-relaxed mb-1">
        Yogas — special planetary combinations that shape destiny. Each carries a distinct signature of fortune, talent, or challenge.
      </p>
      {yogas.map((y, i) => {
        const color = YOGA_CATEGORY_COLORS[y.category]
        return (
          <div
            key={i}
            className="rounded-xl border p-4 flex flex-col gap-2"
            style={{ borderColor: `${color}33`, background: `${color}08` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black" style={{ color }}>{y.name}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{y.sanskrit}</span>
                </div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  {y.category} Yoga
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{y.description}</p>
          </div>
        )
      })}
    </div>
  )
}

// ─── Vedic Aspects View ─────────────────────────────────────────────────────

function AspectsView({ aspects }: { aspects: VedicAspect[] }) {
  if (aspects.length === 0) {
    return <p className="text-[11px] text-slate-500 italic">No mutual planetary aspects.</p>
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] text-slate-400 leading-relaxed mb-1">
        Drishti — Vedic aspects. All planets aspect the 7th house from themselves.
        Mars also aspects 4th & 8th, Jupiter 5th & 9th, Saturn 3rd & 10th.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {aspects.map((a, i) => {
          const fromColor = GRAHA_DATA[a.from].color
          const toColor = GRAHA_DATA[a.to].color
          return (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.05] bg-white/[0.02]"
            >
              <span className="text-[10px] font-bold" style={{ color: fromColor }}>
                {GRAHA_DATA[a.from].shortGlyph}
              </span>
              <span className="text-[9px] text-slate-600">H{a.fromHouse}</span>
              <span className="text-slate-500">→</span>
              <span className="text-[10px] font-bold" style={{ color: toColor }}>
                {GRAHA_DATA[a.to].shortGlyph}
              </span>
              <span className="text-[9px] text-slate-600">H{a.toHouse}</span>
              <span className="flex-1 text-right text-[8px] text-slate-600 font-mono">{a.aspectType}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Divisional Chart View (mini chart) ─────────────────────────────────────

function DivisionalView({ chart }: { chart: DivisionalChart }) {
  const SIZE = 240
  const HALF = SIZE / 2

  const housePositions: { x: number; y: number }[] = [
    { x: HALF,         y: HALF * 0.55 },
    { x: HALF * 0.55,  y: HALF * 0.35 },
    { x: HALF * 0.35,  y: HALF * 0.55 },
    { x: HALF * 0.55,  y: HALF },
    { x: HALF * 0.35,  y: HALF * 1.45 },
    { x: HALF * 0.55,  y: HALF * 1.65 },
    { x: HALF,         y: HALF * 1.45 },
    { x: HALF * 1.45,  y: HALF * 1.65 },
    { x: HALF * 1.65,  y: HALF * 1.45 },
    { x: HALF * 1.45,  y: HALF },
    { x: HALF * 1.65,  y: HALF * 0.55 },
    { x: HALF * 1.45,  y: HALF * 0.35 },
  ]

  const planetsByHouse = new Map<number, typeof chart.planets>()
  for (const p of chart.planets) {
    if (!planetsByHouse.has(p.bhava)) planetsByHouse.set(p.bhava, [])
    planetsByHouse.get(p.bhava)!.push(p)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white">{chart.name}</h3>
          <p className="text-[9px] text-slate-500 font-mono">Lagna: {chart.lagna}</p>
        </div>
        <span className="text-[9px] font-bold text-accent-purple uppercase tracking-widest px-2 py-0.5 rounded bg-accent-purple/15">
          {chart.abbr}
        </span>
      </div>
      <p className="text-[10px] text-slate-500 leading-snug italic">{chart.purpose}</p>

      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto">
        <rect x="0" y="0" width={SIZE} height={SIZE} fill="#0a0a0f" stroke="#475569" strokeWidth="1" />
        <line x1="0" y1="0" x2={SIZE} y2={SIZE} stroke="#475569" strokeWidth="0.7" />
        <line x1={SIZE} y1="0" x2="0" y2={SIZE} stroke="#475569" strokeWidth="0.7" />
        <polygon
          points={`${HALF},0 ${SIZE},${HALF} ${HALF},${SIZE} 0,${HALF}`}
          fill="none" stroke="#475569" strokeWidth="1"
        />
        {housePositions.map((pos, i) => {
          const houseNum = i + 1
          const rashi = chart.houses[i].rashi
          const rashiData = RASHI_DATA[rashi]
          const planets = planetsByHouse.get(houseNum) ?? []
          return (
            <g key={houseNum}>
              <text x={pos.x} y={pos.y - 14} textAnchor="middle" fontSize="14" fill={rashiData.color} fontWeight="bold">
                {rashiData.symbol}
              </text>
              {planets.map((p, j) => (
                <text
                  key={p.graha}
                  x={pos.x}
                  y={pos.y + 4 + j * 9}
                  textAnchor="middle"
                  fontSize="8"
                  fill={GRAHA_DATA[p.graha].color}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {GRAHA_DATA[p.graha].shortGlyph}
                </text>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Ashtakoot Form & View ──────────────────────────────────────────────────

function AshtakootForm({
  partnerDate, setPartnerDate, partnerTime, setPartnerTime,
}: {
  partnerDate: string; setPartnerDate: (s: string) => void
  partnerTime: string; setPartnerTime: (s: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Ashtakoot Milan — the classical 36-point Vedic compatibility test. Based on Moon position,
        it scores eight categories (Koota) of harmony. 18+ acceptable, 24+ very good, 32+ excellent.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Partner Date</label>
          <input
            type="text"
            placeholder="DD/MM/YYYY"
            value={partnerDate}
            onChange={e => setPartnerDate(e.target.value)}
            className="bg-[#1f2937] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-accent-purple transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Partner Time</label>
          <input
            type="time"
            value={partnerTime}
            onChange={e => setPartnerTime(e.target.value)}
            className="bg-[#1f2937] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-accent-purple transition-all"
          />
        </div>
      </div>
    </div>
  )
}

const RATING_COLORS: Record<AshtakootResult['rating'], string> = {
  'Excellent':       '#10b981',
  'Very Good':       '#22c55e',
  'Good':            '#84cc16',
  'Acceptable':      '#f59e0b',
  'Poor':            '#f97316',
  'Not Recommended': '#ef4444',
}

function AshtakootView({ result }: { result: AshtakootResult }) {
  const ratingColor = RATING_COLORS[result.rating]
  const koots = [result.varna, result.vashya, result.tara, result.yoni, result.grahaMaitri, result.gana, result.bhakoot, result.nadi]

  return (
    <div className="flex flex-col gap-5 pt-4 border-t border-white/[0.07]">
      {/* Total score header */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <div className="text-7xl font-black" style={{ color: ratingColor }}>
            {result.total}
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">out of {result.maxTotal}</p>
          <p className="text-sm font-black mt-1" style={{ color: ratingColor }}>{result.rating}</p>
        </div>
      </div>

      {/* Doshas warning */}
      {result.doshas.length > 0 && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/[0.05] p-3 flex flex-col gap-1">
          <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">⚠ Doshas Detected</p>
          {result.doshas.map((d, i) => (
            <p key={i} className="text-[10px] text-red-300/80 leading-relaxed">{d}</p>
          ))}
        </div>
      )}

      {/* 8 Koots breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {koots.map(k => {
          const pct = (k.score / k.maxScore) * 100
          const barColor = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : pct >= 25 ? '#f97316' : '#ef4444'
          return (
            <div key={k.name} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-white">{k.name}</p>
                  <p className="text-[9px] text-slate-600 font-mono">{k.sanskrit}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black" style={{ color: barColor }}>{k.score}</span>
                  <span className="text-[9px] text-slate-600 ml-1">/{k.maxScore}</span>
                </div>
              </div>
              <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">{k.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Layout helpers ──────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-7 shadow-xl shadow-black/30">
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight text-white text-center">
      {children}
    </h2>
  )
}
