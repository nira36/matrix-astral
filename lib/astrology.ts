// ─── Types ──────────────────────────────────────────────────────────────────

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const

export type ZodiacSign = typeof ZODIAC_SIGNS[number]

export const ZODIAC_GLYPHS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

export const ZODIAC_ELEMENTS: Record<ZodiacSign, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
}

export const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  Ascendant: 'AC', MC: 'MC',
}

export interface PlanetPosition {
  planet: string
  longitude: number    // 0-360 absolute degrees
  sign: ZodiacSign
  signDegree: number   // 0-30 within sign
  minute: number       // arc minutes
  house: number        // 1-12
  retrograde: boolean
}

export interface HouseCusp {
  house: number        // 1-12
  longitude: number    // 0-360
  sign: ZodiacSign
  degree: number
}

export type AspectType = 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile'

export interface Aspect {
  planet1: string
  planet2: string
  type: AspectType
  orb: number          // degrees of orb
  applying: boolean    // applying vs separating
}

export interface NatalChartData {
  planets: PlanetPosition[]
  houses: HouseCusp[]
  aspects: Aspect[]
  ascendantLongitude: number
  mcLongitude: number
}

// ─── Aspect definitions ─────────────────────────────────────────────────────

const ASPECT_ANGLES: { type: AspectType; angle: number; orb: number; symbol: string }[] = [
  { type: 'Conjunction', angle: 0, orb: 8, symbol: '☌' },
  { type: 'Opposition', angle: 180, orb: 8, symbol: '☍' },
  { type: 'Trine', angle: 120, orb: 8, symbol: '△' },
  { type: 'Square', angle: 90, orb: 7, symbol: '□' },
  { type: 'Sextile', angle: 60, orb: 6, symbol: '⚹' },
]

export const ASPECT_SYMBOLS: Record<AspectType, string> = {
  Conjunction: '☌', Opposition: '☍', Trine: '△', Square: '□', Sextile: '⚹',
}

export const ASPECT_COLORS: Record<AspectType, string> = {
  Conjunction: '#c4b5fd',
  Opposition: '#f87171',
  Trine: '#34d399',
  Square: '#f87171',
  Sextile: '#60a5fa',
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function longitudeToSign(lng: number): { sign: ZodiacSign; degree: number; minute: number } {
  const normalized = ((lng % 360) + 360) % 360
  const signIndex = Math.floor(normalized / 30)
  const degInSign = normalized - signIndex * 30
  const degree = Math.floor(degInSign)
  const minute = Math.round((degInSign - degree) * 60)
  return { sign: ZODIAC_SIGNS[signIndex], degree, minute }
}

function angleDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360
  if (d > 180) d = 360 - d
  return d
}

function calcAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = []
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = angleDiff(planets[i].longitude, planets[j].longitude)
      for (const asp of ASPECT_ANGLES) {
        const orb = Math.abs(diff - asp.angle)
        if (orb <= asp.orb) {
          aspects.push({
            planet1: planets[i].planet,
            planet2: planets[j].planet,
            type: asp.type,
            orb: Math.round(orb * 10) / 10,
            applying: planets[i].longitude < planets[j].longitude,
          })
          break
        }
      }
    }
  }
  return aspects.sort((a, b) => a.orb - b.orb)
}

function assignHouses(longitude: number, houseCusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const next = (i + 1) % 12
    let start = houseCusps[i]
    let end = houseCusps[next]
    if (end < start) end += 360
    let lng = longitude
    if (lng < start) lng += 360
    if (lng >= start && lng < end) return i + 1
  }
  return 1
}

