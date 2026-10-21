import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download as DownloadIcon, Smartphone, CheckCircle, AlertTriangle, ArrowRight, RefreshCw, FileCode } from 'lucide-react'
import { fetchLatestRelease, formatBytes } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Sheet from '../components/Sheet'
import Stamp from '../components/Stamp'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

function AwaitingIssue({ email, status, onRecheck }) {
  const [checking, setChecking] = useState(false)
  const rejected = status === 'rejected'

  async function recheck() {
    setChecking(true)
    await onRecheck()
    setChecking(false)
  }

  return (
    <Sheet label="Account status">
      <Reveal className="max-w-2xl">
        <SectionLabel index={5}>Controlled access</SectionLabel>
        <h1 className="drawing-title mt-4 text-3xl sm:text-5xl">
          {rejected ? 'Request declined' : 'Approval pending'}
        </h1>

        <div className="mt-8 rounded-3xl border border-rule bg-card-subtle p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-rule">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-3">
              Request Record
            </span>
            <Stamp tone={rejected ? 'void' : 'approve'}>
              {rejected ? 'Refused' : 'Awaiting developer'}
            </Stamp>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-ink-3">Account</span>
              <span className="font-mono font-semibold text-ink break-all">{email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-ink-3">Decision</span>
              <span className="font-medium text-ink-2">
                {rejected
                  ? 'Access was not approved for this address'
                  : 'Reviewing by developer (usually < 24h)'}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-base text-ink-2 leading-relaxed">
          {rejected ? (
            <>
              Your request for <strong className="text-ink">{email}</strong> was not approved.
              If you think this is a mistake, contact the developer.
            </>
          ) : (
            <>
              Your account has been created and is waiting for developer approval. As soon
              as your email is approved, you will be able to download the app directly.
            </>
          )}
        </p>

        {!rejected && (
          <button
            type="button"
            className="btn btn-secondary mt-6 flex items-center gap-2"
            disabled={checking}
            onClick={recheck}
          >
            <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking status…' : 'Check approval status'}</span>
          </button>
        )}

        <div className="mt-8 pt-6 border-t border-rule text-sm text-ink-2">
          Want to know more? Check the{' '}
          <Link to="/docs" className="text-primary font-semibold hover:underline">
            operating manual
          </Link>{' '}
          or the{' '}
          <Link to="/changelog" className="text-primary font-semibold hover:underline">
            revision history
          </Link>
          .
        </div>
      </Reveal>
    </Sheet>
  )
}

export default function Download() {
  const { user, status, isApproved, refreshProfile } = useAuth()
  const [release, setRelease] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isApproved) return
    let active = true
    fetchLatestRelease()
      .then((r) => active && setRelease(r))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [isApproved])

  if (!isApproved) {
    return <AwaitingIssue email={user?.email} status={status} onRecheck={refreshProfile} />
  }

  return (
    <Sheet label="Download release" rev={release?.version_name}>
      <Reveal className="max-w-3xl">
        <SectionLabel index={5}>Downloads</SectionLabel>
        <h1 className="drawing-title mt-4 text-3xl sm:text-5xl">Get MusicStream</h1>
        <p className="mt-3 text-sm font-medium text-ink-3">
          Issued to approved tester <span className="text-primary font-semibold">{user?.email}</span>
        </p>
      </Reveal>

      <div className="mt-10 max-w-3xl">
        {loading ? (
          <div className="h-64 rounded-3xl bg-card-subtle animate-pulse" />
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-6 text-red-800 dark:text-red-300">
            <h3 className="font-bold">Failed to load release</h3>
            <p className="mt-2 text-sm">{error}</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : !release ? (
          <div className="rounded-3xl border border-rule bg-card-subtle p-12 text-center">
            <h3 className="font-bold text-lg text-ink">No release published yet</h3>
            <p className="mt-2 text-sm text-ink-3">
              Once the developer uploads a release, it will be available here.
            </p>
          </div>
        ) : (
          <div className="rounded-[32px] sm:rounded-[36px] bg-[#C1E5A5] dark:bg-[#1E3E24] text-[#1B3E21] dark:text-[#EEF5EE] p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#2A5C34] dark:text-[#78C587] bg-white/60 dark:bg-black/30 px-3 py-1 rounded-full">
                  Current build • v{release.version_name}
                </span>
                <span className="text-xs font-medium text-ink-2 dark:text-[#B2C9B5]">
                  Published {release.published_at}
                </span>
              </div>

              <h2 className="mt-5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {release.name}
              </h2>

              {/* Stats pills */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white/70 dark:bg-black/20 p-3.5 backdrop-blur-xs">
                  <div className="text-[0.6875rem] font-mono uppercase text-[#415746] dark:text-[#A8C2AC]">Version</div>
                  <div className="mt-1 font-mono font-bold text-base text-ink">{release.version_name}</div>
                </div>
                <div className="rounded-2xl bg-white/70 dark:bg-black/20 p-3.5 backdrop-blur-xs">
                  <div className="text-[0.6875rem] font-mono uppercase text-[#415746] dark:text-[#A8C2AC]">Build code</div>
                  <div className="mt-1 font-mono font-bold text-base text-ink">{release.version_code}</div>
                </div>
                <div className="rounded-2xl bg-white/70 dark:bg-black/20 p-3.5 backdrop-blur-xs">
                  <div className="text-[0.6875rem] font-mono uppercase text-[#415746] dark:text-[#A8C2AC]">APK Size</div>
                  <div className="mt-1 font-mono font-bold text-base text-ink">{formatBytes(release.apk_size) || '207 MB'}</div>
                </div>
                <div className="rounded-2xl bg-white/70 dark:bg-black/20 p-3.5 backdrop-blur-xs">
                  <div className="text-[0.6875rem] font-mono uppercase text-[#415746] dark:text-[#A8C2AC]">Android</div>
                  <div className="mt-1 font-mono font-bold text-base text-ink">{release.min_sdk >= 24 ? '7.0+' : 'Supported'}</div>
                </div>
              </div>

              {/* Release notes */}
              {release.notes && (
                <div className="mt-6 rounded-2xl bg-white/60 dark:bg-black/20 p-4 sm:p-5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#315738] dark:text-[#B2C9B5] mb-3">
                    What's new in this build:
                  </h4>
                  <ul className="space-y-2 text-sm text-[#27462C] dark:text-[#D5E8D8]">
                    {release.notes
                      .split('\n')
                      .map((l) => l.replace(/^[-•]\s*/, '').trim())
                      .filter(Boolean)
                      .map((line, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1B3E21] dark:bg-[#78C587] mt-2 shrink-0" />
                          <span>{line}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Download Action */}
              <div className="mt-8">
                <a
                  href={release.apk_url}
                  className="btn bg-[#1B3E21] text-white hover:bg-[#122B17] w-full py-4 text-base font-bold shadow-lg flex items-center justify-center gap-3"
                  download
                  rel="noopener"
                >
                  <DownloadIcon className="h-5 w-5" />
                  <span>Download MusicStream APK</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Installation instructions */}
        <div className="mt-10 rounded-3xl border border-rule bg-card-subtle p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold text-ink">Installation steps</h3>
          <ol className="mt-4 space-y-4">
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-pill text-xs font-bold text-primary">
                1
              </span>
              <p className="text-sm text-ink-2 leading-relaxed">
                Open the downloaded <code className="font-mono bg-card px-1.5 py-0.5 rounded border border-rule">.apk</code> file from your browser downloads or Files app.
              </p>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-pill text-xs font-bold text-primary">
                2
              </span>
              <p className="text-sm text-ink-2 leading-relaxed">
                When Android warns about installing unknown apps, tap <strong>Settings</strong> and switch on <strong>Allow from this source</strong> for your browser.
              </p>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-pill text-xs font-bold text-primary">
                3
              </span>
              <p className="text-sm text-ink-2 leading-relaxed">
                Tap <strong>Install</strong>. Once installed, also grant MusicStream the permission to install unknown apps so in-app over-the-air updates work seamlessly.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </Sheet>
  )
}
