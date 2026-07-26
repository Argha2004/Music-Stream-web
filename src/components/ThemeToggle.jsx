import { useTheme } from '../lib/theme'

/**
 * The process selector.
 *
 * Not a sun/moon switch — in this world the two themes are two printing
 * processes of the same drawing, so the control is a two-cell ruled object
 * that names them: WP (whiteprint) and CY (cyanotype). Cells butt against a
 * shared rule, exactly like the title block.
 *
 * The active cell is filled with the hover ground, deliberately NOT with
 * survey orange: the accent means "live action or approval" and nothing else,
 * and a permanently-lit orange cell in the header would put a second orange on
 * every screen and break the rule that makes the stamp read as a stamp.
 */

function cellClass(active) {
  return [
    'flex items-center justify-center px-2.5 font-mono text-[0.6875rem] font-medium',
    'uppercase tracking-[0.14em] transition-colors duration-150',
    active ? 'bg-hover text-ink' : 'text-ink-3',
  ].join(' ')
}

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={toggle}
      title={dark ? 'Issued as cyanotype — switch to whiteprint' : 'Issued as whiteprint — switch to cyanotype'}
      className={`inline-flex items-stretch border border-rule transition-colors hover:border-stamp ${className}`}
    >
      <span className="sr-only">Cyanotype process</span>
      <span aria-hidden="true" className={cellClass(!dark)}>
        WP
      </span>
      <span aria-hidden="true" className={`border-l border-rule ${cellClass(dark)}`}>
        CY
      </span>
    </button>
  )
}
