# OBS-018: Sanity Publish Not Updating Live Site

**Date:** 2026-05-22
**Reported by:** Igor
**Symptom:** Changed a nav link and a footer link in Sanity Studio, clicked Publish, hard-refreshed the site — no change visible.

**Diagnosis:**

1. Sanity webhook to Cloudflare deploy hook was alive and firing correctly — confirmed via deployment history (multiple deploy_hook entries in Cloudflare).
2. Cloudflare was rebuilding the site on every publish — the rebuild itself was not the problem.
3. Root cause: both build-time Sanity clients in `apps/web/astro.config.mjs` had `useCdn: true`. Sanity's CDN has ~60 second propagation delay. The webhook triggered the rebuild immediately after publish, but the build fetched the OLD cached data from Sanity's CDN before the new content propagated.

**Fix:** Changed `useCdn: true` to `useCdn: false` on both Sanity client instances in `apps/web/astro.config.mjs` (line 59 — redirectsIntegration client, line 80 — sanity() plugin). Commit: fix(cms): disable CDN caching on both Sanity clients at build time.

**Current publish workflow (post-fix):**

1. Edit any content in Sanity Studio (byt-website.sanity.studio)
2. Click Publish
3. Sanity webhook fires automatically → Cloudflare deploy hook triggers → site rebuilds with fresh data
4. Live site updates within ~2 minutes
5. No Claude Code involvement. No manual deploys. No git pushes required.

**Sanity webhook details:**

- Name: Cloudflare Deploy
- URL: https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/54c10b1f-9efe-4cd2-877b-dc0e49f6ea46
- Dataset: production
- Status: Enabled
- Triggers on: any document publish

**If this breaks again, check in this order:**

1. Is the Cloudflare deploy hook still alive? POST to the hook URL and check for 200.
2. Is the Sanity webhook still enabled? sanity.io/manage → project bpjtbps6 → API → Webhooks.
3. Did someone revert useCdn back to true? `grep -n "useCdn" apps/web/astro.config.mjs` — must show false on both lines.
4. Is Cloudflare Pages build failing? Check Cloudflare dashboard → Pages → byt-website → Deployments.

---
