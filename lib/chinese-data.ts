// ─── Chinese Astrology — Static Data ─────────────────────────────────────────
// Bazi (Four Pillars of Destiny) reference data: stems, branches, elements,
// 10 Gods, Day Master profiles, animal archetypes.
// Sources: Joey Yap "BaZi: The Destiny Code", Master Sang Hak Ke,
// "The Heavenly Stems and Earthly Branches" (classical Wu Xing tradition).

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water'
export type Polarity = 'Yang' | 'Yin'

export interface StemData {
  char:     string      // 甲, 乙, ...
  pinyin:   string      // Jiǎ, Yǐ, ...
  element:  Element
  polarity: Polarity
  name:     string      // English archetype name
  color:    string      // hex
}

export interface BranchData {
  char:     string      // 子, 丑, ...
  pinyin:   string
  animal:   string      // English: Rat, Ox, ...
  element:  Element     // main element
  polarity: Polarity
  hiddenStems: string[] // canggan — main stem chars hidden in branch
  hours:    string      // 23-01, 01-03, ...
  color:    string
}

// ─── 10 Heavenly Stems (天干) ────────────────────────────────────────────────

export const STEMS: Record<string, StemData> = {
  '甲': { char: '甲', pinyin: 'Jiǎ', element: 'Wood',  polarity: 'Yang', name: 'Towering Tree',    color: '#16a34a' },
  '乙': { char: '乙', pinyin: 'Yǐ',  element: 'Wood',  polarity: 'Yin',  name: 'Garden Flower',    color: '#84cc16' },
  '丙': { char: '丙', pinyin: 'Bǐng',element: 'Fire',  polarity: 'Yang', name: 'Solar Flame',      color: '#dc2626' },
  '丁': { char: '丁', pinyin: 'Dīng',element: 'Fire',  polarity: 'Yin',  name: 'Candlelight',      color: '#f97316' },
  '戊': { char: '戊', pinyin: 'Wù',  element: 'Earth', polarity: 'Yang', name: 'Mountain',         color: '#a16207' },
  '己': { char: '己', pinyin: 'Jǐ',  element: 'Earth', polarity: 'Yin',  name: 'Garden Soil',      color: '#ca8a04' },
  '庚': { char: '庚', pinyin: 'Gēng',element: 'Metal', polarity: 'Yang', name: 'Forged Steel',     color: '#94a3b8' },
  '辛': { char: '辛', pinyin: 'Xīn', element: 'Metal', polarity: 'Yin',  name: 'Refined Jewel',    color: '#cbd5e1' },
  '壬': { char: '壬', pinyin: 'Rén', element: 'Water', polarity: 'Yang', name: 'Ocean Wave',       color: '#1d4ed8' },
  '癸': { char: '癸', pinyin: 'Guǐ', element: 'Water', polarity: 'Yin',  name: 'Mist & Dew',       color: '#0ea5e9' },
}

// ─── 12 Earthly Branches (地支) ──────────────────────────────────────────────

