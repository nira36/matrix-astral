// ─── Vedic Astrology — Static Data ──────────────────────────────────────────
// Jyotisha (Indian sidereal astrology) reference data: Rashi (signs), Grahas
// (planets), 27 Nakshatras with descriptions, Lagna profiles.
// Sources: B.V. Raman "Hindu Predictive Astrology", K.N. Rao "Predicting through
// Nakshatras", David Frawley "The Astrology of the Seers", Hart de Fouw &
// Robert Svoboda "Light on Life".

// ─── 12 Rashis (Sidereal Signs) ──────────────────────────────────────────────

export type Rashi =
  | 'Mesha' | 'Vrishabha' | 'Mithuna' | 'Karka'
  | 'Simha' | 'Kanya' | 'Tula' | 'Vrishchika'
  | 'Dhanu' | 'Makara' | 'Kumbha' | 'Meena'

export const RASHIS: Rashi[] = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka',
  'Simha', 'Kanya', 'Tula', 'Vrishchika',
  'Dhanu', 'Makara', 'Kumbha', 'Meena',
]

export type VedicElement = 'Fire' | 'Earth' | 'Air' | 'Water'
export type Quality = 'Movable' | 'Fixed' | 'Dual'
export type RashiPolarity = 'Masculine' | 'Feminine'

export interface RashiData {
  sanskrit: Rashi
  english:  string         // Aries, Taurus, ...
  symbol:   string         // ♈ ♉ ...
  ruler:    string         // Vedic ruling Graha (English)
  rulerSk:  string         // Sanskrit
  element:  VedicElement
  quality:  Quality
  polarity: RashiPolarity
  color:    string
  description: string
}

