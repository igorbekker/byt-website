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

- **Last work:** 2026-05-15 — Wire disclaimerCopy + add infoHeading/formHeading to Contact page
- **Current issues:** None open
- **Detailed history:** See `tasks/todo-archive.md`

---

### Wire 7 patients page images — 2026-05-13 [x] COMPLETE 2026-05-13

Replace all Unsplash placeholder fallback URLs on patients.astro with project-owned JPGs.

- [x] A. 2026-05-13 Confirmed all 7 images exist in design-source/assets/ on GitHub remote
- [x] B. 2026-05-13 Printed current state of all 7 slots — all had <img> tags, all had Unsplash fallbacks
- [x] C. 2026-05-13 Copied 7 JPGs from design-source/assets/ to apps/web/public/images/
- [x] D. 2026-05-13 Updated .ph-hero-bg img — fallback src + alt
- [x] E. 2026-05-13 Updated 4 .ph-card-img img slots (families, adults, caregivers, espanol) — fallback src + alt
- [x] F. 2026-05-13 Updated 2 .ph-way-bg img slots (tele `:nth-child(1)`, facility `:nth-child(2)`) — fallback src + alt
- [x] G. 2026-05-13 pnpm --filter web build — PASSED (17 routes, 0 errors); all 7 images confirmed in dist/client/images/

### Session Review — 2026-05-13

**What was done:** Wired 7 project-owned JPGs into patients.astro, replacing all Unsplash placeholder fallback URLs. Sanity ternaries preserved — local images are fallbacks only.

**Files changed:**

- `apps/web/public/images/patients-hero-bg.jpg` (new)
- `apps/web/public/images/patients-card-families.jpg` (new)
- `apps/web/public/images/patients-card-adults.jpg` (new)
- `apps/web/public/images/patients-card-caregivers.jpg` (new)
- `apps/web/public/images/patients-card-espanol.jpg` (new)
- `apps/web/public/images/patients-track-tele.jpg` (new)
- `apps/web/public/images/patients-track-facility.jpg` (new)
- `apps/web/src/pages/patients.astro` — 7 fallback src replacements + alt text updates

**Implementation notes:**

- Task spec had facility/tele mapped to wrong nth-child selectors (Lesson 16 applies); confirmed DOM order: `:nth-child(1)` = Teletherapy, `:nth-child(2)` = Facility
- All slots already had `<img>` tags — no placeholder div → img swaps needed
- Sanity ternary structure preserved: `src={sanityVar ?? '/images/filename.jpg'}`
- No CSS classes renamed, no DOM restructured, no other HTML touched

**Verification:** Build PASS — 17 routes, 0 errors. All 7 files confirmed in dist/client/images/ ✓

**Issues:** Task review initially written to wrong tasks/ directory (/home/personal/projects/byt-website/tasks/ instead of repo). Corrected before commit.

---

### Wire 2 About Us page images — 2026-05-13 [x] COMPLETE 2026-05-13

Install hero team photo and CTA background on about.astro.

- [x] A. 2026-05-13 Created apps/web/public/images/about/ and copied about-hero-team.png + about-cta-bg.png from design-source/assets/
- [x] B. 2026-05-13 Updated .about-hero-image img — static src (no Sanity ternary existed); alt → "Better You Therapy clinical team in South Florida"
- [x] C. 2026-05-13 Updated .about-cta-bg — replaced Unsplash fallback URL; Sanity ternary preserved as primary
- [x] D. 2026-05-13 pnpm --filter web build — PASSED (0 errors); both images confirmed in dist/client/images/about/

### Session Review — 2026-05-13 (About Images)

**What was done:** Wired 2 project-owned PNGs into about.astro, replacing Unsplash placeholder URLs. Sanity ternary for CTA bg preserved — local image is fallback only. Hero slot had no Sanity ternary; static path set directly.

**Files changed:**

- `apps/web/public/images/about/about-hero-team.png` (new)
- `apps/web/public/images/about/about-cta-bg.png` (new)
- `apps/web/src/pages/about.astro` — 2 URL replacements

**Implementation notes:**

- Hero: `.about-hero-image img` had no Sanity ternary — replaced static Unsplash `src` directly with `/images/about/about-hero-team.png`
- CTA bg: `.about-cta-bg` had `page?.ctaBackgroundImage?.asset?.url ?? [unsplash]` — kept Sanity primary, replaced fallback only
- Overlay CSS (`opacity: 0.22` + navy gradient on `.about-cta-overlay`) left untouched per instructions
- No CSS classes renamed, no DOM restructured, no other HTML touched

