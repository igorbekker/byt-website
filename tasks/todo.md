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

- **Last work:** 2026-05-12 — Placed 4 providers images, replaced Unsplash placeholders + testimonial avatar div → img
- **Current issues:** None open
- **Detailed history:** See `tasks/todo-archive.md`

---

## Careers Issues — 2026-05-11 [x] COMPLETE 2026-05-11

### Issue 1 — Job card click handlers not working on live site

- [x] A. 2026-05-11 Diagnosed root cause: `define:vars={{ JOBS }}` wraps entire script in IIFE — `openJobModal`, `closeJobModal`, `updateFileLabel` trapped inside closure, inaccessible from HTML `onclick`/`onchange` attributes
- [x] B. 2026-05-11 Fixed: added `window.openJobModal = openJobModal; window.closeJobModal = closeJobModal; window.updateFileLabel = updateFileLabel;` at end of script block in `apps/web/src/pages/careers.astro`
- [x] C. 2026-05-11 Build PASS. Verified compiled dist/client/careers/index.html lines 229–231 contain all three window assignments

### Issue 2 — Sanity Studio JD importer tool

- [x] D. 2026-05-11 Added `jszip` + `@types/jszip` to `apps/studio/package.json`; ran `pnpm install`
- [x] E. 2026-05-11 Created `apps/studio/tools/DocxImportTool.tsx` — file upload, jszip docx parse, section marker extraction, review panel with editable fields + track dropdown, `client.create()` draft jobPosting
- [x] F. 2026-05-11 Registered tool in `apps/studio/sanity.config.ts` as `"Import Job Description"`
- [x] G. 2026-05-11 Studio typecheck PASS. Studio build PASS.

### Session Review — 2026-05-11 (Careers Issues)

#### Issue 1 — Job card click handlers

**Root cause:** `<script is:inline define:vars={{ JOBS }}>` causes Astro to wrap the entire script in `(function(){ const JOBS=[...]; ... })()`. Three functions were defined inside the IIFE — `openJobModal`, `closeJobModal`, `updateFileLabel` — but called from HTML `onclick`/`onchange` attributes which look in global (`window`) scope only.

**Fix:** Added three window assignment lines at the end of the script block (before `</script>`):

```javascript
window.openJobModal = openJobModal;
window.closeJobModal = closeJobModal;
window.updateFileLabel = updateFileLabel;
```

**How verified:** `pnpm --filter web build` PASS. `grep` of `dist/client/careers/index.html` confirmed all three assignments present at lines 229–231.

**Files changed:** `apps/web/src/pages/careers.astro` (3 lines added)

---

#### Issue 2 — Sanity Studio DocxImportTool

**What was built:** `apps/studio/tools/DocxImportTool.tsx` — custom Sanity Studio tool that:

- Accepts `.docx` file upload via file input
- Parses docx in browser: `JSZip.loadAsync(buffer)` → `word/document.xml` → `DOMParser` → `<w:p>`/`<w:t>` text extraction
- Identifies sections by markers: About the Role, Responsibilities, Requirements, Why Join Us
- Detects track from filename: `teletherapy`/`online`/`remote` → `teletherapy`; `onsite`/`geriatric`/`facility` → `facility`
- Review panel: editable title, location, employment type, track dropdown, about-role preview (300 chars), duty/req/offer counts
- `client.create()` creates `jobPosting` document as draft (`_id: drafts.UUID`)
- Success state with link to draft in Studio + "Import Another" button

**Dependencies added:** `jszip@^3.10.1`, `@types/jszip@^3.4.1`

**How verified:** `pnpm --filter studio typecheck` PASS (0 errors). `pnpm --filter studio build` PASS.

**Files changed:**

- `apps/studio/tools/DocxImportTool.tsx` (new, ~280 lines)
- `apps/studio/sanity.config.ts` (+2 lines: import + tool registration)
- `apps/studio/package.json` (+2 lines: jszip deps)

---

## Re-fix Items 4 & 5 — 2026-05-11 [x] COMPLETE 2026-05-11

### Steps

