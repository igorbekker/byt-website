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

- **Last work:** 2026-05-11 — Careers click handler fix (define:vars IIFE) + Studio DocxImportTool
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
