'use client'

import { useState } from 'react'
import { calculate, CORE_DESCRIPTIONS } from '@/lib/numerology'
import type { NumerologyResult } from '@/lib/numerology'
import { calcDestinyMatrix } from '@/lib/destinyMatrix'
import type { DestinyMatrixResult } from '@/lib/destinyMatrix'
import BirthDateInput from '@/components/BirthDateInput'
import NumberCard from '@/components/NumberCard'
import RadarChart from '@/components/RadarChart'
import LifePhaseCircle from '@/components/LifePhaseCircle'
import EsotericMatrix from '@/components/EsotericMatrix'
import ArcanaGrid from '@/components/ArcanaGrid'
import ChakraDisplay from '@/components/ChakraDisplay'
import PurposeDisplay from '@/components/PurposeDisplay'
import PrognosisDisplay from '@/components/PrognosisDisplay'
import MatrixSummary from '@/components/MatrixSummary'
import InterpretationAccordion from '@/components/InterpretationAccordion'
import { getArcana } from '@/lib/arcana'

type Tab = 'matrix' | 'numerology'

const CARD_COLORS: Record<string, string> = {
  lifePath: '#4C1D95',       // Amethyst
  expression: '#1E3A8A',    // Sapphire
  soulUrge: '#831843',      // Deep Rose
  personality: '#064E3B',   // Jade
  birthDayNumber: '#854D0E', // Amber
  maturityNumber: '#9A3412', // Tiger's Eye
}

