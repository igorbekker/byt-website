# SKILL: Performance — Core Web Vitals

BYT performance standards. Lighthouse Performance target: 95+. LCP < 2.5s. CLS < 0.1. INP < 200ms.

---

## Image Optimization: SanityImage Pattern

All Sanity CDN images must use the full optimization pattern:

```astro
<img
  src={`${imageUrl}?w=1200&fm=webp&fit=crop`}
  srcset={`
    ${imageUrl}?w=400&fm=webp&fit=crop 400w,
    ${imageUrl}?w=800&fm=webp&fit=crop 800w,
    ${imageUrl}?w=1200&fm=webp&fit=crop 1200w
  `}
  alt={imageAlt ?? 'Descriptive alt text'}
  width="1440"
  height="640"
  loading={isHero ? 'eager' : 'lazy'}
  fetchpriority={isHero ? 'high' : 'auto'}
  decoding="async"
/>
```

**Required attributes:**

- `src` with `?fm=webp` — WebP format cuts file size 30–50%
- `srcset` with 400w/800w/1200w breakpoints — browser picks the right size
- `alt` with `??` fallback
- `width` + `height` — prevents CLS (layout shift during load)
- `loading="lazy"` for below-fold images
- `loading="eager"` + `fetchpriority="high"` for the LCP image (hero)
- `decoding="async"` — decodes off the main thread

---

## LCP Image (Hero)

The hero image is the Largest Contentful Paint element. It must be:

1. **Not lazy-loaded** — use `loading="eager"` (default)
2. **High priority** — use `fetchpriority="high"`
3. **Decoded async** — use `decoding="async"`
4. **Explicitly sized** — `width` and `height` required

Only one image per page should have `fetchpriority="high"`. Multiple high-priority hints cancel each other.

---

## Fonts: Link, Not @import

**Correct:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
/>
```

**Wrong:**

```css
@import url('https://fonts.googleapis.com/...');
```

`@import` is render-blocking and delays page load. `<link rel="stylesheet">` in `<head>` is parallel-fetched. Both preconnect hints are required for fast font loading.

---

## Sanity CDN Preconnect

Every page must include:

```html
<link rel="preconnect" href="https://cdn.sanity.io" crossorigin />
<link rel="dns-prefetch" href="https://cdn.sanity.io" />
```

Set in `BaseLayout`. Without these, the first Sanity CDN request pays a full DNS + TLS handshake cost (~300ms on mobile).

---

## content-visibility (Off-Screen Optimization)

```css
.below-fold-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

`content-visibility: auto` skips rendering work for elements outside the viewport. Use on large below-fold sections. Requires `contain-intrinsic-size` to prevent scroll jumps. Defined in careers, communities, and contact page CSS.

---

## No Render-Blocking Scripts

All external script tags in `<head>` must have `async` or `defer`:

```html
<!-- Correct -->
<script async src="https://www.googletagmanager.com/gtm.js?id=..."></script>

<!-- Wrong — blocks HTML parsing -->
<script src="some-lib.js"></script>
```

GTM uses `async`. All `<script type="module">` tags are implicitly deferred. Inline `<script>` blocks (dataLayer init) are OK — they're small and synchronous.

---

## CSS: overflow-wrap and font inherit

Required in BaseLayout:

```css
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}
```

`overflow-wrap: break-word` prevents long URLs/words from overflowing containers on mobile.
`font: inherit` ensures form elements use the site font stack, not the browser default.

---

## Performance Budget

| Metric          | Target  | Failure threshold |
| --------------- | ------- | ----------------- |
| LCP             | < 2.5s  | > 4s              |
| CLS             | < 0.1   | > 0.25            |
| INP             | < 200ms | > 500ms           |
| JS per page     | 0 KB    | > 50 KB           |
| Lighthouse Perf | 95+     | < 90              |

Astro static output sends zero JavaScript by default. JS only ships when `<script>` tags are explicitly added. Current pages use inline scripts for nav toggle, form modals, and fade-up observers.

---

## Automated Checks

`scripts/perf-check.sh` verifies:

1. `fetchpriority="high"` on at least one img
2. `loading="lazy"` on at least one img
3. `decoding="async"` on at least one img
4. No CSS `@import` for fonts
5. `content-visibility` present in CSS
6. `preconnect cdn.sanity.io` in all pages
7. No render-blocking external scripts in `<head>`
8. `overflow-wrap` in CSS
9. `font: inherit` in CSS

Run after every build: `bash scripts/perf-check.sh`
