// ─── Minor Arcana & Court Cards – Thoth / Golden Dawn tradition ──────────────
// Based on Aleister Crowley's "Book of Thoth" and the Golden Dawn system.
// Each pip card carries a traditional title; court cards follow the
// Knight (King) / Queen / Prince / Princess hierarchy of the Thoth deck.

export type Suit = 'wands' | 'cups' | 'swords' | 'disks'

export interface MinorCardData {
  rank:        string
  suit:        Suit
  title:       string      // Thoth title (e.g. "Dominion", "Love")
  keywords:    string[]
  description: string
}

export interface CourtCardData {
  rank:        string
  suit:        Suit
  keywords:    string[]
  description: string
}

// ─── Minor Arcana (40 pip cards) ─────────────────────────────────────────────

export const MINOR_ARCANA: Record<string, MinorCardData> = {
  // ── Wands (Fire) ──────────────────────────────────────────────────────────
  'Ace of Wands': {
    rank: 'Ace', suit: 'wands', title: 'Root of Fire',
    keywords: ['Origin', 'Force', 'Inspiration', 'Initiative'],
    description: 'The primordial spark of creative will. Pure potential of the Fire element erupts from the void — a bolt of divine intention that ignites new beginnings, creative ventures, and the raw drive to manifest.',
  },
  '2 of Wands': {
    rank: '2', suit: 'wands', title: 'Dominion',
    keywords: ['Authority', 'Courage', 'Will', 'Boldness'],
    description: 'Mars in Aries. The balanced assertion of personal power and sovereign will. The initial creative spark has found direction, establishing dominion over its domain through decisive action and courageous leadership.',
  },
  '3 of Wands': {
    rank: '3', suit: 'wands', title: 'Virtue',
    keywords: ['Integrity', 'Realization', 'Establishment', 'Strength'],
    description: 'Sun in Aries. The full expression of the fiery will, radiating integrity and established strength. Creative vision takes solid form — plans materialize, enterprises flourish, and virtue becomes its own reward.',
  },
  '4 of Wands': {
    rank: '4', suit: 'wands', title: 'Completion',
    keywords: ['Perfection', 'Settlement', 'Celebration', 'Harmony'],
    description: 'Venus in Aries. The perfect equilibrium of fiery energy — a moment of completion and joyful celebration. Foundations are securely laid, the work finds its natural order, and harmony crowns the effort.',
  },
  '5 of Wands': {
    rank: '5', suit: 'wands', title: 'Strife',
    keywords: ['Struggle', 'Competition', 'Conflict', 'Friction'],
    description: 'Saturn in Leo. The disruption of fiery harmony through conflict and internal struggle. Competing wills clash, creating necessary tension that ultimately forges greater strength through the trial of opposition.',
  },
  '6 of Wands': {
    rank: '6', suit: 'wands', title: 'Victory',
    keywords: ['Triumph', 'Success', 'Advancement', 'Pride'],
    description: 'Jupiter in Leo. The triumphant resolution of strife — balanced force achieves its aim. Success earned through perseverance, the justified pride of accomplishment, and the generous warmth of recognized achievement.',
  },
  '7 of Wands': {
    rank: '7', suit: 'wands', title: 'Valour',
    keywords: ['Bravery', 'Defiance', 'Resistance', 'Determination'],
    description: 'Mars in Leo. Courage under siege — standing one\'s ground against overwhelming odds. The warrior spirit rises to meet challenge with fierce determination, finding strength precisely when it is most needed.',
  },
  '8 of Wands': {
    rank: '8', suit: 'wands', title: 'Swiftness',
    keywords: ['Speed', 'Communication', 'Travel', 'Momentum'],
    description: 'Mercury in Sagittarius. The lightning-swift flight of directed energy — messages arrive, events accelerate, and the arrows of intention find their mark. Rapid movement, clear communication, and unstoppable momentum.',
  },
  '9 of Wands': {
    rank: '9', suit: 'wands', title: 'Strength',
    keywords: ['Power', 'Resilience', 'Defense', 'Endurance'],
    description: 'Moon in Sagittarius. The accumulated force of sustained will — tremendous inner power drawn from deep reserves. Resilience forged through experience, the quiet strength of one who has weathered many storms.',
  },
  '10 of Wands': {
    rank: '10', suit: 'wands', title: 'Oppression',
    keywords: ['Burden', 'Pressure', 'Responsibility', 'Exhaustion'],
    description: 'Saturn in Sagittarius. Fire crushed under its own weight — the creative force has become a heavy burden. Excessive responsibility, the weight of unchecked ambition, and the need to release what no longer serves.',
  },

  // ── Cups (Water) ──────────────────────────────────────────────────────────
  'Ace of Cups': {
    rank: 'Ace', suit: 'cups', title: 'Root of Water',
    keywords: ['Love', 'Fertility', 'Abundance', 'Joy'],
    description: 'The Holy Grail — the primordial wellspring of emotion and spiritual receptivity. Pure love overflows from the divine source, promising emotional fulfillment, creative fertility, and the deep joy of the open heart.',
  },
  '2 of Cups': {
    rank: '2', suit: 'cups', title: 'Love',
    keywords: ['Partnership', 'Union', 'Harmony', 'Attraction'],
    description: 'Venus in Cancer. The perfect meeting of two souls — mutual attraction flowing into harmonious union. The alchemical marriage of complementary forces, where love creates something greater than the sum of its parts.',
  },
  '3 of Cups': {
    rank: '3', suit: 'cups', title: 'Abundance',
    keywords: ['Celebration', 'Friendship', 'Joy', 'Plenty'],
    description: 'Mercury in Cancer. The overflowing chalice of shared happiness — love multiplied through community. Celebration of bonds that nourish the soul, the abundance that comes when hearts open freely to one another.',
  },
  '4 of Cups': {
    rank: '4', suit: 'cups', title: 'Luxury',
    keywords: ['Pleasure', 'Excess', 'Satiation', 'Complacency'],
    description: 'Moon in Cancer. Emotional stagnation born of excessive comfort — the still waters that no longer flow. The danger of taking blessings for granted, the restless dissatisfaction that arises when the heart grows complacent.',
  },
  '5 of Cups': {
    rank: '5', suit: 'cups', title: 'Disappointment',
    keywords: ['Loss', 'Regret', 'Mourning', 'Disillusion'],
    description: 'Mars in Scorpio. The bitter cup of emotional loss — expectations shattered, hopes dissolved. Yet within the grief lies the seed of deeper understanding; not all that is lost was truly ours to keep.',
  },
  '6 of Cups': {
    rank: '6', suit: 'cups', title: 'Pleasure',
    keywords: ['Nostalgia', 'Harmony', 'Happiness', 'Innocence'],
    description: 'Sun in Scorpio. The gentle warmth of remembered joy — emotional equilibrium restored through the beauty of simple pleasures. The innocence of the heart reclaimed, harmony flowing naturally from within.',
  },
  '7 of Cups': {
    rank: '7', suit: 'cups', title: 'Debauch',
    keywords: ['Illusion', 'Fantasy', 'Corruption', 'Temptation'],
    description: 'Venus in Scorpio. The poisoned chalice of delusion — emotions corrupted by fantasy and self-deception. Glamorous illusions mask deeper truths, tempting the seeker away from authentic feeling into false pleasures.',
  },
  '8 of Cups': {
    rank: '8', suit: 'cups', title: 'Indolence',
    keywords: ['Decline', 'Abandonment', 'Stagnation', 'Apathy'],
    description: 'Saturn in Pisces. The abandoned garden of the heart — emotional energy drains away into apathy and neglect. What once brought joy now lies fallow, demanding the courage to either revive or consciously release.',
  },
  '9 of Cups': {
    rank: '9', suit: 'cups', title: 'Happiness',
    keywords: ['Fulfillment', 'Satisfaction', 'Contentment', 'Wish'],
    description: 'Jupiter in Pisces. The wish fulfilled — the deepest emotional satisfaction of the soul. Complete contentment flows from alignment with one\'s true desires, the rare and precious joy of a heart at peace.',
  },
  '10 of Cups': {
    rank: '10', suit: 'cups', title: 'Satiety',
    keywords: ['Completion', 'Family', 'Peace', 'Overflow'],
    description: 'Mars in Pisces. The final expression of emotional fulfillment — love made manifest in lasting bonds. Yet satiety carries the seed of restlessness; the cycle of the heart prepares to begin anew.',
  },

  // ── Swords (Air) ──────────────────────────────────────────────────────────
  'Ace of Swords': {
    rank: 'Ace', suit: 'swords', title: 'Root of Air',
    keywords: ['Invocation', 'Clarity', 'Truth', 'Power'],
    description: 'The Sword of the Magus — the primordial blade of pure intellect that cuts through all illusion. Invincible reason, piercing clarity, and the power of the mind to discern truth from falsehood.',
  },
  '2 of Swords': {
    rank: '2', suit: 'swords', title: 'Peace',
    keywords: ['Balance', 'Truce', 'Stalemate', 'Resolution'],
    description: 'Moon in Libra. The crossed swords of balanced intellect — opposing forces held in perfect equilibrium. A fragile peace achieved through reason, the calm before decision, where all options are weighed with care.',
  },
  '3 of Swords': {
    rank: '3', suit: 'swords', title: 'Sorrow',
    keywords: ['Grief', 'Heartbreak', 'Pain', 'Separation'],
    description: 'Saturn in Libra. The sword that pierces the heart — understanding born through suffering. The necessary pain of seeing clearly what was previously denied, the sorrow that comes with unflinching honesty.',
  },
  '4 of Swords': {
    rank: '4', suit: 'swords', title: 'Truce',
    keywords: ['Rest', 'Retreat', 'Recovery', 'Solitude'],
    description: 'Jupiter in Libra. The temporary cessation of mental conflict — a much-needed pause for restoration. Strategic withdrawal to gather strength, the healing power of silence and solitary contemplation.',
  },
  '5 of Swords': {
    rank: '5', suit: 'swords', title: 'Defeat',
    keywords: ['Loss', 'Degradation', 'Failure', 'Humiliation'],
    description: 'Venus in Aquarius. The broken blade of shattered logic — intellectual defeat and the humiliation of proven wrong. Yet in defeat lies wisdom: the ego must fall before deeper understanding can arise.',
  },
  '6 of Swords': {
    rank: '6', suit: 'swords', title: 'Science',
    keywords: ['Intellect', 'Analysis', 'Discovery', 'Progress'],
    description: 'Mercury in Aquarius. The balanced sword of objective inquiry — the mind operating at its highest function. Clear analytical thought, scientific discovery, and the progressive advancement of understanding through reason.',
  },
  '7 of Swords': {
    rank: '7', suit: 'swords', title: 'Futility',
    keywords: ['Deception', 'Evasion', 'Instability', 'Cunning'],
    description: 'Moon in Aquarius. The unstable mind that undermines itself — cleverness without wisdom, strategy without honor. Plans built on shifting foundations, the futility of trying to think one\'s way out of a spiritual problem.',
  },
  '8 of Swords': {
    rank: '8', suit: 'swords', title: 'Interference',
    keywords: ['Restriction', 'Limitation', 'Blockage', 'Confusion'],
    description: 'Jupiter in Gemini. The tangled web of overthinking — mental energy scattered and blocked by conflicting thoughts. External interference and internal confusion create paralysis, yet the bonds are often self-imposed.',
  },
  '9 of Swords': {
    rank: '9', suit: 'swords', title: 'Cruelty',
    keywords: ['Anguish', 'Nightmare', 'Despair', 'Torment'],
    description: 'Mars in Gemini. The darkest aspect of the mind turned against itself — thoughts become instruments of self-torture. Anxiety, nightmares, and mental anguish at their peak. The mind must find its way back to the heart.',
  },
  '10 of Swords': {
    rank: '10', suit: 'swords', title: 'Ruin',
    keywords: ['Destruction', 'Catastrophe', 'End', 'Collapse'],
    description: 'Sun in Gemini. The complete collapse of mental structures — the old paradigm falls entirely. Though devastating, Ruin clears the ground completely, making way for entirely new ways of thinking to emerge from the ashes.',
  },

  // ── Disks (Earth) ─────────────────────────────────────────────────────────
  'Ace of Disks': {
    rank: 'Ace', suit: 'disks', title: 'Root of Earth',
    keywords: ['Materiality', 'Prosperity', 'Seed', 'Beginning'],
    description: 'The primordial coin — the seed of all material manifestation. Pure potential of the Earth element: the beginning of prosperity, the first concrete step, the planting of a seed that will grow into tangible reality.',
  },
  '2 of Disks': {
    rank: '2', suit: 'disks', title: 'Change',
    keywords: ['Flux', 'Adaptation', 'Balance', 'Transformation'],
    description: 'Jupiter in Capricorn. The eternal dance of material change — the serpent biting its tail. Harmonious transformation, the ability to juggle multiple demands, and the wisdom to flow with the cycles of gain and loss.',
  },
  '3 of Disks': {
    rank: '3', suit: 'disks', title: 'Works',
    keywords: ['Craftsmanship', 'Labor', 'Skill', 'Construction'],
    description: 'Mars in Capricorn. The master builder at work — the material expression of skill and dedicated effort. Sacred labor, the joy of craftsmanship, and the tangible results that come from disciplined, purposeful work.',
  },
  '4 of Disks': {
    rank: '4', suit: 'disks', title: 'Power',
    keywords: ['Stability', 'Security', 'Control', 'Foundation'],
    description: 'Sun in Capricorn. The fortress of material security — resources consolidated and protected. Solid foundations, financial stability, and the power that comes from having established a strong earthly base.',
  },
  '5 of Disks': {
    rank: '5', suit: 'disks', title: 'Worry',
    keywords: ['Anxiety', 'Hardship', 'Scarcity', 'Strain'],
    description: 'Mercury in Taurus. The gnawing fear of material loss — anxiety over resources, health, or security. The mind fixates on lack rather than abundance, creating a spiral of worry that itself becomes the heaviest burden.',
  },
  '6 of Disks': {
    rank: '6', suit: 'disks', title: 'Success',
    keywords: ['Generosity', 'Prosperity', 'Sharing', 'Reward'],
    description: 'Moon in Taurus. The harmonious distribution of material blessings — prosperity that flows and is shared. Earned success, generous reward, and the understanding that true wealth multiplies through giving.',
  },
  '7 of Disks': {
    rank: '7', suit: 'disks', title: 'Failure',
    keywords: ['Stagnation', 'Fear', 'Disappointment', 'Patience'],
    description: 'Saturn in Taurus. The barren field that tests patience — efforts that have not yet borne fruit. The apparent failure that precedes breakthrough, demanding perseverance and the faith to continue tending what seems fruitless.',
  },
  '8 of Disks': {
    rank: '8', suit: 'disks', title: 'Prudence',
    keywords: ['Skill', 'Detail', 'Patience', 'Diligence'],
    description: 'Sun in Virgo. The careful hand of the artisan — meticulous attention to detail and patient craftsmanship. Each small, precise action builds toward mastery. Prudent management of resources and steady, skillful progress.',
  },
  '9 of Disks': {
    rank: '9', suit: 'disks', title: 'Gain',
    keywords: ['Wealth', 'Abundance', 'Harvest', 'Achievement'],
    description: 'Venus in Virgo. The abundant harvest of disciplined effort — material wealth earned through virtue and skill. The satisfaction of tangible achievement, the garden that finally yields its rich and deserved fruit.',
  },
  '10 of Disks': {
    rank: '10', suit: 'disks', title: 'Wealth',
    keywords: ['Fortune', 'Inheritance', 'Legacy', 'Culmination'],
    description: 'Mercury in Virgo. The culmination of material achievement — the complete cycle of earthly manifestation. Wealth in its fullest sense: prosperity, legacy, and the accumulated treasures of a life lived with purpose.',
  },
}

