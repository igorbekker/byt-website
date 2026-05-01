# OBS-007 — New dependency: astro-portabletext

**Date:** 2026-05-01
**Phase:** Phase 4 — Static Pages (CMS-Driven)
**Step:** Unit 5 — About page (storyBody Portable Text field)

---

## What happened

`aboutPage.ts` defines `storyBody` as a Portable Text field (`array` of `block`). Rendering Portable Text in Astro requires a dedicated renderer. Two options existed:

- Option A: Install `astro-portabletext`
- Option B: Strip to plain text (loses marks, links, annotations)

## Decision

Igor approved **Option A** — install `astro-portabletext`.

## Status

Approved. AGENT_builder may install the dependency during Unit 5.
