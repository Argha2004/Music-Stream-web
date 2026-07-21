/**
 * Editorial section eyebrow: an optional two-digit index, a hairline, and a
 * tracked label — the recurring "chapter marker" used across the site in place
 * of the old lone coral mini-caps line.
 *
 *   01 ──  Features
 */
export default function SectionLabel({ index, children, className = '' }) {
  return (
    <p className={`eyebrow ${className}`}>
      {index != null && (
        <>
          <span className="eyebrow-index">{String(index).padStart(2, '0')}</span>
          <span aria-hidden="true" className="h-px w-6 bg-border" />
        </>
      )}
      <span>{children}</span>
    </p>
  )
}
