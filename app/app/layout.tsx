'use client'

import { useEffect } from 'react'
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/app/dashboard', label: 'Dashboard', icon: '◉' },
  { href: '/app/chart',     label: 'My Chart',  icon: '☉' },
  { href: '/app/friends',   label: 'Friends',   icon: '☌' },
  { href: '/app/settings',  label: 'Settings',  icon: '⚙' },
]

function AppShell({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, profileLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Wait for both auth and profile to finish loading
    if (loading || profileLoading) return

    if (!user) {
      router.replace('/login')
      return
    }

    if (!profile && !pathname.includes('/settings')) {
      router.replace('/app/settings?onboarding=true')
    }
  }, [loading, profileLoading, user, profile, pathname, router])

  if (loading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-slate-600 text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // redirecting to login
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/[0.06] bg-bg-primary flex flex-col">
        <div className="p-5 border-b border-white/[0.06]">
          <Link href="/app/dashboard" className="text-sm font-black text-white tracking-tight">
            Cosmic Love Matrix
          </Link>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-white/[0.08] text-white font-medium'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-white/[0.06]">
          {profile && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-bold text-white/60">
                {(profile.display_name || profile.username)?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {profile.display_name || profile.username}
                </p>
                <p className="text-[10px] text-slate-600 truncate">
                  {profile.sun_sign && `☉ ${profile.sun_sign}`}
                  {profile.moon_sign && ` ☽ ${profile.moon_sign}`}
                  {profile.rising_sign && ` AC ${profile.rising_sign}`}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="w-full text-left text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  )
}
