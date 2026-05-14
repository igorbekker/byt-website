import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useClient } from 'sanity';

const API_VERSION = '2024-01-01';

interface RedirectDoc {
  _id: string;
  sourcePath: string;
  destinationPath: string;
  statusCode: number;
  isActive: boolean;
  notes?: string;
  hitCount?: number;
  lastHitAt?: string;
}

type SortKey = 'sourcePath' | 'destinationPath' | 'statusCode' | 'hitCount' | 'lastHitAt';
type SortDir = 'asc' | 'desc';

interface ParsedCSV {
  rows: Array<{ sourcePath: string; destinationPath: string }>;
  skipped: number;
}

function parseCSV(text: string): ParsedCSV {
  const lines = text
    .trim()
    .split('\n')
    .filter((l) => l.trim());
  if (lines.length < 2) return { rows: [], skipped: 0 };
  let skipped = 0;
  const rows: ParsedCSV['rows'] = [];
  for (const line of lines.slice(1)) {
    const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    if (vals.length !== 2 || !vals[0] || !vals[1]) {
      skipped++;
      continue;
    }
    rows.push({ sourcePath: vals[0], destinationPath: vals[1] });
  }
  return { rows, skipped };
}

function codeBadgeStyle(code: number): React.CSSProperties {
  if (code === 301) return { background: '#dbeafe', color: '#1e40af', ...badgeBase };
  if (code === 302) return { background: '#fef9c3', color: '#854d0e', ...badgeBase };
  return { background: '#fee2e2', color: '#991b1b', ...badgeBase };
}

function countBadgeStyle(color: 'green' | 'gray' | 'blue'): React.CSSProperties {
  const map = {
    green: { background: '#dcfce7', color: '#166534' },
    gray: { background: '#f3f4f6', color: '#374151' },
    blue: { background: '#dbeafe', color: '#1e40af' },
  };
  return { ...map[color], ...badgeBase, marginRight: 6 };
}

const badgeBase: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
};

