// ─── Vedic Astrology — Yogas, Aspects (Drishti), Divisional Charts ──────────
// Source: Brihat Parashara Hora Shastra, B.V. Raman "Three Hundred Important
// Combinations", Phaladeepika.

import type { VedicChart, VedicPlanet } from './vedic-astrology'
import { RASHIS, GRAHA_DATA, RASHI_DATA, type Rashi, type Graha } from './vedic-data'

// ─── Yogas ───────────────────────────────────────────────────────────────────

export interface Yoga {
  name:        string
  sanskrit:    string
  category:    'Raj' | 'Dhana' | 'Mahapurusha' | 'Lunar' | 'Solar' | 'Special' | 'Cancellation'
  active:      boolean
  description: string
  detail?:     string
}

const KENDRAS = [1, 4, 7, 10]
const TRIKONAS = [1, 5, 9]

function planetByGraha(chart: VedicChart, g: Graha): VedicPlanet | undefined {
  return chart.planets.find(p => p.graha === g)
}

function distance(houseA: number, houseB: number): number {
  // Returns 1-12 = how many houses from A to B (counted forward)
  return ((houseB - houseA + 12) % 12) + 1
}

function inMutualKendra(houseA: number, houseB: number): boolean {
  // Two planets are in mutual kendras if they are at distance 1, 4, 7, or 10
  const d = distance(houseA, houseB)
  return d === 1 || d === 4 || d === 7 || d === 10
}

// Detect Panch Mahapurusha Yogas
function detectPanchMahapurusha(chart: VedicChart): Yoga[] {
  const yogas: Yoga[] = []
  const PMP: { graha: Graha; name: string; sanskrit: string }[] = [
    { graha: 'Mars',    name: 'Ruchaka Yoga',  sanskrit: 'रुचक' },
    { graha: 'Mercury', name: 'Bhadra Yoga',   sanskrit: 'भद्र' },
    { graha: 'Jupiter', name: 'Hamsa Yoga',    sanskrit: 'हंस' },
    { graha: 'Venus',   name: 'Malavya Yoga',  sanskrit: 'मालव्य' },
    { graha: 'Saturn',  name: 'Sasha Yoga',    sanskrit: 'शश' },
  ]

  for (const { graha, name, sanskrit } of PMP) {
    const p = planetByGraha(chart, graha)
    if (!p) continue
    const isExaltedOrOwn = p.dignity === 'Exalted' || p.dignity === 'Own Sign'
    const isInKendra = KENDRAS.includes(p.bhava)
    if (isExaltedOrOwn && isInKendra) {
      yogas.push({
        name, sanskrit,
        category: 'Mahapurusha',
        active: true,
        description: `${graha} is ${p.dignity.toLowerCase()} in ${p.rashi} and occupies a Kendra (House ${p.bhava}). One of the five Mahapurusha (Great Person) Yogas, bestowing fame, character, and lasting accomplishment in the qualities of ${graha}.`,
      })
    }
  }
  return yogas
}

// Gajakesari Yoga: Moon and Jupiter in mutual kendras
function detectGajakesari(chart: VedicChart): Yoga | null {
  const moon = planetByGraha(chart, 'Moon')
  const jup = planetByGraha(chart, 'Jupiter')
  if (!moon || !jup) return null
  if (inMutualKendra(moon.bhava, jup.bhava)) {
    return {
      name: 'Gajakesari Yoga',
      sanskrit: 'गजकेसरी',
      category: 'Lunar',
      active: true,
      description: `The Moon (House ${moon.bhava}) and Jupiter (House ${jup.bhava}) sit in mutual Kendras. The "Elephant-Lion" yoga, grants wisdom, eloquence, fame, longevity, and the steady prosperity of one whose mind and dharma are aligned. Often present in the charts of leaders and respected teachers.`,
    }
  }
  return null
}

