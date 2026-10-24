import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && anonKey)

if (!isConfigured && import.meta.env.DEV) {
  console.warn('[MusicStream] Supabase env vars missing — copy .env.example to .env.local')
}

// Safe placeholder values keep the app rendering (with a clear banner) instead
// of crashing at import time when env vars aren't set yet.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-key',
)

/** Newest published releases first — powers the changelog page. */
export async function fetchReleases() {
  const { data, error } = await supabase
    .from('releases')
    .select('version_code, version_name, name, notes, apk_url, apk_size, min_sdk, published_at')
    .eq('published', true)
    .order('version_code', { ascending: false })
  if (error) throw error
  return data ?? []
}

/** The single newest published release — powers the download page. */
export async function fetchLatestRelease() {
  const { data, error } = await supabase
    .from('releases')
    .select('version_code, version_name, name, notes, apk_url, apk_size, min_sdk, published_at')
    .eq('published', true)
    .order('version_code', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

// ---- admin: access requests -------------------------------------------------
// RLS restricts these to the developer account; a normal user calling them
// simply gets their own row (select) or an error (update).

/** Every account and its approval status, newest request first. */
export async function fetchProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, status, note, requested_at, decided_at')
    .order('requested_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

/** Approve or reject an account. `status` is 'approved' | 'rejected' | 'pending'. */
export async function setProfileStatus(id, status) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ status, decided_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

/**
 * Delete a user account (used when refusing/rejecting an account).
 * Tries the secure database RPC first, and falls back to deleting the profile row.
 */
export async function deleteUserAccount(id) {
  try {
    const { data, error } = await supabase.rpc('delete_user_account', { target_user_id: id })
    if (!error) return true
    console.warn('RPC delete_user_account error, attempting direct profile delete:', error)
  } catch (err) {
    console.warn('RPC delete_user_account failed:', err)
  }

  // Fallback: delete profile row directly
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
  if (profileError) throw profileError
  return true
}

/**
 * Emails the user about an approve/reject decision.
 *
 * Best-effort: the decision is already committed to the database, so a mail
 * failure is reported but never rolls anything back. Returns a short status
 * string for the admin UI.
 */
export async function notifyDecision(email, status, userId) {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  if (!token) return 'no-session'

  try {
    const res = await fetch('/api/notify-decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email, status, userId }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) return 'failed'
    return body.sent ? 'sent' : 'skipped'
  } catch {
    return 'failed'
  }
}

/**
 * Notifies the admin via email that a new user signed up and requested access.
 * Non-blocking: failures won't disrupt the user signup experience.
 */
export async function notifyAdminSignup(email) {
  if (!email) return 'skipped'
  try {
    const res = await fetch('/api/notify-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, requested_at: new Date().toISOString() }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) return 'failed'
    return body.sent ? 'sent' : 'skipped'
  } catch {
    return 'failed'
  }
}

export function formatBytes(bytes) {
  if (!bytes) return null
  return `${(bytes / 1048576).toFixed(1)} MB`
}

// ---- Bug Reports -------------------------------------------------------------

/** Submit a new bug report. */
export async function submitBugReport(report) {
  const { data, error } = await supabase
    .from('bug_reports')
    .insert([report])
    .select()
    .single()
  if (error) throw error
  return data
}

/** Fetch all bug reports for the admin panel, newest first. */
export async function fetchBugReports() {
  const { data, error } = await supabase
    .from('bug_reports')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

/** Delete a bug report (when resolved). */
export async function deleteBugReport(id) {
  const { error } = await supabase
    .from('bug_reports')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

/**
 * Emails the user that their bug report has been resolved.
 */
export async function notifyReportResolved({ email, reportTitle, category, resolutionNote }) {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  if (!token) return 'no-session'

  try {
    const res = await fetch('/api/notify-report-resolved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email, reportTitle, category, resolutionNote }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) return 'failed'
    return body.sent ? 'sent' : 'skipped'
  } catch {
    return 'failed'
  }
}