export const BRANCHES: Record<string, BranchData> = {
  '子': { char: '子', pinyin: 'Zǐ',   animal: 'Rat',     element: 'Water', polarity: 'Yang', hiddenStems: ['癸'],         hours: '23–01', color: '#1d4ed8' },
  '丑': { char: '丑', pinyin: 'Chǒu', animal: 'Ox',      element: 'Earth', polarity: 'Yin',  hiddenStems: ['己','癸','辛'], hours: '01–03', color: '#a16207' },
  '寅': { char: '寅', pinyin: 'Yín',  animal: 'Tiger',   element: 'Wood',  polarity: 'Yang', hiddenStems: ['甲','丙','戊'], hours: '03–05', color: '#16a34a' },
  '卯': { char: '卯', pinyin: 'Mǎo',  animal: 'Rabbit',  element: 'Wood',  polarity: 'Yin',  hiddenStems: ['乙'],         hours: '05–07', color: '#84cc16' },
  '辰': { char: '辰', pinyin: 'Chén', animal: 'Dragon',  element: 'Earth', polarity: 'Yang', hiddenStems: ['戊','乙','癸'], hours: '07–09', color: '#a16207' },
  '巳': { char: '巳', pinyin: 'Sì',   animal: 'Snake',   element: 'Fire',  polarity: 'Yin',  hiddenStems: ['丙','戊','庚'], hours: '09–11', color: '#f97316' },
  '午': { char: '午', pinyin: 'Wǔ',   animal: 'Horse',   element: 'Fire',  polarity: 'Yang', hiddenStems: ['丁','己'],     hours: '11–13', color: '#dc2626' },
  '未': { char: '未', pinyin: 'Wèi',  animal: 'Goat',    element: 'Earth', polarity: 'Yin',  hiddenStems: ['己','丁','乙'], hours: '13–15', color: '#ca8a04' },
  '申': { char: '申', pinyin: 'Shēn', animal: 'Monkey',  element: 'Metal', polarity: 'Yang', hiddenStems: ['庚','壬','戊'], hours: '15–17', color: '#94a3b8' },
  '酉': { char: '酉', pinyin: 'Yǒu',  animal: 'Rooster', element: 'Metal', polarity: 'Yin',  hiddenStems: ['辛'],         hours: '17–19', color: '#cbd5e1' },
  '戌': { char: '戌', pinyin: 'Xū',   animal: 'Dog',     element: 'Earth', polarity: 'Yang', hiddenStems: ['戊','辛','丁'], hours: '19–21', color: '#a16207' },
  '亥': { char: '亥', pinyin: 'Hài',  animal: 'Pig',     element: 'Water', polarity: 'Yin',  hiddenStems: ['壬','甲'],     hours: '21–23', color: '#0ea5e9' },
}

// ─── Five Elements (五行) ────────────────────────────────────────────────────

export const ELEMENTS: Record<Element, { char: string; pinyin: string; color: string; nature: string; description: string }> = {
  Wood:  { char: '木', pinyin: 'Mù',   color: '#16a34a', nature: 'Growth & Expansion',     description: 'The principle of growing, rising, expanding outward. Wood gives birth, plans ahead, embodies vision and benevolence. It governs the liver, springtime, and the eastern direction.' },
  Fire:  { char: '火', pinyin: 'Huǒ',  color: '#dc2626', nature: 'Radiance & Passion',     description: 'The principle of warming, illuminating, transforming through heat. Fire embodies joy, charisma, and propriety. It governs the heart, summer, and the southern direction.' },
  Earth: { char: '土', pinyin: 'Tǔ',   color: '#a16207', nature: 'Stability & Nourishment',description: 'The principle of centering, holding, nurturing. Earth embodies trust, integrity, and grounded service. It governs the spleen, late summer, and the central direction.' },
  Metal: { char: '金', pinyin: 'Jīn',  color: '#94a3b8', nature: 'Refinement & Discernment',description: 'The principle of contracting, cutting away, refining. Metal embodies righteousness, discipline, and clarity. It governs the lungs, autumn, and the western direction.' },
  Water: { char: '水', pinyin: 'Shuǐ', color: '#1d4ed8', nature: 'Wisdom & Flow',          description: 'The principle of descending, gathering, flowing into hidden depths. Water embodies wisdom, intuition, and quiet power. It governs the kidneys, winter, and the northern direction.' },
}

// Generation cycle: Wood → Fire → Earth → Metal → Water → Wood
export const GENERATES: Record<Element, Element> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
}

// Control cycle: Wood ↘ Earth ↘ Water ↘ Fire ↘ Metal ↘ Wood
export const CONTROLS: Record<Element, Element> = {
  Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood',
}

// ─── 10 Gods (十神) ──────────────────────────────────────────────────────────
// Relationships from the Day Master to other stems.
// Library returns Chinese names; we map to English archetypes.

export interface GodData {
  char:    string
  pinyin:  string
  english: string
  short:   string
  meaning: string
}

