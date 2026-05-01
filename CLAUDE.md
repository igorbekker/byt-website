# SESSION START PROTOCOL — EXECUTE THIS BEFORE ANYTHING ELSE

1. Read this entire file top to bottom
2. Read tasks/todo.md — show current open/pending tasks
3. Read tasks/lessons.md — review all past lessons
4. Confirm out loud: "CLAUDE.md loaded. todo.md and lessons.md reviewed. Ready."
5. Do NOT begin any work until steps 1–4 are confirmed

VIOLATIONS: If I skip todo.md, lessons.md, or any step above — stop me immediately.
Point to the exact rule I broke. Do not apologize. Fix it on the spot.

---

## REQUIRED: Task Management

REQUIRED: Before any task — write plan to tasks/todo.md with checkable items
REQUIRED: Check in with user before starting implementation
REQUIRED: Mark items complete in todo.md as you go
REQUIRED: Add review section to tasks/todo.md before committing
REQUIRED: After ANY user correction — update tasks/lessons.md immediately, before continuing
REQUIRED: At session end — both files must reflect everything done this session

NEVER commit without todo.md review section written
NEVER ignore a correction without logging it to lessons.md
NEVER start work without confirming this file was read in full

---

## REQUIRED: Quality Gates

REQUIRED order: Edit → Verify → Commit. Never commit then verify.
REQUIRED: Run the actual function/test and confirm output before committing
REQUIRED: One bug = one commit. Atomic fixes, clean git history.
REQUIRED: Run full CLAUDE.md audit on every file touched before committing
REQUIRED: After replace_all — immediately verify the constant declaration was not self-replaced

NEVER mark a task complete without proving it works
NEVER fix data without fixing the code that wrote it
NEVER audit only the main file — audit EVERY file changed this session

---

## REQUIRED: Commit Protocol

NEVER run git commit without running /pre first.
The commit hook will block any commit attempt.
The sequence is: /pre → git commit → /post

---

## Workflow

### Plan Mode
- Enter plan mode for ANY task with 3+ steps or architectural decisions
- If something goes sideways: STOP and re-plan. Do not keep pushing.
- Write detailed specs upfront to reduce ambiguity

### Bug Fixing
- When given a bug report: fix it. No hand-holding required.
- Trace the full path before fixing: input → processing → output
- Fix all broken links in one pass, not one at a time
- When fixing multiple bugs in sequence: STOP after each fix and run /pre before moving to the next

### Self-Improvement Loop
- After ANY correction: stop → log to tasks/lessons.md → resume
- Review lessons.md at every session start

### Code Standards
- Simplicity first: make every change as simple as possible
- No temporary fixes: find root causes, senior developer standards
- Minimal impact: only touch what's necessary
- Functions ≤ 30 lines. Extract helpers when exceeded.
- No magic strings or numbers. Named constants for everything.
- Every type assertion needs a // safe: comment

---

## Environment & Credentials

NEVER commit credentials. NEVER hardcode API keys in source files.
Credentials live in .env or .dev.vars (gitignored).
Template with key names (no values) committed as .env.example or .dev.vars.example.
NEVER ask the user for credentials. If .env is missing, say so and stop.

---

## Deploy

NEVER ask the user for the Cloudflare API token.
CLOUDFLARE_API_TOKEN is set in ~/.bashrc and ~/.profile — it is always available in the environment.
NEVER hardcode the token. NEVER print the token value.
If deploy fails with auth error — source ~/.profile first, then retry.
Deploy command: npx wrangler deploy
If that fails: source ~/.profile && npx wrangler deploy

---

## Project Overview

[ ADD PROJECT DESCRIPTION HERE ]

### Business Brief
- **Problem:**
- **Solution:**
- **Users:**

### Tech Stack
- [ ADD TECH STACK ]

### Status
- [ ADD CURRENT STATUS ]
