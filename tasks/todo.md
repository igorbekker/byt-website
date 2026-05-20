# Task Plan

## Status Legend

- [ ] Pending
- [x] Complete
- [~] In Progress
- [!] Blocked

---

## Decisions Log

| #   | Question                                        | Decision                                                                                  |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Schema sharing between apps/web and apps/studio | Stub config in apps/web for Phase 1; extract to packages/schemas in Phase 2. See DEC-001. |

---

## Quick Status Summary

- **Last work:** 2026-05-20 — Phase 7A Step 3.8: SanityImage.astro with srcset, WebP, CLS prevention
- **Current issues:** None open
- **Detailed history:** See `tasks/todo-archive.md`

---

### Phase 7A Step 3.3b — global.css hardening + combined commit — 2026-05-20 [x] COMPLETE 2026-05-20

Harden global.css as part of Phase 7A production readiness: remove Google Fonts @import (moved to `<link>` in BaseLayout.astro), add z-index token scale, color-scheme, text-size-adjust, safe-area insets, :focus-visible, reduced-motion media query, skip-link, .sr-only, typography fixes, scroll-margin :target, print stylesheet, aspect-ratio utilities.

- [x] A. Removed `@import url('https://fonts.googleapis.com/css2?...')` from line 1
- [x] B. Added `text-size-adjust: 100%` to `html` rule (alongside existing -webkit-text-size-adjust)
- [x] C. Added `color-scheme: light` and z-index token scale (--z-base through --z-skip-link) to existing `:root`
- [x] D. Added safe-area `padding-left/right: env(safe-area-inset-*)` to existing `body` rule
- [x] E. Added `:focus-visible` with `--navy` outline
- [x] F. Added `@media (prefers-reduced-motion: reduce)` with animation/transition kill switches
- [x] G. Added `.skip-link` + `.skip-link:focus` rules using `--z-skip-link`
- [x] H. Added global `.sr-only` definition
- [x] I. Added `h1–h6 { overflow-wrap: break-word }`
- [x] J. Added `input, button, textarea, select { font: inherit; color: inherit }`
- [x] K. Added `article a, .content a { text-decoration: underline; text-underline-offset: 2px }`
- [x] L. Added `:target { scroll-margin-top: calc(84px + 1rem) }`
- [x] M. Added `.mobile-cta-bar, .mobile-cta { padding-bottom: env(safe-area-inset-bottom, 0px) }`
- [x] N. Added `.aspect-ratio-16-9 / -4-3 / -1-1` utilities
- [x] O. Added `@media print` stylesheet (hides nav/header/footer/CTAs, appends hrefs, 12pt body)
- [x] P. Verified: all 5 pre-flight greps passed — @import gone, color-scheme L44, z-tokens L47–53, text-size-adjust L15, safe-area L127–128

### Session Review — 2026-05-20 (Phase 7A Step 3.3b — global.css hardening)

**What was built:** 15 targeted additions to `apps/web/src/styles/global.css`. The Google Fonts `@import` was removed (font loading moved to `<link>` in BaseLayout.astro per Step 3.3a). All new rules were inserted into existing `:root`, `html`, and `body` blocks where applicable; new standalone rule groups placed in logical sections. No existing CSS was modified or reordered.

**Files changed:**

- `apps/web/src/styles/global.css` — 360 → 465 lines (+105); 7 surgical Edit tool calls

**Verification:** 5-grep pre-flight all passed: (1) no @import match, (2) color-scheme at L44, (3) all 7 z-index tokens at L47–53, (4) text-size-adjust at L15, (5) safe-area-inset-left/right at L127–128.

**Issues:** None. No user corrections this session.

---

### Wire all 5 frontend forms to HubSpot Pages Function endpoints — 2026-05-20 [x] COMPLETE 2026-05-20 18:05

Replace all Formspree form submissions with fetch() POST calls to the new `/api/*` HubSpot endpoints. No form field HTML changed — only submission handlers.

