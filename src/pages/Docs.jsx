import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

/**
 * The operating manual, set as numbered clauses.
 *
 * This sheet is Read mode: comprehension and wayfinding outrank expression.
 * The world contributes the clause numbering and the ruled index — both of
 * which are genuine navigation aids here — and then gets out of the way of a
 * 68ch reading column.
 */

const SECTIONS = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'installing', label: 'Installing the app' },
  { id: 'updates', label: 'How updates work' },
  { id: 'playback', label: 'Playback & queue' },
  { id: 'library', label: 'Library & playlists' },
  { id: 'import-playlists', label: 'Import playlist option' },
  { id: 'yt-music-sync', label: 'YouTube Music & Google Sync' },
  { id: 'equalizer', label: 'Equalizer' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'privacy', label: 'Data & privacy' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
]

const clauseNo = (id) => String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, '0')

/** Highlights the clause currently in view in the index. */
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

/** A clause heading carrying its own number, so it can be cited. */
function Clause({ id, children }) {
  return (
    <div className="mb-5 sm:mb-6 mt-10 sm:mt-14 flex items-center gap-2.5 sm:gap-3 border-b border-rule pb-3 first:mt-0">
      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-primary-pill text-primary shrink-0">
        § {clauseNo(id)}
      </span>
      <h2 className="m-0 border-0 p-0 font-display text-xl sm:text-2xl font-bold tracking-tight text-ink min-w-0">
        {children}
      </h2>
    </div>
  )
}

