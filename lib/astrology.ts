// ─── Types ──────────────────────────────────────────────────────────────────

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const

export type ZodiacSign = typeof ZODIAC_SIGNS[number]

export const ZODIAC_GLYPHS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

export const ZODIAC_ELEMENTS: Record<ZodiacSign, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
}

export const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  'North Node': '☊', Lilith: '⚸', Chiron: '⚷', Fortune: '⊗',
  Ascendant: 'AC', MC: 'MC',
}

export interface PlanetPosition {
  planet: string
  longitude: number    // 0-360 absolute degrees
  sign: ZodiacSign
  signDegree: number   // 0-30 within sign
  minute: number       // arc minutes
  house: number        // 1-12
  retrograde: boolean
}

export interface HouseCusp {
  house: number        // 1-12
  longitude: number    // 0-360
  sign: ZodiacSign
  degree: number
}

export type AspectType = 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile'

export interface Aspect {
  planet1: string
  planet2: string
  type: AspectType
  orb: number          // degrees of orb
  applying: boolean    // applying vs separating
}

export interface NatalChartData {
  planets: PlanetPosition[]
  houses: HouseCusp[]
  aspects: Aspect[]
  ascendantLongitude: number
  mcLongitude: number
}

// ─── Aspect definitions ─────────────────────────────────────────────────────

const ASPECT_ANGLES: { type: AspectType; angle: number; orb: number; symbol: string }[] = [
  { type: 'Conjunction', angle: 0, orb: 8, symbol: '☌' },
  { type: 'Opposition', angle: 180, orb: 8, symbol: '☍' },
  { type: 'Trine', angle: 120, orb: 8, symbol: '△' },
  { type: 'Square', angle: 90, orb: 7, symbol: '□' },
  { type: 'Sextile', angle: 60, orb: 6, symbol: '⚹' },
]

export const ASPECT_SYMBOLS: Record<AspectType, string> = {
  Conjunction: '☌', Opposition: '☍', Trine: '△', Square: '□', Sextile: '⚹',
}

export const ASPECT_COLORS: Record<AspectType, string> = {
  Conjunction: '#c4b5fd',
  Opposition: '#ef4444',
  Trine: '#3b82f6',
  Square: '#ef4444',
  Sextile: '#3b82f6',
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function longitudeToSign(lng: number): { sign: ZodiacSign; degree: number; minute: number } {
  const normalized = ((lng % 360) + 360) % 360
  const signIndex = Math.floor(normalized / 30)
  const degInSign = normalized - signIndex * 30
  const degree = Math.floor(degInSign)
  const minute = Math.round((degInSign - degree) * 60)
  return { sign: ZODIAC_SIGNS[signIndex], degree, minute }
}

function angleDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360
  if (d > 180) d = 360 - d
  return d
}

function calcAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = []
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = angleDiff(planets[i].longitude, planets[j].longitude)
      for (const asp of ASPECT_ANGLES) {
        const orb = Math.abs(diff - asp.angle)
        if (orb <= asp.orb) {
          aspects.push({
            planet1: planets[i].planet,
            planet2: planets[j].planet,
            type: asp.type,
            orb: Math.round(orb * 10) / 10,
            applying: planets[i].longitude < planets[j].longitude,
          })
          break
        }
      }
    }
  }
  return aspects.sort((a, b) => a.orb - b.orb)
}

function assignHouses(longitude: number, houseCusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const next = (i + 1) % 12
    let start = houseCusps[i]
    let end = houseCusps[next]
    if (end < start) end += 360
    let lng = longitude
    if (lng < start) lng += 360
    if (lng >= start && lng < end) return i + 1
  }
  return 1
}

// ─── Real ephemeris calculation (astronomy-engine + Placidus) ──────────────

import * as Astro from 'astronomy-engine'

const D2R = Math.PI / 180
const R2D = 180 / Math.PI

/** RA (degrees) → ecliptic longitude (degrees), assuming point is on the ecliptic */
function raToEclLon(ra: number, epsR: number): number {
  const raR = (((ra % 360) + 360) % 360) * D2R
  let lng = Math.atan2(Math.sin(raR), Math.cos(raR) * Math.cos(epsR)) * R2D
  if (lng < 0) lng += 360
  return lng
}

/** Ecliptic longitude → declination */
function eclLonToDecl(lng: number, epsR: number): number {
  return Math.asin(Math.sin(lng * D2R) * Math.sin(epsR)) * R2D
}

/** Compute a single Placidus intermediate cusp via iteration */
function placidusCusp(fraction: number, isUpper: boolean, ramc: number, latR: number, epsR: number): number {
  const baseRA = isUpper ? ramc : ((ramc + 180) % 360)
  let ra = isUpper
    ? (baseRA + fraction * 90) % 360
    : ((baseRA - fraction * 90 + 360) % 360)

  for (let iter = 0; iter < 100; iter++) {
    const lng = raToEclLon(ra, epsR)
    const decl = eclLonToDecl(lng, epsR)
    let cosHA = -Math.tan(latR) * Math.tan(decl * D2R)
    cosHA = Math.max(-1, Math.min(1, cosHA))
    const sda = Math.acos(cosHA) * R2D
    const arc = isUpper ? sda : (180 - sda)

    let newRa: number
    if (isUpper) {
      newRa = (baseRA + fraction * arc) % 360
    } else {
      newRa = ((baseRA - fraction * arc) % 360 + 360) % 360
    }

    if (Math.abs(((newRa - ra + 540) % 360) - 180) < 0.001) {
      return raToEclLon(newRa, epsR)
    }
    ra = newRa
  }
  return raToEclLon(ra, epsR)
}

