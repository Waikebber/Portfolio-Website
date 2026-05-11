-- Depends on: storage/buckets.sql (for the 'projects' bucket)

create table if not exists public.project_images (
  id                    uuid        default gen_random_uuid() primary key,
  project_id            text        not null,
  image_type            text        not null check (image_type in ('bento', 'display')),
  storage_path          text        not null,
  display_bottom_offset integer     not null default 0,
  uploaded_by           uuid        references auth.users(id) on delete set null,
  uploaded_at           timestamptz default now(),
  unique (project_id, image_type)
);

alter table public.project_images
  add column if not exists display_bottom_offset integer not null default 0;
