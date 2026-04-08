'use client'

import React from 'react'
import type { NatalChartData, Aspect } from '@/lib/astrology'
import { ZODIAC_ELEMENTS } from '@/lib/astrology'

// ─── Lunar phase from Sun-Moon angular separation ───────────────────────────
function lunarPhase(sunLng: number, moonLng: number): { name: string; emoji: string; illumination: number; vibe: string } {
  const diff = ((moonLng - sunLng) % 360 + 360) % 360
  const illumination = Math.round((1 - Math.cos((diff * Math.PI) / 180)) / 2 * 100)
  if (diff < 22.5)  return { name: 'New Moon',        emoji: '🌑', illumination, vibe: 'a quiet seed-time, the kind of moment where intentions are planted in the dark' }
  if (diff < 67.5)  return { name: 'Waxing Crescent', emoji: '🌒', illumination, vibe: 'the first push outward — small, fragile, but moving' }
  if (diff < 112.5) return { name: 'First Quarter',   emoji: '🌓', illumination, vibe: 'a moment of friction and decision, where intention meets resistance' }
  if (diff < 157.5) return { name: 'Waxing Gibbous',  emoji: '🌔', illumination, vibe: 'a refining phase — what was started is being shaped, adjusted, sharpened' }
  if (diff < 202.5) return { name: 'Full Moon',       emoji: '🌕', illumination, vibe: 'peak illumination, the crest of a wave — everything is amplified, exposed, felt' }
  if (diff < 247.5) return { name: 'Waning Gibbous',  emoji: '🌖', illumination, vibe: 'the harvest — distill what worked, share it, let the rest fall away' }
  if (diff < 292.5) return { name: 'Last Quarter',    emoji: '🌗', illumination, vibe: 'a time of release and reckoning, the point where you cut what no longer fits' }
  if (diff < 337.5) return { name: 'Waning Crescent', emoji: '🌘', illumination, vibe: 'a closing breath — rest, integrate, prepare the soil for what comes next' }
  return { name: 'New Moon', emoji: '🌑', illumination, vibe: 'a quiet seed-time' }
}

// ─── Per-sign mood used to color narrative phrases ──────────────────────────
const SUN_NARRATIVE: Record<string, string> = {
  Aries:       'a season of raw initiative and forward motion — beginnings, courage, the first spark',
  Taurus:      'a season of slowness and embodiment — the body, the earth, what is steady and felt through the senses',
  Gemini:      'a season of curiosity and exchange — words, learning, connecting the dots between unlike things',
  Cancer:      'a season of inwardness and tenderness — home, memory, what we belong to',
  Leo:         'a season of expression and warmth — creativity, presence, the heart asking to be seen',
  Virgo:       'a season of refinement and care — the small, the precise, the act of tending',
  Libra:       'a season of relating and balancing — the other, the mirror, the search for fairness and grace',
  Scorpio:     'a season of depth and transformation — what is buried, what is intense, what asks to be faced',
  Sagittarius: 'a season of expansion and meaning — the long view, the road, the question of what it all is for',
  Capricorn:   'a season of structure and patience — the long arc, the climb, what is built to last',
  Aquarius:    'a season of vision and detachment — the collective, the future, the willingness to think outside',
  Pisces:      'a season of dissolution and dreaming — the porous, the imagined, the place where edges soften',
}

const MOON_NARRATIVE: Record<string, string> = {
  Aries:       'pulling toward action, instinct, doing something now',
  Taurus:      'asking for stillness, comfort, food, the body',
  Gemini:      'restless and verbal, hungry for input and conversation',
  Cancer:      'soft, retreating inward, attuned to feeling and home',
  Leo:         'warm and expressive, wanting to be seen and to play',
  Virgo:       'analytical and tidy, in the mood to fix and organize',
  Libra:       'reaching for harmony, beauty, other people',
  Scorpio:     'intense, private, drawn to what is hidden',
  Sagittarius: 'restless for meaning, eager to escape the immediate',
  Capricorn:   'serious, contained, in a mood for responsibility',
  Aquarius:    'cool and oddly detached, more abstract than emotional',
  Pisces:      'porous and dreamy, easily moved, blurred at the edges',
}