// ─── Mock chart generator (Phase 1) ────────────────────────────────────────
// Generates a deterministic but varied chart from birth data.
// Replace with real ephemeris API in Phase 2.

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function calcNatalChart(
  day: number,
  month: number,
  year: number,
  hour: number = 12,
  minute: number = 0,
  _location: string = ''
): NatalChartData {
  // Seed from birth data for deterministic results
  const seed = day * 1000000 + month * 10000 + year + hour * 100 + minute
  const rng = seededRandom(seed)

  // Generate Ascendant based on birth time (rough approximation)
  // The ascendant moves ~1 degree every 4 minutes
  const timeOffset = (hour * 60 + minute) / 1440 * 360
  const dateOffset = ((month - 1) * 30 + day) / 365 * 360
  const ascLng = (dateOffset + timeOffset + 90) % 360

  // MC is roughly 90° before Ascendant (varies by latitude, simplified)
  const mcLng = (ascLng + 270) % 360

  // Generate house cusps (Placidus-like, simplified: equal from ASC)
  // In reality these depend on latitude, but for mock we use semi-equal
  const houseCusps: number[] = []
  for (let i = 0; i < 12; i++) {
    const base = ascLng + i * 30
    const variation = (rng() - 0.5) * 8 // ±4° variation for realism
    houseCusps.push((base + variation + 360) % 360)
  }
  // Force house 1 = ASC, house 10 = MC
  houseCusps[0] = ascLng
  houseCusps[9] = mcLng

  // Generate planet positions
  // Use approximate mean positions + seed-based offset for variety
  const meanPositions: { planet: string; baseLng: number; speed: number }[] = [
    { planet: 'Sun', baseLng: (month - 1) * 30 + day, speed: 1 },
    { planet: 'Moon', baseLng: (month - 1) * 30 + day * 12 + hour * 0.5, speed: 13 },
    { planet: 'Mercury', baseLng: (month - 1) * 30 + day + rng() * 28 - 14, speed: 1.2 },
    { planet: 'Venus', baseLng: (month - 1) * 30 + day + rng() * 46 - 23, speed: 1.1 },
    { planet: 'Mars', baseLng: (month - 1) * 30 + day * 0.52 + year * 0.524, speed: 0.52 },
    { planet: 'Jupiter', baseLng: year * 30.3 + rng() * 30, speed: 0.083 },
    { planet: 'Saturn', baseLng: year * 12.2 + rng() * 20, speed: 0.034 },
    { planet: 'Uranus', baseLng: year * 4.3 + rng() * 10, speed: 0.012 },
    { planet: 'Neptune', baseLng: year * 2.2 + rng() * 8, speed: 0.006 },
    { planet: 'Pluto', baseLng: year * 1.5 + rng() * 6, speed: 0.004 },
  ]

  const planets: PlanetPosition[] = meanPositions.map(mp => {
    const lng = ((mp.baseLng % 360) + 360) % 360
    const { sign, degree, minute: min } = longitudeToSign(lng)
    const house = assignHouses(lng, houseCusps)
    const retrograde = mp.planet !== 'Sun' && mp.planet !== 'Moon' && rng() < 0.25
    return {
      planet: mp.planet,
      longitude: Math.round(lng * 100) / 100,
      sign,
      signDegree: degree,
      minute: min,
      house,
      retrograde,
    }
  })

  // Add Ascendant & MC as special points
  const ascInfo = longitudeToSign(ascLng)
  const mcInfo = longitudeToSign(mcLng)
  planets.push({
    planet: 'Ascendant',
    longitude: Math.round(ascLng * 100) / 100,
    sign: ascInfo.sign,
    signDegree: ascInfo.degree,
    minute: ascInfo.minute,
    house: 1,
    retrograde: false,
  })
  planets.push({
    planet: 'MC',
    longitude: Math.round(mcLng * 100) / 100,
    sign: mcInfo.sign,
    signDegree: mcInfo.degree,
    minute: mcInfo.minute,
    house: 10,
    retrograde: false,
  })

  // Build house objects
  const houses: HouseCusp[] = houseCusps.map((lng, i) => {
    const info = longitudeToSign(lng)
    return { house: i + 1, longitude: Math.round(lng * 100) / 100, sign: info.sign, degree: info.degree }
  })

  // Calculate aspects (only between actual planets, not AC/MC)
  const realPlanets = planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC')
  const aspects = calcAspects(realPlanets)

  return {
    planets,
    houses,
    aspects,
    ascendantLongitude: Math.round(ascLng * 100) / 100,
    mcLongitude: Math.round(mcLng * 100) / 100,
  }
}

// ─── Interpretations (brief, for Phase 1) ───────────────────────────────────

export const PLANET_IN_SIGN: Record<string, Record<string, string>> = {
  Sun: {
    Aries: 'Identity forged through action. You exist by doing, not by waiting.',
    Taurus: 'Identity anchored in the senses. You know yourself through what you build and hold.',
    Gemini: 'Identity split across ideas. You know yourself through language and connection.',
    Cancer: 'Identity rooted in feeling. You know yourself through what you protect.',
    Leo: 'Identity expressed through creation. You know yourself through what you radiate.',
    Virgo: 'Identity refined through service. You know yourself through what you improve.',
    Libra: 'Identity mirrored in others. You know yourself through relationship.',
    Scorpio: 'Identity forged in crisis. You know yourself through what you survive.',
    Sagittarius: 'Identity expanded through meaning. You know yourself through what you believe.',
    Capricorn: 'Identity earned through mastery. You know yourself through what you achieve.',
    Aquarius: 'Identity defined by difference. You know yourself through what you challenge.',
    Pisces: 'Identity dissolved in the collective. You know yourself through what you transcend.',
  },
  Moon: {
    Aries: 'Emotional needs met through independence and direct expression.',
    Taurus: 'Emotional needs met through stability, comfort, and sensory pleasure.',
    Gemini: 'Emotional needs met through conversation, variety, and mental stimulation.',
    Cancer: 'Emotional needs met through nurturing, home, and emotional security.',
    Leo: 'Emotional needs met through recognition, warmth, and creative expression.',
    Virgo: 'Emotional needs met through order, usefulness, and practical contribution.',
    Libra: 'Emotional needs met through harmony, partnership, and aesthetic beauty.',
    Scorpio: 'Emotional needs met through intensity, depth, and emotional truth.',
    Sagittarius: 'Emotional needs met through freedom, adventure, and philosophical meaning.',
    Capricorn: 'Emotional needs met through structure, achievement, and self-discipline.',
    Aquarius: 'Emotional needs met through independence, community, and intellectual freedom.',
    Pisces: 'Emotional needs met through imagination, compassion, and spiritual connection.',
  },
}

export function getPlanetInterpretation(planet: string, sign: ZodiacSign): string {
  return PLANET_IN_SIGN[planet]?.[sign] || `${planet} in ${sign}: a unique energetic signature shaping your experience.`
}
