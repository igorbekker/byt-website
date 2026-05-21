# Performance Budget

## Core Web Vitals Targets

| Metric | Target   | Description               |
| ------ | -------- | ------------------------- |
| LCP    | < 2.5 s  | Largest Contentful Paint  |
| CLS    | < 0.1    | Cumulative Layout Shift   |
| INP    | < 200 ms | Interaction to Next Paint |

## Image Loading Strategy

| Image type        | Attributes                                                  |
| ----------------- | ----------------------------------------------------------- |
| Hero / above-fold | `fetchpriority="high"` `loading="eager"` `decoding="async"` |
| Below-fold        | `loading="lazy"` `decoding="async"`                         |

**SanityImage component** generates a `srcset` with three breakpoints:

- `400w` — mobile
- `800w` — tablet
- `1200w` — desktop

All Sanity images use `fm=webp` query param for WebP delivery.

## Font Loading

- Fonts: **Manrope** (body) + **Montserrat** (headings) via Google Fonts.
- Load via `<link rel="stylesheet">` in `<head>` — **not** CSS `@import` (blocks render).
- Preconnect hints required (see below).

## Preconnect Hints

Add to `<head>` before any font or Sanity requests:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://cdn.sanity.io" />
```

## Layout Optimization

- Apply `content-visibility: auto` to below-fold sections to defer layout and paint cost.
- Reserve explicit width/height (or `aspect-ratio`) on images to prevent CLS.

## Page Budget

| Resource          | Budget   |
| ----------------- | -------- |
| Total page weight | < 1.5 MB |
| Total requests    | < 30     |
| HTML              | < 50 KB  |
| CSS               | < 80 KB  |
| JS                | < 100 KB |
| Hero image        | < 200 KB |
| Fonts total       | < 200 KB |
