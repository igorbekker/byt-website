import type { Env } from './_hubspot';
import {
  CORS_HEADERS,
  jsonResponse,
  searchContactByEmail,
  searchContactByName,
  createContact,
  updateContact,
  uploadFileToHubSpot,
  createNote,
  associate,
} from './_hubspot';

interface IntakeBody {
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone: string;
  fax?: string;
  email?: string;
  dob: string;
  ssn?: string;
  primaryInsurance?: string;
  primaryPolicyNumber?: string;
  secondaryInsurance?: string;
  secondaryPolicyNumber?: string;
  referringCompany?: string;
  reasonForReferral?: string;
  pcpName?: string;
  pcpAddress?: string;
  pcpPhone?: string;
  pcpFax?: string;
  otherProviderName?: string;
  otherProviderAddress?: string;
  otherProviderPhone?: string;
  otherProviderFax?: string;
  insuranceCardFront?: string | null;
  insuranceCardBack?: string | null;
  rpFirstName?: string;
  rpLastName?: string;
  rpAddress?: string;
  rpPhone?: string;
  rpFax?: string;
  rpEmail?: string;
}

const WEBSITE_FORM = 'Patient Intake';
const PATIENT_TYPE = 'Patient';
const RP_TYPE = 'Guardian/Family';
const REFER_SOURCE = 'Website Form';
const FILE_FOLDER = '/intake-documents';

function buildPatientProps(body: IntakeBody): Record<string, string> {
  const {
    firstName,
    lastName,
    address,
    city,
    state,
    zip,
    phone,
    fax,
    email,
    dob,
    ssn,
    primaryInsurance,
    primaryPolicyNumber,
    secondaryInsurance,
    secondaryPolicyNumber,
    referringCompany,
    reasonForReferral,
    pcpName,
    pcpAddress,
    pcpPhone,
    pcpFax,
    otherProviderName,
    otherProviderAddress,
    otherProviderPhone,
    otherProviderFax,
  } = body;
  return {
    firstname: firstName,
    lastname: lastName,
    phone,
    date_of_birth: dob,
    contact_type: PATIENT_TYPE,
    refer_source: REFER_SOURCE,
    website_form: WEBSITE_FORM,
    ...(address && { address }),
    ...(city && { city }),
    ...(state && { state }),
    ...(zip && { zip }),
    ...(fax && { fax }),
    ...(email && { email }),
    ...(ssn && { social_security_number: ssn }),
    ...(primaryInsurance && { primary_insurance: primaryInsurance }),
    ...(primaryPolicyNumber && { primary_policy_number: primaryPolicyNumber }),
    ...(secondaryInsurance && { secondary_insurance: secondaryInsurance }),
    ...(secondaryPolicyNumber && { secondary_policy_number: secondaryPolicyNumber }),
    ...(referringCompany && { company: referringCompany }),
    ...(reasonForReferral && { reason_for_referral: reasonForReferral }),
    ...(pcpName && { pcp_name: pcpName }),
    ...(pcpAddress && { pcp_address: pcpAddress }),
    ...(pcpPhone && { pcp_phone: pcpPhone }),
    ...(pcpFax && { pcp_fax: pcpFax }),
    ...(otherProviderName && { other_provider_name: otherProviderName }),
    ...(otherProviderAddress && { other_provider_address: otherProviderAddress }),
    ...(otherProviderPhone && { other_provider_phone: otherProviderPhone }),
    ...(otherProviderFax && { other_provider_fax: otherProviderFax }),
  };
}

function buildRPProps(body: IntakeBody): Record<string, string> {
  const { rpFirstName, rpLastName, rpAddress, rpPhone, rpFax, rpEmail } = body;
  return {
    firstname: rpFirstName ?? '',
    lastname: rpLastName ?? '',
    contact_type: RP_TYPE,
    refer_source: REFER_SOURCE,
    website_form: WEBSITE_FORM,
    ...(rpAddress && { address: rpAddress }),
    ...(rpPhone && { phone: rpPhone }),
    ...(rpFax && { fax: rpFax }),
    ...(rpEmail && { email: rpEmail }),
  };
}

