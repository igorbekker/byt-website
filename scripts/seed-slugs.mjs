/**
 * Seed slug and oldSlugs fields on all 11 page singletons.
 * Patches published documents only — does not overwrite unrelated fields.
 * Run: node scripts/seed-slugs.mjs
 */

const PROJECT_ID = 'bpjtbps6';
const DATASET = 'production';
const TOKEN = process.env.SANITY_AUTH_TOKEN || process.env.BYT_SANITY_TOKEN;

if (!TOKEN) {
  console.error('ERROR: Set SANITY_AUTH_TOKEN or BYT_SANITY_TOKEN');
  process.exit(1);
}

const PAGES = [
  { _id: 'homePage', slug: '' },
  { _id: 'aboutPage', slug: 'about' },
  { _id: 'patientsPage', slug: 'patients' },
  { _id: 'communitiesPage', slug: 'communities' },
  { _id: 'providersPage', slug: 'providers' },
  { _id: 'careersPage', slug: 'careers' },
  { _id: 'contactPage', slug: 'contact' },
  { _id: 'privacyPage', slug: 'privacy' },
  { _id: 'termsPage', slug: 'terms' },
  { _id: 'residentReferralPage', slug: 'resident-referral' },
  { _id: 'blogIndexPage', slug: 'blog' },
];

const mutations = PAGES.map(({ _id, slug }) => ({
  patch: {
    id: _id,
    set: { slug, oldSlugs: [] },
  },
}));

const url = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`;

const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  },
  body: JSON.stringify({ mutations }),
});

const result = await res.json();

if (!res.ok) {
  console.error('Mutation failed:', JSON.stringify(result, null, 2));
  process.exit(1);
}

for (const page of PAGES) {
  const outcome = result.results?.find((r) => r.id === page._id);
  console.log(`patched ${page._id} → slug: "${page.slug}" | operation: ${outcome?.operation ?? 'unknown'}`);
}
