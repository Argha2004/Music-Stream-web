import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, AlertCircle, Clock } from 'lucide-react'
import { humanizeAuthError, useAuth } from '../context/AuthContext'
import { isConfigured } from '../lib/supabase'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

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
    if (status) {
      setBlocked(status)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <Sheet label="Account">
      <div className="mx-auto max-w-md">
        <Reveal>
          <SectionLabel index={6}>Authentication</SectionLabel>
          <h1 className="drawing-title mt-2 sm:mt-4 text-2xl sm:text-4xl">Sign in</h1>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-2">
            Sign in with your approved account to download MusicStream.
          </p>
        </Reveal>

        {!isConfigured && (
          <div className="mt-5 sm:mt-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-3.5 sm:p-4 text-xs text-red-800 dark:text-red-300">
            <strong>Supabase not connected.</strong> Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </div>
        )}

        {blocked && (
          <div className={`mt-5 sm:mt-6 rounded-2xl p-4 sm:p-5 border text-xs sm:text-sm ${
            blocked === 'rejected'
              ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300'
              : 'border-primary/30 bg-primary-pill text-primary-pill-text'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {blocked === 'rejected' ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              <span>{blocked === 'rejected' ? 'Access Not Approved' : 'Approval Pending'}</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              {blocked === 'rejected'
                ? "Your account exists, but access was not approved by the developer. Contact them if this is unexpected."
                : "Your account is awaiting developer review. Once approved, you can sign in directly to download the APK."}
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-4 sm:p-8 shadow-xs">
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
              <label className="field-label" htmlFor="login-password">
                Password
              </label>
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
