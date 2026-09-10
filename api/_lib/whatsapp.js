/*
 * WhatsApp notification service — the ONLY place that talks to WhatsApp.
 *
 * Official Meta WhatsApp Business Cloud API only (graph.facebook.com). No web
 * automation, no unofficial libraries, no QR/session hacks.
 *
 * Two distinct use cases, deliberately kept separate:
 *   - sendTeamNotification()        → alert the Xlive team about a new lead
 *   - sendCustomerAcknowledgement() → acknowledge the customer (opt-in only)
 *
 * Adapter selection (see pickAdapter): the MOCK adapter is used whenever we are
 * in test mode, WHATSAPP_MOCK=true, or credentials are absent. It logs what it
 * *would* send and reports status 'sent' with mock:true — so the whole pipeline
 * is testable end-to-end without a Meta account and without messaging anyone.
 * The LIVE adapter is used only in live mode WITH credentials present.
 *
 * DEPLOYMENT-AGNOSTIC: uses global fetch only; runs on Vercel and Cloudflare.
 */

function graphUrl(config) {
  return `https://graph.facebook.com/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`
}

// A plain text message (allowed to the team inside a 24h service window, or to
// anyone who has messaged the business recently). Business-initiated messages
// to cold numbers require a template instead — see buildTemplate.
function buildText(to, body) {
  return { messaging_product: 'whatsapp', to, type: 'text', text: { preview_url: false, body } }
}

// A template message (required for business-initiated conversations). Positional
// body variables map to {{1}}, {{2}}, … in the approved template.
function buildTemplate(to, name, lang, variables) {
  return {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name,
      language: { code: lang },
      components: [
        {
          type: 'body',
          parameters: variables.map((v) => ({ type: 'text', text: String(v) })),
        },
      ],
    },
  }
}

/* -------------------------------- adapters -------------------------------- */

function mockAdapter(config, logger, reason) {
  return {
    kind: 'mock',
    async send(payload, purpose) {
      logger.info('whatsapp.mock_send', {
        purpose,
        reason,
        to: payload.to,
        type: payload.type,
        template: payload.template?.name,
        // Body text is logged truncated so team/customer copy is verifiable
        // in dev without dumping full personal data.
        preview: payload.text ? payload.text.body.slice(0, 120) : undefined,
      })
      return { ok: true, status: 'sent', mock: true, id: `mock-${Date.now()}` }
    },
  }
}

function liveAdapter(config, logger) {
  return {
    kind: 'live',
    async send(payload, purpose) {
      try {
        const res = await fetch(graphUrl(config), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.whatsapp.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          const msg = json?.error?.message || `HTTP ${res.status}`
          logger.error('whatsapp.live_send_failed', { purpose, to: payload.to, status: res.status, error: msg })
          return { ok: false, status: 'failed', error: msg }
        }
        logger.info('whatsapp.live_send_ok', { purpose, to: payload.to, id: json?.messages?.[0]?.id })
        return { ok: true, status: 'sent', id: json?.messages?.[0]?.id }
      } catch (err) {
        logger.error('whatsapp.live_send_error', { purpose, error: err?.message })
        return { ok: false, status: 'failed', error: err?.message || String(err) }
      }
    },
  }
}

function pickAdapter(config, logger) {
  if (config.whatsapp.forceMock) return mockAdapter(config, logger, 'WHATSAPP_MOCK=true')
  if (config.isTest) return mockAdapter(config, logger, 'NOTIFICATIONS_MODE=test')
  if (!config.whatsapp.configured) return mockAdapter(config, logger, 'credentials missing')
  return liveAdapter(config, logger)
}

/* -------------------------------- service --------------------------------- */

