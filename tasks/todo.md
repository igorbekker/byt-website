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
