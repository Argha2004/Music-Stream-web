import { Shield, Lock, EyeOff, Smartphone, Server, Database, CheckCircle, RefreshCw, Radio, Bell } from 'lucide-react'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

const HIGHLIGHTS = [
  {
    icon: Database,
    title: '100% On-Device Storage',
    desc: 'Your liked songs, custom playlists, listening history, and 10-band EQ presets stay strictly stored on your phone via Android DataStore.',
    badgeBg: 'bg-[#D8F0D0] dark:bg-[#1E3D26]',
    badgeText: 'text-[#2F6A3E] dark:text-[#A8F0BC]',
  },
  {
    icon: EyeOff,
    title: 'Zero Ads & Telemetry',
    desc: 'No advertising SDKs, no behavioral trackers (no Firebase Analytics, no Mixpanel), and no data brokering of any kind.',
    badgeBg: 'bg-[#FDE2E4] dark:bg-[#4D2025]',
    badgeText: 'text-[#8C3A45] dark:text-[#FCA5A5]',
  },
  {
    icon: Lock,
    title: 'No In-App Account Required',
    desc: 'MusicStream does not require an account to use the Android app. Launch the player and enjoy listening with complete anonymity.',
    badgeBg: 'bg-[#D5F2EE] dark:bg-[#16364A]',
    badgeText: 'text-[#1A6B63] dark:text-[#88E2D7]',
  },
  {
    icon: RefreshCw,
    title: 'Transparent Over-The-Air Updates',
    desc: 'In-app update checks only query our public release endpoint for signed version tags and SHA-256 hashes without transmitting device identifiers.',
    badgeBg: 'bg-[#D2EBF7] dark:bg-[#183547]',
    badgeText: 'text-[#1D6085] dark:text-[#88CDEF]',
  },
]

const PERMISSIONS = [
  {
    permission: 'POST_NOTIFICATIONS',
    scope: 'Android 13+ (API 33+)',
    purpose: 'Renders the lock screen and notification shade media controller with album artwork and playback seek controls.',
  },
  {
    permission: 'FOREGROUND_SERVICE_MEDIA_PLAYBACK',
    scope: 'Android 14+ (API 34+)',
    purpose: 'Allows background audio playback to continue uninterrupted when the screen is locked or another app is open.',
  },
  {
    permission: 'WAKE_LOCK',
    scope: 'All versions',
    purpose: 'Prevents CPU sleep during active audio decoding to avoid stuttering and audio dropouts.',
  },
  {
    permission: 'REQUEST_INSTALL_PACKAGES',
    scope: 'Optional / On-demand',
    purpose: 'Permits the app to launch the system package installer when you tap to install a verified in-app OTA update.',
  },
  {
    permission: 'ACCESS_COARSE_LOCATION',
    scope: 'Optional / Strictly On-demand',
    purpose: 'Used only if you explicitly choose to fetch regional trending music charts via OpenStreetMap Nominatim. Never tracked in background.',
  },
]

const ZERO_COLLECTION = [
  'Personal identity, real name, physical address, or phone number',
  'Precise GPS background location or travel trajectories',
  'Advertising Identifier (Google Advertising ID / GAID)',
  'Device biometric data, camera, or microphone recordings',
  'Browser history, contacts, SMS, or external files',
  'Listening analytics, play durations, or personal habits',
]

function ClauseHead({ no, children }) {
  return (
    <div className="mb-4 sm:mb-5 flex items-center gap-2.5 sm:gap-3 border-b border-rule pb-3">
      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-primary-pill text-primary shrink-0">
        § {no}
      </span>
      <h2 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-ink min-w-0">
        {children}
      </h2>
    </div>
  )
}

