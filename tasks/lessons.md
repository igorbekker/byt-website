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

### 15. Middleware token roles: read token fetches, write token tracks — never gate redirects on the write token

When building middleware that (a) fetches data from a read API and (b) optionally writes analytics back:

- The **read token** controls whether the data fetch works — it must always be available for core functionality.
- The **write token** controls optional side-effects (hit tracking, analytics) — it may legitimately be absent.

**Why:** The initial middleware implementation used `SANITY_WRITE_TOKEN` as the single token for both fetching the redirect map and tracking hits, then returned `next()` (pass-through) if the token was missing. This meant the entire redirect system silently stopped working in any environment where only the read token was configured.

**How to apply:** Separate the two concerns:

1. Call `loadRedirectMap(readToken)` — `readToken` is optional; unauthenticated reads work on public datasets.
2. Only wrap hit-tracking in `if (writeToken)` — if absent, fire the redirect anyway and skip the counter.
   Never use the write token as a gate for read operations.

### 16. "Build Complete!" does not mean every page built correctly — always check file size for key routes

`pnpm --filter web build` reports "Complete!" even if individual routes fail during prerendering. A failed route produces a 0-byte HTML file and silently ships a blank white page to production.

**Why:** The middleware threw `TypeError: Unable to parse URL` during the communities prerender. The build caught the error per-route but still reported overall success. The 0-byte `communities/index.html` deployed undetected.

**How to apply:** After any build that touches middleware, routing, or page-level data fetching — run `wc -c dist/client/<key-routes>/index.html` to verify file sizes are non-zero. A healthy page is typically 30–100KB. A 0-byte or sub-1KB file is a blank-page signal. Add this check to /pre for any commit touching middleware.ts.

### 17. Invoke /pre the moment work is verified — no exceptions

The commit protocol applies to every commit regardless of size. Invoke `/pre` the moment work is verified — no narrating the commit step, no treating the task brief's `git commit` line as a license to skip it.

**Why:** Violated twice in one session (patients + about page wiring): task brief included the commit command literally and it was executed without stopping. Igor had to remind both times. Also violated once more when commit step was described/implied without invoking `/pre` after seeding Sanity documents.

**How to apply:** The moment verification passes → the response ends with the `/pre` skill invocation. No prose, no summary, no "here's what I did." Task briefs listing a `git commit` command describe the desired end state, not a bypass. The size of the change is irrelevant.

**Violated again 2026-05-21:** Task brief included literal `git commit` + `git push` commands. Executed them directly. Fourth violation of this rule across sessions. The task brief's commit command is not a bypass — stop, run `/pre`, wait for approval regardless of what the brief says.

### 18. The Four-Step Triad must be verified complete before any CMS field work — audits start from the rendered site

Every user-facing text string and image must have a Sanity variable with a `??` fallback. The four-step triad must be complete for every field: (1) schema field declared, (2) field in GROQ query, (3) field wired in template, (4) document seeded in Sanity. For images, a fifth step: upload the asset to Sanity CDN with `_type: 'imageWithAlt'`. Studio must be redeployed after every schema change, from the canonical clone with `git pull` first.

**Why:** Two failure modes share this root — (1) parity audits repeatedly found fields present in schema but missing from the query, or wired but never seeded; each broken link silently falls back to hardcoded values; (2) task briefs that say "all code changes complete — data entry only" cannot be trusted without verification; a field absent from the schema cannot be entered in Studio, and a field absent from the template never reaches the rendered page.

**How to apply:** Audits start from the rendered site (what the user sees), not from the schema file. For every hardcoded string on a page: trace it back through template → query → schema → seeded data. A field that fails any step is incomplete. Before accepting any "data entry only" claim, run these three greps:

```bash
grep -n "fieldName" apps/studio/schemas/**/*.ts          # schema field exists?
grep -n "fieldName" apps/web/src/lib/queries.ts          # field in query?
grep -n "fieldName" apps/web/src/layouts/BaseLayout.astro apps/web/src/pages/*.astro  # wired in template?
```

If any grep returns nothing — the triad is broken. Do not proceed to data entry.

### 19. Unicode corruption in .astro files — three entry points, one detection method

LLM-generated text introduces Unicode curly quotes into `.astro` files through three distinct triggers. All produce identical-looking output in the terminal but break esbuild at build time.

**Entry point A — JSX conditional wrapping (U+2018/U+2019 single quotes):** Design-source `??` fallback strings sometimes use U+2018/U+2019 as the outer string delimiter. Astro's top-level JSX pass is lenient, but wrapping a section in `{condition && (...)}` forces esbuild to process inner expressions as strict JS — U+2018 is rejected as a string delimiter, producing `Unexpected "'"`.

