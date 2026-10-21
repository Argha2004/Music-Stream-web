import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Sparkles, Calendar, HardDrive, CheckCircle2 } from 'lucide-react'
import { fetchReleases, formatBytes } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Sheet from '../components/Sheet'
import Stamp from '../components/Stamp'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

export default function Changelog() {
  const { user } = useAuth()
  const [releases, setReleases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    fetchReleases()
      .then((r) => active && setReleases(r))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const current = releases[0]

  return (
    <Sheet label="Releases" rev={current?.version_name}>
      <Reveal>
        <SectionLabel index={3}>Release history</SectionLabel>
        <h1 className="drawing-title mt-4 text-3xl sm:text-5xl">Revisions</h1>
        <p className="mt-3 max-w-2xl text-base text-ink-2">
          Every published build of MusicStream. Installed apps automatically poll this
          endpoint to notify you when updates are available.
        </p>
      </Reveal>

      <div className="mt-10">
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 rounded-3xl bg-card-subtle animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-6 text-red-800 dark:text-red-300">
            <p className="text-sm">Couldn't load release list. {error}</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm mt-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : releases.length === 0 ? (
          <div className="rounded-3xl border border-rule bg-card-subtle p-12 text-center">
            <h3 className="font-bold text-lg text-ink">No revisions published yet</h3>
            <p className="mt-2 text-sm text-ink-3">
              Published builds will appear here with complete release notes.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {releases.map((r, index) => {
              const isLatest = index === 0
              return (
                <div
                  key={r.version_code}
                  className={`rounded-3xl border p-6 sm:p-8 transition-all ${
                    isLatest
                      ? 'border-primary/40 bg-card-subtle shadow-sm'
                      : 'border-rule bg-card hover:border-rule/80'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-primary bg-primary-pill px-3 py-1 rounded-full">
                        v{r.version_name}
                      </span>
                      <span className="text-xs font-mono text-ink-3">
                        Build {r.version_code}
                      </span>
                      {isLatest && <Stamp>Latest</Stamp>}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-ink-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {r.published_at}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="h-3.5 w-3.5 text-primary" />
                        {formatBytes(r.apk_size) ?? '207 MB'}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold text-ink">
                    {r.name}
                  </h3>

                  {r.notes && (
                    <ul className="mt-4 space-y-2 text-sm text-ink-2">
                      {r.notes
                        .split('\n')
                        .map((l) => l.replace(/^[-•]\s*/, '').trim())
                        .filter(Boolean)
                        .map((line, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span>{line}</span>
                          </li>
                        ))}
                    </ul>
                  )}

                  <div className="mt-6 pt-5 border-t border-rule/60 flex items-center justify-between">
                    <Link
                      to={user ? '/download' : '/signup'}
                      className={`btn btn-sm ${isLatest ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{user ? 'Download this APK' : 'Request access'}</span>
                    </Link>

                    {r.min_sdk && (
                      <span className="text-xs text-ink-3">
                        Min Android {r.min_sdk >= 24 ? '7.0+' : 'API ' + r.min_sdk}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Sheet>
  )
}
