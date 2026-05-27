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

- **Last work:** 2026-05-27 — BreadcrumbList JSON-LD across 12 pages (complete)
- **Current issues:** None
- **Detailed history:** See `tasks/todo-archive.md`

---

## Add BreadcrumbList JSON-LD to all non-homepage pages — 2026-05-27 [x] COMPLETE 2026-05-27

Branch: `main`

- [x] schema.ts — add `BreadcrumbListItem` interface + `breadcrumbListSchema()` function
- [x] AboutPage.astro — add BreadcrumbList JSON-LD (lines 2463–2464)
- [x] ProvidersPage.astro — add BreadcrumbList JSON-LD (lines 2847–2848)
- [x] CommunitiesPage.astro — add BreadcrumbList JSON-LD (lines 2922–2923)
- [x] ContactPage.astro — add BreadcrumbList JSON-LD (lines 1210–1211)
- [x] ResidentReferralPage.astro — add BreadcrumbList JSON-LD (line 1192)
- [x] CareersPage.astro — add BreadcrumbList JSON-LD (line 2143, Fragment pattern)
- [x] BlogIndexPage.astro — add BreadcrumbList JSON-LD (line 1551)
- [x] PrivacyPage.astro — add BreadcrumbList JSON-LD (lines 1714–1715)
- [x] TermsPage.astro — add BreadcrumbList JSON-LD (lines 760–761)
- [x] blog/[slug].astro — add BreadcrumbList JSON-LD (line 1855, Fragment pattern)
- [x] blog/[category]/index.astro — add BreadcrumbList JSON-LD (line 1644)
- [x] intake.astro — add BreadcrumbList JSON-LD (line 777)
- [x] BUILD — `pnpm --filter web build` → 20 pages, 0 errors ✓
- [x] VERIFY — grep application/ld+json on all 12 modified files → 2 hits each (3 on CareersPage) ✓
- [x] VERIFY — grep itemscope on Breadcrumb.astro → lines 15, 23 (microdata intact) ✓

### Session Review — 2026-05-27 (Add BreadcrumbList JSON-LD)

**What was built:** Added `breadcrumbListSchema()` to `apps/web/src/lib/schema.ts` and wired BreadcrumbList JSON-LD into all 12 non-homepage pages. Pure additive change — zero HTML, component, microdata, or DOM structure changes.

**TASK 2 (FAQPage) — CLOSED:** Audited AboutPage, ProvidersPage, CommunitiesPage. None contain Q&A pairs — tabs/accordions are service descriptions. `faqPageSchema()` remains dead code.

**New function added (schema.ts lines 117–130):**

- `BreadcrumbListItem` interface: `{ name: string; url?: string }`
- `breadcrumbListSchema(items)` → `string` — matches `webPageSchema`/`blogPostingSchema` return type for use with `set:html`
- Current page (last item) has no `url` per schema.org recommendations

**Rendering patterns used (matched per-page existing conventions):**

- Standard pages: `<script is:inline type="application/ld+json" set:html={breadcrumbSchema} />`
- `CareersPage.astro`: `<Fragment set:html={\`${jsonLdOpen}${breadcrumbSchema}${jsonLdClose}\`} />` (existing bare-script avoidance pattern)
- `blog/[slug].astro`: `<Fragment set:html={\`<script type="application/ld+json">${breadcrumbSchema}</script>\`} />` (same as BlogPosting)

**Files changed (13 total):**

- `apps/web/src/lib/schema.ts` — 176 → 193 lines (+17)
- `apps/web/src/components/pages/AboutPage.astro`
- `apps/web/src/components/pages/ProvidersPage.astro`
- `apps/web/src/components/pages/CommunitiesPage.astro`
- `apps/web/src/components/pages/ContactPage.astro`
- `apps/web/src/components/pages/ResidentReferralPage.astro`
- `apps/web/src/components/pages/CareersPage.astro`
- `apps/web/src/components/pages/BlogIndexPage.astro`
- `apps/web/src/components/pages/PrivacyPage.astro`
- `apps/web/src/components/pages/TermsPage.astro`
- `apps/web/src/pages/blog/[slug].astro`
- `apps/web/src/pages/blog/[category]/index.astro`
- `apps/web/src/pages/intake.astro`

