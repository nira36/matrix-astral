// ─── Vedic Astrology — Jyotisha Calculator ──────────────────────────────────
// Computes a sidereal Vedic chart from a tropical natal chart by applying
// Lahiri ayanamsa, then determining Rashi/Nakshatra/Pada/Bhava (whole sign houses).

import type { NatalChartData } from './astrology'
import {
  RASHIS, GRAHAS, GRAHA_DATA, RASHI_DATA, NAKSHATRAS, nakshatraFromLongitude,
  type Rashi, type Graha, type GrahaData, type NakshatraData,
} from './vedic-data'

// ─── Ayanamsa (Lahiri / Chitrapaksha) ────────────────────────────────────────
// Lahiri ayanamsa: the angular difference between tropical and sidereal zodiac.
// Reference epoch: Lahiri = 23°15'00" at 21 March 1956 (J1956.219).
// Annual precession ≈ 50.27" per year ≈ 0.013963° per year.
// Formula: ayanamsa(year_decimal) = 23.25 + (year_decimal - 1956.219) * 0.013963
// This is accurate to ~0.5 arcminute over the typical lifespan range.
//
// For greater accuracy we use the standard polynomial form approximation:
// Lahiri ayanamsa at J2000.0 (Jan 1.5, 2000) = 23.85°
// Annual rate ≈ 0.0139667°/year
export function lahiriAyanamsa(year: number, month: number, day: number): number {
  // Convert to decimal year
  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  if (isLeap) monthLength[1] = 29
  let dayOfYear = day
  for (let i = 0; i < month - 1; i++) dayOfYear += monthLength[i]
  const yearDecimal = year + (dayOfYear - 1) / (isLeap ? 366 : 365)

  // Reference: 1 January 2000 12:00 UT, Lahiri = 23.85633°
  // Annual rate of precession: ~50.290966 arcseconds/year = 0.013969712°/year
  const ayanamsa = 23.85633 + (yearDecimal - 2000) * 0.013969712
  return ayanamsa
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VedicPlanet {
  graha:           Graha
  data:            GrahaData
  longitude:       number    // sidereal longitude 0-360
  rashi:           Rashi
  rashiIndex:      number    // 0-11
  signDegree:      number    // 0-30 within sign
  signMinute:      number    // arcminutes
  nakshatra:       NakshatraData
  nakshatraIndex:  number    // 0-26
  pada:            number    // 1-4
  bhava:           number    // 1-12 (whole sign house relative to Lagna)
  retrograde:      boolean
  dignity:         'Exalted' | 'Own Sign' | 'Debilitated' | 'Friendly' | 'Neutral' | 'Enemy'
}

export interface VedicChart {
  ayanamsa:       number       // applied ayanamsa in degrees
  ayanamsaDms:    string       // human-readable "23°51'24"
  lagna: {
    longitude:    number       // sidereal
    rashi:        Rashi
    rashiIndex:   number
    signDegree:   number
    signMinute:   number
    nakshatra:    NakshatraData
    pada:         number
  }
  planets:        VedicPlanet[]
  janmaNakshatra: NakshatraData  // Moon's nakshatra
  janmaPada:      number
  // Houses: each entry is the rashi occupying that house (whole sign system)
  houses:         { house: number; rashi: Rashi; rashiIndex: number }[]
}

// ─── Dignity tables ──────────────────────────────────────────────────────────

// Exaltation: planet is strongest here
const EXALTATION: Partial<Record<Graha, Rashi>> = {
  Sun: 'Mesha', Moon: 'Vrishabha', Mars: 'Makara', Mercury: 'Kanya',
  Jupiter: 'Karka', Venus: 'Meena', Saturn: 'Tula',
  Rahu: 'Vrishabha', Ketu: 'Vrishchika',
}

// Debilitation: planet is weakest here (opposite sign)
const DEBILITATION: Partial<Record<Graha, Rashi>> = {
  Sun: 'Tula', Moon: 'Vrishchika', Mars: 'Karka', Mercury: 'Meena',
  Jupiter: 'Makara', Venus: 'Kanya', Saturn: 'Mesha',
  Rahu: 'Vrishchika', Ketu: 'Vrishabha',
}

// Simplified friendship table (natural friendships, classical)
const FRIENDS: Record<Graha, Graha[]> = {
  Sun:     ['Moon', 'Mars', 'Jupiter'],
  Moon:    ['Sun', 'Mercury'],
  Mars:    ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus:   ['Mercury', 'Saturn'],
  Saturn:  ['Mercury', 'Venus'],
  Rahu:    ['Venus', 'Saturn'],
  Ketu:    ['Mars', 'Venus', 'Saturn'],
}

const ENEMIES: Record<Graha, Graha[]> = {
  Sun:     ['Venus', 'Saturn'],
  Moon:    [],
  Mars:    ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'],
  Venus:   ['Sun', 'Moon'],
  Saturn:  ['Sun', 'Moon', 'Mars'],
  Rahu:    ['Sun', 'Moon', 'Mars'],
  Ketu:    ['Sun', 'Moon'],
}

function calcDignity(graha: Graha, rashi: Rashi): VedicPlanet['dignity'] {
  if (EXALTATION[graha] === rashi) return 'Exalted'
  if (DEBILITATION[graha] === rashi) return 'Debilitated'

  // Own sign
  const rules = GRAHA_DATA[graha].rulesSigns
  if (rules.includes(rashi)) return 'Own Sign'

  // Friend / enemy / neutral based on the sign's lord
  const signLordEnglish = RASHI_DATA[rashi].ruler as Graha
  if (FRIENDS[graha].includes(signLordEnglish)) return 'Friendly'
  if (ENEMIES[graha].includes(signLordEnglish)) return 'Enemy'
  return 'Neutral'
}

// ─── Conversion helpers ──────────────────────────────────────────────────────

function tropicalToSidereal(tropicalLng: number, ayanamsa: number): number {
  return ((tropicalLng - ayanamsa) % 360 + 360) % 360
}

function longitudeToRashi(siderealLng: number) {
  const norm = ((siderealLng % 360) + 360) % 360
  const idx = Math.floor(norm / 30)
  const within = norm - idx * 30
  const degree = Math.floor(within)
  const minute = Math.round((within - degree) * 60)
  return {
    rashi: RASHIS[idx],
    rashiIndex: idx,
    signDegree: degree,
    signMinute: minute,
  }
}

function degToDms(deg: number): string {
  const d = Math.floor(deg)
  const mFull = (deg - d) * 60
  const m = Math.floor(mFull)
  const s = Math.round((mFull - m) * 60)
  return `${d}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`
}

// ─── Main entry: build vedic chart from existing tropical natal data ────────

/**
 * Maps tropical planet names from astrology.ts to Vedic Grahas.
 * Tropical chart includes "North Node" → Rahu, "South Node" implied → Ketu (180° opposite).
 */
const TROPICAL_TO_GRAHA: Record<string, Graha> = {
  'Sun': 'Sun',
  'Moon': 'Moon',
  'Mars': 'Mars',
  'Mercury': 'Mercury',
  'Jupiter': 'Jupiter',
  'Venus': 'Venus',
  'Saturn': 'Saturn',
  'North Node': 'Rahu',
}

export function calcVedicChart(
  natal: NatalChartData,
  birthYear: number,
  birthMonth: number,
  birthDay: number,
): VedicChart {
  const ayan = lahiriAyanamsa(birthYear, birthMonth, birthDay)

  // Sidereal Lagna
  const lagnaSidLng = tropicalToSidereal(natal.ascendantLongitude, ayan)
  const lagnaInfo = longitudeToRashi(lagnaSidLng)
  const lagnaNak = nakshatraFromLongitude(lagnaSidLng)

  // Build planets
  const vedicPlanets: VedicPlanet[] = []
  let rahuLng: number | null = null

  for (const p of natal.planets) {
    const grahaName = TROPICAL_TO_GRAHA[p.planet]
    if (!grahaName) continue   // skip Ascendant, MC, Lilith, Chiron, Fortune

    const sidLng = tropicalToSidereal(p.longitude, ayan)
    const info = longitudeToRashi(sidLng)
    const nak = nakshatraFromLongitude(sidLng)
    const dignity = calcDignity(grahaName, info.rashi)

    // Bhava (house) — whole sign system: house = (planet rashi index − lagna rashi index) mod 12 + 1
    const bhava = ((info.rashiIndex - lagnaInfo.rashiIndex + 12) % 12) + 1

    vedicPlanets.push({
      graha:          grahaName,
      data:           GRAHA_DATA[grahaName],
      longitude:      sidLng,
      rashi:          info.rashi,
      rashiIndex:     info.rashiIndex,
      signDegree:     info.signDegree,
      signMinute:     info.signMinute,
      nakshatra:      nak.data,
      nakshatraIndex: nak.index,
      pada:           nak.pada,
      bhava,
      retrograde:     p.retrograde,
      dignity,
    })

    if (grahaName === 'Rahu') rahuLng = sidLng
  }

  // Ketu = 180° opposite Rahu
  if (rahuLng !== null) {
    const ketuLng = (rahuLng + 180) % 360
    const info = longitudeToRashi(ketuLng)
    const nak = nakshatraFromLongitude(ketuLng)
    const bhava = ((info.rashiIndex - lagnaInfo.rashiIndex + 12) % 12) + 1
    vedicPlanets.push({
      graha:          'Ketu',
      data:           GRAHA_DATA.Ketu,
      longitude:      ketuLng,
      rashi:          info.rashi,
      rashiIndex:     info.rashiIndex,
      signDegree:     info.signDegree,
      signMinute:     info.signMinute,
      nakshatra:      nak.data,
      nakshatraIndex: nak.index,
      pada:           nak.pada,
      bhava,
      retrograde:     true,
      dignity:        calcDignity('Ketu', info.rashi),
    })
  }

  // Sort planets by graha order (Sun, Moon, Mars, ...)
  vedicPlanets.sort((a, b) => GRAHAS.indexOf(a.graha) - GRAHAS.indexOf(b.graha))

  // Janma Nakshatra = Moon's nakshatra
  const moon = vedicPlanets.find(p => p.graha === 'Moon')
  const janmaNakshatra = moon?.nakshatra ?? NAKSHATRAS[0]
  const janmaPada = moon?.pada ?? 1

  // Houses (whole sign): house i contains the rashi at (lagnaIdx + i - 1) mod 12
  const houses = Array.from({ length: 12 }, (_, i) => {
    const idx = (lagnaInfo.rashiIndex + i) % 12
    return { house: i + 1, rashi: RASHIS[idx], rashiIndex: idx }
  })

  return {
    ayanamsa:    ayan,
    ayanamsaDms: degToDms(ayan),
    lagna: {
      longitude:  lagnaSidLng,
      rashi:      lagnaInfo.rashi,
      rashiIndex: lagnaInfo.rashiIndex,
      signDegree: lagnaInfo.signDegree,
      signMinute: lagnaInfo.signMinute,
      nakshatra:  lagnaNak.data,
      pada:       lagnaNak.pada,
    },
    planets:        vedicPlanets,
    janmaNakshatra,
    janmaPada,
    houses,
  }
}
