import { useNavigate } from 'react-router-dom'
import { AlertTriangle, UserX, ArrowRight, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RefusedWarningModal() {
  const { refusedWarning, dismissRefusedWarning } = useAuth()
  const navigate = useNavigate()

  if (!refusedWarning?.show) return null

  const handleSignUpAgain = () => {
    dismissRefusedWarning()
    navigate('/signup')
  }

  const handleClose = () => {
    dismissRefusedWarning()
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="refused-dialog-title"
      aria-describedby="refused-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-[28px] sm:rounded-[36px] border border-red-500/30 bg-sheet/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Close icon top-right */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-hover hover:text-ink transition-colors"
          aria-label="Dismiss warning"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon Badge */}
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 mb-5 shadow-xs">
          <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 mb-2.5">
          <UserX className="h-3 w-3" />
          <span>Access Decision</span>
        </div>

        {/* Title */}
        <h2 id="refused-dialog-title" className="font-display text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
          Account Approval Rejected
        </h2>

        {/* Recipient Email Info */}
        {refusedWarning.email && (
          <div className="mt-2 text-xs font-mono font-semibold text-red-600 dark:text-red-400 break-all bg-red-500/5 px-2.5 py-1 rounded-lg border border-red-500/20 inline-block">
            {refusedWarning.email}
          </div>
        )}

        {/* Description */}
        <p id="refused-dialog-desc" className="mt-3.5 text-sm sm:text-base text-ink-2 leading-relaxed">
          Your account approval status was <strong className="text-red-600 dark:text-red-400 font-semibold">rejected</strong> by the administrator. Your account record has been deleted from the database.
        </p>

        <p className="mt-2 text-xs sm:text-sm text-ink-3 leading-relaxed">
          To request access again, please sign up with your email to submit a new approval request to the admin.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={handleSignUpAgain}
            className="btn btn-primary w-full sm:flex-1 py-3 px-5 text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Sign Up Again</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary w-full sm:w-auto py-3 px-4 text-sm font-semibold flex items-center justify-center text-center cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
