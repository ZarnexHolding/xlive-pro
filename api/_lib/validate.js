/*
 * Server-side validation + sanitization for enquiries. Runtime-agnostic (pure).
 * Mirrors the client checks in Contact.jsx but is the authoritative gate — never
 * trust the browser.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// International phone, E.164-ish. Optional leading +, then 7–15 digits. We
// normalise separators first, so "+971 55 123 4567" and "(971) 55-123-4567"
// both pass. No country is hard-coded.
const PHONE_RE = /^\+?[1-9]\d{6,14}$/

const PROJECT_TYPES = [
  'Event production',
  'Exhibition / stand',
  'Fabrication',
  'Agency partnership',
  'Other',
]

// All control chars incl. CR/LF — stripping these blocks header/email injection.
const CONTROL_ALL = /[\x00-\x1F\x7F]/g
// Same, but keep \n (\x0A) so multi-line messages survive.
const CONTROL_NO_LF = /[\x00-\x09\x0B-\x1F\x7F]/g

// Single-line field: strip control chars, collapse whitespace runs, trim, cap.
function clean(value, max) {
  return String(value ?? '')
    .replace(CONTROL_ALL, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
    .slice(0, max)
}

// Message keeps newlines (meaningful) but drops other control chars.
function cleanMultiline(value, max) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(CONTROL_NO_LF, '')
    .trim()
    .slice(0, max)
}

function normalisePhone(value) {
  const raw = String(value ?? '').trim()
  const plus = raw.startsWith('+') ? '+' : ''
  const digits = raw.replace(/[^\d]/g, '')
  return plus + digits
}

export function validateEnquiry(body = {}, { maxMessage = 5000 } = {}) {
  const errors = {}

  // Honeypot — a filled `website` field means a bot. Signalled separately so the
  // caller can return a silent 200.
  const isBot = Boolean(String(body.website || '').trim())

  const name = clean(body.name, 120)
  const company = clean(body.company, 160)
  const email = clean(body.email, 200).toLowerCase()
  const phone = normalisePhone(body.phone)
  const projectType = clean(body.projectType ?? body.type, 80)
  const project = cleanMultiline(body.project ?? body.message, maxMessage + 1)
  const whatsappOptIn = body.whatsappOptIn === true || body.whatsappOptIn === 'true'
  const submissionId = clean(body.submissionId, 64)

  if (!name || name.length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (!phone) errors.phone = 'Please enter your phone number.'
  else if (!PHONE_RE.test(phone))
    errors.phone = 'Enter a valid number with country code, e.g. +9715XXXXXXXX.'
  if (!projectType || !PROJECT_TYPES.includes(projectType))
    errors.projectType = 'Please choose a project type.'
  if (!project || project.length < 10)
    errors.project = 'Tell us a little about the project (at least 10 characters).'
  else if (project.length > maxMessage) errors.project = 'Message is too long.'

  const ok = Object.keys(errors).length === 0

  return {
    ok,
    isBot,
    errors,
    data: { name, company, email, phone, projectType, project, whatsappOptIn, submissionId },
  }
}

export { PROJECT_TYPES, normalisePhone, PHONE_RE, EMAIL_RE }
