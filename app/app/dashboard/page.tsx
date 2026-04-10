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

const ASPECT_GLYPH: Record<string, string> = {
  Conjunction: '☌', Opposition: '☍', Square: '□', Trine: '△', Sextile: '⚹',
}

const PERSONAL_YEAR_MEANING: Record<number, string> = {
  1: 'New beginnings, independence, planting seeds.',
  2: 'Patience, partnerships, quiet growth.',
  3: 'Creativity, expression, social expansion.',
  4: 'Building, discipline, laying foundations.',
  5: 'Change, freedom, unexpected turns.',
  6: 'Responsibility, home, love, healing.',
  7: 'Introspection, study, spiritual deepening.',
  8: 'Power, achievement, material results.',
  9: 'Completion, release, letting go.',
  11: 'Spiritual awakening and intuition.',
  22: 'Visionary building and grand plans.',
  33: 'Selfless service and creative mastery.',
}

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

  const transitInfo = useMemo(() => {
    if (!profile?.natal_chart_json) return null
    const natal = profile.natal_chart_json as unknown as NatalChartData
    const now = new Date()
    const lat = profile.birth_lat ?? 41.9
    const lon = profile.birth_lon ?? 12.5
    const tz = profile.birth_tz ?? 1
    const dst = isDST(now.getFullYear(), now.getMonth() + 1, now.getDate(), tz)
    const tzOffset = tz + (dst ? 1 : 0)
    const currentSky = calcNatalChart(now.getDate(), now.getMonth() + 1, now.getFullYear(), now.getHours(), now.getMinutes(), lat, lon, tzOffset)
    const transitPlanets = currentSky.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
    const natalPlanets = natal.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
    const aspects = calcCrossAspects(transitPlanets, natalPlanets)
    const slowInHouses = SLOW_TRANSIT_PLANETS.map(name => {
      const tp = currentSky.planets.find(p => p.planet === name)
      if (!tp || !natal.houses?.length) return null
      const cusps = natal.houses.map(h => h.longitude)
      const house = assignHouseFromCusps(tp.longitude, cusps)
      const desc = TRANSIT_HOUSE_DESCRIPTIONS[name as TransitPlanetKey]?.[house]
      return { planet: name, sign: tp.sign, house, desc, retrograde: tp.retrograde }
    }).filter(Boolean) as { planet: string; sign: string; house: number; desc: string; retrograde: boolean }[]
    const sun = currentSky.planets.find(p => p.planet === 'Sun')
    const moon = currentSky.planets.find(p => p.planet === 'Moon')
    let lunar = null
    if (sun && moon) {
      const diff = ((moon.longitude - sun.longitude) % 360 + 360) % 360
      const illumination = Math.round((1 - Math.cos((diff * Math.PI) / 180)) / 2 * 100)
      const phases = [
        { max: 22.5, name: 'New Moon', emoji: '🌑' }, { max: 67.5, name: 'Waxing Crescent', emoji: '🌒' },
        { max: 112.5, name: 'First Quarter', emoji: '🌓' }, { max: 157.5, name: 'Waxing Gibbous', emoji: '🌔' },
        { max: 202.5, name: 'Full Moon', emoji: '🌕' }, { max: 247.5, name: 'Waning Gibbous', emoji: '🌖' },
        { max: 292.5, name: 'Last Quarter', emoji: '🌗' }, { max: 337.5, name: 'Waning Crescent', emoji: '🌘' },
      ]
      const phase = phases.find(p => diff < p.max) || { name: 'New Moon', emoji: '🌑' }
      lunar = { ...phase, illumination }
    }
    return { aspects: aspects.slice(0, 5), slowInHouses, lunar, moonSign: moon?.sign }
  }, [profile])

  const numInfo = useMemo(() => {
    if (!profile?.birth_date) return null
    const [yyyy, mm, dd] = profile.birth_date.split('-').map(Number)
    const name = profile.birth_name || profile.display_name || ''
    if (!name) return null
    const result = calcNumerology(`${dd}/${mm}/${yyyy}`, name)
    return result?.personalDay ?? null
  }, [profile])

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    async function loadFriends() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: rows } = await db
        .from('friendships')
        .select(`status, created_at, requester, addressee,
          requester_profile:profiles!friendships_requester_fkey(username, display_name, sun_sign),
          addressee_profile:profiles!friendships_addressee_fkey(username, display_name, sun_sign)`)
        .or(`requester.eq.${user!.id},addressee.eq.${user!.id}`)
        .order('updated_at', { ascending: false })
        .limit(5)
      if (!rows) { setFriendsLoading(false); return }
      const activities: FriendActivity[] = rows.map((r: Record<string, unknown>) => {
        const isRequester = r.requester === user!.id
        const other = isRequester ? (r.addressee_profile as Record<string, unknown>) : (r.requester_profile as Record<string, unknown>)
        return {
          type: r.status === 'accepted' ? 'accepted' as const : isRequester ? 'pending_out' as const : 'pending_in' as const,
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
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="mb-10">
        <h1 className="text-3xl text-white mb-1">
          {profile?.display_name ? `${profile.display_name}` : 'Dashboard'}
        </h1>
        <p className="text-sm text-slate-500">Your cosmic weather today.</p>
      </div>

      {/* ── Identity bar (inline, not a card) ── */}
      {profile && (
        <div className="flex items-center gap-5 flex-wrap mb-8 text-sm text-slate-400">
          {profile.sun_sign && <span>☉ {profile.sun_sign}</span>}
          {profile.moon_sign && <span>☽ {profile.moon_sign}</span>}
          {profile.rising_sign && <span>AC {profile.rising_sign}</span>}
          {profile.life_path && <span>LP {profile.life_path}</span>}
          {transitInfo?.lunar && (
            <span className="ml-auto text-slate-500">
              {transitInfo.lunar.emoji} {transitInfo.lunar.name}
              {transitInfo.moonSign && <span className="text-slate-600 ml-1">in {transitInfo.moonSign}</span>}
            </span>
          )}
        </div>
      )}

      {/* ── Bento grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TODAY — large card */}
        <div className="rounded-xl border border-white/5 bg-bg-card p-6 md:row-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-5">Today</p>

          {/* Personal day number */}
          {numInfo && (
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-semibold text-white">{numInfo.day}</span>
                <span className="text-xs text-slate-500">Personal Day</span>
              </div>
              <div className="flex gap-4 text-xs text-slate-500 mb-3">
                <span>Year <span className="text-slate-300 font-medium">{numInfo.year}</span></span>
                <span>Month <span className="text-slate-300 font-medium">{numInfo.month}</span></span>
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed">
                {PERSONAL_YEAR_MEANING[numInfo.year] || ''}
              </p>
            </div>
          )}

          {/* Active transits */}
          {transitInfo && transitInfo.aspects.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3 pt-4 border-t border-white/5">
                Active Transits
              </p>
              <div className="space-y-2.5">
                {transitInfo.aspects.map((asp, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-sm text-white/30 w-4 text-center">{ASPECT_GLYPH[asp.type] || '·'}</span>
                    <span className="text-sm text-slate-300">
                      {asp.transitPlanet} {asp.type} {asp.natalPlanet}
                    </span>
                    <span className="text-xs text-slate-600 ml-auto">{asp.orb}°</span>
                  </div>
                ))}
              </div>
              <Link href="/app/chart" className="inline-block mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                View full chart →
              </Link>
            </div>
          )}
        </div>

        {/* LONG-TERM TRANSITS */}
        {transitInfo && transitInfo.slowInHouses.length > 0 && (
          <div className="rounded-xl border border-white/5 bg-bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">Long-Term</p>
            <div className="space-y-3">
              {transitInfo.slowInHouses.map((t, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="text-sm text-slate-300">{t.planet}</span>
                  <span className="text-xs text-slate-600">{t.sign}{t.retrograde ? ' ℞' : ''}</span>
                  <span className="text-xs text-slate-600 ml-auto">{houseOrdinal(t.house)} House</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FRIENDS */}
        <div className="rounded-xl border border-white/5 bg-bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Friends</p>
            <Link href="/app/friends" className="text-xs text-slate-600 hover:text-slate-300 transition-colors">
              View all →
            </Link>
          </div>

          {friendsLoading ? (
            <p className="text-sm text-slate-600 animate-pulse">Loading...</p>
          ) : friends.length === 0 ? (
            <p className="text-sm text-slate-600">
              No connections yet. <Link href="/app/friends" className="text-slate-400 underline">Find friends</Link>
            </p>
          ) : (
            <div className="space-y-2">
              {friends.map((f, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-semibold text-white/40 shrink-0">
                    {(f.display_name || f.username)?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{f.display_name || f.username}</p>
                  </div>
                  {f.type === 'accepted' && (
                    <Link href={`/app/friends/${f.username}`} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">
                      Synastry
                    </Link>
                  )}
                  {f.type === 'pending_in' && (
                    <Link href="/app/friends" className="text-xs text-slate-400 hover:text-white transition-colors">
                      Review
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
