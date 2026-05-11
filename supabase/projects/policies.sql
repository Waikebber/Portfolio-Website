-- Depends on: projects/tables.sql

alter table public.project_images enable row level security;

grant select on public.project_images to anon;
grant select, insert, update, delete on public.project_images to authenticated;
grant all on public.project_images to service_role;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'project_images' and policyname = 'Public read project images'
  ) then
    create policy "Public read project images"
      on public.project_images for select to public
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'project_images' and policyname = 'Authenticated users can write project images'
  ) then
    create policy "Authenticated users can write project images"
      on public.project_images for all
      using (auth.uid() is not null);
  end if;
end $$;
