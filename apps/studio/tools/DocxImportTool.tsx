import React, { useState, useCallback } from 'react';
import { useClient } from 'sanity';
import JSZip from 'jszip';

const API_VERSION = '2024-01-01';

const SECTION_MARKERS: Record<string, string> = {
  about_us: 'About Us',
  about_role: 'About the Role',
  duties: 'Responsibilities',
  requirements: 'Requirements',
  offers: 'Why Join Us',
  apply: 'How to Apply',
};

type Track = 'teletherapy' | 'facility' | '';

interface ParsedJD {
  title: string;
  location: string;
  employmentType: string;
  aboutRole: string;
  duties: string[];
  requirements: string[];
  offers: string[];
}

interface ReviewState extends ParsedJD {
  track: Track;
  filename: string;
}

interface ImportResult {
  id: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);
}

function detectTrack(filename: string): Track {
  const lower = filename.toLowerCase();
  if (lower.includes('teletherapy') || lower.includes('online') || lower.includes('remote')) {
    return 'teletherapy';
  }
  if (
    lower.includes('onsite') ||
    lower.includes('on_site') ||
    lower.includes('on-site') ||
    lower.includes('geriatric') ||
    lower.includes('facility')
  ) {
    return 'facility';
  }
  return '';
}

function extractLinesFromXml(xmlText: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');
  const NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const paragraphs = doc.getElementsByTagNameNS(NS, 'p');
  const lines: string[] = [];
  for (const para of Array.from(paragraphs)) {
    const texts = para.getElementsByTagNameNS(NS, 't');
    const line = Array.from(texts)
      .map((t) => t.textContent ?? '')
      .join('')
      .trim();
    lines.push(line);
  }
  return lines;
}

function parseJD(lines: string[]): ParsedJD {
  let title = '';
  let location = '';
  let employmentType = '';
  const aboutRoleLines: string[] = [];
  const duties: string[] = [];
  const requirements: string[] = [];
  const offers: string[] = [];
  let section = 'header';

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line === SECTION_MARKERS.about_us) {
      section = 'about_us';
      continue;
    }
    if (line === SECTION_MARKERS.about_role) {
      section = 'about_role';
      continue;
    }
    if (line === SECTION_MARKERS.duties) {
      section = 'duties';
      continue;
    }
    if (line === SECTION_MARKERS.requirements) {
      section = 'requirements';
      continue;
    }
    if (line === SECTION_MARKERS.offers) {
      section = 'offers';
      continue;
    }
    if (line === SECTION_MARKERS.apply) {
      section = 'apply';
      continue;
    }

    if (section === 'header') {
      if (!title && !line.startsWith('Location:') && !line.startsWith('Employment Type:')) {
        title = line;
      } else if (line.startsWith('Location:')) {
        location = line.slice('Location:'.length).trim();
      } else if (line.startsWith('Employment Type:')) {
        employmentType = line.slice('Employment Type:'.length).trim();
      }
    } else if (section === 'about_role') {
      aboutRoleLines.push(line);
    } else if (section === 'duties') {
      duties.push(line);
    } else if (section === 'requirements') {
      requirements.push(line);
    } else if (section === 'offers') {
      offers.push(line);
    }
  }

  return {
    title,
    location,
    employmentType,
    aboutRole: aboutRoleLines.join('\n\n'),
    duties,
    requirements,
    offers,
  };
}

