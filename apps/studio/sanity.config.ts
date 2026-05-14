import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structure } from './structure';
import { MarkdownImportTool } from './tools/MarkdownImportTool';
import { DocxImportTool } from './tools/DocxImportTool';
import { RedirectManager } from './tools/RedirectManager';

export default defineConfig({
  name: 'byt-website',
  title: 'Better You Therapy',
  projectId: 'bpjtbps6',
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
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
