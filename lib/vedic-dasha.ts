// ─── Vimshottari Dasha — Vedic Planetary Periods ────────────────────────────
// 120-year cycle of 9 planetary periods (Mahadasha), each subdivided into
// 9 Antardashas. Activated by the Moon's position in its Nakshatra at birth.
// Source: Brihat Parashara Hora Shastra, classical Jyotisha tradition.

import type { Graha } from './vedic-data'

// Years per Mahadasha (total = 120)
export const VIMSHOTTARI_YEARS: Record<Graha, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
}

// Order of Mahadashas (cycle repeats)
export const VIMSHOTTARI_ORDER: Graha[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
]

// Nakshatra index 0-26 → starting Dasha lord (cycles every 9 nakshatras)
export function dashaLordFromNakshatra(nakshatraIndex0: number): Graha {
  return VIMSHOTTARI_ORDER[nakshatraIndex0 % 9]
}

export interface DashaPeriod {
  lord:      Graha
  startDate: Date
  endDate:   Date
  years:     number    // duration in (decimal) years
  ageStart:  number    // user's age at start (decimal)
  ageEnd:    number
}

export interface VimshottariDasha {
  birthDate:           Date
  moonLongitude:       number     // sidereal
  moonNakshatraIndex:  number     // 0-26
  moonNakshatraName:   string
  startingLord:        Graha
  balanceYears:        number     // remaining years of the starting MD at birth
  mahadashas:          DashaPeriod[]    // 9 main periods (~120 years total)
  currentMahadasha:    DashaPeriod | null
  currentAntardashas:  DashaPeriod[]    // sub-periods of the current MD
  currentAntardasha:   DashaPeriod | null
}

// ─── Date arithmetic ─────────────────────────────────────────────────────────

const MS_PER_YEAR = 365.2425 * 24 * 3600 * 1000

function addYears(d: Date, years: number): Date {
  return new Date(d.getTime() + years * MS_PER_YEAR)
}

function diffYears(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / MS_PER_YEAR
}

// ─── Main calculation ────────────────────────────────────────────────────────

export function calcVimshottariDasha(
  moonSiderealLng: number,
  birthDate: Date,
  moonNakshatraName: string,
): VimshottariDasha {
  const NAK_SPAN = 360 / 27  // 13.333...
  const norm = ((moonSiderealLng % 360) + 360) % 360
  const nakIdx = Math.floor(norm / NAK_SPAN)
  const posInNak = norm - nakIdx * NAK_SPAN
  const fractionElapsed = posInNak / NAK_SPAN
  const fractionRemaining = 1 - fractionElapsed

  const startingLord = dashaLordFromNakshatra(nakIdx)
  const startingLordIdx = VIMSHOTTARI_ORDER.indexOf(startingLord)
  const balanceYears = fractionRemaining * VIMSHOTTARI_YEARS[startingLord]

  // Generate Mahadashas: starting lord (with balance), then next 8 lords (full)
  const mahadashas: DashaPeriod[] = []
  let cursor = new Date(birthDate.getTime())

  // First MD (partial — just the balance)
  const firstEnd = addYears(cursor, balanceYears)
  mahadashas.push({
    lord:      startingLord,
    startDate: new Date(cursor.getTime()),
    endDate:   firstEnd,
    years:     balanceYears,
    ageStart:  0,
    ageEnd:    balanceYears,
  })
  cursor = firstEnd

  // Next 8 MDs (full duration)
  for (let i = 1; i <= 8; i++) {
    const lord = VIMSHOTTARI_ORDER[(startingLordIdx + i) % 9]
    const yrs = VIMSHOTTARI_YEARS[lord]
    const end = addYears(cursor, yrs)
    mahadashas.push({
      lord,
      startDate: new Date(cursor.getTime()),
      endDate:   end,
      years:     yrs,
      ageStart:  diffYears(birthDate, cursor),
      ageEnd:    diffYears(birthDate, end),
    })
    cursor = end
  }

  // Find current MD
  const now = new Date()
  const currentMahadasha = mahadashas.find(md => md.startDate <= now && md.endDate > now) ?? null

  // Generate Antardashas for current MD
  let currentAntardashas: DashaPeriod[] = []
  let currentAntardasha: DashaPeriod | null = null

  if (currentMahadasha) {
    currentAntardashas = generateAntardashas(currentMahadasha, birthDate)
    currentAntardasha = currentAntardashas.find(ad => ad.startDate <= now && ad.endDate > now) ?? null
  }

  return {
    birthDate,
    moonLongitude:       moonSiderealLng,
    moonNakshatraIndex:  nakIdx,
    moonNakshatraName,
    startingLord,
    balanceYears,
    mahadashas,
    currentMahadasha,
    currentAntardashas,
    currentAntardasha,
  }
}

