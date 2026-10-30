/**
 * POST /api/notify-report-resolved
 * Body: { email: string, reportTitle: string, category?: string, resolutionNote?: string }
 *
 * Emails a user when their reported bug or issue has been resolved by the developer.
 *
 * Security: The caller must present the developer's Supabase access token.
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const DEVELOPER_EMAIL = (process.env.DEVELOPER_EMAIL || 'arghadeeppakhira@gmail.com').toLowerCase()
const SITE_NAME = 'Zuno'

function buildResolvedEmail({ reportTitle, category, resolutionNote, siteUrl }) {
  const subject = `[${SITE_NAME}] Issue Resolved: ${reportTitle || 'Reported Bug'}`
  const heading = 'Bug Report Resolved'
  
  const formattedCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General'
  const customNote = resolutionNote 
    ? `<div style="margin:20px 0;padding:16px;background:#1a281e;border-left:4px solid #2a5c34;border-radius:8px">
         <p style="margin:0 0 6px;color:#a8f0bc;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Developer Note</p>
         <p style="margin:0;color:#e8efe2;font-size:14px;line-height:1.5">${resolutionNote}</p>
       </div>`
    : ''

  const html = `<!doctype html>
<html><body style="margin:0;padding:32px 16px;background:#0e1610;font-family:'Plus Jakarta Sans',Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">
  <table role="presentation" style="max-width:540px;margin:0 auto;background:#16241a;border:1px solid #2a4030;border-radius:24px;overflow:hidden">
    <tr>
      <td style="padding:36px 32px">
        <div style="display:inline-block;padding:4px 12px;border-radius:999px;background:#1e3e24;color:#a8f0bc;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase">
          ${SITE_NAME} Support
        </div>
        
        <h1 style="margin:16px 0 8px;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px">
          ${heading}
        </h1>
        
        <p style="margin:0 0 16px;color:#9cb5a2;font-size:15px;line-height:1.6">
          Thank you for taking the time to report this issue. The bug you submitted has been investigated, resolved, and closed by the developer.
        </p>

        <div style="margin:20px 0;padding:16px;background:#101a12;border:1px solid #243829;border-radius:14px">
          <p style="margin:0 0 4px;color:#7a9480;font-size:11px;font-weight:700;text-transform:uppercase">Issue Summary</p>
          <p style="margin:0 0 8px;color:#ffffff;font-size:16px;font-weight:700">${reportTitle}</p>
          <p style="margin:0;color:#9cb5a2;font-size:13px">Category: <strong style="color:#dcefce">${formattedCategory}</strong> &bull; Status: <strong style="color:#4ade80">Resolved</strong></p>
        </div>

        ${customNote}

        <p style="margin:20px 0 0;color:#9cb5a2;font-size:14px;line-height:1.6">
          The resolution is live or included in the latest app release. You can download or check the latest build below:
        </p>

        <div style="margin-top:24px">
          <a href="${siteUrl}/download" style="display:inline-block;background:#2a5c34;color:#ffffff;font-weight:700;text-decoration:none;padding:12px 26px;border-radius:999px;font-size:14px">
            Download Latest Version
          </a>
        </div>
      </td>
    </tr>
  </table>
  <p style="max-width:540px;margin:20px auto 0;color:#5a7360;font-size:12px;text-align:center">
    You received this notification because you submitted a bug report for ${SITE_NAME}.
  </p>
</body></html>`

  const text = `${heading}\n\nThank you for reporting this issue. The bug you reported has been resolved:\n"${reportTitle}" (${formattedCategory})\n\n${resolutionNote ? `Developer Note: ${resolutionNote}\n\n` : ''}You can download the latest version at: ${siteUrl}/download`

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
      from: process.env.MAIL_FROM || `${SITE_NAME} Support <onboarding@resend.dev>`,
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
    from: process.env.MAIL_FROM || `${SITE_NAME} Support <${process.env.SMTP_USER}>`,
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

  // ---- Authorise: must be the developer ----
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: 'missing_token' })

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data: auth, error: authError } = await supabase.auth.getUser(token)
  if (authError || !auth?.user) return res.status(401).json({ error: 'invalid_token' })
  if ((auth.user.email || '').toLowerCase() !== DEVELOPER_EMAIL) {
    return res.status(403).json({ error: 'not_admin' })
  }

  // ---- Validate ----
  const { email, reportTitle, category, resolutionNote } = req.body || {}
  if (!email || !reportTitle) {
    return res.status(400).json({ error: 'bad_request', message: 'Missing email or reportTitle' })
  }

  const siteUrl = `https://${req.headers.host}`
  const { subject, html, text } = buildResolvedEmail({ reportTitle, category, resolutionNote, siteUrl })

  try {
    let provider
    if (process.env.RESEND_API_KEY) {
      provider = await sendViaResend({ to: email, subject, html, text })
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      provider = await sendViaSmtp({ to: email, subject, html, text })
    } else {
      return res.status(200).json({ sent: false, reason: 'no_email_provider_configured' })
    }
    return res.status(200).json({ sent: true, provider })
  } catch (e) {
    return res.status(502).json({ sent: false, error: 'send_failed', message: e.message })
  }
}
