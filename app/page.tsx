'use client'

import { useState } from 'react'
import { calculate } from '@/lib/numerology'
import type { NumerologyResult } from '@/lib/numerology'
import { calcDestinyMatrix } from '@/lib/destinyMatrix'
import type { DestinyMatrixResult } from '@/lib/destinyMatrix'
import BirthDateInput from '@/components/BirthDateInput'
import RadarChart from '@/components/RadarChart'
import EsotericMatrix from '@/components/EsotericMatrix'
import ArcanaGrid from '@/components/ArcanaGrid'
import ChakraDisplay from '@/components/ChakraDisplay'
import PurposeDisplay from '@/components/PurposeDisplay'
import PrognosisDisplay from '@/components/PrognosisDisplay'
import MatrixSummary from '@/components/MatrixSummary'
import InterpretationAccordion from '@/components/InterpretationAccordion'
import { getArcana } from '@/lib/arcana'

// New Numerology Components
import LetterAnalysis from '@/components/LetterAnalysis'
import PinnacleTimeline from '@/components/PinnacleTimeline'
import ChallengeGrid from '@/components/ChallengeGrid'
import TransitTable from '@/components/TransitTable'
import CoreBlueprint from '@/components/CoreBlueprint'
import IntensityAnalysis from '@/components/IntensityAnalysis'
import ActionPlan from '@/components/ActionPlan'
import NumberCard from '@/components/NumberCard'
import { CORE_DESCRIPTIONS } from '@/lib/numerology'

