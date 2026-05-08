# RB-001: CSS Conflict Resolution

**Date:** 2026-05-08
**Applies to:** Any page `.astro` file with a `<style is:global>` block

---

## Purpose

Resolve CSS cascade conflicts where a page `<style>` block redefines a selector owned by `global.css`. Per DEC-002, `global.css` is the single owner of all shared selectors; page `<style>` blocks must not contain them.

---

## Step 1 — Identify Conflicts

Grep the page `<style>` block for selectors owned by `global.css`:

```bash
# Check a single page
grep -n '\.btn\b\|\.btn-\|\.eyebrow\|\.max-w\|\.fade-up\|^body\b\|^h[1-5]\b\|^:root\b' apps/web/src/pages/<page>.astro
```

Or run the automated check:

```bash
bash scripts/design-parity-check.sh
```

---

## Step 2 — Remove the Conflicting Selector

If a page `<style>` block contains a selector that `global.css` owns, the page `<style>` should not define it at all.

**Remove the entire rule block** for that selector from the page `<style>`.

Example — `providers.astro` had:

```css
/* Wrong — this must be deleted */
.btn {
  border: 1.5px solid var(--byt-navy);
}
```

Delete it entirely. `global.css`'s `.btn` rule applies.

---

## Step 3 — Handle Section-Specific Overrides

If the page genuinely needs different values for that selector in one section only, use a compound selector scoped to the section container:

```css
/* Correct — scoped override, specificity 0,2,0 beats global.css 0,1,0 */
.ph-hero .btn {
  padding: 10px 20px;
}
```

**Do not** increase specificity globally — only scope to the section that needs it.

---

## Step 4 — Verification

1. Run `pnpm --filter web build` — confirm build passes
2. Open the page in a browser and inspect the affected element
3. In DevTools, confirm the correct rule is applied with no override warnings
4. Confirm the page appearance matches `design-source/pages/<Page>.html`

---

## Step 5 — Escalate

If removing or scoping the selector visually changes the page in a way that diverges from design-source:

1. Stop
2. Log `docs/obstacle-log/OBS-XXX-design-divergence-<page>.md`
3. Report to Igor with the OBS-XXX reference and a description of the visual diff