export function calcNatalChart(
  day: number,
  month: number,
  year: number,
  hour: number = 12,
  minute: number = 0,
  lat: number = 41.9,   // default: Rome
  lon: number = 12.5,
  utcOffset: number = 1 // hours ahead of UTC (e.g. CET=1, CEST=2, EEST=3)
): NatalChartData {
  // Convert local time to UTC
  const utcHour = hour - utcOffset
  const utcDate = new Date(Date.UTC(year, month - 1, day, utcHour, minute, 0))
  const t = Astro.MakeTime(utcDate)

  // ── Obliquity & sidereal time ──
  const T = t.tt / 36525
  const eps = 23.4392911 - 0.0130042 * T
  const epsR = eps * D2R
  const latR = lat * D2R

  const gst = Astro.SiderealTime(t)
  const lst = ((gst + lon / 15) % 24 + 24) % 24
  const ramc = lst * 15

  // ── MC ──
  const ramcR = ramc * D2R
  let mcLng = Math.atan2(Math.sin(ramcR), Math.cos(ramcR) * Math.cos(epsR)) * R2D
  if (mcLng < 0) mcLng += 360
  if (Math.abs(mcLng - ramc) > 90 && Math.abs(mcLng - ramc) < 270) mcLng = (mcLng + 180) % 360

  // ── ASC ──
  let ascLng = Math.atan2(
    Math.cos(ramcR),
    -(Math.sin(ramcR) * Math.cos(epsR) + Math.tan(latR) * Math.sin(epsR))
  ) * R2D
  if (ascLng < 0) ascLng += 360

  // ── Placidus house cusps ──
  const c11 = placidusCusp(1 / 3, true, ramc, latR, epsR)
  const c12 = placidusCusp(2 / 3, true, ramc, latR, epsR)
  const c2 = placidusCusp(2 / 3, false, ramc, latR, epsR)
  const c3 = placidusCusp(1 / 3, false, ramc, latR, epsR)

  const cuspLongitudes = [
    ascLng, c2, c3,
    (mcLng + 180) % 360,
    (c11 + 180) % 360, (c12 + 180) % 360,
    (ascLng + 180) % 360,
    (c2 + 180) % 360, (c3 + 180) % 360,
    mcLng, c11, c12,
  ]

  // ── Planet positions (real ephemeris) ──
  const PLANET_BODIES: Astro.Body[] = [
    Astro.Body.Mercury, Astro.Body.Venus, Astro.Body.Mars,
    Astro.Body.Jupiter, Astro.Body.Saturn, Astro.Body.Uranus,
    Astro.Body.Neptune, Astro.Body.Pluto,
  ]
  const PLANET_NAMES: Record<string, string> = {
    Mercury: 'Mercury', Venus: 'Venus', Mars: 'Mars',
    Jupiter: 'Jupiter', Saturn: 'Saturn', Uranus: 'Uranus',
    Neptune: 'Neptune', Pluto: 'Pluto',
  }
  const tPrev = Astro.MakeTime(new Date(utcDate.getTime() - 86400000)) // 1 day before

  // Sun
  const sunVec = Astro.GeoVector(Astro.Body.Sun, t, true)
  const sunEcl = Astro.Ecliptic(sunVec)
  const sunLng = sunEcl.elon

  // Moon
  const moonEcl = Astro.EclipticGeoMoon(t)
  const moonLng = moonEcl.lon

  const rawPlanets: { planet: string; longitude: number; retrograde: boolean }[] = [
    { planet: 'Sun', longitude: sunLng, retrograde: false },
    { planet: 'Moon', longitude: moonLng, retrograde: false },
  ]

  for (const body of PLANET_BODIES) {
    // GEOCENTRIC ecliptic longitude (seen from Earth, not from Sun)
    const vec = Astro.GeoVector(body, t, true)
    const ecl = Astro.Ecliptic(vec)
    const lng = ecl.elon

    const vecPrev = Astro.GeoVector(body, tPrev, true)
    const eclPrev = Astro.Ecliptic(vecPrev)
    let motion = lng - eclPrev.elon
    if (motion > 180) motion -= 360
    if (motion < -180) motion += 360
    rawPlanets.push({ planet: PLANET_NAMES[body] || String(body), longitude: lng, retrograde: motion < 0 })
  }

  // ── Additional points: North Node, Lilith, Chiron, Part of Fortune ──
  const T2 = T // Julian centuries from J2000 (already computed above)

  // Mean North Node (Rahu) — always retrograde
  const meanNode = ((125.0445479 - 1934.1362891 * T2 + 0.0020754 * T2 * T2) % 360 + 360) % 360
  rawPlanets.push({ planet: 'North Node', longitude: meanNode, retrograde: true })

  // Mean Lilith (Black Moon) — lunar apogee (perigee formula + 180°)
  const meanLilith = ((83.3532465 + 4069.0137287 * T2 - 0.0103200 * T2 * T2 + 180) % 360 + 360) % 360
  rawPlanets.push({ planet: 'Lilith', longitude: meanLilith, retrograde: false })

  // Chiron (simplified orbital calculation)
  // Epoch: J2000.0, Chiron orbital elements
  const chironMeanLng = ((209.35 + 1.4 * (t.tt / 365.25)) % 360 + 360) % 360
  // More precise: use orbital elements
  const chironN = t.tt / 365.25 // years from J2000
  const chironM = ((319.33 + 0.01953 * t.tt) % 360 + 360) % 360 * D2R // mean anomaly
  const chironE0 = 0.37896 // eccentricity
  // Solve Kepler's equation (2 iterations)
  let chironEA = chironM + chironE0 * Math.sin(chironM)
  chironEA = chironM + chironE0 * Math.sin(chironEA)
  chironEA = chironM + chironE0 * Math.sin(chironEA)
  const chironTrueAnom = 2 * Math.atan2(
    Math.sqrt(1 + chironE0) * Math.sin(chironEA / 2),
    Math.sqrt(1 - chironE0) * Math.cos(chironEA / 2)
  )
  const chironLngPeri = ((339.46 + 0.01297 * t.tt) % 360 + 360) % 360 * D2R // longitude of perihelion
  const chironOmega = ((209.35 + 0.00795 * t.tt) % 360 + 360) % 360 * D2R // ascending node
  const chironIncl = 6.93 * D2R
  // Heliocentric ecliptic longitude
  const chironArgLat = chironTrueAnom + chironLngPeri - chironOmega
  let chironHelioLng = Math.atan2(
    Math.sin(chironArgLat) * Math.cos(chironIncl),
    Math.cos(chironArgLat)
  ) + chironOmega
  let chironLng = ((chironHelioLng * R2D) % 360 + 360) % 360
  // Rough geocentric correction (parallax from Sun-Earth, ~few degrees max for distant objects)
  const sunLngRad = sunLng * D2R
  const chironDist = 13.7 // AU approximate
  const chironCorrection = Math.atan2(Math.sin(sunLngRad - chironLng * D2R), chironDist - Math.cos(sunLngRad - chironLng * D2R)) * R2D
  chironLng = ((chironLng + chironCorrection) % 360 + 360) % 360
  rawPlanets.push({ planet: 'Chiron', longitude: chironLng, retrograde: false })

  // Part of Fortune = ASC + Moon - Sun (day chart: Sun above horizon)
  // Day chart if Sun is in houses 7-12 (above horizon)
  const sunHouse = assignHouses(sunLng, cuspLongitudes)
  const isDayChart = sunHouse >= 7 && sunHouse <= 12
  let fortuneLng: number
  if (isDayChart) {
    fortuneLng = ((ascLng + moonLng - sunLng) % 360 + 360) % 360
  } else {
    fortuneLng = ((ascLng + sunLng - moonLng) % 360 + 360) % 360
  }
  rawPlanets.push({ planet: 'Fortune', longitude: fortuneLng, retrograde: false })

  // Build PlanetPosition array
  const planets: PlanetPosition[] = rawPlanets.map(rp => {
    const lng = ((rp.longitude % 360) + 360) % 360
    const { sign, degree, minute: min } = longitudeToSign(lng)
    const house = assignHouses(lng, cuspLongitudes)
    return {
      planet: rp.planet,
      longitude: Math.round(lng * 100) / 100,
      sign,
      signDegree: degree,
      minute: min,
      house,
      retrograde: rp.retrograde,
    }
  })

  // Add ASC & MC as special points
  const ascInfo = longitudeToSign(ascLng)
  const mcInfo = longitudeToSign(mcLng)
  planets.push({
    planet: 'Ascendant', longitude: Math.round(ascLng * 100) / 100,
    sign: ascInfo.sign, signDegree: ascInfo.degree, minute: ascInfo.minute,
    house: 1, retrograde: false,
  })
  planets.push({
    planet: 'MC', longitude: Math.round(mcLng * 100) / 100,
    sign: mcInfo.sign, signDegree: mcInfo.degree, minute: mcInfo.minute,
    house: 10, retrograde: false,
  })

  // Build house objects
  const houses: HouseCusp[] = cuspLongitudes.map((lng, i) => {
    const norm = ((lng % 360) + 360) % 360
    const info = longitudeToSign(norm)
    return { house: i + 1, longitude: Math.round(norm * 100) / 100, sign: info.sign, degree: info.degree }
  })

  // Aspects (planets + nodes/chiron/lilith, not AC/MC/Fortune)
  const aspectPlanets = planets.filter(p => p.planet !== 'Ascendant' && p.planet !== 'MC' && p.planet !== 'Fortune')
  const aspects = calcAspects(aspectPlanets)

  return {
    planets, houses, aspects,
    ascendantLongitude: Math.round(ascLng * 100) / 100,
    mcLongitude: Math.round(mcLng * 100) / 100,
  }
}