**Entry point B — Agent full-rewrite (U+201C/U+201D double quotes in HTML attributes):** A general-purpose agent rewriting an entire `.astro` file "typographically corrects" ASCII `"` in HTML attributes (`class="..."`) to curly `"` (U+201C/U+201D). esbuild rejects these as attribute delimiters, producing `Unexpected """`.

**Entry point C — Edit tool near fallback strings (U+201D in id/aria attributes):** When an Edit inserts `id="foo"` adjacent to a line that already contains U+201C/U+201D curly quotes, the LLM may generate the new attribute's quotes as U+201D instead of ASCII U+0022, silently corrupting the id.

**Why:** All three share the same root cause — LLMs typographically "correct" ASCII punctuation when generating strings in contexts where curly quotes appear nearby. The Edit tool and agent writes output exactly what the LLM generates.

**How to apply:**

- Never use a general-purpose agent to rewrite an entire large `.astro` file — use targeted `Edit` calls only.
- Before wrapping a `<section>` in a conditional, scan for U+2018/U+2019 delimiters: `grep -n $'\xe2\x80\x98' apps/web/src/pages/<page>.astro`
- After any Edit that inserts `id=` or `aria-labelledby=` near a Unicode fallback string, run the bytes scan:

```bash
python3 -c "
data = open('path/to/file.astro', 'rb').read()
for line in data.split(b'\n'):
    if b'id=' in line and b'\xe2\x80' in line:
        print(repr(line[:120]))
"
```

- If a file fails to build with `Unexpected """`, immediately `git checkout HEAD -- <file>` and redo with targeted edits.
- Fix detected corruption with: `data.replace(b'id=\xe2\x80\x9dfoo\xe2\x80\x9d', b'id="foo"')`

### 20. All verification claims require evidence — grep before reporting, no contradictions

Before writing any "✓ fixed" or marking a checklist item complete, run `grep -n` for the exact string that was supposed to change. Show the raw grep output. Do not write "fixed" or mark [x] until grep confirms the change is in the file.

Checklist items must also match what the diff actually shows — do not mark "No HTML structure changed: YES" while the same message describes a structural move or new element added.

**Why:** Two distinct failure modes with the same root cause: (1) a full session's worth of CMS-SKIP and Sanity wirings were reported as complete and committed — every single one was absent from the files; (2) Igor caught an explicit checklist contradiction where "YES, no structure changed" appeared alongside an explanation of the structural changes made. Both waste review time and erode trust.

**How to apply:** After every Edit tool call, run the verification grep immediately. Before writing any checklist item, re-read the actual diff (`git diff`). If a structural element moved or a new element was added, the checklist must say so honestly. Honest disclosures are not failures; false "YES" claims are.

### 21. Working directory is /home/personal/projects/byt-website — always cd there first, always use absolute paths for subagents

Every session must start with `cd /home/personal/projects/byt-website`. Every file read, write, build, grep, and deploy must use that absolute path or a path relative to it. Subagents receive no cwd inheritance — always pass the absolute path explicitly (e.g. `/home/personal/projects/byt-website/apps/web/src/pages/contact.astro`).

The `tasks/` directory that counts is the one in this git repo. Never write to `/home/personal/projects/byt-website/tasks/` from a stale clone; the repo version is always authoritative.

**Why:** Diagnostic session 2026-05-19 confirmed: main cwd was `/home/personal`, not inside any project. Explore subagents received relative paths with no anchor. CLAUDE.md had no working directory rule. This caused at least 4 production failures: false audit results, missing schema fields after deploy, missing CMS-SKIP comments. RULE 0 added to CLAUDE.md.

**How to apply:** Session opens → run `cd /home/personal/projects/byt-website`. Before spawning any Explore or general-purpose agent, construct the file path as an absolute string starting with `/home/personal/projects/byt-website/`. Never pass a path like `apps/web/src/pages/contact.astro` to an agent — always the full path.

**Stale clones — NEVER use:**

- /home/personal/projects/byt-website-work/
- /home/personal/projects/byt-website-edit/
- /home/personal/projects/byt-website-repo/
- /home/personal/projects/better-you-therapy/

### 22. Before changing any font-family, verify --font-body and --font-heading in global.css

When a user says "use Manrope" or asks to change a font, do not apply the change until you have grepped global.css for `--font-body` and `--font-heading` and checked what font existing form components use.

**The BYT font split:**

- `--font-body: 'Montserrat'` — used on all body text, form labels, inputs, textareas, chips, modal elements
- `--font-heading: 'Manrope'` — used on h1–h5 and display headings only

