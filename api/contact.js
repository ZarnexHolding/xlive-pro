import { Resend } from 'resend'

/*
 * Vercel Serverless Function — POST /api/contact
 * Sends an admin notification (to XLIVE) + a confirmation to the sender via Resend.
 *
 * Required env vars (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY   — from resend.com
 *   CONTACT_TO       — where admin notifications land, e.g. hello@xlive-pro.com
 *   CONTACT_FROM     — verified sender, e.g. "XLIVE Production <hello@xlive-pro.com>"
 *                      (before domain verification, use "XLIVE <onboarding@resend.dev>")
 */

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

// ---- Brand-styled email templates ----
const shell = (inner) => `
<div style="margin:0;padding:40px 20px;background:#05060A;font-family:Helvetica,Arial,sans-serif;color:#F3F5FB;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#11141F;border:1px solid rgba(243,245,251,0.08);border-radius:16px;overflow:hidden;">
      <tr><td style="height:4px;background:#73F83E;"></td></tr>
      <tr><td style="padding:44px;">${inner}</td></tr>
      <tr><td style="padding:20px 44px;border-top:1px solid rgba(243,245,251,0.06);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5B6178;">
        XLIVE Production · Riyadh, Saudi Arabia · xlive-pro.com
      </td></tr>
    </table>
  </td></tr></table>
</div>`

const row = (label, value) => `
  <tr><td style="padding-bottom:20px;">
    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5B6178;">${label}</p>
    <p style="margin:0;font-size:16px;color:#F3F5FB;">${value}</p>
  </td></tr>`

function adminHtml({ name, email, company, type, message }) {
  return shell(`
    <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#73F83E;">New enquiry</p>
    <h1 style="margin:0 0 32px;font-size:30px;line-height:1.05;color:#F3F5FB;font-weight:800;letter-spacing:-0.02em;">New contact submission</h1>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${row('Name', esc(name))}
      ${row('Email', `<a href="mailto:${esc(email)}" style="color:#73F83E;text-decoration:none;">${esc(email)}</a>`)}
      ${company ? row('Company / Agency', esc(company)) : ''}
      ${type ? row('Project type', esc(type)) : ''}
      <tr><td>
        <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5B6178;">Message</p>
        <div style="padding:22px;background:#171A28;border-radius:12px;border:1px solid rgba(243,245,251,0.06);font-size:15px;line-height:1.7;color:#D8DBE6;white-space:pre-wrap;">${esc(message)}</div>
      </td></tr>
    </table>`)
}

function userHtml({ name, message }) {
  return shell(`
    <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#73F83E;">XLIVE</p>
    <h1 style="margin:0 0 24px;font-size:34px;line-height:1.05;color:#F3F5FB;font-weight:800;letter-spacing:-0.02em;">Thank you${name ? `, ${esc(name.split(' ')[0])}` : ''}.</h1>
    <p style="margin:0 0 28px;font-size:16px;line-height:1.7;color:#9BA1B6;">We've received your message and our team will get back to you shortly. For anything urgent, call +966&nbsp;53&nbsp;430&nbsp;7007.</p>
    <div style="padding:22px;background:#171A28;border-radius:12px;border:1px solid rgba(243,245,251,0.06);margin-bottom:28px;">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5B6178;">Your message</p>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#D8DBE6;white-space:pre-wrap;">${esc(message)}</p>
    </div>
    <p style="margin:0;font-size:14px;color:#5B6178;">— The XLIVE team</p>`)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { name, email, company, type, message, website } = req.body || {}

    // Honeypot: real users leave this empty; bots fill it.
    if (website) return res.status(200).json({ success: true })

    if (!name?.trim() || !isEmail(email || '') || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a name, valid email and message.' })
    }
    if (message.length > 5000) {
      return res.status(400).json({ success: false, message: 'Message is too long.' })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY missing')
      return res.status(500).json({ success: false, message: 'Email service not configured.' })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const from = process.env.CONTACT_FROM || 'XLIVE Production <onboarding@resend.dev>'
    const to = process.env.CONTACT_TO || process.env.CONTACT_FROM_ADDRESS

    // Admin notification (critical) — reply-to the sender so you can reply directly.
    const admin = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New enquiry — ${name}${type ? ` · ${type}` : ''}`,
      html: adminHtml({ name, email, company, type, message }),
    })
    if (admin.error) {
      console.error('Resend admin error:', admin.error)
      return res.status(502).json({ success: false, message: 'Could not send your message. Please email hello@xlive-pro.com.' })
    }

    // Sender confirmation (best-effort — may be blocked until the domain is verified).
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: 'We received your message | XLIVE',
        html: userHtml({ name, message }),
      })
    } catch (e) {
      console.warn('Confirmation email skipped:', e?.message)
    }

    return res.status(200).json({ success: true, message: 'Message sent.' })
  } catch (err) {
    console.error('Contact handler error:', err)
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' })
  }
}
