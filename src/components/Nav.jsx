import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Waveform from './Waveform'
import ThemeToggle from './ThemeToggle'
import { DOC_NO } from './Sheet'

/**
 * The document header, not a marketing nav bar.
 *
 * It carries the document number on the left and sheet tabs on the right,
 * under a 2px rule. Deliberately not floating, not rounded, and not blurred —
 * it is the header of the sheet you are reading, so it behaves like one.
 */

const LINKS = [
  { to: '/docs', label: 'Specification' },
  { to: '/changelog', label: 'Revisions' },
  { to: '/license', label: 'Terms' },
]

/** Reading-progress rule pinned to the very top of the viewport. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.2 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-stamp"
      aria-hidden="true"
    />
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Lock body scroll while the sheet menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Escape closes the menu (a11y: overlays must be dismissible).
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function handleSignOut() {
    await signOut()
    setOpen(false)
    navigate('/')
  }

  /* The active tab takes a survey-orange rule. Tabs are flush to the header's
     bottom border, so the active rule reads as part of the frame. */
  const tabClass = ({ isActive }) =>
    `flex items-center border-b-2 px-3 font-mono text-[0.6875rem] font-medium uppercase
     tracking-[0.18em] transition-colors duration-150 lg:px-4 ${
       isActive
         ? 'border-stamp text-ink'
         : 'border-transparent text-ink-3 hover:text-ink'
     }`

  return (
    <>
      <ScrollProgress />

      <header className="sticky top-0 z-40 -mb-px border-b-2 border-rule bg-sheet">
        <div className="container-x">
          <nav aria-label="Main" className="flex h-14 items-stretch justify-between gap-6">
            {/* Document identity: the mark is a level plot, the number is real. */}
            <Link to="/" className="group flex items-center gap-3">
              <Waveform bars={5} height={16} barWidth={2.5} gap={2} barClassName="bg-stamp" />
              <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink">
                MusicStream
              </span>
              <span className="hidden font-mono text-[0.6875rem] tracking-[0.18em] text-ink-3 sm:inline">
                {DOC_NO}
              </span>
            </Link>

            <div className="hidden items-stretch md:flex">
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className={tabClass}>
                  {l.label}
                </NavLink>
              ))}
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggle className="my-1.5 h-11" />
              {user ? (
                <>
                  {isAdmin && (
                    <NavLink to="/admin" className={tabClass}>
                      Approvals
                    </NavLink>
                  )}
                  <Link to="/download" className="btn btn-sm btn-issue">
                    Download
                  </Link>
                  <button type="button" className="btn btn-sm btn-quiet" onClick={handleSignOut}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-sm btn-quiet">
                    Sign in
                  </Link>
                  <Link to="/signup" className="btn btn-sm btn-issue">
                    Request access
                  </Link>
                </>
              )}
            </div>

            {/* Sits in the bar rather than inside the menu: the process is a
                persistent preference, not a navigation destination. */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle className="my-1.5 h-11" />

              {/* 44px minimum touch target, square like everything else. */}
              <button
                type="button"
                className="my-2 flex h-11 w-11 items-center justify-center border border-rule text-ink transition-colors hover:border-stamp"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Sheet menu: ruled rows butting together, no gaps, no rounding. */}
      {open && (
        <div className="sticky top-14 z-40 border-b border-rule bg-sheet md:hidden">
          <div className="container-x">
            <div className="border-x border-rule">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center border-b border-rule-soft px-4 font-mono
                     text-[0.6875rem] uppercase tracking-[0.18em] ${
                       isActive ? 'bg-hover text-stamp' : 'text-ink-2'
                     }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}

              {user ? (
                <>
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center border-b border-rule-soft px-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-2"
                    >
                      Approvals
                    </NavLink>
                  )}
                  <Link
                    to="/download"
                    onClick={() => setOpen(false)}
                    className="btn btn-issue w-full"
                  >
                    Download
                  </Link>
                  <button
                    type="button"
                    className="btn btn-line w-full border-x-0 border-b-0"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="btn btn-issue w-full"
                  >
                    Request access
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="btn btn-line w-full border-x-0 border-b-0"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