// Budha-Aditya Yoga: Sun and Mercury in same sign (and Mercury not too combust)
function detectBudhaAditya(chart: VedicChart): Yoga | null {
  const sun = planetByGraha(chart, 'Sun')
  const merc = planetByGraha(chart, 'Mercury')
  if (!sun || !merc) return null
  if (sun.rashi === merc.rashi) {
    return {
      name: 'Budha-Aditya Yoga',
      sanskrit: 'बुधादित्य',
      category: 'Solar',
      active: true,
      description: `Sun and Mercury occupy the same sign (${sun.rashi}, House ${sun.bhava}). Grants intelligence, eloquence, scholarly distinction, administrative skill, and success through intellect. The clarity of the Sun illuminating the wit of Mercury.`,
    }
  }
  return null
}

// Chandra-Mangala Yoga: Moon and Mars conjunction (or mutual aspect)
function detectChandraMangala(chart: VedicChart): Yoga | null {
  const moon = planetByGraha(chart, 'Moon')
  const mars = planetByGraha(chart, 'Mars')
  if (!moon || !mars) return null
  if (moon.rashi === mars.rashi) {
    return {
      name: 'Chandra-Mangala Yoga',
      sanskrit: 'चन्द्र-मंगल',
      category: 'Special',
      active: true,
      description: `Moon and Mars occupy the same sign (${moon.rashi}). Indicates significant wealth, but earned through effort, friction, or unconventional means. The fertile mind (Moon) joined with assertive action (Mars) generates material prosperity, especially through business or property.`,
    }
  }
  return null
}

// Kemadruma Yoga (negative): Moon isolated — no planets in 2nd or 12th from Moon, no conjunction
function detectKemadruma(chart: VedicChart): Yoga | null {
  const moon = planetByGraha(chart, 'Moon')
  if (!moon) return null
  const moonHouse = moon.bhava
  const adjacent = [
    ((moonHouse - 2 + 12) % 12) + 1,  // 12th from Moon
    moonHouse,                          // same house
    (moonHouse % 12) + 1,               // 2nd from Moon
  ]
  const others = chart.planets.filter(p =>
    p.graha !== 'Moon' && p.graha !== 'Sun' && p.graha !== 'Rahu' && p.graha !== 'Ketu'
  )
  const isolated = !others.some(p => adjacent.includes(p.bhava))
  if (isolated) {
    return {
      name: 'Kemadruma Yoga',
      sanskrit: 'केमद्रुम',
      category: 'Lunar',
      active: true,
      description: 'The Moon stands isolated, no benefic planets in the houses adjacent to it. Indicates a lonely, struggling mind, emotional instability, and difficulty finding lasting comfort. However, this yoga is often cancelled by other favorable factors and rarely manifests in pure form.',
    }
  }
  return null
}

// Neecha Bhanga (Cancellation of Debilitation)
function detectNeechaBhanga(chart: VedicChart): Yoga[] {
  const yogas: Yoga[] = []
  for (const p of chart.planets) {
    if (p.dignity !== 'Debilitated') continue
    // Cancellation rules (simplified):
    // 1. The lord of the debilitation sign is in a kendra from Lagna or Moon
    // 2. The planet that exalts in this sign is in a kendra
    const debilSignLord = RASHI_DATA[p.rashi].ruler as Graha
    const lordPlanet = planetByGraha(chart, debilSignLord)

    let cancelled = false
    let reason = ''
    if (lordPlanet && KENDRAS.includes(lordPlanet.bhava)) {
      cancelled = true
      reason = `${debilSignLord} (lord of ${p.rashi}) sits in Kendra (House ${lordPlanet.bhava})`
    }
    if (cancelled) {
      yogas.push({
        name: 'Neecha Bhanga Raja Yoga',
        sanskrit: 'नीच भङ्ग',
        category: 'Cancellation',
        active: true,
        description: `${p.graha}'s debilitation in ${p.rashi} is cancelled, ${reason}. A powerful "rags to riches" combination: hardships in early life transform into great success and authority later.`,
      })
    }
  }
  return yogas
}

