# SEO Schema Checklist

Per-page reference for schema type, OG type, canonical format, sitemap priority, and robots directive.

| Page              | Schema Type                                            | OG Type | Canonical Format      | Sitemap Priority | Robots Directive |
| ----------------- | ------------------------------------------------------ | ------- | --------------------- | ---------------- | ---------------- |
| Homepage          | MedicalOrganization + LocalBusiness + WebSite (@graph) | website | `/`                   | 1.0              | index follow     |
| About             | WebPage                                                | website | `/about/`             | 0.7              | index follow     |
| Communities       | WebPage                                                | website | `/communities/`       | 0.9              | index follow     |
| Patients          | WebPage                                                | website | `/patients/`          | 0.9              | index follow     |
| Providers         | WebPage                                                | website | `/providers/`         | 0.9              | index follow     |
| Careers           | JobPosting per listing                                 | website | `/careers/`           | 0.7              | index follow     |
| Contact           | ContactPage                                            | website | `/contact/`           | 0.6              | index follow     |
| Blog index        | CollectionPage                                         | website | `/blog/`              | 0.7              | index follow     |
| Blog [slug]       | BlogPosting                                            | article | `/blog/{slug}/`       | 0.6              | index follow     |
| Privacy           | WebPage                                                | website | `/privacy/`           | 0.5              | noindex follow   |
| Terms             | WebPage                                                | website | `/terms/`             | 0.5              | noindex follow   |
| Resident Referral | WebPage                                                | website | `/resident-referral/` | 0.6              | index follow     |

## Notes

- Homepage uses `@graph` array to combine three schema types in one `<script type="application/ld+json">` block.
- `noindex follow` on Privacy and Terms: allow crawling of outbound links but suppress from SERPs.
- Blog slugs use trailing slash to match Cloudflare Pages normalization.
- Canonical URLs are absolute in production; the `SITE_URL` env var provides the base.
