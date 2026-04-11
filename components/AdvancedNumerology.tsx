'use client'

import React from 'react'
import { INTERPRETATIONS } from '@/lib/interpretations'
import { NUMBER_MEANINGS } from '@/lib/numerology'
import { getArcana } from '@/lib/arcana'
import type { NumerologyResult } from '@/lib/numerology'

interface CardProps {
  label: string
  sublabel: string
  value: number | string
  meaning?: string
}

function NumCard({ label, sublabel, value, meaning }: CardProps) {
  const color = typeof value === 'number' ? (getArcana(value)?.color ?? '#8b5cf6') : '#8b5cf6'
  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-2xl border"
      style={{
        background: `${color}08`,
        borderColor: `${color}25`,
      }}
    >
      <div>
        <p className="text-[10px] font-black tracking-widest uppercase" style={{ color }}>{label}</p>
        <p className="text-[9px] text-slate-600 uppercase tracking-widest mt-0.5">{sublabel}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black" style={{ color }}>{value}</span>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          {typeof value === 'number' ? (INTERPRETATIONS[value]?.archetype || '') : ''}
        </span>
      </div>
      {meaning && <p className="text-[11px] text-slate-400 leading-relaxed">{meaning}</p>}
    </div>
  )
}

export default function AdvancedNumerology({ result }: { result: NumerologyResult }) {
  const { advanced } = result

  const cards: CardProps[] = [
    {
      label: 'Subconscious Self',
      sublabel: '9 − missing numbers',
      value: advanced.subconsciousSelf,
      meaning: 'Your instinctive response under pressure. How many vibrational areas you have mastered.',
    },
    {
      label: 'Shadow Number',
      sublabel: '9 − Life Path',
      value: advanced.shadowNumber,
      meaning: 'The energy you resist or project onto others. Integrating it unlocks hidden power.',
    },
    {
      label: 'Heritage Number',
      sublabel: 'Day + Month (reduced)',
      value: advanced.heritageNumber,
      meaning: 'The ancestral imprint carried from family lineage into this incarnation.',
    },
    {
      label: 'Balance Number',
      sublabel: 'Initials reduced',
      value: advanced.balanceNumber,
      meaning: 'How you restore equilibrium in conflict. Your instinctive coping strategy.',
    },
    {
      label: 'Realization',
      sublabel: 'Life Path + Soul Urge',
      value: advanced.realization,
      meaning: 'The ultimate personal achievement available to you in this lifetime.',
    },
    {
      label: 'Rational Thought',
      sublabel: 'Life Path + First Name length',
      value: advanced.rationalThought,
      meaning: 'How your mind processes information and arrives at conclusions.',
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(c => (
          <NumCard key={c.label} {...c} />
        ))}
      </div>

      {/* Hidden Passion / Passion Numbers */}
      {advanced.hiddenPassion.length > 0 && (
        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-4">
            Passion Numbers · Dominant Vibrations
          </p>
          <div className="flex flex-wrap gap-3">
            {advanced.hiddenPassion.map(n => {
              const c = getArcana(n)?.color ?? '#8b5cf6'
              return (
                <div key={n} className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                  style={{ background: `${c}12`, borderColor: `${c}30` }}>
                  <span className="text-2xl font-black" style={{ color: c }}>{n}</span>
                  <div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      {INTERPRETATIONS[n]?.archetype}
                    </p>
                    <p className="text-[9px] text-slate-500">{INTERPRETATIONS[n]?.positive?.[0]}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Karmic Lessons */}
      {advanced.karmicLessons.length > 0 && (
        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-4">
            Karmic Lessons · Missing Vibrations
          </p>
          <div className="flex flex-wrap gap-3">
            {advanced.karmicLessons.map(n => {
              const c = getArcana(n)?.color ?? '#8b5cf6'
              return (
                <div key={n} className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                  style={{ background: `${c}12`, borderColor: `${c}30` }}>
                  <span className="text-2xl font-black" style={{ color: c }}>{n}</span>
                  <div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      {INTERPRETATIONS[n]?.archetype}
                    </p>
                    <p className="text-[9px] text-slate-500">{NUMBER_MEANINGS[n]?.slice(0, 50)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Name anchors */}
      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { label: 'Cornerstone', sublabel: 'First letter', value: advanced.cornerstone },
          { label: 'First Vowel', sublabel: 'Soul entry point', value: advanced.firstVowel },
          { label: 'Capstone', sublabel: 'Last letter', value: advanced.capstone },
        ].map(({ label, sublabel, value }) => (
          <div key={label} className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <p className="text-[9px] font-black tracking-widest uppercase text-slate-500 mb-1">{label}</p>
            <p className="text-4xl font-black text-white">{value || '–'}</p>
            <p className="text-[9px] text-slate-600 mt-1">{sublabel}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
