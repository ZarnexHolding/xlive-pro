# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/portfolio site for **XLIVE Production**, a Riyadh-based event production & experience-engineering company (part of Zarnex Holding). Multi-page React SPA. The goal is a premium, trust-building site aimed at government entities, giga-projects, luxury brands, and international/Dubai agencies delivering into Saudi Arabia.

> ⚠️ `README.md` is the **outdated pre-rebuild scaffold** (it still says React 18, Syne/DM Sans, coral `#E84530`, gsap/swiper, `src/sections/`). Ignore it — this file reflects the current codebase.

## Commands

```bash
npm install
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # production build -> dist/
npm run preview    # serve the production build
npx vercel dev     # run the site WITH the /api serverless function locally (see Contact backend)
```

There is **no test or lint script** configured (package.json has only dev/build/preview). The project is **JavaScript/JSX — no TypeScript** (despite `@types/react` being present).

## Tech stack

React 19 + Vite 5 · Tailwind CSS 3 · Framer Motion 12 (all animation) · Lenis (smooth scroll) · react-router-dom 7 · react-helmet-async (SEO) · react-icons · Resend (contact email, serverless only). Deploys to **Vercel**.

The Vite app lives at the **repository root** — `src/`, `public/`, `api/`, `index.html`, `vite.config.js`, `package.json`, `vercel.json` are all at the top level (the app was flattened up from an earlier `frontend/` subfolder, so ignore any lingering `frontend/…` path references).

## Architecture

**Routing & shell** — `src/App.jsx` defines routes. `SiteLayout` (Navbar + `<Outlet>` + Footer) wraps `/`, `/work`, `/work/:slug`, `/partners`, `/about`; it also mounts `useLenis()` and a `ScrollToTop`. `/styleguide` is standalone. Home is eager; every other page is **`React.lazy` code-split**. Entry is `src/main.jsx` (BrowserRouter + HelmetProvider + Analytics).

**Pages** (`src/pages/`) — `Home` composes section components in order: `Hero → ProofBand → WhoWeAre → Capabilities → Work → Fabrication → Industries → PartnersTeaser → Contact`. `Work` (index) + `CaseStudy` (`/work/:slug`, uses `getProject`, redirects to `/work` if slug not found), `Partners` (the conversion page), `About`, `StyleGuide` (living design-system reference).

**Components** — `components/sections/*` are page sections; `components/ui/*` are reusable primitives (`Button`, `ProjectCard`, `XSymbol`/`XMotif`, `BackButton`, `Seo`); `components/animations/Reveal.jsx` exports `Reveal`/`RevealGroup`/`RevealItem` (Framer `whileInView`). Hooks: `useLenis` (+ module-singleton `getLenis()`), `useInView`, `useCounter`.

**Content lives in `src/data/`, not in components** — `company.js` (nav, metrics, clients, contact/address), `capabilities.js`, `projects.js` (+ case-study fields + `getProject`), `fabrication.js`, `industries.js`, `partners.js`, `about.js`. Change copy here. **All content must stay real** — sourced from XLIVE's actual brand/profile/projects documents. Do not invent projects, metrics, or client names.

## Design system (this is the important part)

**Single source of truth = `tailwind.config.js`.** The same values are mirrored as CSS custom properties in `src/styles/globals.css` `:root` (for canvas/SVG/inline gradients) — **keep the two in sync.**

- **Color** — near-black cool canvas `ink.{950..500}`; **`electric` `#2A1AAE`** is the structural brand color (grounds, gradients, glow); **`acid` `#73F83E`** is the *single* high-voltage accent — **use sparingly** (CTAs, ticks, "live" signals); `vivid`/`olive` support; text `fg`/`fg-muted`/`fg-dim`; hairlines `line`/`line-soft`/`line-strong`.
- **Type** — display = Helvetica (`font-display`: `"Helvetica Neue", Archivo, …`), body = `Hanken Grotesk` (`font-body`, loaded in `index.html`). Use the fluid `fontSize` tokens: `display-2xl`, `display-xl`, `display-lg`, `heading`, `subhead`, `body-lg`, `label`. Display headings are bold, tight (`tracking-tightest`), often uppercase.
- **Reusable classes** (`globals.css` `@layer components`/`utilities`): `.shell` (max-width page gutter), `.eyebrow` (label with acid tick), `.btn-primary`/`.btn-outline`, `.card`, `.bg-grid`, `.bg-glow-blue`. Motif SVG via `XSymbol`/`XMotif`.
- **Motion** — Framer Motion + Lenis; custom easings `luxury`/`snap`/`expo`; keyframes `streak`/`marquee`/`float-slow`. `prefers-reduced-motion` handled in globals CSS.

## Conventions & gotchas

