# DEC-003 — Phase 7A Production Hardening Decisions

**Date:** 2026-05-21  
**Phase:** 7A — Production Hardening  
**Status:** Approved (Step 5 governance review)

---

## Decision Log

### D1 — AI Crawler Policy

**Decision:** Allow all AI crawlers except CCBot (Common Crawl / GPT training).

**Rationale:** Permissive policy maximizes discoverability and AI-assisted referrals. CCBot is blocked because it feeds training datasets without user benefit.

**Implementation:** `apps/web/public/robots.txt` — explicit `Disallow` for `CCBot`, no rules for other AI agents.

---

### D2 — OG Image Rendering

**Decision:** Render `<meta property="og:image">` conditionally — only when an image URL is available.

**Rationale:** An empty or broken OG image tag is worse than no tag. Avoids social share cards with missing images.

**Implementation:** OG image meta tag wrapped in a conditional check in the base layout.

---

### D3 — Governance Approval

**Decision:** All Phase 7A changes reviewed and approved at Step 5.

**Rationale:** Formal checkpoint before production deployment. All SEO, accessibility, performance, and redirect changes signed off.

---

### D4 — Favicons

**Decision:** Skip favicon overhaul; retain existing `favicon.png`.

**Rationale:** Existing favicon is acceptable quality. Full favicon set (SVG, ICO, Apple Touch) is a separate design task, not a blocker for production hardening.

---

### D5 — Staging URL

**Decision:** Use `byt-website.pages.dev` as the staging environment.

**Rationale:** Cloudflare Pages preview URL is always available and reflects the latest `main` branch build. No additional infrastructure required.

---

### D6 — GTM Container

**Decision:** Use GTM container `GTM-5CVGT32J`.

**Rationale:** Existing container already configured with GA4. Avoids migration cost.

**Implementation:** See [analytics-setup.md](../analytics-setup.md).

---

### D7 — GSC Verification Method

**Decision:** Verify Google Search Console via non-HTML method (DNS or GA4 association).

**Rationale:** Avoids adding a `<meta>` verification tag to the HTML that would persist forever. Cleaner markup.

---

### D8 — Redirect Management

**Decision:** Manage redirects in Sanity CMS, not in static config files.

**Rationale:** Non-developers can add/edit redirects without a code deploy. Webhook-driven rebuild keeps `_redirects` in sync automatically.

**Implementation:** See [redirect-map.md](../redirect-map.md).

---

### D9 — Webhook Integration

**Decision:** Connect Sanity publish events to a Cloudflare Pages deploy hook.

**Rationale:** Content changes (redirects, blog posts, site settings) trigger automatic rebuilds without manual intervention.

**Implementation:** Deploy hook URL stored in Sanity project settings. Fires on document publish.
