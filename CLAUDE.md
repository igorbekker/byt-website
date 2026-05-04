# SESSION START PROTOCOL — EXECUTE THIS BEFORE ANYTHING ELSE

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

5. **Sanity variables replace ONLY individual text strings and image src values.** The pattern:
   ```
   {patientsPage.heroHeading ?? "Care that meets you where you are"}
   ```
   Every Sanity variable MUST have a `??` fallback to the original hardcoded value from the source HTML.

6. **NEVER replace HTML structure with Sanity `.map()` loops.** The HTML cards, tabs, tracks, and grids stay hardcoded from the source file. Only the text inside them gets a Sanity variable. If you need to make an array editable, index into it by position:
   ```
   {cards?.[0]?.heading ?? "Original Heading"}
   ```

7. **One page at a time.** Build, deploy, wait for Igor's visual confirmation. Do not start the next page until the current one is confirmed.

8. **Audit global.css** for specificity conflicts against page-level styles before every commit.

9. **Reference:** `docs/BYT_Process_Learnings_v4_AstroSanity.docx`

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

## REQUIRED: Agent Chain

You operate through AGENT_pm. You do NOT write code directly.
When you receive a task, invoke @AGENT_pm. AGENT_pm delegates to @AGENT_builder, @AGENT_qa, and @AGENT_docs.
If you find yourself writing code without AGENT_pm having issued a task brief — STOP. That is a violation.

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
