import type { APIRoute } from 'astro';
import { sanityClient } from 'sanity:client';
import { SITE_SETTINGS_QUERY } from '../lib/queries';

const SITE_URL = 'https://getbetteryou.com';
const CONTENT_SIGNAL = 'Content-Signal: ai-train=no, search=yes, ai-input=yes';

const DEFAULT_ROBOTS = `User-agent: *
Allow: /`;

export const GET: APIRoute = async () => {
  const settings = await sanityClient.fetch<{ robotsTxt?: string }>(SITE_SETTINGS_QUERY);
  const custom = settings?.robotsTxt?.trim() ?? DEFAULT_ROBOTS;
  const body = `${custom}\n${CONTENT_SIGNAL}\nSitemap: ${SITE_URL}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
