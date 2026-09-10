/*
 * Runtime configuration — the single place env vars are read.
 *
 * DEPLOYMENT-AGNOSTIC: nothing else under api/_lib touches process.env. Handlers
 * call buildConfig() and pass the result into the core. On Vercel that means
 * buildConfig(process.env); on Cloudflare Workers/Pages later it becomes
 * buildConfig(env) where `env` is the bindings object handed to the fetch handler.
 * That is the only change the core needs to run on Cloudflare.
 */

const bool = (v, dflt = false) => {
  if (v === undefined || v === null || v === '') return dflt
  return String(v).toLowerCase() === 'true' || v === '1'
}

const int = (v, dflt) => {
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : dflt
}

const list = (v) =>
  String(v || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

export function buildConfig(env = {}) {
  // Default mode is "test" — real WhatsApp is never sent until explicitly set live.
  const mode = String(env.NOTIFICATIONS_MODE || 'test').toLowerCase() === 'live' ? 'live' : 'test'

  const whatsapp = {
    accessToken: env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessAccountId: env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    verifyToken: env.WHATSAPP_VERIFY_TOKEN || '',
    appSecret: env.WHATSAPP_APP_SECRET || '',
    apiVersion: env.WHATSAPP_API_VERSION || 'v22.0',
    teamRecipients: list(env.WHATSAPP_TEAM_RECIPIENTS),
    teamTemplate: env.WHATSAPP_TEAM_TEMPLATE || '', // optional; free-form used if unset
    customerAckTemplate: env.WHATSAPP_CUSTOMER_ACK_TEMPLATE || '',
    templateLang: env.WHATSAPP_TEMPLATE_LANG || 'en',
    testRecipient: env.WHATSAPP_TEST_RECIPIENT || '', // redirect target in test mode
    forceMock: bool(env.WHATSAPP_MOCK, false),
  }

  // A channel can only actually talk to Meta when it has credentials AND we're live.
  const waConfigured = Boolean(whatsapp.accessToken && whatsapp.phoneNumberId)

  return {
    mode,
    isTest: mode === 'test',

    flags: {
      email: bool(env.EMAIL_NOTIFICATIONS_ENABLED, true),
      teamWa: bool(env.TEAM_WHATSAPP_ENABLED, true),
      customerWa: bool(env.CUSTOMER_WHATSAPP_ENABLED, true),
    },

    resend: {
      apiKey: env.RESEND_API_KEY || '',
      from: env.CONTACT_FROM || 'XLIVE Production <onboarding@resend.dev>',
      to: env.CONTACT_TO || '',
    },

    db: {
      url: env.DATABASE_URL || env.POSTGRES_URL || '',
    },

    whatsapp: { ...whatsapp, configured: waConfigured },

    admin: {
      token: env.ADMIN_API_TOKEN || '',
    },

    limits: {
      rateMax: int(env.RATE_LIMIT_MAX, 5),
      rateWindowMin: int(env.RATE_LIMIT_WINDOW_MIN, 10),
      maxMessage: int(env.MAX_MESSAGE_LENGTH, 5000),
    },
  }
}

export { bool, int, list }
