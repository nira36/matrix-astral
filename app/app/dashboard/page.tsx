'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { useMemo, useEffect, useState } from 'react'
import { calcNatalChart, calcCrossAspects, isDST, assignHouseFromCusps } from '@/lib/astrology'
import type { NatalChartData } from '@/lib/astrology'
import {
  TRANSIT_HOUSE_DESCRIPTIONS,
  SLOW_TRANSIT_PLANETS,
  houseOrdinal,
  type TransitPlanetKey,
} from '@/lib/transit-house-descriptions'
import { calculate as calcNumerology } from '@/lib/numerology'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// ─── Aspect tone labels ─────────────────────────────────────────────────────
const ASPECT_EMOJI: Record<string, string> = {
  Conjunction: '☌',
  Opposition: '☍',
  Square: '□',
  Trine: '△',
  Sextile: '⚹',
}

const ASPECT_TONE: Record<string, string> = {
  Conjunction: 'fusion — themes blend and amplify',
  Opposition: 'tension along an axis, asking for balance',
  Square: 'friction and pressure, forcing change',
  Trine: 'flow and grace, an open door',
  Sextile: 'opportunity, a small effort unlocks something',
}

// ─── Personal year meanings (brief) ─────────────────────────────────────────
const PERSONAL_YEAR_MEANING: Record<number, string> = {
  1: 'A year of new beginnings, independence, and planting seeds.',
  2: 'A year of patience, partnerships, and quiet growth.',
  3: 'A year of creativity, expression, and social expansion.',
  4: 'A year of building, discipline, and laying foundations.',
  5: 'A year of change, freedom, and unexpected turns.',
  6: 'A year of responsibility, home, love, and healing.',
  7: 'A year of introspection, study, and spiritual deepening.',
  8: 'A year of power, achievement, and material results.',
  9: 'A year of completion, release, and letting go.',
  11: 'A master year of spiritual awakening and intuition.',
  22: 'A master year of visionary building and grand plans.',
  33: 'A master year of selfless service and creative mastery.',
}

// ─── Friend activity types ──────────────────────────────────────────────────
interface FriendActivity {
  type: 'accepted' | 'pending_in' | 'pending_out'
  username: string
  display_name: string | null
  sun_sign: string | null
  created_at: string
}

