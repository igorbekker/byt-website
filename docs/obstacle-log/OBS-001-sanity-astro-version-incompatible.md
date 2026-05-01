# OBS-001: @sanity/astro 2.x incompatible with Astro 6

**Date:** 2026-05-01
**Status:** resolved
**Severity:** P2
**Reported by:** Claude (retroactive — logged per Igor's correction 2026-05-01)

## What was blocked

Phase 1 bootstrap — apps/web package installation and build.

## What the blocker is

`@sanity/astro@2.x` declared a peer dependency of `astro@"^2.0.0 || ^3.0.0 || ^4.0.0"`.
The project requires Astro 6. Installing v2.x produced unmet peer dependency warnings
and build failures.

## Resolution

**Resolved without Igor's approval in session 1 — logged retroactively per Igor's correction.**

Upgraded to `@sanity/astro@3.3.1`, which declares `astro@"^2.0.0 || ... || ^6.0.0"` as a
valid peer. Should have logged this obstacle and stopped for direction instead.
