import { INTERPRETATIONS } from './interpretations'

// ─── Pythagorean letter-to-number table ──────────────────────────────────────
export const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
}

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])
export const MASTER_NUMBERS = new Set([11, 22, 33])

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Sum all digits of an integer */
export function sumDigits(n: number): number {
  return Math.abs(n)
    .toString()
    .split('')
    .reduce((s, d) => s + parseInt(d, 10), 0)
}

/**
 * Reduce a number to a single digit (1-9).
 * If keepMaster=true, stop at 11, 22, or 33 (master numbers).
 */
export function reduceNumber(n: number, keepMaster = true): number {
  n = Math.abs(n)
  if (keepMaster && MASTER_NUMBERS.has(n)) return n
  if (n <= 9) return n
  const r = sumDigits(n)
  if (keepMaster && MASTER_NUMBERS.has(r)) return r
  if (r <= 9) return r
  return reduceNumber(r, keepMaster)
}

/** Reduce the year independently (e.g. 1990 → 1+9+9+0=19 → 10 → 1) */
function reduceYear(year: number): number {
  return reduceNumber(sumDigits(year))
}

/** Compute the transition age (end of 1st Pinnacle) */
function transitionAge(lifePath: number): number {
  const lp = lifePath === 11 ? 2 : lifePath === 22 ? 4 : lifePath === 33 ? 6 : lifePath
  return 36 - lp
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CoreNumbers {
  lifePath: number
  expression: number
  soulUrge: number
  personality: number
  birthDayNumber: number
  maturityNumber: number
}

export interface AdvancedNumbers {
  hiddenPassion: number[]
  karmicLessons: number[]
  balanceNumber: number
  rationalThought: number
  realization: number
  subconsciousSelf: number
  cornerstone: string
  capstone: string
  firstVowel: string
}

export interface LifePhase {
  number: number
  startAge: number
  endAge: number
  label: string
  isActive: boolean
}

export interface TransitYear {
  year: number
  age: number
  personalYear: number
  essence: number
}

export interface LetterFrequency {
  num: number
  count: number
  intensity: number // 0-100 scale
}

export interface NumerologyResult {
  core: CoreNumbers
  advanced: AdvancedNumbers
  pinnacles: LifePhase[]
  challenges: number[]
  lifeCycles: LifePhase[]
  essenceCycle: TransitYear[]
  letterFrequency: LetterFrequency[]
  personalDay: {
    year: number
    month: number
    day: number
  }
  day: number
  month: number
  year: number
  name: string
}

// ─── Core calculations ────────────────────────────────────────────────────────

/** Life Path Number: reduce each component, then sum and reduce */
export function calcLifePath(day: number, month: number, year: number): number {
  const d = reduceNumber(day)
  const m = reduceNumber(month)
  const y = reduceYear(year)
  return reduceNumber(d + m + y)
}

/** Expression Number: all letters of full name */
export function calcExpression(name: string): number {
  if (!name.trim()) return 0
  const total = name
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .reduce((s, c) => s + (LETTER_VALUES[c] ?? 0), 0)
  return reduceNumber(total)
}

/** Soul Urge Number: vowels only */
export function calcSoulUrge(name: string): number {
  if (!name.trim()) return 0
  const total = name
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .filter(c => VOWELS.has(c))
    .reduce((s, c) => s + (LETTER_VALUES[c] ?? 0), 0)
  return reduceNumber(total)
}

/** Personality Number: consonants only */
export function calcPersonality(name: string): number {
  if (!name.trim()) return 0
  const total = name
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .filter(c => !VOWELS.has(c))
    .reduce((s, c) => s + (LETTER_VALUES[c] ?? 0), 0)
  return reduceNumber(total)
}

/** Birth Day Number: reduce day of birth */
export function calcBirthDayNumber(day: number): number {
  return reduceNumber(day)
}

/** Maturity Number: Life Path + Expression, reduced */
export function calcMaturityNumber(lifePath: number, expression: number): number {
  const lp = lifePath === 11 ? 2 : lifePath === 22 ? 4 : lifePath === 33 ? 6 : lifePath
  const ex = expression === 11 ? 2 : expression === 22 ? 4 : expression === 33 ? 6 : expression
  return reduceNumber(lp + ex)
}

/** Balanced initials */
export function calcBalanceNumber(name: string): number {
  if (!name.trim()) return 0
  const initials = name.trim().split(/\s+/).filter(part => part.length > 0).map(p => p[0].toUpperCase())
  const total = initials.reduce((s, c) => s + (LETTER_VALUES[c] ?? 0), 0)
  return reduceNumber(total)
}

/** Karmic Lessons: Numbers 1-9 missing from the full name */
export function calcKarmicLessons(name: string): number[] {
  if (!name.trim()) return []
  const present = new Set(name.toUpperCase().replace(/[^A-Z]/g, '').split('')
    .map(c => LETTER_VALUES[c]))
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !present.has(n))
}

