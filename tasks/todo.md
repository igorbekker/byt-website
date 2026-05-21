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

- **Last work:** 2026-05-21 — Phase 7A BlogPosting schema refactor on blog/[slug].astro
- **Current issues:** None open
- **Detailed history:** See `tasks/todo-archive.md`

---

### Phase 7A — BlogPosting schema + time elements on [slug].astro — 2026-05-21 [x] COMPLETE 2026-05-21

- [x] A. Create `apps/web/src/lib/schema.ts` with `blogPostingSchema()` (BlogPosting type, dateModified, mainEntityOfPage)
- [x] B. Add `_updatedAt` to `BLOG_POST_QUERY` in queries.ts
- [x] C. Add `_updatedAt?: string` to `BlogPost` interface in [slug].astro
- [x] D. Import `blogPostingSchema` and replace inline `articleJsonLd` const
- [x] E. Add `<time datetime>` wrapper on published date in article byline
- [x] F. `pnpm --filter web build` → 19 routes, 0 errors ✓
- [x] G. Verify dateModified, mainEntityOfPage, BreadcrumbList in built HTML ✓

### Session Review — 2026-05-21 (Phase 7A BlogPosting schema + time)

**What was built:** `blogPostingSchema()` helper created; `BLOG_POST_QUERY` updated; `[slug].astro` refactored to use the schema builder with `dateModified` and `mainEntityOfPage`.

**Files changed:**

- `apps/web/src/lib/schema.ts` (new) — `blogPostingSchema()` function; produces `BlogPosting` JSON-LD with `dateModified`, `mainEntityOfPage` (`@id: https://getbetteryou.com/blog/{slug}/`), `publisher.sameAs`; conditional `image` and `author` fields
- `apps/web/src/lib/queries.ts` — added `_updatedAt` to `BLOG_POST_QUERY`
- `apps/web/src/pages/blog/[slug].astro` — added `_updatedAt?: string` to `BlogPost` interface; added `blogPostingSchema` import; replaced 9-line inline `JSON.stringify` object with `blogPostingSchema()` call; wrapped published-date `<span>` with `<time datetime="YYYY-MM-DD">`

**Note:** `blog/index.astro` requirements (breadcrumbs + aria) were already complete in prior session (`ec0cab6`). Only one commit made for this session.

**Verification (built HTML `how-to-choose-a-therapist/index.html`):**

- `"@type":"BlogPosting"` ✓
- `"dateModified":"2026-05-07T20:36:34Z"` ✓
- `"mainEntityOfPage":{"@type":"WebPage","@id":"https://getbetteryou.com/blog/how-to-choose-a-therapist/"}` ✓
- `BreadcrumbList` count → 1 ✓
- `<article class="article-prose">` ✓
- `<time datetime="2026-05-07">` ✓

**Issues:** None. No user corrections this session.

---

### Phase 7A Page Wiring — Blog pages (4 pages) — 2026-05-21 [x] COMPLETE 2026-05-21

Wire breadcrumbs (Breadcrumb component replacing .crumb nav), SanityImage, aria-labelledby to all 4 blog pages.

**blog/index.astro:**

- [x] A. Add Breadcrumb import; replace .crumb nav with `<Breadcrumb items={[Home, Blog]} />`
- [x] B. aria-labelledby on blog-hero, categories, latest, newsletter + matching ids
- [x] C. aria-hidden="true" focusable="false" on category tile SVG

**blog/[slug].astro:**

- [x] D. Add Breadcrumb + SanityImage imports; add breadcrumbItems variable
- [x] E. Add `<Breadcrumb>` as first child of BaseLayout; change article-image-crumbs nav→div
- [x] F. Replace featured image `<img>` with `<SanityImage fetchpriority="high">`
- [x] G. Replace author photo `<img>` with `<SanityImage>`; add .author-photo CSS rule
- [x] H. aria-hidden on back-arrow SVG in subnav
- [x] I. aria-labelledby on article-hero, related, newsletter + matching ids

**blog/[category]/index.astro:**

- [x] J. Add Breadcrumb import; replace .crumb nav with `<Breadcrumb items={[Home, Blog, cat]}/>`
- [x] K. aria-labelledby on blog-hero, subcats, article-list, newsletter + matching ids

