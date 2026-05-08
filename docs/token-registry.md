# CSS Token Registry

All `:root` tokens defined in `apps/web/src/styles/global.css`. For each token: the pages in `design-source/pages/` that reference it via `var(--token)`, and its current status.

**Status key:**

- **Active** — used in one or more design-source page files
- **Orphaned — base styles only** — not in any design-source page; used in `global.css` base element rules (body, h1-h5, .btn, etc.)
- **Orphaned — unused** — not in design-source pages and not in `global.css` element rules (used only in Astro blog/article components, or not at all)
- **Eliminated per DEC-002** — `--byt-*` System B tokens; all replaced by System A unprefixed equivalents

**Page abbreviations (design-source/pages/):**
System A built: `Homepage`, `About`, `Patients`, `Careers`, `Contact`, `Privacy`, `Terms`, `Providers`, `Communities`
Blog pages: `Blog`, `BlogArt`, `BlogCat`, `BlogSub`
Reference files: `CTAForms`, `byt_v14`

---

## Token Table

| Token                     | Value                                  | Referenced by (design-source/pages)                                                                                                               | Status                                                   |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `--navy`                  | `#104378`                              | Homepage, About, Patients, Careers, Contact, Privacy, Terms; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14                                   | Active                                                   |
| `--navy-deep`             | `#0a2d52`                              | Homepage, About, Patients, Careers, Contact, Privacy, Terms; Blog, BlogArt, BlogCat, BlogSub; CTAForms                                            | Active                                                   |
| `--navy-footer`           | `#2d2d52`                              | — (defined in page :root blocks but never consumed via `var()` in any page)                                                                       | Orphaned — unused                                        |
| `--white`                 | `#ffffff`                              | Homepage, About, Patients, Careers, Contact, Privacy, Terms; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14                                   | Active                                                   |
| `--off-white`             | `#f5f7fa`                              | Homepage, About, Patients, Careers, Contact, Privacy; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14                                          | Active                                                   |
| `--cream`                 | `#fffcf0`                              | Homepage, About, Patients, Careers, Contact, Privacy; Blog, BlogArt, BlogCat, BlogSub; CTAForms                                                   | Active                                                   |
| `--slate`                 | `#5a7194`                              | Homepage, About, Patients, Careers, Contact, Privacy, Terms; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14                                   | Active                                                   |
| `--mist`                  | `#8fa3bf`                              | Homepage, About, Patients, Careers, Contact, Privacy, Terms; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14                                   | Active                                                   |
| `--border`                | `#e4eaf0`                              | Homepage, About, Patients, Careers, Contact, Privacy, Terms; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14                                   | Active                                                   |
| `--coral`                 | `#e05555`                              | Homepage, About, Patients, Careers, Contact, Privacy, Terms, Providers, Communities; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14 | Active                                                   |
| `--coral-hover`           | `#c94444`                              | Homepage, About, Patients, Careers, Contact, Privacy, Terms; Blog, BlogArt, BlogCat, BlogSub; CTAForms                                            | Active                                                   |
| `--coral-light`           | `#fce8e8`                              | Homepage, About, Patients, Careers, Contact, Privacy; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14                                          | Active                                                   |
| `--sage`                  | `#9caf88`                              | Homepage, About, Patients, Careers, Contact, Privacy; CTAForms, byt_v14                                                                           | Active                                                   |
| `--sage-hover`            | `#7a9468`                              | Homepage, About, Patients, Careers, Contact, Privacy; Blog, BlogArt, BlogCat, BlogSub                                                             | Active                                                   |
| `--sage-light`            | `#e8efe3`                              | Blog, BlogArt; CTAForms, byt_v14                                                                                                                  | Active                                                   |
| `--color-spec-blue`       | `#2491eb`                              | —                                                                                                                                                 | Orphaned — base styles only (`.btn-spec-blue`)           |
| `--color-spec-blue-hover` | `#1a7bcc`                              | —                                                                                                                                                 | Orphaned — base styles only (`.btn-spec-blue:hover`)     |
| `--color-teal`            | `#4fb7a6`                              | —                                                                                                                                                 | Orphaned — unused (used in `QuoteCards.astro` only)      |
| `--color-prose-text`      | `#2d3a4f`                              | —                                                                                                                                                 | Orphaned — unused (used in `ArticleBody.astro` only)     |
| `--font-body`             | `'Montserrat', system-ui, sans-serif`  | — (pages use font-family literal, not var())                                                                                                      | Orphaned — base styles only (`body`, `.eyebrow`, `.btn`) |
| `--font-heading`          | `'Manrope', system-ui, sans-serif`     | —                                                                                                                                                 | Orphaned — base styles only (`h1–h5`)                    |
| `--font-mono`             | `'JetBrains Mono', 'Menlo', monospace` | —                                                                                                                                                 | Orphaned — unused (used in blog Astro components only)   |
| `--font-size-base`        | `15px`                                 | —                                                                                                                                                 | Orphaned — base styles only (`body`)                     |
| `--line-height-base`      | `1.55`                                 | —                                                                                                                                                 | Orphaned — base styles only (`body`)                     |
| `--line-height-heading`   | `1.1`                                  | —                                                                                                                                                 | Orphaned — base styles only (`h1–h5`)                    |
| `--r-btn`                 | `6px`                                  | Homepage, About, Patients, Careers, Contact, Privacy, Terms, Providers, Communities; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14 | Active                                                   |
| `--r-card`                | `12px`                                 | Homepage, About, Patients, Careers, Contact, Privacy, Providers, Communities; Blog, BlogArt, BlogCat, BlogSub; CTAForms                 | Active                                                   |
| `--r-pill`                | `999px`                                | Homepage, About, Patients, Careers, Contact, Privacy, Providers, Communities; Blog, BlogArt, BlogCat, BlogSub; CTAForms                 | Active                                                   |
| `--shadow-sm`             | `0 1px 2px rgba(16,67,120,0.04)`       | Homepage, About, Patients, Careers, Contact, Privacy, Terms, Providers, Communities; Blog, BlogArt, BlogCat, BlogSub; CTAForms          | Active                                                   |
| `--shadow-md`             | `0 4px 12px rgba(16,67,120,0.08)`      | Homepage, About, Patients, Careers, Contact, Privacy, Providers, Communities; Blog, BlogArt, BlogCat, BlogSub                           | Active                                                   |
| `--shadow-lg`             | `0 8px 24px rgba(16,67,120,0.1)`       | Homepage, About, Patients, Careers, Contact, Privacy, Providers, Communities                                                            | Active                                                   |
| `--t-hover`               | `150ms ease`                           | Homepage, About, Patients, Careers, Contact, Privacy, Terms, Providers, Communities; Blog, BlogArt, BlogCat, BlogSub; CTAForms          | Active                                                   |
| `--max-w`                 | `1200px`                               | Homepage, About, Patients, Careers, Contact, Privacy, Terms; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14                                   | Active                                                   |
| `--pad-x`                 | `64px` (responsive: 32px → 20px)       | Homepage, About, Patients, Careers, Contact, Privacy, Terms; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14                                   | Active                                                   |
| `--pad-s`                 | `80px` (responsive: 64px → 56px)       | Homepage, About, Patients, Careers, Contact, Privacy; Blog, BlogArt, BlogCat, BlogSub; CTAForms, byt_v14                                          | Active                                                   |

