import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, Hourglass, RefreshCw, ShieldCheck, UserX, Users } from 'lucide-react'
import { Alert, Button, Card, Chip, Skeleton } from '@heroui/react'
import { fetchProfiles, notifyDecision, setProfileStatus } from '../lib/supabase'
import Reveal from '../components/Reveal'

const FILTERS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
]

const STATUS_COLOR = {
  pending: 'accent',
  approved: 'success',
  rejected: 'danger',
}

export default function Admin() {
  const [profiles, setProfiles] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  // Per-row busy state so one action doesn't disable the whole table.
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
    <div className="container-x py-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-accent">
              Developer
            </p>
            <h1 className="mt-3 flex items-center gap-3 text-3xl font-extrabold tracking-tight">
              <ShieldCheck className="h-7 w-7 text-accent" aria-hidden="true" />
              Access requests
            </h1>
            <p className="mt-3 text-muted">
              Approve who can download MusicStream. Changes take effect immediately.
            </p>
          </div>

          <Button variant="outline" size="sm" onPress={load}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        </div>

        {/* Filters double as counters. aria-pressed keeps the toggle semantics
            that a plain styled button would otherwise lose. */}
        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.id
            return (
              <Button
                key={f.id}
                size="sm"
                variant={active ? 'primary' : 'outline'}
                aria-pressed={active}
                onPress={() => setFilter(f.id)}
              >
                {f.label}
                <span className={`ml-1.5 tabular-nums ${active ? 'opacity-70' : 'text-dim'}`}>
                  {counts[f.id]}
                </span>
              </Button>
            )
          })}
        </div>

        {error && (
          <Alert status="danger" className="mt-6" role="alert">
            <Alert.Indicator>
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        {/* aria-live so the outcome is announced without stealing focus. */}
        {notice && (
          <Alert
            status={notice.tone === 'ok' ? 'success' : 'accent'}
            className="mt-6"
            aria-live="polite"
          >
            <Alert.Indicator>
              {notice.tone === 'ok' ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
              )}
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Description>{notice.text}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <div className="mt-8">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Card key={i} variant="secondary" className="border border-border p-6">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="mt-3 h-3 w-1/4" />
                </Card>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <Card variant="secondary" className="border border-border p-10 text-center">
              {filter === 'pending' ? (
                <Hourglass className="mx-auto h-10 w-10 text-dim" aria-hidden="true" />
              ) : (
                <Users className="mx-auto h-10 w-10 text-dim" aria-hidden="true" />
              )}
              <p className="mt-4 font-semibold">
                {filter === 'pending' ? 'No pending requests' : `No ${filter} accounts`}
              </p>
              <p className="mt-2 text-sm text-muted">
                {filter === 'pending'
                  ? "You're all caught up. New sign-ups will appear here."
                  : 'Nothing to show for this filter.'}
              </p>
            </Card>
          ) : (
            <ul className="space-y-3">
              {visible.map((p) => (
                <li key={p.id}>
                  <Card
                    variant="secondary"
                    className="flex flex-row flex-wrap items-center gap-4 border border-border p-5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="truncate font-semibold">{p.email}</p>
                        <Chip color={STATUS_COLOR[p.status] || 'default'} size="sm">
                          {p.status}
                        </Chip>
                      </div>
                      <p className="mt-1 text-xs text-dim">
                        Requested {new Date(p.requested_at).toLocaleString()}
                        {p.decided_at
                          ? ` · decided ${new Date(p.decided_at).toLocaleDateString()}`
                          : ''}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {p.status !== 'approved' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          isDisabled={busyId === p.id}
                          onPress={() => decide(p.id, p.email, 'approved')}
                        >
                          <Check className="h-4 w-4" aria-hidden="true" />
                          Approve
                        </Button>
                      )}
                      {p.status !== 'rejected' && (
                        <Button
                          variant="danger-soft"
                          size="sm"
                          isDisabled={busyId === p.id}
                          onPress={() => decide(p.id, p.email, 'rejected')}
                        >
                          <UserX className="h-4 w-4" aria-hidden="true" />
                          Reject
                        </Button>
                      )}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-10 text-sm text-dim">
          Approval is enforced in the database, not the browser — a rejected user cannot
          reach the download page even by editing client state.
        </p>
      </Reveal>
    </div>
  )
}
