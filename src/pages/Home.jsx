import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Sheet from '../components/Sheet'
import Reveal, { Rule, RevealGroup, RevealItem } from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'
import Waveform from '../components/Waveform'
import Figure from '../components/Figure'

/* ---------------------------------------------------------------------------
   DIRECTION CONTRACT — "The Controlled Copy"

   THESIS: This is the app's controlled specification document, not a landing
   page about an app. It refuses the category arrangement it replaced: centred
   hero, angled phone mockup, icon feature-card grid, gradient CTA.

   OWN-WORLD: Warm vellum ground, blue-black drafting line work and lettering,
   one survey vermilion meaning action or approval. Square corners, no shadows,
   no glass. Depth from line weight, tonal recess and 45° hatching.

   STORY: A visitor reads a spec'd, versioned, finished piece of software, sees
   that access is issued rather than open, and requests issue.

   FIRST VIEWPORT: Drawn sheet frame; the claim set as the drawing title at
   display scale; three real screenshots pasted up as a ruled figure plate,
   sized as specimens rather than as a hero image; the app's actual figures
   pinned below as dimension callouts. Primary action sits under the title.

   FORM: Technical standards document, candidate 5 of the grounded list, seed
   key 9c0436ff, staged as a drawing sheet with title block.
   --------------------------------------------------------------------------- */

/* The app's real, measured specification. These are the figures that already
   appeared on the site — presented here as what they are: measurements. */
