---
paths: apps/web/src/**/*.astro
---

# Rules for Astro Pages

1. Raw HTML Injection is the ONLY approved build method. Copy HTML verbatim from design-source. Never rename classes, restructure DOM, move styles, or extract components.

2. All style blocks come verbatim from design-source. Strip shared selectors that global.css owns (see docs/css-architecture.md). Keep only page-specific selectors.

3. All script tags use is:inline. No changes to script content.

4. Sanity variables replace ONLY individual text strings and image src values. Every variable must have a ?? fallback to the original hardcoded value.

5. Never replace HTML structure with Sanity .map() loops. Index into arrays by position: cards?.[0]?.heading ?? "Original Heading"

6. No --byt-* prefixed tokens. Use unprefixed System A names (--navy, not --byt-navy).

7. Run scripts/design-parity-check.sh before committing any .astro page file.

8. One page at a time. Build, deploy, wait for Igor's visual confirmation before starting the next page.

9. Every non-homepage page requires:
   - Breadcrumb component
   - BreadcrumbList JSON-LD
   - Every content img: alt + width + height + loading + decoding
