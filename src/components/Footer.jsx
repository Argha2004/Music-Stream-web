import { Link } from 'react-router-dom'
import Waveform from './Waveform'
import { DOC_NO } from './Sheet'

/**
 * The document's closing block: an index of sheets, then the issuing and
 * copyright record. Rows are ruled and butt together — the footer is one ruled
 * object rather than a set of spaced columns.
 */

const GROUPS = [
  {
    heading: 'Document',
    links: [
      { to: '/', label: 'Specification' },
      { to: '/docs', label: 'Operating manual' },
      { to: '/changelog', label: 'Revision history' },
    ],
  },
  {
    heading: 'Issue',
    links: [
      { to: '/download', label: 'Controlled download' },
      { to: '/signup', label: 'Request access' },
      { to: '/login', label: 'Sign in' },
    ],
  },
  {
    heading: 'Legal',
    links: [{ to: '/license', label: 'Terms of use' }],
  },
]

export default function Footer() {
  return (
    <footer className="mt-4 border-t-2 border-rule">
      <div className="container-x">
        <div className="grid grid-cols-1 border-x border-rule sm:grid-cols-3">
          {GROUPS.map((group, i) => (
            <div
              key={group.heading}
              className={`border-b border-rule p-5 sm:border-b-0 ${
                i > 0 ? 'sm:border-l sm:border-rule' : ''
              }`}
            >
              <h2 className="label">{group.heading}</h2>
              <ul className="mt-4 space-y-0">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="inline-flex min-h-9 items-center font-sans text-sm text-chalk-2 transition-colors hover:text-stamp"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Issuing record. */}
        <div className="flex flex-col gap-4 border-x border-b border-rule bg-sheet-deep px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Waveform
              bars={4}
              height={14}
              barWidth={2.5}
              gap={2}
              animated={false}
              barClassName="bg-rule"
            />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chalk">
              {DOC_NO}
            </span>
          </div>

          <div className="flex flex-col gap-1 font-mono text-[0.6875rem] tracking-[0.12em] text-chalk-3 sm:items-end">
            <p>© {new Date().getFullYear()} Arghadeep Pakhira. All rights reserved.</p>
            <p className="uppercase">Personal and educational use only</p>
          </div>
        </div>
      </div>

      <div className="h-8" />
    </footer>
  )
}
