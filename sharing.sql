-- Najma: sharing between families + admin. Paste all of this into Supabase → SQL Editor → Run (once; safe to run again).

-- 1) the admin: the owner of the first family created (Amna's)
create table if not exists admins (user_id uuid primary key);
alter table admins enable row level security;
insert into admins(user_id)
  select user_id from family_members
  where role = 'owner' and family_id = (select id from families order by created_at limit 1)
  on conflict do nothing;
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public, extensions as $$
  select exists(select 1 from admins where user_id = auth.uid())
$$;
drop policy if exists adm_read on admins;
create policy adm_read on admins for select using (user_id = auth.uid());

-- 2) sections can be shared with every family (admin decides) or proposed to the admin (any family)
alter table sections add column if not exists shared boolean not null default false;
alter table sections add column if not exists proposed boolean not null default false;
create or replace function guard_share() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not is_admin() then
    new.shared := case when tg_op = 'UPDATE' then old.shared else false end;
  end if;
  return new;
end $$;
drop trigger if exists sections_guard_share on sections;
create trigger sections_guard_share before insert or update on sections for each row execute function guard_share();

drop policy if exists secs_all on sections;
drop policy if exists secs_read on sections;
drop policy if exists secs_write on sections;
create policy secs_read on sections for select using (is_member(family_id) or shared or is_admin());
create policy secs_write on sections for all using (is_member(family_id) or is_admin()) with check (is_member(family_id) or is_admin());

-- 3) the admin can see and remove anything
drop policy if exists adm_fam on families;            create policy adm_fam on families for all using (is_admin()) with check (is_admin());
drop policy if exists adm_mem on family_members;      create policy adm_mem on family_members for all using (is_admin()) with check (is_admin());
drop policy if exists adm_kids on children;           create policy adm_kids on children for all using (is_admin()) with check (is_admin());
drop policy if exists adm_prog on progress;           create policy adm_prog on progress for all using (is_admin()) with check (is_admin());
drop policy if exists adm_dev on devices;             create policy adm_dev on devices for all using (is_admin()) with check (is_admin());
drop policy if exists adm_inv on invites;             create policy adm_inv on invites for all using (is_admin()) with check (is_admin());

-- 4) children's iPads also get everything shared with all families
create or replace function kid_sync(tok text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare d devices;
begin
  select * into d from devices where token_hash = encode(digest(tok,'sha256'),'hex');
  if d is null then raise exception 'unknown device'; end if;
  update devices set last_seen = now() where token_hash = d.token_hash;
  return jsonb_build_object(
    'child', (select data || jsonb_build_object('id',id) from children where id = d.child_id),
    'sections', coalesce((select jsonb_agg(data || jsonb_build_object('id',id,'mine',family_id = d.family_id,'shared',shared)
                 order by (family_id = d.family_id), updated_at) from sections where family_id = d.family_id or shared),'[]'::jsonb),
    'progress', coalesce((select jsonb_object_agg(app_key,data) from progress where child_id = d.child_id),'{}'::jsonb));
end $$;

grant execute on function is_admin() to authenticated;
