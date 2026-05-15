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

### 4. global.css is the single owner of shared selectors — pages must not redefine them

`global.css` owns: `.btn`, `.btn-*`, `body`, `h1–h5`, `.eyebrow`, `.max-w`, `.fade-up`, `.fade-up.visible`, all `:root` tokens. Pages must not redefine these selectors in their `<style>` block — doing so creates cascade conflicts. When copying a `<style>` block from design-source, **strip all shared selectors first**. See `docs/css-architecture.md`.

Page-level `<style is:global>` also overrides scoped component styles (e.g. `.nav-logo`, `.footer-logo img`) — when a component style has no effect, grep page `<style>` blocks for the conflicting rule.

No `--byt-*` prefixed token names anywhere. All tokens use unprefixed System A names (`--navy`, not `--byt-navy`).

**How to apply:** Run `scripts/design-parity-check.sh` — CHECK 7 now fails on owned selectors, CHECK 8 fails on `--byt-*` tokens.

### 5. Be operationally self-sufficient — use API access and auto-deploy

Claude has API access to Cloudflare and Sanity. Use it. If a token is missing, report the blocker — do not ask Igor to run commands.

For deploys: push to main. Cloudflare deploys automatically. Do not manually trigger builds, poll deployment status, or debug deployment tokens.

**Why:** Asking Igor to perform technical tasks or waiting for manual deploys creates unnecessary blockers and wastes his time. Every required credential is already in the environment.

### 6. Session discipline: /begin, governance files, self-approval

Run `/begin` at session start — read CLAUDE.md, todo.md, lessons.md before doing anything. Never modify governance files (CLAUDE.md, `.claude/agents/`, `.claude/skills/`, `.claude/settings.json`) without Igor's explicit approval in the current session. Never log DEC entries as self-approved — only Igor approves decisions.

### 7. `<script is:inline>` — use it for all page scripts, place it inside BaseLayout

All `<script>` tags copied from design-source must use `is:inline`. Scripts placed outside `<BaseLayout>` render after `</body></html>` in Astro's compiled output and have unreliable event-listener registration.

**Rule:** Every page `<script is:inline>` block must be the last element INSIDE `<BaseLayout>` — not a sibling after it.

**Why:** index.astro had hover mouseenter listeners that never fired because the script appeared after `</html>`. All other pages (about.astro, patients.astro) correctly place the script inside `<BaseLayout>`.

**How to apply:** When adding or verifying a `<script is:inline>` tag, confirm placement with: `grep -n '</BaseLayout>\|<script is:inline'` — the script line number must be LOWER than `</BaseLayout>`. Also run `scripts/design-parity-check.sh` before committing any page `.astro` file. When debugging parity issues, copy the HTML file to `public/` and deploy as static — if it renders correctly, every deviation in the `.astro` version is something you introduced.

### 8. design-source/ is read-only — content changes go to Sanity, never hardcoded

design-source/ is a structural reference frozen at design time — never modify it.
When content changes (email, fax, phone, copy, image): update the value in Sanity Studio or schema defaults — not in design-source/, and not as a new hardcoded value in .astro.
The .astro file wires the field as `{sanityVar ?? "original-design-source-placeholder"}`. The fallback is the original design-source value; the live content comes from Sanity.

### 9. Before reporting any image slot status — independently verify all three things

Before reporting a slot as done, missing, or already-correct, verify: (1) the file exists at the exact referenced path; (2) the filename matches the intended image for that slot — not a leftover placeholder from a prior session; (3) the DOM order at each target selector matches the spec — read the surrounding label/heading text, not just positional assumptions from the brief.

**Why:** Three recurring failures share this root cause — files reported missing were present in recent git commits; a slot reported as "already local" had the wrong filename (`communities-therapist-resident.png` instead of `communities-l16-handles.png`); specs written from visual descriptions had card order that differed from actual HTML, putting wrong images on wrong slots (providers.astro, patients.astro).

**How to apply:** For every slot in a placement task: print the current src even when already local, run `git show --name-only` on suspicious recent commits, and read the surrounding DOM context before mapping spec positions to HTML positions. Flag any mismatch before touching anything.

### 10. When audience categories don't map to form options — skip preselection

When a CTA opens a form but the CTA's semantic context (e.g. demographic/service category) doesn't cleanly map to a form field's options (e.g. clinical condition dropdown), do not attempt a forced or approximate mapping.

**Rule:** Report the mismatch, stop, wait for direction.
**Resolution pattern (confirmed by Igor 2026-05-05):** Skip preselection entirely — just open the modal with no preselected value.