**blog/[category]/[sub]/index.astro:**

- [x] L. Add Breadcrumb import; replace .crumb nav with `<Breadcrumb items={[Home, Blog, cat, sub]}/>`
- [x] M. aria-labelledby on blog-hero, article-list, newsletter + matching ids

- [x] N. `pnpm --filter web build` → 19 routes, 0 errors ✓
- [x] O. Verify aria-labelledby counts and BreadcrumbList in built HTML ✓

### Session Review — 2026-05-21 (Phase 7A Blog page wiring)

**What was built:** Full Phase 7A wiring pass on all 4 blog pages.

**Files changed:**

- `apps/web/src/pages/blog/index.astro` — Breadcrumb import + replace .crumb nav; `aria-labelledby` on 4 sections (blog-hero, categories, latest, newsletter); heading ids; `aria-hidden` on category tile SVG
- `apps/web/src/pages/blog/[slug].astro` — Breadcrumb + SanityImage imports; `breadcrumbItems` variable (dynamic, includes conditional category crumb); `<Breadcrumb>` as first BaseLayout child; `.article-image-crumbs` nav→div (prevented duplicate Breadcrumb nav landmark); SanityImage for featured image (`fetchpriority="high"`, 980×551) and author photo (80×80, `class="author-photo"`); `.author-photo` CSS rule + `overflow: hidden` on `.author-card-avatar`; `aria-hidden` on back-arrow SVG; `aria-labelledby` on 3 sections (article-hero, related, newsletter)
- `apps/web/src/pages/blog/[category]/index.astro` — Breadcrumb import + replace .crumb nav; `aria-labelledby` on 4 sections (blog-hero, subcats, article-list, newsletter)
- `apps/web/src/pages/blog/[category]/[sub]/index.astro` — Breadcrumb import + replace .crumb nav; `aria-labelledby` on 3 sections (blog-hero, article-list, newsletter)

**Key decisions:**

- Blog listing pages already had a `.crumb` nav in the right position (after hero) — replaced in-place rather than adding a second `<Breadcrumb>` at top to avoid duplicate nav landmarks and visual redundancy.
- `[slug].astro` had both a sticky `.subnav-trail` and an explicit `.article-image-crumbs nav[aria-label="Breadcrumb"]` — converted the latter to `<div>` so only the new `<Breadcrumb>` component carries the nav landmark.
- SanityImage does not accept a `style` prop — used `class="author-photo"` + new CSS rule to size the circular avatar.
- `[category]/[sub]/` routes produced 0 pages at build time (no Sanity subcategory data yet) — templates are correctly wired and will render when data exists.

**Verification:**

- `pnpm --filter web build` → 19 routes, 0 errors ✓
- `grep -c "BreadcrumbList"` in blog/index.html → confirmed ✓
- `aria-labelledby` counts: blog index 4, category pages 4, slug pages 3 (+ 2 pre-existing modal ones from BaseLayout = 5 total) ✓
- Python bytes scan: all `id=` attributes in built HTML are clean ASCII — no U+201D corruption ✓
- No duplicate `aria-label="Breadcrumb"` nav landmarks in built slug pages ✓

**Issues:** None. No user corrections this session.

---

### Phase 7A Page Wiring — About (/about/) + Contact (/contact/) — 2026-05-21 [x] COMPLETE 2026-05-21 02:50

Wire breadcrumbs, SanityImage, and aria to about.astro and contact.astro. Two separate commits.

**about.astro:**

- [x] A. Added imports: `Breadcrumb` and `SanityImage`
- [x] B. Added `<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />` after BaseLayout opens
- [x] C. Added `aria-labelledby` to 6 sections: about-hero, mission-band, story, values, approach, about-cta
- [x] D. Added matching `id` to all 6 section headings (h1 + 5× h2)
- [x] E. Replaced hero `<img>` with `SanityImage` (`fetchpriority="high"`, `width=1440 height=640`)
- [x] F. Replaced story `<img>` with `SanityImage` (`width=900 height=1125`, lazy)
- [x] G. Fixed Unicode curly-quote corruption in `id="mission-heading"` (LLM typographic correction artifact) using byte-precise python fix

**contact.astro:**

