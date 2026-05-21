#!/usr/bin/env bash
# SEO + Schema Check
# 19 checks against the built dist/ output.
# Run after: pnpm --filter web build
# Exits non-zero if any check fails.

set -euo pipefail

DIST="apps/web/dist"
CSS_DIR="$DIST/_astro"
ERRORS=0

# css_has PATTERN: true if pattern exists in _astro/*.css OR inlined in HTML <style> tags
css_has() { grep -rq "$1" "$CSS_DIR"/ 2>/dev/null || grep -rq "$1" $HTML_PAGES 2>/dev/null; }

pass() { echo "✅ PASS [$1]: $2"; }
fail() { echo "❌ FAIL [$1]: $2"; ERRORS=$((ERRORS + 1)); }

if [ ! -d "$DIST" ]; then
  echo "❌ ERROR: dist/ not found at $DIST. Run: pnpm --filter web build"
  exit 1
fi

# ── Pages to check (all top-level HTML pages) ────────────────────────────────
HTML_PAGES=$(find "$DIST" -maxdepth 2 -name "index.html" | sort)
HOMEPAGE="$DIST/index.html"

# ── Helper: check all pages ───────────────────────────────────────────────────
ALL_PASS=true
check_all_pages() {
  local label="$1"
  local pattern="$2"
  local found=0
  local missing=0

  for page in $HTML_PAGES; do
    if grep -qF "$pattern" "$page" 2>/dev/null; then
      found=$((found + 1))
    else
      echo "  missing in: ${page#$DIST/}"
      missing=$((missing + 1))
    fi
  done

  if [ "$missing" -gt "0" ]; then
    fail "$label" "$missing page(s) missing '$pattern'"
  else
    pass "$label" "present on all pages"
  fi
}

echo "=== SEO + Schema Check (dist/) ==="

# CHECK 1: canonical present
check_all_pages "CHECK_01 canonical" 'rel="canonical"'

# CHECK 2: og:title present
check_all_pages "CHECK_02 og:title" 'property="og:title"'

# CHECK 3: og:description present
check_all_pages "CHECK_03 og:description" 'property="og:description"'

# CHECK 4: og:url present
check_all_pages "CHECK_04 og:url" 'property="og:url"'

# CHECK 5: og:type present
check_all_pages "CHECK_05 og:type" 'property="og:type"'

# CHECK 6: og:site_name present
check_all_pages "CHECK_06 og:site_name" 'property="og:site_name"'

# CHECK 7: og:locale present
check_all_pages "CHECK_07 og:locale" 'property="og:locale"'

# CHECK 8: twitter:card present
check_all_pages "CHECK_08 twitter:card" 'name="twitter:card"'

# CHECK 9: twitter:title present
check_all_pages "CHECK_09 twitter:title" 'name="twitter:title"'

# CHECK 10: twitter:description present
check_all_pages "CHECK_10 twitter:description" 'name="twitter:description"'

# CHECK 11: JSON-LD present
check_all_pages "CHECK_11 JSON-LD" 'type="application/ld+json"'

# CHECK 12: theme-color present
check_all_pages "CHECK_12 theme-color" 'name="theme-color"'

# CHECK 13: robots meta present
check_all_pages "CHECK_13 robots meta" 'name="robots"'

# CHECK 14: skip link present
check_all_pages "CHECK_14 skip-link" 'class="skip-link"'

# CHECK 15: main id="main-content" present
check_all_pages "CHECK_15 main#main-content" 'id="main-content"'

# CHECK 16: prefers-reduced-motion in CSS
if css_has "prefers-reduced-motion"; then
  pass "CHECK_16 prefers-reduced-motion" "found in dist CSS"
else
  fail "CHECK_16 prefers-reduced-motion" "not found in any dist CSS file"
fi

# CHECK 17: focus-visible in CSS
if css_has "focus-visible"; then
  pass "CHECK_17 focus-visible" "found in dist CSS"
else
  fail "CHECK_17 focus-visible" "not found in any dist CSS file"
fi

# CHECK 18: breadcrumbs on non-homepage pages
echo ""
echo "--- CHECK_18 breadcrumbs on non-homepage pages ---"
NON_HOMEPAGE=$(find "$DIST" -mindepth 2 -maxdepth 2 -name "index.html" | grep -v "blog/" | sort)
BC_MISSING=0
for page in $NON_HOMEPAGE; do
  if grep -qE "BreadcrumbList|breadcrumb-list|aria-label=\"Breadcrumb\"" "$page" 2>/dev/null; then
    true
  else
    echo "  missing breadcrumbs: ${page#$DIST/}"
    BC_MISSING=$((BC_MISSING + 1))
  fi
done
if [ "$BC_MISSING" -gt "0" ]; then
  fail "CHECK_18 breadcrumbs" "$BC_MISSING non-homepage page(s) missing breadcrumbs"
else
  pass "CHECK_18 breadcrumbs" "present on all non-homepage pages"
fi

# CHECK 19: sitemap-index.xml + robots.txt
if [ -f "$DIST/sitemap-index.xml" ] && [ -f "$DIST/robots.txt" ]; then
  pass "CHECK_19 sitemap+robots" "sitemap-index.xml and robots.txt present"
else
  [ ! -f "$DIST/sitemap-index.xml" ] && echo "  missing: sitemap-index.xml"
  [ ! -f "$DIST/robots.txt" ]        && echo "  missing: robots.txt"
  fail "CHECK_19 sitemap+robots" "sitemap-index.xml and/or robots.txt missing"
fi

echo ""
if [ "$ERRORS" -gt "0" ]; then
  echo "==========================================="
  echo "❌ BLOCKED: $ERRORS SEO/schema violation(s) found."
  echo "Fix all issues before committing."
  echo "==========================================="
  exit 1
fi

echo "✅ SEO + schema check passed (19/19)."
exit 0
