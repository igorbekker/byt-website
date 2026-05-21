/**
 * Seed residentReferralPage singleton with current hardcoded values.
 * Published document only — no "drafts." prefix.
 * Run: node scripts/seed-resident-referral-page.mjs
 */

const PROJECT_ID = 'bpjtbps6';
const DATASET = 'production';
const TOKEN = process.env.SANITY_AUTH_TOKEN || process.env.BYT_SANITY_TOKEN;

if (!TOKEN) {
  console.error('ERROR: Set SANITY_AUTH_TOKEN or BYT_SANITY_TOKEN');
  process.exit(1);
}

const mutations = [
  {
    createOrReplace: {
      _id: 'residentReferralPage',
      _type: 'residentReferralPage',
      pageTitle: 'Resident Referral Form | Better You Therapy',
      metaDescription:
        'Submit a resident or patient referral securely. All information is transmitted and stored in full HIPAA compliance.',
      heroHeading: 'Resident Referral Form',
      heroDescription:
        'Submit a resident or patient referral securely. All information is transmitted and stored in full HIPAA compliance.',
      hipaaNotice:
        'This form is HIPAA-compliant. All data is encrypted and transmitted securely.',
      sidebarInstructions:
        'Please include the completed referral form, resident face sheet, copies of insurance cards (front and back), and any pertinent clinical information.',
    },
  },
];

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

console.log('residentReferralPage seeded:', JSON.stringify(result, null, 2));