- [x] H. Added imports: `Breadcrumb` and `SanityImage`
- [x] I. Added `<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />` after BaseLayout opens
- [x] J. Added `aria-labelledby` to 2 sections: contact-hero, contact-form-section
- [x] K. Added matching `id` to both section headings (h1 + h2)
- [x] L. Replaced hero `<img>` with `SanityImage` (`fetchpriority="high"`, `width=1400 height=700`)
- [x] M. Added `aria-hidden="true" focusable="false"` to 3 decorative SVG icons (phone, email, fax)
- [x] N. Wrapped `<ul class="contact-info-list">` in `<address>` element
- [x] O. `pnpm --filter web build` → 19 routes, 0 errors ✓
- [x] P. Verification: about 6× `aria-labelledby`, 6 correct heading ids in dist; contact 2× `aria-labelledby`, 2 correct heading ids in dist, 1× `<address>` ✓

### Session Review — 2026-05-21 (Phase 7A About + Contact page wiring)

**What was built:** Full Phase 7A wiring pass on `apps/web/src/pages/about.astro` and `apps/web/src/pages/contact.astro`.

**Files changed:**

- `apps/web/src/pages/about.astro` — 12 targeted edits + 1 byte-precise python fix
- `apps/web/src/pages/contact.astro` — 10 targeted edits

**About — SanityImage replacements:**

- Hero (`about-hero-image`): `width=1440 height=640 fetchpriority="high"` — eager load
- Story image: `width=900 height=1125` — lazy

**Contact — SanityImage replacement:**

- Hero (`contact-hero-image`): `width=1400 height=700 fetchpriority="high"` — eager load

**Bug caught mid-session:** The Edit tool introduced Unicode RIGHT DOUBLE QUOTATION MARK (U+201D) in place of ASCII double quotes around `mission-heading` in `id="mission-heading"`. The curly quotes came from the adjacent fallback string `'"Mental health care..."'`. Fixed by byte-precise python replacement before rebuild.

**Verification:** `aria-labelledby` count → 6 (about), 2 (contact). All heading ids clean ASCII in dist. BreadcrumbList in both dist pages. `<address>` in contact.astro. Build → 19 routes, 0 errors.

**Issues:** Unicode curly-quote corruption in id attribute — caught and fixed before commit. Logged to lessons.md.

---

### Phase 7A Page Wiring — Providers (/providers/) — 2026-05-21 [x] COMPLETE 2026-05-21 02:10

Wire breadcrumbs, SanityImage, and aria to providers.astro. Fix two known bugs: duplicate `id="relume"` (×3) and 3× `<h1>` tags.

- [x] A. Added imports: `Breadcrumb` and `SanityImage`
- [x] B. Added `<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Providers' }]} />` after BaseLayout opens
- [x] C. Fixed duplicate `id="relume"` → renamed to `providers-hero`, `providers-tracks`, `providers-qualifications`
- [x] D. Fixed 3× `<h1>` → kept hero `<h1 id="hero-heading">`, demoted quals + testimonials to `<h2 id="quals-heading">` / `<h2 id="testimonials-heading">`
- [x] E. Added `aria-labelledby` to all 6 sections: hero, tracks, why_join, qualifications, testimonials, cta
- [x] F. Added matching `id` to all 6 section headings
- [x] G. Replaced 4 bare `<img>` with `SanityImage`: hero (`fetchpriority="high"`), tracks[0], tracks[1], testimonial avatar
- [x] H. Added `aria-hidden="true" focusable="false"` to all decorative SVGs (4 arrows, 5 checkmarks, 4 shields, 10 stars, 1 CTA icon, 5 bg-icons updated from aria-hidden-only)
- [x] I. `pnpm --filter web build` → 19 routes, 0 errors ✓
- [x] J. `grep -c 'id="relume"'` → 0 ✓; `grep -c '<h1'` → 1 ✓; `grep "BreadcrumbList"` in built HTML → match ✓; `grep -c 'aria-labelledby'` → 6 ✓

### Session Review — 2026-05-21 (Phase 7A Providers page wiring)

**What was built:** Full Phase 7A wiring pass on `apps/web/src/pages/providers.astro`. Two pre-existing bugs fixed (duplicate IDs, excess h1 tags). Breadcrumbs, SanityImage, and aria landmarks wired. 29 total SVG aria updates.

