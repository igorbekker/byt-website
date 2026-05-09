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

- **Last work:** 2026-05-09 — Strip global.css-owned selectors from 7 System A pages (commit b22a085, main 4ef6cdd)
- **Current issues:** None open
- **Detailed history:** See `tasks/todo-archive.md`

---

## Token Registry — 2026-05-08 [x] COMPLETE 2026-05-08

### Steps

- [x] A. 2026-05-08 Read `apps/web/src/styles/global.css` — extracted all 35 System A `:root` tokens
- [x] B. 2026-05-08 Read all 16 files in `design-source/pages/` — grepped `var(--token)` consumption per token
- [x] C. 2026-05-08 Created `docs/token-registry.md` — token table, orphan/eliminated sections, summary

### Session Review — 2026-05-08 (Token Registry)

**What was built:** `docs/token-registry.md` — complete registry of all 35 System A CSS tokens defined in `global.css :root`. Documentation only.

**Contents:**

- Token table: Token | Value | Referenced by (design-source/pages) | Status
- 22 Active tokens consumed via `var()` in System A pages
- 7 Orphaned — base styles only (not in design-source pages but used in global.css element rules: body, h1–h5, .btn)
- 4 Orphaned — unused (not in design-source pages and not in global.css element rules — blog Astro components only)
- 13 Eliminated `--byt-*` tokens (Providers/Communities System B, per DEC-002)
- Page abbreviations, status key, notes on --navy-footer anomaly and typography tokens

**Key findings:**

- `--navy-footer` defined in nearly every page's `:root` block but NEVER consumed via `var()` — footer uses `var(--navy-deep)` instead
- Typography tokens (`--font-body`, `--font-heading`) not consumed via `var()` in design-source — pages use literal font-family values
- Providers/Communities (System B) DO use some System A tokens (`--coral`, `--r-btn`, `--r-card`, `--r-pill`, `--shadow-*`, `--t-hover`) — mixed usage, full conversion required per DEC-002

**How verified:** Grep methodology: `var(--token)` pattern (not just definition) to distinguish usage from declaration.

---

## Governance File Alignment — 2026-05-08 [x] COMPLETE 2026-05-08

### Steps

- [x] A. 2026-05-08 Updated CLAUDE.md — rules 5+6 (strip shared selectors, no --byt-\*), renumbered 7–11, env var section added
- [x] B. 2026-05-08 Updated AGENT_builder.md — Pre-Build step 6 added (strip shared selectors), Post-Build step 6 replaced
- [x] C. 2026-05-08 Updated AGENT_qa.md — Visual Parity: global.css selector grep check added
- [x] D. 2026-05-08 Updated SKILL_code-building.md — DO NOT list +2, Pre-Commit Checklist +2
- [x] E. 2026-05-08 Updated SKILL_quality-assurance.md — Colors line updated
- [x] F. 2026-05-08 Updated design-parity-check.sh — CHECK 7 (cascade conflict) + CHECK 8 (--byt-\* tokens)
- [x] G. 2026-05-08 Updated tasks/lessons.md — consolidated 18 → 14; new Lesson 4 (CSS single owner)
- [x] H. 2026-05-08 Verified AGENT_docs.md + SKILL_documentation.md — all 3 README.md files exist, references accurate, no changes needed

### Session Review — 2026-05-08 (Governance file alignment)

**What was built:** 8 governance files updated to align with DEC-002 CSS architecture. No code changes to Astro pages.

**Files updated (8):**

- `CLAUDE.md` — Build Method: added rules 5 (strip shared selectors) + 6 (no --byt-\*), renumbered 7–11; Environment section: added env-registry.md + deploy-runbook.md references
- `.claude/agents/AGENT_builder.md` — Pre-Build step 6 (strip shared selectors before paste); Post-Build step 6 (verify zero owned selectors, with RB-001 link)
- `.claude/agents/AGENT_qa.md` — Visual Parity: grep check for bare global.css-owned selectors
- `.claude/skills/SKILL_code-building.md` — DO NOT: +2 rules (no owned selector redefinition, no --byt-\*); Pre-Commit: +2 checks
- `.claude/skills/SKILL_quality-assurance.md` — Colors line updated to include --byt-\* prohibition
- `scripts/design-parity-check.sh` — CHECK 7: HARD FAIL on global.css-owned selectors in page style block; CHECK 8: HARD FAIL on --byt-\* tokens
- `tasks/lessons.md` — consolidated 18 → 14 (merged 5+6+7, 9+10+11, absorbed 8 into new Lesson 4); new Lesson 4 is CSS single owner rule

