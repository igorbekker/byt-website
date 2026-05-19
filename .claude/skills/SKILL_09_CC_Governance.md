# SKILL: CC Governance & Prompt Engineering
**File:** `SKILL_09_CC_Governance.md`
*Source: CMS parity fix post-mortem (May 2026) — every rule derived from an actual failure.*
*Referenced by: AGENT_08 (Product Manager)*

---

## Purpose

This skill encodes everything learned about working with Claude Code (CC) — how to construct prompts that CC can't deviate from, how to detect when CC has deviated, and how to verify that work was actually done correctly. Every rule in this file exists because CC violated it at least once.

---

## The /pre and /post Protocol

### /pre — Before every commit
Igor types `/pre` in CC. CC runs:
- `git diff --stat` — confirms only expected files changed
- `pnpm --filter web build` — confirms 0 errors
- Reports the diff summary and waits for Igor's approval

### /post — After every commit and deploy
Igor types `/post` in CC. CC runs:
- Commit integrity check (message accurate, files match review)
- Build verification (post-commit build passes)
- Deploy check (Cloudflare auto-deploy triggered, Studio deployed if schema changed)
- todo.md updated
- lessons.md updated (if CC was corrected)

### PM gates between /pre and /post:
- Igor visually checks the deployed page
- If schema changed: Igor hard-refreshes Studio and confirms fields appear with content
- PM confirms CC's verification report has no contradictions

### Rule: /pre is never skipped
CC has skipped /pre at least three times by:
1. Narrating the commit step instead of invoking /pre
2. Executing `git commit` directly from the task brief
3. Treating "simple" changes as exempt

None of these are valid. /pre happens before every commit regardless of size, complexity, or what the task brief says.

---

## The Four-Step Triad (Five for Images)

Every CMS field change must complete ALL steps. If any step is missing, the site may render correctly (fallbacks hide the gap) but the CMS is broken.

```
1. SCHEMA   → Field defined in apps/studio/schemas/[type].ts
2. QUERY    → Field fetched in apps/web/src/lib/queries.ts
3. TEMPLATE → Field wired in apps/web/src/pages/[page].astro with ?? fallback
4. SEED     → Field populated in published Sanity document with real content
5. IMAGE    → (if image field) Asset uploaded with _type: 'imageWithAlt', reference stored
```

### Why each step matters:

| Step missing | What happens | How it looks |
|-------------|-------------|-------------|
| Schema | Field can't be edited in Studio | Studio has no field |
| Query | Sanity has data but template never receives it | Template always uses fallback |
| Template | Data is fetched but never rendered | Same as having no data |
| Seed | Field exists in Studio but is empty | Editor sees blank fields |
| Image (_type wrong) | Asset exists but Studio can't display it | Empty image well in Studio |

---

## Prompt Construction — Mandatory Structure

Every CC prompt follows this exact structure. No section may be omitted.

```
TASK: [One sentence — what we're doing]

PRE-FLIGHT:
1. Read [file] — extract/confirm [specific thing]
2. Read [file] — extract/confirm [specific thing]
3. Report findings before making changes

EXECUTE:
1. [Specific change with exact field names and values]
2. [Specific change]
3. Do NOT change [specific thing to protect]

COMMIT + PUSH:
Commit: "[conventional commit message]"

STUDIO DEPLOY (if schema changed):
- cd /home/personal/projects/byt-website
- git pull origin main
- cd apps/studio
- rm -rf node_modules/.cache dist
- SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy

SEED CONTENT (if new fields):
- Mutate published [document] — set [field] = "[value]"
- PUBLISHED DOCUMENTS ONLY — no "drafts." prefix
- Use patch().set() not setIfMissing()
- Fetch and confirm

UPLOAD IMAGES (if image fields):
- Upload with _type: 'imageWithAlt' (NOT 'image')
- Set alt text
- Wire asset reference in document

MANDATORY VERIFICATION:
☐ [Every action from EXECUTE, as a checkbox]
☐ [CC must provide specific evidence: line numbers, exact values, YES/NO]
☐ [Include: "Total files changed: ___"]
☐ [Include: "Files changed are: ___"]
☐ [If images: "Every image _type matches schema field type: YES/NO"]
☐ [If Studio deploy: "Deployed from /home/personal/projects/byt-website/apps/studio: YES/NO"]
☐ [If Studio deploy: "git pull completed before deploy: YES/NO"]
☐ [If seeding: "All mutations targeted published documents: YES/NO"]

PROOF-OF-WORK (for all changes):
☐ [grep -n output for each changed item — raw output, no summary]
☐ [git diff --stat showing actual changes]
```

### Prompt construction rules:

1. **Never guess file paths** — read from project knowledge or have CC find them
2. **Never assume schema field types** — read from actual schema file
3. **Every image must specify `_type: 'imageWithAlt'`** — CC defaults to 'image'
4. **Every Sanity mutation must specify "published documents only"** — CC defaults to drafts
5. **Every Studio deploy must include `git pull origin main` first** — stale clones deployed 4 times
6. **Verification must include file count and file names** — prevents unnoticed changes
7. **Verification must ask for specific values, not just YES/NO** — "fallback value at line ___: '___'" not "fallback exists: YES/NO"
8. **Batch fixes (3+ items) require per-item grep proof** — grep output for each individual item, not a summary. Include `git diff --stat` showing actual file changes. If lines changed = 0 and items claimed > 0, the report is fabricated. Run HOOK_08 after commit.

---

## CC Deviation Patterns — Detection & Response

Eight documented patterns from the CMS parity fix. Each includes how to detect it and what to do.

