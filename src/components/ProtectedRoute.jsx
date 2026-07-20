import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Spinner(label) {
  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"
        role="status"
        aria-label={label}
      />
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

  if (loading) return Spinner('Checking your session')

  if (!session) {
    // Remember where they were headed so login can send them back.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/download" replace />
  }

  // Wait for the profile before rendering pages that branch on status.
  if (!requireAdmin && profile === null) return Spinner('Loading your account')

  return children
}
