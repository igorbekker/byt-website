#!/usr/bin/env bash
# Accessibility Check (WCAG 2.2 AA)
# 10 checks against the built dist/ output.
# Run after: pnpm --filter web build
# Exits non-zero if any check fails.

set -euo pipefail

DIST="apps/web/dist"
CSS_DIR="$DIST/_astro"
ERRORS=0
WARNINGS=0

pass() { echo "✅ PASS [$1]: $2"; }
fail() { echo "❌ FAIL [$1]: $2"; ERRORS=$((ERRORS + 1)); }
warn() { echo "⚠️  WARN [$1]: $2"; WARNINGS=$((WARNINGS + 1)); }

if [ ! -d "$DIST" ]; then
  echo "❌ ERROR: dist/ not found at $DIST. Run: pnpm --filter web build"
  exit 1
fi

echo "=== Accessibility Check (dist/) ==="

# Gather all HTML pages
HTML_PAGES=$(find "$DIST" -name "index.html" | sort)

# CHECK 1: html lang attribute
LANG_MISSING=0
for page in $HTML_PAGES; do
  if ! grep -qE '<html[^>]+lang=' "$page" 2>/dev/null; then
    echo "  missing lang: ${page#$DIST/}"
    LANG_MISSING=$((LANG_MISSING + 1))
  fi
done
if [ "$LANG_MISSING" -gt "0" ]; then
  fail "CHECK_01 html[lang]" "$LANG_MISSING page(s) missing lang attribute"
else
  pass "CHECK_01 html[lang]" "lang attribute on all pages"
fi

# CHECK 2: viewport no maximum-scale or user-scalable=no
VIEWPORT_ISSUES=0
for page in $HTML_PAGES; do
  if grep -qE "maximum-scale|user-scalable=no" "$page" 2>/dev/null; then
    echo "  viewport restriction found: ${page#$DIST/}"
    VIEWPORT_ISSUES=$((VIEWPORT_ISSUES + 1))
  fi
done
if [ "$VIEWPORT_ISSUES" -gt "0" ]; then
  fail "CHECK_02 viewport" "$VIEWPORT_ISSUES page(s) restrict zoom (maximum-scale or user-scalable=no)"
else
  pass "CHECK_02 viewport" "no zoom-blocking viewport restrictions"
fi

# CHECK 3: all img have alt attribute
ALT_MISSING=0
for page in $HTML_PAGES; do
  count=$(grep -oE '<img[^>]*>' "$page" 2>/dev/null | grep -cvE ' alt=' || true)
  if [ "${count:-0}" -gt "0" ]; then
    echo "  $count img(s) missing alt in: ${page#$DIST/}"
    ALT_MISSING=$((ALT_MISSING + count))
  fi
done
if [ "$ALT_MISSING" -gt "0" ]; then
  fail "CHECK_03 img[alt]" "$ALT_MISSING image(s) missing alt attribute"
else
  pass "CHECK_03 img[alt]" "all images have alt attributes"
fi

# CHECK 4: content images (with srcset) have width+height — WARN only until all pages updated
# Logo/nav images are CSS-sized and excluded from this check.
DIMS_MISSING=0
for page in $HTML_PAGES; do
  python3 - "$page" <<'PYEOF'
import re, sys
f = sys.argv[1]
with open(f) as fh:
    content = fh.read()
imgs = re.findall(r'<img[^>]+>', content)
for img in imgs:
    if 'srcset=' in img and ('width=' not in img or 'height=' not in img):
        print(f'  missing w/h in {f.split("dist/")[1]}: {img[:120]}')
PYEOF
done 2>/dev/null | head -20
DIMS_COUNT=$(for page in $HTML_PAGES; do
  python3 - "$page" <<'PYEOF'
import re, sys
f = sys.argv[1]
with open(f) as fh:
    content = fh.read()
imgs = re.findall(r'<img[^>]+>', content)
for img in imgs:
    if 'srcset=' in img and ('width=' not in img or 'height=' not in img):
        print('1')
PYEOF
done 2>/dev/null | wc -l | tr -d ' ')
DIMS_COUNT="${DIMS_COUNT:-0}"
if [ "$DIMS_COUNT" -gt "0" ]; then
  warn "CHECK_04 img[width+height]" "$DIMS_COUNT srcset image(s) missing dimensions — fix before next sprint (not yet blocking)"
else
  pass "CHECK_04 img[width+height]" "all srcset images have width+height"
fi

# CHECK 5: nav has aria-label
NAV_MISSING=0
for page in $HTML_PAGES; do
  if ! grep -qE '<nav[^>]+aria-label=' "$page" 2>/dev/null; then
    echo "  missing nav aria-label: ${page#$DIST/}"
    NAV_MISSING=$((NAV_MISSING + 1))
  fi
done
if [ "$NAV_MISSING" -gt "0" ]; then
  fail "CHECK_05 nav[aria-label]" "$NAV_MISSING page(s) missing aria-label on nav"
else
  pass "CHECK_05 nav[aria-label]" "all nav elements have aria-label"
fi

# CHECK 6: sr-only class defined in CSS
if grep -rq "\.sr-only" "$CSS_DIR"/ 2>/dev/null; then
  pass "CHECK_06 .sr-only" ".sr-only class defined in dist CSS"
else
  fail "CHECK_06 .sr-only" ".sr-only not defined in any dist CSS file"
fi

# CHECK 7: color-scheme declared
if grep -q "color-scheme" "$CSS_DIR"/*.css 2>/dev/null; then
  pass "CHECK_07 color-scheme" "color-scheme declared in dist CSS"
else
  fail "CHECK_07 color-scheme" "color-scheme not declared in dist CSS"
fi

# CHECK 8: print stylesheet exists
if grep -rq "@media print" "$CSS_DIR"/ 2>/dev/null; then
  pass "CHECK_08 print stylesheet" "@media print found in dist CSS"
else
  fail "CHECK_08 print stylesheet" "@media print not found in any dist CSS file"
fi

# CHECK 9: z-index tokens present (--z-base, --z-dropdown, --z-modal)
Z_MISSING=0
for token in "z-base" "z-dropdown" "z-modal"; do
  if ! grep -rq -- "--${token}" "$CSS_DIR"/ 2>/dev/null; then
    echo "  missing token: --${token}"
    Z_MISSING=$((Z_MISSING + 1))
  fi
done
if [ "$Z_MISSING" -gt "0" ]; then
  fail "CHECK_09 z-index tokens" "$Z_MISSING z-index token(s) missing from dist CSS"
else
  pass "CHECK_09 z-index tokens" "--z-base, --z-dropdown, --z-modal all present"
fi

# CHECK 10: safe-area env() present
if grep -rq "env(safe-area" "$CSS_DIR"/ 2>/dev/null; then
  pass "CHECK_10 safe-area" "env(safe-area-inset-*) found in dist CSS"
else
  fail "CHECK_10 safe-area" "env(safe-area-inset-*) not found in dist CSS"
fi

echo ""
if [ "$ERRORS" -gt "0" ]; then
  echo "==========================================="
  echo "❌ BLOCKED: $ERRORS accessibility violation(s) found."
  if [ "$WARNINGS" -gt "0" ]; then
    echo "⚠️  WARNINGS: $WARNINGS (non-blocking, fix before next sprint)"
  fi
  echo "Fix all FAILs before committing."
  echo "==========================================="
  exit 1
fi

if [ "$WARNINGS" -gt "0" ]; then
  echo "✅ Accessibility check passed with $WARNINGS warning(s) (fix before next sprint)."
else
  echo "✅ Accessibility check passed (10/10)."
fi
exit 0
