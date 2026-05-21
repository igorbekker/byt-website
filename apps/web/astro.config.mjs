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

export default defineConfig({
  site: 'https://getbetteryou.com',
  output: 'static',
  integrations: [
    redirectsIntegration(),
    sanity({
      projectId: 'bpjtbps6',
      dataset: 'production',
      useCdn: true,
    }),
    sitemap({
      serialize(item) {
        const url = item.url.replace(/\/?$/, '/');
        if (url === 'https://getbetteryou.com/') return { ...item, url, priority: 1.0 };
        if (/\/(communities|patients|providers)\//.test(url)) return { ...item, url, priority: 0.9 };
        if (/\/(about|careers|blog)\//.test(url)) return { ...item, url, priority: 0.7 };
        if (/\/contact\//.test(url)) return { ...item, url, priority: 0.6 };
        if (/\/(privacy|terms)\//.test(url)) return { ...item, url, priority: 0.5 };
        return { ...item, url };
      },
    }),
  ],
});
