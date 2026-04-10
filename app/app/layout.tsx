'use client'

import { useState, useEffect } from 'react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Close sidebar on Escape key
  useEffect(() => {
    if (!sidebarOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [sidebarOpen])

  useEffect(() => {
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
    return null
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Hamburger button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 w-10 h-10 rounded-xl border border-white/[0.08]
                   bg-bg-primary/80 backdrop-blur-md flex items-center justify-center
                   text-slate-400 hover:text-white hover:border-white/20
                   transition-all duration-200"
        aria-label="Open menu"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="3" y1="5" x2="15" y2="5" />
          <line x1="3" y1="9" x2="15" y2="9" />
          <line x1="3" y1="13" x2="15" y2="13" />
        </svg>
      </button>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-bg-primary border-r border-white/[0.06]
                    flex flex-col transition-transform duration-300 ease-out ${
                      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <Link href="/app/dashboard" className="text-sm font-black text-white tracking-tight">
            Cosmic Love Matrix
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center
                       text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            aria-label="Close menu"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="2" y1="2" x2="12" y2="12" />
              <line x1="12" y1="2" x2="2" y2="12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
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