**Files verified, no changes needed (2):**

- `.claude/agents/AGENT_docs.md` — docs/decision-log/README.md, docs/obstacle-log/README.md, docs/runbooks/README.md all exist ✓
- `.claude/skills/SKILL_documentation.md` — no specific file path references, format-only guidance, no stale refs

**How verified:** Script syntax OK (`bash -n`). Lesson count = 14. Build run pending.

---

## CSS Governance Docs — 2026-05-08 [x] COMPLETE 2026-05-08

### Steps

- [x] A. 2026-05-08 Created `docs/decision-log/DEC-002-css-single-system.md` (Igor specified DEC-001; renamed DEC-002 because DEC-001-schema-sharing.md already exists)
- [x] B. 2026-05-08 Updated `docs/decision-log/INDEX.md` — added DEC-002 row
- [x] C. 2026-05-08 Updated `docs/decision-log/README.md` — added DEC-002 row
- [x] D. 2026-05-08 Created `docs/css-architecture.md`
- [x] E. 2026-05-08 Created `docs/runbooks/RB-001-css-conflict-resolution.md`
- [x] F. 2026-05-08 Created `docs/runbooks/RB-002-new-page-build.md`
- [x] G. 2026-05-08 Updated `docs/runbooks/README.md` — added RB-001 and RB-002 to index
- [x] H. 2026-05-08 Created `docs/env-registry.md`
- [x] I. 2026-05-08 Created `docs/sanity-schema-registry.md`
- [x] J. 2026-05-08 Created `docs/deploy-runbook.md`
- [x] K. 2026-05-08 Created `docs/design-source-inventory.md`

### Session Review — 2026-05-08 (CSS governance docs)

**What was built:** 7 new docs + 3 updated index files. Documentation only — no code changes.

**Files created (7):**

- `docs/decision-log/DEC-002-css-single-system.md` — approved decision: System A canonical, System B eliminated
- `docs/css-architecture.md` — full selector ownership contract, build-method CSS handling guide, token reference
- `docs/runbooks/RB-001-css-conflict-resolution.md` — step-by-step CSS conflict identification and resolution
- `docs/runbooks/RB-002-new-page-build.md` — end-to-end new page build procedure (9 steps)
- `docs/env-registry.md` — all env vars, purpose, scope, SANITY_DEPLOY_TOKEN pattern
- `docs/sanity-schema-registry.md` — all 23 schemas (11 singletons, 6 documents, 6 objects) with consuming pages and seed status
- `docs/design-source-inventory.md` — all design-source files, page mapping, build status, Providers/Communities marked pending DEC-002 rebuild

**Files updated (3):**

- `docs/decision-log/INDEX.md` — DEC-002 row added
- `docs/decision-log/README.md` — DEC-002 row added
- `docs/runbooks/README.md` — RB-001 and RB-002 rows added

**Flag:** Igor specified filename `DEC-001-css-single-system.md` but `DEC-001-schema-sharing.md` already existed. Created as `DEC-002-css-single-system.md`.

**How verified:** All files present — `ls docs/decision-log/`, `ls docs/runbooks/`, `ls docs/*.md` confirmed.

---

## Page Fixes — Issue 1 (patients layout) + Issue 2 (homepage nav CTAs) — 2026-05-08

### Issue 2 — Homepage duplicate mobile menu (CONFIRMED BUG)

- [x] A. 2026-05-08 Identified: `index.astro` lines 1782–1817 have duplicate `<div class="mobile-menu" id="mobileMenu">` inside `<main>` — leftover from design-source HTML not removed when Nav.astro took over
- [x] B. 2026-05-08 Removed lines 1782–1817 from `apps/web/src/pages/index.astro`
- [x] C. 2026-05-08 Build PASS (17 routes). dist/client/index.html: 1 `id="mobileMenu"` ✓
- [x] D. 2026-05-08 Committed 1e189b6, pushed to main, Cloudflare auto-deploy triggered

