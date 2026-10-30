/**
 * POST /api/notify-decision
 * Body: { email: string, status: 'approved' | 'rejected' }
 *
 * Emails a user that their access request was approved or rejected.
 *
 * Security: the caller must present the developer's Supabase access token.
 * Without this anyone could use the endpoint to send mail from your domain.
 *
 * Provider is chosen by environment variables, so you can switch without
 * touching code:
 *   RESEND_API_KEY            → Resend  (needs a VERIFIED DOMAIN to email
 *                               anyone other than your own account)
 *   SMTP_HOST/USER/PASS       → any SMTP service (Gmail, Brevo, SendGrid…),
 *                               which only needs a verified SENDER ADDRESS
 * If neither is set the call succeeds but reports that email was skipped —
 * the approval itself already happened in the database.
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const DEVELOPER_EMAIL = (process.env.DEVELOPER_EMAIL || 'arghadeeppakhira@gmail.com').toLowerCase()
const SITE_NAME = 'Zuno'

function buildEmail({ status, siteUrl }) {
  const approved = status === 'approved'
  const subject = approved
    ? `Your ${SITE_NAME} access has been approved`
    : `Your ${SITE_NAME} account approval status was rejected`

  const heading = approved ? 'Access approved' : 'Account approval rejected'
  const body = approved
    ? `Your request to access ${SITE_NAME} has been approved. You can now sign in and download the app.`
    : `Your account approval status for ${SITE_NAME} was rejected by the administrator. Your account has been removed. You can sign up again and submit a new approval request to the admin.`

  const button = approved
    ? `<a href="${siteUrl}/login" style="display:inline-block;background:#386A20;color:#FFFFFF;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:999px;margin-top:24px">Sign in to ${SITE_NAME}</a>`
    : `<a href="${siteUrl}/signup" style="display:inline-block;background:#BA1A1A;color:#FFFFFF;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:999px;margin-top:24px">Sign up again on ${SITE_NAME}</a>`

  const html = `<!doctype html>
<html><body style="margin:0;padding:32px 16px;background:#0B0B10;font-family:Inter,Segoe UI,system-ui,sans-serif">
  <table role="presentation" style="max-width:520px;margin:0 auto;background:#121218;border:1px solid #26262F;border-radius:16px">
    <tr><td style="padding:36px">
      <p style="margin:0;color:${approved ? '#78C587' : '#FFB4AB'};font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase">${SITE_NAME}</p>
      <h1 style="margin:14px 0 0;color:#F8FAFC;font-size:24px;font-weight:800">${heading}</h1>
      <p style="margin:16px 0 0;color:#9CA3AF;font-size:15px;line-height:1.6">${body}</p>
      ${button}
    </td></tr>
  </table>
  <p style="max-width:520px;margin:20px auto 0;color:#6B7280;font-size:12px;text-align:center">
    You received this because you requested access to ${SITE_NAME}.
  </p>
</body></html>`

  const text = `${heading}\n\n${body}\n\n${approved ? `${siteUrl}/login` : `${siteUrl}/signup`}`
  return { subject, html, text }
}

async function sendViaResend({ to, subject, html, text }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || `${SITE_NAME} <onboarding@resend.dev>`,
      to: [to],
      subject,
      html,
      text,
    }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
  return 'resend'
}

async function sendViaSmtp({ to, subject, html, text }) {
  // Imported lazily so deployments without SMTP configured don't pay for it.
  const nodemailer = (await import('nodemailer')).default
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  await transport.sendMail({
    from: process.env.MAIL_FROM || `${SITE_NAME} <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  })
  return 'smtp'
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'server_not_configured' })
  }

  // ---- authorise: must be the developer ----
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: 'missing_token' })

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data: auth, error: authError } = await supabase.auth.getUser(token)
  if (authError || !auth?.user) return res.status(401).json({ error: 'invalid_token' })
  if ((auth.user.email || '').toLowerCase() !== DEVELOPER_EMAIL) {
    return res.status(403).json({ error: 'not_admin' })
  }

  // ---- validate ----
  const { email, status, userId } = req.body || {}
  if (!email || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'bad_request' })
  }

  // If rejected, attempt to delete user from database as well
  if (status === 'rejected' && userId) {
    try {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (serviceKey) {
        const adminClient = createClient(SUPABASE_URL, serviceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        })
        await adminClient.auth.admin.deleteUser(userId)
      } else {
        const authedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
        })
        await authedClient.rpc('delete_user_account', { target_user_id: userId })
      }
    } catch (delErr) {
      console.warn('Backend account deletion attempt:', delErr?.message)
    }
  }

  const siteUrl = `https://${req.headers.host}`
  const { subject, html, text } = buildEmail({ status, siteUrl })

  try {
    let provider
    if (process.env.RESEND_API_KEY) {
      provider = await sendViaResend({ to: email, subject, html, text })
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      provider = await sendViaSmtp({ to: email, subject, html, text })
    } else {
      // Not an error: the decision is already saved, email is a nicety.
      return res.status(200).json({ sent: false, reason: 'no_email_provider_configured' })
    }
    return res.status(200).json({ sent: true, provider })
  } catch (e) {
    // Report the failure without implying the approval failed.
    return res.status(502).json({ sent: false, error: 'send_failed', message: e.message })
  }
}
