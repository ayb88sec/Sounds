-- Najma: family stars board. Run once in Supabase (SQL editor).
-- A child's iPad can see, for its own family only: each child's name, picture, colour and how many items they finished per lesson.
create or replace function family_board(tok text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare d devices;
begin
  select * into d from devices where token_hash = encode(digest(tok,'sha256'),'hex');
  if d is null then raise exception 'unknown device'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'id', c.id, 'name', c.data->'name', 'nameAr', c.data->'nameAr', 'avatar', c.data->'avatar', 'color', c.data->'color',
      'counts', coalesce((select jsonb_object_agg(p.app_key, (select count(*) from jsonb_object_keys(p.data)))
                          from progress p where p.child_id = c.id and jsonb_typeof(p.data) = 'object'), '{}'::jsonb)))
    from children c where c.family_id = d.family_id), '[]'::jsonb);
end $$;
grant execute on function family_board(text) to anon, authenticated;
