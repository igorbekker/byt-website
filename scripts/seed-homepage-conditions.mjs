/**
 * Seed 4 homepage condition documents with showOnHomepage: true.
 * Run: node scripts/seed-homepage-conditions.mjs
 */

const PROJECT_ID = 'bpjtbps6';
const DATASET = 'production';
const TOKEN = process.env.SANITY_AUTH_TOKEN;

if (!TOKEN) {
  console.error('SANITY_AUTH_TOKEN not set');
  process.exit(1);
}

const conditions = [
  {
    _id: 'condition-homepage-depression',
    _type: 'condition',
    tagline: 'Depression',
    heading: 'Depression & Anxiety',
    body: 'Persistent sadness, worry, and overwhelm are treatable. Our licensed therapists provide evidence-based care that meets you or your loved one where they are.',
    primaryCta: { label: 'Book a session', href: '/individual-therapy/' },
    secondaryCta: { label: 'Refer a resident', href: '/referral/' },
    order: 1,
    showOnHomepage: true,
    showOnPatients: false,
    showOnCommunities: false,
  },
  {
    _id: 'condition-homepage-grief',
    _type: 'condition',
    tagline: 'Grief & Loss',
    heading: 'Grief, Loss & Life Transitions',
    body: 'Loss of a loved one, a role, or a way of life — grief takes many forms. We provide a safe space to process and move forward.',
    primaryCta: { label: 'Book a session', href: '/individual-therapy/' },
    secondaryCta: { label: 'Refer a resident', href: '/referral/' },
    order: 2,
    showOnHomepage: true,
    showOnPatients: false,
    showOnCommunities: false,
  },
  {
    _id: 'condition-homepage-trauma',
    _type: 'condition',
    tagline: 'Trauma',
    heading: 'PTSD & Trauma',
    body: 'Trauma-informed care from licensed therapists who understand how past experiences shape present wellbeing.',
    primaryCta: { label: 'Book a session', href: '/individual-therapy/' },
    secondaryCta: { label: 'Refer a resident', href: '/referral/' },
    order: 3,
    showOnHomepage: true,
    showOnPatients: false,
    showOnCommunities: false,
  },
  {
    _id: 'condition-homepage-relationships',
    _type: 'condition',
    tagline: 'Relationships',
    heading: 'Relationships, Couples & Family',
    body: 'Communication, conflict, and connection — for couples, families, and caregivers navigating change together.',
    primaryCta: { label: 'Book a session', href: '/individual-therapy/' },
    secondaryCta: { label: 'Refer a resident', href: '/referral/' },
    order: 4,
    showOnHomepage: true,
    showOnPatients: false,
    showOnCommunities: false,
  },
];

const mutations = conditions.map((doc) => ({ createOrReplace: doc }));

const res = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  }
);

const data = await res.json();
if (!res.ok) {
  console.error('Mutation failed:', JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log('Result:', JSON.stringify(data, null, 2));
console.log(`\nSeeded ${conditions.length} condition documents.`);