/** Hidden Passion: Numbers appearing most frequently in the name */
export function calcHiddenPassion(name: string): number[] {
  if (!name.trim()) return []
  const counts: Record<number, number> = {}
  const cleanChars = name.toUpperCase().replace(/[^A-Z]/g, '').split('')
  if (cleanChars.length === 0) return []
  
  cleanChars.forEach(c => {
    const v = LETTER_VALUES[c]
    counts[v] = (counts[v] || 0) + 1
  })
  const max = Math.max(...Object.values(counts))
  if (max === 0) return []
  return Object.keys(counts).map(Number).filter(n => counts[n] === max)
}

/** General Purpose Number Frequency */
export function calcLetterFrequency(name: string): LetterFrequency[] {
  const counts: Record<number, number> = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 }
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '').split('')
  clean.forEach(c => { counts[LETTER_VALUES[c]]++ })
  const max = Math.max(...Object.values(counts), 1)
  return Object.keys(counts).map(Number).map(n => ({
    num: n,
    count: counts[n],
    intensity: Math.round((counts[n] / max) * 100)
  }))
}

export function calcEssenceCycle(name: string, birthYear: number, startAge = 0, count = 10): TransitYear[] {
  if (!name.trim()) return []
  const parts = name.trim().toUpperCase().split(/\s+/)
  
  const transits = parts.map(part => {
    const letters = part.split('')
    const values = letters.map(l => LETTER_VALUES[l])
    let timeline: number[] = []
    values.forEach(v => {
      for(let i=0; i<v; i++) timeline.push(v)
    })
    return timeline
  })

  const results: TransitYear[] = []
  for (let age = 0; age < 100; age++) {
    const essenceValue = transits.reduce((sum, t) => sum + (t[age % t.length] || 0), 0)
    const essence = reduceNumber(essenceValue)
    const year = birthYear + age
    
    if (age >= startAge && results.length < count) {
      results.push({ year, age, personalYear: 0, essence })
    }
  }
  return results
}

// ─── Life-phase calculations ──────────────────────────────────────────────────

/**
 * The four Pinnacle cycles.
 * Formula: 1st = Month+Day, 2nd = Day+Year, 3rd = 1st+2nd, 4th = Month+Year
 * Age boundaries derived from Life Path.
 */
export function calcPinnacles(
  day: number,
  month: number,
  year: number,
  lifePath: number,
  birthYear: number
): LifePhase[] {
  const d = reduceNumber(day)
  const m = reduceNumber(month)
  const y = reduceYear(year)

  const p1 = reduceNumber(m + d)
  const p2 = reduceNumber(d + y)
  const p3 = reduceNumber(p1 + p2)
  const p4 = reduceNumber(m + y)

  const t = transitionAge(lifePath)
  const currentAge = new Date().getFullYear() - birthYear

  return [
    { number: p1, startAge: 0, endAge: t,       label: '1st Pinnacle', isActive: currentAge < t },
    { number: p2, startAge: t, endAge: t + 9,   label: '2nd Pinnacle', isActive: currentAge >= t && currentAge < t + 9 },
    { number: p3, startAge: t + 9, endAge: t + 18, label: '3rd Pinnacle', isActive: currentAge >= t + 9 && currentAge < t + 18 },
    { number: p4, startAge: t + 18, endAge: 100, label: '4th Pinnacle', isActive: currentAge >= t + 18 },
  ]
}

