import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bug,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Tag,
  Send,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { submitBugReport, fetchLatestRelease } from '../lib/supabase'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

const CATEGORIES = [
  { id: 'playback', label: 'Playback & Audio' },
  { id: 'equalizer', label: 'Equalizer & Bass' },
  { id: 'lyrics', label: 'Synced Lyrics' },
  { id: 'ui', label: 'UI & Glitches' },
  { id: 'crash', label: 'Crash / Freeze' },
  { id: 'library', label: 'Playlists & Library' },
  { id: 'updates', label: 'In-App Updates' },
  { id: 'other', label: 'Other Issue' },
]

const SEVERITIES = [
  { id: 'low', label: 'Low', desc: 'Cosmetic or minor' },
  { id: 'medium', label: 'Medium', desc: 'Normal functionality issue' },
  { id: 'high', label: 'High', desc: 'Major feature broken' },
  { id: 'critical', label: 'Critical', desc: 'App crashes or stops audio' },
]

export default function Report() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('playback')
  const [severity, setSeverity] = useState('medium')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stepsToReproduce, setStepsToReproduce] = useState('')
  const [deviceInfo, setDeviceInfo] = useState('')
  const [appVersion, setAppVersion] = useState('3.0.2')

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  // Pre-fill email from auth user if available
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
  }, [user])

  // Pre-fill latest version
  useEffect(() => {
    fetchLatestRelease()
      .then((rel) => {
        if (rel?.version_name) setAppVersion(rel.version_name)
      })
      .catch(() => {})
  }, [])

  // Auto-detect device model if possible
  useEffect(() => {
    try {
      const ua = navigator.userAgent
      if (/Android/i.test(ua)) {
        const match = ua.match(/Android\s+([0-9\.]+)/i)
        const versionStr = match ? `Android ${match[1]}` : 'Android device'
        setDeviceInfo(versionStr)
      } else {
        setDeviceInfo('Android device')
      }
    } catch {
      setDeviceInfo('Android device')
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const targetEmail = user?.email || email.trim()
    if (!targetEmail) {
      setError('Please provide your email address so we can notify you once the bug is resolved.')
      return
    }

    if (!title.trim() || !description.trim()) {
      setError('Please fill in both the issue title and detailed description.')
      return
    }

    setSubmitting(true)
    try {
      await submitBugReport({
        user_id: user?.id || null,
        user_email: targetEmail,
        category,
        severity,
        title: title.trim(),
        description: description.trim(),
        steps_to_reproduce: stepsToReproduce.trim() || null,
        device_info: deviceInfo.trim() || null,
        app_version: appVersion.trim() || null,
        status: 'pending',
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to submit bug report:', err)
      setError(
        err.message || 'Unable to submit bug report. Please verify your connection or try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setTitle('')
    setDescription('')
    setStepsToReproduce('')
    setError(null)
    setSubmitted(false)
  }

  return (
    <Sheet label="Bug Tracker">
      <Reveal>
        <div className="flex items-center justify-between gap-4">
          <div>
            <SectionLabel index={5}>Feedback &amp; Quality</SectionLabel>
            <h1 className="drawing-title mt-2 sm:mt-4 text-2xl sm:text-4xl">Report an Issue</h1>
          </div>
          <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-primary-pill text-primary items-center justify-center border border-primary/20">
            <Bug className="h-6 w-6" />
          </div>
        </div>

        <p className="mt-3 sm:mt-4 max-w-2xl font-sans text-sm sm:text-base leading-[1.7] text-ink-2">
          Help us refine Zuno. When you submit a bug report, it is sent directly to the developer&apos;s admin dashboard. Once resolved, you will receive an email update.
        </p>
      </Reveal>

      {/* Success State */}
      {submitted ? (
        <div className="mt-8 rounded-2xl sm:rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 sm:p-10 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
            Report Received!
          </h2>
          <p className="mt-2 text-sm text-ink-2 leading-relaxed">
            Thank you for helping us polish Zuno. Your bug report has been forwarded to the developer. An email will be sent to <strong className="text-ink font-semibold">{user?.email || email}</strong> as soon as the issue is resolved.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-primary w-full sm:w-auto px-6 py-2.5 text-sm font-semibold shadow-xs"
            >
              Submit another report
            </button>
            <Link
              to="/"
              className="btn btn-secondary w-full sm:w-auto px-6 py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Bug Report Submission Form */
        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 max-w-2xl">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/80 dark:bg-red-950/40 p-4 flex items-start gap-3 text-red-800 dark:text-red-300 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <div className="flex-1 leading-snug">{error}</div>
            </div>
          )}

          {/* User Email Info */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-2 mb-2 font-mono">
              Your Email Address <span className="text-primary">*</span>
            </label>
            {user ? (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-rule bg-sheet text-sm font-semibold text-ink">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{user.email}</span>
                <span className="ml-auto text-[11px] font-mono text-primary font-bold bg-primary-pill px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            ) : (
              <div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-rule bg-sheet px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-ink-3/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <p className="mt-1 text-[11px] text-ink-3">
                  We will notify you at this email address when your bug is fixed.
                </p>
              </div>
            )}
          </div>

          {/* Issue Category */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-2 mb-2 font-mono">
              Category <span className="text-primary">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary-pill text-primary-pill-text shadow-2xs font-bold'
                        : 'border-rule bg-card-subtle text-ink-2 hover:bg-hover hover:border-primary/40'
                    }`}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Severity Radio/Cards */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-2 mb-2 font-mono">
              Severity Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEVERITIES.map((sev) => {
                const isSelected = severity === sev.id
                return (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setSeverity(sev.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary-pill text-primary-pill-text shadow-2xs'
                        : 'border-rule bg-card-subtle text-ink-2 hover:bg-hover hover:border-primary/40'
                    }`}
                  >
                    <div className="font-bold text-xs">{sev.label}</div>
                    <div className="text-[10px] text-ink-3 mt-0.5 leading-tight">{sev.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Device & App Version Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-2 mb-2 font-mono flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-primary" />
                <span>Device / Android Version</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Pixel 8, Android 14"
                value={deviceInfo}
                onChange={(e) => setDeviceInfo(e.target.value)}
                className="w-full rounded-xl border border-rule bg-sheet px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-ink-3/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-2 mb-2 font-mono flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span>App Version</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 3.0.2"
                value={appVersion}
                onChange={(e) => setAppVersion(e.target.value)}
                className="w-full rounded-xl border border-rule bg-sheet px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-ink-3/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Issue Title */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-2 mb-2 font-mono">
              Short Summary / Title <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Playback stops unexpectedly when screen locks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-rule bg-sheet px-3.5 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-3/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Detailed Description */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-2 mb-2 font-mono">
              Detailed Description <span className="text-primary">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe what happened, what you expected to happen, and any error message displayed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-rule bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed"
            />
          </div>

          {/* Steps to Reproduce */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-2 mb-2 font-mono flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-ink-3" />
              <span>Steps to Reproduce (Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="1. Start playing any track&#10;2. Lock phone screen&#10;3. Audio cuts out after 10 seconds"
              value={stepsToReproduce}
              onChange={(e) => setStepsToReproduce(e.target.value)}
              className="w-full rounded-xl border border-rule bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed font-mono text-xs"
            />
          </div>

          {/* Submit & Cancel Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full sm:w-auto px-7 py-3.5 sm:py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer transition-all active:scale-[0.99]"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                  <span className="whitespace-nowrap">Submitting report...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">Submit Bug Report</span>
                </>
              )}
            </button>
            <Link
              to="/"
              className="btn btn-secondary w-full sm:w-auto px-6 py-3 text-sm font-semibold flex items-center justify-center text-center transition-all"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </Sheet>
  )
}
