import type { APIRoute } from 'astro';
import { sanityClient } from 'sanity:client';

export const GET: APIRoute = async () => {
  const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{ robotsTxt }`);
  const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://getbetteryou.com';
  const robotsContent = settings?.robotsTxt ?? 'User-agent: *\nAllow: /';
  const body = `${robotsContent}\n\nSitemap: ${siteUrl}/sitemap-index.xml`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
