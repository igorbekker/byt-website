import type { Env } from './_hubspot';
import {
  CORS_HEADERS,
  jsonResponse,
  reportFormError,
  searchContactByEmail,
  createContact,
  updateContact,
} from './_hubspot';

interface NewsletterBody {
  email: string;
  firstName?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const key = context.env.HUBSPOT_SERVICE_KEY;
  if (!key) {
    await reportFormError(
      'Newsletter',
      'config_error',
      'HUBSPOT_SERVICE_KEY not configured',
      context.env,
      undefined,
      500,
    );
    return jsonResponse({ success: false, error: 'HUBSPOT_SERVICE_KEY not configured' }, 500);
  }

  let body: NewsletterBody;
  try {
    body = (await context.request.json()) as NewsletterBody; // safe: validated below
  } catch {
    await reportFormError(
      'Newsletter',
      'parse_error',
      'Invalid JSON body',
      context.env,
      undefined,
      400,
    );
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const { email, firstName } = body;
  if (!email || !email.trim()) {
    await reportFormError(
      'Newsletter',
      'validation_error',
      'Missing required field: email',
      context.env,
      body as Record<string, unknown>,
      400,
    );
    return jsonResponse({ success: false, error: 'Missing required field: email' }, 400);
  }

  const props: Record<string, string> = {
    email,
    refer_source: 'Website Form',
    website_form: 'Newsletter',
  };
  if (firstName?.trim()) props.firstname = firstName.trim();

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
    await reportFormError(
      'Newsletter',
      'hubspot_error',
      String(err),
      context.env,
      { email } as Record<string, unknown>,
      500,
    );
    return jsonResponse({ success: false, error: 'HubSpot error', details: String(err) }, 500);
  }

  return jsonResponse({ success: true, contactId }, 200);
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