export const TEN_GODS: Record<string, GodData> = {
  '比肩': { char: '比肩', pinyin: 'Bǐ Jiān',   english: 'Friend',           short: 'F',  meaning: 'Same element, same polarity. Represents siblings, peers, allies, and the assertive self. Indicates independence, stubbornness, and the ability to compete on equal ground.' },
  '劫财': { char: '劫财', pinyin: 'Jié Cái',   english: 'Rob Wealth',       short: 'RW', meaning: 'Same element, opposite polarity. The ambitious rival within. Represents bold risk-taking, competitive drive, and a tendency to gamble — wealth easily made and easily lost.' },
  '食神': { char: '食神', pinyin: 'Shí Shén',  english: 'Eating God',       short: 'EG', meaning: 'Output, same polarity. The expressive, generative force. Represents artistry, gourmet pleasures, generosity, gentle creativity, and the joy of producing for its own sake.' },
  '伤官': { char: '伤官', pinyin: 'Shāng Guān',english: 'Hurting Officer',  short: 'HO', meaning: 'Output, opposite polarity. Brilliant, rebellious self-expression. Represents talent, eloquence, and innovation — but also defiance of authority and a sharp tongue that can cut.' },
  '偏财': { char: '偏财', pinyin: 'Piān Cái',  english: 'Indirect Wealth',  short: 'IW', meaning: 'Wealth element, same polarity. Speculative, opportunistic gains. Represents charm, generosity, business instinct, and money that flows from unexpected sources or networks.' },
  '正财': { char: '正财', pinyin: 'Zhèng Cái', english: 'Direct Wealth',    short: 'DW', meaning: 'Wealth element, opposite polarity. Steady, earned income. Represents discipline, fidelity, the conservative builder, and the spouse (for male charts).' },
  '七杀': { char: '七杀', pinyin: 'Qī Shā',    english: 'Seven Killings',   short: '7K', meaning: 'Officer element, same polarity. Power without restraint. Represents authority through force, crisis leadership, courage under fire, and the warrior spirit that thrives in adversity.' },
  '正官': { char: '正官', pinyin: 'Zhèng Guān',english: 'Direct Officer',   short: 'DO', meaning: 'Officer element, opposite polarity. Legitimate authority and structure. Represents honor, status, integrity, lawful conduct, and the husband (for female charts).' },
  '偏印': { char: '偏印', pinyin: 'Piān Yìn',  english: 'Indirect Resource',short: 'IR', meaning: 'Resource element, same polarity. Unconventional knowledge. Represents intuition, mysticism, esoteric studies, the eccentric mentor, and protection from unseen sources.' },
  '正印': { char: '正印', pinyin: 'Zhèng Yìn', english: 'Direct Resource',  short: 'DR', meaning: 'Resource element, opposite polarity. Formal nurture and learning. Represents the mother, education, recognition, scholarly authority, and protection through legitimate channels.' },
}

// ─── Day Master Profiles (10 Stems as Day Master) ────────────────────────────

export interface DayMasterProfile {
  archetype: string
  essence:   string
  strengths: string[]
  shadows:   string[]
  description: string
}

