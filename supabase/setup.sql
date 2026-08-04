-- ---------------------------------------------------------------------------
--  Supabase one-time setup for the portfolio CV + photo publishing.
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- ---------------------------------------------------------------------------

-- 1) Public buckets (read for everyone, write only via the edge function)
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', true), ('photos', 'photos', true)
on conflict (id) do update set public = excluded.public;

-- 2) Public read policies for both buckets (so visitors can download)
drop policy if exists "public read cvs" on storage.objects;
create policy "public read cvs"
  on storage.objects for select
  using (bucket_id = 'cvs');

drop policy if exists "public read photos" on storage.objects;
create policy "public read photos"
  on storage.objects for select
  using (bucket_id = 'photos');
