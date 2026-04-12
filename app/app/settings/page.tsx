'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { calcNatalChart, isDST } from '@/lib/astrology'
import { calculate as calcNumerology } from '@/lib/numerology'
import BirthPlaceInput, { type PlaceSelection } from '@/components/BirthPlaceInput'

type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 max-w-lg mx-auto">
        <div className="text-slate-600 text-sm animate-pulse">Loading...</div>
      </div>
    }>
      <SettingsForm />
    </Suspense>
  )
}

function SettingsForm() {
  const { user, profile, refreshProfile } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isOnboarding = searchParams.get('onboarding') === 'true'
  const supabase = createClient()

  const [username, setUsername] = useState(profile?.username || '')
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [birthName, setBirthName] = useState(profile?.birth_name || '')
  const [birthDate, setBirthDate] = useState(profile?.birth_date || '')
  const [birthTime, setBirthTime] = useState(profile?.birth_time?.slice(0, 5) || '')
  const [birthPlace, setBirthPlace] = useState(profile?.birth_place || '')
  const [selectedPlace, setSelectedPlace] = useState<PlaceSelection | null>(
    profile?.birth_lat && profile?.birth_lon
      ? { display: profile.birth_place || '', lat: profile.birth_lat, lon: profile.birth_lon, country: '', tz: profile.birth_tz || 1 }
      : null
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  // Pre-fill from existing profile
  useEffect(() => {
    if (profile) {
      setUsername(profile.username)
      setDisplayName(profile.display_name || '')
      setBirthName(profile.birth_name || '')
      setBirthDate(profile.birth_date)
      setBirthTime(profile.birth_time?.slice(0, 5) || '')
      setBirthPlace(profile.birth_place || '')
      if (profile.birth_lat && profile.birth_lon) {
        setSelectedPlace({
          display: profile.birth_place || '',
          lat: profile.birth_lat,
          lon: profile.birth_lon,
          country: '',
          tz: profile.birth_tz || 1,
        })
      }
    }
  }, [profile])

  function handlePlaceSelect(place: PlaceSelection) {
    setSelectedPlace(place)
    setBirthPlace(place.display)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setMessage({ type: 'error', text: 'Not logged in. Please refresh.' })
      return
    }
    if (!birthDate) {
      setMessage({ type: 'error', text: 'Please enter your birth date.' })
      return
    }
    if (!selectedPlace) {
      setMessage({ type: 'error', text: 'Please select a birth place from the suggestions.' })
      return
    }
    setSaving(true)
    setMessage(null)

    try {
      // Parse birth date (expected format: YYYY-MM-DD)
      const parts = birthDate.split('-').map(Number)
      if (parts.length !== 3 || parts.some(isNaN)) {
        throw new Error('Invalid birth date format. Use YYYY-MM-DD.')
      }
      const [yyyy, mm, dd] = parts
      const [hh, mi] = birthTime ? birthTime.split(':').map(Number) : [12, 0]
      const hasBirthTime = !!birthTime

      // Compute natal chart
      const dst = isDST(yyyy, mm, dd, selectedPlace.tz)
      const tzOffset = selectedPlace.tz + (dst ? 1 : 0)
      const natalChart = calcNatalChart(dd, mm, yyyy, hh, mi, selectedPlace.lat, selectedPlace.lon, tzOffset)

      const sunSign = natalChart.planets.find(p => p.planet === 'Sun')?.sign || null
      const moonSign = natalChart.planets.find(p => p.planet === 'Moon')?.sign || null
      const risingSign = hasBirthTime
        ? natalChart.planets.find(p => p.planet === 'Ascendant')?.sign || null
        : null

      let numerologyResult = null
      let lifePath = null
      if (birthName) {
        const dateStr = `${dd}/${mm}/${yyyy}`
        numerologyResult = calcNumerology(dateStr, birthName)
        lifePath = numerologyResult?.core.lifePath ?? null
      }

      const profileData: ProfileInsert = {
        id: user.id,
        username: username.toLowerCase().trim(),
        display_name: displayName || null,
        birth_date: birthDate,
        birth_time: birthTime ? `${birthTime}:00` : null,
        birth_place: birthPlace || null,
        birth_lat: selectedPlace.lat,
        birth_lon: selectedPlace.lon,
        birth_tz: selectedPlace.tz,
        birth_name: birthName || null,
        sun_sign: sunSign,
        moon_sign: moonSign,
        rising_sign: risingSign,
        life_path: lifePath,
        natal_chart_json: JSON.parse(JSON.stringify(natalChart)),
        numerology_json: numerologyResult ? JSON.parse(JSON.stringify(numerologyResult)) : null,
      }

      // Direct REST fetch — bypasses stale Supabase client singleton
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

      // Get access token from cookie
      let token = anonKey
      if (typeof document !== 'undefined') {
        const projectRef = supabaseUrl.replace('https://', '').split('.')[0]
        const cookieName = `sb-${projectRef}-auth-token`
        const match = document.cookie.split('; ').find(c => c.startsWith(cookieName + '='))
        if (match) {
          try {
            const raw = decodeURIComponent(match.split('=').slice(1).join('='))
            const jsonStr = raw.startsWith('base64-') ? atob(raw.slice(7)) : raw
            const parsed = JSON.parse(jsonStr)
            token = parsed?.access_token ?? (Array.isArray(parsed) ? parsed[0] : anonKey)
          } catch { /* use anonKey */ }
        }
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      try {
        const url = profile
          ? `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`
          : `${supabaseUrl}/rest/v1/profiles`

        const res = await fetch(url, {
          method: profile ? 'PATCH' : 'POST',
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify(profileData),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!res.ok) {
          const body = await res.text()
          console.error('[settings] save error:', res.status, body)
          if (body.includes('username')) {
            setMessage({ type: 'error', text: 'Username is already taken.' })
          } else {
            setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' })
          }
        } else {
          await refreshProfile()
          setMessage({ type: 'success', text: 'Profile saved!' })
          if (isOnboarding) {
            router.push('/app/dashboard')
          }
        }
      } catch (fetchErr) {
        clearTimeout(timeoutId)
        console.error('[settings] fetch error:', fetchErr)
        setMessage({ type: 'error', text: 'Network error. Please try again.' })
      }
    } catch (err) {
      console.error('[settings] save exception:', err)
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Something went wrong while saving.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">
          {isOnboarding ? 'Complete Your Profile' : 'Settings'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isOnboarding
            ? 'Enter your birth details to unlock your cosmic blueprint.'
            : 'Update your profile and birth data.'}
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Username */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            placeholder="cosmic_soul"
            required
            minLength={3}
            maxLength={24}
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/[0.04]
              text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/25"
          />
        </div>

        {/* Display name */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/[0.04]
              text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/25"
          />
        </div>

        {/* Full name for numerology */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5">
            Full Birth Name <span className="text-slate-600">(for numerology)</span>
          </label>
          <input
            type="text"
            value={birthName}
            onChange={(e) => setBirthName(e.target.value)}
            placeholder="As it appears on your birth certificate"
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/[0.04]
              text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/25"
          />
        </div>

        {/* Birth date — accepts both native picker and manual DD/MM/YYYY */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5">
            Birth Date <span className="text-slate-600">(YYYY-MM-DD)</span>
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            required
            pattern="\d{4}-\d{2}-\d{2}"
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/[0.04]
              text-sm text-white focus:outline-none focus:border-white/25"
          />
          <p className="text-[10px] text-slate-600 mt-1">
            If the date picker doesn&apos;t open, type manually: e.g. 1995-03-24
          </p>
        </div>

        {/* Birth time — accepts both native picker and manual HH:MM */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5">
            Birth Time <span className="text-slate-600">(HH:MM, optional)</span>
          </label>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            placeholder="HH:MM"
            pattern="\d{2}:\d{2}"
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/[0.04]
              text-sm text-white focus:outline-none focus:border-white/25"
          />
          <p className="text-[10px] text-slate-600 mt-1">
            If the time picker doesn&apos;t open, type manually: e.g. 14:30
          </p>
        </div>

        {/* Birth place — uses the geocoding autocomplete component */}
        <BirthPlaceInput
          value={birthPlace}
          onChange={setBirthPlace}
          onSelect={handlePlaceSelect}
          selectedPlace={selectedPlace}
        />

        {/* Save */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-lg bg-white text-black text-sm font-medium
            hover:bg-white/90 disabled:opacity-30 transition-colors mt-2"
        >
          {saving ? 'Saving...' : isOnboarding ? 'Complete Setup' : 'Save Changes'}
        </button>

        {message && (
          <p className={`text-xs text-center p-3 rounded-lg border ${
            message.type === 'error'
              ? 'text-red-400 bg-red-400/10 border-red-400/20'
              : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
          }`}>
            {message.text}
          </p>
        )}
      </form>

      {/* Sign out */}
      {!isOnboarding && (
        <div className="mt-12 pt-6 border-t border-white/5">
          <button
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="text-sm text-slate-600 hover:text-red-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
