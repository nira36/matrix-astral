<<<<<<< HEAD
# Numerology Chart

A modern, dark-themed web app that generates a full numerology chart from a birth date and name.

## Features

- Life Path, Expression, Soul Urge, Personality, Birth Day, and Maturity numbers
- Master numbers 11, 22, 33 preserved throughout all calculations
- Radar chart (Chart.js) for core number overview
- Circular SVG life phase visualization with Masculine & Feminine diagonal axes
- Pinnacle cycles, Challenges, and Life Cycles tables
- Optional Supabase integration for saving readings
- Railway-ready deployment

## Folder Structure

```
numerology-app/
├── app/
│   ├── layout.tsx          # Root layout, meta, fonts
│   ├── page.tsx            # Main page (form + all results)
│   └── globals.css         # Tailwind base + custom animations
├── components/
│   ├── BirthDateInput.tsx  # Auto-formatted DD/MM/YYYY input
│   ├── NumberCard.tsx      # Individual number display with tooltip
│   ├── RadarChart.tsx      # Chart.js radar for core numbers
│   ├── LifePhaseCircle.tsx # Custom SVG circular life phase chart
│   └── Tooltip.tsx         # Hover tooltip
├── lib/
│   ├── numerology.ts       # ALL calculation logic (modular, tweakable)
│   └── supabase.ts         # Optional Supabase client + helpers
├── .env.local.example      # Env var template
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Run Locally

```bash
cd numerology-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables (Optional)

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials to enable reading persistence:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
```

### Supabase Table (if using)

Run in your Supabase SQL editor:

```sql
create table readings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  birth_date text not null,
  name text,
  life_path int,
  expression int,
  soul_urge int,
  personality int
);
```

## Deploy on Railway

1. Push this folder to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo — Railway auto-detects Next.js
4. Add environment variables in Railway dashboard (if using Supabase)
5. Done — Railway handles build (`npm run build`) and start (`npm start`)

**Note:** Railway automatically exposes `PORT`; Next.js picks it up automatically.

## Tweaking Formulas

All numerology logic lives in `lib/numerology.ts`. Key functions:

| Function | What it calculates |
|---|---|
| `reduceNumber(n, keepMaster?)` | Core digit reduction |
| `calcLifePath(day, month, year)` | Life Path number |
| `calcExpression(name)` | Expression from all letters |
| `calcSoulUrge(name)` | Soul Urge from vowels |
| `calcPersonality(name)` | Personality from consonants |
| `calcPinnacles(...)` | 4 Pinnacle cycles with age ranges |
| `calcChallenges(...)` | 4 Challenge numbers |
| `calcLifeCycles(...)` | 3 Life Cycle periods |
| `calculate(dateStr, name)` | Main entry point |

The `LETTER_VALUES` map at the top of `numerology.ts` uses the Pythagorean system. Swap it for Chaldean values if desired.
=======
# CosmicLove-Matrix
Decode the numbers encoded in your birth date and name. Discover your life path, personal strengths, and the cycles shaping your journey.
>>>>>>> 80ed6b410f04ae9040b67fe7a47bf13e80152de7
