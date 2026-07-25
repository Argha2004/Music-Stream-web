import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLatestRelease, formatBytes } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Sheet from '../components/Sheet'
import Stamp from '../components/Stamp'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

/**
 * Controlled issue of the build.
 *
 * The three access states are the sheet's whole subject, so each gets a real
 * document treatment rather than a badge:
 *   pending  → the issue area is hatched "not yet issued", and no stamp exists
 *   rejected → a VOID stamp in correction ink
 *   approved → the build is issued, with its figures recorded
 *
 * The download link is never rendered for an unapproved holder. That is a UI
 * courtesy on top of the real boundary, which is Postgres RLS.
 */

/** Shown while an access request is still pending, or after a rejection. */
function AwaitingIssue({ email, status, onRecheck }) {
  const [checking, setChecking] = useState(false)
  const rejected = status === 'rejected'

  async function recheck() {
    setChecking(true)
    await onRecheck()
    setChecking(false)
  }

  return (
    <Sheet label="Controlled issue">
      <Reveal className="max-w-2xl">
        <SectionLabel index={5}>Sheet</SectionLabel>
        <h1 className="drawing-title mt-6">{rejected ? 'Not issued' : 'Pending'}</h1>

        <div className="mt-10 border border-rule">
          <div className="plate-hd justify-between">
            <span className="label">Request record</span>
            {/* Pending deliberately carries no stamp — the absence IS the state. */}
            {rejected && <Stamp tone="void">Void</Stamp>}
          </div>

          <div className="bg-sheet-deep">
            <div className="flex flex-col gap-1.5 border-b border-rule-soft px-4 py-3.5 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="label w-32 shrink-0">Account</span>
              <span className="min-w-0 break-all font-mono text-[0.875rem] text-chalk">
                {email}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 px-4 py-3.5 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="label w-32 shrink-0">Status</span>
              <span
                className={`font-mono text-[0.875rem] uppercase tracking-[0.12em] ${
                  rejected ? 'text-void' : 'text-chalk-2'
                }`}
              >
                {rejected ? 'Not approved' : 'Awaiting decision'}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-8 font-sans text-base normal-case leading-[1.7] text-chalk-2">
          {rejected ? (
            <>
              Your request for <strong className="text-chalk">{email}</strong> wasn't
              approved. Contact the developer if you think this is a mistake.
            </>
          ) : (
            <>
              Your account <strong className="text-chalk">{email}</strong> has been created
              and your request is waiting for the developer to review it. You'll be able to
              download as soon as it's approved.
            </>
          )}
        </p>

        {/* The issue area exists, but is drawn as a void: nothing to collect yet. */}
        <div className="hatch mt-8 flex items-center justify-center border border-rule px-6 py-12">
          <span className="label bg-sheet-deep px-3 py-1.5">No build issued to you</span>
        </div>

        {!rejected && (
          <button
            type="button"
            className="btn btn-line mt-8"
            disabled={checking}
            onClick={recheck}
          >
            {checking ? 'Checking…' : 'Check again'}
          </button>
        )}

        <p className="mt-10 font-sans text-base normal-case leading-[1.7] text-chalk-2">
          In the meantime, read the{' '}
          <Link to="/docs" className="text-stamp underline decoration-stamp/40 underline-offset-4">
            manual
          </Link>{' '}
          or the{' '}
          <Link
            to="/changelog"
            className="text-stamp underline decoration-stamp/40 underline-offset-4"
          >
            revision history
          </Link>
          .
        </p>
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

  // Not approved yet — never render the download link.
  if (!isApproved) {
    return <AwaitingIssue email={user?.email} status={status} onRecheck={refreshProfile} />
  }

  return (
    <Sheet label="Controlled issue" rev={release?.version_name}>
      <Reveal className="max-w-2xl">
        <SectionLabel index={5}>Sheet</SectionLabel>
        <h1 className="drawing-title mt-6">Issue</h1>
        <p className="mt-8 font-mono text-[0.875rem] tracking-[0.06em] text-chalk-2">
          Issued to <span className="text-stamp">{user?.email}</span>
        </p>
      </Reveal>

      {/* --- The build --- */}
      <div className="mt-12 max-w-2xl">
        {loading ? (
          <div className="hatch h-56 border border-rule" aria-hidden="true" />
        ) : error ? (
          <div className="border border-void bg-sheet-deep" role="alert">
            <div className="flex items-center gap-2.5 border-b border-void bg-void/10 px-4 py-2.5">
              <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-void">
                Retrieval failed
              </span>
            </div>
            <div className="p-5">
              <p className="font-sans text-base normal-case leading-[1.7] text-chalk-2">
                Couldn't load the latest release. {error}
              </p>
              <button
                type="button"
                className="btn btn-line btn-sm mt-5"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          </div>
        ) : !release ? (
          <div className="hatch flex flex-col items-center justify-center border border-rule px-6 py-16 text-center">
            <span className="bg-sheet-deep px-3 py-1.5 label">No release published yet</span>
            <p className="mt-4 max-w-sm bg-sheet-deep px-3 font-sans text-base normal-case leading-[1.7] text-chalk-2">
              Once the first build is uploaded it will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="border border-stamp">
            <div className="plate-hd justify-between border-stamp bg-stamp/10">
              <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-stamp">
                Current build
              </span>
              <Stamp className="!px-2 !py-1 !text-[0.6875rem]">Issued</Stamp>
            </div>

            <div className="bg-sheet-deep">
              <div className="border-b border-rule-soft px-5 py-5">
                <h2 className="font-sans text-2xl font-bold uppercase tracking-[0.02em] text-chalk">
                  {release.name}
                </h2>
              </div>

              {/* Figures, recorded as measurements. */}
              <dl className="grid grid-cols-2 border-b border-rule-soft sm:grid-cols-4">
                {[
                  { k: 'Version', v: release.version_name },
                  { k: 'Build', v: release.version_code },
                  { k: 'Size', v: formatBytes(release.apk_size) ?? '—' },
                  { k: 'Android', v: release.min_sdk >= 24 ? '7.0+' : 'Supported' },
                ].map((f) => (
                  <div
                    key={f.k}
                    className="min-w-0 border-r border-rule-soft px-4 py-3.5 last:border-r-0"
                  >
                    <dt className="label">{f.k}</dt>
                    <dd className="mt-1.5 font-mono text-[0.875rem] font-medium tabular-nums text-chalk">
                      {f.v}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="px-5 py-4">
                <p className="label">Issued {release.published_at}</p>
              </div>

              {release.notes && (
                <ul className="space-y-2 border-t border-rule-soft px-5 py-5">
                  {release.notes
                    .split('\n')
                    .map((l) => l.replace(/^[-•]\s*/, '').trim())
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-stamp" />
                        <span className="font-sans text-base normal-case leading-[1.7] text-chalk-2">
                          {line}
                        </span>
                      </li>
                    ))}
                </ul>
              )}

              {/* A real <a download> — not a button — so the browser handles the file. */}
              <a
                href={release.apk_url}
                className="btn btn-issue w-full"
                download
                rel="noopener"
              >
                Download APK
              </a>
            </div>
          </div>
        )}

        {/* --- Installation --- */}
        <div className="plate mt-8">
          <div className="plate-hd">
            <span className="label">Installation procedure</span>
          </div>
          <ol className="bg-sheet-deep">
            {[
              <>
                Open the downloaded <code className="font-mono text-chalk">.apk</code> file.
              </>,
              <>
                Android will ask to allow installing unknown apps — allow it for your
                browser, and for MusicStream so in-app updates work later.
              </>,
              <>
                Tap <strong className="text-chalk">Install</strong>. Done.
              </>,
            ].map((step, i) => (
              <li
                key={i}
                className="flex gap-4 border-b border-rule-soft px-4 py-4 last:border-b-0"
              >
                <span className="font-mono text-[0.875rem] font-bold tabular-nums text-stamp">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 font-sans text-base normal-case leading-[1.7] text-chalk-2">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* --- Known condition --- */}
        <div className="mt-8 border border-stamp bg-sheet-deep">
          <div className="flex items-center gap-2.5 border-b border-stamp bg-stamp/10 px-4 py-2.5">
            <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-stamp">
              Upgrading from an older build?
            </span>
          </div>
          <div className="p-5">
            <p className="font-sans text-base normal-case leading-[1.7] text-chalk-2">
              If the install fails with "App not installed", you have a version signed with
              a different key. Uninstall the old MusicStream first — this is a one-time
              step.
            </p>
          </div>
        </div>

        <p className="mt-8 font-sans text-base normal-case leading-[1.7] text-chalk-2">
          Looking for older versions?{' '}
          <Link
            to="/changelog"
            className="text-stamp underline decoration-stamp/40 underline-offset-4"
          >
            See the revision history
          </Link>
        </p>
      </div>
    </Sheet>
  )
}
