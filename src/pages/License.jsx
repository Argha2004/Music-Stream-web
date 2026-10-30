import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

/**
 * Terms of use, set as numbered clauses with a schedule of use.
 *
 * A licence is already a clause document, so this sheet needed the least
 * translation of any: the permitted / not-permitted lists become a two-column
 * schedule, and the third-party notices become a ruled attribution table.
 */

const PERMITTED = [
  'Install and use Zuno on devices you personally own',
  'Use the app for private, non-commercial listening',
  'Study the app for personal educational purposes',
  'Report bugs and suggest improvements',
]

const NOT_PERMITTED = [
  'Redistribute, resell, or republish the APK anywhere',
  'Use Zuno for any commercial purpose',
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
  { name: 'Inter & Space Grotesk typefaces', licence: 'SIL Open Font License 1.1' },
  { name: 'Lucide icons', licence: 'ISC License' },
]

/** A numbered clause heading that can be cited by its number. */
function ClauseHead({ no, children }) {
  return (
    <div className="mb-5 sm:mb-6 flex items-center gap-2.5 sm:gap-3 border-b border-rule pb-3">
      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-primary-pill text-primary shrink-0">
        § {no}
      </span>
      <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink min-w-0">
        {children}
      </h2>
    </div>
  )
}

export default function License() {
  return (
    <Sheet label="License & Terms">
      <Reveal className="max-w-3xl">
        <SectionLabel index={4}>Legal</SectionLabel>
        <h1 className="drawing-title mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl">Terms of Use</h1>
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-ink-2">
          Terms governing your private and educational use of Zuno and this portal.
        </p>
      </Reveal>

      {/* --- The grant --- */}
      <section className="mt-14 max-w-3xl">
        <div className="plate">
          <div className="plate-hd">
            <span className="font-mono text-[0.6875rem] font-bold tracking-[0.18em] text-stamp">
              § 01
            </span>
            <span className="label">Personal &amp; educational use licence</span>
          </div>
          <div className="plate-bd">
            <p className="font-sans text-base normal-case leading-[1.7] text-ink-2">
              Copyright © {new Date().getFullYear()} Arghadeep Pakhira. All rights
              reserved. Zuno is proprietary software provided free of charge to
              approved individuals for personal, non-commercial use. It is not open source
              and is not licensed for redistribution.
            </p>
          </div>
        </div>
      </section>

      {/* --- Schedule of use --- */}
      <section className="mt-10 sm:mt-12 max-w-3xl">
        <ClauseHead no="02">Schedule of use</ClauseHead>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="plate">
            <div className="plate-hd">
              <span className="label text-checked">You may</span>
            </div>
            {PERMITTED.map((item) => (
              <div
                key={item}
                className="flex gap-3 border-b border-rule-soft px-4 py-3.5 last:border-b-0"
              >
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-checked" />
                <span className="font-sans text-base normal-case leading-[1.6] text-ink-2">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="plate">
            <div className="plate-hd">
              <span className="label text-void">You may not</span>
            </div>
            {NOT_PERMITTED.map((item) => (
              <div
                key={item}
                className="flex gap-3 border-b border-rule-soft px-4 py-3.5 last:border-b-0"
              >
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-void" />
                <span className="font-sans text-base normal-case leading-[1.6] text-ink-2">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Content disclaimer --- */}
      <section className="mt-12 max-w-3xl">
        <div className="border border-stamp bg-sheet-deep">
          <div className="flex items-center gap-2.5 border-b border-stamp bg-stamp/10 px-4 py-2.5">
            <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-stamp">
              Content disclaimer
            </span>
          </div>
          <div className="p-5 sm:p-6">
            <p className="font-sans text-base normal-case leading-[1.7] text-ink-2">
              Zuno does not host, own, or distribute any music. It is a client that
              retrieves publicly accessible data from an unofficial selfmade API. All
              music, artwork, and metadata remain the property of their respective owners
              and rights holders.
            </p>
            <p className="mt-4 font-sans text-base normal-case leading-[1.7] text-ink-2">
              This project exists for personal and educational purposes only. It is not
              affiliated with, endorsed by, or connected to any music service or label. You
              are responsible for ensuring your use complies with the laws and licensing
              terms that apply where you live.
            </p>
          </div>
        </div>
      </section>

      {/* --- Full terms --- */}
      <section className="mt-12 max-w-3xl">
        <ClauseHead no="03">Full terms</ClauseHead>

        <article className="prose-doc">
          <h3>3.1 Grant of licence</h3>
          <p>
            Subject to these terms, you are granted a personal, non-exclusive,
            non-transferable, revocable licence to install and use Zuno on devices
            you own, for private and non-commercial purposes only.
          </p>

          <h3>3.2 Restrictions</h3>
          <p>
            You may not copy, redistribute, sublicense, sell, rent, lease, or otherwise
            make the software available to third parties. You may not remove or obscure any
            copyright, trademark, or attribution notices. Access credentials issued to you
            are personal and must not be shared.
          </p>

          <h3>3.3 Access</h3>
          <p>
            Access to downloads is granted at the developer's sole discretion and may be
            revoked at any time, for any reason, without notice.
          </p>

          <h3>3.4 No warranty</h3>
          <p>
            The software is provided <strong>"as is"</strong>, without warranty of any
            kind, express or implied, including but not limited to the warranties of
            merchantability, fitness for a particular purpose, and non-infringement.
          </p>

          <h3>3.5 Limitation of liability</h3>
          <p>
            In no event shall the author be liable for any claim, damages, data loss, or
            other liability, whether in an action of contract, tort, or otherwise, arising
            from, out of, or in connection with the software or its use.
          </p>

          <h3>3.6 Third-party services</h3>
          <p>
            The app relies on third-party services it neither owns nor controls. Their
            availability, accuracy, and continued operation are not guaranteed, and they
            may change or disappear without notice.
          </p>

          <h3>3.7 Changes to these terms</h3>
          <p>
            These terms may be updated at any time. Continued use of the software after
            changes are published constitutes acceptance of the revised terms.
          </p>
        </article>
      </section>

      {/* --- Third-party notices --- */}
      <section className="mt-12 max-w-3xl">
        <ClauseHead no="04">Third-party licences</ClauseHead>

        <p className="font-sans text-base normal-case leading-[1.7] text-ink-2">
          Zuno is built with the following open-source components, used under
          their respective licences:
        </p>

        <div className="reg mt-6">
          <div className="reg-hd hidden sm:grid sm:grid-cols-[1fr_auto] gap-4">
            <span>Component</span>
            <span>Licence</span>
          </div>
          {THIRD_PARTY.map((row) => (
            <div
              key={row.name}
              className="reg-row flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:items-baseline gap-1 sm:gap-4"
            >
              <span className="min-w-0 font-sans text-sm sm:text-base normal-case text-ink font-medium sm:font-normal">
                {row.name}
              </span>
              <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-primary sm:text-ink-3">
                {row.licence}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[0.6875rem] tracking-[0.12em] text-ink-3">
          Last updated{' '}
          {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}.
        </p>
      </section>
    </Sheet>
  )
}
