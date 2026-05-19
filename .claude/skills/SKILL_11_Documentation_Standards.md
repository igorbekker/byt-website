# SKILL: Documentation Standards
**File:** `SKILL_11_Documentation_Standards.md`
*Source: CMS parity fix post-mortem — every document and format defined to prevent specific failures.*
*Referenced by: AGENT_10 (Documentation Manager)*

---

## Purpose

This skill defines what documentation exists, what format each document uses, when each document must be updated, and what happens when documentation falls behind. Every document in this skill was created because its absence caused a specific failure during the CMS parity fix.

---

## Document Registry

| # | Document | File | Owner | Update Trigger |
|---|----------|------|-------|---------------|
| 1 | Schema Registry | docs/sanity-schema-registry.md | Documentation Agent | After any schema or content change |
| 2 | CMS Parity Audit Log | docs/cms-parity-audit.md | Documentation Agent | After any template change |
| 3 | Deployment Checklist | docs/deployment-checklist.md | Documentation Agent | After any pipeline change |
| 4 | CC Governance Rules | CLAUDE.md | Documentation Agent | After any new CC failure pattern |
| 5 | Lessons | tasks/lessons.md | Documentation Agent | After any CC correction by Igor |
| 6 | Task Tracker | tasks/todo.md | Product Manager | After every task |
| 7 | Task Archive | tasks/todo-archive.md | Documentation Agent | When PM approves archiving |
| 8 | Verification Hooks | docs/hooks/ | Documentation Agent | After new failure patterns |

---

## Schema Registry Format

One table per Sanity type. Every field listed with triad completion status.

```markdown
## communitiesPage

| Field | Type | Schema | GROQ | Template | Seeded | Image | CMS-SKIP | Notes |
|-------|------|--------|------|----------|--------|-------|----------|-------|
| heroHeading | string | ✅ L13 | ✅ | ✅ L1650 | ✅ "Every resident..." | — | | |
| heroImage | imageWithAlt | ✅ L15 | ✅ | ✅ L1655 | ✅ | ✅ _type verified | | |
```

### Column definitions

| Column | What it means | How to verify |
|--------|--------------|---------------|
| Schema | Field exists in the .ts schema file | Read the file, cite line number |
| GROQ | Field is fetched in queries.ts | Read the query, confirm field name present |
| Template | Field is wired with ?? fallback in .astro | Read the template, cite line number |
| Seeded | Published Sanity document has real content | Fetch document, confirm non-null value |
| Image | For imageWithAlt fields: asset uploaded, _type is 'imageWithAlt' | Fetch document, check _type |
| CMS-SKIP | Intentionally excluded with documented reason | Check for <!-- CMS-SKIP --> comment |

### Update rules
- After any schema change: add the new field row, mark Schema ✅ with line number
- After any GROQ change: mark GROQ ✅
- After any template wiring: mark Template ✅ with line number
- After any seed: mark Seeded ✅ with the first few words of content
- After any image upload: mark Image ✅ and add "_type verified"
- Never mark ✅ without verifying — read the actual file/document
- If a field is empty: leave the cell blank, not ✅

---

## CMS Parity Audit Log Format

One table per page. Every visible element listed. Site-first methodology.

```markdown
## communities.astro
Last audited: 2026-05-18
Total elements: 93 | CMS: 77 | CMS-SKIP: 10 | HARDCODED: 0

| Line # | Element | Text/Image | Status | Sanity Variable | Notes |
|--------|---------|------------|--------|----------------|-------|
| 1650 | h1 | "Every resident deserves..." | CMS | page?.heroHeading | |
| 1713 | Step label | "Step" | CMS-SKIP | — | UI label |
```

### Status definitions
| Status | Meaning |
|--------|---------|
| CMS | Wired to Sanity variable with ?? fallback |
| CMS-SKIP | Intentionally excluded — has <!-- CMS-SKIP: reason --> comment in code |
| HARDCODED | No Sanity variable, no CMS-SKIP comment — THIS IS A VIOLATION |

### Audit methodology — SITE-FIRST
1. Start from the rendered page, not the schema
2. Go section by section, top to bottom
3. For every visible element, check for Sanity variable or CMS-SKIP
4. A page passes audit when HARDCODED count is 0

---

## Deployment Checklist

```markdown
## Website deploy
☐ git push origin main
☐ Wait ~2 minutes for Cloudflare build
☐ Check byt-website.pages.dev/[page]/ — page loads correctly

## Studio deploy
☐ cd /home/personal/projects/byt-website (CANONICAL CLONE)
☐ git pull origin main
☐ cd apps/studio
☐ rm -rf node_modules/.cache dist
☐ SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy
☐ Igor: hard-refresh Studio (Cmd+Shift+R)
☐ Verify: new fields appear
☐ Verify: custom tools still present

## Content seeding
☐ Published documents only (no "drafts." prefix)
☐ patch().set() not setIfMissing()
☐ Images: _type: 'imageWithAlt'
☐ Fetch after mutation — confirm values
☐ Trigger rebuild if needed
```

---

## Post-Change Documentation Protocol

After EVERY prompt completes:

```
DOCUMENTATION CHECK after [task description]:
☐ Schema registry — new/changed fields documented: YES/NO/N/A
☐ CMS parity audit — template changes reflected: YES/NO/N/A
☐ CLAUDE.md — new CC failure pattern added: YES/NO/N/A
☐ Lessons — CC correction recorded: YES/NO/N/A
☐ Todo — task recorded: YES/NO
```

This check runs every time. No exceptions.

---

## Disaster-to-Document Mapping

| Failure | Root cause | Prevented by |
|---------|-----------|-------------|
| Schema fields created, never seeded | No seed step in plan | Schema Registry (Seeded column) |
| Images uploaded with wrong _type | CC default behavior | Schema Registry (Image column) + CLAUDE.md |
| Studio deployed from stale clone | Multiple local clones | Deployment Checklist + CLAUDE.md |
| Audit checked schema, missed site | Wrong audit direction | CMS Parity Audit (site-first) |
| 0 condition documents existed | Collection never checked | Schema Registry (document type count) |
| CC fabricated verification report | No proof-of-work required | HOOK_08 + CLAUDE.md proof-of-work rule |
| CC reported "no changes" + described changes | No contradiction check | Lessons file + PM deviation detection |

---

## Verification Section — Agents Must Quote This

```
SKILL_11 VERIFICATION:
V1: "Schema registry tracks 6 completion columns: Schema, GROQ, Template, Seeded, Image, CMS-SKIP"
V2: "CMS parity audit uses site-first methodology — never schema-first"
V3: "Studio deploy checklist requires git pull + cache clear from canonical clone"
V4: "Post-change documentation check runs after every prompt — no exceptions"
V5: "Every failure maps to a document — see disaster-to-document mapping table"
```
