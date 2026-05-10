-- reorder_photo: shifts surrounding rows atomically so the unique constraint on
-- display_order is never transiently violated during a reorder operation.
-- Depends on: photos/tables.sql

create or replace function reorder_photo(photo_id uuid, new_order integer)
returns void language plpgsql as $$
declare
  old_order integer;
begin
  select display_order into old_order from public.photos where id = photo_id;
  if old_order is null or old_order = new_order then return; end if;

  if new_order < old_order then
    update public.photos
      set display_order = display_order + 1
      where display_order >= new_order and display_order < old_order and id != photo_id;
  else
    update public.photos
      set display_order = display_order - 1
      where display_order > old_order and display_order <= new_order and id != photo_id;
  end if;

  update public.photos set display_order = new_order where id = photo_id;
end;
$$;

grant execute on function reorder_photo(uuid, integer) to service_role;
