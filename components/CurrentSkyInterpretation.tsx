'use client'

import React from 'react'
import type { NatalChartData, PlanetPosition, TransitAspect, AspectType } from '@/lib/astrology'
import { calcCrossAspects, ZODIAC_ELEMENTS } from '@/lib/astrology'

// ─── Lunar phase ─────────────────────────────────────────────────────────────
function lunarPhase(sunLng: number, moonLng: number): { name: string; emoji: string; illumination: number; vibe: string } {
  const diff = ((moonLng - sunLng) % 360 + 360) % 360
  const illumination = Math.round((1 - Math.cos((diff * Math.PI) / 180)) / 2 * 100)
  if (diff < 22.5)  return { name: 'New Moon',        emoji: '🌑', illumination, vibe: 'a quiet seed-time, intentions planted in the dark' }
  if (diff < 67.5)  return { name: 'Waxing Crescent', emoji: '🌒', illumination, vibe: 'the first push outward — fragile but moving' }
  if (diff < 112.5) return { name: 'First Quarter',   emoji: '🌓', illumination, vibe: 'a moment of friction and decision' }
  if (diff < 157.5) return { name: 'Waxing Gibbous',  emoji: '🌔', illumination, vibe: 'a refining phase — adjusting and sharpening' }
  if (diff < 202.5) return { name: 'Full Moon',       emoji: '🌕', illumination, vibe: 'peak illumination — everything is amplified, exposed, felt' }
  if (diff < 247.5) return { name: 'Waning Gibbous',  emoji: '🌖', illumination, vibe: 'the harvest — distill what worked, share, release the rest' }
  if (diff < 292.5) return { name: 'Last Quarter',    emoji: '🌗', illumination, vibe: 'release and reckoning — cut what no longer fits' }
  if (diff < 337.5) return { name: 'Waning Crescent', emoji: '🌘', illumination, vibe: 'a closing breath — rest and prepare the soil' }
  return { name: 'New Moon', emoji: '🌑', illumination, vibe: 'a quiet seed-time' }
}

// ─── Aspect tone ─────────────────────────────────────────────────────────────
const ASPECT_TONE: Record<AspectType, string> = {
  Conjunction: 'fusion — themes blend and amplify each other',
  Opposition:  'tension along an axis — a polarity asking for balance',
  Square:      'friction and pressure — the kind of test that forces change',
  Trine:       'flow and grace — an open door, but easy to take for granted',
  Sextile:     'opportunity — a small effort here unlocks something',
}

// Per-natal-planet "what is being touched"
const NATAL_TARGET: Record<string, string> = {
  Sun:       'your core identity, vitality, the way you are seen',
  Moon:      'your emotional life, instincts, what makes you feel safe',
  Mercury:   'your mind, conversations, decisions, the way you think',
  Venus:     'your relationships, values, what and how you love',
  Mars:      'your drive, courage, sex life, how you act on desire',
  Jupiter:   'your sense of meaning, growth, hope, what you trust',
  Saturn:    'your structures, responsibilities, what you have built',
  Uranus:    'the part of you that wants to break free',
  Neptune:   'your dreams, your spirituality, the dissolving edges',
  Pluto:     'your power, your shadow, what is being transformed',
  Chiron:    'an old wound asking to be tended',
  'North Node': 'your direction of growth, what you are evolving toward',
  Lilith:    'your wild self, the part you have suppressed',
  Ascendant: 'how you show up, your face to the world',
  MC:        'your career, public role, calling',
}

