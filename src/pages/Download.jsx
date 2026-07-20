import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Ban,
  Download as DownloadIcon,
  Hourglass,
  PackageOpen,
  RefreshCw,
  ShieldAlert,
  Smartphone,
} from 'lucide-react'
import { Alert, Button, Card, Chip, Skeleton, buttonVariants } from '@heroui/react'
import { fetchLatestRelease, formatBytes } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Reveal from '../components/Reveal'

/** Shown while an access request is still pending, or after a rejection. */
function AwaitingApproval({ email, status, onRecheck }) {
  const [checking, setChecking] = useState(false)
  const rejected = status === 'rejected'

  async function recheck() {
    setChecking(true)
    await onRecheck()
    setChecking(false)
  }

  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <Reveal className="w-full max-w-md text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
            rejected ? 'bg-danger/10' : 'bg-accent/10'
          }`}
        >
          {rejected ? (
            <Ban className="h-6 w-6 text-danger" aria-hidden="true" />
          ) : (
            <Hourglass className="h-6 w-6 text-accent" aria-hidden="true" />
          )}
        </div>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">
          {rejected ? 'Access not granted' : 'Access request pending'}
        </h1>

        <p className="mt-3 leading-relaxed text-muted">
          {rejected ? (
            <>
              Your request for <strong className="text-fg">{email}</strong> wasn't approved.
              Contact the developer if you think this is a mistake.
            </>
          ) : (
            <>
              Your account <strong className="text-fg">{email}</strong> has been created and
              your request is waiting for the developer to review it. You'll be able to
              download as soon as it's approved.
            </>
          )}
        </p>

        {!rejected && (
          <Button variant="outline" className="mt-8" isDisabled={checking} onPress={recheck}>
            <RefreshCw
              className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            {checking ? 'Checking…' : 'Check again'}
          </Button>
        )}

        <p className="mt-8 text-sm text-muted">
          In the meantime, browse the{' '}
          <Link to="/docs" className="font-semibold text-accent hover:underline">
            documentation
          </Link>{' '}
          or the{' '}
          <Link to="/changelog" className="font-semibold text-accent hover:underline">
            changelog
          </Link>
          .
        </p>
      </Reveal>
    </div>
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
    return <AwaitingApproval email={user?.email} status={status} onRecheck={refreshProfile} />
  }

  return (
    <div className="container-x py-16">
      <Reveal className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Download MusicStream
          </h1>
          <p className="mt-3 text-muted">
            Signed in as <strong className="text-fg">{user?.email}</strong>
          </p>
        </div>

        {/* --- Release card --- */}
        {loading ? (
          // Skeleton rather than a bare spinner (perf: progressive-loading).
          <Card variant="secondary" className="mt-10 space-y-4 border border-border p-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-full rounded-full" />
          </Card>
        ) : error ? (
          <Alert status="danger" className="mt-10" role="alert">
            <Alert.Indicator>
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Title>Couldn't load the latest release</Alert.Title>
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
        ) : !release ? (
          <Card variant="secondary" className="mt-10 border border-border p-10 text-center">
            <PackageOpen className="mx-auto h-10 w-10 text-dim" aria-hidden="true" />
            <p className="mt-4 font-semibold">No release published yet</p>
            <p className="mt-2 text-sm text-muted">
              Once the first build is uploaded it will appear here automatically.
            </p>
          </Card>
        ) : (
          <Card variant="secondary" className="mt-10 border border-accent/30 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold">{release.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  Published {release.published_at}
                  {formatBytes(release.apk_size) ? ` · ${formatBytes(release.apk_size)}` : ''}
                  {` · Android ${release.min_sdk >= 24 ? '7.0+' : 'supported'}`}
                </p>
              </div>
              <Chip color="accent" size="sm">
                v{release.version_name}
              </Chip>
            </div>

            {release.notes && (
              <ul className="mt-6 space-y-2 border-t border-border pt-6">
                {release.notes
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

            {/* A real <a download> — not a Button — so the browser handles the file. */}
            <a
              href={release.apk_url}
              className={`${buttonVariants({ variant: 'primary' })} mt-8 w-full`}
              download
              rel="noopener"
            >
              <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              Download APK
            </a>
          </Card>
        )}

        {/* --- Install guidance --- */}
        <Card variant="secondary" className="mt-6 border border-border p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <Smartphone className="h-4 w-4 text-accent" aria-hidden="true" />
            Installing
          </h2>
          <ol className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <strong className="text-fg">1.</strong> Open the downloaded{' '}
              <code className="rounded bg-elevated px-1.5 py-0.5 text-accent-hi">.apk</code>{' '}
              file.
            </li>
            <li>
              <strong className="text-fg">2.</strong> Android will ask to allow installing
              unknown apps — allow it for your browser, and for MusicStream so in-app updates
              work later.
            </li>
            <li>
              <strong className="text-fg">3.</strong> Tap{' '}
              <strong className="text-fg">Install</strong>. Done.
            </li>
          </ol>
        </Card>

        <Alert status="accent" className="mt-6">
          <Alert.Indicator>
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Upgrading from an older build?</Alert.Title>
            <Alert.Description>
              If the install fails with "App not installed", you have a version signed with a
              different key. Uninstall the old MusicStream first — this is a one-time step.
            </Alert.Description>
          </Alert.Content>
        </Alert>

        <p className="mt-8 text-center text-sm text-muted">
          Looking for older versions?{' '}
          <Link to="/changelog" className="font-semibold text-accent hover:underline">
            See the changelog
          </Link>
        </p>
      </Reveal>
    </div>
  )
}