- **Button variants**: never override a variant's color by appending a `className` (Tailwind precedence is source-order, not class-order — this once produced a black-on-black button). Add a new variant in `components/ui/Button.jsx` instead (e.g. `dark`).
- **Nav items** (`company.js` `nav`): items use **`href`** for in-page anchors (Home sections) or **`to`** for routes. `Navbar` and `Footer` branch on which is present; anchor clicks from a non-home route navigate home first, then scroll (via Lenis `getLenis()`).
- **Featured Work grid** (`components/sections/Work.jsx`): its `LAYOUT` array drives an asymmetric 6-card grid (`[7|5] [5|7] [7|5]`) and is sized to the number of `projects`. If you add/remove a project in `data/projects.js`, update `LAYOUT` to keep the rows balanced (it falls back to the last entry so it won't crash). The `/work` index page (`pages/Work.jsx`) has its own `SIZES` array.
- **Images**: optimized JPGs in `public/images/` (real project photos extracted from source decks). Hero background is `public/videos/hero-bg.mp4` (compressed ~1 MB) with `hero-poster.jpg`.
- **SEO**: per-route `<Seo>` (react-helmet-async) sets title/description/canonical/OG/Twitter. `index.html` holds only site-wide bits (Organization JSON-LD, `og:site_name`) — do **not** re-add per-page meta there (causes duplicates). `public/robots.txt` + `public/sitemap.xml` list all routes.

## Contact / enquiry backend

`POST /api/contact` is a **Vercel Serverless Function** — but a *thin adapter* only. It reads env → `buildConfig()` → hands the request to the runtime-agnostic core `api/_lib/enquiry.js` (`processEnquiry`). The backend is the **source of truth**; Gmail (Resend) and WhatsApp are notification channels. Full reference: [docs/ENQUIRY-SYSTEM.md](docs/ENQUIRY-SYSTEM.md).

Pipeline: validate + sanitize → honeypot (`website`) → per-IP rate-limit → idempotency (`submissionId`) → allocate Lead ID (`XL-2026-0001`) + **persist** → notify (admin email, team WhatsApp, customer WhatsApp ack on opt-in), each independent + status-tracked → return `{ leadId }`.

- **`api/_lib/` is the core** (not routed — the `_` prefix keeps Vercel from making endpoints): `config.js` (the ONLY place env is read — the deployment seam), `enquiry.js`, `validate.js`, `store.js` (Neon Postgres + in-memory fallback), `email.js`, `whatsapp.js` (mock + live adapters), `leadId.js`, `logger.js`. Other routes: `api/enquiries.js` (token-gated debug list), `api/webhooks/whatsapp.js` (GET verify + POST receive, no auto-reply).
- **Form** (`components/sections/Contact.jsx`) now collects name, company, email, **phone (Phone / WhatsApp, `type=tel`, intl)**, project type, project, **`whatsappOptIn` checkbox**; sends a `submissionId` (UUID) for dedupe. Client + server validation both run; server is authoritative. Consent is optional — no opt-in just skips the customer WhatsApp ack.
- **Database = Neon** (`@neondatabase/serverless`, HTTP driver). Set `DATABASE_URL`; schema auto-creates. No `DATABASE_URL` → in-memory fallback (works, but NOT durable across cold starts).
- **WhatsApp = MOCK for now** (no Meta creds yet). The mock adapter is used when `NOTIFICATIONS_MODE=test` (default), `WHATSAPP_MOCK=true`, or creds are missing — logs what it *would* send, nothing real goes out. Do NOT claim WhatsApp works until real Meta creds are set (`NOTIFICATIONS_MODE=live`) and tested. Official Meta Cloud API only — never web automation / unofficial libs.
- **Deployment-agnostic** (planned Cloudflare migration): core touches only `fetch` + `buildConfig(env)`, never `process.env` directly. Migrating = rewrite the 3 handlers in Cloudflare form + swap `node:crypto`→Web Crypto and `x-forwarded-for`→`cf-connecting-ip` in the webhook; core is unchanged. See the Cloudflare section in the doc.
- Env vars (all in `.env.example`): email `RESEND_API_KEY`/`CONTACT_TO`/`CONTACT_FROM`; `DATABASE_URL`; flags `NOTIFICATIONS_MODE`/`EMAIL_NOTIFICATIONS_ENABLED`/`TEAM_WHATSAPP_ENABLED`/`CUSTOMER_WHATSAPP_ENABLED`; `ADMIN_API_TOKEN`; `WHATSAPP_*`.
- **Env-var quoting gotcha**: in the **Vercel dashboard** the value box is literal — do **not** wrap values in quotes. A quoted `CONTACT_FROM` becomes an invalid sender → Resend **502**. Quotes belong only in a `.env` *file*. Editing env vars requires a **redeploy**.
- **`/api` does not run under `npm run dev`** — use `npx vercel dev` (with a local `.env`). `vercel.json` rewrites all non-`/api` routes to `index.html`.
