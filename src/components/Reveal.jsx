import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll-triggered entrance. Fades and lifts once when it enters the viewport.
 *
 * Motion rules honoured here:
 *  - ease-out curve for entering elements
 *  - ~500ms, transform/opacity only (no layout-shifting properties)
 *  - fully disabled when the user prefers reduced motion
 *  - `once` so content never re-animates and distracts while scrolling back
 */
export default function Reveal({ children, delay = 0, y = 18, className = '' }) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Staggers children by 40ms each (MD guidance: 30–50ms per item). */
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
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
