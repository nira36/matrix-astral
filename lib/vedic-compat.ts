// ─── Ashtakoot Milan — Vedic Marriage Compatibility ─────────────────────────
// 36-point matching system based on Moon's nakshatra and rashi.
// 8 categories (Koota), each with a specific point value. Total max = 36.
// Score interpretation: 18+ acceptable, 24+ very good, 30+ excellent.
// Source: Brihat Parashara Hora Shastra, Muhurta Chintamani.

import type { Rashi, Graha, NakshatraData } from './vedic-data'
import { RASHI_DATA, NAKSHATRAS } from './vedic-data'

// ─── Nadi classification (for Nadi Koota) ────────────────────────────────────
// 27 nakshatras divided into 3 Nadis (Adi, Madhya, Antya)
const NADI_OF_NAKSHATRA: Record<string, 'Adi' | 'Madhya' | 'Antya'> = {
  'Ashwini':           'Adi',
  'Bharani':           'Madhya',
  'Krittika':          'Antya',
  'Rohini':            'Antya',
  'Mrigashira':        'Madhya',
  'Ardra':             'Adi',
  'Punarvasu':         'Adi',
  'Pushya':            'Madhya',
  'Ashlesha':          'Antya',
  'Magha':             'Antya',
  'Purva Phalguni':    'Madhya',
  'Uttara Phalguni':   'Adi',
  'Hasta':             'Adi',
  'Chitra':            'Madhya',
  'Swati':             'Antya',
  'Vishakha':          'Antya',
  'Anuradha':          'Madhya',
  'Jyeshtha':          'Adi',
  'Mula':              'Adi',
  'Purva Ashadha':     'Madhya',
  'Uttara Ashadha':    'Antya',
  'Shravana':          'Antya',
  'Dhanishta':         'Madhya',
  'Shatabhisha':       'Adi',
  'Purva Bhadrapada':  'Adi',
  'Uttara Bhadrapada': 'Madhya',
  'Revati':            'Antya',
}

// ─── Varna by Rashi (caste hierarchy) ────────────────────────────────────────
// Brahmin (4) > Kshatriya (3) > Vaishya (2) > Shudra (1)
const VARNA_OF_RASHI: Record<Rashi, { name: string; level: number }> = {
  Karka:      { name: 'Brahmin',   level: 4 },
  Vrishchika: { name: 'Brahmin',   level: 4 },
  Meena:      { name: 'Brahmin',   level: 4 },
  Mesha:      { name: 'Kshatriya', level: 3 },
  Simha:      { name: 'Kshatriya', level: 3 },
  Dhanu:      { name: 'Kshatriya', level: 3 },
  Vrishabha:  { name: 'Vaishya',   level: 2 },
  Kanya:      { name: 'Vaishya',   level: 2 },
  Makara:     { name: 'Vaishya',   level: 2 },
  Mithuna:    { name: 'Shudra',    level: 1 },
  Tula:       { name: 'Shudra',    level: 1 },
  Kumbha:     { name: 'Shudra',    level: 1 },
}

// ─── Vashya by Rashi ─────────────────────────────────────────────────────────
type VashyaCategory = 'Quadruped' | 'Human' | 'Aquatic' | 'WildAnimal' | 'Insect'
const VASHYA_OF_RASHI: Record<Rashi, VashyaCategory> = {
  Mesha:      'Quadruped',
  Vrishabha:  'Quadruped',
  Mithuna:    'Human',
  Karka:      'Aquatic',
  Simha:      'WildAnimal',
  Kanya:      'Human',
  Tula:       'Human',
  Vrishchika: 'Insect',
  Dhanu:      'Quadruped',  // first half is human, second half quadruped — simplified
  Makara:     'Aquatic',     // simplified
  Kumbha:     'Human',
  Meena:      'Aquatic',
}

const VASHYA_SCORE: Record<VashyaCategory, Partial<Record<VashyaCategory, number>>> = {
  Quadruped:  { Quadruped: 2, Human: 1, Aquatic: 1, WildAnimal: 0, Insect: 1 },
  Human:      { Quadruped: 1, Human: 2, Aquatic: 0.5, WildAnimal: 0, Insect: 0.5 },
  Aquatic:    { Quadruped: 1, Human: 0.5, Aquatic: 2, WildAnimal: 1, Insect: 0.5 },
  WildAnimal: { Quadruped: 0, Human: 0, Aquatic: 1, WildAnimal: 2, Insect: 0 },
  Insect:     { Quadruped: 1, Human: 0.5, Aquatic: 0.5, WildAnimal: 0, Insect: 2 },
}

