# Sanity Schema Registry

Project: `bpjtbps6` | Dataset: `production` | Studio: `https://byt-website.sanity.studio`

Schema files live in `apps/studio/schemas/`. The embedded Studio at `/admin` uses `apps/web/sanity.config.ts` (empty schema array per DEC-001 — content management uses `apps/studio` directly).

**Column key:** Schema ✅ = field declared in schema file · GROQ ✅ = field returned by the corresponding query · Template ✅ = field wired in the Astro template · Seeded ✅ = field has a value in Sanity production · Img ✅ = image uploaded to Sanity CDN · CMS-SKIP = field intentionally omitted from CMS control

---

## Overview

| Category       | Count | Live Documents                                                                                                      |
| -------------- | ----- | ------------------------------------------------------------------------------------------------------------------- |
| Singletons     | 12    | 11 seeded (blogIndexPage is Phase 6)                                                                                |
| Document types | 8     | condition ×19, testimonial ×2, blogPost ×4, blogCategory ×4, author ×1, jobPosting ×2, redirect ×1+, formOption ×52 |
| Object types   | 6     | Embedded — not standalone documents                                                                                 |

---

## Singletons (12)

One document per type. Managed via Studio sidebar.

---

### `siteSettings`

Consuming pages: All (Nav, Footer, MobileCTABar, ModalForms). Query: `SITE_SETTINGS_QUERY`.

| Field                  | Type      | Schema | GROQ | Template | Seeded | Notes            |
| ---------------------- | --------- | ------ | ---- | -------- | ------ | ---------------- |
| `businessName`         | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `phone`                | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `email`                | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `fax`                  | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `address.street`       | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `address.city`         | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `address.state`        | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `address.zip`          | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `bookingUrl`           | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `referralUrl`          | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `navCtaLabel`          | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `navCtaSecondaryLabel` | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `footerTagline`        | text      | ✅     | ✅   | ✅       | ✅     |                  |
| `copyrightEntity`      | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `newsletterHeading`    | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `newsletterBody`       | text      | ✅     | ✅   | ✅       | ✅     |                  |
| `newsletterEyebrow`    | string    | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18 |
| `newsletterDisclaimer` | text      | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18 |
| `seo`                  | seoFields | ✅     | ✅   | ✅       | ✅     |                  |

---

### `formSettings`

Consuming: `ModalForms.astro` via `BaseLayout`. Query: `FORM_SETTINGS_QUERY`. Added 2026-05-18.

| Field                          | Type   | Schema | GROQ | Template | Seeded | Notes       |
| ------------------------------ | ------ | ------ | ---- | -------- | ------ | ----------- |
| `bookEyebrow`                  | string | ✅     | ✅   | ✅       | ✅     |             |
| `bookHeading`                  | string | ✅     | ✅   | ✅       | ✅     |             |
| `bookValueProps[].text`        | string | ✅     | ✅   | ✅       | ✅     | Array max 5 |
| `bookConsentText`              | text   | ✅     | ✅   | ✅       | ✅     |             |
| `bookSubmitLabel`              | string | ✅     | ✅   | ✅       | ✅     |             |
| `bookFinePrint`                | string | ✅     | ✅   | ✅       | ✅     |             |
| `bookSuccessHeading`           | string | ✅     | ✅   | ✅       | ✅     |             |
| `bookSuccessBody`              | text   | ✅     | ✅   | ✅       | ✅     |             |
| `referEyebrow`                 | string | ✅     | ✅   | ✅       | ✅     |             |
| `referHeading`                 | string | ✅     | ✅   | ✅       | ✅     |             |
| `referSubhead`                 | text   | ✅     | ✅   | ✅       | ✅     |             |
| `referConsentText`             | text   | ✅     | ✅   | ✅       | ✅     |             |
| `referSubmitLabel`             | string | ✅     | ✅   | ✅       | ✅     |             |
| `referSuccessHeading`          | string | ✅     | ✅   | ✅       | ✅     |             |
| `referSuccessBody`             | text   | ✅     | ✅   | ✅       | ✅     |             |
| `referAsideEyebrow`            | string | ✅     | ✅   | ✅       | ✅     |             |
| `referAsideSteps[].stepNumber` | string | ✅     | ✅   | ✅       | ✅     | Array max 5 |
| `referAsideSteps[].text`       | text   | ✅     | ✅   | ✅       | ✅     |             |
| `referAsideContactEyebrow`     | string | ✅     | ✅   | ✅       | ✅     |             |
| `hours`                        | string | ✅     | ✅   | ✅       | ✅     |             |

