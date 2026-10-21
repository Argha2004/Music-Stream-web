import { Link } from 'react-router-dom'
import { Sparkles, Heart } from 'lucide-react'

const GROUPS = [
  {
    heading: 'Documentation',
    links: [
      { to: '/docs', label: 'Operating manual' },
      { to: '/download', label: 'Downloads' },
      { to: '/#faq', label: 'FAQ' },
      { to: '/changelog', label: 'Revision history' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { to: '/signup', label: 'Request access' },
      { to: '/login', label: 'Sign in' },
      { to: '/docs#troubleshooting', label: 'Help & feedback' },
      { to: '/docs#getting-started', label: 'Installation guide' },
    ],
  },
  {
    heading: 'Project',
    links: [
      { to: '/license', label: 'Terms of use' },
      { to: '/docs#privacy', label: 'Data & privacy' },
      { to: '/changelog', label: 'All releases' },
      { to: '/license#third-party', label: 'Third-party licenses' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-rule bg-sheet-deep/60 py-16 transition-colors">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Brand blurb */}
          <div className="lg:col-span-2">
            <Link to="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-pill text-primary transition-transform group-hover:scale-105">
                <img
                  src="/Logo-dark.png"
                  alt="MusicStream Logo"
                  className="h-5 w-5 object-contain dark:hidden"
                />
                <img
                  src="/Logo-final.png"
                  alt="MusicStream Logo"
                  className="h-5 w-5 object-contain hidden dark:block"
                />
              </div>
              <span className="font-display text-lg font-extrabold tracking-tight text-ink">
                MusicStream
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">
              A fast, ad-free native Android music player with background playback,
              synced lyrics, 5-band equalizer, and on-device offline downloads.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-ink-3">
              <span>Crafted with</span>
              <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
              <span>for private listening</span>
            </div>
          </div>

          {/* Navigation link columns */}
          {GROUPS.map((group) => (
            <div key={group.heading} className="space-y-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                {group.heading}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.to.startsWith('/#') ? (
                      <a
                        href={link.to}
                        className="text-sm text-ink-2 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-ink-2 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-14 pt-8 border-t border-rule flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-3">
          <p>© {new Date().getFullYear()} Arghadeep Pakhira. All rights reserved.</p>
          <p className="font-medium text-ink-2">Personal and educational use only.</p>
        </div>
      </div>
    </footer>
  )
}
