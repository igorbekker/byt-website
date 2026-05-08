# RB-002: New Page Build

**Date:** 2026-05-08
**Applies to:** Building any new page `.astro` file from a `design-source/pages/` HTML file

---

## Purpose

End-to-end procedure for building a page using the Raw HTML Injection method defined in `CLAUDE.md`. One page at a time. Do not start the next page until Igor confirms the current one.

---

## Step 1 — Confirm System A Tokens

Open `design-source/pages/<Page>.html` and check the `:root` block in the `<style>` section.

**System A (correct):** tokens are unprefixed — `--navy`, `--coral`, `--font-size-base: 15px`

**System B (must convert first):** tokens have `--byt-*` prefix — `--byt-navy`, `--byt-coral`, `--byt-font-size-base: 16px`

If System B: stop. Convert the design-source file to System A tokens per DEC-002 before continuing.

---

## Step 2 — Copy Body HTML

Copy everything between `<body>` and `</body>` from the design-source HTML verbatim into the `.astro` page inside the Layout component. No structural changes.

---

## Step 3 — Copy and Strip the Style Block

1. Copy the `<style>` block from the design-source HTML verbatim
2. Delete all selectors owned by `global.css` (per `docs/css-architecture.md`):
   - `:root` blocks (CSS custom properties)
   - `body` rules
   - `h1, h2, h3, h4, h5` rules
   - All `.btn*` rules
   - `.max-w`, `.eyebrow`, `.fade-up`, `.fade-up.visible`
   - CSS reset rules (`*`, `html`, `a`, `img`, margin/padding resets)
3. Wrap remaining rules in `<style is:global>` in the `.astro` file

---

## Step 4 — Copy the Script Block

Copy the `<script>` tag verbatim. Change `<script>` to `<script is:inline>`. No other changes.

---

## Step 5 — Wire Sanity Variables

Replace only individual text strings and image `src` values with Sanity variables. Every variable must have a `??` fallback:

```astro
{patientsPage.heroHeading ?? 'Care that meets you where you are'}
```

Do not replace HTML structure with `.map()` loops. Hardcoded cards and grids stay as-is; index into arrays by position if needed:

```astro
{cards?.[0]?.heading ?? 'Original Heading'}
```

---

## Step 6 — Run Design Parity Check

```bash
bash scripts/design-parity-check.sh
```

All 6 checks must pass (or failures must be documented and approved).

---

## Step 7 — Run CSS Conflict Check

Per RB-001: grep the page `<style>` for any global.css-owned selectors. If found, follow RB-001 to resolve.

```bash
grep -n '\.btn\b\|\.btn-\|\.eyebrow\|\.max-w\|\.fade-up\|^body\b\|^h[1-5]\b\|^:root\b' apps/web/src/pages/<page>.astro
```

---

## Step 8 — Build and Visual Verify

```bash
pnpm --filter web build
```

Build must pass. Open the page and confirm visual parity against `design-source/pages/<Page>.html`.

---

## Step 9 — Commit Gate

Per `CLAUDE.md`:

1. Write review section in `tasks/todo.md`
2. Run `/pre`
3. Get Igor confirmation
4. Commit