export const RASHI_DATA: Record<Rashi, RashiData> = {
  Mesha:      { sanskrit: 'Mesha',      english: 'Aries',       symbol: '♈', ruler: 'Mars',    rulerSk: 'Mangala',   element: 'Fire',  quality: 'Movable', polarity: 'Masculine', color: '#dc2626', description: 'The Ram — initiator, warrior, pioneer. Mesha is raw fire, the head leading the body. Courageous, impulsive, competitive. Those marked by Mesha rising charge into life headfirst, demanding action and disliking restraint.' },
  Vrishabha:  { sanskrit: 'Vrishabha',  english: 'Taurus',      symbol: '♉', ruler: 'Venus',   rulerSk: 'Shukra',    element: 'Earth', quality: 'Fixed',   polarity: 'Feminine',  color: '#16a34a', description: 'The Bull — sensual, steady, productive. Vrishabha is fertile earth ruled by Venus. Patient builders who value beauty, comfort, and tangible results. Slow to anger but immovable when stirred.' },
  Mithuna:    { sanskrit: 'Mithuna',    english: 'Gemini',      symbol: '♊', ruler: 'Mercury', rulerSk: 'Budha',     element: 'Air',   quality: 'Dual',    polarity: 'Masculine', color: '#facc15', description: 'The Twins — communicator, learner, mediator. Mithuna is air ruled by Mercury — quick-witted, versatile, intellectually curious. Gifted with words and ideas, prone to restlessness and duality of nature.' },
  Karka:      { sanskrit: 'Karka',      english: 'Cancer',      symbol: '♋', ruler: 'Moon',    rulerSk: 'Chandra',   element: 'Water', quality: 'Movable', polarity: 'Feminine',  color: '#94a3b8', description: 'The Crab — nurturer, protector, intuitive. Karka is water ruled by the Moon. Deeply emotional, family-oriented, with a hard shell guarding a soft interior. The natural caretaker of the zodiac.' },
  Simha:      { sanskrit: 'Simha',      english: 'Leo',         symbol: '♌', ruler: 'Sun',     rulerSk: 'Surya',     element: 'Fire',  quality: 'Fixed',   polarity: 'Masculine', color: '#f59e0b', description: 'The Lion — sovereign, performer, leader. Simha is fire ruled by the Sun. Proud, generous, demanding recognition and loyalty. The natural king who rules through charisma rather than force.' },
  Kanya:      { sanskrit: 'Kanya',      english: 'Virgo',       symbol: '♍', ruler: 'Mercury', rulerSk: 'Budha',     element: 'Earth', quality: 'Dual',    polarity: 'Feminine',  color: '#84cc16', description: 'The Virgin — analyst, healer, perfectionist. Kanya is earth ruled by Mercury. Discriminating, service-oriented, with an eye for detail. The mind in service of the world, often through healing and craft.' },
  Tula:       { sanskrit: 'Tula',       english: 'Libra',       symbol: '♎', ruler: 'Venus',   rulerSk: 'Shukra',    element: 'Air',   quality: 'Movable', polarity: 'Masculine', color: '#ec4899', description: 'The Scales — diplomat, aesthete, partner. Tula is air ruled by Venus. Seeks balance, harmony, beauty in all things. Refined and just — but indecisive when faced with the cost of choosing sides.' },
  Vrishchika: { sanskrit: 'Vrishchika', english: 'Scorpio',     symbol: '♏', ruler: 'Mars',    rulerSk: 'Mangala',   element: 'Water', quality: 'Fixed',   polarity: 'Feminine',  color: '#7c2d12', description: 'The Scorpion — alchemist, investigator, mystic. Vrishchika is deep water ruled by Mars. Intense, secretive, transformative. Drawn to taboo and hidden truth. The healer who has descended into darkness and returned.' },
  Dhanu:      { sanskrit: 'Dhanu',      english: 'Sagittarius', symbol: '♐', ruler: 'Jupiter', rulerSk: 'Guru',      element: 'Fire',  quality: 'Dual',    polarity: 'Masculine', color: '#a855f7', description: 'The Archer — philosopher, teacher, seeker. Dhanu is fire ruled by Jupiter — the most spiritually fortunate sign. Optimistic, expansive, devoted to truth and higher knowledge. The eternal student and pilgrim.' },
  Makara:     { sanskrit: 'Makara',     english: 'Capricorn',   symbol: '♑', ruler: 'Saturn',  rulerSk: 'Shani',     element: 'Earth', quality: 'Movable', polarity: 'Feminine',  color: '#1e293b', description: 'The Sea-Goat — climber, builder, elder. Makara is earth ruled by Saturn. Disciplined, ambitious, structured. Those who rise through patient effort and bear responsibility as a sacred duty.' },
  Kumbha:     { sanskrit: 'Kumbha',     english: 'Aquarius',    symbol: '♒', ruler: 'Saturn',  rulerSk: 'Shani',     element: 'Air',   quality: 'Fixed',   polarity: 'Masculine', color: '#0ea5e9', description: 'The Water Bearer — innovator, humanitarian, mystic. Kumbha is air ruled by Saturn. Detached, original, devoted to collective vision. The eccentric servant of humanity who sees patterns others miss.' },
  Meena:      { sanskrit: 'Meena',      english: 'Pisces',      symbol: '♓', ruler: 'Jupiter', rulerSk: 'Guru',      element: 'Water', quality: 'Dual',    polarity: 'Feminine',  color: '#6366f1', description: 'The Fishes — dreamer, devotee, dissolver. Meena is deep water ruled by Jupiter. Compassionate, mystical, boundless. The soul reaching toward dissolution into the divine — poetic, sensitive, and prone to escape.' },
}

// ─── 9 Grahas (Vedic Planets) ────────────────────────────────────────────────

export type Graha =
  | 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter'
  | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu'

