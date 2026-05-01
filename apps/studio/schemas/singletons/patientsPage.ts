/**
 * Purpose: Patients page singleton — hero, audience selector, delivery tracks, conditions, CTA
 * Context: Rendered by apps/web/src/pages/patients.astro
 * Source: design-source/pages/Patients.html
 */
import { defineType, defineField } from 'sanity';

export const patientsPage = defineType({
  name: 'patientsPage',
  title: 'Patients',
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
    defineField({ name: 'heroPrimaryCta', title: 'Hero Primary CTA', type: 'ctaLink' }),

    // ── Audience Selector ─────────────────────────────────────────────────
    defineField({
      name: 'audienceSelectorHeading',
      title: 'Audience Selector Heading',
      type: 'string',
    }),
    defineField({
      name: 'audienceSelectorCards',
      title: 'Audience Selector Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
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
            defineField({ name: 'cta', title: 'CTA', type: 'ctaLink' }),
          ],
          preview: {
            select: { title: 'heading', subtitle: 'label' },
          },
        },
      ],
      validation: (r) => r.max(4),
    }),

    // ── Delivery Tracks ───────────────────────────────────────────────────
    defineField({ name: 'deliveryEyebrow', title: 'Delivery Eyebrow', type: 'string' }),
    defineField({
      name: 'deliveryTracks',
      title: 'Delivery Tracks',
      type: 'array',
      of: [{ type: 'serviceTrack' }],
      validation: (r) => r.max(2),
    }),

    // ── Belief Band ───────────────────────────────────────────────────────
    defineField({ name: 'beliefQuote', title: 'Belief Quote', type: 'string' }),
    defineField({ name: 'beliefBody', title: 'Belief Body', type: 'text' }),

    // ── Conditions Section ────────────────────────────────────────────────
    defineField({ name: 'conditionsEyebrow', title: 'Conditions Eyebrow', type: 'string' }),
    defineField({ name: 'conditionsHeading', title: 'Conditions Heading', type: 'string' }),
    defineField({ name: 'conditionsSubhead', title: 'Conditions Subhead', type: 'text' }),

    // ── CTA Band ──────────────────────────────────────────────────────────
    defineField({ name: 'ctaHeading', title: 'CTA Heading', type: 'string' }),
    defineField({ name: 'ctaSubhead', title: 'CTA Subhead', type: 'text' }),
    defineField({ name: 'ctaCta', title: 'CTA Button', type: 'ctaLink' }),

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'heroHeading' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'Patients' }),
  },
});
