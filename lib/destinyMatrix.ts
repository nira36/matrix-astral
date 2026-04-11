// ─── Destiny Matrix (Matrice del Destino) ─────────────────────────────────────
// Based on the 22-Arcana esoteric system.
// Numbers are always reduced to the range 1-22.

// ─── Reduction to 1–22 ───────────────────────────────────────────────────────

export function digitSum(n: number): number {
  return Math.abs(n)
    .toString()
    .split('')
    .reduce((s, d) => s + parseInt(d, 10), 0)
}

/**
 * Reduce a number to 1-22. If result > 22, sum its digits again.
 * 0 maps to 22.
 */
export function reduce22(n: number): number {
  n = Math.abs(n)
  if (n === 0) return 22
  while (n > 22) {
    n = digitSum(n)
  }
  return n === 0 ? 22 : n
}

export interface AgePoint {
  age: number
  number: number
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MatrixPoint {
  key:      string
  number:   number
  label:    string     // Italian name from the book (e.g. "Anima")
  formula:  string     // Formula string (e.g. "A+B+C")
  color:    string
  icon?:    'heart' | 'dollar'
}

export interface ChakraMapItem {
  name:     string
  phys:     number    // Fisica
  ener:     number    // Energia
  emot:     number    // Emozioni (Result)
  color:    string
  points:   [string, string]
}

export interface LifePeriodItem {
  startAge: number
  endAge:   number
  energy:   number
}

export interface LifePeriods {
  youth:         LifePeriodItem[]
  youthMaturity: LifePeriodItem[]
  maturity:      LifePeriodItem[]
  maturityOld:   LifePeriodItem[]
}

export interface DestinyMatrixResult {
  points: Record<string, MatrixPoint>
  summaries: Array<{ area: string, values: string }>
  purpose: {
    personal:  number
    heaven:    number
    earth:     number
    social:    number
    male:      number
    female:    number
    spiritual: number
  }
  chakraMap: Record<string, ChakraMapItem>
  chakraTotal: {
    phys: number
    ener: number
    emot: number
  }
  lifePeriods: LifePeriods
  d: number
  m: number
  y: number
  personalYear: number
  ageCircle: AgePoint[]
}

// ─── Calculation ──────────────────────────────────────────────────────────────

/**
 * Calculate the full Destiny Matrix for a birth date.
 * Based on Pages 102-108 of the reference book.
 */
export function calcDestinyMatrix(
  day: number,
  month: number,
  year: number
): DestinyMatrixResult | null {
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) return null

  // 1. Primary Diamond (Rombo Principale - Page 102)
  const A = reduce22(day)
  const B = reduce22(month)
  const C = reduce22(digitSum(year))
  const D = reduce22(A + B + C)
  const E = reduce22(A + B + C + D)

  // 2. Diagonal Formulas (Formule nella diagonale - Page 102)
  const J = reduce22(A + E)
  const K = reduce22(B + E)
  const L = reduce22(C + E)
  const M = reduce22(D + E)

  // 3. Other Formulas (Altre Formule - Page 103)
  const O = reduce22(A + J)
  const P = reduce22(B + K)
  const Q = reduce22(L + C)
  const N = reduce22(M + D)
  const S = reduce22(J + E)
  const T = reduce22(K + E)

  // 4. Main Square (Quadrato Principale - Page 104)
  const F = reduce22(A + B)
  const G = reduce22(B + C)
  const H = reduce22(C + D)
  const I = reduce22(D + A)

  const L2 = reduce22(F + G + H + I)
  const L1 = reduce22(E + L2)

  // 5. Intermediate Groups (Page 104-105)
  const F2 = reduce22(F + L2)
  const G2 = reduce22(G + L2)
  const H2 = reduce22(H + L2)
  const I2 = reduce22(I + L2)

  const F1 = reduce22(F + F2)
  const G1 = reduce22(G + G2)
  const H1 = reduce22(H + H2)
  const I1 = reduce22(I + I2)

  const R  = reduce22(M + L)
  const R1 = reduce22(R + M)
  const R2 = reduce22(R + L)

  // 6. Human Purpose (Scopo dell'Uomo - Page 106)
  const scopoPers = reduce22(reduce22(A + C) + reduce22(B + D))
  const scopoSoc  = reduce22(reduce22(F + H) + reduce22(G + I))
  const scopoSpir = reduce22(scopoPers + scopoSoc)