export const GRAHAS: Graha[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']

export interface GrahaData {
  english:    Graha
  sanskrit:   string
  symbol:     string
  shortGlyph: string       // SU, MO, MA, ... for chart display
  nature:     'Benefic' | 'Malefic' | 'Neutral'
  element:    VedicElement | 'Spirit'
  rulesSigns: Rashi[]
  color:      string
  meaning:    string
}

export const GRAHA_DATA: Record<Graha, GrahaData> = {
  Sun:     { english: 'Sun',     sanskrit: 'Surya',   symbol: '☉', shortGlyph: 'Su', nature: 'Malefic', element: 'Fire',  rulesSigns: ['Simha'],                  color: '#f59e0b', meaning: 'The Soul (Atman). Father, authority, vitality, ego, self-expression, government, leadership. Surya is the king of the cosmos — what cannot be hidden.' },
  Moon:    { english: 'Moon',    sanskrit: 'Chandra', symbol: '☽', shortGlyph: 'Mo', nature: 'Benefic', element: 'Water', rulesSigns: ['Karka'],                  color: '#cbd5e1', meaning: 'The Mind (Manas). Mother, emotions, instinct, memory, the public, comfort, the womb. Chandra rules everything that ebbs and flows. The Moon\'s position is the most important factor in Jyotish.' },
  Mars:    { english: 'Mars',    sanskrit: 'Mangala', symbol: '♂', shortGlyph: 'Ma', nature: 'Malefic', element: 'Fire',  rulesSigns: ['Mesha', 'Vrishchika'],    color: '#dc2626', meaning: 'Energy & Will (Shakti). Brothers, courage, conflict, sexuality, surgery, real estate, athletes, warriors. Mangala is the commander — direct action and the cutting edge.' },
  Mercury: { english: 'Mercury', sanskrit: 'Budha',   symbol: '☿', shortGlyph: 'Me', nature: 'Neutral', element: 'Earth', rulesSigns: ['Mithuna', 'Kanya'],       color: '#16a34a', meaning: 'Intellect & Communication (Buddhi). Speech, learning, commerce, writing, mathematics, the prince. Budha is the messenger — refined logic and the bridge between minds.' },
  Jupiter: { english: 'Jupiter', sanskrit: 'Guru',    symbol: '♃', shortGlyph: 'Ju', nature: 'Benefic', element: 'Air',   rulesSigns: ['Dhanu', 'Meena'],         color: '#a855f7', meaning: 'Wisdom & Grace (Dharma). Teachers, gurus, religion, law, philosophy, children, wealth, expansion. Guru is the most benefic graha — bringer of fortune and higher truth.' },
  Venus:   { english: 'Venus',   sanskrit: 'Shukra',  symbol: '♀', shortGlyph: 'Ve', nature: 'Benefic', element: 'Water', rulesSigns: ['Vrishabha', 'Tula'],      color: '#ec4899', meaning: 'Love & Beauty (Kama). Spouse, romance, art, luxury, vehicles, pleasure, refinement. Shukra rules everything sweet — the alchemy of attraction and the path of desire.' },
  Saturn:  { english: 'Saturn',  sanskrit: 'Shani',   symbol: '♄', shortGlyph: 'Sa', nature: 'Malefic', element: 'Air',   rulesSigns: ['Makara', 'Kumbha'],       color: '#475569', meaning: 'Discipline & Time (Karma). The slow teacher, hardships, longevity, the elderly, servants, structure, austerity, justice. Shani delivers the karmic weight that forges the soul.' },
  Rahu:    { english: 'Rahu',    sanskrit: 'Rahu',    symbol: '☊', shortGlyph: 'Ra', nature: 'Malefic', element: 'Air',   rulesSigns: [],                          color: '#7c2d12', meaning: 'The North Lunar Node — the head of the dragon. Obsession, ambition, foreign things, technology, illusion, the unfulfilled hunger. Rahu amplifies and distorts whatever it touches.' },
  Ketu:    { english: 'Ketu',    sanskrit: 'Ketu',    symbol: '☋', shortGlyph: 'Ke', nature: 'Malefic', element: 'Fire',  rulesSigns: [],                          color: '#9333ea', meaning: 'The South Lunar Node — the body of the dragon. Liberation, past-life mastery, mysticism, detachment, sudden insight, renunciation. Ketu severs what Rahu craves.' },
}

// ─── 27 Nakshatras (Lunar Mansions) ──────────────────────────────────────────
// Each spans 13°20' of zodiac. The Moon's nakshatra at birth is the Janma Nakshatra.

export interface NakshatraData {
  index:   number          // 1-27
  name:    string
  symbol:  string          // visual symbol description
  deity:   string
  ruler:   Graha           // dasha lord
  yoni:    string          // animal nature
  gana:    'Deva' | 'Manushya' | 'Rakshasa'
  caste:   string
  color:   string
  description: string
}

export const NAKSHATRAS: NakshatraData[] = [
  { index: 1,  name: 'Ashwini',          symbol: 'Horse\'s Head',          deity: 'Ashwini Kumaras',  ruler: 'Ketu',    yoni: 'Horse',     gana: 'Deva',     caste: 'Vaishya',  color: '#dc2626', description: 'The first nakshatra — pure speed, healing, pioneering force. Ashwini natives are quick, direct, restless, often physicians or rescuers. They embody the divine twin healers who race to save lives. Their gift is initiation; their shadow is impatience and starting more than they finish.' },
  { index: 2,  name: 'Bharani',          symbol: 'Yoni / Womb',            deity: 'Yama',             ruler: 'Venus',   yoni: 'Elephant',  gana: 'Manushya', caste: 'Mleccha',  color: '#7c2d12', description: 'The bearer — gestation, sexuality, death, transformation. Bharani natives carry intense creative-destructive energy, ruled by Yama (god of death). Magnetic, passionate, sometimes burdened by the karmic weight they were born to process. The womb that births and the grave that receives.' },
  { index: 3,  name: 'Krittika',         symbol: 'Razor / Flame',          deity: 'Agni',             ruler: 'Sun',     yoni: 'Sheep',     gana: 'Rakshasa', caste: 'Brahmin',  color: '#f59e0b', description: 'The cutter — the sharp flame that purifies. Krittika natives are sharp-tongued, righteous, protective, often warriors of truth or critics. Ruled by the fire god Agni. They burn away illusion — including their own comfort. Strong-willed mothers, fierce defenders.' },
  { index: 4,  name: 'Rohini',           symbol: 'Chariot / Banyan',       deity: 'Brahma',           ruler: 'Moon',    yoni: 'Serpent',   gana: 'Manushya', caste: 'Shudra',   color: '#16a34a', description: 'The red one — the most fertile and sensual nakshatra, exalted seat of the Moon. Rohini natives are beautiful, magnetic, materially blessed, deeply rooted in the earthly realm. Artistic, indulgent, sometimes possessive. Krishna\'s favorite — the lover and the gardener of life.' },
  { index: 5,  name: 'Mrigashira',       symbol: 'Deer\'s Head',           deity: 'Soma',             ruler: 'Mars',    yoni: 'Serpent',   gana: 'Deva',     caste: 'Farmer',   color: '#84cc16', description: 'The seeker — the gentle deer searching the forest. Mrigashira natives are curious, restless, eternally exploring new ideas, places, and partners. Soft-natured but never satisfied. Gifted in research, travel, writing. The seeker who never quite arrives.' },
  { index: 6,  name: 'Ardra',            symbol: 'Teardrop / Diamond',     deity: 'Rudra',            ruler: 'Rahu',    yoni: 'Dog',       gana: 'Manushya', caste: 'Butcher',  color: '#475569', description: 'The storm — destruction that brings renewal. Ardra natives are intense, brilliant, often suffering before transformation. Ruled by Rudra (the howling storm god) and Rahu. They process great pain and emerge with tremendous insight. The lightning that splits the old tree.' },
  { index: 7,  name: 'Punarvasu',        symbol: 'Bow & Quiver',           deity: 'Aditi',            ruler: 'Jupiter', yoni: 'Cat',       gana: 'Deva',     caste: 'Vaishya',  color: '#a855f7', description: 'The return of light — renewal, hope, blessed beginnings. Punarvasu natives carry Jupiter\'s grace, with a generous, philosophical, motherly nature. They restore what was lost. Often spiritual teachers, travelers, devoted parents. Rama was born under Punarvasu.' },
  { index: 8,  name: 'Pushya',           symbol: 'Cow\'s Udder / Lotus',   deity: 'Brihaspati',       ruler: 'Saturn',  yoni: 'Sheep',     gana: 'Deva',     caste: 'Kshatriya',color: '#eab308', description: 'The nourisher — the most auspicious nakshatra. Pushya natives are loyal, generous, devoted, naturally giving and protective. Ruled by Brihaspati (the divine teacher). Excellent caregivers, advisors, traditional in values. The cosmic mother who feeds all who come to her.' },
  { index: 9,  name: 'Ashlesha',         symbol: 'Coiled Serpent',         deity: 'Naga (Serpents)',  ruler: 'Mercury', yoni: 'Cat',       gana: 'Rakshasa', caste: 'Mleccha',  color: '#0ea5e9', description: 'The embracer — the kundalini serpent. Ashlesha natives are deeply intuitive, hypnotic, secretive, gifted with serpentine wisdom and shadow knowledge. They can heal or poison with the same gesture. Often mystics, manipulators, or psychological masters. Powerful and dangerous in equal measure.' },
  { index: 10, name: 'Magha',            symbol: 'Royal Throne',           deity: 'Pitris (Ancestors)',ruler: 'Ketu',   yoni: 'Rat',       gana: 'Rakshasa', caste: 'Shudra',   color: '#dc2626', description: 'The mighty one — the throne of ancestors. Magha natives carry royal lineage, pride, leadership, and a deep connection to family heritage. Ruled by the ancestral spirits (Pitris). They feel the weight of legacy — both gift and burden. Born to lead, sometimes bound by tradition.' },
  { index: 11, name: 'Purva Phalguni',   symbol: 'Front Legs of Bed',      deity: 'Bhaga',            ruler: 'Venus',   yoni: 'Rat',       gana: 'Manushya', caste: 'Brahmin',  color: '#ec4899', description: 'The fortunate — pleasure, romance, generosity, the joys of partnership. Purva Phalguni natives are charming, hospitable, artistic, devoted to love and the good life. Ruled by Bhaga (the god of marital bliss). They bring warmth and delight wherever they go.' },
  { index: 12, name: 'Uttara Phalguni',  symbol: 'Back Legs of Bed',       deity: 'Aryaman',          ruler: 'Sun',     yoni: 'Bull',      gana: 'Manushya', caste: 'Kshatriya',color: '#f59e0b', description: 'The patron — formal partnership, contracts, friendship, social order. Uttara Phalguni natives are honorable, dependable, generous in patronage. Ruled by Aryaman (the god of contracts and noble friendship). They build lasting alliances. Marriage, dignity, helpful service.' },
  { index: 13, name: 'Hasta',            symbol: 'Hand / Closed Fist',     deity: 'Savitar',          ruler: 'Moon',    yoni: 'Buffalo',   gana: 'Deva',     caste: 'Vaishya',  color: '#94a3b8', description: 'The hand — skill, craft, manifestation. Hasta natives have extraordinary dexterity, both physical and mental — gifted artisans, healers, craftsmen, magicians. Ruled by Savitar (the solar power of stimulation). They make things happen with their hands. Clever, witty, sometimes mischievous.' },
  { index: 14, name: 'Chitra',           symbol: 'Bright Jewel',           deity: 'Vishvakarman',     ruler: 'Mars',    yoni: 'Tiger',     gana: 'Rakshasa', caste: 'Farmer',   color: '#a855f7', description: 'The brilliant — beauty, design, divine craftsmanship. Chitra natives are striking in appearance, drawn to art, architecture, jewelry, design. Ruled by Vishvakarman (the cosmic architect). They create beautiful forms and are themselves beautiful forms. Magnetic but sometimes vain.' },
  { index: 15, name: 'Swati',            symbol: 'Young Sprout / Coral',   deity: 'Vayu',             ruler: 'Rahu',    yoni: 'Buffalo',   gana: 'Deva',     caste: 'Butcher',  color: '#0ea5e9', description: 'The independent — the sapling that bends in the wind without breaking. Swati natives value freedom above all, are diplomatic, business-minded, and adaptable. Ruled by Vayu (the wind god). They thrive in trade, negotiation, and movement. Free spirits who cannot be caged.' },
  { index: 16, name: 'Vishakha',         symbol: 'Triumphal Arch',         deity: 'Indra-Agni',       ruler: 'Jupiter', yoni: 'Tiger',     gana: 'Rakshasa', caste: 'Mleccha',  color: '#f97316', description: 'The forked one — focused ambition, the goal achieved through total dedication. Vishakha natives are determined, goal-oriented, sometimes obsessive. Ruled by Indra (king of gods) and Agni (fire). They set their sights and do not waver. The triumph after long effort.' },
  { index: 17, name: 'Anuradha',         symbol: 'Lotus Flower / Staff',   deity: 'Mitra',            ruler: 'Saturn',  yoni: 'Deer',      gana: 'Deva',     caste: 'Shudra',   color: '#7c2d12', description: 'The follower of light — devotion, friendship, group harmony. Anuradha natives are loyal, devoted to friends and causes, success through collaboration. Ruled by Mitra (the god of friendship and oaths). They build communities. Spiritual depth, loving nature, capable of long-term commitment.' },
  { index: 18, name: 'Jyeshtha',         symbol: 'Earring / Umbrella',     deity: 'Indra',            ruler: 'Mercury', yoni: 'Deer',      gana: 'Rakshasa', caste: 'Servant',  color: '#dc2626', description: 'The eldest — seniority, authority, protection of the clan. Jyeshtha natives carry weight — eldest siblings, responsible leaders, sometimes burdened by their role. Ruled by Indra (king of gods). They protect the vulnerable but can suffer isolation. Mature, secretive, sometimes feared.' },
  { index: 19, name: 'Mula',             symbol: 'Bunch of Roots',         deity: 'Nirriti',          ruler: 'Ketu',    yoni: 'Dog',       gana: 'Rakshasa', caste: 'Butcher',  color: '#7c2d12', description: 'The root — radical investigation, getting to the bottom of things. Mula natives are seekers of foundational truth, philosophers, researchers, sometimes destroyers of false structures. Ruled by Nirriti (goddess of dissolution). They tear up roots to find what is real. Spiritually intense.' },
  { index: 20, name: 'Purva Ashadha',    symbol: 'Elephant Tusk / Fan',    deity: 'Apas (Waters)',    ruler: 'Venus',   yoni: 'Monkey',    gana: 'Manushya', caste: 'Brahmin',  color: '#0ea5e9', description: 'The invincible — the early conqueror, undefeated. Purva Ashadha natives are proud, optimistic, persuasive, philosophically inclined. Ruled by the cosmic waters. They flow around obstacles and inspire others to follow. Often public speakers, debaters, lawyers.' },
  { index: 21, name: 'Uttara Ashadha',   symbol: 'Elephant Tusk',          deity: 'Vishvedevas',      ruler: 'Sun',     yoni: 'Mongoose',  gana: 'Manushya', caste: 'Kshatriya',color: '#f59e0b', description: 'The later victory — lasting triumph, righteous success. Uttara Ashadha natives are noble, principled, ambitious for legitimate achievement, slow but sure. Ruled by the Vishvedevas (universal gods). They win the long game through integrity. Great leaders and reformers.' },
  { index: 22, name: 'Shravana',         symbol: 'Ear / Three Footprints', deity: 'Vishnu',           ruler: 'Moon',    yoni: 'Monkey',    gana: 'Deva',     caste: 'Mleccha',  color: '#a855f7', description: 'The listener — sacred hearing, learning by ear, oral tradition. Shravana natives are gifted students, advisors, scholars, devoted to learning at the feet of teachers. Ruled by Vishnu. They preserve knowledge across generations. Often counselors, teachers, devotees.' },
  { index: 23, name: 'Dhanishta',        symbol: 'Drum / Flute',           deity: 'Vasus',            ruler: 'Mars',    yoni: 'Lion',      gana: 'Rakshasa', caste: 'Farmer',   color: '#dc2626', description: 'The wealthiest — abundance, music, rhythm, prosperity. Dhanishta natives are charismatic, musical, generous, naturally drawn to wealth and fame. Ruled by the Vasus (gods of abundance). They beat the cosmic drum that brings prosperity. Performers, musicians, the rich.' },
  { index: 24, name: 'Shatabhisha',      symbol: '100 Healers / Empty Circle', deity: 'Varuna',       ruler: 'Rahu',    yoni: 'Horse',     gana: 'Rakshasa', caste: 'Butcher',  color: '#0ea5e9', description: 'The hundred healers — secrecy, healing, mysticism, isolation. Shatabhisha natives are independent, mysterious, drawn to medicine, astrology, and the occult. Ruled by Varuna (the cosmic ocean). They work in solitude on hidden things. Healers of the rare and the strange.' },
  { index: 25, name: 'Purva Bhadrapada', symbol: 'Front Legs of Funeral Cot', deity: 'Aja Ekapada',  ruler: 'Jupiter', yoni: 'Lion',      gana: 'Manushya', caste: 'Brahmin',  color: '#7c2d12', description: 'The first scorcher — intense fire, transformation through extremes, otherworldly insight. Purva Bhadrapada natives are eccentric, passionate, sometimes fanatical, capable of great spiritual or worldly heights. Ruled by Aja Ekapada (the one-footed goat). They burn brightly and unsettle the comfortable.' },
  { index: 26, name: 'Uttara Bhadrapada',symbol: 'Back Legs of Funeral Cot', deity: 'Ahir Budhnya',  ruler: 'Saturn',  yoni: 'Cow',       gana: 'Manushya', caste: 'Kshatriya',color: '#1e293b', description: 'The serpent of the deep — wisdom from the cosmic depths, kundalini, ancestral memory. Uttara Bhadrapada natives are deeply wise, patient, controlled, often mystics or psychologists. Ruled by Ahir Budhnya (the serpent of the deep ocean). They carry old souls and quiet power.' },
  { index: 27, name: 'Revati',           symbol: 'Fish / Drum',            deity: 'Pushan',           ruler: 'Mercury', yoni: 'Elephant',  gana: 'Deva',     caste: 'Shudra',   color: '#6366f1', description: 'The wealthy — the final nakshatra, completion, safe journeys, nourishment of all beings. Revati natives are kind, gentle, protective of animals and the weak, devoted to service. Ruled by Pushan (the shepherd god). They guide souls home. The end that becomes a new beginning.' },
]

// Helper: get nakshatra index (0-26) from sidereal longitude (0-360)
export function nakshatraFromLongitude(siderealLng: number): { index: number; pada: number; data: NakshatraData } {
  const norm = ((siderealLng % 360) + 360) % 360
  const span = 360 / 27   // 13.333... degrees
  const idx = Math.floor(norm / span)
  const within = norm - idx * span
  const pada = Math.floor(within / (span / 4)) + 1  // 1-4
  return { index: idx, pada, data: NAKSHATRAS[idx] }
}

// ─── Lagna (Ascendant) Profiles ──────────────────────────────────────────────

export interface LagnaProfile {
  archetype: string
  body:      string
  qualities: string[]
  description: string
}

export const LAGNA_PROFILES: Record<Rashi, LagnaProfile> = {
  Mesha:      { archetype: 'The Warrior',     body: 'Athletic, lean, often with a prominent forehead or scar on the head', qualities: ['Bold', 'Impulsive', 'Pioneering', 'Combative'], description: 'Born under Mesha Lagna, you charge into life headfirst. You are the natural leader who acts first and thinks later, the one who breaks down doors others fear to knock on. Your nature is fiery, competitive, and impatient with delay. You need physical activity and a fight to feel alive. The shadow: anger and the tendency to leave projects half-finished when the initial thrill fades.' },
  Vrishabha:  { archetype: 'The Builder',     body: 'Solid, sensual, often beautiful features and a melodious voice',     qualities: ['Steady', 'Sensual', 'Patient', 'Possessive'], description: 'Vrishabha Lagna gives you the steady, fertile nature of the bull. You build lives that last — homes, businesses, relationships rooted in tangible value. You appreciate beauty, food, music, and physical comfort more than most. Slow to anger, but immovable when finally stirred. The shadow: attachment to material things and resistance to necessary change.' },
  Mithuna:    { archetype: 'The Communicator',body: 'Slim, youthful, expressive hands, restless eyes',                    qualities: ['Curious', 'Witty', 'Adaptable', 'Inconstant'], description: 'Mithuna Lagna gives you Mercury\'s quick mind and silver tongue. You learn rapidly, communicate brilliantly, and move easily between worlds and ideas. Friends in many circles, multiple skills, never bored. The shadow: scattered focus, surface engagement, and the difficulty of committing deeply to one path or one person.' },
  Karka:      { archetype: 'The Caretaker',   body: 'Round face, soft features, expressive eyes, often emotional',        qualities: ['Nurturing', 'Sensitive', 'Protective', 'Moody'], description: 'Karka Lagna makes you the caretaker of your world. You feel everything deeply, especially the moods of others, and you instinctively protect those you love. Home and family are central. You carry the past with you — memory is your gift and your burden. The shadow: clinging, emotional overwhelm, and difficulty letting go of what has hurt you.' },
  Simha:      { archetype: 'The Sovereign',   body: 'Tall, dignified bearing, strong bone structure, lion-like presence', qualities: ['Proud', 'Generous', 'Magnetic', 'Demanding'], description: 'Simha Lagna grants you royal bearing and a need to shine. You are the natural performer, leader, parent, or teacher — the one others naturally look to. Generous with your warmth, fierce in your loyalty, but you require respect and recognition to thrive. The shadow: pride that cannot bear humiliation, and the suffering that comes when no one is watching.' },
  Kanya:      { archetype: 'The Discriminator',body: 'Slender, refined features, often modest in dress and manner',       qualities: ['Analytical', 'Helpful', 'Critical', 'Anxious'], description: 'Kanya Lagna gives you the discriminating eye and the heart of service. You see what is broken and want to fix it — in yourself, in others, in systems. Often gifted in healing, craft, or detailed analytical work. Modest, humble, sometimes invisible. The shadow: chronic worry, harsh self-criticism, and the inability to let things simply be.' },
  Tula:       { archetype: 'The Diplomat',    body: 'Balanced features, attractive, graceful movements, charming smile',  qualities: ['Harmonious', 'Just', 'Refined', 'Indecisive'], description: 'Tula Lagna gives you Venus\'s grace and the diplomat\'s skill. You seek balance, beauty, and fair play in all things. Partnership is central — you do your best work in collaboration. Refined taste, social ease, the ability to mediate conflict. The shadow: paralysis when forced to choose, and avoidance of necessary confrontation.' },
  Vrishchika: { archetype: 'The Alchemist',   body: 'Intense gaze, magnetic presence, often hidden depths in plain clothes', qualities: ['Intense', 'Investigative', 'Secretive', 'Vengeful'], description: 'Vrishchika Lagna grants you penetrating depth. You see beneath the surface of everything — others\' motives, hidden truths, the shadow side of life. Drawn to taboo, mystery, transformation, and power. You can heal or destroy with the same intensity. The shadow: holding grudges, obsession, and the difficulty of forgiving betrayal.' },
  Dhanu:      { archetype: 'The Seeker',      body: 'Tall, often athletic, open expression, generous build',              qualities: ['Optimistic', 'Wise', 'Free', 'Restless'], description: 'Dhanu Lagna is the most spiritually fortunate ascendant — Jupiter blesses your life with wisdom, optimism, and luck. You are the eternal student and traveler, drawn to philosophy, religion, foreign cultures, and higher learning. You teach what you know freely. The shadow: restlessness that resists rooting, and the tendency to preach more than to practice.' },
  Makara:     { archetype: 'The Climber',     body: 'Lean, tall, serious bearing, often appears older than years',        qualities: ['Disciplined', 'Ambitious', 'Patient', 'Cold'], description: 'Makara Lagna gives you Saturn\'s patience and the long view. You climb steadily toward goals others abandon. Responsibility comes early — you mature young and bear weight willingly. Practical, ambitious, often successful through sheer endurance. The shadow: emotional reserve, pessimism, and the loneliness of those who cannot let down their guard.' },
  Kumbha:     { archetype: 'The Visionary',   body: 'Tall, often unusual features, distant gaze, eccentric style',        qualities: ['Original', 'Humanitarian', 'Detached', 'Stubborn'], description: 'Kumbha Lagna grants you the rare gift of seeing patterns others miss. You think in systems, work for collective good, and march to a drum others cannot hear. Friends in unusual places, ideas ahead of your time, devotion to a cause greater than yourself. The shadow: emotional detachment from those closest, and stubborn certainty in your own vision.' },
  Meena:      { archetype: 'The Mystic',      body: 'Soft features, dreamy eyes, fluid movement, sometimes ethereal',     qualities: ['Compassionate', 'Intuitive', 'Devoted', 'Escapist'], description: 'Meena Lagna gives you the dissolving boundary of Pisces — you feel the suffering of the world as your own, and you reach toward the divine for refuge. Deeply intuitive, artistic, devoted, often spiritually gifted. You live half in this world and half in another. The shadow: escape into fantasy, addiction, or martyrdom when reality grows too sharp.' },
  // Note: Vrishchika sometimes co-ruled by Ketu in some traditions; we keep classical Mars rulership.
}
