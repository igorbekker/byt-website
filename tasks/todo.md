# Task Plan

## Status Legend

- [ ] Pending
- [x] Complete
- [~] In Progress
- [!] Blocked

---

## Phase 1 — Repo Bootstrap + Design-Source Setup

### Job 1: Design-Source [x] COMPLETE

- [x] Zip uploaded by Igor (Homepage (1).zip)
- [x] Extracted and sorted into pages/, partials/, styles/, assets/, assets/wireframes/, assets/vendor/
- [x] design-source/README.md written with full index
- [x] Committed to main: chore(design-source)

### Job 2: Monorepo + CMS Bootstrap [x] COMPLETE

- [x] feat/phase-1-bootstrap branch created
- [x] pnpm-workspace.yaml (apps/web, apps/studio)
- [x] Root package.json with workspace scripts
- [x] .editorconfig, .nvmrc (Node 22), .npmrc
- [x] .gitignore updated (.astro/, backup dirs)
- [x] apps/web — Astro 6 + @astrojs/cloudflare adapter
- [x] apps/web/astro.config.mjs — static output, Sanity integration, /admin studio mount
- [x] apps/web/tsconfig.json — extends astro/tsconfigs/strictest
- [x] apps/web/src/styles/global.css — CSS token scaffold
- [x] apps/web/src/layouts/, src/components/, src/lib/queries.ts, src/pages/index.astro
- [x] apps/web/src/env.d.ts
- [x] apps/web/sanity.config.ts — stub config for embedded studio (see DEC-001)
- [x] apps/studio — Sanity v4 (projectId: bpjtbps6, dataset: production)
- [x] apps/studio/sanity.config.ts, sanity.cli.ts
- [x] apps/studio/schemas/ — siteSettings singleton (phone, email, address, businessName)
- [x] ESLint flat config (TypeScript strict)
- [x] Prettier + prettier-plugin-astro
- [x] Husky + lint-staged pre-commit hook
- [x] .github/workflows/ci.yml — lint, typecheck, build on PR
- [x] docs/decision-log/ — README + DEC template
- [x] docs/obstacle-log/ — README + OBS template
- [x] backups/manifests/backup-manifest.template.md
- [x] scripts/backup-git.sh, backup-sanity.sh
- [x] .env.example
- [x] pnpm install — clean
- [x] pnpm --filter web build — passes
- [x] pnpm typecheck — passes
- [x] pnpm lint — passes

---

## Decisions Log

| #   | Question                                        | Decision                                                                                  |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Schema sharing between apps/web and apps/studio | Stub config in apps/web for Phase 1; extract to packages/schemas in Phase 2. See DEC-001. |

---

## Quick Status Summary

- **Last work:** Phase 1 cleanup session — PR #1 merged, design-source organized, retroactive OBS-001–004 logged, DEC-001 approval corrected.
- **Current issues:** None known
- **Detailed history:** See `tasks/todo-archive.md` (created when this file exceeds 100 lines)

---

## Phase 2 — Design Source Ingestion

**Goal:** Extract all design tokens into `apps/web/src/styles/global.css`, scaffold every reusable component as an Astro component, wire the Homepage page, and verify design-source parity before committing.

**Branch:** `feat/phase-2-design-ingestion`

**Source files read:** `design-source/styles/base.css`, `blog.css`, `article.css`, `providers.css`, `design-source/partials/nav.html`, `footer.html`, `mobile-bar.html`, `design-source/pages/Homepage.html`

---

### A — Token Reference (extracted from design-source)

#### Colors

| Token               | Value     | Source                                                        |
| ------------------- | --------- | ------------------------------------------------------------- |
| `--navy`            | `#104378` | base.css, Homepage.html                                       |
| `--navy-deep`       | `#0a2d52` | base.css, Homepage.html                                       |
| `--navy-footer`     | `#2d2d52` | base.css, Homepage.html                                       |
| `--white`           | `#ffffff` | base.css                                                      |
| `--off-white`       | `#f5f7fa` | base.css                                                      |
| `--cream`           | `#fffcf0` | base.css                                                      |
| `--slate`           | `#5a7194` | base.css                                                      |
| `--mist`            | `#8fa3bf` | base.css                                                      |
| `--border`          | `#e4eaf0` | base.css                                                      |
| `--coral`           | `#e05555` | base.css                                                      |
| `--coral-hover`     | `#c94444` | base.css                                                      |
| `--coral-light`     | `#fce8e8` | base.css                                                      |
| `--sage`            | `#9caf88` | base.css                                                      |
| `--sage-hover`      | `#7a9468` | base.css                                                      |
| `--sage-light`      | `#e8efe3` | base.css                                                      |
| `--spec-blue`       | `#2491eb` | providers.css ONLY — see Escalation Q1                        |
| `--spec-blue-hover` | `#1a7bcc` | providers.css ONLY                                            |
| `--callout-gold`    | `#b18a2e` | article.css (`.callout-label`) — see Escalation Q2            |
| `--callout-border`  | `#f3e9c4` | article.css (`.callout`) — see Escalation Q2                  |
| `--quote-teal`      | `#4fb7a6` | providers.css (`.p-quote-mark`) — see Escalation Q3           |
| `--prose-text`      | `#2d3a4f` | article.css (`.article-prose p`) — see Escalation Q4          |
| `--track-bg-1`      | `#f1f4f7` | providers.css (`.p-track-1`) — see Escalation Q5              |
| `--handles-bg`      | `#f8fafb` | providers.css (`.p-handles`, `.p-social`) — see Escalation Q5 |

#### Typography

| Token                   | Value                                  | Source                                 |
| ----------------------- | -------------------------------------- | -------------------------------------- |
| `--font-body`           | `'Montserrat', system-ui, sans-serif`  | base.css body                          |
| `--font-heading`        | `'Manrope', system-ui, sans-serif`     | base.css h1–h5                         |
| `--font-mono`           | `'JetBrains Mono', 'Menlo', monospace` | blog.css `.img-ph` — see Escalation Q6 |
| `--font-size-base`      | `15px`                                 | base.css body                          |
| `--line-height-base`    | `1.55`                                 | base.css body                          |
| `--line-height-heading` | `1.1`                                  | base.css h1–h5                         |