// ─── Yoni compatibility ─────────────────────────────────────────────────────
// Each nakshatra has a yoni (animal). 14 yonis total.
// Mortal enemy pairs score 0 (or 1 in lighter cases).
// Same yoni = 4, friendly = 3, neutral = 2, enemy = 1, mortal enemy = 0.

// Normalize "Bull" → "Cow" since some sources use Bull for Uttara Phalguni
function normalizeYoni(y: string): string {
  if (y === 'Bull') return 'Cow'
  return y
}

const MORTAL_ENEMY_YONI_PAIRS: Array<[string, string]> = [
  ['Cow', 'Tiger'],
  ['Elephant', 'Lion'],
  ['Horse', 'Buffalo'],
  ['Dog', 'Deer'],
  ['Serpent', 'Mongoose'],
  ['Cat', 'Rat'],
  ['Sheep', 'Monkey'],
]

function yoniScore(yoniA: string, yoniB: string): number {
  const a = normalizeYoni(yoniA)
  const b = normalizeYoni(yoniB)
  if (a === b) return 4
  for (const [x, y] of MORTAL_ENEMY_YONI_PAIRS) {
    if ((a === x && b === y) || (a === y && b === x)) return 0
  }
  return 2  // neutral
}

// ─── Graha Maitri (friendship of Moon-rashi lords) ──────────────────────────
const PLANET_FRIENDSHIPS: Record<Graha, { friends: Graha[]; neutrals: Graha[]; enemies: Graha[] }> = {
  Sun:     { friends: ['Moon', 'Mars', 'Jupiter'], neutrals: ['Mercury'],                  enemies: ['Venus', 'Saturn'] },
  Moon:    { friends: ['Sun', 'Mercury'],          neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: [] },
  Mars:    { friends: ['Sun', 'Moon', 'Jupiter'],  neutrals: ['Venus', 'Saturn'],          enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'],            neutrals: ['Mars', 'Jupiter', 'Saturn'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'],     neutrals: ['Saturn'],                   enemies: ['Mercury', 'Venus'] },
  Venus:   { friends: ['Mercury', 'Saturn'],       neutrals: ['Mars', 'Jupiter'],          enemies: ['Sun', 'Moon'] },
  Saturn:  { friends: ['Mercury', 'Venus'],        neutrals: ['Jupiter'],                  enemies: ['Sun', 'Moon', 'Mars'] },
  Rahu:    { friends: ['Venus', 'Saturn'],         neutrals: ['Jupiter', 'Mercury'],       enemies: ['Sun', 'Moon', 'Mars'] },
  Ketu:    { friends: ['Mars', 'Venus', 'Saturn'], neutrals: ['Jupiter', 'Mercury'],       enemies: ['Sun', 'Moon'] },
}

function grahaMaitriScore(rashiA: Rashi, rashiB: Rashi): number {
  const lordA = RASHI_DATA[rashiA].ruler as Graha
  const lordB = RASHI_DATA[rashiB].ruler as Graha
  if (lordA === lordB) return 5
  const friendsA = PLANET_FRIENDSHIPS[lordA].friends
  const friendsB = PLANET_FRIENDSHIPS[lordB].friends
  const enemiesA = PLANET_FRIENDSHIPS[lordA].enemies

  const aFriendsB = friendsA.includes(lordB)
  const bFriendsA = friendsB.includes(lordA)
  const aEnemyB = enemiesA.includes(lordB)

  if (aFriendsB && bFriendsA) return 5
  if (aFriendsB || bFriendsA) return 4
  if (!aFriendsB && !bFriendsA && !aEnemyB) return 3  // mutual neutral
  if (aEnemyB) return 0
  return 1
}

// ─── Bhakoot (Moon sign distance) ───────────────────────────────────────────
function bhakootScore(rashiA: Rashi, rashiB: Rashi): { score: number; dosha: boolean; reason: string } {
  const RASHIS_LIST: Rashi[] = [
    'Mesha', 'Vrishabha', 'Mithuna', 'Karka',
    'Simha', 'Kanya', 'Tula', 'Vrishchika',
    'Dhanu', 'Makara', 'Kumbha', 'Meena',
  ]
  const idxA = RASHIS_LIST.indexOf(rashiA)
  const idxB = RASHIS_LIST.indexOf(rashiB)
  const distAB = ((idxB - idxA + 12) % 12) + 1
  const distBA = ((idxA - idxB + 12) % 12) + 1

  // Bhakoot dosha: 6/8 (Shadashtak), 2/12 (Dwirdwadasha), 5/9 (Navam-Pancham — actually OK, scores well)
  const positions = [distAB, distBA].sort((a, b) => a - b)
  const pair = `${positions[0]}-${positions[1]}`

  if (pair === '6-8' || pair === '8-6') return { score: 0, dosha: true, reason: '6/8 Shadashtak, friction, illness, mutual obstruction' }
  if (pair === '2-12') return { score: 0, dosha: true, reason: '2/12 Dwirdwadasha, financial loss, separation' }

  return { score: 7, dosha: false, reason: 'No Bhakoot dosha, mutually supportive sign relationship' }
}

