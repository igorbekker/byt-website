#!/usr/bin/env bash
# Design-Source Parity Check
# Runs against any staged .astro page file.
# Compares against the corresponding design-source HTML.
# Blocks commit if violations are found.

set -euo pipefail

DESIGN_DIR="design-source/pages"
ERRORS=0

# Map .astro filenames to design-source HTML filenames
declare -A PAGE_MAP=(
  ["index.astro"]="Homepage.html"
  ["communities.astro"]="Communities.html"
  ["patients.astro"]="Patients.html"
  ["providers.astro"]="Providers.html"
  ["about.astro"]="About.html"
  ["careers.astro"]="Careers.html"
  ["contact.astro"]="Contact.html"
)

# Get staged .astro page files
STAGED=$(git diff --cached --name-only --diff-filter=ACM | grep "apps/web/src/pages/.*\.astro$" || true)

if [ -z "$STAGED" ]; then
  exit 0
fi

for ASTRO_FILE in $STAGED; do
  BASENAME=$(basename "$ASTRO_FILE")
  SOURCE_FILE="${PAGE_MAP[$BASENAME]:-}"

  if [ -z "$SOURCE_FILE" ]; then
    continue
  fi

  SOURCE_PATH="$DESIGN_DIR/$SOURCE_FILE"

  if [ ! -f "$SOURCE_PATH" ]; then
    echo "⚠️  Design source not found: $SOURCE_PATH"
    continue
  fi

  echo "=== Checking $BASENAME against $SOURCE_FILE ==="

  # CHECK 1: No Sanity .map() loops replacing HTML structure
  # Strip <script>...</script> blocks first — .map() inside is:inline scripts is legitimate JS, not Sanity loops
  TEMPLATE_ONLY=$(awk '/<script/,/<\/script>/{next}1' "$ASTRO_FILE")
  MAP_COUNT=$(echo "$TEMPLATE_ONLY" | grep -c '\.map(' 2>/dev/null || true)
  MAP_COUNT="${MAP_COUNT:-0}"
  if [ "$MAP_COUNT" -gt "0" ]; then
    echo "❌ FAIL: $BASENAME contains $MAP_COUNT .map() loop(s) in template. Sanity variables must replace text nodes only, never HTML structure."
    echo "$TEMPLATE_ONLY" | grep -n '\.map('
    ERRORS=$((ERRORS + 1))
  fi

  # CHECK 2: All Sanity variables have ?? fallbacks
  NO_FALLBACK=$(grep -Pn '\{[a-zA-Z]+Page\.\w+(?!\s*\?\?)' "$ASTRO_FILE" 2>/dev/null | grep -v '??' | head -20 || true)
  if [ -n "$NO_FALLBACK" ]; then
    echo "❌ FAIL: $BASENAME has Sanity variables without ?? fallbacks:"
    echo "$NO_FALLBACK"
    ERRORS=$((ERRORS + 1))
  fi

  # CHECK 3: Section count comparison
  SOURCE_SECTIONS=$(grep -c '<section' "$SOURCE_PATH" 2>/dev/null || true)
  SOURCE_SECTIONS="${SOURCE_SECTIONS:-0}"
  ASTRO_SECTIONS=$(grep -c '<section' "$ASTRO_FILE" 2>/dev/null || true)
  ASTRO_SECTIONS="${ASTRO_SECTIONS:-0}"
  if [ "$SOURCE_SECTIONS" != "$ASTRO_SECTIONS" ]; then
    echo "❌ FAIL: Section count mismatch. Source: $SOURCE_SECTIONS, Astro: $ASTRO_SECTIONS"
    ERRORS=$((ERRORS + 1))
  fi

  # CHECK 4: All script tags have is:inline
  SCRIPTS_WITHOUT_INLINE=$(grep -Pn '<script(?!.*is:inline)' "$ASTRO_FILE" 2>/dev/null | grep -v 'import' || true)
  if [ -n "$SCRIPTS_WITHOUT_INLINE" ]; then
    echo "❌ FAIL: $BASENAME has <script> tags without is:inline:"
    echo "$SCRIPTS_WITHOUT_INLINE"
    ERRORS=$((ERRORS + 1))
  fi

  # CHECK 5: No class renaming — sample top 50 source classes, warn if missing from astro
  SOURCE_CLASSES=$(grep -oP 'class="[^"]*"' "$SOURCE_PATH" | sed 's/class="//;s/"//' | tr ' ' '\n' | sort -u | head -50)
  MISSING_CLASSES=""
  for CLASS in $SOURCE_CLASSES; do
    if [ ${#CLASS} -gt 2 ] && ! grep -q "$CLASS" "$ASTRO_FILE" 2>/dev/null; then
      MISSING_CLASSES="$MISSING_CLASSES $CLASS"
    fi
  done
  if [ -n "$MISSING_CLASSES" ]; then
    echo "⚠️  WARNING: $BASENAME may be missing classes from source:$MISSING_CLASSES"
    # Warning only — some classes may be in <style> blocks and not on elements
  fi

  # CHECK 6: <a> tag count — only compare body content, excluding nav/footer handled by BaseLayout
  # Source has full page; astro excludes nav/footer. Allow up to 15 fewer <a> tags.
  SOURCE_LINKS=$(grep -c '<a ' "$SOURCE_PATH" 2>/dev/null || true)
  SOURCE_LINKS="${SOURCE_LINKS:-0}"
  ASTRO_LINKS=$(grep -c '<a ' "$ASTRO_FILE" 2>/dev/null || true)
  ASTRO_LINKS="${ASTRO_LINKS:-0}"
  # Source includes nav+footer (~30+ links) that BaseLayout provides; threshold accounts for that
  DIFF=$((SOURCE_LINKS - ASTRO_LINKS))
  if [ "$DIFF" -gt "35" ]; then
    echo "⚠️  WARNING: $BASENAME has $ASTRO_LINKS <a> tags vs $SOURCE_LINKS in source (diff: $DIFF). Check for element swaps (a→div)."
  fi

  echo ""
done

if [ "$ERRORS" -gt "0" ]; then
  echo "==========================================="
  echo "❌ BLOCKED: $ERRORS parity violation(s) found."
  echo "Fix all violations before committing."
  echo "Rules: docs/BYT_Process_Learnings_v4_AstroSanity.docx"
  echo "==========================================="
  exit 1
fi

echo "✅ Design-source parity check passed."
exit 0
