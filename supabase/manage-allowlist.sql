-- ============================================================================
-- Managing who can sign up
--
-- Only emails in public.allowed_users can create an account. This is enforced
-- by a trigger on auth.users, so it holds regardless of how the account is
-- created (website, API, curl).
--
-- Run these in the Supabase dashboard: SQL Editor → New query → Run.
-- ============================================================================

-- ---- Who is currently allowed? ---------------------------------------------
select email, note, created_at
from public.allowed_users
order by created_at;

-- ---- Allow someone ---------------------------------------------------------
insert into public.allowed_users (email, note)
values ('argha04deep@gmail.com', 'Developer')
on conflict (email) do nothing;

-- Several at once:
-- insert into public.allowed_users (email, note) values
--   ('tester1@example.com', 'Beta tester'),
--   ('tester2@example.com', 'Beta tester')
-- on conflict (email) do nothing;

-- ---- Revoke someone --------------------------------------------------------
-- Removing them from the allowlist does NOT delete an account they already
-- created — it only blocks NEW sign-ups. To fully remove someone, delete their
-- user in Authentication → Users as well.
-- delete from public.allowed_users where email = 'someone@example.com';

-- ---- Who has actually registered? ------------------------------------------
select
  u.email,
  u.created_at,
  u.last_sign_in_at,
  (u.email_confirmed_at is not null) as confirmed
from auth.users u
order by u.created_at desc;

-- ---- Troubleshooting: sign-up returns HTTP 500 -----------------------------
-- That is the allowlist trigger rejecting the address. Check for a typo or a
-- different address than you expect — the comparison is case-insensitive but
-- otherwise exact (no aliases, no "+tag" matching):
-- select * from public.allowed_users where lower(email) = lower('THE-EMAIL-HERE');
