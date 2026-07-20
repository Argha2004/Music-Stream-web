import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Ban, Eye, EyeOff, Hourglass, LogIn } from 'lucide-react'
import { Alert, Button, Card, Input, Label, Spinner, TextField } from '@heroui/react'
import { humanizeAuthError, useAuth } from '../context/AuthContext'
import { isConfigured } from '../lib/supabase'

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
    <div className="container-x flex min-h-[75vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Sign in to download MusicStream.</p>
        </div>

        {!isConfigured && (
          <Alert status="danger" className="mt-6" role="alert">
            <Alert.Indicator>
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Title>Site not connected to Supabase</Alert.Title>
              <Alert.Description>
                The <code className="rounded bg-elevated px-1 py-0.5 text-accent-hi">VITE_SUPABASE_*</code>{' '}
                environment variables are missing, so sign-in cannot work.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        {/* Access decision — shown instead of a generic error so the user knows
            their password was fine and it's approval that's outstanding. */}
        {blocked && (
          <Alert
            status={blocked === 'rejected' ? 'danger' : 'accent'}
            className="mt-6"
            role="alert"
          >
            <Alert.Indicator>
              {blocked === 'rejected' ? (
                <Ban className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Hourglass className="h-4 w-4" aria-hidden="true" />
              )}
            </Alert.Indicator>
            <Alert.Content>
              {blocked === 'rejected' ? (
                <>
                  <Alert.Title>Access request not approved</Alert.Title>
                  <Alert.Description>
                    Your account exists but the developer hasn't granted access. Contact
                    them if you think this is a mistake.
                  </Alert.Description>
                </>
              ) : (
                <>
                  <Alert.Title>Access request pending</Alert.Title>
                  <Alert.Description>
                    Your account is waiting for the developer to approve it. You'll get an
                    email once a decision is made — try signing in again then.
                  </Alert.Description>
                </>
              )}
            </Alert.Content>
          </Alert>
        )}

        <Card variant="secondary" className="mt-8 border border-border p-6">
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              // role="alert" so screen readers announce it immediately.
              <Alert status="danger" role="alert">
                <Alert.Indicator>
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                </Alert.Indicator>
                <Alert.Content>
                  <Alert.Description>{error}</Alert.Description>
                </Alert.Content>
              </Alert>
            )}

            {/* react-aria TextField hands onChange the value string, not an event. */}
            <TextField
              value={email}
              onChange={setEmail}
              type="email"
              autoComplete="email"
              isRequired
              fullWidth
            >
              <Label className="mb-2 block text-sm font-semibold">Email</Label>
              <Input placeholder="you@example.com" />
            </TextField>

            <TextField
              value={password}
              onChange={setPassword}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              isRequired
              fullWidth
            >
              <Label className="mb-2 block text-sm font-semibold">Password</Label>
              <div className="relative">
                <Input placeholder="••••••••" className="pr-12" />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-fg"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </TextField>

            {/* h-12 so the CTA reads as the same weight as the 50px fields. */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              className="mt-1 h-12"
              isDisabled={busy}
            >
              {busy ? (
                <>
                  <Spinner size="sm" color="current" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Sign in
                </>
              )}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-accent hover:underline">
            Request access
          </Link>
        </p>
      </div>
    </div>
  )
}
