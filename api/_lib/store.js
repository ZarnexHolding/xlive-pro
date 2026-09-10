/*
 * Persistence layer — the SOURCE OF TRUTH for enquiries.
 *
 * createStore(config, logger) returns one of two drivers:
 *   - neonStore   when config.db.url is set (Neon serverless Postgres)
 *   - memoryStore otherwise (best-effort; survives only within a warm instance)
 *
 * Both expose the same interface so the rest of the system is storage-agnostic:
 *   init(), nextLeadId(year), findBySubmissionId(id), createEnquiry(rec),
 *   setNotificationStatus(leadId, channel, status, error),
 *   countRecentByIp(ip, minutes), getEnquiry(leadId), listEnquiries(limit),
 *   recordWebhookEvent(payload)
 *
 * DEPLOYMENT-AGNOSTIC: @neondatabase/serverless speaks HTTP(S) and runs on both
 * Vercel functions and Cloudflare Workers/Pages, so no driver change is needed
 * to migrate. The Neon client is imported dynamically so builds that never set
 * DATABASE_URL don't need the package resolved at all.
 */

import { formatLeadId, transientLeadId } from './leadId.js'

const CHANNELS = { email: 'email_status', teamWa: 'team_wa_status', customerWa: 'customer_wa_status' }
const CHANNEL_ERR = { email: 'email_error', teamWa: 'team_wa_error', customerWa: 'customer_wa_error' }

/* ----------------------------- Neon (Postgres) ---------------------------- */

function neonStore(config, logger) {
  let sql = null
  let ready = null

  async function connect() {
    if (sql) return sql
    const { neon } = await import('@neondatabase/serverless')
    sql = neon(config.db.url)
    return sql
  }

  async function init() {
    if (ready) return ready
    ready = (async () => {
      const db = await connect()
      await db`
        CREATE TABLE IF NOT EXISTS enquiries (
          id                 BIGSERIAL PRIMARY KEY,
          lead_id            TEXT UNIQUE NOT NULL,
          submission_id      TEXT UNIQUE,
          created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
          name               TEXT NOT NULL,
          company            TEXT,
          email              TEXT NOT NULL,
          phone              TEXT NOT NULL,
          project_type       TEXT NOT NULL,
          project            TEXT NOT NULL,
          whatsapp_opt_in    BOOLEAN NOT NULL DEFAULT false,
          status             TEXT NOT NULL DEFAULT 'new',
          email_status       TEXT NOT NULL DEFAULT 'pending',
          team_wa_status     TEXT NOT NULL DEFAULT 'pending',
          customer_wa_status TEXT NOT NULL DEFAULT 'pending',
          email_error        TEXT,
          team_wa_error      TEXT,
          customer_wa_error  TEXT,
          ip                 TEXT,
          user_agent         TEXT,
          meta               JSONB
        )`
      await db`
        CREATE TABLE IF NOT EXISTS lead_counters (
          year INT PRIMARY KEY,
          seq  INT NOT NULL DEFAULT 0
        )`
      await db`
        CREATE TABLE IF NOT EXISTS wa_events (
          id         BIGSERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          payload    JSONB
        )`
      await db`CREATE INDEX IF NOT EXISTS enquiries_ip_created_idx ON enquiries (ip, created_at)`
    })()
    return ready
  }

  async function nextLeadId(year) {
    const db = await connect()
    const rows = await db`
      INSERT INTO lead_counters (year, seq) VALUES (${year}, 1)
      ON CONFLICT (year) DO UPDATE SET seq = lead_counters.seq + 1
      RETURNING seq`
    return formatLeadId(year, rows[0].seq)
  }

  async function findBySubmissionId(submissionId) {
    if (!submissionId) return null
    const db = await connect()
    const rows = await db`SELECT * FROM enquiries WHERE submission_id = ${submissionId} LIMIT 1`
    return rows[0] || null
  }

  async function createEnquiry(rec) {
    const db = await connect()
    const rows = await db`
      INSERT INTO enquiries
        (lead_id, submission_id, name, company, email, phone, project_type,
         project, whatsapp_opt_in, ip, user_agent)
      VALUES
        (${rec.leadId}, ${rec.submissionId || null}, ${rec.name}, ${rec.company || null},
         ${rec.email}, ${rec.phone}, ${rec.projectType}, ${rec.project},
         ${rec.whatsappOptIn}, ${rec.ip || null}, ${rec.userAgent || null})
      ON CONFLICT (submission_id) DO NOTHING
      RETURNING *`
    if (rows[0]) return rows[0]
    // Lost the idempotency race — return the row that won.
    return findBySubmissionId(rec.submissionId)
  }

  async function setNotificationStatus(leadId, channel, status, error) {
    if (!CHANNELS[channel]) return
    const db = await connect()
    const errText = error ? String(error).slice(0, 500) : null
    // Tagged templates per channel — this Neon HTTP driver has no sql.query(),
    // and column names can't be parameterised anyway.
    if (channel === 'email') {
      await db`UPDATE enquiries SET email_status = ${status}, email_error = ${errText} WHERE lead_id = ${leadId}`
    } else if (channel === 'teamWa') {
      await db`UPDATE enquiries SET team_wa_status = ${status}, team_wa_error = ${errText} WHERE lead_id = ${leadId}`
    } else if (channel === 'customerWa') {
      await db`UPDATE enquiries SET customer_wa_status = ${status}, customer_wa_error = ${errText} WHERE lead_id = ${leadId}`
    }
  }

  async function countRecentByIp(ip, minutes) {
    if (!ip) return 0
    const db = await connect()
    const rows = await db`
      SELECT count(*)::int AS n FROM enquiries
      WHERE ip = ${ip} AND created_at > now() - (${minutes} * interval '1 minute')`
    return rows[0]?.n || 0
  }

  async function getEnquiry(leadId) {
    const db = await connect()
    const rows = await db`SELECT * FROM enquiries WHERE lead_id = ${leadId} LIMIT 1`
    return rows[0] || null
  }

  async function listEnquiries(limit = 50) {
    const db = await connect()
    return db`SELECT * FROM enquiries ORDER BY created_at DESC LIMIT ${Math.min(limit, 200)}`
  }

  async function recordWebhookEvent(payload) {
    const db = await connect()
    await db`INSERT INTO wa_events (payload) VALUES (${JSON.stringify(payload)}::jsonb)`
  }

  return {
    kind: 'neon',
    init,
    nextLeadId,
    findBySubmissionId,
    createEnquiry,
    setNotificationStatus,
    countRecentByIp,
    getEnquiry,
    listEnquiries,
    recordWebhookEvent,
  }
}

