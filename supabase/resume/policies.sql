-- Depends on: resume/tables.sql

alter table public.resume enable row level security;

grant select, insert, update, delete on public.resume to service_role;
grant select on public.resume to anon, authenticated;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'resume' and policyname = 'Public read resume'
  ) then
    create policy "Public read resume"
      on public.resume for select to public
      using (true);
  end if;
end $$;
