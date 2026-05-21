/**
 * Purpose: About page singleton — mission, founder story, principles, and practice pillars
 * Context: Rendered by apps/web/src/pages/about.astro
 * Source: design-source/pages/About.html
 */
import { defineType, defineField } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'string',
      description: 'The URL path for this page (e.g. "about" = /about/). Leave empty for homepage.',
      validation: (r) =>
        r.required().custom((value, context) => {
          if (context.document?._type === 'homePage' && value === '') return true;
          if (!value) return 'Slug is required';
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
            return 'Slug must be lowercase letters, numbers, and hyphens only';
          return true;
        }),
    }),
    defineField({
      name: 'oldSlugs',
      title: 'Previous URL Slugs (auto-managed)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Previous slugs that redirect to the current slug. Do not edit manually.',
      readOnly: true,
    }),
    // ── Hero ─────────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heroSubhead', title: 'Hero Subhead', type: 'text' }),
    defineField({ name: 'heroTeamImage', title: 'Hero Team Image', type: 'imageWithAlt' }),

    // ── Mission ───────────────────────────────────────────────────────────
    defineField({ name: 'missionEyebrow', title: 'Mission Eyebrow', type: 'string' }),
    defineField({
      name: 'missionQuote',
      title: 'Mission Quote',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'missionBody', title: 'Mission Body', type: 'text' }),

    // ── Story ─────────────────────────────────────────────────────────────
    defineField({ name: 'storyHandsImage', title: 'Story Hands Image', type: 'imageWithAlt' }),
    defineField({ name: 'storyEyebrow', title: 'Story Eyebrow', type: 'string' }),
    defineField({ name: 'storyHeading', title: 'Story Heading', type: 'string' }),
    defineField({
      name: 'storyBody',
      title: 'Story Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // ── Founder ───────────────────────────────────────────────────────────
    defineField({ name: 'founderName', title: 'Founder Name', type: 'string' }),
    defineField({ name: 'founderCredential', title: 'Founder Credential', type: 'string' }),
    defineField({ name: 'founderPhoto', title: 'Founder Photo', type: 'imageWithAlt' }),

    // ── Principles ────────────────────────────────────────────────────────
    defineField({ name: 'principlesEyebrow', title: 'Principles Eyebrow', type: 'string' }),
    defineField({ name: 'principlesHeading', title: 'Principles Heading', type: 'string' }),
    defineField({ name: 'principlesSubhead', title: 'Principles Subhead', type: 'text' }),
    defineField({
      name: 'principles',
      title: 'Principles',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
          ],
          preview: {
            select: { title: 'heading', subtitle: 'number' },
          },
        },
      ],
      validation: (r) => r.max(3),
    }),

    // ── Practice ──────────────────────────────────────────────────────────
    defineField({ name: 'practiceEyebrow', title: 'Practice Eyebrow', type: 'string' }),
    defineField({ name: 'practiceHeading', title: 'Practice Heading', type: 'string' }),
    defineField({
      name: 'practicePillars',
      title: 'Practice Pillars',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
          ],
          preview: {
            select: { title: 'heading', subtitle: 'label' },
          },
        },
      ],
      validation: (r) => r.max(4),
    }),

    // ── CTA Band ──────────────────────────────────────────────────────────
    defineField({ name: 'ctaEyebrow', title: 'CTA Eyebrow', type: 'string' }),
    defineField({ name: 'ctaHeading', title: 'CTA Heading', type: 'string' }),
    defineField({ name: 'ctaSubhead', title: 'CTA Subhead', type: 'text' }),
    defineField({ name: 'ctaPrimary', title: 'CTA Primary', type: 'ctaLink' }),
    defineField({ name: 'ctaSecondary', title: 'CTA Secondary', type: 'ctaLink' }),
    defineField({
      name: 'ctaTertiary',
      title: 'CTA Tertiary Link',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'href', title: 'Href', type: 'string' }),
      ],
    }),
    defineField({
      name: 'ctaBackgroundImage',
      title: 'CTA Background Image',
      type: 'imageWithAlt',
    }),

    // ── Section Visibility ────────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Section Visibility',
      type: 'array',
      of: [{ type: 'pageSection' }],
      description:
        'Leave empty to show all sections. Add entries to control individual section visibility.',
    }),

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'heroHeading' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'About' }),
  },
});