#### Border Radius

| Token      | Value   | Source                                          |
| ---------- | ------- | ----------------------------------------------- |
| `--r-btn`  | `6px`   | base.css                                        |
| `--r-card` | `12px`  | base.css                                        |
| `--r-lg`   | `12px`  | base.css (same as --r-card — see Escalation Q7) |
| `--r-pill` | `999px` | base.css                                        |

#### Shadows

| Token         | Value                                | Source   |
| ------------- | ------------------------------------ | -------- |
| `--shadow-sm` | `0 1px 2px rgba(16, 67, 120, 0.04)`  | base.css |
| `--shadow-md` | `0 4px 12px rgba(16, 67, 120, 0.08)` | base.css |
| `--shadow-lg` | `0 8px 24px rgba(16, 67, 120, 0.1)`  | base.css |

#### Motion

| Token       | Value        | Source   |
| ----------- | ------------ | -------- |
| `--t-hover` | `150ms ease` | base.css |

#### Layout / Spacing

| Token     | Value (desktop) | Value (≤1024px) | Value (≤768px) | Source   |
| --------- | --------------- | --------------- | -------------- | -------- |
| `--max-w` | `1200px`        | —               | —              | base.css |
| `--pad-x` | `64px`          | `32px`          | `20px`         | base.css |
| `--pad-s` | `80px`          | `64px`          | `56px`         | base.css |

#### Breakpoints (not tokenized in design-source — declared as media queries only)

| Name             | Value               | Where used              |
| ---------------- | ------------------- | ----------------------- |
| Desktop → Tablet | `max-width: 1024px` | base.css, Homepage.html |
| Tablet → Mobile  | `max-width: 768px`  | base.css, Homepage.html |
| Providers tablet | `max-width: 1100px` | providers.css           |
| Providers narrow | `max-width: 900px`  | providers.css           |
| Providers mid    | `max-width: 720px`  | providers.css           |
| Providers small  | `max-width: 540px`  | providers.css           |

---

### B — Components to Build

| Component (Astro file)      | Design-source origin                                                                                                                                                                       | Notes                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `Nav.astro`                 | `partials/nav.html`, `base.css` (.nav, .nav-inner, .nav-links, .nav-actions, .nav-cta, .nav-cta-secondary, .nav-hamburger)                                                                 | Includes mobile drawer                                                                        |
| `MobileMenuDrawer.astro`    | `partials/nav.html`, `base.css` (.mobile-menu, .mobile-menu-panel, .mobile-menu-head, .mm-link, .mobile-menu-actions)                                                                      | Could be sub-component of Nav                                                                 |
| `Footer.astro`              | `partials/footer.html`, `base.css` (.footer, .footer-grid, .footer-col, .footer-links, .footer-bottom, .footer-legal, .social-links, .social-link)                                         | 3-column grid + bottom bar                                                                    |
| `MobileCTABar.astro`        | `partials/mobile-bar.html`, `base.css` (.mobile-cta-bar)                                                                                                                                   | Fixed bottom bar, mobile-only                                                                 |
| `Button.astro`              | `base.css` (.btn + variants: btn-coral, btn-ink, btn-outline-white, btn-outline-ink, btn-outline-navy, btn-outline-coral, btn-sage)                                                        | Homepage also adds btn-primary, btn-outline, btn-white, btn-white-outline — see Escalation Q8 |
| `Eyebrow.astro`             | `base.css` (.eyebrow)                                                                                                                                                                      | Could be inline utility; builder decides                                                      |
| `FadeUp.astro`              | `base.css` (.fade-up, .fade-up.visible), providers.css (.fade-up.in — different trigger class) — see Escalation Q9                                                                         | Scroll animation wrapper                                                                      |
| `HeroSection.astro`         | `Homepage.html` (.hero, .hero-image, .hero-content, .hero-eyebrow, .hero-subhead, .hero-actions)                                                                                           | Split-column, cream bg                                                                        |
| `AudienceRouter.astro`      | `Homepage.html` (.router-section, .router-row, .r-card, .r-card-wide, .r-card-narrow, .r-wide-content, .r-wide-image, .r-narrow-content, .r-tagline, .r-heading, .r-body, .r-icon, .r-cta) | Interactive accordion-style cards; JS required                                                |
| `BeliefBand.astro`          | `Homepage.html` (.belief, .belief-inner, .belief-rule)                                                                                                                                     | Cream quote/statement section                                                                 |
| `TwoWaysSection.astro`      | `Homepage.html` (.twoways, .twoways-cards, .twoways-card, .twoways-card-bg, .twoways-card-overlay, .twoways-card-content, .twoways-card-label)                                             | Full-bleed photo cards                                                                        |
| `ConditionsScroll.astro`    | `Homepage.html` (.l349, .l349-left, .l349-section, .l349-right, .l349-img-wrap, .l349-img)                                                                                                 | Sticky-scroll layout; JS required                                                             |
| `HowItWorks.astro`          | `Homepage.html` (.howitworks, .howitworks-grid, .howitworks-track, .step, .step-num, .step-text, .track-cta)                                                                               | Two-track step layout                                                                         |
| `TestimonialsSection.astro` | `Homepage.html` (.testimonials, .testimonials-grid, .testimonial-card, .testimonial-quote-mark, .testimonial-text, .testimonial-attribution, .testimonial-avatar)                          | 2-col grid                                                                                    |
| `ProviderTeaser.astro`      | `Homepage.html` (.provider, .provider-bg, .provider-overlay, .provider-inner, .provider-tags, .provider-actions)                                                                           | Dark bg with photo overlay                                                                    |
| `BlogHero.astro`            | `blog.css` (.blog-hero, .blog-hero-inner)                                                                                                                                                  | Dark navy, coral accent                                                                       |
| `ArticleCard.astro`         | `blog.css` (.article-card, .article-card-img, .article-card-body, .article-card-meta, .article-card-cat, .article-card-author, .article-card-avatar)                                       | Card for blog listings                                                                        |
| `FilterPills.astro`         | `blog.css` (.pill-row, .pill)                                                                                                                                                              | Blog category filter row                                                                      |
| `NewsletterBlock.astro`     | `blog.css` (.newsletter, .newsletter-inner, .newsletter-form)                                                                                                                              | Standalone newsletter CTA                                                                     |
| `Breadcrumb.astro`          | `blog.css` (.crumb, .crumb-inner, .crumb a, .crumb .sep, .crumb .here)                                                                                                                     | Blog page breadcrumb                                                                          |
| `ImagePlaceholder.astro`    | `blog.css` (.img-ph, .img-ph-coral, .img-ph-sage, .img-ph-navy)                                                                                                                            | Dev-only image placeholder                                                                    |
| `ArticleHero.astro`         | `article.css` (.article-hero, .article-hero-inner, .article-byline, .byline-avatar, .byline-meta, .byline-stats)                                                                           | Article page hero                                                                             |
| `ArticleBody.astro`         | `article.css` (.article-body, .article-body-grid, .article-prose, .article-side)                                                                                                           | Prose + sidebar layout                                                                        |
| `TableOfContents.astro`     | `article.css` (.toc, .toc-label, .toc ol, .toc a)                                                                                                                                          | Sticky sidebar TOC                                                                            |
| `ShareButtons.astro`        | `article.css` (.share, .share-label, .share-row, .share-btn)                                                                                                                               | Social share row                                                                              |
| `Callout.astro`             | `article.css` (.callout, .callout-label)                                                                                                                                                   | Inline callout block                                                                          |
| `ArticleImage.astro`        | `article.css` (.article-image, .article-image-inner, .article-image-caption)                                                                                                               | Article featured image                                                                        |
| `ArticleFigure.astro`       | `article.css` (.fig, .fig-img, .fig-caption)                                                                                                                                               | Inline figure with caption                                                                    |
| `ArticleTags.astro`         | `article.css` (.article-tags, .article-tag)                                                                                                                                                | Tag list below article                                                                        |
| `AuthorCard.astro`          | `article.css` (.author-card, .author-card-avatar, .author-card-body)                                                                                                                       | Author bio block                                                                              |
| `RelatedArticles.astro`     | `article.css` (.related, .related-inner, .related-header, .related-grid)                                                                                                                   | 3-col related posts grid                                                                      |
| `ProvidersHero.astro`       | `providers.css` (.p-hero, .p-hero-photo, .p-hero-panel, .p-hero-eyebrow, .p-hero-sub, .p-hero-actions)                                                                                     | Split photo/navy hero                                                                         |
| `ProviderTrack.astro`       | `providers.css` (.p-track, .p-track-inner, .p-track-eyebrow, .p-track-num, .p-track-title, .p-track-status, .p-track-specs, .p-spec, .p-track-visual, .p-county-card, .p-statewide-card)   | Two-track layout block                                                                        |
| `HandlesGrid.astro`         | `providers.css` (.p-handles, .p-handles-inner, .p-handles-grid, .p-handle, .p-handle-icon)                                                                                                 | "What BYT Handles" cards                                                                      |
| `QualsList.astro`           | `providers.css` (.p-quals, .p-quals-inner, .p-quals-list, .p-qual, .p-qual-scope, .p-qual-body)                                                                                            | Minimum qualifications table                                                                  |
| `QuoteCards.astro`          | `providers.css` (.p-social, .p-social-grid, .p-quote-card, .p-quote-mark, .p-quote-text, .p-quote-attr)                                                                                    | Social proof quotes                                                                           |
| `CTABand.astro`             | `providers.css` (.p-cta, .p-cta-inner)                                                                                                                                                     | Full-width navy CTA                                                                           |

