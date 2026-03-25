// ─── Destiny Matrix (Matrice del Destino) ─────────────────────────────────────
// Based on the 22-Arcana octagram system.
// Numbers are always reduced to the range 1-22 (not 1-9 as in standard numerology).

// ─── Reduction to 1–22 ───────────────────────────────────────────────────────

export function digitSum(n: number): number {
  return Math.abs(n)
    .toString()
    .split('')
    .reduce((s, d) => s + parseInt(d, 10), 0)
}

/**
 * Reduce a number to 1-22 by repeatedly summing its digits.
 * 0 maps to 22 (The Fool / universal potential).
 */
export function reduce22(n: number): number {
  n = Math.abs(n)
  while (n > 22) {
    n = digitSum(n)
    if (n === 0) return 22
  }
  return n === 0 ? 22 : n
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChakraKey =
  | 'root' | 'sacral' | 'solar' | 'heart'
  | 'throat' | 'third_eye' | 'crown' | 'soul_star'

export const CHAKRA_INFO: Record<ChakraKey, {
  name: string; nameFull: string; color: string; description: string
}> = {
  root:       { name: 'Root',       nameFull: 'Muladhara',    color: '#ef4444', description: 'Earth energy, survival, physical foundation, ancestral roots' },
  sacral:     { name: 'Sacral',     nameFull: 'Svadhisthana', color: '#f97316', description: 'Emotions, creativity, pleasure, karmic processing' },
  solar:      { name: 'Solar',      nameFull: 'Manipura',     color: '#eab308', description: 'Personal power, will, identity, ancestral gifts' },
  heart:      { name: 'Heart',      nameFull: 'Anahata',      color: '#22c55e', description: 'Unconditional love, talent, healing, compassion' },
  throat:     { name: 'Throat',     nameFull: 'Vishuddha',    color: '#3b82f6', description: 'Truth, expression, life purpose, communication' },
  third_eye:  { name: 'Third Eye',  nameFull: 'Ajna',         color: '#6366f1', description: 'Intuition, vision, social purpose, higher perception' },
  crown:      { name: 'Crown',      nameFull: 'Sahasrara',    color: '#8b5cf6', description: 'Consciousness, spirit, divine guidance, ancestral wisdom' },
  soul_star:  { name: 'Soul Star',  nameFull: 'Soul Star',    color: '#c084fc', description: 'Soul mission, universal love, karmic completion' },
}

/** One of the 9 positions in the octagram (8 outer + center) */
export interface MatrixPosition {
  key:       string
  label:     string       // e.g. "Personal Purpose"
  sublabel:  string       // e.g. "Day + Month"
  number:    number       // 1-22
  chakra:    ChakraKey
  angle:     number       // degrees, 0 = North (top), clockwise
  isCenter?: boolean
}

export interface DestinyMatrixResult {
  positions: MatrixPosition[]   // 8 outer positions
  center:    MatrixPosition     // soul code
  // Axes (pairs of positions for drawing lines)
  axes: Array<{ from: string; to: string; label: string; color: string }>
  // Derived single numbers
  personalYear:  number
  lifePurpose:   number   // North node
  karmicTask:    number   // South node
  // Raw reduced inputs
  d: number   // day (1-22)
  m: number   // month (1-12)
  y: number   // year digits summed (1-22)
}

// ─── Calculation ──────────────────────────────────────────────────────────────

/**
 * Calculate the full Destiny Matrix for a birth date.
 * @param day   1-31
 * @param month 1-12
 * @param year  4-digit year
 */
export function calcDestinyMatrix(
  day: number,
  month: number,
  year: number
): DestinyMatrixResult | null {
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) return null

  // Primary reductions
  const d = reduce22(day)          // Earth energy / personal energy
  const m = reduce22(month)        // Social energy (month is 1-12, fine as-is)
  const y = reduce22(digitSum(year)) // Ancestral karma / past-life energy

  // ── 8 Outer positions of the octagram ────────────────────────────────────
  //
  //              NORTH (n)
  //          /               \
  //    NW (nw)              NE (ne)
  //    |                        |
  //   WEST (w)     [C]      EAST (e)
  //    |                        |
  //    SW (sw)              SE (se)
  //          \               /
  //              SOUTH (s)
  //
  const n  = reduce22(d + m)          // North: Personal Purpose (D+M)
  const ne = m                         // NE: Social Energy (raw month)
  const e  = reduce22(m + y)          // East: Talent & Gift (M+Y)
  const se = d                         // SE: Earth Energy (raw day)
  const s  = reduce22(d + y)          // South: Karmic Task (D+Y)
  const sw = reduce22(y + n)          // SW: Ancestral Gift (Y+North)
  const w  = reduce22(m + n)          // West: Social Purpose (M+North)
  const nw = y                         // NW: Ancestral Karma (raw year)
  const c  = reduce22(d + m + y)      // Center: Soul Code (D+M+Y)

  const currentYear   = new Date().getFullYear()
  const personalYear  = reduce22(d + m + digitSum(currentYear))

  const positions: MatrixPosition[] = [
    { key: 'north', label: 'Personal Purpose', sublabel: 'D + M',     number: n,  chakra: 'crown',     angle: 0   },
    { key: 'ne',    label: 'Social Energy',    sublabel: 'Month',      number: ne, chakra: 'throat',    angle: 45  },
    { key: 'east',  label: 'Talent & Gift',    sublabel: 'M + Y',      number: e,  chakra: 'heart',     angle: 90  },
    { key: 'se',    label: 'Earth Energy',     sublabel: 'Day',        number: se, chakra: 'root',      angle: 135 },
    { key: 'south', label: 'Karmic Task',      sublabel: 'D + Y',      number: s,  chakra: 'sacral',    angle: 180 },
    { key: 'sw',    label: 'Ancestral Gift',   sublabel: 'Y + Purpose',number: sw, chakra: 'solar',     angle: 225 },
    { key: 'west',  label: 'Social Purpose',   sublabel: 'M + Purpose',number: w,  chakra: 'third_eye', angle: 270 },
    { key: 'nw',    label: 'Ancestral Karma',  sublabel: 'Year',       number: nw, chakra: 'soul_star', angle: 315 },
  ]

  const center: MatrixPosition = {
    key: 'center', label: 'Soul Code', sublabel: 'D + M + Y',
    number: c, chakra: 'soul_star', angle: 0, isCenter: true,
  }

  // The 4 fate axes through the center
  const axes = [
    { from: 'north', to: 'south', label: 'Spiritual Axis', color: '#8b5cf6' },   // vertical
    { from: 'east',  to: 'west',  label: 'Material Axis',  color: '#3b82f6' },   // horizontal
    { from: 'ne',    to: 'sw',    label: 'Destiny Line',   color: '#f472b6' },   // diagonal 1
    { from: 'nw',    to: 'se',    label: 'Karmic Line',    color: '#fbbf24' },   // diagonal 2
  ]

  return {
    positions,
    center,
    axes,
    personalYear,
    lifePurpose: n,
    karmicTask:  s,
    d, m, y,
  }
}

// ─── Interpretation helpers ──────────────────────────────────────────────────

export const POSITION_INTERPRETATIONS: Record<string, string> = {
  north:  'Your central life mission — the highest expression you are working toward in this incarnation.',
  ne:     'How you engage with society and the world around you. Your social face and relational energy.',
  east:   'Natural talents and gifts that flow through you. Where your energy is most potent and resourced.',
  se:     'Your physical-world energy. How you inhabit your body, navigate material reality, and ground yourself.',
  south:  'The karmic task you came to resolve. Challenges in this area carry the seeds of your greatest growth.',
  sw:     'Gifts inherited from your ancestral lineage — energies your family line has mastered over generations.',
  west:   'The social role you are called to play. How your purpose manifests in community and collective contexts.',
  nw:     'Karmic imprints from ancestral and past-life patterns. The unconscious programming you are here to transcend.',
  center: 'Your soul code — the pure essence of what you are and why you came. The heart of your entire matrix.',
}
