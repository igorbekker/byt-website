# docs/hooks

Quality-gate scripts and checklists for the BYT website project.

## Hook Index

| Hook    | File                           | Type      | Purpose                                                     |
| ------- | ------------------------------ | --------- | ----------------------------------------------------------- |
| HOOK_01 | HOOK_01_CMS_Parity.md          | Checklist | CMS field parity between Sanity schema and Astro components |
| HOOK_02 | HOOK_02_Schema_Data.md         | Checklist | Schema data validation                                      |
| HOOK_03 | HOOK_03_SEO.md                 | Checklist | SEO metadata coverage                                       |
| HOOK_04 | HOOK_04_LLM_GEO.md             | Checklist | LLM/GEO metadata                                            |
| HOOK_05 | HOOK_05_Visual.md              | Checklist | Visual QA                                                   |
| HOOK_06 | HOOK_06_Studio_Sync.md         | Checklist | Studio sync verification                                    |
| HOOK_07 | HOOK_07_Image.md               | Checklist | Image optimization                                          |
| HOOK_08 | HOOK_08_Post_Fix.md            | Checklist | Post-fix verification                                       |
| HOOK_09 | HOOK_09_route_schema_parity.sh | Script    | Route-schema parity check                                   |

---

## HOOK_09 — Route-Schema Parity Check

**File:** `HOOK_09_route_schema_parity.sh`

**Purpose:** Verifies that every static `.astro` page in `apps/web/src/pages/` has a corresponding Sanity singleton schema file in `apps/studio/schemas/singletons/`. Catches the case where a new page is added to the Astro app but its Sanity schema is forgotten (or vice versa).

**When to run:** After adding any new static page to `apps/web/src/pages/`, or after adding/removing a singleton schema.

**How to run:**

```bash
bash docs/hooks/HOOK_09_route_schema_parity.sh
```

**What it skips:**

- Dynamic routes (`[slug].astro`, `[category]/`, `[...slug].astro`, etc.)
- Blog routes (`blog/index.astro`, `blog/[slug].astro`, `blog/[category]/`) — these use document types (`blogPost`, `blogCategory`), not singletons

**Expected output format:**

```
==============================
 HOOK_09: Route-Schema Parity
==============================

COVERED (10):
  ✓ about.astro → aboutPage
  ✓ index.astro → homePage
  ...

ORPHAN (0):
  (none)

RESULT: PASS — all static pages have singleton schemas
```

**Exit codes:**

- `0` — All static pages have singleton schemas (PASS)
- `1` — One or more orphan pages found (FAIL)

**Adding a new page:** When you add a new static page, you must also:

1. Create its singleton schema in `apps/studio/schemas/singletons/<pageName>.ts`
2. Register it in the `SINGLETONS` array in `apps/studio/structure/index.ts`
3. Add a mapping entry to the `page_to_singleton()` function in this script
4. Run `HOOK_09` to confirm PASS
