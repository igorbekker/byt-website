# OBS-016 — Wrong Sanity Token Used for Studio Deploy

**Date:** 2026-05-08
**Severity:** P1
**Status:** Resolved

## Summary

CC attempted `sanity deploy` using `SANITY_AUTH_TOKEN` (Editor token). Deploy failed — Editor token lacks `deployStudio` permission. `SANITY_DEPLOY_TOKEN` existed in `~/.profile` but CC didn't know to use it. No documentation mapped tokens to their permitted operations.

## Root Cause

**RC-8** — No environment variable registry. Token purposes undocumented.

## Resolution

`docs/env-registry.md` created. `docs/deploy-runbook.md` created with explicit override pattern. `CLAUDE.md` updated with `env-registry` reference.

## Related

None