---

### C — Checklist

#### Token Extraction

- [x] Create branch `feat/phase-2-design-ingestion`
- [x] Populate `apps/web/src/styles/global.css` — Color tokens (all 15 core + Q1-Q5 extras applied)
- [x] Populate `apps/web/src/styles/global.css` — Typography tokens (font-family, font-size-base, line-height-base, line-height-heading)
- [x] Populate `apps/web/src/styles/global.css` — Border radius tokens (--r-btn, --r-card, --r-pill; --r-lg removed per Q7)
- [x] Populate `apps/web/src/styles/global.css` — Shadow tokens (--shadow-sm, --shadow-md, --shadow-lg)
- [x] Populate `apps/web/src/styles/global.css` — Motion token (--t-hover)
- [x] Populate `apps/web/src/styles/global.css` — Layout tokens (--max-w, --pad-x, --pad-s) with responsive overrides in media queries
- [x] Add `@import` for Google Fonts (Manrope + Montserrat) in global.css; JetBrains Mono system-stack only per Q6
- [x] Add CSS reset (`box-sizing`, `margin:0`, `padding:0`) and base `html`/`body`/`img`/`a`/`h1-h5`/`p` rules to global.css
- [x] Add `.eyebrow`, `.max-w`, `.fade-up` utility classes to global.css
- [x] Verify: no hardcoded hex values remain in any component — all colors reference CSS variables

#### Component Scaffolds (in order of dependency)

- [x] `Button.astro` — all btn variants (canonical + alias per Q8; btn-spec-blue per Q1)
- [x] `Eyebrow.astro`
- [x] `FadeUp.astro` — uses `.visible` exclusively per Q9
- [x] `Nav.astro` — includes mobile drawer and open/close JS
- [x] `Footer.astro` — 4-col grid + social links + newsletter column
- [x] `MobileCTABar.astro`
- [x] `HeroSection.astro`
- [x] `AudienceRouter.astro` — JS accordion behavior
- [x] `BeliefBand.astro`
- [x] `TwoWaysSection.astro`
- [x] `ConditionsScroll.astro` — sticky-scroll JS (image swap on section enter)
- [x] `HowItWorks.astro`
- [x] `TestimonialsSection.astro`
- [x] `ProviderTeaser.astro`
- [x] `BlogHero.astro`
- [x] `ArticleCard.astro`
- [x] `FilterPills.astro`
- [x] `NewsletterBlock.astro`
- [x] `Breadcrumb.astro`
- [x] `ImagePlaceholder.astro`
- [x] `ArticleHero.astro`
- [x] `ArticleBody.astro`
- [x] `TableOfContents.astro`
- [x] `ShareButtons.astro`
- [x] `Callout.astro` — callout gold colors scoped LOCAL per Q2
- [x] `ArticleImage.astro`
- [x] `ArticleFigure.astro`
- [x] `ArticleTags.astro`
- [x] `AuthorCard.astro`
- [x] `RelatedArticles.astro`
- [x] `ProvidersHero.astro`
- [x] `ProviderTrack.astro`
- [x] `HandlesGrid.astro`
- [x] `QualsList.astro`
- [x] `QuoteCards.astro` — uses --color-teal for quote mark per Q3
- [x] `CTABand.astro`