Every form on the site (ModalForms.astro `.form-field label`, `.form-field input`, `.chip`, `.seg label`) uses `'Montserrat'` — which is `var(--font-body)`. A new form must match this or it will be visually inconsistent.

**Why:** Igor asked to change form labels from Montserrat to Manrope. The change was made without verifying global.css first. After investigation, the original Montserrat was correct and the change was reverted. Two unnecessary edits made, two back-and-forth rounds with Igor.

**How to apply:** When any font instruction is given: grep global.css first → show `--font-body` and `--font-heading` values → confirm the user's intent knowing both values → then change. Never make a font change on instruction alone without showing the current token definitions.

### 23. ESLint strict config rejects `catch (e)` and `catch (_e)` — use ES2019 optional catch binding

This project's `eslint.config.mjs` uses `tseslint.configs.strict` with no `argsIgnorePattern` or `caughtErrorsIgnorePattern` configured. As a result:

- `catch (e) {}` → `@typescript-eslint/no-unused-vars` error (`'e' is defined but never used`)
- `catch (_e) { /* comment */ }` → same error (`'_e' is defined but never used` — `_`-prefix is NOT an automatic ignore here)
- `catch { /* comment */ }` → **correct** — ES2019 optional catch binding; no variable, no unused-var error; comment inside satisfies `no-empty`

**Why:** `tseslint.configs.strict` enforces unused variables including caught errors. The `_`-prefix convention for "intentionally unused" is only active when `argsIgnorePattern: '^_'` is configured — which it is not in this project.

**How to apply:** Whenever writing a try/catch that intentionally ignores the error (e.g. localStorage access guards), use `catch { /* reason */ }` — no variable at all. Never use `catch (e)` or `catch (_e)` without a `caughtErrorsIgnorePattern` rule in place.

### 24. Cloudflare adapter vs. Pages Functions — mutual exclusion, and the Studio route gotcha

**The core rule:** `@astrojs/cloudflare` adapter generates `dist/server/entry.mjs` → Cloudflare Pages sees it as a `_worker.js` → ALL `functions/` directory Pages Functions are bypassed. The two routing systems are mutually exclusive.

- **With adapter:** use Astro server endpoints (`src/pages/api/*.ts` with `prerender = false`) — they compile into the Worker bundle.
- **Without adapter:** use Cloudflare Pages Functions (`functions/api/*.ts` at repo root with `onRequestPost`/`onRequestOptions`) — the Pages router handles them.

**The Studio route gotcha:** `@sanity/astro` with `studioBasePath` injects a route with `prerender = false` (SSR). Removing the adapter makes this unbuildable. Two fixes:

1. `studioRouterHistory: 'hash'` → `prerender: true`, BUT requires `@astrojs/react` to compile the `client:only="react"` component.
2. Remove `studioBasePath` entirely → Studio is separately deployed; `/admin` disappears from the Astro site (route count drops by 1).

**Signal for option 2:** if the plan says "N routes" and current build has N+1 (including `/admin`), removing `studioBasePath` is intended.

**How to apply:** When toggling adapter on/off, check: (a) does `src/pages/api/` exist? Delete it if removing adapter. (b) does `functions/` exist? Create it if adding Pages Functions. (c) does `studioBasePath` cause a build error? Remove it or install `@astrojs/react`.

### 25. Always confirm branch before running any diagnostic or file inspection

Before reading any file, running `ls`, or reporting what exists in the repo, run `git branch --show-current` and confirm it matches the expected branch. A diagnostic run on the wrong branch produces false reports.

**Why:** Ran a diagnostic for a production bug from `feat/phase-7a-production-readiness` instead of `main`. Reported `functions/api/newsletter.ts` as missing. The file existed on `main` and had been deployed. The user had to stop me and point out the branch mismatch. The session then wasted time attempting a cherry-pick that had already been done.

**How to apply:** First command of any diagnostic session: `git branch --show-current`. If it is not `main` (or whichever branch the production bug affects), checkout the correct branch before reading any files. Never issue a diagnostic finding without confirming which branch was inspected.

### 26. Audit all related endpoints together — never fix one form at a time

When investigating a form submission bug (400 error, missing field, payload mismatch), read ALL form/endpoint pairs in one pass before touching any code. One-off fixes waste context, miss systemic patterns, and produce a commit-per-bug mess instead of a single clean atomic commit.

**Why:** Igor corrected: "STOP doing one-off fixes. Audit ALL 5 form endpoints at once." The right workflow is: read all frontend submit handlers + all backend files → build a full mismatch table → fix everything in one commit.

