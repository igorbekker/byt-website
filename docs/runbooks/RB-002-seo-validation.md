# RB-002 — SEO Validation

Post-change validation checklist. Run after any SEO, schema, or metadata change before merging to `main`.

## Steps

### 1. Build

```bash
pnpm --filter web build
```

Confirm: no build errors, `dist/` generated.

### 2. Schema Check Script

```bash
bash scripts/seo-schema-check.sh
```

Runs 19 automated checks. All must pass.

### 3. Accessibility Check Script

```bash
bash scripts/a11y-check.sh
```

Runs 10 automated checks. All must pass.

### 4. Performance Check Script

```bash
bash scripts/perf-check.sh
```

Runs 9 automated checks. All must pass.

### 5. Schema.org Validator

For each page that had schema changes:

1. Navigate to [https://validator.schema.org/](https://validator.schema.org/)
2. Paste the rendered HTML or the URL (if deployed to staging).
3. Confirm: zero errors, zero warnings on required fields.

### 6. Google Rich Results Test

For pages with structured data eligible for rich results (BlogPosting, JobPosting):

1. Navigate to the Rich Results Test tool.
2. Test the staging URL.
3. Confirm eligibility for intended rich result type.

### 7. Lighthouse Scores

Run Lighthouse (Chrome DevTools or CI) on the homepage and any changed pages.

| Category       | Minimum Score |
| -------------- | ------------- |
| Performance    | 90            |
| Accessibility  | 95            |
| Best Practices | 95            |
| SEO            | 95            |

If any score is below threshold: diagnose, fix, and re-run before merging.