### Issue 1 — Patients layout (INVESTIGATION INCONCLUSIVE)

- [x] A. 2026-05-08 Git log: no changes to patients.astro, global.css, BaseLayout.astro, or Nav.astro since May 5 confirmation
- [x] B. 2026-05-08 CSS analysis: patients.astro `<style is:global>` has `.nav { height: 84px }` (0,1,0) vs Nav.astro scoped `height: 126px` (0,2,0) — Nav.astro wins on all pages
- [x] C. 2026-05-08 Dist output confirmed: correct HTML structure (6 sections), correct CSS loading order
- [x] D. 2026-05-08 Parity check: 0 errors (run in prior session)
- [!] E. Root cause not identified via code analysis — waiting for Igor's visual description of what specifically looks broken

---

## Session Review — 2026-05-08 (Issue 2 fixed; Issue 1 investigation)

### What was done

**Issue 2 — Homepage duplicate mobile menu (FIXED):**

- Removed `<div class="mobile-menu" id="mobileMenu">` (lines 1782–1817) from `apps/web/src/pages/index.astro`
- This was a leftover from design-source HTML not removed when Nav.astro took over mobile navigation
- Resulted in duplicate `id="mobileMenu"` in rendered DOM (2 → 1)
- Root cause: when index.astro was initially built from Homepage.html, the full HTML including nav + mobile menu was copied verbatim, but only nav is omitted when BaseLayout provides it — mobile menu HTML was overlooked

**Issue 1 — Patients layout (INVESTIGATION INCONCLUSIVE):**

- Git log: 0 changes to patients.astro, global.css, BaseLayout.astro, Nav.astro since May 5 confirmation (`git diff 82c00e9 apps/web/src/pages/patients.astro` → 0 lines)
- CSS specificity analysis: patients.astro `<style is:global>` has `.nav { height: 84px }` (0,1,0) vs Nav.astro scoped `height: 126px` (0,2,0) — Nav.astro wins on all pages
- Parity check: 0 errors
- Dist HTML: correct 6-section structure, CSS loading order correct
- No CSS regression identified. Page was build-pass verified (never visually confirmed)
- Awaiting Igor's description of what specifically looks broken to narrow down fix

### Files changed

- `apps/web/src/pages/index.astro` — removed duplicate mobile menu HTML (lines 1782–1817)
- `tasks/todo.md` — this review

### Quality gate

- `pnpm --filter web build` — PASS (17 routes, 0 errors) — 2026-05-08
- `dist/client/index.html`: `id="mobileMenu"` count = 1 ✓

## Page Fix — /providers/ layout mismatch — 2026-05-08

### Root cause

The full rewrite in commit `10794c3` (2026-05-06) copied CSS verbatim from `design-source/pages/Providers.html`. This reverted the `9b505c2` fix that bumped `.btn-secondary` to `.btn.btn-secondary` to win the cascade against `global.css`.

**Cascade conflict:**

- `providers@_@astro.css` (loads first): `.btn-secondary { border-color: var(--byt-navy-deep) }` — specificity 0,1,0
- `BaseLayout.css` (loads second): `.btn { border: 1.5px solid transparent }` — specificity 0,1,0, later → wins

Result: all `.btn btn-secondary` "Apply Now" buttons had transparent/invisible borders.

**Fix:** Changed `.btn-secondary` → `.btn.btn-secondary` (specificity 0,2,0 > 0,1,0) so border-color survives the cascade.

### Steps

- [x] A. 2026-05-08 Identified root cause via cascade analysis of compiled CSS vs global.css
- [x] B. 2026-05-08 Applied fix: `.btn-secondary` → `.btn.btn-secondary` in providers.astro CSS (lines 271–279)
- [x] C. 2026-05-08 Build PASS. Parity check exit 0. Compiled CSS verified: `.btn.btn-secondary{border-color:var(--byt-navy-deep)}` ✓
- [x] D. 2026-05-08 Committed 6544979, pushed to main, deployed

### Session Review — 2026-05-08 (providers fix)

**What was built:** Fixed invisible `.btn-secondary` borders on `/providers/` by bumping CSS specificity from 0,1,0 to 0,2,0.