---

### `homePage`

Consuming: `pages/index.astro`. Queries: `HOME_PAGE_QUERY`, `CONDITIONS_HOME_QUERY`, `TESTIMONIALS_HOME_QUERY`.

| Field                        | Type         | Schema | GROQ | Template | Seeded | Notes                       |
| ---------------------------- | ------------ | ------ | ---- | -------- | ------ | --------------------------- |
| `heroEyebrow`                | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `heroHeadline`               | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `heroSubhead`                | text         | ✅     | ✅   | ✅       | ✅     |                             |
| `heroImage`                  | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img: local fallback         |
| `heroPrimaryCta`             | ctaLink      | ✅     | ✅   | ✅       | ✅     |                             |
| `heroSecondaryCta`           | ctaLink      | ✅     | ✅   | ✅       | ✅     |                             |
| `routerEyebrow`              | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `routerHeading`              | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `routerSubhead`              | text         | ✅     | ✅   | ✅       | ✅     |                             |
| `routerCards[]`              | audienceCard | ✅     | ✅   | ✅       | ✅     | min 1, max 3; images seeded |
| `beliefQuote`                | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `beliefBody`                 | text         | ✅     | ✅   | ✅       | ✅     |                             |
| `twoWaysEyebrow`             | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `twoWaysHeading`             | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `twoWaysSubhead`             | text         | ✅     | ✅   | ✅       | ✅     |                             |
| `twoWaysTracks[]`            | serviceTrack | ✅     | ✅   | ✅       | ✅     | max 2; images seeded        |
| `conditionsEyebrow`          | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `conditionsHeading`          | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `conditionsSubhead`          | text         | ✅     | ✅   | ✅       | ✅     |                             |
| `howItWorksEyebrow`          | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `howItWorksHeading`          | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `teletherapyTrackLabel`      | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `teletherapySteps[]`         | processStep  | ✅     | ✅   | ✅       | ✅     | max 3                       |
| `teletherapyCta`             | ctaLink      | ✅     | ✅   | ✅       | ✅     |                             |
| `facilityTrackLabel`         | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `facilitySteps[]`            | processStep  | ✅     | ✅   | ✅       | ✅     | max 3                       |
| `facilityCta`                | ctaLink      | ✅     | ✅   | ✅       | ✅     |                             |
| `testimonialsEyebrow`        | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `testimonialsHeading`        | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `testimonialsSubhead`        | text         | ✅     | ✅   | ✅       | ✅     |                             |
| `providerTeaserEyebrow`      | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `providerTeaserHeading`      | string       | ✅     | ✅   | ✅       | ✅     |                             |
| `providerTeaserBody`         | text         | ✅     | ✅   | ✅       | ✅     |                             |
| `providerTeaserImage`        | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img: local fallback         |
| `providerTeaserPrimaryCta`   | ctaLink      | ✅     | ✅   | ✅       | ✅     |                             |
| `providerTeaserSecondaryCta` | ctaLink      | ✅     | ✅   | ✅       | ✅     |                             |
| `seo`                        | seoFields    | ✅     | ✅   | ✅       | ✅     |                             |

---

### `aboutPage`

Consuming: `pages/about.astro`. Query: `ABOUT_PAGE_QUERY`.

