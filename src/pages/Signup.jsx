import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Eye, EyeOff, Info, UserPlus } from 'lucide-react'
import {
  Alert,
  Button,
  Card,
  Description,
  Input,
  Label,
  Spinner,
  TextField,
  buttonVariants,
} from '@heroui/react'
import { humanizeAuthError, useAuth } from '../context/AuthContext'
import { isConfigured } from '../lib/supabase'

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
      <div className="container-x flex min-h-[75vh] items-center justify-center py-16">
        <Card variant="secondary" className="card-lift w-full max-w-md border border-border p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We sent a confirmation link to <strong className="text-fg">{email}</strong>. Click
            it to activate your account, then sign in.
          </p>
          <Link to="/login" className={`${buttonVariants({ variant: 'primary' })} mt-7 w-full`}>
            Go to sign in
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="container-x flex min-h-[75vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Request access</h1>
          <p className="mt-2 text-sm text-muted">
            Create an account and the developer will review your request.
          </p>
        </div>

        {/* Surfaced before the form is even used, so a misconfigured deploy is
            obvious rather than showing a cryptic error on submit. */}
        {!isConfigured && (
          <Alert status="danger" className="mt-6" role="alert">
            <Alert.Indicator>
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Title>Site not connected to Supabase</Alert.Title>
              <Alert.Description>
                Set{' '}
                <code className="rounded bg-elevated px-1 py-0.5 text-accent-hi">
                  VITE_SUPABASE_URL
                </code>{' '}
                and{' '}
                <code className="rounded bg-elevated px-1 py-0.5 text-accent-hi">
                  VITE_SUPABASE_ANON_KEY
                </code>{' '}
                in your environment variables, then redeploy. Sign-up cannot work until then.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <Alert status="accent" className="mt-6">
          <Alert.Indicator>
            <Info className="h-4 w-4" aria-hidden="true" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Description>
              Creating an account sends an access request to the developer. You'll be able to
              download the app once it's approved.
            </Alert.Description>
          </Alert.Content>
        </Alert>

        <Card variant="secondary" className="card-lift mt-6 border border-border p-6">
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
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
              <Label className="mb-2 block text-sm font-semibold">
                Email <span className="text-accent">*</span>
              </Label>
              <Input placeholder="you@example.com" />
              <Description className="mt-2 block text-xs text-dim">
                The developer will see this address.
              </Description>
            </TextField>

            <TextField
              value={password}
              onChange={setPassword}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              isRequired
              fullWidth
            >
              <Label className="mb-2 block text-sm font-semibold">
                Password <span className="text-accent">*</span>
              </Label>
              <div className="relative">
                <Input placeholder="At least 6 characters" className="pr-12" />
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

            <TextField
              value={confirm}
              onChange={setConfirm}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              isRequired
              fullWidth
            >
              <Label className="mb-2 block text-sm font-semibold">
                Confirm password <span className="text-accent">*</span>
              </Label>
              <Input placeholder="Re-enter your password" />
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
                  Creating account…
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  Create account
                </>
              )}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
