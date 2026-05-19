# SESSION START PROTOCOL — EXECUTE THIS BEFORE ANYTHING ELSE

---

## RULE 0 — WORKING DIRECTORY (READ THIS FIRST)

Every session starts with: cd /home/personal/projects/byt-website

Every command, every file read, every file write, every deploy, every grep, every build operates from this directory. No exceptions.

When spawning Explore agents or sub-agents, pass the absolute path: /home/personal/projects/byt-website/apps/web/src/pages/[file].astro — never a relative path.

NEVER read, write, build, deploy, or operate from:

- /home/personal/projects/byt-website-work/
- /home/personal/projects/byt-website-edit/
- /home/personal/projects/byt-website-repo/
- /home/personal/projects/better-you-therapy/

These are stale clones. Using them has caused at least 4 production failures including false audit results, missing schema fields after deploy, and missing CMS-SKIP comments.

If your working directory is not /home/personal/projects/byt-website, stop and cd there before doing anything else.

---

1. Read this entire file top to bottom
2. Read `tasks/todo.md` — show current open/pending tasks
3. Read `tasks/lessons.md` — review all past lessons
4. Confirm out loud: "CLAUDE.md loaded. todo.md and lessons.md reviewed. Ready."
5. Do NOT begin any work until steps 1–4 are confirmed

VIOLATIONS: If I skip todo.md, lessons.md, or any step above — stop me immediately.
Point to the exact rule I broke. Do not apologize. Fix it on the spot.

---

## REQUIRED: Build Method — Raw HTML Injection (Mandatory)

This is the ONLY approved method for building page .astro files. No exceptions.

1. **Design-source HTML files are build specs.** The files in `design-source/pages/` are complete, working web pages. Your job is to serve them, not rewrite them.

2. **Copy everything** between `<body>` and `</body>` from the design-source HTML into the .astro page inside the Layout component.

3. **All `<style>` blocks come verbatim.** All `<script>` tags use `is:inline`. No changes.

4. **Never rename classes, move styles to global.css, restructure DOM, change semantic elements, or extract sections into components.**

5. **When copying `<style>` blocks from design-source: strip all shared selectors that `global.css` owns.** See `docs/css-architecture.md` for the complete list. Keep only page-specific selectors.

6. **No `--byt-*` prefixed tokens permitted in any `.astro` file.** All tokens use unprefixed System A names (e.g. `--navy`, not `--byt-navy`).

7. **Sanity variables replace ONLY individual text strings and image src values.** The pattern:

   ```
   {patientsPage.heroHeading ?? "Care that meets you where you are"}
   ```

   Every Sanity variable MUST have a `??` fallback to the original hardcoded value from the source HTML.

8. **NEVER replace HTML structure with Sanity `.map()` loops.** The HTML cards, tabs, tracks, and grids stay hardcoded from the source file. Only the text inside them gets a Sanity variable. If you need to make an array editable, index into it by position:

   ```
   {cards?.[0]?.heading ?? "Original Heading"}
   ```

9. **One page at a time.** Build, deploy, wait for Igor's visual confirmation. Do not start the next page until the current one is confirmed.

10. **Audit global.css** for specificity conflicts against page-level styles before every commit.

11. **Reference:** `docs/BYT_Process_Learnings_v4_AstroSanity.docx`

---

## REQUIRED: Task Management

REQUIRED: Before any task — write plan to `tasks/todo.md` with checkable items
REQUIRED: Check in with user before starting implementation
REQUIRED: Mark items complete in `todo.md` as you go
REQUIRED: Add review section to `tasks/todo.md` before committing
REQUIRED: After ANY user correction — update `tasks/lessons.md` immediately, before continuing
REQUIRED: At session end — both files must reflect everything done this session

NEVER commit without `todo.md` review section written
NEVER ignore a correction without logging it to `lessons.md`
NEVER start work without confirming this file was read in full

---

## REQUIRED: Quality Gates

