# OBS-005 — format --check fails on pre-existing design-source files

**Date:** 2026-05-01
**Branch:** feat/phase-2-design-ingestion
**Status:** resolved

---

## Summary

`pnpm format --check` exits non-zero due to pre-existing files in `design-source/` and `.gitkeep` stub files. None of these are files created or modified in Phase 2.

---

## Failing Files

### 1. `design-source/` HTML files — Prettier parse error

Prettier reports `SyntaxError: Unexpected closing tag "a"` on all `design-source/*.html` files (About.html, Homepage.html, footer.html, etc.). The HTML contains:

- Duplicate `</a>` closing tags (malformed structure)
- Inline base64-encoded images that are 50,000+ character lines

These are **read-only source files** per CLAUDE.md rule: "Never edit `design-source/`. It is read-only input." They were not created in Phase 2.

### 2. `.gitkeep` stub files — no parser inferred

Prettier reports `No parser could be inferred` for `.gitkeep` files committed as directory placeholders in `apps/web/src/`. These are binary/empty placeholder files with no extension.

---

## Root Cause

`.prettierignore` does not exclude `design-source/` or `.gitkeep` files. Prettier's wildcard glob matches everything including these files.

---

## Why I Cannot Fix This Unilaterally

Adding entries to `.prettierignore` is a **config change**. Per CLAUDE.md:

> "Creating config files not specified in the task brief (e.g., sanity.config.ts in a new location)" → log OBS and STOP

Modifying `.prettierignore` changes Prettier's scope for the entire repo. This is Igor's call.

---

## Proposed Fix (for Igor to approve)

Add two lines to `.prettierignore`:

```
design-source/
**/.gitkeep
```

This would make `pnpm format --check` pass on all files we actually own.

---

## Quality Gate Status Without This Fix

| Gate                                                | Status                         |
| --------------------------------------------------- | ------------------------------ |
| `pnpm --filter web build`                           | PASS                           |
| `pnpm --filter web check`                           | PASS                           |
| `pnpm typecheck`                                    | PASS                           |
| `pnpm lint`                                         | PASS                           |
| `pnpm format --check`                               | FAIL (pre-existing files only) |
| Our files only (`apps/web/src/**/*.{astro,ts,css}`) | PASS                           |

---

## Request

Igor: please approve the `.prettierignore` additions above, or provide an alternate fix.