// ─── Nadi (pulse compatibility) ─────────────────────────────────────────────
function nadiScore(nakshatraA: string, nakshatraB: string): { score: number; dosha: boolean } {
  const nA = NADI_OF_NAKSHATRA[nakshatraA]
  const nB = NADI_OF_NAKSHATRA[nakshatraB]
  if (nA === nB) return { score: 0, dosha: true }   // Same Nadi = Nadi Dosha
  return { score: 8, dosha: false }
}

// ─── Tara Bala (birth star compatibility) ──────────────────────────────────
function taraScore(nakshatraIdxA: number, nakshatraIdxB: number): number {
  // Count nakshatras from A to B
  const count = ((nakshatraIdxB - nakshatraIdxA + 27) % 27) + 1
  const remainder = count % 9
  // Favorable taras: 2, 4, 6, 8, 9 (=0). Unfavorable: 1, 3, 5, 7
  const favorable = [0, 2, 4, 6, 8].includes(remainder)
  // Bidirectional check
  const count2 = ((nakshatraIdxA - nakshatraIdxB + 27) % 27) + 1
  const rem2 = count2 % 9
  const favorable2 = [0, 2, 4, 6, 8].includes(rem2)

  if (favorable && favorable2) return 3
  if (favorable || favorable2) return 1.5
  return 0
}

// ─── Gana (temperament: Deva/Manushya/Rakshasa) ────────────────────────────
function ganaScore(ganaA: string, ganaB: string): number {
  if (ganaA === ganaB) return 6
  // Deva-Manushya = 5, Manushya-Deva = 5
  // Deva-Rakshasa = 1
  // Rakshasa-Manushya = 0
  const pair = [ganaA, ganaB].sort().join('-')
  if (pair === 'Deva-Manushya') return 5
  if (pair === 'Deva-Rakshasa') return 1
  if (pair === 'Manushya-Rakshasa') return 0
  return 0
}

// ─── Main result type ───────────────────────────────────────────────────────

export interface KootScore {
  name:        string
  sanskrit:    string
  maxScore:    number
  score:       number
  description: string
}

export interface AshtakootResult {
  varna:       KootScore
  vashya:      KootScore
  tara:        KootScore
  yoni:        KootScore
  grahaMaitri: KootScore
  gana:        KootScore
  bhakoot:     KootScore
  nadi:        KootScore
  total:       number
  maxTotal:    number
  rating:      'Excellent' | 'Very Good' | 'Good' | 'Acceptable' | 'Poor' | 'Not Recommended'
  doshas:      string[]
}