**How verified:** Build passes, parity check exits 0, compiled CSS contains `.btn.btn-secondary` rule.

**Root cause:** `10794c3` full rewrite copied verbatim from design-source and reverted the `9b505c2` cascade fix. One-line fix: `.btn-secondary` → `.btn.btn-secondary`.

**Files changed:** `apps/web/src/pages/providers.astro` (2 lines changed in CSS block)

**Quality gate:** `pnpm --filter web build` PASS. `scripts/design-parity-check.sh` exit 0.

---

## Phase B Governance Fixes — 2026-05-08 [x] COMPLETE 2026-05-08

### Steps

- [x] A. 2026-05-08 Created `docs/runbooks/README.md` stub (directory existed, only .gitkeep)
- [x] B. 2026-05-08 Created `docs/decision-log/INDEX.md` (mirrors README index, lists DEC-001 accurately)
- [x] C. 2026-05-08 Created `docs/obstacle-log/OBS-013-design-source-modified.md` (P1, resolved)
- [x] D. 2026-05-08 Created `docs/obstacle-log/OBS-014-false-parity-claim.md` (P2, resolved)
- [x] E. 2026-05-08 Updated `docs/obstacle-log/INDEX.md`: added OBS-013/014 rows, total 12→14, P1 5→6, P2 3→4
- [x] F. 2026-05-08 Fixed `SKILL_code-building.md`: added `<style is:global>` exception note to Astro Components section
- [x] G. 2026-05-08 Fixed `scripts/design-parity-check.sh` PAGE_MAP: added privacy.astro and terms.astro
- [x] H. 2026-05-08 Fixed `scripts/design-parity-check.sh` Sanity fallback regex: broadened from `{xyzPage.field}` only to also match `{page.field}`, `{settings.field}`, `{siteSettings.field}`, `{siteConfig.field}`
- [x] I. 2026-05-08 Fixed `SKILL_project-management.md`: replaced dead `backup-pre-op.sh` reference with actual scripts
- [x] J. 2026-05-08 Marked todo.md providers fix step D complete (commit 6544979 had been done but not marked)

### Session Review — 2026-05-08 (Phase B governance fixes)

**What was built:** Documentation and script-only fixes. No page .astro changes.

**Files created (4):**

- `docs/runbooks/README.md` — stub with empty index table
- `docs/decision-log/INDEX.md` — mirrors decision-log README index (DEC-001 listed)
- `docs/obstacle-log/OBS-013-design-source-modified.md` — P1 resolved, 2026-05-04
- `docs/obstacle-log/OBS-014-false-parity-claim.md` — P2 resolved, 2026-05-05

**Files edited (5):**

- `docs/obstacle-log/INDEX.md` — OBS-013/014 rows added, totals updated
- `.claude/skills/SKILL_code-building.md` — `<style is:global>` contradiction resolved
- `.claude/skills/SKILL_project-management.md` — dead `backup-pre-op.sh` reference replaced
- `scripts/design-parity-check.sh` — PAGE_MAP: +privacy.astro, +terms.astro; CHECK 2 regex broadened
- `tasks/todo.md` — providers fix step D marked complete; this review

**How verified:**

- `bash -n scripts/design-parity-check.sh` — syntax OK
- No build required (no .astro or .ts changes)

**Issues discovered during execution:**

- `docs/decision-log/` and `docs/runbooks/` already existed (not missing as reported). Created INDEX.md and README.md as planned, adjusted content to reflect actual state (DEC-001 already present).
- `docs/obstacle-log/README.md` has its own index table that only goes to OBS-007 — out of sync with INDEX.md (which goes to OBS-012, now 014). Not in scope of this task; flagged for future cleanup.

---

## DEC-002 Phase 2 — Rebuild providers.astro (System A) — 2026-05-08 [x] COMPLETE 2026-05-08

### Steps

