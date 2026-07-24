import { motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

/**
 * Wraps the routed page tree and replays a short fade-and-lift every time the
 * path changes — so navigating between pages feels like the same lively site,
 * not a hard document swap. Keyed on pathname so React remounts (and thus
 * re-animates) on each navigation. Renders children untouched under reduced
 * motion.
 */
export default function PageTransition({ children }) {
  const reduce = useReducedMotion()
  const { pathname } = useLocation()

  if (reduce) return children

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
