import { ZODIAC_PATHS } from '@/lib/astrology'
import type { ZodiacSign } from '@/lib/astrology'

interface Props {
  sign: ZodiacSign
  size?: number
  className?: string
  color?: string
}

export default function ZodiacIcon({ sign, size = 14, className = '', color = 'currentColor' }: Props) {
  const paths = ZODIAC_PATHS[sign]
  if (!paths) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}
