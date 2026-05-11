-- Storage object policies.
-- Depends on: storage/buckets.sql
--
-- All admin writes go through API routes using the service role key,
-- which bypasses RLS — no INSERT/DELETE policies needed for photos or docs.
-- guitar-tabs is a private bucket; authenticated read is needed for signed URL generation.

drop policy if exists "Auth insert photos"         on storage.objects;
drop policy if exists "Auth update photos"         on storage.objects;
drop policy if exists "Auth delete photos"         on storage.objects;
drop policy if exists "Public read photos storage" on storage.objects;
drop policy if exists "Auth insert docs"           on storage.objects;
drop policy if exists "Auth update docs"           on storage.objects;
drop policy if exists "Auth delete docs"           on storage.objects;
drop policy if exists "Public read docs storage"   on storage.objects;
drop policy if exists "Auth read guitar-tabs"      on storage.objects;
drop policy if exists "Auth insert guitar-tabs"    on storage.objects;
drop policy if exists "Auth delete guitar-tabs"    on storage.objects;

create policy "Auth read guitar-tabs"
  on storage.objects for select to authenticated
  using (bucket_id = 'guitar-tabs' and auth.uid() is not null);

create policy "Auth insert guitar-tabs"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'guitar-tabs' and auth.uid() is not null);
