'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
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
  label,
  flipped,
  onFlip,
}: {
  card: CardMeta | null
  label: string
  flipped: boolean
  onFlip: () => void
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
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          {label}
        </span>
        <div
          className="relative w-[260px] sm:w-[165px] md:w-[260px] aspect-[992/1583] rounded-2xl overflow-hidden"
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
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="text-[11px] font-black uppercase tracking-wider text-center"
            style={{ color: card.color }}
          >
            {card.name}
          </span>
          {card.keywords && (
            <span className="text-[9px] text-slate-600 text-center max-w-[160px] line-clamp-2">
              {card.keywords.join(' · ')}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        {label}
      </span>

      <button
        onClick={onFlip}
        disabled={!card || flipped}
        className="relative w-[260px] sm:w-[165px] md:w-[260px] aspect-[992/1583] cursor-pointer focus:outline-none disabled:cursor-default"
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
              className="text-[11px] font-black uppercase tracking-wider text-center"
              style={{ color: card.color }}
            >
              {card.name}
            </span>
            {card.keywords && (
              <span className="text-[9px] text-slate-600 text-center max-w-[160px] line-clamp-2">
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

export default function TarotReading() {
  const [spread] = useState<SpreadDef>(SPREADS[0])
  const [drawnCards, setDrawnCards] = useState<(CardMeta | null)[]>([])
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set())
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set())
  const [currentSlot, setCurrentSlot] = useState(0)

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
    setFlippedSet(prev => new Set(prev).add(slotIdx))
  }, [flippedSet])

  const reset = useCallback(() => {
    setDrawnCards([])
    setFlippedSet(new Set())
    setUsedIndices(new Set())
    setCurrentSlot(0)
  }, [])

  return (
    <div className="flex flex-col gap-8 items-center">
      {/* Header */}
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-4xl font-black tracking-tight text-white uppercase">
          Tarot{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Reading
          </span>
        </h2>
        <p className="text-slate-500 text-xs font-medium max-w-md mx-auto">
          {spread.name} — {spread.slots.join(', ')}
        </p>
      </div>

      {/* Cards layout */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {spread.slots.map((label, idx) => (
          <FlipCard
            key={idx}
            card={drawnCards[idx] ?? null}
            label={label}
            flipped={flippedSet.has(idx)}
            onFlip={() => flipCard(idx)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
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
        ) : (
          <button
            onClick={reset}
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