REQUIRED order: Edit → Verify → Commit. Never commit then verify.
REQUIRED: Run the actual function/test and confirm output before committing
REQUIRED: One bug = one commit. Atomic fixes, clean git history.
REQUIRED: Run full CLAUDE.md audit on every file touched before committing
REQUIRED: After `replace_all` — immediately verify the constant declaration was not self-replaced
REQUIRED: Run `scripts/design-parity-check.sh` before committing any page .astro file

NEVER mark a task complete without proving it works
NEVER fix data without fixing the code that wrote it
NEVER audit only the main file — audit EVERY file changed this session

---

## REQUIRED: Commit Protocol

NEVER run `git commit` without running `/pre` first.
The commit hook will block any commit attempt.
The sequence is: `/pre` → `git commit` → `/post`

---

## REQUIRED: Four-Step Triad (Five for Images)

Every CMS field change must complete ALL steps. If any step is missing, the site may render correctly (fallbacks hide the gap) but the CMS is broken.

1. SCHEMA — Field defined in apps/studio/schemas/[type].ts
2. QUERY — Field fetched in apps/web/src/lib/queries.ts
3. TEMPLATE — Field wired in apps/web/src/pages/[page].astro with ?? fallback
4. SEED — Field populated in published Sanity document with real content
5. IMAGE — (if image field) Asset uploaded with _type: 'imageWithAlt', reference stored

After any CMS change, verify all steps are complete before committing.

---

## REQUIRED: Image Type — imageWithAlt

Every image field in every schema uses `type: 'imageWithAlt'`. Never use raw `type: 'image'`.

Correct mutation format:

```javascript
{
  _type: 'imageWithAlt',
  alt: 'descriptive text',
  asset: { _type: 'reference', _ref: 'image-[hash]-[WxH]-[ext]' }
}
```

If stored with `_type: 'image'`, Studio shows empty image wells.

---

## REQUIRED: Sanity Studio Deploy

Every Studio deploy follows this exact sequence. No shortcuts.

```bash
cd /home/personal/projects/byt-website
git pull origin main
cd apps/studio
rm -rf node_modules/.cache dist
SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy
```

After deploy: remind Igor to hard-refresh Studio (Cmd+Shift+R).

---

## REQUIRED: Content Seeding

- Mutations target published documents ONLY — no "drafts." prefix on _id
- Use patch().set() — not setIfMissing()
- Images use _type: 'imageWithAlt' (NOT 'image')
- Fetch document after mutation — confirm values
- Hard-refresh Studio — fields show content, not empty

---

## REQUIRED: Rebuild Trigger

Sanity content changes do NOT trigger Cloudflare deploys. After seeding:

```bash
git commit --allow-empty -m "chore: trigger rebuild for Sanity content change" && git push origin main
```

---

## REQUIRED: Audit Protocol — Site-First, Never Schema-First

Wrong: "For each Sanity field, is it populated?" — misses everything with no schema field.
Right: "For every visible element on the rendered page, does a Sanity field exist?"

1. Is it visible on the site? → If yes, continue
2. Does a Sanity variable exist for it in the template? → CMS status
3. If no variable: Is it marked `<!-- CMS-SKIP: reason -->`? → Documented exception
4. If neither: HARDCODED — needs a schema field or CMS-SKIP documentation

---

## REQUIRED: Proof-of-Work — grep Output for Every Change

"I added X" is NOT acceptable. "Here is the grep showing X at line N" IS required.

For batch fixes (3+ items): show grep output for EVERY item. No summary. Raw file content only.

For any commit claiming N fixes, also show:
- `git diff --stat` showing actual file changes
- If lines changed = 0 and items claimed > 0, the report is fabricated

---

## REQUIRED: Agent Chain

You operate through AGENT_pm. You do NOT write code directly.
When you receive a task, invoke @AGENT_pm. AGENT_pm delegates to @AGENT_builder, @AGENT_qa, and @AGENT_docs.
If you find yourself writing code without AGENT_pm having issued a task brief — STOP. That is a violation.

