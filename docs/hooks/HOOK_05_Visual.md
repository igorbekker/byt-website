# HOOK_05: Visual Regression Check

**Trigger:** After any template or CSS change
**Purpose:** Ensure the rendered page looks identical to before (unless the change was intentional)

**Why this hook exists:** During the CMS parity fix, a CTA button was converted from a working modal trigger to a self-linking anchor. The structural change was claimed as "no change" in the verification.

## CC Prompt Template

```
TASK: Visual regression check on [PAGE]

1. Build the site: pnpm --filter web build
2. Confirm build completes with 0 errors
3. Check the built HTML for [PAGE]:
   - File exists and has reasonable size (>10KB for content pages)
   - No error messages in the HTML output
4. Check for broken elements:
   - All images have valid src paths (no 404-producing paths)
   - All internal links point to existing routes
   - No unclosed HTML tags in the output
   - No JavaScript errors visible in the build output
5. If CTAs exist on the page:
   - Verify onclick handlers are present (openModal pattern)
   - Verify no self-linking CTAs (href pointing to current page)

MANDATORY VERIFICATION:
☐ Build: PASS/FAIL
☐ HTML file size: ___ bytes
☐ Broken images found: ___
☐ Broken links found: ___
☐ CTA check: PASS/FAIL
```
