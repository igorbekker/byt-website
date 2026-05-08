# Sanity Schema Registry

Project: `bpjtbps6` | Dataset: `production` | Studio: `https://byt-website.sanity.studio`

Schema files live in `apps/studio/schemas/`. The embedded Studio at `/admin` uses `apps/web/sanity.config.ts` (empty schema array per DEC-001 — content management uses `apps/studio` directly).

---

## Singletons (11)

One document per type. Page singletons drive Astro page content.

| Schema            | File                            | Consuming Page                     | Seeded                                                     |
| ----------------- | ------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| `homePage`        | `singletons/homePage.ts`        | `pages/index.astro`                | Yes                                                        |
| `aboutPage`       | `singletons/aboutPage.ts`       | `pages/about.astro`                | Yes                                                        |
| `patientsPage`    | `singletons/patientsPage.ts`    | `pages/patients.astro`             | Yes                                                        |
| `providersPage`   | `singletons/providersPage.ts`   | `pages/providers.astro`            | Yes                                                        |
| `communitiesPage` | `singletons/communitiesPage.ts` | `pages/communities.astro`          | Yes                                                        |
| `careersPage`     | `singletons/careersPage.ts`     | `pages/careers.astro`              | Yes                                                        |
| `contactPage`     | `singletons/contactPage.ts`     | `pages/contact.astro`              | Yes                                                        |
| `privacyPage`     | `singletons/privacyPage.ts`     | `pages/privacy.astro`              | Yes — title, lastUpdated, body (50 blocks)                 |
| `termsPage`       | `singletons/termsPage.ts`       | `pages/terms.astro`                | Yes — title, lastUpdated ("May 4, 2026"), body (59 blocks) |
| `blogIndexPage`   | `singletons/blogIndexPage.ts`   | `pages/blog/index.astro` (Phase 6) | No                                                         |
| `siteSettings`    | `singletons/siteSettings.ts`    | All pages (nav, footer)            | Yes                                                        |

---

## Documents (6)

Multiple documents per type.

| Schema         | File                        | Consuming Page                                     | Seeded  |
| -------------- | --------------------------- | -------------------------------------------------- | ------- |
| `condition`    | `documents/condition.ts`    | `pages/patients.astro` (CONDITIONS_PATIENTS_QUERY) | Yes     |
| `jobPosting`   | `documents/jobPosting.ts`   | `pages/careers.astro`                              | Yes     |
| `testimonial`  | `documents/testimonial.ts`  | Multiple pages                                     | Partial |
| `blogPost`     | `documents/blogPost.ts`     | `pages/blog/[slug].astro` (Phase 6)                | No      |
| `blogCategory` | `documents/blogCategory.ts` | `pages/blog/[category].astro` (Phase 6)            | No      |
| `author`       | `documents/author.ts`       | `pages/blog/[slug].astro` (Phase 6)                | No      |

---

## Objects (6)

Embedded types used within singletons and documents.

| Schema         | File                      | Used In                                     |
| -------------- | ------------------------- | ------------------------------------------- |
| `audienceCard` | `objects/audienceCard.ts` | `patientsPage` (audience selector cards)    |
| `ctaLink`      | `objects/ctaLink.ts`      | Multiple page singletons                    |
| `imageWithAlt` | `objects/imageWithAlt.ts` | Multiple page singletons                    |
| `processStep`  | `objects/processStep.ts`  | Page singletons with process/steps sections |
| `seoFields`    | `objects/seoFields.ts`    | All page singletons                         |
| `serviceTrack` | `objects/serviceTrack.ts` | `patientsPage` (delivery tracks)            |

---

## Notes

- All singleton documents must exist in Sanity before building the page — Astro build will succeed with `?? fallback` values, but Sanity content won't appear
- Blog schemas (blogPost, blogCategory, author, blogIndexPage) are Phase 6 — not seeded
- Schema changes require Studio redeploy: `SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy --yes`
