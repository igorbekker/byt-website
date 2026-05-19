/**
 * Upload 4 condition background images to Sanity and patch onto documents.
 * Run: node scripts/upload-homepage-condition-images.mjs
 */

import { readFileSync } from 'fs';

const PROJECT_ID = 'bpjtbps6';
const DATASET = 'production';
const TOKEN = process.env.SANITY_AUTH_TOKEN;

if (!TOKEN) {
  console.error('SANITY_AUTH_TOKEN not set');
  process.exit(1);
}

const images = [
  {
    docId: 'condition-homepage-depression',
    filePath: 'apps/web/public/images/home-cond-depression.jpg',
    alt: 'Person in a therapy session for depression and anxiety',
  },
  {
    docId: 'condition-homepage-grief',
    filePath: 'apps/web/public/images/home-cond-grief.jpg',
    alt: 'Quiet moment of reflection representing grief and loss',
  },
  {
    docId: 'condition-homepage-trauma',
    filePath: 'apps/web/public/images/home-cond-ptsd.jpg',
    alt: 'Calm environment supporting trauma and PTSD recovery',
  },
  {
    docId: 'condition-homepage-relationships',
    filePath: 'apps/web/public/images/home-cond-relationships.jpg',
    alt: 'Couple or family in counseling for relationship support',
  },
];

async function uploadImage(filePath) {
  const buffer = readFileSync(filePath);
  const filename = filePath.split('/').pop();
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/assets/images/${DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: buffer,
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`Upload failed for ${filePath}: ${JSON.stringify(data)}`);
  return data.document._id;
}

async function patchImage(docId, assetId, alt) {
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        mutations: [
          {
            patch: {
              id: docId,
              set: {
                image: {
                  _type: 'imageWithAlt',
                  asset: { _type: 'reference', _ref: assetId },
                  alt,
                },
              },
            },
          },
        ],
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`Patch failed for ${docId}: ${JSON.stringify(data)}`);
  return data;
}

for (const { docId, filePath, alt } of images) {
  console.log(`Uploading ${filePath}...`);
  const assetId = await uploadImage(filePath);
  console.log(`  → asset: ${assetId}`);
  await patchImage(docId, assetId, alt);
  console.log(`  → patched onto ${docId}`);
}

console.log('\nDone — all 4 images uploaded and patched.');
