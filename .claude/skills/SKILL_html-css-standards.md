# SKILL: HTML & CSS Standards

BYT token system, typography, and CSS architecture rules. These enforce consistent, maintainable styles across all pages.

---

## Typography

### Font Families

```css
--font-body: 'Montserrat', system-ui, sans-serif;
--font-heading: 'Manrope', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Menlo', monospace;
```

- **Body copy:** Montserrat (weights: 400, 500, 600, 700)
- **Headings:** Manrope (weights: 400, 500, 600, 700, 800)
- Both loaded via Google Fonts `<link>` in BaseLayout — never via CSS `@import`

### Base Type Scale

```css
--font-size-base: 15px; /* NOT 16px — this is intentional */
--line-height-base: 1.55;
--line-height-heading: 1.1;
```

### text-wrap (Prevents Orphans)

```css
h1,
h2,
h3,
h4,
h5 {
  text-wrap: balance;
}
p {
  text-wrap: pretty;
}
```

---

## Z-Index Token Scale

All z-index values must use CSS custom properties. No magic numbers.

```css
:root {
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-skip-link: 1000;
}
```

Usage:

```css
header {
  z-index: var(--z-sticky);
}
.modal-overlay {
  z-index: var(--z-overlay);
}
.modal-panel {
  z-index: var(--z-modal);
}
.skip-link {
  z-index: var(--z-skip-link);
}
```

**Never use a bare integer for z-index.** If a new layer is needed, add a token to BaseLayout and document it here.

---

## Color Tokens

```css
:root {
  --navy: #104378;
  --navy-deep: #0a2d52;
  --white: #ffffff;
  --off-white: #f5f7fa;
  --cream: #fffcf0;
  --slate: #5a7194;
  --mist: #8fa3bf;
  --border: #e4eaf0;
  --coral: #e05555;
  --coral-hover: #c94444;
  --coral-light: #fce8e8;
  --sage: #9caf88;
  --sage-hover: #7a9468;
  --sage-light: #e8efe3;
}
```

**No `--byt-*` prefixed tokens.** All tokens use System A (unprefixed) names. No rogue hex values outside this set.

---

## Layout Tokens

```css
--max-w: 1200px; /* max content width — NOT 1280px */
--pad-x: 64px; /* horizontal page padding */
--pad-s: 80px; /* section vertical padding */

/* Responsive */
@media (max-width: 1024px) {
  --pad-x: 32px;
  --pad-s: 64px;
}
@media (max-width: 768px) {
  --pad-x: 20px;
  --pad-s: 56px;
}
```

---

## color-scheme

```css
:root {
  color-scheme: light;
}
```

Required in BaseLayout. Signals to the browser that the site is light-mode only, preventing OS dark mode from auto-inverting colors.

---

## Print Stylesheet

```css
@media print {
  *,
  *::before,
  *::after {
    background: transparent !important;
    color: #000 !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  a[href]:after {
    content: ' (' attr(href) ')';
  }
  img {
    max-width: 100% !important;
    page-break-inside: avoid;
  }
  h2,
  h3 {
    page-break-after: avoid;
  }
  .mobile-cta-bar,
  .skip-link,
  nav {
    display: none !important;
  }
}
```

Defined in BaseLayout. Required for WCAG compliance (users printing therapy resources). Never remove.

---

## CSS Architecture Rules

1. **No `--byt-*` tokens** anywhere in `.astro` files (banned by `design-parity-check.sh`)
2. **No global.css-owned selectors** in page `<style>` blocks — banned classes: `.btn`, `.btn-*`, `.eyebrow`, `.max-w`, `.fade-up`, bare `h1–h5`
3. **All page-specific styles** in the page's `<style>` block (scoped to that page's Astro data-astro-cid)
4. **All shared styles** in `global.css` via BaseLayout
5. **CSS cascade** goes: BaseLayout tokens → global.css utilities → page-level overrides (in that order)

---

## Border Radius Tokens

```css
--r-btn: 6px; /* buttons, inputs */
--r-card: 12px; /* cards, panels */
--r-pill: 999px; /* pills, chips, badges */
```

---

## Transition Token

```css
--t-hover: 0.15s ease; /* hover transitions */
```

All interactive hover states use `var(--t-hover)`. Never hardcode `transition: 0.2s` or similar.

---

## Safe-Area Handling (Required)

```css
body {
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}

.mobile-cta-bar {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

Prevents content from being clipped by iPhone notch/Dynamic Island on iOS. Required in BaseLayout.

---

## Scroll Behavior

```css
html {
  scroll-behavior: smooth;
}

:target {
  scroll-margin-top: calc(84px + 1rem); /* accounts for sticky nav */
}
```

`scroll-margin-top` on `:target` prevents the sticky header from covering anchor-linked content.

---

## Automated Checks

`scripts/a11y-check.sh` verifies:

- `color-scheme` declared
- `@media print` exists
- `--z-base`, `--z-dropdown`, `--z-modal` present
- `env(safe-area-inset-*)` present
- `.sr-only` class defined

`scripts/design-parity-check.sh` verifies:

- No `--byt-*` tokens in `.astro` files
- No global.css-owned selectors in page `<style>` blocks
