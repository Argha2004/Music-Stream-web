import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

const SECTIONS = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'installing', label: 'Installing the app' },
  { id: 'updates', label: 'How updates work' },
  { id: 'playback', label: 'Playback & queue' },
  { id: 'library', label: 'Library & playlists' },
  { id: 'downloads', label: 'Downloads & quality' },
  { id: 'equalizer', label: 'Equalizer' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'privacy', label: 'Data & privacy' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
]

/** Highlights the section currently in view in the sidebar. */
function useActiveSection() {
  const [active, setActive] = useState(SECTIONS[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-88px 0px -70% 0px', threshold: 0 },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return active
}

export default function Docs() {
  const active = useActiveSection()

  return (
    <div className="container-x py-16">
      <Reveal>
        <SectionLabel>Guide</SectionLabel>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Documentation</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Everything you need to install, use and troubleshoot MusicStream on Android.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Sidebar — sticky on desktop, hidden on mobile to keep content first */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24" aria-label="On this page">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-dim">
              On this page
            </p>
            <ul className="space-y-1 border-l border-border">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors duration-200 ${
                      active === s.id
                        ? 'border-accent font-semibold text-accent'
                        : 'border-transparent text-muted hover:border-border hover:text-fg'
                    }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content — max-w keeps line length in the readable 60–75 char range.
            min-w-0 is load-bearing: a grid item defaults to min-width:auto, so
            without it the <pre> blocks set a min-content floor wider than the
            phone and push the whole page into horizontal scroll. */}
        <article className="prose-doc min-w-0 max-w-2xl">
          <section id="getting-started">
            <h2>Getting started</h2>
            <p>
              MusicStream is a native Android music player. It is not distributed through
              the Play Store — you install it directly from this site as an APK.
            </p>
            <p>Access is invite-only. To get in:</p>
            <ol>
              <li>Ask the developer to add your email to the access list.</li>
              <li>
                Create an account on the <Link to="/signup">sign-up page</Link> using that
                exact email address.
              </li>
              <li>Confirm your email, sign in, then open the download page.</li>
            </ol>
            <p>
              <strong>Requirements:</strong> Android 7.0 (API 24) or newer, roughly 100 MB
              of free space, and an internet connection for streaming.
            </p>
          </section>

          <section id="installing">
            <h2>Installing the app</h2>
            <ol>
              <li>
                Sign in and open <Link to="/download">Download</Link>, then tap{' '}
                <strong>Download APK</strong>.
              </li>
              <li>Open the downloaded file from your notification shade or Files app.</li>
              <li>
                Android will warn that your browser isn't allowed to install apps. Tap{' '}
                <strong>Settings</strong> and enable <strong>Allow from this source</strong>.
              </li>
              <li>
                Go back and tap <strong>Install</strong>.
              </li>
            </ol>
            <h3>Also allow MusicStream to install apps</h3>
            <p>
              So that in-app updates work later, grant the same permission to MusicStream
              itself: <code>Settings → Apps → MusicStream → Install unknown apps → Allow</code>.
              Without this, tapping "Update" inside the app appears to do nothing.
            </p>
            <h3>"App not installed" error</h3>
            <p>
              This means an existing MusicStream build was signed with a different key.
              Uninstall the old version first, then install again. It's a one-time step —
              future updates install straight over the top.
            </p>
          </section>

          <section id="updates">
            <h2>How updates work</h2>
            <p>
              The app checks this website for new versions. On launch it fetches a small
              manifest describing the newest published build and compares its version code
              against the installed one.
            </p>
            <p>
              If a newer build exists, a dialog appears with the release notes. Tapping{' '}
              <strong>Update</strong> downloads the APK, verifies its size and checksum,
              and hands it to the Android installer.
            </p>
            <p>
              You can also check manually at any time from{' '}
              <code>Settings → Check for updates</code>. Every published build and its
              notes are listed on the <Link to="/changelog">changelog page</Link>.
            </p>
            <h3>The update endpoint</h3>
            <p>
              For reference, the app polls <code>/api/latest</code>, which returns JSON:
            </p>
            <pre>
              <code>{`{
  "schema": 1,
  "versionCode": 20103,
  "versionName": "2.1.3",
  "name": "MusicStream 2.1.3",
  "notes": "- Swipeable Now Playing\\n- Waveform progress bar",
  "apkUrl": "https://.../musicstream-2.1.3-20103.apk",
  "apkSize": 48312764,
  "sha256": "…",
  "minSdk": 24,
  "mandatory": false
}`}</code>
            </pre>
          </section>

          <section id="playback">
            <h2>Playback &amp; queue</h2>
            <p>
              Playback runs in a foreground service, so audio continues when you leave the
              app or lock the screen. Transport controls appear on your lock screen and in
              the notification shade.
            </p>
            <ul>
              <li>
                <strong>Mini player</strong> — sits above the navigation bar. Tap it to open
                the full Now Playing screen.
              </li>
              <li>
                <strong>Now Playing</strong> — swipe horizontally between artwork, synced
                lyrics, and the up-next queue.
              </li>
              <li>
                <strong>Seeking</strong> — tap or drag anywhere on the waveform progress bar.
              </li>
              <li>
                <strong>Shuffle &amp; repeat</strong> — toggles on the Now Playing controls.
                Repeat cycles off → all → one.
              </li>
              <li>
                <strong>Autoplay radio</strong> — when enabled in Settings, similar songs are
                queued automatically as the queue ends.
              </li>
            </ul>
          </section>

          <section id="library">
            <h2>Library &amp; playlists</h2>
            <p>
              The Library tab holds your favourites, listening history, albums derived from
              liked songs, and your playlists.
            </p>
            <ul>
              <li>
                <strong>Liked Songs</strong> is a built-in playlist. Tap the heart on any
                song to add it.
              </li>
              <li>
                <strong>Custom playlists</strong> — create from the Library tab, then add
                songs via the ⋮ menu on any track.
              </li>
              <li>
                <strong>History</strong> records what you've played so recommendations and
                Quick Picks improve over time.
              </li>
            </ul>
            <p>All of this is stored locally on your device, not in the cloud.</p>
          </section>

          <section id="downloads">
            <h2>Downloads &amp; quality</h2>
            <p>
              Downloaded songs are saved to your device's shared Music library, so any
              other player can read them too.
            </p>
            <ul>
              <li>
                <strong>M4A (AAC)</strong> — the default. Keeps the original audio with no
                re-encoding, so there's no quality loss.
              </li>
              <li>
                <strong>MP3</strong> — converted on-device with FFmpeg, with full metadata
                (title, artist, album, artwork) embedded.
              </li>
              <li>
                <strong>Bitrate</strong> — selectable from 12 to 320 kbps. The source streams
                at up to 320 kbps AAC; lossless is not available.
              </li>
              <li>
                <strong>Folder</strong> — defaults to <code>Music/MusicStream</code>. You can
                pick a different folder in Settings.
              </li>
            </ul>
          </section>

          <section id="equalizer">
            <h2>Equalizer</h2>
            <p>
              Found under <code>Settings → Equalizer</code>. It uses Android's system audio
              effects, so it applies to MusicStream's output only.
            </p>
            <ul>
              <li>Five frequency bands with individual gain sliders.</li>
              <li>A separate bass-boost control.</li>
              <li>Changes apply live — no need to restart playback.</li>
            </ul>
            <p>
              Some devices, particularly certain emulators, don't expose the audio effects
              API. The screen will tell you if that's the case.
            </p>
          </section>

          <section id="appearance">
            <h2>Appearance</h2>
            <ul>
              <li>
                <strong>Theme</strong> — Dark, Light, or follow the system setting.
              </li>
              <li>
                <strong>Accent colour</strong> — seven presets (coral, purple, blue, green,
                teal, amber, pink). Recolours the whole app instantly.
              </li>
              <li>
                <strong>Dynamic Colour</strong> — on Android 12+, derives the palette from
                your wallpaper. While it's on, it overrides the accent picker.
              </li>
            </ul>
          </section>

          <section id="permissions">
            <h2>Permissions</h2>
            <ul>
              <li>
                <strong>Notifications</strong> — required for playback controls in the shade
                (Android 13+).
              </li>
              <li>
                <strong>Approximate location</strong> — optional. Used only to pick
                region-appropriate music recommendations. Decline it and the app falls back
                to a default region.
              </li>
              <li>
                <strong>Install unknown apps</strong> — needed for in-app updates.
              </li>
              <li>
                <strong>Storage</strong> — only on Android 9 and older; newer versions write
                downloads via MediaStore with no permission needed.
              </li>
            </ul>
          </section>

          <section id="privacy">
            <h2>Data &amp; privacy</h2>
            <p>
              Your library — liked songs, playlists, history and settings — is stored
              locally using Android DataStore. There is no account inside the app and no
              cloud sync.
            </p>
            <p>The app contains no advertising SDKs and no third-party analytics. It talks to:</p>
            <ul>
              <li>The music backend, for search, metadata, artwork and audio streams.</li>
              <li>A lyrics provider, when you open the lyrics view.</li>
              <li>OpenStreetMap Nominatim, only if you grant location access.</li>
              <li>This website, to check for updates.</li>
            </ul>
            <p>
              The website itself stores only your email and authentication details, handled
              by Supabase.
            </p>
          </section>

          <section id="troubleshooting">
            <h2>Troubleshooting</h2>

            <h3>Sign-up is rejected</h3>
            <p>
              Your email isn't on the access list, or you typed a different address than the
              one approved. Ask the developer to add the exact address.
            </p>

            <h3>The update button does nothing</h3>
            <p>
              MusicStream doesn't have permission to install apps. Go to{' '}
              <code>Settings → Apps → MusicStream → Install unknown apps</code> and allow it.
            </p>

            <h3>Playback stops when the screen locks</h3>
            <p>
              Your device is aggressively killing background apps. Disable battery
              optimisation for MusicStream in your system settings.
            </p>

            <h3>No lyrics for a song</h3>
            <p>
              Lyrics come from a third-party provider and aren't available for every track.
              Where timed lyrics are missing, plain lyrics are shown if they exist.
            </p>

            <h3>Downloads fail or don't appear</h3>
            <p>
              Check free storage, then confirm the download folder in Settings is still
              accessible. If you picked a custom folder on an SD card that's been removed,
              reset it to the default.
            </p>

            <h3>Still stuck?</h3>
            <p>
              Note your app version from <code>Settings → Updates</code> and your Android
              version, then report the issue to the developer.
            </p>
          </section>
        </article>
      </div>
    </div>
  )
}
