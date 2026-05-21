#!/usr/bin/env bash
# Performance Check (Core Web Vitals patterns)
# 9 checks against the built dist/ output.
# Run after: pnpm --filter web build
# Exits non-zero if any check fails.

set -euo pipefail

DIST="apps/web/dist"
CSS_DIR="$DIST/_astro"
ERRORS=0

pass() { echo "✅ PASS [$1]: $2"; }
fail() { echo "❌ FAIL [$1]: $2"; ERRORS=$((ERRORS + 1)); }

if [ ! -d "$DIST" ]; then
  echo "❌ ERROR: dist/ not found at $DIST. Run: pnpm --filter web build"
  exit 1
fi

echo "=== Performance Check (dist/) ==="

HTML_PAGES=$(find "$DIST" -name "index.html" | sort)

# CHECK 1: fetchpriority="high" on at least one img (LCP candidate)
FP_COUNT=$(grep -rh 'fetchpriority="high"' $HTML_PAGES 2>/dev/null | wc -l | tr -d ' ')
FP_COUNT="${FP_COUNT:-0}"
if [ "$FP_COUNT" -gt "0" ]; then
  pass "CHECK_01 fetchpriority=high" "found on $FP_COUNT img(s) across pages"
else
  fail "CHECK_01 fetchpriority=high" "no img has fetchpriority=\"high\" — LCP image needs this"
fi

# CHECK 2: loading="lazy" on at least one img
LAZY_COUNT=$(grep -rh 'loading="lazy"' $HTML_PAGES 2>/dev/null | wc -l | tr -d ' ')
LAZY_COUNT="${LAZY_COUNT:-0}"
if [ "$LAZY_COUNT" -gt "0" ]; then
  pass "CHECK_02 loading=lazy" "found on $LAZY_COUNT img(s) across pages"
else
  fail "CHECK_02 loading=lazy" "no img has loading=\"lazy\" — below-fold images need this"
fi

# CHECK 3: decoding="async" on at least one img
DA_COUNT=$(grep -rh 'decoding="async"' $HTML_PAGES 2>/dev/null | wc -l | tr -d ' ')
DA_COUNT="${DA_COUNT:-0}"
if [ "$DA_COUNT" -gt "0" ]; then
  pass "CHECK_03 decoding=async" "found on $DA_COUNT img(s) across pages"
else
  fail "CHECK_03 decoding=async" "no img has decoding=\"async\""
fi

# CHECK 4: no CSS @import for fonts (should use <link> tags instead)
IMPORT_COUNT=$(grep -rh "@import" "$CSS_DIR"/ 2>/dev/null | grep -ci "font" || true)
IMPORT_COUNT="${IMPORT_COUNT:-0}"
if [ "$IMPORT_COUNT" -gt "0" ]; then
  fail "CHECK_04 no @import fonts" "$IMPORT_COUNT CSS @import for fonts found — use <link rel=preload> instead"
  grep -rh "@import" "$CSS_DIR"/ | grep -i "font" | head -5
else
  pass "CHECK_04 no @import fonts" "no CSS @import for fonts"
fi

# CHECK 5: content-visibility present in CSS (off-screen rendering optimization)
if grep -rq "content-visibility" "$CSS_DIR"/ 2>/dev/null; then
  pass "CHECK_05 content-visibility" "found in dist CSS"
else
  fail "CHECK_05 content-visibility" "content-visibility not found in any dist CSS — add to below-fold sections"
fi

# CHECK 6: preconnect cdn.sanity.io present
PC_COUNT=$(grep -rh "preconnect.*cdn.sanity.io" $HTML_PAGES 2>/dev/null | wc -l | tr -d ' ')
PC_COUNT="${PC_COUNT:-0}"
if [ "$PC_COUNT" -gt "0" ]; then
  pass "CHECK_06 preconnect cdn.sanity.io" "preconnect link present ($PC_COUNT page(s))"
else
  fail "CHECK_06 preconnect cdn.sanity.io" "no preconnect to cdn.sanity.io found — all pages need this"
fi

# CHECK 7: no render-blocking scripts in head (external scripts must have async or defer)
RB_MISSING=0
for page in $HTML_PAGES; do
  python3 - "$page" <<'PYEOF'
import re, sys
f = sys.argv[1]
with open(f) as fh:
    content = fh.read()
head_m = re.search(r'<head>(.*?)</head>', content, re.DOTALL)
if not head_m:
    sys.exit(0)
head = head_m.group(1)
scripts = re.findall(r'<script[^>]+src=[^>]*>', head)
blocking = [s for s in scripts if 'async' not in s and 'defer' not in s and 'type="module"' not in s]
if blocking:
    for b in blocking:
        print(f'  render-blocking in {f.split("dist/")[1]}: {b[:100]}')
PYEOF
done 2>/dev/null
RB_COUNT=$(for page in $HTML_PAGES; do
  python3 - "$page" <<'PYEOF'
import re, sys
f = sys.argv[1]
with open(f) as fh:
    content = fh.read()
head_m = re.search(r'<head>(.*?)</head>', content, re.DOTALL)
if not head_m:
    sys.exit(0)
head = head_m.group(1)
scripts = re.findall(r'<script[^>]+src=[^>]*>', head)
blocking = [s for s in scripts if 'async' not in s and 'defer' not in s and 'type="module"' not in s]
for b in blocking:
    print('1')
PYEOF
done 2>/dev/null | wc -l | tr -d ' ')
RB_COUNT="${RB_COUNT:-0}"
if [ "$RB_COUNT" -gt "0" ]; then
  fail "CHECK_07 no render-blocking scripts" "$RB_COUNT render-blocking external script(s) in head"
else
  pass "CHECK_07 no render-blocking scripts" "no render-blocking external scripts in head"
fi

# CHECK 8: overflow-wrap present in CSS (prevents long-word overflow)
if grep -rq "overflow-wrap" "$CSS_DIR"/ 2>/dev/null; then
  pass "CHECK_08 overflow-wrap" "overflow-wrap found in dist CSS"
else
  fail "CHECK_08 overflow-wrap" "overflow-wrap not found in dist CSS"
fi

# CHECK 9: font: inherit on form elements
if grep -rq "font:inherit\|font: inherit" "$CSS_DIR"/ 2>/dev/null; then
  pass "CHECK_09 font inherit" "font: inherit found in dist CSS (form elements inherit font)"
else
  fail "CHECK_09 font inherit" "font: inherit not found in dist CSS — form elements need this"
fi

echo ""
if [ "$ERRORS" -gt "0" ]; then
  echo "==========================================="
  echo "❌ BLOCKED: $ERRORS performance violation(s) found."
  echo "Fix all issues before committing."
  echo "==========================================="
  exit 1
fi

echo "✅ Performance check passed (9/9)."
exit 0
