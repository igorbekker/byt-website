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

- **Last work:** 2026-05-08 — Token registry + governance file alignment: token-registry.md, CLAUDE.md, agents, skills, parity script, lessons
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

## Blog Pages — 2026-05-06 [x] COMPLETE 2026-05-07

### URL structure (confirmed by Igor)

- `/blog/` — Blog.html
- `/blog/[category]/` — Blog Category.html
- `/blog/[category]/[sub]/` — Blog Subcategory.html
- `/blog/[slug]/` — Blog Article.html
- Category and article slugs share depth — Astro resolves via getStaticPaths() at build time
- Slug collision check: getStaticPaths() in article route must throw build error if any article slug matches a category slug

### Steps

#### Phase 1 — GROQ Queries [x] COMPLETE 2026-05-06

- [x] Add BLOG_INDEX_PAGE_QUERY to queries.ts
- [x] Add BLOG_CATEGORIES_QUERY to queries.ts (includes postCount computed field)
- [x] Add BLOG_POSTS_ALL_QUERY to queries.ts
- [x] Add BLOG_FEATURED_POST_QUERY to queries.ts
- [x] Add BLOG_CATEGORY_POSTS_QUERY to queries.ts
- [x] Add BLOG_SUBCATEGORY_POSTS_QUERY to queries.ts
- [x] Add BLOG_POST_QUERY to queries.ts
- [x] Add BLOG_POST_PATHS_QUERY to queries.ts
- [x] Add BLOG_CATEGORY_PATHS_QUERY to queries.ts
- [x] Add BLOG_SUBCATEGORY_PATHS_QUERY to queries.ts
- [x] Build passes after queries added

#### Phase 2 — Blog Index (/blog/) [x] COMPLETE 2026-05-06 — awaiting Igor confirmation

- [x] Create apps/web/src/pages/blog/index.astro
- [x] Style block verbatim from design-source/pages/Blog.html (lines 11–626)
- [x] Body sections verbatim: blog-hero, crumb, featured, categories, latest, newsletter
- [x] Sanity variables wired with ?? fallbacks (fixed sections); .map() used for dynamic listing sections (categories, posts) — blog-specific exception to Lesson 2 noted
- [x] Build passes: `/blog/index.html` prerendered in 184ms
- [x] Deploy + Igor confirmation — 2026-05-07

### Review — Phase 1 + Phase 2 — 2026-05-06

**Phase 1 — GROQ Queries:**
10 new queries added to `apps/web/src/lib/queries.ts`. Key design decisions:

- `BLOG_CATEGORIES_QUERY` includes `"postCount": count(*[_type == "blogPost" && category._ref == ^._id])` — computed at query time
- `BLOG_POST_CARD_FIELDS` is an unexported const used as an interpolated template string inside the 3 post-list queries to avoid field duplication
- `BLOG_SUBCATEGORY_PATHS_QUERY` returns `{categorySlug, subs[{subSlug}]}` — caller must flatten into `[category]/[sub]` pairs in getStaticPaths()

**Phase 2 — Blog Index:**

- Style block: 616 lines verbatim from design-source (lines 11–626)
- Dynamic sections: category tiles (.map() over categories), pill filters (.map() over categories), article cards (.map() over posts) — blog pages require dynamic rendering; positional indexing would cap posts at design-source count (6)
- Static sections wired with ?? fallbacks: hero, featured article, newsletter
- Featured card: uses `set:html` on h2 to preserve `<em>` markup from Sanity title field
- All article card hrefs: `/blog/${post.slug.current}/`
- Category tile hrefs: `/blog/${cat.slug.current}/`
- Generic SVG icon used for all category tiles (Sanity `icon` field is a string key, not SVG path; no icon mapping system exists)

**Files changed:**

- `apps/web/src/lib/queries.ts` — 10 blog queries added
- `apps/web/src/pages/blog/index.astro` — new file (806 lines)
- `tasks/todo.md` — this entry

#### Phase 3 — Blog Category (/blog/[category]/) [x] COMPLETE 2026-05-06 — awaiting Igor confirmation

- [x] Create apps/web/src/pages/blog/[category]/index.astro
- [x] getStaticPaths() from BLOG_CATEGORY_PATHS_QUERY
- [x] Style block verbatim (lines 11–697, 687 lines) from Blog Category.html
- [x] Body sections: cat-hero, crumb, subcats (.map() subtopics), article-list (.map() categoryLevelPosts), newsletter
- [x] BLOG_CATEGORY_QUERY added to queries.ts (single category by slug, subtopics with description)
- [x] Build passes
- [x] Deploy + Igor confirmation — 2026-05-07