export default function DashboardPage() {
  const { profile, user } = useAuth()
  const [friends, setFriends] = useState<FriendActivity[]>([])
  const [friendsLoading, setFriendsLoading] = useState(true)

  // ── Compute current transits against natal chart ──────────────────────────
  const transitInfo = useMemo(() => {
    if (!profile?.natal_chart_json) return null
    const natal = profile.natal_chart_json as unknown as NatalChartData

    // Current sky from birth location (good enough for daily transits)
    const now = new Date()
    const lat = profile.birth_lat ?? 41.9
    const lon = profile.birth_lon ?? 12.5
    const tz = profile.birth_tz ?? 1
    const dst = isDST(now.getFullYear(), now.getMonth() + 1, now.getDate(), tz)
    const tzOffset = tz + (dst ? 1 : 0)

    const currentSky = calcNatalChart(
      now.getDate(), now.getMonth() + 1, now.getFullYear(),
      now.getHours(), now.getMinutes(),
      lat, lon, tzOffset,
    )

    // Cross aspects: current sky → natal
    const transitPlanets = currentSky.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
    const natalPlanets = natal.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
    const aspects = calcCrossAspects(transitPlanets, natalPlanets)

    // Transit planets in natal houses (slow planets only for dashboard)
    const slowInHouses = SLOW_TRANSIT_PLANETS.map(name => {
      const tp = currentSky.planets.find(p => p.planet === name)
      if (!tp || !natal.houses?.length) return null
      const cusps = natal.houses.map(h => h.longitude)
      const house = assignHouseFromCusps(tp.longitude, cusps)
      const desc = TRANSIT_HOUSE_DESCRIPTIONS[name as TransitPlanetKey]?.[house]
      return { planet: name, sign: tp.sign, house, desc, retrograde: tp.retrograde }
    }).filter(Boolean) as { planet: string; sign: string; house: number; desc: string; retrograde: boolean }[]

    // Lunar phase
    const sun = currentSky.planets.find(p => p.planet === 'Sun')
    const moon = currentSky.planets.find(p => p.planet === 'Moon')
    let lunar = null
    if (sun && moon) {
      const diff = ((moon.longitude - sun.longitude) % 360 + 360) % 360
      const illumination = Math.round((1 - Math.cos((diff * Math.PI) / 180)) / 2 * 100)
      if (diff < 22.5)       lunar = { name: 'New Moon',        emoji: '🌑', illumination }
      else if (diff < 67.5)  lunar = { name: 'Waxing Crescent', emoji: '🌒', illumination }
      else if (diff < 112.5) lunar = { name: 'First Quarter',   emoji: '🌓', illumination }
      else if (diff < 157.5) lunar = { name: 'Waxing Gibbous',  emoji: '🌔', illumination }
      else if (diff < 202.5) lunar = { name: 'Full Moon',       emoji: '🌕', illumination }
      else if (diff < 247.5) lunar = { name: 'Waning Gibbous',  emoji: '🌖', illumination }
      else if (diff < 292.5) lunar = { name: 'Last Quarter',    emoji: '🌗', illumination }
      else if (diff < 337.5) lunar = { name: 'Waning Crescent', emoji: '🌘', illumination }
      else                   lunar = { name: 'New Moon',        emoji: '🌑', illumination }
    }

    return { aspects: aspects.slice(0, 6), slowInHouses, lunar, moonSign: moon?.sign }
  }, [profile])

  // ── Numerology personal day ───────────────────────────────────────────────
  const numInfo = useMemo(() => {
    if (!profile?.birth_date) return null
    const [yyyy, mm, dd] = profile.birth_date.split('-').map(Number)
    const name = profile.birth_name || profile.display_name || ''
    if (!name) return null
    const result = calcNumerology(`${dd}/${mm}/${yyyy}`, name)
    return result?.personalDay ?? null
  }, [profile])

  // ── Fetch friend activity ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    const supabase = createClient()

    async function loadFriends() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any

      // Get all friendships involving this user
      const { data: rows } = await db
        .from('friendships')
        .select(`
          status, created_at, requester, addressee,
          requester_profile:profiles!friendships_requester_fkey(username, display_name, sun_sign),
          addressee_profile:profiles!friendships_addressee_fkey(username, display_name, sun_sign)
        `)
        .or(`requester.eq.${user!.id},addressee.eq.${user!.id}`)
        .order('updated_at', { ascending: false })
        .limit(10)

      if (!rows) { setFriendsLoading(false); return }

      const activities: FriendActivity[] = rows.map((r: Record<string, unknown>) => {
        const isRequester = r.requester === user!.id
        const other = isRequester
          ? (r.addressee_profile as Record<string, unknown>)
          : (r.requester_profile as Record<string, unknown>)
        const type = r.status === 'accepted'
          ? 'accepted' as const
          : isRequester ? 'pending_out' as const : 'pending_in' as const
        return {
          type,
          username: (other?.username as string) || '?',
          display_name: (other?.display_name as string) || null,
          sun_sign: (other?.sun_sign as string) || null,
          created_at: r.created_at as string,
        }
      })
      setFriends(activities)
      setFriendsLoading(false)
    }

    loadFriends()
  }, [user])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">
          {profile?.display_name
            ? `Welcome back, ${profile.display_name}`
            : 'Dashboard'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your personal cosmic weather and updates.
        </p>
      </div>

      {/* ── Identity card ── */}
      {profile && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 mb-6">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-4">
            Your Cosmic Identity
          </p>
          <div className="flex gap-6 flex-wrap">
            {profile.sun_sign && (
              <div className="text-center">
                <span className="text-2xl">☉</span>
                <p className="text-xs text-white font-medium mt-1">{profile.sun_sign}</p>
                <p className="text-[9px] text-slate-600">Sun</p>
              </div>
            )}
            {profile.moon_sign && (
              <div className="text-center">
                <span className="text-2xl">☽</span>
                <p className="text-xs text-white font-medium mt-1">{profile.moon_sign}</p>
                <p className="text-[9px] text-slate-600">Moon</p>
              </div>
            )}
            {profile.rising_sign && (
              <div className="text-center">
                <span className="text-2xl">↑</span>
                <p className="text-xs text-white font-medium mt-1">{profile.rising_sign}</p>
                <p className="text-[9px] text-slate-600">Rising</p>
              </div>
            )}
            {profile.life_path && (
              <div className="text-center">
                <span className="text-2xl font-black text-white/30">{profile.life_path}</span>
                <p className="text-xs text-white font-medium mt-1">Life Path</p>
                <p className="text-[9px] text-slate-600">Numerology</p>
              </div>
            )}
            {transitInfo?.lunar && (
              <div className="text-center ml-auto">
                <span className="text-2xl">{transitInfo.lunar.emoji}</span>
                <p className="text-xs text-white font-medium mt-1">{transitInfo.lunar.name}</p>
                <p className="text-[9px] text-slate-600">
                  {transitInfo.moonSign && `Moon in ${transitInfo.moonSign}`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Personal Day (Numerology) ── */}
      {numInfo && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 mb-6">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-4">
            Personal Numerology Cycles
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-black text-white/80">{numInfo.year}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Personal Year</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                {PERSONAL_YEAR_MEANING[numInfo.year] || ''}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white/80">{numInfo.month}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Personal Month</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white/80">{numInfo.day}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Personal Day</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Today's Transits ── */}
      {transitInfo && transitInfo.aspects.length > 0 && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">
              Active Transits to Your Chart
            </p>
            <Link href="/app/chart" className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
              Full chart →
            </Link>
          </div>

          <div className="space-y-3">
            {transitInfo.aspects.map((asp, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-lg text-white/40 w-6 text-center shrink-0 mt-0.5">
                  {ASPECT_EMOJI[asp.type] || '•'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">
                    {asp.transitPlanet} {asp.type} your {asp.natalPlanet}
                    <span className="text-slate-600 ml-2 text-xs">
                      {asp.orb}° orb · {asp.applying ? 'applying' : 'separating'}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {ASPECT_TONE[asp.type] || ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Slow planets in your houses ── */}
      {transitInfo && transitInfo.slowInHouses.length > 0 && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 mb-6">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-4">
            Long-Term Transits
          </p>
          <div className="space-y-4">
            {transitInfo.slowInHouses.map((t, i) => (
              <div key={i}>
                <p className="text-sm text-white font-medium">
                  {t.planet} in {t.sign}
                  {t.retrograde && <span className="text-red-400/70 ml-1 text-xs">℞</span>}
                  <span className="text-slate-600 ml-2 text-xs">
                    transiting your {houseOrdinal(t.house)} House
                  </span>
                </p>
                {t.desc && (
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-3">
                    {t.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Friend Activity ── */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">
            Friend Activity
          </p>
          <Link href="/app/friends" className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
            All friends →
          </Link>
        </div>

        {friendsLoading ? (
          <p className="text-sm text-slate-600 animate-pulse">Loading...</p>
        ) : friends.length === 0 ? (
          <p className="text-sm text-slate-600">
            No connections yet. <Link href="/app/friends" className="text-white/50 underline">Find friends</Link> to
            see compatibility and shared transits.
          </p>
        ) : (
          <div className="space-y-2">
            {friends.map((f, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-bold text-white/50 shrink-0">
                  {(f.display_name || f.username)?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {f.display_name || f.username}
                    {f.sun_sign && <span className="text-slate-600 ml-2 text-xs">☉ {f.sun_sign}</span>}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    {f.type === 'accepted' && 'Connected'}
                    {f.type === 'pending_in' && 'Wants to connect with you'}
                    {f.type === 'pending_out' && 'Request sent'}
                  </p>
                </div>
                {f.type === 'accepted' && (
                  <Link
                    href={`/app/friends/${f.username}`}
                    className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors shrink-0"
                  >
                    Synastry →
                  </Link>
                )}
                {f.type === 'pending_in' && (
                  <Link
                    href="/app/friends"
                    className="text-[10px] text-white/50 hover:text-white transition-colors shrink-0"
                  >
                    Review
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
