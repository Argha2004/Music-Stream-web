import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, MailCheck, ShieldCheck } from 'lucide-react'
import { humanizeAuthError, useAuth } from '../context/AuthContext'
import { isConfigured, notifyAdminSignup } from '../lib/supabase'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords must match.')
      return
    }

    setBusy(true)
    const { data, error: err } = await signUp(email, password)
    setBusy(false)

    if (err) {
      setError(humanizeAuthError(err))
      return
    }

    // Fire-and-forget email alert to admin: new signup & access request pending
    notifyAdminSignup(email).catch((e) => console.warn('Failed to notify admin of signup:', e))

    if (data?.session) navigate('/download', { replace: true })
    else setDone(true)
  }

  if (done) {
    return (
      <Sheet label="Account Request">
        <div className="mx-auto max-w-md">
          <Reveal>
            <SectionLabel index={7}>Submitted</SectionLabel>
            <h1 className="drawing-title mt-2 sm:mt-4 text-2xl sm:text-4xl">Request filed</h1>

            <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-4 sm:p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-pill text-primary">
                <MailCheck className="h-7 w-7" />
              </div>
              <h2 className="mt-4 font-display text-lg sm:text-xl font-bold text-ink">
                Check your email
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-ink-2 leading-relaxed">
                We sent a confirmation link to <strong className="text-ink break-all">{email}</strong>.
                Click the link to verify your email, then wait for developer approval.
              </p>
              <Link to="/login" className="btn btn-primary w-full mt-6 py-3.5 text-sm font-semibold">
                Go to sign in
              </Link>
            </div>
          </Reveal>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet label="Account Request">
      <div className="mx-auto max-w-md">
        <Reveal>
          <SectionLabel index={7}>Access</SectionLabel>
          <h1 className="drawing-title mt-2 sm:mt-4 text-2xl sm:text-4xl">Request access</h1>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-2">
            Create an account to request an approved tester slot for Zuno.
          </p>
        </Reveal>

        {!isConfigured && (
          <div className="mt-5 sm:mt-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-3.5 sm:p-4 text-xs text-red-800 dark:text-red-300">
            <strong>Supabase not configured.</strong> Set environment variables to enable signups.
          </div>
        )}

        <div className="mt-5 sm:mt-6 rounded-2xl border border-primary/20 bg-primary-pill p-3.5 sm:p-4 text-xs text-primary-pill-text flex items-start gap-2.5 sm:gap-3">
          <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Zuno is invite-only. After creating your account, the developer will
            approve your email before you can download the APK.
          </span>
        </div>

        <form onSubmit={onSubmit} className="mt-5 sm:mt-6 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-4 sm:p-8 shadow-xs">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-3.5 text-xs text-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="field-label" htmlFor="signup-email">
                Email address
              </label>
              <input
                id="signup-email"
                className="field-input"
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  className="field-input pr-12"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="At least 6 characters"
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
            </div>

            <div>
              <label className="field-label" htmlFor="signup-confirm">
                Confirm password
              </label>
              <input
                id="signup-confirm"
                className="field-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-6 py-3.5" disabled={busy}>
            {busy ? 'Submitting…' : 'Submit request'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-2">
          Already requested access?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Sheet>
  )
}
