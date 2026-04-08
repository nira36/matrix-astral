import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#010208',
          card: '#0a0b16',
          elevated: '#0f1122',
        },
        accent: {
          purple: '#7C3AED',   // More saturated, less neon
          indigo: '#4338CA',   // Muted indigo
        },
        masc: '#1E40AF',       // Midnight Blue
        fem: '#9D174D',        // Deep Rose
        pinnacle: '#B45309',   // Amber
        challenge: '#991B1B',  // Garnet
        cycle: '#065F46',      // Dark Jade
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'draw': 'draw 1.5s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'card-arrive': 'cardArrive 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        draw: {
          from: { strokeDashoffset: '1000' },
          to: { strokeDashoffset: '0' },
        },
        cardArrive: {
          from: { opacity: '0', transform: 'translateY(-40px) scale(0.92)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'purple-glow': 'radial-gradient(ellipse at top, #1e1040 0%, #03040d 70%)',
      },
      fontFamily: {
        sans: ['Tenor Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
