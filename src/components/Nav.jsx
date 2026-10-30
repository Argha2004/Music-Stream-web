import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Sparkles, Download, LogIn, LogOut, ShieldCheck } from 'lucide-react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

function ScrollProgress() {
  const { scrollYProgress } = useSpring(useScroll().scrollYProgress, {
    stiffness: 240,
    damping: 40,
    mass: 0.2,
  })

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary"
      aria-hidden="true"
    />
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

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

  return (
    <>
      <ScrollProgress />

      <header className="sticky top-0 z-40 bg-sheet/90 backdrop-blur-md transition-colors border-b border-rule/60">
        <div className="container-x">
          <nav aria-label="Main" className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden transition-transform group-hover:scale-105">
                <img
                  src="/zuno.png"
                  alt="Zuno Logo"
                  className="h-8 w-8 object-contain rounded-lg"
                />
              </div>
              <span className="font-display text-lg font-extrabold tracking-tight text-ink">
                Zuno
              </span>
            </Link>

            {/* Navigation links matching reference pill style */}
            <div className="hidden items-center gap-1.5 md:flex">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-pill text-primary-pill-text font-semibold shadow-xs'
                      : 'text-ink-2 hover:text-ink hover:bg-hover'
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/download"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-pill text-primary-pill-text font-semibold shadow-xs'
                      : 'text-ink-2 hover:text-ink hover:bg-hover'
                  }`
                }
              >
                Downloads
              </NavLink>

              <NavLink
                to="/changelog"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-pill text-primary-pill-text font-semibold shadow-xs'
                      : 'text-ink-2 hover:text-ink hover:bg-hover'
                  }`
                }
              >
                Releases
              </NavLink>

              <NavLink
                to="/docs"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-pill text-primary-pill-text font-semibold shadow-xs'
                      : 'text-ink-2 hover:text-ink hover:bg-hover'
                  }`
                }
              >
                Docs
              </NavLink>

              <NavLink
                to="/report"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-pill text-primary-pill-text font-semibold shadow-xs'
                      : 'text-ink-2 hover:text-ink hover:bg-hover'
                  }`
                }
              >
                Report Bug
              </NavLink>
            </div>

            {/* Right side actions */}
            <div className="hidden items-center gap-2.5 md:flex">
              <ThemeToggle />

              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      className="btn btn-sm btn-pill border border-rule hover:border-primary flex items-center gap-1.5"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <span>Dashboard</span>
                    </NavLink>
                  )}
                  <Link to="/download" className="btn btn-sm btn-primary flex items-center gap-1.5 shadow-xs">
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm border border-rule bg-card hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/30 dark:hover:border-red-800 text-ink-2 hover:text-red-600 dark:hover:text-red-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    onClick={handleSignOut}
                    title="Sign out of your account"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-sm btn-quiet flex items-center gap-1.5">
                    <LogIn className="h-3.5 w-3.5" />
                    Sign in
                  </Link>
                  <Link to="/signup" className="btn btn-sm btn-primary">
                    Request access
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-card-subtle text-ink transition-colors hover:border-primary"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-x-0 top-16 z-40 border-b border-rule bg-sheet/95 backdrop-blur-xl p-4 sm:p-5 shadow-xl md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-primary-pill text-primary-pill-text' : 'text-ink-2 hover:bg-hover'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/download"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-2xl text-sm font-medium text-ink-2 hover:bg-hover"
            >
              Downloads
            </NavLink>
            <NavLink
              to="/changelog"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-2xl text-sm font-medium text-ink-2 hover:bg-hover"
            >
              Releases
            </NavLink>
            <NavLink
              to="/docs"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-2xl text-sm font-medium text-ink-2 hover:bg-hover"
            >
              Docs
            </NavLink>
            <NavLink
              to="/report"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-2xl text-sm font-medium text-ink-2 hover:bg-hover"
            >
              Report Bug
            </NavLink>

            <div className="mt-4 pt-4 border-t border-rule flex flex-col gap-2.5">
              {user ? (
                <>
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="btn btn-pill w-full flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Dashboard
                    </NavLink>
                  )}
                  <Link
                    to="/download"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download APK
                  </Link>
                  <button
                    type="button"
                    className="btn w-full border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 py-2.5 flex items-center justify-center gap-2 font-medium text-xs rounded-full hover:bg-red-100"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary w-full"
                  >
                    Request access
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="btn btn-line w-full"
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
