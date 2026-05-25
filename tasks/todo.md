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

- **Last work:** 2026-05-25 — Add GA4 direct tag to BaseLayout.astro
- **Current issues:** None
- **Detailed history:** See `tasks/todo-archive.md`

---

## Add GA4 direct tag — 2026-05-25 [x] COMPLETE 2026-05-25

Branch: `main`

- [x] READ — `apps/web/src/layouts/BaseLayout.astro` — confirmed viewport meta at line 95
- [x] EDIT — inserted GA4 loader script + inline config script immediately after viewport meta (lines 96–101)
- [x] VERIFY — `grep -n "gtag\|G-JW2" BaseLayout.astro` → lines 96, 99, 100, 101 ✓

### Session Review — 2026-05-25 (Add GA4 direct tag)

**What was built:** Added direct GA4 tag for `G-JW2XB9Q7B3` to `BaseLayout.astro` immediately after the viewport `<meta>` tag. Two script tags: async gtag.js loader and inline init (`gtag('js', new Date())` + `gtag('config', 'G-JW2XB9Q7B3')`). Placed before all other scripts — before description meta, before GTM block.

**Files changed:**

- `apps/web/src/layouts/BaseLayout.astro` — 7 lines inserted after viewport meta (lines 96–102)

**Verification:**

- `grep -n "gtag\|G-JW2"` → lines 96, 99, 100, 101 ✓

**Issues:** None. No user corrections this session.

---

## Remove GTM consent defaults script — 2026-05-25 [x] COMPLETE 2026-05-25

Branch: `main`

- [x] READ — `apps/web/src/layouts/BaseLayout.astro` — confirmed consent defaults block at lines 96–107
- [x] EDIT — deleted entire `<script is:inline>` block containing `gtag('consent', 'default', {...})` with analytics_storage, ad_storage, ad_user_data, ad_personalization
- [x] VERIFY — `grep -n "consent\|gtag" BaseLayout.astro` → 0 results ✓ (GTM scripts untouched)

### Session Review — 2026-05-25 (Remove GTM consent defaults script)

**What was done:** Deleted the `<script is:inline>` consent defaults block (lines 96–107) from `BaseLayout.astro`. The block initialized `window.dataLayer`, declared `gtag()`, and called `gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' })`.

**GTM scripts untouched:** The conditional GTM block at lines 148–156 (loader + `window.dataLayer` init) remains unchanged.

**Files changed:**

- `apps/web/src/layouts/BaseLayout.astro` — 11 lines deleted (consent defaults script block)

**Verification:**

- `grep -n "consent\|gtag" BaseLayout.astro` → 0 results ✓

**Issues:** None. No user corrections this session.

---

## Add GTM consent defaults script — 2026-05-25 [x] COMPLETE 2026-05-25

Branch: `main`

- [x] READ — `apps/web/src/layouts/BaseLayout.astro` — confirmed GTM block at lines 148–156; charset/viewport at lines 94–95
- [x] EDIT — inserted `<script is:inline>` consent defaults block immediately after viewport meta (line 95), before all GTM code
- [x] VERIFY — `grep -n "consent\|dataLayer\|GTM\|gtm" BaseLayout.astro | head -20` → consent at lines 97–99, GTM at line 148 ✓

### Session Review — 2026-05-25 (Add GTM consent defaults script)

