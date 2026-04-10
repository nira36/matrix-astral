'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-slate-600 text-sm animate-pulse">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  const redirect = searchParams.get('redirect') || '/app/dashboard'

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Check your email for the confirmation link.' })
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        router.push(redirect)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      {/* Back to site */}
      <a
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl
                   text-xs text-slate-500 hover:text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Back
      </a>

      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Logo / Title */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-white tracking-tight">Cosmic Love Matrix</h1>
          <p className="text-[11px] text-slate-500 mt-1">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Error from OAuth callback */}
        {searchParams.get('error') && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3 text-center">
            Authentication failed. Please try again.
          </p>
        )}

        {/* Email form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/[0.04]
              text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/25"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/[0.04]
              text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/25"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black text-sm font-bold
              hover:bg-white/90 disabled:opacity-50 transition-colors"
          >
            {loading ? '...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {message && (
          <p className={`text-xs text-center p-3 rounded-lg border ${
            message.type === 'error'
              ? 'text-red-400 bg-red-400/10 border-red-400/20'
              : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
          }`}>
            {message.text}
          </p>
        )}

        <p className="text-center text-xs text-slate-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setMessage(null) }}
            className="text-white/70 hover:text-white underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