export function createWhatsAppService(config, logger) {
  const adapter = pickAdapter(config, logger)

  // In test mode, if a test recipient is set, all messages are redirected to it
  // so real customers/team members are never contacted during development.
  const routeTo = (to) => (config.isTest && config.whatsapp.testRecipient ? config.whatsapp.testRecipient : to)

  async function sendTeamNotification(enquiry) {
    if (!config.flags.teamWa) return { ok: true, status: 'skipped', reason: 'TEAM_WHATSAPP_ENABLED=false' }
    const recipients = config.whatsapp.teamRecipients
    if (!recipients.length && adapter.kind === 'live')
      return { ok: false, status: 'failed', error: 'WHATSAPP_TEAM_RECIPIENTS not set' }

    const targets = recipients.length ? recipients : ['<team-not-configured>']
    const body = teamMessage(enquiry)

    const results = []
    for (const to of targets) {
      // Team template is optional; if configured we use it (works outside the
      // 24h window), otherwise a plain text alert.
      const payload = config.whatsapp.teamTemplate
        ? buildTemplate(routeTo(to), config.whatsapp.teamTemplate, config.whatsapp.templateLang, [
            enquiry.leadId,
            enquiry.name,
          ])
        : buildText(routeTo(to), body)
      results.push(await adapter.send(payload, 'team'))
    }
    const ok = results.every((r) => r.ok)
    return { ok, status: ok ? 'sent' : 'failed', error: results.find((r) => !r.ok)?.error, mock: adapter.kind === 'mock' }
  }

  async function sendCustomerAcknowledgement(enquiry) {
    if (!config.flags.customerWa) return { ok: true, status: 'skipped', reason: 'CUSTOMER_WHATSAPP_ENABLED=false' }
    if (!enquiry.whatsappOptIn) return { ok: true, status: 'skipped', reason: 'no opt-in' }

    // A business-initiated customer message MUST use an approved template. The
    // mock adapter can pretend, but a real send without a template name can't work.
    if (adapter.kind === 'live' && !config.whatsapp.customerAckTemplate)
      return { ok: false, status: 'failed', error: 'WHATSAPP_CUSTOMER_ACK_TEMPLATE not set' }

    const firstName = enquiry.name.split(' ')[0] || enquiry.name
    const payload = config.whatsapp.customerAckTemplate
      ? buildTemplate(routeTo(enquiry.phone), config.whatsapp.customerAckTemplate, config.whatsapp.templateLang, [
          firstName, // {{1}}
          enquiry.leadId, // {{2}}
        ])
      : buildText(routeTo(enquiry.phone), customerMessage(enquiry, firstName))

    const r = await adapter.send(payload, 'customer')
    return { ...r, mock: adapter.kind === 'mock' }
  }

  return { adapterKind: adapter.kind, sendTeamNotification, sendCustomerAcknowledgement }
}

/* ------------------------------ message copy ------------------------------ */

function teamMessage(e) {
  return [
    '🔔 NEW XLIVE WEBSITE ENQUIRY',
    '',
    `Lead: ${e.leadId}`,
    '',
    `Name: ${e.name}`,
    e.company ? `Company: ${e.company}` : null,
    `Email: ${e.email}`,
    `WhatsApp: ${e.phone}`,
    '',
    `Project Type: ${e.projectType}`,
    '',
    'Enquiry:',
    e.project.length > 500 ? `${e.project.slice(0, 500)}…` : e.project,
    '',
    `Received: ${e.receivedAt}`,
    '',
    'Please follow up with the customer.',
  ]
    .filter(Boolean)
    .join('\n')
}

// Fallback free-form copy (used by the mock, or a real send inside the 24h
// window). Production business-initiated sends use the approved template above.
function customerMessage(e, firstName) {
  return [
    `Hi ${firstName},`,
    '',
    'Thank you for contacting Xlive Production.',
    '',
    "We've received your enquiry and our team will review it and get back to you shortly.",
    '',
    `Your enquiry reference is: ${e.leadId}`,
    '',
    'If you need to provide any additional information, you can reply here.',
    '',
    'Thank you,',
    'Xlive Production',
  ].join('\n')
}
