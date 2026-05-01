# Lessons Log — Standing Orders

These are corrections received from the user. Each is a permanent rule.
Most-violated rules are at the top.

---

## Lesson 1 — Documentation is Part of Definition of Done
**Violation count:** 0
**Rule:** No commit happens without: (1) tasks/todo.md review section written,
(2) tasks/lessons.md current, (3) build passes. All three BEFORE git commit.
When fixing multiple bugs in sequence — STOP after each fix and run /pre before
moving to the next issue.

---

## Lesson 2 — /pre Must Run BEFORE git commit, Not After
**Violation count:** 0
**Rule:** The sequence is /pre → git commit → /post. The commit hook will block
commits — this is intentional. The only way past the block is to have actually run /pre.

---

## Lesson 3 — Wait for Approval Before Implementation
**Violation count:** 0
**Rule:** Always wait for explicit user approval before any implementation step
including API testing, scaffolding, or exploration that produces side effects.

---

## Summary Statistics
- **Total lessons:** 3 (seed lessons from project template)
- **Most violated:** None yet — new project
