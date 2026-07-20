import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isConfigured, supabase } from '../lib/supabase'

const AuthContext = createContext(null)

/** Change this if admin rights move to a different account (also in schema.sql). */
export const DEVELOPER_EMAIL = 'arghadeeppakhira@gmail.com'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // Load the approval status whenever the signed-in user changes.
  const userId = session?.user?.id ?? null
  useEffect(() => {
    let active = true
    if (!userId) {
      setProfile(null)
      return
    }
    supabase
      .from('profiles')
      .select('id, email, status, requested_at, decided_at')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setProfile(data ?? null)
      })
    return () => {
      active = false
    }
  }, [userId])

  const value = useMemo(() => {
    const email = session?.user?.email ?? ''
    return {
      session,
      user: session?.user ?? null,
      profile,
      loading,

      // The DB is the real gate (RLS + is_admin()); these only drive the UI.
      isAdmin: email.toLowerCase() === DEVELOPER_EMAIL.toLowerCase(),
      isApproved: profile?.status === 'approved',
      status: profile?.status ?? null,

      /**
       * Signs in, then refuses to keep the session unless the account is
       * approved. Returns `{ error }` on a credential failure, or
       * `{ blocked: 'pending' | 'rejected' }` when access isn't granted yet.
       */
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) return { error }

        const { data: prof } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', data.user.id)
          .maybeSingle()

        if (prof?.status !== 'approved') {
          // Drop the session immediately — unapproved users stay signed out.
          await supabase.auth.signOut()
          return { error: null, blocked: prof?.status ?? 'pending' }
        }
        return { error: null, blocked: null }
      },

      /**
       * Creates the account. Supabase emails a confirmation link; clicking it
       * returns the user to the sign-in page.
       */
      signUp: (email, password) =>
        supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        }),

      signOut: () => supabase.auth.signOut(),

      /** Re-read the status, e.g. after the user taps "Check again". */
      refreshProfile: async () => {
        if (!userId) return null
        const { data } = await supabase
          .from('profiles')
          .select('id, email, status, requested_at, decided_at')
          .eq('id', userId)
          .maybeSingle()
        setProfile(data ?? null)
        return data ?? null
      },
    }
  }, [session, profile, loading, userId])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

/**
 * The database trigger rejects non-allowlisted emails with `not_allowlisted`.
 * Supabase surfaces that as an opaque 500, so translate it into something a
 * person can act on (rule: error messages must state cause + how to fix).
 */
export function humanizeAuthError(error) {
  if (!error) return null

  // Supabase can surface errors whose `message` is missing, an object, or the
  // literal string "{}" — never show those to a person.
  const message =
    typeof error === 'string' ? error : typeof error?.message === 'string' ? error.message : ''
  const text = message.trim()
  const isUseless = !text || text === '{}' || text === '[object Object]' || text === 'undefined'
  const raw = text.toLowerCase()

  // A failed fetch means we never reached Supabase at all.
  const unreachable =
    error?.name === 'AuthRetryableFetchError' ||
    error?.status === 0 ||
    raw.includes('failed to fetch') ||
    raw.includes('networkerror') ||
    raw.includes('load failed')

  if (unreachable) {
    return !isConfigured
      ? 'This site is not connected to Supabase yet. The VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are missing.'
      : "Couldn't reach the server. Check your internet connection and try again."
  }

  if (isUseless) {
    return !isConfigured
      ? 'This site is not connected to Supabase yet. The VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are missing.'
      : "Sign-up failed. This usually means your email isn't on the approved list, or the database setup (schema.sql) hasn't been run yet."
  }

  if (raw.includes('database error saving new user')) {
    return 'Could not create the account. The database setup may not have been run yet (schema.sql).'
  }
  if (raw.includes('invalid login credentials')) {
    return 'Wrong email or password. Check both and try again.'
  }
  if (raw.includes('email not confirmed')) {
    return 'Confirm your email first — check your inbox for the verification link.'
  }
  if (raw.includes('user already registered')) {
    return 'An account already exists for this email. Sign in instead.'
  }
  if (raw.includes('password should be at least')) {
    return 'Password must be at least 6 characters.'
  }
  if (raw.includes('rate limit') || raw.includes('too many')) {
    return 'Too many attempts. Wait a minute and try again.'
  }
  return error.message || 'Something went wrong. Try again.'
}
