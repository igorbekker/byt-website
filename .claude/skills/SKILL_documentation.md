# SKILL: Documentation

Domain knowledge for the documentation agent. Protocols, templates, naming conventions, cross-reference rules.

---

## Source-of-Truth Hierarchy

When information conflicts, top wins:

1. `docs/decision-log/` — explicit Igor-approved decisions
2. `design-source/` — visual design truth
3. Sanity content — runtime content
4. Existing code — current implementation

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

NEVER set "Approved by: Claude". Only Igor approves decisions.

### Required Sections
1. Context, 2. Options Considered (at least 2), 3. Decision, 4. Rationale, 5. Consequences, 6. Implementation Plan, 7. Related (DEC, OBS, PR)

---

## Obstacle Log Protocol

### When to Create
- Live site diverges from design-source
- Build fails non-trivially
- External blocker hit
- Dependency version conflict
- Test fails with unclear cause
- Any rollback
- QA reports P0 or P1

### Severity
| Level | Definition | Action |
|---|---|---|
| P0 | Production broken, data loss | Stop everything. Notify immediately. |
| P1 | Visible bug, broken UX, schema fail | Block merge. Must fix. |
| P2 | Performance/a11y, minor visual | Fix this sprint. |
| P3 | Cosmetic | Backlog. |

### Entry Lifecycle
`open` → `investigating` → `resolved` | `accepted-as-is` | `blocked-on-igor`

### Close-Out Criteria
1. Resolution documented, 2. PR merged (if any), 3. Linked DEC entries updated, 4. Igor confirmed

---

## File Naming

- Decision logs: `DEC-XXX-short-name.md` (zero-padded 3 digits)
- Obstacle logs: `OBS-XXX-short-name.md`
- Runbooks: `RB-XXX-name.md`
- Templates: `<name>.template.md`

---

## Lessons Format

```markdown
## YYYY-MM-DD — <one-line summary>

**Context:** <what was being worked on>
**What went wrong:** <the mistake>
**Rule for next time:** <prevention rule>
**Related:** <DEC-XXX, OBS-XXX, PR link>
```

---

## Cross-Reference Rules

- Every DEC links to related OBS entries and PRs
- Every OBS links to related DEC entries and PRs
- Index tables in README files must stay current
- No orphan references — if you cite a DEC or OBS, it must exist