/** Antardashas always start from the MD lord itself, then follow the cycle. */
function generateAntardashas(mahadasha: DashaPeriod, birthDate: Date): DashaPeriod[] {
  const mdLord = mahadasha.lord
  const mdLordIdx = VIMSHOTTARI_ORDER.indexOf(mdLord)
  const periods: DashaPeriod[] = []

  // For the FIRST mahadasha (balance), antardashas are computed proportionally
  // from the natural starting point of the AD sequence at the moment of birth.
  // For simplicity here, we compute all 9 antardashas filling the MD duration
  // proportionally — accurate for full MDs, approximate for the balance MD.

  let cursor = new Date(mahadasha.startDate.getTime())
  for (let i = 0; i < 9; i++) {
    const adLord = VIMSHOTTARI_ORDER[(mdLordIdx + i) % 9]
    // Antardasha years = (MD years × AD lord years) / 120
    const adYears = (VIMSHOTTARI_YEARS[mdLord] * VIMSHOTTARI_YEARS[adLord]) / 120

    // For the balance MD, scale antardashas to fit the actual remaining duration
    let actualAdYears = adYears
    if (mahadasha.years < VIMSHOTTARI_YEARS[mdLord]) {
      // Compute "elapsed" portion of the natural MD before birth
      const elapsedFraction = 1 - mahadasha.years / VIMSHOTTARI_YEARS[mdLord]
      // Skip antardashas that would have ended before birth
      const adStartFraction = i === 0 ? elapsedFraction : (sumYears(mdLord, i) / VIMSHOTTARI_YEARS[mdLord])
      const adEndFraction = sumYears(mdLord, i + 1) / VIMSHOTTARI_YEARS[mdLord]

      if (adEndFraction <= elapsedFraction) {
        // This AD already passed before birth, skip
        continue
      }
      // Partial AD
      const startFrac = Math.max(adStartFraction, elapsedFraction)
      actualAdYears = (adEndFraction - startFrac) * VIMSHOTTARI_YEARS[mdLord]
    }

    const adEnd = addYears(cursor, actualAdYears)
    periods.push({
      lord:      adLord,
      startDate: new Date(cursor.getTime()),
      endDate:   adEnd,
      years:     actualAdYears,
      ageStart:  diffYears(birthDate, cursor),
      ageEnd:    diffYears(birthDate, adEnd),
    })
    cursor = adEnd

    // Stop if we've filled the MD
    if (cursor >= mahadasha.endDate) break
  }

  return periods
}

function sumYears(mdLord: Graha, count: number): number {
  let sum = 0
  const startIdx = VIMSHOTTARI_ORDER.indexOf(mdLord)
  for (let i = 0; i < count; i++) {
    const lord = VIMSHOTTARI_ORDER[(startIdx + i) % 9]
    sum += (VIMSHOTTARI_YEARS[mdLord] * VIMSHOTTARI_YEARS[lord]) / 120
  }
  return sum
}

// ─── Dasha lord interpretations (brief) ──────────────────────────────────────

export const DASHA_INTERPRETATIONS: Record<Graha, string> = {
  Sun:     'A period of authority, recognition, and self-assertion. Government, father, leadership, ego matters come to the foreground. Health of bones and heart needs attention. Best for those with strong, well-placed Sun.',
  Moon:    'An emotional, fluctuating period centered on home, mother, and the inner life. Public dealings, women, comfort, and emotional growth dominate. Watch for moodiness and instability.',
  Mars:    'An aggressive, action-oriented period. Conflicts, sports, surgery, real estate, brothers, and sexual energy come into focus. Accidents and injuries possible. Decisive action favored.',
  Mercury: 'An intellectual, communicative period. Studies, business, writing, commerce, and travel flourish. Mental work and networking pay off. Best results when Mercury is well-placed.',
  Jupiter: 'The most auspicious dasha — wisdom, expansion, marriage, children, religion, and good fortune. Spiritual growth, education, and prosperity bloom. Often the peak of one\'s life.',
  Venus:   'A 20-year period of pleasure, love, art, marriage, vehicles, and refinement. The longest dasha. Romance, beauty, luxury, and creative expression dominate. Material comfort is highlighted.',
  Saturn:  'A 19-year period of slow, steady karma. Hard work, responsibility, delays, lessons, longevity, and the shadow side of life. Builds lasting structures through suffering and discipline.',
  Rahu:    'An 18-year period of obsession, ambition, foreign things, technology, and unconventional gains. Sudden rises and falls. Material desires intensify. Watch for confusion and illusion.',
  Ketu:    'A period of detachment, spiritual insight, sudden losses, and karmic resolutions. Mystical experiences possible. Worldly affairs become unsatisfying. Often a turning point toward inner life.',
}
