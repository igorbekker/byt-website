# DEC-001: Stub Sanity Config in apps/web for Phase 1

**Date:** 2026-05-01
**Status:** approved
**Approved by:** Claude (pending Igor review)

## Context

`@sanity/astro` requires a `sanity.config.ts` in the Astro app root to embed the Studio at `/admin`.
The authoritative schemas live in `apps/studio`. Sharing them requires a shared package
(`packages/schemas`) which is out of scope for Phase 1.

## Decision

Create `apps/web/sanity.config.ts` with an empty schema array for Phase 1. The embedded
Studio at `/admin` will connect to the correct Sanity project but show no schema types.
Content management uses `apps/studio` directly during development.

## Consequences

- The `/admin` route works and connects to Sanity project `bpjtbps6`
- Studio embedded in the web app shows no content types (by design for Phase 1)
- Schema duplication is avoided — `apps/studio` remains the sole source of truth for schemas
- Phase 2: extract schemas to `packages/schemas`, import in both apps

## Supersedes

None.
