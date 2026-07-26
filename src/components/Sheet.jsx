import { useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

/**
 * Every page of this site is a numbered sheet of one controlled document.
 *
 * The sheet supplies the drawn frame, the header strip, and the title block —
 * the ruled grid of document-control cells at the foot of the page. The title
 * block is not decoration: ISSUED TO reads the real access state, so the
 * invite-only truth is carried by the world itself rather than by a
 * disclaimer bolted onto the copy.
 *
 * See DESIGN.md → "The Controlled Copy".
 */

export const DOC_NO = 'MS-WEB-001'

/* Sheet numbers are stable per route so a returning visitor can rely on them.
   Order follows the document, not the router config. */
const SHEET_INDEX = {
  '/': '01',
  '/docs': '02',
  '/changelog': '03',
  '/license': '04',
  '/download': '05',
  '/login': '06',
  '/signup': '07',
  '/admin': '08',
}
const SHEET_TOTAL = '09'

function sheetNumberFor(pathname) {
  // Anything unrouted is the last sheet: the withdrawn one.
  return SHEET_INDEX[pathname] ?? SHEET_TOTAL
}

/**
 * The document-control block. Cells butt against shared rules — a title block
 * is one ruled object, never a row of spaced cards.
 */
function TitleBlock({ sheetNo, rev }) {
  const { user, isApproved, status } = useAuth()

  // An unapproved holder has an uncontrolled copy. This is the honest reading:
  // they can see the document, they have not been issued the thing it describes.
  const issuedTo = isApproved ? user?.email : 'Uncontrolled copy'

  return (
    <div className="title-block mt-16">
      <div className="tb-cell">
        <span className="tb-k">Doc</span>
        <span className="tb-v">{DOC_NO}</span>
      </div>
      <div className="tb-cell">
        <span className="tb-k">Rev</span>
        <span className="tb-v">{rev ? rev : '—'}</span>
      </div>
      <div className="tb-cell">
        <span className="tb-k">Sheet</span>
        <span className="tb-v">
          {sheetNo} / {SHEET_TOTAL}
        </span>
      </div>
      <div className="tb-cell">
        <span className="tb-k">Issued to</span>
        <span className={`tb-v ${isApproved ? 'text-stamp' : 'text-ink-3'}`}>
          {issuedTo}
          {!user && ' — not signed in'}
          {user && !isApproved && status === 'rejected' && ' — not approved'}
        </span>
      </div>
    </div>
  )
}

/**
 * @param {string}  props.label  the header strip's description of this sheet
 * @param {string}  [props.rev]  the release version this sheet reflects, when known
 */
export default function Sheet({ children, label, rev }) {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const sheetNo = sheetNumberFor(pathname)

  return (
    <div className="container-x py-8 sm:py-12">
      <div className="sheet-frame sheet-ticks px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        {/* Header strip: what this sheet is, and where it sits in the document. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-rule pb-4">
          <span className="label text-ink">{label}</span>
          <span className="label">
            Sheet {sheetNo} of {SHEET_TOTAL}
          </span>
        </div>

        {/* The rule under the header draws itself, the way a sheet is made. */}
        <motion.div
          className="h-0.5 origin-left bg-stamp"
          initial={reduce ? false : { scaleX: 0 }}
          animate={reduce ? false : { scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        />

        <div className="pt-10">{children}</div>

        <TitleBlock sheetNo={sheetNo} rev={rev} />
      </div>
    </div>
  )
}
