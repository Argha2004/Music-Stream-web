import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  Home,
  Download,
  BookOpen,
  Bug,
  Sparkles,
  ArrowLeft,
  Volume2,
  VolumeX,
  Radio,
  Music,
  Disc3,
  Search,
} from 'lucide-react'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

// Floating note particle templates
const NOTE_SYMBOLS = ['♪', '♫', '♬', '♩', '404', '✦', '▲', '●']

export default function NotFound() {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [notes, setNotes] = useState([
    { id: 1, x: 20, y: 0, scale: 0.8, symbol: '♪', delay: 0 },
    { id: 2, x: -25, y: -20, scale: 1.1, symbol: '♫', delay: 0.6 },
    { id: 3, x: 35, y: -40, scale: 0.9, symbol: '404', delay: 1.2 },
    { id: 4, x: -15, y: -60, scale: 1.2, symbol: '♬', delay: 1.8 },
  ])
  const [trackSeconds, setTrackSeconds] = useState(0)

  // 3D Parallax tilt on mouse hover
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const deckRef = useRef(null)

  // Play synthetic retro audio chord on play click
  const playRetroChime = () => {
    if (isMuted) return
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime
      const chord = [261.63, 329.63, 392.0, 523.25] // C4, E4, G4, C5
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.07)
        gain.gain.setValueAtTime(0.05, now + idx * 0.07)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.4)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + idx * 0.07)
        osc.stop(now + idx * 0.07 + 0.45)
      })
    } catch {
      // AudioContext muted or blocked by policy
    }
  }

  const togglePlay = () => {
    const nextState = !isPlaying
    setIsPlaying(nextState)
    if (nextState) {
      playRetroChime()
    }
  }

  // Elapsed fake timer when record is playing
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setTrackSeconds((s) => (s + 1) % 245)
    }, 1000)
    return () => clearInterval(timer)
  }, [isPlaying])

  // Spawn periodic floating note particles when playing
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setNotes((prev) => [
        ...prev.slice(-6),
        {
          id: Date.now(),
          x: (Math.random() - 0.5) * 120,
          y: (Math.random() - 0.5) * 40,
          scale: 0.75 + Math.random() * 0.55,
          symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
          delay: 0,
        },
      ])
    }, 1800)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleMouseMove = (e) => {
    if (!deckRef.current) return
    const rect = deckRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
  }

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <Sheet label="404 — Track Desynchronized">
      <Reveal className="max-w-4xl mx-auto">
        <SectionLabel index={4}>Error 404</SectionLabel>

        {/* Hero Title & Status */}
        <div className="mt-3 sm:mt-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-2xs">
              <Radio className="h-3.5 w-3.5 animate-pulse text-red-500" />
              <span>Frequency 404 Hz • Signal Lost</span>
            </div>

            <h1 className="drawing-title text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight">
              Lost in the Static
            </h1>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-ink-2 max-w-xl leading-relaxed">
              The track or page you are tuned to was moved, renamed, or never pressed to vinyl. Let&apos;s get you back into the groove.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Go Back</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMuted(!isMuted)
                if (isMuted) playRetroChime()
              }}
              className="btn btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 cursor-pointer shadow-2xs text-ink-2"
              title={isMuted ? 'Unmute chord feedback' : 'Mute chord feedback'}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-primary" />}
            </button>
          </div>
        </div>

        {/* =========================================================================
            TURNTABLE DECK WITH LIQUID GLASS VINYL RECORD
        ========================================================================= */}
        <div
          ref={deckRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: 1000,
          }}
          className="mt-8 sm:mt-10"
        >
          <motion.div
            animate={{
              rotateX: mousePos.y,
              rotateY: mousePos.x,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="rounded-[24px] sm:rounded-[38px] border border-rule/90 bg-card/90 dark:bg-card/40 backdrop-blur-xl p-3.5 sm:p-9 shadow-xl relative overflow-hidden"
          >
            {/* Subtle deck metallic accent dots in 4 corners */}
            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 w-1.5 h-1.5 rounded-full bg-rule border border-ink/10" />
            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 w-1.5 h-1.5 rounded-full bg-rule border border-ink/10" />
            <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-1.5 h-1.5 rounded-full bg-rule border border-ink/10" />
            <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-1.5 h-1.5 rounded-full bg-rule border border-ink/10" />

            {/* Glowing ambient turntable light */}
            <div
              className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 ${
                isPlaying ? 'bg-primary/20 dark:bg-primary/25 opacity-100' : 'bg-primary/5 opacity-40'
              }`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
              {/* LEFT: THE VINYL RECORD & TONEARM */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <div className="relative w-56 h-56 sm:w-76 sm:h-76 flex items-center justify-center select-none">
                  {/* Floating Musical Particles */}
                  <AnimatePresence>
                    {isPlaying &&
                      notes.map((note) => (
                        <motion.span
                          key={note.id}
                          initial={{ opacity: 0, y: 0, x: note.x, scale: 0.5 }}
                          animate={{
                            opacity: [0, 0.9, 0],
                            y: -130,
                            x: note.x + (Math.sin(note.id) * 35),
                            rotate: [0, 15, -15, 0],
                            scale: note.scale,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 2.8, ease: 'easeOut' }}
                          className="absolute pointer-events-none text-primary font-mono font-bold text-sm sm:text-base z-30 drop-shadow-sm select-none"
                        >
                          {note.symbol}
                        </motion.span>
                      ))}
                  </AnimatePresence>

                  {/* Tonearm (Turntable Needle) */}
                  <div className="absolute -top-2 -right-1 sm:-right-3 w-22 sm:w-28 h-34 sm:h-40 pointer-events-none z-20 origin-top-right">
                    {/* Tonearm pivot base */}
                    <div className="absolute top-0 right-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-stone-200 to-stone-400 dark:from-stone-600 dark:to-stone-800 border-2 border-stone-400 dark:border-stone-500 shadow-md flex items-center justify-center">
                      <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-stone-500 dark:bg-stone-400 border border-stone-600" />
                    </div>

                    {/* Tonearm armrod with rotation */}
                    <motion.div
                      animate={{
                        rotate: isPlaying ? 28 : 6,
                      }}
                      transition={{ type: 'spring', stiffness: 75, damping: 14 }}
                      className="absolute top-4 right-3 sm:top-4.5 sm:right-4 origin-top-right w-1.5 h-28 sm:h-36 bg-gradient-to-b from-stone-400 via-stone-200 to-stone-500 dark:from-stone-500 dark:via-stone-300 dark:to-stone-600 rounded-full shadow-md"
                    >
                      {/* Stylus head & green indicator cartridge */}
                      <div className="absolute bottom-0 -left-1.5 sm:-left-2 w-4 sm:w-5 h-6 sm:h-7 bg-stone-900 dark:bg-stone-950 rounded-sm border border-stone-600 dark:border-stone-500 flex flex-col items-center justify-end pb-1 shadow-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-primary shadow-[0_0_8px_#52c46f]' : 'bg-red-400'}`} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Spinning Vinyl Platter */}
                  <motion.div
                    animate={{
                      rotate: isPlaying ? 360 : 0,
                    }}
                    transition={{
                      rotate: {
                        duration: 6,
                        repeat: isPlaying ? Infinity : 0,
                        ease: 'linear',
                      },
                    }}
                    onClick={togglePlay}
                    className="w-48 h-48 sm:w-68 sm:h-68 rounded-full bg-[#121613] dark:bg-[#0c100d] shadow-2xl border border-white/10 relative flex items-center justify-center cursor-pointer group active:scale-98 transition-transform"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 50% 50%, #171d18 0%, #0d120e 100%),
                        repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 5px)
                      `,
                    }}
                  >
                    {/* Holographic light sheen reflection */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-screen"
                      style={{
                        background:
                          'conic-gradient(from 45deg, transparent 0deg, rgba(82, 196, 111, 0.22) 55deg, transparent 110deg, transparent 180deg, rgba(213, 242, 206, 0.25) 235deg, transparent 290deg)',
                      }}
                    />

                    {/* Vinyl Grooves Accent Ring */}
                    <div className="absolute inset-3 sm:inset-4 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-6 sm:inset-8 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-9 sm:inset-12 rounded-full border border-white/5 pointer-events-none" />

                    {/* Center Vinyl Center Label */}
                    <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-[#2a5c34] to-[#78c587] text-[#0e1b11] p-1 shadow-inner relative flex flex-col items-center justify-center border-2 border-[#121613]">
                      <span className="font-mono text-[7px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#0f2413]/80">
                        Zuno
                      </span>

                      {/* Center 404 Stamp */}
                      <span className="font-display text-lg sm:text-2xl font-black tracking-tight leading-none text-[#09150b]">
                        404
                      </span>

                      <span className="font-mono text-[6.5px] sm:text-[8px] font-bold uppercase tracking-wider text-[#0f2413]/70 mt-0.5">
                        SIDE 404 • NO TRACK
                      </span>

                      {/* Center Spindle Hole */}
                      <div className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#121613] border-2 border-stone-400/80 shadow-inner flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Vinyl Action Prompt */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs font-mono font-medium text-ink-3 hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Disc3 className={`h-3.5 w-3.5 ${isPlaying ? 'animate-spin text-primary' : ''}`} />
                  <span>{isPlaying ? 'Click vinyl to pause' : 'Click vinyl to spin'}</span>
                </button>
              </div>

              {/* RIGHT: TRACK DIAGNOSTIC CONSOLE & CONTROLS */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                {/* Now Playing Widget Card */}
                <div className="rounded-2xl sm:rounded-3xl bg-card-subtle/80 dark:bg-card-subtle/40 border border-rule/80 p-3.5 sm:p-6 shadow-sm">
                  {/* Header info */}
                  <div className="flex items-center justify-between gap-2 border-b border-rule/60 pb-2.5 sm:pb-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          isPlaying ? 'bg-primary animate-pulse' : 'bg-red-500'
                        }`}
                      />
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-ink-2 truncate">
                        {isPlaying ? 'Lost Broadcast' : 'Turntable Idle'}
                      </span>
                    </div>

                    <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-card border border-rule text-primary whitespace-nowrap shrink-0">
                      FLAC • 0 kbps
                    </span>
                  </div>

                  {/* Track Title & Album without awkward truncation */}
                  <div className="mt-3 sm:mt-3.5">
                    <h3 className="font-display text-sm sm:text-base md:text-lg font-bold text-ink leading-snug">
                      The Missing Master (Track 404)
                    </h3>
                    <p className="text-[11px] sm:text-xs md:text-sm text-ink-3 font-medium mt-0.5 leading-snug">
                      Unknown Catalog • Zuno System
                    </p>
                  </div>

                  {/* Equalizer Visualizer */}
                  <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-rule/40">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-ink-3 mb-1.5 sm:mb-2">
                      <span>Signal Analysis</span>
                      <span className="font-semibold text-ink-2">{isPlaying ? `${formatTime(trackSeconds)} / 4:04` : 'Paused'}</span>
                    </div>

                    <div className="h-8 sm:h-10 flex items-end gap-1 sm:gap-1.5 bg-sheet/60 dark:bg-sheet/20 rounded-xl p-1.5 sm:p-2 border border-rule/50 overflow-hidden">
                      {Array.from({ length: 18 }).map((_, i) => {
                        const heights = [35, 75, 45, 95, 60, 30, 85, 50, 100, 70, 40, 80, 55, 90, 65, 35, 95, 50]
                        const baseHeight = heights[i % heights.length]
                        return (
                          <motion.span
                            key={i}
                            animate={{
                              height: isPlaying ? [`${baseHeight}%`, `${Math.max(15, baseHeight * 0.4)}%`, `${baseHeight}%`] : '15%',
                            }}
                            transition={{
                              duration: 0.6 + (i % 5) * 0.15,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: (i * 0.05) % 0.4,
                            }}
                            className={`flex-1 rounded-full transition-colors ${
                              isPlaying
                                ? 'bg-gradient-to-t from-primary/70 to-emerald-400 dark:to-primary'
                                : 'bg-rule'
                            }`}
                          />
                        )
                      })}
                    </div>
                  </div>

                  {/* Player Controls Bar with robust non-wrapping layout */}
                  <div className="mt-3.5 sm:mt-4 flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setTrackSeconds(0)}
                      className="btn btn-secondary px-3 sm:px-3.5 py-2.5 sm:py-2 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer transition-all active:scale-95"
                      title="Restart track timer"
                    >
                      <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                      <span>Re-tune</span>
                    </button>

                    <button
                      type="button"
                      onClick={togglePlay}
                      className="btn btn-primary flex-1 py-2.5 sm:py-2 px-3 sm:px-5 text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs cursor-pointer whitespace-nowrap transition-all active:scale-98"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-3.5 w-3.5 fill-current shrink-0" />
                          <span>Pause Platter</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current shrink-0" />
                          <span>Spin &amp; Play</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            RECOMMENDED DESTINATIONS & RESTORATION ACTIONS
        ========================================================================= */}
        <div className="mt-8 sm:mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm sm:text-base font-bold text-ink uppercase tracking-wider font-mono">
              Tune into Available Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Home Link */}
            <Link
              to="/"
              className="rounded-2xl border border-rule bg-card p-4 hover:border-primary/50 hover:bg-hover transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-pill text-primary mb-3 group-hover:scale-105 transition-transform">
                  <Home className="h-5 w-5" />
                </div>
                <h4 className="font-display text-sm font-bold text-ink">Home Base</h4>
                <p className="mt-1 text-xs text-ink-3">
                  Return to the main overview and features.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-primary inline-flex items-center gap-1">
                <span>Go to Home</span>
                <span>→</span>
              </span>
            </Link>

            {/* 2. Download APK */}
            <Link
              to="/download"
              className="rounded-2xl border border-rule bg-card p-4 hover:border-primary/50 hover:bg-hover transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                  <Download className="h-5 w-5" />
                </div>
                <h4 className="font-display text-sm font-bold text-ink">Download APK</h4>
                <p className="mt-1 text-xs text-ink-3">
                  Get the verified latest Android release.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-primary inline-flex items-center gap-1">
                <span>Downloads</span>
                <span>→</span>
              </span>
            </Link>

            {/* 3. Documentation */}
            <Link
              to="/docs"
              className="rounded-2xl border border-rule bg-card p-4 hover:border-primary/50 hover:bg-hover transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h4 className="font-display text-sm font-bold text-ink">User Manual</h4>
                <p className="mt-1 text-xs text-ink-3">
                  Read import playlist, audio FX &amp; guides.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-primary inline-flex items-center gap-1">
                <span>Read Docs</span>
                <span>→</span>
              </span>
            </Link>

            {/* 4. Report Broken Link */}
            <Link
              to="/report"
              className="rounded-2xl border border-rule bg-card p-4 hover:border-primary/50 hover:bg-hover transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                  <Bug className="h-5 w-5" />
                </div>
                <h4 className="font-display text-sm font-bold text-ink">Report Bug</h4>
                <p className="mt-1 text-xs text-ink-3">
                  Found a broken link? Let the developer know.
                </p>
              </div>
              <span className="mt-4 text-xs font-semibold text-primary inline-flex items-center gap-1">
                <span>Submit Report</span>
                <span>→</span>
              </span>
            </Link>
          </div>
        </div>
      </Reveal>
    </Sheet>
  )
}