export const DAY_MASTER_PROFILES: Record<string, DayMasterProfile> = {
  '甲': {
    archetype: 'The Towering Tree',
    essence: 'Yang Wood — the great oak that reaches for the sky.',
    strengths: ['Leadership', 'Integrity', 'Vision', 'Resilience'],
    shadows:   ['Stubbornness', 'Inflexibility', 'Pride', 'Slow to bend'],
    description: 'You are the pioneering force, the upright pillar that cannot be moved by passing winds. 甲 Wood grows tall and straight — a natural leader with deep roots and unwavering principles. You see far horizons and pursue them with steady, methodical strength. Yet your greatest gift is also your trap: you may break rather than bend, and demand the same from others.',
  },
  '乙': {
    archetype: 'The Garden Flower',
    essence: 'Yin Wood — the climbing vine that conquers through grace.',
    strengths: ['Adaptability', 'Charm', 'Resourcefulness', 'Diplomacy'],
    shadows:   ['Dependency', 'Indecision', 'Manipulation', 'Surface charm'],
    description: 'You are the soft yet unstoppable force — the vine that grows around obstacles, the flower that blooms in the cracks. 乙 Wood succeeds through gentleness, networks, and patient persistence rather than confrontation. Highly social, aesthetically attuned, and emotionally intelligent. Your shadow lies in needing to lean on others to grow tall.',
  },
  '丙': {
    archetype: 'The Solar Flame',
    essence: 'Yang Fire — the sun that gives without asking in return.',
    strengths: ['Warmth', 'Generosity', 'Charisma', 'Optimism'],
    shadows:   ['Egotism', 'Burnout', 'Impatience', 'Need for recognition'],
    description: 'You are pure radiance — the sun that illuminates everything in its path without discrimination. 丙 Fire is the most generous of all Day Masters, naturally drawing people into its warmth. You are visible, loud, magnetic, and impossible to ignore. The shadow: you can scorch what you mean to nurture, and you wither when no one is watching.',
  },
  '丁': {
    archetype: 'The Candlelight',
    essence: 'Yin Fire — the inner flame that illuminates the soul.',
    strengths: ['Intuition', 'Sensitivity', 'Devotion', 'Inner depth'],
    shadows:   ['Moodiness', 'Self-pity', 'Withdrawal', 'Emotional volatility'],
    description: 'You are the gentle, deliberate fire — the candle that lights one face at a time, the lamp by which others read truth. 丁 Fire burns inward more than outward: deeply intuitive, spiritually sensitive, devoted to those you love. You are the quiet artist, the mystic, the one who sees in the dark. But your flame flickers when neglected, and your sensitivity can become your prison.',
  },
  '戊': {
    archetype: 'The Mountain',
    essence: 'Yang Earth — the unmovable peak that endures all seasons.',
    strengths: ['Reliability', 'Strength', 'Loyalty', 'Patience'],
    shadows:   ['Rigidity', 'Stubbornness', 'Slowness', 'Emotional detachment'],
    description: 'You are the immovable foundation — solid, broad, weather-beaten and trustworthy. 戊 Earth is the great mountain: people come to you for shelter and counsel, knowing you will still be there tomorrow. Your strength is your endurance and the calm you radiate. Your trap: you may become so unmovable that growth itself slows to a halt.',
  },
  '己': {
    archetype: 'The Garden Soil',
    essence: 'Yin Earth — the fertile ground that nurtures all life.',
    strengths: ['Nurturing', 'Practicality', 'Tolerance', 'Quiet wisdom'],
    shadows:   ['Self-effacement', 'Worry', 'Indecision', 'Hidden resentment'],
    description: 'You are the soft earth that everything grows from — humble, accommodating, infinitely useful. 己 Earth is the most nurturing of Day Masters: you give of yourself constantly and quietly. Practical, patient, often overlooked but indispensable. The shadow: you may give until nothing remains, and resentment grows secretly in the soil.',
  },
  '庚': {
    archetype: 'The Forged Steel',
    essence: 'Yang Metal — the unyielding blade that cuts cleanly.',
    strengths: ['Decisiveness', 'Justice', 'Strength', 'Loyalty'],
    shadows:   ['Harshness', 'Coldness', 'Combativeness', 'Black-and-white thinking'],
    description: 'You are the warrior\'s blade — direct, sharp, uncompromising. 庚 Metal is the most martial of Day Masters: you cut through illusion, value justice above comfort, and make decisions others cannot. You are loyal to your code and impossible to corrupt. The trap: you may wound those you mean to protect, and harden against the very softness that would heal you.',
  },
  '辛': {
    archetype: 'The Refined Jewel',
    essence: 'Yin Metal — the polished gem whose value lies in its perfection.',
    strengths: ['Elegance', 'Precision', 'Discernment', 'Aesthetic sense'],
    shadows:   ['Vanity', 'Critical eye', 'Aloofness', 'Hidden bitterness'],
    description: 'You are the precious jewel — refined, exquisite, made beautiful by polishing. 辛 Metal Day Masters are naturally elegant, perfectionistic, and drawn to excellence. You have a sharp eye for quality and detail, and you carry yourself with quiet dignity. The shadow: your discernment can curdle into criticism, and your refinement can isolate you from the rough world that would temper you.',
  },
  '壬': {
    archetype: 'The Ocean Wave',
    essence: 'Yang Water — the vast sea that contains all things and yields to none.',
    strengths: ['Intelligence', 'Adaptability', 'Vision', 'Strategic mind'],
    shadows:   ['Restlessness', 'Inconstancy', 'Detachment', 'Hidden depths'],
    description: 'You are the great ocean — endless, deep, full of life and motion. 壬 Water is the most intellectually expansive of Day Masters: you flow around obstacles, contain multitudes, and see patterns others miss. Highly strategic, persuasive, adaptable. The trap: you may flow so freely that you commit to nothing, and your depths can hide secrets even from yourself.',
  },
  '癸': {
    archetype: 'The Mist & Dew',
    essence: 'Yin Water — the gentle moisture that nourishes life invisibly.',
    strengths: ['Sensitivity', 'Imagination', 'Empathy', 'Spiritual depth'],
    shadows:   ['Escapism', 'Anxiety', 'Passivity', 'Emotional fragility'],
    description: 'You are the dew on the leaves at dawn, the mist that softens hard edges. 癸 Water is the most subtle and spiritually receptive of Day Masters: deeply empathic, dreamy, intuitive, often artistic. You sense what others cannot see and care deeply about meaning. The shadow: you may evaporate when life grows too harsh, and your imagination can become a refuge that traps you.',
  },
}

