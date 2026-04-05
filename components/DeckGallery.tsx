'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ARCANA } from '@/lib/arcana'
import TarotReading from '@/components/TarotReading'

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

// ─── Card component ───────────────────────────────────────────────────────────

function DeckCard({
  card,
  onClick,
}: {
  card: CardMeta
  onClick: () => void
}) {
  const arcana = ARCANA[card.appNum]
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
            alt={arcana?.name ?? `Arcana ${card.traditional}`}
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
              {arcana?.name}
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
          {arcana?.name ?? `Arcana ${card.traditional}`}
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
  const arcana = ARCANA[card.appNum]
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
                alt={arcana?.name ?? ''}
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
                {arcana?.name}
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

function MinorCard({ suit, rankIdx, color }: { suit: Suit; rankIdx: number; color: string }) {
  const [hasImage, setHasImage] = useState(true)
  const rank = MINOR_RANKS[rankIdx]
  const src = minorImgPath(suit, rankIdx)

  return (
    <div className="group relative flex flex-col items-center w-[260px] sm:w-[165px] md:w-[180px]">
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
      <span className="text-[9px] font-bold text-slate-500 mt-1.5 uppercase tracking-wider">{rank}</span>
    </div>
  )
}

// ─── Court Card ─────────────────────────────────────────────────────────────

function CourtCard({ suit, rankIdx, color }: { suit: Suit; rankIdx: number; color: string }) {
  const [hasImage, setHasImage] = useState(true)
  const rank = COURT_RANKS[rankIdx]
  const src = courtImgPath(suit, rankIdx)

  return (
    <div className="group relative flex flex-col items-center w-[260px] sm:w-[165px] md:w-[180px]">
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
    </div>
  )
}

// ─── Main gallery ─────────────────────────────────────────────────────────────

type DeckTab = 'major' | 'minor' | 'court' | 'reading'

export default function DeckGallery() {
  const [selected, setSelected] = useState<number | null>(null)
  const [deckTab, setDeckTab] = useState<DeckTab>('major')
  const [activeSuit, setActiveSuit] = useState<Suit>('wands')

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

        {/* Major / Minor tab switcher */}
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
        </div>

        {/* Reading button — separate row */}
        <div className="flex justify-center">
          <button
            onClick={() => setDeckTab('reading')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border
              ${deckTab === 'reading'
                ? 'border-accent-purple/40 bg-accent-purple/10 text-white'
                : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-slate-300 hover:border-white/10'
              }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="8" height="12" rx="1.5" transform="rotate(-8 2 3)" />
              <rect x="9" y="2" width="8" height="12" rx="1.5" />
              <rect x="14" y="3" width="8" height="12" rx="1.5" transform="rotate(8 14 3)" />
              <path d="M8 18l4 3 4-3" />
            </svg>
            Reading
          </button>
        </div>

        {/* ─── Reading ─── */}
        {deckTab === 'reading' && (
          <div className="animate-fade-up">
            <TarotReading />
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
                <MinorCard key={rankIdx} suit={activeSuit} rankIdx={rankIdx} color={SUITS.find(s => s.key === activeSuit)!.color} />
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
                <CourtCard key={rankIdx} suit={activeSuit} rankIdx={rankIdx} color={SUITS.find(s => s.key === activeSuit)!.color} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox (major only for now) */}
      {selected !== null && (
        <Lightbox
          card={DECK[selected]}
          onClose={closeCard}
          onPrev={prevCard}
          onNext={nextCard}
        />
      )}
    </>
  )
}