- [x] A. Newsletter (Footer.astro + NewsletterBlock.astro) — added `name="email"` to both inputs; replaced Formspree fetch with POST `/api/newsletter` JSON `{ email, firstName: '' }`
- [x] B. Book a Session modal (ModalForms.astro bookForm) — replaced `handleSubmit` 'book' branch with POST `/api/book-session`; maps firstName, lastName, email, phone, reason→whatBringsYouIn, payment→howWillYouPay, avail checkboxes joined→bestTimesToReachYou, notes→anythingElse
- [x] C. Facility Referral modal (ModalForms.astro referForm) — replaced `handleSubmit` 'refer' branch with POST `/api/facility-referral`; splits single `name` field on first space into firstName/lastName; maps facility, facType, county, beds, role, interest checkboxes joined, refNotes; sends `facilityPhone: ''`
- [x] D. Contact Us (contact.astro) — removed `contactId` env var + `data-formspree-id` attribute; replaced `handleContactSubmit` with POST `/api/contact` JSON { firstName, lastName, email, phone, message }
- [x] E. Careers generalForm + jobForm (careers.astro) — replaced `submitGeneral` and `submitJob` with POST `/api/apply`; splits `name` field on first space; maps email, phone, message/cover→resumeCoverNote; added TODO comment for resume file upload; skipped file in payload
- [x] F. Removed `bookId`/`referralId` from ModalForms.astro Props interface and BaseLayout.astro prop passthrough
- [x] G. Removed all Formspree env vars from `.env.example` (root + apps/web)
- [x] H. Build passed — 19 routes, 0 errors; `grep -ri "formspree" dist/` → zero results; `grep -ri "formspree" src/` → zero results

### Session Review — 2026-05-20 (Wire forms to HubSpot endpoints)

**What was built:** All 5 form submission handlers replaced. Every form now sends `Content-Type: application/json` POST to a `/api/*` endpoint. All existing validation, loading states, success/error UI preserved verbatim.

**Files changed:**

- `apps/web/src/components/ui/Footer.astro` — added `name="email"` to input; new fetch to `/api/newsletter`
- `apps/web/src/components/blog/NewsletterBlock.astro` — same as Footer
- `apps/web/src/components/ui/ModalForms.astro` — removed `bookId`/`referralId` props + `data-form-id` attrs; rewrote `handleSubmit` to build JSON payloads for both book and refer branches
- `apps/web/src/layouts/BaseLayout.astro` — removed `bookId`/`referralId` prop passthrough to ModalForms
- `apps/web/src/pages/contact.astro` — removed `contactId` var; removed `data-formspree-id` attribute; replaced `handleContactSubmit`
- `apps/web/src/pages/careers.astro` — replaced `submitJob` and `submitGeneral` with `/api/apply` JSON handlers
- `.env.example` (root) — removed `PUBLIC_FORMSPREE_CONTACT_ID`
- `apps/web/.env.example` — removed all 4 Formspree form ID vars

**Field mapping notes:**

- Newsletter: `firstName: ''` (no first name field exists)
- Facility Referral: `facilityPhone: ''` (no facility phone in form); single `name` field split on first space into firstName/lastName
- Careers: same name-split logic; `cover` field (jobForm) and `message` field (generalForm) both map to `resumeCoverNote`; resume file skipped with TODO comment

**Verification:** `pnpm --filter web build` PASS — 19 routes, 0 errors. `grep -ri "formspree"` in both `dist/` and `src/` → zero results.

**Issues:** None. No user corrections this session.

---

### Fix /api/referral 405 — Convert Pages Function to Astro server endpoint — 2026-05-20 [x] COMPLETE 2026-05-20

`/api/referral` was returning 405 in production. Root cause: `@astrojs/cloudflare` adapter generates `dist/server/entry.mjs` (a Worker), and when Cloudflare Pages sees a Worker, the `functions/` directory is bypassed entirely. The Worker had no route for `/api/referral`.