### Review — Phase 3 — 2026-05-06

**Key wiring decisions:**

- `getStaticPaths()` fetches all category slugs; returns empty set if no categories in Sanity (expected for new site)
- Subcats: `.map()` over `category.subtopics[]`; each block filters `posts` by `subcategoryLabel === sub.slug`, shows first 6, links to `/blog/${categorySlug}/${sub.slug}/`
- Article-list: posts where `!p.subcategoryLabel`; pagination static (no JS)
- Bug fixed: initial generator used `sub.slug` as description — corrected to `sub.description ?? ""`

**Files changed:**

- `apps/web/src/lib/queries.ts` — BLOG_CATEGORY_QUERY added
- `apps/web/src/pages/blog/[category]/index.astro` — new file (874 lines)
- `tasks/todo.md` — this entry

#### Phase 4 — Blog Subcategory (/blog/[category]/[sub]/) [x] COMPLETE 2026-05-06

- [x] Create apps/web/src/pages/blog/[category]/[sub]/index.astro
- [x] getStaticPaths() flattens BLOG_SUBCATEGORY_PATHS_QUERY into [category,sub] pairs
- [x] Style block verbatim (lines 11–693, 683 lines) from Blog Subcategory.html
- [x] Body sections: subcat-hero, crumb, article-list (.map() posts), sisters (.map() siblings), newsletter
- [x] Build passes

#### Phase 5 — Blog Article (/blog/[slug]/) [x] COMPLETE 2026-05-06

- [x] Create apps/web/src/pages/blog/[slug].astro
- [x] getStaticPaths() fetches post + category slugs; throws build error on collision
- [x] Style block verbatim (lines 12–1009, 998 lines) from Blog Article.html
- [x] Body sections: progress-bar, subnav, article-hero, article-image, article-body (PortableText), related, mobile-cta-bar
- [x] BLOG_RELATED_POSTS_QUERY added to queries.ts
- [x] Build passes

### Review — Phase 4 + Phase 5 — 2026-05-06

**Phase 4 — Subcategory:**

- `getStaticPaths()` flattens `BLOG_SUBCATEGORY_PATHS_QUERY` result `[{categorySlug, subs:[{subSlug}]}]` into flat `[category,sub]` param pairs
- Hero: `category.title · Subtopic` eyebrow, `currentSub.title` h1, `currentSub.description`
- Article list: `.map()` over posts filtered by `subcategoryLabel == subSlug` (done server-side by Sanity query)
- Sisters: `.map()` over sibling subtopics (parent category subtopics minus current)
- SSC (sub-sub-categories) section omitted — Sanity schema has no 3rd nesting level

**Phase 5 — Article:**

- Slug collision guard: `getStaticPaths()` cross-checks all post slugs against all category slugs; throws descriptive build error listing colliding slugs if any match
- TOC: design-source has hardcoded `<ol>` items; replaced with JS-built TOC (`getElementById('toc-list')` populated from `h2[id]` headings in `.article-prose`) — avoids wiring each heading manually
- Portable Text: `<PortableText value={post.body} />` from `astro-portabletext` (already installed)
- Featured image: conditional — shows `<img>` if `post.featuredImage.asset.url` exists, else placeholder div
- Related posts: `BLOG_RELATED_POSTS_QUERY` (3 posts, same category, excludes current by `_id`)

**Files changed:**

- `apps/web/src/lib/queries.ts` — BLOG_RELATED_POSTS_QUERY added
- `apps/web/src/pages/blog/[category]/[sub]/index.astro` — new file (852 lines)
- `apps/web/src/pages/blog/[slug].astro` — new file (1246 lines)
- `tasks/todo.md` — this entry

### Quality gate

- `pnpm --filter web build` — PASS (10 routes prerendered, 0 errors, dynamic blog routes empty until Sanity populated) — 2026-05-06

---

## Blog System Step 3 — Markdown Import Tool — 2026-05-07 [x] COMPLETE 2026-05-07

### Steps