// Per-transit-planet flavor of impact
const TRANSIT_FLAVOR: Record<string, string> = {
  Sun:       'a brief, bright spotlight — felt for a day or two',
  Moon:      'a passing emotional ripple — a few hours',
  Mercury:   'words, ideas, conversations are the carriers',
  Venus:     'love, beauty, value bring this in — a sweet window',
  Mars:      'energy, conflict, desire push it — fast and sharp',
  Jupiter:   'expansion, opportunity, growth across months',
  Saturn:    'a slow lesson, a discipline imposed, lasting years',
  Uranus:    'a long, slow shock — sudden change without warning',
  Neptune:   'a fog or a vision lasting years — meaning shifts',
  Pluto:     'a generational rewrite — death and rebirth, slow and total',
  Chiron:    'an old wound being touched, a chance to heal',
  'North Node': 'a karmic crossing toward your evolution',
  Lilith:    'the suppressed and wild part of you stirring',
}

const SIGN_TONE: Record<string, string> = {
  Aries: 'fast and direct', Taurus: 'slow and embodied', Gemini: 'verbal and curious',
  Cancer: 'tender and inward', Leo: 'expressive and warm', Virgo: 'precise and analytical',
  Libra: 'relational and balanced', Scorpio: 'intense and depth-seeking',
  Sagittarius: 'restless and meaning-seeking', Capricorn: 'serious and structural',
  Aquarius: 'cool and detached', Pisces: 'porous and dreamy',
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function seedFromData(natal: NatalChartData, transit: NatalChartData): number {
  const tSun = transit.planets.find(p => p.planet === 'Sun')
  const tMoon = transit.planets.find(p => p.planet === 'Moon')
  const nSun = natal.planets.find(p => p.planet === 'Sun')
  if (!tSun || !tMoon || !nSun) return 0
  return Math.floor((tSun.longitude + tMoon.longitude * 13 + nSun.longitude * 7) * 100) % 1000
}

// ─── Narrative builder ───────────────────────────────────────────────────────
function buildTransitNarrative(natal: NatalChartData, transit: NatalChartData): string[] {
  const tSun  = transit.planets.find(p => p.planet === 'Sun')!
  const tMoon = transit.planets.find(p => p.planet === 'Moon')!
  const tMerc = transit.planets.find(p => p.planet === 'Mercury')!
  const realTransit = transit.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
  const realNatal   = natal.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')

  const phase = lunarPhase(tSun.longitude, tMoon.longitude)
  const seed  = seedFromData(natal, transit)

  // Cross aspects, sorted by tightness × importance
  const cross: TransitAspect[] = calcCrossAspects(realTransit, realNatal)

  // Most "loud" transit hits — slow planets touching personal points are the headlines
  const SLOW = new Set(['Saturn', 'Uranus', 'Neptune', 'Pluto', 'Jupiter', 'Chiron'])
  const PERSONAL = new Set(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Ascendant', 'MC'])

  const headlineHits = cross.filter(a =>
    SLOW.has(a.transitPlanet) && PERSONAL.has(a.natalPlanet) && a.orb <= 4,
  )
  const fastHits = cross.filter(a =>
    !SLOW.has(a.transitPlanet) && PERSONAL.has(a.natalPlanet) && a.orb <= 2,
  )
  const allTopHits = [...headlineHits, ...fastHits].slice(0, 4)

  // Personal retrogrades
  const personalRx = transit.planets
    .filter(p => p.retrograde && ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].includes(p.planet))
    .map(p => p.planet)

  const paras: string[] = []

  // Paragraph 1 — what the sky is doing right now (Sun + Moon transit, generic season)
  const openings = [
    `Right now the Sun is moving through ${tSun.sign} — a ${SIGN_TONE[tSun.sign]} season — and the Moon is in ${tMoon.sign}, coloring the next couple of days with a ${SIGN_TONE[tMoon.sign]} mood. It's a ${phase.name} (${phase.illumination}% lit): ${phase.vibe}.`,
    `The cosmic weather: Sun in ${tSun.sign} (${SIGN_TONE[tSun.sign]}), Moon in ${tMoon.sign} (${SIGN_TONE[tMoon.sign]}), and a ${phase.name} at ${phase.illumination}% illumination — ${phase.vibe}.`,
  ]
  paras.push(pick(openings, seed))

  // Paragraph 2 — Mercury status + how the sky touches YOU (the bridge to natal)
  const mercLine = tMerc.retrograde
    ? `Mercury is retrograde, so general communication is in review-mode for everyone — but what makes today specifically yours is how this sky is hitting your natal chart.`
    : `Mercury is direct and the day-to-day machinery is unblocked — but what really matters is how this sky is touching your natal chart.`
  paras.push(mercLine)

  // Paragraph 3 — the headline transits to natal
  if (allTopHits.length > 0) {
    const lines = allTopHits.map(hit => {
      const target = NATAL_TARGET[hit.natalPlanet] ?? hit.natalPlanet
      const flavor = TRANSIT_FLAVOR[hit.transitPlanet] ?? hit.transitPlanet
      const tone   = ASPECT_TONE[hit.type]
      return `Transit ${hit.transitPlanet} is in ${hit.type.toLowerCase()} with your natal ${hit.natalPlanet} (orb ${hit.orb.toFixed(1)}°): ${tone}, touching ${target}. ${capitalize(flavor)}.`
    })
    paras.push(`Here's what the sky is actively doing to your chart right now. ${lines.join(' ')}`)
  } else {
    paras.push(`No tight transits are hitting your personal points right now — the sky is technically quiet for you. Days like this are useful: less external pressure, more room to integrate whatever was stirred recently.`)
  }

  // Paragraph 4 — retrogrades (in your sky, but framed personally)
  if (personalRx.length > 0) {
    const list = personalRx.join(', ')
    paras.push(`On top of that, ${list} ${personalRx.length === 1 ? 'is' : 'are'} retrograde — themes around ${personalRx.map(p => transitFlavorShort(p)).join(', ')} are in review-mode for everyone, you included.`)
  }

  // Paragraph 5 — closing
  const closings = [
    `This is your weather report — the cosmic background calculated against your specific chart. Not generic horoscope, not abstract sky: the actual transits to your natal points right now.`,
    `What you see above is your personal cosmic forecast: the sky as it currently leans against your birth chart. Nothing generic, nothing one-size-fits-all.`,
  ]
  paras.push(pick(closings, seed + 1))

  return paras
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function transitFlavorShort(p: string): string {
  switch (p) {
    case 'Mercury': return 'communication and decisions'
    case 'Venus':   return 'love and values'
    case 'Mars':    return 'action and drive'
    case 'Jupiter': return 'meaning and growth'
    case 'Saturn':  return 'structure and commitment'
    default:        return p
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CurrentSkyInterpretation({
  natalData,
  transitData,
}: {
  /** The user's birth chart */
  natalData: NatalChartData
  /** The current sky at the user's actual location */
  transitData: NatalChartData
}) {
  const paragraphs = buildTransitNarrative(natalData, transitData)

  // For the live "active aspects" mini-list at the bottom
  const realTransit = transitData.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
  const realNatal = natalData.planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
  const cross = calcCrossAspects(realTransit, realNatal)
  const tightest = cross.slice(0, 5)

  return (
    <section className="flex flex-col gap-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-1">Your Personal Transits</h3>
        <p className="text-[11px] text-slate-500 italic">
          The sky right now, against your birth chart. The actual weather of your day.
        </p>
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

      {tightest.length > 0 && (
        <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-5 shadow-xl shadow-black/30">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-3">
            Tightest transit hits right now
          </p>
          <div className="flex flex-col gap-2">
            {tightest.map((a, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-300">
                  Transit <span className="font-bold text-white">{a.transitPlanet}</span>
                  {' '}<span className="text-violet-400 font-bold">{aspectSymbol(a.type)}</span>{' '}
                  Natal <span className="font-bold text-white">{a.natalPlanet}</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  {a.type} · {a.orb.toFixed(1)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function aspectSymbol(t: AspectType): string {
  return { Conjunction: '☌', Opposition: '☍', Trine: '△', Square: '□', Sextile: '⚹' }[t]
}
