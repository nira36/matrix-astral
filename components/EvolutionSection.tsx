'use client'

import React, { useState } from 'react'
import type { NumerologyResult, LifePhase, CoreNumbers } from '@/lib/numerology'

// ─── Number meaning database ────────────────────────────────────────────────

const NUMBER_MEANINGS: Record<number, { keyword: string; theme: string; energy: string; shadow: string; lesson: string }> = {
  0: { keyword: 'Void', theme: 'Pure potential, the cosmic egg before manifestation.', energy: 'Infinite possibility', shadow: 'Paralysis, refusal to choose', lesson: 'Emptiness is not absence — it is the space where everything begins.' },
  1: { keyword: 'Initiative', theme: 'Leadership, independence, pioneering force.', energy: 'Self-directed willpower', shadow: 'Arrogance, isolation, domination', lesson: 'True leadership is acting first when no one else will.' },
  2: { keyword: 'Diplomacy', theme: 'Partnership, sensitivity, mediation.', energy: 'Receptive cooperation', shadow: 'Codependency, indecision, passivity', lesson: 'Strength is knowing when to yield without losing yourself.' },
  3: { keyword: 'Expression', theme: 'Creativity, communication, social joy.', energy: 'Expansive self-expression', shadow: 'Scattered energy, superficiality, gossip', lesson: 'What you create reveals who you are — make it honest.' },
  4: { keyword: 'Foundation', theme: 'Discipline, structure, endurance.', energy: 'Methodical construction', shadow: 'Rigidity, workaholism, limitation', lesson: 'Freedom is built on foundations you cannot see.' },
  5: { keyword: 'Freedom', theme: 'Change, adventure, sensory experience.', energy: 'Dynamic transformation', shadow: 'Excess, restlessness, irresponsibility', lesson: 'Real freedom requires the discipline to not run from yourself.' },
  6: { keyword: 'Responsibility', theme: 'Love, service, domestic harmony.', energy: 'Nurturing protection', shadow: 'Martyrdom, control, perfectionism', lesson: 'You cannot heal others by destroying yourself in the process.' },
  7: { keyword: 'Analysis', theme: 'Introspection, research, spiritual depth.', energy: 'Focused inner investigation', shadow: 'Paranoia, emotional withdrawal, cynicism', lesson: 'The deepest truths are found in silence, not in argument.' },
  8: { keyword: 'Power', theme: 'Authority, manifestation, material mastery.', energy: 'Concentrated ambition', shadow: 'Greed, ruthlessness, status obsession', lesson: 'Power without ethics is just organized destruction.' },
  9: { keyword: 'Completion', theme: 'Wisdom, compassion, universal service.', energy: 'Selfless transformation', shadow: 'Bitterness, aloofness, unreleased grief', lesson: 'Letting go is not giving up — it is graduating.' },
  11: { keyword: 'Illumination', theme: 'Spiritual insight, visionary channel.', energy: 'High-frequency intuition', shadow: 'Anxiety, nervous tension, delusion', lesson: 'The antenna that receives the most signal also carries the most static.' },
  22: { keyword: 'Master Builder', theme: 'Large-scale manifestation, systems architect.', energy: 'Visionary pragmatism', shadow: 'Overwhelm, megalomania, self-doubt', lesson: 'Build what outlives you — not what impresses them now.' },
  33: { keyword: 'Master Teacher', theme: 'Compassionate healing, selfless upliftment.', energy: 'Unconditional service', shadow: 'Savior complex, emotional burnout', lesson: 'The greatest teaching is how you carry your own suffering.' },
}

function getMeaning(n: number) {
  return NUMBER_MEANINGS[n] || NUMBER_MEANINGS[n > 9 ? n : 0] || NUMBER_MEANINGS[9]
}

// ─── Pinnacle Detail Card ────────────────────────────────────────────────────