// ─── DST check ─────────────────────────────────────────────────────────────

/** Check if date falls in DST (simplified European/US rules) */
export function isDST(year: number, month: number, day: number, tzBase: number): boolean {
  // Europe (CET/CEST, EET/EEST): last Sunday of March → last Sunday of October
  if (tzBase >= 0 && tzBase <= 3) {
    const marchLast = new Date(year, 2, 31)
    const dstStart = 31 - marchLast.getDay() // last Sunday of March
    const octLast = new Date(year, 9, 31)
    const dstEnd = 31 - octLast.getDay() // last Sunday of October

    if (month > 3 && month < 10) return true
    if (month === 3 && day >= dstStart) return true
    if (month === 10 && day < dstEnd) return true
    return false
  }
  // US (EDT, CDT, MDT, PDT)
  if (tzBase >= -8 && tzBase <= -4) {
    // Pre-2007: 1st Sunday April → last Sunday October
    // 2007+: 2nd Sunday March → 1st Sunday November
    if (year >= 2007) {
      const marchFirst = new Date(year, 2, 1)
      const dstStart = (14 - marchFirst.getDay()) % 7 + 8 // 2nd Sunday March
      const novFirst = new Date(year, 10, 1)
      const dstEnd = (7 - novFirst.getDay()) % 7 + 1 // 1st Sunday Nov

      if (month > 3 && month < 11) return true
      if (month === 3 && day >= dstStart) return true
      if (month === 11 && day < dstEnd) return true
    } else {
      const aprFirst = new Date(year, 3, 1)
      const dstStart = (7 - aprFirst.getDay()) % 7 + 1 // 1st Sunday April
      const octLast = new Date(year, 9, 31)
      const dstEnd = 31 - octLast.getDay() // last Sunday October

      if (month > 4 && month < 10) return true
      if (month === 4 && day >= dstStart) return true
      if (month === 10 && day < dstEnd) return true
    }
    return false
  }
  return false
}

// ─── Interpretations ────────────────────────────────────────────────────────