  // 7. Chakra Map (Page 108)
  const sahasrara     = reduce22(A + B)
  const ajna          = reduce22(O + P)
  const vishuddha     = reduce22(J + K)
  const anahata       = reduce22(S + T)
  const manipura      = reduce22(E + E)
  const svadhisthana  = reduce22(L + M)
  const muladhara     = reduce22(C + D)

  const currentYear   = new Date().getFullYear()
  const personalYear  = reduce22(A + B + digitSum(currentYear))

  const p: Record<string, MatrixPoint> = {
    A:  { key: 'A',  number: A,  label: 'Soul / Day',               formula: 'Reduced Day',    color: '#4C1D95' }, // Deep Purple
    B:  { key: 'B',  number: B,  label: 'Birth Month',             formula: 'Month',          color: '#4C1D95' }, // Deep Purple
    C:  { key: 'C',  number: C,  label: 'Birth Year',              formula: 'Year Sum',       color: '#7F1D1D' }, // Deep Red
    D:  { key: 'D',  number: D,  label: 'Incarnation Task',        formula: 'A+B+C',          color: '#7F1D1D' }, // Deep Red
    E:  { key: 'E',  number: E,  label: 'Comfort Zone',            formula: 'A+B+C+D',        color: '#854D0E' }, // Muted Gold
    
    J:  { key: 'J',  number: J,  label: 'Parental Karma',          formula: 'A+E',            color: '#1E3A8A' }, // Midnight Blue
    K:  { key: 'K',  number: K,  label: 'Personal Talent',         formula: 'B+E',            color: '#155E75' }, // Dark Teal
    L:  { key: 'L',  number: L,  label: 'Money Channel',           formula: 'C+E',            color: '#9A3412' }, // Rust Orange
    M:  { key: 'M',  number: M,  label: 'Karmic Tail',             formula: 'D+E',            color: '#7F1D1D' }, // Deep Red
    
    O:  { key: 'O',  number: O,  label: 'Parental Relationship',   formula: 'A+J',            color: '#312E81' }, // Deep Indigo
    P:  { key: 'P',  number: P,  label: 'High Talent',             formula: 'B+K',            color: '#0E7490' }, // Teal
    Q:  { key: 'Q',  number: Q,  label: 'Money Flow (In)',         formula: 'L+C',            color: '#7C2D12' }, // Burnt Orange
    N:  { key: 'N',  number: N,  label: 'Karmic Debt',             formula: 'M+D',            color: '#450A0A' }, // Maroon
    
    S:  { key: 'S',  number: S,  label: 'Soul Development',        formula: 'J+E',            color: '#064E3B' }, // Dark Green
    T:  { key: 'T',  number: T,  label: 'Soul Talent',             formula: 'K+E',            color: '#064E3B' }, // Dark Green
    
    F:  { key: 'F',  number: F,  label: 'Paternal Line',           formula: 'A+B',            color: '#475569' }, // Slate
    G:  { key: 'G',  number: G,  label: 'Maternal Line',           formula: 'B+C',            color: '#475569' },
    H:  { key: 'H',  number: H,  label: 'Ancestral Line SE',       formula: 'C+D',            color: '#475569' },
    I:  { key: 'I',  number: I,  label: 'Ancestral Line SW',       formula: 'D+A',            color: '#475569' },

    F2: { key: 'F2', number: F2, label: 'Human Talent',            formula: 'F+L2',           color: '#334155' },
    F1: { key: 'F1', number: F1, label: 'Paternal Potential',      formula: 'F+F2',           color: '#1E293B' },
    G2: { key: 'G2', number: G2, label: 'Maternal Talent',         formula: 'G+L2',           color: '#334155' },
    G1: { key: 'G1', number: G1, label: 'Maternal Potential',      formula: 'G+G2',           color: '#1E293B' },
    
    H2: { key: 'H2', number: H2, label: 'Ancestral Talent SE',     formula: 'H+L2',           color: '#334155' },
    H1: { key: 'H1', number: H1, label: 'SE Line Karma',           formula: 'H+H2',           color: '#1E293B' },
    I2: { key: 'I2', number: I2, label: 'Ancestral Talent SW',     formula: 'I+L2',           color: '#334155' },
    I1: { key: 'I1', number: I1, label: 'SW Line Karma',           formula: 'I+I2',           color: '#1E293B' },
    
    L2: { key: 'L2', number: L2, label: 'Square Balance',          formula: 'F+G+H+I',        color: '#64748B' },
    L1: { key: 'L1', number: L1, label: 'Light Point',             formula: 'E+L2',           color: '#64748B' },

    R:  { key: 'R',  number: R,  label: 'Relationship Point',      formula: 'M+L',            color: '#831843', icon: 'heart' }, // Deep Pink
    R1: { key: 'R1', number: R1, label: 'Relationship Nature',     formula: 'R+M',            color: '#831843', icon: 'heart' }, // Deep Pink
    R2: { key: 'R2', number: R2, label: 'Success Area',            formula: 'R+L',            color: '#14532D', icon: 'dollar' }, // Dark Green
  }