export default function Privacy() {
  return (
    <Sheet label="Data Privacy & Policy">
      <Reveal className="max-w-3xl">
        <SectionLabel index={5}>Compliance &amp; Trust</SectionLabel>
        <h1 className="drawing-title mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
          Data &amp; Privacy Policy
        </h1>
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-ink-2 leading-relaxed">
          MusicStream is built on the principle of minimal data footprint. We believe your music
          habits, playlists, and listening history belong exclusively to you.
        </p>
        <p className="mt-1 font-mono text-[11px] sm:text-xs text-ink-3">
          Last revised: October 2026 • Effective immediately
        </p>
      </Reveal>

      {/* --- Key Privacy Pillars --- */}
      <section className="mt-8 sm:mt-12 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-rule bg-card p-4 sm:p-6 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.badgeBg} ${item.badgeText}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-ink-2 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* --- § 01: Core Architecture --- */}
      <section className="mt-14 max-w-3xl">
        <ClauseHead no="01">Architecture &amp; On-Device Storage</ClauseHead>
        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-ink-2">
          <p>
            MusicStream is a native Android music client designed from scratch with a local-first
            architecture. Unlike commercial streaming platforms, MusicStream does not maintain a
            remote profile of your tastes.
          </p>
          <p>
            All application state is saved locally on your device using encrypted Android
            Preferences, Jetpack DataStore, and Room databases:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-2 text-sm">
            <li>
              <strong className="text-ink">Liked Songs &amp; Playlists:</strong> Maintained solely on your
              local filesystem.
            </li>
            <li>
              <strong className="text-ink">Listening History &amp; Cache:</strong> Kept in on-device
              app sandbox storage.
            </li>
            <li>
              <strong className="text-ink">10-band Equalizer Presets:</strong> Stored within device
              preferences and wired directly to the Android audio HAL.
            </li>
          </ul>
        </div>
      </section>

      {/* --- § 02: What We Do NOT Collect --- */}
      <section className="mt-12 max-w-3xl">
        <ClauseHead no="02">What We Do NOT Collect</ClauseHead>
        <p className="text-sm sm:text-base leading-relaxed text-ink-2 mb-4">
          To maintain zero data liability, MusicStream contains no third-party tracking libraries,
          advertising networks, or analytics SDKs. We do not gather or sell:
        </p>

        <div className="rounded-2xl border border-rule bg-card overflow-hidden">
          {ZERO_COLLECTION.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 border-b border-rule-soft px-4 sm:px-5 py-3 text-xs sm:text-sm text-ink-2 last:border-b-0"
            >
              <CheckCircle className="h-4 w-4 text-[#2A5C34] dark:text-[#52c46f] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- § 03: External Network Endpoints --- */}
      <section className="mt-12 max-w-3xl">
        <ClauseHead no="03">Network Requests &amp; External Services</ClauseHead>
        <p className="text-sm sm:text-base leading-relaxed text-ink-2 mb-4">
          When using the app, network communication occurs strictly to fulfill playback and display
          operations requested by you:
        </p>

        <div className="space-y-3">
          <div className="rounded-2xl border border-rule bg-card p-4 sm:p-5">
            <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary" />
              Audio Streams &amp; Track Metadata
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm text-ink-2 leading-relaxed">
              When searching or streaming, your device communicates with audio endpoints to stream
              media and retrieve album artwork. No user identifier is attached to these requests.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-card p-4 sm:p-5">
            <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              Synchronized Lyrics (LRCLIB)
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm text-ink-2 leading-relaxed">
              Opening the synced lyrics view performs a read-only search for lyrics matching the
              current song title and artist.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-card p-4 sm:p-5">
            <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              Over-the-Air Update Checks
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm text-ink-2 leading-relaxed">
              The app queries this website (<code className="text-primary font-mono text-xs">/api/latest</code>)
              to determine if a newer version is published. This request carries no personal
              telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* --- § 04: Android Permissions --- */}
      <section className="mt-12 max-w-3xl">
        <ClauseHead no="04">Android Device Permissions</ClauseHead>
        <p className="text-sm sm:text-base leading-relaxed text-ink-2 mb-4">
          MusicStream requests only the minimal Android permissions necessary for standard media
          player operations:
        </p>

        <div className="rounded-2xl border border-rule bg-card overflow-hidden">
          <div className="divide-y divide-rule-soft">
            {PERMISSIONS.map((p) => (
              <div key={p.permission} className="p-3.5 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-primary bg-primary-pill px-2.5 py-0.5 rounded-full break-all">
                    {p.permission}
                  </span>
                  <span className="text-[11px] sm:text-xs text-ink-3 font-mono">{p.scope}</span>
                </div>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-2 leading-relaxed">{p.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- § 05: Web Portal Accounts --- */}
      <section className="mt-12 max-w-3xl">
        <ClauseHead no="05">Distribution Portal Account Data</ClauseHead>
        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-ink-2">
          <p>
            When registering on this website to request access or download APK builds:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>
              <strong className="text-ink">Authentication:</strong> Managed securely by Supabase
              Auth using encrypted credentials. We store only your email address, created timestamp,
              and verification status.
            </li>
            <li>
              <strong className="text-ink">Approvals:</strong> Access decisions (pending, approved,
              revoked) are stored in row-level secured database tables accessible solely by the project
              administrator.
            </li>
            <li>
              <strong className="text-ink">No Tracking Cookies:</strong> The portal uses only essential
              session tokens to keep you logged in. No advertising or cross-site tracking cookies are
              employed.
            </li>
          </ul>
        </div>
      </section>

      {/* --- § 06: Data Control & Deletion --- */}
      <section className="mt-12 max-w-3xl">
        <ClauseHead no="06">Your Data Rights &amp; Deletion</ClauseHead>
        <div className="space-y-3 text-sm sm:text-base leading-relaxed text-ink-2">
          <p>
            Because your in-app data resides entirely on your device, you maintain complete ownership:
          </p>
          <div className="rounded-2xl bg-card-subtle border border-rule p-4 sm:p-5 text-sm space-y-2">
            <p>
              • <strong>To delete in-app data:</strong> Open Android{' '}
              <code>Settings → Apps → MusicStream → Storage → Clear Data</code>. This permanently removes all
              cached tracks, preferences, and local playlists.
            </p>
            <p>
              • <strong>To delete your web portal account:</strong> Contact the project administrator or email
              the developer. Your record and authentication profile will be permanently removed from Database.
            </p>
          </div>
        </div>
      </section>

      {/* --- § 07: Contact --- */}
      <section className="mt-12 max-w-3xl">
        <ClauseHead no="07">Developer &amp; Security Disclosure</ClauseHead>
        <div className="rounded-2xl border border-rule bg-card p-5 sm:p-6 text-sm text-ink-2 leading-relaxed">
          <p>
            If you have questions regarding this privacy policy or would like to report a security
            vulnerability, please reach out via GitHub or directly to:
          </p>
          <p className="mt-3 font-mono text-sm font-bold text-ink">
            Developer: Arghadeep Pakhira
            <br />
            Project: MusicStream
          </p>
        </div>
      </section>
    </Sheet>
  )
}
