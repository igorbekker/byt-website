import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import sitemap from '@astrojs/sitemap';
import { createClient } from '@sanity/client';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SANITY_PROJECT_ID = 'bpjtbps6';
const SANITY_DATASET = 'production';
const GONE_DESTINATION = '/dev/null';
const REDIRECTS_HEADER = '# Cloudflare _redirects — generated at build time from Sanity\n';

function redirectsIntegration() {
  return {
    name: 'byt-redirects',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const client = createClient({
          projectId: SANITY_PROJECT_ID,
          dataset: SANITY_DATASET,
          apiVersion: '2024-01-01',
          useCdn: true,
        });
        const redirects = await client.fetch(
          `*[_type == "redirect" && isActive == true]{ sourcePath, destinationPath, statusCode } | order(sourcePath asc)`,
        );
        const lines = redirects.map((r) => {
          const dest = r.statusCode === 410 ? GONE_DESTINATION : r.destinationPath;
          return `${r.sourcePath} ${dest} ${r.statusCode}`;
        });
        const body = REDIRECTS_HEADER + (lines.length > 0 ? lines.join('\n') + '\n' : '');
        const outPath = join(new URL(dir).pathname, '_redirects');
        writeFileSync(outPath, body, 'utf-8');
        console.log(`[byt-redirects] wrote ${lines.length} redirect(s) to _redirects`);
      },
    },
  };
}

const SITE_URL = import.meta.env?.PUBLIC_SITE_URL ?? 'https://getbetteryou.com';

const PRIORITY_HIGH = 0.9;
const PRIORITY_NORMAL = 0.7;
const PRIORITY_LOW = 0.6;
const PRIORITY_LEGAL = 0.5;

const HIGH_PRIORITY_PATHS = ['/communities/', '/patients/', '/providers/'];
const NORMAL_PRIORITY_PATHS = ['/about/', '/careers/', '/blog/'];

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [
    redirectsIntegration(),
    sanity({
      projectId: 'bpjtbps6',
      dataset: 'production',
      useCdn: true,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: PRIORITY_NORMAL,
      serialize(item) {
        if (item.url === SITE_URL + '/' || item.url === SITE_URL) {
          item.changefreq = 'weekly';
          item.priority = 1.0;
          return item;
        }
        const path = item.url.replace(SITE_URL, '');
        if (HIGH_PRIORITY_PATHS.some(p => path.endsWith(p))) {
          item.changefreq = 'weekly';
          item.priority = PRIORITY_HIGH;
          return item;
        }
        if (NORMAL_PRIORITY_PATHS.some(p => path.endsWith(p))) {
          item.changefreq = 'weekly';
          item.priority = PRIORITY_NORMAL;
          return item;
        }
        if (path.endsWith('/contact/')) {
          item.changefreq = 'monthly';
          item.priority = PRIORITY_LOW;
          return item;
        }
        if (['/privacy/', '/terms/'].some(p => path.endsWith(p))) {
          item.changefreq = 'monthly';
          item.priority = PRIORITY_LEGAL;
          return item;
        }
        // Blog posts default
        item.changefreq = 'monthly';
        item.priority = PRIORITY_LOW;
        return item;
      },
    }),
  ],
});
