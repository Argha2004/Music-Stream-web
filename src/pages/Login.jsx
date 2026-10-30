import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Clock,
  KeyRound,
  MailCheck,
  ArrowLeft,
  Send,
} from 'lucide-react'
import { humanizeAuthError, useAuth } from '../context/AuthContext'
import { isConfigured } from '../lib/supabase'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

export default function Login() {
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const from = location.state?.from || '/download'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [blocked, setBlocked] = useState(null) // 'pending' | 'rejected'
  const [busy, setBusy] = useState(false)

  // Forgot Password States
  const [isForgot, setIsForgot] = useState(searchParams.get('forgot') === 'true')
  const [resetSent, setResetSent] = useState(false)
  const [resetBusy, setResetBusy] = useState(false)
  const [resetError, setResetError] = useState(null)

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
    if (status) {
      setBlocked(status)
      return
    }
    navigate(from, { replace: true })
  }

  async function onResetSubmit(e) {
    e.preventDefault()
    setResetError(null)
    setResetBusy(true)
    const { error: err } = await resetPassword(email)
    setResetBusy(false)

    if (err) {
      setResetError(humanizeAuthError(err))
      return
    }
    setResetSent(true)
  }

  return (
    <Sheet label="Account">
      <div className="mx-auto max-w-md">
        <Reveal>
          <SectionLabel index={6}>Authentication</SectionLabel>
          <h1 className="drawing-title mt-2 sm:mt-4 text-2xl sm:text-4xl">
            {isForgot ? 'Reset password' : 'Sign in'}
          </h1>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-2">
            {isForgot
              ? 'Enter your account email to receive a recovery link.'
              : 'Sign in with your approved account to download Zuno.'}
          </p>
        </Reveal>

        {!isConfigured && (
          <div className="mt-5 sm:mt-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-3.5 sm:p-4 text-xs text-red-800 dark:text-red-300">
            <strong>Supabase not connected.</strong> Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </div>
        )}

        {blocked && !isForgot && (
          <div
            className={`mt-5 sm:mt-6 rounded-2xl p-4 sm:p-5 border text-xs sm:text-sm ${
              blocked === 'rejected'
                ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300'
                : 'border-primary/30 bg-primary-pill text-primary-pill-text'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {blocked === 'rejected' ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              <span>{blocked === 'rejected' ? 'Access Not Approved' : 'Approval Pending'}</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              {blocked === 'rejected'
                ? 'Your account exists, but access was not approved by the developer. Contact them if this is unexpected.'
                : 'Your account is awaiting developer review. Once approved, you can sign in directly to download the APK.'}
            </p>
          </div>
        )}

        {isForgot ? (
          /* Forgot Password View */
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-4 sm:p-8 shadow-xs">
            {resetSent ? (
              <div className="text-center py-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-pill text-primary mb-4">
                  <MailCheck className="h-7 w-7" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-ink">Check your inbox</h2>
                <p className="mt-2 text-xs sm:text-sm text-ink-2 leading-relaxed max-w-sm mx-auto">
                  We sent a password reset link to{' '}
                  <strong className="text-ink font-mono break-all">{email}</strong>. Open the email
                  and click the link to choose a new password.
                </p>
                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(false)
                      setResetSent(false)
                    }}
                    className="btn btn-primary w-full py-3 text-xs sm:text-sm font-semibold"
                  >
                    Back to Sign in
                  </button>
                  <button
                    type="button"
                    onClick={onResetSubmit}
                    disabled={resetBusy}
                    className="btn btn-secondary w-full py-2.5 text-xs text-ink-3 hover:text-ink transition-colors"
                  >
                    {resetBusy ? 'Resending…' : 'Didn’t get the email? Send again'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onResetSubmit}>
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-rule">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-ink leading-tight">
                      Find your Zuno account
                    </h2>
                    <p className="text-[11px] text-ink-3">
                      We will send password reset instructions to this email.
                    </p>
                  </div>
                </div>

                {resetError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-3 text-xs text-red-800 dark:text-red-300">
                    {resetError}
                  </div>
                )}

                <div>
                  <label className="field-label" htmlFor="reset-email">
                    Account email address
                  </label>
                  <input
                    id="reset-email"
                    className="field-input"
                    type="email"
                    autoComplete="email"
                    required
                    autoFocus
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full mt-6 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                  disabled={resetBusy}
                >
                  <Send className="h-4 w-4 shrink-0" />
                  <span>{resetBusy ? 'Sending reset link…' : 'Send Reset Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgot(false)
                    setResetError(null)
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs text-ink-3 hover:text-ink font-mono transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign in</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Normal Sign-in View */
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
                <label className="field-label" htmlFor="login-email">
                  Email address
                </label>
                <input
                  id="login-email"
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="field-label mb-0" htmlFor="login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null)
                      setResetError(null)
                      setResetSent(false)
                      setIsForgot(true)
                    }}
                    className="text-xs font-mono text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    className="field-input pr-12"
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
                    className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-ink-3 hover:text-ink transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-6 py-3.5" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink-2">
          Don't have an approved account?{' '}
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            Request access
          </Link>
        </p>
      </div>
    </Sheet>
  )
}

