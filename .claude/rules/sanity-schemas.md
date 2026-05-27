---
paths: apps/studio/schemas/**
---

# Rules for Sanity Schemas

1. Every image field must use type: 'imageWithAlt'. Never use raw type: 'image'. If stored with _type: 'image', Studio shows empty image wells.

2. Four-Step Triad is mandatory for every schema change:
   - SCHEMA: field defined in the schema .ts file
   - QUERY: field fetched in apps/web/src/lib/queries.ts
   - TEMPLATE: field wired in the .astro template with ?? fallback
   - SEED: field populated in the published Sanity document
   - IMAGE (if image): asset uploaded with _type: 'imageWithAlt'
   If any step is missing, the work is incomplete even if the site renders correctly.

3. After any schema change, update docs/sanity-schema-registry.md with the new or modified fields.

4. After any schema change, Studio must be redeployed:
   - cd /home/personal/projects/byt-website
   - git pull origin main
   - cd apps/studio
   - rm -rf node_modules/.cache dist
   - SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy

5. Mutations target published documents ONLY. No "drafts." prefix on _id. Use patch().set() not setIfMissing().
