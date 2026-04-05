'use client'

import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X } from 'lucide-react'
import { ARCANA } from '@/lib/arcana'

// ─── Types ──────────────────────────────────────────────────────────────────

type CardType = 'major' | 'minor' | 'court'

interface CardMeta {
  type: CardType
  name: string
  color: string
  imgSrc: string
  keywords?: string[]
}

// ─── Build full deck ────────────────────────────────────────────────────────

const SUITS = [
  { key: 'wands', name: 'Wands', color: '#ef4444' },
  { key: 'cups', name: 'Cups', color: '#3b82f6' },
  { key: 'swords', name: 'Swords', color: '#a855f7' },
  { key: 'disks', name: 'Disks', color: '#f59e0b' },
]

const MINOR_RANKS = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const COURT_RANKS = ['Princess', 'Prince', 'Queen', 'King']

const ALL_CARDS: CardMeta[] = [
  // 23 Major Arcana (0-22)
  ...Array.from({ length: 23 }, (_, i) => {
    const appNum = i === 0 ? 22 : i
    const arcana = ARCANA[appNum]
    return {
      type: 'major' as CardType,
      name: arcana?.name ?? `Arcana ${i}`,
      color: arcana?.color ?? '#8b5cf6',
      imgSrc: `/deck/${String(i).padStart(2, '0')}.jpg`,
      keywords: arcana?.keywords?.slice(0, 3),
    }
  }),
  // 40 Minor Arcana (Ace-10 x 4 suits)
  ...SUITS.flatMap(suit =>
    MINOR_RANKS.map(rank => ({
      type: 'minor' as CardType,
      name: `${rank} of ${suit.name}`,
      color: suit.color,
      imgSrc: `/deck/minor/${suit.key}/${rank} of ${suit.name}.jpg`,
    }))
  ),
  // 16 Court Cards (Princess, Prince, Queen, King x 4 suits)
  ...SUITS.flatMap(suit =>
    COURT_RANKS.map(rank => ({
      type: 'court' as CardType,
      name: `${rank} of ${suit.name}`,
      color: suit.color,
      imgSrc: `/deck/court/${suit.key}/${rank} of ${suit.name}.jpg`,
    }))
  ),
]

const BACK_IMG = '/deck/back.jpg'

// ─── Spread definitions ─────────────────────────────────────────────────────

interface SpreadDef {
  key: string
  name: string
  slots: string[]
}

const SPREADS: SpreadDef[] = [
  {
    key: 'three',
    name: '3 Cards',
    slots: ['Past', 'Present', 'Future'],
  },
]

// ─── Flip Card ──────────────────────────────────────────────────────────────