type Tab = 'matrix' | 'numerology'

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
    <main className="min-h-screen px-4 py-14 md:py-20 bg-bg-primary text-white">
      {/* ── Hero ── */}
      <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10
                        text-[10px] tracking-widest uppercase text-slate-500 mb-6 font-bold">
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

        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed text-sm font-medium">
          Decode the numbers encoded in your birth date. Calculate your Destiny Matrix,
          discover your 22 Arcana positions, chakra alignment, and numerology life chart.
        </p>
      </div>

      {/* ── Input form ── */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto rounded-2xl border border-white/[0.07] bg-bg-card p-6 md:p-8
                   flex flex-col gap-5 mb-10 shadow-2xl shadow-purple-950/20"
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
            className="w-full bg-[#1f2937] border border-white/[0.08] rounded-xl
                       px-4 py-3 text-white placeholder-slate-600 text-sm outline-none
                       transition-all duration-200
                       focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs flex items-center gap-1.5">
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
          {loading ? 'Calculating...' : 'Reveal Your Matrix'}
        </button>
      </form>

      {/* ── Results ── */}
      {hasResults && matResult && numResult && (
        <div key={calcKey} className="max-w-6xl mx-auto flex flex-col gap-8">

          {/* Tab navigation */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-1 p-1 rounded-xl border border-white/[0.07] bg-bg-card">
              {(['matrix', 'numerology'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase
                             transition-all duration-200"
                  style={{
                    background: tab === t ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'transparent',
                    color: tab === t ? '#fff' : '#64748b',
                  }}
                >
                  {t === 'matrix' ? 'Destiny Matrix' : 'Numerology Chart'}
                </button>
              ))}
            </div>
          </div>

          {tab === 'matrix' ? (
            <div className="flex flex-col gap-10 animate-fade-up">
              {/* Octagram Section */}
              <div className="flex flex-col items-center">
                <SectionLabel>The Octagram</SectionLabel>
                <EsotericMatrix result={matResult} className="max-w-5xl" />
              </div>

              {/* Core Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Comfort Zone', value: matResult.points.E.number, color: '#854D0E' },
                  { label: 'Soul/Day', value: matResult.points.A.number, color: '#4C1D95' },
                  { label: 'Karmic Tail', value: matResult.points.D.number, color: '#7F1D1D' },
                  { label: `Year ${new Date().getFullYear()}`, value: matResult.personalYear, color: '#A16207' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl border border-white/[0.07] bg-bg-card px-5 py-4 shadow-lg shadow-black/20">
                    <span className="text-[10px] font-black tracking-widest uppercase mb-1 block" style={{ color }}>{label}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black" style={{ color }}>{value}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase truncate">{getArcana(value).name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-12">
                <ChakraDisplay result={matResult} />
                <Card><ArcanaGrid result={matResult} /></Card>
                <PurposeDisplay result={matResult} />
                <PrognosisDisplay result={matResult} />
                <MatrixSummary result={matResult} />
                <InterpretationAccordion result={matResult} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-14 animate-fade-up">
              {/* SECTION 1: THE CORE BLUEPRINT */}
              <section className="flex flex-col gap-8">
                <SectionLabel>1. The Oracle's Blueprint</SectionLabel>
                <CoreBlueprint result={numResult} />
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {(Object.keys(numResult.core) as Array<keyof typeof numResult.core>).map(key => (
                    <NumberCard 
                      key={key}
                      label={CORE_DESCRIPTIONS[key].label}
                      value={numResult.core[key]}
                      tooltip={CORE_DESCRIPTIONS[key].tooltip}
                      color={
                        key === 'lifePath' ? '#7c3aed' :
                        key === 'birthDayNumber' ? '#b45309' :
                        key === 'expression' ? '#2563eb' :
                        key === 'soulUrge' ? '#be123c' :
                        key === 'personality' ? '#047857' : '#ea580c'
                      }
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 2: INTENSITY & KARMA */}
              {name.trim() && (
                <section className="flex flex-col gap-8 animate-fade-up">
                  <SectionLabel>2. Intensity & Karmic Lessons</SectionLabel>
                  <IntensityAnalysis result={numResult} />
                </section>
              )}

              {/* SECTION 3: EVOLUTION */}
              <section className="flex flex-col gap-6">
                <SectionLabel>3. Evolution & Life Cycles</SectionLabel>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <Card>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">The 4 Pinnacles</h3>
                      <PinnacleTimeline pinnacles={numResult.pinnacles} />
                    </Card>
                    <Card>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">The 4 Challenges</h3>
                      <ChallengeGrid challenges={numResult.challenges} />
                    </Card>
                  </div>
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Major Life Cycles</h3>
                      <div className="flex flex-col gap-4">
                        {numResult.lifeCycles.map((c, i) => (
                          <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              {c.number}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-300">{c.label}</div>
                              <div className="text-[10px] text-slate-600 font-mono">Age {c.startAge}-{c.endAge >= 100 ? '∞' : c.endAge}</div>
                            </div>
                          </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-white/[0.05]">
                          <RadarChart core={numResult.core} />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </section>

              {/* SECTION 4: ACTION PLAN */}
              <section className="flex flex-col gap-8">
                <SectionLabel>4. Your Next Moves</SectionLabel>
                <ActionPlan result={numResult} />
              </section>

              {/* SECTION 5: TRANSITS */}
              <section className="flex flex-col gap-6">
                <SectionLabel>5. Current Energy & Annual Transits</SectionLabel>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4">
                    <Card>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/[0.07] pb-3">Today's Alignment</h3>
                      <div className="flex flex-col gap-8 pt-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-400">Personal Year</span>
                          <span className="text-4xl font-black text-white">{numResult.personalDay.year}</span>
                        </div>
                        <div className="flex items-baseline justify-between border-t border-white/[0.03] pt-4">
                          <span className="text-xs text-slate-400">Personal Month</span>
                          <span className="text-2xl font-black text-slate-300">{numResult.personalDay.month}</span>
                        </div>
                        <div className="flex items-baseline justify-between border-t border-white/[0.03] pt-4">
                          <span className="text-xs text-slate-400">Personal Day</span>
                          <span className="text-xl font-bold text-slate-500">{numResult.personalDay.day}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="lg:col-span-8">
                    <Card>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/[0.07] pb-3">Essence Cycle Transits</h3>
                      <TransitTable transits={numResult.essenceCycle} />
                    </Card>
                  </div>
                </div>
              </section>
            </div>
          )}

          <p className="text-center text-[9px] text-slate-700 pb-12 uppercase tracking-[0.3em]">
            Cosmic Love Matrix · Pythagorean Tradition · Premium Numerology Report
          </p>
        </div>
      )}
    </main>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-7 animate-fade-up shadow-xl shadow-black/30">
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[12px] font-black tracking-[0.25em] uppercase text-[#8b5cf6]/90 mb-4 stagger">
      {children}
    </h2>
  )
}
