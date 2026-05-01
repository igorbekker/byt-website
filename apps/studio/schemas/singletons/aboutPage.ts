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
    // ── Hero ─────────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heroSubhead', title: 'Hero Subhead', type: 'text' }),

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
    defineField({ name: 'ctaHeading', title: 'CTA Heading', type: 'string' }),
    defineField({ name: 'ctaSubhead', title: 'CTA Subhead', type: 'text' }),
    defineField({ name: 'ctaPrimary', title: 'CTA Primary', type: 'ctaLink' }),
    defineField({ name: 'ctaSecondary', title: 'CTA Secondary', type: 'ctaLink' }),

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'heroHeading' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'About' }),
  },
});
