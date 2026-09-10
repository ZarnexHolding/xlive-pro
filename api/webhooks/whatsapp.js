/*
 * /api/webhooks/whatsapp — Meta WhatsApp webhook FOUNDATION.
 *
 *   GET  → verification handshake (hub.challenge)
 *   POST → receive inbound messages / delivery statuses, log + store, ACK 200
 *
 * Deliberately does NOT auto-reply — two-way conversation is a future phase.
 * When credentials aren't configured yet this still answers correctly so the
 * endpoint can be registered in Meta as soon as you have a verify token.
 *
 * Optional payload authenticity: if WHATSAPP_APP_SECRET is set we verify Meta's
 * X-Hub-Signature-256 (HMAC-SHA256 of the raw body).
 */

import crypto from 'node:crypto'
import { buildConfig } from '../_lib/config.js'
import { logger } from '../_lib/logger.js'
import { createStore } from '../_lib/store.js'

// We need the raw body to verify the signature, so disable Vercel's parser.
export const config = { api: { bodyParser: false } }

function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function signatureValid(appSecret, raw, header) {
  if (!appSecret) return true // not enforced until a secret is configured
  if (!header || !header.startsWith('sha256=')) return false
  const expected = 'sha256=' + crypto.createHmac('sha256', appSecret).update(raw).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected))
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  const cfg = buildConfig(process.env)

  // --- Verification handshake ---
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']
    if (mode === 'subscribe' && token && token === cfg.whatsapp.verifyToken) {
      logger.info('webhook.verified', {})
      res.setHeader('Content-Type', 'text/plain')
      return res.status(200).send(challenge)
    }
    logger.warn('webhook.verify_failed', { hasToken: Boolean(token) })
    return res.status(403).json({ success: false })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ success: false })
  }

  // --- Inbound events ---
  let raw
  try {
    raw = await readRaw(req)
  } catch {
    return res.status(400).json({ success: false })
  }

  if (!signatureValid(cfg.whatsapp.appSecret, raw, req.headers['x-hub-signature-256'])) {
    logger.warn('webhook.bad_signature', {})
    return res.status(401).json({ success: false })
  }

  let payload = {}
  try {
    payload = JSON.parse(raw.toString('utf8') || '{}')
  } catch {
    return res.status(400).json({ success: false })
  }

  // Always ACK 200 quickly so Meta doesn't retry; persist best-effort.
  try {
    const entry = payload?.entry?.[0]?.changes?.[0]?.value || {}
    const messages = entry.messages?.length || 0
    const statuses = entry.statuses?.length || 0
    logger.info('webhook.received', { messages, statuses })
    const store = createStore(cfg, logger)
    await store.init()
    await store.recordWebhookEvent(payload)
  } catch (err) {
    logger.warn('webhook.store_failed', { error: err?.message })
  }

  return res.status(200).json({ success: true })
}