  const summaries = [
    { area: 'Character',        values: `A: ${p.A.number}, B: ${p.B.number}` },
    { area: 'Karmic Tail',      values: `M: ${p.M.number}, N: ${p.N.number}, D: ${p.D.number}` },
    { area: 'Talents',          values: `K: ${p.K.number}, F2: ${p.F2.number}, G2: ${p.G2.number}` },
    { area: 'Relationships/Love', values: `M: ${p.M.number}, R1: ${p.R1.number}, R: ${p.R.number}` },
    { area: 'Finance/Career',   values: `L: ${p.L.number}, R2: ${p.R2.number}, R: ${p.R.number}` },
  ]

  // Muted, earthy palette that harmonizes with The Magician (#a8879d)
  const chakraMap: Record<string, ChakraMapItem> = {
    sahasrara:    { name: 'Sahasrara (Crown)',       phys: A, ener: B, emot: sahasrara,    color: '#a8879d', points: ['A', 'B'] },
    ajna:         { name: 'Ajna (Third Eye)',        phys: O, ener: P, emot: ajna,         color: '#8b7a9d', points: ['O', 'P'] },
    vishuddha:    { name: 'Vishuddha (Throat)',      phys: J, ener: K, emot: vishuddha,    color: '#7a8b9d', points: ['J', 'K'] },
    anahata:      { name: 'Anahata (Heart)',         phys: S, ener: T, emot: anahata,      color: '#8b9d87', points: ['S', 'T'] },
    manipura:     { name: 'Manipura (Solar Plexus)', phys: E, ener: E, emot: manipura,     color: '#b8a87a', points: ['E', 'E'] },
    svadhisthana: { name: 'Svadhisthana (Sacral)',   phys: L, ener: M, emot: svadhisthana, color: '#b8927a', points: ['L', 'M'] },
    muladhara:    { name: 'Muladhara (Root)',        phys: C, ener: D, emot: muladhara,    color: '#9d7a7a', points: ['C', 'D'] },
  }

  const cList = Object.values(chakraMap)
  const chakraTotal = {
    phys: reduce22(cList.reduce((s, c) => s + c.phys, 0)),
    ener: reduce22(cList.reduce((s, c) => s + c.ener, 0)),
    emot: reduce22(cList.reduce((s, c) => s + c.emot, 0)),
  }

  // 8. Advanced Life Periods (Prognosis)
  const lifePeriods = calculateLifePeriodsFromMatrix(p)

  return {
    points: p,
    summaries,
    purpose: {
      personal:  scopoPers,
      heaven:    reduce22(B + D),
      earth:     reduce22(A + C),
      social:    scopoSoc,
      male:      reduce22(F + H),
      female:    reduce22(G + I),
      spiritual: scopoSpir
    },
    chakraMap,
    chakraTotal,
    lifePeriods,
    d: A, 
    m: B, 
    y: C,
    personalYear,
    ageCircle: calculateAgeCircle(p)
  }
}

/**
 * Calculate the 80 points of the age cycle around the boundary.
 */