| Field                | Type         | Schema | GROQ | Template | Seeded | Notes                                                       |
| -------------------- | ------------ | ------ | ---- | -------- | ------ | ----------------------------------------------------------- |
| `heroHeading`        | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `heroSubhead`        | text         | ✅     | ✅   | ✅       | ✅     |                                                             |
| `heroTeamImage`      | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img ✅ uploaded (asset `4b3fb3b9`) 2026-05-18               |
| `missionEyebrow`     | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `missionQuote`       | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `missionBody`        | text         | ✅     | ✅   | ✅       | ✅     |                                                             |
| `storyHandsImage`    | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img ✅ uploaded (asset `26bbc6ea`) 2026-05-18               |
| `storyEyebrow`       | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `storyHeading`       | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `storyBody`          | block[]      | ✅     | ✅   | ✅       | ✅     |                                                             |
| `founderName`        | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `founderCredential`  | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `founderPhoto`       | imageWithAlt | ✅     | ✅   | ✅       | ❌     | Img: not yet uploaded                                       |
| `principlesEyebrow`  | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `principlesHeading`  | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `principlesSubhead`  | text         | ✅     | ✅   | ✅       | ✅     |                                                             |
| `principles[]`       | object array | ✅     | ✅   | ✅       | ✅     | max 3: number, heading, body                                |
| `practiceEyebrow`    | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `practiceHeading`    | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `practicePillars[]`  | object array | ✅     | ✅   | ✅       | ✅     | max 4: number, label, heading, body                         |
| `ctaEyebrow`         | string       | ✅     | ✅   | ✅       | ✅     | Seeded "Work With Us" 2026-05-18                            |
| `ctaHeading`         | string       | ✅     | ✅   | ✅       | ✅     |                                                             |
| `ctaSubhead`         | text         | ✅     | ✅   | ✅       | ✅     |                                                             |
| `ctaPrimary`         | ctaLink      | ✅     | ✅   | ✅       | ✅     |                                                             |
| `ctaSecondary`       | ctaLink      | ✅     | ✅   | ✅       | ✅     |                                                             |
| `ctaTertiary`        | object       | ✅     | ✅   | ✅       | ✅     | Seeded {label:"Join Our Team", href:"/careers/"} 2026-05-18 |
| `ctaBackgroundImage` | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img: local fallback `/images/about/about-cta-bg.png`        |
| `seo`                | seoFields    | ✅     | ✅   | ✅       | ✅     |                                                             |

---

### `patientsPage`

Consuming: `pages/patients.astro`. Queries: `PATIENTS_PAGE_QUERY`, `CONDITIONS_PATIENTS_QUERY`.

| Field                     | Type         | Schema | GROQ | Template | Seeded | Notes                                                          |
| ------------------------- | ------------ | ------ | ---- | -------- | ------ | -------------------------------------------------------------- |
| `heroHeading`             | string       | ✅     | ✅   | ✅       | ✅     |                                                                |
| `heroSubhead`             | text         | ✅     | ✅   | ✅       | ✅     |                                                                |
| `heroImage`               | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img: local fallback `patients-hero-bg.jpg`                     |
| `heroPrimaryCta`          | ctaLink      | ✅     | ✅   | ✅       | ✅     |                                                                |
| `audienceSelectorEyebrow` | string       | ✅     | ✅   | ✅       | ✅     | Seeded "Choose" 2026-05-18                                     |
| `audienceSelectorHeading` | string       | ✅     | ✅   | ✅       | ✅     |                                                                |
| `audienceSelectorSubhead` | text         | ✅     | ✅   | ✅       | ✅     |                                                                |
| `audienceSelectorCards[]` | object array | ✅     | ✅   | ✅       | ✅     | max 4: label, heading, body, cta, image; local fallback images |
| `deliveryEyebrow`         | string       | ✅     | ✅   | ✅       | ✅     |                                                                |
| `deliveryHeading`         | string       | ✅     | ✅   | ✅       | ✅     |                                                                |
| `deliverySubhead`         | text         | ✅     | ✅   | ✅       | ✅     |                                                                |
| `deliveryTracks[]`        | serviceTrack | ✅     | ✅   | ✅       | ✅     | max 2; local fallback images                                   |
| `beliefQuote`             | string       | ✅     | ✅   | ✅       | ✅     |                                                                |
| `beliefBody`              | text         | ✅     | ✅   | ✅       | ✅     |                                                                |
| `conditionsEyebrow`       | string       | ✅     | ✅   | ✅       | ✅     |                                                                |
| `conditionsHeading`       | string       | ✅     | ✅   | ✅       | ✅     |                                                                |
| `conditionsSubhead`       | text         | ✅     | ✅   | ✅       | ✅     |                                                                |
| `ctaHeading`              | string       | ✅     | ✅   | ✅       | ✅     |                                                                |
| `ctaSubhead`              | text         | ✅     | ✅   | ✅       | ✅     |                                                                |
| `ctaCta`                  | ctaLink      | ✅     | ✅   | ✅       | ✅     |                                                                |
| `seo`                     | seoFields    | ✅     | ✅   | ✅       | ✅     |                                                                |

---

### `communitiesPage`

Consuming: `pages/communities.astro`. Queries: `COMMUNITIES_PAGE_QUERY`, `CONDITIONS_COMMUNITIES_QUERY`.

