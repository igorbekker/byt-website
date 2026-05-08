# Design-Source Inventory

All files in `design-source/pages/`. This directory is **read-only** — never modify unless explicitly authorized by Igor (see DEC-002 for the one authorized exception).

---

## Page Files — Built

| Design-Source File                | Astro Page             | CSS System | Build Status    |
| --------------------------------- | ---------------------- | ---------- | --------------- |
| `pages/Homepage.html`             | `pages/index.astro`    | System A   | Built, deployed |
| `pages/About.html`                | `pages/about.astro`    | System A   | Built, deployed |
| `pages/Patients.html`             | `pages/patients.astro` | System A   | Built, deployed |
| `pages/Careers.html`              | `pages/careers.astro`  | System A   | Built, deployed |
| `pages/Contact.html`              | `pages/contact.astro`  | System A   | Built, deployed |
| `pages/Privacy Policy.html`       | `pages/privacy.astro`  | System A   | Built, deployed |
| `pages/Terms and Conditions.html` | `pages/terms.astro`    | System A   | Built, deployed |

---

## Page Files — Pending Rebuild (DEC-002)

Per DEC-002, Providers and Communities use System B (`--byt-*` tokens). Required actions before rebuild:

1. Convert design-source file to System A tokens (authorized one-time edit)
2. Rebuild the `.astro` page from the converted design-source

| Design-Source File       | Astro Page                | CSS System                        | Status                              |
| ------------------------ | ------------------------- | --------------------------------- | ----------------------------------- |
| `pages/Providers.html`   | `pages/providers.astro`   | System B — **pending conversion** | Built on System B; rebuild required |
| `pages/Communities.html` | `pages/communities.astro` | System B — **pending conversion** | Built on System B; rebuild required |

---

## Blog Files — Phase 6

Not yet built. Scheduled for Phase 6.

| Design-Source File            | Astro Page                          | Status  |
| ----------------------------- | ----------------------------------- | ------- |
| `pages/Blog.html`             | `pages/blog/index.astro`            | Phase 6 |
| `pages/Blog Article.html`     | `pages/blog/[slug].astro`           | Phase 6 |
| `pages/Blog Category.html`    | `pages/blog/[category]/index.astro` | Phase 6 |
| `pages/Blog Subcategory.html` | `pages/blog/[category]/[sub].astro` | Phase 6 |

---

## Reference Files — Not Page-Mapped

Supporting files used for design reference and component extraction. No corresponding `.astro` page.

| File                            | Purpose                                           |
| ------------------------------- | ------------------------------------------------- |
| `pages/CTA Forms.html`          | Modal/form component designs (Book, Refer, Apply) |
| `pages/Responsive Views.html`   | Mobile/tablet breakpoint reference                |
| `pages/Layout505.html`          | Condition card layout reference                   |
| `pages/Layout526.html`          | Service track layout reference                    |
| `pages/byt_v14.html`            | Full v14 design snapshot (reference only)         |
| `pages/uploads-*.html`          | Upload/image component designs                    |
| `pages/uploads-community*.html` | Community section upload designs                  |
| `pages/uploads-index*.html`     | Homepage upload designs                           |
| `pages/uploads-patients*.html`  | Patients page upload designs                      |

---

## Other Design-Source Directories

| Directory                 | Contents                                                      |
| ------------------------- | ------------------------------------------------------------- |
| `design-source/assets/`   | Images, SVGs, icons referenced by design-source HTML          |
| `design-source/styles/`   | Base CSS reference (sourced into `global.css` during Phase 2) |
| `design-source/partials/` | Shared HTML partials (nav, footer)                            |