export const PLANET_IN_SIGN: Record<string, Record<string, string>> = {
  Sun: {
    Aries: 'Identità forgiata nell\'azione. Esisti facendo, non aspettando. Bisogno viscerale di iniziare, competere, imporsi. Rischio: bruciare prima di costruire.',
    Taurus: 'Identità ancorata ai sensi. Ti conosci attraverso ciò che costruisci e possiedi. Tenacia formidabile, ma la resistenza al cambiamento può diventare trappola.',
    Gemini: 'Identità frammentata nelle idee. Ti conosci attraverso il linguaggio e la connessione. Mente brillante, spesso troppo veloce per il cuore.',
    Cancer: 'Identità radicata nel sentire. Ti conosci attraverso ciò che proteggi. La tua forza è la memoria emotiva, il rischio è restarci prigioniero.',
    Leo: 'Identità che si esprime nella creazione. Ti conosci attraverso ciò che irradi. Generosità naturale, ma il bisogno di riconoscimento può diventare dipendenza.',
    Virgo: 'Identità raffinata nel servizio. Ti conosci attraverso ciò che migliori. Precisione mentale notevole, ma l\'autocritica può paralizzare.',
    Libra: 'Identità che si specchia nell\'altro. Ti conosci attraverso la relazione. Diplomazia innata, ma il terrore del conflitto ti rende ambiguo.',
    Scorpio: 'Identità forgiata nella crisi. Ti conosci attraverso ciò che sopravvivi. Intensità che trasforma tutto, ma il controllo può diventare ossessione.',
    Sagittarius: 'Identità espansa nel significato. Ti conosci attraverso ciò che credi. Visione ampia, ma la fuga in avanti evita la profondità.',
    Capricorn: 'Identità guadagnata nella padronanza. Ti conosci attraverso ciò che realizzi. Disciplina implacabile, ma la durezza verso te stesso è il vero nemico.',
    Aquarius: 'Identità definita dalla differenza. Ti conosci attraverso ciò che contesti. Mente originale, ma il distacco emotivo può isolarti.',
    Pisces: 'Identità dissolta nel collettivo. Ti conosci attraverso ciò che trascendi. Empatia profonda, ma i confini sfumati rendono difficile distinguere il tuo dal non-tuo.',
  },
  Moon: {
    Aries: 'Reagisci con impulso. Le emozioni arrivano forti e se ne vanno rapide. Hai bisogno di indipendenza affettiva, ma confondere rabbia con bisogno è il tuo schema.',
    Taurus: 'Sicurezza emotiva attraverso stabilità e piacere sensoriale. Fedeltà profonda, ma possessività quando ti senti minacciato.',
    Gemini: 'Emozioni elaborate mentalmente. Bisogno di stimolazione costante e varietà. La razionalizzazione del sentire è difesa e limite.',
    Cancer: 'Nella propria sede naturale. Empatia potente, memoria emotiva lunga. Rischio di nutrire gli altri per non affrontare i propri vuoti.',
    Leo: 'Bisogno emotivo di riconoscimento e calore. Generoso nell\'affetto, ma ferito profondamente dall\'indifferenza.',
    Virgo: 'Emozioni filtrate dall\'analisi. Cura attraverso il gesto pratico. L\'ansia è il prezzo di un sistema emotivo che cerca perfezione.',
    Libra: 'Equilibrio emotivo cercato attraverso armonia e relazione. Eviti il conflitto a costo della tua autenticità.',
    Scorpio: 'Emozioni intense, assolute, non negoziabili. Lealtà totale o taglio netto. La vulnerabilità è ciò che nascondi meglio.',
    Sagittarius: 'Emozioni che cercano significato. Ottimismo istintivo, ma la fuga emotiva è il tuo schema difensivo.',
    Capricorn: 'Emozioni trattenute, controllate, espresse con parsimonia. Maturità precoce, ma il bisogno di tenerezza è quello che neghi.',
    Aquarius: 'Distanza emotiva come strategia di sopravvivenza. Comprendi le emozioni intellettualmente, viverle è un\'altra storia.',
    Pisces: 'Spugna emotiva. Assorbi tutto, distingui poco. Compassione sconfinata, ma proteggerti è una competenza da sviluppare.',
  },
  Mercury: {
    Aries: 'Pensiero rapido e diretto. Parli prima di elaborare. La mente è un\'arma, ma la pazienza non è nel vocabolario.',
    Taurus: 'Pensiero lento, solido, pratico. Elabori con calma ma le conclusioni sono granitiche. Testardo nelle opinioni.',
    Gemini: 'Nella propria sede. Mente agile, curiosa, multitasking. Comunichi brillantemente ma approfondire richiede sforzo.',
    Cancer: 'Pensiero influenzato dalle emozioni. Memoria eccellente, soprattutto per torti subiti. Intuizione forte.',
    Leo: 'Comunicazione teatrale e persuasiva. Pensi in grande, parli con autorità. Difficoltà ad accettare idee altrui.',
    Virgo: 'Nella propria sede. Mente analitica, precisa, metodica. Eccelli nel dettaglio ma rischi di perdere la visione d\'insieme.',
    Libra: 'Pensiero equilibrato, diplomatico. Vedi sempre entrambi i lati, il che rende le decisioni un tormento.',
    Scorpio: 'Mente investigativa, penetrante. Vai sempre sotto la superficie. Il sospetto è la tua lente predefinita.',
    Sagittarius: 'Pensiero espansivo, filosofico. Colleghi idee distanti ma i dettagli ti annoiano mortalmente.',
    Capricorn: 'Mente strutturata, strategica. Pensi a lungo termine. Il cinismo è il rovescio della tua lucidità.',
    Aquarius: 'Pensiero originale, non convenzionale. Idee avanti rispetto al contesto. La provocazione intellettuale è sport.',
    Pisces: 'Pensiero intuitivo, associativo, poetico. La logica lineare non è il tuo forte. Immaginazione potentissima.',
  },
  Venus: {
    Aries: 'Ami con intensità e urgenza. La conquista ti accende, la routine ti spegne. Passionale ma impaziente.',
    Taurus: 'Nella propria sede. Ami con i sensi, attraverso il tatto e la presenza. Fedeltà tenace, possessività inclusa.',
    Gemini: 'Ami attraverso la parola e lo scambio mentale. Varietà e leggerezza sono ossigeno. La profondità spaventa.',
    Cancer: 'Ami proteggendo e nutrendo. Il legame è tutto, ma la paura dell\'abbandono condiziona ogni scelta.',
    Leo: 'Ami con generosità e dramma. Vuoi essere speciale per qualcuno. L\'amore deve essere celebrazione.',
    Virgo: 'Ami attraverso il gesto pratico e la cura quotidiana. Pudico nei sentimenti. L\'autocritica sabota l\'intimità.',
    Libra: 'Nella propria sede. Ami l\'idea della relazione perfetta. Eleganza emotiva, ma la dipendenza dal consenso è il punto cieco.',
    Scorpio: 'Ami con intensità totale. Tutto o niente. La gelosia è l\'ombra di un amore che vuole fusione.',
    Sagittarius: 'Ami la libertà dentro la relazione. Entusiasta ma sfuggente. L\'impegno a lungo termine è la sfida vera.',
    Capricorn: 'Ami con serietà e responsabilità. Lento ad aprirsi, ma solido una volta dentro. La vulnerabilità è il tabù.',
    Aquarius: 'Ami l\'unicità dell\'altro. Libertà è la condizione non negoziabile. L\'intimità vera richiede un coraggio che non sempre hai.',
    Pisces: 'Ami senza confini, con sacrificio e idealizzazione. La compassione è genuina, ma confondere amore e salvezza è il pattern.',
  },
  Mars: {
    Aries: 'Nella propria sede. Energia diretta, competitiva, esplosiva. Agisci prima di pensare. Il conflitto non ti spaventa.',
    Taurus: 'Energia lenta ma inesorabile. Non inizi facilmente ma non molli mai. La rabbia è un vulcano sotterraneo.',
    Gemini: 'Agisci attraverso le parole e le idee. Dispersivo nell\'azione. Il sarcasmo è la tua arma preferita.',
    Cancer: 'Energia difensiva, protettiva. Combatti per chi ami, raramente per te stesso. Aggressività passiva.',
    Leo: 'Energia teatrale, coraggiosa, dominante. Vuoi guidare, non seguire. L\'orgoglio governa le tue battaglie.',
    Virgo: 'Energia precisa, metodica. Agisci dopo aver analizzato. L\'ansia da prestazione è il freno costante.',
    Libra: 'Energia mediata dalla diplomazia. Eviti lo scontro diretto. La rabbia espressa indirettamente è il problema.',
    Scorpio: 'Energia intensa, strategica, implacabile. Non dimentichi e non perdoni facilmente. Potenza trasformativa.',
    Sagittarius: 'Energia espansiva, entusiasta, incostante. Ti lanci con fuoco ma sostenerlo è un\'altra questione.',
    Capricorn: 'Energia disciplinata, ambiziosa, resistente. Giochi il gioco lungo. Il burnout è il prezzo della tua tenacia.',
    Aquarius: 'Energia ribelle, imprevedibile, ideologica. Combatti per le cause, meno per te stesso.',
    Pisces: 'Energia fluida, evasiva, sacrificale. Agisci per gli altri più che per te. La passività è la trappola.',
  },
  Jupiter: {
    Aries: 'Espansione attraverso l\'iniziativa e il coraggio. Fortuna nel lanciarsi. Eccesso: impulsività magnificata.',
    Taurus: 'Espansione attraverso risorse e comfort. Talento per accumulare. Eccesso: materialismo e indulgenza.',
    Gemini: 'Espansione attraverso idee e comunicazione. Mente enciclopedica. Eccesso: dispersione intellettuale.',
    Cancer: 'Espansione attraverso la famiglia e la cura. Generosità emotiva. Eccesso: iperprotettività.',
    Leo: 'Espansione attraverso la creatività e il leadership. Magnanimità. Eccesso: grandiosità e arroganza.',
    Virgo: 'Espansione attraverso il servizio e il miglioramento. Crescita nel dettaglio. Eccesso: perfezionismo ossessivo.',
    Libra: 'Espansione attraverso le relazioni e la giustizia. Talento diplomatico. Eccesso: compiacenza cronica.',
    Scorpio: 'Espansione attraverso la trasformazione e il potere. Resilienza straordinaria. Eccesso: manipolazione.',
    Sagittarius: 'Nella propria sede. Espansione massima: viaggi, filosofia, visione. Eccesso: dogmatismo e superficialità mascherata da profondità.',
    Capricorn: 'Espansione attraverso la struttura e l\'ambizione. Crescita lenta ma duratura. Eccesso: rigidità e materialismo.',
    Aquarius: 'Espansione attraverso l\'innovazione e il sociale. Visione progressista. Eccesso: idealismo disconnesso.',
    Pisces: 'Espansione attraverso la spiritualità e la compassione. Fede profonda. Eccesso: escapismo e vittimismo.',
  },
  Saturn: {
    Aries: 'Disciplina nell\'impulso. Lezione: imparare la pazienza. La frustrazione è il maestro quando l\'azione è bloccata.',
    Taurus: 'Disciplina nelle risorse. Lezione: costruire con ciò che hai. Ansie materiali che insegnano il valore reale.',
    Gemini: 'Disciplina nel pensiero. Lezione: dire meno e meglio. La comunicazione diventa responsabilità.',
    Cancer: 'Disciplina nelle emozioni. Lezione: proteggersi senza chiudersi. Fredddezza apparente, fragilità nascosta.',
    Leo: 'Disciplina nell\'espressione. Lezione: brillare senza pretendere applauso. La creatività bloccata è la ferita.',
    Virgo: 'Disciplina nel metodo. Lezione: l\'imperfetto è accettabile. L\'ansia di non essere abbastanza è il tema.',
    Libra: 'Disciplina nelle relazioni. Lezione: stare da solo prima di stare in coppia. Relazioni come test di maturità.',
    Scorpio: 'Disciplina nel potere. Lezione: controllare senza dominare. La paura della vulnerabilità è il muro.',
    Sagittarius: 'Disciplina nella visione. Lezione: le risposte vanno guadagnate, non proclamate. Il dubbio è maestro.',
    Capricorn: 'Nella propria sede. Disciplina totale. Lezione: il successo non guarisce la solitudine interiore.',
    Aquarius: 'Disciplina nell\'originalità. Lezione: la libertà ha struttura. Il ribelle deve imparare le regole prima di romperle.',
    Pisces: 'Disciplina nella compassione. Lezione: i confini non sono egoismo. Il sacrificio cronico è autodistruzione.',
  },
  Uranus: {
    Aries: 'Generazione che rompe con l\'azione diretta. Rivoluzione dell\'individuo.',
    Taurus: 'Generazione che rivoluziona valori e risorse. Trasformazione economica.',
    Gemini: 'Generazione che rivoluziona la comunicazione. Innovazione nel pensiero.',
    Cancer: 'Generazione che ridefinisce famiglia e appartenenza. Radici scosse.',
    Leo: 'Generazione che rivoluziona l\'espressione creativa. Individualismo radicale.',
    Virgo: 'Generazione che trasforma lavoro e salute. Innovazione nel servizio.',
    Libra: 'Generazione che ridefinisce le relazioni. Nuovi modelli di coppia.',
    Scorpio: 'Generazione che trasforma potere e sessualità. Rivoluzione profonda.',
    Sagittarius: 'Generazione che espande i confini. Rivoluzione culturale e filosofica.',
    Capricorn: 'Generazione che demolisce e ricostruisce le strutture. Crisi delle istituzioni.',
    Aquarius: 'Nella propria sede. Generazione della rivoluzione tecnologica e sociale.',
    Pisces: 'Generazione che dissolve confini tra reale e immaginario. Risveglio spirituale.',
  },
  Neptune: {
    Aries: 'Generazione che idealizza l\'azione e il coraggio. Confusione tra forza e violenza.',
    Taurus: 'Generazione che idealizza il comfort e la natura. Illusioni materiali.',
    Gemini: 'Generazione che confonde informazione e verità. Nebbia comunicativa.',
    Cancer: 'Generazione che idealizza la famiglia e il passato. Nostalgia come rifugio.',
    Leo: 'Generazione che idealizza la celebrità e l\'espressione. Illusione di grandezza.',
    Virgo: 'Generazione che cerca perfezione impossibile. Confusione tra servizio e sacrificio.',
    Libra: 'Generazione che idealizza l\'amore romantico. Illusioni relazionali.',
    Scorpio: 'Generazione che esplora il mistero e l\'occulto. Fascino per l\'ombra.',
    Sagittarius: 'Generazione che dissolve confini culturali. Globalizzazione dell\'immaginario.',
    Capricorn: 'Generazione che dissolve strutture rigide. Le istituzioni perdono credibilità.',
    Aquarius: 'Generazione che dissolve confini tra individuo e collettivo. Idealismo tecnologico.',
    Pisces: 'Nella propria sede. Generazione dell\'empatia globale e della confusione identitaria.',
  },
  Pluto: {
    Aries: 'Generazione che trasforma il concetto di identità e iniziativa. Potere individuale.',
    Taurus: 'Generazione che trasforma economia e valori. Crisi delle risorse.',
    Gemini: 'Generazione che trasforma la comunicazione. Potere dell\'informazione.',
    Cancer: 'Generazione che trasforma famiglia e nazione. Radici strappate e ricostruite.',
    Leo: 'Generazione che trasforma il potere creativo e il leadership. Ego e potere.',
    Virgo: 'Generazione che trasforma lavoro e salute. Ossessione del miglioramento.',
    Libra: 'Generazione che trasforma le relazioni e la giustizia. Crisi del compromesso.',
    Scorpio: 'Nella propria sede. Generazione della trasformazione radicale. Potere e rinascita.',
    Sagittarius: 'Generazione che trasforma fede e ideologia. Crisi del significato.',
    Capricorn: 'Generazione che trasforma strutture di potere. Demolizione e ricostruzione delle istituzioni.',
    Aquarius: 'Generazione che trasforma il collettivo. Rivoluzione sociale profonda.',
    Pisces: 'Generazione che trasforma la spiritualità. Dissoluzione dei vecchi miti.',
  },
  Ascendant: {
    Aries: 'Ti presenti al mondo con energia diretta, impaziente. Primo impatto: determinazione e urgenza.',
    Taurus: 'Ti presenti al mondo con calma e solidità. Primo impatto: affidabilità e lentezza deliberata.',
    Gemini: 'Ti presenti al mondo con curiosità e leggerezza. Primo impatto: versatilità e nervosismo.',
    Cancer: 'Ti presenti al mondo con cautela e sensibilità. Primo impatto: protezione e riservatezza.',
    Leo: 'Ti presenti al mondo con calore e presenza. Primo impatto: carisma e autorità naturale.',
    Virgo: 'Ti presenti al mondo con modestia e precisione. Primo impatto: competenza e discrezione.',
    Libra: 'Ti presenti al mondo con grazia e diplomazia. Primo impatto: eleganza e desiderio di piacere.',
    Scorpio: 'Ti presenti al mondo con intensità e mistero. Primo impatto: magnetismo e diffidenza.',
    Sagittarius: 'Ti presenti al mondo con entusiasmo e apertura. Primo impatto: ottimismo e irrequietezza.',
    Capricorn: 'Ti presenti al mondo con serietà e compostezza. Primo impatto: maturità e distanza.',
    Aquarius: 'Ti presenti al mondo con originalità e distacco. Primo impatto: eccentric e indipendente.',
    Pisces: 'Ti presenti al mondo con dolcezza e vaghezza. Primo impatto: empatia e sfuggevolezza.',
  },
  MC: {
    Aries: 'Vocazione nell\'azione e nell\'iniziativa. Carriera che richiede coraggio e leadership.',
    Taurus: 'Vocazione nella costruzione e nell\'accumulo. Carriera che richiede pazienza e senso pratico.',
    Gemini: 'Vocazione nella comunicazione e nello scambio. Carriera che richiede versatilità mentale.',
    Cancer: 'Vocazione nella cura e nella protezione. Carriera che nutre gli altri.',
    Leo: 'Vocazione nell\'espressione e nel leadership. Carriera che richiede visibilità e carisma.',
    Virgo: 'Vocazione nel servizio e nel miglioramento. Carriera che richiede precisione e competenza tecnica.',
    Libra: 'Vocazione nell\'armonia e nella mediazione. Carriera che richiede diplomazia e senso estetico.',
    Scorpio: 'Vocazione nella trasformazione e nell\'investigazione. Carriera che va in profondità.',
    Sagittarius: 'Vocazione nell\'espansione e nell\'insegnamento. Carriera che richiede visione ampia.',
    Capricorn: 'Vocazione nella struttura e nell\'autorità. Carriera che costruisce nel tempo.',
    Aquarius: 'Vocazione nell\'innovazione e nel sociale. Carriera che rompe gli schemi.',
    Pisces: 'Vocazione nella compassione e nell\'arte. Carriera che trascende il materiale.',
  },
}

