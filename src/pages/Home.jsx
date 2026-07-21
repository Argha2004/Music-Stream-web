import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Download,
  ListMusic,
  Lock,
  Mic2,
  Moon,
  Palette,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Zap,
} from 'lucide-react'
import { buttonVariants } from '@heroui/react'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'
import Waveform from '../components/Waveform'
import { useAuth } from '../context/AuthContext'

/* HeroUI's Button takes no `as` prop, so routed CTAs are react-router Links
   wearing HeroUI's button classes — keeps a real <a> for middle-click. */
const linkBtn = (variant, size = 'lg') => buttonVariants({ variant, size })

const FEATURES = [
  {
    icon: Smartphone,
    title: 'Background playback',
    body: 'Full lock-screen and notification controls, powered by Media3 and ExoPlayer. Music keeps going when you leave the app.',
  },
  {
    icon: Mic2,
    title: 'Synced lyrics',
    body: 'Karaoke-style lyrics that scroll and highlight the current line. Tap any line to jump straight to it.',
  },
  {
    icon: Download,
    title: 'Offline downloads',
    body: 'Save tracks as original M4A, or convert to MP3 on-device with full metadata embedded.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Real equalizer',
    body: 'Five-band EQ plus bass boost, wired straight into the Android audio pipeline.',
  },
  {
    icon: Palette,
    title: 'Make it yours',
    body: 'Pick from seven accent colours, or let Material You match the app to your wallpaper.',
  },
  {
    icon: ListMusic,
    title: 'Playlists & library',
    body: 'Liked songs, listening history, and your own playlists — all stored locally on your device.',
  },
  {
    icon: Moon,
    title: 'Built for dark',
    body: 'A true OLED-friendly dark theme, with an optional light mode that is just as considered.',
  },
  {
    icon: RefreshCw,
    title: 'Updates in-app',
    body: 'The app checks this site on launch and tells you the moment a new version ships.',
  },
  {
    icon: Zap,
    title: 'Genuinely fast',
    body: 'Native Kotlin and Jetpack Compose throughout. No web views, no bridges, no lag.',
  },
]

const STATS = [
  { value: '100%', label: 'Ad-free' },
  { value: '0', label: 'Trackers' },
  { value: '320', label: 'kbps audio' },
  { value: '7.0+', label: 'Android' },
]

const PRIVACY_POINTS = [
  'No advertising or ad SDKs',
  'No third-party analytics or tracking',
  'No account required to use the app',
  'Library data never leaves your device',
  'Open about exactly what it downloads',
]

/** Phone mockup wrapping a real screenshot of the app's home screen. */
function PhoneMockup() {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={reduce ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="relative mx-auto w-[220px] sm:w-[248px] lg:w-[270px]"
    >
      {/* Static coral wash behind the device — no animation, so it never costs
          a frame while scrolling. */}
      <div
        className="absolute -inset-8 rounded-[3rem] bg-accent/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative rounded-[2.5rem] border border-border bg-surface p-2.5 shadow-2xl shadow-black/40">
        {/* The screenshot carries its own status bar, so the frame draws no
            notch — one would sit on top of the real one. */}
        <img
          src="/Home.jpeg"
          alt="The MusicStream app's home screen, showing Quick Picks, Trending Now and Made For You sections."
          width={1080}
          height={2340}
          /* Above the fold: load eagerly and early rather than lazily. */
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="block w-full rounded-[2rem] object-cover"
        />
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const reduce = useReducedMotion()

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden pb-16 pt-12 sm:pt-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-dim">
                <Waveform bars={5} height={14} barWidth={2.5} gap={2} />
                <span className="font-display">Native Android · Invite only</span>
              </div>

              <h1 className="mt-6 text-balance text-[2.6rem] font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-[4.25rem]">
                Your music.
                <br />
                No ads.
                <br />
                <span className="text-accent">No noise.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
                A fast, native music player for Android — background playback, synced
                lyrics, a real equalizer and offline downloads. Built in Kotlin, with
                nothing between you and the music.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to={user ? '/download' : '/signup'} className={linkBtn('primary')}>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  {user ? 'Download the app' : 'Get access'}
                </Link>
                <Link to="/docs" className={linkBtn('outline')}>
                  Read the docs
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <p className="mt-6 flex items-center gap-2 text-sm text-dim">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                Sign-in required — access is limited to approved accounts.
              </p>
            </motion.div>
          </div>

          <PhoneMockup />
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="border-y border-border">
        <div className="container-x">
          <RevealGroup className="grid grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
            {STATS.map((s, i) => (
              <RevealItem
                key={s.label}
                className={`py-8 text-center sm:py-10 ${i % 2 === 1 ? 'border-l border-border sm:border-l-0' : ''} ${
                  i >= 2 ? 'border-t border-border sm:border-t-0' : ''
                }`}
              >
                <p className="font-display text-4xl font-bold tracking-tight text-fg tabular-nums">
                  {s.value}
                </p>
                <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.15em] text-dim">
                  {s.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <SectionLabel index={1}>Features</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you expect.
              <br className="hidden sm:block" /> Nothing you don't.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Built as a proper Android app, not a wrapped website — so it feels fast,
              behaves correctly, and respects the platform.
            </p>
          </Reveal>

          {/* An editorial index, not a card grid. Each entry sits under a
              hairline rule with a two-digit number, so the section reads like a
              spec sheet rather than nine identical glowing tiles. */}
          <RevealGroup className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
            {FEATURES.map(({ icon: Icon, title, body }, i) => (
              <RevealItem key={title} className="group border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <Icon
                    className="h-5 w-5 text-accent transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span className="font-display text-sm font-semibold tabular-nums text-dim">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------- Privacy ---------------- */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionLabel index={2}>Privacy</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Your library stays on your phone
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Liked songs, playlists and listening history are stored locally on your
              device using Android DataStore. There is no cloud sync, no account inside
              the app, and no analytics SDK bundled in.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              The only network calls the app makes are for music data, artwork, lyrics,
              optional region detection, and checking this site for updates.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
              {PRIVACY_POINTS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3.5 bg-surface px-5 py-4 transition-colors hover:bg-elevated"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-sm text-fg">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 sm:px-14">
              <div className="relative max-w-xl">
                <SectionLabel>Ready to listen?</SectionLabel>
                <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
                  Sign in and start playing.
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted">
                  Sign in with an approved account to download the latest build. Access is
                  invite-only — ask the developer to add your email.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link to={user ? '/download' : '/signup'} className={linkBtn('primary')}>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {user ? 'Go to download' : 'Get access'}
                  </Link>
                  <Link to="/changelog" className={linkBtn('outline')}>
                    See what's new
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
