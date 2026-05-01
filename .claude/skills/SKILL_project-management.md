# SKILL: Project Management

Domain knowledge for the PM agent. Operating model, delegation, phased delivery, and quality gates.

---

## Source-of-Truth Hierarchy

When information conflicts, top wins:

1. `docs/decision-log/` — explicit Igor-approved decisions
2. `design-source/` — visual design truth
3. Sanity content — runtime content
4. Existing code — current implementation

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
| 2 | Design Source Ingestion | Styleguide matches design-source |
| 3 | Sanity Studio | Editors can log in, edit, see changes |
| 4 | Static Pages (CMS-Driven) | Each page: parity + Lighthouse 95+ + a11y + Igor approval |
| 5 | Forms | Submissions arrive, honeypot works |
| 6 | Blog System | Real post published unassisted, schema validates |
| 7 | Pre-Launch Hardening | Full checklist 100% complete |
| 8 | Cutover | Site live on getbetteryou.com |

---

## Quality Gates

### Pre-Commit
- Prettier format, ESLint, TypeScript type-check, Astro check

### Pre-Push
- Full type-check, full build (`pnpm --filter web build`)

### PR CI
- Lint + type-check + build (web + studio), preview deploy, Lighthouse CI, Igor approves

### Post-Deploy Smoke
- Homepage loads, all Tier 1 pages load, Studio at `/admin`, contact form posts, sitemap reachable
- Failure of any: rollback, log obstacle.

---

## Backup Protocol

### Code
- Primary: GitHub (the repo)
- Secondary: daily Git bundle to `/backups/git/`

### Sanity Content
- Daily export to `/backups/sanity/`

### Pre-Risky-Operation
Before schema migrations, major dependency bumps: run `./scripts/backup-pre-op.sh "<description>"`