**What was built:** Added a `gtag('consent', 'default', {...})` script block to `BaseLayout.astro` immediately after the viewport `<meta>` tag (line 95), before any GTM-related code. This establishes consent defaults (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` all set to `granted`) before the GTM container loads, satisfying Google's Consent Mode v2 requirement that consent defaults fire before GTM initialises.

**Placement:** Lines 96–105 (new `<script is:inline>` block). GTM loader remains at line 148. Order: consent defaults → GTM.

**Files changed:**

- `apps/web/src/layouts/BaseLayout.astro` — 9 lines inserted after viewport meta

**Verification:**

- `grep -n "consent\|dataLayer\|GTM\|gtm"` → consent at lines 97–99, GTM at line 148 ✓ (consent before GTM)

**Issues:** None. No user corrections this session.

---

## Remove TEMP GA4 direct test snippet — 2026-05-25 [x] COMPLETE 2026-05-25

Branch: `main`

- [x] EDIT — removed all 12 lines between and including `<!-- TEMP GA4 DIRECT TEST -->` and `<!-- END TEMP GA4 DIRECT TEST -->` from `BaseLayout.astro`
- [x] VERIFY — `grep -n "gtag\|GA4 Direct\|TEMP GA4" BaseLayout.astro` → 0 results ✓

### Session Review — 2026-05-25 (Remove TEMP GA4 direct test snippet)

**What was done:** Deleted the temporary GA4 direct tag (`G-JW2XB9Q7B3`) that was injected in the previous commit for data-flow testing. All lines removed including both comment markers.

**Files changed:**

- `apps/web/src/layouts/BaseLayout.astro` — 12 lines deleted

**Verification:**

- `grep -n "gtag\|GA4 Direct\|TEMP GA4"` → 0 results ✓

**Issues:** None. No user corrections this session.

---

## Add TEMP GA4 direct test snippet — 2026-05-25 [x] COMPLETE 2026-05-25

Branch: `main`

- [x] READ — `apps/web/src/layouts/BaseLayout.astro` — confirmed GTM block at lines 138–146
- [x] EDIT — inserted `<!-- TEMP GA4 DIRECT TEST -->` snippet immediately after GTM block; added `is:inline` to the gtag config script (required for Astro); no existing code removed or modified
- [x] VERIFY — `grep -n "G-JW2XB9Q7B3" apps/web/src/layouts/*.astro` → lines 149 and 154 ✓

### Session Review — 2026-05-25 (TEMP GA4 direct test snippet)

**What was built:** Injected a direct GA4 tag (`G-JW2XB9Q7B3`) into `BaseLayout.astro` immediately after the existing GTM block, as a temporary test to verify GA4 data flow before GTM is fully configured. Two script tags added: the async gtag.js loader and the inline `gtag('config', ...)` init. The inline script uses `is:inline` per Astro requirements.

**Nothing removed:** All existing GTM code (lines 138–146) is untouched.

**Files changed:**

- `apps/web/src/layouts/BaseLayout.astro` — 8 lines added after GTM block (lines 148–155)

**Verification:**

- `grep -n "G-JW2XB9Q7B3"` → lines 149 and 154 ✓

**Issues:** None. No user corrections this session.

---

## Add GA4 dataLayer.push() event tracking — 2026-05-25 [x] COMPLETE 2026-05-25

Branch: `main`

- [x] READ — all 8 target files (ModalForms, AudienceRouter, ContactPage, CareersPage, ResidentReferralPage, intake, Footer, NewsletterBlock)
- [x] ModalForms.astro — added `window.dataLayer = window.dataLayer || []` init; openModal: form_start + modal_open; closeModal: form_start reset + modal_close; handleSubmit success: generate_lead; else: form_error server; catch: form_error network; bottom: CTA click + phone/email click delegated listeners
- [x] AudienceRouter.astro — audience_route push in click handler (fires only on user click, not resize/init)
- [x] ContactPage.astro — generate_lead on success, form_error in catch, form_start focusin listener
- [x] CareersPage.astro — generate_lead + form_error for career_job and career_general; form_start for general form + job modal
- [x] ResidentReferralPage.astro — generate_lead on success, form_error server in else, form_error network in catch, form_start focusin listener
- [x] intake.astro — generate_lead on success, form_error in catch, form_start focusin listener
- [x] Footer.astro — newsletter_subscribe on success, form_error in catch (TypeScript-style casts)
- [x] NewsletterBlock.astro — newsletter_subscribe on success, form_error in catch (TypeScript-style casts)
- [x] VERIFY — `grep -rn "dataLayer.push" apps/web/src/ | head -60` → 25 plain + 5 TypeScript-cast = 30 total pushes ✓
- [x] BUILD — `pnpm --filter web build` → 20 pages, 0 errors ✓

### Session Review — 2026-05-25 (GA4 dataLayer.push() event tracking)

**What was built:** Added 30 dataLayer.push() calls across 8 files covering all 8 event types from the spec. No HTML structure, CSS, or existing functionality was changed — only push calls added alongside existing code.

**Event types covered:**

| Event                                     | Count      | Files                                                                                         |
| ----------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| `generate_lead`                           | 7          | ModalForms (book+refer), ContactPage, CareersPage (job+general), ResidentReferralPage, intake |
| `newsletter_subscribe`                    | 2          | Footer, NewsletterBlock                                                                       |
| `form_error` (server+network)             | 11         | All form files                                                                                |
| `modal_open` / `modal_close`              | 2          | ModalForms                                                                                    |
| `cta_click` (delegated)                   | 1 listener | ModalForms (global, runs on every page)                                                       |
| `phone_click` / `email_click` (delegated) | 1 listener | ModalForms (global)                                                                           |
| `audience_route`                          | 1          | AudienceRouter                                                                                |
| `form_start`                              | 6          | All standalone page forms + modals                                                            |

**TypeScript cast pattern** (`(window as any).dataLayer = (window as any).dataLayer || []).push(...)`) used in Footer.astro, NewsletterBlock.astro, and AudienceRouter.astro (TypeScript `<script>` blocks). Plain `window.dataLayer.push()` used in all `is:inline` blocks. Safety init `window.dataLayer = window.dataLayer || [];` added at top of ModalForms.astro script (runs on every page, last in body — safe because all pushes fire on user interaction after full page load).

**Files changed:**

- `apps/web/src/components/ui/ModalForms.astro`
- `apps/web/src/components/home/AudienceRouter.astro`
- `apps/web/src/components/pages/ContactPage.astro`
- `apps/web/src/components/pages/CareersPage.astro`
- `apps/web/src/components/pages/ResidentReferralPage.astro`
- `apps/web/src/pages/intake.astro`
- `apps/web/src/components/ui/Footer.astro`
- `apps/web/src/components/blog/NewsletterBlock.astro`

**Verification:**

- `grep -rn "dataLayer.push" apps/web/src/ | head -60` → 25 results ✓ (+ 5 TypeScript-cast pushes in TS files)
- `pnpm --filter web build` → 20 pages, 0 errors ✓

**Issues:** None. No user corrections this session.

---
