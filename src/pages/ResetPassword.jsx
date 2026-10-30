import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import { humanizeAuthError, useAuth } from '../context/AuthContext'
import { notifyPasswordChanged, supabase } from '../lib/supabase'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

export default function ResetPassword() {
  const { updatePassword, session } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [checking, setChecking] = useState(true)
  const [validSession, setValidSession] = useState(false)

  useEffect(() => {
    let active = true

    async function checkAuth() {
      // 1. Check current session
      const { data } = await supabase.auth.getSession()
      if (data?.session && active) {
        setValidSession(true)
        setChecking(false)
        return
      }

      // 2. Listen for recovery auth event
      const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (!active) return
        if (event === 'PASSWORD_RECOVERY' || newSession) {
          setValidSession(true)
          setChecking(false)
        }
      })

      // Grace timeout for hash/token processing
      const timer = setTimeout(() => {
        if (active) setChecking(false)
      }, 1500)

      return () => {
        active = false
        authListener?.subscription?.unsubscribe()
        clearTimeout(timer)
      }
    }

    checkAuth()
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)
    const { error: err } = await updatePassword(password)
    setBusy(false)

    if (err) {
      setError(humanizeAuthError(err))
      return
    }

    setSuccess(true)

    // Notify user via email that their password was changed successfully
    notifyPasswordChanged(session?.user?.email).catch((e) =>
      console.warn('Failed to send password change notification:', e)
    )
  }

  return (
    <Sheet label="Account">
      <div className="mx-auto max-w-md">
        <Reveal>
          <SectionLabel index={6}>Authentication</SectionLabel>
          <h1 className="drawing-title mt-2 sm:mt-4 text-2xl sm:text-4xl">Set new password</h1>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-2">
            Choose a new, secure password for your Zuno account.
          </p>
        </Reveal>

        {checking ? (
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-6 sm:p-8 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-3">
              Verifying reset token…
            </p>
          </div>
        ) : success ? (
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-primary/30 bg-primary/5 p-4 sm:p-8 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-pill text-primary mb-4">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-ink">Password updated</h2>
            <p className="mt-2 text-xs sm:text-sm text-ink-2 leading-relaxed">
              Your password has been changed successfully. You can now sign in with your new credentials.
            </p>
            <Link
              to="/login"
              className="btn btn-primary mt-6 w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-semibold"
            >
              <span>Sign in now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : !validSession && !session ? (
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-8 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-ink">Invalid or expired link</h2>
            <p className="mt-2 text-xs sm:text-sm text-ink-2 leading-relaxed">
              This password reset link is invalid or has expired. Please request a new link from the sign-in page.
            </p>
            <Link
              to="/login?forgot=true"
              className="btn btn-primary mt-6 w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-semibold"
            >
              <span>Request new link</span>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-4 sm:p-8 shadow-xs"
          >
            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-3.5 text-xs text-red-800 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="field-label" htmlFor="reset-new-password">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="reset-new-password"
                    className="field-input pr-12"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-ink-3 hover:text-ink transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="field-hint">At least 6 characters.</p>
              </div>

              <div>
                <label className="field-label" htmlFor="reset-confirm-password">
                  Confirm new password
                </label>
                <input
                  id="reset-confirm-password"
                  className="field-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-6 py-3.5" disabled={busy}>
              {busy ? 'Updating password…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </Sheet>
  )
}