- [x] A. Diagnosed root cause: Worker from Cloudflare adapter takes over all routing; `functions/api/referral.ts` (Pages Function) was dead code
- [x] B. Created `apps/web/src/pages/api/referral.ts` — Astro server endpoint with `export const prerender = false`, `POST: APIRoute`, `OPTIONS: APIRoute`; env via `import { env } from 'cloudflare:workers'`
- [x] C. Confirmed `cloudflare:workers` import builds successfully (no fallback needed)
- [x] D. Verified `dist/server/chunks/referral_*.mjs` exists — handler is in the Worker bundle
- [x] E. Deleted `apps/web/functions/api/referral.ts` and empty `functions/api/` + `functions/` directories
- [x] F. Confirmed `resident-referral.astro` already fetches `/api/referral` — no change needed
- [x] G. `pnpm --filter web build` — PASSED (20 routes, 0 errors)

### Session Review — 2026-05-20 (Fix /api/referral 405)

**Root cause:** The `@astrojs/cloudflare` adapter (even in `output: 'static'` mode) compiles the site into a Cloudflare Worker (`dist/server/entry.mjs`). Cloudflare Pages has a hard rule: when a Worker is present (`_worker.js` pattern), Pages Functions (`functions/` directory) are bypassed. The Worker served static assets from `dist/client/` but had no route for `/api/referral`, producing 405.

**Fix:** Moved the handler from `functions/api/referral.ts` (Pages Functions format) to `src/pages/api/referral.ts` (Astro server endpoint format). The Astro Cloudflare adapter compiles this file into the Worker bundle, making it reachable as `/api/referral`.

**Env var access:** `import { env } from 'cloudflare:workers'` built cleanly — no fallback to `locals.runtime.env` was needed.

**Files changed:**

- `apps/web/src/pages/api/referral.ts` (new) — Astro server endpoint; identical HubSpot 6-step logic; `POST: APIRoute` + `OPTIONS: APIRoute`; `prerender = false`
- `apps/web/functions/api/referral.ts` (deleted)
- `apps/web/functions/api/` (deleted — empty)
- `apps/web/functions/` (deleted — empty)

**All business logic preserved verbatim:** company search/create, referrer upsert, patient upsert, guardian create, all 5 associations, CORS headers, per-step try/catch with step name in error response.

**Verification:** `pnpm --filter web build` PASS — 20 routes, 0 errors. `dist/server/chunks/referral_*.mjs` confirmed in server bundle with `HUBSPOT_BASE`, `HUBSPOT_SERVICE_KEY`, and all HubSpot endpoint URLs present. `functions/` directory confirmed deleted.

---

### Add draft persistence to resident referral form — 2026-05-20 [x] COMPLETE 2026-05-20

Persist all form field values to localStorage so a page refresh before submission restores the user's work.

- [x] A. Added `DRAFT_KEY`, `DRAFT_TTL`, `debounceTimer` vars after `selectedFiles` declaration
- [x] B. Added `saveDraft()` — 500ms debounce; reads 12 text/tel/email/textarea fields + checked skilledNursing radio; writes `{ ts, fields }` JSON to `localStorage`
- [x] C. Added `clearDraft()` — removes key; try/catch guarded
- [x] D. Added `restoreDraft()` — reads draft on load; evicts if `> 1h` old; populates all 12 inputs and matching radio
- [x] E. Attached `input` listeners to all 12 text/email/tel/textarea fields; `change` listeners to both radio inputs
- [x] F. Called `restoreDraft()` at init; `clearDraft()` on successful submission (before hiding form)
- [x] G. Not persisted: `docUpload` (file), `hipaaConsent` (checkbox — user must re-consent each session)
- [x] H. `pnpm --filter web build` — PASSED (20 routes, 0 errors); all 7 symbols confirmed in `dist/client/resident-referral/index.html`

### Session Review — 2026-05-20 (Draft persistence)

**What was built:** localStorage draft persistence for the resident referral form. All changes are inside the existing `<script is:inline>` block — no new files created.

**Files changed:**

- `apps/web/src/pages/resident-referral.astro` — 3 targeted edits to the inline script only; no HTML, CSS, or form structure changed

**Implementation details:**

