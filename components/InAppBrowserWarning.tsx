'use client'

import { useEffect, useState } from 'react'

// Detects in-app browsers (Instagram, Facebook, Gmail, Telegram, WhatsApp, etc.)
// These often have broken input[type=date], cookie issues, and API limitations.
function detectInAppBrowser(): { isInApp: boolean; source: string } {
  if (typeof navigator === 'undefined') return { isInApp: false, source: '' }
  const ua = navigator.userAgent || ''

  const patterns: { re: RegExp; name: string }[] = [
    { re: /Instagram/i, name: 'Instagram' },
    { re: /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i, name: 'Facebook' },
    { re: /Messenger/i, name: 'Messenger' },
    { re: /Line\//i, name: 'Line' },
    { re: /Twitter/i, name: 'Twitter / X' },
    { re: /TikTok|BytedanceWebview|musical_ly/i, name: 'TikTok' },
    { re: /Snapchat/i, name: 'Snapchat' },
    { re: /WhatsApp/i, name: 'WhatsApp' },
    { re: /Telegram/i, name: 'Telegram' },
    { re: /LinkedInApp/i, name: 'LinkedIn' },
    { re: /GSA\//i, name: 'Google App' },
  ]

  for (const p of patterns) {
    if (p.re.test(ua)) return { isInApp: true, source: p.name }
  }

  return { isInApp: false, source: '' }
}

export default function InAppBrowserWarning() {
  const [state, setState] = useState<{ isInApp: boolean; source: string; dismissed: boolean }>({
    isInApp: false,
    source: '',
    dismissed: false,
  })

  useEffect(() => {
    const { isInApp, source } = detectInAppBrowser()
    const dismissed = typeof localStorage !== 'undefined'
      ? localStorage.getItem('inapp_warning_dismissed') === '1'
      : false
    setState({ isInApp, source, dismissed })
  }, [])

  if (!state.isInApp || state.dismissed) return null

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      // ignore
    }
  }

  function dismiss() {
    try {
      localStorage.setItem('inapp_warning_dismissed', '1')
    } catch {
      // ignore
    }
    setState(s => ({ ...s, dismissed: true }))
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-900/90 backdrop-blur-md border-b border-amber-500/30 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-amber-100 leading-relaxed">
            You&apos;re using the <strong>{state.source}</strong> in-app browser. Some features may not work correctly. For the best experience, please open this page in <strong>Safari</strong> or <strong>Chrome</strong>.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={copyLink}
              className="text-[11px] font-bold text-amber-200 hover:text-white underline"
            >
              Copy link
            </button>
            <button
              onClick={dismiss}
              className="text-[11px] text-amber-300/70 hover:text-amber-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
