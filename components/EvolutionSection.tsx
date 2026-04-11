'use client'

import React from 'react'
import type { NumerologyResult, LifePhase } from '@/lib/numerology'
import { getArcana } from '@/lib/arcana'

// ─── Number meaning database ────────────────────────────────────────────────

const NUMBER_MEANINGS: Record<number, { keyword: string; theme: string; energy: string; shadow: string; lesson: string }> = {
  0: { keyword: 'Void', theme: 'Pure potential, the cosmic egg before manifestation.', energy: 'Infinite possibility', shadow: 'Paralysis, refusal to choose', lesson: 'Emptiness is not absence, it is the space where everything begins.' },
  1: { keyword: 'Initiative', theme: 'Leadership, independence, pioneering force.', energy: 'Self-directed willpower', shadow: 'Arrogance, isolation, domination', lesson: 'True leadership is acting first when no one else will.' },
  2: { keyword: 'Diplomacy', theme: 'Partnership, sensitivity, mediation.', energy: 'Receptive cooperation', shadow: 'Codependency, indecision, passivity', lesson: 'Strength is knowing when to yield without losing yourself.' },
  3: { keyword: 'Expression', theme: 'Creativity, communication, social joy.', energy: 'Expansive self-expression', shadow: 'Scattered energy, superficiality, gossip', lesson: 'What you create reveals who you are, make it honest.' },
  4: { keyword: 'Foundation', theme: 'Discipline, structure, endurance.', energy: 'Methodical construction', shadow: 'Rigidity, workaholism, limitation', lesson: 'Freedom is built on foundations you cannot see.' },
  5: { keyword: 'Freedom', theme: 'Change, adventure, sensory experience.', energy: 'Dynamic transformation', shadow: 'Excess, restlessness, irresponsibility', lesson: 'Real freedom requires the discipline to not run from yourself.' },
  6: { keyword: 'Responsibility', theme: 'Love, service, domestic harmony.', energy: 'Nurturing protection', shadow: 'Martyrdom, control, perfectionism', lesson: 'You cannot heal others by destroying yourself in the process.' },
  7: { keyword: 'Analysis', theme: 'Introspection, research, spiritual depth.', energy: 'Focused inner investigation', shadow: 'Paranoia, emotional withdrawal, cynicism', lesson: 'The deepest truths are found in silence, not in argument.' },
  8: { keyword: 'Power', theme: 'Authority, manifestation, material mastery.', energy: 'Concentrated ambition', shadow: 'Greed, ruthlessness, status obsession', lesson: 'Power without ethics is just organized destruction.' },
  9: { keyword: 'Completion', theme: 'Wisdom, compassion, universal service.', energy: 'Selfless transformation', shadow: 'Bitterness, aloofness, unreleased grief', lesson: 'Letting go is not giving up, it is graduating.' },
  11: { keyword: 'Illumination', theme: 'Spiritual insight, visionary channel.', energy: 'High-frequency intuition', shadow: 'Anxiety, nervous tension, delusion', lesson: 'The antenna that receives the most signal also carries the most static.' },
  22: { keyword: 'Master Builder', theme: 'Large-scale manifestation, systems architect.', energy: 'Visionary pragmatism', shadow: 'Overwhelm, megalomania, self-doubt', lesson: 'Build what outlives you, not what impresses them now.' },
  33: { keyword: 'Master Teacher', theme: 'Compassionate healing, selfless upliftment.', energy: 'Unconditional service', shadow: 'Savior complex, emotional burnout', lesson: 'The greatest teaching is how you carry your own suffering.' },
}

function getMeaning(n: number) {
  return NUMBER_MEANINGS[n] || NUMBER_MEANINGS[n > 9 ? n : 0] || NUMBER_MEANINGS[9]
}

// ─── Pinnacle Detail Card ────────────────────────────────────────────────────

function PinnacleCard({ phase }: { phase: LifePhase; index: number }) {
  const meaning = getMeaning(phase.number)
  const color = getArcana(phase.number)?.color ?? '#a8879d'

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all hover:scale-[1.01] ${phase.isActive ? 'ring-1 ring-white/10' : ''}`}
      style={{
        background: `${color}10`,
        borderColor: `${color}33`,
      }}
    >
      {phase.isActive && (
        <div className="absolute top-3 right-3">
          <span className="text-[8px] font-black tracking-widest uppercase bg-white/10 text-white/60 px-2 py-0.5 rounded-full">Now</span>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="text-4xl font-black leading-none" style={{ color }}>{phase.number}</div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[9px] font-black tracking-widest uppercase" style={{ color }}>{phase.label}</span>
          <span className="text-[10px] text-slate-600 font-mono">Age {phase.startAge}–{phase.endAge >= 100 ? '∞' : phase.endAge}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color }}>{meaning.keyword}</span>
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
  const color = getArcana(value)?.color ?? '#a8879d'
  const labels = ['Youth Challenge', 'Growth Challenge', 'Master Challenge', 'Final Challenge']

  return (
    <div
      className="rounded-xl border p-4 hover:bg-white/[0.04] transition-all group"
      style={{
        background: `${color}08`,
        borderColor: `${color}25`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-black tracking-widest uppercase transition-colors" style={{ color }}>{labels[index]}</span>
        <span className="text-2xl font-black" style={{ color }}>{value}</span>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed mb-2">{meaning.theme}</p>
      <p className="text-[10px] text-slate-600 italic leading-relaxed">&quot;{meaning.lesson}&quot;</p>
    </div>
  )
}


// ─── Main Component ─────────────────────────────────────────────────────────

export default function EvolutionSection({ result }: { result: NumerologyResult }) {
  return (
    <div className="flex flex-col gap-10">

{/* Pinnacles, detailed */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">The 4 Pinnacles, Peak Energies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.pinnacles.map((p, i) => (
            <PinnacleCard key={i} phase={p} index={i} />
          ))}
        </div>
      </div>

      {/* Challenges, detailed */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">The 4 Challenges, Growth Friction</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.challenges.map((c, i) => (
            <ChallengeCard key={i} value={c} index={i} />
          ))}
        </div>
      </div>

      {/* Life Cycles detailed */}
      <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-7 shadow-xl shadow-black/30">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Major Life Cycles</h3>
        <div className="flex flex-col gap-4">
          {result.lifeCycles.map((c, i) => {
            const meaning = getMeaning(c.number)
            const color = getArcana(c.number)?.color ?? '#a8879d'
            return (
              <div
                key={i}
                className="p-4 rounded-xl border"
                style={{
                  background: `${color}08`,
                  borderColor: `${color}25`,
                }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl font-black" style={{ color }}>{c.number}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-300">{c.label}</div>
                    <div className="text-[10px] text-slate-600 font-mono">Age {c.startAge}–{c.endAge >= 100 ? '∞' : c.endAge}</div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed mb-1">{meaning.theme}</p>
                <p className="text-[10px] text-slate-600 italic">&quot;{meaning.lesson}&quot;</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