- [x] A. 2026-05-08 Converted design-source/pages/Providers.html from System B → System A tokens (f36c3e7)
- [x] B. 2026-05-08 Converted design-source/pages/Communities.html from System B → System A tokens (f36c3e7)
- [x] C. 2026-05-08 Added Relume-compat button variants (.btn-secondary, .btn-secondary-alt, .btn-sm, .btn-link) to global.css
- [x] D. 2026-05-08 Rebuilt apps/web/src/pages/providers.astro from converted Providers.html
- [x] E. 2026-05-08 Deleted public test files (providers-check.html, communities-check.html)
- [x] F. 2026-05-08 Fixed parity check script: added ^[[:space:]]\* anchors + scoped body rule detection
- [x] G. 2026-05-08 Parity check PASS. Build PASS (17 routes, 0 errors).
- [x] H. 2026-05-08 Commit Phase 2 (f9bfc38)
- [x] I. 2026-05-08 Push to main — Cloudflare auto-deploy triggered
- [x] J. 2026-05-08 Rebuild communities.astro (Phase 3) — System B → System A complete

### Session Review — 2026-05-08 (DEC-002 Phase 2 — providers.astro)

**What was built:** Complete rebuild of `apps/web/src/pages/providers.astro` from System B → System A. Style block stripped of all System B reset/global rules. All tokens unprefixed System A. Sanity vars wired with `??` fallbacks.

**Key changes from prior System B version:**

- Style block: removed `:root`, bare `body`, bare `h1-h5`, `.btn` base, all `.btn-primary/.btn-secondary/.btn-link` variants — all now owned exclusively by global.css
- `.btn-secondary`, `.btn-secondary-alt`, `.btn-sm`, `.btn-link` moved to global.css (enables parity check to pass)
- `.btn:hover{transform:translateY(-1px)}` kept as page-specific hover lift
- Nav/mobile-cta-bar CSS kept in page style (consistent with all System A pages)
- All Apply Now `<button>` elements changed to `<a href="/careers/">` for proper routing
- Body: 6 content sections only (Header98 → Cta36). Nav/Footer/MobileCTABar HTML excluded (BaseLayout provides).
- All `var(--byt-*)` tokens replaced with System A equivalents
- Sanity wiring: heroHeading, heroSubhead, all tracks/handles/quals/cta text fields, testimonials[0-1]

**Parity check fix (scripts/design-parity-check.sh):**

- CHECK 7 regex updated: `^[[:space:]]*` anchors on all selector patterns (prevents compound/descendant false positives)
- body{} detection changed to grep -P for typography-property conflicts only (not padding-bottom)
- Before fix: 40 false positive hits blocked commit. After fix: 0 hits. EXIT 0.

**False positives eliminated:**

- `.h98 h1{`, `.l422-head h2{`, etc. — scoped to section containers, not bare heading rules
- `.mobile-cta-bar .btn{`, `.mobile-menu-actions .btn{` — scoped compound selectors
- `.l374-card .body{` — CSS class `.body`, not element `body`
- `.l506-head .eyebrow{` — scoped to section

**Files changed (4):**

- `apps/web/src/pages/providers.astro` — complete rebuild (~550 lines)
- `apps/web/src/styles/global.css` — added 13 lines of Relume button variants
- `scripts/design-parity-check.sh` — CHECK 7 precision fix
- `apps/web/public/` — deleted providers-check.html + communities-check.html

**How verified:** `scripts/design-parity-check.sh` EXIT 0. `pnpm --filter web build` PASS (17 routes, 0 errors) — 2026-05-08.

---

### Session Review — 2026-05-08 (DEC-002 Phase 3 — communities.astro)

**What was built:** Complete rebuild of `apps/web/src/pages/communities.astro` from System B → System A. Same method as providers.astro: full style block replaced with System A CSS from design-source/pages/Communities.html, global.css-owned selectors stripped, Sanity wiring preserved from prior version with CTA button→anchor fixes.

**Key changes from prior System B version:**

- Style block: stripped `:root`, bare `body`, bare `h1-h6`, `.btn` base, `.btn-primary/.btn-secondary/.btn-secondary-alt/.btn-link` variants — all owned by global.css
- `.btn:hover{transform:translateY(-1px)}` kept as page-specific hover lift
- Nav/mobile-menu/mobile-cta-bar CSS kept in page `<style is:global>` (established System A pattern)
- Hero CTA: `<button onclick="openModal('refer')">` → `<a href={page?.heroCta?.href ?? '#cta'}>`
- Cta25 primary CTA: `<button onclick="openModal('refer')">` → `<a href={page?.ctaCta?.href ?? '/'}>`
- All Sanity wiring (processSteps, handlesItems, conditionsData[0-10], serviceArea, siteSettings phone) preserved verbatim from prior version
- L505 tab script preserved verbatim with `is:inline`
- No `--byt-*` tokens anywhere in file

