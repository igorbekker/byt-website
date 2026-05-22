// One-time script: create 13 new HubSpot contact properties for the intake form.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const devVars = readFileSync(join(__dir, '../apps/web/.dev.vars'), 'utf8');
const KEY = devVars.match(/HUBSPOT_SERVICE_KEY=(.+)/)?.[1]?.trim();
if (!KEY) { console.error('HUBSPOT_SERVICE_KEY not found in .dev.vars'); process.exit(1); }

const BASE = 'https://api.hubapi.com/crm/v3/properties/contacts';

const PROPERTIES = [
  { name: 'social_security_number',  label: 'Social Security Number', sensitive: true  },
  { name: 'primary_insurance',       label: 'Primary Insurance',       sensitive: false },
  { name: 'primary_policy_number',   label: 'Primary Policy Number',   sensitive: true  },
  { name: 'secondary_insurance',     label: 'Secondary Insurance',     sensitive: false },
  { name: 'secondary_policy_number', label: 'Secondary Policy Number', sensitive: true  },
  { name: 'pcp_name',                label: 'PCP Name',                sensitive: false },
  { name: 'pcp_address',             label: 'PCP Address',             sensitive: false },
  { name: 'pcp_phone',               label: 'PCP Phone',               sensitive: false },
  { name: 'pcp_fax',                 label: 'PCP Fax',                 sensitive: false },
  { name: 'other_provider_name',     label: 'Other Provider Name',     sensitive: false },
  { name: 'other_provider_address',  label: 'Other Provider Address',  sensitive: false },
  { name: 'other_provider_phone',    label: 'Other Provider Phone',    sensitive: false },
  { name: 'other_provider_fax',      label: 'Other Provider Fax',      sensitive: false },
];

async function createProperty({ name, label, sensitive }) {
  const body = {
    name,
    label,
    type: 'string',
    fieldType: 'text',
    groupName: 'contactinformation',
  };
  if (sensitive) body.sensitiveDataCategories = ['PERSONAL_SENSITIVE'];

  const res = await fetch(BASE, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 201) {
    console.log(`✓  created  ${name}`);
    return;
  }
  if (res.status === 409) {
    console.log(`~  exists   ${name}`);
    return;
  }

  const err = await res.json().catch(() => ({}));
  // If sensitive categories are unsupported, retry without them
  if (sensitive && (res.status === 400 || res.status === 422)) {
    console.warn(`⚠  sensitive flag rejected for ${name} — retrying without it`);
    const retry = await fetch(BASE, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, label, type: 'string', fieldType: 'text', groupName: 'contactinformation' }),
    });
    if (retry.status === 201) {
      console.log(`✓  created  ${name}  (mark sensitive manually in HubSpot UI)`);
      return;
    }
    if (retry.status === 409) {
      console.log(`~  exists   ${name}  (mark sensitive manually in HubSpot UI)`);
      return;
    }
  }

  console.error(`✗  FAILED   ${name}  (${res.status}): ${JSON.stringify(err)}`);
}

console.log('Creating 13 intake contact properties in HubSpot...\n');
for (const prop of PROPERTIES) {
  await createProperty(prop);
}
console.log('\nDone.');
