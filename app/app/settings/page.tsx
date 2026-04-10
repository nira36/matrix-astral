'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { calcNatalChart, isDST } from '@/lib/astrology'
import { calculate as calcNumerology } from '@/lib/numerology'
import BirthPlaceInput, { type PlaceSelection } from '@/components/BirthPlaceInput'

type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

export default function SettingsPage() {
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
    if (!user) return
    if (!selectedPlace) {
      setMessage({ type: 'error', text: 'Please select a birth place from the suggestions.' })
      return
    }
    setSaving(true)
    setMessage(null)

    // Parse birth date
    const [yyyy, mm, dd] = birthDate.split('-').map(Number)
    const [hh, mi] = birthTime ? birthTime.split(':').map(Number) : [12, 0]
    const hasBirthTime = !!birthTime

    // Compute natal chart
    const dst = isDST(yyyy, mm, dd, selectedPlace.tz)
    const tzOffset = selectedPlace.tz + (dst ? 1 : 0)
    const natalChart = calcNatalChart(dd, mm, yyyy, hh, mi, selectedPlace.lat, selectedPlace.lon, tzOffset)

    // Extract identity
    const sunSign = natalChart.planets.find(p => p.planet === 'Sun')?.sign || null
    const moonSign = natalChart.planets.find(p => p.planet === 'Moon')?.sign || null
    const risingSign = hasBirthTime
      ? natalChart.planets.find(p => p.planet === 'Ascendant')?.sign || null
      : null

    // Compute numerology (if we have a name)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { error } = profile
      ? await db.from('profiles').update(profileData).eq('id', user.id)
      : await db.from('profiles').insert(profileData)

    if (error) {
      if (error.code === '23505' && error.message.includes('username')) {
        setMessage({ type: 'error', text: 'Username is already taken.' })
      } else {
        setMessage({ type: 'error', text: error.message })
      }
    } else {
      await refreshProfile()
      setMessage({ type: 'success', text: 'Profile saved!' })
      if (isOnboarding) {
        router.push('/app/dashboard')
      }
    }
    setSaving(false)
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
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
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
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
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
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
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

        {/* Birth date */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
            Birth Date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/[0.04]
              text-sm text-white focus:outline-none focus:border-white/25"
          />
        </div>

        {/* Birth time */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
            Birth Time <span className="text-slate-600">(optional, for accurate rising sign)</span>
          </label>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/[0.04]
              text-sm text-white focus:outline-none focus:border-white/25"
          />
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
          className="w-full py-3 rounded-xl bg-white text-black text-sm font-bold
            hover:bg-white/90 disabled:opacity-50 transition-colors mt-2"
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
    </div>
  )
}
