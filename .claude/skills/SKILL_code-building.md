# SKILL: Code Building

Domain knowledge for the builder agent. Coding standards, patterns, and constraints.

---

## Page Build Method — Raw HTML Injection (MANDATORY)

This is the ONLY approved method for building page .astro files. The component decomposition approach was attempted and failed catastrophically — see docs/BYT_Process_Learnings_v4_AstroSanity.docx.

### The Method
1. Open `design-source/pages/[Page].html`
2. Copy everything between `<body>` and `</body>`
3. Paste into the corresponding `.astro` page inside Layout component
4. Keep all `<style>` blocks verbatim — do not move, merge, rename, or extract
5. Keep all `<script>` tags with `is:inline` — copy verbatim, do not rewrite
6. Replace hardcoded text/image values with Sanity variables using `??` fallback pattern

### Sanity Variable Pattern
```html
<!-- Text nodes -->
<h2>{page.heading ?? "Original Text From Source"}</h2>
<p>{page.bodyText ?? "Original paragraph from the HTML file"}</p>

<!-- Image sources -->
<img src={page.heroImage ?? "/images/original.jpg"} alt="description" />

<!-- Indexed arrays (for cards, tabs, tracks) -->
<h3>{cards?.[0]?.heading ?? "Original Card 1 Heading"}</h3>
<h3>{cards?.[1]?.heading ?? "Original Card 2 Heading"}</h3>
```

### DO NOT — EVER
- Use `.map()` loops to replace HTML structure with Sanity arrays — this was the #1 failure (OBS-012)
- Rename CSS classes from the source HTML
- Move styles from inline/page `<style>` to global.css
- Restructure DOM (change elements, swap columns, alter grids)
- Omit `<script>` tags or remove `is:inline`
- Extract sections into Astro components
- Change CSS values (colors, spacing, fonts, sizes)
- Rewrite scripts instead of copying them verbatim

### Pre-Commit Checklist (Page .astro files)
Before committing any page .astro file:
- [ ] Section count matches design-source
- [ ] No `.map()` loops in the file
- [ ] All Sanity variables have `??` fallbacks
- [ ] All `<script>` tags have `is:inline`
- [ ] Class names match design-source
- [ ] global.css audited for specificity conflicts
- [ ] `scripts/design-parity-check.sh` passes

### When Debugging
Copy the HTML file to `public/`, deploy as static, verify it renders. If it does, every deviation in the .astro version is something you introduced. Diff to find your bug.

---

## Blocker Detection — STOP and log OBS if any occur

These are architectural decisions. The builder does NOT resolve them.

- Dependency version conflict (peer dep mismatch, version not supporting Astro 6)
- Need to add a dependency not in the task brief
- Need to add or change an adapter (e.g., Cloudflare, Node, Vercel)
- Need to create a config file not in the task brief (e.g., sanity.config.ts in a new location)
- An API renamed or removed in installed version (e.g., defineCli → defineCliConfig)
- Build fails for a reason outside task scope
- Output mode change needed (static → hybrid → server)

Create `OBS-XXX-<short-name>.md`, stop, report to AGENT_pm.

---

## TypeScript Standards

- `tsconfig.json` extends `astro/tsconfigs/strictest`
- `noImplicitAny: true`, `strictNullChecks: true`, `noUnusedLocals: true`
- No `any` — use `unknown` + type guards
- Path aliases: `@components/*`, `@layouts/*`, `@lib/*`, `@styles/*`
- No `require()` — ES modules only (`import`/`export`)
- Destructure imports when possible

## Import Order (ESLint-enforced)

1. Built-in Node modules
2. External packages (`astro`, `react`, `@sanity/*`)
3. Sanity virtual module (`sanity:client`)
4. Internal absolute (`@components/*`, `@lib/*`)
5. Relative (`./`, `../`)
6. Type-only imports last (`import type`)

## Astro Components

- One component per file, PascalCase filename
- Props typed via `interface Props`
- No fetching outside frontmatter unless via `lib/` helper
- No inline styles unless dynamically computed
- No unscoped `<style is:global>` unless intentional

## Sanity Schemas

- One document/object/singleton per file, camelCase filename
- `title` and `description` always populated
- Validation rules on every required field
- Field ordering matches editor priority (most-edited first)
- Preview configuration required on every schema

## GROQ Queries

- All queries in `apps/web/src/lib/queries.ts` — single registry
- Named exports only
- JSDoc comment on every query
- No GROQ strings inline in component frontmatter

## File Naming

| Type | Convention | Example |
|---|---|---|
| Astro components | PascalCase, `.astro` | `BlogCard.astro` |
| Astro pages | kebab-case, `.astro` | `about.astro` |
| TypeScript modules | kebab-case, `.ts` | `sanity-image.ts` |
| TypeScript types | PascalCase, `.types.ts` | `Post.types.ts` |
| Sanity schemas | camelCase, `.ts` | `siteSettings.ts` |
| CSS files | kebab-case, `.css` | `global.css` |
| Scripts | kebab-case, `.sh` or `.ts` | `backup-sanity.sh` |

Forbidden: spaces, uppercase extensions, version suffixes, leading underscores, paths > 100 chars.
Folders: always kebab-case, lowercase, plural for collections.

## No-Hardcoding Directive

Code references design-source files, Sanity fields, or named tokens. It never inlines design values.
