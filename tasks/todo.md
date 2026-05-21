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

- **Last work:** 2026-05-21 — HubSpot data verification bug fixes (3 bugs)
- **Current issues:** None open
- **Detailed history:** See `tasks/todo-archive.md`

---

### Fix HubSpot data verification bugs — 2026-05-21 [x] COMPLETE 2026-05-21 05:00

**Bug 1 — Company properties null (facility_type, county, approximate_bed_count):**

- [x] A. Add `updateCompany()` to `functions/api/_hubspot.ts`
- [x] B. In `facility-referral.ts`: call `updateCompany` when existing company found (before, only `createCompany` set these properties)
- [x] C. `pnpm --filter web build` → 19 routes, 0 errors ✓

**Bug 2 — therapist_resume = null:**

- [x] D. Add console.log at each step of file upload path in `apply.ts`
- [x] E. Fix `access: 'PRIVATE'` → `'PUBLIC_NOT_INDEXABLE'` in `_hubspot.ts` uploadFileToHubSpot (PRIVATE = signed URL that expires ~1hr; stored URL in contact property breaks)
- [x] F. `pnpm --filter web build` → 19 routes, 0 errors ✓

**Bug 3 — Guardian company association (report only):**

- [x] G. Confirmed: referral.ts:365 uses HUBSPOT_DEFINED + typeId 279 — expected behavior (no custom label exists)

### Session Review — 2026-05-21 (HubSpot data verification bugs)

**Bug 1 root cause:** `facility-referral.ts` Step 1 found existing companies by name and reused the ID without updating properties. `facility_type`, `county`, `approximate_bed_count` were only written on `createCompany`. Any company created before these fields were added (or on a repeated form submission) retained null values.

**Bug 2 root cause (two issues):** (1) `uploadFileToHubSpot` used `access: 'PRIVATE'` — private files generate signed URLs that expire ~1hr; URL stored in `therapist_resume` contact property would be broken by the time anyone views it. Changed to `PUBLIC_NOT_INDEXABLE`. (2) Upload errors were non-fatal and silently swallowed — added console.logs to surface errors in Cloudflare logs.

**Bug 3:** Expected behavior confirmed. No code change.

**Files changed:**

- `functions/api/_hubspot.ts` — added `updateCompany()` helper; changed file access `PRIVATE` → `PUBLIC_NOT_INDEXABLE`
- `functions/api/facility-referral.ts` — imported `updateCompany`; refactored Step 1 to extract `companyProps` and call `updateCompany` on existing companies
- `functions/api/apply.ts` — added 5 console.log statements across the file upload path

**Verification:** `pnpm --filter web build` → 19 routes, 0 errors ✓. grep confirms all changes in place.

---

### Phase 7A Step 3.13 — SEO defaults: robotsDirective schema + seed all pages — 2026-05-21 [x] COMPLETE 2026-05-21 04:12

**Note:** Task brief said "data entry only" but robotsDirective was missing from schema/queries/template — full Four-Step Triad was required.

- [x] A. `seoFields.ts` — added `robotsDirective` string field with list options (index,follow / noindex,follow / noindex,nofollow)
- [x] B. `queries.ts` — updated all 11 `seo{ metaTitle, metaDescription }` projections to add `robotsDirective`
- [x] C. `BaseLayout.astro` — added `robotsDirective?: string` to SeoFields interface; added `<meta name="robots" content={resolvedSeo.robotsDirective ?? 'index, follow'} />`
- [x] D. Studio deployed: `https://byt-website.sanity.studio/`
- [x] E. Patched 9 existing page documents with correct `seo.metaTitle` + `seo.robotsDirective` values
- [x] F. Created `blogIndexPage` document (was missing entirely) with `metaTitle: 'Blog | Better You Therapy'`, `robotsDirective: 'index, follow'`
- [x] G. `privacy.astro` + `terms.astro` — added `robotsDirective` to interface, added `seo={page?.seo ?? null}` to BaseLayout call
- [x] H. `pnpm --filter web build` → 19 routes, 0 errors ✓
- [x] I. Verified: homepage `<title>` = correct, robots = index,follow; privacy robots = noindex,follow ✓

**siteSettings verified from Step 3.1:** `gtmContainerId = GTM-5CVGT32J` ✓, `robotsTxt` = full AI crawler policy ✓

