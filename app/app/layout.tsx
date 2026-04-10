'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  {
    href: '/app/dashboard',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/app/chart',
    label: 'Chart',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    href: '/app/friends',
    label: 'Friends',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/app/settings',
    label: 'Settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

// ─── Toast notification ──────────────────────────────────────────────────────
interface Toast {
  id: number
  message: string
  link?: string
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90vw] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-bg-elevated border border-white/10 rounded-xl px-4 py-3 shadow-xl shadow-black/40
                     flex items-center gap-3 animate-fade-up"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white">{t.message}</p>
          </div>
          {t.link && (
            <Link
              href={t.link}
              onClick={() => onDismiss(t.id)}
              className="text-xs text-amber-400 hover:text-amber-300 shrink-0 transition-colors"
            >
              View
            </Link>
          )}
          <button
            onClick={() => onDismiss(t.id)}
            className="text-slate-600 hover:text-slate-400 shrink-0 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="3" x2="11" y2="11" />
              <line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Friend request poller ───────────────────────────────────────────────────
function useFriendNotifications(userId: string | undefined) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const knownRequestsRef = useRef<Set<string>>(new Set())
  const initialLoadRef = useRef(true)
  const toastIdRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Auto-dismiss after 8s
  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map(t =>
      setTimeout(() => dismiss(t.id), 8000)
    )
    return () => timers.forEach(clearTimeout)
  }, [toasts, dismiss])

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any

    async function checkRequests() {
      const { data } = await db
        .from('friendships')
        .select('id, requester, requester_profile:profiles!friendships_requester_fkey(display_name, username)')
        .eq('addressee', userId)
        .eq('status', 'pending')

      if (!data) return

      const currentIds = new Set(data.map((r: any) => r.id as string))

      // On first load, just record what we know — don't toast
      if (initialLoadRef.current) {
        knownRequestsRef.current = currentIds
        initialLoadRef.current = false
        return
      }

      // Find new requests
      for (const row of data) {
        if (!knownRequestsRef.current.has(row.id)) {
          const name = row.requester_profile?.display_name || row.requester_profile?.username || 'Someone'
          setToasts(prev => [...prev, {
            id: ++toastIdRef.current,
            message: `${name} wants to connect with you`,
            link: '/app/friends',
          }])
        }
      }

      knownRequestsRef.current = currentIds
    }

    // Check immediately, then every 8s
    checkRequests()
    const interval = setInterval(checkRequests, 8_000)
    return () => clearInterval(interval)
  }, [userId])

  return { toasts, dismiss }
}

// ─── App Shell ───────────────────────────────────────────────────────────────
function AppShell({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, profileLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const { toasts, dismiss } = useFriendNotifications(user?.id)

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

  if (!user) return null

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* ── Desktop: thin left rail ── */}
      <aside className="hidden md:flex fixed top-0 left-0 z-40 h-full w-14 flex-col items-center
                         border-r border-white/5 bg-bg-primary py-5">
        <Link href="/app/dashboard" className="mb-8 text-white/40 hover:text-white transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
          </svg>
        </Link>

        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group
                  ${active
                    ? 'text-white bg-white/[0.08]'
                    : 'text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]'
                  }`}
                title={item.label}
              >
                {item.icon}
                <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm
                                 text-[11px] font-medium text-white whitespace-nowrap
                                 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {profile && (
          <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center
                          text-[11px] font-semibold text-white/50">
            {(profile.display_name || profile.username)?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </aside>

      {/* ── Main content ── */}
      <main className="md:ml-14 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* ── Mobile: bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40
                       border-t border-white/5 bg-bg-primary/90 backdrop-blur-md
                       flex items-center justify-around px-2 py-1.5 safe-bottom">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors
                ${active ? 'text-white' : 'text-slate-600'}`}
            >
              {item.icon}
              <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
            </Link>
          )
        })}
      </nav>
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
