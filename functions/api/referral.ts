import { uploadFileToHubSpot, createNote } from './_hubspot';

interface Env {
  HUBSPOT_SERVICE_KEY?: string;
}

interface ReferralBody {
  facilityName: string;
  facilityPhone: string;
  facilityEmail?: string;
  referrerFirstName: string;
  referrerLastName: string;
  referrerEmail: string;
  referrerPhone: string;
  patientFirstName: string;
  patientLastName: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianPhone?: string;
  referralReason: string;
  skilledNursing: string;
  documents?: Array<{ file: string; name: string }>;
}

const HUBSPOT_BASE = 'https://api.hubapi.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function hubspotHeaders(key: string): Record<string, string> {
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

async function searchCompany(name: string, key: string): Promise<string | null> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/companies/search`;
  const res = await fetch(url, {
    method: 'POST',
    headers: hubspotHeaders(key),
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'name', operator: 'EQ', value: name }] }],
      properties: ['name', 'phone'],
      limit: 1,
    }),
  });
  console.log(`[Step 1 search] ${url} → ${res.status}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { results: Array<{ id: string }> };
  return data.results?.[0]?.id ?? null;
}

async function createCompany(
  name: string,
  phone: string,
  facilityEmail: string,
  key: string,
): Promise<string> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/companies`;
  const res = await fetch(url, {
    method: 'POST',
    headers: hubspotHeaders(key),
    body: JSON.stringify({ properties: { name, phone, facility_email: facilityEmail } }),
  });
  console.log(`[Step 1 create] ${url} → ${res.status}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Company create failed (${res.status}): ${err}`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

async function searchContactByEmail(email: string, key: string): Promise<string | null> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/contacts/search`;
  const res = await fetch(url, {
    method: 'POST',
    headers: hubspotHeaders(key),
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
      properties: ['email', 'firstname', 'lastname'],
      limit: 1,
    }),
  });
  console.log(`[Step 2 search] ${url} → ${res.status}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { results: Array<{ id: string }> };
  return data.results?.[0]?.id ?? null;
}

async function searchContactByName(
  firstName: string,
  lastName: string,
  company: string,
  key: string,
): Promise<string | null> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/contacts/search`;
  const res = await fetch(url, {
    method: 'POST',
    headers: hubspotHeaders(key),
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            { propertyName: 'firstname', operator: 'EQ', value: firstName },
            { propertyName: 'lastname', operator: 'EQ', value: lastName },
            { propertyName: 'company', operator: 'EQ', value: company },
          ],
        },
      ],
      properties: ['firstname', 'lastname', 'company'],
      limit: 1,
    }),
  });
  console.log(`[Step 3 search] ${url} → ${res.status}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { results: Array<{ id: string }> };
  return data.results?.[0]?.id ?? null;
}

async function createContact(
  properties: Record<string, string>,
  step: string,
  key: string,
): Promise<string> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/contacts`;
  const res = await fetch(url, {
    method: 'POST',
    headers: hubspotHeaders(key),
    body: JSON.stringify({ properties }),
  });
  console.log(`[${step} create] ${url} → ${res.status}`);

  if (res.status === 409) {
    const err = (await res.json()) as { message?: string; id?: string };
    const match = err.message?.match(/Existing ID:\s*(\d+)/i);
    if (match) return match[1];
    throw new Error(`Contact 409 but could not extract ID: ${JSON.stringify(err)}`);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Contact create failed (${res.status}): ${err}`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

async function updateContact(
  contactId: string,
  properties: Record<string, string>,
  step: string,
  key: string,
): Promise<void> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: hubspotHeaders(key),
    body: JSON.stringify({ properties }),
  });
  console.log(`[${step} update] ${url} → ${res.status}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Contact update failed (${res.status}): ${err}`);
  }
}

async function associate(
  fromType: string,
  fromId: string,
  toType: string,
  toId: string,
  category: string,
  typeId: number,
  step: string,
  key: string,
): Promise<void> {
  const url = `${HUBSPOT_BASE}/crm/v4/objects/${fromType}/${fromId}/associations/${toType}/${toId}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: hubspotHeaders(key),
    body: JSON.stringify([{ associationCategory: category, associationTypeId: typeId }]),
  });
  console.log(`[${step}] ${url} → ${res.status}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Association failed (${res.status}): ${err}`);
  }
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const key = context.env.HUBSPOT_SERVICE_KEY;

  if (!key) {
    return jsonResponse({ success: false, error: 'HUBSPOT_SERVICE_KEY not configured' }, 500);
  }

  let body: ReferralBody;
  try {
    body = (await context.request.json()) as ReferralBody;
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const {
    facilityName,
    facilityPhone,
    facilityEmail,
    referrerFirstName,
    referrerLastName,
    referrerEmail,
    referrerPhone,
    patientFirstName,
    patientLastName,
    guardianFirstName,
    guardianLastName,
    guardianPhone,
    referralReason,
    skilledNursing,
    documents,
  } = body;

  const required = {
    facilityName,
    facilityPhone,
    referrerFirstName,
    referrerLastName,
    referrerEmail,
    referrerPhone,
    patientFirstName,
    patientLastName,
    referralReason,
    skilledNursing,
  };
  for (const [field, val] of Object.entries(required)) {
    if (!val || !String(val).trim()) {
      return jsonResponse({ success: false, error: `Missing required field: ${field}` }, 400);
    }
  }

  // ── STEP 1: Find or create Company ───────────────────────────────────────
  let companyId: string;
  try {
    const existing = await searchCompany(facilityName, key);
    if (existing) {
      console.log(`[Step 1] Found existing company: ${existing}`);
      companyId = existing;
    } else {
      companyId = await createCompany(facilityName, facilityPhone, facilityEmail ?? '', key);
      console.log(`[Step 1] Created company: ${companyId}`);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Step 1 failed', details: String(err) }, 500);
  }

  // ── STEP 2: Create or update Referrer contact ─────────────────────────────
  let referrerContactId: string;
  try {
    const existingId = await searchContactByEmail(referrerEmail, key);
    const referrerProps: Record<string, string> = {
      firstname: referrerFirstName,
      lastname: referrerLastName,
      email: referrerEmail,
      phone: referrerPhone,
      company: facilityName,
      contact_type: 'Facility Employee',
      refer_source: 'Website Form',
      website_form: 'Refer Resident',
    };
    if (existingId) {
      await updateContact(existingId, referrerProps, 'Step 2', key);
      referrerContactId = existingId;
      console.log(`[Step 2] Updated referrer: ${referrerContactId}`);
    } else {
      referrerContactId = await createContact(referrerProps, 'Step 2', key);
      console.log(`[Step 2] Created referrer: ${referrerContactId}`);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Step 2 failed', details: String(err) }, 500);
  }

  // ── STEP 3: Create or update Patient contact ──────────────────────────────
  let patientContactId: string;
  try {
    const existingId = await searchContactByName(
      patientFirstName,
      patientLastName,
      facilityName,
      key,
    );
    const patientProps: Record<string, string> = {
      firstname: patientFirstName,
      lastname: patientLastName,
      company: facilityName,
      contact_type: 'Patient',
      reason_for_referral: referralReason,
      skilled_nursing: skilledNursing.charAt(0).toUpperCase() + skilledNursing.slice(1),
      refer_source: 'Website Form',
      website_form: 'Refer Resident',
    };
    if (existingId) {
      await updateContact(existingId, patientProps, 'Step 3', key);
      patientContactId = existingId;
      console.log(`[Step 3] Updated patient: ${patientContactId}`);
    } else {
      patientContactId = await createContact(patientProps, 'Step 3', key);
      console.log(`[Step 3] Created patient: ${patientContactId}`);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Step 3 failed', details: String(err) }, 500);
  }

  // ── STEP 4: Create Guardian contact (only if name provided) ───────────────
  let guardianContactId: string | null = null;
  if (guardianFirstName && guardianFirstName.trim()) {
    try {
      const guardianProps: Record<string, string> = {
        firstname: guardianFirstName,
        lastname: guardianLastName ?? '',
        company: facilityName,
        contact_type: 'Guardian/Family',
        refer_source: 'Website Form',
        website_form: 'Refer Resident',
      };
      if (guardianPhone) guardianProps.phone = guardianPhone;
      guardianContactId = await createContact(guardianProps, 'Step 4', key);
      console.log(`[Step 4] Created guardian: ${guardianContactId}`);
    } catch (err) {
      return jsonResponse({ success: false, error: 'Step 4 failed', details: String(err) }, 500);
    }
  }

  // ── STEP 5: Associations ──────────────────────────────────────────────────
  try {
    await associate(
      'contacts',
      referrerContactId,
      'companies',
      companyId,
      'USER_DEFINED',
      5,
      'Step 5a',
      key,
    );
    await associate(
      'contacts',
      patientContactId,
      'companies',
      companyId,
      'USER_DEFINED',
      1,
      'Step 5b',
      key,
    );

    if (guardianContactId) {
      await associate(
        'contacts',
        guardianContactId,
        'companies',
        companyId,
        'HUBSPOT_DEFINED',
        279,
        'Step 5c guardian→company',
        key,
      );
      await associate(
        'contacts',
        guardianContactId,
        'contacts',
        patientContactId,
        'USER_DEFINED',
        8,
        'Step 5c guardian→patient',
        key,
      );
      await associate(
        'contacts',
        patientContactId,
        'contacts',
        guardianContactId,
        'USER_DEFINED',
        11,
        'Step 5c patient→guardian',
        key,
      );
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Step 5 failed', details: String(err) }, 500);
  }

  // Step 6 — document uploads (non-fatal)
  const uploadedUrls: string[] = [];
  const uploadedIds: string[] = [];
  const uploadedNames: string[] = [];
  const uploadErrors: string[] = [];
  for (const doc of documents ?? []) {
    try {
      const { url, id } = await uploadFileToHubSpot(doc.file, doc.name, '/referral-documents', key);
      uploadedUrls.push(url);
      uploadedIds.push(id);
      uploadedNames.push(doc.name);
    } catch (err) {
      uploadErrors.push(String(err));
    }
  }

  let referralNoteId: string | undefined;
  if (uploadedIds.length > 0) {
    try {
      referralNoteId = await createNote(
        uploadedIds.join(';'),
        `Referral documents uploaded via website: ${uploadedNames.join(', ')}`,
        referrerContactId,
        key,
      );
      console.log('[referral] note created:', referralNoteId);
    } catch (err) {
      uploadErrors.push(`Note create failed: ${String(err)}`);
    }
  }

  return jsonResponse(
    {
      success: true,
      companyId,
      referrerContactId,
      patientContactId,
      guardianContactId,
      uploadedUrls,
      referralNoteId,
      uploadErrors,
    },
    200,
  );
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};
