-- ============================================================================
-- Publish MusicStream 2.1.3
--
-- Run AFTER schema.sql, in the Supabase dashboard: SQL Editor → New query → Run.
-- This single insert simultaneously:
--   • adds the entry to the website changelog
--   • points the download page at this build
--   • makes installed apps show "Update available" on next launch
--
-- Values verified against the live R2 object on 20 Jul 2026:
--   HTTP 200 · Content-Type: application/vnd.android.package-archive
--   Content-Length: 207833592
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
  20103,
  '2.1.3',
  'MusicStream 2.1.3',
  $notes$- Swipeable Now Playing: artwork, lyrics and up-next queue
- New waveform-style progress bar
- Choose your own accent colour in Settings
- Animated equalizer on the currently playing song
- Smoother iOS-style screen and mini-player transitions
- Pull to refresh on Home
- Updates now come from the MusicStream website$notes$,
  -- Case-sensitive: must match the R2 object name exactly.
  'https://pub-cec11addff5f4d68a3cc6df91976c697.r2.dev/MusicStream-v2.1.3-20103.apk',
  207833592,
  -- Optional integrity check. Leave NULL unless you paste the REAL hash:
  --   (Get-FileHash .\MusicStream-v2.1.3-20103.apk -Algorithm SHA256).Hash.ToLower()
  -- A wrong value makes every update fail with "Checksum mismatch".
  null,
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