export function RedirectManager() {
  const client = useClient({ apiVersion: API_VERSION });
  const [docs, setDocs] = useState<RedirectDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('sourcePath');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ msg: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchRedirects = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await client.fetch<RedirectDoc[]>(
        `*[_type == "redirect"] | order(sourcePath asc) { _id, sourcePath, destinationPath, statusCode, isActive, notes, hitCount, lastHitAt }`,
      );
      setDocs(rows);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    void fetchRedirects();
  }, [fetchRedirects]);

  const toggleActive = useCallback(
    async (doc: RedirectDoc) => {
      await client.patch(doc._id).set({ isActive: !doc.isActive }).commit();
      setDocs((prev) => prev.map((d) => (d._id === doc._id ? { ...d, isActive: !d.isActive } : d)));
    },
    [client],
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleCSV = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImporting(true);
      setImportResult(null);
      try {
        const text = await file.text();
        const { rows, skipped } = parseCSV(text);
        if (!rows.length)
          throw new Error(
            'No valid rows found — CSV must have a header row and at least one data row with exactly 2 columns.',
          );

        const tx = client.transaction();
        for (const row of rows) {
          const slug = row.sourcePath
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase();
          tx.createOrReplace({
            _id: `redirect-${slug}`,
            _type: 'redirect',
            sourcePath: row.sourcePath,
            destinationPath: row.destinationPath,
            statusCode: 301,
            isActive: true,
            notes: '',
            hitCount: 0,
          });
        }
        await tx.commit();
        const summary =
          skipped > 0
            ? `Imported ${rows.length} redirects. Skipped ${skipped} malformed rows.`
            : `Imported ${rows.length} redirects.`;
        setImportResult({ msg: summary, ok: true });
        await fetchRedirects();
      } catch (err) {
        setImportResult({ msg: err instanceof Error ? err.message : String(err), ok: false });
      } finally {
        setImporting(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [client, fetchRedirects],
  );

  const filtered = docs.filter(
    (d) => d.sourcePath.includes(filter) || d.destinationPath.includes(filter),
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const activeCount = docs.filter((d) => d.isActive).length;
  const inactiveCount = docs.length - activeCount;

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th onClick={() => handleSort(k)} style={styles.thSortable}>
      {label}
      {sortKey === k && <span style={styles.sortArrow}>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>}
    </th>
  );

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.heading}>Redirect Manager</h2>
          <div style={{ marginTop: 6 }}>
            <span style={countBadgeStyle('green')}>{activeCount} active</span>
            <span style={countBadgeStyle('gray')}>{inactiveCount} inactive</span>
            <span style={countBadgeStyle('blue')}>{docs.length} total</span>
          </div>
        </div>
        <div style={styles.actions}>
          <input
            type="text"
            placeholder="Filter by path…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.filterInput}
          />
          <label
            style={
              importing ? { ...styles.importBtn, ...styles.importBtnDisabled } : styles.importBtn
            }
          >
            {importing ? 'Importing…' : 'Import CSV'}
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleCSV}
              disabled={importing}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {importResult && (
        <div
          style={
            importResult.ok
              ? { ...styles.notice, background: '#f0fdf4', border: '1px solid #86efac' }
              : { ...styles.notice, background: '#fef2f2', border: '1px solid #fca5a5' }
          }
        >
          {importResult.ok ? '✓ ' : '✗ '}
          {importResult.msg}
        </div>
      )}

      {loading ? (
        <p style={styles.muted}>Loading…</p>
      ) : sorted.length === 0 ? (
        <p style={styles.muted}>
          {filter
            ? 'No redirects match that filter.'
            : 'No redirects yet. Create one in Studio or import a CSV.'}
        </p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <Th label="Source Path" k="sourcePath" />
                <Th label="Destination" k="destinationPath" />
                <Th label="Code" k="statusCode" />
                <th style={styles.th}>Active</th>
                <Th label="Hits" k="hitCount" />
                <Th label="Last Hit" k="lastHitAt" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((doc) => (
                <tr
                  key={doc._id}
                  style={doc.isActive ? styles.row : { ...styles.row, ...styles.rowInactive }}
                >
                  <td style={styles.td}>
                    <code style={styles.code}>{doc.sourcePath}</code>
                  </td>
                  <td style={styles.td}>
                    <code style={styles.code}>{doc.destinationPath}</code>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span style={codeBadgeStyle(doc.statusCode)}>{doc.statusCode}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={doc.isActive}
                      onChange={() => void toggleActive(doc)}
                      style={{ cursor: 'pointer', width: 16, height: 16 }}
                    />
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>{doc.hitCount ?? 0}</td>
                  <td style={{ ...styles.td, color: '#9ca3af', fontSize: 12 }}>
                    {doc.lastHitAt ? new Date(doc.lastHitAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={styles.hint}>
        CSV format:{' '}
        <code style={{ background: '#f3f4f6', padding: '1px 4px', borderRadius: 3 }}>
          sourcePath,destinationPath
        </code>{' '}
        — first row is header (skipped). One redirect per row. All imports use 301.
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100%',
    background: '#f9fafb',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  topBar: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  heading: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: '#111827',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  filterInput: {
    padding: '8px 12px',
    border: '1.5px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    color: '#111827',
    background: '#fff',
    outline: 'none',
    width: 220,
  },
  importBtn: {
    padding: '8px 16px',
    background: '#2276fc',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-block',
  },
  importBtnDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed',
  },
  notice: {
    padding: '12px 16px',
    borderRadius: 6,
    fontSize: 14,
    color: '#111827',
  },
  tableWrap: {
    overflowX: 'auto',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  theadRow: {
    background: '#f3f4f6',
    borderBottom: '1px solid #e5e7eb',
  },
  th: {
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#374151',
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  thSortable: {
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#374151',
    fontSize: 13,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  },
  sortArrow: {
    color: '#6b7280',
  },
  row: {
    borderBottom: '1px solid #f3f4f6',
  },
  rowInactive: {
    opacity: 0.45,
  },
  td: {
    padding: '10px 14px',
    verticalAlign: 'middle',
    color: '#111827',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    background: '#f3f4f6',
    padding: '2px 5px',
    borderRadius: 3,
  },
  muted: {
    color: '#6b7280',
    fontSize: 14,
    margin: 0,
  },
  hint: {
    color: '#9ca3af',
    fontSize: 13,
    margin: 0,
  },
};