| Field                | Type         | Schema | GROQ | Template | Seeded | Notes                                                                       |
| -------------------- | ------------ | ------ | ---- | -------- | ------ | --------------------------------------------------------------------------- |
| `heroEyebrow`        | string       | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18                                                            |
| `heroHeading`        | string       | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `heroSubhead`        | text         | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `heroCta`            | ctaLink      | ✅     | ✅   | ✅       | ✅     | Renders as `openModal('refer')` button                                      |
| `heroImage`          | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img: local fallback `communities-hero.png`                                  |
| `processEyebrow`     | string       | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `processHeading`     | string       | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `processSubhead`     | text         | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `processSteps[]`     | processStep  | ✅     | ✅   | ✅       | ✅     | max 4; images: local fallbacks; added image field to processStep 2026-05-18 |
| `handlesEyebrow`     | string       | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `handlesHeading`     | string       | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `handlesSubhead`     | text         | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `handlesItems[]`     | object array | ✅     | ✅   | ✅       | ✅     | max 12: heading, body                                                       |
| `handlesImage`       | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18; local fallback `communities-l16-handles.png`              |
| `noCostHeading`      | string       | ✅     | ✅   | ✅       | ✅     | Added 2026-05-15                                                            |
| `noCostSubhead`      | text         | ✅     | ✅   | ✅       | ✅     | Added 2026-05-15                                                            |
| `noCostCards[]`      | object array | ✅     | ✅   | ✅       | ✅     | max 6: tag, heading, body, image; local fallback images; added 2026-05-15   |
| `conditionsEyebrow`  | string       | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `conditionsHeading`  | string       | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `conditionsSubhead`  | text         | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `serviceAreaHeading` | string       | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `serviceAreaLede`    | text         | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `ctaHeading`         | string       | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `ctaSubhead`         | text         | ✅     | ✅   | ✅       | ✅     |                                                                             |
| `ctaCta`             | ctaLink      | ✅     | ✅   | ✅       | ✅     | Renders as `openModal('refer')` button                                      |
| `seo`                | seoFields    | ✅     | ✅   | ✅       | ✅     |                                                                             |

---

### `providersPage`

Consuming: `pages/providers.astro`. Queries: `PROVIDERS_PAGE_QUERY`, `TESTIMONIALS_THERAPIST_QUERY`.

| Field                 | Type         | Schema | GROQ | Template | Seeded | Notes                                               |
| --------------------- | ------------ | ------ | ---- | -------- | ------ | --------------------------------------------------- |
| `heroHeading`         | string       | ✅     | ✅   | ✅       | ✅     |                                                     |
| `heroSubhead`         | text         | ✅     | ✅   | ✅       | ✅     |                                                     |
| `heroPrimaryCta`      | ctaLink      | ✅     | ✅   | ✅       | ✅     |                                                     |
| `heroImage`           | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img: local fallback                                 |
| `tracksEyebrow`       | string       | ✅     | ✅   | ✅       | ✅     |                                                     |
| `tracksHeading`       | string       | ✅     | ✅   | ✅       | ✅     |                                                     |
| `tracksSubhead`       | text         | ✅     | ✅   | ✅       | ✅     |                                                     |
| `tracks[]`            | object array | ✅     | ✅   | ✅       | ✅     | max 2: label, heading, body, statusNote, image, cta |
| `handlesEyebrow`      | string       | ✅     | ✅   | ✅       | ✅     |                                                     |
| `handlesHeading`      | string       | ✅     | ✅   | ✅       | ✅     |                                                     |
| `handlesSubhead`      | text         | ✅     | ✅   | ✅       | ✅     | Added 2026-05-15                                    |
| `handlesItems[]`      | object array | ✅     | ✅   | ✅       | ✅     | max 12: tag, heading, body                          |
| `qualsEyebrow`        | string       | ✅     | ✅   | ✅       | ✅     |                                                     |
| `qualsHeading`        | string       | ✅     | ✅   | ✅       | ✅     |                                                     |
| `quals[]`             | object array | ✅     | ✅   | ✅       | ✅     | label, tabLabel, scope, body                        |
| `testimonialsHeading` | string       | ✅     | ✅   | ✅       | ✅     |                                                     |
| `testimonialsSubhead` | text         | ✅     | ✅   | ✅       | ✅     |                                                     |
| `ctaHeading`          | string       | ✅     | ✅   | ✅       | ✅     |                                                     |
| `ctaSubhead`          | text         | ✅     | ✅   | ✅       | ✅     |                                                     |
| `ctaCta`              | ctaLink      | ✅     | ✅   | ✅       | ✅     |                                                     |
| `seo`                 | seoFields    | ✅     | ✅   | ✅       | ✅     |                                                     |