// ─── Court Cards (16) ────────────────────────────────────────────────────────

export const COURT_CARDS: Record<string, CourtCardData> = {
  // ── Wands ─────────────────────────────────────────────────────────────────
  'Princess of Wands': {
    rank: 'Princess', suit: 'wands',
    keywords: ['Brilliance', 'Daring', 'Beauty', 'Passion'],
    description: 'The Earthly expression of Fire — a radiant, fearless spirit bursting with creative energy. She is the spark that ignites new passions, the dancer in the flame, combining beauty with daring and brilliance with instinct.',
  },
  'Prince of Wands': {
    rank: 'Prince', suit: 'wands',
    keywords: ['Swiftness', 'Strength', 'Nobility', 'Impetuosity'],
    description: 'The Airy expression of Fire — the swift charioteer driven by fierce creative will. He rushes forward with noble strength and passionate intensity, embodying the untamed force of inspiration in rapid, decisive action.',
  },
  'Queen of Wands': {
    rank: 'Queen', suit: 'wands',
    keywords: ['Authority', 'Adaptability', 'Command', 'Magnetism'],
    description: 'The Watery expression of Fire — the flame that draws all toward its warmth. She commands through magnetic presence and adaptive intelligence, mastering creative forces with steady authority and natural grace.',
  },
  'King of Wands': {
    rank: 'King', suit: 'wands',
    keywords: ['Generosity', 'Fierceness', 'Activity', 'Leadership'],
    description: 'The Fiery expression of Fire — the warrior-king in his full power. He embodies active, generous leadership and fierce creative force. A visionary who leads by example, igniting others through sheer force of will.',
  },

  // ── Cups ──────────────────────────────────────────────────────────────────
  'Princess of Cups': {
    rank: 'Princess', suit: 'cups',
    keywords: ['Sweetness', 'Imagination', 'Gentleness', 'Reverie'],
    description: 'The Earthly expression of Water — the dreamer at the edge of the sea. She embodies gentle, receptive imagination, the tender beginnings of emotional awareness, and the crystallization of dreams into first, tentative form.',
  },
  'Prince of Cups': {
    rank: 'Prince', suit: 'cups',
    keywords: ['Subtlety', 'Artistry', 'Craft', 'Mystery'],
    description: 'The Airy expression of Water — the visionary artist navigating hidden currents. He moves through the emotional realm with subtle intelligence, transforming raw feeling into refined art and deep mystery.',
  },
  'Queen of Cups': {
    rank: 'Queen', suit: 'cups',
    keywords: ['Reflection', 'Dreaminess', 'Tranquility', 'Receptivity'],
    description: 'The Watery expression of Water — the still mirror that reflects all truth. She embodies pure receptivity, deep tranquility, and the power of the unconscious mind. Her dreaming holds the reflection of hidden worlds.',
  },
  'King of Cups': {
    rank: 'King', suit: 'cups',
    keywords: ['Grace', 'Sensitivity', 'Passion', 'Calm'],
    description: 'The Fiery expression of Water — the master of emotional depth who acts from the heart. He combines passionate intensity with serene composure, channeling the full power of feeling through graceful, measured action.',
  },

  // ── Swords ────────────────────────────────────────────────────────────────
  'Princess of Swords': {
    rank: 'Princess', suit: 'swords',
    keywords: ['Wisdom', 'Strength', 'Acuteness', 'Perception'],
    description: 'The Earthly expression of Air — the fierce maiden of sharp perception. She cuts through deception with youthful clarity, embodying the first awakening of intellectual power: acute, uncompromising, and fearlessly direct.',
  },
  'Prince of Swords': {
    rank: 'Prince', suit: 'swords',
    keywords: ['Ideas', 'Thoughts', 'Design', 'Ingenuity'],
    description: 'The Airy expression of Air — pure intellect in swift motion. He charges through the realm of ideas with brilliant ingenuity, designing new systems of thought and dismantling old structures with ruthless mental clarity.',
  },
  'Queen of Swords': {
    rank: 'Queen', suit: 'swords',
    keywords: ['Perception', 'Observation', 'Individuality', 'Grace'],
    description: 'The Watery expression of Air — the observer who sees beneath the surface. She wields the sword of discernment with graceful precision, perceiving truth through keen observation and unflinching intellectual honesty.',
  },
  'King of Swords': {
    rank: 'King', suit: 'swords',
    keywords: ['Justice', 'Authority', 'Diligence', 'Strategy'],
    description: 'The Fiery expression of Air — the strategic commander of intellectual force. He embodies justice tempered by wisdom, authority exercised through reason, and the diligent, strategic mind that governs with clarity and purpose.',
  },

  // ── Disks ─────────────────────────────────────────────────────────────────
  'Princess of Disks': {
    rank: 'Princess', suit: 'disks',
    keywords: ['Generosity', 'Kindness', 'Diligence', 'Nurture'],
    description: 'The Earthly expression of Earth — the pregnant maiden who brings forth new life. She embodies the generous, nurturing force of nature itself: patient, kind, diligent, and deeply connected to the material world\'s cycles of growth.',
  },
  'Prince of Disks': {
    rank: 'Prince', suit: 'disks',
    keywords: ['Increase', 'Competence', 'Steadfastness', 'Reliability'],
    description: 'The Airy expression of Earth — the steady builder who transforms vision into tangible reality. He advances methodically with reliable competence, increasing material resources through patient, persistent effort.',
  },
  'Queen of Disks': {
    rank: 'Queen', suit: 'disks',
    keywords: ['Ambition', 'Practicality', 'Nurturing', 'Abundance'],
    description: 'The Watery expression of Earth — the throne of material abundance and quiet power. She nurtures with practical wisdom, building prosperity through grounded ambition and the deep understanding of nature\'s rhythms.',
  },
  'King of Disks': {
    rank: 'King', suit: 'disks',
    keywords: ['Endurance', 'Patience', 'Mastery', 'Industry'],
    description: 'The Fiery expression of Earth — the master of the material realm in all its fullness. He embodies enduring patience, industrious mastery, and the quiet, immovable strength of one who has built an empire stone by stone.',
  },
}

// ─── Helper functions ────────────────────────────────────────────────────────

export function getMinorCard(name: string): MinorCardData | undefined {
  return MINOR_ARCANA[name]
}

export function getCourtCard(name: string): CourtCardData | undefined {
  return COURT_CARDS[name]
}