function PinnacleCard({ phase, index }: { phase: LifePhase; index: number }) {
  const meaning = getMeaning(phase.number)
  const colors = [
    { bg: 'bg-violet-500/[0.06]', border: 'border-violet-500/20', text: 'text-violet-400', num: 'text-violet-300' },
    { bg: 'bg-sky-500/[0.06]', border: 'border-sky-500/20', text: 'text-sky-400', num: 'text-sky-300' },
    { bg: 'bg-amber-500/[0.06]', border: 'border-amber-500/20', text: 'text-amber-400', num: 'text-amber-300' },
    { bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/20', text: 'text-emerald-400', num: 'text-emerald-300' },
  ]
  const c = colors[index % 4]

  return (
    <div className={`relative rounded-2xl border ${c.border} ${c.bg} p-5 transition-all hover:scale-[1.01] ${phase.isActive ? 'ring-1 ring-white/10' : ''}`}>
      {phase.isActive && (
        <div className="absolute top-3 right-3">
          <span className="text-[8px] font-black tracking-widest uppercase bg-white/10 text-white/60 px-2 py-0.5 rounded-full">Now</span>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className={`text-4xl font-black ${c.num} leading-none`}>{phase.number}</div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className={`text-[9px] font-black tracking-widest uppercase ${c.text}`}>{phase.label}</span>
          <span className="text-[10px] text-slate-600 font-mono">Age {phase.startAge}–{phase.endAge >= 100 ? '∞' : phase.endAge}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-black uppercase tracking-widest ${c.text}`}>{meaning.keyword}</span>
          <span className="text-[10px] text-slate-500">— {meaning.energy}</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">{meaning.theme}</p>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[8px] font-black tracking-widest uppercase text-rose-400/70 block mb-1">Shadow</span>
            <span className="text-[10px] text-slate-500 leading-relaxed">{meaning.shadow}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[8px] font-black tracking-widest uppercase text-emerald-400/70 block mb-1">Lesson</span>
            <span className="text-[10px] text-slate-500 leading-relaxed">{meaning.lesson}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Challenge Detail Card ───────────────────────────────────────────────────

function ChallengeCard({ value, index }: { value: number; index: number }) {
  const meaning = getMeaning(value)
  const labels = ['Youth Challenge', 'Growth Challenge', 'Master Challenge', 'Final Challenge']

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-black tracking-widest uppercase text-slate-500 group-hover:text-rose-400/70 transition-colors">{labels[index]}</span>
        <span className="text-2xl font-black text-white/80">{value}</span>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed mb-2">{meaning.theme}</p>
      <p className="text-[10px] text-slate-600 italic leading-relaxed">"{meaning.lesson}"</p>
    </div>
  )
}

// ─── Life Phase Timeline Chart (SVG) ─────────────────────────────────────────

function LifePhaseChart({ pinnacles, challenges, lifeCycles }: { pinnacles: LifePhase[]; challenges: number[]; lifeCycles: LifePhase[] }) {
  const [hoveredAge, setHoveredAge] = useState<number | null>(null)

  const W = 700
  const H = 280
  const padL = 40
  const padR = 20
  const padT = 30
  const padB = 40
  const chartW = W - padL - padR
  const chartH = H - padT - padB

  const maxAge = 80
  const maxVal = 33

  const toX = (age: number) => padL + (age / maxAge) * chartW
  const toY = (val: number) => padT + chartH - (Math.min(val, maxVal) / maxVal) * chartH

  // Build data points per decade
  const decades = [0, 10, 20, 30, 40, 50, 60, 70, 80]

  const getPinnacleAt = (age: number) => {
    const p = pinnacles.find(p => age >= p.startAge && age < p.endAge)
    return p ? p.number : pinnacles[pinnacles.length - 1]?.number || 0
  }

  const getCycleAt = (age: number) => {
    const c = lifeCycles.find(c => age >= c.startAge && age < c.endAge)
    return c ? c.number : lifeCycles[lifeCycles.length - 1]?.number || 0
  }

  const getChallengeAt = (age: number) => {
    if (age < 28) return challenges[0] || 0
    if (age < 37) return challenges[1] || 0
    if (age < 55) return challenges[2] || 0
    return challenges[3] || 0
  }

  // Build polyline points
  const pinnaclePoints = decades.map(a => `${toX(a)},${toY(getPinnacleAt(a))}`).join(' ')
  const cyclePoints = decades.map(a => `${toX(a)},${toY(getCycleAt(a))}`).join(' ')
  const challengePoints = decades.map(a => `${toX(a)},${toY(getChallengeAt(a))}`).join(' ')

  // Current age indicator
  const now = new Date()
  const birthYear = now.getFullYear() - (pinnacles[0]?.endAge || 30) // approximate

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full min-w-[500px] h-auto"
        onMouseLeave={() => setHoveredAge(null)}
      >
        {/* Grid lines */}
        {[0, 10, 20, 30, 40, 50, 60, 70, 80].map(age => (
          <g key={age}>
            <line x1={toX(age)} y1={padT} x2={toX(age)} y2={padT + chartH} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <text x={toX(age)} y={H - 10} fill="#475569" fontSize="9" fontWeight="700" textAnchor="middle">{age}</text>
          </g>
        ))}
        {[0, 5, 10, 15, 20, 25, 30].map(v => (
          <g key={v}>
            <line x1={padL} y1={toY(v)} x2={padL + chartW} y2={toY(v)} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <text x={padL - 8} y={toY(v) + 3} fill="#334155" fontSize="8" fontWeight="600" textAnchor="end">{v}</text>
          </g>
        ))}

        {/* Area fills */}
        <polygon
          points={`${toX(0)},${toY(0)} ${pinnaclePoints} ${toX(80)},${toY(0)}`}
          fill="rgba(139,92,246,0.06)"
        />

        {/* Lines */}
        <polyline points={pinnaclePoints} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinejoin="round" />
        <polyline points={cyclePoints} fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="6 3" />
        <polyline points={challengePoints} fill="none" stroke="#F87171" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="3 3" />

        {/* Data points — Pinnacles */}
        {decades.map(age => (
          <g key={`p-${age}`}>
            <circle cx={toX(age)} cy={toY(getPinnacleAt(age))} r="4" fill="#8B5CF6" stroke="#1e1b4b" strokeWidth="1.5" />
            <text x={toX(age)} y={toY(getPinnacleAt(age)) - 10} fill="#c4b5fd" fontSize="9" fontWeight="800" textAnchor="middle">
              {getPinnacleAt(age)}
            </text>
          </g>
        ))}

        {/* Data points — Cycles */}
        {decades.map(age => (
          <circle key={`c-${age}`} cx={toX(age)} cy={toY(getCycleAt(age))} r="3" fill="#22D3EE" stroke="#1e1b4b" strokeWidth="1.5" />
        ))}

        {/* Data points — Challenges */}
        {decades.map(age => (
          <circle key={`ch-${age}`} cx={toX(age)} cy={toY(getChallengeAt(age))} r="2.5" fill="#F87171" stroke="#1e1b4b" strokeWidth="1.5" />
        ))}

        {/* Hover zones */}
        {decades.map(age => (
          <rect
            key={`hover-${age}`}
            x={toX(age) - chartW / 18}
            y={padT}
            width={chartW / 9}
            height={chartH}
            fill="transparent"
            onMouseEnter={() => setHoveredAge(age)}
            className="cursor-crosshair"
          />
        ))}

        {/* Hover crosshair */}
        {hoveredAge !== null && (
          <g>
            <line x1={toX(hoveredAge)} y1={padT} x2={toX(hoveredAge)} y2={padT + chartH} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 2" />
            <rect x={toX(hoveredAge) - 48} y={padT - 2} width="96" height="54" rx="6" fill="rgba(15,15,30,0.95)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <text x={toX(hoveredAge)} y={padT + 12} fill="#c4b5fd" fontSize="8" fontWeight="800" textAnchor="middle">Age {hoveredAge}</text>
            <text x={toX(hoveredAge)} y={padT + 24} fill="#8B5CF6" fontSize="8" fontWeight="700" textAnchor="middle">
              Pinnacle: {getPinnacleAt(hoveredAge)}
            </text>
            <text x={toX(hoveredAge)} y={padT + 34} fill="#22D3EE" fontSize="8" fontWeight="700" textAnchor="middle">
              Cycle: {getCycleAt(hoveredAge)}
            </text>
            <text x={toX(hoveredAge)} y={padT + 44} fill="#F87171" fontSize="8" fontWeight="700" textAnchor="middle">
              Challenge: {getChallengeAt(hoveredAge)}
            </text>
          </g>
        )}

        {/* Axis label */}
        <text x={W / 2} y={H - 0} fill="#334155" fontSize="8" fontWeight="700" textAnchor="middle" letterSpacing="3">AGE</text>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {[
          { color: '#8B5CF6', label: 'Pinnacle', dash: false },
          { color: '#22D3EE', label: 'Life Cycle', dash: true },
          { color: '#F87171', label: 'Challenge', dash: true },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <svg width="20" height="2">
              <line x1="0" y1="1" x2="20" y2="1" stroke={l.color} strokeWidth="2" strokeDasharray={l.dash ? '4 2' : ''} />
            </svg>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Core Numbers Radar (enhanced) ──────────────────────────────────────────

function EnhancedRadar({ core }: { core: CoreNumbers }) {
  const [hovered, setHovered] = useState<number | null>(null)

  const points = [
    { label: 'Life Path', short: 'LP', value: core.lifePath, color: '#8B5CF6' },
    { label: 'Expression', short: 'EX', value: core.expression, color: '#3B82F6' },
    { label: 'Soul Urge', short: 'SU', value: core.soulUrge, color: '#F43F5E' },
    { label: 'Personality', short: 'PE', value: core.personality, color: '#10B981' },
    { label: 'Birth Day', short: 'BD', value: core.birthDayNumber, color: '#F59E0B' },
    { label: 'Maturity', short: 'MA', value: core.maturityNumber, color: '#EF4444' },
  ]

  const size = 240
  const center = size / 2
  const radius = size * 0.35

  const getCoord = (val: number, i: number) => {
    const angle = (Math.PI * 2 * i) / points.length - Math.PI / 2
    const factor = val === 0 ? 0.05 : 0.1 + (Math.min(val, 33) / 33) * 0.9
    return {
      x: center + radius * factor * Math.cos(angle),
      y: center + radius * factor * Math.sin(angle),
    }
  }

  const getLabelCoord = (i: number) => {
    const angle = (Math.PI * 2 * i) / points.length - Math.PI / 2
    return {
      x: center + (radius + 30) * Math.cos(angle),
      y: center + (radius + 30) * Math.sin(angle),
    }
  }

  const polygonPoints = points.map((p, i) => {
    const { x, y } = getCoord(p.value, i)
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <circle key={f} cx={center} cy={center} r={radius * f} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}

        {/* Axis lines */}
        {points.map((_, i) => {
          const angle = (Math.PI * 2 * i) / points.length - Math.PI / 2
          return (
            <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          )
        })}

        {/* Data polygon */}
        <polygon points={polygonPoints} fill="rgba(139,92,246,0.12)" stroke="#8B5CF6" strokeWidth="1.5" />

        {/* Data points */}
        {points.map((p, i) => {
          const { x, y } = getCoord(p.value, i)
          return (
            <circle
              key={i}
              cx={x} cy={y} r={hovered === i ? 5 : 3.5}
              fill={p.color}
              stroke="#0f0f1e"
              strokeWidth="2"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-all duration-200"
            />
          )
        })}

        {/* Labels */}
        {points.map((p, i) => {
          const { x, y } = getLabelCoord(i)
          return (
            <g key={i}>
              <text x={x} y={y - 5} fill={hovered === i ? p.color : '#64748b'} fontSize="8" fontWeight="800" textAnchor="middle" className="uppercase tracking-widest transition-colors">
                {p.short}
              </text>
              <text x={x} y={y + 6} fill={hovered === i ? '#e2e8f0' : '#334155'} fontSize="10" fontWeight="800" textAnchor="middle" className="transition-colors">
                {p.value}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Hovered detail */}
      <div className="h-14 flex items-center justify-center">
        {hovered !== null ? (
          <div className="text-center animate-fade-up">
            <span className="text-xs font-bold text-white">{points[hovered].label}: {points[hovered].value}</span>
            <p className="text-[10px] text-slate-500 mt-0.5">{getMeaning(points[hovered].value).theme}</p>
          </div>
        ) : (
          <p className="text-[10px] text-slate-600 italic">Hover a point to see details</p>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function EvolutionSection({ result }: { result: NumerologyResult }) {
  return (
    <div className="flex flex-col gap-10">

      {/* Life Phase Timeline Chart */}
      <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-7 shadow-xl shadow-black/30">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Lifetime Energy Map</h3>
        <LifePhaseChart pinnacles={result.pinnacles} challenges={result.challenges} lifeCycles={result.lifeCycles} />
      </div>

      {/* Pinnacles — detailed */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">The 4 Pinnacles — Peak Energies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.pinnacles.map((p, i) => (
            <PinnacleCard key={i} phase={p} index={i} />
          ))}
        </div>
      </div>

      {/* Challenges — detailed */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">The 4 Challenges — Growth Friction</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.challenges.map((c, i) => (
            <ChallengeCard key={i} value={c} index={i} />
          ))}
        </div>
      </div>

      {/* Life Cycles + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Life Cycles detailed */}
        <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-7 shadow-xl shadow-black/30">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Major Life Cycles</h3>
          <div className="flex flex-col gap-4">
            {result.lifeCycles.map((c, i) => {
              const meaning = getMeaning(c.number)
              const cycleColors = ['text-cyan-400', 'text-amber-400', 'text-rose-400']
              const cycleBgs = ['bg-cyan-500/[0.06] border-cyan-500/20', 'bg-amber-500/[0.06] border-amber-500/20', 'bg-rose-500/[0.06] border-rose-500/20']
              return (
                <div key={i} className={`p-4 rounded-xl border ${cycleBgs[i] || cycleBgs[0]}`}>
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`text-3xl font-black ${cycleColors[i] || cycleColors[0]}`}>{c.number}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-300">{c.label}</div>
                      <div className="text-[10px] text-slate-600 font-mono">Age {c.startAge}–{c.endAge >= 100 ? '∞' : c.endAge}</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed mb-1">{meaning.theme}</p>
                  <p className="text-[10px] text-slate-600 italic">"{meaning.lesson}"</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Enhanced Radar */}
        <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-7 shadow-xl shadow-black/30 flex flex-col items-center">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 self-start">Core Number Profile</h3>
          <EnhancedRadar core={result.core} />
        </div>
      </div>
    </div>
  )
}
