import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Waveform from './Waveform'

/** The document's loading state: an instrument still taking a reading. */
function Reading(label) {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Waveform bars={9} height={28} barWidth={3} gap={3} barClassName="bg-rule" baseline />
      <p className="label" role="status">
        {label}
      </p>
    </div>
  )
}

/**
 * Gates a route.
 *
 *  - default        → must be signed in
 *  - requireAdmin   → must be the developer account
 *
 * Approval is NOT enforced here: the download page renders its own
 * "awaiting approval" state, which is friendlier than a redirect.
 *
 * These checks only shape the UI. The real boundary is Postgres RLS — a
 * non-admin cannot read other profiles or change a status, whatever the
 * browser does.
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { session, profile, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) return Reading('Checking your session')

  if (!session) {
    // Remember where they were headed so login can send them back.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/download" replace />
  }

  // Wait for the profile before rendering pages that branch on status.
  if (!requireAdmin && profile === null) return Reading('Loading your account')

  return children
}