#### Layout + Page Wiring

- [x] Create `BaseLayout.astro` — `<html>`, `<head>` (fonts, global.css), `<Nav>`, `<slot>`, `<Footer>`, `<MobileCTABar>`
- [x] Wire `apps/web/src/pages/index.astro` — compose all 8 Homepage sections using scaffolded components

#### Quality Gates

- [x] `pnpm --filter web build` — PASS
- [x] `pnpm typecheck` — PASS
- [x] `pnpm lint` — PASS
- [x] `pnpm format --check` — PASS (OBS-005 resolved: added `design-source/` and `**/.gitkeep` to `.prettierignore`, approved by Igor)
- [x] `pnpm --filter web check` — PASS (0 errors, 0 warnings after FadeUp.astro TypeScript fix)
- [x] No `console.log` statements in committed code
- [x] CLAUDE.md audit: no hardcoded hex values in components; all CSS references variables
- [x] Ready for `/pre` — stopped to report to AGENT_pm

---

### Phase 2 Review

**Status:** COMPLETE
**Date completed:** 2026-05-01
**Branch:** feat/phase-2-design-ingestion

All 38 Astro components built, global.css fully populated with design token system, and index.astro wired with all 8 homepage sections. All five quality gates pass. OBS-005 resolved by adding `design-source/` and `**/.gitkeep` to `.prettierignore` (Igor approved).

**Key design decisions applied:**

- Q1: --color-spec-blue + --color-spec-blue-hover added as global tokens
- Q2: Callout gold scoped locally in Callout.astro only
- Q3: --color-teal added as global token for QuoteCards quote mark
- Q4: --color-prose-text added as global token for article prose
- Q5: Three near-identical off-whites collapsed into --off-white: #f5f7fa
- Q6: JetBrains Mono as system-stack fallback only (no Google Fonts import)
- Q7: --r-lg removed; --r-card used everywhere
- Q8: Both canonical and alias button variants in global.css
- Q9: .fade-up.visible only; .fade-up.in removed

**Bug fixed during execution:**

- FadeUp.astro: Dynamic `tag` prop caused TypeScript error ts(2322); simplified to hardcoded `<div>` wrapper.

---

## Phase 3 — Sanity Studio Setup

**Branch:** `feat/phase-3-sanity-studio`

---

### A — Schema Files to Create

#### Objects (shared reusable structures)

- [x] `apps/studio/schemas/objects/seoFields.ts` — `metaTitle`, `metaDescription`, `ogImage`
- [x] `apps/studio/schemas/objects/ctaLink.ts` — `label`, `href`, `variant` (8-option enum)
- [x] `apps/studio/schemas/objects/imageWithAlt.ts` — hotspot image + `alt` (required)
- [x] `apps/studio/schemas/objects/audienceCard.ts` — `tagline`, `heading`, `bodyCollapsed`, `bodyExpanded`, `image`, `cta`
- [x] `apps/studio/schemas/objects/serviceTrack.ts` — `label`, `heading`, `body`, `cta`, `image`
- [x] `apps/studio/schemas/objects/processStep.ts` — `stepNumber`, `heading`, `body`

#### Singletons (one instance per page or global)

- [x] `apps/studio/schemas/singletons/siteSettings.ts` — extended with 10 new fields (additive only)
- [x] `apps/studio/schemas/singletons/homePage.ts`
- [x] `apps/studio/schemas/singletons/aboutPage.ts`
- [x] `apps/studio/schemas/singletons/patientsPage.ts`
- [x] `apps/studio/schemas/singletons/communitiesPage.ts`
- [x] `apps/studio/schemas/singletons/providersPage.ts`
- [x] `apps/studio/schemas/singletons/careersPage.ts`
- [x] `apps/studio/schemas/singletons/contactPage.ts`
- [x] `apps/studio/schemas/singletons/blogIndexPage.ts`

#### Documents (repeating content collections)

- [x] `apps/studio/schemas/documents/testimonial.ts`
- [x] `apps/studio/schemas/documents/condition.ts`
- [x] `apps/studio/schemas/documents/blogPost.ts`
- [x] `apps/studio/schemas/documents/blogCategory.ts`
- [x] `apps/studio/schemas/documents/author.ts`
- [x] `apps/studio/schemas/documents/jobPosting.ts`

---

### B — schemas/index.ts Update

- [x] All 21 schemas imported and exported in `apps/studio/schemas/index.ts`

---

### C — Desk Structure

- [x] `apps/studio/structure/index.ts` — singletons group + document collections
- [x] `apps/studio/sanity.config.ts` — wired `structureTool({ structure })`

---

### D — siteSettings Population

- [x] **OBS-006 resolved (Option A)**: Igor will populate siteSettings manually via `/admin` Studio UI after merging. Values: Business Name "Better You Therapy LLC", Phone 754-999-0011, Email info@getbetteryou.com, City Boca Raton FL, Booking URL /contact, Referral URL /communities.

---

### E — GROQ Query Updates

- [x] `SITE_SETTINGS_QUERY` extended with all 10 new fields in `apps/web/src/lib/queries.ts`

---

### F — Quality Gates

- [x] `pnpm --filter studio dev` — Studio starts, `http://localhost:3333/` ready in 524ms, no errors
- [x] `pnpm --filter web build` — PASS
- [x] `pnpm --filter web check` — 0 errors, 0 warnings
- [x] `pnpm typecheck` — PASS (both apps/web and apps/studio)
- [x] `pnpm lint` — PASS
- [x] `npx prettier --check` — PASS
- [x] No `any` in TypeScript — all schema files use `defineType` + `defineField`

