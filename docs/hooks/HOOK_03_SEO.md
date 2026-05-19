# HOOK_03: SEO Compliance Check

**Trigger:** After any page change, or before launch
**Purpose:** Ensure every page has correct meta tags, JSON-LD, Open Graph, and technical SEO

## CC Prompt Template

```
TASK: Run SEO compliance check on [PAGE].astro

PART A — Meta tags:
1. Read the <head> section of the page
2. Check for:
   - <title> — present, dynamic from Sanity seo.title or page title
   - <meta name="description"> — present, from Sanity seo.description
   - <link rel="canonical"> — present, correct URL
   - <meta name="robots"> — appropriate value (index,follow for public pages)
   - Open Graph: og:title, og:description, og:image, og:url, og:type
   - Twitter: twitter:card, twitter:title, twitter:description, twitter:image

PART B — JSON-LD structured data:
1. Find all <script type="application/ld+json"> blocks
2. Validate each against schema.org:
   - @context is "https://schema.org"
   - @type is appropriate (LocalBusiness, MedicalBusiness, Article, BreadcrumbList, FAQPage)
   - Required properties present per type
   - No empty or placeholder values
3. Blog articles: Article schema has author, datePublished, dateModified, headline, image
4. Service pages: LocalBusiness has name, address, telephone, url, priceRange
5. BreadcrumbList: present on all pages, correct hierarchy

PART C — Technical SEO:
1. H1 tag: exactly one per page
2. Heading hierarchy: no skipped levels (h1 → h3 without h2)
3. Image alt text: every <img> has non-empty alt (or role="presentation" for decorative)
4. Internal links: no self-links, no broken relative paths
5. Mobile viewport: <meta name="viewport"> present

FAIL CONDITIONS:
- Missing <title> or <meta description>
- Missing canonical URL
- No JSON-LD on any page
- JSON-LD with empty required fields
- Multiple H1 tags
- Images without alt text and without role="presentation"

MANDATORY VERIFICATION:
☐ Page checked: ___
☐ Meta title present: YES/NO — source: ___
☐ Meta description present: YES/NO — source: ___
☐ Canonical URL present: YES/NO — value: ___
☐ JSON-LD types found: ___
☐ JSON-LD validation: PASS/FAIL — errors: ___
☐ H1 count: ___
☐ Images without alt: ___
☐ PASS/FAIL: ___
```