// ─── Animal Profiles (12 Earthly Branches as Year Animal) ────────────────────

export interface AnimalProfile {
  traits:      string[]
  description: string
}

export const ANIMAL_PROFILES: Record<string, AnimalProfile> = {
  'Rat':     { traits: ['Resourceful', 'Quick-witted', 'Charming', 'Opportunistic'], description: 'The first of the zodiac — survivor, strategist, master of timing. The Rat thrives in change, accumulates resources quietly, and reads social currents with uncanny accuracy. Behind the charm lies a calculating mind that always has a contingency plan.' },
  'Ox':      { traits: ['Steadfast', 'Patient', 'Honest', 'Stubborn'],               description: 'The patient laborer who builds empires one stone at a time. The Ox values honest work, loyalty, and quiet strength over recognition. Slow to anger, slow to forgive — and absolutely immovable once decided.' },
  'Tiger':   { traits: ['Courageous', 'Magnetic', 'Impulsive', 'Rebellious'],        description: 'The natural-born warrior and leader. The Tiger acts on instinct, fights for the underdog, and refuses to be caged by convention. Charismatic and dangerous in equal measure — others either follow them or flee.' },
  'Rabbit':  { traits: ['Gentle', 'Diplomatic', 'Aesthetic', 'Cautious'],            description: 'The diplomat and artist. The Rabbit values harmony, beauty, and refinement, navigating conflict with grace rather than force. Often underestimated — but beneath the soft exterior lies remarkable resilience and a sharp mind.' },
  'Dragon':  { traits: ['Visionary', 'Charismatic', 'Proud', 'Larger-than-life'],    description: 'The only mythical animal of the zodiac — the cosmic ruler. The Dragon dreams big, attracts attention effortlessly, and operates on a scale others find intimidating. Generous to allies, devastating to enemies, and never content with the ordinary.' },
  'Snake':   { traits: ['Wise', 'Mysterious', 'Intuitive', 'Strategic'],             description: 'The silent philosopher. The Snake observes more than it speaks, calculates more than it acts, and strikes only when victory is certain. Deeply intuitive, seductive, and gifted with a quiet authority that needs no announcement.' },
  'Horse':   { traits: ['Free-spirited', 'Energetic', 'Honest', 'Restless'],         description: 'The wild runner. The Horse craves freedom, motion, and adventure above all things. Optimistic, sociable, and incapable of being tied down — yet beneath the energy lies a sincere heart that needs space to breathe.' },
  'Goat':    { traits: ['Creative', 'Empathetic', 'Gentle', 'Sensitive'],            description: 'The artist and dreamer. The Goat sees beauty where others see only function, and feels emotions in colors most people lack vocabulary for. Generous and kind — but easily wounded by the world\'s harshness, and prone to retreat into imagination.' },
  'Monkey':  { traits: ['Clever', 'Witty', 'Inventive', 'Mischievous'],              description: 'The trickster genius. The Monkey solves problems sideways, learns languages and skills with effortless speed, and turns every obstacle into a game. Brilliant and entertaining — but the same restlessness that fuels their cleverness can sabotage their commitments.' },
  'Rooster': { traits: ['Confident', 'Honest', 'Meticulous', 'Critical'],            description: 'The proud announcer. The Rooster values truth, order, and excellence — and is unafraid to point out when these are missing. Hardworking, reliable, often perfectionistic. The same eye for quality can become a tongue that wounds if not checked.' },
  'Dog':     { traits: ['Loyal', 'Honest', 'Protective', 'Anxious'],                 description: 'The faithful guardian. The Dog\'s loyalty is absolute, their sense of justice fierce, and their devotion to loved ones unconditional. They live to protect — but worry deeply, and can carry the world\'s burdens until their own back breaks.' },
  'Pig':     { traits: ['Sincere', 'Generous', 'Sensual', 'Indulgent'],              description: 'The honest hedonist. The Pig embraces life\'s pleasures wholeheartedly — food, friendship, comfort, love — and shares generously with those they cherish. Trusting and warm-hearted, sometimes to a fault. They forgive easily and find joy in small things.' },
}

