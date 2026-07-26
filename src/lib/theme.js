import { useCallback, useEffect, useState } from 'react'

/**
 * Which process this copy is issued in.
 *
 * The site ships two real drafting processes rather than a theme and its
 * inversion: `light` is the whiteprint (blue-black ink on warm vellum) and
 * `dark` is the cyanotype (white line work on an exposed blue sheet). The
 * palettes live entirely in CSS — see the `html[data-theme='dark']` block in
 * index.css — so all this module does is decide which one is stamped on the
 * root element.
 *
 * Storage rule: a key is written ONLY once the reader has chosen. While it is
 * absent the site keeps following the OS, live, including changes made after
 * load. That is why this is not stored as a three-state 'system' value — the
 * absence of a choice IS the system state, and recording "system" explicitly
 * would just be a second way to say the same thing that can then fall out of
 * sync with it.
 */

const STORAGE_KEY = 'ms-theme'
const THEME_COLOR = { light: '#f3f0e6', dark: '#0a2440' }

/** Mirrors the pre-paint boot script in index.html. Keep the two in step. */
export function readStoredTheme() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s === 'light' || s === 'dark' ? s : null
  } catch {
    // Private mode and blocked-storage contexts throw on access, not on write.
    return null
  }
}

function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  // The browser chrome sits directly against a full-bleed ground; leaving it
  // on the other process's colour reads as a seam above the page.
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = THEME_COLOR[theme]
}

export function useTheme() {
  // The boot script already resolved and applied this, so read it back rather
  // than recomputing — that way the first render agrees with what is painted.
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'light'
  )
  const [hasChoice, setHasChoice] = useState(() => readStoredTheme() !== null)

  // Follow the OS until the reader overrides it, then stop listening to it.
  useEffect(() => {
    if (hasChoice) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const next = systemTheme()
      setTheme(next)
      applyTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [hasChoice])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
        setHasChoice(true)
      } catch {
        // Storage can be unavailable; the choice still applies for this visit.
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
