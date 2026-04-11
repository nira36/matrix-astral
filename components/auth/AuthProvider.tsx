'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase/types'

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  loading: boolean
  profileLoading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: true,
  refreshProfile: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current
  const initialDoneRef = useRef(false)

  const fetchProfile = useCallback(async (userId: string, silent = false) => {
    // silent = true → background refresh (e.g. tab regain focus), don't show loading
    if (!silent) setProfileLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      console.log('[AuthProvider] fetchProfile:', data?.username ?? 'no profile', error?.message ?? 'ok')
      if (!error) setProfile(data)
    } catch (e) {
      console.error('[AuthProvider] fetchProfile error:', e)
    } finally {
      if (!silent) setProfileLoading(false)
    }
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id)
  }, [user, fetchProfile])

  useEffect(() => {
    let mounted = true

    // Initial session check — authoritative source via getUser()
    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      if (!mounted) return
      initialDoneRef.current = true
      setUser(u)
      if (u) {
        await fetchProfile(u.id)
      } else {
        setProfileLoading(false)
      }
      setLoading(false)
    }).catch(() => {
      if (mounted) {
        initialDoneRef.current = true
        setLoading(false)
        setProfileLoading(false)
      }
    })

    // Safety timeout — never stay on "Loading..." forever.
    // 3s is enough for getUser() on slow mobile networks.
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        initialDoneRef.current = true
        setLoading(false)
        setProfileLoading(false)
      }
    }, 3000)

    // Listen for auth changes — skip INITIAL_SESSION to avoid race with getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        // INITIAL_SESSION fires before getUser() resolves and may carry a stale
        // null session (especially with cookie-based SSR). We already handle
        // initial state via getUser(), so ignore this event entirely.
        if (event === 'INITIAL_SESSION') return
        // For other events, wait until the initial getUser() has completed so we
        // don't overwrite its result.
        if (!initialDoneRef.current) return

        const u = session?.user ?? null
        setUser(u)
        if (u) {
          // If we already have a profile, refresh silently in the background
          // (e.g. tab regain fires TOKEN_REFRESHED or SIGNED_IN again).
          // Only show loading spinner on genuine first login.
          const silent = initialDoneRef.current
          await fetchProfile(u.id, silent)
        } else {
          setProfile(null)
          setProfileLoading(false)
        }
        setLoading(false)
      },
    )
    return () => { mounted = false; clearTimeout(safetyTimer); subscription.unsubscribe() }
  }, [supabase, fetchProfile])

  return (
    <AuthContext.Provider value={{ user, profile, loading, profileLoading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