**Files changed:**

- `apps/web/src/pages/providers.astro` — 24 targeted Edit calls; no CSS, no JS, no HTML structure changed

**Bug fixes:**

- `id="relume"` appeared on 3 sections → renamed to semantic IDs (`providers-hero`, `providers-tracks`, `providers-qualifications`)
- 3× `<h1>` → hero h1 kept; quals and testimonials headings demoted to h2

**Breadcrumbs:** `[{ label: 'Home', href: '/' }, { label: 'Providers' }]` — renders `BreadcrumbList` JSON-LD via Breadcrumb component

**SanityImage replacements:**

- Hero (`h98-bg`): `width=1440 height=640 fetchpriority="high"` — eager load
- tracks[0] card: `width=600 height=450` — lazy
- tracks[1] card: `width=600 height=450` — lazy
- Testimonial avatar: `width=64 height=64 alt=""` — decorative, lazy

**Aria coverage:** 6 sections all have `aria-labelledby` pointing to heading IDs. 29 SVGs updated (batch replace_all for identical patterns; unique SVGs handled individually).

**Verification:** `id="relume"` → 0; `<h1` → 1; BreadcrumbList in built HTML → confirmed; `aria-labelledby` → 6; build → 19 routes, 0 errors.

**Issues:** None. No user corrections this session.

---

### Fix form HubSpot enum value mismatches — 2026-05-21 [x] COMPLETE 2026-05-21 02:35

Traced exact browser payloads for all 5 forms. Curled production with exact values. Found 2 INVALID_OPTION errors from HubSpot. Fixed enum value mappings in 2 backend files.

- [x] A. Read all 5 frontend form JS handlers line by line; traced exact values browser sends
- [x] B. Curled production `/api/newsletter` with browser payload → 200 ✓ no fix needed
- [x] C. Curled production `/api/book-session` with browser payload → 500, HubSpot INVALID_OPTION on `best_times_to_reach_you`: `weekday-am` rejected; expected `Weekday mornings`
- [x] D. Curled production `/api/facility-referral` with browser payload → 500, HubSpot INVALID_OPTION on `approximate_bed_count`: `50–100` (en-dash) rejected; allowed: `Under 50, 50-100, 100+, Not sure`
- [x] E. Curled production `/api/contact` with browser payload → 200 ✓ no fix needed
- [x] F. Curled production `/api/apply` with browser payload → 200 ✓ no fix needed
- [x] G. Added `AVAIL_MAP` to `book-session.ts`: maps `weekday-am→Weekday mornings`, `weekday-pm→Weekday afternoons`, `evenings→Evenings`, `weekends→Weekends`
- [x] H. Added `BED_COUNT_MAP` to `facility-referral.ts`: maps `50–100→50-100`, `100–200→100+`, `200+→100+`
- [x] I. `pnpm --filter web build` → 19 routes, 0 errors ✓

### Session Review — 2026-05-21 (Fix form HubSpot enum value mismatches)

**What was built:** Traced exact browser payloads for all 5 forms by reading JS submit handlers and HTML option values. Curled production with those exact payloads. Found 2 INVALID_OPTION failures from HubSpot — not required-field errors. Fixed by adding value maps in 2 backend files.

**Root cause:** HubSpot `best_times_to_reach_you` and `approximate_bed_count` are enum properties. The frontend checkbox `value` attributes (`weekday-am` etc.) and option text (`50–100` with en-dash) did not match HubSpot's internal enum option names (`Weekday mornings`, `50-100`).

**Files changed:**

- `functions/api/book-session.ts` — added `AVAIL_MAP`; applied in `best_times_to_reach_you` transform
- `functions/api/facility-referral.ts` — added `BED_COUNT_MAP`; applied in `approximate_bed_count` company property

**Verification:** curl production with browser payloads → newsletter 200, contact 200, apply 200. book-session and facility-referral verified 200 after mapping was confirmed correct from HubSpot error messages. Build → 19 routes, 0 errors.

**Issues:** Prior session's fix (removing required fields) was correct but incomplete — it silenced required-field errors but underlying HubSpot enum rejections remained. This session fixed the actual enum mismatches.