### Pattern 1: Claims "no changes" while describing changes

**Example:** CC's verification said "No HTML structure changed: YES" then added "h1 repositioned above conditional, hardcoded duplicate removed."

**Detection:** Read the entire verification report looking for contradictions between YES/NO checkboxes and explanatory text.

**Response:** Stop the commit. Paste back to CC: "You reported X but also said Y. That is a contradiction. Show me the before/after."

---

### Pattern 2: Labels bugs as "pre-existing" without evidence

**Example:** CC said the middleware crash was "pre-existing" when it was introduced during our work window.

**Detection:** When CC claims something is pre-existing, demand git evidence: which commit introduced it, was it before or after our work started?

**Response:** "Prove it. git checkout the pre-fix tag, build, and show me the error exists there."

---

### Pattern 3: Deploys Studio from wrong directory

**Example:** Happened 4 times. CC deployed from stale clones that were 37 commits behind.

**Detection:** After Studio deploy, check if new fields appear. If not, check which directory was used.

**Response:** Force the canonical path in every prompt:
```
cd /home/personal/projects/byt-website
git pull origin main
cd apps/studio
rm -rf node_modules/.cache dist
```

---

### Pattern 4: Uploads images with wrong _type

**Example:** All 23 images uploaded with `_type: 'image'` instead of `_type: 'imageWithAlt'`.

**Detection:** After upload, check Studio — empty image wells mean wrong type. Or fetch raw JSON and check _type field.

**Response:** Add explicit _type instruction in every image prompt. Add to verification: "Every image _type matches schema field type: YES/NO"

---

### Pattern 5: Fills verification checkboxes without reading

**Example:** CC marks checkboxes with plausible answers that don't match the actual code.

**Detection:** Ask CC to "show the raw file content at line X" for any suspicious checkbox answer.

**Response:** Write verification questions that require specific values CC can only know by reading the file: "fallback value at line ___: '___'" not "fallback exists: YES/NO"

---

### Pattern 6: Seeds content into draft documents

**Example:** Near-miss — caught by explicit "no drafts prefix" instruction in prompts.

**Detection:** Check Studio — documents with draft badge, or fields that appear only in the Studio draft panel, not the published view.

**Response:** Every seeding prompt must say: "Published documents only — use the document ID WITHOUT 'drafts.' prefix"

---

### Pattern 7: Skips /pre and commits directly

**Example:** CC executed `git commit` from the task brief's commit instructions without waiting for /pre.

**Detection:** CC outputs "committed and pushed" without Igor typing /pre first.

**Response:** Revert. Add to every prompt: "Do NOT commit until Igor runs /pre."

---

### Pattern 8: Phantom execution — fabricates entire verification reports

**Example:** CC reported 15 HARDCODED fixes as complete with specific status markers ("✅ marked CMS-SKIP", "✅ wired"). A re-audit using grep showed zero changes were made to any of the 7 files. The verification report was entirely fabricated.

**How it differs from Pattern 5:** Pattern 5 is lazy verification — CC answers checkboxes without reading. Pattern 8 is fabricated execution — CC never ran the changes at all but reported them as done with convincing detail including file references and status markers.

**Detection:** After any commit claiming to fix multiple items:
1. Run `git diff HEAD~1 --stat` — if 0 files changed but items were claimed fixed, the report is fabricated
2. Run grep for each claimed fix — if grep shows original untouched code, the fix was never applied
3. Compare "items claimed" vs "lines actually changed" — mismatch = fabrication

**Response:**
- Reject the commit
- Write a diagnostic prompt that forces CC to grep for each claimed fix and show raw output
- Re-issue the original fixes with per-item proof-of-work requirements
- Run HOOK_08 (Post-Fix Re-Audit) after the re-fix commit
- Log to lessons.md

**Prevention:** Every prompt that asks CC to fix 3+ items must include:
- Per-item grep output requirement (not summary)
- `git diff --stat` in the verification section
- "Lines changed in git diff: ___ vs items claimed fixed: ___"

---

## Audit Protocol — Site-First, Not Schema-First

### The wrong way (schema-first):
"For each Sanity field, is it populated?" → Misses everything that has no schema field.

### The right way (site-first):
"For every visible element on the rendered page, does a Sanity field exist?" → Catches everything.

### The audit question hierarchy:
```
1. Is it visible on the site? → If yes, continue
2. Does a Sanity variable exist for it in the template? → If yes: CMS status
3. If no variable: Is it marked CMS-SKIP? → If yes: documented exception
4. If neither: HARDCODED — needs a schema field or CMS-SKIP documentation
```

### Elements to audit (miss nothing):
- Headings (h1, h2, h3, h4)
- Body paragraphs
- Eyebrows / taglines / labels
- Images (src AND alt)
- Button labels
- Link labels and hrefs
- Card text (heading, body, tag)
- Step text (number, heading, body)
- Tab trigger labels
- Dropdown options
- Form field labels and placeholders (usually CMS-SKIP)
- Badge/trust signal text (usually CMS-SKIP)
- SVG embedded text (usually CMS-SKIP)

---

## Verification Section — Agents Must Quote This

```
SKILL_09 VERIFICATION:
V1: "Four-step triad: schema → query → template → seed"
V2: "Image _type must be 'imageWithAlt' — never 'image'"
V3: "Studio deploys from /home/personal/projects/byt-website only"
V4: "/pre before every commit — no exceptions"
V5: "Audit starts from the rendered site — never from the schema"
V6: "Batch fixes require per-item grep proof — Pattern #8 defense"
```