async function upsertPatientContact(
  body: IntakeBody,
  patientProps: Record<string, string>,
  key: string,
): Promise<string> {
  const existingId = body.email?.trim()
    ? await searchContactByEmail(body.email, key)
    : await searchContactByName(body.firstName, body.lastName, body.referringCompany ?? '', key);
  if (existingId) {
    await updateContact(existingId, patientProps, key);
    return existingId;
  }
  return createContact(patientProps, key);
}

async function upsertRPContact(
  body: IntakeBody,
  rpProps: Record<string, string>,
  key: string,
): Promise<string> {
  if (body.rpEmail?.trim()) {
    const existingId = await searchContactByEmail(body.rpEmail, key);
    if (existingId) {
      await updateContact(existingId, rpProps, key);
      return existingId;
    }
  }
  return createContact(rpProps, key);
}

async function storeInsuranceCard(
  dataUrl: string,
  label: string,
  patientContactId: string,
  key: string,
): Promise<void> {
  const ext = dataUrl.match(/^data:image\/(\w+);/)?.[1]?.replace('jpeg', 'jpg') ?? 'jpg';
  const { id } = await uploadFileToHubSpot(dataUrl, `${label}.${ext}`, FILE_FOLDER, key);
  await createNote(id, `Insurance card ${label} uploaded via intake form`, patientContactId, key);
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const key = context.env.HUBSPOT_SERVICE_KEY;
  if (!key)
    return jsonResponse({ success: false, error: 'HUBSPOT_SERVICE_KEY not configured' }, 500);

  let body: IntakeBody;
  try {
    body = (await context.request.json()) as IntakeBody; // safe: validated below
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const required: Record<string, string> = {
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    dob: body.dob,
  };
  for (const [field, val] of Object.entries(required)) {
    if (!val || !val.trim())
      return jsonResponse({ success: false, error: `Missing required field: ${field}` }, 400);
  }

  // Step 1: Patient contact upsert
  let patientContactId: string;
  try {
    patientContactId = await upsertPatientContact(body, buildPatientProps(body), key);
  } catch (err) {
    return jsonResponse({ success: false, error: 'Step 1 failed', details: String(err) }, 500);
  }

  // Step 2: Responsible Party contact (only if rpFirstName is provided)
  let rpContactId: string | null = null;
  if (body.rpFirstName?.trim()) {
    try {
      rpContactId = await upsertRPContact(body, buildRPProps(body), key);
    } catch (err) {
      return jsonResponse({ success: false, error: 'Step 2 failed', details: String(err) }, 500);
    }
  }

  // Step 3: Associations (fatal)
  if (rpContactId) {
    try {
      await associate(
        'contacts',
        rpContactId,
        'contacts',
        patientContactId,
        'USER_DEFINED',
        8,
        key,
      );
      await associate(
        'contacts',
        patientContactId,
        'contacts',
        rpContactId,
        'USER_DEFINED',
        11,
        key,
      );
    } catch (err) {
      return jsonResponse({ success: false, error: 'Step 3 failed', details: String(err) }, 500);
    }
  }

  // Step 4: Insurance card uploads (non-fatal)
  let fileError: string | null = null;
  if (body.insuranceCardFront) {
    try {
      await storeInsuranceCard(
        body.insuranceCardFront,
        'insurance-card-front',
        patientContactId,
        key,
      );
    } catch (err) {
      fileError = String(err);
    }
  }
  if (body.insuranceCardBack) {
    try {
      await storeInsuranceCard(
        body.insuranceCardBack,
        'insurance-card-back',
        patientContactId,
        key,
      );
    } catch (err) {
      fileError = fileError ? `${fileError}; ${String(err)}` : String(err);
    }
  }

  return jsonResponse({ success: true, patientContactId, rpContactId, fileError }, 200);
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