---

### `careersPage`

Consuming: `pages/careers.astro`. Query: `CAREERS_PAGE_QUERY`.

| Field                  | Type      | Schema | GROQ | Template | Seeded | Notes            |
| ---------------------- | --------- | ------ | ---- | -------- | ------ | ---------------- |
| `heroEyebrow`          | string    | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18 |
| `heroHeading`          | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `heroSubhead`          | text      | ✅     | ✅   | ✅       | ✅     |                  |
| `openPositionsEyebrow` | string    | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18 |
| `openPositionsHeading` | string    | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18 |
| `openPositionsIntro`   | text      | ✅     | ✅   | ✅       | ✅     |                  |
| `noFitHeading`         | string    | ✅     | ✅   | ✅       | ✅     |                  |
| `noFitBody`            | text      | ✅     | ✅   | ✅       | ✅     |                  |
| `seo`                  | seoFields | ✅     | ✅   | ✅       | ✅     |                  |

---

### `contactPage`

Consuming: `pages/contact.astro`. Query: `CONTACT_PAGE_QUERY`.

| Field              | Type         | Schema | GROQ | Template | Seeded | Notes               |
| ------------------ | ------------ | ------ | ---- | -------- | ------ | ------------------- |
| `heroEyebrow`      | string       | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18    |
| `heroHeading`      | string       | ✅     | ✅   | ✅       | ✅     |                     |
| `heroSubhead`      | text         | ✅     | ✅   | ✅       | ✅     |                     |
| `heroImage`        | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img: local fallback |
| `hoursDescription` | text         | ✅     | ✅   | ✅       | ✅     |                     |
| `infoEyebrow`      | string       | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18    |
| `infoHeading`      | string       | ✅     | ✅   | ✅       | ✅     | Added 2026-05-15    |
| `formHeading`      | string       | ✅     | ✅   | ✅       | ✅     | Added 2026-05-15    |
| `disclaimerCopy`   | text         | ✅     | ✅   | ✅       | ✅     | Wired 2026-05-15    |
| `responseCopy`     | text         | ✅     | ✅   | ✅       | ✅     |                     |
| `seo`              | seoFields    | ✅     | ✅   | ✅       | ✅     |                     |

---

### `privacyPage`

Consuming: `pages/privacy.astro`. Query: `PRIVACY_PAGE_QUERY`.

| Field         | Type      | Schema | GROQ | Template | Seeded | Notes                                |
| ------------- | --------- | ------ | ---- | -------- | ------ | ------------------------------------ |
| `title`       | string    | ✅     | ✅   | ✅       | ✅     | Added to query 2026-05-15            |
| `lastUpdated` | string    | ✅     | ✅   | ✅       | ✅     | Added to query 2026-05-15            |
| `body`        | block[]   | ✅     | ✅   | ✅       | ✅     | ~49 blocks (deduplicated 2026-05-15) |
| `seo`         | seoFields | ✅     | ✅   | ✅       | ✅     |                                      |

---

### `termsPage`

Consuming: `pages/terms.astro`. Query: `TERMS_PAGE_QUERY`.

| Field         | Type      | Schema | GROQ | Template | Seeded | Notes                                |
| ------------- | --------- | ------ | ---- | -------- | ------ | ------------------------------------ |
| `title`       | string    | ✅     | ✅   | ✅       | ✅     | Added to query 2026-05-15            |
| `lastUpdated` | string    | ✅     | ✅   | ✅       | ✅     | Added to query 2026-05-15            |
| `body`        | block[]   | ✅     | ✅   | ✅       | ✅     | ~57 blocks (deduplicated 2026-05-15) |
| `seo`         | seoFields | ✅     | ✅   | ✅       | ✅     |                                      |

---

### `blogIndexPage`

Consuming: `pages/blog/index.astro`. Query: `BLOG_INDEX_PAGE_QUERY`. **Phase 6 — not seeded.**

