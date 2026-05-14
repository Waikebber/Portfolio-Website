create table if not exists public.onboarding_status (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  invite_clicked_at timestamptz,
  password_set_at   timestamptz,
  totp_enabled_at   timestamptz
);

alter table public.onboarding_status enable row level security;

create policy "users_own_onboarding"
  on public.onboarding_status
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Full admins can read all rows to display onboarding status in the users page
create policy "full_admins_read_all_onboarding"
  on public.onboarding_status
  for select
  using (
    exists (
      select 1 from public.admin_roles
      where user_id = auth.uid() and role = 'full-admin'
    )
  );