export function calcAshtakootMilan(
  brideMoonRashi: Rashi,
  brideMoonNakshatra: NakshatraData,
  groomMoonRashi: Rashi,
  groomMoonNakshatra: NakshatraData,
): AshtakootResult {
  // 1. Varna (1 point)
  const brideVarna = VARNA_OF_RASHI[brideMoonRashi]
  const groomVarna = VARNA_OF_RASHI[groomMoonRashi]
  const varnaScore = groomVarna.level >= brideVarna.level ? 1 : 0
  const varna: KootScore = {
    name: 'Varna',
    sanskrit: 'वर्ण',
    maxScore: 1,
    score: varnaScore,
    description: `Spiritual hierarchy: groom (${groomVarna.name}) ${groomVarna.level >= brideVarna.level ? '≥' : '<'} bride (${brideVarna.name}). Tradition expects the groom\'s varna to equal or exceed the bride\'s.`,
  }

  // 2. Vashya (2 points)
  const brideVashya = VASHYA_OF_RASHI[brideMoonRashi]
  const groomVashya = VASHYA_OF_RASHI[groomMoonRashi]
  const vashyaPts = VASHYA_SCORE[brideVashya]?.[groomVashya] ?? 1
  const vashya: KootScore = {
    name: 'Vashya',
    sanskrit: 'वश्य',
    maxScore: 2,
    score: vashyaPts,
    description: `Mutual influence and control: ${brideVashya} × ${groomVashya}. Measures how easily the partners can win each other\'s heart and cooperate.`,
  }

  // 3. Tara (3 points)
  const taraPts = taraScore(brideMoonNakshatra.index - 1, groomMoonNakshatra.index - 1)
  const tara: KootScore = {
    name: 'Tara',
    sanskrit: 'तारा',
    maxScore: 3,
    score: taraPts,
    description: `Star compatibility: counted from each partner\'s Janma Nakshatra to the other\'s. Indicates mutual well-being, longevity, and protection from harm.`,
  }

  // 4. Yoni (4 points)
  const yoniPts = yoniScore(brideMoonNakshatra.yoni, groomMoonNakshatra.yoni)
  const yoni: KootScore = {
    name: 'Yoni',
    sanskrit: 'योनि',
    maxScore: 4,
    score: yoniPts,
    description: `Animal nature & sexual compatibility: ${normalizeYoni(brideMoonNakshatra.yoni)} × ${normalizeYoni(groomMoonNakshatra.yoni)}. Reveals physical and instinctual harmony, same yoni is best, mortal enemies score zero.`,
  }

  // 5. Graha Maitri (5 points)
  const gmPts = grahaMaitriScore(brideMoonRashi, groomMoonRashi)
  const grahaMaitri: KootScore = {
    name: 'Graha Maitri',
    sanskrit: 'ग्रह मैत्री',
    maxScore: 5,
    score: gmPts,
    description: `Friendship of Moon-sign lords: ${RASHI_DATA[brideMoonRashi].ruler} × ${RASHI_DATA[groomMoonRashi].ruler}. The most important koota for mental and emotional bonding, measures intellectual and psychological alignment.`,
  }

  // 6. Gana (6 points)
  const ganaPts = ganaScore(brideMoonNakshatra.gana, groomMoonNakshatra.gana)
  const gana: KootScore = {
    name: 'Gana',
    sanskrit: 'गण',
    maxScore: 6,
    score: ganaPts,
    description: `Temperament: ${brideMoonNakshatra.gana} × ${groomMoonNakshatra.gana}. The three ganas are Deva (godlike), Manushya (human), and Rakshasa (demonic). Measures behavioral and ethical compatibility.`,
  }

  // 7. Bhakoot (7 points)
  const bk = bhakootScore(brideMoonRashi, groomMoonRashi)
  const bhakoot: KootScore = {
    name: 'Bhakoot',
    sanskrit: 'भकूट',
    maxScore: 7,
    score: bk.score,
    description: `Moon-sign distance: ${bk.reason}. Reveals long-term harmony, family welfare, and material prosperity together.`,
  }

  // 8. Nadi (8 points)
  const nd = nadiScore(brideMoonNakshatra.name, groomMoonNakshatra.name)
  const nadi: KootScore = {
    name: 'Nadi',
    sanskrit: 'नाड़ी',
    maxScore: 8,
    score: nd.score,
    description: `Pulse / constitution: ${NADI_OF_NAKSHATRA[brideMoonNakshatra.name]} × ${NADI_OF_NAKSHATRA[groomMoonNakshatra.name]}. The most weighty koota, same Nadi is the major dosha (Nadi Dosha), affecting health, progeny, and lasting health of children.`,
  }

  const total = varna.score + vashya.score + tara.score + yoni.score + grahaMaitri.score + gana.score + bhakoot.score + nadi.score
  const maxTotal = 36

  let rating: AshtakootResult['rating']
  if (total >= 32) rating = 'Excellent'
  else if (total >= 28) rating = 'Very Good'
  else if (total >= 24) rating = 'Good'
  else if (total >= 18) rating = 'Acceptable'
  else if (total >= 14) rating = 'Poor'
  else rating = 'Not Recommended'

  const doshas: string[] = []
  if (bk.dosha) doshas.push(`Bhakoot Dosha: ${bk.reason}`)
  if (nd.dosha) doshas.push(`Nadi Dosha: both partners share the same ${NADI_OF_NAKSHATRA[brideMoonNakshatra.name]} Nadi, major incompatibility for health and children`)

  return {
    varna, vashya, tara, yoni, grahaMaitri, gana, bhakoot, nadi,
    total, maxTotal, rating, doshas,
  }
}

// ─── Helper to extract Moon Rashi/Nakshatra from a quick natal calc ────────
// (Used by the partner form which only needs Moon position, not full chart.)

export function moonRashiFromLng(siderealLng: number): Rashi {
  const RASHIS_LIST: Rashi[] = [
    'Mesha', 'Vrishabha', 'Mithuna', 'Karka',
    'Simha', 'Kanya', 'Tula', 'Vrishchika',
    'Dhanu', 'Makara', 'Kumbha', 'Meena',
  ]
  const norm = ((siderealLng % 360) + 360) % 360
  return RASHIS_LIST[Math.floor(norm / 30)]
}

export function moonNakshatraFromLng(siderealLng: number): NakshatraData {
  const norm = ((siderealLng % 360) + 360) % 360
  const span = 360 / 27
  const idx = Math.floor(norm / span)
  return NAKSHATRAS[idx]
}