export function DocxImportTool() {
  const client = useClient({ apiVersion: API_VERSION });
  const [review, setReview] = useState<ReviewState | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setError(null);
    setReview(null);

    try {
      const buffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);
      const xmlFile = zip.file('word/document.xml');
      if (!xmlFile) throw new Error('word/document.xml not found — is this a valid .docx?');
      const xmlText = await xmlFile.async('string');
      const lines = extractLinesFromXml(xmlText);
      const parsed = parseJD(lines);
      if (!parsed.title) throw new Error('Could not extract title — check document format');
      setReview({
        ...parsed,
        track: detectTrack(file.name),
        filename: file.name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const handleCreate = useCallback(async () => {
    if (!review) return;
    setBusy(true);
    setError(null);

    try {
      const doc: Record<string, unknown> = {
        _type: 'jobPosting',
        _id: `drafts.${crypto.randomUUID()}`,
        title: review.title,
        slug: { _type: 'slug', current: slugify(review.title) },
        status: 'open',
        track: review.track,
        location: review.location,
        employmentType: review.employmentType,
        aboutRole: review.aboutRole,
        duties: review.duties,
        requirements: review.requirements,
        offers: review.offers,
      };

      // safe: client.create accepts a SanityDocumentStub which matches this shape
      const created = await client.create(doc as Parameters<typeof client.create>[0]);
      setResult({ id: created._id });
      setReview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [review, client]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Import Job Description from .docx</h2>
        <p style={styles.subtext}>
          Upload a job description .docx file. Review the parsed fields, then create as a draft
          jobPosting.
        </p>

        {!review && !result && (
          <label style={styles.fileLabel}>
            <input
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            Choose .docx file
          </label>
        )}

        {review && (
          <div style={styles.reviewPanel}>
            <p style={styles.reviewFilename}>File: {review.filename}</p>

            <div style={styles.fieldRow}>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
                value={review.title}
                onChange={(e) => setReview({ ...review, title: e.target.value })}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.label}>Location</label>
              <input
                style={styles.input}
                value={review.location}
                onChange={(e) => setReview({ ...review, location: e.target.value })}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.label}>Employment Type</label>
              <input
                style={styles.input}
                value={review.employmentType}
                onChange={(e) => setReview({ ...review, employmentType: e.target.value })}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.label}>Track</label>
              <select
                style={styles.input}
                value={review.track}
                onChange={(e) => setReview({ ...review, track: e.target.value as Track })}
              >
                <option value="">— unassigned —</option>
                <option value="teletherapy">Teletherapy</option>
                <option value="facility">Facility / On-site</option>
              </select>
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.label}>About the Role</label>
              <div style={styles.previewBox}>
                {review.aboutRole.slice(0, 300)}
                {review.aboutRole.length > 300 ? '…' : ''}
              </div>
            </div>

            <div style={styles.countRow}>
              <span style={styles.count}>Responsibilities: {review.duties.length} items</span>
              <span style={styles.count}>Requirements: {review.requirements.length} items</span>
              <span style={styles.count}>Offers: {review.offers.length} items</span>
            </div>

            <div style={styles.actions}>
              <button
                onClick={handleCreate}
                disabled={busy || !review.title}
                style={
                  busy || !review.title ? { ...styles.btn, ...styles.btnDisabled } : styles.btn
                }
              >
                {busy ? 'Creating…' : 'Create Draft Job Posting'}
              </button>
              <button
                onClick={() => {
                  setReview(null);
                  setError(null);
                }}
                style={styles.btnCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {result && (
          <div style={{ ...styles.notice, ...styles.noticeSuccess }}>
            <p style={styles.noticeHeading}>✓ Job posting created as draft</p>
            <p>
              <a href={`/admin/structure/jobPosting;${result.id}`} style={styles.link}>
                Open in Studio → Job Postings
              </a>
            </p>
            <p style={styles.muted}>Document ID: {result.id}</p>
            <button
              onClick={() => {
                setResult(null);
                setError(null);
              }}
              style={{ ...styles.btn, marginTop: 12 }}
            >
              Import Another
            </button>
          </div>
        )}

        {error && (
          <div style={{ ...styles.notice, ...styles.noticeError }}>
            <p style={styles.noticeHeading}>Error</p>
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
    maxWidth: 680,
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
  fileLabel: {
    display: 'inline-block',
    padding: '12px 24px',
    background: '#2276fc',
    color: '#fff',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  fileInput: {
    display: 'none',
  },
  reviewPanel: {
    background: '#fff',
    border: '1.5px solid #ddd',
    borderRadius: 8,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  reviewFilename: {
    margin: 0,
    fontSize: 13,
    color: '#888',
  },
  fieldRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#444',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  input: {
    padding: '9px 12px',
    border: '1.5px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    color: '#111',
    fontFamily: 'inherit',
    background: '#fafafa',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  previewBox: {
    padding: '10px 12px',
    border: '1.5px solid #ddd',
    borderRadius: 6,
    fontSize: 13,
    color: '#444',
    lineHeight: 1.55,
    background: '#fafafa',
    whiteSpace: 'pre-wrap' as const,
  },
  countRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap' as const,
  },
  count: {
    fontSize: 13,
    color: '#666',
    background: '#f0f0f0',
    padding: '4px 10px',
    borderRadius: 4,
  },
  actions: {
    display: 'flex',
    gap: 12,
    marginTop: 4,
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
  },
  btnDisabled: {
    background: '#aaa',
    cursor: 'not-allowed',
  },
  btnCancel: {
    padding: '12px 24px',
    background: '#fff',
    color: '#555',
    border: '1.5px solid #ddd',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
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
  link: {
    color: '#2276fc',
    textDecoration: 'underline',
    fontSize: 14,
  },
};
