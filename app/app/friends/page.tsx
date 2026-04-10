'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface FriendProfile {
  id: string
  username: string
  display_name: string | null
  sun_sign: string | null
  moon_sign: string | null
  rising_sign: string | null
}

interface FriendRow {
  id: string
  requester: string
  addressee: string
  status: string
  friendProfile: FriendProfile
}

const supabase = createClient()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

async function fetchFriendships(userId: string): Promise<{
  friends: FriendRow[]
  pendingIncoming: FriendRow[]
  pendingSent: FriendRow[]
}> {
  const empty = { friends: [], pendingIncoming: [], pendingSent: [] }

  const { data: rows, error } = await db
    .from('friendships')
    .select('*')
    .or(`requester.eq.${userId},addressee.eq.${userId}`)

  if (error || !rows || rows.length === 0) return empty

  const friendIds = rows.map((r: any) => r.requester === userId ? r.addressee : r.requester)
  const { data: profiles } = await db
    .from('profiles')
    .select('id, username, display_name, sun_sign, moon_sign, rising_sign')
    .in('id', friendIds)

  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]))

  const enriched: FriendRow[] = rows
    .map((r: any) => ({
      ...r,
      friendProfile: profileMap.get(r.requester === userId ? r.addressee : r.requester),
    }))
    .filter((r: FriendRow) => r.friendProfile)

  return {
    friends: enriched.filter(r => r.status === 'accepted'),
    pendingIncoming: enriched.filter(r => r.status === 'pending' && r.addressee === userId),
    pendingSent: enriched.filter(r => r.status === 'pending' && r.requester === userId),
  }
}

