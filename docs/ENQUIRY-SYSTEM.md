# XLIVE Enquiry Automation

The contact form is backed by a small, fault-tolerant lead pipeline. The backend
is the **source of truth**; Gmail and WhatsApp are notification channels only.

```
Contact form (name, company, email, phone, project type, project, WhatsApp consent)
   │  POST /api/contact  (same-origin JSON, + submissionId for idempotency)
   ▼
api/contact.js  ── thin Vercel adapter ──▶  api/_lib/enquiry.js  (runtime-agnostic core)
                                              1. validate + sanitize (server-side)
                                              2. honeypot → silent 200
                                              3. rate-limit by IP
                                              4. idempotency by submissionId
                                              5. allocate Lead ID + PERSIST  ← source of truth
                                              6. notify (each independent + status-tracked):
                                                   ├─ email  → Gmail (Resend)
                                                   ├─ team WhatsApp  (Meta Cloud API)
                                                   └─ customer WhatsApp ack (opt-in only)
                                              7. return { leadId } to the browser
```

## Files

| File | Role |
|------|------|
| `api/contact.js` | POST endpoint (thin adapter: env → config → core) |
| `api/enquiries.js` | GET, token-protected debug/admin list of enquiries + statuses |
| `api/webhooks/whatsapp.js` | GET verify + POST receive (foundation; no auto-reply) |
| `api/_lib/config.js` | **Only place env is read** — the deployment seam |
| `api/_lib/enquiry.js` | Core pipeline (runtime-agnostic) |
| `api/_lib/validate.js` | Server-side validation + sanitization |
| `api/_lib/store.js` | Persistence — Neon Postgres driver + in-memory fallback |
| `api/_lib/leadId.js` | Lead ID formatting (`XL-2026-0001`) |
| `api/_lib/email.js` | Resend email service (admin + visitor) |
| `api/_lib/whatsapp.js` | WhatsApp service — **mock** + **live** adapters |
| `api/_lib/logger.js` | Structured, secret-redacting logs |
| `src/components/sections/Contact.jsx` | Form (phone + consent + validation + idempotency) |

Files/folders under `api/` starting with `_` are **not** turned into routes by
Vercel; they are bundled as imports only.

## Data model (Neon Postgres — auto-created on first request)

`enquiries`: `id, lead_id (unique), submission_id (unique), created_at, name,
company, email, phone, project_type, project, whatsapp_opt_in, status
(new|contacted|qualified|closed), email_status, team_wa_status,
customer_wa_status, {email,team_wa,customer_wa}_error, ip, user_agent, meta`.
Notification statuses are `pending|sent|failed|skipped`.

`lead_counters(year, seq)` — atomic per-year sequence for Lead IDs.
`wa_events(id, created_at, payload)` — inbound webhook events.

## Environment variables

See `.env.example` for the full list with placeholders. Groups:

- **Email**: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`
- **Database**: `DATABASE_URL` (Neon). If unset → in-memory fallback (not durable).
- **Flags / mode**: `NOTIFICATIONS_MODE` (`test`|`live`, default `test`),
  `EMAIL_NOTIFICATIONS_ENABLED`, `TEAM_WHATSAPP_ENABLED`, `CUSTOMER_WHATSAPP_ENABLED`
- **Abuse**: `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MIN`, `MAX_MESSAGE_LENGTH`
- **Admin**: `ADMIN_API_TOKEN` (unset → `/api/enquiries` disabled)
- **WhatsApp (Meta)**: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
  `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`,
  `WHATSAPP_API_VERSION`, `WHATSAPP_TEAM_RECIPIENTS`, `WHATSAPP_CUSTOMER_ACK_TEMPLATE`,
  `WHATSAPP_TEAM_TEMPLATE`, `WHATSAPP_TEMPLATE_LANG`, `WHATSAPP_TEST_RECIPIENT`

> **Vercel dashboard quoting gotcha**: values are literal — never wrap in quotes.
> A quoted `CONTACT_FROM` becomes an invalid sender → Resend 502. Quotes belong
> only in a `.env` *file*. Editing env vars requires a redeploy.

## WhatsApp: current state (MOCK)

No Meta credentials are configured yet, so the WhatsApp service runs its **mock
adapter**: it logs exactly what it *would* send and reports `sent (mock)`, so the
whole pipeline — team alert + customer acknowledgement — is testable end-to-end
without messaging anyone. The mock is selected when **any** of:

- `NOTIFICATIONS_MODE=test` (the default), or
- `WHATSAPP_MOCK=true`, or
- credentials are missing.

Nothing real is sent until you set credentials **and** `NOTIFICATIONS_MODE=live`.

### Going live later (what you must obtain from Meta)

1. A Meta app with **WhatsApp** added (developers.facebook.com).
2. **`WHATSAPP_PHONE_NUMBER_ID`** and **`WHATSAPP_BUSINESS_ACCOUNT_ID`** (WhatsApp → API setup).
3. A **permanent `WHATSAPP_ACCESS_TOKEN`** (System User token; the test token expires in 24h).
4. **`WHATSAPP_VERIFY_TOKEN`** — a string *you* choose; enter the same value in
   Meta's webhook config and here. Webhook callback URL: `https://<domain>/api/webhooks/whatsapp`.
