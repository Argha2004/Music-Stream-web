import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchProfiles, notifyDecision, setProfileStatus } from '../lib/supabase'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

/**
 * The approvals register — the operator's sheet.
 *
 * This is Operate mode: the task outranks expression. The world contributes the
 * ruled register and the vocabulary of stamping a decision, but the row layout,
 * the readable email, and the per-row busy state are all driven by what the job
 * actually needs at 1am.
 */

const FILTERS = [
  { id: 'pending', label: 'Undecided' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Refused' },
  { id: 'all', label: 'All' },
]

const STATUS_TONE = {
  pending: 'text-ink-3',
  approved: 'text-stamp',
  rejected: 'text-void',
}

const STATUS_WORD = {
  pending: 'Undecided',
  approved: 'Approved',
  rejected: 'Refused',
}

export default function Admin() {
  const [profiles, setProfiles] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  // Per-row busy state so one action doesn't disable the whole register.
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      setProfiles(await fetchProfiles())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function decide(id, email, status) {
    setBusyId(id)
    setNotice(null)
    // Optimistic: reflect the change immediately, roll back if it fails.
    const previous = profiles
    setProfiles((rows) =>
      rows.map((r) => (r.id === id ? { ...r, status, decided_at: new Date().toISOString() } : r)),
    )
    try {
      await setProfileStatus(id, status)

      // Email is best-effort — the decision is already saved either way.
      const mail = await notifyDecision(email, status)
      if (mail === 'sent') {
        setNotice({ tone: 'ok', text: `${email} ${status} — notification email sent.` })
      } else if (mail === 'skipped') {
        setNotice({
          tone: 'warn',
          text: `${email} ${status}. No email provider configured, so no notification was sent.`,
        })
      } else {
        setNotice({
          tone: 'warn',
          text: `${email} ${status}, but the notification email failed to send.`,
        })
      }
    } catch (e) {
      setProfiles(previous)
      setError(`Couldn't update: ${e.message}`)
    } finally {
      setBusyId(null)
    }
  }

  const counts = useMemo(
    () => ({
      pending: profiles.filter((p) => p.status === 'pending').length,
      approved: profiles.filter((p) => p.status === 'approved').length,
      rejected: profiles.filter((p) => p.status === 'rejected').length,
      all: profiles.length,
    }),
    [profiles],
  )

  const visible = filter === 'all' ? profiles : profiles.filter((p) => p.status === filter)

  return (
    <Sheet label="Approvals register">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index={8}>Sheet</SectionLabel>
            <h1 className="drawing-title mt-6">Approvals</h1>
          </div>
          <button type="button" className="btn btn-line btn-sm" onClick={load}>
            Refresh
          </button>
        </div>

        <p className="mt-8 max-w-2xl font-sans text-base normal-case leading-[1.7] text-ink-2">
          Approve who can download MusicStream. Changes take effect immediately.
        </p>
      </Reveal>

      {/* Filters double as counters. aria-pressed keeps toggle semantics that a
          plain styled button would otherwise lose. */}
      <div className="mt-10 flex flex-wrap">
        {FILTERS.map((f) => {
          const active = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
              className={`btn btn-sm -ml-px flex-1 border sm:flex-none ${
                active
                  ? 'border-stamp bg-stamp/10 text-stamp'
                  : 'border-rule text-ink-3 hover:text-ink'
              }`}
            >
              {f.label}
              <span className="tabular-nums">{counts[f.id]}</span>
            </button>
          )
        })}
      </div>

      {error && (
        <div className="mt-8 border border-void bg-void/10 px-4 py-3" role="alert">
          <p className="font-mono text-[0.875rem] leading-relaxed text-void">{error}</p>
        </div>
      )}

      {/* aria-live so the outcome is announced without stealing focus. */}
      {notice && (
        <div
          className={`mt-8 border px-4 py-3 ${
            notice.tone === 'ok'
              ? 'border-checked bg-checked/10'
              : 'border-stamp bg-stamp/10'
          }`}
          aria-live="polite"
        >
          <p
            className={`font-mono text-[0.875rem] leading-relaxed ${
              notice.tone === 'ok' ? 'text-checked' : 'text-stamp'
            }`}
          >
            {notice.text}
          </p>
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <div className="reg" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="reg-row hatch h-20" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="hatch flex flex-col items-center justify-center border border-rule px-6 py-16 text-center">
            <span className="bg-sheet-deep px-3 py-1.5 label">
              {filter === 'pending' ? 'No undecided requests' : `No ${filter} accounts`}
            </span>
            <p className="mt-4 max-w-sm bg-sheet-deep px-3 font-sans text-base normal-case leading-[1.7] text-ink-2">
              {filter === 'pending'
                ? "You're all caught up. New sign-ups will appear here."
                : 'Nothing to show for this filter.'}
            </p>
          </div>
        ) : (
          <div className="reg">
            <div className="reg-hd hidden grid-cols-[1fr_8rem_14rem] gap-4 lg:grid">
              <span>Account</span>
              <span>Status</span>
              <span className="text-right">Decision</span>
            </div>

            <ul>
              {visible.map((p) => (
                <li key={p.id} className="reg-row">
                  {/* Stacked on phones: side-by-side crushed the email and
                      truncated it, so you couldn't read who you were approving. */}
                  <div className="grid gap-4 lg:grid-cols-[1fr_8rem_14rem] lg:items-center">
                    <div className="min-w-0">
                      {/* break-all, not truncate: you're deciding access based on
                          this address, so a hidden tail could mean approving the
                          wrong account. */}
                      <p className="break-all font-mono text-[0.875rem] text-ink">
                        {p.email}
                      </p>
                      <p className="mt-1.5 font-mono text-[0.6875rem] tabular-nums tracking-[0.08em] text-ink-3">
                        Requested {new Date(p.requested_at).toLocaleString()}
                        {p.decided_at
                          ? ` · decided ${new Date(p.decided_at).toLocaleDateString()}`
                          : ''}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] ${
                          STATUS_TONE[p.status] || 'text-ink-3'
                        }`}
                      >
                        {STATUS_WORD[p.status] || p.status}
                      </span>
                    </div>

                    <div className="flex gap-0 lg:justify-end">
                      {p.status !== 'approved' && (
                        <button
                          type="button"
                          className="btn btn-sm btn-line flex-1 lg:flex-none"
                          disabled={busyId === p.id}
                          onClick={() => decide(p.id, p.email, 'approved')}
                        >
                          Approve
                        </button>
                      )}
                      {p.status !== 'rejected' && (
                        <button
                          type="button"
                          className="btn btn-sm btn-void -ml-px flex-1 lg:flex-none"
                          disabled={busyId === p.id}
                          onClick={() => decide(p.id, p.email, 'rejected')}
                        >
                          Refuse
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="mt-10 max-w-2xl font-sans text-base normal-case leading-[1.7] text-ink-3">
        Approval is enforced in the database, not the browser — a rejected user cannot
        reach the download page even by editing client state.
      </p>
    </Sheet>
  )
}
