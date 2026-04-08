'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ARCANA } from '@/lib/arcana'
import { MINOR_ARCANA, COURT_CARDS } from '@/lib/minor-arcana'
import TarotReading, { SPREADS, type SpreadDef } from '@/components/TarotReading'

// ─── Deck metadata ────────────────────────────────────────────────────────────
// Images: /public/deck/00.jpg (Fool) → /public/deck/21.jpg (World)
// Traditional numbering: 0 = Fool, 1 = Magician, … 21 = World
// appNum: maps to ARCANA keys (22 = Fool in this app's system)

interface CardMeta {
  traditional: number   // 0-21
  appNum: number        // 1-22 (app's internal arcana key)
  roman: string
  subtitle: string
}

const DECK: CardMeta[] = [
  { traditional: 0,  appNum: 22, roman: '0',      subtitle: 'The Chaos'      },
  { traditional: 1,  appNum:  1, roman: 'I',      subtitle: 'The Genesis'    },
  { traditional: 2,  appNum:  2, roman: 'II',     subtitle: 'The Intention'  },
  { traditional: 3,  appNum:  3, roman: 'III',    subtitle: 'The Creation'   },
  { traditional: 4,  appNum:  4, roman: 'IV',     subtitle: 'The Art'        },
  { traditional: 5,  appNum:  5, roman: 'V',      subtitle: 'The Faith'      },
  { traditional: 6,  appNum:  6, roman: 'VI',     subtitle: 'The Union'      },
  { traditional: 7,  appNum:  7, roman: 'VII',    subtitle: 'The Direction'  },
  { traditional: 8,  appNum:  8, roman: 'VIII',   subtitle: 'The Magic'      },
  { traditional: 9,  appNum:  9, roman: 'IX',     subtitle: 'The Abyss'      },
  { traditional: 10, appNum: 10, roman: 'X',      subtitle: 'The Circle'     },
  { traditional: 11, appNum: 11, roman: 'XI',     subtitle: 'Equilibrium'    },
  { traditional: 12, appNum: 12, roman: 'XII',    subtitle: 'The Vision'     },
  { traditional: 13, appNum: 13, roman: 'XIII',   subtitle: 'Transformation' },
  { traditional: 14, appNum: 14, roman: 'XIV',    subtitle: 'Catharsis'      },
  { traditional: 15, appNum: 15, roman: 'XV',     subtitle: 'The Duality'    },
  { traditional: 16, appNum: 16, roman: 'XVI',    subtitle: 'The Devotion'   },
  { traditional: 17, appNum: 17, roman: 'XVII',   subtitle: 'The Initiation' },
  { traditional: 18, appNum: 18, roman: 'XVIII',  subtitle: 'The Immanence'  },
  { traditional: 19, appNum: 19, roman: 'XIX',    subtitle: 'The Trascendence' },
  { traditional: 20, appNum: 20, roman: 'XX',     subtitle: 'The Nemesis'    },
  { traditional: 21, appNum: 21, roman: 'XXI',    subtitle: 'The Cosmos'     },
  { traditional: 22, appNum: 22, roman: 'XXII',   subtitle: '∞'       },
]


function imgPath(traditional: number) {
  return `/deck/${String(traditional).padStart(2, '0')}.jpg`
}

/** First card (traditional 0) is The Fool; last card (traditional 22) is The Heirs */
function deckName(card: CardMeta): string {
  if (card.traditional === 0) return 'The Fool'
  if (card.traditional === 22) return 'The Heirs'
  return ARCANA[card.appNum]?.name ?? `Arcana ${card.traditional}`
}

/** Returns arcana metadata for the deck, overriding the special cards */
function deckArcana(card: CardMeta) {
  if (card.traditional === 22) {
    return {
      ...ARCANA[22],
      name: 'The Heirs',
      color: '#fde68a',
      keywords: ['Potential', 'Awakening', 'Spiritual Heritage', 'Soul Mission'],
      description:
        'The Heirs are the predestined ones, those who can cross the 22 Gates and who have the task and duty of completing the Complete and Eternal Cycle, understanding its aspects and defining the subject, context, time, space, and cause through the 5W \'who?-what?-when?-where?-why?\' for each Gate and each Cycle.',
    }
  }
  return ARCANA[card.appNum]
}

