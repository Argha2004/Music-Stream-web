import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { humanizeAuthError, useAuth } from '../context/AuthContext'
import { isConfigured } from '../lib/supabase'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

/**
 * The access request form.
 *
 * Creating an account does not grant anything — it files a request. The sheet
 * says so before the form, not after it, because the whole distribution model
 * depends on that expectation being set correctly.
 */
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

    // Validate on submit, not on every keystroke.
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Both passwords must match.')
      return
    }

    setBusy(true)
    const { data, error: err } = await signUp(email, password)
    setBusy(false)

    if (err) {
      setError(humanizeAuthError(err))
      return
    }

    // With email confirmation on, there's no session yet — tell them to check mail.
    if (data?.session) navigate('/download', { replace: true })
    else setDone(true)
  }

  if (done) {
    return (
      <Sheet label="Access request">
        <div className="mx-auto max-w-lg">
          <Reveal>
            <SectionLabel index={7}>Sheet</SectionLabel>
            <h1 className="drawing-title mt-6">Filed</h1>

            <div className="mt-10 border border-rule bg-sheet-deep">
              <div className="plate-hd">
                <span className="label">Next step</span>
              </div>
              <div className="p-5 sm:p-6">
                <h2 className="font-sans text-lg font-bold uppercase tracking-[0.06em] text-ink">
                  Check your email
                </h2>
                <p className="mt-4 font-sans text-base normal-case leading-[1.7] text-ink-2">
                  We sent a confirmation link to{' '}
                  <strong className="break-all text-ink">{email}</strong>. Click it to
                  activate your account, then sign in.
                </p>
              </div>
              <Link to="/login" className="btn btn-issue w-full">
                Go to sign in
              </Link>
            </div>
          </Reveal>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet label="Access request">
      <div className="mx-auto max-w-lg">
        <Reveal>
          <SectionLabel index={7}>Sheet</SectionLabel>
          <h1 className="drawing-title mt-6">Request</h1>
          <p className="mt-8 font-sans text-base normal-case leading-[1.7] text-ink-2">
            Create an account and the developer will review your request.
          </p>
        </Reveal>

        {/* Surfaced before the form is used, so a misconfigured deploy is
            obvious rather than showing a cryptic error on submit. */}
        {!isConfigured && (
          <div className="mt-8 border border-void bg-sheet-deep" role="alert">
            <div className="flex items-center gap-2.5 border-b border-void bg-void/10 px-4 py-2.5">
              <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-void">
                Site not connected to Supabase
              </span>
            </div>
            <div className="p-5">
              <p className="font-sans text-base normal-case leading-[1.7] text-ink-2">
                Set{' '}
                <code className="border border-rule-soft bg-sheet px-1.5 py-0.5 font-mono text-[0.875rem] text-ink">
                  VITE_SUPABASE_URL
                </code>{' '}
                and{' '}
                <code className="border border-rule-soft bg-sheet px-1.5 py-0.5 font-mono text-[0.875rem] text-ink">
                  VITE_SUPABASE_ANON_KEY
                </code>{' '}
                in your environment variables, then redeploy. Sign-up cannot work until
                then.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 border border-stamp bg-sheet-deep">
          <div className="flex items-center gap-2.5 border-b border-stamp bg-stamp/10 px-4 py-2.5">
            <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-stamp">
              Issue is controlled
            </span>
          </div>
          <div className="p-5">
            <p className="font-sans text-base normal-case leading-[1.7] text-ink-2">
              Creating an account sends an access request to the developer. You'll be able
              to download the app once it's approved.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 border border-rule bg-sheet-deep">
          <div className="plate-hd">
            <span className="label">Requester details</span>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {error && (
              <div className="border border-void bg-void/10 px-4 py-3" role="alert">
                <p className="font-mono text-[0.875rem] leading-relaxed text-void">{error}</p>
              </div>
            )}

            <div>
              <label className="field-label" htmlFor="signup-email">
                Email <span className="text-stamp">*</span>
              </label>
              <input
                id="signup-email"
                className="field-input"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="signup-email-note"
              />
              <p id="signup-email-note" className="mt-2 label normal-case tracking-[0.06em]">
                The developer will see this address.
              </p>
            </div>

            <div>
              <label className="field-label" htmlFor="signup-password">
                Password <span className="text-stamp">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  className="field-input pr-14"
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
                  className="absolute right-0 top-0 flex h-full w-12 items-center justify-center border-l border-rule text-ink-3 transition-colors hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="signup-confirm">
                Confirm password <span className="text-stamp">*</span>
              </label>
              <input
                id="signup-confirm"
                className="field-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-issue w-full" disabled={busy}>
            {busy ? 'Creating account…' : 'File request'}
          </button>
        </form>

        <p className="mt-8 font-sans text-base normal-case leading-[1.7] text-ink-2">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-stamp underline decoration-stamp/40 underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </Sheet>
  )
}
