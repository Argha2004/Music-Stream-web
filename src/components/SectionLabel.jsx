/**
 * A clause marker — how a numbered standards document introduces a section.
 *
 *   § 01 ──── FEATURES
 *
 * The section number is real wayfinding here rather than decoration: clauses
 * are referred to by number in the documentation and on the license sheet.
 */
export default function SectionLabel({ index, children, className = '' }) {
  return (
    <p className={`flex items-center gap-3 ${className}`}>
      {index != null && (
        <>
          <span className="font-mono text-[0.6875rem] font-bold tabular-nums tracking-[0.18em] text-stamp">
            § {String(index).padStart(2, '0')}
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-rule" />
        </>
      )}
      <span className="label">{children}</span>
    </p>
  )
}