**Parity check warnings (benign):**

- `__cf_email__` — Cloudflare email obfuscation infrastructure class, not a design class
- `btn-coral` — present in design-source nav/footer HTML (provided by BaseLayout, not in page content)

**Files changed (1):**

- `apps/web/src/pages/communities.astro` — complete rebuild

**How verified:** `scripts/design-parity-check.sh` EXIT 0 (0 errors, 2 benign warnings). `pnpm --filter web build` PASS (17 routes, 0 errors) — 2026-05-08.

---

## Phase 4 — Careers Sanity Migration — 2026-05-08 [x] COMPLETE 2026-05-08

### Steps

- [x] A. 2026-05-08 Read careers.astro — identified 4 hardcoded job listings (all stale, confirmed by Igor)
- [x] B. 2026-05-08 Read jobPosting.ts schema — confirmed existing fields, identified missing fields
- [x] C. 2026-05-08 Updated jobPosting.ts — added employmentType, aboutRole, duties, requirements, offers fields
- [x] D. 2026-05-08 Updated JOB_POSTINGS_QUERY in queries.ts — added new fields, filter status == "open"
- [x] E. 2026-05-08 Deployed Studio (SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN pnpm exec sanity deploy)
- [x] F. 2026-05-08 Rewrote careers.astro — stripped System B CSS, replaced hardcoded JOBS with Sanity fetch via define:vars, empty state fallback
- [x] G. 2026-05-08 Parity check EXIT 0. Build PASS (complete in 41.74s).
- [x] H. 2026-05-08 Committed 03197ff + pushed to main (feat(careers): migrate job listings to Sanity CMS)

### Session Review — 2026-05-08 (Phase 4 — Careers Sanity Migration)

**What was built:** Migrated careers.astro job listings from 4 hardcoded (stale) entries to dynamic Sanity CMS pull. All 4 existing JDs were stale and were NOT seeded — careers page starts empty until real JDs are entered in Studio.

**Schema changes (`apps/studio/schemas/documents/jobPosting.ts`):**

- Added 5 fields before `order`: `employmentType` (string), `aboutRole` (text), `duties` (array of string), `requirements` (array of string), `offers` (array of string)
- Studio deployed to https://byt-website.sanity.studio/

**Query changes (`apps/web/src/lib/queries.ts`):**

- `JOB_POSTINGS_QUERY`: added `status == "open"` filter, added `employmentType, aboutRole, duties, requirements, offers` to projection

**careers.astro changes:**

- Frontmatter: added `JobPosting` interface, `JOB_POSTINGS_QUERY` import, `Promise.all` fetch for both page + rawJobs, `buildBodyHtml()` helper, `JOBS` mapping array
- CSS: stripped full System B block (`:root`, bare `body`, bare `h1–h4`, `.eyebrow`, `.max-w`, `.fade-up`, all `.btn-*` variants) — owned by global.css
- Script: `<script is:inline define:vars={{ JOBS }}>` — server-side JOBS array injected via Astro define:vars
- Removed hardcoded `const JOBS = [...]` array (4 stale entries, ~143 lines)
- `renderJobs()`: added empty state check — renders "No open positions at this time." when `JOBS.length === 0`

## **How verified:** `scripts/design-parity-check.sh` EXIT 0. `pnpm --filter web build` PASS (complete in 41.74s) — 2026-05-08.

## Strip shared selectors from 7 System A pages — 2026-05-09 [x] COMPLETE 2026-05-09

Per DEC-001 / docs/css-architecture.md. Branch: chore/strip-page-shared-selectors.

### Steps

- [x] A. 2026-05-09 index.astro — strip + verify
- [x] B. 2026-05-09 about.astro — strip + verify
- [x] C. 2026-05-09 patients.astro — strip + verify
- [x] D. 2026-05-09 careers.astro — strip + verify
- [x] E. 2026-05-09 contact.astro — strip + verify
- [x] F. 2026-05-09 privacy.astro — strip + verify
- [x] G. 2026-05-09 terms.astro — strip + verify
- [x] H. 2026-05-09 Build PASS (17 routes, 0 errors)
- [x] I. 2026-05-09 CHECK 7 + CHECK 8 all pages — PASS
- [x] J. 2026-05-09 /pre → commit b22a085 → merge → push main 4ef6cdd → Cloudflare auto-deploy