**Verification:** Build PASS — 0 errors. Both files confirmed in dist/client/images/about/ ✓

**Issues:** Session review initially written to wrong tasks/ directory (/home/personal/projects/byt-website/tasks/ instead of repo). Lesson 15 violated. Corrected during /post.

---

### Wire 5 Communities page images — 2026-05-13

Branch: feat/communities-images

- [x] A. 2026-05-13 Created apps/web/public/images/communities/
- [x] B. 2026-05-13 Copied 3 clean images (empty-room, handoff, exterior) from design-source/assets/
- [x] C. 2026-05-13 Cropped 100px from bottom of 2 Gemini images (hero, therapist-resident) using jimp
- [x] D. 2026-05-13 SLOT A — updated .h84-image img: Sanity ternary + /images/communities/communities-hero.png fallback
- [x] E. 2026-05-13 SLOT D — updated l521 Step 1 card img: communities-handoff.png
- [x] F. 2026-05-13 SLOT E — updated .l16-image img: communities-therapist-resident.png
- [x] G. 2026-05-13 pnpm --filter web build — PASSED (0 errors); all 5 images in dist/client/images/communities/

---

### Session Review — 2026-05-13 (Communities Images)

**What was done:** Wired 5 project-owned images into communities.astro, replacing Unsplash placeholders. Two Gemini images cropped 100px from bottom to remove watermark.

**Slot status:**

| Image                              | Slot                                    | Status  | Details                                                                                         |
| ---------------------------------- | --------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| communities-hero.png               | SLOT A — .h84-image img                 | placed  | Sanity ternary added; heroImage field existed in interface but was unused in HTML               |
| communities-exterior.png           | SLOT B — .l192-image                    | no slot | .l192-image contains SVG map only; no img placeholder exists                                    |
| communities-empty-room.png         | SLOT C — between hero and l521          | no slot | No section exists between hero and l521                                                         |
| communities-handoff.png            | SLOT D — l521 Step 1 .l521-card-img img | placed  | l521 cards DO have img slots (task note about "solid gradients" was outdated); placed in Step 1 |
| communities-therapist-resident.png | SLOT E — .l16-image img                 | placed  | l16 section exists and has img slot                                                             |

**Files changed:**

- `apps/web/public/images/communities/` — 5 new images (2 Gemini-cropped, 3 clean copies)
- `apps/web/src/pages/communities.astro` — 3 img src/alt replacements

**Verification:** `pnpm --filter web build` PASS — 0 errors. All 5 images confirmed in dist/client/images/communities/ ✓

**Issues:** None

---

### Wire remaining Communities + About images — 2026-05-14

Replace all remaining Unsplash placeholders in communities.astro and about.astro with local images.

- [x] A. 2026-05-14 Copied 10 missing communities images from design-source/assets/ to apps/web/public/images/communities/
- [x] B. 2026-05-14 Copied about-story-hands.png from design-source/assets/ to apps/web/public/images/about/
- [x] C. 2026-05-14 communities.astro — replaced Unsplash URLs in l521 Steps 2, 3, 4
- [x] D. 2026-05-14 communities.astro — replaced 6 Unsplash URLs in l526 bento cards (Card 1–6)
- [x] E. 2026-05-14 communities.astro — corrected .l16-image img: replaced communities-therapist-resident.png with communities-l16-handles.png (wrong file from prior session)
- [x] F. 2026-05-14 about.astro — replaced Unsplash URL in .story-image img with about-story-hands.png
- [x] G. 2026-05-14 pnpm --filter web build — PASSED (0 errors, 17 routes)

---

### Session Review — 2026-05-14

**What was done:** Wired all remaining project-owned images into communities.astro and about.astro, eliminating every Unsplash URL from both files.

**communities.astro changes:**