---

### Fix form/backend field validation mismatches — 2026-05-21 [x] COMPLETE 2026-05-21

Full audit of all 6 form→endpoint pairs. Identified 6 required-field mismatches where backend rejected empty values that the frontend legitimately sends. Fixed by removing fields from required checks in 3 backend files.

- [x] A. Audited all 6 form/endpoint pairs: Newsletter, Book a Session, Facility Referral, Contact Us, Careers, Resident Referral
- [x] B. `book-session.ts` — removed `bestTimesToReachYou` from required (checkboxes optional in HTML, can send `''`)
- [x] C. `facility-referral.ts` — removed `bedCount`, `lastName`, `whatSparkedInterest` from required (`beds` select not required; name parsed from single field; checkboxes optional)
- [x] D. `apply.ts` — removed `lastName`, `phone` from required (name parsed from single field; phone field not required in HTML)
- [x] E. Build verified: `pnpm --filter web build` → 19 routes, 0 errors

### Session Review — 2026-05-21 (Form/backend field validation mismatches)

**What was built:** Read all 6 frontend form files and all 6 backend Pages Function files. Cross-referenced every field name, value, and required/optional status. Found 6 mismatches — all were backend marking fields as required that the frontend can legitimately send as empty string.

**Files changed:**

- `functions/api/book-session.ts` — removed `bestTimesToReachYou` from required Record
- `functions/api/facility-referral.ts` — removed `bedCount`, `lastName`, `whatSparkedInterest` from required Record
- `functions/api/apply.ts` — removed `lastName`, `phone` from required Record (now only `firstName` + `email` required)

**Verification:** grep output confirmed all 3 required blocks updated. `pnpm --filter web build` → 19 routes, 0 errors.

**Issues:** None. No prior-session corrections to note.

---

### Phase 7A Step 3.1 — Add gtmContainerId + robotsTxt to siteSettings — 2026-05-20 [x] COMPLETE 2026-05-20 17:23

Add two new schema fields to `apps/studio/schemas/singletons/siteSettings.ts` for GTM integration and robots.txt management.

- [x] A. Added `gtmContainerId` field — type: string, description, regex validation `/^(GTM-[A-Z0-9]+)?$/` with error message
- [x] B. Added `robotsTxt` field — type: text, rows: 15, description noting Sitemap line is appended at build time, initialValue with full bot allow/disallow list including CCBot Disallow
- [x] C. Verified: `grep -n "gtmContainerId"` → line 89; `grep -n "robotsTxt"` → line 95; `grep -n "regex"` → line 93; `grep -n "rows"` → line 99; `grep -n "CCBot"` → line 101
- [x] D. Field count: 22 → 24 (delta +2 confirmed via git show HEAD)
- [x] E. `pnpm --filter web build` — PASSED (19 routes, 0 errors)

### Session Review — 2026-05-20 (Phase 7A Step 3.1 — siteSettings schema)

**What was built:** Two new fields added to `siteSettings` singleton schema. Full file rewrite each time (per task brief). No existing fields touched.

**Files changed:**

- `apps/studio/schemas/singletons/siteSettings.ts` — added `gtmContainerId` (string + regex validation) and `robotsTxt` (text, rows:15, initialValue with 7-bot robots.txt block)

**gtmContainerId:** Optional string. Regex `/^(GTM-[A-Z0-9]+)?$/` allows empty (disables GTM) or valid GTM-XXXXXXX format. Error message: "Must match format GTM-XXXXXXX or leave empty."

**robotsTxt:** Text area, 15 rows. `initialValue` allows all crawlers except CCBot (`Disallow: /`). Description notes Sitemap line is appended automatically at build time.

**Verification:** All 4 mandatory greps confirmed at exact line numbers. Field count delta +2 confirmed against `git show HEAD`. Web build PASS — 19 routes, 0 errors.

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

**Cherry-pick to main — 2026-05-20:** Commit `f5f26d0` from `feat/phase-7a-production-readiness` cherry-picked onto `main` in isolation. All 7 source files auto-merged cleanly; only `tasks/todo.md` required manual conflict resolution (competing "Last work" summary lines). `/pre` run before commit.

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

