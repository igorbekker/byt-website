// Studio config for the /admin embedding in the Astro app.
// Schema types are intentionally minimal here — the authoritative schemas
// live in apps/studio. Extract to packages/schemas in Phase 2.
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  name: 'byt-website',
  title: 'Better You Therapy',
  projectId: 'bpjtbps6',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: [],
  },
});
