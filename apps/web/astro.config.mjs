import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://getbetteryou.com',
  output: 'static',
  integrations: [
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