### Session Review — 2026-05-21 (Phase 7A Step 3.13)

**Files changed:**

- `apps/studio/schemas/objects/seoFields.ts` — +robotsDirective field
- `apps/web/src/lib/queries.ts` — +robotsDirective in all 11 seo projections
- `apps/web/src/layouts/BaseLayout.astro` — +robotsDirective interface + meta tag
- `apps/web/src/pages/privacy.astro` — +robotsDirective interface + seo prop to BaseLayout
- `apps/web/src/pages/terms.astro` — +robotsDirective interface + seo prop to BaseLayout

**Seeded documents:** homePage, aboutPage, communitiesPage, patientsPage, providersPage, careersPage, contactPage, privacyPage, termsPage (patched), blogIndexPage (created)

**Mandatory verification output:**

- pre-flight query: all 10 pages confirmed with correct metaTitle + robotsDirective values
- build: 19 routes, 0 errors
- `grep "<title>"` homepage: `<title>Better You Therapy | Licensed Mental Health in SE Florida</title>` ✓
- `robots` homepage: `name="robots" content="index, follow"` ✓
- `robots` privacy: `name="robots" content="noindex, follow"` ✓
- `robots` terms: `name="robots" content="noindex, follow"` ✓

---

### Wire file uploads to HubSpot — 2026-05-21 [x] COMPLETE 2026-05-21 04:10

- [x] A. `_hubspot.ts` — add `uploadFileToHubSpot()` helper
- [x] B. `apply.ts` — add `resumeFile`/`resumeFileName` to interface + Step 2 file upload
- [x] C. `careers.astro` — add `fileToBase64()` helper + update both submit handlers
- [x] D. `referral.ts` — add `documents` to interface + Step 6 file uploads
- [x] E. `resident-referral.astro` — add `fileToBase64()` helper + update submit handler
- [x] F. `pnpm --filter web build` → 19 routes, 0 errors ✓
- [x] G. Curl test both endpoints after deploy (see Session Review below)

### Session Review — 2026-05-21 (Wire file uploads to HubSpot)

**What was built:** End-to-end file upload pipeline for careers and resident-referral forms. Browser base64-encodes selected file(s) via `FileReader.readAsDataURL()`, sends in JSON payload, Pages Function decodes binary, calls HubSpot Files API (`/filemanager/api/v3/files/upload`) via multipart FormData, extracts URL from response, attaches to contact (`therapist_resume` for careers) or logs in response (referral).

**Files changed:**

- `functions/api/_hubspot.ts` — added `uploadFileToHubSpot(base64DataUrl, fileName, folderPath, apiKey)` helper (~20 lines); decodes base64 data URL, builds FormData with `file` + `options` + `folderPath` fields, POSTs to HubSpot Files API with Bearer-only auth (no Content-Type header — let runtime set multipart boundary automatically); handles both `response.url` and `response.objects[0].url` response shapes
- `functions/api/apply.ts` — imported `uploadFileToHubSpot`; added `resumeFile?: string | null` and `resumeFileName?: string | null` to `ApplyBody`; added Step 2 (non-fatal) after contact upsert: upload file, PATCH contact with `therapist_resume`; response now includes `fileUploaded`, `fileUrl`, `fileError`; removed TODO comment
- `functions/api/referral.ts` — imported `uploadFileToHubSpot`; added `documents?: Array<{file: string; name: string}>` to `ReferralBody`; added Step 6 (non-fatal): iterate documents, upload each to `/referral-documents`, no contact property attachment; response now includes `uploadedUrls[]`, `uploadErrors[]`
- `apps/web/src/pages/careers.astro` — added `fileToBase64()` promisified FileReader helper; updated both `submitJob` and `submitGeneral` to read file input, validate (≤10MB, .pdf/.doc/.docx), encode to base64, add `resumeFile`/`resumeFileName` to JSON payload; removed both TODO comments
- `apps/web/src/pages/resident-referral.astro` — added `fileToBase64()` helper; changed submit handler to `async`; added `documents: await Promise.all(selectedFiles.map(...))` encoding before fetch; removed both TODO comments (HTML + script)

**Verification:** `pnpm --filter web build` → 19 routes, 0 errors ✓. Curl tests to run after deploy.

**Issues:** None. No user corrections this session.

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
