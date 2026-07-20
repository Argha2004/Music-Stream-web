import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Download,
  Heart,
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
import { Card, Chip, buttonVariants } from '@heroui/react'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { useAuth } from '../context/AuthContext'

/* HeroUI's Button takes no `as` prop, so routed CTAs are react-router Links
   wearing HeroUI's button classes — keeps a real <a> for middle-click. */
const linkBtn = (variant, size = 'lg') => buttonVariants({ variant, size })

const FEATURES = [
  {
    icon: Smartphone,
    title: 'Background playback',
    body: 'Full lock-screen and notification controls, powered by Media3 and ExoPlayer. Music keeps going when you leave the app.',
    wide: true,
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

/** Slow-drifting colour field behind the hero. Purely decorative. */
function Aurora() {
  const reduce = useReducedMotion()

  const blob = (className, delay) => (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={reduce ? undefined : { x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.1, 0.95, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {blob('left-[8%] top-[-6rem] h-80 w-80 bg-accent/25', 0)}
      {blob('right-[6%] top-[2rem] h-72 w-72 bg-[#7C3AED]/20', 3)}
      {blob('left-[38%] top-[10rem] h-64 w-64 bg-accent-hi/15', 6)}
    </div>
  )
}

/** Phone mockup wrapping a real screenshot of the app's home screen. */
function PhoneMockup() {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
      animate={reduce ? false : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="relative mx-auto w-[270px]"
    >
      {/* Brand glow behind the device. */}
      <div className="absolute -inset-10 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[2.5rem] border border-border bg-surface p-2.5 shadow-2xl"
      >
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
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const reduce = useReducedMotion()

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
        <Aurora />

        <div className="container-x grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Chip color="accent" size="sm" className="gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                Native Android · Invite only
              </Chip>

              <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Your music.
                <br />
                <span className="bg-gradient-to-r from-accent to-accent-hi bg-clip-text text-transparent">
                  No ads. No noise.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
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

              <p className="mt-5 flex items-center gap-2 text-sm text-dim">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                Sign-in required — access is limited to approved accounts.
              </p>
            </motion.div>
          </div>

          <PhoneMockup />
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="border-y border-border bg-surface/40">
        <div className="container-x py-10">
          <RevealGroup className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <RevealItem key={s.label} className="text-center">
                <p className="text-3xl font-extrabold tracking-tight text-accent tabular-nums">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------- Features (bento) ---------------- */}
      <section className="py-24">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-accent">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you expect. Nothing you don't.
            </h2>
            <p className="mt-4 text-muted">
              Built as a proper Android app, not a wrapped website — so it feels fast,
              behaves correctly, and respects the platform.
            </p>
          </Reveal>

          {/* One wide tile + eight standard + a wide CTA tile = 12 units, an
              exact 3x4 bento on desktop with no ragged trailing row. */}
          <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body, wide }) => (
              <RevealItem key={title} className={wide ? 'lg:col-span-2' : undefined}>
                <Card
                  variant="secondary"
                  className="group h-full border border-border p-6 transition-colors duration-300 hover:border-accent/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                  <Card.Title className="mt-5 font-bold">{title}</Card.Title>
                  <Card.Description className="mt-2 text-sm leading-relaxed text-muted">
                    {body}
                  </Card.Description>
                </Card>
              </RevealItem>
            ))}

            <RevealItem className="lg:col-span-2">
              <Card
                variant="transparent"
                className="relative h-full overflow-hidden border border-accent/30 bg-gradient-to-br from-accent/[0.12] to-transparent p-6"
              >
                <Card.Title className="text-lg font-bold">And it stays out of the way</Card.Title>
                <Card.Description className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                  No sign-up walls inside the app, no upsells, no notifications begging you
                  to come back. It plays music.
                </Card.Description>
                <Link
                  to="/docs"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  Read the docs
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Card>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* ---------------- Privacy ---------------- */}
      <section className="border-y border-border bg-surface/40 py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <ShieldCheck className="h-6 w-6 text-accent" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
              Your library stays on your phone
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
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
            <ul className="space-y-3">
              {PRIVACY_POINTS.map((item) => (
                <li key={item}>
                  <Card
                    variant="secondary"
                    className="flex flex-row items-center gap-3 border border-border px-5 py-4"
                  >
                    <Heart className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    <span className="text-sm text-muted">{item}</span>
                  </Card>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="py-24">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center sm:px-12">
              <div
                className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Ready to listen?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-muted">
                  Sign in with an approved account to download the latest build. Access is
                  invite-only — ask the developer to add your email.
                </p>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
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