### 11. Blog listing pages are a Lesson 2 exception — .map() is required for variable-count content

Lesson 2 ("no .map() loops, index by position") applies to static marketing pages with a known, fixed number of items (tracks, handles, tabs, etc.). Blog index, category, and subcategory pages are fundamentally different: the number of categories and posts is variable and not known at design time.

**Rule:** For blog listing pages, use `.map()` for genuinely variable-count content (article cards, category tiles, pill filters). Use `??` fallbacks for fixed/singleton fields (hero, newsletter, section headings). The design-source card HTML is the template for each `.map()` iteration.

**How to apply:** Before applying Lesson 2, ask: "Is the count of this array determined at design time or at content-entry time?" Fixed count → positional indexing. Variable/open-ended count → `.map()`.

### 12. When a deployed Studio fix doesn't take effect — suspect browser cache before writing more code

If a bug persists after a verified rebuild+redeploy, and the user-reported warning/error message format doesn't match the current source code, the browser is running a cached JS bundle — not the deployed version.

**How to apply:** Before diagnosing a "fix didn't work" report, compare the exact warning/error text from the user against what the current code would produce. If they don't match, the browser has old code — instruct a hard-refresh (Cmd+Shift+R). Do not write additional code fixes.

### 13. During investigation — state only what the code proves, never speculate about what the user sees

When investigating a visual bug without being able to render the page, stick to provable facts: what the CSS says, what the HTML says, what the git diff shows. Do not write sentences like "the user might see X" or "this probably looks wrong because Y" unless Y is directly readable from the code.

**How to apply:** Every claim in an investigation report must be traceable to a specific file, line, or git output. If a visual difference cannot be proven from the code, say "cannot determine from static analysis" and stop there.

### 14. Only change what the instruction explicitly names — do not scale adjacent/container dimensions

When given an instruction to change a specific value (e.g., "multiply the logo by 1.5"), change only that value. Do not change parent container dimensions, wrapper heights, or related elements unless explicitly asked.

**Why:** Igor instructed "Header logo — 1.5x current size." CC also scaled the nav bar height (84px → 126px) "proportionally to contain logo" — this was not in the instruction. The nav height change caused a visual regression reported sessions later.

**How to apply:** Read the instruction literally. If it says "the logo," change the logo img dimensions only. If the container also needs to change, that is a separate decision that requires explicit confirmation.

### 15. The tasks/ directory that counts is in the git repo — not the home directory

The project has a `tasks/todo.md` and `tasks/lessons.md` in the git repo. There is also a separate `/home/personal/projects/byt-website/tasks/` directory that is NOT in the repo. Always write task reviews and lessons to the **repo's** `tasks/` directory — the one that git tracks.

**How to apply:** When starting a session with a fresh clone, the correct todo.md is at `<clone>/tasks/todo.md`. Never write to `/home/personal/projects/byt-website/tasks/`. If both exist, the repo version is authoritative.

### 16. Middleware token roles: read token fetches, write token tracks — never gate redirects on the write token

When building middleware that (a) fetches data from a read API and (b) optionally writes analytics back:

- The **read token** controls whether the data fetch works — it must always be available for core functionality.
- The **write token** controls optional side-effects (hit tracking, analytics) — it may legitimately be absent.

**Why:** The initial middleware implementation used `SANITY_WRITE_TOKEN` as the single token for both fetching the redirect map and tracking hits, then returned `next()` (pass-through) if the token was missing. This meant the entire redirect system silently stopped working in any environment where only the read token was configured.

**How to apply:** Separate the two concerns:

1. Call `loadRedirectMap(readToken)` — `readToken` is optional; unauthenticated reads work on public datasets.
2. Only wrap hit-tracking in `if (writeToken)` — if absent, fire the redirect anyway and skip the counter.
   Never use the write token as a gate for read operations.

### 17. Verification checklist items must match what the code actually does — no contradictions allowed

When writing a MANDATORY VERIFICATION checklist at the end of a task, every "YES/NO" and every claimed value must be provably true based on the `git diff`. Do not mark "No HTML structure changed: YES" while simultaneously describing in the same message that the h1 was repositioned and a new element was added.

**Why:** Igor caught an explicit contradiction: the verification said "YES, no structure changed" but the explanation in the same message described the structural moves. This wastes review time and erodes trust in verification outputs.

**How to apply:** Before writing any checklist item, re-read the actual diff (`git diff`). If a structural element moved or a new element was added, the checklist must say "HTML structure changed: YES — [describe what changed and why]." Honest disclosures in the checklist are not failures; false "YES" claims are.

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
