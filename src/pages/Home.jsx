import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Download,
  BookOpen,
  Headphones,
  Mic2,
  Sliders,
  Palette,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { fetchLatestRelease } from '../lib/supabase'

/* The 6 requested features with playful pastel geometric icon badges */
const FEATURES = [
  {
    title: 'Background Playback',
    description:
      'Full lock-screen and notification controls powered by Media3 and ExoPlayer. Music keeps playing smoothly when your screen is locked or you navigate away.',
    icon: Headphones,
    badgeBg: 'bg-[#D8F0D0] dark:bg-[#1E3D26]',
    badgeText: 'text-[#2F6A3E] dark:text-[#A8F0BC]',
    shape: 'rounded-full',
  },
  {
    title: 'Material Theme & Liquid Glass Effect',
    description:
      'Adaptive Material You wallpaper extraction combined with a sophisticated liquid glass blur effect and curated vibrant accent palettes.',
    icon: Palette,
    badgeBg: 'bg-[#D5F2EE] dark:bg-[#16364A]',
    badgeText: 'text-[#1A6B63] dark:text-[#88E2D7]',
    shape: 'rounded-2xl rotate-2',
  },
  {
    title: 'Synced Lyrics',
    description:
      'Karaoke-style synchronized lyrics that scroll and highlight in real time. Tap any lyric line to instantly seek playback to that verse.',
    icon: Mic2,
    badgeBg: 'bg-[#D2EBF7] dark:bg-[#183547]',
    badgeText: 'text-[#1D6085] dark:text-[#88CDEF]',
    shape: 'rounded-2xl -rotate-2',
  },
  {
    title: 'Ads & Trackers Free',
    description:
      '100% ad-free listening with zero telemetry or tracking SDKs. Your liked songs, playlists, and listening history stay strictly on your device.',
    icon: ShieldCheck,
    badgeBg: 'bg-[#FDE2E4] dark:bg-[#4D2025]',
    badgeText: 'text-[#8C3A45] dark:text-[#FCA5A5]',
    shape: 'rounded-full',
  },
  {
    title: 'Real 10-band EQ',
    description:
      'Hardware-accelerated 10-band graphic equalizer with dedicated bass boost, virtualizer, and custom sound profile presets wired into Android audio.',
    icon: Sliders,
    badgeBg: 'bg-[#E2F0D8] dark:bg-[#203D26]',
    badgeText: 'text-[#2A5C34] dark:text-[#96E4A8]',
    shape: 'rounded-2xl',
  },
  {
    title: 'With In App Update Feature',
    description:
      'Automatic over-the-air update check on launch via lightweight API. Smooth one-tap update prompt installs new versions seamlessly over the existing build.',
    icon: RefreshCw,
    badgeBg: 'bg-[#F2F6CE] dark:bg-[#3C421B]',
    badgeText: 'text-[#556925] dark:text-[#D9E67B]',
    shape: 'rounded-2xl rotate-3',
  },
]

/* 4 Screens — clean app captures without mobile mockups */
const SCREENS = [
  {
    id: 'now-playing',
    title: 'Now Playing',
    caption: 'Ambient album glow, synced lyrics, and playback controls',
    src: '/Play1.png',
  },
  {
    id: 'home',
    title: 'Home & Quick Picks',
    caption: 'Recent playback, trending selections, and recommendations',
    src: '/Home1.png',
  },
  {
    id: 'artist',
    title: 'Artist & Discography',
    caption: 'Full artist albums, singles, and top played tracks',
    src: '/Artist1.png',
  },
  {
    id: 'equalizer',
    title: 'Equalizer & Audio FX',
    caption: '10-band graphic EQ, bass booster, and sound presets',
    src: '/EQ1.png',
  },
]

