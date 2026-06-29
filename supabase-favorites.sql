-- ═══════════════════════════════════════════════════════════
-- Elliss — Favorites & Causes
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════

-- ─── FAVORITE CAUSES + ONBOARDING FLAG on profiles ───────────
alter table public.profiles
  add column if not exists favorite_causes        text[]  default '{}',
  add column if not exists onboarding_causes_done boolean default false;

-- ─── FAVORITE ORGS TABLE ─────────────────────────────────────
create table if not exists public.favorite_orgs (
  id           uuid    default gen_random_uuid() primary key,
  user_id      uuid    references auth.users(id) on delete cascade not null,
  org_id       integer not null,
  org_name     text    not null,
  org_initials text,
  org_color    text,
  created_at   timestamptz default now(),
  unique (user_id, org_id)
);

alter table public.favorite_orgs enable row level security;

create policy "Users can view own favorite orgs"
  on public.favorite_orgs for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorite orgs"
  on public.favorite_orgs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorite orgs"
  on public.favorite_orgs for delete
  using (auth.uid() = user_id);
