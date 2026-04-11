'use client'

import { useMemo, useState } from 'react'
import type { BaziResult, Pillar, AnnualTransit, CompatibilityResult, BranchInteraction, SpecialStarHit } from '@/lib/chinese-astrology'
import { calcBazi, calcAnnualTransit, calcCompatibility } from '@/lib/chinese-astrology'
import {
  STEMS, BRANCHES, ELEMENTS, TEN_GODS, SPECIAL_STARS,
  DAY_MASTER_PROFILES, ANIMAL_PROFILES,
  type Element,
} from '@/lib/chinese-data'

interface Props {
  /** dateStr in DD/MM/YYYY format */
  dateStr: string
  /** birthTime in HH:MM (24h) — required for Hour pillar */
  birthTime: string
}

const ELEMENT_ORDER: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']

export default function ChineseAstrology({ dateStr, birthTime }: Props) {
  const [gender, setGender] = useState<'male' | 'female'>('male')

  // Partner inputs for compatibility
  const [partnerDate, setPartnerDate] = useState('')
  const [partnerTime, setPartnerTime] = useState('')
  const [partnerGender, setPartnerGender] = useState<'male' | 'female'>('female')

  const bazi: BaziResult | null = useMemo(() => {
    if (!dateStr) return null
    const parts = dateStr.split('/')
    if (parts.length !== 3) return null
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const year = parseInt(parts[2], 10)
    if (!day || !month || !year) return null

    let hour = 12, minute = 0
    if (birthTime) {
      const tp = birthTime.split(':')
      hour = parseInt(tp[0], 10) || 12
      minute = parseInt(tp[1], 10) || 0
    }
    try {
      return calcBazi(year, month, day, hour, minute, gender)
    } catch {
      return null
    }
  }, [dateStr, birthTime, gender])

  const partnerBazi: BaziResult | null = useMemo(() => {
    if (!partnerDate) return null
    const parts = partnerDate.split('/')
    if (parts.length !== 3) return null
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const year = parseInt(parts[2], 10)
    if (!day || !month || !year) return null

    let hour = 12, minute = 0
    if (partnerTime) {
      const tp = partnerTime.split(':')
      hour = parseInt(tp[0], 10) || 12
      minute = parseInt(tp[1], 10) || 0
    }
    try {
      return calcBazi(year, month, day, hour, minute, partnerGender)
    } catch {
      return null
    }
  }, [partnerDate, partnerTime, partnerGender])

  const annualTransit: AnnualTransit | null = useMemo(() => {
    if (!bazi) return null
    return calcAnnualTransit(bazi, new Date().getFullYear())
  }, [bazi])

  const compatibility: CompatibilityResult | null = useMemo(() => {
    if (!bazi || !partnerBazi) return null
    return calcCompatibility(bazi, partnerBazi)
  }, [bazi, partnerBazi])

  if (!dateStr) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-6 text-center max-w-lg mx-auto">
        <p className="text-sm text-amber-400/80 mb-2 font-semibold">Missing Data</p>
        <p className="text-[11px] text-amber-400/60 leading-relaxed">
          Enter your <strong>birth date</strong> in the form above to compute your Four Pillars chart.
        </p>
      </div>
    )
  }

  if (!bazi) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-6 text-center max-w-lg mx-auto">
        <p className="text-sm text-red-400/80">Invalid date, please check your input.</p>
      </div>
    )
  }

  const dmProfile = DAY_MASTER_PROFILES[bazi.dayMaster]
  const dmStem = STEMS[bazi.dayMaster]

  return (
    <div className="flex flex-col gap-12">
      {/* ── Header ── */}
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Chinese <span className="text-accent-purple">Bazi</span> · Four Pillars
        </h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
          The 8 Characters of Destiny, your cosmic signature decoded through the Heavenly Stems and Earthly Branches.
        </p>
        <div className="flex items-center justify-center gap-3 mt-2 text-[10px] font-mono text-slate-600">
          <span>{bazi.lunarDate}</span>
          <span className="opacity-40">·</span>
          <span>Solar Term: {bazi.solarTerm || '—'}</span>
        </div>

        {/* Gender toggle (affects luck pillar direction) */}
        <div className="flex items-center justify-center gap-1 p-1 mt-2 mx-auto rounded-full border border-white/[0.07] bg-bg-card w-fit">
          {(['male', 'female'] as const).map(g => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className="px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all"
              style={{
                background: gender === g ? 'linear-gradient(135deg,#a8879d,#a8879d)' : 'transparent',
                color: gender === g ? '#fff' : '#64748b',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section 1: Four Pillars ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>The Four <span className="text-accent-purple">Pillars</span></SectionLabel>
        <FourPillarsTable bazi={bazi} />
      </section>

      {/* ── Section 2: Day Master Profile ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Your <span className="text-accent-purple">Day Master</span></SectionLabel>
        <Card>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Big stem character */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2 md:w-48">
              <div
                className="w-32 h-32 rounded-2xl flex items-center justify-center border-2"
                style={{
                  borderColor: dmStem?.color,
                  background: `${dmStem?.color}11`,
                  boxShadow: `0 0 40px ${dmStem?.color}33`,
                }}
              >
                <span className="text-7xl font-black" style={{ color: dmStem?.color }}>
                  {bazi.dayMaster}
                </span>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{dmStem?.pinyin}</p>
                <p className="text-[10px] font-bold text-slate-400">{dmStem?.polarity} {dmStem?.element}</p>
              </div>
            </div>

            {/* Profile text */}
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Archetype</p>
                <h3 className="text-2xl font-black tracking-tight" style={{ color: dmStem?.color }}>
                  {dmProfile?.archetype}
                </h3>
                <p className="text-[11px] text-slate-500 italic mt-1">{dmProfile?.essence}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {dmProfile?.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-widest mb-1.5">Strengths</p>
                  <div className="flex flex-wrap gap-1">
                    {dmProfile?.strengths.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-[9px] text-emerald-400/80 border border-emerald-500/20 bg-emerald-500/[0.04]">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-rose-500/70 uppercase tracking-widest mb-1.5">Shadows</p>
                  <div className="flex flex-wrap gap-1">
                    {dmProfile?.shadows.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-[9px] text-rose-400/80 border border-rose-500/20 bg-rose-500/[0.04]">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Section 3: Five Elements Balance ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Five Elements <span className="text-accent-purple">Balance</span></SectionLabel>
        <Card>
          <FiveElementsChart bazi={bazi} />
        </Card>
      </section>

      {/* ── Section 4: Favorable Elements ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Favorable <span className="text-accent-purple">Elements</span></SectionLabel>
        <Card>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
            Based on the strength of your Day Master, these elements bring balance, support, and good fortune.
            Surround yourself with their colors, foods, directions, and seasons.
          </p>
          <div className="flex flex-wrap gap-3">
            {bazi.favorableElements.map(el => {
              const data = ELEMENTS[el]
              return (
                <div
                  key={el}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border-2"
                  style={{ borderColor: data.color, background: `${data.color}0d` }}
                >
                  <span className="text-3xl font-black" style={{ color: data.color }}>{data.char}</span>
                  <div>
                    <p className="text-sm font-black" style={{ color: data.color }}>{el}</p>
                    <p className="text-[9px] font-mono text-slate-500 uppercase">{data.nature}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      {/* ── Section 5: Year Animal ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Your Zodiac <span className="text-accent-purple">Animals</span></SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimalCard label="Outer (Year)"   animal={bazi.yearAnimal}  />
          <AnimalCard label="Inner (Month)"  animal={bazi.monthAnimal} />
          <AnimalCard label="True (Day)"     animal={bazi.dayAnimal}   />
          <AnimalCard label="Secret (Hour)"  animal={bazi.hourAnimal}  />
        </div>
      </section>

      {/* ── Section 6: Luck Pillars Timeline ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Luck Pillars <span className="text-accent-purple">大運</span></SectionLabel>
        <Card>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
            Da Yun, the 10-year cycles that shape the major eras of your life. Each pillar carries its own elemental flavor and 10 Gods relationship to your Day Master.
          </p>
          <LuckPillarsTimeline bazi={bazi} />
        </Card>
      </section>

      {/* ── Section 7: Special Stars (神煞) ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Special Stars <span className="text-accent-purple">神煞</span></SectionLabel>
        <Card>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
            Shen Sha, auspicious and inauspicious stars activated by specific branches in your chart. Each one shapes a particular dimension of your destiny.
          </p>
          <SpecialStarsList stars={bazi.specialStars} />
        </Card>
      </section>

      {/* ── Section 8: Branch Interactions ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel>Branch <span className="text-accent-purple">Interactions</span></SectionLabel>
        <Card>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
            How the Earthly Branches in your chart relate to one another, harmonies that bring flow, clashes that create tension, and punishments that demand resolution.
          </p>
          <InteractionsList interactions={bazi.interactions} emptyMsg="No major interactions detected, your branches are independent." />
        </Card>
      </section>

      {/* ── Section 9: Annual Transit ── */}
      {annualTransit && (
        <section className="flex flex-col gap-6">
          <SectionLabel>Annual <span className="text-accent-purple">Transit</span> {annualTransit.year}</SectionLabel>
          <Card>
            <AnnualTransitView transit={annualTransit} bazi={bazi} />
          </Card>
        </section>
      )}

      {/* ── Section 10: Compatibility ── */}
      <section className="flex flex-col gap-6">
        <SectionLabel><span className="text-accent-purple">Compatibility</span> Analysis</SectionLabel>
        <Card>
          <CompatibilityForm
            partnerDate={partnerDate}
            setPartnerDate={setPartnerDate}
            partnerTime={partnerTime}
            setPartnerTime={setPartnerTime}
            partnerGender={partnerGender}
            setPartnerGender={setPartnerGender}
          />
          {compatibility && partnerBazi && (
            <div className="mt-6">
              <CompatibilityView compat={compatibility} a={bazi} b={partnerBazi} />
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

function FourPillarsTable({ bazi }: { bazi: BaziResult }) {
  const pillars: Pillar[] = [bazi.pillars.year, bazi.pillars.month, bazi.pillars.day, bazi.pillars.hour]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {pillars.map(p => {
        const stem = STEMS[p.stemChar]
        const branch = BRANCHES[p.branchChar]
        const isDayMaster = p.label === 'Day'
        const god = TEN_GODS[p.god]

        return (
          <div
            key={p.label}
            className="relative rounded-2xl border bg-bg-card p-4 flex flex-col items-center gap-3 transition-all"
            style={{
              borderColor: isDayMaster ? `${stem?.color}66` : 'rgba(255,255,255,0.07)',
              boxShadow: isDayMaster ? `0 0 30px ${stem?.color}22` : undefined,
            }}
          >
            {isDayMaster && (
              <span className="absolute top-2 right-2 text-[7px] font-black uppercase tracking-widest text-accent-purple bg-accent-purple/10 px-1.5 py-0.5 rounded">
                You
              </span>
            )}

            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{p.label}</p>

            {/* Stem */}
            <div className="flex flex-col items-center gap-0.5">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center border"
                style={{
                  borderColor: `${stem?.color}55`,
                  background: `${stem?.color}11`,
                }}
              >
                <span className="text-3xl font-black" style={{ color: stem?.color }}>{p.stemChar}</span>
              </div>
              <p className="text-[8px] font-mono text-slate-500 mt-1">{stem?.pinyin}</p>
              <p className="text-[8px] font-bold text-slate-400">{stem?.element}</p>
            </div>

            {/* Branch */}
            <div className="flex flex-col items-center gap-0.5">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center border"
                style={{
                  borderColor: `${branch?.color}55`,
                  background: `${branch?.color}11`,
                }}
              >
                <span className="text-3xl font-black" style={{ color: branch?.color }}>{p.branchChar}</span>
              </div>
              <p className="text-[8px] font-mono text-slate-500 mt-1">{branch?.pinyin} · {branch?.animal}</p>
              <p className="text-[8px] font-bold text-slate-400">{branch?.element}</p>
            </div>

            {/* 10 God */}
            {god && !isDayMaster && (
              <div className="text-center border-t border-white/[0.05] pt-2 w-full">
                <p className="text-[8px] font-bold text-accent-purple uppercase tracking-wider">{god.english}</p>
                <p className="text-[7px] font-mono text-slate-600">{god.char}</p>
              </div>
            )}
            {isDayMaster && (
              <div className="text-center border-t border-white/[0.05] pt-2 w-full">
                <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: stem?.color }}>Day Master</p>
                <p className="text-[7px] font-mono text-slate-600">日主</p>
              </div>
            )}

            {/* Hidden stems */}
            {p.hiddenStems.length > 0 && (
              <div className="flex gap-1 border-t border-white/[0.05] pt-2 w-full justify-center">
                {p.hiddenStems.map((h, i) => {
                  const hs = STEMS[h]
                  return (
                    <span key={i} className="text-[10px] font-black" style={{ color: hs?.color, opacity: 0.6 }}>{h}</span>
                  )
                })}
              </div>
            )}

            {/* NaYin */}
            <p className="text-[7px] font-mono text-slate-700 text-center">{p.nayin}</p>
          </div>
        )
      })}
    </div>
  )
}

function FiveElementsChart({ bazi }: { bazi: BaziResult }) {
  return (
    <div className="flex flex-col gap-4">
      {ELEMENT_ORDER.map(el => {
        const data = ELEMENTS[el]
        const pct = bazi.elementPercent[el]
        const isDominant = el === bazi.dominantElement
        const isWeakest  = el === bazi.weakestElement
        const isDM       = el === bazi.dayMasterElement

        return (
          <div key={el} className="flex items-center gap-4">
            <div className="flex-shrink-0 flex items-center gap-2 w-28">
              <span className="text-2xl font-black" style={{ color: data.color }}>{data.char}</span>
              <div>
                <p className="text-[10px] font-bold" style={{ color: data.color }}>{el}</p>
                <p className="text-[8px] font-mono text-slate-600">{data.pinyin}</p>
              </div>
            </div>

            <div className="flex-1 h-6 rounded-full bg-white/[0.03] overflow-hidden border border-white/[0.05] relative">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(pct, 2)}%`,
                  background: `linear-gradient(90deg, ${data.color}66, ${data.color})`,
                  boxShadow: isDominant ? `0 0 12px ${data.color}77` : undefined,
                }}
              />
              <span className="absolute inset-0 flex items-center justify-end pr-3 text-[10px] font-black text-white/90 mix-blend-difference">
                {pct}%
              </span>
            </div>

            <div className="flex-shrink-0 w-16 flex justify-end gap-1">
              {isDM && (
                <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-accent-purple/15 text-accent-purple uppercase tracking-wider">DM</span>
              )}
              {isDominant && (
                <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 uppercase tracking-wider">Top</span>
              )}
              {isWeakest && (
                <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 uppercase tracking-wider">Low</span>
              )}
            </div>
          </div>
        )
      })}

      {/* Dominant element description */}
      <div className="mt-4 pt-4 border-t border-white/[0.05]">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: ELEMENTS[bazi.dominantElement].color }}>
          Dominant: {bazi.dominantElement}
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {ELEMENTS[bazi.dominantElement].description}
        </p>
      </div>
    </div>
  )
}

function AnimalCard({ label, animal }: { label: string; animal: string }) {
  const profile = ANIMAL_PROFILES[animal]
  if (!profile) return null
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</p>
        <span className="text-[10px] font-black text-accent-purple uppercase tracking-wider">{animal}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {profile.traits.map(t => (
          <span key={t} className="px-2 py-0.5 rounded text-[9px] text-slate-400 border border-white/[0.06] bg-white/[0.02]">{t}</span>
        ))}
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">{profile.description}</p>
    </div>
  )
}

function LuckPillarsTimeline({ bazi }: { bazi: BaziResult }) {
  const currentYear = new Date().getFullYear()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {bazi.luckPillars.map((lp, idx) => {
        const stem = STEMS[lp.stemChar]
        const branch = BRANCHES[lp.branchChar]
        const isCurrent = currentYear >= lp.startYear && currentYear <= lp.endYear

        return (
          <div
            key={idx}
            className="relative rounded-xl border bg-bg-card p-3 flex flex-col items-center gap-2 transition-all"
            style={{
              borderColor: isCurrent ? `${stem?.color}88` : 'rgba(255,255,255,0.07)',
              boxShadow: isCurrent ? `0 0 24px ${stem?.color}44` : undefined,
            }}
          >
            {isCurrent && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] font-black uppercase tracking-widest text-accent-purple bg-bg-card px-2 py-0.5 rounded-full border border-accent-purple/40">
                Now
              </span>
            )}
            <p className="text-[8px] font-mono text-slate-500">Age {lp.age}</p>
            <p className="text-[8px] font-mono text-slate-600">{lp.startYear}–{lp.endYear}</p>

            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-black leading-none" style={{ color: stem?.color }}>{lp.stemChar}</span>
              <span className="text-2xl font-black leading-none" style={{ color: branch?.color }}>{lp.branchChar}</span>
            </div>

            <p className="text-[7px] font-mono text-slate-600 text-center">
              {stem?.element}<br/>{branch?.animal}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ─── Special Stars list ─────────────────────────────────────────────────────

function SpecialStarsList({ stars }: { stars: SpecialStarHit[] }) {
  if (stars.length === 0) {
    return <p className="text-[11px] text-slate-500 italic">No major special stars active in this chart.</p>
  }

  // Group by starKey
  const grouped = new Map<string, SpecialStarHit[]>()
  for (const s of stars) {
    if (!grouped.has(s.starKey)) grouped.set(s.starKey, [])
    grouped.get(s.starKey)!.push(s)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from(grouped.entries()).map(([key, hits]) => {
        const star = SPECIAL_STARS[key]
        if (!star) return null
        const isAuspicious = key !== 'goatBlade'
        const accent = isAuspicious ? '#10b981' : '#f97316'
        return (
          <div
            key={key}
            className="rounded-xl border bg-bg-card p-4 flex flex-col gap-2"
            style={{ borderColor: `${accent}33` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black" style={{ color: accent }}>{star.char}</span>
                  <span className="text-[10px] font-mono text-slate-500">{star.pinyin}</span>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider mt-0.5" style={{ color: accent }}>
                  {star.english}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 justify-end">
                {hits.map((h, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded text-[8px] font-mono border"
                    style={{ borderColor: `${accent}44`, background: `${accent}0d`, color: accent }}
                  >
                    {h.pillar}·{h.branch}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">{star.meaning}</p>
          </div>
        )
      })}
    </div>
  )
}

// ─── Branch Interactions list ───────────────────────────────────────────────

function InteractionsList({ interactions, emptyMsg }: { interactions: BranchInteraction[]; emptyMsg: string }) {
  if (interactions.length === 0) {
    return <p className="text-[11px] text-slate-500 italic">{emptyMsg}</p>
  }

  const TYPE_META: Record<BranchInteraction['type'], { color: string; label: string }> = {
    harmony6:   { color: '#10b981', label: 'Harmony' },
    harmony3:   { color: '#06b6d4', label: 'Triple' },
    clash:      { color: '#ef4444', label: 'Clash' },
    punishment: { color: '#f97316', label: 'Punishment' },
  }

  return (
    <div className="flex flex-col gap-2">
      {interactions.map((it, idx) => {
        const meta = TYPE_META[it.type]
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-xl border"
            style={{ borderColor: `${meta.color}33`, background: `${meta.color}08` }}
          >
            <span
              className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest"
              style={{ background: `${meta.color}22`, color: meta.color }}
            >
              {meta.label}
            </span>
            <div className="flex gap-1">
              {it.branches.map((b, i) => {
                const br = BRANCHES[b]
                return (
                  <span
                    key={i}
                    className="text-xl font-black"
                    style={{ color: br?.color }}
                  >
                    {b}
                  </span>
                )
              })}
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-300">{it.label}</p>
              <p className="text-[8px] text-slate-600 font-mono mt-0.5">
                Pillars: {it.pillars.join(', ')}
              </p>
            </div>
            {it.element && (
              <span
                className="text-2xl font-black"
                style={{ color: ELEMENTS[it.element].color }}
              >
                {ELEMENTS[it.element].char}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Annual Transit View ────────────────────────────────────────────────────

function AnnualTransitView({ transit, bazi }: { transit: AnnualTransit; bazi: BaziResult }) {
  const stem = STEMS[transit.stemChar]
  const branch = BRANCHES[transit.branchChar]
  const god = TEN_GODS[transit.god]

  return (
    <div className="flex flex-col gap-6">
      {/* Header: transit pillar visual */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div
          className="rounded-2xl border-2 p-4 flex flex-col items-center gap-2"
          style={{
            borderColor: stem?.color,
            background: `${stem?.color}0d`,
            boxShadow: `0 0 30px ${stem?.color}22`,
          }}
        >
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Year {transit.year}</p>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-black" style={{ color: stem?.color }}>{transit.stemChar}</span>
            <span className="text-5xl font-black" style={{ color: branch?.color }}>{transit.branchChar}</span>
          </div>
          <p className="text-[8px] font-mono text-slate-500">{stem?.pinyin} {branch?.pinyin}</p>
          <p className="text-[8px] font-bold text-slate-400">{branch?.animal}</p>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">10 Gods Influence</p>
            <p className="text-lg font-black text-accent-purple">{god?.english ?? '—'}</p>
            <p className="text-[10px] text-slate-500 italic">{god?.char} · {god?.pinyin}</p>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">{god?.meaning}</p>
        </div>
      </div>

      {/* Element flavor */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
        <span className="text-2xl font-black" style={{ color: ELEMENTS[transit.stemElement].color }}>
          {ELEMENTS[transit.stemElement].char}
        </span>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: ELEMENTS[transit.stemElement].color }}>
            {transit.stemElement} energy dominant
          </p>
          <p className="text-[10px] text-slate-500">
            {bazi.favorableElements.includes(transit.stemElement)
              ? '✓ Favorable element, supports your chart this year.'
              : 'Neutral or challenging, work with this element consciously.'}
          </p>
        </div>
      </div>

      {/* Transit interactions */}
      {transit.interactions.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Transit Interactions</p>
          <InteractionsList interactions={transit.interactions} emptyMsg="" />
        </div>
      )}

      {/* Activated stars */}
      {transit.newSpecialStars.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Activated Stars This Year</p>
          <div className="flex flex-wrap gap-2">
            {transit.newSpecialStars.map((s, i) => {
              const star = SPECIAL_STARS[s.starKey]
              if (!star) return null
              return (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/[0.05] text-emerald-400"
                >
                  {star.char} {star.english}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Compatibility ──────────────────────────────────────────────────────────

function CompatibilityForm({
  partnerDate, setPartnerDate, partnerTime, setPartnerTime, partnerGender, setPartnerGender,
}: {
  partnerDate: string; setPartnerDate: (s: string) => void
  partnerTime: string; setPartnerTime: (s: string) => void
  partnerGender: 'male' | 'female'; setPartnerGender: (g: 'male' | 'female') => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Enter your partner's birth data to compare your charts. The analysis evaluates Day Master compatibility, branch interactions, and elemental complementarity.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Partner Date</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="DD/MM/YYYY"
            value={partnerDate}
            onChange={e => {
              let v = e.target.value.replace(/[^\d/]/g, '').replace(/\//g, '')
              if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
              if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5)
              setPartnerDate(v.slice(0, 10))
            }}
            className="bg-[#1f2937] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-accent-purple transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Partner Time</label>
          <input
            type="time"
            value={partnerTime}
            onChange={e => setPartnerTime(e.target.value)}
            className="bg-[#1f2937] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-accent-purple transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Partner Gender</label>
          <div className="flex gap-1 p-1 rounded-lg border border-white/[0.08] bg-[#1f2937]">
            {(['male','female'] as const).map(g => (
              <button
                key={g}
                onClick={() => setPartnerGender(g)}
                className="flex-1 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all"
                style={{
                  background: partnerGender === g ? 'linear-gradient(135deg,#a8879d,#a8879d)' : 'transparent',
                  color: partnerGender === g ? '#fff' : '#64748b',
                }}
              >{g}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CompatibilityView({ compat, a, b }: { compat: CompatibilityResult; a: BaziResult; b: BaziResult }) {
  const aDM = STEMS[a.dayMaster]
  const bDM = STEMS[b.dayMaster]

  const scoreColor = (s: number) =>
    s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col gap-6 pt-4 border-t border-white/[0.07]">
      {/* Two Day Masters side by side */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center border-2"
            style={{ borderColor: aDM?.color, background: `${aDM?.color}11` }}
          >
            <span className="text-4xl font-black" style={{ color: aDM?.color }}>{a.dayMaster}</span>
          </div>
          <p className="text-[9px] font-bold text-slate-500 uppercase">You</p>
          <p className="text-[8px] text-slate-600 font-mono">{aDM?.element}</p>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="text-6xl font-black"
            style={{ color: scoreColor(compat.overallScore) }}
          >
            {compat.overallScore}
          </div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Overall</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center border-2"
            style={{ borderColor: bDM?.color, background: `${bDM?.color}11` }}
          >
            <span className="text-4xl font-black" style={{ color: bDM?.color }}>{b.dayMaster}</span>
          </div>
          <p className="text-[9px] font-bold text-slate-500 uppercase">Partner</p>
          <p className="text-[8px] text-slate-600 font-mono">{bDM?.element}</p>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="grid grid-cols-3 gap-3">
        <ScoreCard label="Day Master" score={compat.dmScore} />
        <ScoreCard label="Branches" score={compat.branchScore} />
        <ScoreCard label="Elements" score={compat.elementScore} />
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        {compat.notes.map((note, i) => (
          <div
            key={i}
            className="flex items-start gap-2 p-3 rounded-lg border border-white/[0.05] bg-white/[0.02]"
          >
            <span className="text-accent-purple mt-0.5">◆</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">{note}</p>
          </div>
        ))}
      </div>

      {/* Cross interactions */}
      {compat.interactions.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cross-Chart Interactions</p>
          <InteractionsList interactions={compat.interactions} emptyMsg="" />
        </div>
      )}
    </div>
  )
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div className="rounded-xl border border-white/[0.07] bg-bg-card p-3 flex flex-col items-center gap-1">
      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black" style={{ color }}>{score}</p>
      <div className="w-full h-1 rounded-full bg-white/[0.05] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

// ─── Layout helpers ──────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-7 shadow-xl shadow-black/30">
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight text-white text-center">
      {children}
    </h2>
  )
}
