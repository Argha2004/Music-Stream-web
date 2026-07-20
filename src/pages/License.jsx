import { AlertTriangle, Ban, Check, Scale } from 'lucide-react'
import { Card } from '@heroui/react'
import Reveal from '../components/Reveal'

const PERMITTED = [
  'Install and use MusicStream on devices you personally own',
  'Use the app for private, non-commercial listening',
  'Study the app for personal educational purposes',
  'Report bugs and suggest improvements',
]

const NOT_PERMITTED = [
  'Redistribute, resell, or republish the APK anywhere',
  'Use MusicStream for any commercial purpose',
  'Remove or alter attribution, branding, or this licence',
  'Share your account credentials or download links publicly',
  'Represent the app or its content as your own work',
]

const THIRD_PARTY = [
  { name: 'AndroidX / Jetpack Compose / Media3', licence: 'Apache License 2.0' },
  { name: 'Kotlin & Kotlin Coroutines', licence: 'Apache License 2.0' },
  { name: 'Retrofit, OkHttp, Moshi (Square)', licence: 'Apache License 2.0' },
  { name: 'Coil', licence: 'Apache License 2.0' },
  { name: 'FFmpeg Kit', licence: 'LGPL v3.0 / GPL v3.0' },
  { name: 'Inter typeface', licence: 'SIL Open Font License 1.1' },
  { name: 'Lucide icons', licence: 'ISC License' },
]

export default function License() {
  return (
    <div className="container-x py-16">
      <Reveal className="mx-auto max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-accent">Legal</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">License</h1>
        <p className="mt-4 text-muted">
          Terms covering your use of the MusicStream application and this website.
        </p>

        {/* Summary card */}
        <Card variant="secondary" className="mt-10 border border-border p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <Scale className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-bold">Personal &amp; Educational Use License</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Copyright © {new Date().getFullYear()} Arghadeep Pakhira. All rights
                reserved. MusicStream is proprietary software provided free of charge to
                approved individuals for personal, non-commercial use. It is not open
                source and is not licensed for redistribution.
              </p>
            </div>
          </div>
        </Card>

        {/* Permissions grid */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Card variant="secondary" className="border border-border p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <Check className="h-4 w-4 text-success" aria-hidden="true" />
              You may
            </h2>
            <ul className="mt-4 space-y-3">
              {PERMITTED.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card variant="secondary" className="border border-border p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <Ban className="h-4 w-4 text-danger" aria-hidden="true" />
              You may not
            </h2>
            <ul className="mt-4 space-y-3">
              {NOT_PERMITTED.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted">
                  <Ban className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Content disclaimer */}
        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <h2 className="font-bold">Content disclaimer</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              MusicStream does not host, own, or distribute any music. It is a client that
              retrieves publicly accessible data from an unofficial selfmade API. All
              music, artwork, and metadata remain the property of their respective owners
              and rights holders.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This project exists for personal and educational purposes only. It is not
              affiliated with, endorsed by, or connected to any music service or label. You
              are responsible for ensuring your use complies with the laws and licensing
              terms that apply where you live.
            </p>
          </div>
        </div>

        {/* Full terms */}
        <article className="prose-doc mt-12">
          <h2>Full terms</h2>

          <h3>1. Grant of licence</h3>
          <p>
            Subject to these terms, you are granted a personal, non-exclusive,
            non-transferable, revocable licence to install and use MusicStream on devices
            you own, for private and non-commercial purposes only.
          </p>

          <h3>2. Restrictions</h3>
          <p>
            You may not copy, redistribute, sublicense, sell, rent, lease, or otherwise
            make the software available to third parties. You may not remove or obscure any
            copyright, trademark, or attribution notices. Access credentials issued to you
            are personal and must not be shared.
          </p>

          <h3>3. Access</h3>
          <p>
            Access to downloads is granted at the developer's sole discretion and may be
            revoked at any time, for any reason, without notice.
          </p>

          <h3>4. No warranty</h3>
          <p>
            The software is provided <strong>"as is"</strong>, without warranty of any
            kind, express or implied, including but not limited to the warranties of
            merchantability, fitness for a particular purpose, and non-infringement.
          </p>

          <h3>5. Limitation of liability</h3>
          <p>
            In no event shall the author be liable for any claim, damages, data loss, or
            other liability, whether in an action of contract, tort, or otherwise, arising
            from, out of, or in connection with the software or its use.
          </p>

          <h3>6. Third-party services</h3>
          <p>
            The app relies on third-party services it neither owns nor controls. Their
            availability, accuracy, and continued operation are not guaranteed, and they
            may change or disappear without notice.
          </p>

          <h3>7. Changes to these terms</h3>
          <p>
            These terms may be updated at any time. Continued use of the software after
            changes are published constitutes acceptance of the revised terms.
          </p>

          <h2>Third-party licences</h2>
          <p>
            MusicStream is built with the following open-source components, used under
            their respective licences:
          </p>
        </article>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Third-party components and their licences</caption>
            <thead className="bg-elevated">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Component
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Licence
                </th>
              </tr>
            </thead>
            <tbody>
              {THIRD_PARTY.map((row, i) => (
                <tr key={row.name} className={i > 0 ? 'border-t border-border' : ''}>
                  <td className="px-5 py-3 text-fg">{row.name}</td>
                  <td className="px-5 py-3 text-muted">{row.licence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-sm text-dim">
          Last updated {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}.
        </p>
      </Reveal>
    </div>
  )
}
