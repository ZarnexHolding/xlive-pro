/*
 * Email notification service (Resend). Runtime-agnostic — the Resend SDK is
 * fetch-based and runs on Vercel and Cloudflare alike. All callers get a
 * { ok, error } result; this module never throws.
 *
 * Two messages per enquiry:
 *   - admin notification to CONTACT_TO (the company Gmail)  — the important one
 *   - a best-effort confirmation to the visitor
 */

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

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

function adminHtml(e) {
  return shell(`
    <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#73F83E;">New website enquiry</p>
    <h1 style="margin:0 0 8px;font-size:30px;line-height:1.05;color:#F3F5FB;font-weight:800;letter-spacing:-0.02em;">${esc(e.leadId)}</h1>
    <p style="margin:0 0 28px;font-size:13px;color:#5B6178;">Received ${esc(e.receivedAt)}</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${row('Name', esc(e.name))}
      ${row('Email', `<a href="mailto:${esc(e.email)}" style="color:#73F83E;text-decoration:none;">${esc(e.email)}</a>`)}
      ${row('Phone / WhatsApp', `<a href="tel:${esc(e.phone)}" style="color:#73F83E;text-decoration:none;">${esc(e.phone)}</a>`)}
      ${e.company ? row('Company / Agency', esc(e.company)) : ''}
      ${row('Project type', esc(e.projectType))}
      ${row('WhatsApp opt-in', e.whatsappOptIn ? 'Yes' : 'No')}
      <tr><td>
        <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5B6178;">Project / enquiry</p>
        <div style="padding:22px;background:#171A28;border-radius:12px;border:1px solid rgba(243,245,251,0.06);font-size:15px;line-height:1.7;color:#D8DBE6;white-space:pre-wrap;">${esc(e.project)}</div>
      </td></tr>
    </table>`)
}

function userHtml(e) {
  const first = e.name ? esc(e.name.split(' ')[0]) : ''
  return shell(`
    <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#73F83E;">XLIVE</p>
    <h1 style="margin:0 0 24px;font-size:34px;line-height:1.05;color:#F3F5FB;font-weight:800;letter-spacing:-0.02em;">Thank you${first ? `, ${first}` : ''}.</h1>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#9BA1B6;">We've received your enquiry and our team will review it and get back to you shortly. For anything urgent, call +966&nbsp;53&nbsp;430&nbsp;7007.</p>
    <p style="margin:0 0 28px;font-size:14px;color:#9BA1B6;">Your reference is <strong style="color:#F3F5FB;">${esc(e.leadId)}</strong>.</p>
    <div style="padding:22px;background:#171A28;border-radius:12px;border:1px solid rgba(243,245,251,0.06);margin-bottom:28px;">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5B6178;">Your enquiry</p>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#D8DBE6;white-space:pre-wrap;">${esc(e.project)}</p>
    </div>
    <p style="margin:0;font-size:14px;color:#5B6178;">— The XLIVE team</p>`)
}

// The email subject uses the visitor's name; validate.js has already stripped
// CR/LF, so header injection isn't possible here.
function adminText(e) {
  return [
    'NEW XLIVE WEBSITE ENQUIRY',
    '',
    `Lead ID: ${e.leadId}`,
    `Name: ${e.name}`,
    `Company: ${e.company || '—'}`,
    `Email: ${e.email}`,
    `Phone / WhatsApp: ${e.phone}`,
    `Project Type: ${e.projectType}`,
    `WhatsApp Opt-in: ${e.whatsappOptIn ? 'Yes' : 'No'}`,
    '',
    'Project / Enquiry:',
    e.project,
    '',
    `Received: ${e.receivedAt}`,
  ].join('\n')
}

export function createEmailService(config, logger) {
  async function getClient() {
    const { Resend } = await import('resend')
    return new Resend(config.resend.apiKey)
  }

  // Admin notification — treated as the critical channel.
  async function sendAdminNotification(enquiry) {
    if (!config.flags.email) return { ok: true, status: 'skipped' }
    if (!config.resend.apiKey) return { ok: false, status: 'failed', error: 'RESEND_API_KEY missing' }
    if (!config.resend.to) return { ok: false, status: 'failed', error: 'CONTACT_TO missing' }
    try {
      const resend = await getClient()
      const { error } = await resend.emails.send({
        from: config.resend.from,
        to: config.resend.to,
        replyTo: enquiry.email,
        subject: `New enquiry ${enquiry.leadId} — ${enquiry.name} · ${enquiry.projectType}`,
        html: adminHtml(enquiry),
        text: adminText(enquiry),
      })
      if (error) return { ok: false, status: 'failed', error: error.message || String(error) }
      return { ok: true, status: 'sent' }
    } catch (err) {
      return { ok: false, status: 'failed', error: err?.message || String(err) }
    }
  }

  // Visitor confirmation — best-effort.
  async function sendUserConfirmation(enquiry) {
    if (!config.flags.email) return { ok: true, status: 'skipped' }
    if (!config.resend.apiKey) return { ok: false, status: 'failed', error: 'RESEND_API_KEY missing' }
    try {
      const resend = await getClient()
      const { error } = await resend.emails.send({
        from: config.resend.from,
        to: enquiry.email,
        subject: `We received your enquiry (${enquiry.leadId}) | XLIVE`,
        html: userHtml(enquiry),
      })
      if (error) return { ok: false, status: 'failed', error: error.message || String(error) }
      return { ok: true, status: 'sent' }
    } catch (err) {
      return { ok: false, status: 'failed', error: err?.message || String(err) }
    }
  }

  return { sendAdminNotification, sendUserConfirmation }
}