function FlipCard({
  card,
  flipped,
  onFlip,
  onOpen,
}: {
  card: CardMeta | null
  flipped: boolean
  onFlip: () => void
  onOpen: () => void
}) {
  const [animDone, setAnimDone] = useState(false)

  // After flip animation completes, switch to 2D rendering for crisp image
  useEffect(() => {
    if (flipped) {
      const t = setTimeout(() => setAnimDone(true), 750)
      return () => clearTimeout(t)
    }
    setAnimDone(false)
  }, [flipped])

  // After animation: show flat image without 3D (crisp rendering)
  if (animDone && card) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onOpen}
          className="relative w-full aspect-[992/1583] rounded-2xl overflow-hidden cursor-pointer focus:outline-none"
          style={{ boxShadow: `0 0 30px ${card.color}44` }}
        >
          <Image
            src={card.imgSrc}
            alt={card.name}
            fill
            unoptimized
            className="object-cover object-center scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </button>
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-center"
            style={{ color: card.color }}
          >
            {card.name}
          </span>
          {card.keywords && (
            <span className="text-[7px] sm:text-[9px] text-slate-600 text-center max-w-[160px] line-clamp-2">
              {card.keywords.join(' · ')}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onFlip}
        disabled={!card || flipped}
        className="relative w-full aspect-[992/1583] cursor-pointer focus:outline-none disabled:cursor-default"
        style={{ perspective: '800px' }}
      >
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Back face */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {card ? (
              <Image
                src={BACK_IMG}
                alt="Card back"
                fill
                unoptimized
                className="object-cover object-center"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            ) : (
              <div className="w-full h-full rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                <span className="text-slate-700 text-xs font-bold">?</span>
              </div>
            )}
          </div>

          {/* Front face */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {card && (
              <Image
                src={card.imgSrc}
                alt={card.name}
                fill
                unoptimized
                className="object-cover object-center scale-[1.03]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            )}
          </div>
        </div>
      </button>

      <div className={`flex flex-col items-center gap-0.5 transition-opacity duration-500 ${flipped ? 'opacity-100' : 'opacity-0'}`}>
        {card && (
          <>
            <span
              className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-center"
              style={{ color: card.color }}
            >
              {card.name}
            </span>
            {card.keywords && (
              <span className="text-[7px] sm:text-[9px] text-slate-600 text-center max-w-[160px] line-clamp-2">
                {card.keywords.join(' · ')}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

// ─── Fullscreen Card Overlay ────────────────────────────────────────────────

function FullscreenCard({ card, label, onClose }: { card: CardMeta; label: string; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const content = (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-pointer"
      onClick={onClose}
    >
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
        {label}
      </span>
      <div
        className="relative w-[85vw] max-w-[360px] aspect-[992/1583] rounded-2xl overflow-hidden"
        style={{ boxShadow: `0 0 40px ${card.color}55` }}
      >
        <Image
          src={card.imgSrc}
          alt={card.name}
          fill
          unoptimized
          className="object-cover object-center scale-[1.03]"
          sizes="85vw"
        />
      </div>
      <div className="flex flex-col items-center gap-1 mt-3">
        <span
          className="text-sm font-black uppercase tracking-wider"
          style={{ color: card.color }}
        >
          {card.name}
        </span>
        {card.keywords && (
          <span className="text-[10px] text-slate-500">
            {card.keywords.join(' · ')}
          </span>
        )}
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(content, document.body)
}

// ─── Main Component ─────────────────────────────────────────────────────────

const STORAGE_KEY = 'tarot-reading-timestamp'
const STORAGE_CARDS_KEY = 'tarot-reading-cards'
const COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 hours

function getTimeLeft(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return 0
  const elapsed = Date.now() - parseInt(stored, 10)
  return Math.max(0, COOLDOWN_MS - elapsed)
}

function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function TarotReading() {
  const [spread] = useState<SpreadDef>(SPREADS[0])
  const [drawnCards, setDrawnCards] = useState<(CardMeta | null)[]>([])
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set())
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set())
  const [currentSlot, setCurrentSlot] = useState(0)
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [readingDone, setReadingDone] = useState(false)

  // On mount: restore previous reading if still within cooldown
  useEffect(() => {
    const remaining = getTimeLeft()
    if (remaining > 0) {
      setTimeLeft(remaining)
      setReadingDone(true)
      // Restore saved cards
      try {
        const saved = localStorage.getItem(STORAGE_CARDS_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as CardMeta[]
          setDrawnCards(parsed)
          setCurrentSlot(parsed.length)
          setFlippedSet(new Set(parsed.map((_, i) => i)))
        }
      } catch { /* ignore */ }
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      if (readingDone) {
        setReadingDone(false)
        setTimeLeft(0)
      }
      return
    }
    const interval = setInterval(() => {
      const remaining = getTimeLeft()
      if (remaining <= 0) {
        setTimeLeft(0)
        setReadingDone(false)
        clearInterval(interval)
      } else {
        setTimeLeft(remaining)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft, readingDone])

  const isComplete = currentSlot >= spread.slots.length
  const allFlipped = flippedSet.size === spread.slots.length

  const drawNext = useCallback(() => {
    if (isComplete) return

    // Pick a random card not yet drawn
    const available = ALL_CARDS.filter((_, i) => !usedIndices.has(i))
    if (available.length === 0) return
    const pick = available[Math.floor(Math.random() * available.length)]
    const pickIdx = ALL_CARDS.indexOf(pick)

    setUsedIndices(prev => new Set(prev).add(pickIdx))
    setDrawnCards(prev => {
      const next = [...prev]
      next[currentSlot] = pick
      return next
    })
    setCurrentSlot(prev => prev + 1)
  }, [currentSlot, isComplete, usedIndices])

  const flipCard = useCallback((slotIdx: number) => {
    if (flippedSet.has(slotIdx)) return
    setFlippedSet(prev => {
      const next = new Set(prev).add(slotIdx)
      // When all cards are flipped, lock the reading
      if (next.size === spread.slots.length) {
        localStorage.setItem(STORAGE_KEY, String(Date.now()))
        localStorage.setItem(STORAGE_CARDS_KEY, JSON.stringify(
          drawnCards.map(c => c) // save current cards
        ))
        setReadingDone(true)
        setTimeLeft(COOLDOWN_MS)
      }
      return next
    })
  }, [flippedSet, spread.slots.length, drawnCards])

  return (
    <div className="flex flex-col gap-8 items-center">
      {/* Cards layout — always in a row */}
      <div className="flex justify-center gap-3 sm:gap-6 md:gap-10 w-full px-2">
        {spread.slots.map((_, idx) => (
          <div key={idx} className="flex-1 max-w-[260px]">
            <FlipCard
              card={drawnCards[idx] ?? null}
              flipped={flippedSet.has(idx)}
              onFlip={() => flipCard(idx)}
              onOpen={() => setFullscreenIdx(idx)}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen overlay */}
      {fullscreenIdx !== null && drawnCards[fullscreenIdx] && (
        <FullscreenCard
          card={drawnCards[fullscreenIdx]!}
          label={spread.slots[fullscreenIdx]}
          onClose={() => setFullscreenIdx(null)}
        />
      )}

      {/* Actions */}
      <div className="flex flex-col items-center gap-2 mt-4">
        {!isComplete ? (
          <button
            onClick={drawNext}
            className="px-6 py-3 rounded-xl font-semibold text-sm tracking-wide text-white transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              boxShadow: '0 4px 28px rgba(124,58,237,0.3)',
            }}
          >
            Draw Card {currentSlot + 1} of {spread.slots.length}
          </button>
        ) : !allFlipped ? (
          <p className="text-slate-500 text-xs font-medium animate-pulse">
            Click the cards to reveal them
          </p>
        ) : readingDone && timeLeft > 0 ? (
          <div className="flex flex-col items-center gap-1.5">
            <button
              disabled
              className="px-6 py-3 rounded-xl font-semibold text-sm tracking-wide
                         border border-white/[0.06] transition-all duration-200
                         bg-white/[0.02] text-slate-600 cursor-not-allowed opacity-50"
            >
              New Reading
            </button>
            <span className="text-[10px] text-slate-700 font-mono tracking-wider">
              {formatCountdown(timeLeft)}
            </span>
          </div>
        ) : (
          <button
            onClick={() => {
              setDrawnCards([])
              setFlippedSet(new Set())
              setUsedIndices(new Set())
              setCurrentSlot(0)
              setReadingDone(false)
              localStorage.removeItem(STORAGE_KEY)
              localStorage.removeItem(STORAGE_CARDS_KEY)
            }}
            className="px-6 py-3 rounded-xl font-semibold text-sm tracking-wide text-white
                       border border-white/10 hover:border-white/20 transition-all duration-200
                       bg-white/[0.04] hover:bg-white/[0.08]"
          >
            New Reading
          </button>
        )}
      </div>
    </div>
  )
}