// Raj Yoga: Lord of a kendra associated with lord of a trikona
function detectRajYoga(chart: VedicChart): Yoga[] {
  const yogas: Yoga[] = []
  const lagnaIdx = chart.lagna.rashiIndex

  // Get rulers of kendra and trikona houses
  const kendraLords = new Set<Graha>()
  const trikonaLords = new Set<Graha>()
  for (const h of KENDRAS) {
    const signIdx = (lagnaIdx + h - 1) % 12
    const ruler = RASHI_DATA[RASHIS[signIdx]].ruler as Graha
    kendraLords.add(ruler)
  }
  for (const h of TRIKONAS) {
    const signIdx = (lagnaIdx + h - 1) % 12
    const ruler = RASHI_DATA[RASHIS[signIdx]].ruler as Graha
    trikonaLords.add(ruler)
  }

  // Check for conjunctions between kendra and trikona lords
  for (const kl of Array.from(kendraLords)) {
    for (const tl of Array.from(trikonaLords)) {
      if (kl === tl) continue
      const kp = planetByGraha(chart, kl)
      const tp = planetByGraha(chart, tl)
      if (kp && tp && kp.rashi === tp.rashi) {
        yogas.push({
          name: 'Raj Yoga',
          sanskrit: 'राज योग',
          category: 'Raj',
          active: true,
          description: `${kl} (Kendra lord) and ${tl} (Trikona lord) conjoin in ${kp.rashi}. The classical combination for power, authority, and fame, the union of action and dharma elevates the native to positions of influence.`,
        })
      }
    }
  }
  return yogas
}

// Dhana Yoga: 2nd, 5th, 9th, 11th lord combinations (wealth)
function detectDhanaYoga(chart: VedicChart): Yoga | null {
  const lagnaIdx = chart.lagna.rashiIndex
  const dhanaHouses = [2, 5, 9, 11]
  const dhanaLords = new Set<Graha>()
  for (const h of dhanaHouses) {
    const signIdx = (lagnaIdx + h - 1) % 12
    const ruler = RASHI_DATA[RASHIS[signIdx]].ruler as Graha
    dhanaLords.add(ruler)
  }
  // Find pairs of dhana lords in conjunction
  const arr = Array.from(dhanaLords)
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const p1 = planetByGraha(chart, arr[i])
      const p2 = planetByGraha(chart, arr[j])
      if (p1 && p2 && p1.rashi === p2.rashi) {
        return {
          name: 'Dhana Yoga',
          sanskrit: 'धन योग',
          category: 'Dhana',
          active: true,
          description: `${arr[i]} and ${arr[j]} (lords of wealth-giving houses) conjoin in ${p1.rashi}. Indicates financial prosperity earned through legitimate means, the natal blueprint for accumulating lasting wealth.`,
        }
      }
    }
  }
  return null
}

export function detectAllYogas(chart: VedicChart): Yoga[] {
  const yogas: Yoga[] = []
  yogas.push(...detectPanchMahapurusha(chart))
  const gk = detectGajakesari(chart);    if (gk) yogas.push(gk)
  const ba = detectBudhaAditya(chart);   if (ba) yogas.push(ba)
  const cm = detectChandraMangala(chart); if (cm) yogas.push(cm)
  yogas.push(...detectNeechaBhanga(chart))
  yogas.push(...detectRajYoga(chart))
  const dy = detectDhanaYoga(chart);     if (dy) yogas.push(dy)
  const km = detectKemadruma(chart);     if (km) yogas.push(km)
  return yogas
}

// ─── Vedic Aspects (Drishti) ─────────────────────────────────────────────────
// All planets aspect 7th house from themselves.
// Mars also aspects 4th and 8th. Jupiter also 5th and 9th. Saturn also 3rd and 10th.

export interface VedicAspect {
  from:        Graha
  to:          Graha
  fromHouse:   number
  toHouse:     number
  aspectType:  string   // "7th aspect", "4th special", etc.
}

const SPECIAL_ASPECTS: Record<Graha, number[]> = {
  Sun:     [7],
  Moon:    [7],
  Mars:    [4, 7, 8],
  Mercury: [7],
  Jupiter: [5, 7, 9],
  Venus:   [7],
  Saturn:  [3, 7, 10],
  Rahu:    [5, 7, 9],   // Rahu treated like Jupiter in some traditions
  Ketu:    [5, 7, 9],
}

const ASPECT_NAMES: Record<number, string> = {
  3: '3rd aspect (special)',
  4: '4th aspect (special)',
  5: '5th aspect (special)',
  7: '7th aspect (full)',
  8: '8th aspect (special)',
  9: '9th aspect (special)',
  10: '10th aspect (special)',
}

