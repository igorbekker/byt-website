# OBS-006 — Sanity Studio deploy requires Administrator token

**Date:** 2026-05-01
**Phase:** Phase 3 — Sanity Studio Setup
**Step:** Step 9 — Deploy Studio to sanity.studio hosting

---

## What happened

Running `SANITY_AUTH_TOKEN=<editor-token> npx sanity deploy --yes` from `apps/studio/` fails with:

```
✗ Forbidden - User is missing required grant sanity.project.deployStudio
  to perform this operation (traceId: 3073b23167aeeda4074a496b591546f7)
```

The `SANITY_AUTH_TOKEN` Igor provided has **Editor** role. Deploying a Studio to Sanity hosting requires the **Administrator** grant `sanity.project.deployStudio`.

---

## What was attempted

1. `sanity documents create` via CLI → blocked by missing CLI auth session (no browser)
2. Seeded siteSettings directly via HTTP mutations API — **succeeded**
3. Added `studioHost: 'byt-website'` to `sanity.cli.ts` to bypass the hostname prompt — done
4. `SANITY_AUTH_TOKEN=<editor-token> npx sanity deploy --yes` → **Forbidden**

---

## What is working

- Cloudflare Pages is live at **https://byt-website.pages.dev** (HTTP 200)
- siteSettings document seeded in Sanity dataset
- Studio runs locally with `pnpm --filter studio dev`
- `studioHost: 'byt-website'` is committed to `sanity.cli.ts`

---

## Blocked on

`https://byt-website.sanity.studio` — returns 404. Studio not yet deployed to Sanity hosting.

---

## Resolution options for Igor

**Option A (recommended):** Run from your local terminal where you're logged in as Admin:

```bash
cd apps/studio && npx sanity deploy
```

The `studioHost: 'byt-website'` is already in `sanity.cli.ts`, so no hostname prompt will appear.

**Option B:** In sanity.io/manage → project `bpjtbps6` → API → Tokens → create a token with **Administrator** role. Store it as `SANITY_AUTH_TOKEN` in `~/.profile`. Then CC can retry the deploy.

---

## Status

Blocked. All other Phase 3 work is complete. Studio deploy awaits Igor.
