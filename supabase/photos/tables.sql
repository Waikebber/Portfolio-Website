-- Depends on: storage/buckets.sql (for the 'photos' bucket)

create table if not exists public.photos (
  id            uuid        default gen_random_uuid() primary key,
  filename      text        not null,
  location      text        not null,
  region        text        not null,
  country       text        not null,
  display_order integer     not null default 0,
  is_hero       boolean     not null default false,
  uploaded_by   uuid        references auth.users(id) on delete set null,
  created_at    timestamptz default now()
);

alter table public.photos add column if not exists is_hero boolean not null default false;

-- Assign sequential display_order to existing rows (only runs when all are still 0)
do $$ begin
  if (select count(distinct display_order) from public.photos) <= 1 then
    with ordered as (
      select id, row_number() over (order by created_at) as rn
      from public.photos
    )
    update public.photos p
    set display_order = o.rn
    from ordered o
    where p.id = o.id;
  end if;
end $$;

-- Deferrable so the reorder RPC can shift multiple rows without transient conflicts
do $$ begin
  if exists (select 1 from pg_constraint where conname = 'photos_display_order_unique') then
    alter table public.photos drop constraint photos_display_order_unique;
  end if;
  alter table public.photos
    add constraint photos_display_order_unique unique (display_order) deferrable initially deferred;
end $$;
