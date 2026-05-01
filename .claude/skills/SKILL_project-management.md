# SKILL: Project Management

Domain knowledge for the PM agent. Operating model, delegation, phased delivery, and quality gates.

---

## Operating Model

| Agent | Role | Does | Never Does |
|---|---|---|---|
| Igor | Director | Business decisions, approves gates, owns timeline | Writes code |
| Claude.ai | Strategic agent | Authors scope, writes prompts, audits output | Implementation code |
| Claude Code | Implementation agent | Writes code, builds, Git ops, PRs | Architectural decisions unilaterally; merges without Igor |

### Workflow

1. Igor states a goal
2. PM decomposes into task briefs
3. PM delegates to builder/docs/qa agents
4. Builder executes, QA validates, docs logs
5. PM reports status to Igor
6. Igor reviews and approves

---

## Source-of-Truth Hierarchy

When information conflicts, top wins:

1. `docs/decision-log/` — explicit Igor-approved decisions
2. `BYT_Website_Master_Playbook.docx` — business strategy
3. `design-source/` — visual design truth
4. Sanity content — runtime content
5. Existing code — current implementation

---

## Delegation Matrix

| Agent | Trigger |
|---|---|
| `@AGENT_builder` | Any code change |
| `@AGENT_docs` | Documentation, logs, runbooks, README |
| `@AGENT_qa` | After code changes, before merges, before deploys |

### Sequencing

- Never write code — delegate to builder
- Never skip QA — always after builder, before reporting success
- Never skip docs — if architecture/scope changes or workaround introduced
- Parallel OK: docs + builder on unrelated files
- Sequential required: builder → QA → docs

---

## Phased Delivery

Each phase produces something deployable. No phase starts without prior gate cleared.

| Phase | Name | Gate |
|---|---|---|
| 0 | Foundations & Accounts | All credentials active |
| 1 | Repository Bootstrap | First PR merges, CI green, CLAUDE.md present |
| 2 | Design Source Ingestion | Styleguide at `/styleguide/` matches design-source |
| 3 | Sanity Studio | Editors can log in, edit, see changes |
| 4 | Static Pages (CMS-Driven) | Each page: parity + Lighthouse 95+ + a11y + Igor approval |
| 5 | Forms | Submissions arrive, honeypot works |
| 6 | Blog System | Real post published unassisted, schema validates |
| 7 | Pre-Launch Hardening | Full checklist 100% complete |
| 8 | Cutover | Site live on getbetteryou.com |

---

## Quality Gates

### Pre-Commit

- Prettier format
- ESLint
- TypeScript type-check
- Astro check
- Forbidden-string scan (hex colors, phone numbers, emails)

### Pre-Push

- Full type-check
- Full build (`pnpm --filter web build`)

### PR CI

- Lint + type-check + build (web + studio)
- Preview deploy to Cloudflare Pages
- Lighthouse CI
- Schema validation
- Igor approves before merge

### Post-Deploy Smoke

- Homepage loads
- All Tier 1 pages load
- Sanity Studio loads at `/admin`
- Contact form posts to Formspree
- Sitemap reachable
- Schema validates

Failure of any: rollback, log obstacle.

---

## Folder Structure (High-Level)

```
├── .claude/          # Skills, agents, hooks, commands
├── apps/web/         # Astro frontend
├── apps/studio/      # Sanity Studio
├── design-source/    # READ ONLY — Igor uploads
├── docs/             # Scope, logs, runbooks
├── tasks/            # todo.md, lessons.md
├── backups/          # Gitignored snapshots
├── scripts/          # Backup, deploy, parity scripts
```

---

## Backup Protocol

### Code

- Primary: GitHub (the repo)
- Secondary: daily Git bundle to `/backups/git/`
- Tertiary: weekly off-VPS sync

### Sanity Content

- Daily export to `/backups/sanity/`
- 30 daily, 12 monthly, indefinite annual retention

### Pre-Risky-Operation

Before schema migrations, major dependency bumps, or content type renames: run `./scripts/backup-pre-op.sh "<description>"` to create tagged snapshot.
