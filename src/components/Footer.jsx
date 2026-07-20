import { Link } from 'react-router-dom'
import { AudioLines } from 'lucide-react'
import { Separator } from '@heroui/react'

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
          <Link to="/" className="group flex items-center gap-2 font-extrabold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/[0.12] transition-colors group-hover:bg-accent/20">
              <AudioLines className="h-4 w-4 text-accent" aria-hidden="true" />
            </span>
            MusicStream
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            A fast, ad-free native Android music player. Built with Kotlin and Jetpack
            Compose.
          </p>
        </div>

        {/* One column on phones. A 2-col grid orphaned the third group on its
            own row with dead space beside it; stacking keeps it balanced. */}
        <nav className="grid gap-7 sm:grid-cols-3 sm:gap-x-12 sm:gap-y-8" aria-label="Footer">
          {GROUPS.map((group) => (
            <div key={group.heading}>
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-dim">
                {group.heading}
              </h2>
              {/* Links run inline on phones so each group is one compact row
                  instead of a tall stack; they return to a column once there
                  are real columns to sit in. */}
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 sm:flex-col sm:gap-x-0 sm:gap-y-0 sm:space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-fg sm:min-h-0"
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
