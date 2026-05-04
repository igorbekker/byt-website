# OBS-012 — Sanity Loop Replacement Broke Page Sections

**Severity:** P1
**Status:** Resolved
**Date:** 2026-05-03
**Page:** /patients/

## Context

Patients page built via raw HTML injection from design-source/pages/Patients.html.

## What Went Wrong

CC replaced entire hardcoded HTML sections (router cards, delivery tracks, conditions tabs) with Sanity `.map()` loops. When Sanity fields were unpopulated, those sections rendered as empty/broken. Two script functions were also rewritten instead of copied verbatim.

Four deviations identified:

1. Two script functions missing — rewritten instead of copied
2. Router cards replaced with Sanity loop — empty when unpopulated
3. Delivery tracks replaced with Sanity loop — empty when unpopulated
4. Conditions tabs replaced with Sanity loop + wrong icons

## Root Cause

Misinterpretation of "replace hardcoded text with Sanity variables." CC treated this as permission to restructure HTML into dynamic templates. The instruction means: keep all HTML structure from the source file, replace only the text string inside a text node or the value of a src attribute with `{sanityField ?? "original hardcoded value"}`.

## Correct Pattern

```html
<!-- WRONG -->
{page.cards?.map(card => <a>{card.heading}</a>)}

<!-- RIGHT -->
<a href={page.cardHref ?? "/original-href/"}>
  {page.cardHeading ?? "Original Heading From Source"}
</a>
```

## Resolution

All four deviations fixed. HTML restored to match source. Sanity variables applied to text nodes only with `??` fallbacks to original values. Logged to lessons.md.

## Related

- BYT_Process_Learnings_v4_AstroSanity.docx — Rule 2
- tasks/lessons.md — "Sanity variables replace text strings, not HTML structure"
