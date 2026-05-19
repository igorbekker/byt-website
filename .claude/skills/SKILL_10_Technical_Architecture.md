# SKILL: BYT Technical Architecture
**File:** `SKILL_10_Technical_Architecture.md`
*Source: byt-website repository (github.com/igorbekker/byt-website) + deployment configs + CMS parity fix learnings.*
*Referenced by: AGENT_09 (Architect), AGENT_08 (Product Manager)*

---

## Purpose

This skill is the single source of truth for the BYT website's technical architecture. Every file path, every schema pattern, every deployment pipeline, every code convention, and every known gotcha is documented here. When any agent needs technical context, they read this file — they do not rely on memory.

---

## Stack

| Layer | Technology | Version | Details |
|-------|-----------|---------|---------|
| Framework | Astro | 6 | Static site generation, .astro page files |
| CMS | Sanity | v4 | GROQ queries, Studio at byt-website.sanity.studio |
| Hosting (site) | Cloudflare Pages | — | Auto-deploys from GitHub push to main |
| Hosting (Studio) | Sanity Cloud | — | Manual deploy via `npx sanity deploy` |
| Repo | GitHub monorepo | — | github.com/igorbekker/byt-website |
| Package manager | pnpm | — | Workspaces: apps/web, apps/studio |
| Project ID | bpjtbps6 | — | Sanity project identifier |
| Dataset | production | — | Single dataset |
| Cloudflare account | e5bc55bdcb6c538072ab31d0615e2c6b | — | |

---

## Repository Map

```
byt-website/
├── apps/
│   ├── web/                          # Astro frontend
│   │   ├── src/
│   │   │   ├── pages/                # Route files — ONE .astro file per page
│   │   │   │   ├── index.astro       # Homepage
│   │   │   │   ├── about.astro
│   │   │   │   ├── communities.astro
│   │   │   │   ├── patients.astro
│   │   │   │   ├── providers.astro
│   │   │   │   ├── careers.astro
│   │   │   │   ├── contact.astro
│   │   │   │   ├── privacy.astro
│   │   │   │   ├── terms.astro
│   │   │   │   └── blog/
│   │   │   │       ├── index.astro
│   │   │   │       ├── [slug].astro
│   │   │   │       └── [category]/
│   │   │   │           ├── index.astro
│   │   │   │           └── [sub]/
│   │   │   │               └── index.astro
│   │   │   ├── components/
│   │   │   │   └── ui/
│   │   │   │       └── ModalForms.astro  # Both book + refer modals
│   │   │   ├── layouts/
│   │   │   │   └── BaseLayout.astro      # Global layout, nav, footer, modal loader
│   │   │   └── lib/
│   │   │       ├── queries.ts            # ALL GROQ queries — single file
│   │   │       └── sanity.ts             # Sanity client config
│   │   ├── public/
│   │   │   └── images/                   # Static images (fallback sources)
│   │   └── astro.config.mjs
│   └── studio/                           # Sanity Studio
│       ├── schemas/
│       │   ├── singletons/               # One per page
│       │   │   ├── homePage.ts
│       │   │   ├── aboutPage.ts
│       │   │   ├── communitiesPage.ts
│       │   │   ├── patientsPage.ts
│       │   │   ├── providersPage.ts
│       │   │   ├── careersPage.ts
│       │   │   ├── contactPage.ts
│       │   │   ├── privacyPage.ts
│       │   │   ├── termsPage.ts
│       │   │   ├── blogIndexPage.ts
│       │   │   ├── formSettings.ts
│       │   │   └── siteSettings.ts
│       │   ├── documents/                # Multiple documents per type
│       │   │   ├── condition.ts
│       │   │   ├── testimonial.ts
│       │   │   ├── blogPost.ts
│       │   │   ├── blogCategory.ts
│       │   │   ├── author.ts
│       │   │   ├── jobPosting.ts
│       │   │   ├── formOption.ts
│       │   │   └── redirect.ts
│       │   ├── objects/                  # Shared schema objects
│       │   │   ├── imageWithAlt.ts       # ALWAYS use this for images
│       │   │   ├── audienceCard.ts
│       │   │   ├── ctaLink.ts
│       │   │   ├── pageSection.ts
│       │   │   ├── processStep.ts
│       │   │   ├── seoFields.ts
│       │   │   └── serviceTrack.ts
│       │   └── index.ts                  # Schema registry — all types registered here
│       ├── structure/
│       │   └── index.ts                  # Studio sidebar structure
│       ├── tools/
│       │   ├── DocxImportTool.tsx         # Job description markdown importer
│       │   └── RedirectManager.tsx        # 301 redirect management tool
│       └── sanity.config.ts              # Studio config + tool registration
├── scripts/                              # Utility scripts
│   ├── backup-git.sh
│   ├── backup-sanity.sh
│   ├── design-parity-check.sh
│   ├── import-jds.py
│   ├── seed-conditions-testimonials.mjs
│   ├── seed-form-options.mjs
│   ├── seed-homepage-conditions.mjs
│   ├── strip-shared-selectors.py
│   └── upload-homepage-condition-images.mjs
├── tasks/
│   ├── todo.md
│   ├── todo-archive.md
│   └── lessons.md
├── docs/
│   ├── hooks/                            # Verification hook templates (HOOK_01–HOOK_08)
│   ├── decision-log/
│   ├── obstacle-log/
│   ├── runbooks/
│   ├── sanity-schema-registry.md
│   ├── css-architecture.md
│   ├── token-registry.md
│   ├── deploy-runbook.md
│   ├── env-registry.md
│   └── design-source-inventory.md
└── CLAUDE.md                             # CC governance rules
```