/**
 * The four Challenge numbers.
 * Formula: C1=|Month-Day|, C2=|Day-Year|, C3=|C1-C2|, C4=|Month-Year|
 */
export function calcChallenges(day: number, month: number, year: number): number[] {
  const d = reduceNumber(day, false)
  const m = reduceNumber(month, false)
  const y = reduceNumber(sumDigits(year), false)

  const c1 = Math.abs(m - d)
  const c2 = Math.abs(d - y)
  const c3 = Math.abs(c1 - c2)
  const c4 = Math.abs(m - y)

  return [c1, c2, c3, c4]
}

/**
 * The three Life Cycle numbers.
 * Youth = Month, Maturity = Day, Wisdom = Year (each reduced)
 */
export function calcLifeCycles(
  day: number,
  month: number,
  year: number,
  lifePath: number
): LifePhase[] {
  const t = transitionAge(lifePath)
  return [
    { number: reduceNumber(month), startAge: 0,      endAge: t,      label: 'Youth Cycle',    isActive: false },
    { number: reduceNumber(day),   startAge: t,      endAge: t + 27, label: 'Maturity Cycle', isActive: false },
    { number: reduceYear(year),    startAge: t + 27, endAge: 100,    label: 'Wisdom Cycle',   isActive: false },
  ]
}

// ─── Main entry point ─────────────────────────────────────────────────────────

function activePhase<T extends { startAge: number; endAge: number; number: number }>(
  phases: T[],
  age: number
): number {
  return (phases.find(p => age >= p.startAge && age < p.endAge) ?? phases[phases.length - 1]).number
}

/**
 * Calculate the full numerology chart.
 */
export function calculate(dateStr: string, name: string): NumerologyResult | null {
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)

  if ([day, month, year].some(isNaN) || day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) return null

  const cleanName = name.trim()
  const lp = calcLifePath(day, month, year)
  const ex = cleanName ? calcExpression(cleanName) : 0
  const su = cleanName ? calcSoulUrge(cleanName) : 0
  const pe = cleanName ? calcPersonality(cleanName) : 0

  const nObj = cleanName.toUpperCase().replace(/[^A-Z]/g, '')
  const vowelsInName = nObj.split('').filter(c => VOWELS.has(c))
  
  const currentYearSelection = new Date().getFullYear()
  const currentMonthSelection = new Date().getMonth() + 1
  const currentDaySelection = new Date().getDate()

  const personalYearVal = reduceNumber(reduceNumber(day) + reduceNumber(month) + reduceNumber(currentYearSelection))
  const personalMonthVal = reduceNumber(personalYearVal + reduceNumber(currentMonthSelection))
  const personalDayVal = reduceNumber(personalMonthVal + reduceNumber(currentDaySelection))

  return {
    core: {
      lifePath: lp,
      expression: ex,
      soulUrge: su,
      personality: pe,
      birthDayNumber: reduceNumber(day),
      maturityNumber: ex > 0 ? calcMaturityNumber(lp, ex) : 0
    },
    advanced: {
      hiddenPassion: calcHiddenPassion(cleanName),
      karmicLessons: calcKarmicLessons(cleanName),
      balanceNumber: calcBalanceNumber(cleanName),
      rationalThought: reduceNumber(lp + (cleanName ? reduceNumber(name.trim().split(/\s+/)[0].length) : 0)),
      realization: ex > 0 ? reduceNumber(lp + su) : 0,
      subconsciousSelf: cleanName ? reduceNumber(9 - calcKarmicLessons(cleanName).length) : 0,
      cornerstone: cleanName ? cleanName.trim()[0].toUpperCase() : '',
      capstone: cleanName ? cleanName.trim().slice(-1).toUpperCase() : '',
      firstVowel: vowelsInName[0] || ''
    },
    pinnacles: calcPinnacles(day, month, year, lp, year),
    challenges: calcChallenges(day, month, year),
    lifeCycles: calcLifeCycles(day, month, year, lp),
    essenceCycle: calcEssenceCycle(cleanName, year, currentYearSelection - year, 10).map(t => ({
      ...t,
      personalYear: reduceNumber(reduceNumber(day) + reduceNumber(month) + reduceNumber(t.year))
    })),
    letterFrequency: calcLetterFrequency(cleanName),
    personalDay: { year: personalYearVal, month: personalMonthVal, day: personalDayVal },
    day, month, year, name: cleanName
  }
}

