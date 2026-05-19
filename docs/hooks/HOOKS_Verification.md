# BYT Verification Hooks
**File:** `HOOKS_Verification.md`
*Master reference for all verification hooks. Each hook is a CC prompt template.*
*Individual hook files live in the repo at `docs/hooks/HOOK_XX_Name.md`*

---

## Hook Index

| Hook | Name | Trigger | What it catches |
|------|------|---------|----------------|
| HOOK_01 | CMS Parity Check | After every deploy | Rendered site elements without Sanity fields |
| HOOK_02 | Schema-Data Integrity | After schema changes | Empty document types, unseeded fields, wrong _type |
| HOOK_03 | SEO Compliance | After page changes | Missing meta tags, JSON-LD errors, schema.org violations |
| HOOK_04 | LLM/GEO Readability | After content changes | Missing structured data for AI answer engines |
| HOOK_05 | Visual Regression | After template changes | Broken layouts, missing images, broken CTAs |
| HOOK_06 | Studio Sync | After Studio deploy | Stale deploy, missing tools, missing fields |
| HOOK_07 | Image Integrity | After image uploads | Wrong _type, missing alt text, broken CDN URLs |
| HOOK_08 | Post-Fix Re-Audit | After any fix commit (3+ items) | Phantom execution — claimed fixes never applied |

---

## When to Run Each Hook

| Event | Hooks to run |
|-------|-------------|
| After every code deploy | HOOK_05 (visual regression) |
| After schema changes + Studio deploy | HOOK_02 (schema-data) + HOOK_06 (studio sync) |
| After image uploads | HOOK_07 (image integrity) |
| After content seeding | HOOK_02 (schema-data) |
| After template wiring changes | HOOK_01 (CMS parity) + HOOK_05 (visual) |
| After any commit claiming 3+ fixes | HOOK_08 (post-fix re-audit) |
| Before launch / end of sprint | ALL hooks |
| After SEO-related changes | HOOK_03 (SEO) + HOOK_04 (LLM/GEO) |
| After CC reports back (every time) | PM runs deviation detection (built into AGENT_08) |

---

## How the PM Uses Hooks

The Product Manager (AGENT_08) determines which hooks to run based on the event:

1. Identifies the trigger event (deploy, schema change, fix commit, etc.)
2. Looks up the hook(s) in the matrix above
3. Reads the hook file from `docs/hooks/` in the repo
4. Adapts the prompt template for the specific page/change
5. Writes the final CC prompt with the hook's verification checklist included

Hooks are NOT automatic. The PM decides when to invoke them and writes the prompt.

---

## Hook-to-Pattern Mapping

Each hook catches specific CC deviation patterns:

| Hook | Catches Pattern(s) |
|------|-------------------|
| HOOK_01 | Schema-first audit blind spots (site elements without fields) |
| HOOK_02 | Pattern #4 (wrong _type), Pattern #6 (draft documents), unseeded fields |
| HOOK_03 | Missing SEO that no other hook checks |
| HOOK_04 | Missing structured data for AI engines |
| HOOK_05 | Pattern #1 (claimed no changes but made changes), broken CTAs |
| HOOK_06 | Pattern #3 (stale clone deploys) |
| HOOK_07 | Pattern #4 (wrong _type), missing alt text |
| HOOK_08 | Pattern #8 (phantom execution — fabricated verification reports) |

---

## Creating New Hooks

When a new failure pattern is discovered:

1. Create `docs/hooks/HOOK_XX_Name.md` in the repo
2. Add the hook to the index table in this file
3. Add the hook to the "When to Run" matrix
4. Add the hook to CLAUDE.md's verification hooks table
5. Update the hook-to-pattern mapping
