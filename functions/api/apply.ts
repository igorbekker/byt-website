import type { Env } from './_hubspot';
import {
  CORS_HEADERS,
  jsonResponse,
  searchContactByEmail,
  createContact,
  updateContact,
  uploadFileToHubSpot,
  createNote,
} from './_hubspot';

interface ApplyBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeCoverNote?: string;
  resumeFile?: string | null;
  resumeFileName?: string | null;
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

  const { firstName, lastName, email, phone, resumeCoverNote, resumeFile, resumeFileName } = body;
  const required: Record<string, string> = { firstName, email };
  for (const [field, val] of Object.entries(required)) {
    if (!val || !val.trim())
      return jsonResponse({ success: false, error: `Missing required field: ${field}` }, 400);
  }

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

  // Step 2 — file upload (non-fatal: contact creation already succeeded)
  let fileUploaded = false;
  let fileUrl: string | undefined;
  let noteId: string | undefined;
  let fileError: string | undefined;
  console.log('[apply] resumeFile present:', !!resumeFile, '| resumeFileName:', resumeFileName);
  if (resumeFile && resumeFileName) {
    try {
      console.log('[apply] calling uploadFileToHubSpot for:', resumeFileName);
      const { url, id: fileId } = await uploadFileToHubSpot(
        resumeFile,
        resumeFileName,
        '/resumes',
        key,
      );
      fileUrl = url;
      console.log('[apply] upload succeeded, url:', fileUrl, 'id:', fileId);
      await updateContact(contactId, { therapist_resume: fileUrl }, key);
      console.log('[apply] therapist_resume set on contact', contactId);
      noteId = await createNote(
        fileId,
        `Resume uploaded via website: ${resumeFileName}`,
        contactId,
        key,
      );
      console.log('[apply] note created:', noteId);
      fileUploaded = true;
    } catch (err) {
      fileError = String(err);
      console.log('[apply] file upload/update error:', fileError);
    }
  }

  return jsonResponse({ success: true, contactId, fileUploaded, fileUrl, noteId, fileError }, 200);
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