const SPEC = [
  { value: '320', unit: 'kbps', label: 'Max bitrate' },
  { value: '0', unit: '', label: 'Trackers' },
  { value: '100', unit: '%', label: 'Ad-free' },
  { value: '12.0', unit: '+', label: 'Android' },
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

/* The figure plate. FIG. 1 is the screenshot the site already shipped; the
   other two prints are expected at these exact paths in `public/` and render as
   NOT ISSUED cells until they are dropped in — nothing breaks in the meantime.
   Case-sensitive, like the R2 object names. */
const FIGURES = [
  {
    no: '1',
    src: '/Home1.png',
    caption: 'Home screen',
    alt: "The MusicStream app's home screen, showing Quick Picks, Trending Now and Made For You sections.",
  },
  {
    no: '2',
    src: '/Now-Player.png',
    caption: 'Now playing',
    alt: "The MusicStream app's now-playing screen, showing the current track with playback controls.",
  },
  {
    no: '3',
    src: '/Artist.png',
    caption: 'Artist',
    alt: "The MusicStream app's artist screen, showing the artist's albums and related content.",
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

  /* Seeded with the TRUE value, never with zero. These are the product's real
     measurements: if the observer never fires, the animation is skipped and
     never started, or JS is slow, the sheet must still state 320 kbps rather
     than 0 kbps. The count-up is an enhancement on top of a correct figure. */
  const [text, setText] = useState(value)

  useEffect(() => {
    if (!isNumeric || reduce || !inView) return
    const controls = animate(0, target, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(`${v.toFixed(decimals)}${suffix}`),
      // Land exactly on the source string, not on a re-formatted float.
      onComplete: () => setText(value),
    })
    return () => controls.stop()
  }, [inView, reduce, isNumeric, target, suffix, decimals, value])

  return <span ref={ref}>{!isNumeric || reduce ? value : text}</span>
}

/** A measurement with a leader line running to the subject it measures. */
function Callout({ value, unit, label }) {
  return (
    <div className="flex items-center gap-4 border-b border-rule-soft py-4 last:border-b-0">
      <div className="flex w-24 shrink-0 items-baseline gap-1">
        <span className="font-mono text-2xl font-bold tabular-nums text-ink">
          <Reading value={value} />
        </span>
        {unit && <span className="font-mono text-[0.6875rem] text-ink-3">{unit}</span>}
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
      {/* The base column is minmax(0,1fr), not the implicit `auto`: the figure
          plate below is `w-fit`, and an auto-sized column would let it size to
          max-content and push the whole document wider than the phone instead
          of letting the plate's own scroller take over. */}
      <div data-impeccable-variants="a657c20f" data-impeccable-variant-count="2" style={{ display: "contents" }}>
        {/* impeccable-variants-start a657c20f */}
        {/* Original */}
        <div data-impeccable-variant="original">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
            {/* The title field runs on one spacing unit (u = 1rem), so the grouping
                is a rule rather than a set of ad-hoc margins:
                  eyebrow → title   0.5u  (one unit: the label names this title)
                  title   → lead    2u
                  lead    → actions 2u    (lead and its action are one group)
                  actions → control 4u    (document control is a separate object)
                Space above a heading always exceeds the space below it. */}
            <div>
              <SectionLabel index={1}>Subject</SectionLabel>

              <h1 className="drawing-title mt-2 stamp-title">
                <span className="stamp-tick" aria-hidden="true" />
                <span className="stamp-line" style={{ '--i': 0 }}>Your music.</span>
                <span className="stamp-line" style={{ '--i': 1 }}>No ads.</span>
                <span className="stamp-line" style={{ '--i': 2 }}>No noise.</span>
              </h1>

              {/* 52ch holds the lead inside a comfortable reading measure. */}
              <p className="mt-8 max-w-[52ch] font-sans text-base leading-[1.7] normal-case text-ink-2">
                A fast, native music player for Android — background playback, synced lyrics, a
                real equalizer and offline downloads. Built in Kotlin, with nothing between you
                and the music.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={user ? '/download' : '/signup'} className="btn btn-issue">
                  {user ? 'Go to download' : 'Request issue'}
                </Link>
                <Link to="/docs" className="btn btn-line">
                  Read the manual
                </Link>
              </div>

              {/* Access stated as document control, not as fine print. */}
              <div className="mt-16 max-w-md border border-rule bg-sheet-deep">
                <div className="plate-hd">
                  <span className="label">Document control</span>
                </div>
                <div className="px-4 py-3.5">
                  <p className="font-mono text-[0.6875rem] leading-[1.8] tracking-[0.06em] text-ink-2">
                    {isApproved
                      ? 'This copy is controlled. The current build is issued to your account.'
                      : 'Issue is controlled. Access is granted per account by the developer; this copy is uncontrolled until yours is approved.'}
                  </p>
                </div>
              </div>
            </div>

            {/* The figure plate: three specimens of the shipped app, pasted up as
                one ruled object. Sized to its contents rather than stretched to the
                column, so the drawing sits off-centre in its frame — and each print
                is small enough to read as a specimen rather than as a hero image.
                Scrolls inside itself on a narrow phone instead of shrinking the
                prints to illegibility. */}
            <div className="plate w-fit max-w-full self-start">
              <div className="plate-hd justify-between gap-4">
                <span className="label">Figure plate</span>
                <span className="label">FIG. 1–3</span>
              </div>
              <div className="flex overflow-x-auto">
                {FIGURES.map((f, i) => (
                  <div
                    key={f.no}
                    className={`w-[152px] shrink-0 p-3 sm:w-[180px] sm:p-4 ${
                      i > 0 ? 'border-l border-rule' : ''
                    }`}
                  >
                    <Figure {...f} priority={i === 0} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>  
      {/* ---------------- Capabilities ---------------- */}
      <section className="mt-20">
        <Reveal className="max-w-2xl">
          <SectionLabel index={3}>Capabilities</SectionLabel>
          <h2 className="sheet-heading mt-5">Everything you expect. Nothing you don't.</h2>
          <p className="mt-5 font-sans text-base normal-case leading-[1.7] text-ink-2">
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
                <h3 className="min-w-0 font-sans text-base font-bold uppercase tracking-[0.04em] text-ink">
                  {c.title}
                </h3>
                <p className="col-start-2 min-w-0 font-sans text-base normal-case leading-[1.7] text-ink-2 sm:col-start-3">
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
          <p className="mt-5 font-sans text-base normal-case leading-[1.7] text-ink-2">
            Liked songs, playlists and listening history are stored locally on your device
            using Android DataStore. There is no cloud sync, no account inside the app, and
            no analytics SDK bundled in.
          </p>
          <p className="mt-4 font-sans text-base normal-case leading-[1.7] text-ink-2">
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
                <span className="font-sans text-base normal-case text-ink-2">
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
              <p className="mt-5 max-w-xl font-sans text-base normal-case leading-[1.7] text-ink-2">
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
