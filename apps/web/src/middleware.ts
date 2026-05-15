import { defineMiddleware } from 'astro:middleware';
import { createClient } from '@sanity/client';

const PROJECT_ID = 'bpjtbps6';
const DATASET = 'production';
const API_VERSION = '2024-01-01';
const TTL_MS = 5 * 60 * 1000;

interface RedirectEntry {
  _id: string;
  destinationPath: string;
  statusCode: number;
}

let cache: Map<string, RedirectEntry> | null = null;
let cacheExpiry = 0;

function getEnvVar(locals: App.Locals, key: string): string | undefined {
  return (
    (import.meta.env[key] as string | undefined) ??
    (
      (locals as unknown as Record<string, unknown>).runtime as
        | Record<string, Record<string, string>>
        | undefined
    )?.env?.[key]
  );
}

async function loadRedirectMap(readToken: string | undefined): Promise<Map<string, RedirectEntry>> {
  if (cache && Date.now() < cacheExpiry) return cache;

  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    useCdn: false,
    ...(readToken ? { token: readToken } : {}),
  });

  const rows = await client.fetch<
    Array<{ _id: string; sourcePath: string; destinationPath: string; statusCode: number }>
  >(`*[_type == "redirect" && isActive == true]{ _id, sourcePath, destinationPath, statusCode }`);

  cache = new Map(
    rows.map((r) => [
      r.sourcePath,
      { _id: r._id, destinationPath: r.destinationPath, statusCode: r.statusCode },
    ]),
  );
  cacheExpiry = Date.now() + TTL_MS;
  return cache;
}

// safe: runtime.ctx is the Cloudflare ExecutionContext, available in server mode
function getWaitUntil(locals: App.Locals): ((p: Promise<unknown>) => void) | undefined {
  const rt = (locals as unknown as Record<string, unknown>).runtime as
    | { ctx?: { waitUntil?: (p: Promise<unknown>) => void } }
    | undefined;
  return rt?.ctx?.waitUntil?.bind(rt.ctx);
}

function trackHit(match: RedirectEntry, writeToken: string): Promise<unknown> {
  const writeClient = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    useCdn: false,
    token: writeToken,
  });
  return writeClient
    .patch(match._id)
    .inc({ hitCount: 1 })
    .set({ lastHitAt: new Date().toISOString() })
    .commit()
    .catch(() => undefined);
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Cloudflare runtime only exists in live Workers — skip during static prerendering
  const runtime = (context.locals as unknown as { runtime?: unknown }).runtime;
  if (!runtime) return next();

  const readToken = getEnvVar(context.locals, 'SANITY_API_READ_TOKEN');
  const writeToken = getEnvVar(context.locals, 'SANITY_WRITE_TOKEN');

  let map: Map<string, RedirectEntry>;
  try {
    map = await loadRedirectMap(readToken);
  } catch {
    return next();
  }

  const { pathname } = new URL(context.request.url);
  const match = map.get(pathname);
  if (!match) return next();

  // Fire-and-forget hit tracking — silently skipped if write token is absent
  if (writeToken) {
    const waitUntil = getWaitUntil(context.locals);
    if (waitUntil) {
      waitUntil(trackHit(match, writeToken));
    } else {
      void trackHit(match, writeToken);
    }
  }

  if (match.statusCode === 410) return new Response(null, { status: 410 });
  return Response.redirect(match.destinationPath, match.statusCode as 301 | 302);
});