const ASPECT_NARRATIVE: Record<string, (a: string, b: string) => string> = {
  Conjunction: (a, b) => `${a} and ${b} are fused right now, blending their voices into a single note that's hard to ignore`,
  Opposition:  (a, b) => `${a} and ${b} stand directly across from each other, pulling in opposite directions and asking for a balance`,
  Square:      (a, b) => `${a} and ${b} are at right angles — friction, pressure, the kind of tension that forces movement`,
  Trine:       (a, b) => `${a} and ${b} are flowing together in an easy harmony, opening a door that feels almost unearned`,
  Sextile:     (a, b) => `${a} and ${b} are in quiet cooperation, an opportunity that wants a small effort to land`,
}

const PLANET_RX_NOTE: Record<string, string> = {
  Mercury: 'communication slows down — old conversations resurface, decisions want to be reviewed',
  Venus:   'relationships and values are under review — past loves, old aesthetics, unfinished feelings come back',
  Mars:    'forward momentum stalls — energy turns inward, frustration builds easily',
  Jupiter: 'a pause in expansion — beliefs and meanings are quietly being reconsidered',
  Saturn:  'structures are being audited — what you have built is asking to be honored or released',
  Uranus:  'a long, slow rebellion happening underground — change without spectacle',
  Neptune: 'the dreamlike layers are turning inward — illusions are being seen for what they are',
  Pluto:   'deep, generational reworking — power dynamics being quietly rewritten',
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

// Hashable seed so the same sky always picks the same opening/closing variant
function seedFromData(data: NatalChartData): number {
  const sun = data.planets.find(p => p.planet === 'Sun')
  const moon = data.planets.find(p => p.planet === 'Moon')
  if (!sun || !moon) return 0
  return Math.floor((sun.longitude + moon.longitude * 13) * 100) % 1000
}

// ─── Main narrative builder ─────────────────────────────────────────────────
function buildNarrative(data: NatalChartData, mode: 'now' | 'sky'): string[] {
  const sun  = data.planets.find(p => p.planet === 'Sun')!
  const moon = data.planets.find(p => p.planet === 'Moon')!
  const merc = data.planets.find(p => p.planet === 'Mercury')!

  const phase = lunarPhase(sun.longitude, moon.longitude)
  const seed  = seedFromData(data)

  // Element distribution
  const elements: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  data.planets
    .filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
    .forEach(p => { elements[ZODIAC_ELEMENTS[p.sign]]++ })
  const dominantElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0]

  // Retrogrades (only the personal/social — outers are almost always retrograde)
  const personalRx = data.planets
    .filter(p => p.retrograde && ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].includes(p.planet))
    .map(p => p.planet)
  const allRx = data.planets
    .filter(p => p.retrograde && !['Ascendant', 'MC', 'North Node', 'Lilith'].includes(p.planet))
    .map(p => p.planet)

  // Tightest meaningful aspect
  const topAspect: Aspect | undefined = [...data.aspects]
    .filter(a => a.orb <= 4 && !['Ascendant', 'MC'].includes(a.planet1) && !['Ascendant', 'MC'].includes(a.planet2))
    .sort((a, b) => a.orb - b.orb)[0]

  // ─── Compose paragraphs ──────────────────────────────────────────────────
  const paras: string[] = []

  // PARAGRAPH 1 — opening, frames Sun and Moon as the dominant atmosphere
  const openings = [
    `Right now the Sun is moving through ${sun.sign} — ${SUN_NARRATIVE[sun.sign]}. The Moon, the body that sets the emotional weather of the next couple of days, is in ${moon.sign}, ${MOON_NARRATIVE[moon.sign]}.`,
    `The current sky carries the Sun in ${sun.sign}: ${SUN_NARRATIVE[sun.sign]}. Underneath that, the Moon in ${moon.sign} is ${MOON_NARRATIVE[moon.sign]}, shaping how the air actually feels from one hour to the next.`,
    `We're in the middle of ${sun.sign} season — ${SUN_NARRATIVE[sun.sign]} — and the Moon, currently in ${moon.sign}, is ${MOON_NARRATIVE[moon.sign]}.`,
  ]
  paras.push(pick(openings, seed))

  // PARAGRAPH 2 — moon phase + dominant element
  const phaseLines = [
    `It's a ${phase.name} (${phase.illumination}% illuminated): ${phase.vibe}. The element most lit up across the chart is ${dominantElement}, which means the prevailing register of these days leans ${describeElement(dominantElement)}.`,
    `The Moon is in its ${phase.name} phase, ${phase.illumination}% lit — ${phase.vibe}. ${dominantElement} is the dominant element across the planets right now, so the overall tone is ${describeElement(dominantElement)}.`,
  ]
  paras.push(pick(phaseLines, seed + 1))

  // PARAGRAPH 3 — Mercury status + tightest aspect
  const mercLine = merc.retrograde
    ? `Mercury is retrograde, which means ${PLANET_RX_NOTE.Mercury}. Conversations from a few weeks back keep returning, and decisions made in haste tend to ask for a second look.`
    : `Mercury is direct, so the lines of communication are open — clear words, fast decisions, fresh contacts come easily.`

  let aspectLine = ''
  if (topAspect) {
    const builder = ASPECT_NARRATIVE[topAspect.type]
    if (builder) {
      aspectLine = ` The tightest aspect in the sky right now is between ${topAspect.planet1} and ${topAspect.planet2}: ${builder(topAspect.planet1, topAspect.planet2)}, with an orb of just ${topAspect.orb.toFixed(1)}°. This is the loudest energetic conversation overhead — even people who don't track the sky are feeling its echo.`
    }
  }
  paras.push(mercLine + aspectLine)

  // PARAGRAPH 4 — retrogrades synthesis (only if there are personal/social ones)
  if (personalRx.length > 0) {
    const lines = personalRx.slice(0, 3).map(p => `${p} is retrograde — ${PLANET_RX_NOTE[p]}`)
    const others = allRx.length > personalRx.length
      ? ` On top of that, ${allRx.filter(p => !personalRx.includes(p)).join(', ')} ${allRx.filter(p => !personalRx.includes(p)).length === 1 ? 'is' : 'are'} also retrograde, but their movement is so slow you'll feel them more as a long climate than as an event.`
      : ''
    paras.push(`There's something else worth noting: ${lines.join('; ')}.${others}`)
  } else if (allRx.length > 0) {
    paras.push(`The personal planets — Mercury, Venus, Mars — are all moving forward, so the day-to-day machinery is unblocked. The slower retrogrades currently happening (${allRx.join(', ')}) are background hum more than headline.`)
  }

  // PARAGRAPH 5 — closing, mode-aware
  const closings = mode === 'sky' ? [
    `Read all of this as the cosmic weather above your head: not who you are, but what is passing through the sky right now, the same for everyone standing under it.`,
    `This is the sky exactly above you in this moment — a snapshot of what the cosmos is doing, not a portrait of your individual chart.`,
  ] : [
    `Read this as the current weather over your birth coordinates — the sky as it moves through the houses you were born under, what is passing through your personal frame right now.`,
    `These are the transits of the moment, projected onto the houses of your birth chart — the sky is doing this above the place you came from.`,
  ]
  paras.push(pick(closings, seed + 2))

  return paras
}

function describeElement(el: string): string {
  switch (el) {
    case 'Fire':  return 'toward action, impulse, and immediacy — energy spent rather than saved'
    case 'Earth': return 'toward the practical, the patient, the body — what can be touched and built'
    case 'Air':   return 'toward thought, words, social moves — connection and ideas over feelings'
    case 'Water': return 'toward feeling, intuition, the under-current — what is felt before it is named'
    default:      return 'mixed and balanced'
  }
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function CurrentSkyInterpretation({
  data, mode,
}: {
  data: NatalChartData
  mode: 'now' | 'sky'
}) {
  const paragraphs = buildNarrative(data, mode)

  const headline = mode === 'sky'
    ? 'The sky right now, above you'
    : 'The sky right now, over your birth place'

  return (
    <section className="flex flex-col gap-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-1">{headline}</h3>
        <p className="text-[11px] text-slate-500 italic">A reading of the cosmic weather of this moment.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 md:p-7 shadow-xl shadow-black/30">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[12px] leading-relaxed text-slate-300">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
