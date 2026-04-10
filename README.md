# Cosmic Love Matrix

Decode the numbers encoded in your birth date and name. Discover your life path, personal strengths, and the cycles shaping your journey.

## Features

- **Numerology** — Life Path, Expression, Soul Urge, Personality, Birth Day, Maturity, and advanced numbers (Hidden Passion, Karmic Lessons, Balance, etc.)
- **Natal Chart** — Full SVG birth chart wheel with planets, houses, aspects, and bi-wheel transits
- **Vedic Astrology** — Nakshatras, Doshas, Dasha periods
- **Chinese Astrology** — Zodiac with elements and compatibility
- **Tarot** — Major & Minor Arcana readings with spreads
- **Destiny Matrix** — Octagram-based geometric numerology with chakra mapping
- **Lunar Cycles** — Moon phase tracking and interpretations
- **Gematria** — Hebrew letter-to-number calculations
- **Social** — Friend connections, invite links, synastry compatibility
- **Auth** — Email/password and Google OAuth via Supabase

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Supabase (Auth + Postgres + RLS)
- Tailwind CSS
- Chart.js
- astronomy-engine

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...
```

## Database

Run the migration in your Supabase SQL editor:

```bash
supabase/migrations/001_initial_schema.sql
```

This creates tables for profiles, friendships, invite links, synastry cache, and transit feed — all with Row Level Security.

## Deploy

1. Push to GitHub
2. Deploy on Vercel / Railway — auto-detects Next.js
3. Set environment variables in dashboard
4. Run Supabase migration
5. Configure Google OAuth in Supabase dashboard