// ─── Card component ───────────────────────────────────────────────────────────

function DeckCard({
  card,
  onClick,
}: {
  card: CardMeta
  onClick: () => void
}) {
  const arcana = deckArcana(card)
  const [hasImage, setHasImage] = useState(true)
  const src = imgPath(card.traditional)

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center cursor-pointer focus:outline-none w-[260px] sm:w-[165px] md:w-[180px]"
      style={{ '--card-color': arcana?.color ?? '#8b5cf6' } as React.CSSProperties}
    >
      {/* Card frame */}
      <div
        className="relative w-full aspect-[992/1583] rounded-2xl overflow-hidden transition-all duration-300
                   group-hover:scale-[1.03]"
        style={{
          boxShadow: `0 0 22px ${arcana?.color ?? '#8b5cf6'}55`,
        }}
      >

        {hasImage ? (
          <Image
            src={src}
            alt={deckName(card)}
            fill
            className="object-cover object-center scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={() => setHasImage(false)}
          />
        ) : (
          /* Placeholder when image is missing */
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3"
            style={{ background: `${arcana?.color ?? '#8b5cf6'}0d` }}
          >
            <span className="text-3xl font-black opacity-20" style={{ color: arcana?.color }}>
              {card.roman}
            </span>
            <span className="text-[9px] text-slate-600 uppercase tracking-widest text-center px-2">
              {deckName(card)}
            </span>
          </div>
        )}
      </div>

      {/* Roman numeral + name */}
      <div className="mt-2 flex flex-col items-center gap-0.5 w-full px-1">
        <span className="text-[8px] font-mono text-slate-600 tracking-widest">{card.roman}</span>
        <span
          className="text-[10px] font-black uppercase tracking-widest text-center leading-tight"
          style={{ color: arcana?.color ?? '#8b5cf6' }}
        >
          {deckName(card)}
        </span>
        <span className="text-[8px] text-slate-600 tracking-[0.2em] uppercase">
          {card.subtitle}
        </span>
      </div>
    </button>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  card,
  onClose,
  onPrev,
  onNext,
}: {
  card: CardMeta
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const arcana = deckArcana(card)
  const [hasImage, setHasImage] = useState(true)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col md:flex-row gap-4 md:gap-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Card image */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3">
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{
              height: 'min(45vh, 400px)',
              aspectRatio: '1.8/3',
              boxShadow: `0 0 40px ${arcana?.color ?? '#8b5cf6'}55`
            }}
          >
            {hasImage ? (
              <Image
                src={imgPath(card.traditional)}
                alt={deckName(card)}
                fill
                className="object-cover"
                sizes="260px"
                onError={() => setHasImage(false)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: `${arcana?.color ?? '#8b5cf6'}11` }}
              >
                <span className="text-6xl font-black opacity-10" style={{ color: arcana?.color }}>
                  {card.roman}
                </span>
              </div>
            )}
          </div>

          {/* Nav arrows */}
          <div className="flex gap-4">
            <button
              onClick={onPrev}
              className="p-2 rounded-xl border border-white/10 hover:border-white/30 transition-all text-slate-400 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={onNext}
              className="p-2 rounded-xl border border-white/10 hover:border-white/30 transition-all text-slate-400 hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Card info */}
        <div className="flex flex-col gap-5 flex-1 overflow-y-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono text-slate-600 tracking-widest">{card.roman}</p>
              <h2
                className="text-3xl font-black uppercase tracking-wider"
                style={{ color: arcana?.color }}
              >
                {deckName(card)}
              </h2>
              <p className="text-[11px] text-slate-500 tracking-[0.3em] uppercase mt-1">
                — {card.subtitle} —
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 hover:border-white/30 transition-all text-slate-500 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-1.5">
            {arcana?.keywords.map(kw => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded-lg text-[10px] text-slate-400 border border-white/[0.06] bg-white/[0.02]"
              >
                {kw}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              {arcana?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(content, document.body)
}

// ─── Main gallery ─────────────────────────────────────────────────────────────

// ─── Minor Arcana data ───────────────────────────────────────────────────────

type Suit = 'wands' | 'cups' | 'swords' | 'disks'

const SUITS: { key: Suit; name: string; element: string; color: string }[] = [
  { key: 'wands',     name: 'Wands',     element: 'Fire',  color: '#ef4444' },
  { key: 'cups',      name: 'Cups',      element: 'Water', color: '#3b82f6' },
  { key: 'swords',    name: 'Swords',    element: 'Air',   color: '#a855f7' },
  { key: 'disks', name: 'Disks', element: 'Earth', color: '#f59e0b' },
]

const MINOR_RANKS = [
  'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10',
]

const COURT_RANKS = ['Princess', 'Prince', 'Queen', 'King']

const SUIT_NAMES: Record<Suit, string> = {
  wands: 'Wands', cups: 'Cups', swords: 'Swords', disks: 'Disks',
}

function minorImgPath(suit: Suit, rankIdx: number): string {
  const rank = MINOR_RANKS[rankIdx]
  return `/deck/minor/${suit}/${rank} of ${SUIT_NAMES[suit]}.jpg`
}

function courtImgPath(suit: Suit, rankIdx: number): string {
  const rank = COURT_RANKS[rankIdx]
  return `/deck/court/${suit}/${rank} of ${SUIT_NAMES[suit]}.jpg`
}

// ─── Minor Arcana Card ───────────────────────────────────────────────────────

function MinorCard({ suit, rankIdx, color, onClick }: { suit: Suit; rankIdx: number; color: string; onClick: () => void }) {
  const [hasImage, setHasImage] = useState(true)
  const rank = MINOR_RANKS[rankIdx]
  const src = minorImgPath(suit, rankIdx)
  const cardKey = `${rank} of ${SUIT_NAMES[suit].charAt(0).toUpperCase() + SUIT_NAMES[suit].slice(1)}`
  const data = MINOR_ARCANA[cardKey]

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center cursor-pointer focus:outline-none w-[260px] sm:w-[165px] md:w-[180px]"
    >
      <div
        className="relative w-full aspect-[992/1583] rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.03]"
        style={{ boxShadow: `0 0 22px ${color}55` }}
      >
        {hasImage ? (
          <Image
            src={src}
            alt={`${rank} of ${suit}`}
            fill
            className="object-cover object-center scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={() => setHasImage(false)}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 border border-white/[0.06] rounded-xl"
            style={{ background: `${color}08` }}
          >
            <span className="text-lg font-black opacity-15" style={{ color }}>{rank}</span>
            <span className="text-[8px] text-slate-700 uppercase tracking-widest">{suit}</span>
          </div>
        )}
      </div>
      <div className="mt-1.5 flex flex-col items-center gap-0.5">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{rank}</span>
        {data?.title && (
          <span className="text-[8px] uppercase tracking-[0.15em]" style={{ color }}>{data.title}</span>
        )}
      </div>
    </button>
  )
}

// ─── Court Card ─────────────────────────────────────────────────────────────

function CourtCard({ suit, rankIdx, color, onClick }: { suit: Suit; rankIdx: number; color: string; onClick: () => void }) {
  const [hasImage, setHasImage] = useState(true)
  const rank = COURT_RANKS[rankIdx]
  const src = courtImgPath(suit, rankIdx)

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center cursor-pointer focus:outline-none w-[260px] sm:w-[165px] md:w-[180px]"
    >
      <div
        className="relative w-full aspect-[992/1583] rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.03]"
        style={{ boxShadow: `0 0 22px ${color}55` }}
      >
        {hasImage ? (
          <Image
            src={src}
            alt={`${rank} of ${suit}`}
            fill
            className="object-cover object-center scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={() => setHasImage(false)}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 border border-white/[0.06] rounded-2xl"
            style={{ background: `${color}08` }}
          >
            <span className="text-lg font-black opacity-15" style={{ color }}>{rank}</span>
            <span className="text-[8px] text-slate-700 uppercase tracking-widest">{suit}</span>
          </div>
        )}
      </div>
      <span className="text-[9px] font-bold text-slate-500 mt-1.5 uppercase tracking-wider">{rank}</span>
    </button>
  )
}

