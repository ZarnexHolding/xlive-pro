/*
 * POST /api/contact — Vercel Serverless Function.
 *
 * Thin adapter only: read env → build config → hand the request to the
 * runtime-agnostic core (api/_lib/enquiry.js). To run this on Cloudflare later,
 * add a Pages Function that reads `env`, builds the same config, and calls the
 * same processEnquiry() — no core changes. See docs/ENQUIRY-SYSTEM.md.
 */

import { buildConfig } from './_lib/config.js'
import { logger } from './_lib/logger.js'
import { processEnquiry } from './_lib/enquiry.js'

function clientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim()
  return req.socket?.remoteAddress || ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const config = buildConfig(process.env)

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid request.' })
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid request.' })
  }

  try {
    const result = await processEnquiry(body, {
      config,
      logger,
      ip: clientIp(req),
      userAgent: req.headers['user-agent'] || '',
    })
    return res.status(result.http).json(result.body)
  } catch (err) {
    logger.error('contact.unhandled', { error: err?.message })
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' })
  }
}