// ─── Special Stars (神煞 Shen Sha) ───────────────────────────────────────────
// Lookup tables — each star is triggered by relationships between the Day Master
// (or Year Branch) and other branches in the chart.

export interface SpecialStarData {
  char:    string
  pinyin:  string
  english: string
  meaning: string
}

export const SPECIAL_STARS: Record<string, SpecialStarData> = {
  nobleman:    { char: '天乙贵人', pinyin: 'Tiān Yǐ Guì Rén', english: 'Heavenly Nobleman', meaning: 'The most auspicious of all stars. Brings unexpected help from influential people, protection in danger, and rescue from crisis. Indicates a charmed life where benefactors appear at critical moments — often the most important people in one\'s destiny.' },
  peachBlossom:{ char: '桃花',     pinyin: 'Táo Huā',         english: 'Peach Blossom',     meaning: 'The star of romance, charm, and magnetism. Grants beauty, sex appeal, and the ability to attract love and admirers effortlessly. In moderation it blesses; in excess it indicates entanglements, scandal, and the danger of being undone by passion.' },
  travelHorse: { char: '驿马',     pinyin: 'Yì Mǎ',           english: 'Travel Horse',      meaning: 'The star of movement, travel, and change. Indicates a life that cannot be confined — frequent relocation, international connections, career changes, restlessness. Brings opportunities far from home and the spirit of the wanderer.' },
  academic:    { char: '文昌',     pinyin: 'Wén Chāng',       english: 'Academic Star',     meaning: 'The star of scholarly achievement, eloquence, and refined intellect. Grants talent in writing, study, exams, and the arts. Indicates a mind that loves learning and a destiny shaped by education and ideas.' },
  solitary:    { char: '华盖',     pinyin: 'Huá Gài',         english: 'Solitary Artist',   meaning: 'The "Canopy" star of spiritual gifts, artistry, and beautiful loneliness. Marks those drawn to mysticism, philosophy, and unconventional paths. Brings creative genius but also solitude — the price of seeing what others cannot.' },
  general:     { char: '将星',     pinyin: 'Jiāng Xīng',      english: 'General Star',      meaning: 'The star of authority, command, and natural leadership. Indicates innate ability to organize, lead, and take responsibility. Those marked by it rise to positions of power — even reluctantly.' },
  goatBlade:   { char: '羊刃',     pinyin: 'Yáng Rèn',        english: 'Goat Blade',        meaning: 'The double-edged star of fierce energy and martial spirit. Grants courage, decisive action, and the power to cut through obstacles — but also indicates impulsiveness, accidents, and the danger of self-injury through excess force.' },
  skyHorse:    { char: '天马',     pinyin: 'Tiān Mǎ',         english: 'Sky Horse',         meaning: 'The celestial messenger — speed, agility, and divine timing. Carries swift news, sudden opportunities, and the ability to seize the moment. Often present in charts of those who succeed through perfect timing.' },
}

// ── Lookup tables ──

// Heavenly Nobleman: Day Master → branches
export const NOBLEMAN_BY_DAY_MASTER: Record<string, string[]> = {
  '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
  '乙': ['子', '申'], '己': ['子', '申'],
  '丙': ['酉', '亥'], '丁': ['酉', '亥'],
  '辛': ['寅', '午'],
  '壬': ['卯', '巳'], '癸': ['卯', '巳'],
}

// Peach Blossom / Travel Horse / Solitary / General: based on Year or Day Branch trio
// The trio: Shen-Zi-Chen / Yin-Wu-Xu / Si-You-Chou / Hai-Mao-Wei
const TRIO_OF_BRANCH: Record<string, string[]> = {
  '申': ['申','子','辰'], '子': ['申','子','辰'], '辰': ['申','子','辰'],
  '寅': ['寅','午','戌'], '午': ['寅','午','戌'], '戌': ['寅','午','戌'],
  '巳': ['巳','酉','丑'], '酉': ['巳','酉','丑'], '丑': ['巳','酉','丑'],
  '亥': ['亥','卯','未'], '卯': ['亥','卯','未'], '未': ['亥','卯','未'],
}

