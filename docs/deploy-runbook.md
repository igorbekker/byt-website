# Deploy Runbook

---

## Astro Web App

Cloudflare Pages auto-deploys on every push to `main`. No manual step required.

```bash
git push origin main
```

Wait for the Cloudflare Pages build to complete. Check status in the Cloudflare dashboard or via the Pages API.

**If auto-deploy fails with auth error:**

```bash
source ~/.profile
# then retry push
```

---

## Sanity Studio

Studio is deployed separately from the web app. Deploy after any schema change.

```bash
cd apps/studio
SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy --yes
```

`SANITY_DEPLOY_TOKEN` is an Administrator-role Sanity token stored in `~/.profile`. Source `~/.profile` if the variable is not in the current shell.

Studio URL: `https://byt-website.sanity.studio`

---

## Cloudflare Pages Environment Variables

To add or update env vars in Cloudflare Pages (both Production and Preview):

```bash
source ~/.profile  # loads BYT_CF_PAGES_TOKEN

CF_ACCOUNT_ID=<your-account-id>
CF_PROJECT=byt-website  # Cloudflare Pages project name

curl -s -X PATCH \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/pages/projects/$CF_PROJECT" \
  -H "Authorization: Bearer $BYT_CF_PAGES_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deployment_configs": {
      "production": {
        "env_vars": {
          "PUBLIC_FORMSPREE_CONTACT_ID": {"value": "..."}
        }
      },
      "preview": {
        "env_vars": {
          "PUBLIC_FORMSPREE_CONTACT_ID": {"value": "..."}
        }
      }
    }
  }'
```

Use `BYT_CF_PAGES_TOKEN`, not `CLOUDFLARE_API_TOKEN` — the general token lacks Pages:Edit scope.

See `docs/env-registry.md` for the full variable list.

---

## Content Seeding

Seeding creates or patches Sanity documents via the Mutations API. Requires `SANITY_API_TOKEN` with write access.

```bash
source ~/.profile

curl -s -X POST \
  "https://bpjtbps6.api.sanity.io/v2021-06-07/data/mutate/production" \
  -H "Authorization: Bearer $SANITY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mutations": [{
      "createOrReplace": {
        "_type": "homePage",
        "_id": "homePage",
        "heroHeading": "..."
      }
    }]
  }'
```

- Singleton document IDs match the schema type name (e.g., `homePage`, `siteSettings`)
- All singleton documents should exist before running a production build
- Blog content (blogPost, blogCategory, author) is seeded in Phase 6

---

## Post-Deploy Smoke Check

After any deploy to production, verify:

1. Homepage loads at `getbetteryou.com`
2. All Tier 1 pages load: `/about`, `/patients`, `/providers`, `/communities`, `/careers`, `/contact`
3. Legal pages load: `/privacy`, `/terms`
4. Studio accessible at `getbetteryou.com/admin`
5. Contact form posts successfully (Formspree endpoint)
6. Sitemap reachable at `/sitemap-index.xml` or `/sitemap.xml`

If any check fails: rollback (revert the merge commit), log an obstacle.
