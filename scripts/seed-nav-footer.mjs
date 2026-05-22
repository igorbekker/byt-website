/**
 * Seed siteSettings with navLinks and footerColumns extracted from current hardcoded markup.
 * Uses patch.set — does NOT overwrite other siteSettings fields.
 * Published document only — no "drafts." prefix.
 * Run: node scripts/seed-nav-footer.mjs
 */

import { randomUUID } from 'crypto';

const PROJECT_ID = 'bpjtbps6';
const DATASET = 'production';
const TOKEN = process.env.SANITY_AUTH_TOKEN || process.env.BYT_SANITY_TOKEN;

if (!TOKEN) {
  console.error('ERROR: Set SANITY_AUTH_TOKEN or BYT_SANITY_TOKEN');
  process.exit(1);
}

const mutations = [
  {
    patch: {
      id: 'siteSettings',
      set: {
        navLinks: [
          {
            _type: 'navLink',
            _key: randomUUID(),
            label: 'For Facilities',
            href: '/communities/',
          },
          {
            _type: 'navLink',
            _key: randomUUID(),
            label: 'For Patients',
            href: '/patients/',
          },
          {
            _type: 'navLink',
            _key: randomUUID(),
            label: 'For Therapists',
            href: '/providers/',
          },
          {
            _type: 'navLink',
            _key: randomUUID(),
            label: 'About',
            href: '/about/',
          },
        ],
        footerColumns: [
          {
            _type: 'footerColumn',
            _key: randomUUID(),
            heading: 'Services',
            links: [
              { _type: 'footerLink', _key: randomUUID(), label: 'For Seniors & Families', href: '/patients/' },
              { _type: 'footerLink', _key: randomUUID(), label: 'Individual Therapy', href: '/patients/' },
              { _type: 'footerLink', _key: randomUUID(), label: 'For Facilities', href: '/communities/' },
              { _type: 'footerLink', _key: randomUUID(), label: 'For Therapists', href: '/providers/' },
            ],
          },
          {
            _type: 'footerColumn',
            _key: randomUUID(),
            heading: 'Company',
            links: [
              { _type: 'footerLink', _key: randomUUID(), label: 'About Us', href: '/about/' },
              { _type: 'footerLink', _key: randomUUID(), label: 'Careers', href: '/careers/' },
              { _type: 'footerLink', _key: randomUUID(), label: 'Contact', href: '/contact/' },
              { _type: 'footerLink', _key: randomUUID(), label: 'Refer a Facility', href: '#', action: 'refer' },
            ],
          },
          {
            _type: 'footerColumn',
            _key: randomUUID(),
            heading: 'Forms',
            links: [
              { _type: 'footerLink', _key: randomUUID(), label: 'Intake Form', href: '/intake/' },
              { _type: 'footerLink', _key: randomUUID(), label: 'Resident Referral Form', href: '/resident-referral/' },
            ],
          },
        ],
      },
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

console.log('siteSettings navLinks + footerColumns seeded:', JSON.stringify(result, null, 2));
