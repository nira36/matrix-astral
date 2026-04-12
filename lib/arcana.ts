// ─── 22 Major Arcana – Destiny Matrix system ─────────────────────────────────
// Numbers 1-22 (22 = The Fool, placed at the end in this tradition)

export type EnergyType = 'masculine' | 'feminine' | 'neutral'
export type Element    = 'fire' | 'water' | 'earth' | 'air' | 'spirit'

export interface ArcanaData {
  number:      number
  roman:       string
  name:        string
  keywords:    string[]
  description: string
  energy:      EnergyType
  element:     Element
  planet:      string
  color:       string   // hex for visual accent
}

export const ARCANA: Record<number, ArcanaData> = {
  1: {
    number: 1, roman: 'I', name: 'The Magician',
    keywords: ['Potential', 'Intelligence', 'Originality', 'Skills'],
    description: 'The Soul-Flame moves in the Elemental World: Ether, Air, Water, Earth, and Fire are the first instruments at its service. The True Individual Self begins to unfold.',
    energy: 'masculine', element: 'air', planet: 'Mercury', color: '#a8879d',
  },
  2: {
    number: 2, roman: 'II', name: 'The High Priestess',
    keywords: ['Wisdom', 'Idea', 'Intuition', 'Adaptability'],
    description: 'Between the pillars of Knowledge, the Soul receives the capacity for Thought and learns the Secret Wisdom, and tap into the Principles of Dualism.',
    energy: 'feminine', element: 'water', planet: 'Moon', color: '#e3e4af',
  },
  3: {
    number: 3, roman: 'III', name: 'The Empress',
    keywords: ['Matrix', 'Creativity', 'Fertility', 'Delight'],
    description: 'The first approach to Matter occurs through the generative Mother: the portal between dimensions. The Labyrinth, the archetype of the Ancestral Womb, is one the highest expressions of the Creative Feminine Power.',
    energy: 'feminine', element: 'earth', planet: 'Venus', color: '#caafb3',
  },
  4: {
    number: 4, roman: 'IV', name: 'The Emperor',
    keywords: ['Concreteness', 'Structure', 'Action', 'Domain'],
    description: 'Here Soul learns the ability to master the Matter through the Action and learns the principle of Structure. The Masculine active and rational manages the Power through the concretely realization of its own existence project.',
    energy: 'masculine', element: 'fire', planet: 'Aries / Mars', color: '#a58649',
  },
  5: {
    number: 5, roman: 'V', name: 'The Hierophant',
    keywords: ['Awareness', 'Spirituality', 'Knowledge', 'Gnosis'],
    description: 'At the Altar of the Spirit the Soul experiences the Truth, as the Highest Principle of Knowledge: Everything is already within us, accessible only through Faith, the direct channel to the Divine.',
    energy: 'masculine', element: 'earth', planet: 'Taurus / Venus', color: '#c67912',
  },
  6: {
    number: 6, roman: 'VI', name: 'The Lovers',
    keywords: ['Connection', 'Bond', 'Eternity', 'Mirror'],
    description: 'The red thread of Destiny leads the Soul back to itself to recognize the Divine that is inside them through the other, the Eternal within the Moment. Every form of Love unveils and asks to be experienced.',
    energy: 'neutral', element: 'air', planet: 'Gemini / Mercury', color: '#BE1C1C',
  },
  7: {
    number: 7, roman: 'VII', name: 'The Chariot',
    keywords: ['Experience', 'Journey', 'Movement', 'Memory'],
    description: 'The Journey towards one\'s Authentic Essence passes through the Memory and Awareness of each plane of Existence. The North of the compass is the Heart, the seat of the Crystallized Divine Spark.',
    energy: 'masculine', element: 'water', planet: 'Cancer / Moon', color: '#a2d1c9',
  },
  8: {
    number: 8, roman: 'VIII', name: 'Strength',
    keywords: ['Discipline', 'Constancy', 'Practice', 'Dedication'],
    description: 'Every act of Will is an act of Magic. The Soul manifests its Potential and creates its own Reality. To express your own Potential you need Willpower and courage.',
    energy: 'feminine', element: 'fire', planet: 'Leo / Sun', color: '#f6e7d9',
  },
  9: {
    number: 9, roman: 'IX', name: 'The Hermit',
    keywords: ['Mystery', 'Search', 'Unknown', 'Unconscious'],
    description: 'In the darkness of the Abyss of Self, every Light amplifies and reveals the Shadows. The eyes become confused; one can only follow the Heart and the Light of your own Vision.',
    energy: 'neutral', element: 'earth', planet: 'Virgo / Mercury', color: '#8b9c97',
  },
  10: {
    number: 10, roman: 'X', name: 'Wheel of Fortune',
    keywords: ['Fate', 'Fortune', 'Synchronicity', 'Divine Flow'],
    description: 'The perfect geometric figure that gives shape and content to every moment, tracing precise maps that govern events. Like the combination of a safe, the sequence of information of every Circle allows to open and understand each aspect of Life and of Consciousness.',
    energy: 'neutral', element: 'fire', planet: 'Jupiter', color: '#b4a697',
  },
  11: {
    number: 11, roman: 'XI', name: 'Justice',
    keywords: ['Order', 'Harmony', 'Rule', 'Integrity'],
    description: 'The scale of Maat weighs the Heart with an ostrich feather to determine the purity of the Soul. Only a light and free Heart is destined to continue the journey. Order.',
    energy: 'neutral', element: 'air', planet: 'Libra / Venus', color: '#b4a697',
  },
  12: {
    number: 12, roman: 'XII', name: 'The Hanged Man',
    keywords: ['Perspective', 'Opening', 'Perception', 'Beyond'],
    description: 'With what eyes do you look at what happens Inside and Outside of you? It\'s time to See; it\'s no longer enough to look. When Truth calls and asks to be seen, it creates a radical, definitive, and irreversible change.',
    energy: 'neutral', element: 'water', planet: 'Neptune', color: '#8b9c97',
  },
  13: {
    number: 13, roman: 'XIII', name: 'Death',
    keywords: ['Metamorphosis', 'Alchemy', 'Cyclicality', 'Passage'],
    description: 'In the cycles of Death and Rebirth, the only constant is Life. End and Beginning follow in an infinite Cycle of Pure Potential. Transformation is only possible by allowing the old version of oneself to die and permitting the new one to exist.',
    energy: 'neutral', element: 'water', planet: 'Scorpio / Pluto', color: '#f6e7d9',
  },
  14: {
    number: 14, roman: 'XIV', name: 'Temperance',
    keywords: ['Harmony', 'Alignment', 'Healing', 'Cleansing'],
    description: 'Pure source, baptismal font, purifying water that cleanses and regenerates, taking away what no longer belongs to us, what is obsolete and incompatible with the Self. Integration of the Here and Now.',
    energy: 'feminine', element: 'fire', planet: 'Sagittarius / Jupiter', color: '#a2d1c9',
  },
  15: {
    number: 15, roman: 'XV', name: 'The Devil',
    keywords: ['Ego', 'War', 'Fear', 'Compromise'],
    description: 'In the material dimension, anything can be determined and legitimized only through the definition and existence of its opposite and contrary. The identification of the Ego with individual aspects of Dualism generates the eternal War between opposites.',
    energy: 'masculine', element: 'earth', planet: 'Capricorn / Saturn', color: '#BE1C1C',
  },
  16: {
    number: 16, roman: 'XVI', name: 'The Tower',
    keywords: ['Sacrifice', 'Redemption', 'Surrender', 'Obstacle'],
    description: 'The Necessary Sacrifice is the Point of No Return: the fall of the Ego. Surrender and acceptance are choices that can only be made in a state of total Devotion. The real Test is not what happens, but the choice of our reaction.',
    energy: 'masculine', element: 'fire', planet: 'Mars', color: '#c67912',
  },
  17: {
    number: 17, roman: 'XVII', name: 'The Star',
    keywords: ['Novelty', 'Ceremony', 'Ritual', 'Possibility'],
    description: 'Having passed the Test and achieved initiation, the Soul regains its Total Awareness. The initiated sits on the throne of their own Heart and shifts their Center. Every action starts from a conscious intention of Love.',
    energy: 'feminine', element: 'air', planet: 'Aquarius / Uranus', color: '#e3e4af',
  },
  18: {
    number: 18, roman: 'XVIII', name: 'The Moon',
    keywords: ['Reflection', 'Secret', 'Emanation', 'Unconscious'],
    description: 'In the Temple of the Moon, the tides guard the Energy of the Sacred Feminine. The portal between Spirit and Matter, the Threshold between Worlds. The Goddess holds the codes of Life that permeate and move everything.',
    energy: 'feminine', element: 'water', planet: 'Pisces / Neptune', color: '#caafb3',
  },
  19: {
    number: 19, roman: 'XIX', name: 'The Sun',
    keywords: ['Wealth', 'Clarity', 'Ascent', 'Realization'],
    description: 'The Sacred Fire of the Sun burns every material structure, leading the Soul to recognize Itself Beyond the experience of material existence.',
    energy: 'masculine', element: 'fire', planet: 'Sun', color: '#a58649',
  },
  20: {
    number: 20, roman: 'XX', name: 'Judgement',
    keywords: ['Expansion', 'Liberation', 'Rebirth', 'Ecstasy'],
    description: 'The Soul has completed its Great Work, emerging from Duality and returning to the One; it restores the Dance of Cosmic Balance, where pairs of opposites unite and transcend. Like in Tantra, the Spirit returns to being Source and Oneness.',
    energy: 'neutral', element: 'fire', planet: 'Pluto', color: '#a8879d',
  },
  21: {
    number: 21, roman: 'XXI', name: 'The World',
    keywords: ['Totality', 'Synthesis', 'Completion', 'Achievement'],
    description: 'The Soul re-emerges, concluding its Journey, it\'s back Home, in front of it the Cosmic Balance. It has integrated the necessary experience, has become whole again and is ready to begin another path of its eternal journey towards perfection.',
    energy: 'feminine', element: 'earth', planet: 'Saturn', color: '#8b9c97',
  },
  22: {
    number: 22, roman: 'XXII', name: 'The Cosmos',
    keywords: ['Energy', 'Entropy', 'Source', 'Beginning'],
    description: 'A Dive. From the Universe, through a Black Hole/Cosmic Womb. Here the Complete Soul divides into 2 Flames, to reborn in a New Cycle. Thus begins the New Journey.',
    energy: 'neutral', element: 'spirit', planet: 'Uranus', color: '#8b9c97',
  },
}

export function getArcana(n: number): ArcanaData {
  return ARCANA[Math.max(1, Math.min(22, n))] ?? ARCANA[22]
}

export const ELEMENT_SYMBOLS: Record<Element, string> = {
  fire:   'Fire',
  water:  'Water',
  earth:  'Earth',
  air:    'Air',
  spirit: 'Spirit',
}
