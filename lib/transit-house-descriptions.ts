// ─── Transit planet → natal house descriptions ──────────────────────────────
// Each entry describes the energetic theme when a transiting planet moves
// through one of your natal houses. Same planet × house = same description,
// but the *combination* a person sees is unique to their chart at any moment.
//
// Coverage: 10 traditional planets (Sun → Pluto) × 12 houses = 120 entries.
// Personal/fast group: Sun, Moon, Mercury, Venus, Mars, Jupiter
// Long-term group:     Saturn, Uranus, Neptune, Pluto

export type TransitPlanetKey =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter'
  | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'

export const FAST_TRANSIT_PLANETS: TransitPlanetKey[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter',
]
export const SLOW_TRANSIT_PLANETS: TransitPlanetKey[] = [
  'Saturn', 'Uranus', 'Neptune', 'Pluto',
]

const ORDINAL = [
  '', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth',
  'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth',
]

export function houseOrdinal(h: number): string {
  return ORDINAL[h] ?? `${h}th`
}

// House index 1-12. Each planet object indexes house numbers to a
// long-form description (2-4 sentences).
type Descriptions = Record<TransitPlanetKey, Record<number, string>>

export const TRANSIT_HOUSE_DESCRIPTIONS: Descriptions = {
  // ─── SUN ───────────────────────────────────────────────────────────────────
  Sun: {
    1: "The spotlight turns on you. For the next few weeks your vitality, presence and personal initiative are amplified, people notice you more easily, and you have natural permission to start something that centers your own needs. It is the strongest annual window for personal renewal: cut your hair, change your image, launch the project that has your name on it. Just be careful not to mistake confidence for impatience with everyone else.",
    2: "Energy flows toward what you value, own and earn. This is a good window to look honestly at your finances, take stock of possessions, and ask whether your spending actually reflects who you are. Self-worth and material worth are linked here, gains in one tend to support the other. Avoid impulse purchases that are really attempts to feel more secure.",
    3: "Your mind is busy and your social radius widens. Conversations, short trips, errands, calls and messages multiply, and you may run into siblings, neighbors or old classmates. It is an excellent moment for learning, writing, teaching or any task that depends on clear communication. Watch for mental scatter, too many open tabs at once.",
    4: "The current pulls you back home. You will feel the urge to nest, take care of family, sort out a domestic issue or finally tackle the repair you have been postponing. Emotional roots, especially the relationship with a parent, come into focus and may need attention. Rest more than usual; this is a refilling phase, not an outward one.",
    5: "Pleasure, play and creativity are highlighted. Romance, dating, art, performance, sports and time with children all carry more charge, it is one of the most enjoyable windows of the year. Take the risk to express yourself; the audience is more receptive than usual. Just keep an eye on overspending on entertainment.",
    6: "Attention turns to work, routine, health and the small machinery of daily life. You will feel the pull to clean up your habits, fix what is broken in your schedule, and handle the unglamorous tasks you have been avoiding. It is also a good moment for a check-up or to start a new health routine. Do not exhaust yourself trying to fix everything in one push.",
    7: "Relationships move to center stage. Partners, close friends, business associates and even open enemies come into sharper focus, and your needs are best met through cooperation rather than going solo. It is a strong window for negotiations, contracts and one-on-one conversations that have been avoided. Be careful not to lose yourself in someone else's orbit.",
    8: "You are pulled into the deeper, less comfortable layers, shared resources, debts, taxes, intimacy, secrets, the things that bind you to other people. Power dynamics in close relationships will surface, and you may have to face something you have been avoiding. It is also a fertile window for inner work, therapy and transformation. Avoid making major financial moves on impulse.",
    9: "The horizon expands. You will feel restless for travel, study, foreign cultures, philosophy or anything that promises a bigger view of life. It is an excellent window to plan a trip, sign up for a course, publish, teach, or have the kind of conversations that change how you see the world. Resist becoming preachy with your new convictions.",
    10: "Your public role and career are spotlit. Authority figures notice you, and you have natural opportunities to demonstrate competence and ambition, promotions, visibility, recognition are all possible. Be deliberate about what you put your name on, because reputation moves quickly in both directions during this window. A good time for a clear, public commitment to a goal.",
    11: "Friends, groups, networks and long-range hopes come forward. You will be drawn into community projects, collaborations and gatherings, and chance encounters can lead to important alliances. It is an excellent moment to clarify your goals for the year and ask others to help you reach them. Distinguish between people who lift you and people who only drain your time.",
    12: "Energy turns inward and downward into the unconscious. You will feel less interested in the spotlight and more drawn to solitude, retreat, dreams, art, meditation and quiet processing. Things from the past may resurface to be released. Do not push for visible achievements right now, this is the closing chapter of an annual cycle, and rest is the work.",
  },

  // ─── MOON ──────────────────────────────────────────────────────────────────
  Moon: {
    1: "For a couple of days your emotional weather is on the surface and visible to others. You may feel more sensitive, instinctive and reactive than usual, trust the gut signal, but wait before acting on it. People will respond to you on a feeling level rather than a logical one.",
    2: "Your emotional security is wired to material security right now. Feelings about money, possessions and self-worth come up, you may want comfort food, comfort shopping, or simply to be reminded what you actually own. A good window to pay attention to whether your spending is feeding a feeling rather than a need.",
    3: "Your moods and your conversations are tightly linked for a couple of days. You will talk about how you feel, or text it, message it, write it down. Connections with siblings, neighbors and people in your daily orbit are colored by emotion. Be careful with what you put in writing while feelings are raw.",
    4: "You will want home, your bed, your familiar people. This is the Moon's most natural placement, so emotions run especially deep, memories, family and the past surface easily. Let yourself withdraw and recharge for a day or two; trying to push through will not work.",
    5: "Feelings come out as play, romance, creativity and the urge to be expressive. You want to be seen, enjoyed, applauded, and you are more open to flirtation, art and time with children. A good window for any creative act that needs emotion as fuel.",
    6: "Your mood is tied to whether your daily life feels orderly. A messy desk, a missed task or a small health complaint will hit harder than usual. Use the window to clean, organize and care for the body, small acts of order will visibly settle the inner weather.",
    7: "Relationships color everything you feel for a couple of days. You will be more attuned to partners and close friends, sometimes to the point of absorbing their mood as your own. A good window for honest emotional conversation; a risky one for letting someone else dictate how you feel.",
    8: "Emotions go deep and may surprise you with their intensity. Old wounds, jealousy, longing, or feelings about intimacy and shared resources can surface without warning. It is fertile ground for psychological insight if you sit with what comes up rather than acting on it.",
    9: "You will crave a bigger horizon emotionally, a trip, a teacher, a book, a long conversation about what life means. Restlessness with the everyday is normal in this window; satisfy it through learning or movement rather than a dramatic life change.",
    10: "Your feelings are visible to authority figures and the public. People in charge, boss, parent, audience, will read your mood, so manage how you show up in professional settings. A good moment to notice whether your career still feels emotionally true to you.",
    11: "You want to be among your people. Friends, groups and communities feel especially important, and you may turn to them for emotional support. A good window for honest conversations about hopes, dreams and what kind of future you actually want.",
    12: "You need quiet, retreat and inner space. Dreams are vivid, intuition is strong, and you may feel inexplicably tender or sad without knowing why. Do not crowd this window with social plans, let the unconscious do its work.",
  },

  // ─── MERCURY ───────────────────────────────────────────────────────────────
  Mercury: {
    1: "Your mind is sharp and self-focused. Ideas about who you are, how you present yourself and what you want to communicate come quickly. A good window to write your bio, pitch yourself, or finally say the thing you have been mentally rehearsing.",
    2: "Thinking turns toward money, possessions and value. You will want to crunch numbers, compare prices, plan a budget, or have a practical conversation about what something is worth. Decisions made now lean toward the cautious and grounded.",
    3: "Mercury is at home, communication, errands, short trips, learning, reading and conversations with siblings and neighbors all light up. Calls, messages and small tasks multiply. An excellent window for any work that involves words, but watch for mental overload.",
    4: "Your thoughts turn toward home, family and the past. You will want to talk about feelings rather than facts, and decisions made now are colored by emotion. Good for family conversations, sorting old papers, planning home projects, less good for cold strategic thinking.",
    5: "Creative thinking is amplified. Writing, performing, brainstorming, flirty conversations and games with children all flow well. A good window to pitch a creative idea or enjoy a witty exchange. Avoid dramatic written outbursts you cannot take back.",
    6: "The mind goes to lists, schedules, work systems and health routines. You will want to organize, fix what is inefficient, and finally answer those backlog emails. A productive window for detail-heavy tasks and for thinking carefully about diet and habits.",
    7: "Your thoughts turn toward partners, contracts and one-on-one conversations. It is one of the best windows of the year for negotiations, mediation and saying out loud what a relationship needs. Listen at least as much as you speak.",
    8: "Mental focus goes deep, research, investigation, psychology, hidden subjects, money you share with others, taxes and contracts with strings attached. A strong window for digging up what was buried, but a risky one for casual gossip about secrets.",
    9: "Your mind wants the big picture: travel plans, philosophy, long-form learning, spiritual or legal questions. A good window to take a course, write something long, plan a journey or have the kind of conversation that reframes how you think about life.",
    10: "Your thinking is turned toward career, reputation and long-term goals. Communications with authority figures carry weight; what you put in writing now is read by people who matter to your future. A strong window for a professional pitch or public statement.",
    11: "Conversations with friends, groups and collaborators light up. Brainstorming with others produces better ideas than thinking alone. A great window for planning future projects with the people you would want at your side for them.",
    12: "Your thinking is quieter, more intuitive, more dream-driven. Linear logic is harder; symbolic and creative thinking is easier. Use the window for journaling, reflection, art and sorting through what your unconscious has been trying to tell you, rather than for cold-blooded decisions.",
  },

  // ─── VENUS ─────────────────────────────────────────────────────────────────
  Venus: {
    1: "You feel attractive and others sense it. Charm, charisma and the ability to draw people in are heightened, making this one of the easiest windows of the year for a new look, a first impression, or simply being well received. Indulge in things that make you feel good in your body.",
    2: "Money, comfort and the pleasures of ownership are highlighted. You may receive a gift, find a small windfall, or simply enjoy spending on something that lasts. A good window for negotiations involving money and for treating yourself to quality rather than quantity.",
    3: "Charm flows through your words. Flirty texts, warm conversations, easy contact with siblings and neighbors, communication is the love language of this window. A nice moment for short trips with someone you enjoy.",
    4: "Love comes home. You will want to make your space beautiful, host the people you love, or simply enjoy domestic comfort. Family relationships are softer and more affectionate than usual. A good time for a small home upgrade.",
    5: "This is Venus at peak playfulness, romance, flirting, dating, art, beauty and time with children all flow easily. New attractions are likely, existing ones get warmer, and creative work is unusually inspired. Enjoy it; this window is one of the best of the year.",
    6: "Affection is shown through care, cooking for someone, fixing their thing, adjusting your routine to make them comfortable. Pleasant relationships at work are likely, and small body-care rituals feel especially good. A nice window for a grooming or wellness treat.",
    7: "Partnerships glow. New relationships can begin, existing ones get warmer, and one-on-one negotiations go more smoothly than usual. A strong window for proposals, agreements, mediations and any conversation that needs both parties to feel heard.",
    8: "Love goes deep and a little dangerous. Intimacy intensifies, and feelings about shared resources, sexuality and emotional commitment become more vivid. A favorable window for joint financial decisions and for honest conversations about what you really want from someone.",
    9: "Romance with the foreign and the unfamiliar, long-distance attractions, travel love, intellectual chemistry, the pull of a new culture or worldview. A good window for travel that includes pleasure, or for falling for a teacher or a book.",
    10: "Charm helps your career. People in authority respond favorably to you, and your public image gets a soft, attractive sheen. A good window for networking that involves enjoying yourself rather than pitching hard.",
    11: "Friendships and group connections are warm and sociable. New friends arrive easily, and existing ones feel more affectionate than usual. A nice window for parties, gatherings and putting people in touch with each other.",
    12: "Love takes a private, dreamy, sometimes secret form. You may feel pulled toward a quiet romance, an unspoken longing, or simply the pleasure of solitude with art and music. A tender window, protect it from too much noise.",
  },

  // ─── MARS ──────────────────────────────────────────────────────────────────
  Mars: {
    1: "Your physical energy and willpower are turned up. You feel ready to act, push, fight for what you want, and people will notice the heat coming off you. A strong window for starting projects you have been hesitating on, but watch for impatience and conflict.",
    2: "Energy goes into earning, defending and acquiring. You will work harder for money and feel more protective of what you own. A risky window for impulsive spending or for arguments about who paid for what.",
    3: "Your mind is sharp, fast and combative. Conversations may get more heated than intended, and you will speak before thinking more than usual. Channel the energy into productive learning, writing or short trips; avoid sending angry messages.",
    4: "Tension comes home. Family disagreements, frustrations with the living space, or restlessness in your own four walls are likely. A good window to tackle physical home projects, repairs, renovations, deep cleaning, that need force to push through.",
    5: "Desire, drive and creative passion are amplified. Romance gets more physical, sports go better, creative work has more force behind it. A great window for taking a competitive or risky creative shot, but avoid burning bridges with someone you flirted with.",
    6: "Energy pours into work and daily routine. You can get a huge amount done, but you are also more likely to fight with coworkers or push your body past its limits. A good window for hard physical work and for finally tackling a stubborn task, pace yourself.",
    7: "Conflicts in close relationships come to the surface. Old frustrations with a partner or business associate need to be aired, and they will be. Use the energy to negotiate openly rather than to attack. Open enemies may also show themselves.",
    8: "Intensity in shared resources, intimacy and hidden matters. Arguments about money, sex or power are more likely, and so are deep, transformative experiences. A strong window for cutting financial ties that are draining you.",
    9: "Restless drive for the bigger picture, travel, learning, adventure, the urge to fight for a belief. Be careful with arguments about politics, religion or philosophy; you will defend your view harder than usual. A great window for an active trip.",
    10: "Career ambition is on fire. You will push harder for a goal, but you may also clash with authority figures. A strong window for a professional initiative, but choose your battles, because reputation moves quickly when Mars is in this house.",
    11: "Energy goes into group projects, collaborations and the pursuit of long-term goals. You may take a leadership role with friends, or have a falling-out with one. A good window for organizing people around a shared mission.",
    12: "Anger and drive go underground. You may feel inexplicably irritable, tired, or pulled into hidden conflicts, and the source is often the unconscious. Use the window for solo physical work, exercise, and processing what you have been suppressing rather than for direct confrontation.",
  },

  // ─── JUPITER ───────────────────────────────────────────────────────────────
  Jupiter: {
    1: "A growth window for you personally. Confidence, optimism and opportunities for self-development arrive over the year, it is one of the best transits for starting something with your own name on it. Watch for overconfidence and physical weight gain.",
    2: "Material expansion. Income, possessions and self-worth tend to grow over this year. A favorable window for financial opportunities, investments, raises, side income, but also for spending more than you should because the supply seems to keep coming.",
    3: "Mental and social expansion. Learning, writing, communication, short trips, contacts with siblings and neighbors all flourish. A great year for a course, a publication, a teaching role, or a local project that puts you in front of more people.",
    4: "Home and family expand. You may move to a bigger place, renovate, take in a family member, or simply find that domestic life feels richer. A favorable window for real estate and for healing relationships with parents.",
    5: "Romance, creativity, children and fun all expand. New love affairs, creative breakthroughs, pregnancies and joyful self-expression are all more likely than usual. One of the most pleasant Jupiter placements, enjoy it without overdoing the indulgence.",
    6: "Work and health expand, sometimes through more responsibility, sometimes through better routines, sometimes through finally getting the right help. A favorable window for improving daily life and for jobs in service, healing or detail-oriented fields.",
    7: "Partnerships grow. Marriage, business partnerships and important one-on-one alliances are favored, and existing relationships often deepen. A strong window for legal agreements and for finding the right person to work with closely.",
    8: "Growth through shared resources and inner depth. Inheritances, joint finances, tax matters and intimate transformation are highlighted. A favorable window for therapy, deep psychological work and any partnership that involves merging money or power.",
    9: "Jupiter is at home here. Travel, higher education, philosophy, foreign cultures and spiritual growth all flourish, it is one of the most expansive years of the cycle. A great window for a long trip, a degree, publishing, or any kind of teaching.",
    10: "Career and public reputation expand. Promotions, recognition, new responsibilities and opportunities to step into a bigger role all become more likely. A strong year for ambition, set the goal high, because the wind is at your back.",
    11: "Friendships, groups and long-term hopes expand. New friends arrive, group projects flourish, and your sense of what is possible for the future gets bigger. A favorable window for joining a community that matches who you are becoming.",
    12: "Inner growth, spirituality and quiet generosity. The expansion is invisible, meditation, retreat, charity, healing, releasing what is no longer yours. A good window for therapy and for closing the chapter you have been quietly preparing to end.",
  },

  // ─── SATURN ────────────────────────────────────────────────────────────────
  Saturn: {
    1: "A long, serious phase of redefining who you are. Saturn here strips away what is not really you and forces you to take responsibility for your own life, sometimes through visible difficulty, sometimes just through a heavier sense of self. Health and energy may dip; the work is to build a stronger structure for your identity.",
    2: "A multi-year lesson in finances, values and material security. Income may feel constrained, possessions may need to be managed more carefully, and your relationship with self-worth is rebuilt from the ground up. The reward for the discipline is a far more solid foundation by the end.",
    3: "A serious phase for the mind and for communication. Learning slows down but goes deeper, conversations get more weighty, and relationships with siblings and neighbors may need work. A favorable window for long-form study and for learning to speak with more precision and authority.",
    4: "The fourth house governs home and family, so the main lesson Saturn brings during this transit will be in this area. You may need to take on more responsibility for family, repair or restructure your living situation, or face an unresolved issue with a parent. It can feel constricting, even castrating, do not fight it head-on. Stay inside your own four walls and wait for it to pass; everything passes.",
    5: "A serious phase for creativity, romance and children. Spontaneity is harder, love affairs become more weighty (and may end if they have no foundation), and creative work demands more discipline. The reward is real artistic skill or a relationship built on something more durable than chemistry.",
    6: "Work, health and daily routine become the field of the lesson. You may take on more responsibility at work, deal with a chronic health issue, or finally have to face the cost of bad habits. A demanding window, but one that builds genuine competence and physical resilience if you do the work.",
    7: "Partnerships go through a long stress test. Marriages, business partnerships and close one-on-one relationships either deepen and become more committed or reveal that they have no foundation and end. Either outcome is honest, Saturn here is the relationship's truth-teller.",
    8: "A serious phase around shared resources, intimacy and inner transformation. Debts, taxes, joint finances and inheritance matters may need careful handling, and deep psychological work is often unavoidable. Slow, demanding, and ultimately freeing if you do not run from it.",
    9: "A serious phase for beliefs, study, travel and the search for meaning. The big picture you have been carrying gets tested, and you may have to rebuild your worldview from more honest ground. A demanding window for higher education or for any teacher or guide you trust.",
    10: "Saturn at the top of the chart is the classic career test. You will be evaluated by people in authority, asked to prove competence, and given either real recognition or a public failure depending on how solidly you have built. One of the most consequential transits for long-term professional shape.",
    11: "Friendships and group connections go through a serious sorting. Some friends drift away, others become more committed; group projects ask more of you. The lesson is about which long-term hopes are actually worth your time and which were borrowed from someone else.",
    12: "A long inward phase. Saturn in the twelfth asks you to face what you have been hiding from yourself, old patterns, unconscious fears, the part of you that needs solitude to heal. It can feel isolating, but it is preparing the ground for a major new cycle the moment Saturn crosses your Ascendant.",
  },

  // ─── URANUS ────────────────────────────────────────────────────────────────
  Uranus: {
    1: "A multi-year window of personal reinvention. You will feel the urge to break free of who you used to be, sometimes through a sudden change of image, lifestyle, location or relationship. Others may say you have become unpredictable; the truth is you are finally being yourself.",
    2: "Sudden, unexpected changes around money, possessions and values. Income may become irregular, things you owned lose their hold on you, and your sense of what is actually valuable shifts. A volatile but liberating window for your relationship with the material.",
    3: "Sudden shifts in how you think, learn and communicate. New ideas, unusual subjects, surprising contacts and sudden short trips break the routine. A good window for unconventional learning and for finding your real voice, but watch for impulsive words.",
    4: "Disruption at home and in the family. Moves, renovations, sudden changes in living situation or unexpected family events are common. Your idea of what 'home' even means may change. The discomfort is the doorway to a freer foundation.",
    5: "Unexpected love affairs, sudden creative breakthroughs, unusual children-related events. Romantic chemistry tends to be electric and unpredictable, exciting, sometimes short-lived. Creative work breaks rules. Embrace the originality without burning everything down.",
    6: "Uranus brings unexpected changes to your routine and daily schedule. The reason for these changes is your subconscious desire to free yourself from routine and your wish not to be one of the crowd. If you resist changing your rituals, you may be forced to by external influences. Your work life can shake up, flexible hours, frequent job changes, freelancing, an unusual job or unusual workplace. You will need work that gives you enough freedom or you may lose motivation. Your attitudes toward health may change, for example, a new interest in alternative medicine. Yoga and other body-mind practices will help you here.",
    7: "Sudden disruption in close relationships. Existing partnerships are tested for whether they still allow both people to grow; some end abruptly, others survive in a freer form. New relationships that begin in this window are unconventional and unpredictable.",
    8: "Sudden changes around shared resources, intimacy and the deeper currents. Joint finances may shift unexpectedly, sexuality and intimacy may take a more unusual form, and old psychological patterns can crack open without warning. Liberating, sometimes disorienting.",
    9: "Sudden shifts in worldview, beliefs and direction. You may be drawn to unusual philosophies, surprise opportunities for travel or study, or simply find that what you used to believe no longer fits. A great window for breaking out of a mental cage you did not know you were in.",
    10: "Disruption in career and public role. Sudden job changes, unexpected opportunities, unconventional work paths or a complete reinvention of how you show up professionally are all common. Job security is shaky; freedom and originality are the rewards.",
    11: "Sudden shifts in friendships, groups and long-term goals. Old groups may no longer fit, new and unusual people enter your orbit, and the future you were planning may change shape entirely. A window for finding the people you actually belong with.",
    12: "Sudden insights from the unconscious. Dreams get vivid and strange, hidden patterns become visible, and old psychological structures crack quietly. The breakthroughs are mostly invisible to others but can be life-changing internally.",
  },

  // ─── NEPTUNE ───────────────────────────────────────────────────────────────
  Neptune: {
    1: "A long, dissolving phase for the sense of self. The hard edges of who you thought you were soften, and you become more sensitive, intuitive and porous to the world around you. The risk is losing yourself in fog or in someone else's projection; the gift is a deeper, more spiritual identity by the end.",
    2: "Confusion and idealism around money, possessions and self-worth. Finances become harder to track, value judgments get murky, and you may either give too much away or be deceived around money. The deeper lesson is that your worth is not measured in things.",
    3: "Thinking and communication become more intuitive, dreamy and less precise. You may find linear logic harder but creative and symbolic thinking easier. A favorable window for art, poetry, music and spiritual learning, a risky one for legal documents and small-print details.",
    4: "Neptune in this house brings confusion to family life and to relationships with relatives. You may see things through rose-tinted glasses, which prevents you from honestly assessing reality and your relationships with loved ones. Be careful, this approach can cause problems. Loved ones, especially your partner, may be frustrated by your reluctance to commit and take responsibility. You may feel tired and need more sleep than usual. The positive expression of this aspect is that you will have a rich inner life and an opportunity to reach spiritual awareness.",
    5: "Romance, creativity and children take on a dreamy, idealized quality. Love affairs may be magical or completely delusional, sometimes both. Creative work flows but needs careful editing. With children, the bond becomes more intuitive and less rule-based.",
    6: "Confusion and dissolution around work and health. Daily routine may feel meaningless, work boundaries blur, and you may be drawn to healing or service work. Physically, vague symptoms and sensitivity to substances are common. A window to listen to the body's quieter signals.",
    7: "Partnerships become idealized, dreamy and confusing. You may meet someone who feels like a soulmate or you may project a fantasy onto a partner who cannot live up to it. Important to keep your eyes open in close relationships, fog is the main risk here.",
    8: "Dissolution around shared resources, intimacy and hidden matters. Joint finances become harder to track, sexuality may take a more spiritual or escapist form, and the deeper psychological currents are stirred up. A favorable window for inner work, a risky one for trusting people with your money.",
    9: "Spiritual longing, idealistic beliefs and a pull toward the mystical or the foreign. Higher education and travel take on an enchanted quality, but discernment around teachers and gurus matters more than usual. A great window for genuine spiritual growth if you stay grounded.",
    10: "Confusion around career and public role. The path forward is less clear, ambition feels softer, and you may be drawn toward work in art, healing, spirituality or service. Reputation can be foggy too, be deliberate about how you are perceived.",
    11: "Idealism around friends, groups and the future. You may be drawn to spiritual or artistic communities, but also more vulnerable to being misled by them. The dream of what is possible expands; reality-test it before investing too much.",
    12: "Neptune is at home in the twelfth. Spiritual receptivity, dreams, intuition and the urge to retreat are all amplified. A profound window for meditation, art and healing, but also a risky one for escapism, addiction or losing yourself in fog. Protect your inner space and channel the openness consciously.",
  },

  // ─── PLUTO ─────────────────────────────────────────────────────────────────
  Pluto: {
    1: "A total transformation of your sense of self. Pluto here is one of the most powerful transits a person can experience, it strips away who you used to be and rebuilds you from the foundations. Slow, demanding, sometimes dark, and ultimately a complete rebirth into a more powerful and authentic self.",
    2: "Pluto in the second house will remind you of the need to manage your financial resources efficiently. You will reassess what you actually need in your life to feel secure. If there are things you do not need materially, it is a good moment to let go of them, sell the house, close debts, clear it out. If Pluto forms a square or opposition with personal planets, there is a real risk of financial loss. You will also need to revise your scale of moral values.",
    3: "Deep transformation of the mind and the way you communicate. Old mental patterns, beliefs absorbed from family and ways of speaking that were never really yours all get rewritten. Relationships with siblings and the immediate environment may be permanently restructured.",
    4: "Total restructuring of home, family and emotional foundations. The roots of who you are get dug up, sometimes through a literal move, sometimes through facing buried family patterns, sometimes through the death or transformation of a parent. Slow and demanding, but it builds a true foundation by the end.",
    5: "Transformation through romance, creativity and children. Love affairs go to obsessive depths and either transform you completely or end with hard truths. Creative expression becomes a vehicle for power and self-revelation. Relationships with children may force a total reckoning with your own inner child.",
    6: "Deep restructuring of work, health and daily routine. Old jobs end, old habits collapse, and the body may force changes through illness or burnout. The gift is a far more honest relationship with how you actually want to spend your days.",
    7: "Total transformation of close relationships. Marriages and partnerships go through power struggles, deep crises or complete reinvention, some end, others rebuild on much truer ground. The lesson is about power, control and what you really want from intimacy with another person.",
    8: "Pluto is at home in the eighth. Profound transformation around shared resources, intimacy, sexuality, death and the deeper psychological currents. Old psychological wounds surface for healing, joint finances may go through major shifts, and you will be asked to face what you have been hiding from. One of the most powerful and potentially liberating transits for inner life.",
    9: "Total transformation of beliefs, worldview and the search for meaning. Old philosophies get burned down, religious or political certainties are challenged, and you may rebuild your inner map from scratch. Travel and higher education during this transit can be life-changing.",
    10: "Pluto at the top of the chart restructures career and public role from the ground up. Old jobs, old reputations, old ambitions get buried, and a more powerful and authentic professional identity is built in their place. Power dynamics with authority figures are central to the lesson.",
    11: "Transformation of friendships, groups and long-term goals. Old friend circles may dissolve, new and more powerful alliances form, and the dream of the future you were carrying gets rewritten. Power dynamics within groups become visible and have to be navigated honestly.",
    12: "The deepest, quietest transformation of all. Pluto in the twelfth dredges up unconscious patterns, ancestral wounds and hidden fears for a long, slow processing. Mostly invisible to others, often heavy internally, and the preparation for a major new identity cycle when Pluto eventually crosses your Ascendant.",
  },
}
