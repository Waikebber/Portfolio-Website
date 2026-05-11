-- Depends on: storage/buckets.sql (for the 'docs' bucket)

create table if not exists public.resume (
  id           uuid        default gen_random_uuid() primary key,
  filename     text        not null,
  storage_path text        not null,
  uploaded_by  uuid        references auth.users(id) on delete set null,
  uploaded_at  timestamptz default now()
);
