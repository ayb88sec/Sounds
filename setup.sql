-- Najma: one-time database setup. Paste all of this into Supabase → SQL Editor → Run.
-- Families keep their data private: only signed-in members of a family can see it.
-- Children's iPads never sign in; each has its own secret device key that only works for that one child.

create extension if not exists pgcrypto;

create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My family',
  created_at timestamptz default now()
);
create table if not exists family_members (
  family_id uuid references families(id) on delete cascade,
  user_id uuid not null,
  email text,
  role text not null default 'parent' check (role in ('owner','parent')),
  joined_at timestamptz default now(),
  primary key (family_id, user_id)
);
create table if not exists invites (
  code text primary key,
  family_id uuid references families(id) on delete cascade,
  created_by uuid,
  expires_at timestamptz not null default now() + interval '7 days',
  used_by uuid
);
create table if not exists children (
  id text primary key,
  family_id uuid not null references families(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);
create table if not exists sections (
  id text primary key,
  family_id uuid not null references families(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);
create table if not exists progress (
  child_id text references children(id) on delete cascade,
  app_key text not null,
  data jsonb not null default '{}',
  updated_at timestamptz default now(),
  primary key (child_id, app_key)
);
create table if not exists devices (
  token_hash text primary key,
  child_id text not null references children(id) on delete cascade,
  family_id uuid not null references families(id) on delete cascade,
  label text,
  created_at timestamptz default now(),
  last_seen timestamptz
);

-- is the signed-in user a member of this family?
create or replace function is_member(fid uuid) returns boolean
language sql stable security definer set search_path = public, extensions as $$
  select exists(select 1 from family_members where family_id = fid and user_id = auth.uid())
$$;

alter table families enable row level security;
alter table family_members enable row level security;
alter table invites enable row level security;
alter table children enable row level security;
alter table sections enable row level security;
alter table progress enable row level security;
alter table devices enable row level security;

drop policy if exists fam_read on families;
create policy fam_read on families for select using (is_member(id));
drop policy if exists fam_update on families;
create policy fam_update on families for update using (is_member(id));
drop policy if exists mem_read on family_members;
create policy mem_read on family_members for select using (is_member(family_id));
drop policy if exists mem_delete on family_members;
create policy mem_delete on family_members for delete using (
  exists(select 1 from family_members m where m.family_id = family_members.family_id and m.user_id = auth.uid() and m.role = 'owner')
  or user_id = auth.uid());
drop policy if exists inv_all on invites;
create policy inv_all on invites for all using (is_member(family_id)) with check (is_member(family_id));
drop policy if exists kids_all on children;
create policy kids_all on children for all using (is_member(family_id)) with check (is_member(family_id));
drop policy if exists secs_all on sections;
create policy secs_all on sections for all using (is_member(family_id)) with check (is_member(family_id));
drop policy if exists prog_all on progress;
create policy prog_all on progress for all
  using (exists(select 1 from children c where c.id = child_id and is_member(c.family_id)))
  with check (exists(select 1 from children c where c.id = child_id and is_member(c.family_id)));
drop policy if exists dev_all on devices;
create policy dev_all on devices for all using (is_member(family_id)) with check (is_member(family_id));

-- a new parent with no invite starts their own family
create or replace function create_family(fname text) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare fid uuid;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  insert into families(name) values (coalesce(nullif(fname,''),'My family')) returning id into fid;
  insert into family_members(family_id,user_id,email,role) values (fid, auth.uid(), auth.jwt()->>'email', 'owner');
  return fid;
end $$;

-- invite another parent: returns a short code valid for 7 days
create or replace function create_invite(fid uuid) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare c text;
begin
  if not is_member(fid) then raise exception 'not allowed'; end if;
  c := upper(substr(encode(gen_random_bytes(6),'hex'),1,8));
  insert into invites(code,family_id,created_by) values (c,fid,auth.uid());
  return c;
end $$;

-- the other parent signs in, then joins with the code
create or replace function join_family(icode text) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare inv invites;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into inv from invites where code = upper(trim(icode)) and used_by is null and expires_at > now();
  if inv is null then raise exception 'invalid or expired code'; end if;
  insert into family_members(family_id,user_id,email,role) values (inv.family_id, auth.uid(), auth.jwt()->>'email', 'parent')
    on conflict do nothing;
  update invites set used_by = auth.uid() where code = inv.code;
  return inv.family_id;
end $$;

-- make a secret key for one child's iPad (only family members can)
create or replace function create_device(cid text, dlabel text default null) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare fid uuid; tok text;
begin
  select family_id into fid from children where id = cid;
  if fid is null or not is_member(fid) then raise exception 'not allowed'; end if;
  tok := encode(gen_random_bytes(24),'hex');
  insert into devices(token_hash,child_id,family_id,label) values (encode(digest(tok,'sha256'),'hex'), cid, fid, dlabel);
  return tok;
end $$;

-- the child's iPad: get its own child, the family's sections and its saved progress
create or replace function kid_sync(tok text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare d devices;
begin
  select * into d from devices where token_hash = encode(digest(tok,'sha256'),'hex');
  if d is null then raise exception 'unknown device'; end if;
  update devices set last_seen = now() where token_hash = d.token_hash;
  return jsonb_build_object(
    'child', (select data || jsonb_build_object('id',id) from children where id = d.child_id),
    'sections', coalesce((select jsonb_agg(data || jsonb_build_object('id',id) order by updated_at) from sections where family_id = d.family_id),'[]'::jsonb),
    'progress', coalesce((select jsonb_object_agg(app_key,data) from progress where child_id = d.child_id),'{}'::jsonb));
end $$;

-- the child's iPad: save stars for one app (merged with what is already saved)
create or replace function kid_save(tok text, akey text, adata jsonb) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare d devices;
begin
  if length(akey) > 60 or pg_column_size(adata) > 20000 then raise exception 'too big'; end if;
  select * into d from devices where token_hash = encode(digest(tok,'sha256'),'hex');
  if d is null then raise exception 'unknown device'; end if;
  insert into progress(child_id,app_key,data,updated_at) values (d.child_id, akey, adata, now())
    on conflict (child_id,app_key) do update set data = excluded.data, updated_at = now();
end $$;

revoke all on function kid_sync(text) from public;
revoke all on function kid_save(text,text,jsonb) from public;
grant execute on function kid_sync(text), kid_save(text,text,jsonb) to anon, authenticated;
grant execute on function create_family(text), create_invite(uuid), join_family(text), create_device(text,text) to authenticated;

-- ===== sharing between families + admin =====
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