Verification hooks live in `docs/hooks/`. Read and execute them when instructed.

---

## REQUIRED: File Protection

NEVER modify this file (CLAUDE.md). It is Igor's input. Read-only for you.
NEVER modify files in `.claude/agents/` or `.claude/skills/`. They are Igor's input.
NEVER modify `.claude/settings.json`. It is Igor's input.
If any of these files need changes, log an obstacle and ask Igor.

---

## Hard Rules

1. Never commit directly to `main`. Feature branches → PR → Igor approval → merge.
2. Never edit `design-source/`. It is read-only input.
3. Never hardcode design values. Colors, fonts, copy, phone numbers, URLs → CSS variables, Sanity, or env vars.
4. Never use `any` in TypeScript. Use `unknown` and narrow.
5. Never inline `console.log` in committed code.
6. Never force-push to `main` or rewrite shared history.
7. Never delete `/backups/`.
8. Never improvise on architecture. When blocked, log an obstacle and stop.

---

## What Counts as an Architectural Decision (log OBS and STOP)

- Adding a new dependency not in the task brief
- Adding or changing an adapter (e.g., Cloudflare adapter)
- Creating config files not specified in the task brief (e.g., sanity.config.ts in a new location)
- Changing an API or renaming an export (e.g., defineCli → defineCliConfig)
- Changing the output mode (static → hybrid → server)
- Any workaround for a version incompatibility

If you encounter ANY of these: create `OBS-XXX-<short-name>.md`, stop, report to Igor.

---

## Code Standards

- Simplicity first: make every change as simple as possible
- No temporary fixes: find root causes, senior developer standards
- Minimal impact: only touch what's necessary
- Functions ≤ 30 lines. Extract helpers when exceeded.
- No magic strings or numbers. Named constants for everything.
- Every type assertion needs a `// safe:` comment

---

## Workflow

### Plan Mode

- Enter plan mode for ANY task with 3+ steps or architectural decisions
- If something goes sideways: STOP and re-plan. Do not keep pushing.
- Write detailed specs upfront to reduce ambiguity
- WAIT for Igor's approval before executing the plan

### Bug Fixing

- When given a bug report: fix it. No hand-holding required.
- Trace the full path before fixing: input → processing → output
- Fix all broken links in one pass, not one at a time
- When fixing multiple bugs in sequence: STOP after each fix and run `/pre` before moving to the next

### Subagents

- Use subagents to keep main context clean — one task per subagent
- Offload research, exploration, and parallel analysis

### Self-Improvement Loop

- After ANY correction: stop → log to `tasks/lessons.md` → resume
- Review `lessons.md` at every session start

---

## Environment & Credentials

NEVER commit credentials. NEVER hardcode API keys in source files.
Credentials live in `.env` or `.env.local` (gitignored).
Template with key names (no values) committed as `.env.example`.
NEVER ask the user for credentials. If `.env.local` is missing, say so and stop.

See `docs/env-registry.md` for all environment variables and their purpose. `SANITY_DEPLOY_TOKEN` must be used for Studio deploys — see `docs/deploy-runbook.md`.

---

## Deploy

Cloudflare Pages auto-deploys from GitHub on merge to `main`. No manual deploy needed.
Push to main. Wait for auto-deploy. Do NOT manually trigger builds, poll deployment status, or debug deployment tokens.

If deploy fails with auth error: `source ~/.profile` first, then retry.

NEVER ask the user for the Cloudflare API token.
`CLOUDFLARE_API_TOKEN` is set in `~/.bashrc` and `~/.profile`.
NEVER hardcode the token. NEVER print the token value.

---

## Tech Stack

| Layer           | Choice                                       |
| --------------- | -------------------------------------------- |
| Framework       | Astro 6 (static output)                      |
| CMS             | Sanity v4 (mounted at `/admin`)              |
| Hosting         | Cloudflare Pages                             |
| Forms           | Formspree                                    |
| Language        | TypeScript strict                            |
| Package manager | pnpm (workspace)                             |
| Styling         | Native CSS + design tokens via CSS variables |