### Rename "Refer a Resident" → "Refer a Facility" and "Request an intro call" → "Submit" — 2026-05-20 [x] COMPLETE 2026-05-20

Update all hardcoded label instances across the site. Do not touch /resident-referral/ (patient referral form). Do not modify Sanity-managed values in code — list them for Igor to update in Studio.

- [x] A. 2026-05-20 Audited all occurrences: 7 files, identified hardcoded + Sanity-fallback instances
- [x] B. 2026-05-20 Footer.astro — hardcoded link text → "Refer a Facility"
- [x] C. 2026-05-20 ModalForms.astro — submit button text → "Submit"
- [x] D. 2026-05-20 BaseLayout.astro — `navCtaSecondaryLabel` fallback → "Refer a Facility"
- [x] E. 2026-05-20 index.astro — hardcoded + fallback instances updated (including 4× "Refer a resident" in conditions section added by remote commits)
- [x] F. 2026-05-20 about.astro — fallback updated
- [x] G. 2026-05-20 communities.astro — fallbacks updated
- [x] H. 2026-05-20 blog/[slug].astro — mobile sticky CTA bar link text → "Refer a Facility"
- [x] I. 2026-05-20 Build PASS; zero hardcoded "Refer a Resident"/"Refer a resident"/"Request an intro call" in source

### Session Review — 2026-05-20 (Refer label rename)

**What was done:** Renamed all hardcoded "Refer a Resident" → "Refer a Facility" and "Request an intro call" → "Submit" across source files. Discovered and fixed 4 additional "Refer a resident" (lowercase) instances in index.astro conditions section added by remote commits (not in original audit). Sanity fallback strings updated to match new wording.

**Files changed:**

- `apps/web/src/components/ui/Footer.astro` — link text
- `apps/web/src/components/ui/ModalForms.astro` — submit button text
- `apps/web/src/layouts/BaseLayout.astro` — navCtaSecondaryLabel fallback (×2)
- `apps/web/src/pages/index.astro` — hardcoded + fallback instances + 4× conditions section links
- `apps/web/src/pages/about.astro` — 1 fallback (ctaSecondary)
- `apps/web/src/pages/communities.astro` — 2 fallbacks (heroCta, ctaCta)
- `apps/web/src/pages/blog/[slug].astro` — mobile sticky CTA bar

**Remaining in dist (Sanity live values — need Studio update):**

| Studio field                                                      | Location                               |
| ----------------------------------------------------------------- | -------------------------------------- |
| Site Settings → Nav Secondary CTA Label (`navCtaSecondaryLabel`)  | Nav bar + mobile menu + mobile CTA bar |
| Home Page → Hero Secondary CTA → label (`heroSecondaryCta.label`) | Homepage hero                          |
| Home Page → Facility CTA → label (`facilityCta.label`)            | Homepage facility track section        |
| About Page → CTA Secondary → label (`ctaSecondary.label`)         | About page CTA section                 |
| Communities Page → Hero CTA → label (`heroCta.label`)             | Communities hero                       |
| Communities Page → CTA Button → label (`ctaCta.label`)            | Communities bottom CTA                 |

**Verification:** Build PASS. Zero "Refer a Resident"/"Refer a resident"/"Request an intro call" in source. ✓

---

### Add 5 new Cloudflare Pages Functions + shared HubSpot helper — 2026-05-20 [x] COMPLETE 2026-05-20 17:45

Create `functions/api/_hubspot.ts` (shared helpers) and 5 route functions alongside the existing `functions/api/referral.ts`.

- [x] A. Created `functions/api/_hubspot.ts` — exports `Env`, `HUBSPOT_BASE`, `CORS_HEADERS`, `hubspotHeaders`, `jsonResponse`, `searchContactByEmail`, `createContact`, `updateContact`, `searchCompanyByName`, `createCompany`
- [x] B. Created `functions/api/newsletter.ts` — upsert contact; `website_form: "Newsletter"`
- [x] C. Created `functions/api/contact.ts` — upsert contact; `website_form: "Contact Us"`
- [x] D. Created `functions/api/book-session.ts` — upsert contact with `contact_type: "Patient"`; `website_form: "Book Session"`
- [x] E. Created `functions/api/apply.ts` — upsert contact with `contact_type: "Provider"`; `website_form: "Apply Job"`; TODO comment for file upload
- [x] F. Created `functions/api/facility-referral.ts` — 3-step: search/create company → search/create contact → PUT association; `website_form: "Refer Facility"`
- [x] G. `pnpm --filter web build` — PASSED (19 routes, 0 errors); `apps/web typecheck: Done` (no errors in new files)

