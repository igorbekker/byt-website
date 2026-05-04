# Lessons Learned

## Priority Rules (most-violated first)

### 1. Design-source HTML is the build spec

The files in `design-source/pages/` are complete working web pages. Copy them. Do not reinterpret, decompose, or rewrite them. Every CSS value, class name, DOM structure, and script must be reproduced exactly.

### 2. Sanity variables replace text strings, not HTML structure

WRONG:

```html
{page.cards?.map(card =>
<div>{card.heading}</div>
)}
```

RIGHT:

```html
<div class="card-heading">{page.cardHeading ?? "Original Heading"}</div>
```

Every variable gets a `??` fallback to the original source value. No `.map()` loops. No dynamic templates. HTML structure is immutable. Index into arrays by position: `{cards?.[0]?.label ?? "Families"}`.

### 3. One page at a time with confirmation gates

Build one page. Deploy. Wait for Igor's confirmation. Do not start the next page. This was violated (all 7 built at once) and every page was broken.

### 4. Never ask Igor to perform technical tasks

CC has API access to Cloudflare and Sanity. Use it. If a token is missing, report the blocker — do not ask Igor to run commands.

### 5. Run /begin at session start

Read CLAUDE.md, todo.md, lessons.md before doing anything.

### 6. Never modify CLAUDE.md, agents, skills, or settings.json without approval

These are governance files. Propose changes, wait for approval.

### 7. Never approve your own decisions

Log DEC entries and wait for Igor.

### 8. Use auto-deploy

Push to main. Cloudflare deploys automatically. Do not manually trigger builds, poll deployment status, or debug deployment tokens.

### 9. Audit global.css before every commit

Check that global.css rules do not override page-specific styles via specificity. Fix conflicts before committing.

### 10. Scripts use is:inline

All `<script>` tags from design-source HTML must use `is:inline` in Astro so they are not processed by the build pipeline.

### 11. Test with public/ when debugging

Copy the HTML file to `public/`, deploy, verify. If it renders correctly, any deviation in the .astro version is something you introduced.

### 12. Run design-parity-check.sh before committing page .astro files

The hook checks for .map() loops, missing ?? fallbacks, section count mismatches, missing is:inline, and class name deletions. If it fails, fix before committing.

### 13. design-source/ is read-only and content changes go to Sanity, never hardcoded

design-source/ is a structural reference frozen at design time — never modify it.
When content changes (email, fax, phone, copy, image): update the value in Sanity Studio or schema defaults — not in design-source/, and not as a new hardcoded value in .astro.
The .astro file wires the field as `{sanityVar ?? "original-design-source-placeholder"}`. The fallback is the original design-source value; the live content comes from Sanity.

### 14. Page-level `<style is:global>` overrides shared component scoped styles

When a page copies design-source CSS verbatim into `<style is:global>`, any rule in that block that targets a shared component element (e.g. `.footer-logo img`, `.nav-logo`) will override the component's own scoped `<style>`. The component's scoped style has lower effective priority in this cascade.

**Consequence:** Changing a style in the component file alone has no visible effect. The fix must be applied in ALL page files that redefine that rule globally.

**Check before any shared component style change:** `grep -r "rule-name" apps/web/src/pages/` to find all page-level overrides.

---

## Incident Log

- 2026-05-01: Sanity Editor token deleted by mistake. Blocked seeding. Required new token from Igor. (OBS-001)
- 2026-05-02: Astro decomposition destroyed all 7 page designs. Abandoned component approach for raw HTML injection. (OBS-002)
- 2026-05-02: IntersectionObserver never attached on homepage. Below-fold content stuck at opacity:0. (OBS-003)
- 2026-05-02: Container width 1280px instead of 1200px across all pages. (OBS-004)
- 2026-05-02: Base font-size 16px instead of 15px across all pages. (OBS-005)
- 2026-05-02: Lora serif font never loaded. Patients hero italic broken. (OBS-006)
- 2026-05-02: All 7 pages built at once despite "one at a time" instruction. All broken. Reverted. (OBS-007)
- 2026-05-02: 30 minutes + 50K tokens spent debugging Cloudflare deploy for a static file copy. Should have been 3 commands. (OBS-008)
- 2026-05-03: global.css .btn border override on Providers Apply Now buttons. Fixed with specificity bump. (OBS-009)
- 2026-05-02: Multiple entire sections missing across all pages during decomposition approach. (OBS-010)
- 2026-05-02: DOM structure changes — element swaps, column reorder, grid changes during decomposition. (OBS-011)
- 2026-05-04: Entire HTML sections replaced with Sanity .map() loops on Patients page. Sections empty when Sanity unpopulated. (OBS-012)
- 2026-05-04: Modified design-source/pages/Contact.html to update fax number. Violated hard rule: design-source/ is read-only. Reverted immediately. (OBS-013)