### Session Review — 2026-05-09 (Strip shared selectors)

**What was built:** Stripped all global.css-owned selectors from 7 System A page `<style is:global>` blocks. Added `scripts/strip-shared-selectors.py` for repeatable enforcement. Fixed pre-existing CHECK 2 violations in privacy.astro and terms.astro (`page.body` → `page?.body ?? []`).

**Style block changes (before → after, rules removed):**

| Page           | Before | After | Delta | Rules removed |
| -------------- | ------ | ----- | ----- | ------------- |
| index.astro    | 2519   | 2287  | -232  | 35            |
| about.astro    | 2670   | 2438  | -232  | 35            |
| patients.astro | 2993   | 2752  | -241  | 37            |
| careers.astro  | 2479   | 2471  | -8    | 2             |
| contact.astro  | 1233   | 1001  | -232  | 35            |
| privacy.astro  | 1933   | 1701  | -232  | 35            |
| terms.astro    | 882    | 750   | -132  | 16            |

**Note:** `body { padding-bottom: 78px }` inside `@media (max-width: 768px)` kept in all pages — page-specific mobile sticky nav offset.

**Note on history:** Previous session (2026-05-08) recorded this as done in a different tasks/todo.md (outside the repo). Commit never reached GitHub. This session confirmed by checking page line counts against expected post-strip values.

**Files changed:** 7 page .astro files, scripts/strip-shared-selectors.py (new).

**Quality gate:** `pnpm --filter web build` PASS. CHECK 7 + CHECK 8 PASS on all 7 pages.

---

## 6-Item Bug Fix + Feature Task — 2026-05-09

### Items

- [x] 1. Set privacyPage lastUpdated in Sanity to "May 4, 2026"
- [x] 2. 2026-05-09 Homepage: "Conditions We Treat" CTAs — fix to match design-source
- [x] 3. 2026-05-09 Providers: "What you need to apply" section (l506 qualifications tabs) — fix to match design-source
- [x] 4. 2026-05-09 Homepage: "Who are you here to help?" hover behavior — desktop hover-to-expand added
- [x] 5. 2026-05-09 Footer logo: investigated — static analysis shows code is correct (white RGBA PNG on --navy-deep bg)
- [x] 6. 2026-05-09 Careers: JD upload script — created, tested, 2 jobPostings created in Sanity

---

### Session Review — 2026-05-09 (Items 2 & 3)

#### Item 2 — Homepage l349 "Conditions We Treat" CTAs

**What was built:**

- `apps/web/src/pages/index.astro` — replaced 4 `<button class="l349-btn-outline" onclick="openModal('book')">` with `<a href="/individual-therapy/" class="l349-btn-outline">Book a session</a>` (done in prior context)
- Replaced 4 `<button class="l349-btn-ghost" onclick="openModal('refer')">…multi-line SVG…</button>` with `<a href="/referral/" class="l349-btn-ghost">Refer a resident <svg…/></svg></a>` (replace_all, all 4 panels)

**Root cause:** Design-source uses `<a>` tags with real hrefs; live site had `<button>` elements with `onclick`. Browser-default button styles conflict with `.l349-btn-*` page-specific CSS.

**How verified:** Build passed. `grep -n "btn-ghost\|openModal('refer')"` confirmed 0 `<button class="l349-btn-ghost">` instances remain in the l349 section.

**Issues:** None.

---

#### Item 3 — Providers l506 Qualifications Tabs

**Root cause:** The Sanity schema for `quals[]` had `scope` (a dropdown: "all"/"facility"/"teletherapy") used as the `<h2>` heading in providers.astro — but `scope` is a track selector, not a heading. The `body` field had the full text including heading prefix (e.g. "Active Florida license — Psychologist, LCSW…"). The `??` fallback never triggered because `scope` had a non-null value ("all"/"facility"/"teletherapy"), causing the h2 to render as "all", "facility", or "teletherapy".

**What was built:**