---

## Commands

```bash
pnpm install                    # install everything
pnpm --filter web dev           # Astro dev server
pnpm --filter studio dev        # Sanity Studio locally
pnpm --filter web build         # build the site
pnpm --filter web check         # astro check
pnpm typecheck                  # tsc across workspaces
pnpm lint                       # eslint
pnpm format                     # prettier
```

---

## Source-of-Truth Hierarchy

When information conflicts, top wins:

1. `docs/decision-log/` — explicit Igor-approved decisions
2. `design-source/` — visual design truth
3. Sanity content — runtime content
4. Existing code — current implementation

Never resolve a conflict between sources unilaterally. Log an obstacle and wait.

---

## Branching

- `main` — always deployable, auto-deploys via Cloudflare Pages
- `feat/*`, `fix/*`, `docs/*`, `chore/*` — short-lived, merged via PR
- `hotfix/*` — emergency production fixes
- Conventional Commits: `feat(scope): description`, reference DEC/OBS IDs when applicable

---

## When Blocked

1. Log obstacle: `docs/obstacle-log/OBS-XXX-<short-name>.md`
2. Stop work
3. Report to Igor with the OBS-XXX reference
4. Wait for direction

## When Live Site Diverges from Design-Source

1. Create `OBS-XXX-design-divergence-<page>.md`
2. Document the diff (file paths, line numbers)
3. Stop work on that page
4. Report to Igor

---

## CC Deviation Patterns — Known Failures

Eight documented patterns. When you detect yourself doing any of these, stop and correct.

| # | Pattern | Detection |
|---|---------|-----------|
| 1 | Claims "no changes" while describing changes | Contradiction between checkboxes and explanatory text |
| 2 | Labels bugs as "pre-existing" without proof | Demand git log evidence |
| 3 | Deploys Studio from wrong directory | Check pwd matches canonical clone |
| 4 | Uploads images with wrong _type | Studio shows empty image wells |
| 5 | Fills verification checkboxes without reading | Ask for raw file content at specific line |
| 6 | Seeds content into draft documents | Check for "drafts." prefix on _id |
| 7 | Skips /pre and commits directly | CC outputs "committed" without Igor typing /pre |
| 8 | Phantom execution — fabricates entire reports | grep shows zero changes were made to any file |

Pattern 8 is the most severe. CC reported 15 fixes as complete with specific status markers. A re-audit showed zero changes were made. Defense: proof-of-work grep after every change.

---

## Verification Hooks

Hooks live in `docs/hooks/`. Each is a prompt template for a specific verification task.

| Hook | Trigger | File |
|------|---------|------|
| HOOK_01 CMS Parity | After every deploy | docs/hooks/HOOK_01_CMS_Parity.md |
| HOOK_02 Schema-Data | After schema changes | docs/hooks/HOOK_02_Schema_Data.md |
| HOOK_03 SEO | After page changes | docs/hooks/HOOK_03_SEO.md |
| HOOK_04 LLM/GEO | After content changes | docs/hooks/HOOK_04_LLM_GEO.md |
| HOOK_05 Visual | After template changes | docs/hooks/HOOK_05_Visual.md |
| HOOK_06 Studio Sync | After Studio deploy | docs/hooks/HOOK_06_Studio_Sync.md |
| HOOK_07 Image | After image uploads | docs/hooks/HOOK_07_Image.md |
| HOOK_08 Post-Fix | After any fix commit (3+ items) | docs/hooks/HOOK_08_Post_Fix.md |

| Event | Run these hooks |
|-------|----------------|
| After code deploy | HOOK_05 |
| After schema + Studio deploy | HOOK_02 + HOOK_06 |
| After image uploads | HOOK_07 |
| After template wiring | HOOK_01 + HOOK_05 |
| After commit claiming 3+ fixes | HOOK_08 |
| Before launch / end of sprint | ALL |
