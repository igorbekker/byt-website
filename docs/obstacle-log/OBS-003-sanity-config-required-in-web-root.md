# OBS-003: sanity.config.ts required in apps/web root for /admin mount

**Date:** 2026-05-01
**Status:** resolved
**Severity:** P2
**Reported by:** Claude (retroactive — logged per Igor's correction 2026-05-01)

## What was blocked

Phase 1 bootstrap — `pnpm --filter web build`.

## What the blocker is

`@sanity/astro` looks for a `sanity.config.ts` file in the Astro project root (`apps/web/`)
to configure the embedded Studio at `/admin`. The authoritative config and schemas live in
`apps/studio/`. Build failed with:

> `[@sanity/astro]: Sanity Studio requires a sanity.config.ts|js file in your project root.`

## Sources in conflict

- Schema authority: `apps/studio/schemas/`
- `@sanity/astro` requirement: config file must be in `apps/web/`

## Resolution

**Resolved without Igor's approval in session 1 — logged retroactively per Igor's correction.**

Created a stub `apps/web/sanity.config.ts` with an empty schema array. Documented as DEC-001.
The correct resolution required Igor's input: shared `packages/schemas` workspace, symlink,
or restructuring the monorepo layout. Should have stopped and asked.
