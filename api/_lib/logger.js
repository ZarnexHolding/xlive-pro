/*
 * Structured, redacting logger. Portable across Node (Vercel) and Workers
 * (Cloudflare) — console.* only. Never logs secrets or full message bodies.
 */

const SECRET_KEYS = /token|secret|key|authorization|apikey|password/i

function redact(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const out = Array.isArray(obj) ? [] : {}
  for (const [k, v] of Object.entries(obj)) {
    if (SECRET_KEYS.test(k)) out[k] = '[redacted]'
    else if (v && typeof v === 'object') out[k] = redact(v)
    else out[k] = v
  }
  return out
}

function emit(level, event, data) {
  const line = { level, event, ts: new Date().toISOString(), ...redact(data || {}) }
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
  // Compact single-line JSON keeps logs greppable in Vercel / Cloudflare tail.
  fn(JSON.stringify(line))
}

export const logger = {
  info: (event, data) => emit('info', event, data),
  warn: (event, data) => emit('warn', event, data),
  error: (event, data) => emit('error', event, data),
}

export default logger
