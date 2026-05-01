# Task Plan

## Status Legend

- [ ] Pending
- [x] Complete
- [~] In Progress
- [!] Blocked

---

## Phase 1 — Repo Bootstrap + Design-Source Setup

### Job 1: Design-Source [x] COMPLETE

- [x] Zip uploaded by Igor (Homepage (1).zip)
- [x] Extracted and sorted into pages/, partials/, styles/, assets/, assets/wireframes/, assets/vendor/
- [x] design-source/README.md written with full index
- [x] Committed to main: chore(design-source)

### Job 2: Monorepo + CMS Bootstrap [x] COMPLETE

- [x] feat/phase-1-bootstrap branch created
- [x] pnpm-workspace.yaml (apps/web, apps/studio)
- [x] Root package.json with workspace scripts
- [x] .editorconfig, .nvmrc (Node 22), .npmrc
- [x] .gitignore updated (.astro/, backup dirs)
- [x] apps/web — Astro 6 + @astrojs/cloudflare adapter
- [x] apps/web/astro.config.mjs — static output, Sanity integration, /admin studio mount
- [x] apps/web/tsconfig.json — extends astro/tsconfigs/strictest
- [x] apps/web/src/styles/global.css — CSS token scaffold
- [x] apps/web/src/layouts/, src/components/, src/lib/queries.ts, src/pages/index.astro
- [x] apps/web/src/env.d.ts
- [x] apps/web/sanity.config.ts — stub config for embedded studio (see DEC-001)
- [x] apps/studio — Sanity v4 (projectId: bpjtbps6, dataset: production)
- [x] apps/studio/sanity.config.ts, sanity.cli.ts
- [x] apps/studio/schemas/ — siteSettings singleton (phone, email, address, businessName)
- [x] ESLint flat config (TypeScript strict)
- [x] Prettier + prettier-plugin-astro
- [x] Husky + lint-staged pre-commit hook
- [x] .github/workflows/ci.yml — lint, typecheck, build on PR
- [x] docs/decision-log/ — README + DEC template
- [x] docs/obstacle-log/ — README + OBS template
- [x] backups/manifests/backup-manifest.template.md
- [x] scripts/backup-git.sh, backup-sanity.sh
- [x] .env.example
- [x] pnpm install — clean
- [x] pnpm --filter web build — passes
- [x] pnpm typecheck — passes
- [x] pnpm lint — passes

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