/* FAQ Questions */
const FAQS = [
  {
    q: 'How do I get approved to download the app?',
    a: "MusicStream is currently distributed via private invite. Simply create an account on the sign-up page with your email. The developer reviews incoming requests in the admin console. Once approved, you can immediately sign in and download the latest verified APK.",
  },
  {
    q: 'Why does Android say "Allow from this source" when installing?',
    a: 'Because MusicStream is distributed directly as an APK outside Google Play, Android protects your security by asking you to permit installations from your web browser. In Android Settings, toggle "Allow from this source" for your browser, then tap Install. It is safe and 100% ad-free.',
  },
  {
    q: 'Does MusicStream contain any ads, tracking, or telemetry?',
    a: 'No. MusicStream has zero advertisement SDKs, zero third-party telemetry, and zero user analytics. The app only contacts servers for music playback streams, lyrics, album artwork, and version update checks.',
  },
  {
    q: 'Can I download songs for offline listening?',
    a: 'Yes! Any track or album can be downloaded with a single tap. MusicStream saves original M4A streams or can convert them to MP3 on-device with all metadata and high-resolution cover art embedded.',
  },
  {
    q: 'How does the in-app automatic update check work?',
    a: 'Every time the app launches, it queries the lightweight, unauthenticated endpoint on this website (/api/latest). If a newer version code is published, the app displays a smooth update banner allowing you to update in one tap.',
  },
  {
    q: 'Is my listening data or library uploaded to any cloud?',
    a: 'No. Your liked tracks, listening history, cache, and custom playlists are stored solely on your physical device using Android DataStore and local storage. No user accounts or personal profiles exist inside the app.',
  },
  {
    q: 'Which Android versions and architectures are supported?',
    a: 'MusicStream requires Android 7.0 (Nougat, API 24) or newer. It supports 64-bit ARM devices (arm64-v8a) as well as 32-bit devices (armeabi-v7a).',
  },
]

