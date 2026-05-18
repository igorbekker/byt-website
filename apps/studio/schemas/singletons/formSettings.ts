/**
 * Purpose: Modal marketing copy — Book a Session and Refer a Resident
 * Context: Queried in BaseLayout and passed as props to ModalForms
 * Source: design-source/pages/CTA Forms.html
 */
import { defineType, defineField } from 'sanity';

export const formSettings = defineType({
  name: 'formSettings',
  title: 'Form Settings',
  type: 'document',
  fields: [
    // ── Book a Session modal ──────────────────────────────────────────────
    defineField({ name: 'bookEyebrow', title: 'Book — Eyebrow', type: 'string' }),
    defineField({ name: 'bookHeading', title: 'Book — Heading', type: 'string' }),
    defineField({
      name: 'bookValueProps',
      title: 'Book — Value Props (trust strip)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [defineField({ name: 'text', title: 'Text', type: 'string' })],
        },
      ],
      validation: (rule) => rule.max(5),
    }),
    defineField({ name: 'bookConsentText', title: 'Book — Consent Text', type: 'text' }),
    defineField({ name: 'bookSubmitLabel', title: 'Book — Submit Button Label', type: 'string' }),
    defineField({ name: 'bookFinePrint', title: 'Book — Fine Print', type: 'string' }),
    defineField({ name: 'bookSuccessHeading', title: 'Book — Success Heading', type: 'string' }),
    defineField({ name: 'bookSuccessBody', title: 'Book — Success Body', type: 'text' }),
    // ── Refer a Resident modal ────────────────────────────────────────────
    defineField({ name: 'referEyebrow', title: 'Refer — Eyebrow', type: 'string' }),
    defineField({ name: 'referHeading', title: 'Refer — Heading', type: 'string' }),
    defineField({ name: 'referSubhead', title: 'Refer — Subhead', type: 'text' }),
    defineField({ name: 'referConsentText', title: 'Refer — Consent Text', type: 'text' }),
    defineField({ name: 'referSubmitLabel', title: 'Refer — Submit Button Label', type: 'string' }),
    defineField({ name: 'referSuccessHeading', title: 'Refer — Success Heading', type: 'string' }),
    defineField({ name: 'referSuccessBody', title: 'Refer — Success Body', type: 'text' }),
    defineField({ name: 'referAsideEyebrow', title: 'Refer — Aside Eyebrow', type: 'string' }),
    defineField({
      name: 'referAsideSteps',
      title: 'Refer — Aside Steps (What to expect)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'stepNumber', title: 'Step Number', type: 'string' }),
            defineField({ name: 'text', title: 'Step Text', type: 'text' }),
          ],
        },
      ],
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: 'referAsideContactEyebrow',
      title: 'Refer — Contact Eyebrow',
      type: 'string',
    }),
    defineField({ name: 'hours', title: 'Office Hours', type: 'string' }),
  ],
});
