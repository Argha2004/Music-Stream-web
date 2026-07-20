-- ============================================================================
-- MusicStream — Supabase schema
--
-- Access model: anyone may sign up. A profile is created automatically with
-- status 'pending'. The developer approves or rejects from the /admin page on
-- the website. Only 'approved' users can reach the download page.
--
-- Safe to re-run. It also migrates away from the older allowlist design and
-- backfills profiles for any accounts that already exist.
--
-- Run in the Supabase dashboard: SQL Editor → New query → Run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Remove the previous allowlist design (blocked sign-up entirely).
-- ---------------------------------------------------------------------------
drop trigger if exists enforce_allowlist_on_signup on auth.users;
drop function if exists public.enforce_allowlist();
drop table if exists public.allowed_users;

-- ---------------------------------------------------------------------------
-- 1. Who is the developer/admin.
--    Change this address to move admin rights to a different account.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'arghadeeppakhira@gmail.com';
$$;

-- ---------------------------------------------------------------------------
-- 2. Profiles — one row per account, carrying the approval status.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  status        text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected')),
  note          text,
  requested_at  timestamptz not null default now(),
  decided_at    timestamptz
);

create index if not exists profiles_status_idx on public.profiles (status, requested_at desc);

alter table public.profiles enable row level security;

-- A user may read only their own row; the admin may read every row.
drop policy if exists "read own profile or admin reads all" on public.profiles;
create policy "read own profile or admin reads all"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- Only the admin may change a status. Users can never approve themselves.
drop policy if exists "admin updates profiles" on public.profiles;
create policy "admin updates profiles"
  on public.profiles for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No insert policy: rows are created by the trigger below (security definer).

-- ---------------------------------------------------------------------------
-- 3. Auto-create a pending profile on sign-up.
--    The developer's own account is approved immediately so you're never
--    locked out of your own admin page.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, status, decided_at)
  values (
    new.id,
    new.email,
    case
      when lower(new.email) = 'arghadeeppakhira@gmail.com' then 'approved'
      else 'pending'
    end,
    case
      when lower(new.email) = 'arghadeeppakhira@gmail.com' then now()
      else null
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. Backfill profiles for accounts created before this migration.
-- ---------------------------------------------------------------------------
insert into public.profiles (id, email, status, decided_at)
select
  u.id,
  u.email,
  case when lower(u.email) = 'arghadeeppakhira@gmail.com' then 'approved' else 'pending' end,
  case when lower(u.email) = 'arghadeeppakhira@gmail.com' then now() else null end
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 5. Releases — drives the changelog page AND the app's update check.
-- ---------------------------------------------------------------------------
create table if not exists public.releases (
  id            bigserial primary key,
  version_code  integer     not null unique,   -- the upgrade decision key
  version_name  text        not null,          -- display only, e.g. "2.1.3"
  name          text        not null,          -- release title
  notes         text        not null default '', -- changelog, one "- item" per line
  apk_url       text        not null,          -- public Cloudflare R2 URL
  apk_size      bigint      not null default 0,
  sha256        text,                          -- optional integrity check
  min_sdk       integer     not null default 24,
  mandatory     boolean     not null default false,
  published     boolean     not null default true, -- unpublish to stage a release
  published_at  date        not null default current_date,
  created_at    timestamptz not null default now()
);

create index if not exists releases_version_code_idx
  on public.releases (version_code desc);

alter table public.releases enable row level security;

-- Public read of PUBLISHED releases. The Android app is unauthenticated, so
-- the anon role must be able to read this for the update check to work.
drop policy if exists "published releases are public" on public.releases;
create policy "published releases are public"
  on public.releases for select to anon, authenticated
  using (published = true);

-- Inserts/updates/deletes: no policy = dashboard/service-role only.
-- See seed-release-2.1.3.sql for how to publish a build.
