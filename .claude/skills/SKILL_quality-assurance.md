# SKILL: Quality Assurance

Domain knowledge for the QA agent. Performance targets, validation criteria, diagnostic guides.

---

## Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 95+ |
| Lighthouse Best Practices | 95+ |
| Lighthouse SEO | 95+ |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| Per-page JS shipped | 0KB (Astro default) |

---

## Design-Source Parity Checklist

Compare live/preview against `design-source/` HTML files:

- Layout structure (section order, grid columns, flex direction)
- Colors match CSS tokens — no rogue hex values
- Typography (family, weight, size, line-height, letter-spacing)
- Spacing (padding, margin, gap)
- Component states (hover, active, focus)
- Responsive behavior
- Images render (no broken src, no missing alt)

### Documenting Divergences

1. Page, section, element
2. Expected (design-source file path + line number)
3. Actual (live/preview)
4. Severity (P1/P2/P3)
5. Create `OBS-XXX-design-divergence-<page>.md`

---

## Accessibility (WCAG 2.2 AA)

- Images: `alt` on all (meaningful for content, empty for decorative)
- Headings: logical hierarchy (no skipped levels)
- Contrast: 4.5:1 normal text, 3:1 large text
- Keyboard: all interactive elements accessible
- Focus: visible indicators
- Forms: inputs have associated labels
- ARIA: correct use, not overuse
- Language: `lang` on `<html>`
- Navigation: skip-to-content link

---

## SEO Schema Requirements

| Page Type | Required JSON-LD |
|---|---|
| Homepage | MedicalOrganization + LocalBusiness |
| Blog posts | Article + Author + Publisher + BreadcrumbList |
| FAQ page | FAQPage |
| All pages | BreadcrumbList |

### Validation

```bash
grep -o '<script type="application/ld+json">.*</script>' dist/<page>/index.html | \
  sed 's/<[^>]*>//g' | python3 -m json.tool
```

Check: valid JSON, required fields present, no hardcoded values, consistent `@id` references.

---

## No-Hardcoding Scan

Every QA pass must verify no hardcoded values leaked:

| Type | Scan for |
|---|---|
| Colors | Hex values outside `global.css` and `design-source/` |
| Phone | Any phone literal in templates |
| Email | Any email literal in templates |
| URLs | Site URL not from env var |
| Copy | Inline strings that should come from Sanity |
| Images | Direct URLs that should be Sanity assets |
| Forms | Formspree URLs not from env vars |

---

## Lighthouse Diagnostic Guide

| Symptom | Likely Cause | Where to Look |
|---|---|---|
| LCP > 2.5s | Hero image, font loading, render-blocking | `<Image>` component, font links |
| CLS > 0.1 | Images without dimensions, dynamic injection | `<img>` tags, client-side JS |
| INP > 200ms | JS execution | Should be ~0 for Astro static |
| a11y < 95 | Missing alt, contrast, heading gaps | axe-core, WCAG checklist |
| SEO < 95 | Missing meta, schema, sitemap | `<head>`, JSON-LD, `robots.txt` |

---

## Severity Reference

| Level | Definition | Action |
|---|---|---|
| P0 | Site broken, data loss | Block deploy. Notify immediately. |
| P1 | Visible bug, broken UX, schema fail | Block merge. Must fix. |
| P2 | Performance/a11y, minor visual | Fix this sprint. |
| P3 | Cosmetic | Backlog. |
