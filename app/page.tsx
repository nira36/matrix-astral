'use client'

import { useState } from 'react'
import { calculate, CORE_DESCRIPTIONS } from '@/lib/numerology'
import type { NumerologyResult } from '@/lib/numerology'
import BirthDateInput from '@/components/BirthDateInput'
import NumberCard from '@/components/NumberCard'
import RadarChart from '@/components/RadarChart'
import LifePhaseCircle from '@/components/LifePhaseCircle'

const CARD_COLORS: Record<string, string> = {
  lifePath:      '#8b5cf6',
  expression:    '#60a5fa',
  soulUrge:      '#f472b6',
  personality:   '#34d399',
  birthDayNumber:'#fbbf24',
  maturityNumber:'#fb923c',
}

export default function Home() {
  const [dateStr, setDateStr] = useState('')
  const [name, setName]       = useState('')
  const [result, setResult]   = useState<NumerologyResult | null>(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [key, setKey]         = useState(0)  // for re-animation

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Tiny delay for animation feel
    setTimeout(() => {
      const r = calculate(dateStr, name)
      if (!r) {
        setError('Invalid date. Please enter DD/MM/YYYY format (e.g. 24/03/1990).')
      } else {
        setKey(k => k + 1)
        setResult(r)
      }
      setLoading(false)
    }, 300)
  }

  const coreEntries = result
    ? (Object.entries(CORE_DESCRIPTIONS) as Array<[keyof typeof CORE_DESCRIPTIONS, typeof CORE_DESCRIPTIONS[keyof typeof CORE_DESCRIPTIONS]]>)
    : []

  return (
    <main className="min-h-screen px-4 py-16 md:py-24">
      {/* ── Hero ── */}
      <div className="max-w-3xl mx-auto text-center mb-14 animate-fade-up">
        {/* Decorative star */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/10 mb-6 text-accent-purple">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          <span className="text-white">CosmicLove</span>{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Matrix
          </span>
        </h1>
        <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
          Decode the numbers encoded in your birth date and name. Discover your
          life path, personal strengths, and the cycles shaping your journey.
        </p>
      </div>

      {/* ── Input form ── */}
      <form
        onSubmit={handleSubmit}
        className="
          max-w-md mx-auto rounded-2xl border border-white/[0.07]
          bg-bg-card p-6 md:p-8 flex flex-col gap-5 mb-10
        "
        style={{ animationDelay: '0.1s' }}
      >
        <BirthDateInput value={dateStr} onChange={setDateStr} />

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-slate-500">
            Full Birth Name{' '}
            <span className="normal-case text-slate-600 tracking-normal font-normal">
              (optional — for Expression, Soul Urge &amp; Personality)
            </span>
          </label>
          <input
            type="text"
            placeholder="e.g. John William Smith"
            value={name}
            onChange={e => setName(e.target.value)}
            className="
              w-full bg-bg-elevated border border-white/[0.08] rounded-xl
              px-4 py-3 text-white placeholder-slate-600 text-sm
              outline-none transition-all duration-200
              focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]
            "
          />
        </div>

        {error && (
          <p className="text-challenge text-xs flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              />
            </svg>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || dateStr.length < 10}
          className="
            w-full py-3 px-6 rounded-xl font-semibold text-sm tracking-wide
            transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
            text-white
          "
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            boxShadow: '0 4px 24px rgba(139,92,246,0.25)',
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
            'Calculate Chart'
          )}
        </button>
      </form>

      {/* ── Results ── */}
      {result && (
        <div key={key} className="max-w-5xl mx-auto flex flex-col gap-10">

          {/* Core Numbers Grid */}
          <section>
            <SectionLabel>Core Numbers</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 stagger">
              {coreEntries.map(([key, meta]) => (
                <NumberCard
                  key={key}
                  label={meta.label}
                  value={result.core[key]}
                  tooltip={meta.tooltip}
                  color={CARD_COLORS[key]}
                />
              ))}
            </div>
          </section>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <RadarChart core={result.core} />
            </Card>
            <Card>
              <LifePhaseCircle result={result} />
            </Card>
          </div>

          {/* Pinnacles & Challenges */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pinnacles */}
            <Card>
              <SectionLabel>Pinnacle Cycles</SectionLabel>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Pinnacles are the main energy themes of each major life phase.
              </p>
              <div className="flex flex-col gap-2">
                {result.pinnacles.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 border transition-all"
                    style={{
                      borderColor: p.isActive ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.06)',
                      background:  p.isActive ? 'rgba(251,191,36,0.06)' : 'transparent',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                      style={{
                        background: 'rgba(251,191,36,0.1)',
                        color: '#fbbf24',
                        border: '1px solid rgba(251,191,36,0.2)',
                      }}
                    >
                      {p.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-300">{p.label}</div>
                      <div className="text-[10px] text-slate-600">
                        Age {p.startAge} – {p.endAge >= 100 ? '∞' : p.endAge}
                      </div>
                    </div>
                    {p.isActive && (
                      <span className="text-[9px] font-bold tracking-widest uppercase text-pinnacle bg-pinnacle/10 border border-pinnacle/20 px-2 py-0.5 rounded-full shrink-0">
                        active
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Challenges + Life Cycles */}
            <div className="flex flex-col gap-6">
              <Card>
                <SectionLabel>Challenges</SectionLabel>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Lessons and obstacles to overcome in each phase.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {result.challenges.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/[0.06] p-3 flex flex-col gap-1"
                    >
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
                  {result.lifeCycles.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                        style={{
                          background: 'rgba(52,211,153,0.1)',
                          color: '#34d399',
                          border: '1px solid rgba(52,211,153,0.2)',
                        }}
                      >
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
            <p className="text-xs text-slate-500 mb-4">
              The dominant numbers active at each decade of life.
            </p>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Age', 'Pinnacle', 'Challenge', 'Life Cycle'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-[10px] font-semibold tracking-widest uppercase text-slate-600">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.lifePhasePoints.map(p => (
                    <tr key={p.age} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{p.age}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-pinnacle">{p.pinnacle}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-challenge">{p.challenge}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-cycle">{p.cycle}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Footer */}
          <p className="text-center text-[10px] text-slate-700 pb-8">
            Calculations use the Pythagorean numerology system. Master numbers 11, 22 and 33 are preserved.
          </p>
        </div>
      )}
    </main>
  )
}

// ─── Small reusable layout helpers ───────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-6 animate-fade-up">
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-4">
      {children}
    </h2>
  )
}