export default function Home() {
  const [dateStr, setDateStr] = useState('')
  const [name, setName] = useState('')
  const [numResult, setNumResult] = useState<NumerologyResult | null>(null)
  const [matResult, setMatResult] = useState<DestinyMatrixResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('matrix')
  const [calcKey, setCalcKey] = useState(0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const parts = dateStr.split('/')
      if (parts.length !== 3) {
        setError('Enter date as DD/MM/YYYY (e.g. 24/03/1990).')
        setLoading(false)
        return
      }
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)

      const nr = calculate(dateStr, name)
      const mr = calcDestinyMatrix(day, month, year)

      if (!nr || !mr) {
        setError('Invalid date. Please enter DD/MM/YYYY.')
        setLoading(false)
        return
      }

      setCalcKey(k => k + 1)
      setNumResult(nr)
      setMatResult(mr)
      setLoading(false)
    }, 350)
  }

  const hasResults = numResult && matResult

  return (
    <main className="min-h-screen px-4 py-14 md:py-20">

      {/* ── Hero ── */}
      <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10
                        text-[10px] tracking-widest uppercase text-slate-500 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse-slow" />
          Numerology · Destiny Matrix · Arcana
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          <span className="text-white">Cosmic Love</span>{' '}
          <span style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Matrix
          </span>
        </h1>

        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Decode the numbers encoded in your birth date. Calculate your Destiny Matrix,
          discover your 22 Arcana positions, chakra alignment, and numerology life chart.
        </p>
      </div>

      {/* ── Input form ── */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto rounded-2xl border border-white/[0.07] bg-bg-card p-6 md:p-8
                   flex flex-col gap-5 mb-10"
      >
        <BirthDateInput value={dateStr} onChange={setDateStr} />

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-slate-500">
            Full Birth Name{' '}
            <span className="normal-case text-slate-600 tracking-normal font-normal">
              (optional — for Expression, Soul Urge & Personality)
            </span>
          </label>
          <input
            type="text"
            placeholder="e.g. John William Smith"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-bg-elevated border border-white/[0.08] rounded-xl
                       px-4 py-3 text-white placeholder-slate-600 text-sm outline-none
                       transition-all duration-200
                       focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
          />
        </div>

        {error && (
          <p className="text-challenge text-xs flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
            </svg>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || dateStr.length < 10}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide
                     text-white transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            boxShadow: '0 4px 28px rgba(124,58,237,0.3)',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Calculating...
            </span>
          ) : (
            'Reveal Your Matrix'
          )}
        </button>
      </form>

      {/* ── Results ── */}
      {hasResults && (
        <div key={calcKey} className="max-w-6xl mx-auto flex flex-col gap-8">

          {/* Tab navigation */}
          <div className="flex justify-center">
            <div className="flex gap-1 p-1 rounded-xl border border-white/[0.07] bg-bg-card">
              {([
                { key: 'matrix', label: 'Destiny Matrix' },
                { key: 'numerology', label: 'Numerology Chart' },
              ] as { key: Tab; label: string }[]).map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="px-5 py-2 rounded-lg text-xs font-semibold tracking-wide
                             transition-all duration-200"
                  style={{
                    background: tab === t.key ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'transparent',
                    color: tab === t.key ? '#fff' : '#64748b',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* TAB: DESTINY MATRIX                                                */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {tab === 'matrix' && (
            <div className="flex flex-col gap-6 animate-fade-up">
              {/* Octagram Section - Full Width & Centered (TOP) */}
              <div className="animate-fade-up flex flex-col items-center">
                <SectionLabel>The Octagram</SectionLabel>
                <EsotericMatrix result={matResult} className="max-w-5xl" />
              </div>


              {/* Core Cards Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Comfort Zone', value: matResult.points.E.number, color: '#854D0E' },
                  { label: 'Soul/Day', value: matResult.points.A.number, color: '#4C1D95' },
                  { label: 'Karmic Tail', value: matResult.points.D.number, color: '#7F1D1D' },
                  { label: `Year ${new Date().getFullYear()}`, value: matResult.personalYear, color: '#A16207' },
                ].map(({ label, value, color }) => (
                  <div key={label}
                    className="rounded-xl border border-white/[0.07] bg-bg-card px-5 py-4 flex flex-col gap-1">
                    <span className="text-[12px] font-bold tracking-widest uppercase"
                      style={{ color }}>{label}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold" style={{ color }}>{value}</span>
                      <span className="text-sm text-slate-500 font-medium">{getArcana(value).name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-8">
                {/* Chakra Alignment Section */}
                <div className="animate-fade-up">
                  <SectionLabel>Esoteric Chakra Map (Energy Proportions)</SectionLabel>
                  <ChakraDisplay result={matResult} />
                </div>

                {/* Arcana grid */}
                <div className="animate-fade-up">
                  <SectionLabel>Key Points & Evolutionary Arcs</SectionLabel>
                  <Card>
                    <ArcanaGrid result={matResult} />
                  </Card>
                </div>

                {/* New Purpose Display */}
                <PurposeDisplay result={matResult} />

                {/* Prognosis of Life */}
                <PrognosisDisplay result={matResult} />

                <div className="w-full h-px bg-white/[0.08] my-12" />

                {/* Summary of the Matrix */}
                <MatrixSummary result={matResult} />

                <div className="w-full h-px bg-white/[0.08] my-12" />

                {/* Analysis & Interpretation */}
                <InterpretationAccordion result={matResult} />
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* TAB: NUMEROLOGY CHART                                               */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {tab === 'numerology' && (
            <div className="flex flex-col gap-8 animate-fade-up">

              {/* Core Numbers */}
              <section>
                <SectionLabel>Core Numbers</SectionLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 stagger">
                  {numResult && (Object.entries(CORE_DESCRIPTIONS) as Array<[keyof typeof CORE_DESCRIPTIONS, typeof CORE_DESCRIPTIONS[keyof typeof CORE_DESCRIPTIONS]]>)
                    .map(([key, meta]) => (
                      <NumberCard
                        key={key}
                        label={meta.label}
                        value={numResult.core[key]}
                        tooltip={meta.tooltip}
                        color={CARD_COLORS[key]}
                      />
                    ))
                  }
                </div>
              </section>

              {/* Radar + Life Phase Circle */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card><RadarChart core={numResult.core} /></Card>
                <Card><LifePhaseCircle result={numResult} /></Card>
              </div>

              {/* Pinnacles & Right column */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <SectionLabel>Pinnacle Cycles</SectionLabel>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    The main energy themes of each major life phase.
                  </p>
                  <div className="flex flex-col gap-2">
                    {numResult.pinnacles.map((p, i) => (
                      <div key={i}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 border transition-all"
                        style={{
                          borderColor: p.isActive ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.06)',
                          background: p.isActive ? 'rgba(251,191,36,0.06)' : 'transparent',
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center
                                        font-bold text-sm shrink-0"
                          style={{
                            background: 'rgba(251,191,36,0.1)', color: '#fbbf24',
                            border: '1px solid rgba(251,191,36,0.2)'
                          }}>
                          {p.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-slate-300">{p.label}</div>
                          <div className="text-[10px] text-slate-600">
                            Age {p.startAge} – {p.endAge >= 100 ? '∞' : p.endAge}
                          </div>
                        </div>
                        {p.isActive && (
                          <span className="text-[9px] font-bold tracking-widest uppercase
                                           text-pinnacle bg-pinnacle/10 border border-pinnacle/20
                                           px-2 py-0.5 rounded-full shrink-0">
                            active
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex flex-col gap-6">
                  <Card>
                    <SectionLabel>Challenges</SectionLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {numResult.challenges.map((c, i) => (
                        <div key={i} className="rounded-xl border border-white/[0.06] p-3 flex flex-col gap-1">
                          <span className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold">
                            {['1st', '2nd', '3rd', '4th'][i]} Challenge
                          </span>
                          <span className="text-2xl font-bold text-challenge">{c}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card>
                    <SectionLabel>Life Cycles</SectionLabel>
                    <div className="flex flex-col gap-2">
                      {numResult.lifeCycles.map((c, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl
                                                 border border-white/[0.06] px-4 py-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center
                                          font-bold text-sm shrink-0"
                            style={{
                              background: 'rgba(52,211,153,0.1)', color: '#34d399',
                              border: '1px solid rgba(52,211,153,0.2)'
                            }}>
                            {c.number}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-slate-300">{c.label}</div>
                            <div className="text-[10px] text-slate-600">
                              Age {c.startAge} – {c.endAge >= 100 ? '∞' : c.endAge}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Life Phase Table */}
              <Card>
                <SectionLabel>Life Phase Breakdown (Ages 0–70)</SectionLabel>
                <div className="overflow-x-auto -mx-1">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {['Age', 'Pinnacle', 'Challenge', 'Life Cycle'].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-[12px] font-bold
                                                  tracking-widest uppercase text-slate-500">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {numResult.lifePhasePoints.map(p => (
                        <tr key={p.age}
                          className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-400 text-base">{p.age}</td>
                          <td className="py-3 px-4"><span className="font-bold text-pinnacle text-base">{p.pinnacle}</span></td>
                          <td className="py-3 px-4"><span className="font-bold text-challenge text-base">{p.challenge}</span></td>
                          <td className="py-3 px-4"><span className="font-bold text-cycle text-base">{p.cycle}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          <p className="text-center text-[10px] text-slate-700 pb-8">
            Destiny Matrix uses the 22 Major Arcana (Pythagorean tradition). Numerology uses
            the standard Pythagorean system with master numbers 11, 22 and 33 preserved.
          </p>
        </div>
      )}
    </main>
  )
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-6 animate-fade-up">
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[13px] font-bold tracking-widest uppercase text-slate-400 mb-6">
      {children}
    </h2>
  )
}
