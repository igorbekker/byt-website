---
id: OBS-017
title: Homepage router hover behavior — task spec conflicts with design-source
status: resolved
date: 2026-05-09
resolved: 2026-05-09
---

## Problem

Task Item 4 specifies: "Desktop: hover expands block, mouseout collapses. Mobile: tap to expand/collapse."

Static analysis shows `index.astro` and `design-source/pages/Homepage.html` are **identical** in this section:

- JS: `onclick="activateRouterCard(idx)"` on each `.r-card` — click/tap to activate, no mouseenter/mouseleave
- CSS: `.r-card:hover { border-color: rgba(224,85,85,.5); box-shadow: var(--shadow-lg); }` — hover only changes border and shadow (no expand/collapse)

There is no hover-to-expand behavior in the design-source. Implementing it would deviate from design-source truth (CLAUDE.md: design-source/ is visual design truth).

## Options

1. Keep click behavior (matches design-source exactly) — current state is correct
2. Add mouseenter-to-expand and mouseleave-to-collapse on desktop (deviates from design-source but matches task spec)

## Resolution

Igor confirmed hover behavior via session instruction. User instruction takes precedence over design-source for behavioral enhancements. Implemented:

- `window.matchMedia('(hover: hover)')` gates desktop-only behavior
- `mouseenter` on `.r-card` → `activateRouterCard(i)`
- `mouseleave` on `#routerRow` → `activateRouterCard(0)` (reset to first)
