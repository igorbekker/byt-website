import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'bpjtbps6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

const pages = {
  homePage: ['hero','router','belief','two_ways','conditions','how_it_works','testimonials','provider_teaser'],
  aboutPage: ['hero','mission','story','values','approach','cta'],
  communitiesPage: ['hero','process','why_us','no_cost','conditions','testimonial_feature','cta'],
  patientsPage: ['hero','audience_selector','delivery','belief','conditions','cta'],
  providersPage: ['hero','tracks','why_join','qualifications','testimonials','cta'],
  careersPage: ['hero','open_positions','general_application'],
  contactPage: ['hero','contact_form'],
};

for (const [docType, sectionIds] of Object.entries(pages)) {
  const doc = await client.fetch(`*[_type == $type][0]`, { type: docType });
  if (!doc) { console.log(`No doc for ${docType}`); continue; }

  const existing = doc.sections ?? [];
  const sections = sectionIds.map((id, i) => {
    const found = existing.find(s => s.sectionId === id);
    return {
      _type: 'pageSection',
      _key: found?._key ?? id,
      sectionId: id,
      enabled: found?.enabled ?? true,
      order: (i + 1) * 10,
    };
  });

  await client.patch(doc._id).set({ sections }).commit();
  console.log(`Seeded ${docType}: ${sections.map(s => `${s.sectionId}=${s.order}`).join(', ')}`);
}
console.log('Done.');
