-- ============================================================================
-- Publish MusicStream 2.2.1
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
--     MusicStream-v2.2.1-20201.apk
--
-- Values computed from the local build on 22 Jul 2026:
--   apk_size (bytes): 207878133
--   SHA-256: c26fe01695cf7cc76b6032a1d4aca699caf8ddf80c642896592bf8fde3689539
-- After uploading, verify the object matches:
--   curl -sI https://pub-cec11addff5f4d68a3cc6df91976c697.r2.dev/MusicStream-v2.2.1-20201.apk
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
  20201,
  '2.2.1',
  'MusicStream 2.2.1',
  $notes$- Offline mode: download songs and play them with no internet, from a new Downloads library
- 10-band graphic equalizer with custom presets (up from 5 bands)
- Location-aware Quick Picks — recommendations tuned to your region
- Smarter search: descriptive queries (e.g. "Bengali Adhunik songs") now return results
- Open an artist's page by tapping their name on Now Playing
- Fixes: reliable playback on launch, no accidental track skips on the seek bar, and back returns to your search$notes$,
  -- Case-sensitive: must match the R2 object name exactly.
  'https://pub-cec11addff5f4d68a3cc6df91976c697.r2.dev/MusicStream-v2.2.1-20201.apk',
  207878133,
  -- SHA-256 of the local MusicStream-v2.2.1-20201.apk. Valid only if the file you
  -- upload to R2 is byte-identical to this build. A wrong value makes every update
  -- fail with "Checksum mismatch"; set to null to skip the integrity check.
  --   (Get-FileHash .\MusicStream-v2.2.1-20201.apk -Algorithm SHA256).Hash.ToLower()
  'c26fe01695cf7cc76b6032a1d4aca699caf8ddf80c642896592bf8fde3689539',
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
