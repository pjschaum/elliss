-- ═══════════════════════════════════════════════════════════
-- Elliss — Assistance Profile
-- Run AFTER supabase-profile-update.sql
-- Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════

-- ─── ASSISTANCE PROFILE FIELDS ──────────────────────────────
-- Stores the intake answers used to personalize Help-side results.
-- All columns nullable — users can skip any or all questions.

alter table public.profiles
  add column if not exists ap_for_whom        text,     -- 'myself'|'my_family'|'my_children'|'senior_family_member'|'someone_else'
  add column if not exists ap_situations      text[]  default '{}',  -- e.g. ['veteran','single_parent','housing_crisis']
  add column if not exists ap_education       text,     -- 'no_hs'|'hs_diploma'|'college'|'graduate'
  add column if not exists ap_income          text,     -- 'under_2k'|'2k_4k'|'4k_6k'|'over_6k'|'prefer_not'
  add column if not exists ap_primary_goal    text,     -- 'immediate_help'|'programs'|'skills'|'all'
  add column if not exists ap_language        text    default 'en',   -- synced from localStorage elliss_language
  add column if not exists ap_completed       boolean default false,
  add column if not exists ap_skipped         boolean default false,
  add column if not exists ap_completed_at    timestamptz;

-- RLS is already enabled on profiles from supabase-schema.sql.
-- Existing policies ("Users can view/update own profile") cover these new columns.
-- No additional policies needed.

-- ─── HELPFUL COMMENT ────────────────────────────────────────
-- ap_situations values mirror the SPECIALIZED_OPTIONS keys in HelpFilterSheet.jsx:
--   'veterans', 'disabilities', 'women', 'lgbtq', 'immigrants',
--   'single_parents', 'homeless', 'pregnant', 'justice_involved'
-- Plus 'housing_crisis' as a higher-level situation signal.
