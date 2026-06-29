-- ═══════════════════════════════════════════════════════════
-- Elliss — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════


-- ─── PROFILES ───────────────────────────────────────────────
-- Extends the built-in auth.users table with app-specific fields.
-- A row is auto-created when a user signs up (via trigger below).

create table public.profiles (
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
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS: users can only read/update their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- ─── VOLUNTEER SIGNUPS ──────────────────────────────────────
-- Tracks when a user registers for a volunteer event.

create table public.volunteer_signups (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  event_id      integer not null,           -- matches EVENTS[].id in mock data (future: FK to events table)
  event_title   text not null,
  org_name      text not null,
  event_date    text,
  event_time    text,
  status        text check (status in ('confirmed', 'cancelled', 'waitlisted')) default 'confirmed',
  created_at    timestamptz default now()
);

alter table public.volunteer_signups enable row level security;

create policy "Users can view own signups"
  on public.volunteer_signups for select
  using (auth.uid() = user_id);

create policy "Users can insert own signups"
  on public.volunteer_signups for insert
  with check (auth.uid() = user_id);

create policy "Users can update own signups"
  on public.volunteer_signups for update
  using (auth.uid() = user_id);


-- ─── DONATIONS ──────────────────────────────────────────────
-- Records each completed donation. Stripe payment ID stored for reconciliation.

create table public.donations (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references auth.users(id) on delete cascade not null,
  org_id            integer not null,         -- matches ORGS[].id
  org_name          text not null,
  amount_cents      integer not null,         -- store in cents to avoid float issues
  currency          text default 'usd',
  stripe_payment_id text,                     -- filled in once Stripe is wired
  status            text check (status in ('completed', 'pending', 'failed', 'refunded')) default 'completed',
  created_at        timestamptz default now()
);

alter table public.donations enable row level security;

create policy "Users can view own donations"
  on public.donations for select
  using (auth.uid() = user_id);

create policy "Users can insert own donations"
  on public.donations for insert
  with check (auth.uid() = user_id);


-- ─── COURSE ENROLLMENTS ─────────────────────────────────────
-- Tracks when a user enrolls in a course through Elliss.

create table public.course_enrollments (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  course_id     integer not null,            -- matches COURSES[].id
  course_title  text not null,
  provider      text not null,
  status        text check (status in ('enrolled', 'in_progress', 'completed', 'dropped')) default 'enrolled',
  enrolled_at   timestamptz default now(),
  completed_at  timestamptz
);

alter table public.course_enrollments enable row level security;

create policy "Users can view own enrollments"
  on public.course_enrollments for select
  using (auth.uid() = user_id);

create policy "Users can insert own enrollments"
  on public.course_enrollments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own enrollments"
  on public.course_enrollments for update
  using (auth.uid() = user_id);


-- ─── PROGRAM APPLICATIONS ───────────────────────────────────
-- Logs when a user submits or starts an application for a program.

create table public.program_applications (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  program_id    integer not null,            -- matches PROGRAMS[].id
  program_name  text not null,
  agency        text not null,
  status        text check (status in ('started', 'submitted', 'approved', 'denied', 'pending')) default 'submitted',
  notes         text,
  created_at    timestamptz default now()
);

alter table public.program_applications enable row level security;

create policy "Users can view own applications"
  on public.program_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.program_applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.program_applications for update
  using (auth.uid() = user_id);


-- ─── RESOURCE CONTACTS ──────────────────────────────────────
-- Lightweight log: user tapped "Call" or "Get Help" on a resource.

create table public.resource_contacts (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  resource_id   integer not null,            -- matches RESOURCES[].id
  resource_name text not null,
  category      text,
  action        text check (action in ('call', 'visit', 'get_help')) default 'get_help',
  created_at    timestamptz default now()
);

alter table public.resource_contacts enable row level security;

create policy "Users can view own contacts"
  on public.resource_contacts for select
  using (auth.uid() = user_id);

create policy "Users can insert own contacts"
  on public.resource_contacts for insert
  with check (auth.uid() = user_id);
