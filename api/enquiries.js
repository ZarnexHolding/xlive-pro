/*
 * GET /api/enquiries — minimal, token-protected debug/admin visibility.
 *
 * Not a dashboard. Returns recent enquiries with their notification statuses so
 * a developer can confirm the pipeline without opening the database directly.
 *
 * Auth: send the ADMIN_API_TOKEN as `Authorization: Bearer <token>` or `?token=`.
 * If ADMIN_API_TOKEN is unset the endpoint is disabled (404) so it can never be
 * left open by accident.
 */

import { buildConfig } from './_lib/config.js'
import { logger } from './_lib/logger.js'
import { createStore } from './_lib/store.js'

function authorized(req, token) {
  if (!token) return false
  const header = req.headers['authorization'] || ''
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : ''
  const provided = bearer || req.query?.token || ''
  return provided && provided === token
}

export default async function handler(req, res) {
  const config = buildConfig(process.env)

  if (!config.admin.token) return res.status(404).json({ success: false, message: 'Not found' })
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ success: false })
  }
  if (!authorized(req, config.admin.token)) return res.status(401).json({ success: false })

  try {
    const store = createStore(config, logger)
    await store.init()
    const limit = Math.min(parseInt(req.query?.limit, 10) || 50, 200)
    const rows = await store.listEnquiries(limit)
    const enquiries = rows.map((r) => ({
      leadId: r.lead_id,
      createdAt: r.created_at,
      name: r.name,
      company: r.company,
      email: r.email,
      phone: r.phone,
      projectType: r.project_type,
      whatsappOptIn: r.whatsapp_opt_in,
      status: r.status,
      emailStatus: r.email_status,
      teamWhatsAppStatus: r.team_wa_status,
      customerWhatsAppStatus: r.customer_wa_status,
      errors: {
        email: r.email_error || null,
        teamWa: r.team_wa_error || null,
        customerWa: r.customer_wa_error || null,
      },
    }))
    return res.status(200).json({ success: true, store: store.kind, count: enquiries.length, enquiries })
  } catch (err) {
    logger.error('enquiries.failed', { error: err?.message })
    return res.status(500).json({ success: false })
  }
}