- `apps/studio/schemas/singletons/providersPage.ts` — added `label: string` (Heading) field to quals object; renamed "Scope" dropdown title to "Applies To"; updated preview to use `label`
- `apps/web/src/lib/queries.ts` — added `label` to `quals[]{ label, scope, body }` GROQ projection
- `apps/web/src/pages/providers.astro` — updated TypeScript type for `quals` to include `label?`; changed all 5 `quals?.[n]?.scope` h2 references to `quals?.[n]?.label`
- Sanity data patched: all 5 quals now have `label` = proper heading text, `body` = description only (heading prefix removed)
- Sanity Studio redeployed: `https://byt-website.sanity.studio/`

**Verified:** `pnpm --filter web build` passed. Built HTML shows correct headings: "Active Florida license", "Active Medicare & Insurance enrollment", "Clinical experience", "Southeast Florida geography", "HIPAA-compliant home office".

**Issues:** None.

---

### Session Review — 2026-05-09 (Items 4, 5, 6)

#### Item 4 — Homepage "Who are you here to help?" desktop hover behavior

**What was built:**

- `apps/web/src/pages/index.astro` — added desktop hover-to-expand behavior to the existing router card `<script is:inline>` block
- `window.matchMedia('(hover: hover)')` gates the behavior so it only fires on pointer devices, not touch
- `mouseenter` on each `.r-card` calls `activateRouterCard(i)` to expand that card
- `mouseleave` on `#routerRow` calls `activateRouterCard(0)` to reset to first card when cursor exits the row

**Root cause / design note:** Design-source has no hover behavior — click-only. Igor explicitly requested hover-to-expand. User instruction overrides design-source for this behavioral enhancement.

**How verified:** `pnpm --filter web build` PASS (17 routes, 0 errors). `grep -n "mouseenter\|matchMedia"` confirms listeners are present in built HTML.

**Files changed:** `apps/web/src/pages/index.astro` (script block only, ~6 lines added)

---

#### Item 5 — Footer logo wrong colors

**What was investigated:**

- `apps/web/public/assets/logo-white.png` — Python PNG header analysis: colortype=6 (RGBA), pixel RGB=(255,255,255). White pixels on transparent background — correct.
- `Footer.astro` — uses `/assets/logo-white.png`, no color-altering CSS (filter, mix-blend-mode)
- Page `<style is:global>` blocks — multiple pages override `.footer-logo img` but only height/width; no color manipulation
- Footer background: `var(--navy-deep)` — dark navy, white logo on dark = correct

**Conclusion:** No code change was made. Cannot reproduce from static analysis. If logo still appears wrong, requires visual confirmation from Igor — could be a cached asset or browser rendering issue.

**Files changed:** None.

---

#### Item 6 — Careers JD upload script

**What was built:**

- `scripts/import-jds.py` — Python script to batch-import `.docx` job descriptions to Sanity as `jobPosting` documents
- Reads from `content/job-descriptions/*.docx` (ignored by git, unprocessed only)
- Parses docx via `zipfile` + `xml.etree.ElementTree` — no external dependencies
- Detects section headings: About Us, About the Role, Responsibilities, Requirements, Why Join Us
- Detects track from filename: "teletherapy"/"online"/"remote" → `teletherapy`; "onsite"/"geriatric"/"facility" → `facility`
- Creates Sanity `jobPosting` via mutations API (POST), authenticates with `SANITY_AUTH_TOKEN`
- Renames processed files to `*.processed.docx`

**Test run — 2026-05-09:**

- `JD_Licensed_Therapist_Geriatric_OnSite.docx` → track: facility, 7 duties, 6 reqs, 6 offers ✓
- `JD_Licensed_Therapist_Online_Teletherapy.docx` → track: teletherapy, 7 duties, 7 reqs, 6 offers ✓
- Sanity API confirmed: 2 `jobPosting` documents with status "open" created (IDs: `zBm7mJ8yrXMZXZmFsmlt7L`, `zBm7mJ8yrXMZXZmFsmltC1`)

**How verified:** `python3 scripts/import-jds.py` ran to completion. Followed with Sanity GROQ query confirming both documents exist with correct titles and tracks.

**Files changed:** `scripts/import-jds.py` (new file, 203 lines)
