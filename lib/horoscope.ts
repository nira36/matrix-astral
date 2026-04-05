import horoscopeTexts from './horoscopeTexts.json'

export const ZODIAC_SIGNS = [
  { name: 'Aries',       symbol: '\u2648', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: 'Taurus',      symbol: '\u2649', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: 'Gemini',      symbol: '\u264A', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { name: 'Cancer',      symbol: '\u264B', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { name: 'Leo',         symbol: '\u264C', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: 'Virgo',       symbol: '\u264D', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: 'Libra',       symbol: '\u264E', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { name: 'Scorpio',     symbol: '\u264F', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { name: 'Sagittarius', symbol: '\u2650', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { name: 'Capricorn',   symbol: '\u2651', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: 'Aquarius',    symbol: '\u2652', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: 'Pisces',      symbol: '\u2653', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
] as const

export type ZodiacSignName = (typeof ZODIAC_SIGNS)[number]['name']

/**
 * Returns the zodiac sign for a given birth day/month.
 * Uses precise astronomical boundaries.
 */
export function getZodiacSign(day: number, month: number): typeof ZODIAC_SIGNS[number] {
  for (const sign of ZODIAC_SIGNS) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) return sign
    } else if (sign.startMonth > sign.endMonth) {
      // Capricorn wraps Dec → Jan
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) return sign
    } else {
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) return sign
    }
  }
  // Fallback (should never happen with valid dates)
  return ZODIAC_SIGNS[0]
}

/**
 * Returns the horoscope text for a given sign name and date string (YYYY-MM-DD).
 * Falls back to the sign's "default" text if the date isn't found.
 */
export function getHoroscopeText(signName: ZodiacSignName, dateStr: string): string {
  const signTexts = (horoscopeTexts as Record<string, Record<string, string>>)[signName]
  if (!signTexts) return ''
  return signTexts[dateStr] ?? signTexts['default'] ?? ''
}

/**
 * Formats a Date object to a readable string like "Sunday, April 5, 2026"
 */
export function formatHoroscopeDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Returns YYYY-MM-DD string from a Date object.
 */
export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