| Section     | Old src                                         | New src                                                     |
| ----------- | ----------------------------------------------- | ----------------------------------------------------------- |
| l521 Step 2 | photo-1551836022 (Unsplash)                     | /images/communities/communities-step2-credentialing.png     |
| l521 Step 3 | photo-1568377210220 (Unsplash)                  | /images/communities/communities-step3-arriving.png          |
| l521 Step 4 | photo-1554224155-6726b3ff858f (Unsplash)        | /images/communities/communities-step4-billing.png           |
| l526 Card 1 | photo-1559757148 (Unsplash)                     | /images/communities/communities-l526-card1-sessions.png     |
| l526 Card 2 | photo-1505330622279 (Unsplash)                  | /images/communities/communities-l526-card2-ehr.png          |
| l526 Card 3 | photo-1554224155-8d04cb21cd6c (Unsplash)        | /images/communities/communities-l526-card3-coordination.png |
| l526 Card 4 | photo-1576091160399 (Unsplash)                  | /images/communities/communities-l526-card4-medicare.png     |
| l526 Card 5 | photo-1573497019418 (Unsplash)                  | /images/communities/communities-l526-card5-training.png     |
| l526 Card 6 | photo-1573497019940 (Unsplash)                  | /images/communities/communities-l526-card6-hipaa.png        |
| .l16-image  | communities-therapist-resident.png (wrong file) | /images/communities/communities-l16-handles.png             |

**about.astro changes:**

| Section      | Old src                        | New src                             |
| ------------ | ------------------------------ | ----------------------------------- |
| .story-image | photo-1582213782179 (Unsplash) | /images/about/about-story-hands.png |

**Sections already local — no change needed:**

- communities.astro: .h84-image (hero), l521 Step 1, .l192-image (SVG only — no img tag)
- about.astro: .about-hero-image, .about-cta-bg

**Files changed:**

- `apps/web/public/images/communities/` — 10 new images added
- `apps/web/public/images/about/` — 1 new image added (about-story-hands.png)
- `apps/web/src/pages/communities.astro` — 10 src/alt replacements
- `apps/web/src/pages/about.astro` — 1 src/alt replacement

**Verification:** `pnpm --filter web build` PASS — 0 errors, 17 routes ✓. Zero Unsplash URLs remaining in both files ✓.

**Issues:** .l16-image had communities-therapist-resident.png from prior session instead of communities-l16-handles.png. Caught during pre-commit verification. Corrected before commit.

---

### Three files, five fixes — 2026-05-14

- [x] A. 2026-05-14 FIX 1 — ModalForms.astro: removed "What to expect next →" link from #bookSuccess .next-row
- [x] B. 2026-05-14 FIX 2 — Footer.astro: wired newsletter form to Formspree mykoqerq with async POST + error handling
- [x] C. 2026-05-14 FIX 3 — NewsletterBlock.astro: same Formspree wire-up as FIX 2
- [x] D. 2026-05-14 FIX 4 — careers.astro: hardcoded endpoint mzdoapyq, removed formId early-return, added hidden position input to both forms, openJobModal sets position to job.title
- [x] E. 2026-05-14 FIX 5 — careers.astro: added .file-drop.drag-over CSS + dragover/dragleave/drop event listeners on all .file-drop elements
- [x] F. 2026-05-14 pnpm --filter web build — PASSED (0 errors)

---

### Session Review — 2026-05-14 (Five Fixes)

**What was done:** Three component/page files patched across five distinct fixes.

**FIX 1 — ModalForms.astro, #bookSuccess .next-row:**
Removed `<a href="/patients/" class="btn btn-coral">What to expect next →</a>`. Close button retained. No CSS changed.

**FIX 2 — Footer.astro, footer newsletter script:**
Replaced stub (instant success, no network call) with async Formspree POST to `https://formspree.io/f/mykoqerq`. JSON body `{ email }`, headers `Content-Type: application/json` + `Accept: application/json`. On success: "Subscribed ✓", clear input, reset after 2400ms. On error: alert + reset.

**FIX 3 — NewsletterBlock.astro, blog newsletter script:**
Identical pattern to FIX 2. Same endpoint `mykoqerq`.

**FIX 4 — careers.astro, career form submission:**

- Removed `data-formspree-id` attribute from both `#generalForm` and `#jobForm`
- Hardcoded `https://formspree.io/f/mzdoapyq` directly in `submitJob` and `submitGeneral`
- Removed `formId` early-return guard from both functions
- Added `<input type="hidden" name="position" value="General Application" />` to `#generalForm`
- Added `<input type="hidden" name="position" id="jobPositionInput" value="" />` to `#jobForm`
- `openJobModal(id)` now sets `jobPositionInput.value = job.title` on each open

**FIX 5 — careers.astro, file drag and drop:**

- Added `.file-drop.drag-over { border-color: var(--coral); background: rgba(232,93,74,0.06); }` to CSS block
- Added `dragover` (preventDefault + add class), `dragleave` (remove class), `drop` (preventDefault + remove class + set input.files + call updateFileLabel) listeners on all `.file-drop` elements

**Files changed:**

