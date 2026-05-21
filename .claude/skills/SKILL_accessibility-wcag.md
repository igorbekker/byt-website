# SKILL: Accessibility — WCAG 2.2 AA

BYT standards for accessibility. All pages must meet WCAG 2.2 AA. Lighthouse Accessibility target: 95+.

---

## Required HTML Patterns

### Skip Link

Every page must have a skip link as the first focusable element:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

The `.skip-link` class is in `BaseLayout.BgUJHK65.css`. It positions off-screen until focused.

### Main Landmark

```html
<main id="main-content">
  <!-- page content -->
</main>
```

### Navigation ARIA

```html
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Breadcrumb">...</nav>
```

Every `<nav>` element must have `aria-label`. Do not use `aria-labelledby` unless a visible heading exists.

---

## Screen Reader Utility Class

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Defined in `BaseLayout`. Use for text visible to screen readers but hidden visually (e.g., form labels, icon button descriptions).

---

## Focus Management

```css
:focus-visible {
  outline: 2px solid var(--navy, #104378);
  outline-offset: 2px;
}
```

Defined in `BaseLayout`. This rule applies to all interactive elements on keyboard focus. **Never remove this rule.** `focus-visible` targets keyboard users only (not mouse clicks).

---

## Color Contrast Requirements

| Context                            | Minimum ratio |
| ---------------------------------- | ------------- |
| Normal text (< 18px)               | 4.5:1         |
| Large text (≥ 18px bold or ≥ 24px) | 3:1           |
| UI components/icons                | 3:1           |

BYT palette contrast status:

- `--navy-deep #0a2d52` on `--white`: 12.8:1 ✅
- `--coral #e05555` on `--white`: 3.8:1 ✅ (large text only, fails for body text)
- `--slate #5a7194` on `--white`: 4.6:1 ✅
- `--mist #8fa3bf` on `--white`: 2.9:1 ⚠️ (decorative/placeholder only)

---

## Motion Sensitivity

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Defined in `BaseLayout`. This disables all CSS animations for users who request reduced motion. **Never override this with page-level styles.**

---

## Images

Every content `<img>` must have:

- `alt`: Descriptive text for meaningful images, `alt=""` for decorative
- `width` + `height`: Prevents CLS (Cumulative Layout Shift)
- `loading="lazy"` for below-fold images
- `decoding="async"` for all non-hero images

Nav/footer logo images are CSS-height-constrained and don't require explicit width/height (they're not CLS sources). Content images with `srcset` must have explicit dimensions.

---

## ARIA Tab Pattern (Communities Page)

The communities page uses an ARIA tab widget for the "How It Works" process steps. Pattern:

```html
<div role="tablist" aria-label="Care delivery steps">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">Step 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">Step 2</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">...</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>...</div>
```

Keyboard: Tab moves focus to tab list, Arrow keys move between tabs, Enter/Space activates.

---

## Forms

- Every `<input>` must have an associated `<label>` (not just placeholder text)
- Required fields must have `required` attribute AND visible indicator
- Error messages must be associated via `aria-describedby`
- Consent checkboxes need visible label text
- `autocomplete` attributes on address/email/phone fields

---

## Modal Accessibility

```html
<div role="dialog" aria-label="Book a Session" aria-modal="true">
  ...
  <button aria-label="Close modal">...</button>
</div>
```

On open: trap focus inside modal. On close: return focus to trigger element. Escape key must close the modal.

---

## Viewport Meta

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

**Never add:** `maximum-scale=1`, `user-scalable=no`. These violate WCAG 1.4.4 (Resize Text) by preventing users from zooming. The `viewport-fit=cover` is safe — it enables safe-area insets on notched devices.

---

## Safe Area (Notched Devices)

```css
body {
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}
.mobile-cta-bar {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

Required to avoid content being obscured by iPhone notch/Dynamic Island. Defined in `BaseLayout`.

---

## Heading Hierarchy

No level skipping. Every page must follow:

```
h1 (one per page, in hero)
  h2 (section headings)
    h3 (subsection/card headings)
      h4 (if needed — rare)
```

Never use heading tags for visual sizing. Use CSS instead.

---

## Lighthouse Accessibility Target

Score must be ≥ 95. Common failure causes:

1. Missing `aria-label` on icon-only buttons
2. Missing `for`/`id` pairing on form labels
3. Color contrast below 4.5:1 on body text
4. Missing `lang` attribute on `<html>`
5. Duplicate `id` attributes
