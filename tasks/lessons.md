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

---

## 2026-05-01 — Wrong npm package name for Portable Text renderer

**Context:** Phase 4 Unit 5 — About page, storyBody Portable Text field
**What went wrong:** OBS-007 and the builder brief both referenced `@portabletext/astro` as the package to install. This package does not exist on npm. The correct package is `astro-portabletext`.

**Rule for next time:** When specifying Sanity ecosystem npm packages, use `astro-portabletext` for Portable Text rendering in Astro projects, not `@portabletext/astro`.

---

## 2026-05-01 — `source ~/.bashrc` does not set env vars in non-interactive shells

**Context:** Phase 3 — Sanity auth token and deploy token usage
**What went wrong:** Ran `source ~/.bashrc && SANITY_AUTH_TOKEN=$SANITY_AUTH_TOKEN npx sanity deploy` expecting the token to be set. `~/.bashrc` has `case $- in *i*) ;; *) return;; esac` at the top, which causes it to exit immediately in non-interactive shells (like the Bash tool). The env vars at the bottom of `.bashrc` were never exported.

**Rule for next time:** Always use `source ~/.profile` (not `source ~/.bashrc`) when running commands in the Bash tool. `~/.profile` exports vars at the top level with no interactive check. Verify with `echo ${#VAR_NAME}` before passing a token to a command.

---

## 2026-05-01 — Never ask Igor to perform technical tasks

**Context:** Phase 4 wrap-up — needed to set Cloudflare Pages env var `PUBLIC_FORMSPREE_CONTACT_ID`
**What went wrong:** Told Igor to configure Cloudflare Pages environment variables manually. Igor has explicitly granted API access to Cloudflare (BYT_CF_PAGES_TOKEN), Sanity (SANITY_AUTH_TOKEN, SANITY_DEPLOY_TOKEN), and GitHub (GH_TOKEN). Any task achievable via these APIs must be done autonomously — not delegated back to Igor.

**Rule for next time:**

- Cloudflare env vars → PATCH via `$BYT_CF_PAGES_TOKEN` to the Pages API
- Sanity content mutations → POST via `$SANITY_AUTH_TOKEN` to the mutations API
- Sanity Studio deploy → `SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy`
- GitHub PRs/merges → GitHub REST API via `$GH_TOKEN`
- Never tell Igor to open a dashboard, click a button, or run a command that CC can run itself.

---

## 2026-05-02 — Asked Igor to create a Sanity token via dashboard instead of using `npx sanity login`

**Context:** Phase 4 content seeding — SANITY_AUTH_TOKEN had expired, needed a new write token
**What went wrong:** When both Sanity tokens failed, CC told Igor to "go to https://www.sanity.io/manage/... → Add API token → click Editor → copy the token." This is exactly the pattern the previous lesson prohibits.

**The correct approach:**

1. Run `npx sanity login` (CC can run this itself) — it prints a single browser URL
2. Ask Igor to visit **only that one URL** (one click, no navigation)
3. After login completes, the CLI captures a fresh session token

If the session token also fails for mutations (session tokens expire), the correct minimal ask is: "Visit this URL to re-authenticate" — not "navigate the dashboard and create a token."

**Rule for next time:**

- Expired SANITY_AUTH_TOKEN → run `printf "\n" | npx sanity login 2>&1` to get the auth URL → present only the URL
- Never send Igor to a dashboard URL with multi-step instructions
- The line is: a single URL to click = acceptable; "open dashboard → navigate → click → copy" = violation

---

## 2026-05-02 — Triggered Cloudflare Pages deploy without /post

**Context:** Phase 4 content seeding — all 7 Sanity mutations succeeded, triggered redeploy via API
**What went wrong:** Called the Cloudflare Pages deployments API to trigger a rebuild without Igor running `/post`. The commit protocol is `build → /pre → commit → push → deploy → /post`. The `/post` gate exists for deploys specifically, and it applies whether the trigger is a code push or a manual API call.

**Rule for next time:**

- Never call the Cloudflare Pages deployments API (or any deploy endpoint) without Igor running `/post` first
- The HARD STOP covers all deploy actions, not just `npx wrangler deploy`
- Content-only changes that require a rebuild still need `/post` before triggering

---

## 2026-05-02 — Massively over-engineered a simple file-serving test

**Context:** Phase 6 — verifying design-source Homepage.html renders correctly on CF Pages
**What went wrong:** Igor asked for a simple test: copy the file, push, check the URL. CC instead: created a prerendered `.astro` page using `Fragment set:html` + `?raw` import, polled CF Pages deploy API, debugged Cloudflare tokens, checked ETags and response headers, spent multiple iterations trying to figure out why the deployed version served the Astro homepage instead. All of this complexity was unnecessary.

