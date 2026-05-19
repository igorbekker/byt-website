import { defineType, defineField } from 'sanity';

const OPTION_GROUPS = [
  { title: 'Book — Who is this for (radio)', value: 'bookFor' },
  { title: 'Book — Condition / reason (select)', value: 'conditionReasons' },
  { title: 'Book — Payment method (select)', value: 'paymentMethods' },
  { title: 'Book — Availability slot (chip)', value: 'availabilitySlots' },
  { title: 'Refer — Facility type (select)', value: 'facilityTypes' },
  { title: 'Refer — Service county (select)', value: 'serviceCounties' },
  { title: 'Refer — Bed count (select)', value: 'bedCounts' },
  { title: 'Refer — Existing care status (select)', value: 'existingCareStatuses' },
  { title: 'Refer — Facility role (select)', value: 'facilityRoles' },
  { title: 'Refer — Interest reason (chip)', value: 'interestReasons' },
] as const;

export const formOption = defineType({
  name: 'formOption',
  title: 'Form Option',
  type: 'document',
  preview: {
    select: { label: 'label', group: 'optionGroup' },
    prepare({ label, group }: { label?: string; group?: string }) {
      return { title: label ?? '(no label)', subtitle: group ?? '' };
    },
  },
  fields: [
    defineField({
      name: 'optionGroup',
      title: 'Option Group',
      type: 'string',
      description: 'Which form field this option belongs to',
      options: { list: OPTION_GROUPS },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Display text shown to the user',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'Form submission value — defaults to label text if left blank',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Sort order within the group (lower = first)',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Deactivate to hide from forms without deleting',
    }),
  ],
});
