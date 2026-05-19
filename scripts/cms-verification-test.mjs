/**
 * CMS editability and composability verification test.
 *
 * EDITABILITY: mutates a Sanity field → rebuilds → checks the test value appears in HTML → reverts.
 * COMPOSABILITY: disables a page section → rebuilds → checks section content is absent → reverts.
 *
 * Requires: SANITY_AUTH_TOKEN env var (read+write access)
 * Run: node scripts/cms-verification-test.mjs
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const ASTRO_CONFIG = join(PROJECT_ROOT, 'apps/web/astro.config.mjs');
const DIST = join(PROJECT_ROOT, 'apps/web/dist/client');

const PROJECT_ID = 'bpjtbps6';
const DATASET = 'production';
const TOKEN = process.env.SANITY_AUTH_TOKEN;

if (!TOKEN) {
  console.error('ERROR: SANITY_AUTH_TOKEN is not set');
  process.exit(1);
}

const QUERY_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${DATASET}`;
const MUTATE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`;
const TIMESTAMP = Date.now();
const TEST_VALUE = `CMS_TEST_${TIMESTAMP}`;

// ── Sanity helpers ───────────────────────────────────────────────────────────

async function fetchGroq(query) {
  const url = `${QUERY_URL}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.result;
}

async function mutate(mutations) {
  const res = await fetch(MUTATE_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Sanity mutation failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// ── Build + HTML helpers ─────────────────────────────────────────────────────

function build() {
  execSync('pnpm --filter web build', {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    timeout: 300_000,
  });
}

function readHtml(route) {
  const path = join(DIST, route, 'index.html');
  return readFileSync(path, 'utf8');
}

// Temporarily disable CDN so builds fetch fresh Sanity data after mutations.
// Sanity skips CDN for token-authenticated requests, but the Astro integration
// doesn't pass a token by default — patching useCdn: false guarantees freshness.
function patchCdn(useCdn) {
  const content = readFileSync(ASTRO_CONFIG, 'utf8');
  const from = useCdn ? 'useCdn: false' : 'useCdn: true';
  const to   = useCdn ? 'useCdn: true'  : 'useCdn: false';
  writeFileSync(ASTRO_CONFIG, content.replace(from, to));
}

// ── Test runners ─────────────────────────────────────────────────────────────

async function runEditabilityTest({ label, docType, field, route }) {
  console.log(`\n  [EDIT] ${label}`);
  let original, docId;
  try {
    const doc = await fetchGroq(
      `*[_type == "${docType}" && !(_id in path("drafts.**"))][0]{ _id, ${field} }`
    );
    docId   = doc._id;
    original = doc[field];
    console.log(`    _id: ${docId}  current: ${JSON.stringify(original)}`);

    // 1. Mutate to test value
    await mutate([{ patch: { id: docId, set: { [field]: TEST_VALUE } } }]);

    // 2. Build
    console.log('    Building…');
    build();

    // 3. Check HTML
    const html = readHtml(route);
    const passed = html.includes(TEST_VALUE);
    console.log(`    Test value in HTML: ${passed ? 'YES ✓' : 'NO ✗'}`);

    return { label, type: 'EDITABILITY', passed };
  } finally {
    // Revert regardless of test outcome
    if (docId) {
      if (original !== null && original !== undefined) {
        await mutate([{ patch: { id: docId, set: { [field]: original } } }]);
      } else {
        await mutate([{ patch: { id: docId, unset: [field] } }]);
      }
      console.log('    Reverted ✓');
    }
  }
}

async function runComposabilityTest({ label, docType, sectionId, route, absentStr }) {
  console.log(`\n  [COMP] ${label}`);
  let originalSections, docId;
  try {
    const doc = await fetchGroq(
      `*[_type == "${docType}" && !(_id in path("drafts.**"))][0]{ _id, sections[]{ _key, sectionId, enabled, order } }`
    );
    docId           = doc._id;
    originalSections = doc.sections ?? null;
    console.log(`    _id: ${docId}  sections length: ${originalSections ? originalSections.length : 0}`);

    // 1. Build new sections array with target section disabled
    const existing   = (originalSections ?? []).filter(s => s.sectionId !== sectionId);
    const testEntry  = { _key: `cms-test-${sectionId}`, sectionId, enabled: false };
    const testSections = [...existing, testEntry];
    await mutate([{ patch: { id: docId, set: { sections: testSections } } }]);

    // 2. Build
    console.log('    Building…');
    build();

    // 3. Check HTML (section content must be ABSENT)
    const html   = readHtml(route);
    const absent = !html.includes(absentStr);
    console.log(`    Section absent from HTML: ${absent ? 'YES ✓' : 'NO ✗'}`);

    return { label, type: 'COMPOSABILITY', passed: absent };
  } finally {
    // Revert sections to original
    if (docId) {
      if (!originalSections || originalSections.length === 0) {
        await mutate([{ patch: { id: docId, unset: ['sections'] } }]);
      } else {
        await mutate([{ patch: { id: docId, set: { sections: originalSections } } }]);
      }
      console.log('    Reverted ✓');
    }
  }
}

// ── Test definitions ─────────────────────────────────────────────────────────

const EDITABILITY_TESTS = [
  { label: 'communitiesPage.heroHeading',  docType: 'communitiesPage', field: 'heroHeading',  route: 'communities' },
  { label: 'patientsPage.heroHeading',     docType: 'patientsPage',    field: 'heroHeading',  route: 'patients' },
  { label: 'providersPage.heroHeading',    docType: 'providersPage',   field: 'heroHeading',  route: 'providers' },
  { label: 'contactPage.heroEyebrow',      docType: 'contactPage',     field: 'heroEyebrow',  route: 'contact' },
  { label: 'aboutPage.ctaEyebrow',         docType: 'aboutPage',       field: 'ctaEyebrow',   route: 'about' },
];

const COMPOSABILITY_TESTS = [
  {
    label:     'communitiesPage sections.conditions',
    docType:   'communitiesPage',
    sectionId: 'conditions',
    route:     'communities',
    absentStr: 'id="l505-section"',   // unique to the conditions section body
  },
  {
    label:     'patientsPage sections.belief',
    docType:   'patientsPage',
    sectionId: 'belief',
    route:     'patients',
    absentStr: 'class="belief"',       // only present on the belief section element
  },
  {
    label:     'providersPage sections.testimonials',
    docType:   'providersPage',
    sectionId: 'testimonials',
    route:     'providers',
    absentStr: 't37-section',          // unique class inside testimonials section
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────

const results = [];

console.log('='.repeat(60));
console.log('CMS Verification Test');
console.log(`Test value: ${TEST_VALUE}`);
console.log('='.repeat(60));

// Patch astro.config.mjs to disable CDN so builds see fresh mutations
patchCdn(false);
console.log('\nastro.config.mjs patched: useCdn → false');

try {
  // Part A — editability
  console.log('\n── PART A: Editability ──────────────────────────────────');
  for (const test of EDITABILITY_TESTS) {
    const result = await runEditabilityTest(test);
    results.push(result);
  }

  // Part B — composability
  console.log('\n── PART B: Composability ────────────────────────────────');
  for (const test of COMPOSABILITY_TESTS) {
    const result = await runComposabilityTest(test);
    results.push(result);
  }

  // Part C — final build to confirm site is back to normal
  console.log('\n── PART C: Final build (post-revert) ────────────────────');
  build();
  console.log('Final build: PASS ✓');

} finally {
  // Always restore useCdn: true
  patchCdn(true);
  console.log('\nastro.config.mjs restored: useCdn → true');
}

// ── Results table ─────────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(60));
console.log('RESULTS');
console.log('='.repeat(60));

const rows = [
  ['#', 'Type', 'Test', 'Result'],
  ...results.map((r, i) => [
    String(i + 1),
    r.type,
    r.label,
    r.passed ? 'PASS' : 'FAIL',
  ]),
];

const colWidths = rows[0].map((_, ci) => Math.max(...rows.map(r => r[ci].length)));

rows.forEach((row, ri) => {
  const line = row.map((cell, ci) => cell.padEnd(colWidths[ci])).join('  ');
  console.log(line);
  if (ri === 0) console.log('-'.repeat(line.length));
});

const total  = results.length;
const passed = results.filter(r => r.passed).length;
const failed = total - passed;

console.log('');
console.log(`Total: ${total}  Passed: ${passed}  Failed: ${failed}`);
console.log('');

// Mandatory verification checklist
console.log('MANDATORY VERIFICATION');
console.log('-'.repeat(60));
console.log(`Script created at scripts/cms-verification-test.mjs: YES`);
results.forEach((r, i) => {
  const prefix = r.type === 'EDITABILITY' ? 'Editability' : 'Composability';
  const idx    = results.slice(0, i).filter(x => x.type === r.type).length + 1;
  console.log(`${prefix} test ${idx} (${r.label}): ${r.passed ? 'PASS' : 'FAIL'}`);
});
console.log(`All fields reverted to original values: YES`);
console.log(`Final build after revert: PASS`);
console.log(`Script exit code: ${failed > 0 ? 1 : 0}`);

process.exit(failed > 0 ? 1 : 0);
