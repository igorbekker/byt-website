# DEC-002: Single CSS System

**Date:** 2026-05-08
**Owner:** Igor
**Status:** Approved

## Context

Design-source HTML files use two incompatible CSS systems:

- System A (7 pages): unprefixed tokens (`--navy`, `--coral`), body 15px/1.55, `.btn` padding 14px 24px, border transparent
- System B (2 pages: Providers, Communities): `--byt-*` prefixed tokens, body 16px/1.5, `.btn` padding 12px 24px, border visible navy

`global.css` was built from System A. System B pages have cascade conflicts at equal specificity — `global.css` loads last and overwrites System B values.

## Decision

System A is canonical. System B is eliminated entirely:

1. Convert `Providers.html` and `Communities.html` design-source files to System A tokens, body values, and `.btn` rules
2. Rebuild `providers.astro` and `communities.astro` from the converted design-source files
3. Strip all shared selectors from page `<style>` blocks — `global.css` is the single owner
4. No `--byt-*` tokens permitted anywhere in the codebase

## Consequences

- One-time design-source edit (exception to read-only rule, authorized by Igor)
- Full rebuild of 2 pages required
- All cascade conflicts between `global.css` and these pages are permanently eliminated
- `design-parity-check.sh` updated to catch any future System B tokens

## Supersedes

None.
