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

- **Last work:** 2026-05-14 — Redirect Manager (Sanity schema, Studio tool, Astro middleware)
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
