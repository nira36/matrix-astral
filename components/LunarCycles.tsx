'use client'

import React, { useMemo, useState } from 'react'
import type { NumerologyResult } from '@/lib/numerology'
import { reduceNumber } from '@/lib/numerology'

// ─── Moon phase calculation (Jean Meeus algorithm, simplified) ───────────────

function julianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

function moonAge(year: number, month: number, day: number): number {
  const jd = julianDay(year, month, day)
  const knownNew = julianDay(2000, 1, 6)
  const cycle = 29.53058867
  return ((jd - knownNew) % cycle + cycle) % cycle
}

type MoonPhaseName = 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent'

interface MoonPhase {
  name: MoonPhaseName
  description: string
  tone: string
  quote: string
  personality: string
}

function getMoonPhase(age: number): MoonPhase {
  if (age < 1.85) return {
    name: 'New Moon',
    description: 'The void before creation. Raw potential waiting for direction.',
    tone: 'Initiation',
    quote: 'Plant seeds. The invisible work is the real work.',
    personality: 'You entered the world at the zero point — the moment of pure potential before anything takes shape. You are a natural initiator, drawn to beginnings, prototypes, and first drafts. Your instinct is to start from scratch rather than inherit. The danger is abandoning things before they mature. Your gift is seeing possibilities where others see nothing.'
  }
  if (age < 7.38) return {
    name: 'Waxing Crescent',
    description: 'First light emerges. Momentum is building beneath the surface.',
    tone: 'Growth',
    quote: 'Push forward. Doubt is loudest right before traction.',
    personality: 'Born under the first sliver of returning light, you carry an instinct to push through resistance. You understand that early effort is invisible effort — and you are willing to work without applause. Your challenge is impatience; your strength is the stubborn belief that what you started deserves to exist, even when no one else sees it yet.'
  }
  if (age < 9.22) return {
    name: 'First Quarter',
    description: 'The crisis of action. Choose a direction and commit.',
    tone: 'Challenge',
    quote: 'Decide now. Hesitation costs more than a wrong turn.',
    personality: 'You were born at the exact tension point between intention and execution. You are wired for decisive action under pressure. Comfort zones bore you; you need friction to feel alive. Others may see you as restless, but what drives you is the refusal to let ideas remain theoretical. Your lesson is learning which battles are actually yours to fight.'
  }
  if (age < 14.77) return {
    name: 'Waxing Gibbous',
    description: 'Refinement phase. Adjust, polish, prepare for culmination.',
    tone: 'Refinement',
    quote: 'Trust the process. The last ten percent defines everything.',
    personality: 'Born just before the peak, you have an obsessive eye for what is almost right but not yet perfect. You are the editor, the quality controller, the person who notices the one misaligned detail. This makes you invaluable in any creative or strategic role, but it can also trap you in endless revision. Your lesson is knowing when good enough is complete.'
  }
  if (age < 16.61) return {
    name: 'Full Moon',
    description: 'Maximum illumination. Everything is visible — including what you hid.',
    tone: 'Fulfillment',
    quote: 'Harvest and release. Holding on now means rotting later.',
    personality: 'You arrived under maximum light — nothing about you stays hidden for long. You are magnetic, expressive, and emotionally transparent. Relationships define your growth because you learn through the mirror of others. Your challenge is that full exposure can feel like full vulnerability. Your power is the courage to be completely seen and to let others see themselves through you.'
  }
  if (age < 22.15) return {
    name: 'Waning Gibbous',
    description: 'The teacher emerges. Share what the peak revealed.',
    tone: 'Distribution',
    quote: 'Give what you know. Wisdom hoarded is wisdom wasted.',
    personality: 'Born in the phase of dissemination, you are a natural teacher, mentor, and translator of complex experience into usable knowledge. You have lived enough internally to know what matters, and you feel compelled to pass it on. Your risk is becoming preachy or believing your perspective is the only valid one. Your gift is genuine generosity of insight.'
  }
  if (age < 23.99) return {
    name: 'Last Quarter',
    description: 'The final reckoning. Strip away what no longer serves.',
    tone: 'Release',
    quote: 'Let go deliberately. What you cling to now defines your next prison.',
    personality: 'You were born at the crisis of release — the moment the cycle demands you shed what you have outgrown. You are instinctively drawn to endings, closures, and transitions. You can walk away from things others would cling to for decades. This terrifies people but liberates you. Your lesson is releasing without bitterness — cutting clean, not burning bridges.'
  }
  return {
    name: 'Waning Crescent',
    description: 'The dark before renewal. Rest is not laziness — it is preparation.',
    tone: 'Surrender',
    quote: 'Be still. The next chapter writes itself in silence.',
    personality: 'Born in the final dark sliver before the cycle restarts, you carry the wisdom of endings. You are introspective, often old beyond your years, and comfortable with solitude in ways that unsettle others. You understand that rest and emptiness are not failure — they are the conditions for rebirth. Your gift is the ability to sit with uncertainty without panicking.'
  }
}