export default function Home() {
  const { user } = useAuth()
  const [latestRelease, setLatestRelease] = useState(null)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    fetchLatestRelease()
      .then((rel) => setLatestRelease(rel))
      .catch(() => { })
  }, [])

  const currentVersion = latestRelease?.version_name || '3.0.2'

  return (
    <div className="pb-16 pt-8 sm:pt-14 overflow-hidden">
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="container-x">
        <div className="max-w-3xl">
          {/* Main Title with crystal clear dark/light mode visibility */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-ink leading-[1.08]">
            Your music,
            <br />
            <span className="text-primary">No Ads, No Trackers.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink-2 max-w-2xl font-normal">
            MusicStream is a fast, native Android music player with background playback,
            liquid glass Material design, 10-band equalizer, and in-app updates.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              to={user ? '/download' : '/signup'}
              className="btn btn-primary px-7 py-3.5 text-sm font-semibold flex items-center gap-2.5 shadow-sm hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>{user ? 'Download APK' : 'Request Access'}</span>
            </Link>

            <Link
              to="/docs"
              className="btn btn-secondary px-7 py-3.5 text-sm font-semibold flex items-center gap-2.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read documentation</span>
            </Link>
          </div>

          {/* Platform Pills row with all key features */}
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-3 py-1 text-ink-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Android 7.0+
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-3 py-1 text-ink-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Real 10-Band EQ
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-3 py-1 text-ink-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Liquid Glass UI
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-3 py-1 text-ink-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              100% Ad-Free
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-3 py-1 text-ink-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              In-App Updates
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- 2. FEATURES SECTION ("What the app does") ---------------- */}
      <section id="features" className="container-x mt-28 sm:mt-36 scroll-mt-24">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#4A7854] dark:text-primary">
            FEATURES
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            What the app does
          </h2>
          <p className="mt-3 text-base text-ink-2 max-w-2xl">
            Built with native Kotlin and Jetpack Compose. Everything you expect, nothing you don't.
          </p>
        </div>

        {/* 3x2 Grid with pastel geometric icon badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {FEATURES.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex flex-col items-start group">
                {/* Playful pastel shaped badge */}
                <div
                  className={`flex h-12 w-12 items-center justify-center ${item.badgeBg} ${item.badgeText} ${item.shape} shadow-xs transition-transform group-hover:scale-110 duration-200`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------------- 3. SCREENS SHOWCASE (Screens from 3.0.2 - Fixed no cut off, clean screenshots) ---------------- */}
      <section id="screens" className="container-x mt-28 sm:mt-36 scroll-mt-24">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#4A7854] dark:text-primary">
            INTERFACE TOUR
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            Screens from {currentVersion}
          </h2>
          <p className="mt-3 text-base text-ink-2 max-w-2xl">
            Clean views from the current release, running in pure native high fidelity.
          </p>
        </div>

        {/* Responsive 4-Column Grid: fits 100% inside container on desktop without cutting off */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SCREENS.map((screen) => (
            <div key={screen.id} className="flex flex-col group">
              {/* Clean app capture without mobile mockup frame */}
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-rule/80 dark:border-white/10 bg-card shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <img
                  src={screen.src}
                  alt={screen.title}
                  className="w-full aspect-[9/20] object-cover object-top transition-transform duration-500 group-hover:scale-[1.00]"
                  loading="lazy"
                />
              </div>

              <div className="mt-4 px-1">
                <h4 className="font-display text-sm sm:text-base font-bold text-ink">{screen.title}</h4>
                <p className="mt-1 text-xs text-ink-3 leading-snug">{screen.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 4. DOWNLOAD BANNER CARD ---------------- */}
      <section className="container-x mt-28 sm:mt-36">
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-[#C1E5A5] dark:bg-[#1A3821] text-[#1B3E21] dark:text-[#EEF5EE] p-8 sm:p-12 overflow-hidden shadow-sm">
          {/* Subtle organic background wave contours */}
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#AEDE8E] dark:bg-[#254C2D] opacity-50 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-0 left-1/3 w-64 h-64 rounded-full bg-[#D4F0BE] dark:bg-[#1E4125] opacity-40 blur-xl"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side details */}
            <div className="lg:col-span-7">
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Get MusicStream {currentVersion}
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-[#315738] dark:text-[#B2C9B5] font-medium">
                Released {latestRelease?.published_at || 'July 2026'} • SHA-256 Checksum verified
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={user ? '/download' : '/signup'}
                  className="btn bg-[#1B3E21] text-white hover:bg-[#122B17] px-7 py-3.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 shadow-md"
                >
                  <Download className="h-4 w-4" />
                  <span>{user ? 'Download latest APK' : 'Request access to download'}</span>
                </Link>

                <Link
                  to="/changelog"
                  className="btn bg-[#A8D588] text-[#1B3E21] dark:bg-[#2C5235] dark:text-white hover:bg-[#97C577] px-6 py-3.5 rounded-full text-sm font-semibold"
                >
                  All downloads & changelog
                </Link>
              </div>
            </div>

            {/* Right side architecture download option - Universal APK */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <Link
                to={user ? '/download' : '/signup'}
                className="flex items-center justify-between rounded-2xl bg-[#E8F8DB] dark:bg-[#142919] p-5 sm:p-6 text-[#1B3E21] dark:text-[#EEF5EE] border border-[#B3DC94] dark:border-[#27462B] hover:bg-white dark:hover:bg-[#1E3B24] transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4F0BE] dark:bg-[#1E4125] text-[#2A5C34] dark:text-[#78C587] group-hover:scale-105 transition-transform">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="text-base font-bold">Universal APK</h5>
                    <p className="text-xs text-[#415746] dark:text-[#A8C2AC] mt-0.5">
                      Compatible with all devices (Android 7.0+)
                    </p>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C1E5A5] text-[#1B3E21] group-hover:scale-110 group-hover:bg-[#1B3E21] group-hover:text-white transition-all shadow-2xs">
                  <Download className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. FAQ / ACCORDION SECTION ---------------- */}
      <section id="faq" className="container-x mt-28 sm:mt-36 scroll-mt-24">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#4A7854] dark:text-primary">
            FAQ
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <p className="mt-3 text-base text-ink-2 max-w-2xl">
            Frequently asked questions about access, installation, and privacy.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-10 max-w-3xl space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-rule bg-card-subtle overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left font-display text-base font-bold text-ink hover:text-primary transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <div className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sheet text-ink-2">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-6 sm:px-6 pt-1 text-sm leading-relaxed text-ink-2 border-t border-rule/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
