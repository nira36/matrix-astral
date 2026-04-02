'use client'

import React, { useMemo } from 'react'
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

/** Returns moon age in days (0–29.53) for a given date */
function moonAge(year: number, month: number, day: number): number {
  const jd = julianDay(year, month, day)
  const knownNew = julianDay(2000, 1, 6) // known new moon Jan 6 2000
  const cycle = 29.53058867
  return ((jd - knownNew) % cycle + cycle) % cycle
}

type MoonPhaseName = 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent'

interface MoonPhase {
  name: MoonPhaseName
  emoji: string
  description: string
  numerologyTone: string
}

function getMoonPhase(age: number): MoonPhase {
  if (age < 1.85)  return { name: 'New Moon',        emoji: '🌑', description: 'New beginnings, intention setting.', numerologyTone: 'Initiation' }
  if (age < 7.38)  return { name: 'Waxing Crescent', emoji: '🌒', description: 'Building momentum, taking first steps.', numerologyTone: 'Growth' }
  if (age < 9.22)  return { name: 'First Quarter',   emoji: '🌓', description: 'Decision point, action and challenge.', numerologyTone: 'Challenge' }
  if (age < 14.77) return { name: 'Waxing Gibbous',  emoji: '🌔', description: 'Refinement, trust the process.', numerologyTone: 'Refinement' }
  if (age < 16.61) return { name: 'Full Moon',        emoji: '🌕', description: 'Culmination, illumination, release.', numerologyTone: 'Fulfillment' }
  if (age < 22.15) return { name: 'Waning Gibbous',  emoji: '🌖', description: 'Sharing wisdom, gratitude.', numerologyTone: 'Distribution' }
  if (age < 23.99) return { name: 'Last Quarter',    emoji: '🌗', description: 'Release, letting go, forgiveness.', numerologyTone: 'Release' }
  return               { name: 'Waning Crescent',  emoji: '🌘', description: 'Rest, reflection, surrender.', numerologyTone: 'Surrender' }
}

/** Days to next new moon */
function daysToNextNew(age: number): number {
  return Math.ceil(29.53 - age)
}

/** Days to next full moon */
function daysToNextFull(age: number): number {
  const diff = 14.77 - age
  return diff > 0 ? Math.ceil(diff) : Math.ceil(diff + 29.53)
}

// ─── Personal Day / Month / Year transits ────────────────────────────────────

interface PersonalTransit {
  label: string
  value: number
  description: string
  color: string
}

const TRANSIT_DESCRIPTIONS: Record<number, string> = {
  1: 'New beginnings. Plant seeds, initiate projects.',
  2: 'Cooperation. Nurture relationships, be patient.',
  3: 'Creativity & joy. Express yourself, socialise.',
  4: 'Build & organise. Focus on foundations.',
  5: 'Change & freedom. Expect the unexpected.',
  6: 'Responsibility & love. Serve family & community.',
  7: 'Introspection. Rest, study, go within.',
  8: 'Power & manifestation. Pursue ambitions boldly.',
  9: 'Completion & release. Let go, forgive, conclude.',
  11: 'Spiritual insight. Dreams are vivid, trust intuition.',
  22: 'Master builder energy. Big visions become real.',
  33: 'Compassionate service. Healing is available.',
}

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

  // Personal transits (already in result.personalDay but let's enrich)
  const personalYear  = result.personalDay.year
  const personalMonth = result.personalDay.month
  const personalDay   = result.personalDay.day

  // Next 6 personal days
  const nextDays: { date: string; pd: number }[] = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
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
        pd,
      }
    })
  }, [day, month])

  const transits: PersonalTransit[] = [
    { label: 'Personal Year',  value: personalYear,  description: TRANSIT_DESCRIPTIONS[personalYear]  || '', color: 'text-violet-400' },
    { label: 'Personal Month', value: personalMonth, description: TRANSIT_DESCRIPTIONS[personalMonth] || '', color: 'text-sky-400'    },
    { label: 'Personal Day',   value: personalDay,   description: TRANSIT_DESCRIPTIONS[personalDay]   || '', color: 'text-emerald-400' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Moon at birth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] flex flex-col gap-3">
          <p className="text-[10px] font-black tracking-widest uppercase text-indigo-400">Moon at Birth</p>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{birthPhase.emoji}</span>
            <div>
              <p className="text-lg font-black text-white">{birthPhase.name}</p>
              <p className="text-[11px] text-slate-400">{birthPhase.description}</p>
              <p className="text-[10px] text-indigo-400 font-bold mt-1">Tone: {birthPhase.numerologyTone}</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-600">Moon age at birth: {birthMoonAge.toFixed(1)} days</p>
        </div>

        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] flex flex-col gap-3">
          <p className="text-[10px] font-black tracking-widest uppercase text-blue-400">Moon Today</p>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{todayPhase.emoji}</span>
            <div>
              <p className="text-lg font-black text-white">{todayPhase.name}</p>
              <p className="text-[11px] text-slate-400">{todayPhase.description}</p>
              <p className="text-[10px] text-blue-400 font-bold mt-1">Tone: {todayPhase.numerologyTone}</p>
            </div>
          </div>
          <div className="flex gap-4 text-[10px] text-slate-600">
            <span>Next New Moon: {daysToNextNew(todayMoonAge)} days</span>
            <span>Next Full Moon: {daysToNextFull(todayMoonAge)} days</span>
          </div>
        </div>
      </div>

      {/* Personal transits */}
      <div className="flex flex-col gap-4">
        <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Personal Transits · Now</p>
        <div className="grid grid-cols-3 gap-4">
          {transits.map(t => (
            <div key={t.label} className="flex flex-col gap-2 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <p className="text-[9px] font-black tracking-widest uppercase text-slate-500">{t.label}</p>
              <p className={`text-4xl font-black ${t.color}`}>{t.value}</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">{t.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next 7 personal days */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Personal Days · Next 7 Days</p>
        <div className="grid grid-cols-7 gap-2">
          {nextDays.map(({ date, pd }, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border
                         ${i === 0
                           ? 'border-emerald-500/30 bg-emerald-500/[0.06]'
                           : 'border-white/[0.06] bg-white/[0.02]'}`}
            >
              <p className="text-[8px] text-slate-600 font-mono">{date}</p>
              <p className={`text-xl font-black ${i === 0 ? 'text-emerald-400' : 'text-slate-300'}`}>{pd}</p>
              <p className="text-[7px] text-slate-600 text-center leading-tight">
                {TRANSIT_DESCRIPTIONS[pd]?.split('.')[0]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
