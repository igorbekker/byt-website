# HOOK_01: CMS Parity Check

**Trigger:** After every deploy, or on demand
**Purpose:** Ensure every visible element on the site has a Sanity field (or is documented as CMS-SKIP)

**Why this hook exists:** Multiple audits during the CMS parity fix started from the schema and missed hardcoded elements entirely. 211 hardcoded elements were only discovered when the audit started from the rendered site.

## CC Prompt Template

```
TASK: Run CMS parity check on [PAGE].astro

1. Read apps/web/src/pages/[PAGE].astro — top to bottom
2. For every visible text string, image, link label, button label, eyebrow, heading, body paragraph:
   - Is it wired to a Sanity variable (page?.field or data?.[n]?.field)?
   - Is it marked with <!-- CMS-SKIP: [reason] -->?
   - Is it hardcoded with no Sanity variable and no CMS-SKIP comment?

3. Output:
   | Line # | Element | Text/Image | Status |
   Status: CMS / CMS-SKIP / HARDCODED

4. Summary: total elements, CMS count, CMS-SKIP count, HARDCODED count

FAIL CONDITION: Any HARDCODED element that is not CMS-SKIP.
If any HARDCODED elements found, list them as action items.

MANDATORY VERIFICATION:
☐ Page audited: ___
☐ Total visible elements: ___
☐ CMS: ___
☐ CMS-SKIP: ___
☐ HARDCODED (violations): ___
☐ PASS/FAIL: ___
```

## Run Across All Pages

```
Run HOOK_01 on: index, about, communities, patients, providers, careers, contact, privacy, terms
```
