import type { Env } from './_hubspot';
import {
  CORS_HEADERS,
  jsonResponse,
  searchContactByEmail,
  createContact,
  updateContact,
} from './_hubspot';

interface ApplyBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeCoverNote?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const key = context.env.HUBSPOT_SERVICE_KEY;
  if (!key)
    return jsonResponse({ success: false, error: 'HUBSPOT_SERVICE_KEY not configured' }, 500);

  let body: ApplyBody;
  try {
    body = (await context.request.json()) as ApplyBody; // safe: validated below
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const { firstName, lastName, email, phone, resumeCoverNote } = body;
  const required: Record<string, string> = { firstName, lastName, email, phone };
  for (const [field, val] of Object.entries(required)) {
    if (!val || !val.trim())
      return jsonResponse({ success: false, error: `Missing required field: ${field}` }, 400);
  }

  // TODO: File upload — accept resume file, upload via HubSpot Files API (POST /filemanager/api/v3/files/upload), then set therapist_resume property to the file URL

  const props: Record<string, string> = {
    firstname: firstName,
    lastname: lastName,
    email,
    phone,
    resume_cover_note: resumeCoverNote ?? '',
    contact_type: 'Provider',
    refer_source: 'Website Form',
    website_form: 'Apply Job',
  };

  let contactId: string;
  try {
    const existingId = await searchContactByEmail(email, key);
    if (existingId) {
      await updateContact(existingId, props, key);
      contactId = existingId;
    } else {
      contactId = await createContact(props, key);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'HubSpot error', details: String(err) }, 500);
  }

  return jsonResponse({ success: true, contactId }, 200);
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
