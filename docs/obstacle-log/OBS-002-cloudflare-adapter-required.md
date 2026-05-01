# OBS-002: @astrojs/cloudflare adapter required for any SSR routes

**Date:** 2026-05-01
**Status:** resolved
**Severity:** P2
**Reported by:** Claude (retroactive — logged per Igor's correction 2026-05-01)

## What was blocked

Phase 1 bootstrap — `pnpm --filter web build`.

## What the blocker is

`@sanity/astro` adds a server-rendered route for the `/admin` Studio mount.
Astro 6 requires an adapter installed whenever any route uses SSR, even in
`output: 'static'` mode. Build failed with `NoAdapterInstalled` error.

## Sources in conflict

- Task brief specifies: `output: 'static'`
- `@sanity/astro` integration: adds SSR routes, requires adapter

## Resolution

**Resolved without Igor's approval in session 1 — logged retroactively per Igor's correction.**

Added `@astrojs/cloudflare@13.3.0` adapter (v12 supports only Astro 5; v13 supports Astro 6).
This is an architectural decision — hosting model, SSR vs static, adapter choice — that
required Igor's input before proceeding.
