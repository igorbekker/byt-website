# RB-004 — Redirect Management

Operational procedure for adding, editing, and removing redirects.

---

## Adding a New Redirect

1. Open **Sanity Studio → Redirects**.
2. Click **Create new document**.
3. Fill in the fields:
   - `sourcePath` — the old path, e.g. `/old-page/` (include trailing slash)
   - `destinationPath` — the target path, e.g. `/new-page/`
   - `statusCode` — `301` (permanent), `302` (temporary), or `410` (gone)
   - `isActive` — set to `true`
4. Click **Publish**.
5. The webhook fires → Cloudflare Pages rebuild starts (typically < 2 min).
6. Verify:
   ```bash
   curl -sI https://beyondyourthreshold.com/old-page/ | grep -E 'HTTP|location'
   ```
   Expect: `301 Moved Permanently` + `location: https://beyondyourthreshold.com/new-page/`

---

## Editing an Existing Redirect

1. Open **Sanity Studio → Redirects** → find the document by `sourcePath`.
2. Update the desired field(s).
3. Publish → rebuild → verify with `curl`.

---

## Removing / Deactivating a Redirect

- **Deactivate (preferred):** set `isActive = false` and publish. The redirect is excluded from the next build but the document is preserved for audit history.
- **Delete:** only if the document is no longer useful as a reference.

---

## Warnings

1. **Never redirect a path to itself** — even with vs. without trailing slash:
   - Bad: `/communities/` → `/communities` (Cloudflare re-adds the slash → infinite loop)
   - Good: `/communities` → `/new-communities/`

2. **Collapse redirect chains** — if A → B and B → C both exist, replace with A → C directly. Chains add latency and risk hitting Cloudflare's redirect hop limit.

3. **Test before publishing to production** — use the staging URL (`byt-website.pages.dev`) first if the change is high-risk.

---

## Checking All Active Redirects

To audit the current redirect list:

```bash
# After a build, inspect the generated file:
cat apps/web/dist/_redirects
```

Or query Sanity directly:

```bash
sanity documents query '*[_type == "redirect" && isActive == true] | order(sourcePath asc) { sourcePath, destinationPath, statusCode }'
```