- `apps/web/src/components/ui/ModalForms.astro`
- `apps/web/src/components/ui/Footer.astro`
- `apps/web/src/components/blog/NewsletterBlock.astro`
- `apps/web/src/pages/careers.astro`

**Verification:** `pnpm --filter web build` PASS — 0 errors ✓

**Issues:** None

---

### Expose submitJob + submitGeneral on window — 2026-05-14

- [x] A. 2026-05-14 Added `window.submitJob = submitJob` and `window.submitGeneral = submitGeneral` to window assignments block in careers.astro
- [x] B. 2026-05-14 pnpm --filter web build — PASSED (0 errors)

---

### Session Review — 2026-05-14 (Window Assignments)

**What was done:** Added two window assignments in `careers.astro` so inline `onsubmit` handlers can resolve `submitJob` and `submitGeneral` at runtime.

**Change:** In the `<script is:inline>` block, immediately after the existing `window.openJobModal`, `window.closeJobModal`, `window.updateFileLabel` assignments:

```js
window.submitJob = submitJob;
window.submitGeneral = submitGeneral;
```

**Files changed:** `apps/web/src/pages/careers.astro`

**Verification:** `pnpm --filter web build` PASS — 0 errors ✓

**Issues:** None

---

### Redirect Manager — Sanity schema + Studio tool + Astro middleware — 2026-05-14

- [x] A. 2026-05-14 Created `apps/studio/schemas/documents/redirect.ts` — document type with sourcePath, destinationPath, statusCode (301/302/410), isActive, notes, hitCount (readOnly), lastHitAt (readOnly)
- [x] B. 2026-05-14 Registered `redirect` in `apps/studio/schemas/index.ts`
- [x] C. 2026-05-14 Created `apps/studio/tools/RedirectManager.tsx` — searchable/sortable table, CSV import, inline isActive toggle, active/inactive count badges
- [x] D. 2026-05-14 Registered `RedirectManager` in `apps/studio/sanity.config.ts` as "Redirects" tool
- [x] E. 2026-05-14 Created `apps/web/src/middleware.ts` — in-memory TTL cache, pathname match, 301/302 redirect, 410 Gone, fire-and-forget hit tracking via Cloudflare `waitUntil`
- [x] F. 2026-05-14 Added `SANITY_WRITE_TOKEN` to `apps/web/.env.example`
- [x] G. 2026-05-14 `pnpm --filter web build` — PASSED (0 errors, 18 routes)
- [x] H. 2026-05-14 `pnpm --filter web check` — middleware.ts clean (0 errors); pre-existing errors in other files unchanged

---

### Session Review — 2026-05-14 (Redirect Manager)

**What was done:** Built a full CMS-driven redirect manager: Sanity schema, Studio UI tool, and Astro middleware.

**Architectural note:** The plan initially flagged OBS-015 (output: 'static' → 'hybrid' required for middleware). Astro 6 removed the `hybrid` option — `static` now supports middleware natively. No output mode change was needed; `astro.config.mjs` is unchanged.

**Files created:**

- `apps/studio/schemas/documents/redirect.ts` — `redirect` document type
- `apps/studio/tools/RedirectManager.tsx` — Studio custom tool
- `apps/web/src/middleware.ts` — Astro request-time middleware

**Files edited:**

- `apps/studio/schemas/index.ts` — added `redirect` import + registration
- `apps/studio/sanity.config.ts` — added `RedirectManager` import + tool registration
- `apps/web/.env.example` — added `SANITY_WRITE_TOKEN` key

**Schema fields:** sourcePath (required, must start with `/`, unique), destinationPath (required, `/` or `https://`), statusCode (301/302/410, default 301), isActive (bool, default true), notes (text, optional), hitCount (number, readOnly, default 0), lastHitAt (datetime, readOnly).

**Middleware behavior:** On each request, checks pathname against in-memory map (5-min TTL, fetched with `SANITY_API_READ_TOKEN`). On match: fire-and-forget PATCH to increment `hitCount`/`lastHitAt` via Cloudflare `ctx.waitUntil` (only if `SANITY_WRITE_TOKEN` is present), then returns 301/302 redirect or 410 Gone. Redirects always fire if the map loaded — write token absence only skips hit counting.

**Environment:** `SANITY_WRITE_TOKEN` must be added to `.env.local` (local dev) and Cloudflare Pages → Settings → Environment variables (production). Get token from sanity.io/manage → project → API → Tokens (Editor or Write role).

