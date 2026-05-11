-- Depends on: admin/tables.sql

alter table public.admin_roles enable row level security;

grant select, insert, update, delete on public.admin_roles to service_role;
grant select on public.admin_roles to authenticated;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'admin_roles' and policyname = 'Users read own role'
  ) then
    create policy "Users read own role"
      on public.admin_roles for select to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;
