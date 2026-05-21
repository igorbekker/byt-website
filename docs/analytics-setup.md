# Analytics Setup

## Google Tag Manager

| Setting         | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| Container ID    | `GTM-5CVGT32J`                                                 |
| Source of truth | Sanity `siteSettings.gtmContainerId` field                     |
| Rendering       | Conditional — only rendered when `gtmContainerId` is non-empty |

**Placement:**

- GTM `<script>` tag in `<head>` (as high as possible).
- GTM `<noscript>` iframe immediately after `<body>` open.

**To disable GTM:** clear the `gtmContainerId` field in Sanity Studio → Site Settings. No code deploy required.

## Google Analytics 4

- GA4 is configured **inside GTM**, not hardcoded in the source.
- To update the GA4 Measurement ID: update the GTM container, not the codebase.

## Google Search Console

- Verified via a **non-HTML method** (DNS record or Google Analytics integration) — no `<meta name="google-site-verification">` tag in the HTML.
- Sitemap submitted at `/sitemap-index.xml`.

## Sitemap

- Generated at build time by the Astro sitemap integration.
- Entry point: `/sitemap-index.xml` → references `/sitemap-0.xml` (and additional chunks if > 45,000 URLs).
- Submitted to GSC after each significant structural change.