**Verification:** `pnpm --filter web build` PASS — 0 errors, 18 routes ✓. `pnpm --filter web check` — middleware.ts clean ✓.

**Issues:** None

---

### Add missing handlesSubhead field to Providers schema — 2026-05-15 [x] COMPLETE 2026-05-15

- [x] A. 2026-05-15 Pre-flight: confirmed handlesSubhead missing from providersPage.ts schema, missing from PROVIDERS_PAGE_QUERY in queries.ts; already wired in providers.astro (TypeScript interface + template)
- [x] B. 2026-05-15 Added `defineField({ name: 'handlesSubhead', title: 'Handles Subhead', type: 'text' })` to providersPage.ts after handlesHeading
- [x] C. 2026-05-15 Added `handlesSubhead` to PROVIDERS_PAGE_QUERY in queries.ts after handlesHeading
- [x] D. 2026-05-15 `pnpm --filter web build` — PASSED (0 errors, 18 routes)

### Session Review — 2026-05-15 (handlesSubhead triad)

**What was done:** Completed the schema–query–template triad for `handlesSubhead` on the Providers page. The field existed in the TypeScript interface and template in `providers.astro` but was absent from the Sanity schema and GROQ query, meaning it could never be populated from the CMS.

**Files changed:**

- `apps/studio/schemas/singletons/providersPage.ts` — added `handlesSubhead` field after `handlesHeading`
- `apps/web/src/lib/queries.ts` — added `handlesSubhead` to `PROVIDERS_PAGE_QUERY`

**providers.astro:** No change — TypeScript interface (`handlesSubhead?: string`) and template reference (`{page?.handlesSubhead ?? 'The operational infrastructure that frees you to do therapy.'}`) were already in place.

**Verification:** `pnpm --filter web build` PASS — 0 errors, 18 routes ✓. `git diff --stat` confirmed exactly 2 files changed, 2 insertions.

**Issues:** None

---

### Wire title and lastUpdated into Privacy page — 2026-05-15 [x] COMPLETE 2026-05-15

Connect the existing `title` and `lastUpdated` fields from `privacyPage.ts` schema through the GROQ query and into the page template.

- [x] A. 2026-05-15 Pre-flight: confirmed `title` (line 13) and `lastUpdated` (lines 14–19) exist in `privacyPage.ts`; both absent from `PRIVACY_PAGE_QUERY`; title was hardcoded in fallback `<h1>` at line 1503 of `privacy.astro`; no `lastUpdated` element existed anywhere in the template
- [x] B. 2026-05-15 Added `title,` and `lastUpdated,` to `PRIVACY_PAGE_QUERY` in `queries.ts`
- [x] C. 2026-05-15 Added `title?: string; lastUpdated?: string;` to the TypeScript fetch interface in `privacy.astro`
- [x] D. 2026-05-15 Moved `<h1>` outside the conditional block, wired as `{page?.title ?? 'Privacy Policy'}`; added conditional `{page?.lastUpdated && <p>Last updated: {page.lastUpdated}</p>}` after it; removed now-duplicate hardcoded `<h1>` from fallback branch
- [x] E. 2026-05-15 `pnpm --filter web build` — PASSED

### Session Review — 2026-05-15 (Privacy page title/lastUpdated)

**What was done:** Completed the schema–query–template triad for `title` and `lastUpdated` on the Privacy Policy page.

**Files changed:**

- `apps/web/src/lib/queries.ts` — added `title,` and `lastUpdated,` to `PRIVACY_PAGE_QUERY`
- `apps/web/src/pages/privacy.astro` — TS interface updated; `<h1>` moved above the conditional and wired from Sanity; `<p>Last updated: …</p>` added conditionally; hardcoded `<h1>` removed from fallback branch

**Structural change note:** The `<h1>` was repositioned from inside the fallback-only branch to an unconditional position above the `{page?.body ? … : …}` block. This ensures title and lastUpdated render as independent fields regardless of whether a Sanity body exists. The hardcoded `<h1>Privacy Policy for Better You Therapy</h1>` was removed from the fallback to avoid duplication. The fallback branch retains all paragraph and heading content below the h1.

**Verification:** `pnpm --filter web build` PASS — 0 errors ✓. `git diff --stat` confirmed exactly 2 files changed.

**Issues:** Initial verification statement incorrectly claimed "No HTML structure changed: YES." User correctly flagged the contradiction. Structural change was real and intentional — logged in Lesson 17.

---

### Wire title and lastUpdated into Terms page — 2026-05-15 [x] COMPLETE 2026-05-15

