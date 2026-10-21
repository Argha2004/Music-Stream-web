import { Link } from 'react-router-dom'
import { Sparkles, Heart, ExternalLink } from 'lucide-react'

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
      { to: 'https://github.com/Argha2004/Music-Stream-web', label: 'GitHub', external: true },
      { to: 'https://t.me/+i3CypCJYJa82NDBl', label: 'Telegram', external: true },
      { to: 'https://github.com/MusicStream-Native', label: 'Organization', external: true },
      { to: '/support', label: 'Support & Donate' },
    ],
  },
  {
    heading: 'Project',
    links: [
      { to: '/license', label: 'Terms of use' },
      { to: '/privacy', label: 'Data & privacy' },
      { to: '/changelog', label: 'All releases' },
      { to: '/license#third-party', label: 'Third-party licenses' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-8 sm:mt-16 border-t border-rule bg-sheet-deep/60 py-6 sm:py-12 transition-colors">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-10">
          {/* Brand blurb */}
          <div className="lg:col-span-2">
            <Link to="/" className="group inline-flex items-center gap-2">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary-pill text-primary transition-transform group-hover:scale-105">
                <img
                  src="/Logo-dark.png"
                  alt="MusicStream Logo"
                  className="h-4.5 w-4.5 sm:h-5 sm:w-5 object-contain dark:hidden"
                />
                <img
                  src="/Logo-final.png"
                  alt="MusicStream Logo"
                  className="h-4.5 w-4.5 sm:h-5 sm:w-5 object-contain hidden dark:block"
                />
              </div>
              <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-ink">
                MusicStream
              </span>
            </Link>

            <p className="mt-2 sm:mt-3 max-w-sm text-xs sm:text-sm leading-relaxed text-ink-2">
              A fast, ad-free native Android music player with background playback,
              synced lyrics, 10-band equalizer, and Liquid Glass Effect.
            </p>

            <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5 text-[11px] sm:text-xs text-ink-3">
              <span>Crafted with</span>
              <Heart className="h-3 w-3 text-primary fill-primary" />
              <span>for private listening</span>
            </div>
          </div>

          {/* Navigation link columns: 2 columns on small screens, 3 on tablets/desktops */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {GROUPS.map((group) => (
              <div key={group.heading} className="space-y-2 sm:space-y-3">
                <h3 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink">
                  {group.heading}
                </h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.to.startsWith('http') ? (
                        <a
                          href={link.to}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-xs sm:text-sm text-ink-2 hover:text-primary transition-colors inline-flex items-center gap-1 group/ext"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-50 group-hover/ext:opacity-100 transition-opacity" />
                        </a>
                      ) : link.to.startsWith('/#') ? (
                        <a
                          href={link.to}
                          className="text-xs sm:text-sm text-ink-2 hover:text-primary transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          className="text-xs sm:text-sm text-ink-2 hover:text-primary transition-colors"
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
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-rule flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 text-[11px] sm:text-xs text-ink-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Arghadeep Pakhira. All rights reserved.</p>
          <p className="font-medium text-ink-2">Built with Java and Kotlin.</p>
        </div>
      </div>
    </footer>
  )
}
