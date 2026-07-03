-- ═══════════════════════════════════════════════════════════
-- Elliss — Supabase Database Schema
-- Safe to re-run: uses IF NOT EXISTS throughout
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════


-- ─── PROFILES ───────────────────────────────────────────────
-- Extends the built-in auth.users table with app-specific fields.
-- A row is auto-created when a user signs up (via trigger below).

create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  full_name     text,
  avatar_url    text,
  mode          text check (mode in ('give', 'help')) default null,
  created_at    timestamptz default now()
);

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

do $$ begin
  create policy "Users can view own profile"
    on public.profiles for select
    using (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);
exception when duplicate_object then null; end $$;


-- ─── VOLUNTEER SIGNUPS ──────────────────────────────────────

create table if not exists public.volunteer_signups (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  event_id      integer not null,
  event_title   text not null,
  org_name      text not null,
  event_date    text,
  event_time    text,
  status        text check (status in ('confirmed', 'cancelled', 'waitlisted')) default 'confirmed',
  created_at    timestamptz default now()
);

alter table public.volunteer_signups enable row level security;

do $$ begin
  create policy "Users can view own signups"
    on public.volunteer_signups for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own signups"
    on public.volunteer_signups for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own signups"
    on public.volunteer_signups for update
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;


-- ─── DONATIONS ──────────────────────────────────────────────

create table if not exists public.donations (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references auth.users(id) on delete cascade not null,
  org_id            integer not null,
  org_name          text not null,
  amount_cents      integer not null,
  currency          text default 'usd',
  stripe_payment_id text,
  status            text check (status in ('completed', 'pending', 'failed', 'refunded')) default 'completed',
  created_at        timestamptz default now()
);

alter table public.donations enable row level security;

do $$ begin
  create policy "Users can view own donations"
    on public.donations for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own donations"
    on public.donations for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;


-- ─── COURSE ENROLLMENTS ─────────────────────────────────────

create table if not exists public.course_enrollments (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  course_id     integer not null,
  course_title  text not null,
  provider      text not null,
  status        text check (status in ('enrolled', 'in_progress', 'completed', 'dropped')) default 'enrolled',
  enrolled_at   timestamptz default now(),
  completed_at  timestamptz
);

alter table public.course_enrollments enable row level security;

do $$ begin
  create policy "Users can view own enrollments"
    on public.course_enrollments for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own enrollments"
    on public.course_enrollments for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own enrollments"
    on public.course_enrollments for update
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;


-- ─── PROGRAM APPLICATIONS ───────────────────────────────────

create table if not exists public.program_applications (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  program_id    integer not null,
  program_name  text not null,
  agency        text not null,
  status        text check (status in ('started', 'submitted', 'approved', 'denied', 'pending')) default 'submitted',
  notes         text,
  created_at    timestamptz default now()
);

alter table public.program_applications enable row level security;

do $$ begin
  create policy "Users can view own applications"
    on public.program_applications for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own applications"
    on public.program_applications for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own applications"
    on public.program_applications for update
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;


-- ─── RESOURCE CONTACTS ──────────────────────────────────────

create table if not exists public.resource_contacts (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  resource_id   integer not null,
  resource_name text not null,
  category      text,
  action        text check (action in ('call', 'visit', 'get_help')) default 'get_help',
  created_at    timestamptz default now()
);

alter table public.resource_contacts enable row level security;

do $$ begin
  create policy "Users can view own contacts"
    on public.resource_contacts for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own contacts"
    on public.resource_contacts for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
