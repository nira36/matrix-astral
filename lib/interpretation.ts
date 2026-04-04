import type { NatalChartData, ZodiacSign, AspectType } from './astrology'
import { ZODIAC_ELEMENTS } from './astrology'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Interpretation {
  opening: string
  engine: string
  challenge: string
  resource: string
  evolution: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getPlanet(data: NatalChartData, name: string) {
  return data.planets.find(p => p.planet === name)
}

function getDominantPlanet(data: NatalChartData): string {
  const counts: Record<string, number> = {}
  const exclude = ['Ascendant', 'MC', 'Fortune']
  data.aspects.filter(a => a.orb <= 8).forEach(a => {
    if (!exclude.includes(a.planet1)) counts[a.planet1] = (counts[a.planet1] || 0) + 1
    if (!exclude.includes(a.planet2)) counts[a.planet2] = (counts[a.planet2] || 0) + 1
  })
  // Also weight planets in angular houses (1, 4, 7, 10)
  data.planets.forEach(p => {
    if (!exclude.includes(p.planet) && [1, 4, 7, 10].includes(p.house)) {
      counts[p.planet] = (counts[p.planet] || 0) + 2
    }
  })
  let best = 'Sun', max = 0
  Object.entries(counts).forEach(([k, v]) => { if (v > max) { max = v; best = k } })
  return best
}

function getElementBalance(data: NatalChartData) {
  const els = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  const skip = ['Ascendant', 'MC', 'North Node', 'Lilith', 'Chiron', 'Fortune']
  data.planets.filter(p => !skip.includes(p.planet)).forEach(p => { els[ZODIAC_ELEMENTS[p.sign]]++ })
  const sorted = Object.entries(els).sort((a, b) => b[1] - a[1])
  return { dominant: sorted[0][0] as keyof typeof els, dominantCount: sorted[0][1], lacking: sorted[sorted.length - 1][0] as keyof typeof els, lackingCount: sorted[sorted.length - 1][1] }
}

function getTightestAspect(data: NatalChartData) {
  const skip = ['Ascendant', 'MC', 'Fortune', 'North Node', 'Lilith', 'Chiron']
  const filtered = data.aspects.filter(a => a.orb <= 8 && !skip.includes(a.planet1) && !skip.includes(a.planet2))
  return filtered.length > 0 ? filtered[0] : null // already sorted by orb
}

function getHouseTheme(house: number): string {
  const themes: Record<number, string> = {
    1: 'identity and self-image',
    2: 'resources, money, and self-worth',
    3: 'communication, learning, and everyday thinking',
    4: 'roots, family, and emotional foundations',
    5: 'creativity, pleasure, and self-expression',
    6: 'daily work, health, and service',
    7: 'relationships and partnerships',
    8: 'transformation, shared resources, and crisis',
    9: 'philosophy, travel, and meaning-making',
    10: 'career, public role, and ambition',
    11: 'community, ideals, and future vision',
    12: 'the unconscious, solitude, and hidden patterns',
  }
  return themes[house] || 'life experience'
}

// ─── Template fragments ─────────────────────────────────────────────────────

const SUN_SIGN_CORE: Record<ZodiacSign, string> = {
  Aries: 'Your core identity runs on action. You exist by initiating, competing, pushing forward. Stillness feels like death to you — which is exactly why you need to learn it.',
  Taurus: 'Your core identity is anchored in the senses. You know who you are through what you build, hold, and refuse to let go of. Stability is your oxygen, but rigidity is the trap.',
  Gemini: 'Your core identity lives in the mind. You process the world through language, connections, and restless curiosity. The risk: you know everything about everything except what you actually feel.',
  Cancer: 'Your core identity is rooted in emotion and memory. You know yourself through what you protect and nurture. Your strength is empathy; your prison is the past.',
  Leo: 'Your core identity expresses through creation. You need to be seen, to radiate, to matter. When this is healthy, you are generous and magnetic. When wounded, you perform instead of living.',
  Virgo: 'Your core identity is refined through analysis and service. You know yourself by what you improve. Your precision is a gift, but your self-criticism can become a cage.',
  Libra: 'Your core identity mirrors itself in others. You know who you are through relationship. The elegance is real, but so is the terror of being alone with yourself.',
  Scorpio: 'Your core identity is forged in crisis. You know yourself through what you survive, what you control, what you refuse to forget. Intensity is your language — moderation is not.',
  Sagittarius: 'Your core identity expands through meaning. You need a horizon, a belief, a direction. The vision is genuinely wide, but running forward is also how you avoid looking inward.',
  Capricorn: 'Your core identity is earned through mastery. You know yourself by what you achieve and endure. The discipline is real, but so is the loneliness you pretend does not exist.',
  Aquarius: 'Your core identity is defined by difference. You know yourself through what you challenge and refuse to accept. Original thinking is your gift; emotional detachment is the cost.',
  Pisces: 'Your core identity dissolves into everything around it. You know yourself through what you transcend and absorb. The empathy is oceanic, but knowing where you end and others begin is the lifelong work.',
}

const ASC_MASK: Record<ZodiacSign, string> = {
  Aries: 'The world meets you as direct, energetic, impatient. You walk into rooms like you own them — even when you are terrified inside.',
  Taurus: 'The world meets you as calm, solid, unhurried. People trust you on sight. What they do not see is the stubbornness that holds everything together underneath.',
  Gemini: 'The world meets you as curious, quick, adaptable. You charm with words before anyone gets close enough to notice the restlessness beneath.',
  Cancer: 'The world meets you as gentle, cautious, protective. You feel the room before you speak. The shell is real — what is inside is more intense than anyone expects.',
  Leo: 'The world meets you as warm, confident, impossible to ignore. You command attention without trying. The question is whether you believe your own performance.',
  Virgo: 'The world meets you as precise, competent, understated. You edit yourself before others see you. The modesty is real; the anxiety behind it is more real.',
  Libra: 'The world meets you as graceful, diplomatic, pleasant. You make everything look easy. What no one sees is the paralysis that comes when you must choose sides.',
  Scorpio: 'The world meets you as intense, magnetic, guarded. People feel your presence before you speak. You control the first impression — and most impressions after that.',
  Sagittarius: 'The world meets you as open, enthusiastic, restless. You are the person who always seems to be going somewhere. Staying put is the challenge nobody warns you about.',
  Capricorn: 'The world meets you as serious, composed, older than your years. You project competence. What you hide is how much you need warmth you will not ask for.',
  Aquarius: 'The world meets you as unusual, detached, intellectually intense. You stand apart from the crowd — sometimes by choice, sometimes because you forgot how to stand inside it.',
  Pisces: 'The world meets you as soft, dreamy, slightly elsewhere. People project onto you because your boundaries are invisible. Learning to say no is your most radical act.',
}

const MOON_NEED: Record<ZodiacSign, string> = {
  Aries: 'emotionally, you react fast and hot. Your feelings arrive like fire — intense but brief. You need independence even in intimacy, and you confuse anger with vulnerability more often than you admit.',
  Taurus: 'emotionally, you need stability above all. Physical comfort, routine, the same person beside you every morning. When that security is threatened, something primal and possessive wakes up.',
  Gemini: 'emotionally, you process through thinking. You talk about feelings rather than feeling them. This is both your defense and your limitation — the heart needs silence sometimes.',
  Cancer: 'emotionally, you are deep, retentive, nourishing. You remember every kindness and every wound. Your care for others is genuine, but it also keeps you from facing your own emptiness.',
  Leo: 'emotionally, you need to feel special. Not in a superficial way — you need someone to see the real you and choose you anyway. Indifference wounds you more than hostility ever could.',
  Virgo: 'emotionally, you serve rather than express. You show love through practical care, through fixing things, through showing up. The anxiety underneath is the price of needing everything to be right.',
  Libra: 'emotionally, you seek harmony at all costs. You absorb the mood of every room. Conflict sends you into shutdown, which means your real feelings often go underground until they explode.',
  Scorpio: 'emotionally, you are all or nothing. You love with total loyalty or cut with surgical precision. The vulnerability you hide so well is the most powerful thing about you.',
  Sagittarius: 'emotionally, you need meaning more than comfort. You can survive almost anything as long as it makes sense. Your escape route from difficult feelings is always philosophy or motion.',
  Capricorn: 'emotionally, you contain. You feel deeply but express sparingly. The maturity came early, probably too early, and the part of you that needed tenderness learned to survive without it.',
  Aquarius: 'emotionally, you observe rather than participate. You understand feelings intellectually but living them is another language entirely. The detachment protects you — and isolates you.',
  Pisces: 'emotionally, you absorb everything. You are a sponge for other people\'s pain, beauty, chaos. The compassion is real; the inability to protect yourself is the price.',
}

const MOON_HOUSE: Record<number, string> = {
  1: 'With your Moon in the first house, your emotions are written on your face. You cannot hide what you feel — and learning that this is a strength, not a weakness, takes time.',
  2: 'With your Moon in the second house, emotional security and material security are the same thing. When your bank account is unstable, your inner world destabilizes too.',
  3: 'With your Moon in the third house, you process emotions through words and communication. You need to talk things out — silence makes feelings grow teeth.',
  4: 'With your Moon in the fourth house, home is everything. Your roots, your family, your private inner world — this is where your emotional truth lives, for better or worse.',
  5: 'With your Moon in the fifth house, you need creative self-expression like oxygen. Romance, art, play — these are not luxuries for you, they are emotional survival.',
  6: 'With your Moon in the sixth house, routine is your emotional anchor. You feel safe when life is organized. When the structure breaks, anxiety fills the gaps immediately.',
  7: 'With your Moon in the seventh house, you find yourself through others. Relationships are not optional — they are where your emotional identity takes shape.',
  8: 'With your Moon in the eighth house, your emotional life runs deep and intense. You need intimacy that goes all the way down, and surface-level connections leave you starving.',
  9: 'With your Moon in the ninth house, you feel at home in ideas, travel, and expanded horizons. Routine without meaning drains you faster than anything else.',
  10: 'With your Moon in the tenth house, your emotional needs and your ambitions are entangled. Achievement feeds you emotionally — which means failure hits your core, not just your career.',
  11: 'With your Moon in the eleventh house, you find emotional safety in community and shared ideals. Belonging matters more than you admit.',
  12: 'With your Moon in the twelfth house, your emotional life operates mostly beneath the surface. You feel everything but struggle to name it. Solitude recharges you — but too much becomes hiding.',
}

const DOMINANT_PLANET: Record<string, string> = {
  Sun: 'The Sun dominates your chart, which means identity is your central theme. Everything orbits around the question: who am I, and does the world see me as I truly am?',
  Moon: 'The Moon dominates your chart. Your emotional intelligence is your sharpest tool — and your deepest vulnerability. You navigate life through feeling first, logic second.',
  Mercury: 'Mercury dominates your chart. Your mind is the command center. You think faster than most people talk, and communication is both your weapon and your art form.',
  Venus: 'Venus dominates your chart. Relationships, beauty, and pleasure are not decorations in your life — they are the architecture. How you love and what you value define everything.',
  Mars: 'Mars dominates your chart. You are built for action, conflict, and forward motion. Passivity is not in your vocabulary. The challenge is learning when to fight and when to wait.',
  Jupiter: 'Jupiter dominates your chart. You think big, aim high, and believe more is always possible. The optimism is real — and so is the tendency to overextend and avoid limits.',
  Saturn: 'Saturn dominates your chart. You were born old. Responsibility, structure, and discipline are your natural language. The question is whether you ever let yourself be soft.',
  Uranus: 'Uranus dominates your chart. You are wired for disruption. Convention bores you, predictability suffocates you. The originality is genuine — the instability is the other side of the coin.',
  Neptune: 'Neptune dominates your chart. You live between worlds — the real one and the one you feel should exist. The imagination is extraordinary; the risk is losing touch with solid ground.',
  Pluto: 'Pluto dominates your chart. Transformation is not optional for you — it is the recurring theme. You have an instinct for power, depth, and the things people prefer not to look at.',
}

const ASPECT_CHALLENGE: Record<string, Record<AspectType, string>> = {
  'Sun-Saturn': {
    Conjunction: 'Sun conjunct Saturn: you carry authority and weight, but the pressure to perform never lets up. You learned early that approval must be earned — unlearning that is the real work.',
    Opposition: 'Sun opposite Saturn: other people seem to hold the power you want. Authority figures challenge you. The lesson: the limitations you fight outside are reflections of inner walls.',
    Square: 'Sun square Saturn: there is a fundamental friction between who you are and what the world demands. Self-doubt is the invisible enemy. Every achievement feels harder than it should.',
    Trine: 'Sun trine Saturn: discipline comes naturally to you. You build things that last. The danger is mistaking endurance for happiness.',
    Sextile: 'Sun sextile Saturn: you have access to structure and patience when you need it. The balance between ambition and self-expression works — when you choose to use it.',
  },
  'Moon-Pluto': {
    Conjunction: 'Moon conjunct Pluto: your emotional life is volcanic. You feel everything at maximum intensity. Intimacy is transformative — and sometimes destructive.',
    Opposition: 'Moon opposite Pluto: your closest relationships are power struggles in disguise. You attract intensity because you carry it. The lesson: control is not the same as safety.',
    Square: 'Moon square Pluto: there is an obsessive quality to your emotional life. Old wounds — especially family wounds — replay until you consciously break the pattern.',
    Trine: 'Moon trine Pluto: emotional depth is your natural state. You process crises with a resilience others envy. The gift is regeneration; do not use it to avoid grief.',
    Sextile: 'Moon sextile Pluto: you have access to emotional power without being overwhelmed by it. Transformation is available — but only when you choose to go deep.',
  },
  'Venus-Mars': {
    Conjunction: 'Venus conjunct Mars: desire and affection are fused in you. Passion runs high in everything — love, art, conflict. The intensity is magnetic but exhausting.',
    Opposition: 'Venus opposite Mars: what you want and what you need pull in opposite directions. Relationships oscillate between desire and frustration. The balance is the work.',
    Square: 'Venus square Mars: attraction and aggression get tangled. You are drawn to what is complicated, and simplicity in love bores you. This is exciting — and expensive.',
    Trine: 'Venus trine Mars: desire and affection flow together naturally. You attract what you want without force. The ease can make you passive — push yourself when it matters.',
    Sextile: 'Venus sextile Mars: the dance between giving and taking works when you pay attention. Relationships have natural momentum — use it instead of overthinking.',
  },
  'Mars-Pluto': {
    Conjunction: 'Mars conjunct Pluto: your willpower is extraordinary, almost frightening. When you want something, nothing stops you. The question is whether your force creates or destroys.',
    Opposition: 'Mars opposite Pluto: power struggles are a recurring pattern. You meet people who reflect your own need to dominate. The real battle is internal.',
    Square: 'Mars square Pluto: there is a deep, compressed rage in your system. It can fuel incredible achievement — or blow up relationships. Channeling it consciously is non-negotiable.',
    Trine: 'Mars trine Pluto: you act with power and purpose. When you commit, the follow-through is relentless. Others sense the force behind your actions and either trust it or fear it.',
    Sextile: 'Mars sextile Pluto: strategic power is available when you need it. You know when to push and when to wait. The instinct for leverage is sharp — use it ethically.',
  },
  'Mercury-Neptune': {
    Conjunction: 'Mercury conjunct Neptune: your mind is imaginative but imprecise. You see patterns others miss — and sometimes patterns that are not there. Trust your intuition, but verify your facts.',
    Opposition: 'Mercury opposite Neptune: you can be deceived by others or by your own wishful thinking. The imagination is powerful; reality-testing is the skill to develop.',
    Square: 'Mercury square Neptune: confusion between what is real and what is wished is a recurring theme. Creative brilliance and mental fog live side by side.',
    Trine: 'Mercury trine Neptune: intuition and intellect collaborate beautifully. You grasp subtleties others miss. The artistic and spiritual mind is strong — ground it when making decisions.',
    Sextile: 'Mercury sextile Neptune: imaginative thinking is accessible without losing clarity. You can translate the invisible into words when you try.',
  },
}

const ELEMENT_DOMINANT: Record<string, string> = {
  Fire: 'Your dominant element is Fire. Initiative, courage, and self-assertion come naturally. You lead with energy and often inspire others into action. The risk is burnout — you run on a fuel that does not refill on its own.',
  Earth: 'Your dominant element is Earth. You are practical, grounded, and oriented toward tangible results. Abstract ideas without concrete application bore you. The risk is stagnation — when "solid" becomes "stuck."',
  Air: 'Your dominant element is Air. You live in the world of ideas, connections, and communication. Your mind moves fast and makes associations others cannot see. The risk is detachment — thinking about life instead of living it.',
  Water: 'Your dominant element is Water. You navigate by feeling, intuition, and emotional intelligence. You understand people at a depth that is sometimes uncomfortable. The risk is drowning in emotions that are not yours.',
}

const ELEMENT_LACKING: Record<string, string> = {
  Fire: 'You are low in Fire, which means initiative and raw self-assertion do not come easily. You may hesitate where others charge forward. This is not weakness — it is a different kind of strength that takes longer to recognize.',
  Earth: 'You are low in Earth, which means grounding and practical follow-through require conscious effort. Ideas come easily; making them real is harder. Building structure is your developmental edge.',
  Air: 'You are low in Air, which means intellectual detachment and objectivity do not come naturally. You feel before you think, and stepping back to analyze requires deliberate effort.',
  Water: 'You are low in Water, which means emotional access and empathetic connection require work. You may appear cold when you are actually overwhelmed. Learning to feel without drowning is the assignment.',
}

const NODE_SIGN: Record<ZodiacSign, string> = {
  Aries: 'Your North Node in Aries says: the growth direction is toward independence, initiative, and self-assertion. You are learning to put yourself first — not selfishly, but as an act of integrity. The past pattern was merging with others; the future asks you to stand alone when necessary.',
  Taurus: 'Your North Node in Taurus says: the growth direction is toward stability, self-reliance, and trusting your own values. You are learning to build rather than destroy. The past pattern was crisis and intensity; the future asks for patience.',
  Gemini: 'Your North Node in Gemini says: the growth direction is toward curiosity, communication, and mental flexibility. You are learning to ask questions instead of declaring answers. The past pattern was dogma; the future is dialogue.',
  Cancer: 'Your North Node in Cancer says: the growth direction is toward vulnerability, emotional honesty, and allowing yourself to need people. The past pattern was control and self-sufficiency; the future asks you to soften.',
  Leo: 'Your North Node in Leo says: the growth direction is toward creative self-expression and personal visibility. You are learning to shine on your own rather than hiding in the group. The future asks courage from the heart.',
  Virgo: 'Your North Node in Virgo says: the growth direction is toward practical service, discernment, and grounded contribution. You are learning that the details matter as much as the vision.',
  Libra: 'Your North Node in Libra says: the growth direction is toward partnership, compromise, and seeing through others\' eyes. You are learning that strength includes the ability to yield.',
  Scorpio: 'Your North Node in Scorpio says: the growth direction is toward depth, transformation, and emotional truth. You are learning to let go of security in favor of authenticity.',
  Sagittarius: 'Your North Node in Sagittarius says: the growth direction is toward meaning, expansion, and trusting in something larger. You are learning to leap before all the data is in.',
  Capricorn: 'Your North Node in Capricorn says: the growth direction is toward responsibility, mastery, and building something in the real world. You are learning that discipline is a form of love.',
  Aquarius: 'Your North Node in Aquarius says: the growth direction is toward independence, innovation, and serving the collective. You are learning to value freedom over comfort.',
  Pisces: 'Your North Node in Pisces says: the growth direction is toward surrender, compassion, and trusting the unknown. You are learning that control is an illusion — and letting go is the bravest act.',
}

// ─── Bridge phrases (connect sun + ascendant) ───────────────────────────────

function bridgeSunAsc(sunEl: string, ascEl: string): string {
  if (sunEl === ascEl) return 'Since both your core and your mask share the same element, what you show and what you are align closely. People see the real you more than most — which is either a relief or terrifying.'
  const key = `${sunEl}-${ascEl}`
  const bridges: Record<string, string> = {
    'Fire-Earth': 'Your inner fire is filtered through an earthy exterior. People see you as more grounded than you feel inside. The impulsiveness is real — you just hide it better than they expect.',
    'Fire-Air': 'Your inner fire is amplified by an airy presentation. You seem even more dynamic than you are, which opens doors — but sometimes promises more energy than you actually have.',
    'Fire-Water': 'Your inner fire is softened by a watery exterior. People underestimate your intensity because you appear sensitive or receptive. They figure it out eventually.',
    'Earth-Fire': 'Your inner stability is cloaked in fiery energy. People expect boldness and get surprised by your patience. You are more strategic than you look.',
    'Earth-Air': 'Your inner practicality is wrapped in intellectual charm. People think you are lighter than you are. Underneath the conversation, you are always calculating the real cost.',
    'Earth-Water': 'Your inner groundedness is veiled by emotional sensitivity. People see the feelings first and miss the rock underneath. You are more resilient than anyone gives you credit for.',
    'Air-Fire': 'Your mental nature is presented through a fiery mask. People see confidence and energy; underneath, the mind is always analyzing. You think faster than you act — even when it looks opposite.',
    'Air-Earth': 'Your mental agility is grounded by an earthy exterior. People trust you because you seem reliable, but your mind is racing through possibilities they cannot see.',
    'Air-Water': 'Your intellectual nature is softened by emotional receptivity on the surface. People approach you expecting empathy and get sharp analysis. The combination is disorienting and effective.',
    'Water-Fire': 'Your deep emotional life is masked by an energetic, assertive exterior. People see the fire first and are shocked when the depth surfaces. You feel more than you will ever show.',
    'Water-Earth': 'Your emotional depth is filtered through a practical, steady exterior. You seem more collected than you feel. The competence is real; so is the ocean underneath.',
    'Water-Air': 'Your emotional nature is disguised by intellectual detachment on the surface. People think you are thinking when you are actually feeling. The mask works — until it does not.',
  }
  return bridges[key] || 'The combination of your inner nature and outer presentation creates a dynamic tension that makes you harder to read than most people.'
}

// ─── Main generator ─────────────────────────────────────────────────────────

export function generateInterpretation(data: NatalChartData): Interpretation {
  const sun = getPlanet(data, 'Sun')!
  const moon = getPlanet(data, 'Moon')!
  const asc = getPlanet(data, 'Ascendant')!
  const node = getPlanet(data, 'North Node')
  const dominant = getDominantPlanet(data)
  const elBal = getElementBalance(data)
  const tightest = getTightestAspect(data)

  const sunEl = ZODIAC_ELEMENTS[sun.sign]
  const ascEl = ZODIAC_ELEMENTS[asc.sign]

  // ── Opening ──
  const opening = `You are a ${sun.sign} Sun with ${asc.sign} rising. ${bridgeSunAsc(sunEl, ascEl)} Your Sun sits in the ${getOrdinal(sun.house)} house — the domain of ${getHouseTheme(sun.house)}. This is where your identity takes shape, where the question "who am I" gets its most concrete answer.`

  // ── Engine (Moon + dominant planet) ──
  const moonText = MOON_NEED[moon.sign]
  const moonHouseText = MOON_HOUSE[moon.house] || ''
  const domText = DOMINANT_PLANET[dominant] || `${dominant} plays a central role in your chart, connecting multiple areas of your life into a single driving theme.`
  const engine = `${ASC_MASK[asc.sign]}\n\nUnderneath the surface, ${moonText} ${moonHouseText}\n\n${domText}`

  // ── Challenge (tightest hard aspect) ──
  let challenge = ''
  if (tightest) {
    const pairKey1 = `${tightest.planet1}-${tightest.planet2}`
    const pairKey2 = `${tightest.planet2}-${tightest.planet1}`
    const templates = ASPECT_CHALLENGE[pairKey1] || ASPECT_CHALLENGE[pairKey2]
    if (templates && templates[tightest.type]) {
      challenge = templates[tightest.type]
    } else {
      challenge = generateGenericAspect(tightest)
    }
    challenge += `\n\nThis aspect has an orb of just ${tightest.orb}° — tight enough to be a defining signature. It is not something you grow out of. It is something you learn to work with.`
  } else {
    challenge = 'Your chart shows no extremely tight aspects between major planets, which means your tensions are distributed rather than concentrated. The challenge is subtle: nothing screams for attention, so the quiet dysfunctions can persist unchecked.'
  }

  // ── Resource (dominant element) ──
  const resource = `${ELEMENT_DOMINANT[elBal.dominant]}\n\n${elBal.lackingCount <= 1 ? ELEMENT_LACKING[elBal.lacking] : ''}`

  // ── Evolution (North Node) ──
  let evolution = ''
  if (node) {
    evolution = NODE_SIGN[node.sign]
    evolution += ` The Node sits in your ${getOrdinal(node.house)} house, which means this growth specifically manifests through ${getHouseTheme(node.house)}. Pay attention to what makes you uncomfortable in this area — that is where the development lives.`
  } else {
    evolution = 'Your path of evolution is written in the tension between what comes easily and what requires effort. The chart does not give you a destination — it gives you a direction. Follow the discomfort.'
  }

  return { opening, engine, challenge, resource, evolution }
}

// ─── Utility ────────────────────────────────────────────────────────────────

function getOrdinal(n: number): string {
  const ords = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth']
  return ords[n] || `${n}th`
}

function generateGenericAspect(asp: { planet1: string; planet2: string; type: AspectType; orb: number }): string {
  const tension: Record<AspectType, string> = {
    Conjunction: `${asp.planet1} fused with ${asp.planet2}: these two energies are merged in you. You cannot separate them. The power is concentration — the blind spot is tunnel vision.`,
    Opposition: `${asp.planet1} opposing ${asp.planet2}: these two forces pull you in opposite directions. Other people often embody the side you deny. Integration requires acknowledging both.`,
    Square: `${asp.planet1} squared with ${asp.planet2}: there is persistent friction between these two drives. Neither will back down. The tension generates energy — what you do with it determines whether it builds or breaks.`,
    Trine: `${asp.planet1} trine ${asp.planet2}: these energies flow together with ease. The gift is natural talent. The danger is coasting on what comes easily instead of pushing further.`,
    Sextile: `${asp.planet1} sextile ${asp.planet2}: these energies cooperate when activated. The potential is there — but unlike a trine, a sextile requires conscious effort to access its benefits.`,
  }
  return tension[asp.type]
}
