# Redirect Map

## Overview

- **31 active redirects** managed in Sanity (document type: `redirect`).
- Generated at **build time** via a custom Astro integration in `astro.config.mjs`.
- Output file: `dist/_redirects` in Cloudflare Pages format.
- Redirects auto-update: Sanity publish → webhook → Cloudflare Pages rebuild.

## How Redirects Are Stored

Each redirect document in Sanity has four fields:

| Field             | Type    | Notes                                             |
| ----------------- | ------- | ------------------------------------------------- |
| `sourcePath`      | string  | e.g. `/old-page/`                                 |
| `destinationPath` | string  | e.g. `/new-page/`                                 |
| `statusCode`      | number  | `301`, `302`, or `410`                            |
| `isActive`        | boolean | Inactive redirects are excluded from build output |

## Adding or Editing Redirects

1. Open **Sanity Studio → Redirects**.
2. Create a new redirect document (or edit existing).
3. Set `sourcePath`, `destinationPath`, `statusCode`, and `isActive = true`.
4. Publish → webhook triggers a Cloudflare Pages rebuild → `_redirects` is regenerated.

For step-by-step operational procedures see [RB-004-redirect-management.md](runbooks/RB-004-redirect-management.md).

## Warnings

- **Avoid self-referencing redirects** — e.g. `/communities/` → `/communities` — creates an infinite redirect loop with Cloudflare's automatic trailing-slash normalization.
- **Avoid long chains** — A → B → C should be collapsed to A → C. Chains add latency and can hit Cloudflare's redirect hop limit.
- Test every new redirect with `curl -sI <url>` before marking done.
