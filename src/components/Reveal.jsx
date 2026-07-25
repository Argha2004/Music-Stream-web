import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll-triggered entrance for content.
 *
 * Content fades and rises; structure draws itself instead (see `Rule` below and
 * the plot-in motion in index.css). Keeping those two vocabularies separate is
 * what makes the sheet feel drawn rather than animated.
 *
 *  - ~450ms on the standard ease-out curve
 *  - transform and opacity only, so nothing triggers layout
 *  - `once`, so content never re-animates while scrolling back
 *  - fully disabled under reduced motion
 */
export default function Reveal({ children, delay = 0, y = 12, className = '' }) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Staggers children 40ms apart. */
export function RevealGroup({ children, className = '', stagger = 0.04 }) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className = '' }) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * A rule that draws itself along its length when it scrolls into view.
 * Structure is plotted, not faded — see "The Plot-Not-Fade Rule" in DESIGN.md.
 */
export function Rule({ className = '', accent = false, delay = 0 }) {
  const reduce = useReducedMotion()
  const tone = accent ? 'bg-stamp' : 'bg-rule'

  if (reduce) return <div className={`h-px ${tone} ${className}`} aria-hidden="true" />

  return (
    <motion.div
      className={`h-px origin-left ${tone} ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    />
  )
}