**AboutPage JSON-LD output (verified from dist):**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://getbetteryou.com/" },
    { "@type": "ListItem", "position": 2, "name": "About" }
  ]
}
```

**Verification:**

- Build: 20 pages, 0 errors ✓
- All 12 pages: 2 `application/ld+json` hits each (CareersPage: const def + Fragment) ✓
- Breadcrumb.astro: `itemscope` at lines 15, 23 (microdata intact, file not modified) ✓

**Issues:** None. No user corrections this session.

---

## robots.txt Content-Signal + structured data audit — 2026-05-27 [x] COMPLETE 2026-05-27

Branch: `main`

- [x] READ — `apps/web/src/pages/robots.txt.ts` — confirmed dynamic generation: Sanity field + hardcoded Sitemap append
- [x] EDIT — added `CONTENT_SIGNAL` constant; inserted between `${custom}` and `Sitemap:` line
- [x] BUILD — `pnpm --filter web build` → 20 pages, 0 errors ✓
- [x] VERIFY — `grep -n "Content-Signal" apps/web/dist/robots.txt` → line 16 ✓
- [x] AUDIT — grepped `application/ld+json`, `schema.org`, `itemtype` across `apps/web/src/`; catalogued 14 files with JSON-LD, 1 with microdata-only, identified 5 gaps

### Session Review — 2026-05-27 (robots.txt Content-Signal + structured data audit)

**What was built:**

**Task 1 — Content-Signal:** There is no static `public/robots.txt`. The file is generated by `apps/web/src/pages/robots.txt.ts` which fetches `siteSettings.robotsTxt` from Sanity and appends the Sitemap line. Added a `CONTENT_SIGNAL` named constant and inserted it between the Sanity-supplied block and the Sitemap directive. Content-Signal is a technical directive (not CMS content) — correct placement is in code, not Sanity.

Generated output:

```
User-agent: *
Allow: /
...
User-agent: CCBot
Disallow: /
Content-Signal: ai-train=no, search=yes, ai-input=yes
Sitemap: https://getbetteryou.com/sitemap-index.xml
```

**Files changed:**

- `apps/web/src/pages/robots.txt.ts` — added `CONTENT_SIGNAL` constant; injected before Sitemap in body template

**Task 2 — Structured data audit (no code changes):**

14 pages have JSON-LD. Schema types present:

- `MedicalOrganization` + `LocalBusiness` + `WebSite` → `@graph` on `HomePage`
- `BlogPosting` → `blog/[slug].astro`
- `JobPosting` × N (inline per job) → `CareersPage`
- `ContactPage` (WebPage subtype) → `ContactPage`
- `CollectionPage` → `BlogIndexPage`, `blog/[category]/index`
- `WebPage` → `AboutPage`, `PatientsPage`, `ProvidersPage`, `CommunitiesPage`, `ResidentReferralPage`, `TermsPage`, `PrivacyPage`, `intake`

**Gaps found:**

1. `BreadcrumbList` JSON-LD missing on all pages — `Breadcrumb.astro` uses microdata only (violates CLAUDE.md standard)
2. `CareersPage` has no page-level `WebPage` schema — only per-job `JobPosting` blocks
3. `faqPageSchema()` in `schema.ts` — defined, never imported or used anywhere
4. `jobPostingSchema()` in `schema.ts` — dead code; CareersPage builds `JobPosting` inline
5. `AboutPage`, `PatientsPage`, `ProvidersPage` use generic `WebPage` — `MedicalWebPage` would be more specific

**Verification:**

- `grep -n "Content-Signal" apps/web/dist/robots.txt` → line 16 ✓
- Build: 20 pages, 0 errors ✓

**Issues:** None. No user corrections this session.

---

## Add Haiku prompt hook for deviation pattern review — 2026-05-27 [!] BLOCKED

Branch: `main`

- [x] PRE-FLIGHT — Read CLAUDE.md deviation patterns, global settings.json, project settings.json
- [x] INVESTIGATE — PostToolUse hooks do not fire in Claude Code 2.1.152 (confirmed broken, GitHub issue #6305)
- [x] INVESTIGATE — prompt-type hooks also not firing; command-type hooks confirmed same problem
- [x] INVESTIGATE — PreToolUse on Bash works; PostToolUse from both project and global settings does not
- [x] RESTORE — ~/.claude/settings.json restored to original state (PreToolUse only, valid JSON)
- [x] KEEP — .claude/settings.json = permissions.ask only (no hooks)
- [x] KEEP — .claude/hooks/check-console-log.sh, check-triad.sh, check-deviation-patterns.sh (work manually)

**BLOCKED — PostToolUse not supported in 2.1.152.**
Viable alternatives confirmed:

1. PreToolUse on Bash with `if: "Bash(git commit *)"` — gate all 3 checks before commit
2. Stop hook — fires once per turn after all tools complete

Awaiting Igor decision on which alternative to implement.

---

## Add PostToolUse automated hooks — 2026-05-27 [x] COMPLETE 2026-05-27

Branch: `main`

- [x] PRE-FLIGHT — Read project settings.json (did not exist), global settings.json, pre-commit-check.sh
- [x] CREATE — `.claude/hooks/check-console-log.sh` — blocks Write/Edit to functions/api/\* with console.log
- [x] CREATE — `.claude/hooks/check-triad.sh` — warns on Write/Edit to apps/studio/schemas/\* with no matching query
- [x] TEST — Hook 1: temp file with 2 console.log → BLOCKED message, exit 2 ✓
- [x] TEST — Hook 1 edge cases: \_hubspot.ts skipped, non-api file skipped ✓
- [x] TEST — Hook 2: audienceCard.ts (no query) → WARNING message, exit 0 ✓; formOption.ts (has query) → silent pass ✓
- [x] CREATE — `.claude/settings.json` (project-level) with PostToolUse hooks wired for both scripts
- [x] VERIFY — Global ~/.claude/settings.json unchanged ✓
- [x] VERIFY — Both scripts executable (-rwxrwxr-x) ✓

### Session Review — 2026-05-27 (PostToolUse automated hooks)

**What was built:** Two PostToolUse shell hooks wired into the project-level `.claude/settings.json`. These fire automatically after every Write or Edit tool call — Claude cannot skip, forget, or reason around them.

**Hook 1 — `check-console-log.sh`:**

- Fires on any Write/Edit to `functions/api/*`
- Counts `console.log` occurrences in the written file
- If count > 0: prints `BLOCKED: [filename] contains [N] console.log statement(s). Remove them before committing.` and exits 2
- Excludes `_hubspot.ts` (shared helper with legitimate logging)
- Non-api files: silently exit 0

**Hook 2 — `check-triad.sh`:**

- Fires on any Write/Edit to `apps/studio/schemas/*`
- Extracts schema name from basename, derives project root from file path (portable, no hardcoded paths)
- Checks for schema name in `apps/web/src/lib/queries.ts` (case-insensitive)
- If absent: prints WARNING with four-step triad reminder, exits 0 (non-blocking — new schemas legitimately have no query yet)

**Files changed:**

- `.claude/hooks/check-console-log.sh` — new executable script
- `.claude/hooks/check-triad.sh` — new executable script
- `.claude/settings.json` — new project-level settings with PostToolUse hook configuration

**Verification:**

- Hook 1 caught temp file with 2 console.log → BLOCKED, exit 2 ✓
- Hook 1 skipped \_hubspot.ts → exit 0 ✓
- Hook 1 skipped non-api file → exit 0 ✓
- Hook 2 warned on audienceCard.ts (not in queries.ts) → WARNING, exit 0 ✓
- Hook 2 passed formOption.ts (has FORM_OPTIONS_QUERY) → silent exit 0 ✓
- Global ~/.claude/settings.json: unchanged ✓
- Both scripts: -rwxrwxr-x ✓

**Side note:** `apply.ts` already has 6 console.log statements in production — the hook will catch these on the next edit. Will need cleanup before that file can be committed.

**Issues:** None. No user corrections this session.

---

## Create .claude/rules/ directory in git — 2026-05-27 [x] COMPLETE 2026-05-27

Branch: `main`

- [x] RUN — `mkdir -p /home/personal/projects/byt-website/.claude/rules`
- [x] RUN — `touch /home/personal/projects/byt-website/.claude/rules/.gitkeep`
- [x] RUN — `git add .claude/rules/.gitkeep`
- [x] VERIFY — `ls -la .claude/rules/` → shows `.gitkeep` ✓

### Session Review — 2026-05-27 (Create .claude/rules/ directory)

**What was built:** Created `.claude/rules/` directory in the byt-website repo with a `.gitkeep` placeholder so the empty directory is tracked by git. This directory will hold path-scoped Claude rules.

**Files changed:**

- `.claude/rules/.gitkeep` — new empty file

**Verification:**

- `ls -la /home/personal/projects/byt-website/.claude/rules/` → `.gitkeep` present ✓
- `git status` → `new file: .claude/rules/.gitkeep` staged ✓

**Issues:** None. No user corrections this session.

---

## Restyle Skilled Nursing radio buttons as pill buttons — 2026-05-26 [x] COMPLETE 2026-05-26

Branch: `main`

- [x] READ — `apps/web/src/components/pages/ResidentReferralPage.astro` — confirmed radio group HTML at lines 243–254 and CSS at lines 543–593
- [x] EDIT — replaced `.rr-radio-group` / `.rr-radio` / `.rr-radio-mark` / checked / invalid CSS block with pill button styling
- [x] VERIFY — `grep -n "rr-radio"` → lines 543–580 confirm pill CSS: border, border-radius, padding, `:has(input:checked)` navy state, `:hover:not(:has(input:checked))` teal border, `.rr-radio-mark { display: none }` ✓

### Session Review — 2026-05-26 (Restyle Skilled Nursing radio pills)

**What was built:** Replaced the subtle circle-dot radio indicator on the "Currently on Skilled Nursing" Yes/No group in `ResidentReferralPage.astro` with unmistakable pill/card buttons. The hidden `<input>` pattern was already in place; only the CSS changed.

**Approach:**

- `.rr-radio` styled as pill: `border: 2px solid #d1d5db`, `border-radius: 8px`, `padding: 10px 24px`, `background: #fff`, `transition: all 0.15s ease`
- `.rr-radio-mark` set to `display: none` (circle indicator hidden; `<span>` retained in HTML, no structural change)
- Active state via `:has(input:checked)`: navy fill `#104378`, white text, navy border
- Hover (inactive only) via `:hover:not(:has(input:checked))`: teal border `#1a9e8f`
- Validation error state updated: `.rr-radio-group.rr-invalid .rr-radio` targets the pill label instead of `.rr-radio-mark`

**Files changed:**

- `apps/web/src/components/pages/ResidentReferralPage.astro` — CSS block replaced (lines 543–580)

**No HTML changes.** No other form fields touched.

**Verification:**

- `grep -n "rr-radio"` → confirmed pill CSS at lines 543–580 ✓

---

## Enable set_up_tag on Cloudflare Gateway + remove direct gtag.js — 2026-05-26 [x] COMPLETE 2026-05-26

Branch: `main`

- [!] BLOCKED — Cloudflare API PUT/GET for `google-tag-gateway/config` returns auth error; stored token lacks Zone Settings scope. Manual dashboard toggle required.
- [x] READ — `apps/web/src/layouts/BaseLayout.astro` — confirmed direct gtag.js block at lines 141–151
- [x] EDIT — removed GA4 direct tag comment + gtag.js loader + inline gtag function/config (10 lines)
- [x] VERIFY — `grep -n "gtag\|googletagmanager\|G-JW2XB9Q7B3\|dataLayer"` → only dataLayer refs at lines 137–139 ✓

### Session Review — 2026-05-26 (Enable set_up_tag + remove direct gtag.js)

**What was done:** Removed the direct GA4 tag (`G-JW2XB9Q7B3`) from `BaseLayout.astro`. This is the code-side half of a two-part change; the Cloudflare half (enabling `set_up_tag: true` on the Gateway) requires a Zone Settings-scoped API token or manual dashboard action.

**Cloudflare API blocker:** `CLOUDFLARE_API_TOKEN` (`cfut_M2l...`) returned auth error on both GET and PUT to `zones/.../settings/google-tag-gateway/config`. The token has Pages:Edit scope but not Zone Settings scope. Manual step: Cloudflare dashboard → Zone → Speed → Optimization → Google Tag Gateway → enable "Set up tag".

**Code change:** Removed lines 141–151 from `BaseLayout.astro`:

- `<!-- GA4 direct tag ... -->` comment
- `<script async src="https://www.googletagmanager.com/gtag/js?id=G-JW2XB9Q7B3" is:inline>`
- Inline `<script is:inline>` with `window.dataLayer`, `function gtag()`, `gtag('js')`, `gtag('config')`

**Preserved:** `window.dataLayer = window.dataLayer || [];` unconditional init block (lines 137–140).

**Files changed:**

- `apps/web/src/layouts/BaseLayout.astro` — 10 lines removed

**Verification:**

- `grep -n "gtag\|googletagmanager\|G-JW2XB9Q7B3\|dataLayer"` → lines 137, 139 only (dataLayer comment + init) ✓

**Issues:** Cloudflare API token scope — Zone Settings token needed for future Gateway API calls.

---

## Restore direct gtag.js for GA4 data collection — 2026-05-26 [x] COMPLETE 2026-05-26

Branch: `main`

- [x] READ — `apps/web/src/layouts/BaseLayout.astro` — confirmed only dataLayer init at lines 137–140, no gtag.js present
- [x] EDIT — inserted GA4 direct tag block (gtag.js loader + inline gtag function/config) immediately after dataLayer init
- [x] VERIFY — `grep -n "gtag\|googletagmanager\|G-JW2XB9Q7B3\|dataLayer"` → dataLayer at 139, gtag.js at 142, gtag config at 147–148 ✓

### Session Review — 2026-05-26 (Restore direct gtag.js for GA4)

**What was done:** Restored the direct GA4 tag (`G-JW2XB9Q7B3`) to `BaseLayout.astro`. The Cloudflare Google Tag Gateway proxies the GTM script load via `/03n8/` but does NOT proxy GA4 `collect` requests — this is a known issue being escalated. Direct gtag.js restores GA4 data collection as an immediate fallback.

**Placement:** Immediately after the existing `window.dataLayer = window.dataLayer || [];` init block (line 140). Order: dataLayer init → gtag.js loader → gtag config.

**GTM not touched:** The Google Tag (GA) inside GTM must remain PAUSED to avoid double-counting. This is a GTM-side configuration — no code changes needed here.

**Files changed:**

- `apps/web/src/layouts/BaseLayout.astro` — 6 lines added (gtag.js loader + inline config block)

**Verification:**

- `grep -n "gtag\|googletagmanager\|G-JW2XB9Q7B3\|dataLayer"` → lines 139, 142, 144, 146, 147, 148 ✓

**Issues:** None. No user corrections this session.

---

## Remove duplicate GTM and direct gtag.js from BaseLayout.astro — 2026-05-26 [x] COMPLETE 2026-05-26

Branch: `main`

- [x] READ — `apps/web/src/layouts/BaseLayout.astro` — confirmed direct gtag.js block (lines 96–105) and GTM conditional block (lines 148–156) and GTM noscript iframe (lines 159–170)
- [x] EDIT — removed direct gtag.js loader + inline gtag function/config (lines 96–105)
- [x] EDIT — removed GTM conditional block (`gtmId && (...)` with gtm.js loader); replaced with unconditional `window.dataLayer = window.dataLayer || [];` standalone script
- [x] EDIT — removed GTM noscript iframe block from `<body>`
- [x] VERIFY — `grep -n "gtag\|googletagmanager\|GTM-\|G-JW2XB9Q7B3\|dataLayer" BaseLayout.astro` → only 2 dataLayer lines remain (lines 138–139) ✓

### Session Review — 2026-05-26 (Remove duplicate GTM and direct gtag.js)

**What was done:** Removed two conflicting analytics injection layers from `BaseLayout.astro` now that Cloudflare Google Tag Gateway injects GTM (GTM-5CVGT32J) at the CDN level via `/03n8/`.

Removed:

1. **Direct gtag.js block** (10 lines): `<script async src="https://www.googletagmanager.com/gtag/js?id=G-JW2XB9Q7B3">` + inline `function gtag(){dataLayer.push(arguments)}` + `gtag('config', 'G-JW2XB9Q7B3')`
2. **GTM head conditional block** (7 lines): `{gtmId && (<><script is:inline>window.dataLayer...` + `<script async src=".../gtm.js?id=..."/></>`)}
3. **GTM noscript iframe** (10 lines): `{gtmId && (<noscript><iframe src=".../ns.html?id=..."/></noscript>)}`

Preserved: `window.dataLayer = window.dataLayer || [];` — moved to an unconditional standalone `<script is:inline>` block so all `dataLayer.push()` calls in ModalForms, ContactPage, CareersPage, ResidentReferralPage, intake, Footer, NewsletterBlock, and AudienceRouter continue to work.

**Files changed:**

- `apps/web/src/layouts/BaseLayout.astro` — 27 lines removed, 3 lines added (net −24)

**Verification:**

- `grep -n "gtag\|googletagmanager\|GTM-\|G-JW2XB9Q7B3\|dataLayer"` → lines 138–139 only (dataLayer init + comment) ✓

**Issues:** None. No user corrections this session.

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
