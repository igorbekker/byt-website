# HOOK_06: Studio Sync Check

**Trigger:** After every Studio deploy
**Purpose:** Ensure the Studio is serving the correct schema version with all tools

**Why this hook exists:** The Sanity Studio was deployed from stale clones 4 times. Each time, new schema fields didn't appear. Each required Igor to escalate.

## CC Prompt Template

```
TASK: Verify Sanity Studio sync after deploy

1. Run from /home/personal/projects/byt-website/apps/studio:
   npx sanity schema extract 2>&1

2. Check for:
   - Schema extracts without errors
   - All singleton types present: homePage, aboutPage, communitiesPage, patientsPage, providersPage, careersPage, contactPage, privacyPage, termsPage, blogIndexPage, siteSettings, formSettings
   - All document types present: condition, testimonial, blogPost, blogCategory, author, jobPosting, formOption, redirect
   - Key fields present: search for noCostCards, processSteps, routerCards, twoWaysTracks

3. Check custom tools:
   - DocxImportTool registered in sanity.config.ts
   - RedirectManager registered in sanity.config.ts

4. Check deploy source:
   - Run: pwd — must be /home/personal/projects/byt-website/apps/studio
   - Run: git log --oneline -1 — must match latest origin/main commit

FAIL CONDITIONS:
- Schema extract errors
- Missing singleton or document types
- Missing custom tools
- Deploy from wrong directory
- Local commit behind origin/main

MANDATORY VERIFICATION:
☐ Schema extract: PASS/FAIL
☐ All singletons present: YES/NO — list any missing
☐ All document types present: YES/NO — list any missing
☐ Custom tools registered: YES/NO
☐ Deploy directory: ___
☐ Local commit matches origin/main: YES/NO
☐ PASS/FAIL: ___
```