function calculateAgeCircle(points: Record<string, MatrixPoint>): AgePoint[] {
  const intervals: [string, string][] = [
    ['A', 'F'], ['F', 'B'], ['B', 'G'], ['G', 'C'],
    ['C', 'H'], ['H', 'D'], ['D', 'I'], ['I', 'A']
  ]
  const fullCircle: AgePoint[] = []

  intervals.forEach(([startKey, endKey], idx) => {
    const s = points[startKey].number
    const e = points[endKey].number
    const baseAge = idx * 10

    // Add the start node of this 10-year interval
    fullCircle.push({ age: baseAge, number: s })

    // Binary summation tree for 1.25 year increments
    const p1 = reduce22(s + e) // 5.0
    const p2 = reduce22(s + p1) // 2.5
    const p3 = reduce22(p1 + e) // 7.5

    const p4 = reduce22(s + p2)  // 1.25
    const p5 = reduce22(p2 + p1) // 3.75
    const p6 = reduce22(p1 + p3) // 6.25
    const p7 = reduce22(p3 + e)  // 8.75

    fullCircle.push({ age: baseAge + 1.25, number: p4 })
    fullCircle.push({ age: baseAge + 2.5,  number: p2 })
    fullCircle.push({ age: baseAge + 3.75, number: p5 })
    fullCircle.push({ age: baseAge + 5,    number: p1 })
    fullCircle.push({ age: baseAge + 6.25, number: p6 })
    fullCircle.push({ age: baseAge + 7.5,  number: p3 })
    fullCircle.push({ age: baseAge + 8.75, number: p7 })
  })

  return fullCircle
}

/**
 * Advanced Life Periods (Prognosis) based on the 80-year Boundary Age Cycle.
 * Uses recursive binary summation of the 8 main vertices.
 */
export function calculateLifePeriodsFromMatrix(points: Record<string, MatrixPoint>): LifePeriods {
  const intervals: [string, string][] = [
    ['A', 'F'], ['F', 'B'], ['B', 'G'], ['G', 'C'],
    ['C', 'H'], ['H', 'D'], ['D', 'I'], ['I', 'A']
  ]

  // Phase structure for 10-year intervals (recursive binary points):
  // [startAgeOffset, endAgeOffset, internalPointAge]
  const phaseMap: [number, number, number][] = [
    [0, 1, 0],       // Vertex (e.g., 0, 10...)
    [1, 2.5, 1.25],  // Quarter
    [2.5, 3.5, 2.5], // Mid-quarter
    [3.5, 4, 3.75],  // Quarter
    [4, 6, 5],       // Mid-vertex (e.g., 5, 15...)
    [6, 7.5, 6.25],  // Quarter
    [7.5, 8.5, 7.5], // Mid-quarter
    [8.5, 9, 8.75],  // Quarter
  ]

  const allPhases: LifePeriodItem[] = []

  intervals.forEach(([startKey, endKey], idx) => {
    const s = points[startKey].number
    const e = points[endKey].number
    const baseAge = idx * 10

    // Binary summation tree for 1.25 year increments
    const p5 = reduce22(s + e)         // 5.0
    const p2_5 = reduce22(s + p5)      // 2.5
    const p7_5 = reduce22(p5 + e)      // 7.5
    const p1_25 = reduce22(s + p2_5)   // 1.25
    const p3_75 = reduce22(p2_5 + p5)  // 3.75
    const p6_25 = reduce22(p5 + p7_5)  // 6.25
    const p8_75 = reduce22(p7_5 + e)   // 8.75

    const pointValues: Record<number, number> = {
      0: s,
      1.25: p1_25,
      2.5: p2_5,
      3.75: p3_75,
      5: p5,
      6.25: p6_25,
      7.5: p7_5,
      8.75: p8_75
    }

    phaseMap.forEach(([start, end, offset]) => {
      let finalStart = baseAge + start
      let finalEnd = baseAge + end

      // Adjust vertices (0, 10, 20...) to match reference ranges:
      // Vertex V covers [V-1, V+1], but V=0 starts at 0.
      if (offset === 0 && baseAge > 0) {
        finalStart = baseAge - 1
      }

      allPhases.push({
        startAge: finalStart,
        endAge: finalEnd,
        energy: pointValues[offset]
      })
    })
  })

  return {
    youth:         allPhases.slice(0, 16),
    youthMaturity: allPhases.slice(16, 32),
    maturity:      allPhases.slice(32, 48),
    maturityOld:   allPhases.slice(48, 64),
  }
}