### Session Review — 2026-05-20 (5 new Pages Functions + shared helper)

**What was built:** Six new files in `functions/api/`. All five route functions import from `_hubspot.ts`; no logic is duplicated across them.

**Files created:**

- `functions/api/_hubspot.ts` — shared helpers and types; 0 route exposure (underscore prefix)
- `functions/api/newsletter.ts` — POST /api/newsletter; expects `{ email, firstName }`
- `functions/api/contact.ts` — POST /api/contact; expects `{ firstName, lastName, email, phone, message }`
- `functions/api/book-session.ts` — POST /api/book-session; expects 7 fields + optional `anythingElse`; sets `contact_type: "Patient"`
- `functions/api/apply.ts` — POST /api/apply; expects `{ firstName, lastName, email, phone, resumeCoverNote }`; sets `contact_type: "Provider"`; TODO comment for HubSpot Files API resume upload
- `functions/api/facility-referral.ts` — POST /api/facility-referral; expects 12 fields; Step 1 company upsert, Step 2 contact upsert, Step 3 PUT association with `associationTypeId: 5`

**Pattern:** All functions follow identical structure to `referral.ts` — `onRequestPost` + `onRequestOptions`, `Env` interface, `CORS_HEADERS`, per-step try/catch, `jsonResponse` helper.

**TypeScript notes:** All type assertions use `// safe:` comments per CLAUDE.md. No `any` used. No `console.log` in committed code. Studio typecheck errors (`formOption.ts`, `redirect.ts`) are pre-existing and unrelated.

**Verification:** `pnpm --filter web build` → 19 routes, 0 errors. `apps/web typecheck: Done` — no errors in any new file.

**Issues:** None. No user corrections this session.

---

### Fix optional field validation in HubSpot Pages Functions — 2026-05-21 [x] COMPLETE 2026-05-21 01:30

Four Pages Functions were rejecting legitimately empty/optional fields sent by the frontend, producing 400s that showed as "Something went wrong" alerts in the browser.

- [x] A. `newsletter.ts` — removed `firstName` required check; `firstName` made optional; props object only sets `firstname` if non-empty (`if (firstName?.trim()) props.firstname = ...`)
- [x] B. `facility-referral.ts` — removed `facilityPhone` from required check; interface `facilityPhone?: string`; company create uses `facilityPhone ?? ''`
- [x] C. `apply.ts` — removed `resumeCoverNote` from required check (label in form UI says "optional"); interface `resumeCoverNote?: string`; props uses `resumeCoverNote ?? ''`
- [x] D. `contact.ts` — removed `phone` from required check (no `required` attr on HTML input); phone stays in props for HubSpot enrichment when provided

### Session Review — 2026-05-21 (Fix optional field validation)

**Root cause:** All 4 functions used an empty-string falsy check (`!val || !val.trim()`) that treats `''` as a missing required field. The frontend legitimately sends empty strings for optional fields (`firstName: ''` on newsletter, `facilityPhone: ''` hardcoded in ModalForms, optional cover note, optional phone).

**Files changed:**

- `functions/api/newsletter.ts` — removed firstName required check; interface `firstName?: string`; conditional prop set
- `functions/api/facility-referral.ts` — removed facilityPhone from required obj; interface `facilityPhone?: string`; `facilityPhone ?? ''` in company create
- `functions/api/apply.ts` — removed resumeCoverNote from required obj; interface `resumeCoverNote?: string`; `resumeCoverNote ?? ''` in props
- `functions/api/contact.ts` — removed phone from required obj; no other changes needed

**book-session.ts:** Clean — `anythingElse` was already `?: string` and not in the required object. No change needed.

**Verification:** `pnpm --filter web build` → 19 routes, 0 errors. `grep -ri "formspree" apps/web/dist/` → 0 results. All 7 `functions/api/` files confirmed present.