Connect the existing `title` and `lastUpdated` fields from `termsPage.ts` schema through the GROQ query and into the page template. Same pattern as Privacy page fix completed earlier this session.

- [x] A. 2026-05-15 Pre-flight: confirmed `title` (line 13) and `lastUpdated` (lines 14–19) exist in `termsPage.ts`; both absent from `TERMS_PAGE_QUERY`; hardcoded `<h1>Terms and Conditions</h1>` at terms.astro line 508 and `<p class="updated">Last updated: May 4, 2026</p>` at line 509, both inside fallback block
- [x] B. 2026-05-15 Added `title,` and `lastUpdated,` to `TERMS_PAGE_QUERY` in `queries.ts`
- [x] C. 2026-05-15 Added `title?: string; lastUpdated?: string;` to the TypeScript fetch interface in `terms.astro`
- [x] D. 2026-05-15 Added `<h1>{page?.title ?? 'Terms of Service'}</h1>` above the conditional block; added `{page?.lastUpdated && <p class="updated">Last updated: {page?.lastUpdated}</p>}` below h1; removed hardcoded `<h1>` and `<p class="updated">` from inside the fallback branch
- [x] E. 2026-05-15 `pnpm --filter web build` — PASSED (confirmed in step 7 of /pre)

### Session Review — 2026-05-15 (Terms page title/lastUpdated)

**What was done:** Completed the schema–query–template triad for `title` and `lastUpdated` on the Terms and Conditions page, following the identical pattern applied to the Privacy page earlier this session.

**Files changed:**

- `apps/web/src/lib/queries.ts` — added `title,` and `lastUpdated,` to `TERMS_PAGE_QUERY`
- `apps/web/src/pages/terms.astro` — TS interface updated; `<h1>` added above the conditional and wired from Sanity with `?? 'Terms of Service'` fallback; `<p class="updated">` added conditionally with `{page?.lastUpdated && …}`; hardcoded `<h1>` and hardcoded `<p class="updated">` removed from fallback branch

**Structural change note:** The `<h1>` and last-updated `<p>` were moved from inside the fallback-only branch to unconditional positions above the `{page?.body ? … : …}` block. This ensures title and date render as independent CMS fields regardless of whether a Sanity body exists. The fallback branch retains the eyebrow and all paragraph/heading content below the h1.

**Verification:** `pnpm --filter web build` PASS ✓. `git diff --stat` confirmed exactly 2 files changed, 6 insertions, 2 deletions.

**Issues:** None

---

### Remove duplicate title/date blocks from Sanity body content — 2026-05-15 [x] COMPLETE 2026-05-15

Strip the redundant opening blocks that were embedded in the Sanity body for termsPage and privacyPage. These caused double-render after the template was wired to render title and lastUpdated as independent fields.

- [x] A. 2026-05-15 Pre-flight: fetched termsPage body — confirmed block 0 (h1 "Terms and Conditions") and block 1 (normal "Last updated: May 4, 2026") were duplicates of template-rendered fields
- [x] B. 2026-05-15 Pre-flight: fetched privacyPage body — confirmed block 0 (h1 "Privacy Policy for Better You Therapy") was a duplicate; no "Last updated" block in privacy body
- [x] C. 2026-05-15 Fetched full body arrays for both documents; trimmed via Python (terms: body[2:], privacy: body[1:]); wrote mutation payloads
- [x] D. 2026-05-15 Applied Sanity patch mutations via API — both returned `operation: update`
- [x] E. 2026-05-15 Post-flight: re-fetched first 4 blocks of each document; scanned full body for h1 and "Last updated" blocks

### Session Review — 2026-05-15 (Duplicate body block removal)

**What was done:** Removed redundant opening blocks from the Sanity body content of termsPage and privacyPage. These blocks (the page title as an h1 and "Last updated" as a normal paragraph) had been authored inside the body field as if the document were a self-contained plain-text file. After the template was updated to render `title` and `lastUpdated` as independent fields, those body blocks caused every piece of text to appear twice.

**Sanity mutations applied:**

| Document    | Blocks removed                                                        | Method                      |
| ----------- | --------------------------------------------------------------------- | --------------------------- |
| termsPage   | 0 (h1 "Terms and Conditions"), 1 (normal "Last updated: May 4, 2026") | `patch.set body = body[2:]` |
| privacyPage | 0 (h1 "Privacy Policy for Better You Therapy")                        | `patch.set body = body[1:]` |

