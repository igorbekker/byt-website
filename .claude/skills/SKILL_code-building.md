# SKILL: Code Building

Domain knowledge for the builder agent. Coding standards, patterns, and constraints.

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

| Type | Forbidden inline | Where it lives |
|---|---|---|
| Colors | `#104378`, `rgb(...)` | CSS variables in `global.css` |
| Font families | `'Manrope', sans-serif` | CSS variables |
| Spacing | `padding: 32px 64px` | Spacing tokens or design-source CSS |
| Phone numbers | `754-999-0011` | Sanity `siteSettings.phone` |
| Email addresses | `info@getbetteryou.com` | Sanity `siteSettings.email` |
| Page copy | Any marketing text | Sanity per-page singleton |
| Hero images | `<img src="..."/>` | Sanity image asset |
| URLs | `https://getbetteryou.com` | `import.meta.env.PUBLIC_SITE_URL` |
| Schema markup | `name: "Better You Therapy"` | Sanity `siteSettings` |
| Form endpoints | `https://formspree.io/f/xxx` | `import.meta.env.PUBLIC_FORMSPREE_*` |

One exception: build-time constants for external service contracts (e.g., `apiVersion: "2026-03-01"`).

## Commenting Standards

### File Header (mandatory on every source file)

```ts
/**
 * <one-sentence purpose>
 *
 * <2–4 sentences: what this file is for, who uses it,
 * what design-source file or decision log entry it implements>
 *
 * Source: design-source/<path> | DEC-XXX | OBS-XXX
 */
```

### Rules

- Explain **WHY**, not HOW or WHAT
- Every workaround references an OBS-XXX
- JSDoc on every exported function, type, component
- TODO format: `// TODO(OBS-007): <description>` — bare TODOs are lint failures
- Banned words: "obviously", "simply", "just", "easy", "should work"

## Conventional Commits

Format: `<type>(<scope>): <description>`
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`
Reference DEC/OBS IDs: `feat(homepage): add audience router (DEC-014)`

## Performance Budget

- Per-page JS shipped: target 0KB (Astro defaults)
- Images: Astro `<Image>` or Sanity image URL builder, always with `width` and `height`
- No `<img>` without `alt`, `width`, `height`
- Fonts: preconnect + display=swap only

## PR Requirements

Every PR must contain:
1. Title in Conventional Commit format
2. Description: what changed, why (DEC/OBS ID), how to test, design-source files referenced, screenshots if visual
3. Passing CI: lint, type-check, build
4. Igor's approval before merge
