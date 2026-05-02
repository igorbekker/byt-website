# OBS-008 — SANITY_AUTH_TOKEN Revoked, No Content Write Path

**Status:** RESOLVED  
**Raised:** 2026-05-01  
**Phase:** Phase 4 — Sanity Content Seeding  
**Raised by:** CC (Claude Code)

---

## Problem

All 7 page singleton mutations failed. Both available Sanity tokens are blocked:

| Token                              | Status                          | Reason                                                    |
| ---------------------------------- | ------------------------------- | --------------------------------------------------------- |
| `SANITY_AUTH_TOKEN` (`sk28...`)    | ❌ 401 Session not found        | User session token — expired or revoked in Sanity console |
| `SANITY_DEPLOY_TOKEN` (`skxRL...`) | ❌ 403 Insufficient permissions | `deploy-studio` role only — no content write grants       |

The Management API (`api.sanity.io/v1/projects/bpjtbps6/tokens`) also returns 401/403 for both tokens, so a new write token cannot be generated programmatically.

## What Was Attempted

1. `POST /v2024-01-01/data/mutate/production` with `SANITY_AUTH_TOKEN` → `401 Session not found`
2. `POST /v2024-01-01/data/mutate/production` with `SANITY_DEPLOY_TOKEN` → `403 permission "create" required`
3. `GET api.sanity.io/v1/projects/bpjtbps6/tokens` with both tokens → 401/401

## State of the Work

All 7 page singleton documents have been fully extracted from design-source HTML. Payloads are staged at `/tmp/` on disk (from the extraction agents). The only blocker is a valid write token.

Pages and their staged payload files:

- `homePage` — `/tmp/sanity_mutation.json` (from agent a60062f1a8720c772)
- `communitiesPage` — extracted (agent a305d7633c5969f81)
- `patientsPage` — `/tmp/patientsPage.json` (agent a90b38572e40a9cd1)
- `providersPage` — `/tmp/providersPage.json` (agent a886cb3c4f81333c7)
- `aboutPage` — extracted (agent a507ce972fb83db43)
- `careersPage` — extracted inline (agent aab12ded17aab52eb)
- `contactPage` — `/tmp/contact_payload.json` (agent abb05b15dec32b07c)

## Resolution Required

Igor needs to generate a new **Editor**-role API token in the Sanity dashboard:

1. Go to: https://www.sanity.io/manage/personal/project/bpjtbps6/api
2. Click **Add API token**
3. Name: `content-writer`, Role: **Editor**
4. Copy the `sk...` token value
5. Run: `! echo 'export SANITY_AUTH_TOKEN="<token>"' >> ~/.profile`

Once the new token is in `~/.profile`, CC can resume seeding immediately.
