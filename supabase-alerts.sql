-- ═══════════════════════════════════════════════════════════
-- Elliss — Alerts Preferences + Notifications Table
-- Safe to re-run: uses IF NOT EXISTS / duplicate policy guards
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
  title       text      not null,
  body        text,
  read        boolean   default false,
  link_to     text,
  created_at  timestamptz default now()
);

alter table public.notifications enable row level security;

do $$ begin
  create policy "Users can view own notifications"
    on public.notifications for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can mark own notifications read"
    on public.notifications for update
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
