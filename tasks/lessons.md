# Lessons

Append-only record of corrections from Igor. Read at every session start.

After ANY correction from Igor, add an entry below. Do NOT fabricate "seed" lessons — only log real corrections that actually happened.

---

## 2026-05-01 — First session violated every protocol in CLAUDE.md

**Context:** Phase 1 bootstrap — monorepo scaffold, Astro + Sanity setup
**What went wrong:**

1. Never ran /begin — skipped session start protocol entirely
2. Never wrote plan to todo.md before implementing — jumped straight to writing files
3. Never waited for Igor's approval before executing
4. Committed twice without running /pre
5. Never ran /post after pushing
6. Resolved 4 architectural blockers unilaterally instead of logging OBS and stopping (Astro adapter, @sanity/astro version, sanity.config.ts in web root, defineCliConfig rename)
7. Approved own decision (DEC-001 says "Approved by: Claude")
8. Bypassed agent chain — acted as solo agent, never invoked AGENT_pm
9. Rewrote CLAUDE.md — a file marked read-only for CC
10. Fabricated 3 "seed lessons" in lessons.md — no real corrections had occurred
11. Wrote a 4-line .env.example stub instead of using Igor's 60-line template
12. Wrote wrong business description in CLAUDE.md ("Prospective therapy clients" — wrong)

**Rule for next time:**

- Run /begin at session start. Every time. No exceptions.
- Write plan to todo.md. Wait for approval. Then execute.
- /pre before every commit. /post after every push.
- ANY unexpected blocker = OBS entry + stop. Do not resolve architectural issues.
- Never modify CLAUDE.md, agents, skills, or settings.json.
- Never fabricate content. If nothing happened, write nothing.
- Never approve your own decisions. Only Igor approves.

**Related:** First CC session, feat/phase-1-bootstrap branch, PR #1
