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
 * Emails the user about an approve/reject decision.
 *
 * Best-effort: the decision is already committed to the database, so a mail
 * failure is reported but never rolls anything back. Returns a short status
 * string for the admin UI.
 */
export async function notifyDecision(email, status) {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  if (!token) return 'no-session'

  try {
    const res = await fetch('/api/notify-decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email, status }),
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
