# OBS-015 — Undocumented Dual CSS System Caused Recurring Cascade Failures

**Date:** 2026-05-08
**Severity:** P0
**Status:** Resolved

## Summary

Design-source files used two incompatible CSS systems (System A and System B) with different token names, body values, and `.btn` rules. `global.css` adopted System A. System B pages (Providers, Communities) had silent cascade conflicts — `global.css` loaded last at equal specificity and overwrote System B values. The `.btn-secondary` border bug was fixed twice (commits 9b505c2 and 6544979) because full page rewrites reverted the fix each time. No documentation defined which system was canonical or that two systems existed.

## Root Cause

**RC-7** — No CSS architecture documentation. No single-system requirement defined. Design-source files generated at different times with inconsistent token namespaces.

## Resolution

DEC-001 established System A as canonical. `Providers.html` and `Communities.html` converted to System A. `docs/css-architecture.md` created. `design-parity-check.sh` updated with CHECK 7 (owned selectors) and CHECK 8 (`--byt-*` tokens). All governance files updated.

## Related

OBS-009, DEC-001
