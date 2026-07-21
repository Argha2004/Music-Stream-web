import { Link } from 'react-router-dom'
import { Separator } from '@heroui/react'
import Waveform from './Waveform'

const GROUPS = [
  {
    heading: 'Product',
    links: [
      { to: '/download', label: 'Download' },
      { to: '/changelog', label: 'Changelog' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { to: '/docs', label: 'Documentation' },
      { to: '/license', label: 'License' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { to: '/login', label: 'Sign in' },
      { to: '/signup', label: 'Request access' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-border">
      <div className="container-x flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Link
            to="/"
            className="group flex items-center gap-2.5 font-display text-[0.95rem] font-bold tracking-tight"
          >
            <Waveform bars={4} height={16} barWidth={2.5} gap={2} animated={false} />
            MusicStream
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            A fast, ad-free native Android music player. Built with Kotlin and Jetpack
            Compose.
          </p>
        </div>

        {/* Three tidy columns at every width — the groups line up as a proper
            link directory instead of loose inline rows on phones. Narrow gutters
            on mobile so the three short columns fit a 360px screen without
            wrapping the labels. */}
        <nav
          className="grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-12"
          aria-label="Footer"
        >
          {GROUPS.map((group) => (
            <div key={group.heading}>
              <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-dim">
                {group.heading}
              </h2>
              <ul className="mt-3.5 space-y-1">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="inline-flex min-h-9 items-center text-sm text-muted transition-colors hover:text-fg"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <Separator />

      <div className="container-x flex flex-col gap-2 py-6 text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Arghadeep Pakhira. All rights reserved.</p>
        <p>For personal and educational use only.</p>
      </div>
    </footer>
  )
}
