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
    ? `zuno://verify?token=${encodeURIComponent(session.access_token || '')}&email=${encodeURIComponent(
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
      <Reveal className="mx-auto max-w-xl w-full min-w-0">
        <SectionLabel index={4}>Device Licensing</SectionLabel>
        <h1 className="drawing-title mt-2 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl">
          App Verification
        </h1>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-2">
          Verify your mobile device to authorize and unlock your Zuno application.
        </p>

        {loading ? (
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-6 sm:p-8 text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary opacity-80" />
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-3">
              Checking Authorization…
            </p>
          </div>
        ) : !session ? (
          /* Case 1: User is not signed in */
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-3.5 sm:p-8 min-w-0 overflow-hidden w-full">
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 sm:pb-4 border-b border-rule">
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-ink-3 shrink-0">
                Authentication Required
              </span>
              <Stamp tone="void" className="text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 whitespace-nowrap shrink-0">
                Unauthenticated
              </Stamp>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col items-center text-center">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-3.5 sm:mb-4">
                <KeyRound className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-ink">Sign in to verify your device</h2>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-2 max-w-sm">
                Zuno requires an approved account to activate. Please sign in below to confirm
                your device authorization.
              </p>

              {deviceId && (
                <div className="mt-5 w-full rounded-xl sm:rounded-2xl border border-rule/60 bg-ground/50 p-3 sm:p-4 font-mono text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="uppercase text-[10px] sm:text-[11px] tracking-wider text-ink-3 font-semibold">
                      Pending Device ID
                    </span>
                    <Smartphone className="h-3.5 w-3.5 opacity-60 shrink-0" />
                  </div>
                  <div className="font-semibold text-ink break-all text-xs sm:text-sm select-all">
                    {deviceId}
                  </div>
                </div>
              )}

              <Link
                to="/login"
                state={{ from: `${location.pathname}${location.search}` }}
                className="btn btn-primary mt-6 w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-semibold"
              >
                <LogIn className="h-4 w-4 shrink-0" />
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
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-rule bg-card-subtle p-3.5 sm:p-8 min-w-0 overflow-hidden w-full">
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 sm:pb-4 border-b border-rule">
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-ink-3 shrink-0">
                Access Status
              </span>
              <Stamp tone={rejected ? 'void' : 'approve'} className="text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 whitespace-nowrap shrink-0">
                {rejected ? 'Refused' : 'Awaiting Approval'}
              </Stamp>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col items-center text-center">
              <div
                className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl mb-3.5 sm:mb-4 ${
                  rejected
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-amber-500/10 text-amber-500'
                }`}
              >
                <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-ink">
                {rejected ? 'Access Declined' : 'Approval Pending'}
              </h2>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-2 max-w-sm">
                {rejected
                  ? 'Your account request was declined. You cannot verify or use Zuno at this time.'
                  : 'Your account is waiting for developer approval. Once approved, you can verify your device and run Zuno.'}
              </p>

              <div className="mt-5 sm:mt-6 w-full divide-y divide-rule/60 rounded-xl sm:rounded-2xl border border-rule/60 bg-ground/50 p-3 sm:p-4 text-left">
                <div className="pb-2">
                  <div className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-3 mb-1">
                    Account Email
                  </div>
                  <div className="font-semibold text-ink font-mono text-xs sm:text-sm break-all select-all">
                    {user?.email}
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-3 mb-1">
                    Device ID
                  </div>
                  <div className="font-mono text-ink-2 text-xs sm:text-sm break-all select-all">
                    {deviceId}
                  </div>
                </div>
              </div>

              {!rejected && (
                <button
                  type="button"
                  onClick={handleRecheck}
                  disabled={checking}
                  className="btn btn-secondary mt-6 w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm"
                >
                  <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
                  <span>{checking ? 'Checking Status…' : 'Check Approval Status'}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Case 3: Signed in and Approved! */
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-primary/30 bg-primary/5 p-3.5 sm:p-8 min-w-0 overflow-hidden w-full">
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 sm:pb-4 border-b border-primary/20">
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-primary shrink-0">
                Device Authorized
              </span>
              <Stamp tone="approve" className="text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 whitespace-nowrap shrink-0">
                Verified Account
              </Stamp>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-3.5 sm:mb-4 shadow-lg shadow-primary/10">
                <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-ink">Ready to Launch Zuno</h2>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-2 max-w-sm">
                Your account is confirmed and approved. Click below to complete verification and unlock
                the Zuno app on your device.
              </p>

              <div className="mt-5 sm:mt-6 w-full divide-y divide-rule/60 rounded-xl sm:rounded-2xl border border-rule bg-card-subtle p-3 sm:p-4 text-left">
                {/* Verified Email */}
                <div className="pb-2.5">
                  <div className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-3 mb-1">
                    Verified Email
                  </div>
                  <div className="font-semibold text-ink font-mono text-xs sm:text-sm break-all select-all leading-snug">
                    {user?.email}
                  </div>
                </div>

                {/* Device ID */}
                <div className="py-2.5">
                  <div className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-3 mb-1">
                    Device ID
                  </div>
                  <div className="font-mono text-ink-2 text-xs sm:text-sm break-all select-all leading-snug">
                    {deviceId}
                  </div>
                </div>

                {/* License status */}
                <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5 font-medium text-[11px] sm:text-xs">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" /> License Active
                  </span>
                  <span className="font-mono text-[9.5px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    One-time Unlock
                  </span>
                </div>
              </div>

              <a
                href={deepLink}
                className="btn btn-primary mt-6 w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-3 text-xs sm:text-sm font-semibold shadow-lg shadow-primary/20 text-center"
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>Open Zuno App</span>
                <ExternalLink className="h-4 w-4 ml-0.5 sm:ml-1 opacity-80 shrink-0" />
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