// ─── Tooltip descriptions ─────────────────────────────────────────────────────

export const NUMBER_MEANINGS: Record<number, string> = {
  1:  'Leadership, independence, new beginnings, originality.',
  2:  'Cooperation, diplomacy, sensitivity, partnerships.',
  3:  'Creativity, self-expression, joy, communication.',
  4:  'Stability, discipline, hard work, foundations.',
  5:  'Freedom, change, adventure, adaptability.',
  6:  'Nurturing, responsibility, harmony, service.',
  7:  'Introspection, spirituality, analysis, wisdom.',
  8:  'Ambition, authority, material success, power.',
  9:  'Compassion, humanitarianism, completion, idealism.',
  11: 'Master number – intuition, spiritual insight, inspiration.',
  22: 'Master number – master builder, visionary, practical idealism.',
  33: 'Master number – master teacher, selfless service, healing.',
  0:  'Requires a name to calculate.',
}

export const CORE_DESCRIPTIONS: Record<keyof CoreNumbers, { label: string; tooltip: string }> = {
  lifePath: {
    label: 'Life Path',
    tooltip: "The most important number. Derived from your full birth date, it reveals your life's purpose and the opportunities and challenges you'll face.",
  },
  expression: {
    label: 'Expression',
    tooltip: 'Derived from all letters of your full birth name. Reveals your natural talents, abilities, and what you are destined to express.',
  },
  soulUrge: {
    label: 'Soul Urge',
    tooltip: 'Calculated from the vowels of your name. Represents your deepest desires, motivations, and what truly drives you at soul level.',
  },
  personality: {
    label: 'Personality',
    tooltip: 'Calculated from the consonants of your name. Reveals the face you present to the world and how others perceive you.',
  },
  birthDayNumber: {
    label: 'Birth Day',
    tooltip: 'The reduced day of your birth. A special talent or gift you carry into this lifetime.',
  },
  maturityNumber: {
    label: 'Maturity',
    tooltip: 'Life Path + Expression. Emerges after age 35-40 and represents the person you are growing into becoming.',
  },
}

// ─── Extended Interpretation Helpers ──────────────────────────────────────────

/**
 * Generates a synthesized narrative "Core Blueprint" paragraph.
 */
export function getCoreBlueprint(core: CoreNumbers): string {
  const lp = INTERPRETATIONS[core.lifePath]
  const ex = INTERPRETATIONS[core.expression]
  const su = INTERPRETATIONS[core.soulUrge]

  if (!lp) return "Discover your cosmic blueprint by entering your details."

  let text = `You are ${lp.archetype} at your core. `
  
  if (ex && su) {
    text += `Your natural talents as ${ex.archetype} allow you to express your mission with unique flair, while your deepest soul desire (${su.archetype}) drives you toward fulfillment. `
    text += `Essentially, you are a leader and visionary who uses ${ex.positive[0].toLowerCase()} and ${su.positive[0].toLowerCase()} to navigate your destiny.`
  } else {
    text += lp.meaning
  }

  return text
}

/**
 * Analyzes letter frequency to identify dominant talents and karmic gaps.
 */
export function getIntensityAnalysis(freqs: LetterFrequency[]): { talents: number[], lessons: number[] } {
  const talents = freqs.filter(f => f.intensity >= 80).map(f => f.num)
  const lessons = freqs.filter(f => f.count === 0).map(f => f.num)
  return { talents, lessons }
}
