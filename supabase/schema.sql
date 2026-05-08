-- ============================================================
-- Run this in your Supabase project: SQL Editor → New Query
-- Safe to re-run — uses IF NOT EXISTS / ON CONFLICT DO NOTHING
--
-- Architecture note:
-- All admin writes go through app/api/* routes using the service
-- role key (SUPABASE_SECRET_KEY), which bypasses RLS entirely.
-- RLS write policies are only needed for client-side storage uploads.
-- ============================================================

-- =====================
-- Buckets
-- =====================
insert into storage.buckets (id, name, public)
  values ('photos', 'photos', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('docs', 'docs', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('guitar-tabs', 'guitar-tabs', false)
  on conflict (id) do nothing;

-- =====================
-- Tables
-- =====================
create table if not exists public.photos (
  id            uuid        default gen_random_uuid() primary key,
  filename      text        not null,
  location      text        not null,
  region        text        not null,
  country       text        not null,
  display_order integer     not null default 0,
  created_at    timestamptz default now()
);

create table if not exists public.resume (
  id           uuid        default gen_random_uuid() primary key,
  filename     text        not null,
  storage_path text        not null,
  uploaded_at  timestamptz default now()
);

create table if not exists public.guitar_tabs (
  id           uuid        default gen_random_uuid() primary key,
  title        text        not null,
  tuning       text,
  storage_path text        not null,
  created_at   timestamptz default now()
);

create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role    text not null check (role in ('full-admin', 'guest-admin'))
);

-- =====================
-- Row Level Security
-- =====================
alter table public.photos      enable row level security;
alter table public.resume      enable row level security;
alter table public.guitar_tabs enable row level security;
alter table public.admin_roles enable row level security;

-- Grant service_role DML access (needed for admin API routes that bypass RLS)
grant select, insert, update, delete on public.photos      to service_role;
grant select, insert, update, delete on public.resume      to service_role;
grant select, insert, update, delete on public.guitar_tabs to service_role;
grant select, insert, update, delete on public.admin_roles to service_role;

-- Grant anon/authenticated SELECT for public reads (portfolio page + admin reads)
grant select on public.resume to anon, authenticated;
grant select on public.photos to anon, authenticated;
grant select on public.admin_roles to authenticated;

-- Table policies (public read only — writes handled server-side via admin client)
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'photos' and policyname = 'Public read photos') then
    create policy "Public read photos" on public.photos for select to public using (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'resume' and policyname = 'Public read resume') then
    create policy "Public read resume" on public.resume for select to public using (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'admin_roles' and policyname = 'Users read own role') then
    create policy "Users read own role" on public.admin_roles for select to authenticated using (auth.uid() = user_id);
  end if;
end $$;

-- =====================
-- Storage policies
-- =====================
-- All admin storage writes go through app/api/* routes using the admin client,
-- which bypasses RLS. No INSERT/DELETE policies needed for docs or photos.
-- guitar-tabs is a private bucket — authenticated read needed for signed URL generation.
drop policy if exists "Auth insert photos"         on storage.objects;
drop policy if exists "Auth update photos"         on storage.objects;
drop policy if exists "Auth delete photos"         on storage.objects;
drop policy if exists "Public read photos storage" on storage.objects;
drop policy if exists "Auth insert docs"           on storage.objects;
drop policy if exists "Auth update docs"           on storage.objects;
drop policy if exists "Auth delete docs"           on storage.objects;
drop policy if exists "Public read docs storage"   on storage.objects;
drop policy if exists "Auth read guitar-tabs"      on storage.objects;
drop policy if exists "Auth insert guitar-tabs"    on storage.objects;
drop policy if exists "Auth delete guitar-tabs"    on storage.objects;

create policy "Auth read guitar-tabs"
  on storage.objects for select to authenticated
  using (bucket_id = 'guitar-tabs' and auth.uid() is not null);

create policy "Auth insert guitar-tabs"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'guitar-tabs' and auth.uid() is not null);