5. **`WHATSAPP_APP_SECRET`** (app → Settings → Basic) to enable signature verification.
6. **`WHATSAPP_TEAM_RECIPIENTS`** — comma-separated E.164 numbers for the team alert.
7. Approved message **templates**, because business-initiated messages require them:
   - `WHATSAPP_CUSTOMER_ACK_TEMPLATE` with body variables `{{1}}` = first name, `{{2}}` = Lead ID.
   - Optionally `WHATSAPP_TEAM_TEMPLATE` (else the team alert is plain text, which
     only delivers inside the 24-hour service window).

Then set `NOTIFICATIONS_MODE=live` and redeploy. Test with `WHATSAPP_TEST_RECIPIENT`
set first (redirects all messages to one number).

## Testing locally

```bash
# Frontend only (the /api functions do NOT run here):
npm run dev

# Full stack incl. /api serverless functions (needs a local .env):
npx vercel dev
```

Pipeline unit behaviour is covered without network/DB by exercising
`processEnquiry()` directly with an in-memory store + WhatsApp mock (valid,
duplicate, opt-in on/off, missing/invalid fields, honeypot, header-injection).

Manual checks once running under `vercel dev`:

```bash
curl -s -X POST localhost:3000/api/contact -H "Content-Type: application/json" \
  -d '{"name":"Ahmed Khan","email":"a@b.com","phone":"+971551234567","projectType":"Event production","project":"Corporate event in Dubai, need production support.","whatsappOptIn":true,"submissionId":"test-1"}'

# admin visibility (needs ADMIN_API_TOKEN)
curl -s localhost:3000/api/enquiries -H "Authorization: Bearer $ADMIN_API_TOKEN"
```

## Deploy (Vercel)

1. Provision **Neon** (Vercel → Storage → Neon, or neon.tech) → copy the pooled
   `DATABASE_URL` into Vercel env vars (all environments).
2. Set the email + flag env vars (see above). Leave WhatsApp blank for now.
3. Set a long random `ADMIN_API_TOKEN`.
4. Redeploy. Schema auto-creates on the first enquiry.

## Cloudflare compatibility (before any migration)

The system was built deployment-agnostic on purpose. **It is compatible with
Cloudflare Workers/Pages Functions**, with these facts:

- **Core is portable.** Everything in `api/_lib/` uses only `fetch` + standard
  JS and never reads `process.env` directly — env is read solely in
  `api/_lib/config.js` via `buildConfig(env)`. The Vercel handlers are ~30-line
  adapters.
- **Neon** (`@neondatabase/serverless`) is HTTP-based and runs on Workers. ✅
- **Resend** SDK is `fetch`-based and runs on Workers. ✅
- **WhatsApp** is plain `fetch` to graph.facebook.com. ✅
- **What changes on migration** (adapter layer only, not the core):
  1. Rewrite the 3 handlers in Cloudflare form. On **Pages Functions**:
     `functions/api/contact.js` exporting `onRequestPost({ request, env })` →
     `buildConfig(env)` → `processEnquiry(...)` → `Response.json(...)`. The webhook
     becomes `onRequestGet`/`onRequestPost`; read the raw body with
     `await request.text()` (needed for signature check) and use the Web Crypto
     API (`crypto.subtle`) for HMAC instead of `node:crypto`.
  2. Client IP comes from `request.headers.get('cf-connecting-ip')` instead of
     `x-forwarded-for`.
  3. `api/webhooks/whatsapp.js` currently uses `node:crypto` and Vercel's
     `bodyParser:false` — both are Vercel-isms and would be swapped for the Web
     Crypto + `request.text()` equivalents in the Cloudflare handler.
  4. Env vars move to Cloudflare Pages project settings / `wrangler.toml`.
  5. Background delivery: Vercel uses `waitUntil` from `@vercel/functions`;
     Cloudflare uses `ctx.waitUntil`. We don't use either yet (notifications are
     awaited inline), so nothing to port until Phase 2.
- **Recommendation**: keep the current Vercel deployment; the migration is a
  contained adapter rewrite (3 files) plus env re-entry when you decide to move.
  No core logic, validation, persistence, or WhatsApp code needs to change.

## Failure handling & idempotency

- Persistence is attempted first. If it fails, the enquiry is **not dropped** —
  a transient Lead ID is issued and the email still fires so it reaches Gmail.
- Each notification is independent and its status is tracked; one failing never
  loses the enquiry or blocks the others.
- `submissionId` (a UUID minted per submission in the browser) dedupes double
  submits: a repeat returns the existing Lead ID and sends nothing again.
- Rate limiting is per-IP (`RATE_LIMIT_MAX` per `RATE_LIMIT_WINDOW_MIN`),
  DB-backed with Neon and best-effort in the memory fallback.

## Limitations / risks

- **WhatsApp is not proven** — it is mocked until real Meta credentials are added
  and tested. Do not treat WhatsApp as working yet.
- The in-memory fallback (no `DATABASE_URL`) does **not** persist across cold
  starts. Provision Neon for durability.
- Notifications are awaited within the request (fast, a few HTTP calls). Under
  real WhatsApp latency, consider a queue / `waitUntil` (Phase 2).
- No retry UI yet — statuses are stored; a retry endpoint is Phase 2.
- **Privacy**: the form now collects a phone number and WhatsApp consent. The
  site should carry a short privacy note on the contact form covering how contact
  details and WhatsApp communication are used before this goes to production.

## Phase 2 backlog (architecture already supports)

Retry endpoint for failed notifications · queue/`waitUntil` async delivery ·
Google Sheet/CRM mirror · two-way WhatsApp (webhook already receives) ·
Slack/Teams alerts · lead scoring / AI classification · admin dashboard.
