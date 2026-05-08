# CSS Architecture

See **DEC-002** for the decision that established this contract.

---

## Single CSS System

`global.css` is the single owner of all shared selectors. Page `<style>` blocks contain only page-specific selectors. No selector that exists in `global.css` may appear in a page `<style>` block.

---

## What `global.css` Owns

**Reset** (`apps/web/src/styles/global.css` lines 9–41):

- `*`, `*::before`, `*::after` — box-sizing
- `html` — text-size-adjust, scroll-behavior
- `body, h1, h2, h3, h4, h5, p, ul, ol, figure, blockquote` — margin/padding reset
- `img, video` — display: block, max-width: 100%
- `a` — color: inherit, text-decoration: none

**Tokens** (lines 43–105):

- `:root` — 35 CSS custom properties (colors, typography, border-radius, shadows, motion, layout)
- `@media (max-width: 1024px)` `:root` — spacing overrides
- `@media (max-width: 768px)` `:root` — spacing overrides

**Base element styles** (lines 107–134):

- `body` — font-family, color, background, line-height, font-size, font-smoothing
- `h1, h2, h3, h4, h5` — font-family, weight, line-height, letter-spacing, color, text-wrap
- `p` — text-wrap: pretty

**Utility classes** (lines 136–163):

- `.max-w` — max-width container with inline padding
- `.eyebrow` — uppercase label style
- `.fade-up` — scroll animation initial state
- `.fade-up.visible` — scroll animation revealed state

**Buttons — Canonical** (lines 165–255):

- `.btn` — base button (inline-flex, padding 14px 24px, border 1.5px solid transparent)
- `.btn-coral` / `:hover`
- `.btn-ink` / `:hover`
- `.btn-outline-white` / `:hover`
- `.btn-outline-ink` / `:hover`
- `.btn-outline-navy` / `:hover`
- `.btn-outline-coral` / `:hover`
- `.btn-sage` / `:hover`

**Buttons — Aliases** (lines 257–297):

- `.btn-primary` / `:hover` — alias for `.btn-coral`
- `.btn-outline` / `:hover` — alias for `.btn-outline-ink`
- `.btn-white` / `:hover`
- `.btn-white-outline` / `:hover`

**Special** (lines 299–308):

- `.btn-spec-blue` / `:hover` — spec blue button for providers page

---

## What Pages Own

Page `<style is:global>` blocks contain only selectors unique to that page — layout sections, component classes, and page-specific overrides scoped to a section container.

**Pattern for section overrides:**
If a page section needs different values for a shared selector, use a compound selector scoped to the section:

```css
/* Wrong — conflicts with global.css .btn */
.btn {
  padding: 10px 20px;
}

/* Correct — scoped to section, specificity wins */
.ph-hero .btn {
  padding: 10px 20px;
}
```

---

## Build Method: CSS Handling

When building a page from design-source per `CLAUDE.md`:

1. Copy the `<style>` block verbatim from the design-source HTML
2. **Delete** these selector groups before pasting into `.astro`:
   - `:root` blocks (all CSS variable declarations)
   - `body` rules
   - `h1, h2, h3, h4, h5` rules
   - All `.btn*` rules (`.btn`, `.btn-coral`, `.btn-ink`, etc.)
   - `.max-w`, `.eyebrow`, `.fade-up`, `.fade-up.visible`
   - CSS reset rules (`*`, `html`, `a`, `img`, `p` margin/padding resets)
3. Keep only page-specific selectors

---

## Token Reference

All tokens are unprefixed (no `--byt-*` prefix). See global.css `:root` block for the full list. Key tokens:

| Token                | Value     |
| -------------------- | --------- |
| `--navy`             | `#104378` |
| `--coral`            | `#e05555` |
| `--sage`             | `#9caf88` |
| `--font-size-base`   | `15px`    |
| `--line-height-base` | `1.55`    |
| `--max-w`            | `1200px`  |
| `--r-btn`            | `6px`     |
| `--r-card`           | `12px`    |

---

## Enforcement

`scripts/design-parity-check.sh` must detect and fail if any page `<style>` block contains a selector owned by `global.css`. This check is pending implementation (see `design-parity-check.sh` comments).