| Field                      | Type      | Schema | GROQ | Template | Seeded | Notes   |
| -------------------------- | --------- | ------ | ---- | -------- | ------ | ------- |
| `heroHeading`              | string    | ✅     | ✅   | ✅       | ❌     | Phase 6 |
| `heroSubhead`              | text      | ✅     | ✅   | ✅       | ❌     | Phase 6 |
| `featuredLabel`            | string    | ✅     | ✅   | ✅       | ❌     | Phase 6 |
| `browseByTopicHeading`     | string    | ✅     | ✅   | ✅       | ❌     | Phase 6 |
| `browseByTopicSubhead`     | text      | ✅     | ✅   | ✅       | ❌     | Phase 6 |
| `recentlyPublishedHeading` | string    | ✅     | ✅   | ✅       | ❌     | Phase 6 |
| `newsletterHeading`        | string    | ✅     | ✅   | ✅       | ❌     | Phase 6 |
| `newsletterSubhead`        | text      | ✅     | ✅   | ✅       | ❌     | Phase 6 |
| `seo`                      | seoFields | ✅     | ✅   | ✅       | ❌     | Phase 6 |

---

## Document Types (8)

Multiple documents per type. Each type lists seeded document count.

---

### `condition`

Live documents: **19**. Queries: `CONDITIONS_HOME_QUERY`, `CONDITIONS_PATIENTS_QUERY`, `CONDITIONS_COMMUNITIES_QUERY`.

| Field               | Type         | Schema | GROQ           | Template       | Seeded | Notes                                    |
| ------------------- | ------------ | ------ | -------------- | -------------- | ------ | ---------------------------------------- |
| `tagline`           | string       | ✅     | ✅             | ✅             | ✅     |                                          |
| `heading`           | string       | ✅     | ✅             | ✅             | ✅     |                                          |
| `body`              | text         | ✅     | ✅             | ✅             | ✅     |                                          |
| `image`             | imageWithAlt | ✅     | ✅ (home only) | ✅ (home only) | ❌     | Img: not yet uploaded for any conditions |
| `primaryCta`        | ctaLink      | ✅     | ✅ (home only) | ✅ (home only) | ✅     |                                          |
| `secondaryCta`      | ctaLink      | ✅     | ✅ (home only) | ✅ (home only) | ✅     |                                          |
| `order`             | number       | ✅     | ❌ (filter)    | ❌             | ✅     | Used in ORDER BY, not returned           |
| `showOnHomepage`    | boolean      | ✅     | ❌ (filter)    | ❌             | ✅     | Used in WHERE, not returned              |
| `showOnPatients`    | boolean      | ✅     | ❌ (filter)    | ❌             | ✅     | Used in WHERE, not returned              |
| `showOnCommunities` | boolean      | ✅     | ❌ (filter)    | ❌             | ✅     | Used in WHERE, not returned              |

---

### `testimonial`

Live documents: **2** (both placeholders — real testimonials pending). Queries: `TESTIMONIALS_HOME_QUERY`, `TESTIMONIALS_THERAPIST_QUERY`.

| Field            | Type         | Schema | GROQ                 | Template       | Seeded  | Notes                                     |
| ---------------- | ------------ | ------ | -------------------- | -------------- | ------- | ----------------------------------------- |
| `quote`          | text         | ✅     | ✅                   | ✅             | Partial | Placeholder text                          |
| `authorName`     | string       | ✅     | ✅ (therapist query) | ✅ (therapist) | Partial | "Licensed Therapist" placeholder          |
| `authorRole`     | string       | ✅     | ✅                   | ✅             | Partial | Placeholder credentials                   |
| `authorOrg`      | string       | ✅     | ✅                   | ✅             | ❌      | Not set in placeholders                   |
| `authorInitials` | string       | ✅     | ✅ (therapist query) | ✅ (therapist) | ❌      | Not set in placeholders                   |
| `authorPhoto`    | imageWithAlt | ✅     | ✅ (home query)      | ✅ (home)      | ❌      | Img: not uploaded                         |
| `audienceType`   | string       | ✅     | ❌ (filter)          | ❌             | ✅      | Used in WHERE (`therapist`), not returned |
| `featured`       | boolean      | ✅     | ❌ (filter)          | ❌             | ❌      | Not set; filter logic uses audienceType   |

---

### `blogPost`

Live documents: **4**. Query: `BLOG_POST_QUERY` + card queries.