---

### Phase 3 Review

**Status:** COMPLETE (2026-05-01)
**Branch:** feat/phase-3-sanity-studio
**OBS logged:** OBS-006 (sanity documents create requires interactive login — resolved via Option A)

All 21 schema types created and registered, desk structure wired into structureTool, all 5 quality gates pass, Studio starts cleanly at localhost:3333. siteSettings seeding deferred to Igor via /admin UI (Option A approved). queries.ts updated with all 10 new siteSettings fields.

---

# Phase 4 — Static Pages (CMS-Driven)

**Date:** 2026-05-01
**Status:** COMPLETE (2026-05-01T20:10Z)

## Overview

Phase 4 connects every Sanity singleton schema (homePage, communitiesPage, patientsPage, providersPage, aboutPage, careersPage, contactPage) to real Astro page files, and wires BaseLayout's Nav and Footer to live siteSettings data. Each unit builds one page (or the BaseLayout update) and is immediately followed by an AGENT_qa verification pass before the next unit begins. At the end of Phase 4 all 7 public pages are CMS-driven with no hardcoded copy, phone numbers, or contact details.

---

## Build Units

### Unit 0 — BaseLayout: Nav + Footer → siteSettings

**Goal:** Replace every hardcoded string in Nav.astro and Footer.astro with values fetched from the `siteSettings` Sanity singleton. Update BaseLayout.astro to fetch siteSettings and pass it as props to Nav and Footer.

**siteSettings fields to wire:**

- `businessName` — footer copyright line
- `phone` — footer contact block, footer links column, Nav secondary CTA href (tel:)
- `email` — footer contact block
- `address` → `city`, `state` — footer contact block
- `fax` — footer contact block (currently hardcoded as 754-999-0012)
- `bookingUrl` — Nav primary CTA href, mobile menu primary CTA href
- `referralUrl` — Nav secondary CTA href, mobile menu secondary CTA href
- `navCtaLabel` — Nav primary CTA text, mobile menu primary CTA text
- `navCtaSecondaryLabel` — Nav secondary CTA text, mobile menu secondary CTA text
- `footerTagline` — footer tagline paragraph
- `copyrightEntity` — footer copyright entity name
- `newsletterHeading` — footer "Stay in touch" column heading
- `newsletterBody` — footer newsletter pitch paragraph
- `seo` → `metaTitle`, `metaDescription` — BaseLayout default `<title>` and `<meta name="description">` fallback

**Current hardcoded values to eliminate (confirmed by reading files):**

- Nav.astro: "Book a Session" (line 21), "Refer a Resident" (lines 22, 69), `/individual-therapy/` href (lines 21, 68), `/referral/` href (lines 22, 69)
- Footer.astro: tagline text (line 17-19), "Boca Raton, FL" (line 21), "754-999-0011" (lines 22, 75), "hello@getbetteryou.com" (line 23), "754-999-0012" (line 75 — fax in footer links), "Better You Therapy LLC" + year in copyright (line 101), newsletter pitch text (line 82)

**Tasks:**

- [x] Add `SITE_SETTINGS_QUERY` fetch in BaseLayout.astro using `sanityClient` from `sanity:client`
- [x] Update BaseLayout Props interface: accept page-level `seo` object; fall back to siteSettings.seo when page seo is null
- [x] Update `<title>` and `<meta name="description">` in BaseLayout `<head>` to use resolved SEO values
- [x] Update Nav.astro Props interface to accept `navCtaLabel`, `navCtaSecondaryLabel`, `bookingUrl`, `referralUrl`; pass from BaseLayout
- [x] Wire Nav.astro: replace 4 hardcoded strings/hrefs with props
- [x] Update Footer.astro Props interface to accept all contact/copy fields; pass from BaseLayout
- [x] Wire Footer.astro: replace all hardcoded contact/copy strings with props
- [x] Wire MobileCTABar.astro: replace hardcoded CTA labels/hrefs with props
- [x] AGENT_qa: PASS — build clean, no hardcoded values, props flow verified

---

### Unit 1 — Homepage (/)

**File:** `apps/web/src/pages/index.astro` (already exists — currently uses static placeholder data)
**Design-source:** `design-source/pages/Homepage.html`
**Design-source sections (in DOM order):**

1. `.hero` — split-column cream hero with eyebrow, headline, subhead, image, two CTA buttons
2. `.router-section` — audience router with eyebrow, heading, subhead, and 3 audience cards (each: tagline, heading, collapsed body, expanded body, image, CTA)
3. `.belief` — cream quote/statement band with quote text and body paragraph
4. `.twoways` — full-bleed photo cards (2 service tracks: label, heading, body, image, CTA)
5. `.l349` — sticky-scroll conditions section with eyebrow, heading, subhead (conditions data rendered from `condition` document collection query)
6. `.howitworks` — two-track step layout with eyebrow, heading, teletherapy track (label + 3 steps + CTA), facility track (label + 3 steps + CTA)
7. `.testimonials` — 2-col grid with eyebrow, heading, subhead (testimonial data from `testimonial` document collection query)
8. `.provider` — dark photo overlay teaser with eyebrow, heading, body, image, primary CTA, secondary CTA

**Sanity fields queried (from homePage.ts):**
`heroEyebrow`, `heroHeadline`, `heroSubhead`, `heroImage`, `heroPrimaryCta`, `heroSecondaryCta`, `routerEyebrow`, `routerHeading`, `routerSubhead`, `routerCards[]{ tagline, heading, bodyCollapsed, bodyExpanded, image, cta }`, `beliefQuote`, `beliefBody`, `twoWaysEyebrow`, `twoWaysHeading`, `twoWaysSubhead`, `twoWaysTracks[]{ label, heading, body, cta, image }`, `conditionsEyebrow`, `conditionsHeading`, `conditionsSubhead`, `howItWorksEyebrow`, `howItWorksHeading`, `teletherapyTrackLabel`, `teletherapySteps[]{ stepNumber, heading, body }`, `teletherapyCta`, `facilityTrackLabel`, `facilitySteps[]{ stepNumber, heading, body }`, `facilityCta`, `testimonialsEyebrow`, `testimonialsHeading`, `testimonialsSubhead`, `providerTeaserEyebrow`, `providerTeaserHeading`, `providerTeaserBody`, `providerTeaserImage`, `providerTeaserPrimaryCta`, `providerTeaserSecondaryCta`, `seo`