| Concern          | Detail                                                                                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Storage key      | `byt_referral_draft`                                                                                                                                                                                                          |
| TTL              | 1 hour (`Date.now() - draft.ts > 3600000`)                                                                                                                                                                                    |
| Debounce         | 500ms via `clearTimeout` / `setTimeout`                                                                                                                                                                                       |
| Fields persisted | facilityName, facilityPhone, referrerFirstName, referrerLastName, referrerEmail, referrerPhone, patientFirstName, patientLastName, guardianFirstName, guardianLastName, guardianPhone, referralReason, skilledNursing (radio) |
| Fields excluded  | docUpload (can't serialize files), hipaaConsent (re-consent required each session)                                                                                                                                            |
| Restore trigger  | Immediately at script init, before validation/submit setup                                                                                                                                                                    |
| Clear trigger    | First line of success handler, before `form.hidden = true`                                                                                                                                                                    |

**Stale draft handling:** If `ts` is missing or draft is unparseable, function returns silently. If older than 1h, `clearDraft()` is called and function returns — no partial restore.

**Verification:** Build PASS — 20 routes, 0 errors. Grep confirmed all 7 symbols (`DRAFT_KEY`, `DRAFT_TTL`, `saveDraft`, `clearDraft`, `restoreDraft`, `PERSIST_IDS`, `debounceTimer`) present in `dist/client/resident-referral/index.html` at expected lines.

**Issues:** None. No user corrections this session.

---

### Remove Cloudflare adapter → static output + Pages Function referral — 2026-05-20 [x] COMPLETE 2026-05-20 14:10

Context: Previous session added the Cloudflare adapter to route `/api/referral` via a Worker. New plan (Option D): remove the adapter entirely, run pure static output, and put the referral handler in `functions/api/referral.ts` (Cloudflare Pages Function). With no `_worker.js` present, Cloudflare Pages will serve Pages Functions from `functions/`.

- [x] A. STEP 1 — Edit `apps/web/astro.config.mjs`: remove adapter import + config, keep `output: 'static'`; also removed `studioBasePath`/`studioRouterHistory` (Sanity Studio embedded route requires `@astrojs/react` or SSR adapter — removed since Studio is separately deployed)
- [x] B. STEP 1 — Run `pnpm remove @astrojs/cloudflare --filter web`
- [x] C. STEP 2 — Edit `apps/web/src/middleware.ts`: remove `import { env } from 'cloudflare:workers'`; simplified to one-line passthrough
- [x] D. STEP 3 — Delete `apps/web/src/pages/api/referral.ts` and empty `api/` directory
- [x] E. STEP 4 — Create `functions/api/referral.ts` at repo root with Pages Function format + full HubSpot logic
- [x] F. STEP 5 — `resident-referral.astro` line 992 confirmed: `fetch('/api/referral', ...)` — no change needed
- [x] G. STEP 6 — `pnpm --filter web build` PASS — 19 routes, 0 errors, no `_worker.js`/`entry.mjs`/`server/` in dist/
- [x] H. Reported build results to Igor; Igor approved and said "Push"

### Session Review — 2026-05-20 (Remove adapter + Pages Function referral)

**What was built:** Removed `@astrojs/cloudflare` adapter entirely. Site now builds as pure static output. Referral handler moved from Astro server endpoint (`src/pages/api/referral.ts`) to Cloudflare Pages Function (`functions/api/referral.ts` at repo root). With no `_worker.js` in dist/, Cloudflare Pages will route `/api/referral` to the Pages Function.

**Files changed:**

- `apps/web/astro.config.mjs` — removed `import cloudflare` + `adapter: cloudflare()`; removed `studioBasePath` (Studio route requires `@astrojs/react` or SSR adapter; Studio is separately deployed)
- `apps/web/package.json` — `@astrojs/cloudflare` removed from dependencies
- `apps/web/src/middleware.ts` — removed `import { env } from 'cloudflare:workers'`; replaced 109-line Sanity redirect logic with a one-line passthrough (redirect logic required Cloudflare runtime; static output has no runtime)
- `apps/web/src/pages/api/referral.ts` — deleted (Astro server endpoint format; invalid without adapter)
- `functions/api/referral.ts` — created at repo root; `onRequestPost` + `onRequestOptions` in Pages Function format; full HubSpot 6-step logic preserved verbatim; `env.HUBSPOT_SERVICE_KEY` from `context.env`

**Side effect — `/admin` removed:** The embedded Sanity Studio at `/admin` is no longer served by the Astro site. Igor must use the external Sanity Studio URL. Route count: 20 → 19.

**Verification:** `pnpm --filter web build` PASS — 19 routes, 0 errors. `find dist/ -name "_worker.js" -o -name "entry.mjs"` → empty. `dist/server/` → does not exist. All 19 HTML files confirmed in `dist/`.

**Issues:** None. No user corrections this session.

---

### Add refer_source + website_form to all HubSpot contact creation calls — 2026-05-20 [x] COMPLETE 2026-05-20 (pre)

Add `refer_source: 'Website Form'` and `website_form: 'Refer Resident'` to every HubSpot contact property object in `functions/api/referral.ts`.

- [x] A. Added both properties to `referrerProps` (Step 2, line ~260)
- [x] B. Added both properties to `patientProps` (Step 3, line ~289)
- [x] C. Added both properties to `guardianProps` (Step 4, line ~313)

### Session Review — 2026-05-20 (refer_source + website_form)

**What was built:** Two new HubSpot contact properties added to all 3 contact creation points in `functions/api/referral.ts`. Every contact created by the referral form (referrer, patient, guardian) now sends `refer_source: "Website Form"` and `website_form: "Refer Resident"`.

**Files changed:**

- `functions/api/referral.ts` — 3 targeted edits to `referrerProps`, `patientProps`, `guardianProps`; no logic, no structure changed

**Verification:** Build check below. No user corrections this session.

---

### Archive todo.md + consolidate lessons.md — 2026-05-20 [x] COMPLETE 2026-05-20

Cleanup: archive 1823 lines of completed tasks from todo.md to todo-archive.md; reduce lessons.md from 25 to 23 lessons by removing Lesson 15 and merging Lessons 17+23.

- [x] A. Appended lines 28–1851 of todo.md (all completed tasks through 2026-05-19) to `tasks/todo-archive.md` with archive notice header
- [x] B. Rewrote `tasks/todo.md` to header + two 2026-05-20 tasks only (98 lines, down from 1923)
- [x] C. Removed Lesson 15 ("The tasks/ directory that counts is in the git repo") — key point absorbed into Lesson 22 (working directory)
- [x] D. Merged Lessons 17+23 into new Lesson 21 ("All verification claims require evidence — grep before reporting, no contradictions")
- [x] E. Renumbered all lessons — 23 total, continuous 1–23
- [x] F. Verified: `grep -c "^### [0-9]" tasks/lessons.md` → 23

### Session Review — 2026-05-20 (Cleanup)

**What changed:**

- `tasks/todo.md` — 1923 → 98 lines; only header + 3 completed task blocks remain
- `tasks/todo-archive.md` — 2625 → 4454 lines; 1829-line batch appended with date notice
- `tasks/lessons.md` — 254 → 244 lines; 25 → 23 lessons

**Consolidation rationale:**

- Lesson 15 removed: "The tasks/ directory that counts is in the git repo" — its core point ("never write to a stale clone's tasks/") is already covered by Lesson 22's "Stale clones — NEVER use" section and the RULE 0 working directory rule. Keeping both created redundancy without adding signal.
- Lessons 17+23 merged: both addressed the same failure mode (claiming a change is done without actual file evidence). Lesson 17 covered checklist contradictions; Lesson 23 covered grep-before-reporting. The merged Lesson 21 covers both angles: no contradictions AND grep proof required.

**Verification:** `wc -l` confirmed file sizes. `grep -c "^### [0-9]"` → 23 lessons exactly.

---

### Phase 7A Step 3.6 — Create schema.ts JSON-LD builder — 2026-05-20 [x] COMPLETE 2026-05-20 19:51

Create `apps/web/src/lib/schema.ts`: pure functions returning JSON-LD objects. No Sanity imports. Pages will import these functions and `JSON.stringify()` them into `<script type="application/ld+json">` tags.

- [x] A. Created `apps/web/src/lib/schema.ts` — `SITE_URL` and `ORG_ID` constants at top
- [x] B. `organizationSchema()` — MedicalOrganization with areaServed array, medicalSpecialty, availableService
- [x] C. `localBusinessSchema()` — LocalBusiness with priceRange
- [x] D. `websiteSchema()` — WebSite with potentialAction SearchAction
- [x] E. `homepageGraphSchema()` — `@context` + `@graph` wrapping all three above
- [x] F. `blogPostingSchema(post: BlogPostingInput)` — BlogPosting with mainEntityOfPage, optional image object, dateModified fallback
- [x] G. `jobPostingSchema(job: JobPostingInput)` — JobPosting with hiringOrganization ref, FL jobLocation, CONTRACTOR default
- [x] H. `faqPageSchema(items: FaqItem[])` — FAQPage with Question/Answer mainEntity array
- [x] I. TypeScript interfaces for all input types; `@context` on top-level objects only; undefined on optional fields
- [x] J. Build verified — 19 routes, 0 errors; all 7 grep checks passed

### Session Review — 2026-05-20 (Phase 7A Step 3.6 — schema.ts JSON-LD builder)

**What was built:** `apps/web/src/lib/schema.ts` — 7 pure exported functions returning plain JSON-LD objects. No Sanity imports, no side effects. All constants (`SITE_URL`, `ORG_ID`) defined at module level. TypeScript interfaces (`BlogPostingInput`, `JobPostingInput`, `FaqItem`) for all parameterized functions.

**Files changed:**

- `apps/web/src/lib/schema.ts` (new, 122 lines)

**Function inventory:**

| Function                  | Schema type         | `@context`            |
| ------------------------- | ------------------- | --------------------- |
| `organizationSchema()`    | MedicalOrganization | no (nested in @graph) |
| `localBusinessSchema()`   | LocalBusiness       | no (nested in @graph) |
| `websiteSchema()`         | WebSite             | no (nested in @graph) |
| `homepageGraphSchema()`   | @graph wrapper      | yes                   |
| `blogPostingSchema(post)` | BlogPosting         | yes                   |
| `jobPostingSchema(job)`   | JobPosting          | yes                   |
| `faqPageSchema(items)`    | FAQPage             | yes                   |

**Verification:** 7 exported functions confirmed (`grep -c "export function"` → 7). `MedicalOrganization`, `dateModified`, `mainEntityOfPage`, `FAQPage` all present. `pnpm --filter web build` PASS — 19 routes, 0 errors.

**Issues:** None. No user corrections this session.

---

### Phase 7A Step 3.4 — Add @astrojs/sitemap — 2026-05-20 [x] COMPLETE 2026-05-20

Install `@astrojs/sitemap` and configure it in `astro.config.mjs` with per-page priority overrides.

- [x] A. Ran `pnpm add @astrojs/sitemap` in `apps/web` — installed v3.7.2
- [x] B. Rewrote `apps/web/astro.config.mjs`: added `import sitemap from '@astrojs/sitemap'`; added `site` property using `import.meta.env?.PUBLIC_SITE_URL ?? 'https://getbetteryou.com'`; added sitemap integration with `serialize()` callback
- [x] C. Priority rules implemented: `/` → 1.0 weekly; `/communities/` `/patients/` `/providers/` → 0.9 weekly; `/about/` `/careers/` `/blog/` → 0.7 weekly; `/contact/` → 0.6 monthly; `/privacy/` `/terms/` → 0.5 monthly; blog posts default → 0.6 monthly
- [x] D. All existing config preserved: `output: 'static'`, `@sanity/astro` integration, `projectId`, `dataset`, `useCdn`
- [x] E. Build passed — 19 routes, 0 errors; `[@astrojs/sitemap] sitemap-index.xml created at dist`
- [x] F. Verified `sitemap-index.xml` points to `https://getbetteryou.com/sitemap-0.xml`
- [x] G. Verified `sitemap-0.xml` — all 19 URLs present with correct priorities and changefreq values

### Phase 7A Step 3.5 — CMS-driven robots.txt Astro endpoint — 2026-05-20 [x] COMPLETE 2026-05-20

Create an Astro static endpoint (`src/pages/robots.txt.ts`) that fetches `siteSettings.robotsTxt` from Sanity and serves it as `/robots.txt` with a Sitemap line auto-appended.

- [x] A. Pre-flight: confirmed no `apps/web/public/robots.txt` exists — no deletion needed
- [x] B. Pre-flight: confirmed Sanity client import pattern is `import { sanityClient } from 'sanity:client'`
- [x] C. Created `apps/web/src/pages/robots.txt.ts` — `GET: APIRoute` fetches `siteSettings.robotsTxt`, appends `Sitemap: {siteUrl}/sitemap-index.xml`, returns `text/plain`
- [x] D. `pnpm --filter web build` PASSED — 19 routes, `/robots.txt` generated in 3.20s
- [x] E. Verified `dist/robots.txt` — all AI crawler rules present + Sitemap line correct

### Session Review — 2026-05-20 (Phase 7A Step 3.5 — CMS-driven robots.txt)

**What was built:** One new file — `apps/web/src/pages/robots.txt.ts`. Astro static endpoint that reads `siteSettings.robotsTxt` from Sanity at build time and emits `dist/robots.txt`. Appends `\n\nSitemap: {PUBLIC_SITE_URL}/sitemap-index.xml` automatically. No static `public/robots.txt` existed, so no deletion was needed.

**Files changed:**

- `apps/web/src/pages/robots.txt.ts` (new, 10 lines)

**dist/robots.txt content verified:**

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Disallow: /

Sitemap: https://getbetteryou.com/sitemap-index.xml
```

**Verification:** `pnpm --filter web build` PASS — 19 routes, 0 errors. `dist/robots.txt` confirmed with all AI crawler rules and correct Sitemap line.

**Issues:** None. No user corrections this session.

---

### Phase 7A Step 3.7 — Create Breadcrumb.astro with Microdata — 2026-05-20 [x] COMPLETE 2026-05-20 19:58

Create `apps/web/src/components/ui/Breadcrumb.astro`: reusable breadcrumb component using HTML Microdata (not JSON-LD), wired to `<nav aria-label="Breadcrumb">`.

- [x] A. Created `apps/web/src/components/ui/Breadcrumb.astro`
- [x] B. Accepts `items: { label: string; href?: string }[]` prop
- [x] C. Renders `<ol itemscope itemtype="https://schema.org/BreadcrumbList">`
- [x] D. Each `<li>` has `itemprop="itemListElement"` + `itemtype="https://schema.org/ListItem"`
- [x] E. `<meta itemprop="position" content={String(position)}>` — 1-indexed
- [x] F. Last item renders as `<span>` with `aria-current="page"`, not a link
- [x] G. Scoped styles using existing CSS vars (`--navy`, `--slate`, `--mist`, `--color-teal`)
- [x] H. All 5 acceptance criteria greps passed; `pnpm --filter web build` PASS — 19 routes, 0 errors

### Session Review — 2026-05-20 (Phase 7A Step 3.7 — Breadcrumb.astro)

**What was built:** `apps/web/src/components/ui/Breadcrumb.astro` — 87 lines. Reusable breadcrumb component using Google-recommended HTML Microdata (not JSON-LD). Wraps in `<nav aria-label="Breadcrumb">`, renders `BreadcrumbList`/`ListItem` schema.org Microdata, 1-indexed position `<meta>` tags. Last item is non-linked `<span aria-current="page">`. Separator injected via CSS `::before` pseudo-element — no extra DOM nodes.

**Files changed:**

- `apps/web/src/components/ui/Breadcrumb.astro` (new, 87 lines)

**Acceptance criteria results:**

| Check             | Result                                           |
| ----------------- | ------------------------------------------------ |
| `itemscope` count | 2                                                |
| `itemprop` count  | 5                                                |
| `BreadcrumbList`  | `itemtype="https://schema.org/BreadcrumbList"` ✓ |
| `ListItem`        | `itemtype="https://schema.org/ListItem"` ✓       |
| `aria-label`      | `<nav aria-label="Breadcrumb">` ✓                |
| Build             | 19 routes, 0 errors ✓                            |

**Issues:** None. No user corrections this session.

---

### Phase 7A Step 3.8 — Create SanityImage.astro component — 2026-05-20 [x] COMPLETE 2026-05-20 20:26

Create `apps/web/src/components/ui/SanityImage.astro`: reusable image component with srcset, WebP via Sanity URL params, CLS prevention, and hero/lazy loading modes.

- [x] A. Created `apps/web/src/components/ui/SanityImage.astro`
- [x] B. Props: `src` (string | `{ url }` | `{ asset: { url } }`), `alt` (required), `width`, `height`, `loading`, `fetchpriority`, `decoding`, `sizes`, `class`
- [x] C. Generates srcset at 400w, 800w, 1200w using `?w=X&fm=webp&fit=crop`
- [x] D. `width` and `height` always output as attributes (CLS prevention)
- [x] E. Hero mode: `fetchpriority="high"` forces `loading="eager"` automatically
- [x] F. Default mode: `loading="lazy"`, `decoding="async"`
- [x] G. Outputs bare `<img>` tag — no `<picture>` wrapper
- [x] H. All 5 acceptance criteria greps passed; `pnpm --filter web build` PASS — 19 routes, 0 errors

### Session Review — 2026-05-20 (Phase 7A Step 3.8 — SanityImage.astro)

**What was built:** `apps/web/src/components/ui/SanityImage.astro` — 52 lines. Reusable image component that accepts a Sanity URL string or asset object, generates a 3-stop srcset at 400w/800w/1200w using Sanity URL transform params (`?w=X&fm=webp&fit=crop`), and always emits `width`/`height` attributes for CLS prevention. Hero images are detected by `fetchpriority="high"` and automatically switch to `loading="eager"`.

**Files changed:**

- `apps/web/src/components/ui/SanityImage.astro` (new, 52 lines)

**Acceptance criteria results:**

| Check                                | Result                |
| ------------------------------------ | --------------------- |
| `srcset` present                     | ✓                     |
| `fm=webp` in srcset entries          | ✓                     |
| `fetchpriority` prop + attribute     | ✓                     |
| `loading` prop + hero override logic | ✓                     |
| `decoding` prop + attribute          | ✓                     |
| `width`/`height` as attributes       | ✓                     |
| Build                                | 19 routes, 0 errors ✓ |

**Issues:** None. No user corrections this session.

---

### Session Review — 2026-05-20 (Phase 7A Step 3.4 — Sitemap integration)

**What was built:** `@astrojs/sitemap` v3.7.2 installed and wired into `astro.config.mjs`. The `serialize()` callback applies priority overrides by path suffix. Named constants used for all priority values (`PRIORITY_HIGH`, `PRIORITY_NORMAL`, `PRIORITY_LOW`, `PRIORITY_LEGAL`) and path arrays (`HIGH_PRIORITY_PATHS`, `NORMAL_PRIORITY_PATHS`).

**Files changed:**

- `apps/web/astro.config.mjs` — added sitemap import + `site` property + sitemap integration (file grew from 13 → 52 lines)
- `apps/web/package.json` — `@astrojs/sitemap ^3.7.2` added to dependencies
- `apps/web/pnpm-lock.yaml` — lockfile updated

**Sitemap output verified:**

| URL                                    | priority | changefreq |
| -------------------------------------- | -------- | ---------- |
| /                                      | 1.0      | weekly     |
| /communities/, /patients/, /providers/ | 0.9      | weekly     |
| /about/, /careers/, /blog/             | 0.7      | weekly     |
| /contact/, blog posts                  | 0.6      | monthly    |
| /privacy/, /terms/                     | 0.5      | monthly    |

**Verification:** `pnpm --filter web build` PASS — 19 routes, 0 errors. `dist/sitemap-index.xml` confirmed. `dist/sitemap-0.xml` confirmed with all 19 URLs + correct priority/changefreq per spec.

**Issues:** None. No user corrections this session.
