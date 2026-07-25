import { motion, useReducedMotion } from 'framer-motion'

/**
 * A rubber-stamp impression: the way this document records a decision.
 *
 * Orange is approval and issue; red is correction — rejected, void, withdrawn.
 * There is deliberately no "pending" stamp: an unstamped sheet IS the pending
 * state, which is more honest than a badge announcing that nothing has
 * happened yet.
 *
 * The impact motion is reserved for real decisions and is disabled under
 * reduced motion, where the stamp simply renders already landed.
 */
export default function Stamp({ children, tone = 'approve', className = '' }) {
  const reduce = useReducedMotion()
  const void_ = tone === 'void'
  const settled = void_ ? 3 : -3.5

  return (
    <motion.span
      role="img"
      aria-label={`Stamped ${String(children)}`}
      className={`stamp ${void_ ? 'stamp-void' : ''} ${className}`}
      initial={reduce ? false : { opacity: 0, scale: 1.5, rotate: void_ ? 9 : -9 }}
      animate={reduce ? false : { opacity: 0.85, scale: 1, rotate: settled }}
      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.span>
  )
}
