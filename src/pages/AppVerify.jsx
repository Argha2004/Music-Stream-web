import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  Smartphone,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  LogIn,
  KeyRound,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sheet from '../components/Sheet'
import Stamp from '../components/Stamp'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

export default function AppVerify() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const { session, user, profile, loading, isApproved, isAdmin, refreshProfile } = useAuth()

  const deviceId = searchParams.get('device_id') || 'Unknown Device'
  const approved = isApproved || isAdmin
  const rejected = profile?.status === 'rejected'

  const [checking, setChecking] = useState(false)
  const [launched, setLaunched] = useState(false)

  const deepLink = session
    ? `musicstream://verify?token=${encodeURIComponent(session.access_token || '')}&email=${encodeURIComponent(
        user?.email || ''
      )}&user_id=${encodeURIComponent(user?.id || '')}&device_id=${encodeURIComponent(deviceId)}`
    : ''

  // Attempt automatic deep link launch if approved
  useEffect(() => {
    if (approved && deepLink && !launched) {
      setLaunched(true)
      // Small delay so user sees the verified state before the app opens
      const timer = setTimeout(() => {
        window.location.href = deepLink
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [approved, deepLink, launched])

  async function handleRecheck() {
    setChecking(true)
    await refreshProfile?.()
    setChecking(false)
  }

  return (
    <Sheet label="Device Verification">
      <Reveal className="mx-auto max-w-xl">
        <SectionLabel index={4}>Device Licensing</SectionLabel>
        <h1 className="drawing-title mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl">
          App Verification
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-ink-2">
          Verify your mobile device to authorize and unlock your MusicStream application.
        </p>

        {loading ? (
          <div className="mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-8 text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary opacity-80" />
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-3">
              Checking Authorization…
            </p>
          </div>
        ) : !session ? (
          /* Case 1: User is not signed in */
          <div className="mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-rule">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-3">
                Authentication Required
              </span>
              <Stamp tone="void">Unauthenticated</Stamp>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                <KeyRound className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-ink">Sign in to verify your device</h2>
              <p className="mt-2 text-xs sm:text-sm text-ink-2 max-w-sm">
                MusicStream requires an approved account to activate. Please sign in below to confirm
                your device authorization.
              </p>

              {deviceId && (
                <div className="mt-5 w-full rounded-xl border border-rule/60 bg-ground/50 p-3 font-mono text-xs text-ink-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="uppercase text-[10px] tracking-wider text-ink-4">
                      Pending Device ID
                    </span>
                    <Smartphone className="h-3.5 w-3.5 opacity-60" />
                  </div>
                  <div className="mt-1 font-semibold text-ink break-all text-[11px]">
                    {deviceId}
                  </div>
                </div>
              )}

              <Link
                to="/login"
                state={{ from: `${location.pathname}${location.search}` }}
                className="btn btn-primary mt-6 w-full flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In to Authorize</span>
              </Link>

              <p className="mt-4 text-xs text-ink-3">
                Don&apos;t have an account yet?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Request access
                </Link>
              </p>
            </div>
          </div>
        ) : !approved ? (
          /* Case 2: Signed in, but not yet approved */
          <div className="mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-rule">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-3">
                Access Status
              </span>
              <Stamp tone={rejected ? 'void' : 'approve'}>
                {rejected ? 'Refused' : 'Awaiting Approval'}
              </Stamp>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-4 ${
                  rejected
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-amber-500/10 text-amber-500'
                }`}
              >
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-ink">
                {rejected ? 'Access Declined' : 'Approval Pending'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-ink-2 max-w-sm">
                {rejected
                  ? 'Your account request was declined. You cannot verify or use MusicStream at this time.'
                  : 'Your account is waiting for developer approval. Once approved, you can verify your device and run MusicStream.'}
              </p>

              <div className="mt-6 w-full space-y-2.5 rounded-xl border border-rule/60 bg-ground/50 p-4 text-left text-xs font-mono">
                <div className="flex justify-between items-center text-ink-3">
                  <span>Account:</span>
                  <span className="font-semibold text-ink break-all">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center text-ink-3">
                  <span>Device:</span>
                  <span className="text-ink break-all text-[11px]">{deviceId}</span>
                </div>
              </div>

              {!rejected && (
                <button
                  type="button"
                  onClick={handleRecheck}
                  disabled={checking}
                  className="btn btn-secondary mt-6 w-full flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
                  <span>{checking ? 'Checking Status…' : 'Check Approval Status'}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Case 3: Signed in and Approved! */
          <div className="mt-8 rounded-2xl sm:rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-primary/20">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Device Authorized
              </span>
              <Stamp tone="approve">Verified Account</Stamp>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-4 shadow-lg shadow-primary/10">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-ink">Ready to Launch MusicStream</h2>
              <p className="mt-2 text-xs sm:text-sm text-ink-2 max-w-sm">
                Your account is confirmed and approved. Click below to complete verification and unlock
                the MusicStream app on your device.
              </p>

              <div className="mt-6 w-full space-y-3 rounded-2xl border border-rule bg-card-subtle p-4 text-left text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-ink-3 font-mono">Verified Email</span>
                  <span className="font-semibold text-ink font-mono">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between border-t border-rule/50 pt-2">
                  <span className="text-ink-3 font-mono">Device ID</span>
                  <span className="font-mono text-ink text-[11px] break-all">{deviceId}</span>
                </div>
                <div className="flex items-center justify-between border-t border-rule/50 pt-2 text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle className="h-3.5 w-3.5" /> License Active
                  </span>
                  <span className="font-mono text-[10px] uppercase">One-time Unlock</span>
                </div>
              </div>

              <a
                href={deepLink}
                className="btn btn-primary mt-6 w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold shadow-lg shadow-primary/20"
              >
                <Sparkles className="h-4 w-4" />
                <span>Open MusicStream App</span>
                <ExternalLink className="h-4 w-4 ml-1 opacity-80" />
              </a>

              <p className="mt-3 text-[11px] text-ink-3 leading-relaxed">
                If the app didn&apos;t open automatically, tap the button above. The app will save
                this verification and won&apos;t ask again.
              </p>
            </div>
          </div>
        )}
      </Reveal>
    </Sheet>
  )
}

