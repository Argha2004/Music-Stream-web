import { useLocation } from 'react-router-dom'

export const DOC_NO = 'MusicStream'

const SHEET_INDEX = {
  '/': '01',
  '/docs': '02',
  '/changelog': '03',
  '/license': '04',
  '/privacy': '05',
  '/privacy-policy': '05',
  '/support': '06',
  '/donate': '06',
  '/download': '07',
  '/login': '08',
  '/signup': '09',
  '/admin': '10',
}
const SHEET_TOTAL = '10'

function sheetNumberFor(pathname) {
  return SHEET_INDEX[pathname] ?? SHEET_TOTAL
}

export default function Sheet({ children, label }) {
  const { pathname } = useLocation()
  const sheetNo = sheetNumberFor(pathname)

  return (
    <div className="container-x py-4 sm:py-8 lg:py-12">
      <div className="rounded-2xl sm:rounded-[36px] lg:rounded-[40px] border border-rule bg-card p-3.5 sm:p-8 lg:p-12 shadow-sm">
        {/* Header strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3.5 sm:pb-5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ink-2 font-mono truncate">
              {label}
            </span>
          </div>

          <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full bg-card-subtle text-ink-3 border border-rule font-mono shrink-0">
            Section {sheetNo}
          </span>
        </div>

        <div className="pt-5 sm:pt-8 min-w-0">{children}</div>
      </div>
    </div>
  )
}
