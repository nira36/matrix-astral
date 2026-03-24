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

export interface LifePhase {
  number: number
  startAge: number
  endAge: number
  label: string
  isActive: boolean
}

export interface LifePhasePoint {
  age: number
  pinnacle: number
  challenge: number
  cycle: number
}

export interface NumerologyResult {
  core: CoreNumbers
  pinnacles: LifePhase[]
  challenges: number[]
  lifeCycles: LifePhase[]
  lifePhasePoints: LifePhasePoint[]
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
  const lp = lifePath === 11 ? 2 : lifePath === 22 ? 4 : lifePath
  const ex = expression === 11 ? 2 : expression === 22 ? 4 : expression
  return reduceNumber(lp + ex)
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
 * @param dateStr  "DD/MM/YYYY"
 * @param name     Full birth name (optional for name-based numbers)
 */
export function calculate(dateStr: string, name: string): NumerologyResult | null {
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null

  const day   = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year  = parseInt(parts[2], 10)

  if ([day, month, year].some(isNaN))           return null
  if (day < 1 || day > 31)                      return null
  if (month < 1 || month > 12)                  return null
  if (year < 1000 || year > new Date().getFullYear()) return null

  const lifePath      = calcLifePath(day, month, year)
  const expression    = name.trim() ? calcExpression(name)   : 0
  const soulUrge      = name.trim() ? calcSoulUrge(name)     : 0
  const personality   = name.trim() ? calcPersonality(name)  : 0
  const birthDayNumber = calcBirthDayNumber(day)
  const maturityNumber = expression > 0 ? calcMaturityNumber(lifePath, expression) : 0

  const pinnacles  = calcPinnacles(day, month, year, lifePath, year)
  const challenges = calcChallenges(day, month, year)
  const lifeCycles = calcLifeCycles(day, month, year, lifePath)

  // Build per-decade data points for ages 0-70
  const ages: number[] = [0, 10, 20, 30, 40, 50, 60, 70]
  const lifePhasePoints: LifePhasePoint[] = ages.map((age) => ({
    age,
    pinnacle: activePhase(pinnacles, age),
    challenge: challenges[
      pinnacles.findIndex(p => age >= p.startAge && age < p.endAge)
    ] ?? challenges[challenges.length - 1],
    cycle: activePhase(lifeCycles, age),
  }))

  return {
    core: { lifePath, expression, soulUrge, personality, birthDayNumber, maturityNumber },
    pinnacles,
    challenges,
    lifeCycles,
    lifePhasePoints,
    day, month, year, name,
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
