import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Sheet from '../components/Sheet'
import Reveal, { Rule, RevealGroup, RevealItem } from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'
import Waveform from '../components/Waveform'

/* ---------------------------------------------------------------------------
   DIRECTION CONTRACT — "The Controlled Copy"

   THESIS: This is the app's controlled specification document, not a landing
   page about an app. It refuses the category arrangement it replaced: centred
   hero, angled phone mockup, icon feature-card grid, gradient CTA.

   OWN-WORLD: Cyanotype blue drenched ground, white drafting lettering, one
   survey orange meaning action or approval. Square corners, no shadows, no
   glass. Depth from line weight, tonal recess and 45° hatching.

   STORY: A visitor reads a spec'd, versioned, finished piece of software, sees
   that access is issued rather than open, and requests issue.

   FIRST VIEWPORT: Drawn sheet frame; the claim set as the drawing title at
   display scale; the real screenshot as FIG. 1, the drawing's subject; the
   app's actual figures pinned around it as dimension callouts. Primary action
   sits directly under the title.

   FORM: Technical standards document, candidate 5 of the grounded list, seed
   key 9c0436ff, staged as a drawing sheet with title block.
   --------------------------------------------------------------------------- */

/* The app's real, measured specification. These are the figures that already
   appeared on the site — presented here as what they are: measurements. */
const SPEC = [
  { value: '320', unit: 'kbps', label: 'Max bitrate' },
  { value: '0', unit: '', label: 'Trackers' },
  { value: '100', unit: '%', label: 'Ad-free' },
  { value: '7.0', unit: '+', label: 'Android' },
]

/* Numbered clauses, not feature cards. Each is a capability the shipped APK
   actually has. */
const CLAUSES = [
  {
    title: 'Background playback',
    body: 'Full lock-screen and notification controls, powered by Media3 and ExoPlayer. Music keeps going when you leave the app.',
  },
  {
    title: 'Synced lyrics',
    body: 'Karaoke-style lyrics that scroll and highlight the current line. Tap any line to jump straight to it.',
  },
  {
    title: 'Offline downloads',
    body: 'Save tracks as original M4A, or convert to MP3 on-device with full metadata embedded.',
  },
  {
    title: 'Real equalizer',
    body: 'Five-band EQ plus bass boost, wired straight into the Android audio pipeline.',
  },
  {
    title: 'Make it yours',
    body: 'Pick from seven accent colours, or let Material You match the app to your wallpaper.',
  },
  {
    title: 'Playlists & library',
    body: 'Liked songs, listening history, and your own playlists — all stored locally on your device.',
  },
  {
    title: 'Built for dark',
    body: 'A true OLED-friendly dark theme, with an optional light mode that is just as considered.',
  },
  {
    title: 'Updates in-app',
    body: 'The app checks this site on launch and tells you the moment a new version ships.',
  },
  {
    title: 'Genuinely fast',
    body: 'Native Kotlin and Jetpack Compose throughout. No web views, no bridges, no lag.',
  },
]

const DATA_HANDLING = [
  'No advertising or ad SDKs',
  'No third-party analytics or tracking',
  'No account required to use the app',
  'Library data never leaves your device',
  'Open about exactly what it downloads',
]

/**
 * Counts a figure up to its measured value when it first scrolls into view —
 * an instrument settling on a reading. Keeps any non-numeric suffix and
 * matches the source's decimals. Renders verbatim under reduced motion.
 */
function Reading({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()

  const match = /^([\d.]+)(.*)$/.exec(value)
  // Derive only primitives from the match — the array itself is a fresh object
  // each render and must never land in the effect deps below.
  const isNumeric = match != null
  const target = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : ''
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0

  const [text, setText] = useState(
    !isNumeric || reduce ? value : `0${decimals ? '.' + '0'.repeat(decimals) : ''}${suffix}`,
  )

  useEffect(() => {
    if (!isNumeric || reduce || !inView) return
    const controls = animate(0, target, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(`${v.toFixed(decimals)}${suffix}`),
    })
    return () => controls.stop()
  }, [inView, reduce, isNumeric, target, suffix, decimals])

  return <span ref={ref}>{!isNumeric || reduce ? value : text}</span>
}

/** A measurement with a leader line running to the subject it measures. */
function Callout({ value, unit, label }) {
  return (
    <div className="flex items-center gap-4 border-b border-rule-soft py-4 last:border-b-0">
      <div className="flex w-24 shrink-0 items-baseline gap-1">
        <span className="font-mono text-2xl font-bold tabular-nums text-chalk">
          <Reading value={value} />
        </span>
        {unit && <span className="font-mono text-[0.6875rem] text-chalk-3">{unit}</span>}
      </div>
      <span className="callout-line" aria-hidden="true" />
      <span className="label shrink-0">{label}</span>
    </div>
  )
}