/* ------------------------------ Memory (fallback) ------------------------- */

// Module-level so a warm serverless instance keeps state across requests
// (enables best-effort idempotency + rate-limit without a database). State is
// still lost on cold start — persistence needs Neon.
const memRows = []
const memCounters = {}

function memoryStore(config, logger) {
  const rows = memRows
  const counters = memCounters
  let warned = false

  const warn = () => {
    if (warned) return
    warned = true
    logger?.warn('store.memory_fallback', {
      note: 'DATABASE_URL not set — enquiries are NOT durably persisted. Set Neon to enable persistence.',
    })
  }

  return {
    kind: 'memory',
    async init() {
      warn()
    },
    async nextLeadId(year) {
      warn()
      counters[year] = (counters[year] || 0) + 1
      // Transient id: memory counters reset on cold start, so signal that clearly.
      return transientLeadId(year)
    },
    async findBySubmissionId(id) {
      if (!id) return null
      return rows.find((r) => r.submission_id === id) || null
    },
    async createEnquiry(rec) {
      const existing = rec.submissionId && rows.find((r) => r.submission_id === rec.submissionId)
      if (existing) return existing
      const row = {
        id: rows.length + 1,
        lead_id: rec.leadId,
        submission_id: rec.submissionId || null,
        created_at: new Date().toISOString(),
        name: rec.name,
        company: rec.company || null,
        email: rec.email,
        phone: rec.phone,
        project_type: rec.projectType,
        project: rec.project,
        whatsapp_opt_in: rec.whatsappOptIn,
        status: 'new',
        email_status: 'pending',
        team_wa_status: 'pending',
        customer_wa_status: 'pending',
        email_error: null,
        team_wa_error: null,
        customer_wa_error: null,
        ip: rec.ip || null,
        user_agent: rec.userAgent || null,
      }
      rows.push(row)
      return row
    },
    async setNotificationStatus(leadId, channel, status, error) {
      const row = rows.find((r) => r.lead_id === leadId)
      if (!row) return
      row[CHANNELS[channel]] = status
      row[CHANNEL_ERR[channel]] = error ? String(error).slice(0, 500) : null
    },
    async countRecentByIp(ip, minutes) {
      if (!ip) return 0
      const cutoff = Date.now() - minutes * 60_000
      return rows.filter((r) => r.ip === ip && new Date(r.created_at).getTime() > cutoff).length
    },
    async getEnquiry(leadId) {
      return rows.find((r) => r.lead_id === leadId) || null
    },
    async listEnquiries(limit = 50) {
      return rows.slice(-limit).reverse()
    },
    async recordWebhookEvent(payload) {
      logger?.info('webhook.event_memory', { note: 'not persisted', keys: Object.keys(payload || {}) })
    },
  }
}

/* -------------------------------- factory --------------------------------- */

export function createStore(config, logger) {
  return config.db.url ? neonStore(config, logger) : memoryStore(config, logger)
}