**Post-mutation state:**

| Document    | Block 0 text                                      | h1 blocks remaining | "Last updated" blocks remaining |
| ----------- | ------------------------------------------------- | ------------------- | ------------------------------- |
| termsPage   | "Welcome to Better You Therapy. These terms and…" | 0                   | 0                               |
| privacyPage | "Better You Therapy is accessible from https://…" | 0                   | n/a (never present)             |

**Files changed:** None — Sanity content mutation only. Zero code files touched.

**Verification:** Post-mutation fetch confirmed correct block 0 text for both documents. Full-body scans confirmed 0 h1 blocks and 0 "Last updated" blocks in both documents ✓

**Issues:** None

---

### Wire disclaimerCopy + add infoHeading and formHeading to Contact page — 2026-05-15 [x] COMPLETE 2026-05-15

Wire the orphan `disclaimerCopy` field and add two new heading fields to the Contact page schema–query–template triad.

- [x] A. 2026-05-15 Pre-flight: confirmed `disclaimerCopy` in schema (line 22) and CONTACT_PAGE_QUERY; `infoHeading` and `formHeading` absent from both; identified hardcoded h2 values and consent-label disclaimer text
- [x] B. 2026-05-15 contactPage.ts — added `infoHeading` and `formHeading` defineField entries before `disclaimerCopy`
- [x] C. 2026-05-15 queries.ts — added `infoHeading` and `formHeading` to CONTACT_PAGE_QUERY
- [x] D. 2026-05-15 contact.astro — extended ContactPage interface; wired `page?.infoHeading`, `page?.formHeading`, and `page?.disclaimerCopy`
- [x] E. 2026-05-15 `pnpm --filter web build` — PASSED (0 errors)

### Session Review — 2026-05-15 (Contact page heading + disclaimer triad)

**What was done:** Completed the schema–query–template triad for three Contact page fields: `infoHeading`, `formHeading` (new fields), and `disclaimerCopy` (orphan — existed in schema + query but not wired in template).

**Files changed:**

- `apps/studio/schemas/singletons/contactPage.ts` — added `infoHeading` and `formHeading` defineField entries
- `apps/web/src/lib/queries.ts` — added `infoHeading` and `formHeading` to `CONTACT_PAGE_QUERY`
- `apps/web/src/pages/contact.astro` — TS interface extended; three fields wired in template

**Wiring details:**

| Field            | Location in template                     | Fallback                                                                                                |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `infoHeading`    | `<h2>` above phone/email/hours info list | `'Reach our team directly.'`                                                                            |
| `formHeading`    | `<h2>` inside the contact form card      | `'Send us a message'`                                                                                   |
| `disclaimerCopy` | `<span>` inside `.form-consent` label    | Full original consent text with `<strong>988</strong>` and `<strong>911</strong>` preserved via ternary |

**Implementation note:** `disclaimerCopy` fallback used a ternary (not `??`) because the original hardcoded span content contains `<strong>` tags. A `??` with a plain-string fallback would silently drop the bold formatting on "988" and "911" in the fallback branch. The ternary preserves the original HTML structure when no Sanity value is set.

**Verification:** `pnpm --filter web build` PASS — 0 errors ✓. `git diff --stat` confirmed exactly 3 files changed, 13 insertions, 5 deletions.

**Issues:** None

---

### Wire noCost schema fields and Layout526 to Sanity — 2026-05-15 [x] COMPLETE 2026-05-15

Add `noCostHeading`, `noCostSubhead`, and `noCostCards` (array, max 6) to `communitiesPage.ts`; wire them into `COMMUNITIES_PAGE_QUERY`; replace all hardcoded text and image srcs in Layout526 of `communities.astro` with Sanity ternaries + verbatim fallbacks.

- [x] A. 2026-05-15 Pre-flight: confirmed no noCost fields in communitiesPage.ts or COMMUNITIES_PAGE_QUERY; extracted all verbatim text from Layout526
- [x] B. 2026-05-15 communitiesPage.ts — added noCostHeading (string), noCostSubhead (text), noCostCards (array of objects max 6: tag string, heading string required, body text, image imageWithAlt) between "What We Handle" and "Conditions" sections
- [x] C. 2026-05-15 queries.ts — added noCostHeading, noCostSubhead, noCostCards[]{ tag, heading, body, image{ asset->{ url }, alt } } to COMMUNITIES_PAGE_QUERY
- [x] D. 2026-05-15 communities.astro — wired section heading + subhead; wired all 6 cards (tag, heading, body, image src, alt) using [0]–[5] indexing with ?? fallbacks
- [x] E. 2026-05-15 pnpm --filter web build — PASSED (0 errors, 18 routes)