function daysToNextNew(age: number): number {
  return Math.ceil(29.53 - age)
}

function daysToNextFull(age: number): number {
  const diff = 14.77 - age
  return diff > 0 ? Math.ceil(diff) : Math.ceil(diff + 29.53)
}

// ─── Transit data ────────────────────────────────────────────────────────────

const TRANSIT_DATA: Record<number, { theme: string; advice: string }> = {
  1: { theme: 'New beginnings', advice: 'Start something. Initiative taken today compounds over time.' },
  2: { theme: 'Cooperation & patience', advice: 'Listen more than you speak. Partnerships need tending today.' },
  3: { theme: 'Expression & creativity', advice: 'Create without editing. Let joy drive the output today.' },
  4: { theme: 'Structure & discipline', advice: 'Build the frame. Tedious work today prevents collapse later.' },
  5: { theme: 'Change & freedom', advice: 'Break a routine. Controlled disruption prevents forced disruption.' },
  6: { theme: 'Responsibility & love', advice: 'Show up for someone. Service given freely returns amplified.' },
  7: { theme: 'Introspection & study', advice: 'Go inward. The answer is already there, stop asking.' },
  8: { theme: 'Power & ambition', advice: 'Pursue what you want directly. Timidity wastes this energy.' },
  9: { theme: 'Completion & release', advice: 'Finish or forgive something. Dragging old weight slows everything.' },
  11: { theme: 'Spiritual insight', advice: 'Trust the strange feeling. Intuition speaks louder than logic.' },
  22: { theme: 'Master builder', advice: 'Think in systems, not tasks. Your vision exceeds normal scale.' },
  33: { theme: 'Compassionate healing', advice: 'Heal through presence. Your attention itself is the medicine.' },
}

// ─── SVG Moon Phase Visualizer (vector astronomical diagram) ────────────────

function MoonPhaseSVG({ age, size = 200, id = 'main' }: { age: number; size?: number; id?: string }) {
  const r = size / 2 - 8
  const cx = size / 2
  const cy = size / 2
  const cycle = 29.53
  const fraction = age / cycle

  // illumination: 0 = new, 1 = full, back to 0
  const illumination = fraction <= 0.5
    ? fraction * 2
    : 2 - fraction * 2

  const isWaxing = fraction <= 0.5
  const isNew = illumination < 0.03
  const isFull = illumination > 0.97

  // Terminator curve: an ellipse whose rx varies with illumination
  // rx = r means flat (quarter), rx = 0 means on the edge, rx = r means circle
  const terminatorRx = Math.abs(illumination * 2 - 1) * r
  // Direction: which way the bulge goes
  const bulgeRight = illumination > 0.5

  // Build terminator path (vertical elliptical arc from top to bottom of circle)
  const terminatorPath = `M ${cx} ${cy - r} A ${terminatorRx} ${r} 0 0 ${bulgeRight ? 1 : 0} ${cx} ${cy + r}`

  // Lit side clip: terminator + the outer arc on the illuminated side
  const clipId = `lit-clip-${id}`
  // For waxing: lit side is RIGHT (terminator + right arc)
  // For waning: lit side is LEFT (terminator + left arc)
  const litClipPath = isWaxing
    ? `M ${cx} ${cy - r} A ${terminatorRx} ${r} 0 0 ${bulgeRight ? 1 : 0} ${cx} ${cy + r} A ${r} ${r} 0 0 0 ${cx} ${cy - r} Z`
    : `M ${cx} ${cy - r} A ${terminatorRx} ${r} 0 0 ${bulgeRight ? 1 : 0} ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx} ${cy - r} Z`

  // Generate dot grid for the illuminated region
  const dotSpacing = size > 120 ? 8 : 6
  const dots: { x: number; y: number }[] = []
  for (let gx = cx - r; gx <= cx + r; gx += dotSpacing) {
    for (let gy = cy - r; gy <= cy + r; gy += dotSpacing) {
      const dx = gx - cx
      const dy = gy - cy
      if (dx * dx + dy * dy <= r * r * 0.95) {
        dots.push({ x: gx, y: gy })
      }
    }
  }

  const dotR = size > 120 ? 0.7 : 0.5

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <clipPath id={`circle-clip-${id}`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        {!isNew && !isFull && (
          <clipPath id={clipId}>
            <path d={litClipPath} />
          </clipPath>
        )}
        {isFull && (
          <clipPath id={clipId}>
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        )}
      </defs>

      {/* Outer circle border */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeWidth="2" />

      {/* Dot texture for illuminated area */}
      {!isNew && (
        <g clipPath={`url(#${isFull ? clipId : clipId})`}>
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={dotR} fill="white" opacity="0.35" />
          ))}
        </g>
      )}

      {/* Terminator line */}
      {!isNew && !isFull && (
        <path
          d={terminatorPath}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          clipPath={`url(#circle-clip-${id})`}
        />
      )}

      {/* Center dot */}
      <circle
        cx={cx}
        cy={cy}
        r={isFull ? 2 : 1.5}
        fill={isNew ? 'rgba(255,255,255,0.2)' : 'white'}
        opacity={isNew ? 0.3 : isFull ? 0.6 : 0}
      />
    </svg>
  )
}