// ─── Minor / Court Lightbox ──────────────────────────────────────────────────

type MinorCourtSelection = {
  type: 'minor' | 'court'
  suit: Suit
  rankIdx: number
}

function MinorCourtLightbox({
  sel,
  onClose,
  onPrev,
  onNext,
}: {
  sel: MinorCourtSelection
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const [hasImage, setHasImage] = useState(true)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  // Reset image state when card changes
  useEffect(() => { setHasImage(true) }, [sel.suit, sel.rankIdx, sel.type])

  const isMinor = sel.type === 'minor'
  const ranks = isMinor ? MINOR_RANKS : COURT_RANKS
  const rank = ranks[sel.rankIdx]
  const suitInfo = SUITS.find(s => s.key === sel.suit)!
  const color = suitInfo.color
  const cardKey = `${rank} of ${SUIT_NAMES[sel.suit]}`
  const src = isMinor ? minorImgPath(sel.suit, sel.rankIdx) : courtImgPath(sel.suit, sel.rankIdx)

  const data = isMinor ? MINOR_ARCANA[cardKey] : COURT_CARDS[cardKey]
  const title = isMinor && data && 'title' in data ? (data as typeof MINOR_ARCANA[string]).title : undefined

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col md:flex-row gap-4 md:gap-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Card image */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3">
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{
              height: 'min(45vh, 400px)',
              aspectRatio: '1.8/3',
              boxShadow: `0 0 40px ${color}55`
            }}
          >
            {hasImage ? (
              <Image
                src={src}
                alt={cardKey}
                fill
                className="object-cover"
                sizes="260px"
                onError={() => setHasImage(false)}
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-2"
                style={{ background: `${color}11` }}
              >
                <span className="text-4xl font-black opacity-10" style={{ color }}>
                  {rank}
                </span>
                <span className="text-[9px] text-slate-600 uppercase tracking-widest">{sel.suit}</span>
              </div>
            )}
          </div>

          {/* Nav arrows */}
          <div className="flex gap-4">
            <button
              onClick={onPrev}
              className="p-2 rounded-xl border border-white/10 hover:border-white/30 transition-all text-slate-400 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={onNext}
              className="p-2 rounded-xl border border-white/10 hover:border-white/30 transition-all text-slate-400 hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Card info */}
        <div className="flex flex-col gap-5 flex-1 overflow-y-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">
                {suitInfo.name} · {suitInfo.element}
              </p>
              <h2
                className="text-3xl font-black uppercase tracking-wider"
                style={{ color }}
              >
                {rank} of {SUIT_NAMES[sel.suit]}
              </h2>
              {title && (
                <p className="text-[11px] text-slate-500 tracking-[0.3em] uppercase mt-1">
                  — {title} —
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 hover:border-white/30 transition-all text-slate-500 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Keywords */}
          {data?.keywords && (
            <div className="flex flex-wrap gap-1.5">
              {data.keywords.map(kw => (
                <span
                  key={kw}
                  className="px-2 py-0.5 rounded-lg text-[10px] text-slate-400 border border-white/[0.06] bg-white/[0.02]"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {data?.description && (
            <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                {data.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(content, document.body)
}

// ─── Main gallery ─────────────────────────────────────────────────────────────

type DeckTab = 'major' | 'minor' | 'court' | 'reading'

export default function DeckGallery() {
  const [selected, setSelected] = useState<number | null>(null)
  const [minorCourtSel, setMinorCourtSel] = useState<MinorCourtSelection | null>(null)
  const [deckTab, setDeckTab] = useState<DeckTab>('major')
  const [activeSuit, setActiveSuit] = useState<Suit>('wands')
  const [activeSpread, setActiveSpread] = useState<SpreadDef>(SPREADS[0])
  const [spreadMenuOpen, setSpreadMenuOpen] = useState(false)
  const spreadMenuRef = useRef<HTMLDivElement>(null)

  // Close spread menu on outside click
  useEffect(() => {
    if (!spreadMenuOpen) return
    function handleClick(e: MouseEvent) {
      if (spreadMenuRef.current && !spreadMenuRef.current.contains(e.target as Node)) {
        setSpreadMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [spreadMenuOpen])

  const openCard = (idx: number) => setSelected(idx)
  const closeCard = () => setSelected(null)
  const prevCard = () => setSelected(i => i !== null ? (i - 1 + DECK.length) % DECK.length : null)
  const nextCard = () => setSelected(i => i !== null ? (i + 1) % DECK.length : null)

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center flex flex-col gap-3">
          <h2 className="text-4xl font-black tracking-tight text-white uppercase">
            The <span style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Deck</span>
          </h2>
          <p className="text-slate-500 text-xs font-medium max-w-md mx-auto">
            Click any card to explore its archetype, symbolism, and interpretation.
          </p>
        </div>

        {/* Major / Court / Minor tab switcher */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setDeckTab('major')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border
              ${deckTab === 'major'
                ? 'border-accent-purple/40 bg-accent-purple/10 text-white'
                : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-slate-300 hover:border-white/10'
              }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${deckTab === 'major' ? 'bg-accent-purple animate-pulse-slow' : 'bg-slate-700'}`} />
            23 Major Arcana
          </button>
          <button
            onClick={() => setDeckTab('court')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border
              ${deckTab === 'court'
                ? 'border-accent-purple/40 bg-accent-purple/10 text-white'
                : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-slate-300 hover:border-white/10'
              }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${deckTab === 'court' ? 'bg-accent-purple animate-pulse-slow' : 'bg-slate-700'}`} />
            16 Court Cards
          </button>
          <button
            onClick={() => setDeckTab('minor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border
              ${deckTab === 'minor'
                ? 'border-accent-purple/40 bg-accent-purple/10 text-white'
                : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-slate-300 hover:border-white/10'
              }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${deckTab === 'minor' ? 'bg-accent-purple animate-pulse-slow' : 'bg-slate-700'}`} />
            40 Minor Arcana
          </button>
        </div>

        {/* Reading button — square tab like main nav */}
        <div className="flex justify-center">
          <div className="relative p-1.5 rounded-2xl border border-white/[0.07] bg-bg-card inline-flex overflow-visible">
            {/* Sparkle stars around the border */}
            <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none" viewBox="0 0 120 60" fill="none" preserveAspectRatio="none">
              {/* Top edge stars */}
              <circle cx="20" cy="3" r="0.8" fill="#c4b5fd" opacity="0.7">
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="45" cy="1" r="0.5" fill="#e0d4ff" opacity="0.5">
                <animate attributeName="opacity" values="0.1;0.6;0.1" dur="4s" begin="0.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="75" cy="2" r="0.7" fill="#a78bfa" opacity="0.6">
                <animate attributeName="opacity" values="0.15;0.7;0.15" dur="3.5s" begin="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="4" r="0.5" fill="#c4b5fd" opacity="0.4">
                <animate attributeName="opacity" values="0.1;0.5;0.1" dur="5s" begin="2s" repeatCount="indefinite" />
              </circle>
              {/* Bottom edge stars */}
              <circle cx="15" cy="57" r="0.6" fill="#a78bfa" opacity="0.5">
                <animate attributeName="opacity" values="0.1;0.6;0.1" dur="4.5s" begin="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="55" cy="59" r="0.8" fill="#c4b5fd" opacity="0.6">
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.2s" begin="0.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="90" cy="56" r="0.5" fill="#e0d4ff" opacity="0.4">
                <animate attributeName="opacity" values="0.1;0.55;0.1" dur="4s" begin="2.5s" repeatCount="indefinite" />
              </circle>
              {/* Left edge stars */}
              <circle cx="2" cy="18" r="0.6" fill="#c4b5fd" opacity="0.5">
                <animate attributeName="opacity" values="0.15;0.65;0.15" dur="3.8s" begin="0.3s" repeatCount="indefinite" />
              </circle>
              <circle cx="1" cy="40" r="0.5" fill="#a78bfa" opacity="0.4">
                <animate attributeName="opacity" values="0.1;0.5;0.1" dur="4.2s" begin="1.8s" repeatCount="indefinite" />
              </circle>
              {/* Right edge stars */}
              <circle cx="118" cy="22" r="0.7" fill="#e0d4ff" opacity="0.6">
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.3s" begin="0.7s" repeatCount="indefinite" />
              </circle>
              <circle cx="117" cy="42" r="0.5" fill="#c4b5fd" opacity="0.4">
                <animate attributeName="opacity" values="0.1;0.55;0.1" dur="5s" begin="1.2s" repeatCount="indefinite" />
              </circle>
              {/* Corner accent stars (4-point star shapes) */}
              <path d="M8 8 L9 6.5 L10 8 L9 9.5 Z" fill="#c4b5fd" opacity="0.5">
                <animate attributeName="opacity" values="0.15;0.6;0.15" dur="4s" begin="0.4s" repeatCount="indefinite" />
              </path>
              <path d="M110 8 L111 6.5 L112 8 L111 9.5 Z" fill="#a78bfa" opacity="0.45">
                <animate attributeName="opacity" values="0.1;0.55;0.1" dur="3.6s" begin="1.3s" repeatCount="indefinite" />
              </path>
              <path d="M8 52 L9 50.5 L10 52 L9 53.5 Z" fill="#e0d4ff" opacity="0.4">
                <animate attributeName="opacity" values="0.1;0.5;0.1" dur="4.5s" begin="2.2s" repeatCount="indefinite" />
              </path>
              <path d="M110 52 L111 50.5 L112 52 L111 53.5 Z" fill="#c4b5fd" opacity="0.5">
                <animate attributeName="opacity" values="0.15;0.6;0.15" dur="3.4s" begin="0.9s" repeatCount="indefinite" />
              </path>
            </svg>
            <button
              onClick={() => setDeckTab('reading')}
              className="relative z-10 flex flex-col items-center gap-1 px-6 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: deckTab === 'reading' ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'transparent',
                color: deckTab === 'reading' ? '#fff' : '#64748b',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="11" rx="1.5" transform="rotate(-10 3 3)" />
                <rect x="8.5" y="2" width="7" height="11" rx="1.5" />
                <rect x="14" y="3" width="7" height="11" rx="1.5" transform="rotate(10 14 3)" />
                <circle cx="12" cy="19" r="2" />
              </svg>
              <span className="text-[8px] font-black tracking-[0.2em] uppercase">Reading</span>
            </button>

            {/* Spread selector */}
            <div className="relative z-10" ref={spreadMenuRef}>
              <button
                onClick={() => setSpreadMenuOpen(v => !v)}
                className="flex flex-col items-center gap-1 px-6 py-2.5 rounded-xl transition-all duration-200"
                style={{ color: '#64748b' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
                <span className="text-[8px] font-black tracking-[0.2em] uppercase">Spreads</span>
              </button>

              {spreadMenuOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 min-w-[220px] rounded-xl border border-white/[0.07] bg-bg-card shadow-2xl shadow-black/50 overflow-hidden animate-fade-up">
                  {SPREADS.map(s => (
                    <button
                      key={s.key}
                      onClick={() => {
                        setActiveSpread(s)
                        setDeckTab('reading')
                        setSpreadMenuOpen(false)
                      }}
                      className="flex items-center justify-between w-full px-4 py-3 transition-all duration-150 text-left"
                      style={{
                        background: activeSpread.key === s.key ? 'rgba(124,58,237,0.15)' : 'transparent',
                        color: activeSpread.key === s.key ? '#fff' : '#94a3b8',
                      }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">{s.name}</span>
                      <span className="text-[9px] text-slate-600 font-mono">{s.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Reading ─── */}
        {deckTab === 'reading' && (
          <div className="animate-fade-up">
            <TarotReading key={activeSpread.key} spread={activeSpread} />
          </div>
        )}

        {/* ─── Major Arcana Grid ─── */}
        {deckTab === 'major' && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 animate-fade-up">
            {DECK.map((card, idx) => (
              <DeckCard key={card.traditional} card={card} onClick={() => openCard(idx)} />
            ))}
          </div>
        )}

        {/* ─── Minor Arcana Grid ─── */}
        {deckTab === 'minor' && (
          <div className="flex flex-col gap-6 animate-fade-up">
            {/* Suit tabs */}
            <div className="flex items-center justify-center gap-2">
              {SUITS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setActiveSuit(s.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border
                    ${activeSuit === s.key
                      ? 'border-white/20 bg-white/[0.08] text-white'
                      : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-slate-400 hover:bg-white/[0.04]'
                    }`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color, opacity: activeSuit === s.key ? 1 : 0.4 }} />
                  <span>{s.name}</span>
                  <span className="text-[8px] text-slate-600">({s.element})</span>
                </button>
              ))}
            </div>

            {/* Cards grid for active suit */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {MINOR_RANKS.map((_, rankIdx) => (
                <MinorCard key={rankIdx} suit={activeSuit} rankIdx={rankIdx} color={SUITS.find(s => s.key === activeSuit)!.color}
                  onClick={() => setMinorCourtSel({ type: 'minor', suit: activeSuit, rankIdx })} />
              ))}
            </div>
          </div>
        )}

        {/* ─── Court Cards Grid ─── */}
        {deckTab === 'court' && (
          <div className="flex flex-col gap-6 animate-fade-up">
            {/* Suit tabs */}
            <div className="flex items-center justify-center gap-2">
              {SUITS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setActiveSuit(s.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border
                    ${activeSuit === s.key
                      ? 'border-white/20 bg-white/[0.08] text-white'
                      : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-slate-400 hover:bg-white/[0.04]'
                    }`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color, opacity: activeSuit === s.key ? 1 : 0.4 }} />
                  <span>{s.name}</span>
                  <span className="text-[8px] text-slate-600">({s.element})</span>
                </button>
              ))}
            </div>

            {/* Cards grid for active suit */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {COURT_RANKS.map((_, rankIdx) => (
                <CourtCard key={rankIdx} suit={activeSuit} rankIdx={rankIdx} color={SUITS.find(s => s.key === activeSuit)!.color}
                  onClick={() => setMinorCourtSel({ type: 'court', suit: activeSuit, rankIdx })} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox — Major Arcana */}
      {selected !== null && (
        <Lightbox
          card={DECK[selected]}
          onClose={closeCard}
          onPrev={prevCard}
          onNext={nextCard}
        />
      )}

      {/* Lightbox — Minor Arcana & Court Cards */}
      {minorCourtSel !== null && (
        <MinorCourtLightbox
          sel={minorCourtSel}
          onClose={() => setMinorCourtSel(null)}
          onPrev={() => setMinorCourtSel(prev => {
            if (!prev) return null
            const ranks = prev.type === 'minor' ? MINOR_RANKS : COURT_RANKS
            const suitKeys = SUITS.map(s => s.key)
            const suitIdx = suitKeys.indexOf(prev.suit)
            if (prev.rankIdx > 0) {
              return { ...prev, rankIdx: prev.rankIdx - 1 }
            }
            // Go to previous suit, last rank
            const prevSuitIdx = (suitIdx - 1 + suitKeys.length) % suitKeys.length
            return { ...prev, suit: suitKeys[prevSuitIdx], rankIdx: ranks.length - 1 }
          })}
          onNext={() => setMinorCourtSel(prev => {
            if (!prev) return null
            const ranks = prev.type === 'minor' ? MINOR_RANKS : COURT_RANKS
            const suitKeys = SUITS.map(s => s.key)
            const suitIdx = suitKeys.indexOf(prev.suit)
            if (prev.rankIdx < ranks.length - 1) {
              return { ...prev, rankIdx: prev.rankIdx + 1 }
            }
            // Go to next suit, first rank
            const nextSuitIdx = (suitIdx + 1) % suitKeys.length
            return { ...prev, suit: suitKeys[nextSuitIdx], rankIdx: 0 }
          })}
        />
      )}
    </>
  )
}
