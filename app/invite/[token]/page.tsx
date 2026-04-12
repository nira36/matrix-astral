'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function redeem() {
      const supabase = createClient()

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Redirect to login, then back here
        router.push(`/login?redirect=/invite/${token}`)
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any

      // Look up the invite
      const { data: invite, error: inviteErr } = await db
        .from('invite_links')
        .select('*')
        .eq('token', token)
        .single()

      if (inviteErr || !invite) {
        setStatus('error')
        setMessage('Invalid or expired invite link.')
        return
      }

      const inv = invite as any

      if (inv.used_count >= inv.max_uses) {
        setStatus('error')
        setMessage('This invite link has reached its maximum uses.')
        return
      }

      if (new Date(inv.expires_at) < new Date()) {
        setStatus('error')
        setMessage('This invite link has expired.')
        return
      }

      if (inv.creator === user.id) {
        setStatus('error')
        setMessage("You can't use your own invite link.")
        return
      }

      // Check if already friends
      const { data: existing } = await db
        .from('friendships')
        .select('id')
        .or(`and(requester.eq.${inv.creator},addressee.eq.${user.id}),and(requester.eq.${user.id},addressee.eq.${inv.creator})`)
        .limit(1)

      if (existing && (existing as any[]).length > 0) {
        setStatus('success')
        setMessage('You are already connected with this person!')
        setTimeout(() => router.push('/app/friends'), 2000)
        return
      }

      // Create friendship (auto-accepted via invite)
      // Current user becomes the addressee (they're accepting the invite)
      const { error: friendErr } = await db.from('friendships').insert({
        requester: inv.creator,
        addressee: user.id,
        status: 'accepted',
      })

      if (friendErr) {
        setStatus('error')
        setMessage('Could not create friendship. ' + (friendErr as any).message)
        return
      }

      // Increment used_count
      await db
        .from('invite_links')
        .update({ used_count: inv.used_count + 1 })
        .eq('id', inv.id)

      setStatus('success')
      setMessage('You are now connected! Redirecting...')
      setTimeout(() => router.push('/app/friends'), 2000)
    }

    redeem()
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="text-center max-w-sm">
        <h1 className="text-xl font-black text-white mb-3">Cosmic Love Matrix</h1>
        {status === 'loading' && (
          <p className="text-sm text-slate-500">Processing invite...</p>
        )}
        {status === 'error' && (
          <div>
            <p className="text-sm text-red-400 mb-4">{message}</p>
            <button
              onClick={() => router.push('/app/friends')}
              className="text-sm text-white/60 underline hover:text-white"
            >
              Go to Friends
            </button>
          </div>
        )}
        {status === 'success' && (
          <p className="text-sm text-emerald-400">{message}</p>
        )}
      </div>
    </div>
  )
}