- [x] Read blogPost, author, blogCategory, seoFields schemas — 2026-05-07 17:00
- [x] Install js-yaml + @portabletext/markdown in apps/studio — 2026-05-07 17:00
- [x] Create apps/studio/tools/MarkdownImportTool.tsx — 2026-05-07 17:00
- [x] Register tool in apps/studio/sanity.config.ts — 2026-05-07 17:00
- [x] Studio build passes — `sanity build` ✓ — 2026-05-07 17:00
- [x] Commit + push to main — 2026-05-07 16:33 (commit 07b729c)
- [x] Deploy to byt-website.sanity.studio — 2026-05-07 16:36
- [x] Bug fix — gray-matter threw Buffer is not defined in browser; replaced with js-yaml + manual YAML parser — 2026-05-07
- [x] Studio rebuild + redeploy after bug fix — sanity build PASS, redeployed to byt-website.sanity.studio — 2026-05-07
- [x] Igor confirms tool renders and test import works — 4 articles imported and published 2026-05-07

Custom Sanity Studio tool (Option A — sidebar tab) built and verified compiling. Appears as "Import Article" in the Studio top nav.

**What was built:**

`apps/studio/tools/MarkdownImportTool.tsx` — React component registered as a Sanity Tool. Renders a full-page textarea + Import button inside the Studio shell.

**Parsing logic:**

- `gray-matter` splits YAML frontmatter from markdown body
- Frontmatter field map: `title → title`, `slug → slug.current`, `publishedAt → publishedAt (ISO)`, `readingTime → readingTimeMinutes`, `excerpt → excerpt`, `subcategory → subcategoryLabel`, `seo.title → seo.metaTitle`, `seo.description → seo.metaDescription`, `featured = false` always
- `category` → GROQ lookup matched by `slug.current`
- `author` → GROQ lookup matched by normalized name (lowercase alphanumeric). **Note:** author schema has no slug field — name normalization handles `"sarah-johnson"` → `"Sarah Johnson"` matching
- `:::key-takeaways ... :::` custom block preprocessed to `## Key Takeaways\n\n{list}` before PT conversion
- `@portabletext/markdown`'s `markdownToPortableText()` converts markdown body to PT blocks
- Non-block items (hr, images, code blocks) filtered out — `blogPost.body` only allows `{ type: 'block' }`
- Document created via `client.create()` as a draft — reviewable and publishable from Studio
- Missing category/author show inline warnings but don't block creation

**Discovery — @sanity/ui not directly resolvable:** Vite couldn't resolve `@sanity/ui` as a transitive dep. Rewrote component using plain React + inline styles. Build passed on second attempt.

**Files changed:**

- `apps/studio/tools/MarkdownImportTool.tsx` — new (136 lines)
- `apps/studio/sanity.config.ts` — added import + `tools: [...]` array
- `apps/studio/package.json` — added `gray-matter ^4.0.3` and `@portabletext/markdown ^1.2.0`
- `pnpm-lock.yaml` — updated lockfile

**Quality gate:**

- `pnpm --filter studio build` — PASS (`sanity build` ✓ in 34s) — 2026-05-07 17:00

**Bug fixed:**

- gray-matter uses Node.js Buffer internally — throws Buffer is not defined in browser (Sanity Studio runs in browser via Vite). Replaced with manual --- delimiter splitting + js-yaml (fully browser-safe). gray-matter removed from package.json; js-yaml + @types/js-yaml installed.
- Rebuild: pnpm --filter studio build — PASS (34s)
- Redeploy: https://byt-website.sanity.studio/ — 2026-05-07

---

## Session Review — 2026-05-07 (Studio fixes + blog live)

### What was built / fixed

**MarkdownImportTool.tsx — 6 body content bugs fixed:**

- Bug 1: `:::key-takeaways` delimiters were duplicating the `## Key Takeaways` heading → strip delimiters only, preserve inner content
- Bug 2: `{#anchor-id}` anchor syntax from markdown editor was landing in body as literal text → `stripHeadingAnchors()` regex
- Bug 3: Metadata paragraph (`Published: … | Updated: …`) was landing in body → `stripMetadataParagraph()`
- Bug 4: "About the Author" + "You Might Also Like" boilerplate sections were included in body → `stripBoilerplateSections()`
- Bug 5: Table of Contents section was included in body → `stripTableOfContents()`
- Bug 6: `client.create(doc)` without `drafts.` prefix created published documents instead of drafts → `doc._id = \`drafts.${crypto.randomUUID()}\`` before create

**author.ts — slug field added:**

