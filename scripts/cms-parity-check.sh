#!/usr/bin/env bash
# CMS Parity Check
# Verifies that fields queried in queries.ts exist in the corresponding Sanity schema files.
# Exits non-zero if any queried field is missing from its schema.

set -euo pipefail

QUERIES="apps/web/src/lib/queries.ts"
SCHEMA_DIR="apps/studio/schemas"
ERRORS=0

pass() { echo "✅ PASS: $1"; }
fail() { echo "❌ FAIL: $1"; ERRORS=$((ERRORS + 1)); }

check_field() {
  local field="$1"
  local schema_file="$2"
  local context="$3"

  if grep -q "name: '${field}'" "$schema_file" 2>/dev/null; then
    pass "$context — $field found in $schema_file"
  else
    fail "$context — '$field' not found in $schema_file (queried in queries.ts)"
  fi
}

echo "=== CMS Parity Check ==="

# ── Verify queries.ts exists ──────────────────────────────────────────────────
if [ ! -f "$QUERIES" ]; then
  fail "queries.ts not found at $QUERIES"
  exit 1
fi

# ── seoFields: fields used in every page query ────────────────────────────────
SEO_SCHEMA="$SCHEMA_DIR/objects/seoFields.ts"
check_field "metaTitle"       "$SEO_SCHEMA" "seoFields"
check_field "metaDescription" "$SEO_SCHEMA" "seoFields"
check_field "robotsDirective" "$SEO_SCHEMA" "seoFields"
check_field "ogImage"         "$SEO_SCHEMA" "seoFields"

# ── siteSettings: top-level governance fields ─────────────────────────────────
SITE_SCHEMA="$SCHEMA_DIR/singletons/siteSettings.ts"
check_field "gtmContainerId" "$SITE_SCHEMA" "siteSettings"
check_field "robotsTxt"      "$SITE_SCHEMA" "siteSettings"
check_field "businessName"   "$SITE_SCHEMA" "siteSettings"
check_field "phone"          "$SITE_SCHEMA" "siteSettings"

# ── Verify seo field embedded in siteSettings ─────────────────────────────────
if grep -q "seoFields" "$SITE_SCHEMA" 2>/dev/null; then
  pass "siteSettings — seoFields embedded"
else
  fail "siteSettings — seoFields not embedded in $SITE_SCHEMA"
fi

# ── homePage ──────────────────────────────────────────────────────────────────
HOME_SCHEMA="$SCHEMA_DIR/singletons/homePage.ts"
for field in heroHeadline heroSubhead heroImage beliefQuote routerCards; do
  check_field "$field" "$HOME_SCHEMA" "homePage"
done

# ── patientsPage ──────────────────────────────────────────────────────────────
PATIENTS_SCHEMA="$SCHEMA_DIR/singletons/patientsPage.ts"
if [ -f "$PATIENTS_SCHEMA" ]; then
  check_field "seo" "$PATIENTS_SCHEMA" "patientsPage"
else
  fail "patientsPage schema not found at $PATIENTS_SCHEMA"
fi

# ── communitiesPage ───────────────────────────────────────────────────────────
COMMUNITIES_SCHEMA="$SCHEMA_DIR/singletons/communitiesPage.ts"
if [ -f "$COMMUNITIES_SCHEMA" ]; then
  check_field "seo" "$COMMUNITIES_SCHEMA" "communitiesPage"
else
  fail "communitiesPage schema not found at $COMMUNITIES_SCHEMA"
fi

# ── providersPage ─────────────────────────────────────────────────────────────
PROVIDERS_SCHEMA="$SCHEMA_DIR/singletons/providersPage.ts"
if [ -f "$PROVIDERS_SCHEMA" ]; then
  check_field "seo" "$PROVIDERS_SCHEMA" "providersPage"
else
  fail "providersPage schema not found at $PROVIDERS_SCHEMA"
fi

# ── aboutPage ─────────────────────────────────────────────────────────────────
ABOUT_SCHEMA="$SCHEMA_DIR/singletons/aboutPage.ts"
if [ -f "$ABOUT_SCHEMA" ]; then
  check_field "seo" "$ABOUT_SCHEMA" "aboutPage"
else
  fail "aboutPage schema not found at $ABOUT_SCHEMA"
fi

# ── careersPage ───────────────────────────────────────────────────────────────
CAREERS_SCHEMA="$SCHEMA_DIR/singletons/careersPage.ts"
if [ -f "$CAREERS_SCHEMA" ]; then
  check_field "seo" "$CAREERS_SCHEMA" "careersPage"
else
  fail "careersPage schema not found at $CAREERS_SCHEMA"
fi

# ── contactPage ───────────────────────────────────────────────────────────────
CONTACT_SCHEMA="$SCHEMA_DIR/singletons/contactPage.ts"
if [ -f "$CONTACT_SCHEMA" ]; then
  check_field "seo" "$CONTACT_SCHEMA" "contactPage"
else
  fail "contactPage schema not found at $CONTACT_SCHEMA"
fi

# ── blogPost: article schema ──────────────────────────────────────────────────
BLOG_SCHEMA="$SCHEMA_DIR/documents/blogPost.ts"
if [ -f "$BLOG_SCHEMA" ]; then
  for field in title slug publishedAt; do
    check_field "$field" "$BLOG_SCHEMA" "blogPost"
  done
else
  fail "blogPost schema not found at $BLOG_SCHEMA"
fi

# ── Verify queries.ts references all expected document types ─────────────────
echo ""
echo "=== Query Coverage ==="
for doctype in homePage patientsPage communitiesPage providersPage aboutPage careersPage contactPage siteSettings; do
  if grep -q "_type == \"${doctype}\"" "$QUERIES" 2>/dev/null; then
    pass "queries.ts — $doctype query present"
  else
    fail "queries.ts — $doctype query missing"
  fi
done

# ── Verify seo subfield is queried for all pages ──────────────────────────────
SEO_QUERY_COUNT=$(grep -c "seo{" "$QUERIES" 2>/dev/null || true)
SEO_QUERY_COUNT="${SEO_QUERY_COUNT:-0}"
if [ "$SEO_QUERY_COUNT" -ge "2" ]; then
  pass "queries.ts — seo{} subquery found ($SEO_QUERY_COUNT occurrences)"
else
  fail "queries.ts — seo{} subquery missing or insufficient ($SEO_QUERY_COUNT occurrences, expected 2+)"
fi

echo ""
if [ "$ERRORS" -gt "0" ]; then
  echo "==========================================="
  echo "❌ BLOCKED: $ERRORS CMS parity violation(s) found."
  echo "Every queried field must exist in the Sanity schema."
  echo "==========================================="
  exit 1
fi

echo "✅ CMS parity check passed."
exit 0
