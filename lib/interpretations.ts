export interface NumberInterpretation {
  meaning: string
  positive: string[]
  shadow: string[]
  advice: string
  career: string
  love: string
  money: string
  archetype: string
}

export const INTERPRETATIONS: Record<number, NumberInterpretation> = {
  1: {
    archetype: "The Visionary Leader",
    meaning: "The energy of initiation, independence, and the pioneer. It represents the drive to lead and create something new.",
    positive: ["Leadership", "Originality", "Strong Will", "Independent"],
    shadow: ["Aggression", "Selfishness", "Insecurity", "Impatience"],
    advice: "Learn to lead with heart. True leadership comes from inspiring others, not just giving orders.",
    career: "Entrepreneurship, leadership positions, roles requiring innovation and risk-taking.",
    love: "Needs independence; thrives with partners who respect their drive and autonomy.",
    money: "Natural at attracting wealth through bold initiatives, but must watch out for impulsive spending.",
  },
  2: {
    archetype: "The Intuitive Diplomat",
    meaning: "The force of cooperation, harmony, and sensitivity. It represents the ability to sense others' needs and create balance.",
    positive: ["Diplomacy", "Empathy", "Patience", "Cooperation"],
    shadow: ["Over-sensitivity", "Indecision", "Passive-aggression", "Dependency"],
    advice: "Don't lose yourself in others' needs. Your sensitivity is a gift; use it to heal, not to hide.",
    career: "Diplomacy, mediation, psychology, social work, or supporting roles in creative projects.",
    love: "The ultimate partner; deeply devoted and romantic, but needs emotional security.",
    money: "Prosperity comes through partnerships and careful, steady saving.",
  },
  3: {
    archetype: "The Creative Communicator",
    meaning: "The vibration of joy, self-expression, and communication. It represents the ability to inspire and bring light to the world.",
    positive: ["Creativity", "Optimism", "Wit", "Expressive"],
    shadow: ["Scattered focus", "Superficiality", "Moodiness", "Exaggeration"],
    advice: "Focus your creative energy. Don't let your talents dissipate into too many directions at once.",
    career: "Writing, performing arts, public speaking, marketing, or any creative endeavor.",
    love: "Vibrant and playful; needs a partner who values their creativity and social nature.",
    money: "Money often flows easily but can vanish just as fast; discipline is key.",
  },
  4: {
    archetype: "The Architect of Form",
    meaning: "The energy of discipline, hard work, and building foundations. It represents the structure that makes ideas reality.",
    positive: ["Discipline", "Reliability", "Logic", "Efficiency"],
    shadow: ["Rigidity", "Stubbornness", "Narrow-mindedness", "Joylessness"],
    advice: "Leave room for play. Structure is necessary, but don't let it become a cage.",
    career: "Engineering, management, construction, accounting, or specialized craftsmanship.",
    love: "Extremely loyal and stable; they express love through actions and providing security.",
    money: "Wealth is built slowly and surely through consistent effort and solid investments.",
  },
  5: {
    archetype: "The Free-Spirited Explorer",
    meaning: "The vibration of freedom, change, and adaptability. It represents the drive to experience everything life has to offer.",
    positive: ["Versatility", "Adventurous", "Charismatic", "Adaptable"],
    shadow: ["Restlessness", "Irresponsibility", "Indulgence", "Lack of focus"],
    advice: "Freedom requires discipline. Without a target, your energy is just motion without progress.",
    career: "Travel, sales, journalism, consulting, or any job with variety and movement.",
    love: "Needs excitement and space; thrives with partners who are equally adventurous.",
    money: "Finances can be volatile; diversify and avoid 'get-rich-quick' schemes.",
  },
  6: {
    archetype: "The Nurturing Guardian",
    meaning: "The frequency of responsibility, service, and domestic harmony. It represents the urge to care for others and create beauty.",
    positive: ["Nurturing", "Responsible", "Protective", "Artistic"],
    shadow: ["Martyrdom", "Interference", "Self-righteousness", "Worry"],
    advice: "You can't pour from an empty cup. Take care of yourself as well as you take care of others.",
    career: "Teaching, counseling, interior design, hospitality, or healthcare.",
    love: "The heart of the home; deeply caring, but must avoid becoming controlling or over-protective.",
    money: "Stable; often benefits from family or home-related businesses.",
  },
  7: {
    archetype: "The Mystic Seeker",
    meaning: "The energy of introspection, spiritual depth, and analysis. It represents the quest for truth and wisdom.",
    positive: ["Intellectual", "Intuitive", "Analytical", "Spiritual"],
    shadow: ["Isolation", "Suspicion", "Skepticism", "Aloofness"],
    advice: "Share your wisdom. Don't get so lost in your inner world that you disconnect from reality.",
    career: "Research, philosophy, data analysis, technology, or spiritual guidance.",
    love: "Needs deep mental and spiritual connection; values solitude even when in a relationship.",
    money: "Not usually driven by money, but can attract it through expertise and specialized knowledge.",
  },
  8: {
    archetype: "The Power Manifestor",
    meaning: "The vibration of authority, material success, and karmic balance. It represents the mastery of the physical world.",
    positive: ["Ambitious", "Authoritative", "Strategic", "Self-confident"],
    shadow: ["Greed", "Manipulation", "Short temper", "Authoritarianism"],
    advice: "Balance material power with spiritual purpose. True success is what you build for everyone.",
    career: "Business, finance, law, real estate, or high-level management.",
    love: "Powerful and protective; looks for a 'power partner' who shares their ambition.",
    money: "Master of money; great at generating wealth but must guard against obsession with status.",
  },
  9: {
    archetype: "The Universal Humanitarian",
    meaning: "The energy of completion, compassion, and global awareness. It represents the transition from the personal to the universal.",
    positive: ["Compassionate", "Idealistic", "Selfless", "Tolerant"],
    shadow: ["Emotional distress", "Disconnect", "Resentment", "Drifting"],
    advice: "Let go of the past. Your mission is to serve humanity; don't get weighed down by personal grievances.",
    career: "Non-profits, coaching, law, environmental causes, or international relations.",
    love: "Deeply idealistic; seeks a soulmate who shares their vision for a better world.",
    money: "Money often comes indirectly through serving a higher purpose or selfless work.",
  },
  11: {
    archetype: "The Intuitive Illuminator",
    meaning: "The Master Number of intuition and spiritual insight. It represents a bridge between realities.",
    positive: ["Highly Intuitive", "Inspirational", "Visionary", "Sensitive"],
    shadow: ["Nervous tension", "Arrogance", "Impracticality", "Overwhelmed"],
    advice: "Ground yourself. Your high vibration needs a solid physical foundation to manifest effectively.",
    career: "Psychic fields, design, media, innovation, or motivational speaking.",
    love: "Intense and soulful; needs a partner who can handle their deep sensitivity and 'otherworldliness'.",
    money: "Fluctuates with inspiration; focus on sharing your light and the rewards will follow.",
  },
  22: {
    archetype: "The Master Builder",
    meaning: "The Master Number of practical idealism. It represents the power to turn great visions into massive realities.",
    positive: ["Practical", "Visionary", "Capable", "Universal"],
    shadow: ["Crushing pressure", "Fear of failure", "Control issues", "Workaholism"],
    advice: "Don't try to go it alone. Your visions are too big for one person; build a team you trust.",
    career: "Large-scale construction, politics, global business, or environmental planning.",
    love: "Needs a partner who supports their massive goals and provides a grounded safe haven.",
    money: "Potential for great wealth, but only if managed for the greater good and not just personal gain.",
  },
  33: {
    archetype: "The Master Teacher",
    meaning: "The Master Number of selfless service and compassion. It represents the highest level of nurturing and healing.",
    positive: ["Compassionate", "Healing", "Sacrificial", "Guiding"],
    shadow: ["Over-burdened", "Martyr complex", "Emotional drain", "Perfectionism"],
    advice: "Balance service with self-preservation. You cannot heal the world if you are broken yourself.",
    career: "Universal teaching, high-level counseling, healing arts, or global humanitarianism.",
    love: "The embodiment of unconditional love; needs a partner who genuinely appreciates their sacrifice.",
    money: "Material needs are usually met when they are fully committed to their path of service.",
  }
}
