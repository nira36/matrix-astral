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
import PinnacleTimeline from '@/components/PinnacleTimeline'
import ChallengeGrid from '@/components/ChallengeGrid'
import TransitTable from '@/components/TransitTable'
import CoreBlueprint from '@/components/CoreBlueprint'
import IntensityAnalysis from '@/components/IntensityAnalysis'
import ActionPlan from '@/components/ActionPlan'
import NumberCard from '@/components/NumberCard'
import AdvancedNumerology from '@/components/AdvancedNumerology'
import GematriaCalculator from '@/components/GematriaCalculator'
import LunarCycles from '@/components/LunarCycles'
import DeckGallery from '@/components/DeckGallery'
import TarotReading from '@/components/TarotReading'
import EvolutionSection from '@/components/EvolutionSection'
import NatalChartWheel from '@/components/NatalChartWheel'
import NatalChartTable from '@/components/NatalChartTable'
import NatalInterpretation from '@/components/NatalInterpretation'
import NatalReadings from '@/components/NatalReadings'
import { calcNatalChart, isDST } from '@/lib/astrology'
import type { NatalChartData } from '@/lib/astrology'
import BirthPlaceInput from '@/components/BirthPlaceInput'
import type { PlaceSelection } from '@/components/BirthPlaceInput'
import { CORE_DESCRIPTIONS } from '@/lib/numerology'

type Tab = 'matrix' | 'deck' | 'numerology' | 'natal'

