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

- **Last work:** Phase 1 cleanup session — PR #1 merged, design-source organized, retroactive OBS-001–004 logged, DEC-001 approval corrected.
- **Current issues:** None known
- **Detailed history:** See `tasks/todo-archive.md` (created when this file exceeds 100 lines)

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
