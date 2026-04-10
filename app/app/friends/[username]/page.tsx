'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'
import type { NatalChartData, TransitAspect } from '@/lib/astrology'
import { calcCrossAspects, ASPECT_SYMBOLS } from '@/lib/astrology'
import NatalChartWheel from '@/components/NatalChartWheel'

const ASPECT_COLORS: Record<string, string> = {
  Conjunction: 'text-violet-300',
  Opposition: 'text-rose-300',
  Square: 'text-rose-300',
  Trine: 'text-sky-300',
  Sextile: 'text-sky-300',
}

function formatOrb(orb: number): string {
  const deg = Math.floor(orb)
  const min = Math.round((orb - deg) * 60)
  return `${deg}°${min < 10 ? '0' : ''}${min}′`
}

export default function FriendProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { profile: myProfile } = useAuth()
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  const [friend, setFriend] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [crossAspects, setCrossAspects] = useState<TransitAspect[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()
      setFriend(data)
      setLoading(false)
    }
    load()
  }, [username, supabase])

  // Compute synastry when both charts are available
  useEffect(() => {
    if (!myProfile?.natal_chart_json || !friend?.natal_chart_json) return
    const myChart = myProfile.natal_chart_json as unknown as NatalChartData
    const friendChart = friend.natal_chart_json as unknown as NatalChartData
    if (!myChart.planets || !friendChart.planets) return

    const aspects = calcCrossAspects(friendChart.planets, myChart.planets, { includeAngles: true })
    setCrossAspects(aspects)
  }, [myProfile, friend])

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <p className="text-sm text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!friend) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-400">User not found.</p>
      </div>
    )
  }

  const myChart = myProfile?.natal_chart_json as unknown as NatalChartData | null
  const friendChart = friend.natal_chart_json as unknown as NatalChartData | null

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/[0.08] flex items-center justify-center text-lg font-bold text-white/60">
          {(friend.display_name || friend.username)?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">{friend.display_name || friend.username}</h1>
          <p className="text-sm text-slate-500">@{friend.username}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            {friend.sun_sign && `☉ ${friend.sun_sign}`}
            {friend.moon_sign && `  ☽ ${friend.moon_sign}`}
            {friend.rising_sign && `  AC ${friend.rising_sign}`}
          </p>
        </div>
      </div>

      {/* Synastry bi-wheel */}
      {myChart && friendChart && (
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-300/80 mb-4">
            Synastry Chart
          </p>
          <p className="text-[10px] text-slate-600 mb-4">
            Outer ring: your natal planets. Inner ring: {friend.display_name || friend.username}'s natal planets.
          </p>
          <div className="flex justify-center">
            <NatalChartWheel data={myChart} transitData={friendChart} />
          </div>
        </div>
      )}

      {/* Cross aspects table */}
      {crossAspects.length > 0 && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-300/80 mb-3">
            Synastry Aspects ({crossAspects.length})
          </p>
          <p className="text-[10px] text-slate-600 mb-4">
            How {friend.display_name || friend.username}'s planets aspect your natal chart.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-left text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-white/[0.06]">
                  <th className="py-2 pr-3">{friend.display_name || friend.username}</th>
                  <th className="py-2 pr-3">Aspect</th>
                  <th className="py-2 pr-3">You</th>
                  <th className="py-2 text-right">Orb</th>
                </tr>
              </thead>
              <tbody>
                {crossAspects.slice(0, 30).map((a, i) => (
                  <tr key={i} className="border-b border-white/[0.03] last:border-b-0">
                    <td className="py-1.5 pr-3 text-slate-200">{a.transitPlanet}</td>
                    <td className={`py-1.5 pr-3 font-medium ${ASPECT_COLORS[a.type] || ''}`}>
                      {ASPECT_SYMBOLS[a.type]} {a.type}
                    </td>
                    <td className="py-1.5 pr-3 text-slate-200">{a.natalPlanet}</td>
                    <td className="py-1.5 text-right font-mono text-[10px] text-slate-400">
                      {formatOrb(a.orb)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No chart data */}
      {(!myChart || !friendChart) && (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-slate-600">
            {!myChart && 'Complete your birth data in Settings to see synastry.'}
            {myChart && !friendChart && `${friend.display_name || friend.username} hasn't completed their profile yet.`}
          </p>
        </div>
      )}
    </div>
  )
}