export default function Home() {
  const { user, isApproved } = useAuth()

  return (
    <Sheet label="Specification — MusicStream for Android">
      {/* ---------------- Title field ---------------- */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <div>
          <SectionLabel index={1}>Subject</SectionLabel>

          <h1 className="drawing-title mt-6">
            Your music.
            <br />
            No ads.
            <br />
            No noise.
          </h1>

          <p className="mt-8 max-w-xl font-sans text-base leading-[1.7] normal-case text-chalk-2">
            A fast, native music player for Android — background playback, synced lyrics, a
            real equalizer and offline downloads. Built in Kotlin, with nothing between you
            and the music.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to={user ? '/download' : '/signup'} className="btn btn-issue">
              {user ? 'Go to download' : 'Request issue'}
            </Link>
            <Link to="/docs" className="btn btn-line">
              Read the manual
            </Link>
          </div>

          {/* Access stated as document control, not as fine print. */}
          <div className="mt-10 max-w-md border border-rule bg-sheet-deep">
            <div className="plate-hd">
              <span className="label">Document control</span>
            </div>
            <div className="px-4 py-3.5">
              <p className="font-mono text-[0.6875rem] leading-[1.8] tracking-[0.06em] text-chalk-2">
                {isApproved
                  ? 'This copy is controlled. The current build is issued to your account.'
                  : 'Issue is controlled. Access is granted per account by the developer; this copy is uncontrolled until yours is approved.'}
              </p>
            </div>
          </div>
        </div>

        {/* FIG. 1 — the drawing's subject. Presented flat and framed, the way a
            document presents a figure, not floating at a three-quarter angle. */}
        <figure className="m-0">
          <div className="border border-rule bg-sheet-deep p-3">
            <img
              src="/Home.jpeg"
              alt="The MusicStream app's home screen, showing Quick Picks, Trending Now and Made For You sections."
              width={1080}
              height={2340}
              /* Above the fold: load eagerly and early rather than lazily. */
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="block w-full"
            />
          </div>
          <figcaption className="mt-3 flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] font-bold tracking-[0.18em] text-stamp">
              FIG. 1
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            <span className="label">Home screen, as shipped</span>
          </figcaption>
        </figure>
      </div>

      {/* ---------------- Measured specification ---------------- */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel index={2}>Measured specification</SectionLabel>
        </Reveal>
        <Rule className="mt-5" />

        <div className="mt-2 grid gap-x-14 sm:grid-cols-2">
          {SPEC.map((s) => (
            <Callout key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ---------------- Capabilities ---------------- */}
      <section className="mt-20">
        <Reveal className="max-w-2xl">
          <SectionLabel index={3}>Capabilities</SectionLabel>
          <h2 className="sheet-heading mt-5">Everything you expect. Nothing you don't.</h2>
          <p className="mt-5 font-sans text-base normal-case leading-[1.7] text-chalk-2">
            Built as a proper Android app, not a wrapped website — so it feels fast, behaves
            correctly, and respects the platform.
          </p>
        </Reveal>

        {/* Numbered clauses in a ruled register. Rows butt against shared rules;
            no cards, no icons, no equal-height grid of tiles. */}
        <RevealGroup className="reg mt-10">
          <div className="reg-hd grid grid-cols-[3rem_1fr] gap-4 sm:grid-cols-[4rem_16rem_1fr]">
            <span>No.</span>
            <span>Capability</span>
            <span className="hidden sm:block">Description</span>
          </div>

          {CLAUSES.map((c, i) => (
            <RevealItem key={c.title}>
              <div className="reg-row grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-1 sm:grid-cols-[4rem_16rem_1fr]">
                <span className="font-mono text-[0.875rem] font-bold tabular-nums text-stamp">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="min-w-0 font-sans text-base font-bold uppercase tracking-[0.04em] text-chalk">
                  {c.title}
                </h3>
                <p className="col-start-2 min-w-0 font-sans text-base normal-case leading-[1.7] text-chalk-2 sm:col-start-3">
                  {c.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ---------------- Data handling ---------------- */}
      <section className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <SectionLabel index={4}>Data handling</SectionLabel>
          <h2 className="sheet-heading mt-5">Your library stays on your phone</h2>
          <p className="mt-5 font-sans text-base normal-case leading-[1.7] text-chalk-2">
            Liked songs, playlists and listening history are stored locally on your device
            using Android DataStore. There is no cloud sync, no account inside the app, and
            no analytics SDK bundled in.
          </p>
          <p className="mt-4 font-sans text-base normal-case leading-[1.7] text-chalk-2">
            The only network calls the app makes are for music data, artwork, lyrics,
            optional region detection, and checking this site for updates.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="plate">
            <div className="plate-hd">
              <span className="label">Verified conditions</span>
            </div>
            {DATA_HANDLING.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border-b border-rule-soft px-4 py-3.5 last:border-b-0"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 bg-checked"
                />
                <span className="font-sans text-base normal-case text-chalk-2">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------------- Issue ---------------- */}
      <section className="mt-20">
        <Reveal>
          <div className="border border-rule bg-sheet-deep">
            <div className="plate-hd justify-between">
              <span className="label">Issue</span>
              <Waveform
                bars={16}
                height={14}
                barWidth={2}
                gap={3}
                barClassName="bg-rule"
                className="hidden sm:flex"
              />
            </div>
            <div className="p-6 sm:p-10">
              <h2 className="sheet-heading max-w-xl">Sign in and start playing.</h2>
              <p className="mt-5 max-w-xl font-sans text-base normal-case leading-[1.7] text-chalk-2">
                Sign in with an approved account to download the latest build. Access is
                invite-only — ask the developer to add your email.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={user ? '/download' : '/signup'} className="btn btn-issue">
                  {user ? 'Go to download' : 'Request issue'}
                </Link>
                <Link to="/changelog" className="btn btn-line">
                  Revision history
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </Sheet>
  )
}
