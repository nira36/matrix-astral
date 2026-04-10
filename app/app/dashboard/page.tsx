'use client'

import { useAuth } from '@/components/auth/AuthProvider'

export default function DashboardPage() {
  const { profile } = useAuth()

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

      {/* Identity card */}
      {profile && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 mb-6">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-4">
            Your Cosmic Identity
          </p>
          <div className="flex gap-6">
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
          </div>
        </div>
      )}

      {/* Transit feed placeholder */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 mb-6">
        <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-3">
          Today's Transits
        </p>
        <p className="text-sm text-slate-600 italic">
          Daily transit feed coming soon. Head to <a href="/app/chart" className="text-white/50 underline">My Chart</a> to see your full chart with live transits.
        </p>
      </div>

      {/* Friends activity placeholder */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-3">
          Friend Activity
        </p>
        <p className="text-sm text-slate-600 italic">
          Connect with friends to see compatibility and shared transits. Head to <a href="/app/friends" className="text-white/50 underline">Friends</a> to get started.
        </p>
      </div>
    </div>
  )
}
