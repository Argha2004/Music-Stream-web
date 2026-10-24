/**
 * POST /api/notify-signup
 * Body: { email: string } OR Supabase Webhook payload { record: { email: string } }
 *
 * Sends an email notification to the Admin/Developer (DEVELOPER_EMAIL)
 * whenever a new user signs up and submits an access request.
 *
 * Mail provider is configured via environment variables:
 *   - RESEND_API_KEY
 *   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const DEVELOPER_EMAIL = (process.env.DEVELOPER_EMAIL || 'arghadeeppakhira@gmail.com').toLowerCase()
const SITE_NAME = 'MusicStream'

function buildAdminSignupEmail({ userEmail, requestedAt, siteUrl }) {
  const subject = `[${SITE_NAME}] New Access Request: ${userEmail}`
  const dateStr = requestedAt
    ? new Date(requestedAt).toUTCString()
    : new Date().toUTCString()

  const html = `<!doctype html>
<html><body style="margin:0;padding:32px 16px;background:#0e1610;font-family:'Plus Jakarta Sans',Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">
  <table role="presentation" style="max-width:540px;margin:0 auto;background:#16241a;border:1px solid #2a4030;border-radius:24px;overflow:hidden">
    <tr>
      <td style="padding:36px 32px">
        <div style="display:inline-block;padding:4px 12px;border-radius:999px;background:#1e3e24;color:#a8f0bc;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase">
          ${SITE_NAME} Admin Alert
        </div>
        
        <h1 style="margin:16px 0 8px;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px">
          New Access Request
        </h1>
        
        <p style="margin:0 0 20px;color:#9cb5a2;font-size:15px;line-height:1.6">
          A new user has registered an account and is awaiting your approval to access ${SITE_NAME}.
        </p>

        <div style="margin:20px 0;padding:18px 20px;background:#101a12;border:1px solid #243829;border-radius:14px">
          <p style="margin:0 0 4px;color:#7a9480;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Applicant Email</p>
          <p style="margin:0 0 12px;color:#ffffff;font-size:17px;font-weight:700;font-family:monospace;word-break:break-all">${userEmail}</p>
          
          <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:8px">
            <tr>
              <td style="padding:4px 0;color:#7a9480;font-size:12px">Requested At:</td>
              <td style="padding:4px 0;color:#e8efe2;font-size:12px;font-family:monospace;text-align:right">${dateStr}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#7a9480;font-size:12px">Current Status:</td>
              <td style="padding:4px 0;color:#fbbf24;font-size:12px;font-weight:700;text-align:right">Pending Approval</td>
            </tr>
          </table>
        </div>

        <p style="margin:20px 0 0;color:#9cb5a2;font-size:14px;line-height:1.6">
          You can review, approve, or refuse this access request in the Admin Dashboard:
        </p>

        <div style="margin-top:24px">
          <a href="${siteUrl}/admin" style="display:inline-block;background:#2a5c34;color:#ffffff;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:999px;font-size:14px">
            Open Admin Dashboard
          </a>
        </div>

        <p style="margin:24px 0 0;color:#607765;font-size:12px;line-height:1.5">
          Tip: Once approved, the user will be able to sign in and download the latest MusicStream APK.
        </p>
      </td>
    </tr>
  </table>
  <p style="max-width:540px;margin:20px auto 0;color:#607765;font-size:12px;text-align:center">
    Sent by ${SITE_NAME} System to Administrator (${DEVELOPER_EMAIL})
  </p>
</body></html>`

  const text = `[${SITE_NAME}] New Access Request\n\nA new user has registered an account and is awaiting your approval.\n\n- Email: ${userEmail}\n- Requested: ${dateStr}\n- Status: Pending Approval\n\nOpen Admin Dashboard to review & approve:\n${siteUrl}/admin\n`

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

  // Support both direct client call { email } and Supabase Webhook payload { record: { email } }
  const rawEmail = req.body?.email || req.body?.record?.email || ''
  const requestedAt = req.body?.requested_at || req.body?.record?.requested_at || new Date().toISOString()
  const userEmail = (typeof rawEmail === 'string' ? rawEmail.trim() : '').toLowerCase()

  if (!userEmail || !userEmail.includes('@')) {
    return res.status(400).json({ error: 'invalid_email' })
  }

  // Developer signing up doesn't need to notify themselves
  if (userEmail === DEVELOPER_EMAIL) {
    return res.status(200).json({ sent: false, reason: 'developer_signup' })
  }

  const siteUrl = `https://${req.headers.host}`
  const { subject, html, text } = buildAdminSignupEmail({ userEmail, requestedAt, siteUrl })

  try {
    let provider
    if (process.env.RESEND_API_KEY) {
      provider = await sendViaResend({ to: DEVELOPER_EMAIL, subject, html, text })
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      provider = await sendViaSmtp({ to: DEVELOPER_EMAIL, subject, html, text })
    } else {
      return res.status(200).json({ sent: false, reason: 'no_email_provider_configured' })
    }
    return res.status(200).json({ sent: true, provider, to: DEVELOPER_EMAIL })
  } catch (e) {
    console.error('Failed to send admin signup notification:', e)
    return res.status(502).json({ sent: false, error: 'send_failed', message: e.message })
  }
}
