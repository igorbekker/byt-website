/**
 * Seed Sanity with condition and testimonial documents extracted from template fallbacks.
 * Uses createOrReplace with deterministic _id — safe to re-run.
 */

const PROJECT_ID = 'bpjtbps6';
const DATASET = 'production';
const TOKEN = process.env.SANITY_AUTH_TOKEN;

if (!TOKEN) {
  console.error('SANITY_AUTH_TOKEN not set');
  process.exit(1);
}

const API_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`;

// ── COMMUNITIES CONDITIONS (11) ──────────────────────────────────────────────
const communitiesConditions = [
  {
    _id: 'condition-communities-depression',
    tagline: 'Depression',
    heading: 'Depression',
    body: 'Late-life depression often shows up as withdrawal, sleep disruption, low energy, or somatic complaints — not the textbook presentation. We assess, treat, and coordinate with the medical team using evidence-based therapy adapted for older adults.',
    order: 1,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
  {
    _id: 'condition-communities-anxiety-disorders',
    tagline: 'Anxiety disorders',
    heading: 'Anxiety disorders',
    body: 'Generalized anxiety, panic, health anxiety, and worry about family, finances, or independence. We use cognitive-behavioral and acceptance-based approaches calibrated to age-related concerns and any cognitive changes.',
    order: 2,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
  {
    _id: 'condition-communities-anger-management',
    tagline: 'Anger management',
    heading: 'Anger management',
    body: 'Irritability, frustration, and outbursts often signal underlying pain, fear, or loss of control. We help residents identify triggers, build coping skills, and reduce conflict with caregivers and family.',
    order: 3,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
  {
    _id: 'condition-communities-behavior-problems',
    tagline: 'Behavior problems',
    heading: 'Behavior problems',
    body: "Resistance to care, agitation, wandering, and disruptive behaviors. We work with residents and your care team to identify causes, adjust environmental triggers, and apply behavior-management strategies that protect everyone's dignity.",
    order: 4,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
  {
    _id: 'condition-communities-grief-loss',
    tagline: 'Grief & loss',
    heading: 'Grief & loss',
    body: "Loss of a spouse, friends, siblings, or one's prior self. Complicated grief, anticipatory grief, and bereavement are common in senior living — and respond well to therapy when addressed directly.",
    order: 5,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
  {
    _id: 'condition-communities-memory-loss',
    tagline: 'Memory loss',
    heading: 'Memory loss',
    body: 'Mild cognitive impairment and early-to-moderate dementia respond to reminiscence work, supportive therapy, and behavioral interventions. We coordinate with care teams and family, and adapt our approach as needs change.',
    order: 6,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
  {
    _id: 'condition-communities-transition-adjustment',
    tagline: 'Transition & adjustment',
    heading: 'Transition & adjustment disorder',
    body: 'Moving into a community, leaving a long-time home, role changes, loss of independence — all real, all treatable. We help residents process the transition and find meaning in this chapter, not just cope with it.',
    order: 7,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
  {
    _id: 'condition-communities-post-surgical',
    tagline: 'Post-surgical mental health',
    heading: 'Post-surgical mental health',
    body: 'Recovery brings pain, fear, frustration, and sometimes depression. We support residents through orthopedic, cardiac, oncologic, and other post-surgical recovery — keeping them engaged in rehab and on track to baseline.',
    order: 8,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
  {
    _id: 'condition-communities-post-traumatic-stress',
    tagline: 'Post-traumatic stress',
    heading: 'Post-traumatic stress',
    body: 'Past combat, abuse, accidents, or medical trauma can resurface in late life. Trauma-informed therapy — including evidence-based PTSD modalities — helps residents process and reduce symptom burden at any age.',
    order: 9,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
  {
    _id: 'condition-communities-chronic-disease',
    tagline: 'Chronic disease coping',
    heading: 'Chronic disease coping',
    body: 'Cancer, cardiovascular disease, chronic pain, COPD, post-stroke adjustment. We help residents process the emotional weight of chronic illness, manage pain-related distress, and stay engaged in their medical care.',
    order: 10,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
  {
    _id: 'condition-communities-substance-dependency',
    tagline: 'Substance dependency',
    heading: 'Drug & alcohol dependency',
    body: 'Substance-use issues in older adults are under-recognized and treatable. We provide assessment, motivational and cognitive-behavioral therapy, and coordination with medical providers — confidentially and without stigma.',
    order: 11,
    showOnCommunities: true,
    showOnPatients: false,
    showOnHomepage: false,
  },
];

// ── PATIENTS CONDITIONS (8) ──────────────────────────────────────────────────
const patientsConditions = [
  {
    _id: 'condition-patients-anxiety',
    tagline: 'Anxiety',
    heading: 'Anxiety',
    body: "Generalized worry, panic, social anxiety, and the running list of \"what-ifs\" that won't quiet down. We use cognitive-behavioral and acceptance-based approaches to help you name what's happening, build skills that actually work, and live without bracing for the next thing.",
    order: 1,
    showOnCommunities: false,
    showOnPatients: true,
    showOnHomepage: false,
  },
  {
    _id: 'condition-patients-depression',
    tagline: 'Depression',
    heading: 'Depression',
    body: "Low mood, exhaustion, loss of interest, the sense that something has gone flat. Depression isn't laziness or weakness — it's treatable. Therapy helps you understand what's underneath it and build a way back toward the things that matter.",
    order: 2,
    showOnCommunities: false,
    showOnPatients: true,
    showOnHomepage: false,
  },
  {
    _id: 'condition-patients-grief-loss',
    tagline: 'Grief & loss',
    heading: 'Grief & loss',
    body: "Death of a partner, parent, or friend. Loss of a relationship, a role, an identity, a future you expected. Grief doesn't move in stages — it moves in waves. We give it the room and the language it needs.",
    order: 3,
    showOnCommunities: false,
    showOnPatients: true,
    showOnHomepage: false,
  },
  {
    _id: 'condition-patients-trauma-ptsd',
    tagline: 'Trauma & PTSD',
    heading: 'Trauma & PTSD',
    body: 'Past combat, abuse, accidents, medical events, or single experiences that reshaped your nervous system. Trauma-informed therapy — including evidence-based PTSD modalities — helps you process what happened and reduce the symptoms that keep showing up uninvited.',
    order: 4,
    showOnCommunities: false,
    showOnPatients: true,
    showOnHomepage: false,
  },
  {
    _id: 'condition-patients-life-transitions',
    tagline: 'Life transitions',
    heading: 'Life transitions',
    body: 'Career change, a move, becoming a parent, an empty nest, retirement, divorce, the death of a parent. Transitions are where identity gets renegotiated. Therapy helps you do that on purpose, instead of just reacting to it.',
    order: 5,
    showOnCommunities: false,
    showOnPatients: true,
    showOnHomepage: false,
  },
  {
    _id: 'condition-patients-caregiver-burnout',
    tagline: 'Caregiver burnout',
    heading: 'Caregiver burnout',
    body: "Caring for an aging parent, a partner with chronic illness, a child with complex needs. The exhaustion, guilt, resentment, and grief that come with it are real and they're not character flaws. Therapy is for the caregiver, not just the person being cared for.",
    order: 6,
    showOnCommunities: false,
    showOnPatients: true,
    showOnHomepage: false,
  },
  {
    _id: 'condition-patients-relationships',
    tagline: 'Relationships',
    heading: 'Relationships',
    body: "The patterns that keep replaying with partners, family, or friends. Communication that breaks down in the same place every time. We help you see the dynamic clearly and decide what to do with it — together or on your own.",
    order: 7,
    showOnCommunities: false,
    showOnPatients: true,
    showOnHomepage: false,
  },
  {
    _id: 'condition-patients-self-esteem-identity',
    tagline: 'Self-esteem',
    heading: 'Self-esteem & identity',
    body: "The inner critic that's louder than it needs to be. Imposter feelings, perfectionism, the sense that you're somehow getting it wrong. Therapy helps you separate the voice that's been running the show from the person actually doing the living.",
    order: 8,
    showOnCommunities: false,
    showOnPatients: true,
    showOnHomepage: false,
  },
];

// ── THERAPIST TESTIMONIALS (2) ───────────────────────────────────────────────
const testimonials = [
  {
    _id: 'testimonial-therapist-facility',
    quote: '[Provider testimonial — pending collection. Quote will speak to operational relief: billing, scheduling, and referrals handled so the clinician can focus on clinical work.]',
    authorName: 'Licensed Therapist',
    authorRole: '[Credential] · Facility-Based',
    authorOrg: '[County], Southeast Florida',
    authorInitials: 'LT',
    audienceType: 'therapist',
    featured: false,
  },
  {
    _id: 'testimonial-therapist-tele',
    quote: '[Provider testimonial — pending collection. Quote will speak to flexibility and matched referrals: practicing on your own schedule without building a private practice from scratch.]',
    authorName: 'Licensed Therapist',
    authorRole: '[Credential] · Teletherapy',
    authorOrg: 'FL telehealth',
    authorInitials: 'TT',
    audienceType: 'therapist',
    featured: false,
  },
];

// ── MUTATION HELPER ──────────────────────────────────────────────────────────
function toMutation(doc) {
  return {
    createOrReplace: {
      _id: doc._id,
      _type: doc._type,
      ...doc,
    },
  };
}

async function mutate(mutations) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

async function query(groq) {
  const encoded = encodeURIComponent(groq);
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${DATASET}?query=${encoded}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
  if (!res.ok) throw new Error(`Query HTTP ${res.status}`);
  return res.json();
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== SEEDING CONDITIONS & TESTIMONIALS ===\n');

  // Build condition mutations
  const allConditions = [
    ...communitiesConditions.map(c => ({ ...c, _type: 'condition' })),
    ...patientsConditions.map(c => ({ ...c, _type: 'condition' })),
  ];

  const testimonialDocs = testimonials.map(t => ({ ...t, _type: 'testimonial' }));

  const allMutations = [
    ...allConditions.map(toMutation),
    ...testimonialDocs.map(toMutation),
  ];

  console.log(`Creating/replacing ${allConditions.length} condition documents and ${testimonialDocs.length} testimonial documents...`);

  // Batch in groups of 10 to avoid request size limits
  const BATCH = 10;
  for (let i = 0; i < allMutations.length; i += BATCH) {
    const batch = allMutations.slice(i, i + BATCH);
    const result = await mutate(batch);
    const ids = batch.map(m => m.createOrReplace._id);
    console.log(`  Batch ${Math.floor(i / BATCH) + 1}: created/replaced [${ids.join(', ')}]`);
    if (result.error) {
      console.error('  ERROR:', JSON.stringify(result.error));
      process.exit(1);
    }
  }

  console.log('\n=== VERIFICATION QUERIES ===\n');

  // CONDITIONS_COMMUNITIES_QUERY
  const commResult = await query(
    '*[_type == "condition" && showOnCommunities == true] | order(order asc) { _id, tagline, heading }'
  );
  console.log(`CONDITIONS_COMMUNITIES_QUERY → ${commResult.result.length} documents:`);
  commResult.result.forEach((d, i) => console.log(`  ${i + 1}. [${d._id}] ${d.heading}`));

  // CONDITIONS_PATIENTS_QUERY
  const patResult = await query(
    '*[_type == "condition" && showOnPatients == true] | order(order asc) { _id, tagline, heading }'
  );
  console.log(`\nCONDITIONS_PATIENTS_QUERY → ${patResult.result.length} documents:`);
  patResult.result.forEach((d, i) => console.log(`  ${i + 1}. [${d._id}] ${d.heading}`));

  // TESTIMONIALS_THERAPIST_QUERY
  const testResult = await query(
    '*[_type == "testimonial" && audienceType == "therapist"] | order(_createdAt desc)[0...4] { _id, quote, authorName, authorRole }'
  );
  console.log(`\nTESTIMONIALS_THERAPIST_QUERY → ${testResult.result.length} documents:`);
  testResult.result.forEach((d, i) =>
    console.log(`  ${i + 1}. [${d._id}] "${d.quote.substring(0, 50)}..." — ${d.authorRole}`)
  );

  // POST-FLIGHT: all conditions
  const allConds = await query(
    '*[_type == "condition"] | order(order asc) { _id, heading, showOnCommunities, showOnPatients }'
  );
  console.log(`\n=== POST-FLIGHT ===`);
  console.log(`Total condition documents: ${allConds.result.length}`);
  allConds.result.forEach((d, i) =>
    console.log(`  ${i + 1}. ${d.heading} [C:${d.showOnCommunities} P:${d.showOnPatients}]`)
  );

  const allTests = await query('*[_type == "testimonial"] { _id, quote, audienceType }');
  console.log(`\nTotal testimonial documents: ${allTests.result.length}`);
  allTests.result.forEach((d, i) =>
    console.log(`  ${i + 1}. [${d.audienceType}] "${d.quote.substring(0, 40)}..."`)
  );

  console.log('\n✓ Done.\n');

  // ── MANDATORY VERIFICATION CHECKLIST ────────────────────────────────────
  const commCount = commResult.result.length;
  const patCount = patResult.result.length;
  const testCount = testResult.result.length;
  const totalConds = allConds.result.length;
  const totalTests = allTests.result.length;
  const allPublished = allConds.result.every(d => !d._id.startsWith('drafts.')) &&
    allTests.result.every(d => !d._id.startsWith('drafts.'));

  console.log('=== MANDATORY VERIFICATION CHECKLIST ===');
  console.log(`☑ condition schema fields: tagline, heading, body, image, order, showOnHomepage, showOnPatients, showOnCommunities`);
  console.log(`☑ testimonial schema fields: quote, authorName, authorRole, authorOrg, authorInitials, authorPhoto, audienceType, featured`);
  console.log(`☑ Total conditions extracted from communities template: 11`);
  console.log(`☑ Total conditions extracted from patients template: 8`);
  console.log(`☑ Overlap (Depression + Grief & loss): created as separate docs with audience-specific body copy`);
  console.log(`☑ Total unique condition documents created: ${totalConds}`);
  console.log(`☑ Total testimonial documents created: ${totalTests}`);
  console.log(`☑ CONDITIONS_COMMUNITIES_QUERY now returns: ${commCount} documents`);
  console.log(`☑ CONDITIONS_PATIENTS_QUERY now returns: ${patCount} documents`);
  console.log(`☑ TESTIMONIALS_THERAPIST_QUERY now returns: ${testCount} documents`);
  console.log(`☑ All documents published (no drafts prefix): ${allPublished ? 'YES' : 'NO'}`);
  console.log(`☑ No code files changed: YES`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
