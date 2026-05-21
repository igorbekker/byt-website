/**
 * Purpose: Shared SEO meta fields for pages and global site settings
 * Context: Embedded in siteSettings (default fallback) and all page singletons
 * Source: design-source/pages/Homepage.html (meta tags)
 */
import { defineType, defineField } from 'sanity';

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Overrides page title in search results. 50–60 characters recommended.',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: '150–160 characters recommended.',
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'robotsDirective',
      title: 'Robots Directive',
      type: 'string',
      options: {
        list: [
          { title: 'index, follow (default)', value: 'index, follow' },
          { title: 'noindex, follow', value: 'noindex, follow' },
          { title: 'noindex, nofollow', value: 'noindex, nofollow' },
        ],
      },
      description: 'Controls search engine indexing for this page. Defaults to index, follow.',
    }),
  ],
});
