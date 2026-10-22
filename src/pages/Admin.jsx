import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Users,
  Bug,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Tag,
  Mail,
  RefreshCw,
  Send,
  X,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react'
import {
  fetchProfiles,
  notifyDecision,
  setProfileStatus,
  fetchBugReports,
  deleteBugReport,
  notifyReportResolved,
} from '../lib/supabase'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

const FILTERS = [
  { id: 'pending', label: 'Undecided' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Refused' },
  { id: 'all', label: 'All' },
]

const REPORT_CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'playback', label: 'Playback' },
  { id: 'equalizer', label: 'Equalizer' },
  { id: 'lyrics', label: 'Lyrics' },
  { id: 'ui', label: 'UI' },
  { id: 'crash', label: 'Crash' },
  { id: 'library', label: 'Library' },
  { id: 'other', label: 'Other' },
]

const STATUS_WORD = {
  pending: 'Undecided',
  approved: 'Approved',
  rejected: 'Refused',
}

const SEVERITY_COLORS = {
  critical: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
  high: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
  medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  low: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('approvals') // 'approvals' | 'reports'

  // Approvals State
  const [profiles, setProfiles] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  // Reports State
  const [reports, setReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportFilter, setReportFilter] = useState('all')
  const [resolvingReport, setResolvingReport] = useState(null)
  const [resolutionNote, setResolutionNote] = useState('')
  const [isResolving, setIsResolving] = useState(false)

  // Shared Notifications
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  // Load User Profiles
  const loadProfiles = useCallback(async () => {
    setError(null)
    try {
      setProfiles(await fetchProfiles())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load Bug Reports
  const loadReports = useCallback(async () => {
    setError(null)
    setReportsLoading(true)
    try {
      const data = await fetchBugReports()
      setReports(data)
    } catch (e) {
      console.error('Error loading reports:', e)
      setError(
        e.message?.includes('does not exist')
          ? "The 'bug_reports' table is not yet created in Supabase. Run 'supabase/reports.sql' in Supabase SQL Editor."
          : `Could not load reports: ${e.message}`
      )
    } finally {
      setReportsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfiles()
  }, [loadProfiles])

  useEffect(() => {
    if (activeTab === 'reports') {
      loadReports()
    }
  }, [activeTab, loadReports])

  // Approve / Reject User
  async function decide(id, email, status) {
    setBusyId(id)
    setNotice(null)
    const previous = profiles
    setProfiles((rows) =>
      rows.map((r) => (r.id === id ? { ...r, status, decided_at: new Date().toISOString() } : r)),
    )
    try {
      await setProfileStatus(id, status)
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

  // Handle Resolving a Bug Report
  async function handleResolveSubmit(e) {
    e?.preventDefault()
    if (!resolvingReport) return

    setIsResolving(true)
    setError(null)
    setNotice(null)

    const targetReport = resolvingReport
    try {
      // 1. Send resolution email to the user
      const mailStatus = await notifyReportResolved({
        email: targetReport.user_email,
        reportTitle: targetReport.title,
        category: targetReport.category,
        resolutionNote: resolutionNote.trim() || undefined,
      })

      // 2. Delete the report from database as requested
      await deleteBugReport(targetReport.id)

      // 3. Optimistically remove from state
      setReports((prev) => prev.filter((r) => r.id !== targetReport.id))

      // 4. Success Notice
      const mailMessage =
        mailStatus === 'sent'
          ? 'Email notification sent to user.'
          : mailStatus === 'skipped'
            ? 'No email provider configured (skipping mail).'
            : 'Email failed to send, but report was deleted.'

      setNotice({
        tone: 'ok',
        text: `Resolved issue "${targetReport.title}" reported by ${targetReport.user_email}. ${mailMessage} Report deleted.`,
      })

      // Reset modal state
      setResolvingReport(null)
      setResolutionNote('')
    } catch (err) {
      console.error('Failed to resolve bug report:', err)
      setError(`Failed to resolve report: ${err.message}`)
    } finally {
      setIsResolving(false)
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

  const visibleProfiles = filter === 'all' ? profiles : profiles.filter((p) => p.status === filter)

  const visibleReports = useMemo(() => {
    if (reportFilter === 'all') return reports
    return reports.filter((r) => r.category === reportFilter)
  }, [reports, reportFilter])

  return (
    <Sheet label={activeTab === 'approvals' ? 'Approvals Register' : 'Bug Reports Register'}>
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-6">
          <div>
            <SectionLabel index={8}>Operator control</SectionLabel>
            <h1 className="drawing-title mt-2 sm:mt-4 text-2xl sm:text-4xl">Admin Dashboard</h1>
          </div>
          <button
            type="button"
            className="btn btn-line btn-sm shrink-0 flex items-center gap-1.5"
            onClick={activeTab === 'approvals' ? loadProfiles : loadReports}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tab Switcher: Approvals vs Bug Reports */}
        <div className="mt-6 p-1 rounded-2xl bg-sheet border border-rule w-fit flex flex-wrap gap-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-card text-ink shadow-xs border border-rule/80'
                : 'text-ink-3 hover:text-ink hover:bg-hover'
            }`}
          >
            <Users className="h-4 w-4 text-primary" />
            <span>Access Approvals</span>
            {counts.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary-pill text-primary">
                {counts.pending}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-card text-ink shadow-xs border border-rule/80'
                : 'text-ink-3 hover:text-ink hover:bg-hover'
            }`}
          >
            <Bug className="h-4 w-4 text-primary" />
            <span>Bug Reports</span>
            {reports.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20">
                {reports.length}
              </span>
            )}
          </button>
        </div>

        <p className="mt-4 sm:mt-5 max-w-2xl font-sans text-sm sm:text-base normal-case leading-[1.7] text-ink-2">
          {activeTab === 'approvals'
            ? 'Approve or refuse account access requests. Changes immediately grant or revoke download permissions.'
            : 'Review bug reports and issues submitted by app users. Resolving a report automatically emails the user and closes the ticket.'}
        </p>
      </Reveal>

      {/* Global Alerts / Notices */}
      {error && (
        <div
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-xs text-red-800 dark:text-red-300 flex items-start gap-2.5"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {notice && (
        <div
          className={`mt-6 rounded-2xl border px-4 py-3 flex items-start gap-2.5 ${
            notice.tone === 'ok'
              ? 'border-checked/30 bg-checked/10 text-checked'
              : 'border-stamp/30 bg-stamp/10 text-stamp'
          }`}
          aria-live="polite"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="font-mono text-xs sm:text-sm leading-relaxed">{notice.text}</p>
        </div>
      )}

      {/* =========================================================================
          VIEW A: ACCESS APPROVALS REGISTER
      ========================================================================= */}
      {activeTab === 'approvals' && (
        <div className="mt-6 sm:mt-8">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold transition-all ${
                    active
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-card-subtle text-ink-2 hover:bg-hover'
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[0.6875rem] font-mono ${
                      active ? 'bg-white/20 text-white' : 'bg-card text-ink-3'
                    }`}
                  >
                    {counts[f.id]}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="space-y-3" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-20 rounded-2xl bg-card-subtle/50 animate-pulse" />
                ))}
              </div>
            ) : visibleProfiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-rule rounded-3xl p-8 sm:p-14 text-center bg-card-subtle/30">
                <span className="bg-card px-3 py-1 rounded-full text-xs font-mono font-bold text-ink-3 border border-rule">
                  {filter === 'pending' ? 'No undecided requests' : `No ${filter} accounts`}
                </span>
                <p className="mt-3 text-sm text-ink-2 max-w-sm">
                  {filter === 'pending'
                    ? "You're all caught up. New sign-ups will appear here."
                    : 'Nothing to show for this filter.'}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl sm:rounded-3xl border border-rule bg-card overflow-hidden shadow-2xs">
                <div className="hidden grid-cols-[1fr_8rem_14rem] gap-4 px-6 py-3.5 bg-card-subtle font-mono text-xs font-bold uppercase tracking-wider text-ink-3 lg:grid border-b border-rule">
                  <span>Account</span>
                  <span>Status</span>
                  <span className="text-right">Action</span>
                </div>

                <ul className="divide-y divide-rule">
                  {visibleProfiles.map((p) => (
                    <li key={p.id} className="p-3.5 sm:p-5 transition-colors hover:bg-card-subtle/40">
                      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1fr_8rem_14rem] lg:items-center">
                        <div className="min-w-0">
                          <p className="break-all font-mono text-xs sm:text-sm font-semibold text-ink">
                            {p.email}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-ink-3">
                            Requested {new Date(p.requested_at).toLocaleDateString()}
                            {p.decided_at
                              ? ` · decided ${new Date(p.decided_at).toLocaleDateString()}`
                              : ''}
                          </p>
                        </div>

                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                              p.status === 'approved'
                                ? 'bg-primary-pill text-primary'
                                : p.status === 'rejected'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                  : 'bg-card-subtle text-ink-3'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                p.status === 'approved'
                                  ? 'bg-primary'
                                  : p.status === 'rejected'
                                    ? 'bg-red-500'
                                    : 'bg-ink-3'
                              }`}
                            />
                            {STATUS_WORD[p.status] || p.status}
                          </span>
                        </div>

                        <div className="flex gap-2 lg:justify-end">
                          {p.status !== 'approved' && (
                            <button
                              type="button"
                              className="btn btn-sm btn-primary flex-1 lg:flex-none text-xs py-2 px-3 sm:px-4 cursor-pointer"
                              disabled={busyId === p.id}
                              onClick={() => decide(p.id, p.email, 'approved')}
                            >
                              Approve
                            </button>
                          )}
                          {p.status !== 'rejected' && (
                            <button
                              type="button"
                              className="btn btn-sm btn-void flex-1 lg:flex-none text-xs py-2 px-3 sm:px-4 cursor-pointer"
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
        </div>
      )}

      {/* =========================================================================
          VIEW B: BUG REPORTS REGISTER
      ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="mt-6 sm:mt-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {REPORT_CATEGORIES.map((cat) => {
              const active = reportFilter === cat.id
              const count =
                cat.id === 'all'
                  ? reports.length
                  : reports.filter((r) => r.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setReportFilter(cat.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-card-subtle text-ink-2 hover:bg-hover'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      active ? 'bg-white/20 text-white' : 'bg-card text-ink-3'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Reports List */}
          <div className="mt-6">
            {reportsLoading ? (
              <div className="space-y-4" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-32 rounded-2xl bg-card-subtle/50 animate-pulse" />
                ))}
              </div>
            ) : visibleReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-rule rounded-3xl p-8 sm:p-14 text-center bg-card-subtle/30">
                <div className="w-12 h-12 rounded-full bg-primary-pill text-primary flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-base text-ink">No Bug Reports</h3>
                <p className="mt-1 text-sm text-ink-3 max-w-sm">
                  {reportFilter === 'all'
                    ? 'All clean! No open bug reports submitted.'
                    : `No reports found under the "${reportFilter}" category.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleReports.map((report) => {
                  const severityClass =
                    SEVERITY_COLORS[report.severity] || SEVERITY_COLORS.medium

                  return (
                    <div
                      key={report.id}
                      className="rounded-2xl sm:rounded-3xl border border-rule bg-card p-4 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      {/* Header Strip: Reporter Email & Metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-rule/70">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-primary-pill text-primary flex items-center justify-center shrink-0">
                            <Mail className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs sm:text-sm font-bold text-ink truncate">
                                {report.user_email}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-card-subtle text-ink-3 border border-rule/80 shrink-0">
                                User
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-ink-3 mt-0.5 font-mono">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(report.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Badges: Category & Severity */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-card-subtle text-ink-2 font-mono text-[10px] sm:text-xs font-semibold border border-rule">
                            {report.category}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${severityClass}`}
                          >
                            {report.severity || 'Medium'}
                          </span>
                        </div>
                      </div>

                      {/* Content: Title & Description */}
                      <div className="pt-3.5">
                        <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                          {report.title}
                        </h3>
                        <p className="mt-1.5 text-xs sm:text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">
                          {report.description}
                        </p>
                      </div>

                      {/* Steps to Reproduce if provided */}
                      {report.steps_to_reproduce && (
                        <div className="mt-3 p-3 rounded-xl bg-sheet/80 border border-rule/80">
                          <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-ink-3 mb-1">
                            <HelpCircle className="h-3.5 w-3.5 text-primary" />
                            <span>Steps to Reproduce</span>
                          </div>
                          <p className="text-xs text-ink-2 font-mono whitespace-pre-wrap leading-relaxed">
                            {report.steps_to_reproduce}
                          </p>
                        </div>
                      )}

                      {/* Device & Version Badges Footer & Resolve Button */}
                      <div className="mt-4 pt-3 border-t border-rule/60 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-3 font-mono">
                          {report.device_info && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sheet border border-rule/70">
                              <Smartphone className="h-3.5 w-3.5 text-primary" />
                              <span>{report.device_info}</span>
                            </span>
                          )}
                          {report.app_version && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sheet border border-rule/70">
                              <Tag className="h-3.5 w-3.5 text-primary" />
                              <span>v{report.app_version}</span>
                            </span>
                          )}
                        </div>

                        {/* RESOLVE BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            setResolvingReport(report)
                            setResolutionNote('')
                          }}
                          className="btn btn-sm btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow-sm cursor-pointer ml-auto"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Resolve Bug</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          RESOLVE CONFIRMATION / EMAIL NOTE MODAL
      ========================================================================= */}
      {resolvingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-rule bg-card p-6 sm:p-7 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-rule">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-ink">
                  Resolve Bug Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResolvingReport(null)}
                className="p-1 rounded-full text-ink-3 hover:text-ink hover:bg-hover transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-sheet border border-rule text-xs space-y-1">
                <div>
                  <span className="text-ink-3">Recipient User:</span>{' '}
                  <strong className="text-ink font-mono">{resolvingReport.user_email}</strong>
                </div>
                <div>
                  <span className="text-ink-3">Issue:</span>{' '}
                  <strong className="text-ink">{resolvingReport.title}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-2 mb-1.5 font-mono">
                  Optional Developer Resolution Note (included in email)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Fixed in release 3.0.3: Audio focus loss handling has been corrected."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full rounded-xl border border-rule bg-sheet p-3 text-xs sm:text-sm text-ink placeholder:text-ink-3/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed"
                />
              </div>

              <p className="text-[11px] text-ink-3 leading-snug">
                Clicking <strong>Resolve &amp; Delete</strong> will immediately send a resolution email to{' '}
                <span className="font-semibold text-ink-2">{resolvingReport.user_email}</span> and delete the bug report from the database.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setResolvingReport(null)}
                disabled={isResolving}
                className="btn btn-secondary px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveSubmit}
                disabled={isResolving}
                className="btn btn-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isResolving ? (
                  <>
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Resolving &amp; Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Resolve &amp; Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  )
}
