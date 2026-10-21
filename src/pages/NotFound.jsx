import { Link } from 'react-router-dom'
import Sheet from '../components/Sheet'
import Stamp from '../components/Stamp'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

/**
 * A sheet that isn't in the document.
 *
 * In this world a missing page has an exact meaning — the sheet was never
 * issued — so the void stamp does the work a generic "404" illustration would
 * otherwise do.
 */
export default function NotFound() {
  return (
    <Sheet label="Sheet not found">
      <div className="max-w-2xl">
        <Reveal>
          <SectionLabel index={9}>Sheet</SectionLabel>

          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-6">
            <h1 className="drawing-title text-2xl sm:text-4xl lg:text-5xl">Not issued</h1>
            <Stamp tone="void">Void</Stamp>
          </div>

          <p className="mt-4 sm:mt-8 font-sans text-sm sm:text-base normal-case leading-[1.7] text-ink-2">
            That page doesn't exist. It may have been moved or the link is out of date.
          </p>

          <div className="hatch mt-6 sm:mt-10 flex items-center justify-center border border-rule px-4 py-12 sm:py-16 text-center">
            <span className="label bg-sheet-deep px-3 py-1.5 text-center">No such sheet in this document</span>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col gap-2.5 sm:flex-row">
            <Link to="/" className="btn btn-primary justify-center">
              Back to Home
            </Link>
            <Link to="/docs" className="btn btn-secondary justify-center">
              Open the manual
            </Link>
          </div>
        </Reveal>
      </div>
    </Sheet>
  )
}
