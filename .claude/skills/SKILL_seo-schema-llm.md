# SKILL: SEO, Structured Data & LLM Optimization

BYT-specific knowledge for SEO, JSON-LD schema, Open Graph, robots/sitemap, and LLM/GEO patterns.

---

## JSON-LD: MedicalOrganization (Homepage)

Homepage must emit a `@graph` with three types:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "MedicalOrganization", "@id": "https://getbetteryou.com/#organization", ... },
    { "@type": "LocalBusiness",       "@id": "https://getbetteryou.com/#localbusiness", ... },
    { "@type": "WebSite",             "@id": "https://getbetteryou.com/#website",       ... }
  ]
}
```

**Required fields on MedicalOrganization:** `@id`, `name`, `url`, `logo`, `telephone`, `email`, `sameAs`, `areaServed`, `medicalSpecialty: "MentalHealth"`.

**Required fields on LocalBusiness:** `@id`, `name`, `url`, `telephone`, `email`, `image`, `priceRange`, `areaServed`.

**Required fields on WebSite:** `@id`, `url`, `name`, `potentialAction` (SearchAction).

Data sources: `telephone`, `email` → `siteSettings.phone`, `siteSettings.email`. Never hardcode contact info.

---

## JSON-LD: BreadcrumbList (All Non-Homepage Pages)

Every non-homepage page renders Microdata breadcrumbs via the `Breadcrumb.astro` component:

```html
<nav aria-label="Breadcrumb">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/"><span itemprop="name">Home</span></a>
      <meta itemprop="position" content="1" />
    </li>
    <li ...>
      <span itemprop="name" aria-current="page">Page Title</span>
      <meta itemprop="position" content="2" />
    </li>
  </ol>
</nav>
```

The Breadcrumb component is included by BaseLayout when `breadcrumbs` prop is passed. Every non-homepage page must pass it.

---

## JSON-LD: Article (Blog Posts)

Blog post pages emit:

```json
{
  "@type": "Article",
  "headline": "...",
  "author": { "@type": "Person", "name": "..." },
  "publisher": { "@type": "Organization", "@id": "https://getbetteryou.com/#organization" },
  "datePublished": "...",
  "dateModified": "..."
}
```

---

## Open Graph Mapping

| OG Property    | Source                                    |
| -------------- | ----------------------------------------- |
| og:title       | `seo.metaTitle ?? page.title ?? siteName` |
| og:description | `seo.metaDescription ?? page.description` |
| og:url         | `Astro.url.href` (absolute)               |
| og:type        | `"website"` (or `"article"` for blog)     |
| og:site_name   | `"Better You Therapy"`                    |
| og:locale      | `"en_US"`                                 |
| og:image       | `seo.ogImage?.asset?.url ?? defaultOg`    |
| twitter:card   | `"summary_large_image"`                   |

---

## Canonical URL Pattern

Canonical URLs are computed in BaseLayout from `Astro.url.href` — not stored in Sanity. The pattern:

```astro
<link rel="canonical" href={canonicalUrl} />
```

Where `canonicalUrl` strips query strings and enforces trailing slash for index pages. Do not add a `canonicalUrl` field to Sanity — it would create a divergence risk.

---

## GTM Conditional Pattern

GTM is loaded conditionally from Sanity `siteSettings.gtmContainerId`. When the field is empty, no GTM script renders. This prevents tag manager loading in local dev and staging.

```astro
{
  siteSettings?.gtmContainerId && (
    <>
      <script>window.dataLayer = window.dataLayer || [];</script>
      <script
        async
        src={`https://www.googletagmanager.com/gtm.js?id=${siteSettings.gtmContainerId}`}
      />
    </>
  )
}
```

The GTM noscript iframe in `<body>` uses the same conditional. **Never hardcode the GTM container ID.**

---

## robots.txt — CMS-Driven

`robots.txt` is generated at build time from `siteSettings.robotsTxt` via `apps/web/src/pages/robots.txt.ts`. The default allows all crawlers. Override for staging via Sanity.

```ts
export async function GET() {
  const settings = await sanityClient.fetch(SITE_SETTINGS_QUERY);
  return new Response(settings.robotsTxt ?? 'User-agent: *\nAllow: /');
}
```

---

## Sitemap

Astro's built-in `@astrojs/sitemap` generates `sitemap-0.xml` and `sitemap-index.xml` at build time. Config in `apps/web/astro.config.mjs`:

```js
sitemap({
  filter: (page) => !page.includes('/admin') && !page.includes('/api'),
});
```

`sitemap-index.xml` must exist in `dist/` after every build. Verified by `scripts/seo-schema-check.sh` check 19.

---

## SEO robots Directive

Each page's `<meta name="robots">` comes from `seo.robotsDirective ?? 'index, follow'`. The Sanity field provides three options:

- `index, follow` (default)
- `noindex, follow`
- `noindex, nofollow`

---

## Deprecated Plugins (do NOT install)

| Plugin                           | Reason                                                  |
| -------------------------------- | ------------------------------------------------------- |
| `sanity-plugin-google-analytics` | Deprecated; uses UA (not GA4); conflicts with Sanity v4 |
| `sanity-plugin-seo-pane`         | Not compatible with Sanity v4 Studio structure          |
| `sanity-plugin-seo-tools`        | Last published 2022; breaks Sanity v4 schema types      |

BYT manages SEO fields directly via `seoFields` object type. No third-party SEO plugin is needed.

---

## LLM/GEO Optimization

For large language model and generative engine optimization:

- All JSON-LD must have valid `@id` cross-references between graph nodes
- `WebSite.potentialAction` SearchAction supports conversational search tools
- `MedicalOrganization.medicalSpecialty` helps LLMs categorize the practice correctly
- `areaServed` with `AdministrativeArea` helps geo-scoped LLM responses
- Page titles should be descriptive, not keyword-stuffed (LLMs penalize over-optimization)
- FAQ schema on high-volume pages improves featured snippet and voice search coverage
