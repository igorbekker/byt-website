import React, { useState, useCallback } from 'react';
import { useClient } from 'sanity';
import matter from 'gray-matter';
import { markdownToPortableText } from '@portabletext/markdown';

const API_VERSION = '2024-01-01';

// Normalize string for fuzzy name matching: lowercase + alphanumeric only
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Convert :::key-takeaways ... ::: to a standard H2 + bullet list
function preprocessCustomBlocks(md: string): string {
  return md.replace(/:::key-takeaways\s*\n([\s\S]*?):::/g, (_match, inner: string) => {
    return `## Key Takeaways\n\n${inner.trim()}`;
  });
}

// blogPost.body only allows { type: 'block' } — drop non-block items (hr, images, code blocks)
function onlyTextBlocks(blocks: unknown[]): unknown[] {
  return blocks.filter((b) => (b as { _type: string })._type === 'block');
}

interface ImportResult {
  id: string;
  warnings: string[];
}

const PLACEHOLDER = [
  '---',
  'title: Why Therapy Helps',
  'slug: why-therapy-helps',
  'publishedAt: 2026-05-01',
  'readingTime: 6',
  'excerpt: A short summary of the article.',
  'category: choosing-therapy',
  'author: Jane Smith',
  'subcategory: Getting Started',
  'seo:',
  '  title: Why Therapy Helps | Better You Therapy',
  '  description: SEO description here (150 chars max)',
  '---',
  '',
  '# Why Therapy Helps',
  '',
  'Article body starts here...',
].join('\n');

export function MarkdownImportTool() {
  const client = useClient({ apiVersion: API_VERSION });
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = useCallback(async () => {
    if (!input.trim()) return;
    setBusy(true);
    setResult(null);
    setError(null);

    try {
      // 1. Parse YAML frontmatter + markdown body
      const { data: fm, content: mdBody } = matter(input);
      const warnings: string[] = [];

      // 2. Fetch all categories and authors for reference resolution
      const [categories, authors] = await Promise.all([
        client.fetch<Array<{ _id: string; slug: string }>>(
          `*[_type == "blogCategory"]{ _id, "slug": slug.current }`,
        ),
        client.fetch<Array<{ _id: string; name: string }>>(`*[_type == "author"]{ _id, name }`),
      ]);

      // 3. Category reference — match by slug.current
      let categoryRef: { _type: 'reference'; _ref: string } | undefined;
      if (fm.category) {
        const cat = categories.find((c) => c.slug === String(fm.category));
        if (cat) {
          categoryRef = { _type: 'reference', _ref: cat._id };
        } else {
          warnings.push(
            `Category "${fm.category}" not found. Available: ${categories.map((c) => c.slug).join(', ') || 'none'}`,
          );
        }
      }

      // 4. Author reference — match by normalized name
      //    author schema has no slug — match against name, e.g. "sarah-johnson" → "Sarah Johnson"
      let authorRef: { _type: 'reference'; _ref: string } | undefined;
      if (fm.author) {
        const normTarget = normalize(String(fm.author));
        const auth = authors.find((a) => normalize(a.name) === normTarget);
        if (auth) {
          authorRef = { _type: 'reference', _ref: auth._id };
        } else {
          warnings.push(
            `Author "${fm.author}" not matched. Available: ${authors.map((a) => a.name).join(', ') || 'none'}`,
          );
        }
      }

      // 5. Convert markdown body to Portable Text
      const processedMd = preprocessCustomBlocks(mdBody);
      const allBlocks = markdownToPortableText(processedMd);
      const body = onlyTextBlocks(allBlocks);

      // 6. Build document — only include fields that have values
      const doc: Record<string, unknown> = { _type: 'blogPost' };

      if (fm.title) doc.title = String(fm.title);
      if (fm.slug) doc.slug = { _type: 'slug', current: String(fm.slug) };
      if (fm.publishedAt) {
        const parsed = new Date(fm.publishedAt);
        if (!isNaN(parsed.getTime())) doc.publishedAt = parsed.toISOString();
      }
      if (fm.readingTime) doc.readingTimeMinutes = Number(fm.readingTime);
      if (fm.excerpt) doc.excerpt = String(fm.excerpt);
      if (fm.subcategory) doc.subcategoryLabel = String(fm.subcategory);
      if (categoryRef) doc.category = categoryRef;
      if (authorRef) doc.author = authorRef;
      if (body.length > 0) doc.body = body;
      doc.featured = false;

      // SEO — gray-matter parses nested YAML: fm.seo.title / fm.seo.description
      const seoTitle = fm.seo?.title;
      const seoDesc = fm.seo?.description;
      if (seoTitle || seoDesc) {
        doc.seo = {
          _type: 'seoFields',
          ...(seoTitle ? { metaTitle: String(seoTitle) } : {}),
          ...(seoDesc ? { metaDescription: String(seoDesc) } : {}),
        };
      }

      // 7. Create as draft — publishable from Studio after review
      // safe: client.create accepts a SanityDocumentStub which is a Record with _type
      const created = await client.create(doc as Parameters<typeof client.create>[0]);

      setResult({ id: created._id, warnings });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [input, client]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Import Article from Markdown</h2>
        <p style={styles.subtext}>
          Paste the full markdown file (YAML frontmatter + body). A new draft blogPost will be
          created — review and publish it from the Blog Posts list.
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={22}
          placeholder={PLACEHOLDER}
          style={styles.textarea}
        />

        <button
          onClick={handleImport}
          disabled={busy || !input.trim()}
          style={busy || !input.trim() ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}
        >
          {busy ? 'Importing…' : 'Import as New Blog Post'}
        </button>

        {result && (
          <div style={{ ...styles.notice, ...styles.noticeSuccess }}>
            <p style={styles.noticeHeading}>✓ Blog post created as draft</p>
            <p>
              <a href={`/admin/structure/blogPost;${result.id}`} style={styles.link}>
                Open in Studio → Blog Posts
              </a>
            </p>
            <p style={styles.muted}>Document ID: {result.id}</p>
            {result.warnings.map((w, i) => (
              <p key={i} style={styles.warn}>
                ⚠ {w}
              </p>
            ))}
          </div>
        )}

        {error && (
          <div style={{ ...styles.notice, ...styles.noticeError }}>
            <p style={styles.noticeHeading}>Import failed</p>
            <p style={styles.muted}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100%',
    background: '#f5f5f5',
    padding: '40px 24px',
  },
  container: {
    maxWidth: 760,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  heading: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: '#111',
  },
  subtext: {
    margin: 0,
    fontSize: 14,
    color: '#555',
    lineHeight: 1.5,
  },
  textarea: {
    width: '100%',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 1.55,
    padding: 12,
    border: '1.5px solid #ddd',
    borderRadius: 6,
    resize: 'vertical',
    background: '#fff',
    color: '#111',
    boxSizing: 'border-box',
  },
  btn: {
    padding: '12px 24px',
    background: '#2276fc',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  btnDisabled: {
    background: '#aaa',
    cursor: 'not-allowed',
  },
  notice: {
    padding: '16px 20px',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  noticeSuccess: {
    background: '#ecfdf5',
    border: '1px solid #6ee7b7',
  },
  noticeError: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
  },
  noticeHeading: {
    margin: 0,
    fontWeight: 600,
    fontSize: 15,
    color: '#111',
  },
  muted: {
    margin: 0,
    fontSize: 13,
    color: '#555',
  },
  warn: {
    margin: 0,
    fontSize: 13,
    color: '#92400e',
  },
  link: {
    color: '#2276fc',
    textDecoration: 'underline',
    fontSize: 14,
  },
};
