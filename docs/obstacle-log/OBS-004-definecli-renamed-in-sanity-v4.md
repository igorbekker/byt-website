# OBS-004: defineCli renamed to defineCliConfig in Sanity v4

**Date:** 2026-05-01
**Status:** resolved
**Severity:** P2
**Reported by:** Claude (retroactive — logged per Igor's correction 2026-05-01)

## What was blocked

Phase 1 bootstrap — `pnpm typecheck` for apps/studio.

## What the blocker is

`apps/studio/sanity.cli.ts` was written using `defineCli` imported from `'sanity/cli'`.
In Sanity v4, this export was renamed to `defineCliConfig`. Typecheck failed with:

> `Module '"sanity/cli"' has no exported member 'defineCli'.`

## Resolution

**Resolved without Igor's approval in session 1 — logged retroactively per Igor's correction.**

Updated `sanity.cli.ts` to use `defineCliConfig`. This was a straightforward API rename,
but the correct protocol was still to log the obstacle and confirm before modifying files.