export default function Docs() {
  const active = useActiveSection()

  return (
    <Sheet label="Documentation">
      <Reveal>
        <SectionLabel index={2}>Operating manual</SectionLabel>
        <h1 className="drawing-title mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl">Manual & Guide</h1>
        <p className="mt-2.5 sm:mt-3 max-w-2xl text-sm sm:text-base text-ink-2">
          Everything you need to install, use, and troubleshoot Zuno on Android.
        </p>
      </Reveal>

      <div className="mt-8 sm:mt-12 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        {/* Clause index — sticky on desktop, hidden on mobile so content leads. */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 rounded-3xl border border-rule bg-card-subtle p-4" aria-label="Clause index">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink-3 px-3 pb-3 border-b border-rule">
              Contents
            </p>
            <ul className="mt-3 space-y-1">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`flex items-center gap-2.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active === s.id
                      ? 'bg-primary-pill text-primary font-bold shadow-xs'
                      : 'text-ink-3 hover:text-ink hover:bg-hover'
                      }`}
                  >
                    <span className="font-mono text-[0.6875rem] opacity-70">{String(i + 1).padStart(2, '0')}</span>
                    <span className="truncate">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* min-w-0 is load-bearing: without it a single <pre> sets a min-content
            floor wider than a phone and puts the page into horizontal scroll. */}
        <article className="prose-doc min-w-0 max-w-[68ch]">
          <section id="getting-started">
            <Clause id="getting-started">Getting started</Clause>
            <p>
              Zuno is a native Android music streaming player. It is not distributed through
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
              <strong>Requirements:</strong> Android 7.0 (API 24) or newer, roughly 20 MB
              of free space, and an internet connection for streaming.
            </p>
          </section>

          <section id="installing">
            <Clause id="installing">Installing the app</Clause>
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
            <h3>Also allow Zuno to install apps</h3>
            <p>
              So that in-app updates work later, grant the same permission to Zuno
              itself: <code>Settings → Apps → Zuno → Install unknown apps → Allow</code>.
              Without this, tapping "Update" inside the app appears to do nothing.
            </p>
            <h3>"App not installed" error</h3>
            <p>
              This means an existing Zuno build was signed with a different key.
              Uninstall the old version first, then install again. It's a one-time step —
              future updates install straight over the top.
            </p>
          </section>

          <section id="updates">
            <Clause id="updates">How updates work</Clause>
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
            <pre className="max-w-full overflow-x-auto text-xs sm:text-sm">
              <code>{`{
  "schema": 1,
  "versionCode": 40000,
  "versionName": "4.0.0",
  "name": "Zuno 4.0.0",
  "notes": "- Rebranded to Zuno\\n- Dual streaming engine\\n- Android Auto & YT Music sync",
  "apkUrl": "https://.../zuno-4.0.0-40000.apk",
  "apkSize": 48312764,
  "sha256": "…",
  "minSdk": 24,
  "mandatory": false
}`}</code>
            </pre>
          </section>

          <section id="playback">
            <Clause id="playback">Playback &amp; queue</Clause>
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
            <Clause id="library">Library &amp; playlists</Clause>
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

          <section id="import-playlists">
            <Clause id="import-playlists">Import playlist option</Clause>
            <p>
              Migrating your music from Spotify, Apple Music, YouTube Music, or other services
              is straightforward. Zuno allows you to import existing playlists directly
              using standard CSV spreadsheets or simple plain text (<code>.txt</code>) files.
            </p>

            <h3>How to import a playlist</h3>
            <ol>
              <li>
                Open the <strong>Library</strong> tab in Zuno and tap <strong>Playlists</strong>.
              </li>
              <li>
                Tap the <strong>↓</strong> menu icon in the top corner and select{' '}
                <strong>Import playlist</strong>.
              </li>
              <li>
                Choose <strong>Select file</strong> and browse for your <code>.csv</code> or{' '}
                <code>.txt</code> file using your device's file manager.
              </li>
              <li>
                Review the detected tracks and tap <strong>Import</strong>. Zuno will
                automatically query the streaming catalog and match every track into your new local playlist.
              </li>
            </ol>

            <h3>CSV file format (.csv)</h3>
            <p>
              CSV files are the standard export format generated by tools like Soundiiz,
              TuneMyMusic, or Exportify. The file should include a header row containing track
              and artist column names. Column ordering is flexible:
            </p>
            <pre className="max-w-full overflow-x-auto text-xs sm:text-sm">
              <code>{`Track Name,Artist Name,Album Name
Starboy,The Weeknd,Starboy
Blinding Lights,The Weeknd,After Hours
Levitating,Dua Lipa,Future Nostalgia
Yellow,Coldplay,Parachutes`}</code>
            </pre>
            <p>
              Zuno recognizes common header variations such as <code>Title</code>,{' '}
              <code>Track Name</code>, <code>Song</code>, and <code>Artist</code>.
            </p>

            <h3>Plain text file format (.txt)</h3>
            <p>
              Text files are ideal for fast, manual transfers or custom lists. List each song on a
              new line using a standard <code>Track - Artist</code> or <code>Artist - Track</code> structure:
            </p>
            <pre className="max-w-full overflow-x-auto text-xs sm:text-sm">
              <code>{`The Weeknd - Blinding Lights
Dua Lipa - Levitating
Coldplay - Yellow
Adele - Easy On Me`}</code>
            </pre>

            <h3>Exporting from other provider apps</h3>
            <p>
              If your current music provider doesn't offer direct export options, several free tools
              generate compatible files in seconds:
            </p>
            <ul>
              <li>
                <strong>Spotify:</strong> Open your playlist in free web utilities such as{' '}
                <em>Exportify</em> or <em>Soundiiz</em>, click <strong>Export to CSV</strong>, and transfer the file to your Android phone.
              </li>
              <li>
                <strong>Apple Music &amp; YouTube Music:</strong> Use free migration tools like{' '}
                <em>TuneMyMusic</em> or <em>Soundiiz</em> to download your playlists as CSV or text files.
              </li>
            </ul>

            <h3>Matching &amp; local storage</h3>
            <p>
              During import, Zuno searches for the closest high-quality official audio stream
              for each song. If an item cannot be found, a summary report lists the skipped tracks so
              you can search for alternatives manually. Like all playlists in Zuno, imported
              playlists are stored locally on your device with complete privacy.
            </p>
          </section>

          <section id="yt-music-sync">
            <Clause id="yt-music-sync">YouTube Music &amp; Google Account Sync</Clause>
            <p>
              Zuno features direct Google Account integration, allowing you to connect
              your YouTube Music account to synchronize your personal library, custom playlists
              (including private, unlisted, and public playlists), Liked Songs, and your YouTube channel profile.
            </p>

            <h3>How to connect your Google Account</h3>
            <ol>
              <li>
                Open the <strong>Settings</strong> or <strong>About</strong> section in Zuno.
              </li>
              <li>
                Under the <strong>YouTube Music Account</strong> banner, tap <strong>Connect Account</strong> (or <strong>Sign in with Google</strong>).
              </li>
              <li>
                A secure in-app Google authentication browser will open. Log in with your standard Google or YouTube account credentials.
              </li>
              <li>
                Once verified, your YouTube Music channel name andhandle will display on the About and Account screens.
              </li>
            </ol>

            <h3>What gets synchronized</h3>
            <ul>
              <li>
                <strong>Private &amp; Public Playlists:</strong> All playlists created or saved on your YouTube Music account are loaded directly into the <strong>Library → Playlists</strong> screen.
              </li>
              <li>
                <strong>Liked Songs:</strong> Your personal YouTube Music &ldquo;Liked Music&rdquo; playlist syncs alongside your local favorites.
              </li>
              <li>
                <strong>Channel Profile:</strong> Your verified YouTube channel name and handle appear on your profile and about screens.
              </li>
              <li>
                <strong>Personalized Recommendations:</strong> In-app discovery and song radios reflect your listening history and preferences.
              </li>
            </ul>

            <h3>Syncing your latest playlists</h3>
            <p>
              To refresh your YouTube Music library after creating or updating playlists on YouTube Music, go to <strong>Library → Playlists</strong> and tap the <strong>Sync / Refresh</strong> button, or pull down to refresh. Zuno fetches updated playlist tracks directly via the YouTube InnerTube API.
            </p>

            <h3>Privacy &amp; Security</h3>
            <p>
              Your Google password and authentication credentials are <strong>never stored</strong> or shared with any third-party servers. Zuno uses isolated session cookies stored purely within your phone&apos;s encrypted private application storage. You can disconnect your Google account at any time with a single tap from <strong>Settings → Sign Out</strong>.
            </p>
          </section>

          <section id="equalizer">
            <Clause id="equalizer">Equalizer</Clause>
            <p>
              Found under <code>Settings → Equalizer</code>. It uses Android's system audio
              effects, so it applies to Zuno's output only.
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
            <Clause id="appearance">Appearance</Clause>
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
            <Clause id="permissions">Permissions</Clause>
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
            <Clause id="privacy">Data &amp; privacy</Clause>
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
            <Clause id="troubleshooting">Troubleshooting</Clause>

            <h3>Sign-up is rejected</h3>
            <p>
              Your email isn't on the access list, or you typed a different address than the
              one approved. Ask the developer to add the exact address.
            </p>

            <h3>The update button does nothing</h3>
            <p>
              Zuno doesn't have permission to install apps. Go to{' '}
              <code>Settings → Apps → Zuno → Install unknown apps</code> and allow it.
            </p>

            <h3>Playback stops when the screen locks</h3>
            <p>
              Your device is aggressively killing background apps. Disable battery
              optimisation for Zuno in your system settings.
            </p>

            <h3>No lyrics for a song</h3>
            <p>
              Lyrics come from a third-party provider and aren't available for every track.
              Where timed lyrics are missing, plain lyrics are shown if they exist.
            </p>

            <h3>Still stuck?</h3>
            <p>
              Note your app version from <code>Settings → Updates</code> and your Android
              version, then{' '}
              <Link to="/report" className="font-semibold underline text-primary hover:text-primary-hover">
                report the issue directly here
              </Link>{' '}
              so the developer can review and resolve it.
            </p>
          </section>
        </article>
      </div>
    </Sheet>
  )
}