| Field                | Type         | Schema | GROQ | Template | Seeded | Notes                                   |
| -------------------- | ------------ | ------ | ---- | -------- | ------ | --------------------------------------- |
| `title`              | string       | ✅     | ✅   | ✅       | ✅     |                                         |
| `slug`               | slug         | ✅     | ✅   | ✅       | ✅     |                                         |
| `publishedAt`        | datetime     | ✅     | ✅   | ✅       | ✅     |                                         |
| `readingTimeMinutes` | number       | ✅     | ✅   | ✅       | ✅     |                                         |
| `category`           | reference    | ✅     | ✅   | ✅       | ✅     | → `blogCategory`                        |
| `subcategoryLabel`   | string       | ✅     | ✅   | ✅       | ✅     |                                         |
| `excerpt`            | text         | ✅     | ✅   | ✅       | ✅     | max 200 chars                           |
| `featuredImage`      | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img ✅ uploaded                         |
| `body`               | block[]      | ✅     | ✅   | ✅       | ✅     |                                         |
| `author`             | reference    | ✅     | ✅   | ✅       | ✅     | → `author`                              |
| `featured`           | boolean      | ✅     | ❌   | ❌       | ✅     | Used in queries but not returned in all |
| `seo`                | seoFields    | ✅     | ✅   | ✅       | ✅     |                                         |

---

### `blogCategory`

Live documents: **4**. Queries: `BLOG_CATEGORIES_QUERY`, `BLOG_CATEGORY_QUERY`.

| Field                  | Type         | Schema | GROQ | Template | Seeded | Notes                    |
| ---------------------- | ------------ | ------ | ---- | -------- | ------ | ------------------------ |
| `title`                | string       | ✅     | ✅   | ✅       | ✅     |                          |
| `slug`                 | slug         | ✅     | ✅   | ✅       | ✅     |                          |
| `description`          | text         | ✅     | ✅   | ✅       | ✅     |                          |
| `icon`                 | string       | ✅     | ✅   | ✅       | ✅     |                          |
| `order`                | number       | ✅     | ✅   | ✅       | ✅     |                          |
| `subtopicsHeading`     | string       | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18         |
| `categoryPostsHeading` | string       | ✅     | ✅   | ✅       | ✅     | Added 2026-05-18         |
| `subtopics[]`          | object array | ✅     | ✅   | ✅       | ✅     | title, slug, description |

---

### `author`

Live documents: **1**. Query: `BLOG_POST_QUERY` (via author-> join).

| Field         | Type         | Schema | GROQ | Template | Seeded | Notes           |
| ------------- | ------------ | ------ | ---- | -------- | ------ | --------------- |
| `name`        | string       | ✅     | ✅   | ✅       | ✅     |                 |
| `slug`        | slug         | ✅     | ✅   | ✅       | ✅     |                 |
| `credentials` | string       | ✅     | ✅   | ✅       | ✅     |                 |
| `initials`    | string       | ✅     | ✅   | ✅       | ✅     |                 |
| `photo`       | imageWithAlt | ✅     | ✅   | ✅       | ✅     | Img ✅ uploaded |
| `bio`         | block[]      | ✅     | ✅   | ✅       | ✅     |                 |

---

### `jobPosting`

Live documents: **2**. Query: `JOB_POSTINGS_QUERY`.

| Field            | Type     | Schema | GROQ | Template | Seeded | Notes                           |
| ---------------- | -------- | ------ | ---- | -------- | ------ | ------------------------------- |
| `title`          | string   | ✅     | ✅   | ✅       | ✅     |                                 |
| `slug`           | slug     | ✅     | ✅   | ✅       | ✅     |                                 |
| `track`          | string   | ✅     | ✅   | ✅       | ✅     | facility \| teletherapy         |
| `status`         | string   | ✅     | ✅   | ✅       | ✅     | open \| filled \| paused        |
| `location`       | string   | ✅     | ✅   | ✅       | ✅     |                                 |
| `employmentType` | string   | ✅     | ✅   | ✅       | ✅     |                                 |
| `aboutRole`      | text     | ✅     | ✅   | ✅       | ✅     |                                 |
| `duties`         | string[] | ✅     | ✅   | ✅       | ✅     |                                 |
| `requirements`   | string[] | ✅     | ✅   | ✅       | ✅     |                                 |
| `offers`         | string[] | ✅     | ✅   | ✅       | ✅     |                                 |
| `order`          | number   | ✅     | ✅   | ✅       | ✅     |                                 |
| `description`    | block[]  | ✅     | ❌   | ❌       | ✅     | Schema only — not in GROQ query |

