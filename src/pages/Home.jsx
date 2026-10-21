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
  Heart,
  ArrowRight,
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
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-ink leading-[1.1] sm:leading-[1.08]">
            Your music,
            <br />
            <span className="text-primary">No Ads, No Trackers.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed text-ink-2 max-w-2xl font-normal">
            MusicStream is a fast, native Android music Streaming player with background playback,
            liquid glass Material design, 10-band equalizer, and in-app updates.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3.5">
            <Link
              to={user ? '/download' : '/signup'}
              className="btn btn-primary w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 text-sm font-semibold flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>{user ? 'Download APK' : 'Request Access'}</span>
            </Link>

            <Link
              to="/support"
              className="btn w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-semibold flex items-center justify-center gap-2.5 rounded-full border border-rose-200/90 dark:border-rose-900/50 bg-rose-50/70 hover:bg-rose-100/90 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-200 transition-all shadow-2xs group"
            >
              <Heart className="h-4 w-4 text-rose-500 fill-rose-500/30 group-hover:fill-rose-500 group-hover:scale-110 transition-transform" />
              <span>Support</span>
            </Link>

            <Link
              to="/docs"
              className="btn btn-secondary w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 text-sm font-semibold flex items-center justify-center gap-2.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read documentation</span>
            </Link>
          </div>

          {/* Platform Pills row with all key features */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-2.5 sm:px-3 py-1 text-ink-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Android 7.0+
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-2.5 sm:px-3 py-1 text-ink-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Real 10-Band EQ
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-2.5 sm:px-3 py-1 text-ink-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Liquid Glass UI
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-2.5 sm:px-3 py-1 text-ink-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              100% Ad-Free
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-card px-2.5 sm:px-3 py-1 text-ink-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              In-App Updates
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- 2. FEATURES SECTION ("What the app does") ---------------- */}
      <section id="features" className="container-x mt-16 sm:mt-28 lg:mt-36 scroll-mt-24">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#4A7854] dark:text-primary">
            FEATURES
          </span>
          <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-ink">
            What the app does
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-ink-2 max-w-2xl">
            Built with native Kotlin and Jetpack Compose. Everything you expect, nothing you don't.
          </p>
        </div>

        {/* 3x2 Grid with pastel geometric icon badges */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
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
      <section id="screens" className="container-x mt-16 sm:mt-28 lg:mt-36 scroll-mt-24">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#4A7854] dark:text-primary">
            INTERFACE TOUR
          </span>
          <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-ink">
            Screens from {currentVersion}
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-ink-2 max-w-2xl">
            Clean views from the current release, running in pure native high fidelity.
          </p>
        </div>

        {/* Responsive 4-Column Grid: fits 100% inside container on desktop without cutting off */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
      <section className="container-x mt-14 sm:mt-24 lg:mt-32">
        <div className="relative rounded-[24px] sm:rounded-[36px] bg-[#C1E5A5] dark:bg-[#1A3821] text-[#1B3E21] dark:text-[#EEF5EE] p-5 sm:p-10 lg:p-12 overflow-hidden shadow-sm">
          {/* Subtle organic background wave contours */}
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#AEDE8E] dark:bg-[#254C2D] opacity-50 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-0 left-1/3 w-64 h-64 rounded-full bg-[#D4F0BE] dark:bg-[#1E4125] opacity-40 blur-xl"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
            {/* Left side details */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1B3E21]/10 dark:bg-white/10 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-[#1B3E21] dark:text-[#A8F0BC] mb-2.5 sm:mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1B3E21] dark:bg-[#52c46f]" />
                Latest Release
              </span>
              <h3 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1B3E21] dark:text-white">
                Get MusicStream {currentVersion}
              </h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#315738] dark:text-[#B2C9B5] font-medium">
                Released {latestRelease?.published_at || 'July 2026'} • SHA-256 Checksum verified
              </p>

              <div className="mt-6 hidden lg:block">
                <Link
                  to="/changelog"
                  className="btn bg-[#1B3E21] text-white hover:bg-[#122B17] dark:bg-[#2C5235] dark:hover:bg-[#386643] px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-all"
                >
                  All downloads & changelog
                </Link>
              </div>
            </div>

            {/* Right side download card - Universal APK */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <Link
                to={user ? '/download' : '/signup'}
                className="flex items-center justify-between rounded-2xl bg-white/90 dark:bg-[#122216]/90 backdrop-blur-sm p-4 sm:p-5 text-[#1B3E21] dark:text-[#EEF5EE] border border-white/70 dark:border-white/10 hover:bg-white dark:hover:bg-[#162A1B] transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D8F0D0] dark:bg-[#1E3D26] text-[#1B3E21] dark:text-[#A8F0BC] group-hover:scale-105 transition-transform">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-sm sm:text-base font-bold truncate">Universal APK</h5>
                    <p className="text-xs text-[#415746] dark:text-[#A8C2AC] truncate">
                      Compatible with all Android 7.0+
                    </p>
                  </div>
                </div>
                <div className="ml-3 flex h-9 sm:h-10 px-3.5 sm:px-4 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#1B3E21] dark:bg-[#52c46f] text-white dark:text-[#0b150d] text-xs font-bold group-hover:scale-105 transition-all shadow-xs">
                  <Download className="h-3.5 w-3.5" />
                  <span>{user ? 'Download' : 'Get APK'}</span>
                </div>
              </Link>

              {/* Mobile-only Changelog button */}
              <div className="lg:hidden mt-1">
                <Link
                  to="/changelog"
                  className="btn w-full bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/15 text-[#1B3E21] dark:text-white py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 border border-black/5 dark:border-white/10 transition-colors"
                >
                  All downloads & changelog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4.5 SUPPORT & DONATE CALLOUT SECTION ---------------- */}
      <section className="container-x mt-14 sm:mt-24 lg:mt-28">
        <div className="rounded-[24px] sm:rounded-[36px] border border-rose-200/80 dark:border-rose-900/40 bg-gradient-to-br from-rose-50/50 via-card to-card dark:from-rose-950/20 dark:via-card dark:to-card p-5 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xs">
          <div
            className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-rose-200/30 dark:bg-rose-900/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/80 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-rose-700 dark:text-rose-300">
                <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                Support Development
              </span>
              <h3 className="mt-2.5 sm:mt-3 font-display text-xl sm:text-3xl font-extrabold tracking-tight text-ink">
                Help keep MusicStream free & open-source
              </h3>
              <p className="mt-2 text-xs sm:text-base text-ink-2 leading-relaxed">
                MusicStream is 100% ad-free with zero trackers or subscriptions. If you enjoy using the player, support continued development with a quick UPI contribution.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <Link
                to="/support"
                className="btn w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 justify-center rounded-full text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 shadow-sm hover:shadow-md transition-all group"
              >
                <Heart className="h-4 w-4 fill-white/30 group-hover:fill-white group-hover:scale-110 transition-transform" />
                <span>Support via UPI</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. FAQ / ACCORDION SECTION ---------------- */}
      <section id="faq" className="container-x mt-16 sm:mt-28 lg:mt-36 scroll-mt-24">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#4A7854] dark:text-primary">
            FAQ
          </span>
          <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-ink-2 max-w-2xl">
            Frequently asked questions about access, installation, and privacy.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-8 sm:mt-10 max-w-3xl space-y-3">
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
                  className="flex w-full items-center justify-between p-4 sm:p-6 text-left font-display text-sm sm:text-base font-bold text-ink hover:text-primary transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="min-w-0 pr-2">{faq.q}</span>
                  <div className="ml-2 sm:ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sheet text-ink-2">
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
