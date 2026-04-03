'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ARCANA } from '@/lib/arcana'

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
        className="relative w-full aspect-[1.8/3] rounded-2xl overflow-hidden transition-all duration-300
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
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
              height: 'min(55vh, 480px)',
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

          {/* Description */}
          <div className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
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

export default function DeckGallery() {
  const [selected, setSelected] = useState<number | null>(null)

  const openCard = (idx: number) => setSelected(idx)
  const closeCard = () => setSelected(null)
  const prevCard = () => setSelected(i => i !== null ? (i - 1 + DECK.length) % DECK.length : null)
  const nextCard = () => setSelected(i => i !== null ? (i + 1) % DECK.length : null)

  return (
    <>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="text-center flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10
                          text-[10px] tracking-widest uppercase text-slate-500 mx-auto font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse-slow" />
            22 Major Arcana
          </div>
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
          <p className="text-[10px] text-slate-700 font-mono">
            Add your images to <code className="text-slate-600">/public/deck/</code> — named{' '}
            <code className="text-slate-600">00.jpg</code> through{' '}
            <code className="text-slate-600">21.jpg</code>
          </p>
        </div>

        {/* Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {DECK.map((card, idx) => (
            <DeckCard key={card.traditional} card={card} onClick={() => openCard(idx)} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
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
