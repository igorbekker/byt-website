# SKILL: Documentation

Domain knowledge for the documentation agent. Protocols, templates, naming conventions, and cross-reference rules.

---

## Source-of-Truth Hierarchy

When information conflicts, top wins:

1. `docs/decision-log/` — explicit Igor-approved decisions
2. `BYT_Website_Master_Playbook.docx` — business strategy
3. `design-source/` — visual design truth
4. Sanity content — runtime content
5. Existing code — current implementation

---

## Decision Log Protocol

### When to Create

- Architecture choice made or changed
- Source-of-truth conflict resolved
- Scope boundary set or moved
- Vendor or plan choice made

### Entry Lifecycle

`proposed` → `accepted` → optionally `superseded by DEC-YYY` or `rejected`

Append-only. Never edit existing entries (typo fixes excepted). Superseding decisions get a new ID and link back.

### Required Sections

1. Context — what problem prompted this
2. Options Considered — at least 2 with pros/cons
3. Decision — what was chosen, plainly stated
4. Rationale — why, with data/constraints cited
5. Consequences — what changes, new constraints, what's now possible/blocked
6. Implementation Plan — high-level steps if applicable
7. Related — DEC, OBS, PR, Master Playbook references

### Index

Update `docs/decision-log/README.md` table with every new entry.

---

## Obstacle Log Protocol

### When to Create

- Live site diverges from design-source
- Build fails non-trivially
- External blocker hit (Sanity limit, Formspree quota, etc.)
- Dependency version conflict
- Test fails with unclear cause
- Any rollback
- QA reports P0 or P1

### Severity

| Level | Definition | Action |
|---|---|---|
| P0 | Production broken, data loss risk | Stop everything. Notify immediately. |
| P1 | Visible bug, broken UX, schema fail | Block merge. Must fix. |
| P2 | Performance/a11y, minor visual | Fix this sprint. |
| P3 | Cosmetic, no user impact | Backlog. |

### Entry Lifecycle

`open` → `investigating` → `resolved` | `accepted-as-is` | `blocked-on-igor`

### Close-Out Criteria

1. Resolution documented
2. PR merged (if any)
3. Linked DEC entries updated
4. Igor confirmed

### Required Sections

1. Summary — two sentences max
2. Detail — file paths, line numbers, screenshots, console output
3. Reproduction — step-by-step
4. Investigation — what was tried, dead ends
5. Resolution — fix details, or "accepted as-is" with rationale + Igor approval
6. Related — DEC, OBS, PR, commit SHAs

### Index

Update `docs/obstacle-log/README.md` table with every new entry.

---

## Runbook Template

```markdown
# RB-XXX: <Title>

## Prerequisites
- <what must be true before starting>

## Steps
1. <step>

## Verification
- <how to confirm it worked>

## Rollback
- <how to undo if something goes wrong>

## Related
- DEC-XXX, OBS-XXX
```

Rollback section mandatory even if "N/A — read-only operation."

---

## File Naming

- Decision logs: `DEC-XXX-short-name.md` (zero-padded 3 digits)
- Obstacle logs: `OBS-XXX-short-name.md`
- Runbooks: `RB-XXX-name.md`
- Templates: `<name>.template.md`

No spaces, uppercase extensions, version suffixes, or leading underscores.

---

## Lessons Format

```markdown
## YYYY-MM-DD — <one-line summary>

**Context:** <what was being worked on>
**What I did wrong:** <the mistake>
**Rule for next time:** <prevention rule>
**Related:** <DEC-XXX, OBS-XXX, PR link>
```

---

## Cross-Reference Rules

- Every DEC links to related OBS entries and PRs
- Every OBS links to related DEC entries and PRs
- Index tables in README files must stay current
- No orphan references — if you cite a DEC or OBS, it must exist
