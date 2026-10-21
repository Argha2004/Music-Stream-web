import { useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Sparkles } from 'lucide-react'

export const DOC_NO = 'MusicStream'

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
const SHEET_TOTAL = '08'

function sheetNumberFor(pathname) {
  return SHEET_INDEX[pathname] ?? SHEET_TOTAL
}

function TitleBlock({ sheetNo, rev }) {
  const { user, isApproved, status } = useAuth()
  const issuedTo = isApproved ? user?.email : 'Guest / Private preview'

  return (
    <div className="title-block mt-14 bg-card-subtle/80 border border-rule rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-3">
        <span className="font-mono font-bold uppercase tracking-wider text-ink-3">Page</span>
        <span className="font-mono font-semibold text-ink px-2.5 py-1 rounded-full bg-card border border-rule">
          {sheetNo} / {SHEET_TOTAL}
        </span>
      </div>

      {rev && (
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase tracking-wider text-ink-3">Version</span>
          <span className="font-mono font-semibold text-primary px-2.5 py-1 rounded-full bg-primary-pill">
            v{rev}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="font-mono uppercase tracking-wider text-ink-3">Status</span>
        <span className={`font-mono font-medium px-2.5 py-1 rounded-full ${isApproved ? 'bg-primary-pill text-primary' : 'bg-card text-ink-2 border border-rule'}`}>
          {issuedTo}
        </span>
      </div>
    </div>
  )
}

export default function Sheet({ children, label, rev }) {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const sheetNo = sheetNumberFor(pathname)

  return (
    <div className="container-x py-8 sm:py-12">
      <div className="rounded-[32px] sm:rounded-[40px] border border-rule bg-card p-6 sm:p-10 lg:p-12 shadow-sm">
        {/* Header strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink-2 font-mono">
              {label}
            </span>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-card-subtle text-ink-3 border border-rule font-mono">
            Section {sheetNo}
          </span>
        </div>

        <div className="pt-8">{children}</div>

        <TitleBlock sheetNo={sheetNo} rev={rev} />
      </div>
    </div>
  )
}
