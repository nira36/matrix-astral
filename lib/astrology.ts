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

/** Standard zodiac SVG paths (viewBox 0 0 18 18) — classic astrological glyphs */
export const ZODIAC_PATHS: Record<ZodiacSign, string[]> = {
  // Aries — ram horns curling outward, meeting at center
  Aries: [
    'M9 15 C9 9 9 5 5 5 C2 5 2 8 5 8',
    'M9 15 C9 9 9 5 13 5 C16 5 16 8 13 8',
  ],
  // Taurus — bull head: circle with crescent horns above
  Taurus: [
    'M5 12 A4 4 0 1 0 13 12 A4 4 0 1 0 5 12',
    'M3 4 C3 7 5 9 9 9 C13 9 15 7 15 4',
  ],
  // Gemini — twin pillars (II) with curved caps
  Gemini: [
    'M6 4 V14',
    'M12 4 V14',
    'M4 4 C6 3 12 3 14 4',
    'M4 14 C6 15 12 15 14 14',
  ],
  // Cancer — 69 glyph: two opposing crescents with circles
  Cancer: [
    'M3 7 C6 5 10 5 13 7',
    'M11.4 7 A1.6 1.6 0 1 0 14.6 7 A1.6 1.6 0 1 0 11.4 7',
    'M15 11 C12 13 8 13 5 11',
    'M3.4 11 A1.6 1.6 0 1 0 6.6 11 A1.6 1.6 0 1 0 3.4 11',
  ],
  // Leo — lion head circle with curling tail ending in a small inward hook
  Leo: [
    'M3 6 A2.5 2.5 0 1 0 8 6 A2.5 2.5 0 1 0 3 6',
    'M8 6 C11 6 13 8 13 11 C13 14 16 14 16 11 C16 9 14 9 14.5 10.5',
  ],
  // Virgo — M with crossed loop (the virgin)
  Virgo: [
    'M3 14 V6 C3 4 5 4 5 6 V14',
    'M5 6 C5 4 7 4 7 6 V14',
    'M7 6 C7 4 9 4 9 6 V11',
    'M9 11 C10 14 13 14 14 11 C14 9 12 9 12 11 A2 2 0 1 0 16 13',
  ],
  // Libra — scales: arc resting on a horizontal base line
  Libra: [
    'M3 14 H15',
    'M3 10 H6',
    'M12 10 H15',
    'M6 10 C6 5 12 5 12 10',
  ],
  // Scorpio — M with arrow tail
  Scorpio: [
    'M3 14 V6 C3 4 5 4 5 6 V14',
    'M5 6 C5 4 7 4 7 6 V14',
    'M7 6 C7 4 9 4 9 6 V14 L13 10',
    'M11 8 L13 10 L12 12',
  ],
  // Sagittarius — diagonal arrow with crossbar
  Sagittarius: [
    'M3 15 L15 3',
    'M9 3 H15 V9',
    'M6 8 L10 12',
  ],
  // Capricorn — goat-fish: V (horns) with looped tail
  Capricorn: [
    'M3 5 L7 14 L9 5 L11 12',
    'M11 12 C11 15 14 15 14 12 C14 10 12 10 12 12 A2 2 0 1 0 16 13',
  ],
  // Aquarius — two parallel zig-zag waves
  Aquarius: [
    'M2 8 L5 5 L8 8 L11 5 L14 8 L16 6',
    'M2 13 L5 10 L8 13 L11 10 L14 13 L16 11',
  ],
  // Pisces — two inward-bowing arcs ) ( joined by a bar through both apexes
  Pisces: [
    'M3 4 C6.5 6.5 6.5 11.5 3 14',
    'M15 4 C11.5 6.5 11.5 11.5 15 14',
    'M3 9 H15',
  ],
}

export const ZODIAC_ELEMENTS: Record<ZodiacSign, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
}

export const ZODIAC_INFO: Record<ZodiacSign, { ruler: string; dates: string; quality: string; keywords: string }> = {
  Aries:       { ruler: 'Mars',    dates: 'Mar 21 – Apr 19',  quality: 'Cardinal', keywords: 'Courage, initiative, leadership, impulsiveness' },
  Taurus:      { ruler: 'Venus',   dates: 'Apr 20 – May 20',  quality: 'Fixed',    keywords: 'Stability, sensuality, patience, determination' },
  Gemini:      { ruler: 'Mercury', dates: 'May 21 – Jun 20',  quality: 'Mutable',  keywords: 'Communication, curiosity, adaptability, wit' },
  Cancer:      { ruler: 'Moon',    dates: 'Jun 21 – Jul 22',  quality: 'Cardinal', keywords: 'Nurturing, intuition, emotion, protection' },
  Leo:         { ruler: 'Sun',     dates: 'Jul 23 – Aug 22',  quality: 'Fixed',    keywords: 'Creativity, generosity, warmth, pride' },
  Virgo:       { ruler: 'Mercury', dates: 'Aug 23 – Sep 22',  quality: 'Mutable',  keywords: 'Analysis, service, precision, healing' },
  Libra:       { ruler: 'Venus',   dates: 'Sep 23 – Oct 22',  quality: 'Cardinal', keywords: 'Harmony, balance, diplomacy, beauty' },
  Scorpio:     { ruler: 'Pluto',   dates: 'Oct 23 – Nov 21',  quality: 'Fixed',    keywords: 'Transformation, depth, intensity, power' },
  Sagittarius: { ruler: 'Jupiter', dates: 'Nov 22 – Dec 21',  quality: 'Mutable',  keywords: 'Expansion, philosophy, adventure, freedom' },
  Capricorn:   { ruler: 'Saturn',  dates: 'Dec 22 – Jan 19',  quality: 'Cardinal', keywords: 'Ambition, discipline, structure, mastery' },
  Aquarius:    { ruler: 'Uranus',  dates: 'Jan 20 – Feb 18',  quality: 'Fixed',    keywords: 'Innovation, independence, humanitarianism, vision' },
  Pisces:      { ruler: 'Neptune', dates: 'Feb 19 – Mar 20',  quality: 'Mutable',  keywords: 'Compassion, imagination, transcendence, empathy' },
}

export const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  'North Node': '☊', Lilith: '⚸', Chiron: '⚷', Fortune: '⊗',
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
  Opposition: '#ef4444',
  Trine: '#3b82f6',
  Square: '#ef4444',
  Sextile: '#3b82f6',
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

