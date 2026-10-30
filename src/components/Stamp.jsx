import { motion, useReducedMotion } from 'framer-motion'

export default function Stamp({ children, tone = 'approve', className = '' }) {
  const reduce = useReducedMotion()
  const void_ = tone === 'void'

  return (
    <motion.span
      role="status"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 ${
        void_
          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900/40'
          : 'bg-primary-pill text-primary-pill-text border border-primary-pill/80'
      } ${className}`}
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      animate={reduce ? false : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${void_ ? 'bg-red-500' : 'bg-primary'}`} />
      {children}
    </motion.span>
  )
}
