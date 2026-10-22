-- ============================================================================
-- MusicStream — Bug Reports Schema
--
-- Stores bug reports submitted by users from the /report page.
-- The developer can view, resolve, and delete reports from /admin.
-- Resolving a report triggers an email notification to the reporting user.
--
-- Run in the Supabase dashboard: SQL Editor → New query → Run.
-- ============================================================================

create table if not exists public.bug_reports (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users (id) on delete set null,
  user_email          text not null,
  category            text not null default 'general',
  title               text not null,
  description         text not null,
  steps_to_reproduce  text,
  device_info         text,
  app_version         text,
  severity            text not null default 'medium'
                        check (severity in ('low', 'medium', 'high', 'critical')),
  status              text not null default 'pending'
                        check (status in ('pending', 'resolved')),
  created_at          timestamptz not null default now(),
  resolved_at         timestamptz
);

create index if not exists bug_reports_created_at_idx 
  on public.bug_reports (created_at desc);

create index if not exists bug_reports_status_idx 
  on public.bug_reports (status, created_at desc);

alter table public.bug_reports enable row level security;

-- 1. Anyone (authenticated or guest entering their email) can submit a report.
drop policy if exists "anyone can submit bug reports" on public.bug_reports;
create policy "anyone can submit bug reports"
  on public.bug_reports for insert to anon, authenticated
  with check (true);

-- 2. Authenticated users can view their own reports; Admin can view all reports.
drop policy if exists "users read own reports or admin reads all" on public.bug_reports;
create policy "users read own reports or admin reads all"
  on public.bug_reports for select to authenticated, anon
  using (
    (auth.uid() is not null and user_id = auth.uid()) 
    or public.is_admin()
  );

-- 3. Only the admin may update reports.
drop policy if exists "admin updates bug reports" on public.bug_reports;
create policy "admin updates bug reports"
  on public.bug_reports for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 4. Only the admin may delete reports.
drop policy if exists "admin deletes bug reports" on public.bug_reports;
create policy "admin deletes bug reports"
  on public.bug_reports for delete to authenticated
  using (public.is_admin());