- Schema previously had no slug field; author GROQ query returned `slug: null` for all authors
- Added `defineField({ name: 'slug', type: 'slug', options: { source: 'name' } })` after `name` field
- Patched existing `author-byt-clinical-team` document to set `slug.current = 'byt-clinical-team'`

**MarkdownImportTool.tsx — author matching hardened:**

- Original: normalized name match only (`normalize(a.name) === normalize(frontmatterValue)`)
- After Two Fixes: slug-first match added, but `String(fm.author)` was not trimmed
- Final fix: `.trim()` on `authorValue` + case-insensitive slug fallback tier
- Match order: exact slug → case-insensitive slug → normalized name

**Root cause of repeated author match failures:**

- Code and data were correct after the Two Fixes deploy
- Browser was serving a cached Studio bundle from before the fix
- Symptom: warning showed "Available: Better You Therapy Clinical Team" (no slug in parens) — impossible with current code which always appends `(slug)` or `(no-slug)`
- Fix: hard-refresh (Cmd+Shift+R) clears cached bundle

**Blog pages live:**

- All 5 blog page templates already committed in prior sessions
- 4 blog posts published in Sanity by Igor: narcissistic-parent-signs (family), how-to-choose-a-therapist (choosing-therapy), toxic-relationship-signs (couples) + 1 more
- Build verified: `/blog/index.html`, 4 category pages, 3 article pages — 0 errors

### Files changed this session

- `apps/studio/tools/MarkdownImportTool.tsx` — 6 bug fixes + author slug matching + trim
- `apps/studio/schemas/documents/author.ts` — slug field added
- `apps/studio/package.json` — gray-matter removed; js-yaml + @types/js-yaml added
- `pnpm-lock.yaml` — lockfile updated
- `tasks/todo.md` — this review
- `tasks/todo-archive.md` — prior completed sections archived

### Quality gate

- `pnpm --filter web build` — PASS (17 routes prerendered, 0 errors) — 2026-05-07
- `pnpm --filter studio build` — PASS (sanity build ✓) — 2026-05-07

---

## Blog Bug Fixes — 2026-05-07 [x] COMPLETE 2026-05-07

### Bugs fixed

- [x] BUG 1: Category pages (`/blog/couples/`, `/blog/child-teen/`, etc.) showed 0 articles
- [x] BUG 2: Pill filters on `/blog/` did nothing when clicked
- [x] BUG 3: `/blog/#/` appended to URL when clicking featured card with no featured post; "View all articles" also used `href="#"`

### Review

**BUG 1 — Root cause:**
`apps/web/src/pages/blog/[category]/index.astro:57` had `categoryLevelPosts = posts?.filter((p) => !p.subcategoryLabel)`. Every imported post has a `subcategoryLabel` from the markdown frontmatter `subcategory:` field. The filter excluded them all. No subtopics are defined in Sanity either, so posts also didn't appear in subcategory blocks. Result: 0 visible articles on every category page.
Fix: removed the filter entirely — `const categoryLevelPosts = posts ?? [];`

**BUG 2 — Root cause:**
The `<script is:inline>` in `apps/web/src/pages/blog/index.astro` contained only the IntersectionObserver for fade-up animations. No click handler existed for the pill buttons. The `data-cat` attributes on pills and cards were wired correctly but nothing read them.
Fix: added pill click handler inside the existing `<script is:inline>` block — on click, sets `.active` on the clicked pill, then shows/hides `.article-card` elements by matching `data-cat`.

**BUG 3 — Root cause:**
Featured card href: `` `/blog/${featured?.slug?.current ?? '#'}/` `` — when `featured` is null, `featured?.slug?.current` is `undefined`, `?? '#'` fires, producing `/blog/#/`.
"View all articles" link: `href="#"` — raw hash anchor.
Fix: changed featured href to `featured?.slug?.current ? \`/blog/${featured.slug.current}/\` : '/blog/'`; changed view-all href to `/blog/`.

**Files changed:**

- `apps/web/src/pages/blog/index.astro` — BUG 2 (pill JS added), BUG 3 (featured href + view-all href fixed)
- `apps/web/src/pages/blog/[category]/index.astro` — BUG 1 (subcategoryLabel filter removed)
- `tasks/todo.md` — this review

### Quality gate

- `pnpm --filter web build` — PASS (17 routes prerendered, 0 errors) — 2026-05-07

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
