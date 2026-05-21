# RB-003 — Rollback Procedures

Three-tier rollback system for production incidents. Choose the tier based on blast radius.

---

## Tier 1 — Checkpoint Rollback

Use when: a recent change introduced a regression and you want to revert to the last known-good checkpoint.

### Steps

1. **Git** — reset to checkpoint tag:

   ```bash
   git reset --hard <checkpoint-tag>
   git push --force origin main
   ```

2. **Cloudflare Pages** — roll back to the checkpoint deployment:
   - Cloudflare Dashboard → Pages → byt-website → Deployments
   - Find the checkpoint deployment → **Rollback to this deployment**

3. **Sanity** — restore content from checkpoint backup:
   - Use `sanity dataset import <checkpoint-backup.tar.gz> production --replace`

---

## Tier 2 — Full Phase 7A Rollback

Use when: Phase 7A changes as a whole need to be reverted (e.g., multiple interacting issues).

### Steps

1. **Git** — reset to the pre-Phase-7A tag:

   ```bash
   git reset --hard v0.8-pre-production-hardening
   git push --force origin main
   ```

2. **Cloudflare Pages** — roll back to the Step 1.2 deployment (first deployment before Phase 7A):
   - Cloudflare Dashboard → Pages → byt-website → Deployments → find Step 1.2 entry → **Rollback**

3. **Sanity** — restore pre-Phase-7A content backup:
   ```bash
   sanity dataset import <pre-7a-backup.tar.gz> production --replace
   ```

---

## Tier 3 — Surgical Rollback

Use when: a single commit introduced a specific regression and a full reset is too disruptive.

### Steps

1. **Git** — revert the offending commit:

   ```bash
   git revert HEAD
   git push origin main
   ```

   Use `git revert <sha>` if the commit is not the most recent.

2. **Sanity** — only if the commit deployed a schema change:
   - Use Sanity Content History to restore the affected documents to their previous state.
   - If a schema type was added: remove it via Studio before importing old content.

---

## Post-Rollback Verification

After any tier rollback:

1. ```bash
   pnpm --filter web build
   ```
2. ```bash
   curl -sI https://beyondyourthreshold.com/ | head -5
   ```
   Expect: `HTTP/2 200`.
3. Verify Sanity data is correct in Studio.
4. Run [RB-002-seo-validation.md](RB-002-seo-validation.md) if SEO files were affected.