- [x] A. 2026-05-11 Investigated Item 4: confirmed `<script is:inline>` in index.astro was outside `</BaseLayout>` — renders after `</body></html>` in compiled output; all other pages place script inside BaseLayout
- [x] B. 2026-05-11 Investigated Item 5: confirmed `logo-white-trans.png` exists in `design-source/assets/` but was never copied to `apps/web/public/assets/`; Footer.astro referenced `logo-white.png` (opaque bg) throughout
- [x] C. 2026-05-11 Fix Item 4: moved `</BaseLayout>` to after `</script>`, removed `matchMedia('(hover: hover)')` gate
- [x] D. 2026-05-11 Fix Item 5: copied `design-source/assets/logo-white-trans.png` → `apps/web/public/assets/logo-white-trans.png`; updated Footer.astro line 25
- [x] E. 2026-05-11 Build PASS (all routes, 0 errors)
- [x] F. 2026-05-11 Parity check PASS (1 pre-existing warning on `<a>` tag count, EXIT 0)
- [x] G. 2026-05-11 Confirmed compiled dist/client/index.html: `mouseenter` inside `</main>`, `</body>`, `</html>` — script is in body ✓; `logo-white-trans` in footer HTML ✓

### Session Review — 2026-05-11 (Re-fix Items 4 & 5)

#### Item 4 — Router hover (re-fix)

**Root cause:** `<script is:inline>` in index.astro was placed AFTER `</BaseLayout>` (line 2191), causing Astro to render it after `</body></html>` in the compiled HTML. Scripts placed after `</html>` have unreliable timing. All other pages (about.astro, patients.astro) correctly place the script INSIDE `</BaseLayout>` as the last element in the slot. Additionally, the `matchMedia('(hover: hover)')` gate was preventing listener registration in some environments (touch-capable laptops, certain browsers).

**Fix:**