export function calcVedicAspects(chart: VedicChart): VedicAspect[] {
  const aspects: VedicAspect[] = []
  for (const from of chart.planets) {
    const aspectsList = SPECIAL_ASPECTS[from.graha] ?? [7]
    for (const houseDiff of aspectsList) {
      const targetHouse = ((from.bhava - 1 + houseDiff - 1) % 12) + 1
      const targets = chart.planets.filter(p => p.bhava === targetHouse && p.graha !== from.graha)
      for (const t of targets) {
        aspects.push({
          from:       from.graha,
          to:         t.graha,
          fromHouse:  from.bhava,
          toHouse:    targetHouse,
          aspectType: ASPECT_NAMES[houseDiff] ?? `${houseDiff}th`,
        })
      }
    }
  }
  return aspects
}

// ─── Divisional Charts (Vargas) ──────────────────────────────────────────────

export interface DivisionalPlanet {
  graha:      Graha
  rashi:      Rashi
  rashiIndex: number
  bhava:      number   // house in the divisional chart (relative to D-chart Lagna)
}

export interface DivisionalChart {
  name:       string   // e.g. 'D9 Navamsa', 'D10 Dashamsha'
  abbr:       string
  purpose:    string
  lagna:      Rashi
  lagnaIdx:   number
  planets:    DivisionalPlanet[]
  houses:     { house: number; rashi: Rashi; rashiIndex: number }[]
}

/** D9 Navamsa: divides each sign into 9 parts of 3°20'. Marriage, dharma. */
function navamsaSignIndex(siderealLng: number): number {
  // Simple universal formula: each navamsa is 3°20' = 10/3 degrees
  return Math.floor(siderealLng / (10 / 3)) % 12
}

/** D10 Dashamsha: divides each sign into 10 parts of 3°. Career, public action. */
function dashamshaSignIndex(siderealLng: number): number {
  const norm = ((siderealLng % 360) + 360) % 360
  const rashiIdx = Math.floor(norm / 30)
  const posInRashi = norm - rashiIdx * 30
  const division = Math.floor(posInRashi / 3)  // 0-9
  // Odd signs (Aries, Gemini, ... = even rashi index): start from same sign
  // Even signs (Taurus, Cancer, ... = odd rashi index): start from 9th sign
  if (rashiIdx % 2 === 0) {
    return (rashiIdx + division) % 12
  } else {
    return (rashiIdx + 8 + division) % 12
  }
}

function buildDivisionalChart(
  chart: VedicChart,
  name: string,
  abbr: string,
  purpose: string,
  signFn: (lng: number) => number,
): DivisionalChart {
  const lagnaIdx = signFn(chart.lagna.longitude)
  const lagna = RASHIS[lagnaIdx]

  const planets: DivisionalPlanet[] = chart.planets.map(p => {
    const idx = signFn(p.longitude)
    const bhava = ((idx - lagnaIdx + 12) % 12) + 1
    return {
      graha:      p.graha,
      rashi:      RASHIS[idx],
      rashiIndex: idx,
      bhava,
    }
  })

  const houses = Array.from({ length: 12 }, (_, i) => {
    const idx = (lagnaIdx + i) % 12
    return { house: i + 1, rashi: RASHIS[idx], rashiIndex: idx }
  })

  return { name, abbr, purpose, lagna, lagnaIdx, planets, houses }
}

export function calcNavamsa(chart: VedicChart): DivisionalChart {
  return buildDivisionalChart(
    chart,
    'D9 Navamsa',
    'D9',
    'Marriage, spouse, dharma, the soul\'s deeper destiny. The most important divisional chart, used to verify the strength of natal placements.',
    navamsaSignIndex,
  )
}

export function calcDashamsha(chart: VedicChart): DivisionalChart {
  return buildDivisionalChart(
    chart,
    'D10 Dashamsha',
    'D10',
    'Career, profession, public action, status, and worldly accomplishment. Reveals the trajectory of one\'s work in the world.',
    dashamshaSignIndex,
  )
}
