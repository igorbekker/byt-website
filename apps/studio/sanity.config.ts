import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structure } from './structure';
import { MarkdownImportTool } from './tools/MarkdownImportTool';
import { DocxImportTool } from './tools/DocxImportTool';
import { RedirectManager } from './tools/RedirectManager';
import { createPreserveOldSlugAction } from './actions/preserveOldSlug';

const SLUG_SINGLETON_TYPES = [
  'homePage',
  'aboutPage',
  'patientsPage',
  'communitiesPage',
  'providersPage',
  'careersPage',
  'contactPage',
  'blogIndexPage',
  'privacyPage',
  'termsPage',
  'residentReferralPage',
] as const satisfies readonly string[];

export default defineConfig({
  name: 'byt-website',
  title: 'Better You Therapy',
  projectId: 'bpjtbps6',
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, { schemaType }) => {
      if (SLUG_SINGLETON_TYPES.includes(schemaType as (typeof SLUG_SINGLETON_TYPES)[number])) {
        return prev.map((action) =>
          (action as unknown as { action?: string }).action === 'publish' // safe: Sanity default actions carry a static .action string
            ? createPreserveOldSlugAction(action)
            : action,
        );
      }
      return prev;
    },
  },
  tools: [
    {
      name: 'markdown-import',
      title: 'Import Article',
      component: MarkdownImportTool,
    },
    {
      name: 'docx-import',
      title: 'Import Job Description',
      component: DocxImportTool,
    },
    {
      name: 'redirect-manager',
      title: 'Redirects',
      component: RedirectManager,
    },
  ],
});
