/**
 * GET /api/latest
 *
 * The endpoint the Android app polls. Returns the newest published release in
 * the exact manifest shape `UpdateManager.fetchLatest()` parses.
 *
 * This must stay PUBLIC and unauthenticated — the app has no login session.
 * It must also never be cached, or clients keep seeing the old version.
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

export default async function handler(req, res) {
  // latest.json is the only mutable resource here — never let it cache.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'server_not_configured' })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { data, error } = await supabase
      .from('releases')
      .select('version_code, version_name, name, notes, apk_url, apk_size, sha256, min_sdk, mandatory, published_at')
      .eq('published', true)
      .order('version_code', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'no_release' })

    const site = `https://${req.headers.host}`

    // Field names here are the contract with UpdateManager.kt — don't rename.
    return res.status(200).json({
      schema: 1,
      versionCode: data.version_code,
      versionName: data.version_name,
      name: data.name,
      notes: data.notes || '',
      apkUrl: data.apk_url,
      apkSize: Number(data.apk_size) || 0,
      sha256: data.sha256 || null,
      minSdk: data.min_sdk ?? 24,
      releasePage: `${site}/changelog`,
      mandatory: !!data.mandatory,
      publishedAt: data.published_at,
    })
  } catch (e) {
    return res.status(500).json({ error: 'fetch_failed', message: e.message })
  }
}
