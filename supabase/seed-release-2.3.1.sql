-- ============================================================================
-- Publish MusicStream 2.3.1
--
-- Run AFTER schema.sql, in the Supabase dashboard: SQL Editor → New query → Run.
-- This single insert simultaneously:
--   • adds the entry to the website changelog
--   • points the download page at this build
--   • makes installed apps show "Update available" on next launch
--
-- PREREQUISITE — upload the APK to R2 FIRST, or the download/update will 404:
--   Cloudflare dashboard → R2 → bucket `musicstream` → Objects → Upload
--   Object name (case-sensitive, must match apk_url exactly):
--     MusicStream-v2.3.1-20301.apk
--
-- Values computed from the local build on 24 Jul 2026:
--   apk_size (bytes): 207936993
--   SHA-256: 64992bfead5b9f01839df46084cbb0131bed9e682fb9271e3275cd576a10bb2f
-- After uploading, verify the object matches:
--   curl -sI https://pub-cec11addff5f4d68a3cc6df91976c697.r2.dev/MusicStream-v2.3.1-20301.apk
--
-- `notes` uses dollar-quoting ($notes$ ... $notes$) so the line breaks are real
-- newlines — no backslash escaping, and no E'' prefix needed.
-- ============================================================================

insert into public.releases (
  version_code,
  version_name,
  name,
  notes,
  apk_url,
  apk_size,
  sha256,
  min_sdk,
  mandatory,
  published
) values (
  20301,
  '2.3.1',
  'MusicStream 2.3.1',
  -- Derived from the app source diff since 2.2.1 (MusicStreamAndroid, commits
  -- through 4f6c6ee "v2.3.1"). One "- item" per line; renders on the changelog.
  $notes$- Fullscreen visualizer: a live audio spectrum that reacts to whatever's playing
- Redesigned Now Playing screen with an ambient glow pulled from the album art
- Search by album — browse results as album cards in a new grid view
- Storage manager: see how much space your downloads use and free it up in a tap
- Equalizer fix: the 10-band EQ no longer lowers the volume, and now behaves the same on every device
- A smoother, more reliable in-app updater$notes$,
  -- Case-sensitive: must match the R2 object name exactly.
  'https://pub-cec11addff5f4d68a3cc6df91976c697.r2.dev/MusicStream-v2.3.1-20301.apk',
  207936993,
  -- SHA-256 of the local MusicStream-v2.3.1-20301.apk. Valid only if the file you
  -- upload to R2 is byte-identical to this build. A wrong value makes every update
  -- fail with "Checksum mismatch"; set to null to skip the integrity check.
  --   (Get-FileHash .\MusicStream-v2.3.1-20301.apk -Algorithm SHA256).Hash.ToLower()
  '64992bfead5b9f01839df46084cbb0131bed9e682fb9271e3275cd576a10bb2f',
  24,
  false,
  true
)
on conflict (version_code) do update set
  version_name = excluded.version_name,
  name         = excluded.name,
  notes        = excluded.notes,
  apk_url      = excluded.apk_url,
  apk_size     = excluded.apk_size,
  sha256       = excluded.sha256,
  published    = excluded.published;

-- Verify it landed:
-- select version_code, version_name, apk_size, published from public.releases;
