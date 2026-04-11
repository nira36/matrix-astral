'use client'

import { useEffect } from 'react'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-6">
      <div className="max-w-sm w-full text-center flex flex-col gap-5">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="w-full py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="w-full py-3 rounded-lg border border-white/10 text-slate-400 text-sm hover:text-white hover:border-white/20 transition-colors"
          >
            Go home
          </a>
        </div>
        {error.digest && (
          <p className="text-[10px] text-slate-700 font-mono">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