### Session Review — 2026-05-15 (noCost / Layout526 triad)

**What was done:** Completed the schema–query–template triad for the Layout526 "No cost to your facility" section on the Communities page.

**Files changed:**

- `apps/studio/schemas/singletons/communitiesPage.ts` — added 29 lines: noCostHeading, noCostSubhead, noCostCards (with tag/heading/body/image per card, max 6, required heading validation, preview select)
- `apps/web/src/lib/queries.ts` — added 2 lines to COMMUNITIES_PAGE_QUERY: noCostHeading, noCostSubhead, noCostCards with nested image projection
- `apps/web/src/pages/communities.astro` — 58 lines changed: section heading, subhead, and all 6 cards wired by position index

**Wiring details:**

| Field              | Fallback value                                                       |
| ------------------ | -------------------------------------------------------------------- |
| noCostHeading      | `'No cost to your facility'`                                         |
| noCostSubhead      | `'We bill Medicare and private insurance directly.'`                 |
| noCostCards[0].tag | `'Sessions'`                                                         |
| noCostCards[0]     | heading: `'Weekly on-site therapy sessions'`                         |
| noCostCards[1]     | heading: `'HIPAA-compliant documentation'` (no tag — SVG icon card)  |
| noCostCards[2]     | heading: `'Medicare and insurance billing'` (no tag — SVG icon card) |
| noCostCards[3].tag | `'Coordination'`                                                     |
| noCostCards[3]     | heading: `'Clinical team communication and care planning'`           |
| noCostCards[4].tag | `'Education'`                                                        |
| noCostCards[4]     | heading: `'Staff training on mental health recognition'`             |
| noCostCards[5]     | heading: `'Zero cost to your residents'` (no tag — SVG icon card)    |

**Card layout:** `large` class on cards [0], [3], [4]; regular on [1], [2], [5] — unchanged. All 3 SVG icons untouched. No HTML structure, classes, or DOM order changed.

**Verification:** `pnpm --filter web build` PASS — 0 errors, 18 routes ✓. `git diff --stat`: 3 files, 60 insertions, 29 deletions ✓.

**Issues:** None

---

### Rewrite CSV import in RedirectManager.tsx — 2026-05-14 [x] COMPLETE 2026-05-14

Simplify CSV import to a strict 2-column format (sourcePath, destinationPath). Skip header row unconditionally. Skip malformed rows. All imports hardcoded to 301/active/empty-notes.

- [x] A. 2026-05-14 Rewrote `parseCSV` — skips row 0 (header), requires exactly 2 non-empty columns, returns `{ rows, skipped }`
- [x] B. 2026-05-14 Updated `handleCSV` — uses new return shape, removes column-name matching, hardcodes `statusCode: 301`, `isActive: true`, `notes: ''`
- [x] C. 2026-05-14 Updated import summary message — "Imported X redirects. Skipped Y malformed rows." (skipped clause omitted if 0)
- [x] D. 2026-05-14 Updated hint text — shows `sourcePath,destinationPath` format, notes all imports use 301
- [x] E. 2026-05-14 `pnpm --filter studio build` — PASSED (0 errors)

---

### Session Review — 2026-05-14 (CSV Import Rewrite)

**What was done:** Rewrote the CSV import in `RedirectManager.tsx` to enforce a strict 2-column format with no header matching or flexible columns.

**`parseCSV` changes:**

- Old: built a `Record<string, string>` keyed by header names — relied on column names matching `sourcePath`, `destinationPath`, `statusCode`, `notes`
- New: returns `{ rows: Array<{sourcePath, destinationPath}>, skipped: number }`. Skips line 0 (header) unconditionally. For each remaining line: splits by comma, checks `vals.length === 2` and both values non-empty; otherwise increments `skipped`.

**`handleCSV` changes:**

- Removed `valid.filter(r => r.sourcePath && r.destinationPath)` column-name guard
- Hardcoded `statusCode: 301`, `isActive: true`, `notes: ''` — no longer reads these from CSV
- Summary: `"Imported X redirects. Skipped Y malformed rows."` — skipped clause only shown when `skipped > 0`

**Files changed:**

- `apps/studio/tools/RedirectManager.tsx`

**Verification:** `pnpm --filter studio build` PASS — 0 errors ✓

**Issues:** None
