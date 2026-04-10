-- ═══════════════════════════════════════════════════════════════════════════════
-- Cosmic Love Matrix — Initial Schema
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── Profiles ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  username       text unique not null
                   check (username ~ '^[a-z0-9_]{3,24}$'),
  display_name   text,
  avatar_url     text,
  -- Birth data
  birth_date     date not null,
  birth_time     time,
  birth_place    text,
  birth_lat      double precision,
  birth_lon      double precision,
  birth_tz       double precision,       -- UTC offset at birth
  birth_name     text,                   -- full name for numerology
  -- Precomputed identity
  sun_sign       text,
  moon_sign      text,
  rising_sign    text,
  life_path      smallint,
  -- Privacy
  is_public      boolean not null default true,
  show_birth_date boolean not null default false,
  -- Cached chart data (avoids recomputation)
  natal_chart_json jsonb,
  numerology_json  jsonb,
  matrix_json      jsonb,
  -- Timestamps
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles readable by all"
  on profiles for select
  using (is_public = true or id = auth.uid());

create policy "Users can insert own profile"
  on profiles for insert
  with check (id = auth.uid());

create policy "Users can update own profile"
  on profiles for update
  using (id = auth.uid());

-- Auto-set updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ── Friendships ──────────────────────────────────────────────────────────────
create table public.friendships (
  id          uuid primary key default gen_random_uuid(),
  requester   uuid not null references profiles(id) on delete cascade,
  addressee   uuid not null references profiles(id) on delete cascade,
  status      text not null default 'pending'
                check (status in ('pending', 'accepted', 'blocked')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(requester, addressee)
);

create index idx_friendships_addressee_pending
  on friendships(addressee) where status = 'pending';
create index idx_friendships_accepted
  on friendships(requester, status) where status = 'accepted';

alter table public.friendships enable row level security;

create policy "Participants can read friendships"
  on friendships for select
  using (requester = auth.uid() or addressee = auth.uid());

create policy "Authenticated users can send requests"
  on friendships for insert
  with check (requester = auth.uid() and status = 'pending');

create policy "Addressee can accept or block"
  on friendships for update
  using (addressee = auth.uid());

create policy "Either party can delete"
  on friendships for delete
  using (requester = auth.uid() or addressee = auth.uid());

create trigger on_friendships_updated
  before update on public.friendships
  for each row execute function public.handle_updated_at();

-- ── Invite Links ─────────────────────────────────────────────────────────────
create table public.invite_links (
  id         uuid primary key default gen_random_uuid(),
  creator    uuid not null references profiles(id) on delete cascade,
  token      text unique not null default encode(gen_random_bytes(16), 'hex'),
  max_uses   int not null default 1,
  used_count int not null default 0,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

alter table public.invite_links enable row level security;

create policy "Creator manages own invites"
  on invite_links for all
  using (creator = auth.uid());

create policy "Anyone can read invites by token"
  on invite_links for select
  using (true);

-- ── Synastry Cache ───────────────────────────────────────────────────────────
create table public.synastry_cache (
  id          uuid primary key default gen_random_uuid(),
  user_a      uuid not null references profiles(id) on delete cascade,
  user_b      uuid not null references profiles(id) on delete cascade,
  result      jsonb not null,
  computed_at timestamptz not null default now(),
  unique(user_a, user_b)
);

alter table public.synastry_cache enable row level security;

create policy "Participants can read synastry"
  on synastry_cache for select
  using (user_a = auth.uid() or user_b = auth.uid());

create policy "Participants can insert synastry"
  on synastry_cache for insert
  with check (user_a = auth.uid() or user_b = auth.uid());

-- ── Transit Feed ─────────────────────────────────────────────────────────────
create table public.transit_feed (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  feed_date    date not null,
  transit_type text not null,
  title        text not null,
  body         text not null,
  priority     smallint not null default 5,
  metadata     jsonb,
  read_at      timestamptz,
  created_at   timestamptz not null default now(),
  unique(user_id, feed_date, transit_type, title)
);

create index idx_transit_feed_user_date
  on transit_feed(user_id, feed_date desc);

alter table public.transit_feed enable row level security;

create policy "Users read own feed"
  on transit_feed for select
  using (user_id = auth.uid());

create policy "System can insert feed items"
  on transit_feed for insert
  with check (true);  -- service role only in production; Edge Function uses service key

create policy "Users can mark own items read"
  on transit_feed for update
  using (user_id = auth.uid());
