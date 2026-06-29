-- ═══════════════════════════════════════════════════════════
-- Elliss — Alerts Preferences + Notifications Table
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════

-- ─── ALERT PREFERENCES on profiles ───────────────────────────
alter table public.profiles
  add column if not exists alert_delivery                   text    default 'in_app'
    check (alert_delivery in ('email', 'sms', 'both', 'in_app')),
  add column if not exists alert_upcoming_events            boolean default true,
  add column if not exists alert_new_events_fav_orgs        boolean default true,
  add column if not exists alert_new_events_fav_causes      boolean default true,
  add column if not exists alert_donation_drives_fav_orgs   boolean default true,
  add column if not exists alert_donation_drives_fav_causes boolean default true;

-- ─── IN-APP NOTIFICATIONS TABLE ──────────────────────────────
create table if not exists public.notifications (
  id          uuid      default gen_random_uuid() primary key,
  user_id     uuid      references auth.users(id) on delete cascade not null,
  type        text      not null,
    -- 'upcoming_event' | 'new_event_fav_org' | 'new_event_fav_cause'
    -- | 'donation_drive_fav_org' | 'donation_drive_fav_cause' | 'system'
  title       text      not null,
  body        text,
  read        boolean   default false,
  link_to     text,     -- deep-link path e.g. '/give/event/1'
  created_at  timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can mark own notifications read"
  on public.notifications for update
  using (auth.uid() = user_id);