**How to apply:** When any form-related bug is reported, the first action is always to list all form endpoints in the project and read every one (frontend + backend) before writing a single line of code. Produce the mismatch table first. Fix second.

### 27. When a form backend "passes required checks" but still fails — the error is HubSpot enum rejection, not required-field validation

Two distinct failure modes exist for form submissions:

1. **Required-field validation**: backend rejects because a field is empty. Fix: remove the field from the `required` Record.
2. **HubSpot INVALID_OPTION**: HubSpot rejects because a value doesn't match an enum option. Fix: add a value map in the backend.

Prior session fixed (1) but left (2) untouched. Forms still failed in the browser.

**Why:** The previous audit compared field names for presence, not field values for enum compatibility. HubSpot custom enum properties have specific internal option names (e.g., `Weekday mornings` not `weekday-am`; `50-100` not `50–100`). The only way to discover these is to actually curl with real browser payloads and read the HubSpot error response.

**How to apply:** When fixing form failures, the verification step MUST be: curl production with the EXACT values the browser would send (traced by reading the JS submit handler and HTML option values), not fabricated values. A curl that passes with `"bestTimesToReachYou": "weekday-am"` while the actual error is `INVALID_OPTION` is a false green. Always check HubSpot error bodies for `INVALID_OPTION` and map accordingly.

### 28. HubSpot find-or-create must always update existing objects — not just create

When a HubSpot helper searches for an existing object (company, contact) and finds one, the code must call the PATCH update in addition to reusing the ID. A pattern that only sets properties on `createCompany`/`createContact` will silently leave null values on any record that already existed.

**Why:** `facility-referral.ts` Step 1 searched for an existing company and reused its ID without calling PATCH. Properties added in later code versions (`facility_type`, `county`, `approximate_bed_count`) were never written to existing records — they stayed null indefinitely. The bug was invisible: the form succeeded (200), the company ID was valid, but three properties were empty in HubSpot.

**How to apply:** Any find-or-create block must follow this pattern for both branches:

```typescript
if (existingId) {
  await updateCompany(existingId, props, key); // ← always update
  objectId = existingId;
} else {
  objectId = await createCompany(props, key);
}
```

Never write `if (existingId) { objectId = existingId; }` without an update call. Apply the same rule to contacts in any endpoint where contact properties may change between submissions.

### 29. HubSpot Private App token — Files API requires explicit `file-manager-access` scope

A Private App token that successfully creates contacts, companies, and associations will return 403 on any Files API call (`/filemanager/api/v3/files/upload`) if the `file-manager-access` scope was not granted when the app was created.

**Why:** The apply endpoint uploaded resumes with `fileUploaded: false` and a 403 error on every submission. Contact creation succeeded; only the file step failed. The scope omission is invisible at the code level — the token itself is valid and works for all CRM endpoints.

**How to apply:** When a file upload returns `403: requires any of [file-manager-access]`, the fix is in HubSpot account settings, not in code:

1. HubSpot → Settings → Integrations → Private Apps → select the app
2. Scopes → CRM → check **Files** (read + write)
3. Save and rotate the token if required
4. No code change needed — the existing upload implementation is correct.

### 30. Task briefs may specify Sanity Studio registration steps that don't match the actual codebase — always read the files first

When a task brief says "register in `sanity.config.ts` singletonTypes and singletonActions," verify against the actual file before following. This project's singleton registration is handled entirely in `apps/studio/structure/index.ts` via the `SINGLETONS` array — not in `sanity.config.ts`. The brief was written from generic Sanity knowledge, not from reading this repo.

**Why:** Following the brief blindly would have added a `singletonTypes` block that doesn't match how this studio is configured, leaving the new singleton absent from the Pages sub-list while a redundant config block sat unused in `sanity.config.ts`.

**How to apply:** For any step that says "register in X" or "follow pattern Y," read the named file before writing. If the actual file uses a different pattern, follow the actual file and note the discrepancy in pre-flight.

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
- 2026-05-21: Edit tool introduced Unicode RIGHT DOUBLE QUOTATION MARK (U+201D) in place of ASCII `"` when writing `id="mission-heading"` adjacent to a fallback string containing curly quotes. Caught by grep before commit. Fixed with byte-precise python replace. See Lesson 29.
- 2026-05-18: Skipped /pre twice in one session (patients and about page field-wiring tasks). Committed and pushed directly. Lesson 17 existed and was ignored. Repeat violation.
- 2026-05-19: Operated from /home/personal (not project clone) with no cwd anchor in CLAUDE.md. Explore subagents received relative paths. Caused false audits, missing schema fields, missing CMS-SKIP comments. Fixed by adding RULE 0 to CLAUDE.md. (OBS-015)
