-- Depends on: admin/tables.sql
-- Automatically assigns 'guest-admin' to every new user created via invite.
-- ON CONFLICT DO NOTHING ensures existing roles (e.g. full-admin) are never overwritten.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.admin_roles (user_id, role)
  values (new.id, 'guest-admin')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