// ─── Personal Transit Clock (9-segment circle) ─────────────────────────────

function TransitClock({ days }: { days: { date: string; pd: number; dayLabel: string }[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const size = 320
  const cx = size / 2
  const cy = size / 2
  const outerR = 130
  const innerR = 55
  const segmentCount = 9

  const segments = days.slice(0, segmentCount)

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="clock-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {segments.map((seg, i) => {
          const startAngle = (i * 360 / segmentCount - 90) * (Math.PI / 180)
          const endAngle = ((i + 1) * 360 / segmentCount - 90) * (Math.PI / 180)
          const midAngle = ((i + 0.5) * 360 / segmentCount - 90) * (Math.PI / 180)

          const x1o = cx + outerR * Math.cos(startAngle)
          const y1o = cy + outerR * Math.sin(startAngle)
          const x2o = cx + outerR * Math.cos(endAngle)
          const y2o = cy + outerR * Math.sin(endAngle)
          const x1i = cx + innerR * Math.cos(endAngle)
          const y1i = cy + innerR * Math.sin(endAngle)
          const x2i = cx + innerR * Math.cos(startAngle)
          const y2i = cy + innerR * Math.sin(startAngle)

          const textR = (outerR + innerR) / 2
          const tx = cx + textR * Math.cos(midAngle)
          const ty = cy + textR * Math.sin(midAngle)

          const dateR = outerR - 18
          const dx = cx + dateR * Math.cos(midAngle)
          const dy = cy + dateR * Math.sin(midAngle)

          const isToday = i === 0
          const isHovered = hovered === i

          const path = `
            M ${x1o} ${y1o}
            A ${outerR} ${outerR} 0 0 1 ${x2o} ${y2o}
            L ${x1i} ${y1i}
            A ${innerR} ${innerR} 0 0 0 ${x2i} ${y2i}
            Z
          `

          return (
            <g
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Today glow */}
              {isToday && (
                <path
                  d={path}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  filter="url(#clock-glow)"
                  opacity="0.7"
                />
              )}
              <path
                d={path}
                fill={isToday ? 'rgba(139,92,246,0.15)' : isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'}
                stroke={isToday ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}
                strokeWidth={isToday ? '2' : '1'}
                className="transition-all duration-200"
              />
              {/* Number */}
              <text
                x={tx}
                y={ty + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isToday ? '#c4b5fd' : '#94a3b8'}
                fontSize="20"
                fontWeight="800"
              >
                {seg.pd}
              </text>
              {/* Date label */}
              <text
                x={dx}
                y={dy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isToday ? '#a78bfa' : '#475569'}
                fontSize="8"
                fontWeight="700"
              >
                {seg.dayLabel}
              </text>
            </g>
          )
        })}

        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="8" fontWeight="700" letterSpacing="2">
          PERSONAL
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="9" fontWeight="800" letterSpacing="2">
          DAYS
        </text>
      </svg>

      {/* Tooltip */}
      {hovered !== null && segments[hovered] && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+12px)] z-50
                        bg-bg-card border border-white/10 rounded-xl px-5 py-3 shadow-2xl shadow-black/40
                        min-w-[220px] pointer-events-none animate-fade-up">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-2xl font-black text-accent-purple">{segments[hovered].pd}</span>
            <div>
              <p className="text-[10px] text-slate-500 font-bold">{segments[hovered].dayLabel}{hovered === 0 ? ' · Today' : ''}</p>
              <p className="text-xs font-bold text-white">{TRANSIT_DATA[segments[hovered].pd]?.theme || 'Transition'}</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">{TRANSIT_DATA[segments[hovered].pd]?.advice || ''}</p>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function LunarCycles({ result }: { result: NumerologyResult }) {
  const { day, month, year } = result
  const today = new Date()
  const ty = today.getFullYear()
  const tm = today.getMonth() + 1
  const td = today.getDate()

  const birthMoonAge = useMemo(() => moonAge(year, month, day), [year, month, day])
  const todayMoonAge = useMemo(() => moonAge(ty, tm, td), [ty, tm, td])

  const birthPhase = getMoonPhase(birthMoonAge)
  const todayPhase = getMoonPhase(todayMoonAge)

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const next9Days = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      const dd = d.getDate()
      const mm = d.getMonth() + 1
      const yyyy = d.getFullYear()
      const py = reduceNumber(reduceNumber(day) + reduceNumber(month) + reduceNumber(yyyy))
      const pm = reduceNumber(py + reduceNumber(mm))
      const pd = reduceNumber(pm + reduceNumber(dd))
      return {
        date: `${dd}/${mm < 10 ? '0' + mm : mm}`,
        dayLabel: DAY_NAMES[d.getDay()],
        pd,
      }
    })
  }, [day, month])

  const personalYear = result.personalDay.year
  const personalMonth = result.personalDay.month
  const personalDay = result.personalDay.day

  return (
    <div className="flex flex-col gap-14">

      {/* ─── Row 1: Moon Phase Visualizer + Birth Moon Card ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Current Moon Phase */}
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Current Lunar Phase</p>
          <MoonPhaseSVG age={todayMoonAge} size={180} id="today" />
          <div className="text-center flex flex-col gap-2">
            <h3 className="text-xl font-black text-white tracking-wide">{todayPhase.name}</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{todayPhase.description}</p>
            <div className="flex items-center justify-center gap-6 mt-2 text-[10px] text-slate-600 font-mono">
              <span>New in {daysToNextNew(todayMoonAge)}d</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>Full in {daysToNextFull(todayMoonAge)}d</span>
            </div>
          </div>
        </div>

        {/* Birth Moon Card */}
        <div className="flex flex-col gap-6 p-8 rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.03]">
          <p className="text-[10px] font-black tracking-widest uppercase text-indigo-400">Your Birth Moon</p>
          <div className="flex items-start gap-5">
            <div className="shrink-0">
              <MoonPhaseSVG age={birthMoonAge} size={80} id="birth" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-black text-white">{birthPhase.name}</h3>
              <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest">{birthPhase.tone}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {birthPhase.personality}
          </p>
          <p className="text-[9px] text-slate-600 font-mono">Moon age at birth: {birthMoonAge.toFixed(1)} days into the cycle</p>
        </div>
      </div>

      {/* ─── Row 2: Transit Clock + Personal Transits ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 9-Segment Transit Clock */}
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">9-Day Transit Forecast</p>
          <TransitClock days={next9Days} />
          <p className="text-[9px] text-slate-600 text-center max-w-xs">
            Hover over a segment to see the energy profile. The highlighted segment is today.
          </p>
        </div>

        {/* Current Personal Transits */}
        <div className="flex flex-col gap-6 p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Active Personal Transits</p>

          <div className="flex flex-col gap-4">
            {[
              { label: 'Personal Year', value: personalYear, color: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-violet-500/[0.06]' },
              { label: 'Personal Month', value: personalMonth, color: 'text-sky-400', border: 'border-sky-500/20', bg: 'bg-sky-500/[0.06]' },
              { label: 'Personal Day', value: personalDay, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.06]' },
            ].map(t => (
              <div key={t.label} className={`flex items-center gap-5 p-5 rounded-xl border ${t.border} ${t.bg}`}>
                <span className={`text-4xl font-black ${t.color} w-14 text-center`}>{t.value}</span>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[9px] font-black tracking-widest uppercase text-slate-500">{t.label}</span>
                  <span className="text-xs font-bold text-white">{TRANSIT_DATA[t.value]?.theme || 'Transition'}</span>
                  <span className="text-[10px] text-slate-500 leading-relaxed">{TRANSIT_DATA[t.value]?.advice || ''}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lunar Quote */}
          <div className="mt-auto pt-6 border-t border-white/[0.05]">
            <p className="text-[10px] font-black tracking-widest uppercase text-slate-600 mb-2">Lunar Directive</p>
            <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
              "{todayPhase.quote}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
