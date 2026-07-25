import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchReleases, formatBytes } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Sheet from '../components/Sheet'
import Stamp from '../components/Stamp'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

/**
 * The revision history, set as a standards document's revision table.
 *
 * This is the clearest case of the world doing a job the product already
 * needed: the `releases` rows ARE revisions, `version_code` IS the revision
 * key, and the newest row is the one in force. Superseded revision numbers are
 * struck the way a controlled document marks them; the notes stay fully
 * readable, because people come here to read them.
 */

/** Loading placeholder: an area of the sheet not yet drawn. */
function PendingRows() {
  return (
    <div className="reg" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="reg-row hatch h-24" />
      ))}
    </div>
  )
}

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
    <Sheet label="Revision history" rev={current?.version_name}>
      <Reveal>
        <SectionLabel index={3}>Sheet</SectionLabel>
        <h1 className="drawing-title mt-6">Revisions</h1>
        <p className="mt-8 max-w-2xl font-sans text-base normal-case leading-[1.7] text-chalk-2">
          Every published build of MusicStream. The app checks this list on launch and
          tells you when a newer version is available.
        </p>
      </Reveal>

      <div className="mt-12">
        {loading ? (
          <PendingRows />
        ) : error ? (
          <div className="border border-void bg-sheet-deep" role="alert">
            <div className="flex items-center gap-2.5 border-b border-void bg-void/10 px-4 py-2.5">
              <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-void">
                Retrieval failed
              </span>
            </div>
            <div className="p-5">
              <p className="font-sans text-base normal-case leading-[1.7] text-chalk-2">
                Couldn't load the revision table. {error}
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
        ) : releases.length === 0 ? (
          <div className="hatch flex flex-col items-center justify-center border border-rule px-6 py-16 text-center">
            <span className="bg-sheet-deep px-3 py-1.5 label">No revisions issued</span>
            <p className="mt-4 max-w-sm bg-sheet-deep px-3 font-sans text-base normal-case leading-[1.7] text-chalk-2">
              Published builds will show up here with their release notes.
            </p>
          </div>
        ) : (
          <div className="reg">
            {/* Table header. Hidden below sm, where each revision becomes a
                stacked block with its own labelled figures. */}
            <div className="reg-hd hidden grid-cols-[5rem_1fr_7rem_6rem] gap-4 sm:grid">
              <span>Rev</span>
              <span>Description</span>
              <span>Issued</span>
              <span className="text-right">Size</span>
            </div>

            {releases.map((r, index) => {
              const superseded = index > 0
              return (
                <article key={r.version_code} className="reg-row">
                  <div className="grid gap-4 sm:grid-cols-[5rem_1fr_7rem_6rem] sm:items-baseline">
                    {/* Superseded revision numbers are struck, the way a
                        controlled document marks them. */}
                    <div className="flex items-center gap-2 sm:block">
                      <span className="label sm:hidden">Rev</span>
                      <span
                        className={`font-mono text-[0.875rem] font-bold tabular-nums ${
                          superseded ? 'text-chalk-3 line-through decoration-void' : 'text-stamp'
                        }`}
                      >
                        {r.version_name}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-sans text-base font-bold uppercase tracking-[0.04em] text-chalk">
                          {r.name}
                        </h2>
                        {index === 0 && (
                          <Stamp className="!px-2 !py-1 !text-[0.6875rem]">In force</Stamp>
                        )}
                      </div>

                      <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.1em] text-chalk-3">
                        Build {r.version_code}
                      </p>

                      {r.notes && (
                        <ul className="mt-4 space-y-2">
                          {r.notes
                            .split('\n')
                            .map((l) => l.replace(/^[-•]\s*/, '').trim())
                            .filter(Boolean)
                            .map((line, i) => (
                              <li key={i} className="flex gap-3">
                                <span
                                  aria-hidden="true"
                                  className="mt-2 h-1 w-1 shrink-0 bg-stamp"
                                />
                                <span className="font-sans text-base normal-case leading-[1.7] text-chalk-2">
                                  {line}
                                </span>
                              </li>
                            ))}
                        </ul>
                      )}

                      {index === 0 && (
                        <Link
                          to={user ? '/download' : '/login'}
                          className="btn btn-issue btn-sm mt-6"
                        >
                          {user ? 'Download this build' : 'Sign in to download'}
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:block">
                      <span className="label sm:hidden">Issued</span>
                      <span className="font-mono text-[0.6875rem] tabular-nums text-chalk-2">
                        {r.published_at}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:block sm:text-right">
                      <span className="label sm:hidden">Size</span>
                      <span className="font-mono text-[0.6875rem] tabular-nums text-chalk-2">
                        {formatBytes(r.apk_size) ?? '—'}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </Sheet>
  )
}
