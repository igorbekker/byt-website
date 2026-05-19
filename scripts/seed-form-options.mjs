/**
 * Seed formOption documents — 52 documents across 10 groups.
 * Uses createOrReplace with deterministic _ids. Published only (no drafts prefix).
 * Run: node scripts/seed-form-options.mjs
 */

const PROJECT_ID = 'bpjtbps6';
const DATASET = 'production';
const TOKEN = process.env.SANITY_AUTH_TOKEN || process.env.BYT_SANITY_TOKEN;

if (!TOKEN) {
  console.error('ERROR: Set SANITY_AUTH_TOKEN or BYT_SANITY_TOKEN');
  process.exit(1);
}

const ALL_OPTIONS = [
  // bookFor — radio buttons
  { group: 'bookFor', label: 'For myself',       value: 'self',       order: 1 },
  { group: 'bookFor', label: 'For a loved one',  value: 'loved-one',  order: 2 },
  { group: 'bookFor', label: 'Couples / family', value: 'couple',     order: 3 },

  // conditionReasons — select
  { group: 'conditionReasons', label: 'Depression or anxiety',            order: 1 },
  { group: 'conditionReasons', label: 'Grief, loss, or life transition',  order: 2 },
  { group: 'conditionReasons', label: 'Trauma / PTSD',                    order: 3 },
  { group: 'conditionReasons', label: 'Relationships, couples, or family',order: 4 },
  { group: 'conditionReasons', label: 'Caregiver stress or burnout',      order: 5 },
  { group: 'conditionReasons', label: 'Something else',                   order: 6 },
  { group: 'conditionReasons', label: 'Not sure yet',                     order: 7 },

  // paymentMethods — select
  { group: 'paymentMethods', label: 'Medicare',                    order: 1 },
  { group: 'paymentMethods', label: 'Private insurance',           order: 2 },
  { group: 'paymentMethods', label: 'Cash-pay / out-of-pocket',    order: 3 },
  { group: 'paymentMethods', label: 'Not sure — please advise',    order: 4 },

  // availabilitySlots — chips
  { group: 'availabilitySlots', label: 'Weekday mornings',   value: 'weekday-am', order: 1 },
  { group: 'availabilitySlots', label: 'Weekday afternoons', value: 'weekday-pm', order: 2 },
  { group: 'availabilitySlots', label: 'Evenings',           value: 'evenings',   order: 3 },
  { group: 'availabilitySlots', label: 'Weekends',           value: 'weekends',   order: 4 },

  // facilityTypes — select
  { group: 'facilityTypes', label: 'Assisted Living (ALF)',    order: 1 },
  { group: 'facilityTypes', label: 'Skilled Nursing (SNF)',    order: 2 },
  { group: 'facilityTypes', label: 'Memory Care',              order: 3 },
  { group: 'facilityTypes', label: 'Continuing Care (CCRC)',   order: 4 },
  { group: 'facilityTypes', label: 'Independent Living',       order: 5 },
  { group: 'facilityTypes', label: 'Other',                    order: 6 },

  // serviceCounties — select
  { group: 'serviceCounties', label: 'Palm Beach',         order: 1 },
  { group: 'serviceCounties', label: 'Broward',            order: 2 },
  { group: 'serviceCounties', label: 'Miami-Dade',         order: 3 },
  { group: 'serviceCounties', label: 'Martin',             order: 4 },
  { group: 'serviceCounties', label: 'St. Lucie',          order: 5 },
  { group: 'serviceCounties', label: 'Okeechobee',         order: 6 },
  { group: 'serviceCounties', label: 'Other Florida county', order: 7 },

  // bedCounts — select
  { group: 'bedCounts', label: 'Under 50',  order: 1 },
  { group: 'bedCounts', label: '50–100',    order: 2 },
  { group: 'bedCounts', label: '100–200',   order: 3 },
  { group: 'bedCounts', label: '200+',      order: 4 },
  { group: 'bedCounts', label: 'Not sure',  order: 5 },

  // existingCareStatuses — select
  { group: 'existingCareStatuses', label: 'None — looking for a partner',    order: 1 },
  { group: 'existingCareStatuses', label: 'Limited / occasional',            order: 2 },
  { group: 'existingCareStatuses', label: 'Have a provider, exploring options', order: 3 },
  { group: 'existingCareStatuses', label: 'Just gathering information',      order: 4 },

  // facilityRoles — select
  { group: 'facilityRoles', label: 'Wellness Director',           order: 1 },
  { group: 'facilityRoles', label: 'Executive Director',          order: 2 },
  { group: 'facilityRoles', label: 'Social Worker / Case Manager',order: 3 },
  { group: 'facilityRoles', label: 'Director of Nursing',         order: 4 },
  { group: 'facilityRoles', label: 'Administrator',               order: 5 },
  { group: 'facilityRoles', label: 'Other',                       order: 6 },

  // interestReasons — chips
  { group: 'interestReasons', label: 'A resident needs care now', value: 'resident-need', order: 1 },
  { group: 'interestReasons', label: 'Support our care team',     value: 'team-support',  order: 2 },
  { group: 'interestReasons', label: 'Families keep asking',      value: 'family-asks',   order: 3 },
  { group: 'interestReasons', label: 'Survey / compliance',       value: 'compliance',    order: 4 },
  { group: 'interestReasons', label: 'Replacing a provider',      value: 'replacing',     order: 5 },
  { group: 'interestReasons', label: 'Just exploring',            value: 'exploring',     order: 6 },
];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const mutations = ALL_OPTIONS.map(({ group, label, value, order }) => ({
  createOrReplace: {
    _id: `formOption-${group}-${slugify(label)}`,
    _type: 'formOption',
    optionGroup: group,
    label,
    ...(value ? { value } : {}),
    order,
    isActive: true,
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

const counts = {};
for (const { group } of ALL_OPTIONS) {
  counts[group] = (counts[group] ?? 0) + 1;
}

console.log(`\nSeeded ${ALL_OPTIONS.length} formOption documents:\n`);
for (const [group, count] of Object.entries(counts)) {
  console.log(`  ${group}: ${count}`);
}
console.log('\nOperation:', result.results?.[0]?.operation ?? result.transactionId ?? 'done');
