'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
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
import DailyHoroscope from '@/components/DailyHoroscope'
import TarotReading from '@/components/TarotReading'
import EvolutionSection from '@/components/EvolutionSection'
import NatalChartWheel from '@/components/NatalChartWheel'
import NatalChartTable from '@/components/NatalChartTable'
import NatalInterpretation from '@/components/NatalInterpretation'
import NatalReadings from '@/components/NatalReadings'
import CurrentSkyInterpretation from '@/components/CurrentSkyInterpretation'
import ChineseAstrology from '@/components/ChineseAstrology'
import VedicAstrology from '@/components/VedicAstrology'
import { calcNatalChart, isDST } from '@/lib/astrology'
import type { NatalChartData } from '@/lib/astrology'
import BirthPlaceInput from '@/components/BirthPlaceInput'
import type { PlaceSelection } from '@/components/BirthPlaceInput'
import { CORE_DESCRIPTIONS } from '@/lib/numerology'

import { useAuth } from '@/components/auth/AuthProvider'

type Tab = 'matrix' | 'deck' | 'numerology' | 'natal' | 'horoscope' | 'chinese' | 'vedic'

export default function Home() {
  const { profile } = useAuth()

  const [dateStr, setDateStr] = useState('')
  const [name, setName] = useState('')
  const [numResult, setNumResult] = useState<NumerologyResult | null>(null)
  const [matResult, setMatResult] = useState<DestinyMatrixResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('matrix')
  const [calcKey, setCalcKey] = useState(0)
  // Whether results were auto-loaded from saved profile (hides the input form)
  const [autoLoaded, setAutoLoaded] = useState(false)

  // Natal chart extra fields
  const [birthTime, setBirthTime] = useState('')
  const [birthPlace, setBirthPlace] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<PlaceSelection | null>(null)
  const [natalData, setNatalData] = useState<NatalChartData | null>(null)
  const [natalMeta, setNatalMeta] = useState<{ ut: string; lst: string; lat: string; lon: string; tz: string } | null>(null)

  // ─── Auto-load from saved profile ──────────────────────────────────────
  const profileLoadedRef = useRef(false)
  useEffect(() => {
    if (profileLoadedRef.current || !profile?.birth_date) return
    profileLoadedRef.current = true

    const [yyyy, mm, dd] = profile.birth_date.split('-').map(Number)
    const birthDateStr = `${String(dd).padStart(2, '0')}/${String(mm).padStart(2, '0')}/${yyyy}`
    const birthName = profile.birth_name || profile.display_name || ''

    setDateStr(birthDateStr)
    setName(birthName)

    // Numerology
    const nr = calculate(birthDateStr, birthName)
    const mr = calcDestinyMatrix(dd, mm, yyyy)
    if (nr) setNumResult(nr)
    if (mr) setMatResult(mr)

    // Birth time & place
    if (profile.birth_time) {
      setBirthTime(profile.birth_time.slice(0, 5))
    }
    if (profile.birth_place) {
      setBirthPlace(profile.birth_place)
    }
    if (profile.birth_lat != null && profile.birth_lon != null) {
      const place: PlaceSelection = {
        display: profile.birth_place || '',
        lat: profile.birth_lat,
        lon: profile.birth_lon,
        country: '',
        tz: profile.birth_tz || 1,
      }
      setSelectedPlace(place)

      // Natal chart
      const hour = profile.birth_time ? parseInt(profile.birth_time.split(':')[0], 10) : 12
      const min = profile.birth_time ? parseInt(profile.birth_time.split(':')[1], 10) : 0
      let utcOff = place.tz
      if (isDST(yyyy, mm, dd, place.tz)) utcOff = place.tz + 1

      const natal = calcNatalChart(dd, mm, yyyy, hour, min, place.lat, place.lon, utcOff)
      setNatalData(natal)

      // Metadata
      const utHour = hour - utcOff
      const utDate = new Date(Date.UTC(yyyy, mm - 1, dd, utHour, min, 0))
      const utStr = `${utDate.getUTCDate().toString().padStart(2, '0')}/${(utDate.getUTCMonth() + 1).toString().padStart(2, '0')}/${utDate.getUTCFullYear()} ${utDate.getUTCHours().toString().padStart(2, '0')}:${utDate.getUTCMinutes().toString().padStart(2, '0')} UT`
      const lstDeg = ((natal.ascendantLongitude + 90) % 360)
      const lstH = Math.floor(lstDeg / 15)
      const lstM = Math.floor((lstDeg / 15 - lstH) * 60)
      const latStr = `${Math.abs(place.lat).toFixed(2)}°${place.lat >= 0 ? 'N' : 'S'}`
      const lonStr = `${Math.abs(place.lon).toFixed(2)}°${place.lon >= 0 ? 'E' : 'W'}`
      const tzSign = utcOff >= 0 ? '+' : ''
      setNatalMeta({ ut: utStr, lst: `${lstH.toString().padStart(2, '0')}:${lstM.toString().padStart(2, '0')}`, lat: latStr, lon: lonStr, tz: `UTC${tzSign}${utcOff}` })
    }

    setCalcKey(k => k + 1)
    setAutoLoaded(true)
  }, [profile])

  // Chart wheel mode:
  //   'natal'    = birth chart only
  //   'transits' = bi-wheel: natal + current sky at the user's actual location, with cross aspects
  const [chartMode, setChartMode] = useState<'natal' | 'transits'>('natal')
  const [nowTick, setNowTick] = useState(0)

  // Geolocation state for 'transits' mode
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; label: string } | null>(null)
  const [geoModalOpen, setGeoModalOpen] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  // Refresh transit chart every 60s while it's the active view
  useEffect(() => {
    if (chartMode !== 'transits' || tab !== 'natal') return
    const id = setInterval(() => setNowTick(t => t + 1), 60_000)
    return () => clearInterval(id)
  }, [chartMode, tab])

  // Transit chart: current sky above the user's actual location.
  // Timezone offset is approximated from longitude (no DST / political TZ),
  // which is accurate enough for chart calculation and display.
  const transitData = useMemo<NatalChartData | null>(() => {
    if (chartMode !== 'transits' || !userLocation) return null
    void nowTick
    const now = new Date()
    const approxOffset = Math.round(userLocation.lon / 15)
    const local = new Date(now.getTime() + approxOffset * 3600_000)
    return calcNatalChart(
      local.getUTCDate(),
      local.getUTCMonth() + 1,
      local.getUTCFullYear(),
      local.getUTCHours(),
      local.getUTCMinutes(),
      userLocation.lat,
      userLocation.lon,
      approxOffset,
    )
  }, [chartMode, userLocation, nowTick])

  const transitStamp = useMemo(() => {
    if (chartMode !== 'transits' || !userLocation) return null
    void nowTick
    const now = new Date()
    const approxOffset = Math.round(userLocation.lon / 15)
    const local = new Date(now.getTime() + approxOffset * 3600_000)
    const dd = String(local.getUTCDate()).padStart(2, '0')
    const mm = String(local.getUTCMonth() + 1).padStart(2, '0')
    const yyyy = local.getUTCFullYear()
    const hh = String(local.getUTCHours()).padStart(2, '0')
    const mi = String(local.getUTCMinutes()).padStart(2, '0')
    const sign = approxOffset >= 0 ? '+' : ''
    return `${dd}/${mm}/${yyyy} ${hh}:${mi} (UT${sign}${approxOffset})`
  }, [chartMode, userLocation, nowTick])

  // ─── Geolocation handlers ────────────────────────────────────────────────
  function requestGeolocation() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.')
      return
    }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          label: 'Your location',
        })
        setGeoLoading(false)
        setGeoModalOpen(false)
        setChartMode('transits')
      },
      (err) => {
        setGeoLoading(false)
        if (err.code === 1) {
          setGeoError('Permission denied. You can use Rome as a fallback.')
        } else if (err.code === 2) {
          setGeoError('Position unavailable. Try again or use Rome.')
        } else if (err.code === 3) {
          setGeoError('Request timed out. Try again or use Rome.')
        } else {
          setGeoError('Could not get your location.')
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600_000 },
    )
  }

  function useRomeFallback() {
    setUserLocation({ lat: 41.9028, lon: 12.4964, label: 'Rome (fallback)' })
    setGeoModalOpen(false)
    setGeoError(null)
    setChartMode('transits')
  }

  function handleTransitsClick() {
    if (userLocation) {
      setChartMode('transits')
    } else {
      setGeoError(null)
      setGeoModalOpen(true)
    }
  }

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
      {/* ── Hero + Input form (hidden when auto-loaded from profile) ── */}
      {!autoLoaded && (
        <>
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
        </>
      )}

      {/* ── Tab navigation (always visible) ── */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Tab navigation */}
        <TabNav tab={tab} setTab={setTab} />

        {tab === 'deck' && (
          <div className="animate-fade-up">
            <DeckGallery />
          </div>
        )}

        {tab === 'chinese' && (
          <div key={`chinese-${calcKey}`} className="animate-fade-up">
            <ChineseAstrology dateStr={dateStr} birthTime={birthTime} />
          </div>
        )}

        {tab === 'vedic' && (
          <div key={`vedic-${calcKey}`} className="animate-fade-up">
            <VedicAstrology natal={natalData} dateStr={dateStr} birthTime={birthTime} />
          </div>
        )}

        {tab === 'horoscope' && (
          <div className="flex flex-col gap-10 animate-fade-up">
            <div className="text-center flex flex-col gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Daily <span className="text-accent-purple">Horoscope</span>
              </h2>
              <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
                No sugarcoating. Your sign, your day, the truth.
              </p>
            </div>
            <div className="max-w-2xl mx-auto w-full">
              <DailyHoroscope birthDate={dateStr} />
            </div>
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
                  {chartMode === 'transits' && transitStamp && userLocation && (
                    <p className="text-[9px] text-accent-purple/80 font-mono mt-1">
                      Transits · {transitStamp} · from {userLocation.label} ({userLocation.lat.toFixed(2)}°, {userLocation.lon.toFixed(2)}°)
                    </p>
                  )}
                </div>

                {/* Natal / Transits toggle */}
                <div className="flex justify-center">
                  <div className="inline-flex rounded-xl border border-white/[0.1] bg-white/[0.04] p-0.5">
                    {(['natal', 'transits'] as const).map(m => {
                      const isActive = chartMode === m
                      const label = m === 'natal' ? 'Natal' : 'Transits'
                      return (
                        <button
                          key={m}
                          onClick={() => {
                            if (m === 'transits') handleTransitsClick()
                            else setChartMode(m)
                          }}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                            ${isActive
                              ? 'bg-white/[0.1] text-white'
                              : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {chartMode === 'natal' ? (
                  <>
                    <div className="flex flex-col items-center">
                      <NatalChartWheel data={natalData} />
                    </div>
                    <NatalReadings data={natalData} />
                    <NatalChartTable data={natalData} />
                    <NatalInterpretation data={natalData} />

                    {/* Lunar Cycles & Personal Transits */}
                    <section className="flex flex-col gap-8">
                      <SectionLabel>Lunar Cycles & Personal <span className="text-accent-purple">Transits</span></SectionLabel>
                      <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-7 animate-fade-up shadow-xl shadow-black/30">
                        <LunarCycles result={numResult!} />
                      </div>
                    </section>
                  </>
                ) : (
                  <>
                    {/* Bi-wheel: natal + current transits, with cross aspects */}
                    <div className="flex flex-col items-center">
                      <NatalChartWheel data={natalData} transitData={transitData ?? undefined} />
                    </div>
                    {transitData && (
                      <CurrentSkyInterpretation natalData={natalData} transitData={transitData} />
                    )}
                  </>
                )}
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


              {/* SECTION 7: TRANSITS */}
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

      {/* Geolocation permission modal (Sky mode) */}
      {geoModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => { if (!geoLoading) { setGeoModalOpen(false); setGeoError(null) } }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-md w-full rounded-2xl border border-white/[0.1] bg-[#0f0f1e] p-6 shadow-2xl shadow-black/60 animate-fade-up"
          >
            <h3 className="text-lg font-bold text-white mb-2">See your live transits?</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              To compute how the current sky is touching your natal chart, the app needs your location.
              Your browser will show a native permission prompt — the position is used only locally and never leaves your device.
              Without your location, transits would be a generic horoscope rather than a personal one.
            </p>
            {geoError && (
              <p className="text-[11px] text-red-400/90 mb-4 px-3 py-2 rounded-lg bg-red-500/[0.06] border border-red-500/20">
                {geoError}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <button
                onClick={requestGeolocation}
                disabled={geoLoading}
                className="px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide text-white
                           bg-gradient-to-br from-violet-600 to-indigo-600 hover:opacity-90
                           disabled:opacity-50 transition-all"
              >
                {geoLoading ? 'Asking your browser…' : 'Use my location'}
              </button>
              <button
                onClick={useRomeFallback}
                disabled={geoLoading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-slate-300
                           border border-white/[0.1] hover:bg-white/[0.05] transition-all"
              >
                Use Rome instead
              </button>
              <button
                onClick={() => { setGeoModalOpen(false); setGeoError(null) }}
                disabled={geoLoading}
                className="text-[10px] text-slate-500 hover:text-slate-400 mt-1 self-center"
              >
                Cancel
              </button>
            </div>
          </div>
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
    <h2 className="text-3xl font-bold tracking-tight text-white text-center mb-4 stagger">
      {children}
    </h2>
  )
}

// ─── Tab definitions ────────────────────────────────────────────────────────

const TAB_DEFS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'matrix', label: 'Matrix', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="8.5" x2="22" y2="15.5" />
      <line x1="22" y1="8.5" x2="2" y2="15.5" />
    </svg>
  )},
  { key: 'deck', label: 'Deck', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="5" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="19" />
      <line x1="7" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="17" y2="12" />
    </svg>
  )},
  { key: 'numerology', label: 'Numbers', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )},
  { key: 'natal', label: 'Chart', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
  { key: 'horoscope', label: 'Horoscope', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a7 7 0 0 1 0 14 7 7 0 0 1 0-14" />
      <circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <path d="M8 16l2-3h4l2 3" />
    </svg>
  )},
  { key: 'chinese', label: 'Bazi', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )},
  { key: 'vedic', label: 'Vedic', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" />
      <line x1="3" y1="3" x2="21" y2="21" />
      <line x1="21" y1="3" x2="3" y2="21" />
      <polygon points="12,3 21,12 12,21 3,12" />
    </svg>
  )},
]

const VISIBLE_COUNT = 3 // tabs visible on mobile before overflow menu

function TabNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const visibleTabs = TAB_DEFS.slice(0, VISIBLE_COUNT)
  const overflowTabs = TAB_DEFS.slice(VISIBLE_COUNT)
  const activeOverflow = overflowTabs.find(t => t.key === tab)

  return (
    <div className="flex justify-center mb-4">
      <div className="flex gap-1 p-1.5 rounded-2xl border border-white/[0.07] bg-bg-card">
        {/* Always-visible tabs */}
        {visibleTabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex flex-col items-center gap-1 px-4 sm:px-5 py-2 rounded-xl transition-all duration-200"
            style={{
              background: tab === key ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'transparent',
              color: tab === key ? '#fff' : '#64748b',
            }}
          >
            {icon}
            <span className="text-[7px] sm:text-[8px] font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase">{label}</span>
          </button>
        ))}

        {/* Astrology overflow menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
            style={{
              background: activeOverflow ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'transparent',
              color: activeOverflow ? '#fff' : '#64748b',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M4.93 19.07l1.41-1.41" />
              <path d="M17.66 6.34l1.41-1.41" />
            </svg>
            <span className="text-[7px] font-black tracking-[0.15em] uppercase flex items-center gap-1">
              Astrology
              <svg width="8" height="8" viewBox="0 0 8 8" className="opacity-60">
                <path d="M1.5 3 L4 5.5 L6.5 3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 min-w-[160px] rounded-xl border border-white/[0.07] bg-bg-card shadow-2xl shadow-black/50 overflow-hidden animate-fade-up">
              {overflowTabs.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => { setTab(key); setMenuOpen(false) }}
                  className="flex items-center gap-3 w-full px-4 py-3 transition-all duration-150 text-left"
                  style={{
                    background: tab === key ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: tab === key ? '#fff' : '#94a3b8',
                  }}
                >
                  {icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