---

## Sanity Schema Patterns

### Singleton pattern (one document = one page)
```typescript
export default defineType({
  name: 'communitiesPage',
  title: 'Communities',
  type: 'document',
  fields: [
    defineField({ name: 'heroHeading', title: 'Hero Heading', type: 'string' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'imageWithAlt' }),
  ],
});
```

Document ID = type name (e.g., `_id: "communitiesPage"`). No `drafts.` prefix for published.

### imageWithAlt — CRITICAL
```typescript
defineType({
  name: 'imageWithAlt',
  type: 'image',
  options: { hotspot: true },
  fields: [{ name: 'alt', type: 'string' }],
})
```

**Rule:** Every image field in every schema uses `type: 'imageWithAlt'`. Never use raw `type: 'image'`.

**Mutation format:**
```javascript
{
  _type: 'imageWithAlt',  // NOT 'image'
  alt: 'descriptive text',
  asset: { _type: 'reference', _ref: 'image-[hash]-[WxH]-[ext]' }
}
```

**Failure mode:** If stored with `_type: 'image'`, Studio shows empty image wells.

---

## Query Architecture

All GROQ queries in `apps/web/src/lib/queries.ts`. Naming convention: `[SCOPE]_[PAGE]_QUERY`.

**Import pattern in .astro files:**
```astro
---
import { sanityClient } from '../lib/sanity';
import { COMMUNITIES_PAGE_QUERY, CONDITIONS_COMMUNITIES_QUERY } from '../lib/queries';

const page = await sanityClient.fetch(COMMUNITIES_PAGE_QUERY);
const conditionsData = await sanityClient.fetch(CONDITIONS_COMMUNITIES_QUERY);
---
```

---

## Template Wiring Patterns

### Text with fallback
```astro
{page?.heroHeading ?? 'Fallback heading text'}
```

### Image with fallback
```astro
<img
  src={page?.heroImage?.asset?.url ?? '/images/fallback.jpg'}
  alt={page?.heroImage?.alt ?? 'Fallback alt text'}
/>
```

### Array by index
```astro
{page?.processSteps?.[0]?.heading ?? 'Step 1 fallback heading'}
```

### Modal CTA buttons — NOT links
```astro
<button class="btn btn-primary" onclick="openModal('refer')">
  {page?.heroCta?.label ?? 'Refer a Resident'}
</button>
```

---

## Deployment Pipelines

### Pipeline 1: Website (automatic)
**Trigger:** `git push origin main`
**Build:** Cloudflare Pages runs `pnpm --filter web build`
**Result:** Site live at byt-website.pages.dev within ~2 minutes

### Pipeline 2: Sanity Studio (manual)
**Trigger:** Schema changes in apps/studio/schemas/
**Steps:**
```bash
cd /home/personal/projects/byt-website    # CANONICAL CLONE ONLY
git pull origin main                       # Must pull first
cd apps/studio
rm -rf node_modules/.cache dist            # Clear cache
SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy
```
**Post-deploy:** Igor hard-refreshes Studio (Cmd+Shift+R)

### Pipeline 3: Content rebuild trigger
**Trigger:** Sanity content changes (mutations)
```bash
git commit --allow-empty -m "chore: trigger rebuild" && git push origin main
```

### Known stale clones — NEVER use:
| Directory | Status |
|-----------|--------|
| `/home/personal/projects/byt-website/` | CANONICAL — always use |
| `/home/personal/projects/byt-website-work/` | STALE — never deploy from |
| `/home/personal/projects/byt-website-edit/` | STALE — never deploy from |

---

## Code Standards

### Astro pages
- Raw HTML in .astro files — NO component decomposition
- Full file rewrites only — string patching causes duplicate sections
- Never rename CSS classes from the design source
- Never restructure DOM from the design source

### Sanity schemas
- All image fields: `type: 'imageWithAlt'`
- Array items need `_key`
- Published doc IDs: singleton name (e.g., `"communitiesPage"`)
- Draft doc IDs: `"drafts.communitiesPage"` — avoid for seeding

### CSS
- `global.css` — read-only during page work
- Page styles in `<style>` blocks within .astro files

### Git
- Conventional commits: `fix(page):`, `feat(schema):`, `docs:`
- One commit per logical change
- /pre before every commit

---

## Verification Section — Agents Must Quote This

```
SKILL_10 VERIFICATION:
V1: "Repo: github.com/igorbekker/byt-website — pnpm monorepo, Astro 6 + Sanity v4"
V2: "All GROQ queries in apps/web/src/lib/queries.ts — single file"
V3: "imageWithAlt type in schemas/objects/imageWithAlt.ts — all image fields use this"
V4: "Canonical clone: /home/personal/projects/byt-website — all deploys from here"
V5: "Component decomposition is banned — raw HTML in .astro files only"
```