export default function FriendsPage() {
  const { user, profile } = useAuth()

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FriendProfile[]>([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [friends, setFriends] = useState<FriendRow[]>([])
  const [pendingIncoming, setPendingIncoming] = useState<FriendRow[]>([])
  const [pendingSent, setPendingSent] = useState<FriendRow[]>([])
  const [loadingFriends, setLoadingFriends] = useState(true)

  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copiedInvite, setCopiedInvite] = useState(false)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  // ─── Load all friendships ──────────────────────────────────────────
  async function reload() {
    if (!user) return
    const data = await fetchFriendships(user.id)
    setFriends(data.friends)
    setPendingIncoming(data.pendingIncoming)
    setPendingSent(data.pendingSent)
    setLoadingFriends(false)
  }

  // Initial load — wait for user, then fetch
  useEffect(() => {
    if (!user) return
    setLoadingFriends(true)
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // ─── Search ────────────────────────────────────────────────────────
  function handleSearch(val: string) {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.length < 2) { setSearchResults([]); setSearching(false); return }
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await db
          .from('profiles')
          .select('id, username, display_name, sun_sign, moon_sign, rising_sign')
          .ilike('username', `%${val}%`)
          .neq('id', user?.id ?? '')
          .limit(10)
        setSearchResults((data as FriendProfile[]) ?? [])
      } catch {
        setSearchResults([])
      }
      setSearching(false)
    }, 300)
  }

  // ─── Actions ───────────────────────────────────────────────────────
  function showMsg(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 3000)
  }

  async function sendRequest(addresseeId: string) {
    if (!user) return
    const { error } = await db.from('friendships').insert({
      requester: user.id,
      addressee: addresseeId,
      status: 'pending',
    })
    if (error) {
      showMsg(error.code === '23505' ? 'Request already sent.' : error.message)
    } else {
      showMsg('Request sent!')
      setQuery('')
      setSearchResults([])
      await reload()
    }
  }

  async function acceptRequest(friendshipId: string) {
    const { error } = await db.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)
    if (error) {
      showMsg('Failed to accept: ' + error.message)
      return
    }
    showMsg('Friend added!')
    await reload()
  }

  async function declineRequest(friendshipId: string) {
    await db.from('friendships').delete().eq('id', friendshipId)
    await reload()
  }

  async function removeFriend(friendshipId: string) {
    await db.from('friendships').delete().eq('id', friendshipId)
    showMsg('Friend removed.')
    await reload()
  }

  async function generateInvite() {
    if (!user) return
    const { data, error } = await db
      .from('invite_links')
      .insert({ creator: user.id, max_uses: 5 })
      .select('token')
      .single()
    if (!error && data) {
      setInviteLink(`${window.location.origin}/invite/${data.token}`)
    }
  }

  function copyInvite() {
    if (!inviteLink) return
    navigator.clipboard.writeText(inviteLink)
    setCopiedInvite(true)
    setTimeout(() => setCopiedInvite(false), 2000)
  }

  function friendStatus(userId: string): 'friend' | 'pending_sent' | 'pending_incoming' | null {
    if (friends.some(f => f.friendProfile.id === userId)) return 'friend'
    if (pendingSent.some(f => f.friendProfile.id === userId)) return 'pending_sent'
    if (pendingIncoming.some(f => f.friendProfile.id === userId)) return 'pending_incoming'
    return null
  }

  if (!profile) return null

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl text-white">Friends</h1>
        <p className="text-sm text-slate-500 mt-1">
          Connect with others and explore cosmic compatibility.
        </p>
      </div>

      {actionMsg && (
        <div className="mb-4 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-3 text-center">
          {actionMsg}
        </div>
      )}

      {/* Search */}
      <div className="mb-8">
        <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
          Find People
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by username..."
          className="w-full py-2.5 px-4 rounded-lg border border-white/10 bg-white/[0.04]
            text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20"
        />
        {searching && <p className="text-xs text-slate-600 mt-2">Searching...</p>}

        {searchResults.length > 0 && (
          <div className="mt-2 rounded-xl border border-white/5 bg-bg-card overflow-hidden">
            {searchResults.map((p) => {
              const status = friendStatus(p.id)
              return (
                <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.04] last:border-b-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-semibold text-white/50 shrink-0">
                      {(p.display_name || p.username)?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{p.display_name || p.username}</p>
                      <p className="text-[10px] text-slate-600">
                        @{p.username}
                        {p.sun_sign && ` · ☉ ${p.sun_sign}`}
                      </p>
                    </div>
                  </div>
                  {status === 'friend' ? (
                    <span className="text-xs text-emerald-400/70">Friends</span>
                  ) : status === 'pending_sent' ? (
                    <span className="text-xs text-amber-400/70">Pending</span>
                  ) : (
                    <button
                      onClick={() => sendRequest(p.id)}
                      className="text-xs text-white bg-white/10 hover:bg-white/20
                        px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                      Add
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pending incoming */}
      {pendingIncoming.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-400/80 mb-3">
            Friend Requests ({pendingIncoming.length})
          </p>
          <div className="rounded-xl border border-white/5 bg-bg-card overflow-hidden">
            {pendingIncoming.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.04] last:border-b-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-semibold text-white/50 shrink-0">
                    {(f.friendProfile.display_name || f.friendProfile.username)?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{f.friendProfile.display_name || f.friendProfile.username}</p>
                    <p className="text-[10px] text-slate-600">@{f.friendProfile.username}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => acceptRequest(f.id)}
                    className="text-xs text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20
                      px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => declineRequest(f.id)}
                    className="text-xs text-slate-500 bg-white/[0.04] hover:bg-white/[0.08]
                      px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
          Your Friends ({friends.length})
        </p>
        {loadingFriends ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : friends.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-bg-card p-6 text-center">
            <p className="text-sm text-slate-600">No friends yet. Search above or share an invite link.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-bg-card overflow-hidden">
            {friends.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.04] last:border-b-0">
                <Link
                  href={`/app/friends/${f.friendProfile.username}`}
                  className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity"
                >
                  <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-semibold text-white/50 shrink-0">
                    {(f.friendProfile.display_name || f.friendProfile.username)?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{f.friendProfile.display_name || f.friendProfile.username}</p>
                    <p className="text-[10px] text-slate-600">
                      @{f.friendProfile.username}
                      {f.friendProfile.sun_sign && ` · ☉ ${f.friendProfile.sun_sign}`}
                      {f.friendProfile.moon_sign && ` ☽ ${f.friendProfile.moon_sign}`}
                      {f.friendProfile.rising_sign && ` AC ${f.friendProfile.rising_sign}`}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => removeFriend(f.id)}
                  className="text-[10px] text-slate-600 hover:text-red-400 transition-colors shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending sent */}
      {pendingSent.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
            Sent Requests ({pendingSent.length})
          </p>
          <div className="rounded-xl border border-white/5 bg-bg-card overflow-hidden">
            {pendingSent.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.04] last:border-b-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-semibold text-white/50 shrink-0">
                    {(f.friendProfile.display_name || f.friendProfile.username)?.[0]?.toUpperCase()}
                  </div>
                  <p className="text-sm text-white truncate">{f.friendProfile.display_name || f.friendProfile.username}</p>
                </div>
                <button
                  onClick={() => declineRequest(f.id)}
                  className="text-[10px] text-slate-600 hover:text-red-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite link */}
      <div className="rounded-xl border border-white/5 bg-bg-card p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
          Invite Link
        </p>
        {inviteLink ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 py-2 px-3 rounded-lg border border-white/10 bg-white/[0.04]
                text-xs text-slate-400 font-mono truncate"
            />
            <button
              onClick={copyInvite}
              className="text-xs text-white bg-white/10 hover:bg-white/20
                px-4 py-2 rounded-lg transition-colors shrink-0"
            >
              {copiedInvite ? 'Copied!' : 'Copy'}
            </button>
          </div>
        ) : (
          <button
            onClick={generateInvite}
            className="text-xs text-white bg-white/10 hover:bg-white/20
              px-4 py-2 rounded-lg transition-colors"
          >
            Generate Invite Link
          </button>
        )}
        <p className="text-[10px] text-slate-600 mt-2">
          Share this link. They sign up and you connect automatically.
        </p>
      </div>
    </div>
  )
}
