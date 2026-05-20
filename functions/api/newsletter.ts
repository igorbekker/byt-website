import type { Env } from './_hubspot';
import {
  CORS_HEADERS,
  jsonResponse,
  searchContactByEmail,
  createContact,
  updateContact,
} from './_hubspot';

interface NewsletterBody {
  email: string;
  firstName: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const key = context.env.HUBSPOT_SERVICE_KEY;
  if (!key)
    return jsonResponse({ success: false, error: 'HUBSPOT_SERVICE_KEY not configured' }, 500);

  let body: NewsletterBody;
  try {
    body = (await context.request.json()) as NewsletterBody; // safe: validated below
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const { email, firstName } = body;
  if (!email || !email.trim())
    return jsonResponse({ success: false, error: 'Missing required field: email' }, 400);
  if (!firstName || !firstName.trim())
    return jsonResponse({ success: false, error: 'Missing required field: firstName' }, 400);

  const props: Record<string, string> = {
    email,
    firstname: firstName,
    refer_source: 'Website Form',
    website_form: 'Newsletter',
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