**Also queries:** `*[_type == "condition"]{ _id, name, description }` (for ConditionsScroll), `*[_type == "testimonial"]{ _id, quote, authorName, authorTitle, authorAvatar }` (for TestimonialsSection)

**Tasks:**

- [x] Write `HOME_PAGE_QUERY`, `CONDITIONS_HOME_QUERY`, `TESTIMONIALS_HOME_QUERY` in queries.ts
- [x] Rewrite `index.astro` — fetches 3 queries, wires all 8 sections
- [x] Wire all 42 homePage schema fields + condition + testimonial collections
- [x] AGENT_qa: PASS (after fix — removed hardcoded title/description fallback; replaced #fff with var(--white) in 4 components)

---

### Unit 2 — Communities (/communities/)

**File:** `apps/web/src/pages/communities.astro` (create new)
**Design-source:** `design-source/pages/Communities.html`
**Design-source sections (in DOM order):**

1. `.h84` — hero (eyebrow, h1, lede/subhead, single CTA button, hero image)
2. `.l521-section` — process steps (heading, subhead, up to 4 cards with step number, heading, icon)
3. `.l16` — what BYT handles grid (eyebrow, heading, subhead, handles items array)
4. `.l526-section` — conditions section (eyebrow, heading, subhead + condition cards from collection)
5. `.l505-section` — additional handles/detail section (maps to handlesItems, see Escalation Q1)
6. `.l192` — (see Escalation Q2 — no clear schema mapping found)
7. `.cta25-section` — CTA band (heading, subhead, CTA button)

**Sanity fields queried (from communitiesPage.ts):**
`heroHeading`, `heroSubhead`, `heroCta{ label, href, variant }`, `processEyebrow`, `processHeading`, `processSteps[]{ stepNumber, heading, body }`, `handlesEyebrow`, `handlesHeading`, `handlesSubhead`, `handlesItems[]{ heading, body }`, `conditionsEyebrow`, `conditionsHeading`, `conditionsSubhead`, `ctaHeading`, `ctaSubhead`, `ctaCta{ label, href, variant }`, `seo`

**Also queries:** `*[_type == "condition"]{ _id, name, description }` (for conditions section)

**Reused components:** `<HandlesGrid>`, `<CTABand>`, `<ConditionsScroll>` (or inline section for simpler conditions display)

**Tasks:**

- [x] Write `COMMUNITIES_PAGE_QUERY` + `CONDITIONS_COMMUNITIES_QUERY` in queries.ts
- [x] Add `serviceAreaHeading`, `serviceAreaLede` fields to communitiesPage.ts schema
- [x] Create `apps/web/src/pages/communities.astro` — 6 sections including tabbed conditions + static SVG map
- [x] AGENT_qa: PASS (SVG map hex colors advisory-only — static art asset)

---

### Unit 3 — Patients (/patients/)

**File:** `apps/web/src/pages/patients.astro` (create new)
**Design-source:** `design-source/pages/Patients.html`
**Design-source sections (in DOM order):**

1. `.ph-hero` — hero with background image, tint overlay, heading, subhead, primary CTA
2. `.ph-router` — 4-card audience selector grid (eyebrow "Choose", heading "What brings you here?", subhead, 4 cards each with label/tag, heading, body, link href)
3. `.ph-twoways` — delivery tracks grid (eyebrow "Delivery", heading "Two ways to get started", subhead, 2 full-bleed photo cards each with tag, heading, body, image)
4. `.belief` — belief band (quote + body) — same BeliefBand component as Homepage
5. `.ph-l505` — conditions section (eyebrow, heading, subhead + condition cards)
6. `.ph-cta35` — CTA band with two-column layout (heading, subhead, 2 CTAs side by side)

**Sanity fields queried (from patientsPage.ts):**
`heroHeading`, `heroSubhead`, `heroPrimaryCta{ label, href, variant }`, `audienceSelectorHeading`, `audienceSelectorCards[]{ label, heading, body, cta{ label, href, variant } }`, `deliveryEyebrow`, `deliveryTracks[]{ label, heading, body, cta, image }`, `beliefQuote`, `beliefBody`, `conditionsEyebrow`, `conditionsHeading`, `conditionsSubhead`, `ctaHeading`, `ctaSubhead`, `ctaCta{ label, href, variant }`, `seo`

**Also queries:** `*[_type == "condition"]{ _id, name, description }` (for conditions section)

**Reused components:** `<BeliefBand>`, `<CTABand>`

**Tasks:**

- [x] Add `heroImage` (imageWithAlt) to patientsPage.ts; add `image` (imageWithAlt) to audienceCard.ts
- [x] Write `PATIENTS_PAGE_QUERY` + `CONDITIONS_PATIENTS_QUERY` in queries.ts
- [x] Create `apps/web/src/pages/patients.astro` — 6 sections, full-bleed hero bg image pattern
- [x] AGENT_qa: PASS

---

### Unit 4 — Providers (/providers/)

**File:** `apps/web/src/pages/providers.astro` (create new)
**Design-source:** `design-source/pages/Providers.html`
**Design-source sections (in DOM order):**

1. `.h98` — split photo/panel hero (eyebrow, heading, subhead, primary CTA; no hero image field in schema, see Escalation Q5)
2. `.section` (l422 layout) — role tracks section (eyebrow `tracksEyebrow`, heading `tracksHeading`, subhead `tracksSubhead`, 2 track cards each with label, heading, body, statusNote, CTA)
3. `.l374-section` — what BYT handles grid (eyebrow `handlesEyebrow`, heading `handlesHeading`, handles items array)
4. `.section` (l506 layout) — qualifications list (eyebrow `qualsEyebrow`, heading `qualsHeading`, quals array with scope + body)
5. `.t37-section` — quote cards / testimonials (no schema field — see Escalation Q6)
6. `.cta36-section` — CTA band (ctaHeading, ctaSubhead, ctaCta)

**Sanity fields queried (from providersPage.ts):**
`heroHeading`, `heroSubhead`, `heroPrimaryCta{ label, href, variant }`, `tracksEyebrow`, `tracksHeading`, `tracksSubhead`, `tracks[]{ label, heading, body, statusNote, cta{ label, href, variant } }`, `handlesEyebrow`, `handlesHeading`, `handlesItems[]{ heading, body }`, `qualsEyebrow`, `qualsHeading`, `quals[]{ scope, body }`, `ctaHeading`, `ctaSubhead`, `ctaCta{ label, href, variant }`, `seo`

**Reused components:** `<ProvidersHero>`, `<ProviderTrack>`, `<HandlesGrid>`, `<QualsList>`, `<QuoteCards>`, `<CTABand>`

**Tasks:**

- [x] Add `heroImage` (imageWithAlt) to providersPage.ts schema
- [x] Write `PROVIDERS_PAGE_QUERY` + `TESTIMONIALS_THERAPIST_QUERY` in queries.ts
- [x] Create `apps/web/src/pages/providers.astro` — 6 sections; testimonials from global collection filtered by audienceType == "therapist"
- [x] AGENT_qa: PASS

---

### Unit 5 — About (/about/)

**File:** `apps/web/src/pages/about.astro` (create new)
**Design-source:** `design-source/pages/About.html`
**Design-source sections (in DOM order):**

1. `.about-hero` — split two-column hero (heading left, hero image right + subhead)
2. `.mission-band` — cream quote/mission band with eyebrow, large quote, body
3. `.story` — two-column story section (eyebrow, heading, rich-text body, founder signature block: name, credential, photo/avatar)
4. `.values` — principles grid (eyebrow `principlesEyebrow`, heading `principlesHeading`, subhead `principlesSubhead`, principles array: number, heading, body — max 3)
5. `.approach` — practice pillars section (eyebrow `practiceEyebrow`, heading `practiceHeading`, practicePillars array: number, label, heading, body — max 4)
6. `.about-cta` — full-bleed background image CTA band (heading, subhead, primary CTA, secondary CTA)

**Sanity fields queried (from aboutPage.ts):**
`heroHeading`, `heroSubhead`, `missionEyebrow`, `missionQuote`, `missionBody`, `storyEyebrow`, `storyHeading`, `storyBody` (portable text array), `founderName`, `founderCredential`, `founderPhoto{ asset, alt }`, `principlesEyebrow`, `principlesHeading`, `principlesSubhead`, `principles[]{ number, heading, body }`, `practiceEyebrow`, `practiceHeading`, `practicePillars[]{ number, label, heading, body }`, `ctaHeading`, `ctaSubhead`, `ctaPrimary{ label, href, variant }`, `ctaSecondary{ label, href, variant }`, `seo`

**Note:** `storyBody` is a portable text (`array of block`) — requires `@portabletext/astro` or inline block renderer (see Escalation Q7).

**Tasks:**

- [x] Install `astro-portabletext` (note: @portabletext/astro does not exist on npm — correct pkg is astro-portabletext)
- [x] Add `ctaBackgroundImage` (imageWithAlt) to aboutPage.ts schema
- [x] Write `ABOUT_PAGE_QUERY` in queries.ts
- [x] Create `apps/web/src/pages/about.astro` — 6 sections with PortableText for storyBody
- [x] AGENT_qa: PASS (after fix — .about-cta h2 color: #fff → var(--white))
- NOTE: About.html also contains .stats-band + .team sections not in brief — pending Igor decision

---

### Unit 6 — Careers (/careers/)

**File:** `apps/web/src/pages/careers.astro` (create new)
**Design-source:** `design-source/pages/Careers.html`
**Design-source sections (in DOM order):**

1. `.about-hero.careers-hero` — hero (heading, subhead)
2. `.jobs` — open positions section (openPositionsIntro text + dynamic list from `jobPosting` document collection)
3. `.general-app` — "no fit" / general application section (noFitHeading, noFitBody)

**Sanity fields queried (from careersPage.ts):**
`heroHeading`, `heroSubhead`, `openPositionsIntro`, `noFitHeading`, `noFitBody`, `seo`

**Also queries:** `*[_type == "jobPosting"] | order(publishedAt desc){ _id, title, department, location, type, slug, summary }` (for jobs listing)

**Tasks:**

- [x] Write `CAREERS_PAGE_QUERY` + `JOB_POSTINGS_QUERY` in queries.ts
- [x] Create `apps/web/src/pages/careers.astro` — 3 sections; empty-state handled gracefully
- [x] AGENT_qa: PASS

---

### Unit 7 — Contact (/contact/)

**File:** `apps/web/src/pages/contact.astro` (create new)
**Design-source:** `design-source/pages/Contact.html`
**Design-source sections (in DOM order):**

1. `.contact-hero` — hero with background image and overlay (heading, subhead; no hero image in schema, see Escalation Q8)
2. `.contact-form-section` — two-column layout: left side contact info (phone, email, fax from siteSettings), right side Formspree contact form (heroHeading as form heading, hoursDescription, disclaimerCopy, responseCopy)

**Sanity fields queried (from contactPage.ts):**
`heroHeading`, `heroSubhead`, `hoursDescription`, `disclaimerCopy`, `responseCopy`, `seo`

**siteSettings fields also used:**
`phone`, `email`, `fax`, `address`

**Note:** Contact form uses Formspree per CLAUDE.md tech stack. Form action URL must come from an env var (`PUBLIC_FORMSPREE_ENDPOINT`) — not hardcoded (see Escalation Q9).

**Tasks:**

- [x] Add `heroImage` (imageWithAlt) to contactPage.ts schema
- [x] Write `CONTACT_PAGE_QUERY` in queries.ts; add `PUBLIC_FORMSPREE_CONTACT_ID` to .env.example
- [x] Create `apps/web/src/pages/contact.astro` — 2 sections; siteSettings contact info left, Formspree form right
- [x] AGENT_qa: PASS (after fix — consent label businessName from siteSettings, not hardcoded)

---

## Escalation Questions

The following ambiguities must be resolved by Igor before AGENT_builder starts the affected unit. Each item is tagged with the unit it blocks.

**Q1 — Communities: l505 section purpose [blocks Unit 2]**
`design-source/pages/Communities.html` has a 5th section `.l505-section` (line 891) in addition to the process steps (l521) and handles grid (l16). The `communitiesPage` schema has only one `handlesItems` array. Clarify whether `.l505-section` is a second "handles" pass, a conditions section, or something else entirely. If it maps to a different content model, the schema may need a new field.

**Q2 — Communities: l192 section [blocks Unit 2]**
`.l192` (line 1006) appears in Communities.html but has no direct mapping in `communitiesPage.ts`. Clarify what content this section carries and whether it needs a schema addition or should be omitted.

**Q3 — Patients: hero background image [blocks Unit 3]**
`.ph-hero` uses a full-bleed background image (`design-source/pages/Patients.html` line 678). `patientsPage.ts` has no `heroImage` field. Clarify: should a `heroImage` field be added to the schema, or should the Patients hero use a static/hardcoded image?

**Q4 — Patients: audience selector card images [blocks Unit 3]**
The `.ph-router` audience cards in `Patients.html` (lines 701-748) each have an image. `patientsPage.audienceSelectorCards` objects have only `label`, `heading`, `body`, `cta` — no `image` field. Clarify: add `image` to each audience selector card object, or use static images per card?

**Q5 — Providers: hero image [blocks Unit 4]**
`.h98` in `Providers.html` is a split photo/panel hero. `providersPage.ts` has no `heroImage` field. Clarify: add `heroImage: imageWithAlt` to providersPage schema, or use the existing `ProvidersHero.astro` component with a static image?

**Q6 — Providers: quote cards / testimonials section [blocks Unit 4]**
`.t37-section` in Providers.html (line 983) shows a testimonial quote grid. `providersPage.ts` has no testimonials field. The design source comment says "Provider testimonial — pending collection." Clarify: should this section pull from the global `testimonial` document collection filtered by type, or should it be skipped/stubbed with placeholder text until testimonials are collected?

**Q7 — About: portable text renderer dependency [blocks Unit 5]**
`aboutPage.storyBody` is `array of block` (Sanity portable text). Rendering it requires either `@portabletext/astro` (new dependency — architectural decision per CLAUDE.md) or a custom block-to-HTML mapper. Clarify which approach to use. If `@portabletext/astro` is approved, AGENT_builder must log an OBS before installing.

**Q8 — Contact: hero background image [blocks Unit 7]**
`.contact-hero` in Contact.html uses a background image. `contactPage.ts` has no `heroImage` field. Clarify: add `heroImage: imageWithAlt` to contactPage schema, or use a static hardcoded image for the contact hero background?

**Q9 — Contact: Formspree endpoint [blocks Unit 7]**
The contact form must submit to Formspree. The form action URL is not yet defined anywhere in the codebase. Clarify: provide the Formspree form ID or full endpoint URL so it can be added to `.env.example` and `.env.local`. Until this is resolved, Unit 7 can be built with a TODO placeholder, but it cannot be verified as fully functional.

---

## Quality Gate Checklist (applied to every unit before marking complete)

- [x] `pnpm --filter web build` passes with no errors
- [x] `pnpm --filter web check` passes (0 Astro type errors)
- [x] No hardcoded hex colors in page files (all CSS uses `var(--*)`)
- [x] No hardcoded phone numbers, email addresses, or business copy outside Sanity queries
- [x] All Sanity fields listed per unit are queried and rendered (null-guarded where optional)
- [x] Heading hierarchy valid on every page
- [x] All `<img>` tags have `alt` attributes
- [x] All new page files use `BaseLayout.astro`
- [x] No `console.log` in committed code
- [x] Page `seo` prop passed to BaseLayout from each page's Sanity query result
- [x] All 7 routes prerender: /, /communities/, /patients/, /providers/, /about/, /careers/, /contact/

---

## Phase 4 Review

**Status:** COMPLETE (2026-05-01T20:10Z)
**Branch:** feat/phase-4-static-pages

**What was built:**

- Unit 0: BaseLayout, Nav.astro, Footer.astro, MobileCTABar.astro wired to siteSettings — all hardcoded CTAs, contact info, and copy eliminated
- Unit 1: index.astro rewritten — 8 sections, 42 fields, condition + testimonial collections
- Unit 2: communities.astro — 6 sections, tabbed conditions (showOnCommunities filter), static SVG map, 2 new schema fields (serviceAreaHeading, serviceAreaLede)
- Unit 3: patients.astro — 6 sections; added heroImage to patientsPage + image to audienceCard schema
- Unit 4: providers.astro — 6 sections; added heroImage to providersPage; therapist testimonials from global collection
- Unit 5: about.astro — 6 sections; astro-portabletext installed for storyBody; ctaBackgroundImage added to schema
- Unit 6: careers.astro — 3 sections; job postings from collection; graceful empty-state
- Unit 7: contact.astro — 2 sections; Formspree via PUBLIC_FORMSPREE_CONTACT_ID env var; contact info from siteSettings

**Schema additions this phase (8 new fields across 4 schemas):**

- patientsPage: heroImage
- audienceCard: image
- providersPage: heroImage
- aboutPage: ctaBackgroundImage
- contactPage: heroImage
- communitiesPage: serviceAreaHeading, serviceAreaLede

**Fixes caught by AGENT_qa (3 rounds):**

- Unit 1: hardcoded title/description fallback in index.astro removed; #fff → var(--white) in 4 home components
- Unit 5: .about-cta h2 color: #fff → var(--white)
- Unit 7: consent checkbox businessName from siteSettings, not hardcoded literal

**Known gaps (not blocking, pending Igor):**

- About.html has .stats-band + .team sections not in the Phase 4 brief — no schema fields, not rendered
- OBS-007 correction: installed package is astro-portabletext, not @portabletext/astro (doesn't exist on npm)
- Sanity Studio deploy requires SANITY_DEPLOY_TOKEN (Administrator) — stored in ~/.profile as $SANITY_DEPLOY_TOKEN
