export interface Env {
  HUBSPOT_SERVICE_KEY?: string;
}

export const HUBSPOT_BASE = 'https://api.hubapi.com';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function hubspotHeaders(key: string): Record<string, string> {
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

export function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

export async function searchContactByEmail(email: string, apiKey: string): Promise<string | null> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/contacts/search`;
  const res = await fetch(url, {
    method: 'POST',
    headers: hubspotHeaders(apiKey),
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
      properties: ['email'],
      limit: 1,
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { results: Array<{ id: string }> }; // safe: HubSpot search always returns this shape
  return data.results?.[0]?.id ?? null;
}

export async function createContact(
  properties: Record<string, string>,
  apiKey: string,
): Promise<string> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/contacts`;
  const res = await fetch(url, {
    method: 'POST',
    headers: hubspotHeaders(apiKey),
    body: JSON.stringify({ properties }),
  });
  if (res.status === 409) {
    const err = (await res.json()) as { message?: string }; // safe: HubSpot 409 always includes message
    const match = err.message?.match(/Existing ID:\s*(\d+)/i);
    if (match) return match[1];
    throw new Error(`Contact 409 but could not extract ID: ${JSON.stringify(err)}`);
  }
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Contact create failed (${res.status}): ${err}`);
  }
  const data = (await res.json()) as { id: string }; // safe: HubSpot create returns { id }
  return data.id;
}

export async function updateContact(
  contactId: string,
  properties: Record<string, string>,
  apiKey: string,
): Promise<void> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: hubspotHeaders(apiKey),
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Contact update failed (${res.status}): ${err}`);
  }
}

export async function searchCompanyByName(name: string, apiKey: string): Promise<string | null> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/companies/search`;
  const res = await fetch(url, {
    method: 'POST',
    headers: hubspotHeaders(apiKey),
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'name', operator: 'EQ', value: name }] }],
      properties: ['name'],
      limit: 1,
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { results: Array<{ id: string }> }; // safe: HubSpot search always returns this shape
  return data.results?.[0]?.id ?? null;
}

export async function createCompany(
  properties: Record<string, string>,
  apiKey: string,
): Promise<string> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/companies`;
  const res = await fetch(url, {
    method: 'POST',
    headers: hubspotHeaders(apiKey),
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Company create failed (${res.status}): ${err}`);
  }
  const data = (await res.json()) as { id: string }; // safe: HubSpot create returns { id }
  return data.id;
}

export async function updateCompany(
  companyId: string,
  properties: Record<string, string>,
  apiKey: string,
): Promise<void> {
  const url = `${HUBSPOT_BASE}/crm/v3/objects/companies/${companyId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: hubspotHeaders(apiKey),
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Company update failed (${res.status}): ${err}`);
  }
}

export async function uploadFileToHubSpot(
  base64DataUrl: string,
  fileName: string,
  folderPath: string,
  apiKey: string,
): Promise<string> {
  const match = base64DataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) throw new Error('Invalid base64 data URL');
  const binary = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
  const formData = new FormData();
  formData.append('file', new Blob([binary], { type: match[1] }), fileName);
  formData.append('options', JSON.stringify({ access: 'PUBLIC_NOT_INDEXABLE', overwrite: false }));
  formData.append('folderPath', folderPath);
  // No Content-Type header — fetch sets multipart boundary automatically
  const res = await fetch(`${HUBSPOT_BASE}/filemanager/api/v3/files/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });
  if (!res.ok) throw new Error(`File upload failed (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { url?: string; objects?: Array<{ url: string }> }; // safe: HubSpot Files API returns url or objects[0].url
  const url = data.url ?? data.objects?.[0]?.url;
  if (!url) throw new Error('No URL in file upload response');
  return url;
}