// Each trio has its: peach blossom (sexual energy of element), travel horse, general, solitary
const TRIO_STARS: Record<string, { peachBlossom: string; travelHorse: string; general: string; solitary: string }> = {
  '申子辰': { peachBlossom: '酉', travelHorse: '寅', general: '子', solitary: '辰' }, // Water trio
  '寅午戌': { peachBlossom: '卯', travelHorse: '申', general: '午', solitary: '戌' }, // Fire trio
  '巳酉丑': { peachBlossom: '午', travelHorse: '亥', general: '酉', solitary: '丑' }, // Metal trio
  '亥卯未': { peachBlossom: '子', travelHorse: '巳', general: '卯', solitary: '未' }, // Wood trio
}

export function getTrioStars(branch: string) {
  const trio = TRIO_OF_BRANCH[branch]
  if (!trio) return null
  return TRIO_STARS[trio.join('')]
}

// Academic Star (Wen Chang): Day Master → branch
export const ACADEMIC_BY_DAY_MASTER: Record<string, string> = {
  '甲': '巳', '乙': '午',
  '丙': '申', '戊': '申',
  '丁': '酉', '己': '酉',
  '庚': '亥', '辛': '子',
  '壬': '寅', '癸': '卯',
}

// Goat Blade (Yang Ren): Day Master → branch (only Yang stems strictly)
export const GOAT_BLADE_BY_DAY_MASTER: Record<string, string> = {
  '甲': '卯', '丙': '午', '戊': '午', '庚': '酉', '壬': '子',
}

// Sky Horse (Tian Ma): Month Branch → branch
export const SKY_HORSE_BY_MONTH: Record<string, string> = {
  '寅': '午', '卯': '巳', '辰': '寅',
  '巳': '卯', '午': '寅', '未': '亥',
  '申': '子', '酉': '亥', '戌': '申',
  '亥': '酉', '子': '申', '丑': '巳',
}

// ─── Branch Combinations & Clashes ───────────────────────────────────────────

// 六合 Six Harmonies — pairs that combine
export const SIX_HARMONIES: Array<[string, string, Element]> = [
  ['子', '丑', 'Earth'],
  ['寅', '亥', 'Wood'],
  ['卯', '戌', 'Fire'],
  ['辰', '酉', 'Metal'],
  ['巳', '申', 'Water'],
  ['午', '未', 'Earth'], // (Sun-Moon harmony, no element transformation)
]

// 三合 Three Harmonies — triangles
export const THREE_HARMONIES: Array<{ branches: [string, string, string]; element: Element }> = [
  { branches: ['申', '子', '辰'], element: 'Water' },
  { branches: ['寅', '午', '戌'], element: 'Fire'  },
  { branches: ['巳', '酉', '丑'], element: 'Metal' },
  { branches: ['亥', '卯', '未'], element: 'Wood'  },
]

// 六冲 Six Clashes — opposing pairs
export const SIX_CLASHES: Array<[string, string]> = [
  ['子', '午'],
  ['丑', '未'],
  ['寅', '申'],
  ['卯', '酉'],
  ['辰', '戌'],
  ['巳', '亥'],
]

// 三刑 Punishments
export const PUNISHMENTS: Array<{ branches: string[]; type: string }> = [
  { branches: ['寅', '巳', '申'], type: 'Ungrateful Punishment' },
  { branches: ['丑', '戌', '未'], type: 'Bullying Punishment'   },
  { branches: ['子', '卯'],       type: 'Discourtesy Punishment' },
  { branches: ['辰', '辰'],       type: 'Self-Punishment'        },
  { branches: ['午', '午'],       type: 'Self-Punishment'        },
  { branches: ['酉', '酉'],       type: 'Self-Punishment'        },
  { branches: ['亥', '亥'],       type: 'Self-Punishment'        },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getStem(char: string): StemData | undefined {
  return STEMS[char]
}

export function getBranch(char: string): BranchData | undefined {
  return BRANCHES[char]
}
