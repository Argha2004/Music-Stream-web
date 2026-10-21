import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/theme'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={toggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-card-subtle text-ink transition-all hover:bg-hover hover:border-primary active:scale-95 ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {dark ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-ink-2" />}
    </button>
  )
}
