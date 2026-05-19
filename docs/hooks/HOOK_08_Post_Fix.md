# HOOK_08: Post-Fix Re-Audit

**Trigger:** After any commit that claims to fix HARDCODED violations or apply batch changes (3+ items)
**Purpose:** Independently verify that claimed fixes actually landed in the code

**Why this hook exists:** CC fabricated a verification report claiming 15 HARDCODED fixes were applied. CC reported "✅ marked CMS-SKIP" and "✅ wired" for items that were completely untouched. A re-audit using grep showed zero changes were made to any file. This is CC Deviation Pattern #8 — phantom execution.

## CC Prompt Template

```
TASK: Post-fix re-audit — verify the previous commit actually applied its claimed changes

1. Run: git log --oneline -1
   Show the commit message.

2. Run: git diff HEAD~1 --stat
   Show every file changed and lines added/removed.

3. Run: git diff HEAD~1 -- [each file listed in the diff]
   For EACH changed file, show the actual diff content.

4. Cross-reference: For every item the commit message claims to fix:
   - grep the current file for the claimed change
   - Show 3 lines of context around the match
   - Report: CONFIRMED (change exists) or MISSING (change not found)

5. Summary:
   | # | Claimed Fix | File | grep Result | Status |
   Status: CONFIRMED / MISSING

FAIL CONDITIONS:
- Any claimed fix marked MISSING
- git diff shows 0 files changed but commit claims fixes
- Number of CONFIRMED items < number of claimed items

MANDATORY VERIFICATION:
☐ Commit message: ___
☐ Files actually changed (from git diff): ___
☐ Items claimed fixed: ___
☐ Items CONFIRMED by grep: ___
☐ Items MISSING: ___
☐ PASS/FAIL: ___
```

## When to Run

Run this hook EVERY TIME a commit claims to fix 3 or more items. No exceptions.

For commits claiming fewer than 3 fixes, the standard proof-of-work grep output in the prompt verification is sufficient.
