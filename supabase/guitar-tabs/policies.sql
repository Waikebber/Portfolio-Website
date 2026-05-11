-- Depends on: guitar-tabs/tables.sql

-- Normalized tables
alter table public.genres  enable row level security;
alter table public.tunings enable row level security;
alter table public.artists enable row level security;
alter table public.songs   enable row level security;
alter table public.tabs    enable row level security;

grant select, insert, update, delete on public.genres  to service_role;
grant select, insert, update, delete on public.tunings to service_role;
grant select, insert, update, delete on public.artists to service_role;
grant select, insert, update, delete on public.songs   to service_role;
grant select, insert, update, delete on public.tabs    to service_role;

grant select on public.genres  to authenticated;
grant select on public.tunings to authenticated;
grant select on public.artists to authenticated;
grant select on public.songs   to authenticated;
grant select on public.tabs    to authenticated;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'genres'  and policyname = 'Authenticated read genres') then
    create policy "Authenticated read genres"  on public.genres  for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'tunings' and policyname = 'Authenticated read tunings') then
    create policy "Authenticated read tunings" on public.tunings for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'artists' and policyname = 'Authenticated read artists') then
    create policy "Authenticated read artists" on public.artists for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'songs'   and policyname = 'Authenticated read songs') then
    create policy "Authenticated read songs"   on public.songs   for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'tabs'    and policyname = 'Authenticated read tabs') then
    create policy "Authenticated read tabs"    on public.tabs    for select to authenticated using (true);
  end if;
end $$;

-- tab_recents: per-user access only
alter table public.tab_recents enable row level security;
grant select, insert, update, delete on public.tab_recents to service_role;
grant select, insert, update           on public.tab_recents to authenticated;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'tab_recents' and policyname = 'Users read own recents') then
    create policy "Users read own recents"   on public.tab_recents for select to authenticated using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'tab_recents' and policyname = 'Users insert own recents') then
    create policy "Users insert own recents" on public.tab_recents for insert to authenticated with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'tab_recents' and policyname = 'Users update own recents') then
    create policy "Users update own recents" on public.tab_recents for update to authenticated using (user_id = auth.uid());
  end if;
end $$;
