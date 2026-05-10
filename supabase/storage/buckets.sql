-- Safe to re-run — ON CONFLICT DO NOTHING
-- No dependencies.

insert into storage.buckets (id, name, public)
  values ('photos', 'photos', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('docs', 'docs', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('guitar-tabs', 'guitar-tabs', false)
  on conflict (id) do nothing;
