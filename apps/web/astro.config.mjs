import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sanity from '@sanity/astro';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    sanity({
      projectId: 'bpjtbps6',
      dataset: 'production',
      useCdn: true,
      studioBasePath: '/admin',
    }),
  ],
});
