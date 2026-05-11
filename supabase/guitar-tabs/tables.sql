-- Depends on: storage/buckets.sql (for the 'guitar-tabs' bucket)

create table if not exists public.genres (
  id          uuid        default gen_random_uuid() primary key,
  name        text        not null unique,
  description text,
  created_by  uuid        references auth.users(id) on delete set null,
  created_at  timestamptz default now()
);

create table if not exists public.tunings (
  id         uuid        default gen_random_uuid() primary key,
  name       text        not null unique,
  strings    text        not null,
  created_at timestamptz default now()
);

insert into public.tunings (name, strings) values
  ('Standard',    'E A D G B E'),
  ('Eb Standard', 'Eb Ab Db Gb Bb Eb'),
  ('Drop D',      'D A D G B E'),
  ('Open G',      'D G D G B D'),
  ('DADGAD',      'D A D G A D')
on conflict (name) do nothing;

create table if not exists public.artists (
  id              uuid        default gen_random_uuid() primary key,
  name            text        not null,
  name_translated text        default null,
  genre_id        uuid        references public.genres(id) on delete cascade,
  created_by      uuid        references auth.users(id) on delete set null,
  created_at      timestamptz default now()
);

create table if not exists public.songs (
  id               uuid        default gen_random_uuid() primary key,
  title            text        not null,
  title_translated text        default null,
  artist_id        uuid        references public.artists(id) on delete cascade,
  created_by       uuid        references auth.users(id) on delete set null,
  created_at       timestamptz default now()
);

create table if not exists public.tabs (
  id           uuid        default gen_random_uuid() primary key,
  description  text,
  song_id      uuid        references public.songs(id) on delete cascade,
  tuning_id    uuid        references public.tunings(id) on delete set null,
  capo         integer     check (capo between 1 and 12),
  is_pinned    boolean     not null default false,
  source_type  text        not null check (source_type in ('file', 'link')),
  source_value text        not null,
  created_by   uuid        references auth.users(id) on delete set null,
  created_at   timestamptz default now()
);

create table if not exists public.tab_recents (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  tab_id      uuid        not null references public.tabs(id) on delete cascade,
  accessed_at timestamptz not null default now(),
  primary key (user_id, tab_id)
);