---

### `redirect`

Live documents: **1+** (managed via Redirect Manager tool). Used by `apps/web/src/middleware.ts` — **not fetched via GROQ client query**.

| Field             | Type     | Schema | GROQ | Template | Seeded | Notes                                    |
| ----------------- | -------- | ------ | ---- | -------- | ------ | ---------------------------------------- |
| `sourcePath`      | string   | ✅     | N/A  | N/A      | ✅     | Middleware uses Sanity REST API directly |
| `destinationPath` | string   | ✅     | N/A  | N/A      | ✅     |                                          |
| `statusCode`      | number   | ✅     | N/A  | N/A      | ✅     | 301 \| 302 \| 410                        |
| `isActive`        | boolean  | ✅     | N/A  | N/A      | ✅     |                                          |
| `notes`           | text     | ✅     | N/A  | N/A      | ❌     | Optional                                 |
| `hitCount`        | number   | ✅     | N/A  | N/A      | ✅     | readOnly — incremented by middleware     |
| `lastHitAt`       | datetime | ✅     | N/A  | N/A      | ✅     | readOnly — set by middleware             |

---

### `formOption`

Live documents: **52** across 10 groups. Query: `FORM_OPTIONS_QUERY`. Added 2026-05-19.

| Field         | Type    | Schema | GROQ        | Template | Seeded | Notes                                             |
| ------------- | ------- | ------ | ----------- | -------- | ------ | ------------------------------------------------- |
| `optionGroup` | string  | ✅     | ✅          | ✅       | ✅     | Controlled list of 10 groups                      |
| `label`       | string  | ✅     | ✅          | ✅       | ✅     | Display text                                      |
| `value`       | string  | ✅     | ✅          | ✅       | ✅     | Form submission value; defaults to label if blank |
| `order`       | number  | ✅     | ✅          | ✅       | ✅     | Sort within group                                 |
| `isActive`    | boolean | ✅     | ❌ (filter) | ❌       | ✅     | Used in WHERE (`isActive == true`), not returned  |

**Group counts:** bookFor ×3, conditionReasons ×7, paymentMethods ×4, availabilitySlots ×4, facilityTypes ×6, serviceCounties ×7, bedCounts ×5, existingCareStatuses ×4, facilityRoles ×6, interestReasons ×6

---

## Objects (6)

Embedded types — not standalone documents. No GROQ/Template/Seeded columns (resolved via parent).

| Schema         | File                      | Fields                                                    | Used In                                                 |
| -------------- | ------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `imageWithAlt` | `objects/imageWithAlt.ts` | asset (image), alt (string, required)                     | Multiple singletons and documents                       |
| `ctaLink`      | `objects/ctaLink.ts`      | label, href (both required), variant (controlled)         | Multiple page singletons                                |
| `seoFields`    | `objects/seoFields.ts`    | metaTitle, metaDescription, ogImage                       | All page singletons                                     |
| `audienceCard` | `objects/audienceCard.ts` | tagline, heading, bodyCollapsed, bodyExpanded, image, cta | `homePage.routerCards`                                  |
| `serviceTrack` | `objects/serviceTrack.ts` | label, heading, body, cta, image                          | `homePage.twoWaysTracks`, `patientsPage.deliveryTracks` |
| `processStep`  | `objects/processStep.ts`  | stepNumber, heading, body, image (added 2026-05-18)       | `homePage` step arrays, `communitiesPage.processSteps`  |

---

## Notes

- All singleton documents must exist in Sanity before building the page. Astro builds succeed with `?? fallback` values, but Sanity content won't appear until the document is created and published.
- Blog schemas (`blogPost`, `blogCategory`, `author`, `blogIndexPage`) are live with real content from Phase 6.
- Schema changes require Studio redeploy from the canonical clone: `git pull origin main && SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy`
- `redirect` documents are managed exclusively through the Studio "Redirects" tool (RedirectManager.tsx) — never edit raw JSON.
- `formOption` documents are ordered by `order` field within each group. Set `isActive: false` to hide an option without deleting it.
- Local fallback images (`?? '/images/...'`) are served from `apps/web/public/images/`. Sanity CDN images take precedence when uploaded.
- `condition.image`, `testimonial.authorPhoto`, `aboutPage.founderPhoto` are schema-wired but images not yet uploaded to Sanity CDN.
