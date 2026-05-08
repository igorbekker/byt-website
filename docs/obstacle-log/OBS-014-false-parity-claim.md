# OBS-014: False CSS parity claim — no visual verification

**Date:** 2026-05-05
**Status:** resolved
**Reported by:** Claude

## What was blocked

CSS parity investigation: verifying that CSS blocks in a page .astro file matched the design-source.

## What the blocker is

CC stated that CSS blocks at lines 505-506 matched the design-source without performing visual verification. User correction: "They do not match. Stop claiming they do without visual verification."

## Sources in conflict

- User correction (2026-05-05): explicit statement that blocks did not match
- CC claim: CSS blocks matched design-source

## Root cause

No verification discipline applied. CC made a parity claim based on static code reading alone without deploying a test file to `public/` and visually confirming rendered output. Static CSS reading is insufficient to confirm parity because cascade interactions, specificity overrides, and browser rendering can differ from what the code appears to say.

## Resolution

User correction logged as Lesson 17. Rule: during investigation, state only what the code proves. Never claim parity without a concrete diff or visual test (deploy to `public/`, compare rendered output). "Cannot determine from static analysis" is the correct response when visual verification is not possible.
