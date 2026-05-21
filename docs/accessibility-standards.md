# Accessibility Standards

BYT website targets **WCAG 2.2 AA** compliance.

## Color Contrast

Minimum ratios per WCAG 1.4.3 / 1.4.11:

| Use                                 | Ratio Required |
| ----------------------------------- | -------------- |
| Normal text (< 18pt / < 14pt bold)  | 4.5 : 1        |
| Large text (≥ 18pt / ≥ 14pt bold)   | 3 : 1          |
| UI components and graphical objects | 3 : 1          |

**Verified BYT color pairs:**

| Foreground      | Background      | Ratio | Pass     |
| --------------- | --------------- | ----- | -------- |
| Navy `#104378`  | White `#FFFFFF` | ✓     | AA + AAA |
| Teal `#1A9E8F`  | White `#FFFFFF` | ✓     | AA       |
| White `#FFFFFF` | Navy `#104378`  | ✓     | AA + AAA |

## Focus

- Use `:focus-visible` (not `:focus`) to avoid showing outlines on mouse click.
- Outline: `2px solid #104378` (Navy), `2px` offset.
- Do not suppress `outline` on interactive elements without an equivalent replacement.

## Skip Link

- Must be the **first focusable element** in the DOM.
- Links to `#main-content`.
- Visually hidden until focused (`.sr-only` + `:focus-visible` override).
- Z-index: `--z-skip-link: 1000` (always above all other layers).

## Reduced Motion

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

All animations and transitions must be governed by this rule.

## Screen Reader Utilities

- `.sr-only`: visually hidden but available to assistive technology.
- `aria-labelledby`: applied to landmark sections (`<section>`, `<nav>`, `<aside>`).
- `aria-hidden="true"`: applied to decorative SVGs and icon-only elements.

## ARIA Patterns

| Component                          | Pattern                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Communities facility type switcher | `role=tablist` on container, `role=tab` on triggers, `role=tabpanel` on content, `aria-selected`, `aria-controls` |
| Forms                              | `<label for>` + matching `id`, `aria-required="true"`, `autocomplete` attribute, errors use `role="alert"`        |

## Touch Targets

| Context | Minimum size |
| ------- | ------------ |
| Mobile  | 44 × 44 px   |
| Desktop | 24 × 24 px   |

Applies to all interactive elements: buttons, links, checkboxes, radios.