// ─── Cross aspects (transit → natal) ────────────────────────────────────────
// A transit aspect connects a planet currently in the sky (transit) to a planet
// in the natal chart. Orbs are tighter than in a single-chart calculation
// because transits are felt only when very close.

export interface TransitAspect {
  transitPlanet: string   // current sky
  natalPlanet: string     // birth chart
  type: AspectType
  orb: number
  /** True if the transit planet is moving toward exactness (approximate). */
  applying: boolean
}

const TRANSIT_ASPECT_ORBS: Record<AspectType, number> = {
  Conjunction: 6,
  Opposition:  6,
  Trine:       5,
  Square:      5,
  Sextile:     3,
}

/** Outer planets only matter when they touch a personal point — skip noise. */
const TRANSIT_PRIORITY: Record<string, number> = {
  Sun: 5, Moon: 5, Mercury: 4, Venus: 4, Mars: 4,
  Jupiter: 3, Saturn: 3,
  Uranus: 2, Neptune: 2, Pluto: 2,
  Chiron: 1, 'North Node': 1, Lilith: 1,
}

export function calcCrossAspects(
  transit: PlanetPosition[],
  natal: PlanetPosition[],
): TransitAspect[] {
  const out: TransitAspect[] = []
  for (const t of transit) {
    if (t.planet === 'Ascendant' || t.planet === 'MC') continue
    for (const n of natal) {
      const diff = angleDiff(t.longitude, n.longitude)
      for (const asp of ASPECT_ANGLES) {
        const orbAllowed = TRANSIT_ASPECT_ORBS[asp.type]
        const orb = Math.abs(diff - asp.angle)
        if (orb <= orbAllowed) {
          out.push({
            transitPlanet: t.planet,
            natalPlanet: n.planet,
            type: asp.type,
            orb: Math.round(orb * 10) / 10,
            applying: t.longitude < n.longitude,
          })
          break
        }
      }
    }
  }
  // Sort: tightest orb first, then by transit-planet importance
  return out.sort((a, b) => {
    if (Math.abs(a.orb - b.orb) > 0.05) return a.orb - b.orb
    return (TRANSIT_PRIORITY[b.transitPlanet] ?? 0) - (TRANSIT_PRIORITY[a.transitPlanet] ?? 0)
  })
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

// ─── Real ephemeris calculation (astronomy-engine + Placidus) ──────────────

import * as Astro from 'astronomy-engine'

const D2R = Math.PI / 180
const R2D = 180 / Math.PI

/** RA (degrees) → ecliptic longitude (degrees), assuming point is on the ecliptic */
function raToEclLon(ra: number, epsR: number): number {
  const raR = (((ra % 360) + 360) % 360) * D2R
  let lng = Math.atan2(Math.sin(raR), Math.cos(raR) * Math.cos(epsR)) * R2D
  if (lng < 0) lng += 360
  return lng
}

/** Ecliptic longitude → declination */
function eclLonToDecl(lng: number, epsR: number): number {
  return Math.asin(Math.sin(lng * D2R) * Math.sin(epsR)) * R2D
}

/** Compute a single Placidus intermediate cusp via iteration */
function placidusCusp(fraction: number, isUpper: boolean, ramc: number, latR: number, epsR: number): number {
  const baseRA = isUpper ? ramc : ((ramc + 180) % 360)
  let ra = isUpper
    ? (baseRA + fraction * 90) % 360
    : ((baseRA - fraction * 90 + 360) % 360)

  for (let iter = 0; iter < 100; iter++) {
    const lng = raToEclLon(ra, epsR)
    const decl = eclLonToDecl(lng, epsR)
    let cosHA = -Math.tan(latR) * Math.tan(decl * D2R)
    cosHA = Math.max(-1, Math.min(1, cosHA))
    const sda = Math.acos(cosHA) * R2D
    const arc = isUpper ? sda : (180 - sda)

    let newRa: number
    if (isUpper) {
      newRa = (baseRA + fraction * arc) % 360
    } else {
      newRa = ((baseRA - fraction * arc) % 360 + 360) % 360
    }

    if (Math.abs(((newRa - ra + 540) % 360) - 180) < 0.001) {
      return raToEclLon(newRa, epsR)
    }
    ra = newRa
  }
  return raToEclLon(ra, epsR)
}

export function calcNatalChart(
  day: number,
  month: number,
  year: number,
  hour: number = 12,
  minute: number = 0,
  lat: number = 41.9,   // default: Rome
  lon: number = 12.5,
  utcOffset: number = 1 // hours ahead of UTC (e.g. CET=1, CEST=2, EEST=3)
): NatalChartData {
  // Convert local time to UTC
  const utcHour = hour - utcOffset
  const utcDate = new Date(Date.UTC(year, month - 1, day, utcHour, minute, 0))
  const t = Astro.MakeTime(utcDate)

  // ── Obliquity & sidereal time ──
  const T = t.tt / 36525
  const eps = 23.4392911 - 0.0130042 * T
  const epsR = eps * D2R
  const latR = lat * D2R

  const gst = Astro.SiderealTime(t)
  const lst = ((gst + lon / 15) % 24 + 24) % 24
  const ramc = lst * 15

  // ── MC ──
  const ramcR = ramc * D2R
  let mcLng = Math.atan2(Math.sin(ramcR), Math.cos(ramcR) * Math.cos(epsR)) * R2D
  if (mcLng < 0) mcLng += 360
  if (Math.abs(mcLng - ramc) > 90 && Math.abs(mcLng - ramc) < 270) mcLng = (mcLng + 180) % 360

  // ── ASC ──
  let ascLng = Math.atan2(
    Math.cos(ramcR),
    -(Math.sin(ramcR) * Math.cos(epsR) + Math.tan(latR) * Math.sin(epsR))
  ) * R2D
  if (ascLng < 0) ascLng += 360

  // ── Placidus house cusps ──
  const c11 = placidusCusp(1 / 3, true, ramc, latR, epsR)
  const c12 = placidusCusp(2 / 3, true, ramc, latR, epsR)
  const c2 = placidusCusp(2 / 3, false, ramc, latR, epsR)
  const c3 = placidusCusp(1 / 3, false, ramc, latR, epsR)

  const cuspLongitudes = [
    ascLng, c2, c3,
    (mcLng + 180) % 360,
    (c11 + 180) % 360, (c12 + 180) % 360,
    (ascLng + 180) % 360,
    (c2 + 180) % 360, (c3 + 180) % 360,
    mcLng, c11, c12,
  ]

  // ── Planet positions (real ephemeris) ──
  const PLANET_BODIES: Astro.Body[] = [
    Astro.Body.Mercury, Astro.Body.Venus, Astro.Body.Mars,
    Astro.Body.Jupiter, Astro.Body.Saturn, Astro.Body.Uranus,
    Astro.Body.Neptune, Astro.Body.Pluto,
  ]
  const PLANET_NAMES: Record<string, string> = {
    Mercury: 'Mercury', Venus: 'Venus', Mars: 'Mars',
    Jupiter: 'Jupiter', Saturn: 'Saturn', Uranus: 'Uranus',
    Neptune: 'Neptune', Pluto: 'Pluto',
  }
  const tPrev = Astro.MakeTime(new Date(utcDate.getTime() - 86400000)) // 1 day before

  // Sun
  const sunVec = Astro.GeoVector(Astro.Body.Sun, t, true)
  const sunEcl = Astro.Ecliptic(sunVec)
  const sunLng = sunEcl.elon

  // Moon
  const moonEcl = Astro.EclipticGeoMoon(t)
  const moonLng = moonEcl.lon

  const rawPlanets: { planet: string; longitude: number; retrograde: boolean }[] = [
    { planet: 'Sun', longitude: sunLng, retrograde: false },
    { planet: 'Moon', longitude: moonLng, retrograde: false },
  ]

  for (const body of PLANET_BODIES) {
    // GEOCENTRIC ecliptic longitude (seen from Earth, not from Sun)
    const vec = Astro.GeoVector(body, t, true)
    const ecl = Astro.Ecliptic(vec)
    const lng = ecl.elon

    const vecPrev = Astro.GeoVector(body, tPrev, true)
    const eclPrev = Astro.Ecliptic(vecPrev)
    let motion = lng - eclPrev.elon
    if (motion > 180) motion -= 360
    if (motion < -180) motion += 360
    rawPlanets.push({ planet: PLANET_NAMES[body] || String(body), longitude: lng, retrograde: motion < 0 })
  }

  // ── Additional points: North Node, Lilith, Chiron, Part of Fortune ──
  const T2 = T // Julian centuries from J2000 (already computed above)

  // Mean North Node (Rahu) — always retrograde
  const meanNode = ((125.0445479 - 1934.1362891 * T2 + 0.0020754 * T2 * T2) % 360 + 360) % 360
  rawPlanets.push({ planet: 'North Node', longitude: meanNode, retrograde: true })

  // Mean Lilith (Black Moon) — lunar apogee (perigee formula + 180°)
  const meanLilith = ((83.3532465 + 4069.0137287 * T2 - 0.0103200 * T2 * T2 + 180) % 360 + 360) % 360
  rawPlanets.push({ planet: 'Lilith', longitude: meanLilith, retrograde: false })

  // Chiron (simplified orbital calculation)
  // Epoch: J2000.0, Chiron orbital elements
  const chironMeanLng = ((209.35 + 1.4 * (t.tt / 365.25)) % 360 + 360) % 360
  // More precise: use orbital elements
  const chironN = t.tt / 365.25 // years from J2000
  const chironM = ((319.33 + 0.01953 * t.tt) % 360 + 360) % 360 * D2R // mean anomaly
  const chironE0 = 0.37896 // eccentricity
  // Solve Kepler's equation (2 iterations)
  let chironEA = chironM + chironE0 * Math.sin(chironM)
  chironEA = chironM + chironE0 * Math.sin(chironEA)
  chironEA = chironM + chironE0 * Math.sin(chironEA)
  const chironTrueAnom = 2 * Math.atan2(
    Math.sqrt(1 + chironE0) * Math.sin(chironEA / 2),
    Math.sqrt(1 - chironE0) * Math.cos(chironEA / 2)
  )
  const chironLngPeri = ((339.46 + 0.01297 * t.tt) % 360 + 360) % 360 * D2R // longitude of perihelion
  const chironOmega = ((209.35 + 0.00795 * t.tt) % 360 + 360) % 360 * D2R // ascending node
  const chironIncl = 6.93 * D2R
  // Heliocentric ecliptic longitude
  const chironArgLat = chironTrueAnom + chironLngPeri - chironOmega
  let chironHelioLng = Math.atan2(
    Math.sin(chironArgLat) * Math.cos(chironIncl),
    Math.cos(chironArgLat)
  ) + chironOmega
  let chironLng = ((chironHelioLng * R2D) % 360 + 360) % 360
  // Rough geocentric correction (parallax from Sun-Earth, ~few degrees max for distant objects)
  const sunLngRad = sunLng * D2R
  const chironDist = 13.7 // AU approximate
  const chironCorrection = Math.atan2(Math.sin(sunLngRad - chironLng * D2R), chironDist - Math.cos(sunLngRad - chironLng * D2R)) * R2D
  chironLng = ((chironLng + chironCorrection) % 360 + 360) % 360
  rawPlanets.push({ planet: 'Chiron', longitude: chironLng, retrograde: false })

  // Part of Fortune = ASC + Moon - Sun (day chart: Sun above horizon)
  // Day chart if Sun is in houses 7-12 (above horizon)
  const sunHouse = assignHouses(sunLng, cuspLongitudes)
  const isDayChart = sunHouse >= 7 && sunHouse <= 12
  let fortuneLng: number
  if (isDayChart) {
    fortuneLng = ((ascLng + moonLng - sunLng) % 360 + 360) % 360
  } else {
    fortuneLng = ((ascLng + sunLng - moonLng) % 360 + 360) % 360
  }
  rawPlanets.push({ planet: 'Fortune', longitude: fortuneLng, retrograde: false })

  // Build PlanetPosition array
  const planets: PlanetPosition[] = rawPlanets.map(rp => {
    const lng = ((rp.longitude % 360) + 360) % 360
    const { sign, degree, minute: min } = longitudeToSign(lng)
    const house = assignHouses(lng, cuspLongitudes)
    return {
      planet: rp.planet,
      longitude: Math.round(lng * 100) / 100,
      sign,
      signDegree: degree,
      minute: min,
      house,
      retrograde: rp.retrograde,
    }
  })

  // Add ASC & MC as special points
  const ascInfo = longitudeToSign(ascLng)
  const mcInfo = longitudeToSign(mcLng)
  planets.push({
    planet: 'Ascendant', longitude: Math.round(ascLng * 100) / 100,
    sign: ascInfo.sign, signDegree: ascInfo.degree, minute: ascInfo.minute,
    house: 1, retrograde: false,
  })
  planets.push({
    planet: 'MC', longitude: Math.round(mcLng * 100) / 100,
    sign: mcInfo.sign, signDegree: mcInfo.degree, minute: mcInfo.minute,
    house: 10, retrograde: false,
  })

  // Build house objects
  const houses: HouseCusp[] = cuspLongitudes.map((lng, i) => {
    const norm = ((lng % 360) + 360) % 360
    const info = longitudeToSign(norm)
    return { house: i + 1, longitude: Math.round(norm * 100) / 100, sign: info.sign, degree: info.degree }
  })

  // Aspects (planets + nodes/chiron/lilith, not AC/MC/Fortune)
  const aspectPlanets = planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC' && p.planet !== 'Fortune')
  const aspects = calcAspects(aspectPlanets)

  return {
    planets, houses, aspects,
    ascendantLongitude: Math.round(ascLng * 100) / 100,
    mcLongitude: Math.round(mcLng * 100) / 100,
  }
}

// ─── DST check ─────────────────────────────────────────────────────────────

/** Check if date falls in DST (simplified European/US rules) */
export function isDST(year: number, month: number, day: number, tzBase: number): boolean {
  // Europe (CET/CEST, EET/EEST): last Sunday of March → last Sunday of October
  if (tzBase >= 0 && tzBase <= 3) {
    const marchLast = new Date(year, 2, 31)
    const dstStart = 31 - marchLast.getDay() // last Sunday of March
    const octLast = new Date(year, 9, 31)
    const dstEnd = 31 - octLast.getDay() // last Sunday of October

    if (month > 3 && month < 10) return true
    if (month === 3 && day >= dstStart) return true
    if (month === 10 && day < dstEnd) return true
    return false
  }
  // US (EDT, CDT, MDT, PDT)
  if (tzBase >= -8 && tzBase <= -4) {
    // Pre-2007: 1st Sunday April → last Sunday October
    // 2007+: 2nd Sunday March → 1st Sunday November
    if (year >= 2007) {
      const marchFirst = new Date(year, 2, 1)
      const dstStart = (14 - marchFirst.getDay()) % 7 + 8 // 2nd Sunday March
      const novFirst = new Date(year, 10, 1)
      const dstEnd = (7 - novFirst.getDay()) % 7 + 1 // 1st Sunday Nov

      if (month > 3 && month < 11) return true
      if (month === 3 && day >= dstStart) return true
      if (month === 11 && day < dstEnd) return true
    } else {
      const aprFirst = new Date(year, 3, 1)
      const dstStart = (7 - aprFirst.getDay()) % 7 + 1 // 1st Sunday April
      const octLast = new Date(year, 9, 31)
      const dstEnd = 31 - octLast.getDay() // last Sunday October

      if (month > 4 && month < 10) return true
      if (month === 4 && day >= dstStart) return true
      if (month === 10 && day < dstEnd) return true
    }
    return false
  }
  return false
}

// ─── Interpretations ────────────────────────────────────────────────────────

export const PLANET_IN_SIGN: Record<string, Record<string, string>> = {
  Sun: {
    Aries: 'Identity forged in action. You exist by doing, not by waiting. A visceral need to initiate, compete, assert yourself. Risk: burning out before building anything.',
    Taurus: 'Identity anchored in the senses. You know yourself through what you build and possess. Formidable tenacity, but resistance to change can become a trap.',
    Gemini: 'Identity fragmented across ideas. You know yourself through language and connection. A brilliant mind, often too fast for the heart.',
    Cancer: 'Identity rooted in feeling. You know yourself through what you protect. Your strength is emotional memory; the risk is becoming its prisoner.',
    Leo: 'Identity expressed through creation. You know yourself through what you radiate. Natural generosity, but the need for recognition can become dependency.',
    Virgo: 'Identity refined through service. You know yourself through what you improve. Remarkable mental precision, but self-criticism can paralyze.',
    Libra: 'Identity mirrored in the other. You know yourself through relationship. Innate diplomacy, but the terror of conflict makes you ambiguous.',
    Scorpio: 'Identity forged in crisis. You know yourself through what you survive. An intensity that transforms everything, but control can become obsession.',
    Sagittarius: 'Identity expanded through meaning. You know yourself through what you believe. Broad vision, but the flight forward avoids depth.',
    Capricorn: 'Identity earned through mastery. You know yourself through what you achieve. Relentless discipline, but harshness toward yourself is the real enemy.',
    Aquarius: 'Identity defined by difference. You know yourself through what you challenge. An original mind, but emotional detachment can isolate you.',
    Pisces: 'Identity dissolved into the collective. You know yourself through what you transcend. Deep empathy, but blurred boundaries make it hard to distinguish yours from not-yours.',
  },
  Moon: {
    Aries: 'You react on impulse. Emotions arrive strong and leave fast. You need emotional independence, but confusing anger with need is your pattern.',
    Taurus: 'Emotional security through stability and sensory pleasure. Deep loyalty, but possessiveness when you feel threatened.',
    Gemini: 'Emotions processed mentally. A need for constant stimulation and variety. Rationalizing feelings is both defense and limitation.',
    Cancer: 'In its natural domicile. Powerful empathy, long emotional memory. Risk of nurturing others to avoid facing your own voids.',
    Leo: 'Emotional need for recognition and warmth. Generous in affection, but deeply wounded by indifference.',
    Virgo: 'Emotions filtered through analysis. Care expressed through practical gestures. Anxiety is the price of an emotional system seeking perfection.',
    Libra: 'Emotional balance sought through harmony and relationship. You avoid conflict at the cost of your authenticity.',
    Scorpio: 'Emotions intense, absolute, non-negotiable. Total loyalty or a clean cut. Vulnerability is what you hide best.',
    Sagittarius: 'Emotions seeking meaning. Instinctive optimism, but emotional escapism is your defensive pattern.',
    Capricorn: 'Emotions restrained, controlled, expressed sparingly. Early maturity, but the need for tenderness is what you deny.',
    Aquarius: 'Emotional distance as a survival strategy. You understand emotions intellectually; living them is another story.',
    Pisces: 'An emotional sponge. You absorb everything, distinguish little. Boundless compassion, but protecting yourself is a skill to develop.',
  },
  Mercury: {
    Aries: 'Quick, direct thinking. You speak before you process. The mind is a weapon, but patience is not in your vocabulary.',
    Taurus: 'Slow, solid, practical thinking. You process calmly but your conclusions are rock-solid. Stubborn in opinions.',
    Gemini: 'In its own domicile. An agile, curious, multitasking mind. You communicate brilliantly but going deep requires effort.',
    Cancer: 'Thinking influenced by emotions. Excellent memory, especially for wrongs suffered. Strong intuition.',
    Leo: 'Theatrical and persuasive communication. You think big, speak with authority. Difficulty accepting others\' ideas.',
    Virgo: 'In its own domicile. An analytical, precise, methodical mind. You excel in detail but risk losing the big picture.',
    Libra: 'Balanced, diplomatic thinking. You always see both sides, which makes decisions a torment.',
    Scorpio: 'An investigative, penetrating mind. You always go beneath the surface. Suspicion is your default lens.',
    Sagittarius: 'Expansive, philosophical thinking. You connect distant ideas but details bore you to death.',
    Capricorn: 'A structured, strategic mind. You think long-term. Cynicism is the flip side of your clarity.',
    Aquarius: 'Original, unconventional thinking. Ideas ahead of their context. Intellectual provocation is sport.',
    Pisces: 'Intuitive, associative, poetic thinking. Linear logic is not your strength. Immensely powerful imagination.',
  },
  Venus: {
    Aries: 'You love with intensity and urgency. The chase ignites you, routine extinguishes you. Passionate but impatient.',
    Taurus: 'In its own domicile. You love through the senses, through touch and presence. Tenacious loyalty, possessiveness included.',
    Gemini: 'You love through words and mental exchange. Variety and lightness are oxygen. Depth frightens you.',
    Cancer: 'You love by protecting and nurturing. The bond is everything, but fear of abandonment conditions every choice.',
    Leo: 'You love with generosity and drama. You want to be special to someone. Love must be a celebration.',
    Virgo: 'You love through practical gestures and daily care. Modest in feelings. Self-criticism sabotages intimacy.',
    Libra: 'In its own domicile. You love the idea of the perfect relationship. Emotional elegance, but dependence on approval is the blind spot.',
    Scorpio: 'You love with total intensity. All or nothing. Jealousy is the shadow of a love that craves fusion.',
    Sagittarius: 'You love freedom within the relationship. Enthusiastic but elusive. Long-term commitment is the real challenge.',
    Capricorn: 'You love with seriousness and responsibility. Slow to open up, but solid once inside. Vulnerability is the taboo.',
    Aquarius: 'You love the uniqueness of the other. Freedom is the non-negotiable condition. True intimacy requires a courage you don\'t always have.',
    Pisces: 'You love without boundaries, with sacrifice and idealization. The compassion is genuine, but confusing love with salvation is the pattern.',
  },
  Mars: {
    Aries: 'In its own domicile. Direct, competitive, explosive energy. You act before you think. Conflict doesn\'t scare you.',
    Taurus: 'Slow but relentless energy. You don\'t start easily but you never give up. Anger is an underground volcano.',
    Gemini: 'You act through words and ideas. Scattered in action. Sarcasm is your weapon of choice.',
    Cancer: 'Defensive, protective energy. You fight for those you love, rarely for yourself. Passive aggression.',
    Leo: 'Theatrical, courageous, dominant energy. You want to lead, not follow. Pride governs your battles.',
    Virgo: 'Precise, methodical energy. You act after analyzing. Performance anxiety is the constant brake.',
    Libra: 'Energy mediated by diplomacy. You avoid direct confrontation. Anger expressed indirectly is the problem.',
    Scorpio: 'Intense, strategic, relentless energy. You don\'t forget and you don\'t forgive easily. Transformative power.',
    Sagittarius: 'Expansive, enthusiastic, inconsistent energy. You launch with fire but sustaining it is another matter.',
    Capricorn: 'Disciplined, ambitious, enduring energy. You play the long game. Burnout is the price of your tenacity.',
    Aquarius: 'Rebellious, unpredictable, ideological energy. You fight for causes, less for yourself.',
    Pisces: 'Fluid, evasive, sacrificial energy. You act for others more than for yourself. Passivity is the trap.',
  },
  Jupiter: {
    Aries: 'Expansion through initiative and courage. Luck in taking the leap. Excess: magnified impulsiveness.',
    Taurus: 'Expansion through resources and comfort. A talent for accumulating. Excess: materialism and indulgence.',
    Gemini: 'Expansion through ideas and communication. An encyclopedic mind. Excess: intellectual scattering.',
    Cancer: 'Expansion through family and care. Emotional generosity. Excess: overprotectiveness.',
    Leo: 'Expansion through creativity and leadership. Magnanimity. Excess: grandiosity and arrogance.',
    Virgo: 'Expansion through service and improvement. Growth in the details. Excess: obsessive perfectionism.',
    Libra: 'Expansion through relationships and justice. Diplomatic talent. Excess: chronic people-pleasing.',
    Scorpio: 'Expansion through transformation and power. Extraordinary resilience. Excess: manipulation.',
    Sagittarius: 'In its own domicile. Maximum expansion: travel, philosophy, vision. Excess: dogmatism and superficiality disguised as depth.',
    Capricorn: 'Expansion through structure and ambition. Slow but lasting growth. Excess: rigidity and materialism.',
    Aquarius: 'Expansion through innovation and social causes. Progressive vision. Excess: disconnected idealism.',
    Pisces: 'Expansion through spirituality and compassion. Deep faith. Excess: escapism and victimhood.',
  },
  Saturn: {
    Aries: 'Discipline in impulse. Lesson: learning patience. Frustration is the teacher when action is blocked.',
    Taurus: 'Discipline in resources. Lesson: building with what you have. Material anxieties that teach real value.',
    Gemini: 'Discipline in thought. Lesson: saying less and saying it better. Communication becomes responsibility.',
    Cancer: 'Discipline in emotions. Lesson: protecting yourself without shutting down. Apparent coldness, hidden fragility.',
    Leo: 'Discipline in expression. Lesson: shining without demanding applause. Blocked creativity is the wound.',
    Virgo: 'Discipline in method. Lesson: imperfection is acceptable. The anxiety of not being enough is the theme.',
    Libra: 'Discipline in relationships. Lesson: being alone before being in a couple. Relationships as a maturity test.',
    Scorpio: 'Discipline in power. Lesson: controlling without dominating. Fear of vulnerability is the wall.',
    Sagittarius: 'Discipline in vision. Lesson: answers must be earned, not proclaimed. Doubt is the teacher.',
    Capricorn: 'In its own domicile. Total discipline. Lesson: success does not heal inner loneliness.',
    Aquarius: 'Discipline in originality. Lesson: freedom has structure. The rebel must learn the rules before breaking them.',
    Pisces: 'Discipline in compassion. Lesson: boundaries are not selfishness. Chronic sacrifice is self-destruction.',
  },
  Uranus: {
    Aries: 'A generation that breaks through with direct action. Revolution of the individual.',
    Taurus: 'A generation that revolutionizes values and resources. Economic transformation.',
    Gemini: 'A generation that revolutionizes communication. Innovation in thought.',
    Cancer: 'A generation that redefines family and belonging. Roots shaken.',
    Leo: 'A generation that revolutionizes creative expression. Radical individualism.',
    Virgo: 'A generation that transforms work and health. Innovation in service.',
    Libra: 'A generation that redefines relationships. New models of partnership.',
    Scorpio: 'A generation that transforms power and sexuality. Deep revolution.',
    Sagittarius: 'A generation that expands boundaries. Cultural and philosophical revolution.',
    Capricorn: 'A generation that demolishes and rebuilds structures. Crisis of institutions.',
    Aquarius: 'In its own domicile. The generation of technological and social revolution.',
    Pisces: 'A generation that dissolves boundaries between real and imaginary. Spiritual awakening.',
  },
  Neptune: {
    Aries: 'A generation that idealizes action and courage. Confusion between strength and violence.',
    Taurus: 'A generation that idealizes comfort and nature. Material illusions.',
    Gemini: 'A generation that confuses information with truth. A communicative fog.',
    Cancer: 'A generation that idealizes family and the past. Nostalgia as refuge.',
    Leo: 'A generation that idealizes celebrity and expression. Illusions of grandeur.',
    Virgo: 'A generation seeking impossible perfection. Confusion between service and sacrifice.',
    Libra: 'A generation that idealizes romantic love. Relational illusions.',
    Scorpio: 'A generation that explores mystery and the occult. Fascination with the shadow.',
    Sagittarius: 'A generation that dissolves cultural boundaries. Globalization of the imaginary.',
    Capricorn: 'A generation that dissolves rigid structures. Institutions lose credibility.',
    Aquarius: 'A generation that dissolves boundaries between individual and collective. Technological idealism.',
    Pisces: 'In its own domicile. The generation of global empathy and identity confusion.',
  },
  Pluto: {
    Aries: 'A generation that transforms the concept of identity and initiative. Individual power.',
    Taurus: 'A generation that transforms economy and values. Crisis of resources.',
    Gemini: 'A generation that transforms communication. The power of information.',
    Cancer: 'A generation that transforms family and nation. Roots torn up and rebuilt.',
    Leo: 'A generation that transforms creative power and leadership. Ego and power.',
    Virgo: 'A generation that transforms work and health. Obsession with improvement.',
    Libra: 'A generation that transforms relationships and justice. Crisis of compromise.',
    Scorpio: 'In its own domicile. The generation of radical transformation. Power and rebirth.',
    Sagittarius: 'A generation that transforms faith and ideology. Crisis of meaning.',
    Capricorn: 'A generation that transforms power structures. Demolition and reconstruction of institutions.',
    Aquarius: 'A generation that transforms the collective. Deep social revolution.',
    Pisces: 'A generation that transforms spirituality. Dissolution of old myths.',
  },
  Ascendant: {
    Aries: 'You present yourself to the world with direct, impatient energy. First impression: determination and urgency.',
    Taurus: 'You present yourself to the world with calm and solidity. First impression: reliability and deliberate steadiness.',
    Gemini: 'You present yourself to the world with curiosity and lightness. First impression: versatility and nervous energy.',
    Cancer: 'You present yourself to the world with caution and sensitivity. First impression: protectiveness and reserve.',
    Leo: 'You present yourself to the world with warmth and presence. First impression: charisma and natural authority.',
    Virgo: 'You present yourself to the world with modesty and precision. First impression: competence and discretion.',
    Libra: 'You present yourself to the world with grace and diplomacy. First impression: elegance and a desire to please.',
    Scorpio: 'You present yourself to the world with intensity and mystery. First impression: magnetism and wariness.',
    Sagittarius: 'You present yourself to the world with enthusiasm and openness. First impression: optimism and restlessness.',
    Capricorn: 'You present yourself to the world with seriousness and composure. First impression: maturity and distance.',
    Aquarius: 'You present yourself to the world with originality and detachment. First impression: eccentric and independent.',
    Pisces: 'You present yourself to the world with gentleness and vagueness. First impression: empathy and elusiveness.',
  },
  MC: {
    Aries: 'Vocation in action and initiative. A career that demands courage and leadership.',
    Taurus: 'Vocation in building and accumulating. A career that demands patience and practical sense.',
    Gemini: 'Vocation in communication and exchange. A career that demands mental versatility.',
    Cancer: 'Vocation in care and protection. A career that nurtures others.',
    Leo: 'Vocation in expression and leadership. A career that demands visibility and charisma.',
    Virgo: 'Vocation in service and improvement. A career that demands precision and technical competence.',
    Libra: 'Vocation in harmony and mediation. A career that demands diplomacy and aesthetic sense.',
    Scorpio: 'Vocation in transformation and investigation. A career that goes deep.',
    Sagittarius: 'Vocation in expansion and teaching. A career that demands broad vision.',
    Capricorn: 'Vocation in structure and authority. A career built over time.',
    Aquarius: 'Vocation in innovation and social causes. A career that breaks the mold.',
    Pisces: 'Vocation in compassion and art. A career that transcends the material.',
  },
}

export const ASPECT_INTERPRETATIONS: Record<string, string> = {
  // Conjunctions
  'Sun-Moon:Conjunction': 'Unity between will and instinct. What you want and what you feel are aligned — rare power, but little external perspective.',
  'Sun-Mercury:Conjunction': 'The mind serves identity. You think from who you are; you cannot separate reasoning from ego.',
  'Sun-Venus:Conjunction': 'Natural charm. Identity expresses itself through beauty and relationship. The risk is defining yourself only to please.',
  'Sun-Mars:Conjunction': 'Intense vital energy. Will and action united. Risk: aggression as a way of existing.',
  'Sun-Jupiter:Conjunction': 'Natural optimism and confidence. Everything seems possible. Risk: overconfidence and excess.',
  'Sun-Saturn:Conjunction': 'Early seriousness and sense of responsibility. Life weighs heavy, but discipline is the gift.',
  'Sun-Uranus:Conjunction': 'Rebellious identity. You cannot conform without losing yourself. Originality as necessity.',
  'Sun-Neptune:Conjunction': 'Blurred, idealistic identity. Charismatic allure but confusion about who you really are.',
  'Sun-Pluto:Conjunction': 'Existential intensity. Everything is a matter of life or death. Enormous transformative power.',
  'Moon-Mercury:Conjunction': 'Emotions and thought intertwined. You speak about what you feel, analyze what you experience.',
  'Moon-Venus:Conjunction': 'Emotional sweetness. A need for harmony and beauty in emotional life. Natural seductiveness.',
  'Moon-Mars:Conjunction': 'Reactive, intense emotions. Anger and the need for protection get confused.',
  'Moon-Jupiter:Conjunction': 'Emotional generosity, instinctive optimism. Excess in nurturing and consuming.',
  'Moon-Saturn:Conjunction': 'Restrained, controlled emotions. Early emotional maturity paid for with inhibition.',
  'Moon-Uranus:Conjunction': 'Emotional instability. A need for freedom in the intimate sphere. Affective unpredictability.',
  'Moon-Neptune:Conjunction': 'Profoundly deep empathy, blurred emotional boundaries. Strong intuition, but risk of illusion.',
  'Moon-Pluto:Conjunction': 'Intense, possessive, transformative emotions. The emotional past carries enormous weight.',
  'Mercury-Venus:Conjunction': 'Elegant, diplomatic communication. An aesthetic mind. You speak with grace.',
  'Mercury-Mars:Conjunction': 'A combative mind, cutting words. Debate as sport. Sarcasm is the weapon.',
  'Venus-Mars:Conjunction': 'Intense passion. Desire and affection united. Strong sexual magnetism.',
  'Venus-Jupiter:Conjunction': 'Abundance in love and pleasure. Generosity, but excess and indulgence.',
  'Venus-Saturn:Conjunction': 'Serious, demanding love. Fear of rejection. Relationships that mature over time.',
  'Mars-Jupiter:Conjunction': 'Expansive energy, enthusiasm in action. Risk: doing too much, too fast.',
  'Mars-Saturn:Conjunction': 'Disciplined but frustrated energy. Blocked action that explodes. Enormous endurance.',
  'Jupiter-Saturn:Conjunction': 'Expansion and contraction. A cycle of growth and consolidation. Realistic ambition.',

  // Oppositions
  'Sun-Moon:Opposition': 'Tension between conscious will and emotional needs. What you want and what you need are in permanent conflict.',
  'Sun-Mars:Opposition': 'Tension between identity and action. Others challenge and provoke you. Projection of anger.',
  'Sun-Saturn:Opposition': 'Tension between expression and duty. Someone (often the father) blocks your expansion.',
  'Sun-Uranus:Opposition': 'Tension between stability and freedom. Relationships that shake you and force you to evolve.',
  'Sun-Neptune:Opposition': 'Tension between reality and illusion. A tendency to idealize others at your own expense.',
  'Sun-Pluto:Opposition': 'Power struggles with the outside world. Others reflect your need for control.',
  'Moon-Saturn:Opposition': 'Tension between the need for warmth and the obligation of composure. Coldness that hides vulnerability.',
  'Moon-Pluto:Opposition': 'Intense emotional tension. Relationships that reopen ancient wounds. Power and dependency.',
  'Venus-Mars:Opposition': 'Tension between giving and taking in love. Magnetic attraction but conflicting desires.',
  'Venus-Saturn:Opposition': 'Tension between the desire for love and fear of rejection. Relationships as a test.',
  'Venus-Uranus:Opposition': 'Tension between emotional security and the need for freedom. Relationships unstable by necessity.',
  'Venus-Neptune:Opposition': 'Tension between real love and idealized love. Disappointments that teach discernment.',
  'Venus-Pluto:Opposition': 'Tension between love and power. Passion that controls. Jealousy as a battlefield.',
  'Mars-Saturn:Opposition': 'Tension between impulse and limitation. Blocked energy that explodes cyclically.',
  'Mars-Pluto:Opposition': 'Tension between power and brute force. Intense conflicts that transform.',
  'Jupiter-Saturn:Opposition': 'Tension between expansion and contraction. Oscillation between excess and restriction.',

  // Squares
  'Sun-Moon:Square': 'Constant friction between identity and emotional needs. Inner tension that generates growth but also chronic stress.',
  'Sun-Mars:Square': 'Conflict between who you are and how you act. Frustration in action. Energy that needs an outlet.',
  'Sun-Saturn:Square': 'Conflict between personal expression and imposed limits. Self-esteem built on struggle.',
  'Sun-Uranus:Square': 'Conflict between the need for stability and the impulse to break free. Sudden changes in identity.',
  'Sun-Neptune:Square': 'Conflict between reality and fantasy. Difficulty seeing yourself clearly. Artistic talent not yet channeled.',
  'Sun-Pluto:Square': 'Inner power conflict. Crises that transform identity. Resistance to necessary change.',
  'Moon-Mars:Square': 'Conflict between sensitivity and aggression. Disproportionate emotional reactions. Anger as defense.',
  'Moon-Saturn:Square': 'Conflict between emotional need and sense of duty. Emotional inhibition that creates rigidity.',
  'Moon-Uranus:Square': 'Conflict between security and emotional freedom. Instability in mood and intimate relationships.',
  'Moon-Pluto:Square': 'Deep emotional conflict. Obsessions, possessiveness. Family dynamics that leave their mark.',
  'Venus-Mars:Square': 'Tension between desire and affection. Attraction to what is complicated. Passionate and conflictual relationships.',
  'Venus-Saturn:Square': 'Tension between the desire for love and the fear of not deserving it. Delayed but profound relationships.',
  'Venus-Uranus:Square': 'Tension between the need for relationship and the terror of routine. Chronic emotional instability.',
  'Venus-Pluto:Square': 'Tension between love and obsession. Intense relationships that hit bottom before rising again.',
  'Mars-Saturn:Square': 'Tension between action and limitation. Chronic frustration. Energy finds its way after maturity.',
  'Mars-Pluto:Square': 'Tension between power and control. Deep anger that must be transformed, not repressed.',
  'Jupiter-Saturn:Square': 'Tension between optimism and realism. Growth through the discipline of desire.',

  // Trines
  'Sun-Moon:Trine': 'Harmony between will and instinct. What you want and what you feel collaborate. Natural inner balance.',
  'Sun-Mars:Trine': 'Fluid energy. Action expresses who you are without conflict. Effective determination.',
  'Sun-Jupiter:Trine': 'Natural optimism and luck. Life tends to support your projects. Risk: taking everything for granted.',
  'Sun-Saturn:Trine': 'Natural discipline. You know how to wait and build. Maturity that doesn\'t weigh you down.',
  'Sun-Uranus:Trine': 'Originality that integrates. You are different without having to fight for it.',
  'Sun-Neptune:Trine': 'Fluid artistic and spiritual sensitivity. Imagination enriches identity without confusing it.',
  'Sun-Pluto:Trine': 'Integrated personal power. Capacity for transformation without destruction. Deep resilience.',
  'Moon-Venus:Trine': 'Emotional and affective harmony. Natural sweetness. Love and need coincide.',
  'Moon-Jupiter:Trine': 'Emotional generosity, trust in others. Protectiveness without suffocation.',
  'Moon-Saturn:Trine': 'Emotional stability, affective maturity. You know how to take care without losing yourself.',
  'Moon-Neptune:Trine': 'Powerful intuition, natural empathy. The inner world is rich and accessible.',
  'Moon-Pluto:Trine': 'Emotional depth that regenerates. The ability to move through crises and emerge stronger.',
  'Venus-Mars:Trine': 'Desire and affection in harmony. Attraction and love collaborate. A fluid love life.',
  'Venus-Jupiter:Trine': 'Abundance in love and pleasure. Luck in relationships. Spontaneous generosity.',
  'Venus-Saturn:Trine': 'Mature love, solid relationships. You know how to build bonds that last.',
  'Venus-Neptune:Trine': 'Refined artistic sensitivity. Love has a transcendent quality.',
  'Venus-Pluto:Trine': 'Integrated romantic intensity. Deep passion without destructiveness.',
  'Mars-Jupiter:Trine': 'Expansive, fortunate action. Initiative brings results. Energy well invested.',
  'Mars-Saturn:Trine': 'Discipline in action. You know how to measure your force. Endurance and strategy.',
  'Mars-Pluto:Trine': 'Extraordinary power of action. Determination that moves mountains.',
  'Jupiter-Saturn:Trine': 'Balance between growth and structure. Sustainable expansion. Practical wisdom.',

  // Sextiles
  'Sun-Moon:Sextile': 'An opportunity to integrate will and instinct. Balance requires attention but is achievable.',
  'Sun-Mars:Sextile': 'An opportunity for harmonious action. Initiative is supported by identity when activated.',
  'Sun-Jupiter:Sextile': 'An opportunity for expansion and growth. Optimism works when put into practice.',
  'Sun-Saturn:Sextile': 'An opportunity for structure and discipline. Rigor is accessible without being oppressive.',
  'Moon-Venus:Sextile': 'An opportunity for emotional and affective harmony. Pleasure is within reach when you seek it.',
  'Moon-Mars:Sextile': 'An opportunity to integrate emotion and action. The protective instinct becomes strength.',
  'Venus-Mars:Sextile': 'An opportunity for balance between giving and receiving. Attraction is present and manageable.',
  'Venus-Jupiter:Sextile': 'An opportunity for joy and abundance in relationships. Luck when you open up.',
  'Mars-Jupiter:Sextile': 'An opportunity for fortunate action. Enthusiasm finds fertile ground.',
  'Mars-Saturn:Sextile': 'An opportunity for effective discipline. Energy finds structure when needed.',
  'Jupiter-Saturn:Sextile': 'An opportunity for structured growth. Pragmatism and vision collaborate.',
}

export const ELEMENT_EXCESS: Record<string, string> = {
  Fire: 'Excess of Fire: a tendency toward impulsiveness, impatience, and burnout. You act before you feel.',
  Earth: 'Excess of Earth: a tendency toward rigidity, materialism, and resistance to change.',
  Air: 'Excess of Air: a tendency to rationalize emotions, detachment from the body and from feelings.',
  Water: 'Excess of Water: a tendency toward hypersensitivity, emotional confusion, and affective dependency.',
}

export const ELEMENT_LACK: Record<string, string> = {
  Fire: 'Lack of Fire: difficulty initiating, low vital energy, fragile motivation.',
  Earth: 'Lack of Earth: difficulty materializing plans, practical instability, a complicated relationship with money.',
  Air: 'Lack of Air: difficulty communicating and gaining perspective. Thinking lacks objectivity.',
  Water: 'Lack of Water: difficulty connecting emotionally. Apparent coldness, reduced empathy.',
}

export const HOUSE_INTERPRETATIONS: string[] = [
  'Identity, physical body, approach to life. How you present yourself and how others perceive you at first impact.',
  'Personal resources, values, money. What you possess and what gives you material and emotional security.',
  'Communication, thought, siblings, short trips. How you process and transmit information.',
  'Roots, family of origin, home, private life. The psychological foundations on which you build everything.',
  'Creativity, children, love affairs, play. What you create for pleasure, the spontaneous expression of your being.',
  'Health, daily routine, work, service. How you organize everyday life.',
  'Partners, contracts, declared enemies. The other as mirror and as complement.',
  'Transformation, crisis, sexuality, inheritance, death. What dies to allow rebirth.',
  'Philosophy, long-distance travel, higher education, faith. The search for a broader meaning.',
  'Career, public reputation, authority. The image you build in the social world.',
  'Friends, groups, ideals, future projects. Your place in the community and the collective vision.',
  'The unconscious, isolation, sacrifice, spirituality. What remains hidden, including talents and fears.',
]

export function getPlanetInterpretation(planet: string, sign: ZodiacSign): string {
  return PLANET_IN_SIGN[planet]?.[sign] || `${planet} in ${sign}: a unique energetic signature that colors your experience.`
}

export function getAspectInterpretation(planet1: string, planet2: string, type: AspectType): string {
  const key1 = `${planet1}-${planet2}:${type}`
  const key2 = `${planet2}-${planet1}:${type}`
  return ASPECT_INTERPRETATIONS[key1] || ASPECT_INTERPRETATIONS[key2] || ''
}
