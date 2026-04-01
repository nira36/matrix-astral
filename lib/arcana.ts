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
    keywords: ['willpower', 'creation', 'skill', 'manifestation'],
    description: 'The force of conscious will. You possess the power to shape reality through focused intention, mastery of tools, and alchemical skill.',
    energy: 'masculine', element: 'air', planet: 'Mercury', color: '#f59e0b',
  },
  2: {
    number: 2, roman: 'II', name: 'High Priestess',
    keywords: ['intuition', 'mystery', 'inner wisdom', 'silence'],
    description: 'Deep knowing beyond rational mind. Trust the subconscious signals, the dreams, and the wisdom that arrives only in stillness.',
    energy: 'feminine', element: 'water', planet: 'Moon', color: '#818cf8',
  },
  3: {
    number: 3, roman: 'III', name: 'The Empress',
    keywords: ['abundance', 'creativity', 'nurture', 'nature'],
    description: 'The fertile creative force of the universe. You are here to create, nurture, and draw beauty and abundance into the world through love.',
    energy: 'feminine', element: 'earth', planet: 'Venus', color: '#34d399',
  },
  4: {
    number: 4, roman: 'IV', name: 'The Emperor',
    keywords: ['authority', 'structure', 'stability', 'order'],
    description: 'Mastery through discipline and order. Build solid foundations, lead with inner authority, and give form to what otherwise remains formless.',
    energy: 'masculine', element: 'fire', planet: 'Aries / Mars', color: '#ef4444',
  },
  5: {
    number: 5, roman: 'V', name: 'The Hierophant',
    keywords: ['tradition', 'teaching', 'spiritual law', 'guidance'],
    description: 'Bridge between the sacred and the human. You are called to teach, to uphold the deeper laws, and to be a living tradition-keeper.',
    energy: 'masculine', element: 'earth', planet: 'Taurus / Venus', color: '#94a3b8',
  },
  6: {
    number: 6, roman: 'VI', name: 'The Lovers',
    keywords: ['choice', 'harmony', 'relationship', 'values'],
    description: 'The power of sacred union and conscious choice. Relationships and heart-alignment with your highest values are your transformative path.',
    energy: 'neutral', element: 'air', planet: 'Gemini / Mercury', color: '#f472b6',
  },
  7: {
    number: 7, roman: 'VII', name: 'The Chariot',
    keywords: ['determination', 'victory', 'control', 'momentum'],
    description: 'Willpower channeled into focused movement. Through self-mastery and unwavering intention, you overcome every obstacle that arises.',
    energy: 'masculine', element: 'water', planet: 'Cancer / Moon', color: '#38bdf8',
  },
  8: {
    number: 8, roman: 'VIII', name: 'Justice',
    keywords: ['balance', 'truth', 'cause & effect', 'clarity'],
    description: 'The law of perfect cosmic balance. Every action seeds its consequence. Align with truth and act with integrity to create just outcomes.',
    energy: 'neutral', element: 'air', planet: 'Libra / Venus', color: '#a78bfa',
  },
  9: {
    number: 9, roman: 'IX', name: 'The Hermit',
    keywords: ['wisdom', 'introspection', 'solitude', 'light-bearing'],
    description: 'The seeker who becomes the guide. Through deep inner work you find wisdom that cannot be given — only earned through lived experience.',
    energy: 'neutral', element: 'earth', planet: 'Virgo / Mercury', color: '#a3a3a3',
  },
  10: {
    number: 10, roman: 'X', name: 'Wheel of Fortune',
    keywords: ['cycles', 'fate', 'turning point', 'synchronicity'],
    description: 'The eternal turning of cosmic cycles. What rises must fall; what falls must rise. Your task is to dance gracefully with the current of change.',
    energy: 'neutral', element: 'fire', planet: 'Jupiter', color: '#fbbf24',
  },
  11: {
    number: 11, roman: 'XI', name: 'Strength / Force',
    keywords: ['courage', 'patience', 'inner power', 'compassion'],
    description: 'Quiet courage over brute force. True power flows from the heart — through patience, compassion, and taming the wild within.',
    energy: 'feminine', element: 'fire', planet: 'Leo / Sun', color: '#fb923c',
  },
  12: {
    number: 12, roman: 'XII', name: 'The Hanged Man',
    keywords: ['surrender', 'pause', 'new perspective', 'initiation'],
    description: 'Sacred suspension and the gift of the inversion. What appears as delay or sacrifice is a profound initiation into a higher way of seeing.',
    energy: 'neutral', element: 'water', planet: 'Neptune', color: '#67e8f9',
  },
  13: {
    number: 13, roman: 'XIII', name: 'Death',
    keywords: ['transformation', 'endings', 'rebirth', 'release'],
    description: 'The great transformer — not an ending, but a metamorphosis. Old forms dissolve to make space for what wants to be born through you.',
    energy: 'neutral', element: 'water', planet: 'Scorpio / Pluto', color: '#6b7280',
  },
  14: {
    number: 14, roman: 'XIV', name: 'Temperance',
    keywords: ['balance', 'alchemy', 'moderation', 'integration'],
    description: 'The sacred art of blending opposites. By integrating polarities with patience and grace, you create something greater than either alone.',
    energy: 'feminine', element: 'fire', planet: 'Sagittarius / Jupiter', color: '#4ade80',
  },
  15: {
    number: 15, roman: 'XV', name: 'The Devil',
    keywords: ['shadow', 'liberation', 'attachment', 'desire'],
    description: 'The gift hidden inside the shadow. This energy reveals exactly where fear, conditioning, and attachment bind you — and where freedom waits.',
    energy: 'masculine', element: 'earth', planet: 'Capricorn / Saturn', color: '#dc2626',
  },
  16: {
    number: 16, roman: 'XVI', name: 'The Tower',
    keywords: ['breakthrough', 'revelation', 'sudden change', 'liberation'],
    description: 'The lightning of awakening. Structures that no longer serve are cleared suddenly and completely, making space for authentic truth to rise.',
    energy: 'masculine', element: 'fire', planet: 'Mars', color: '#f97316',
  },
  17: {
    number: 17, roman: 'XVII', name: 'The Star',
    keywords: ['hope', 'inspiration', 'healing', 'grace'],
    description: 'Pure celestial hope and healing grace. You carry the gift of renewal — the ability to inspire, restore, and illuminate the path forward for others.',
    energy: 'feminine', element: 'air', planet: 'Aquarius / Uranus', color: '#7dd3fc',
  },
  18: {
    number: 18, roman: 'XVIII', name: 'The Moon',
    keywords: ['illusion', 'deep instinct', 'subconscious', 'dreams'],
    description: 'The realm of deep dreams and primal instinct. Navigate the waters of the unconscious with trust — not everything is as it first appears.',
    energy: 'feminine', element: 'water', planet: 'Pisces / Neptune', color: '#818cf8',
  },
  19: {
    number: 19, roman: 'XIX', name: 'The Sun',
    keywords: ['joy', 'vitality', 'clarity', 'radiance'],
    description: 'Radiant life force and pure unfiltered joy. You are here to shine, to celebrate existence itself, and to bring light and warmth wherever you go.',
    energy: 'masculine', element: 'fire', planet: 'Sun', color: '#fde047',
  },
  20: {
    number: 20, roman: 'XX', name: 'Judgement',
    keywords: ['awakening', 'calling', 'reckoning', 'renewal'],
    description: 'The great awakening and soul-level calling. A moment of profound reckoning — you are summoned to rise and fully answer your highest purpose.',
    energy: 'neutral', element: 'fire', planet: 'Pluto', color: '#e879f9',
  },
  21: {
    number: 21, roman: 'XXI', name: 'The World',
    keywords: ['completion', 'mastery', 'integration', 'wholeness'],
    description: 'The completion of the sacred cycle. Integration, mastery, and the profound fullness of a soul that has learned everything it came here to learn.',
    energy: 'feminine', element: 'earth', planet: 'Saturn', color: '#2dd4bf',
  },
  22: {
    number: 22, roman: 'XXII', name: 'The Fool',
    keywords: ['freedom', 'new beginning', 'infinite potential', 'trust'],
    description: 'The divine leap into the unknown. Pure unlimited potential, boundless freedom, and the sacred innocence of a soul beginning its journey anew.',
    energy: 'neutral', element: 'spirit', planet: 'Uranus', color: '#a3e635',
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
