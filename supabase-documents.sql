-- ─────────────────────────────────────────────────────────────────────────────
-- Elliss: User Documents
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. user_documents metadata table ────────────────────────────────────────
create table if not exists public.user_documents (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  side            text not null check (side in ('give', 'help')),
  document_type   text not null,
  label           text not null,           -- human-readable name
  file_name       text not null,           -- original filename
  file_path       text not null,           -- storage path: {user_id}/{side}/{type}/{uuid}.ext
  file_size       bigint,                  -- bytes
  mime_type       text,
  uploaded_at     timestamptz not null default now(),
  note            text                     -- optional user note
);

-- Index for fast per-user lookups
create index if not exists user_documents_user_id_idx on public.user_documents(user_id);
create index if not exists user_documents_side_idx    on public.user_documents(user_id, side);

-- ── 2. Row Level Security ────────────────────────────────────────────────────
alter table public.user_documents enable row level security;

-- Users can only see their own documents
create policy "Users can view own documents"
  on public.user_documents for select
  using (auth.uid() = user_id);

-- Users can insert their own documents
create policy "Users can insert own documents"
  on public.user_documents for insert
  with check (auth.uid() = user_id);

-- Users can update (add notes, rename) their own documents
create policy "Users can update own documents"
  on public.user_documents for update
  using (auth.uid() = user_id);

-- Users can delete their own documents
create policy "Users can delete own documents"
  on public.user_documents for delete
  using (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- Supabase Storage Bucket + Policies
-- Run these AFTER creating the bucket named "user-documents" in the Storage tab:
--   Dashboard → Storage → New Bucket → Name: "user-documents" → Private → Save
-- ─────────────────────────────────────────────────────────────────────────────

-- Users can upload files to their own folder only
create policy "Users can upload own documents"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can read their own files
create policy "Users can read own documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own files
create policy "Users can delete own documents"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- Setup checklist:
-- 1. Run the top section (user_documents table + RLS) in SQL Editor
-- 2. Go to Storage → New Bucket → Name: "user-documents" → toggle Private → Save
-- 3. Run the bottom section (storage policies) in SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────
