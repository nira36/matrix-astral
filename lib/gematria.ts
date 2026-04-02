// ─── Gematria Systems ─────────────────────────────────────────────────────────

export type GematriaSystem = 'pythagorean' | 'simple' | 'chaldean'

/**
 * Pythagorean (modern): A=1…I=9, J=1…R=9, S=1…Z=8
 */
const PYTHAGOREAN: Record<string, number> = {
  A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, I:9,
  J:1, K:2, L:3, M:4, N:5, O:6, P:7, Q:8, R:9,
  S:1, T:2, U:3, V:4, W:5, X:6, Y:7, Z:8,
}

/**
 * Simple (ordinal): A=1, B=2, … Z=26
 */
const SIMPLE: Record<string, number> = {}
for (let i = 0; i < 26; i++) {
  SIMPLE[String.fromCharCode(65 + i)] = i + 1
}

/**
 * Chaldean (ancient): A=1,B=2,C=3,D=4,E=5,U=6,O=7,F=8,P=8,
 * skips 9 for letters (9=divine). Derived from traditional table.
 */
const CHALDEAN: Record<string, number> = {
  A:1, I:1, J:1, Q:1, Y:1,
  B:2, K:2, R:2,
  C:3, G:3, L:3, S:3,
  D:4, M:4, T:4,
  E:5, H:5, N:5, X:5,
  U:6, V:6, W:6,
  O:7, Z:7,
  F:8, P:8,
}

const TABLES: Record<GematriaSystem, Record<string, number>> = {
  pythagorean: PYTHAGOREAN,
  simple: SIMPLE,
  chaldean: CHALDEAN,
}

export interface GematriaResult {
  raw: number
  reduced: number
  system: GematriaSystem
  input: string
}

function reduceGematria(n: number): number {
  if (n <= 9 || n === 11 || n === 22 || n === 33) return n
  return reduceGematria(n.toString().split('').reduce((s, d) => s + parseInt(d, 10), 0))
}

export function calcGematria(input: string, system: GematriaSystem): GematriaResult {
  const table = TABLES[system]
  const clean = input.toUpperCase().replace(/[^A-Z]/g, '')
  const raw = clean.split('').reduce((s, c) => s + (table[c] ?? 0), 0)
  return { raw, reduced: reduceGematria(raw), system, input }
}

export const SYSTEM_LABELS: Record<GematriaSystem, { label: string; description: string }> = {
  pythagorean: { label: 'Pythagorean', description: 'Modern Western — cyclical 1-9 mapping' },
  simple: { label: 'Simple / Ordinal', description: 'A=1 to Z=26 — face value of each letter' },
  chaldean: { label: 'Chaldean', description: 'Ancient Babylonian — 9 is sacred, excluded from letters' },
}

/** All three systems at once */
export function calcAllGematria(input: string): GematriaResult[] {
  return (['pythagorean', 'simple', 'chaldean'] as GematriaSystem[]).map(s => calcGematria(input, s))
}

/** Letter breakdown for a given system */
export interface LetterBreakdown {
  letter: string
  value: number
}
export function letterBreakdown(input: string, system: GematriaSystem): LetterBreakdown[] {
  const table = TABLES[system]
  return input.toUpperCase().replace(/[^A-Z]/g, '').split('').map(letter => ({
    letter,
    value: table[letter] ?? 0,
  }))
}
