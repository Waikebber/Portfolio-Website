-- Depends on: photos/tables.sql

alter table public.photos enable row level security;

grant select, insert, update, delete on public.photos to service_role;
grant select on public.photos to anon, authenticated;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'photos' and policyname = 'Public read photos'
  ) then
    create policy "Public read photos"
      on public.photos for select to public
      using (true);
  end if;
end $$;
