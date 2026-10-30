-- Najma: make sure ONLY you are the admin. Replace the email, then Run.
-- 1) nobody becomes admin by creating a family
create or replace function create_family(fname text) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare fid uuid;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  insert into families(name) values (coalesce(nullif(fname,''),'My family')) returning id into fid;
  insert into family_members(family_id,user_id,email,role) values (fid, auth.uid(), auth.jwt()->>'email', 'owner');
  return fid;
end $$;
-- 2) the admin list = only your account
delete from admins where user_id not in (select user_id from family_members where lower(email) = lower('YOUR-EMAIL@example.com'));
insert into admins(user_id) select user_id from family_members where lower(email) = lower('YOUR-EMAIL@example.com') on conflict do nothing;
-- 3) check: should show one row, your email
select m.email from admins a join family_members m on m.user_id = a.user_id;