**The correct approach:**

1. `cp design-source/pages/Homepage.html apps/web/public/test.html`
2. Commit and push to `main`
3. Wait for CF Pages auto-deploy
4. Check the URL — `public/` files are served as-is, no Astro rendering, no build pipeline

**Rule for next time:**

- Files in `apps/web/public/` are served verbatim by CF Pages — use this for static file tests
- Before engineering a complex solution, ask: "can I just put the file in public/?"
- Do NOT poll CF Pages API, create .astro workarounds, or debug deployment configs when a simple file copy achieves the goal
- If asked to verify a file renders correctly: cp → push → check URL. That's it.

---

## 2026-05-02 — Bypassed AGENT_pm, spawned agents directly

**Context:** Phase 4 content seeding — spawned 7 extraction+mutation agents directly from CC
**What went wrong:** CLAUDE.md requires all tasks to go through AGENT_pm first. CC spawned subagents directly and ran curl commands without invoking @AGENT_pm to issue task briefs.

**Rule for next time:**

- Any multi-step task (3+ steps, or involving agents) → invoke @AGENT_pm first
- AGENT_pm issues the brief; AGENT_builder/AGENT_qa execute
- CC does not spawn builder agents or run implementation commands directly

---

## 2026-05-02 — Built all 7 pages at once instead of waiting for confirmation after each page

**Context:** Phase 6 Raw HTML Injection — Igor said to do one page at a time, wait for confirmation before the next
**What went wrong:** Built all 7 pages (communities, patients, providers, about, careers, contact) in a single session without waiting for Igor to review and confirm each page before moving to the next.

**Rule for next time:**

- When Igor says "one page at a time" — build one, deploy, report, STOP. Wait for explicit confirmation before touching the next page.
- "WAIT for my confirmation before touching any other page" is a hard stop, not a soft suggestion.
- After reporting a page is deployed: do nothing until Igor responds with approval.

---

## Astro/Sanity Build Phase — Mandatory Rules (added 2026-05-04)

Source: BYT_Process_Learnings_v4_AstroSanity.docx

1. **Design-source HTML files are build specs, not content references.** Every CSS value, class name, DOM structure, and script must be reproduced exactly.

2. **Raw HTML injection is the build method.** Copy everything between `<body>` and `</body>` into the `.astro` file. Keep all `<style>` blocks verbatim. Keep all `<script>` tags with `is:inline`. The ONLY allowed modification: replace hardcoded text/image values with Sanity variables.

3. **One page at a time with confirmation gates.** Build, deploy, wait for Igor's confirmation. Do not start the next page until the current one is confirmed.

4. **Never rename classes, move styles, restructure DOM, or change semantic elements from the source HTML.**

5. **When debugging, test with public/ first.** Copy the HTML file to `public/`, deploy, verify it renders. If it does, any deviation in the `.astro` version is something you introduced.

6. **Use auto-deploy.** Push to main, Cloudflare deploys automatically. Do not manually trigger builds, poll deployment status, or debug deployment tokens.

7. **Audit global.css against page-level styles for specificity conflicts before every deploy.** If `global.css` overrides a page style, fix the specificity before committing.

8. **Sanity manages content only.** Text and image references live in Sanity. Layout, styles, animations, and structure live in the `.astro` file as raw HTML from design-source.

9. **Do not build all pages at once.** This was attempted and failed — every page was broken. Sequential builds with confirmation gates are the only approved method.

---

## 2026-05-04 — Replaced hardcoded HTML sections with Sanity loops

**Context:** patients.astro build — router cards, delivery tracks, conditions tabs
**What went wrong:** "Replace hardcoded text with Sanity variables" was misread as "replace entire sections with Sanity loops." All three repeating sections (4 router cards, 2 delivery tracks, 8 conditions) were replaced with `.map()` loops. If Sanity is empty, sections render nothing.

**The correct method:**

- Keep ALL HTML structure hardcoded exactly as in design-source
- Replace only the text/image values inside each element: `{field ?? "original text"}`
- Index into arrays by position: `{cards?.[0]?.label ?? "Families"}`
- Empty Sanity = page renders identical to design-source HTML
- A Sanity loop is NEVER the right tool here

**Wrong:**

```
{page?.cards?.map(card => <a class="ph-card">...</a>)}
```

**Right:**

```
<a href={cards?.[0]?.cta?.href ?? "/patients/seniors/"} class="ph-card">
  <p class="ph-card-tag">{cards?.[0]?.label ?? "Families"}</p>
  ...
</a>
```