export const ASPECT_INTERPRETATIONS: Record<string, string> = {
  // Conjunctions
  'Sun-Moon:Conjunction': 'Unità tra volontà e istinto. Ciò che vuoi e ciò che senti sono allineati — potenza rara, ma poca prospettiva esterna.',
  'Sun-Mercury:Conjunction': 'La mente è al servizio dell\'identità. Pensi da chi sei, non puoi separare ragionamento da ego.',
  'Sun-Venus:Conjunction': 'Fascino naturale. L\'identità si esprime attraverso la bellezza e la relazione. Il rischio è definirsi solo per piacere.',
  'Sun-Mars:Conjunction': 'Energia vitale intensa. Volontà e azione unite. Rischio: aggressività come modo di esistere.',
  'Sun-Jupiter:Conjunction': 'Ottimismo e fiducia naturali. Tutto sembra possibile. Rischio: overconfidence e eccesso.',
  'Sun-Saturn:Conjunction': 'Serietà e senso di responsabilità precoci. La vita pesa, ma la disciplina è il dono.',
  'Sun-Uranus:Conjunction': 'Identità ribelle. Non puoi conformarti senza perdere te stesso. Originalità come necessità.',
  'Sun-Neptune:Conjunction': 'Identità sfumata, idealista. Fascino carismatico ma confusione su chi sei davvero.',
  'Sun-Pluto:Conjunction': 'Intensità esistenziale. Ogni cosa è questione di vita o morte. Potere trasformativo enorme.',
  'Moon-Mercury:Conjunction': 'Emozioni e pensiero intrecciati. Parli di ciò che senti, analizzi ciò che provi.',
  'Moon-Venus:Conjunction': 'Dolcezza emotiva. Bisogno di armonia e bellezza nella vita affettiva. Seduzione naturale.',
  'Moon-Mars:Conjunction': 'Emozioni reattive e intense. Rabbia e bisogno di protezione si confondono.',
  'Moon-Jupiter:Conjunction': 'Generosità emotiva, ottimismo istintivo. Eccesso nel nutrire e nel consumare.',
  'Moon-Saturn:Conjunction': 'Emozioni trattenute, controllate. Maturità emotiva precoce pagata con inibizione.',
  'Moon-Uranus:Conjunction': 'Instabilità emotiva. Bisogno di libertà nella sfera intima. Imprevedibilità affettiva.',
  'Moon-Neptune:Conjunction': 'Empatia profondissima, confini emotivi sfumati. Intuizione forte, ma rischio di illusione.',
  'Moon-Pluto:Conjunction': 'Emozioni intense, possessive, trasformative. Il passato emotivo ha un peso enorme.',
  'Mercury-Venus:Conjunction': 'Comunicazione elegante e diplomatica. Mente estetica. Parli con grazia.',
  'Mercury-Mars:Conjunction': 'Mente combattiva, parola tagliente. Dibattito come sport. Il sarcasmo è l\'arma.',
  'Venus-Mars:Conjunction': 'Passione intensa. Desiderio e affetto uniti. Magnetismo sessuale forte.',
  'Venus-Jupiter:Conjunction': 'Abbondanza nell\'amore e nel piacere. Generosità, ma eccesso e indulgenza.',
  'Venus-Saturn:Conjunction': 'Amore serio, impegnativo. Paura del rifiuto. Relazioni che maturano nel tempo.',
  'Mars-Jupiter:Conjunction': 'Energia espansiva, entusiasmo nell\'azione. Rischio: fare troppo, troppo in fretta.',
  'Mars-Saturn:Conjunction': 'Energia disciplinata ma frustrata. Azione bloccata che esplode. Resistenza enorme.',
  'Jupiter-Saturn:Conjunction': 'Espansione e contrazione. Ciclo di crescita e consolidamento. Ambizione realistica.',

  // Oppositions
  'Sun-Moon:Opposition': 'Tensione tra volontà cosciente e bisogni emotivi. Ciò che vuoi e ciò che ti serve sono in conflitto permanente.',
  'Sun-Mars:Opposition': 'Tensione tra identità e azione. Gli altri ti sfidano e ti provocano. Proiezione della rabbia.',
  'Sun-Saturn:Opposition': 'Tensione tra espressione e dovere. Qualcuno (spesso il padre) blocca la tua espansione.',
  'Sun-Uranus:Opposition': 'Tensione tra stabilità e libertà. Relazioni che ti scuotono e ti costringono a evolverti.',
  'Sun-Neptune:Opposition': 'Tensione tra realtà e illusione. Tendenza a idealizzare gli altri a spese di te stesso.',
  'Sun-Pluto:Opposition': 'Lotte di potere con l\'esterno. Gli altri riflettono il tuo bisogno di controllo.',
  'Moon-Saturn:Opposition': 'Tensione tra bisogno di calore e obbligo di compostezza. Fredddezza che nasconde vulnerabilità.',
  'Moon-Pluto:Opposition': 'Tensione emotiva intensa. Relazioni che riaprono ferite antiche. Potere e dipendenza.',
  'Venus-Mars:Opposition': 'Tensione tra dare e prendere nell\'amore. Attrazione magnetica ma conflitto di desideri.',
  'Venus-Saturn:Opposition': 'Tensione tra desiderio di amore e paura del rifiuto. Relazioni come test.',
  'Venus-Uranus:Opposition': 'Tensione tra sicurezza affettiva e bisogno di libertà. Relazioni instabili per necessità.',
  'Venus-Neptune:Opposition': 'Tensione tra amore reale e amore idealizzato. Delusioni che insegnano il discernimento.',
  'Venus-Pluto:Opposition': 'Tensione tra amore e potere. Passione che controlla. Gelosia come campo di battaglia.',
  'Mars-Saturn:Opposition': 'Tensione tra impulso e limite. Energia bloccata che esplode ciclicamente.',
  'Mars-Pluto:Opposition': 'Tensione tra potere e forza bruta. Conflitti intensi che trasformano.',
  'Jupiter-Saturn:Opposition': 'Tensione tra espansione e contrazione. Oscillazione tra eccesso e restrizione.',

  // Squares
  'Sun-Moon:Square': 'Frizione costante tra identità e bisogni emotivi. Tensione interna che genera crescita ma anche stress cronico.',
  'Sun-Mars:Square': 'Conflitto tra chi sei e come agisci. Frustrazione nell\'azione. Energia che ha bisogno di sfogo.',
  'Sun-Saturn:Square': 'Conflitto tra espressione personale e limiti imposti. Autostima costruita sulla fatica.',
  'Sun-Uranus:Square': 'Conflitto tra bisogno di stabilità e impulso alla rottura. Cambiamenti improvvisi nell\'identità.',
  'Sun-Neptune:Square': 'Conflitto tra realtà e fantasia. Difficoltà a vedersi chiaramente. Talento artistico non incanalato.',
  'Sun-Pluto:Square': 'Conflitto di potere interiore. Crisi che trasformano l\'identità. Resistenza al cambiamento necessario.',
  'Moon-Mars:Square': 'Conflitto tra sensibilità e aggressività. Reazioni emotive sproporzionate. Rabbia come difesa.',
  'Moon-Saturn:Square': 'Conflitto tra bisogno emotivo e senso del dovere. Inibizione affettiva che genera rigidità.',
  'Moon-Uranus:Square': 'Conflitto tra sicurezza e libertà emotiva. Instabilità nell\'umore e nelle relazioni intime.',
  'Moon-Pluto:Square': 'Conflitto emotivo profondo. Ossessioni, possessività. Dinamiche familiari che lasciano il segno.',
  'Venus-Mars:Square': 'Tensione tra desiderio e affetto. Attrazione per ciò che è complicato. Relazioni passionali e conflittuali.',
  'Venus-Saturn:Square': 'Tensione tra desiderio d\'amore e paura di non meritarlo. Relazioni ritardate ma profonde.',
  'Venus-Uranus:Square': 'Tensione tra bisogno di relazione e terrore della routine. Instabilità affettiva cronica.',
  'Venus-Pluto:Square': 'Tensione tra amore e ossessione. Relazioni intense che toccano il fondo prima di risalire.',
  'Mars-Saturn:Square': 'Tensione tra azione e limite. Frustrazione cronica. L\'energia trova la strada dopo la maturità.',
  'Mars-Pluto:Square': 'Tensione tra potere e controllo. Rabbia profonda che va trasformata, non repressa.',
  'Jupiter-Saturn:Square': 'Tensione tra ottimismo e realismo. Crescita attraverso la disciplina del desiderio.',

  // Trines
  'Sun-Moon:Trine': 'Armonia tra volontà e istinto. Ciò che vuoi e ciò che senti collaborano. Equilibrio interiore naturale.',
  'Sun-Mars:Trine': 'Energia fluida. L\'azione esprime chi sei senza conflitto. Determinazione efficace.',
  'Sun-Jupiter:Trine': 'Ottimismo e fortuna naturali. La vita tende a sostenere i tuoi progetti. Rischio: dare tutto per scontato.',
  'Sun-Saturn:Trine': 'Disciplina naturale. Sai aspettare e costruire. Maturità che non pesa.',
  'Sun-Uranus:Trine': 'Originalità che si integra. Sei diverso senza dover combattere per esserlo.',
  'Sun-Neptune:Trine': 'Sensibilità artistica e spirituale fluida. L\'immaginazione arricchisce l\'identità senza confonderla.',
  'Sun-Pluto:Trine': 'Potere personale integrato. Capacità di trasformazione senza distruzione. Resilienza profonda.',
  'Moon-Venus:Trine': 'Armonia emotiva e affettiva. Dolcezza naturale. L\'amore e il bisogno coincidono.',
  'Moon-Jupiter:Trine': 'Generosità emotiva, fiducia nell\'altro. Protettività senza soffocamento.',
  'Moon-Saturn:Trine': 'Stabilità emotiva, maturità affettiva. Sai prenderti cura senza perdere te stesso.',
  'Moon-Neptune:Trine': 'Intuizione potente, empatia naturale. Il mondo interiore è ricco e accessibile.',
  'Moon-Pluto:Trine': 'Profondità emotiva che rigenera. Capacità di attraversare le crisi e uscirne più forte.',
  'Venus-Mars:Trine': 'Desiderio e affetto in armonia. Attrazione e amore collaborano. Vita amorosa fluida.',
  'Venus-Jupiter:Trine': 'Abbondanza nell\'amore e nel piacere. Fortuna nelle relazioni. Generosità spontanea.',
  'Venus-Saturn:Trine': 'Amore maturo, relazioni solide. Sai costruire legami che durano.',
  'Venus-Neptune:Trine': 'Sensibilità artistica raffinata. L\'amore ha una qualità trascendente.',
  'Venus-Pluto:Trine': 'Intensità amorosa integrata. Passione profonda senza distruttività.',
  'Mars-Jupiter:Trine': 'Azione espansiva e fortunata. L\'iniziativa porta risultati. Energia ben investita.',
  'Mars-Saturn:Trine': 'Disciplina nell\'azione. Sai dosare la forza. Resistenza e strategia.',
  'Mars-Pluto:Trine': 'Potenza d\'azione straordinaria. Determinazione che muove le montagne.',
  'Jupiter-Saturn:Trine': 'Equilibrio tra crescita e struttura. Espansione sostenibile. Saggezza pratica.',

  // Sextiles
  'Sun-Moon:Sextile': 'Opportunità di integrare volontà e istinto. L\'equilibrio richiede attenzione ma è raggiungibile.',
  'Sun-Mars:Sextile': 'Opportunità di azione armonica. L\'iniziativa è supportata dall\'identità quando attivata.',
  'Sun-Jupiter:Sextile': 'Opportunità di espansione e crescita. L\'ottimismo funziona quando messo in pratica.',
  'Sun-Saturn:Sextile': 'Opportunità di struttura e disciplina. Il rigore è accessibile senza opprimere.',
  'Moon-Venus:Sextile': 'Opportunità di armonia emotiva e affettiva. Il piacere è a portata quando lo cerchi.',
  'Moon-Mars:Sextile': 'Opportunità di integrare emozione e azione. L\'istinto protettivo diventa forza.',
  'Venus-Mars:Sextile': 'Opportunità di equilibrio tra dare e ricevere. L\'attrazione è presente e gestibile.',
  'Venus-Jupiter:Sextile': 'Opportunità di gioia e abbondanza nelle relazioni. Fortuna quando ti apri.',
  'Mars-Jupiter:Sextile': 'Opportunità di azione fortunata. L\'entusiasmo trova terreno fertile.',
  'Mars-Saturn:Sextile': 'Opportunità di disciplina efficace. L\'energia trova struttura quando necessario.',
  'Jupiter-Saturn:Sextile': 'Opportunità di crescita strutturata. Pragmatismo e visione collaborano.',
}

