import { NextRequest, NextResponse } from 'next/server'

// Base UTC offset by country (standard time, no DST)
const COUNTRY_TZ: Record<string, number> = {
  IT: 1, FR: 1, DE: 1, ES: 1, NL: 1, BE: 1, AT: 1, CH: 1, PL: 1, CZ: 1,
  HU: 1, HR: 1, SK: 1, SI: 1, SE: 1, NO: 1, DK: 1, RS: 1, BA: 1, ME: 1,
  MK: 1, AL: 1, XK: 1, LU: 1, LI: 1, MC: 1, AD: 1, MT: 1, SM: 1, VA: 1,
  UA: 2, RO: 2, BG: 2, GR: 2, FI: 2, EE: 2, LV: 2, LT: 2, MD: 2, CY: 2,
  EG: 2, ZA: 2, IL: 2, LB: 2, JO: 2, SY: 2,
  GB: 0, IE: 0, PT: 0, IS: 0, GH: 0, SN: 0, MA: 1,
  TR: 3, RU: 3, BY: 3, SA: 3, IQ: 3, KW: 3, QA: 3, BH: 3, YE: 3,
  AE: 4, OM: 4, GE: 4, AM: 4, AZ: 4, MU: 4,
  PK: 5, UZ: 5, TM: 5, TJ: 5, MV: 5,
  IN: 5.5, LK: 5.5, NP: 5.75,
  BD: 6, KG: 6, BT: 6, KZ: 6, MM: 6.5,
  TH: 7, VN: 7, ID: 7, KH: 7, LA: 7,
  CN: 8, SG: 8, MY: 8, PH: 8, HK: 8, TW: 8, BN: 8,
  JP: 9, KR: 9, TL: 9,
  AU: 10, PG: 10, GU: 10,
  NZ: 12, FJ: 12,
  US: -5, CA: -5, // Eastern (most populous), adjusted per city below
  MX: -6, CR: -6, SV: -6, GT: -6, HN: -6, NI: -6, BZ: -6,
  CO: -5, PE: -5, EC: -5, PA: -5, CU: -5, JM: -5, HT: -5,
  BR: -3, AR: -3, UY: -3, SR: -3, GF: -3,
  CL: -4, VE: -4, BO: -4, PY: -4, DO: -4, PR: -4,
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=8&addressdetails=1&accept-language=it,en`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NumerologyApp/1.0 (educational)' },
    })
    if (!res.ok) return NextResponse.json([])
    const data = await res.json()

    const results = data
      .filter((r: any) => r.type === 'city' || r.type === 'town' || r.type === 'village' || r.type === 'administrative' || r.type === 'hamlet' || r.class === 'place' || r.class === 'boundary')
      .slice(0, 6)
      .map((r: any) => {
        const addr = r.address || {}
        const city = addr.city || addr.town || addr.village || addr.hamlet || r.name || ''
        const state = addr.state || ''
        const country = addr.country || ''
        const cc = (addr.country_code || '').toUpperCase()
        const parts = [city, state, country].filter(Boolean)
        const lat = parseFloat(r.lat)
        const lon = parseFloat(r.lon)

        // Determine base timezone
        let tz = COUNTRY_TZ[cc]
        if (tz === undefined) {
          // Fallback: estimate from longitude
          tz = Math.round(lon / 15)
        }

        // US/CA timezone refinement by longitude
        if (cc === 'US' || cc === 'CA') {
          if (lon < -115) tz = -8       // Pacific
          else if (lon < -100) tz = -7  // Mountain
          else if (lon < -85) tz = -6   // Central
          else tz = -5                   // Eastern
        }
        // Russia timezone refinement
        if (cc === 'RU') {
          if (lon < 40) tz = 3         // Moscow
          else if (lon < 55) tz = 4    // Samara
          else if (lon < 70) tz = 5    // Yekaterinburg
          else if (lon < 85) tz = 6    // Omsk
          else if (lon < 100) tz = 7   // Krasnoyarsk
          else if (lon < 115) tz = 8   // Irkutsk
          else if (lon < 130) tz = 9   // Yakutsk
          else if (lon < 145) tz = 10  // Vladivostok
          else tz = 11                  // Magadan
        }
        // Indonesia refinement
        if (cc === 'ID') {
          if (lon < 115) tz = 7       // WIB
          else if (lon < 135) tz = 8  // WITA
          else tz = 9                  // WIT
        }
        // Australia refinement
        if (cc === 'AU') {
          if (lon < 130) tz = 8        // AWST (Perth)
          else if (lon < 140) tz = 9.5 // ACST (Adelaide)
          else tz = 10                  // AEST (Sydney)
        }

        return {
          display: parts.join(', '),
          lat,
          lon,
          country: cc,
          tz,
        }
      })

    return NextResponse.json(results)
  } catch {
    return NextResponse.json([])
  }
}
