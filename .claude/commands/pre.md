Execute every step in order. Do not skip any.

1. Open `tasks/todo.md`
2. Mark completed items `[x]` with timestamp
3. Write a review section under the task: what was built, how it was verified, any issues found
4. Open `tasks/lessons.md`
5. If user corrected me this session and it is not yet logged — add it now. Do NOT fabricate lessons that didn't happen.
6. Show me both files — display the relevant sections
7. Run quality gates:
   - `pnpm --filter web check` (if web code changed)
   - `pnpm typecheck` (if TypeScript changed)
   - `pnpm lint` (always)
   - `pnpm format --check` (always)
   - `pnpm --filter web build` (if web code changed)
8. Report pass/fail for each gate
9. Only if ALL gates pass: confirm ready for `git commit`

If any gate fails — fix the issue and re-run. Do NOT proceed to commit.
Do not confirm done until all 9 steps are complete.
