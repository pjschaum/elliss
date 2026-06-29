-- ═══════════════════════════════════════════════════════════
-- Elliss — Volunteer Profile Fields
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════

-- ─── VOLUNTEER PROFILE FIELDS ───────────────────────────────
alter table public.profiles
  add column if not exists phone                    text,
  add column if not exists date_of_birth            date,
  add column if not exists emergency_contact_name   text,
  add column if not exists emergency_contact_phone  text,
  add column if not exists skills                   text[]  default '{}',
  add column if not exists availability             text[]  default '{}',
  add column if not exists background_check_consent boolean default false,
  add column if not exists background_check_status  text    default 'not_started'
    check (background_check_status in ('not_started','pending','cleared','failed')),
  add column if not exists volunteer_profile_complete  boolean default false,
  add column if not exists volunteer_prompt_dismissed  boolean default false;

-- ─── VOLUNTEER_SIGNUPS — add missing columns ─────────────────
alter table public.volunteer_signups
  add column if not exists tier                     integer default 1,
  add column if not exists waiver_agreed            boolean default false,
  add column if not exists background_check_consent boolean;

-- ─── HELP PROFILE FIELDS (for program/course autofill later) ─
alter table public.profiles
  add column if not exists address          text,
  add column if not exists city             text,
  add column if not exists state            text,
  add column if not exists zip              text,
  add column if not exists household_size   integer,
  add column if not exists income_range     text,
  add column if not exists employment_status text,
  add column if not exists help_prompt_dismissed boolean default false;