export default function Home() {
  const [dateStr, setDateStr] = useState('')
  const [name, setName] = useState('')
  const [numResult, setNumResult] = useState<NumerologyResult | null>(null)
  const [matResult, setMatResult] = useState<DestinyMatrixResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('matrix')
  const [calcKey, setCalcKey] = useState(0)

  // Natal chart extra fields
  const [birthTime, setBirthTime] = useState('')
  const [birthPlace, setBirthPlace] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<PlaceSelection | null>(null)
  const [natalData, setNatalData] = useState<NatalChartData | null>(null)
  const [natalMeta, setNatalMeta] = useState<{ ut: string; lst: string; lat: string; lon: string; tz: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

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

    // Parse birth time for natal chart
    let hour = 12, min = 0
    if (birthTime) {
      const tp = birthTime.split(':')
      hour = parseInt(tp[0], 10) || 12
      min = parseInt(tp[1], 10) || 0
    }

    // Use selected place coordinates or default to Rome
    let lat = 41.9028, lon = 12.4964, baseTz = 1
    if (selectedPlace) {
      lat = selectedPlace.lat
      lon = selectedPlace.lon
      baseTz = selectedPlace.tz
    }

    // Compute UTC offset (base tz + DST correction)
    let utcOff = baseTz
    if (isDST(year, month, day, baseTz)) {
      utcOff = baseTz + 1
    }

    // Compute UT and store metadata
    const utHour = hour - utcOff
    const utMin = min
    const utDate = new Date(Date.UTC(year, month - 1, day, utHour, utMin, 0))
    const utStr = `${utDate.getUTCDate().toString().padStart(2, '0')}/${(utDate.getUTCMonth() + 1).toString().padStart(2, '0')}/${utDate.getUTCFullYear()} ${utDate.getUTCHours().toString().padStart(2, '0')}:${utDate.getUTCMinutes().toString().padStart(2, '0')} UT`

    const natal = calcNatalChart(day, month, year, hour, min, lat, lon, utcOff)

    // Compute LST for display
    const lstDeg = ((natal.ascendantLongitude + 90) % 360) // approximate from ASC
    const lstH = Math.floor(lstDeg / 15)
    const lstM = Math.floor((lstDeg / 15 - lstH) * 60)

    const latStr = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}`
    const lonStr = `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`
    const tzSign = utcOff >= 0 ? '+' : ''

    setCalcKey(k => k + 1)
    setNumResult(nr)
    setMatResult(mr)
    setNatalData(natal)
    setNatalMeta({
      ut: utStr,
      lst: `${lstH.toString().padStart(2, '0')}:${lstM.toString().padStart(2, '0')}`,
      lat: latStr,
      lon: lonStr,
      tz: `UTC${tzSign}${utcOff}`,
    })
    setLoading(false)
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

        {/* Birth time & place (for Natal Chart) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-slate-500">
              Birth Time
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
              className="w-full bg-[#1f2937] border border-white/[0.08] rounded-xl
                         px-4 py-3 text-white placeholder-slate-600 text-sm outline-none
                         transition-all duration-200
                         focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
            />
          </div>
          <BirthPlaceInput
            value={birthPlace}
            onChange={setBirthPlace}
            onSelect={setSelectedPlace}
            selectedPlace={selectedPlace}
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

      {/* ── Tab navigation (always visible) ── */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Tab navigation */}
        <div className="flex justify-center mb-4">
          <div className="flex gap-1 p-1.5 rounded-2xl border border-white/[0.07] bg-bg-card">
            {([
              { key: 'matrix' as Tab, label: 'Matrix', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="8.5" x2="22" y2="15.5" />
                  <line x1="22" y1="8.5" x2="2" y2="15.5" />
                </svg>
              )},
              { key: 'deck' as Tab, label: 'Deck', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="12" y1="5" x2="12" y2="7" />
                  <line x1="12" y1="17" x2="12" y2="19" />
                  <line x1="7" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="17" y2="12" />
                </svg>
              )},
              { key: 'numerology' as Tab, label: 'Numbers', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
                  <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
                  <circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
                  <circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
                </svg>
              )},
              { key: 'natal' as Tab, label: 'Chart', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                  <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
                </svg>
              )},
            ]).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex flex-col items-center gap-1 px-6 py-2.5 rounded-xl
                           transition-all duration-200"
                style={{
                  background: tab === key ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'transparent',
                  color: tab === key ? '#fff' : '#64748b',
                }}
              >
                {icon}
                <span className="text-[8px] font-black tracking-[0.2em] uppercase">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {tab === 'deck' && (
          <div className="animate-fade-up">
            <DeckGallery />
          </div>
        )}


        {tab === 'natal' && hasResults && (
          <div key={`natal-${calcKey}`} className="flex flex-col gap-12 animate-fade-up">
            <div className="text-center flex flex-col gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Natal <span className="text-accent-purple">Chart</span>
              </h2>
              <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
                Your sky at the moment of birth. Planetary positions, house placements, and the geometric relationships that define your psychological architecture.
              </p>
            </div>

            {birthTime && selectedPlace && natalData ? (
              <>
                <div className="flex flex-col gap-1 items-center">
                  <p className="text-[10px] text-slate-500 font-mono">
                    {dateStr} · {birthTime} (locale) · {selectedPlace.display}
                  </p>
                  {natalMeta && (
                    <p className="text-[9px] text-slate-600 font-mono">
                      {natalMeta.ut} · {natalMeta.tz} · Lat {natalMeta.lat} · Lon {natalMeta.lon} · Placidus
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <NatalChartWheel data={natalData} />
                </div>

                <NatalReadings data={natalData} />

                <NatalChartTable data={natalData} />

                <NatalInterpretation data={natalData} />
              </>
            ) : (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-6 text-center max-w-lg mx-auto">
                <p className="text-sm text-amber-400/80 mb-2 font-semibold">Missing Data</p>
                <p className="text-[11px] text-amber-400/60 leading-relaxed">
                  To calculate the natal chart, <strong>birth time</strong> and <strong>birth place</strong> are required. Enter both in the form above and recalculate.
                </p>
              </div>
            )}
          </div>
        )}

        {(tab === 'matrix' || tab === 'numerology') && hasResults && matResult && numResult && (
        <div key={calcKey} className="flex flex-col gap-8">
          {tab === 'matrix' ? (
            <div className="flex flex-col gap-10 animate-fade-up">
              {/* Octagram Section */}
              <div className="flex flex-col items-center">
                <SectionLabel>The <span className="text-accent-purple">Octagram</span></SectionLabel>
                <EsotericMatrix result={matResult} className="max-w-5xl" />
              </div>

              {/* Core Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Comfort Zone', value: matResult.points.E.number, color: '#D97706' },
                  { label: 'Soul/Day', value: matResult.points.A.number, color: '#8B5CF6' },
                  { label: 'Karmic Tail', value: matResult.points.D.number, color: '#EF4444' },
                  { label: `Year ${new Date().getFullYear()}`, value: matResult.personalYear, color: '#F59E0B' },
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
                <InterpretationAccordion result={matResult} />
                <MatrixSummary result={matResult} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-14 animate-fade-up">
              {/* SECTION 1: THE CORE BLUEPRINT */}
              <section className="flex flex-col gap-8">
                <SectionLabel>The Oracle's <span className="text-accent-purple">Blueprint</span></SectionLabel>
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
                  <SectionLabel>Intensity & Karmic <span className="text-accent-purple">Lessons</span></SectionLabel>
                  <IntensityAnalysis result={numResult} />
                </section>
              )}

              {/* SECTION 3: EVOLUTION */}
              <section className="flex flex-col gap-8">
                <SectionLabel>Evolution & Life <span className="text-accent-purple">Cycles</span></SectionLabel>
                <EvolutionSection result={numResult} />
              </section>

              {/* SECTION 4: ACTION PLAN */}
              <section className="flex flex-col gap-8">
                <SectionLabel>Your Next <span className="text-accent-purple">Moves</span></SectionLabel>

                <ActionPlan result={numResult} />
              </section>

              {/* SECTION 5: ADVANCED NUMEROLOGY */}
              <section className="flex flex-col gap-8">
                <SectionLabel>Advanced <span className="text-accent-purple">Numerology</span></SectionLabel>
                <Card>
                  <AdvancedNumerology result={numResult} />
                </Card>
              </section>

              {/* SECTION 6: GEMATRIA */}
              <section className="flex flex-col gap-8">
                <SectionLabel>Gematria · Sacred Word <span className="text-accent-purple">Values</span></SectionLabel>
                <Card>
                  <GematriaCalculator />
                </Card>
              </section>

              {/* SECTION 7: LUNAR CYCLES */}
              <section className="flex flex-col gap-8">
                <SectionLabel>Lunar Cycles & Personal <span className="text-accent-purple">Transits</span></SectionLabel>
                <Card>
                  <LunarCycles result={numResult} />
                </Card>
              </section>

              {/* SECTION 8: TRANSITS */}
              <section className="flex flex-col gap-6">
                <SectionLabel>Current Energy & Annual <span className="text-accent-purple">Transits</span></SectionLabel>
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
        </div>
        )}

        <p className="text-center text-[9px] text-slate-700 pb-12 uppercase tracking-[0.3em]">
          Cosmic Love Matrix · Pythagorean Tradition · Premium Numerology Report
        </p>
      </div>
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
    <h2 className="text-3xl font-bold tracking-tight text-white text-center mb-4 stagger">
      {children}
    </h2>
  )
}
