import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';

export default defineConfig({
  output: 'static',
  integrations: [
    sanity({
      projectId: 'bpjtbps6',
      dataset: 'production',
      useCdn: true,
    }),
  ],
});
