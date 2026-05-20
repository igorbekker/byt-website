import type { Env } from './_hubspot';
import {
  HUBSPOT_BASE,
  CORS_HEADERS,
  hubspotHeaders,
  jsonResponse,
  searchContactByEmail,
  createContact,
  updateContact,
  searchCompanyByName,
  createCompany,
} from './_hubspot';

interface FacilityReferralBody {
  facilityName: string;
  facilityPhone: string;
  facilityType: string;
  county: string;
  bedCount: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  whatSparkedInterest: string;
  anythingElse?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const key = context.env.HUBSPOT_SERVICE_KEY;
  if (!key)
    return jsonResponse({ success: false, error: 'HUBSPOT_SERVICE_KEY not configured' }, 500);

  let body: FacilityReferralBody;
  try {
    body = (await context.request.json()) as FacilityReferralBody; // safe: validated below
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const {
    facilityName,
    facilityPhone,
    facilityType,
    county,
    bedCount,
    firstName,
    lastName,
    email,
    phone,
    role,
    whatSparkedInterest,
    anythingElse,
  } = body;

  const required: Record<string, string> = {
    facilityName,
    facilityPhone,
    facilityType,
    county,
    bedCount,
    firstName,
    lastName,
    email,
    phone,
    role,
    whatSparkedInterest,
  };
  for (const [field, val] of Object.entries(required)) {
    if (!val || !val.trim())
      return jsonResponse({ success: false, error: `Missing required field: ${field}` }, 400);
  }

  // ── STEP 1: Find or create Company ───────────────────────────────────────
  let companyId: string;
  try {
    const existingId = await searchCompanyByName(facilityName, key);
    if (existingId) {
      companyId = existingId;
    } else {
      companyId = await createCompany(
        {
          name: facilityName,
          phone: facilityPhone,
          facility_type: facilityType,
          county,
          approximate_bed_count: bedCount,
        },
        key,
      );
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Step 1 failed', details: String(err) }, 500);
  }

  // ── STEP 2: Find or create Contact ────────────────────────────────────────
  let contactId: string;
  try {
    const existingId = await searchContactByEmail(email, key);
    const contactProps: Record<string, string> = {
      firstname: firstName,
      lastname: lastName,
      email,
      phone,
      company: facilityName,
      hs_role: role,
      what_sparked_your_interest: whatSparkedInterest
        .split(',')
        .map((s) => s.trim())
        .join(';'),
      anything_else_we_should_know: anythingElse ?? '',
      contact_type: 'Facility Employee',
      refer_source: 'Website Form',
      website_form: 'Refer Facility',
    };
    if (existingId) {
      await updateContact(existingId, contactProps, key);
      contactId = existingId;
    } else {
      contactId = await createContact(contactProps, key);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Step 2 failed', details: String(err) }, 500);
  }

  // ── STEP 3: Associate Contact → Company ──────────────────────────────────
  try {
    const url = `${HUBSPOT_BASE}/crm/v4/objects/contacts/${contactId}/associations/companies/${companyId}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: hubspotHeaders(key),
      body: JSON.stringify([{ associationCategory: 'USER_DEFINED', associationTypeId: 5 }]),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Association failed (${res.status}): ${err}`);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Step 3 failed', details: String(err) }, 500);
  }

  return jsonResponse({ success: true, companyId, contactId }, 200);
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
