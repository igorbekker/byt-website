import type { Env } from './_hubspot';
import {
  CORS_HEADERS,
  jsonResponse,
  searchContactByEmail,
  createContact,
  updateContact,
} from './_hubspot';

interface BookSessionBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatBringsYouIn: string;
  howWillYouPay: string;
  bestTimesToReachYou: string;
  anythingElse?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const key = context.env.HUBSPOT_SERVICE_KEY;
  if (!key)
    return jsonResponse({ success: false, error: 'HUBSPOT_SERVICE_KEY not configured' }, 500);

  let body: BookSessionBody;
  try {
    body = (await context.request.json()) as BookSessionBody; // safe: validated below
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    whatBringsYouIn,
    howWillYouPay,
    bestTimesToReachYou,
    anythingElse,
  } = body;
  const required: Record<string, string> = {
    firstName,
    lastName,
    email,
    phone,
    whatBringsYouIn,
    howWillYouPay,
    bestTimesToReachYou,
  };
  for (const [field, val] of Object.entries(required)) {
    if (!val || !val.trim())
      return jsonResponse({ success: false, error: `Missing required field: ${field}` }, 400);
  }

  const props: Record<string, string> = {
    firstname: firstName,
    lastname: lastName,
    email,
    phone,
    what_brings_you_in: whatBringsYouIn,
    how_will_you_pay: howWillYouPay,
    best_times_to_reach_you: bestTimesToReachYou
      .split(',')
      .map((s) => s.trim())
      .join(';'),
    anything_else_we_should_know: anythingElse ?? '',
    contact_type: 'Patient',
    refer_source: 'Website Form',
    website_form: 'Book Session',
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
