import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AudioLines, Download, LogOut, Menu, ShieldCheck, X } from 'lucide-react'
import { Button, buttonVariants } from '@heroui/react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/docs', label: 'Documentation' },
  { to: '/changelog', label: 'Changelog' },
  { to: '/license', label: 'License' },
]

/* HeroUI's Button is a react-aria button and takes no `as` prop, so routed
   links use react-router's Link carrying HeroUI's button classes. That keeps a
   real <a> for middle-click / open-in-new-tab instead of a fake button. */
const linkBtn = (variant, size = 'md') => buttonVariants({ variant, size })

/** Hairline reading-progress bar pinned to the top of the viewport. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.2 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-accent to-accent-hi"
      aria-hidden="true"
    />
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Escape closes the mobile sheet (a11y: overlays must be dismissible).
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

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-200 hover:text-fg ${
      isActive ? 'text-fg' : 'text-muted'
    }`

  return (
    <>
      <ScrollProgress />

      {/* Floating pill bar — detached from the viewport edges, so page content
          scrolls beneath it behind glass rather than under a full-width slab. */}
      <header className="sticky top-0 z-40 pt-3 sm:pt-4">
        <div className="container-x">
          <nav
            aria-label="Main"
            className={`flex h-14 items-center justify-between rounded-2xl pl-4 pr-3 transition-all duration-300 sm:pl-5 sm:pr-4 ${
              scrolled
                ? 'border border-border/80 bg-bg/70 shadow-lg shadow-black/20 backdrop-blur-xl'
                : 'border border-transparent bg-transparent'
            }`}
          >
            <Link to="/" className="group flex items-center gap-2 font-extrabold tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/[0.12] transition-colors group-hover:bg-accent/20">
                <AudioLines className="h-4 w-4 text-accent" aria-hidden="true" />
              </span>
              MusicStream
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute -bottom-1.5 left-0 right-0 h-px bg-accent"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <>
                  {isAdmin && (
                    <NavLink to="/admin" className={linkClass}>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                        Admin
                      </span>
                    </NavLink>
                  )}
                  <Link to="/download" className={linkBtn('primary', 'sm')}>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download
                  </Link>
                  <Button variant="ghost" size="sm" isIconOnly onPress={handleSignOut} aria-label="Sign out">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className={linkBtn('ghost', 'sm')}>
                    Sign in
                  </Link>
                  <Link to="/signup" className={linkBtn('primary', 'sm')}>
                    Get access
                  </Link>
                </>
              )}
            </div>

            {/* 44px minimum touch target. */}
            <button
              className="flex h-11 w-11 items-center justify-center rounded-xl text-fg md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
        </div>

        {open && (
          <div className="container-x md:hidden">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 rounded-2xl border border-border bg-bg/95 p-3 shadow-xl backdrop-blur-xl"
            >
              <div className="flex flex-col gap-1">
                {LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-3 text-base font-medium ${
                        isActive ? 'bg-elevated text-accent' : 'text-muted'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>

              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className={`${linkBtn('ghost')} w-full`}
                      >
                        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                        Admin
                      </Link>
                    )}
                    <Link
                      to="/download"
                      onClick={() => setOpen(false)}
                      className={`${linkBtn('primary')} w-full`}
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download
                    </Link>
                    <Button variant="ghost" fullWidth onPress={handleSignOut}>
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      onClick={() => setOpen(false)}
                      className={`${linkBtn('primary')} w-full`}
                    >
                      Get access
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className={`${linkBtn('ghost')} w-full`}
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </header>
    </>
  )
}
