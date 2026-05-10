-- admin_roles: maps auth users to a role.
-- No dependencies. Run this before any table that restricts by role.

create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role    text not null check (role in ('full-admin', 'guest-admin'))
);
