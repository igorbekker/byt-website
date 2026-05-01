Post-commit verification. Execute every step in order.

## 1. Commit Integrity
- Run `git log -1` — confirm commit message is descriptive and follows Conventional Commits
- Run `git diff HEAD~1 HEAD -- tasks/todo.md` — confirm review section was included
- Run `git diff HEAD~1 HEAD -- tasks/lessons.md` — confirm lessons updated if corrections were made this session
- Check for any files changed in the commit NOT covered in todo.md review — flag them

## 2. Build Verification
- Run the build — confirm it passes after commit
- If build fails after commit — this is a critical violation, flag immediately

## 3. todo.md Cleanup
- Scan todo.md for any completed items still marked `[ ]` — mark them `[x]`
- Confirm the active tasks section reflects actual current state

## 4. Final Report
Report PASS or FAIL for each section above with specific line items.
Do not summarize failures — list them explicitly.
If any section is FAIL — do not move on until the user acknowledges.
