Post-commit verification. Execute every step in order.

## 1. Commit Integrity
- Run git log -1 — confirm commit message is descriptive and accurate
- Run git diff HEAD~1 HEAD -- tasks/todo.md — confirm review section was included
- Run git diff HEAD~1 HEAD -- tasks/lessons.md — confirm lessons updated if corrections were made
- Check for any files changed in the commit NOT covered in todo.md review — flag them

## 2. Build Verification
- Run the build — confirm it passes after commit
- If build fails after commit — this is a critical violation, flag immediately

## 3. Deploy Check
- Check CLAUDE.md for deploy instructions
- If project requires a deploy step — confirm it was run or flag as pending

## 4. todo.md Cleanup
- Scan todo.md for any completed items still marked [ ] — mark them [x]
- Remove or archive any stale tasks older than 30 days with no activity
- Confirm the Active Tasks section reflects actual current state
- If todo.md has more than 100 lines of completed tasks — move them to tasks/todo-archive.md

## 5. lessons.md Cleanup
- Count total lessons — if over 15, flag for consolidation
- Scan for duplicate lessons describing the same root failure — list them
- If duplicates exist: propose merged single rule, wait for user approval before writing
- Confirm the most-violated rules are at the top, not buried

## 6. Final Report
Report PASS or FAIL for each section above with specific line items.
Do not summarize failures — list them explicitly.
If any section is FAIL — do not move on until the user acknowledges.
