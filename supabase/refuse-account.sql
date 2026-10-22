-- ============================================================================
-- MusicStream — Refuse & Delete Account Procedure + Realtime Publication
--
-- Run this in your Supabase SQL Editor:
-- SQL Editor -> New Query -> Paste & Run.
-- ============================================================================

-- 1. Function to delete a user account safely by administrator
create or replace function public.delete_user_account(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_email text;
begin
  -- Ensure only the administrator can call this
  if not public.is_admin() then
    raise exception 'Unauthorized: Only administrator can delete accounts';
  end if;

  -- Protect developer account
  select email into target_email from auth.users where id = target_user_id;
  if lower(coalesce(target_email, '')) = 'arghadeeppakhira@gmail.com' then
    raise exception 'Cannot delete developer account';
  end if;

  -- 1. Delete from public.profiles
  delete from public.profiles where id = target_user_id;

  -- 2. Delete from auth.users so the user can sign up again cleanly
  delete from auth.users where id = target_user_id;

  return true;
end;
$$;

-- Grant execution to authenticated users (internal is_admin() protects it)
grant execute on function public.delete_user_account(uuid) to authenticated;

-- 2. Ensure admin can delete profiles directly via RLS if needed
drop policy if exists "admin deletes profiles" on public.profiles;
create policy "admin deletes profiles"
  on public.profiles for delete to authenticated
  using (public.is_admin());

-- 3. Add public.profiles to realtime publication so client detects deletions/updates instantly
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
end;
$$;