---

## Eliminated Tokens — System B (--byt-\*)

These tokens appeared in `design-source/pages/Providers.html` and `design-source/pages/Communities.html` only. They are **not** defined in `global.css`. Eliminated by DEC-002: Providers.html and Communities.html were converted to System A tokens before rebuild.

| Token               | System A Equivalent | Pages                  | Status                 |
| ------------------- | ------------------- | ---------------------- | ---------------------- |
| `--byt-navy`        | `--navy`            | Providers, Communities | Eliminated per DEC-002 |
| `--byt-navy-deep`   | `--navy-deep`       | Providers, Communities | Eliminated per DEC-002 |
| `--byt-navy-footer` | `--navy-footer`     | Providers, Communities | Eliminated per DEC-002 |
| `--byt-coral`       | `--coral`           | Providers, Communities | Eliminated per DEC-002 |
| `--byt-coral-hover` | `--coral-hover`     | Providers, Communities | Eliminated per DEC-002 |
| `--byt-coral-light` | `--coral-light`     | Providers, Communities | Eliminated per DEC-002 |
| `--byt-slate`       | `--slate`           | Providers, Communities | Eliminated per DEC-002 |
| `--byt-mist`        | `--mist`            | Providers, Communities | Eliminated per DEC-002 |
| `--byt-border`      | `--border`          | Providers, Communities | Eliminated per DEC-002 |
| `--byt-off-white`   | `--off-white`       | Providers, Communities | Eliminated per DEC-002 |
| `--byt-cream`       | `--cream`           | Providers, Communities | Eliminated per DEC-002 |
| `--byt-sage`        | `--sage`            | Providers, Communities | Eliminated per DEC-002 |
| `--byt-sage-light`  | `--sage-light`      | Providers, Communities | Eliminated per DEC-002 |

---

## Summary

| Category                    | Count                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Active tokens               | 22                                                                                                                                                     |
| Orphaned — base styles only | 7 (`--color-spec-blue`, `--color-spec-blue-hover`, `--font-body`, `--font-heading`, `--font-size-base`, `--line-height-base`, `--line-height-heading`) |
| Orphaned — unused           | 4 (`--navy-footer`, `--color-teal`, `--color-prose-text`, `--font-mono`)                                                                               |
| Eliminated (--byt-\*)       | 13                                                                                                                                                     |
| **Total System A tokens**   | **33**                                                                                                                                                 |

### Notes

- `--navy-footer` is defined in nearly every page's own `:root` block (as a declaration) but never consumed via `var(--navy-footer)` anywhere — the footer uses `var(--navy-deep)` instead.
- `--color-spec-blue` and `--color-spec-blue-hover` are not used in design-source pages but ARE needed for `.btn-spec-blue` in `global.css` (the spec-blue button variant used in Providers). After DEC-002 rebuild, Providers.astro should consume these via the `.btn-spec-blue` class.
- `--color-teal`, `--color-prose-text`, `--font-mono` are used only in Astro blog/article components (not in page `<style>` blocks from design-source). They are forward-looking tokens for blog Phase 6 content.
- Typography tokens (`--font-body`, `--font-heading`, etc.) are not consumed as `var()` in design-source pages because those pages set `font-family` with literal values. These tokens exist to serve the global body/heading reset rules.