- Moved `</BaseLayout>` to after the closing `</script>` tag — script now renders inside `<body>` before `</main>`
- Removed the `matchMedia` gate: always attach `mouseenter` and `mouseleave` listeners (mouseenter doesn't fire on pure touch devices, so ungated is safe)

**How verified:** `pnpm --filter web build` PASS. `grep` of dist/client/index.html confirmed: `mouseenter` appears before `</main>`, `</body>`, `</html>`.

**Files changed:** `apps/web/src/pages/index.astro` (3 lines: `</BaseLayout>` moved, 2 lines of matchMedia removed)

---

#### Item 5 — Footer logo (re-fix)

**Root cause:** Previous session concluded "logo-white.png is RGBA transparent — correct" via Python PNG header analysis. That was wrong. The real issue: `logo-white-trans.png` exists in `design-source/assets/` (the transparent-background version) but was NEVER copied to `apps/web/public/assets/`. Footer.astro referenced `logo-white.png` throughout, which has an opaque white background — visible as a white box on the dark `--navy-deep` footer.

**Fix:**

- Copied `design-source/assets/logo-white-trans.png` → `apps/web/public/assets/logo-white-trans.png`
- Updated `apps/web/src/components/ui/Footer.astro` line 25: `/assets/logo-white.png` → `/assets/logo-white-trans.png`

**How verified:** Asset file confirmed present (24426 bytes). `grep` of dist/client/index.html confirms `logo-white-trans` in footer markup.

**Files changed:** `apps/web/src/components/ui/Footer.astro` (1 line), `apps/web/public/assets/logo-white-trans.png` (new file)

---

### Place 4 providers images — 2026-05-12 [x] COMPLETE 2026-05-12

Replace Unsplash placeholder URLs on providers.astro with project-owned JPGs. Replace testimonial avatar gradient div with img tag.

- [x] A. 2026-05-12 Pulled 4 providers-\*.jpg from origin/main (were in design-source/assets/, not local)
- [x] B. 2026-05-12 Copied all 4 to apps/web/public/images/
- [x] C. 2026-05-12 Updated providers.astro — .h98-bg > img → /images/providers-hero.jpg
- [x] D. 2026-05-12 Updated providers.astro — .l422-card:nth-child(1) img → /images/providers-track-tele.jpg (Teletherapy card)
- [x] E. 2026-05-12 Updated providers.astro — .l422-card:nth-child(2) img → /images/providers-track-facility.jpg (Facility-Based card)
- [x] F. 2026-05-12 Replaced .t37-avatar div (testimonials[0]) with <img> tag; alt="" role="presentation"
- [x] G. 2026-05-12 Added FTC disclosure <small> below t37-meta for testimonial [0]
- [x] H. 2026-05-12 pnpm --filter web build — PASSED (all routes, 0 errors); all 4 images in dist/client/images/

### Session Review — 2026-05-12 (Providers images)

**What was done:** Wired 4 project-owned JPGs into providers.astro, replacing Unsplash placeholders. Replaced the gradient-placeholder `<div class="t37-avatar t37-avatar-init">` for testimonial [0] with a proper `<img>` tag. Added FTC "Image for representation" disclosure.

**Files changed:**

- `apps/web/public/images/providers-hero.jpg` (new)
- `apps/web/public/images/providers-track-tele.jpg` (new)
- `apps/web/public/images/providers-track-facility.jpg` (new)
- `apps/web/public/images/providers-testimonial-avatar.jpg` (new)
- `apps/web/src/pages/providers.astro` — 3 img src replacements, 1 div→img swap, 1 FTC disclosure added

**Implementation notes:**

- Task spec had facility/tele mapped to wrong nth-child selectors; confirmed DOM order and swapped (`:nth-child(1)` = Teletherapy, `:nth-child(2)` = Facility-Based)
- Testimonial [0] (FB, Facility-Based) gets the avatar photo; testimonial [1] (TT, Teletherapy) stays as gradient placeholder
- FTC disclosure: `<small style="display:block;font-size:12px;color:#9CA3AF;margin-top:4px;">Image for representation</small>` after t37-meta div
- No CSS classes renamed, no DOM restructured, no other HTML touched

**Verification:** Build PASS — all routes, 0 errors. All 4 files confirmed in dist/client/images/ ✓

---

### Wire 13 homepage images — 2026-05-12 [x] COMPLETE 2026-05-12

Replace all Unsplash placeholder URLs on the homepage with project-owned JPGs.
Commit: c5dbfef — branch feat/homepage-images → merged to main → pushed → Cloudflare auto-deploying

- [x] A. 2026-05-12 Downloaded all 13 home-\*.jpg from GitHub remote to design-source/assets/
- [x] B. 2026-05-12 Created apps/web/public/images/ and copied all 13 JPGs there
- [x] C. 2026-05-12 Updated index.astro — hero img src fallback → /images/home-hero.jpg
- [x] D. 2026-05-12 Updated index.astro — 3 router .r-wide-image bg URLs (communities, patients, providers)
- [x] E. 2026-05-12 Updated index.astro — 2 .twoways-card-bg URLs (tele, facility)
- [x] F. 2026-05-12 Updated index.astro — 4 .l349-img bg URLs (depression, grief, ptsd, relationships)
- [x] G. 2026-05-12 Updated index.astro — 2 .testimonial-avatar bg URLs + FTC "Image for illustration" disclosure
- [x] H. 2026-05-12 Updated index.astro — .provider-bg Sanity fallback → /images/home-provider-bg.jpg
- [x] I. 2026-05-12 pnpm --filter web build — PASSED (17 routes, 0 errors); all 13 images in dist/client/images/

### Session Review — 2026-05-12

**What was done:** Wired 13 project-owned JPGs into the homepage, replacing all Unsplash placeholder URLs.

**Files changed:**

- `apps/web/public/images/home-*.jpg` (13 new files)
- `apps/web/src/pages/index.astro` — 13 URL replacements, 2 FTC disclosure `<p>` tags added, placeholder initials removed

**Implementation notes:**

- Hero: `src` fallback → `/images/home-hero.jpg`; Sanity URL still takes precedence
- Router cards (3): `.r-wide-image` inline bg-image updated
- Two Ways (2): `.twoways-card-bg` inline bg-image updated
- Conditions (4): `.l349-img` inline background updated
- Testimonials (2): `.testimonial-avatar` bg updated; `<p style="font-size:11px;color:#9CA3AF;...">Image for illustration</p>` added after each `.testimonial-attribution`
- Provider bg: Sanity `??` fallback updated
- No CSS classes renamed, no DOM restructured, no object-fit/position CSS touched

**Verification:** Build PASS — 17 routes, 0 errors. All 13 files in dist/client/images/ ✓

**Issues:** Review section accidentally written to wrong todo.md (byt-website project dir instead of repo). Corrected in /post.

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

- Task spec had facility/tele mapped to wrong nth-child selectors (Lesson 17 applies); confirmed DOM order: `:nth-child(1)` = Teletherapy, `:nth-child(2)` = Facility
- All slots already had `<img>` tags — no placeholder div → img swaps needed
- Sanity ternary structure preserved: `src={sanityVar ?? '/images/filename.jpg'}`
- No CSS classes renamed, no DOM restructured, no other HTML touched

**Verification:** Build PASS — 17 routes, 0 errors. All 7 files confirmed in dist/client/images/ ✓

**Issues:** Task review initially written to wrong tasks/ directory (/home/personal/projects/byt-website/tasks/ instead of repo). Corrected before commit.
