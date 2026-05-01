# OBS-006 — `sanity documents create` requires authenticated login session

**Date:** 2026-05-01
**Phase:** Phase 3 — Sanity Studio Setup
**Step:** Step 8 — Populate siteSettings with real data

---

## What happened

Running `npx sanity documents create --replace --id siteSettings -` from `apps/studio/` exited with:

```
Error: You must login first - run "sanity login"
```

The Sanity CLI requires an interactive browser-based OAuth login session. This environment has no browser access, and no `SANITY_AUTH_TOKEN` is present in `~/.profile`, `~/.bashrc`, or `.env.local`.

---

## What was attempted

1. `npx sanity documents create` — exit code 1, "You must login first"
2. Checked `~/.profile` and `~/.bashrc` for `SANITY_TOKEN` / `SANITY_AUTH_TOKEN` — not found
3. Checked `apps/web/.env.local` for Sanity credentials — file does not exist

---

## Impact

Step 8 (seeding siteSettings) is blocked. All schema files, desk structure, and quality gates are complete. The siteSettings document can be created manually via the Studio UI once Igor logs in.

---

## Options for Igor

**Option A (recommended):** Open the Studio at `http://localhost:3333`, navigate to Site Settings, and enter the real values manually. The schema and desk structure are in place.

**Option B:** Set `SANITY_AUTH_TOKEN` in `~/.profile` (a write token from sanity.io/manage), then re-run:

```bash
SANITY_AUTH_TOKEN=<token> npx sanity documents create --replace --id siteSettings - << 'EOF'
{ ... }
EOF
```

**Option C:** Use the Sanity HTTP API directly with a write token:

```bash
curl -X POST "https://bpjtbps6.api.sanity.io/v2024-01-01/data/mutate/production" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"mutations":[{"createOrReplace":{"_id":"siteSettings","_type":"siteSettings",...}}]}'
```

---

## Status

Blocked on this step. All other Phase 3 work is complete and all quality gates pass.
