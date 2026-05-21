import type { Env } from './_hubspot';
import {
  CORS_HEADERS,
  jsonResponse,
  searchContactByEmail,
  createContact,
  updateContact,
} from './_hubspot';

interface ContactBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const key = context.env.HUBSPOT_SERVICE_KEY;
  if (!key)
    return jsonResponse({ success: false, error: 'HUBSPOT_SERVICE_KEY not configured' }, 500);

  let body: ContactBody;
  try {
    body = (await context.request.json()) as ContactBody; // safe: validated below
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const { firstName, lastName, email, phone, message } = body;
  const required: Record<string, string> = { firstName, lastName, email, message };
  for (const [field, val] of Object.entries(required)) {
    if (!val || !val.trim())
      return jsonResponse({ success: false, error: `Missing required field: ${field}` }, 400);
  }

  const props: Record<string, string> = {
    firstname: firstName,
    lastname: lastName,
    email,
    phone,
    message,
    refer_source: 'Website Form',
    website_form: 'Contact Us',
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
