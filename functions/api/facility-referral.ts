import type { Env } from './_hubspot';
import {
  HUBSPOT_BASE,
  CORS_HEADERS,
  hubspotHeaders,
  jsonResponse,
  reportFormError,
  searchContactByEmail,
  createContact,
  updateContact,
  searchCompanyByName,
  createCompany,
  updateCompany,
} from './_hubspot';

const FACILITY_TYPE_MAP: Record<string, string> = {
  'Assisted Living (ALF)': 'ALF',
  'Skilled Nursing (SNF)': 'SNF',
  'Continuing Care (CCRC)': 'CCRC',
};

const BED_COUNT_MAP: Record<string, string> = {
  'Under 50': 'Under 50',
  '50–90': '50-100',
  '50–100': '50-100',
  '100–200': '100+',
  '200+': '100+',
  'Not sure': 'Not sure',
};

interface FacilityReferralBody {
  facilityName: string;
  facilityPhone?: string;
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
  if (!key) {
    await reportFormError(
      'Facility Referral',
      'config_error',
      'HUBSPOT_SERVICE_KEY not configured',
      context.env,
      undefined,
      500,
    );
    return jsonResponse({ success: false, error: 'HUBSPOT_SERVICE_KEY not configured' }, 500);
  }

  let body: FacilityReferralBody;
  try {
    body = (await context.request.json()) as FacilityReferralBody; // safe: validated below
  } catch {
    await reportFormError(
      'Facility Referral',
      'parse_error',
      'Invalid JSON body',
      context.env,
      undefined,
      400,
    );
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
    facilityType,
    county,
    email,
    phone,
    role,
  };
  for (const [field, val] of Object.entries(required)) {
    if (!val || !val.trim()) {
      await reportFormError(
        'Facility Referral',
        'validation_error',
        `Missing required field: ${field}`,
        context.env,
        body as Record<string, unknown>,
        400,
      );
      return jsonResponse({ success: false, error: `Missing required field: ${field}` }, 400);
    }
  }

  // ── STEP 1: Find or create Company ───────────────────────────────────────
  let companyId: string;
  try {
    const companyProps: Record<string, string> = {
      name: facilityName,
      phone: facilityPhone ?? '',
      facility_type: FACILITY_TYPE_MAP[facilityType] ?? facilityType,
      county,
      approximate_bed_count: BED_COUNT_MAP[bedCount] ?? bedCount,
    };
    const existingId = await searchCompanyByName(facilityName, key);
    if (existingId) {
      await updateCompany(existingId, companyProps, key);
      companyId = existingId;
    } else {
      companyId = await createCompany(companyProps, key);
    }
  } catch (err) {
    await reportFormError(
      'Facility Referral',
      'hubspot_error',
      String(err),
      context.env,
      body as Record<string, unknown>,
      500,
    );
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
    await reportFormError(
      'Facility Referral',
      'hubspot_error',
      String(err),
      context.env,
      body as Record<string, unknown>,
      500,
    );
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
    await reportFormError(
      'Facility Referral',
      'hubspot_error',
      String(err),
      context.env,
      body as Record<string, unknown>,
      500,
    );
    return jsonResponse({ success: false, error: 'Step 3 failed', details: String(err) }, 500);
  }

  return jsonResponse({ success: true, companyId, contactId }, 200);
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
