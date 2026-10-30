/**
 * POST /api/notify-password-changed
 * Body: { email: string }
 *
 * Sends a security email notification to the user whenever their account
 * password is changed or reset successfully.
 *
 * Mail provider is configured via environment variables:
 *   - RESEND_API_KEY
 *   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const SITE_NAME = 'Zuno'
const DEVELOPER_EMAIL = (process.env.DEVELOPER_EMAIL || 'arghadeeppakhira@gmail.com').toLowerCase()

function buildPasswordChangedEmail({ userEmail, changedAt, siteUrl }) {
  const subject = `[${SITE_NAME}] Security Notice: Your password has been changed`
  const dateStr = changedAt ? new Date(changedAt).toUTCString() : new Date().toUTCString()

  const html = `<!doctype html>
<html><body style="margin:0;padding:32px 16px;background:#0e1610;font-family:'Plus Jakarta Sans',Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">
  <table role="presentation" style="max-width:540px;margin:0 auto;background:#16241a;border:1px solid #2a4030;border-radius:24px;overflow:hidden">
    <tr>
      <td style="padding:36px 32px">
        <div style="display:inline-block;padding:4px 12px;border-radius:999px;background:#1e3e24;color:#a8f0bc;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase">
          ${SITE_NAME} Security
        </div>
        
        <h1 style="margin:16px 0 8px;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px">
          Password Changed Successfully
        </h1>
        
        <p style="margin:0 0 20px;color:#9cb5a2;font-size:15px;line-height:1.6">
          The password for your ${SITE_NAME} account was recently changed.
        </p>

        <div style="margin:20px 0;padding:18px 20px;background:#101a12;border:1px solid #243829;border-radius:14px">
          <p style="margin:0 0 4px;color:#7a9480;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Account</p>
          <p style="margin:0 0 12px;color:#ffffff;font-size:16px;font-weight:700;font-family:monospace;word-break:break-all">${userEmail}</p>
          
          <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:8px">
            <tr>
              <td style="padding:4px 0;color:#7a9480;font-size:12px">Time of Change:</td>
              <td style="padding:4px 0;color:#e8efe2;font-size:12px;font-family:monospace;text-align:right">${dateStr}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#7a9480;font-size:12px">Status:</td>
              <td style="padding:4px 0;color:#4ade80;font-size:12px;font-weight:700;text-align:right">Updated &amp; Active</td>
            </tr>
          </table>
        </div>

        <p style="margin:20px 0 0;color:#9cb5a2;font-size:14px;line-height:1.6">
          If you made this change, you do not need to take any action. You can now sign in with your new password.
        </p>

        <div style="margin-top:24px">
          <a href="${siteUrl}/login" style="display:inline-block;background:#2a5c34;color:#ffffff;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:999px;font-size:14px">
            Sign in to ${SITE_NAME}
          </a>
        </div>

        <div style="margin-top:28px;padding-top:20px;border-top:1px solid #243829">
          <p style="margin:0;color:#ef4444;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">
            Didn't make this change?
          </p>
          <p style="margin:6px 0 0;color:#9cb5a2;font-size:13px;line-height:1.5">
            If you did not request or perform this password update, someone else may have accessed your account.
            Please reach out to support immediately at
            <a href="mailto:${DEVELOPER_EMAIL}" style="color:#a8f0bc;text-decoration:underline">${DEVELOPER_EMAIL}</a>
            or <a href="${siteUrl}/report" style="color:#a8f0bc;text-decoration:underline">submit an urgent security report</a>.
          </p>
        </div>
      </td>
    </tr>
  </table>
  <p style="max-width:540px;margin:20px auto 0;color:#607765;font-size:12px;text-align:center">
    This security alert was sent automatically by ${SITE_NAME}.
  </p>
</body></html>`

  const text = `[${SITE_NAME}] Security Notice: Password Changed\n\nThe password for your ${SITE_NAME} account (${userEmail}) was changed successfully on ${dateStr}.\n\nIf you made this change, you can sign in with your new password at: ${siteUrl}/login\n\nIf you did NOT make this change, please contact ${DEVELOPER_EMAIL} or report an issue immediately at: ${siteUrl}/report\n`

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
      from: process.env.MAIL_FROM || `${SITE_NAME} Security <onboarding@resend.dev>`,
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
    from: process.env.MAIL_FROM || `${SITE_NAME} Security <${process.env.SMTP_USER}>`,
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

  // Determine user email either from verified Bearer token or from request body
  let userEmail = req.body?.email?.trim()

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (token) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      const { data: auth } = await supabase.auth.getUser(token)
      if (auth?.user?.email) {
        userEmail = auth.user.email
      }
    } catch {
      // Continue with body email if provided
    }
  }

  if (!userEmail) {
    return res.status(400).json({ error: 'email_required' })
  }

  const siteUrl = `https://${req.headers.host}`
  const { subject, html, text } = buildPasswordChangedEmail({
    userEmail,
    changedAt: req.body?.changedAt || new Date().toISOString(),
    siteUrl,
  })

  try {
    let provider
    if (process.env.RESEND_API_KEY) {
      provider = await sendViaResend({ to: userEmail, subject, html, text })
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      provider = await sendViaSmtp({ to: userEmail, subject, html, text })
    } else {
      return res.status(200).json({ sent: false, reason: 'no_email_provider_configured' })
    }
    return res.status(200).json({ sent: true, provider })
  } catch (e) {
    return res.status(502).json({ sent: false, error: 'send_failed', message: e.message })
  }
}