export const ELEMENT_EXCESS: Record<string, string> = {
  Fire: 'Eccesso di Fuoco: tendenza all\'impulsività, all\'insofferenza e al burnout. Agisci prima di sentire.',
  Earth: 'Eccesso di Terra: tendenza alla rigidità, al materialismo e alla resistenza al cambiamento.',
  Air: 'Eccesso di Aria: tendenza a razionalizzare le emozioni, distacco dal corpo e dai sentimenti.',
  Water: 'Eccesso di Acqua: tendenza all\'ipersensibilità, alla confusione emotiva e alla dipendenza affettiva.',
}

export const ELEMENT_LACK: Record<string, string> = {
  Fire: 'Mancanza di Fuoco: difficoltà a iniziare, bassa energia vitale, motivazione fragile.',
  Earth: 'Mancanza di Terra: difficoltà a concretizzare, instabilità pratica, rapporto complicato col denaro.',
  Air: 'Mancanza di Aria: difficoltà a comunicare e a prendere distanza. Pensiero poco obiettivo.',
  Water: 'Mancanza di Acqua: difficoltà a connettersi emotivamente. Apparente fredddezza, empatia ridotta.',
}

export const HOUSE_INTERPRETATIONS: string[] = [
  'Identità, corpo fisico, approccio alla vita. Come ti presenti e come gli altri ti percepiscono al primo impatto.',
  'Risorse personali, valori, denaro. Ciò che possiedi e ciò che ti dà sicurezza materiale ed emotiva.',
  'Comunicazione, pensiero, fratelli, spostamenti brevi. Come elabori e trasmetti le informazioni.',
  'Radici, famiglia d\'origine, casa, vita privata. Le fondamenta psicologiche su cui costruisci tutto.',
  'Creatività, figli, amori, gioco. Ciò che crei per piacere, l\'espressione spontanea del tuo essere.',
  'Salute, routine quotidiana, lavoro, servizio. Come organizzi la vita di tutti i giorni.',
  'Partner, contratti, nemici dichiarati. L\'altro come specchio e come complemento.',
  'Trasformazione, crisi, sessualità, eredità, morte. Ciò che muore per permettere rinascita.',
  'Filosofia, viaggi lontani, studi superiori, fede. La ricerca di un significato più ampio.',
  'Carriera, reputazione pubblica, autorità. L\'immagine che costruisci nel mondo sociale.',
  'Amici, gruppi, ideali, progetti futuri. Il tuo posto nella comunità e la visione collettiva.',
  'Inconscio, isolamento, sacrificio, spiritualità. Ciò che resta nascosto, inclusi talenti e paure.',
]

export function getPlanetInterpretation(planet: string, sign: ZodiacSign): string {
  return PLANET_IN_SIGN[planet]?.[sign] || `${planet} in ${sign}: una firma energetica unica che colora la tua esperienza.`
}

export function getAspectInterpretation(planet1: string, planet2: string, type: AspectType): string {
  const key1 = `${planet1}-${planet2}:${type}`
  const key2 = `${planet2}-${planet1}:${type}`
  return ASPECT_INTERPRETATIONS[key1] || ASPECT_INTERPRETATIONS[key2] || ''
}
