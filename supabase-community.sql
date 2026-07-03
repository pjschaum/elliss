-- ════════════════════════════════════════════════════════════
-- Elliss Community — Supabase SQL
-- Run this in the Supabase SQL Editor
-- ════════════════════════════════════════════════════════════

-- ── 1. community_posts table ──────────────────────────────────

create table if not exists public.community_posts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,

  -- Content
  title         text not null check (char_length(title) between 1 and 120),
  body          text not null check (char_length(body) between 1 and 2000),
  category      text not null default 'General'
                  check (category in ('Events', 'Organizations', 'Volunteering', 'General')),

  -- Author display info (denormalized for performance)
  author_name     text,
  author_initials text,
  author_color    text default '#324a7d',

  -- Moderation
  status        text not null default 'published'
                  check (status in ('published', 'pending', 'removed')),

  -- Engagement
  likes         integer not null default 0,
  comments      integer not null default 0,

  -- Timestamps
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for feed ordering
create index if not exists community_posts_created_at_idx
  on public.community_posts (created_at desc);

create index if not exists community_posts_category_idx
  on public.community_posts (category, created_at desc);

create index if not exists community_posts_status_idx
  on public.community_posts (status, created_at desc);

-- ── 2. community_post_likes (prevent duplicate likes) ─────────

create table if not exists public.community_post_likes (
  post_id    uuid references public.community_posts(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- ── 3. community_comments ─────────────────────────────────────

create table if not exists public.community_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.community_posts(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete set null,

  body       text not null check (char_length(body) between 1 and 1000),

  author_name     text,
  author_initials text,
  author_color    text default '#324a7d',

  status     text not null default 'published'
               check (status in ('published', 'removed')),

  created_at timestamptz not null default now()
);

create index if not exists community_comments_post_idx
  on public.community_comments (post_id, created_at asc);

-- ── 4. Auto-update updated_at ─────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_posts_updated_at on public.community_posts;
create trigger community_posts_updated_at
  before update on public.community_posts
  for each row execute procedure public.set_updated_at();

-- ── 5. RPC: increment likes (atomic, prevents race conditions) ─

create or replace function public.increment_post_likes(post_id uuid)
returns void language plpgsql security definer as $$
begin
  -- Only increment if this user hasn't liked it yet
  insert into public.community_post_likes (post_id, user_id)
  values (post_id, auth.uid())
  on conflict do nothing;

  -- Only update count if insert succeeded (row didn't already exist)
  if found then
    update public.community_posts
    set likes = likes + 1
    where id = post_id;
  end if;
end;
$$;

-- ── 6. RPC: increment comment count when comment is added ──────

create or replace function public.increment_post_comment_count()
returns trigger language plpgsql security definer as $$
begin
  update public.community_posts
  set comments = comments + 1
  where id = new.post_id;
  return new;
end;
$$;

drop trigger if exists community_comment_count_trigger on public.community_comments;
create trigger community_comment_count_trigger
  after insert on public.community_comments
  for each row execute procedure public.increment_post_comment_count();

-- ── 7. Row-Level Security ──────────────────────────────────────

alter table public.community_posts  enable row level security;
alter table public.community_post_likes enable row level security;
alter table public.community_comments   enable row level security;

-- community_posts policies
-- Anyone can read published posts
create policy "Public can read published posts"
  on public.community_posts for select
  using (status = 'published');

-- Authenticated users can insert their own posts
create policy "Authenticated users can create posts"
  on public.community_posts for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own posts
create policy "Users can update own posts"
  on public.community_posts for update
  to authenticated
  using (auth.uid() = user_id);

-- Users can delete their own posts
create policy "Users can delete own posts"
  on public.community_posts for delete
  to authenticated
  using (auth.uid() = user_id);

-- community_post_likes policies
create policy "Authenticated users can like posts"
  on public.community_post_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read their own likes"
  on public.community_post_likes for select
  to authenticated
  using (auth.uid() = user_id);

-- community_comments policies
create policy "Public can read published comments"
  on public.community_comments for select
  using (status = 'published');

create policy "Authenticated users can create comments"
  on public.community_comments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own comments"
  on public.community_comments for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.community_comments for delete
  to authenticated
  using (auth.uid() = user_id);

-- ── 8. Populate author info from profiles on post insert ───────
-- This trigger auto-fills author_name/initials/color from the user's profile

create or replace function public.populate_post_author()
returns trigger language plpgsql security definer as $$
declare
  v_display_name text;
  v_initials     text;
begin
  -- Get display name from profiles table if it exists
  select
    coalesce(display_name, full_name, 'Community Member'),
    coalesce(initials, 'CM')
  into v_display_name, v_initials
  from public.profiles
  where id = new.user_id
  limit 1;

  -- Assign sensible defaults if profile not found
  new.author_name     := coalesce(v_display_name, 'Community Member');
  new.author_initials := coalesce(v_initials, 'CM');

  return new;
end;
$$;

drop trigger if exists populate_post_author_trigger on public.community_posts;
create trigger populate_post_author_trigger
  before insert on public.community_posts
  for each row execute procedure public.populate_post_author();
