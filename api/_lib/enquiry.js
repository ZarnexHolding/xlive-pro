/*
 * Core enquiry pipeline — runtime-agnostic. Handlers (Vercel today, Cloudflare
 * later) do nothing but: parse the request → call processEnquiry(input, ctx) →
 * translate the result into an HTTP response.
 *
 * Flow:
 *   1. validate + sanitize (authoritative, server-side)
 *   2. honeypot → silent success
 *   3. rate-limit by IP
 *   4. idempotency by submissionId → return existing lead, no re-send
 *   5. allocate Lead ID + persist (SOURCE OF TRUTH)
 *   6. notify each channel independently; a failure never loses the enquiry
 *   7. return { leadId } to the browser
 *
 * The customer waits for the whole thing today (a few fast HTTP calls). The
 * pipeline is structured so notifications can move to a queue / waitUntil later
 * without touching validation or persistence — see docs/ENQUIRY-SYSTEM.md.
 */

import { validateEnquiry } from './validate.js'
import { createStore } from './store.js'
import { createEmailService } from './email.js'
import { createWhatsAppService } from './whatsapp.js'

function receivedAtUtc(d = new Date()) {
  // e.g. "2026-09-08 12:30 UTC"
  return `${d.toISOString().slice(0, 16).replace('T', ' ')} UTC`
}

export async function processEnquiry(input, { config, logger, ip, userAgent }) {
  const { ok, isBot, errors, data } = validateEnquiry(input, { maxMessage: config.limits.maxMessage })

  // Honeypot: pretend success, do nothing. Bots get no signal.
  if (isBot) {
    logger.info('enquiry.honeypot', { ip })
    return { http: 200, body: { success: true } }
  }

  if (!ok) {
    return { http: 400, body: { success: false, message: 'Please check the highlighted fields.', errors } }
  }

  const store = createStore(config, logger)
  await store.init()

  // Rate limit (best-effort; DB-backed when Neon is present, per-instance otherwise).
  try {
    const recent = await store.countRecentByIp(ip, config.limits.rateWindowMin)
    if (recent >= config.limits.rateMax) {
      logger.warn('enquiry.rate_limited', { ip, recent })
      return { http: 429, body: { success: false, message: 'Too many submissions. Please try again shortly.' } }
    }
  } catch (err) {
    logger.warn('enquiry.rate_limit_check_failed', { error: err?.message })
  }

  // Idempotency: same submissionId ⇒ same lead, no duplicate notifications.
  if (data.submissionId) {
    try {
      const existing = await store.findBySubmissionId(data.submissionId)
      if (existing) {
        logger.info('enquiry.duplicate', { leadId: existing.lead_id })
        return { http: 200, body: { success: true, leadId: existing.lead_id, duplicate: true } }
      }
    } catch (err) {
      logger.warn('enquiry.idempotency_check_failed', { error: err?.message })
    }
  }

  const year = new Date().getFullYear()
  const receivedAt = receivedAtUtc()

  // Allocate ID + persist. If persistence fails we DON'T drop the enquiry — we
  // fall back to a transient id and still fire email so it reaches Gmail.
  let leadId
  let persisted = false
  try {
    leadId = await store.nextLeadId(year)
    await store.createEnquiry({ ...data, leadId, ip, userAgent })
    persisted = true
    logger.info('enquiry.created', { leadId, whatsappOptIn: data.whatsappOptIn, store: store.kind })
  } catch (err) {
    leadId = leadId || `XL-${year}-ERR${Date.now().toString(36).toUpperCase().slice(-5)}`
    logger.error('enquiry.persist_failed', { leadId, error: err?.message })
  }

  const enquiry = { ...data, leadId, receivedAt }

  // --- Notifications: each guarded, each status-tracked. ---
  const email = createEmailService(config, logger)
  const whatsapp = createWhatsAppService(config, logger)
  const notifications = {}

  // Admin email (critical channel).
  {
    const r = await email.sendAdminNotification(enquiry)
    notifications.email = r.status
    if (persisted) await safeSetStatus(store, leadId, 'email', r.status, r.error, logger)
    logger[r.ok ? 'info' : 'error']('enquiry.email', { leadId, status: r.status, error: r.error })
    // Visitor confirmation — best effort, not status-critical.
    email.sendUserConfirmation(enquiry).catch(() => {})
  }

  // Team WhatsApp alert.
  {
    const r = await whatsapp.sendTeamNotification(enquiry)
    notifications.teamWa = r.status
    if (persisted) await safeSetStatus(store, leadId, 'teamWa', r.status, r.error, logger)
    logger[r.ok ? 'info' : 'error']('enquiry.team_whatsapp', { leadId, status: r.status, mock: r.mock, error: r.error })
  }

  // Customer WhatsApp acknowledgement (opt-in only).
  {
    const r = await whatsapp.sendCustomerAcknowledgement(enquiry)
    notifications.customerWa = r.status
    if (persisted) await safeSetStatus(store, leadId, 'customerWa', r.status, r.error, logger)
    logger[r.ok ? 'info' : 'error']('enquiry.customer_whatsapp', {
      leadId,
      status: r.status,
      mock: r.mock,
      reason: r.reason,
      error: r.error,
    })
  }

  // Email is the safety net: if it also failed and nothing persisted, tell the
  // client so, otherwise report success (the enquiry is safe).
  const emailFailed = notifications.email === 'failed'
  if (!persisted && emailFailed) {
    return {
      http: 502,
      body: { success: false, message: 'Could not send your message. Please email hello@xlive-pro.com.' },
    }
  }

  return { http: 200, body: { success: true, leadId, notifications } }
}

async function safeSetStatus(store, leadId, channel, status, error, logger) {
  try {
    await store.setNotificationStatus(leadId, channel, status, error)
  } catch (err) {
    logger.warn('enquiry.status_update_failed', { leadId, channel, error: err?.message })
  }
}
