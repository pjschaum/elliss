-- ─────────────────────────────────────────────────────────────────────────────
-- Elliss: User Documents
-- Safe to re-run: uses IF NOT EXISTS / duplicate policy guards
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. user_documents metadata table ────────────────────────────────────────
create table if not exists public.user_documents (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  side            text not null check (side in ('give', 'help')),
  document_type   text not null,
  label           text not null,
  file_name       text not null,
  file_path       text not null,
  file_size       bigint,
  mime_type       text,
  uploaded_at     timestamptz not null default now(),
  note            text
);

create index if not exists user_documents_user_id_idx on public.user_documents(user_id);
create index if not exists user_documents_side_idx    on public.user_documents(user_id, side);

-- ── 2. Row Level Security ────────────────────────────────────────────────────
alter table public.user_documents enable row level security;

do $$ begin
  create policy "Users can view own documents"
    on public.user_documents for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own documents"
    on public.user_documents for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own documents"
    on public.user_documents for update
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can delete own documents"
    on public.user_documents for delete
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- Storage Bucket Policies
-- NOTE: Run these ONLY after creating the "user-documents" bucket in Storage:
--   Dashboard → Storage → New Bucket → Name: "user-documents" → Private → Save
-- ─────────────────────────────────────────────────────────────────────────────

do $$ begin
  create policy "Users can upload own documents"
    on storage.objects for insert
    to authenticated
    with check (
      bucket_id = 'user-documents'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can read own documents"
    on storage.objects for select
    to authenticated
    using (
      bucket_id = 'user-documents'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can delete own documents"
    on storage.objects for delete
    to authenticated
    using (
      bucket_id = 'user-documents'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null; end $$;
