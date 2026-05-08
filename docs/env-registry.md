# Environment Variable Registry

All environment variables used in this project. Values are never committed — this file documents key names, purpose, and usage only.

---

## Committed Templates

| File                    | Variables documented                                                                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.env.example` (root)   | `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`, `PUBLIC_FORMSPREE_CONTACT_ID`                                                                                          |
| `apps/web/.env.example` | `PUBLIC_FORMSPREE_BOOK_ID`, `PUBLIC_FORMSPREE_REFERRAL_ID`, `PUBLIC_FORMSPREE_APPLY_ID`, `PUBLIC_FORMSPREE_CONTACT_ID`, `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN` |

---

## Variable Reference

### Sanity

| Variable                   | Scope          | Purpose                                                                    |
| -------------------------- | -------------- | -------------------------------------------------------------------------- |
| `PUBLIC_SANITY_PROJECT_ID` | `apps/web`     | Sanity project ID (`bpjtbps6`) — embedded in astro.config.mjs              |
| `PUBLIC_SANITY_DATASET`    | `apps/web`     | Sanity dataset (`production`)                                              |
| `SANITY_API_TOKEN`         | `apps/web`     | Read token for Sanity queries at build time                                |
| `SANITY_DEPLOY_TOKEN`      | VPS shell only | Administrator-role Sanity token; **not committed**; stored in `~/.profile` |

**Sanity Studio deploy pattern:**

```bash
SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy --yes
```

Run from `apps/studio/`. `SANITY_DEPLOY_TOKEN` must be exported before this command.

### Formspree

| Variable                       | Scope      | Purpose                                   |
| ------------------------------ | ---------- | ----------------------------------------- |
| `PUBLIC_FORMSPREE_BOOK_ID`     | `apps/web` | "Book a consultation" modal form endpoint |
| `PUBLIC_FORMSPREE_REFERRAL_ID` | `apps/web` | "Refer a patient" modal form endpoint     |
| `PUBLIC_FORMSPREE_APPLY_ID`    | `apps/web` | Careers page apply form endpoint          |
| `PUBLIC_FORMSPREE_CONTACT_ID`  | `apps/web` | Contact page form endpoint                |

All 4 `PUBLIC_FORMSPREE_*` values are set in Cloudflare Pages (Production + Preview) via the Pages API.

### Cloudflare

| Variable               | Scope          | Purpose                                                                                                                                                      |
| ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN` | VPS shell only | General Cloudflare API token; **not committed**; stored in `~/.profile`                                                                                      |
| `BYT_CF_PAGES_TOKEN`   | VPS shell only | Cloudflare Pages API token (Pages:Edit scope); **not committed**; stored in `~/.profile`; use this, not `CLOUDFLARE_API_TOKEN`, for Pages env var operations |

### GitHub

| Variable   | Scope          | Purpose                                                                                 |
| ---------- | -------------- | --------------------------------------------------------------------------------------- |
| `GH_TOKEN` | VPS shell only | GitHub personal access token; **not committed**; stored in `~/.profile` and `~/.bashrc` |

---

## Cloudflare Pages Environment

All `PUBLIC_*` vars must be set in Cloudflare Pages dashboard (or via API) for both Production and Preview environments. They are not automatically derived from `.env.local`.

To update via API using `BYT_CF_PAGES_TOKEN` — see `docs/deploy-runbook.md`.
