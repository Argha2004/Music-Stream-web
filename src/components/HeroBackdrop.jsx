import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Music, Music2, Music4 } from 'lucide-react'
import Waveform from './Waveform'

/**
 * The site's one showcase moment: a lively, layered backdrop that lives behind
 * the hero copy. Four layers, back to front:
 *
 *   1. two drifting coral "aurora" washes  (CSS transform/scale — GPU only)
 *   2. a faint dotted grid, masked to fade out toward the edges
 *   3. music notes floating up and dissolving (framer-motion, varied per note)
 *   4. a wide equalizer wave anchored to the bottom edge
 *   5. a pointer-tracked spotlight that follows the cursor across the hero
 *
 * It is purely decorative (aria-hidden) and pointer-events:none, so it never
 * intercepts clicks on the CTAs above it. Every moving part is disabled under
 * prefers-reduced-motion — the CSS layers via the global media query in
 * index.css, the framer-motion layers via `useReducedMotion` here.
 */

const NOTES = [
  { Icon: Music, left: '12%', size: 22, delay: 0, duration: 9, drift: 18 },
  { Icon: Music2, left: '28%', size: 16, delay: 2.4, duration: 11, drift: -14 },
  { Icon: Music4, left: '68%', size: 20, delay: 1.2, duration: 10, drift: 22 },
  { Icon: Music, left: '82%', size: 14, delay: 3.6, duration: 12, drift: -10 },
  { Icon: Music2, left: '46%', size: 18, delay: 5, duration: 10.5, drift: 12 },
]

function FloatingNotes() {
  return (
    <div className="absolute inset-0">
      {NOTES.map(({ Icon, left, size, delay, duration, drift }, i) => (
        <motion.span
          key={i}
          className="absolute bottom-[-8%] text-accent/60"
          style={{ left }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 0.9, 0.9, 0],
            y: ['0%', '-460%'],
            x: [0, drift, 0],
            rotate: [0, drift > 0 ? 14 : -14, 0],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.15, 0.7, 1],
          }}
        >
          <Icon style={{ width: size, height: size }} aria-hidden="true" />
        </motion.span>
      ))}
    </div>
  )
}

/** Radial glow that trails the pointer; hidden on touch (no hover). */
function Spotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const host = el.parentElement
    const onMove = (e) => {
      const r = host.getBoundingClientRect()
      el.style.setProperty('--sx', `${e.clientX - r.left}px`)
      el.style.setProperty('--sy', `${e.clientY - r.top}px`)
      el.style.opacity = '1'
    }
    const onLeave = () => {
      el.style.opacity = '0'
    }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="absolute inset-0 opacity-0 transition-opacity duration-500 hidden md:block"
      style={{
        background:
          'radial-gradient(280px circle at var(--sx, 50%) var(--sy, 40%), rgba(255,107,91,0.10), transparent 70%)',
      }}
    />
  )
}

export default function HeroBackdrop() {
  const reduce = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* 1 — drifting aurora washes: coral from the left, violet from the right,
          plus a soft magenta core, so the hero sits under a full sunset mesh. */}
      <div
        className="absolute -left-24 -top-24 h-[32rem] w-[32rem] rounded-full bg-accent/40 blur-3xl animate-aurora will-change-transform"
      />
      <div
        className="absolute -right-20 top-6 h-[30rem] w-[30rem] rounded-full bg-accent-2/35 blur-3xl animate-aurora-slow will-change-transform"
      />
      <div
        className="absolute left-1/3 top-1/2 h-[24rem] w-[24rem] rounded-full bg-accent-2/22 blur-3xl animate-aurora will-change-transform"
        style={{ animationDelay: '-8s' }}
      />

      {/* 2 — dotted grid, faded out at the edges with a radial mask */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, #000 40%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 35%, #000 40%, transparent 75%)',
        }}
      />

      {/* 3 — floating notes (skipped entirely under reduced motion) */}
      {!reduce && <FloatingNotes />}

      {/* 4 — equalizer wave along the bottom edge */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center opacity-30">
        <Waveform
          bars={48}
          height={168}
          barWidth={4}
          gap={6}
          className="w-full max-w-5xl [&>span]:flex-1"
        />
      </div>

      {/* 5 — pointer spotlight */}
      <Spotlight />
    </div>
  )
}
