import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Download, PackageOpen } from 'lucide-react'
import { Alert, Button, Card, Chip, Skeleton, buttonVariants } from '@heroui/react'
import { fetchReleases, formatBytes } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
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

  return (
    <div className="container-x py-16">
      <Reveal className="mx-auto max-w-3xl">
        <SectionLabel>Release notes</SectionLabel>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Changelog</h1>
        <p className="mt-5 text-lg text-muted">
          Every published build of MusicStream. The app checks this list on launch and
          tells you when a newer version is available.
        </p>

        <div className="mt-12">
          {loading ? (
            <div className="space-y-6">
              {[0, 1, 2].map((i) => (
                <Card key={i} variant="secondary" className="space-y-3 border border-border p-6">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <Alert status="danger" role="alert">
              <Alert.Indicator>
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
              </Alert.Indicator>
              <Alert.Content>
                <Alert.Title>Couldn't load releases</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onPress={() => window.location.reload()}
                >
                  Try again
                </Button>
              </Alert.Content>
            </Alert>
          ) : releases.length === 0 ? (
            <Card variant="secondary" className="card-lift border border-border p-10 text-center">
              <PackageOpen className="mx-auto h-10 w-10 text-dim" aria-hidden="true" />
              <p className="mt-4 font-semibold">No releases yet</p>
              <p className="mt-2 text-sm text-muted">
                Published builds will show up here with their release notes.
              </p>
            </Card>
          ) : (
            <ol className="relative space-y-8 border-l border-border pl-8">
              {releases.map((r, index) => (
                <li key={r.version_code} className="relative">
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-[2.32rem] top-1.5 h-3 w-3 rounded-full ring-4 ring-bg ${
                      index === 0
                        ? 'bg-accent shadow-[0_0_12px_2px] shadow-accent/50'
                        : 'bg-border'
                    }`}
                    aria-hidden="true"
                  />

                  <Card
                    variant="secondary"
                    className={`card-lift border p-6 ${
                      index === 0 ? 'border-accent/40' : 'card-interactive border-border'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold">{r.name}</h2>
                      {index === 0 && (
                        <Chip color="accent" size="sm">
                          Latest
                        </Chip>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted">
                      {r.published_at} · v{r.version_name} (build {r.version_code})
                      {formatBytes(r.apk_size) ? ` · ${formatBytes(r.apk_size)}` : ''}
                    </p>

                    {r.notes && (
                      <ul className="mt-5 space-y-2">
                        {r.notes
                          .split('\n')
                          .map((l) => l.replace(/^[-•]\s*/, '').trim())
                          .filter(Boolean)
                          .map((line, i) => (
                            <li key={i} className="flex gap-3 text-sm text-muted">
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              {line}
                            </li>
                          ))}
                      </ul>
                    )}

                    {index === 0 && (
                      <Link
                        to={user ? '/download' : '/login'}
                        className={`${buttonVariants({ variant: 'primary', size: 'sm' })} mt-6`}
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        {user ? 'Download this build' : 'Sign in to download'}
                      </Link>
                    )}
                  </Card>
                </li>
              ))}
            </ol>
          )}
        </div>
      </Reveal>
    </div>
  )
}
