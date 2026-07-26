import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { humanizeAuthError, useAuth } from '../context/AuthContext'
import { isConfigured } from '../lib/supabase'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

/**
 * Holder sign-in, set as a document request form.
 *
 * The access-decision states are surfaced distinctly from a credential error:
 * a correct password with an undecided or refused request is a document-control
 * outcome, not a login failure, and saying so plainly is the whole point.
 */
export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/download'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [blocked, setBlocked] = useState(null) // 'pending' | 'rejected'
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setBlocked(null)
    setBusy(true)
    const { error: err, blocked: status } = await signIn(email, password)
    setBusy(false)

    if (err) {
      setError(humanizeAuthError(err))
      return
    }
    // Credentials were right, but access hasn't been granted.
    if (status) {
      setBlocked(status)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <Sheet label="Holder sign-in">
      <div className="mx-auto max-w-lg">
        <Reveal>
          <SectionLabel index={6}>Sheet</SectionLabel>
          <h1 className="drawing-title mt-6">Sign in</h1>
          <p className="mt-8 font-sans text-base normal-case leading-[1.7] text-ink-2">
            Sign in to collect your issued build.
          </p>
        </Reveal>

        {!isConfigured && (
          <div className="mt-8 border border-void bg-sheet-deep" role="alert">
            <div className="flex items-center gap-2.5 border-b border-void bg-void/10 px-4 py-2.5">
              <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-void">
                Site not connected to Supabase
              </span>
            </div>
            <div className="p-5">
              <p className="font-sans text-base normal-case leading-[1.7] text-ink-2">
                The{' '}
                <code className="border border-rule-soft bg-sheet px-1.5 py-0.5 font-mono text-[0.875rem] text-ink">
                  VITE_SUPABASE_*
                </code>{' '}
                environment variables are missing, so sign-in cannot work.
              </p>
            </div>
          </div>
        )}

        {/* An access decision, shown instead of a generic error so the holder
            knows their password was fine and it's approval that's outstanding. */}
        {blocked && (
          <div
            className={`mt-8 border bg-sheet-deep ${
              blocked === 'rejected' ? 'border-void' : 'border-rule'
            }`}
            role="alert"
          >
            <div
              className={`flex items-center gap-2.5 border-b px-4 py-2.5 ${
                blocked === 'rejected' ? 'border-void bg-void/10' : 'border-rule bg-sheet-raised'
              }`}
            >
              <span
                className={`font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] ${
                  blocked === 'rejected' ? 'text-void' : 'text-ink-2'
                }`}
              >
                {blocked === 'rejected' ? 'Request not approved' : 'Request pending'}
              </span>
            </div>
            <div className="p-5">
              <p className="font-sans text-base normal-case leading-[1.7] text-ink-2">
                {blocked === 'rejected'
                  ? "Your account exists but the developer hasn't granted access. Contact them if you think this is a mistake."
                  : "Your account is waiting for the developer to approve it. You'll get an email once a decision is made — try signing in again then."}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-8 border border-rule bg-sheet-deep">
          <div className="plate-hd">
            <span className="label">Credentials</span>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {error && (
              // role="alert" so screen readers announce it immediately.
              <div className="border border-void bg-void/10 px-4 py-3" role="alert">
                <p className="font-mono text-[0.875rem] leading-relaxed text-void">{error}</p>
              </div>
            )}

            <div>
              <label className="field-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                className="field-input"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  className="field-input pr-14"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-0 flex h-full w-12 items-center justify-center border-l border-rule text-ink-3 transition-colors hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-issue w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 font-sans text-base normal-case leading-[1.7] text-ink-2">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-stamp underline decoration-stamp/40 underline-offset-4"
          >
            Request access
          </Link>
        </p>
      </div>
    </Sheet>
  )
}
