# Lessons Learned

## Priority Rules (most-violated first)

### 1. Design-source HTML is the build spec — reproduce verbatim, never patch

The files in `design-source/pages/` are complete working web pages. Copy them exactly. Do not reinterpret, decompose, rewrite, or patch them. Every CSS value, class name, DOM structure, and script must be reproduced exactly.

When a page's rendered output diverges from design-source, do NOT attempt to fix it by patching individual CSS blocks. Three sessions of CSS patching (expanding rules, replacing individual blocks, adding missing properties) all failed to produce a matching page.

**Why:** The page-level `<style is:global>` block is tightly coupled. Partial replacements leave formatting inconsistencies, missed properties, and stale rules that interact unpredictably with global.css and scoped component styles. The only reliable fix is: delete everything after the frontmatter, copy `<style>` content verbatim from design-source, copy body sections verbatim, re-wire Sanity variables.

**How to apply:** When a page doesn't match design-source and any amount of CSS adjustment isn't working, stop immediately. Do the full verbatim rewrite. There is no middle ground.

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

### 4. Be operationally self-sufficient — use API access and auto-deploy

Claude has API access to Cloudflare and Sanity. Use it. If a token is missing, report the blocker — do not ask Igor to run commands.

For deploys: push to main. Cloudflare deploys automatically. Do not manually trigger builds, poll deployment status, or debug deployment tokens.

**Why:** Asking Igor to perform technical tasks or waiting for manual deploys creates unnecessary blockers and wastes his time. Every required credential is already in the environment.

### 5. Run /begin at session start

Read CLAUDE.md, todo.md, lessons.md before doing anything.

### 6. Never modify CLAUDE.md, agents, skills, or settings.json without approval

These are governance files. Propose changes, wait for approval.

### 7. Never approve your own decisions

Log DEC entries and wait for Igor.

### 8. CSS cascade: page-level `<style is:global>` defeats component styles — audit both

When a page copies design-source CSS verbatim into `<style is:global>`, any rule in that block targeting a shared component element (e.g. `.footer-logo img`, `.nav-logo`) overrides the component's own scoped `<style>`. The component's scoped style has lower effective priority in this cascade.

Before any style change: audit `global.css` for specificity conflicts AND run `grep -r "rule-name" apps/web/src/pages/` to find all page-level overrides. Fix conflicts in ALL files that redefine the rule.

**Why:** Changing a style in the component file alone has no visible effect when a page-level rule overrides it. Only auditing both locations catches these conflicts.

### 9. Scripts use is:inline

All `<script>` tags from design-source HTML must use `is:inline` in Astro so they are not processed by the build pipeline.

### 10. Test with public/ when debugging

Copy the HTML file to `public/`, deploy, verify. If it renders correctly, any deviation in the .astro version is something you introduced.

### 11. Run design-parity-check.sh before committing page .astro files

The hook checks for .map() loops, missing ?? fallbacks, section count mismatches, missing is:inline, and class name deletions. If it fails, fix before committing.

### 12. design-source/ is read-only — content changes go to Sanity, never hardcoded

design-source/ is a structural reference frozen at design time — never modify it.
When content changes (email, fax, phone, copy, image): update the value in Sanity Studio or schema defaults — not in design-source/, and not as a new hardcoded value in .astro.
The .astro file wires the field as `{sanityVar ?? "original-design-source-placeholder"}`. The fallback is the original design-source value; the live content comes from Sanity.

### 13. Before declaring a file missing — check all recent commits

When files appear absent from the working tree, check `git log --oneline` for recent upload or rename commits before reporting them as gone. Igor may have uploaded replacements and then deleted the old versions in separate commits — the new files land at the same path.

**Rule:** Run `git show --name-only <commit>` on any suspicious recent commit before escalating a missing-file blocker.

### 14. When audience categories don't map to form options — skip preselection

When a CTA opens a form but the CTA's semantic context (e.g. demographic/service category) doesn't cleanly map to a form field's options (e.g. clinical condition dropdown), do not attempt a forced or approximate mapping.

**Rule:** Report the mismatch, stop, wait for direction.
**Resolution pattern (confirmed by Igor 2026-05-05):** Skip preselection entirely — just open the modal with no preselected value.

### 15. Blog listing pages are a Lesson 2 exception — .map() is required for variable-count content

Lesson 2 ("no .map() loops, index by position") applies to static marketing pages with a known, fixed number of items (tracks, handles, tabs, etc.). Blog index, category, and subcategory pages are fundamentally different: the number of categories and posts is variable and not known at design time.

**Rule:** For blog listing pages, use `.map()` for genuinely variable-count content (article cards, category tiles, pill filters). Use `??` fallbacks for fixed/singleton fields (hero, newsletter, section headings). The design-source card HTML is the template for each `.map()` iteration.

**Why:** Positional indexing on blog listing pages would cap visible content at the number of design-source placeholder cards (e.g., 6 articles). Posts added to Sanity beyond that count would silently not appear. Igor confirmed blog pages need dynamic rendering.

**How to apply:** Before applying Lesson 2, ask: "Is the count of this array determined at design time or at content-entry time?" Fixed count → positional indexing. Variable/open-ended count → `.map()`.

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
- 2026-05-05: Claimed l505/l506 CSS blocks matched design-source without visual verification. User correction: "They do not match. Stop claiming they do without visual verification." Fixed by deploying static test files and doing CSS diff analysis. Rule: never claim parity without a concrete diff or visual test. (OBS-014)
