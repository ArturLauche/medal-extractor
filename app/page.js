'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setCopied(false);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.url);
      } else {
        setError(data.error ?? 'Unknown error');
      }
    } catch {
      setError('Network error — is the server running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main style={s.main}>
      <div style={s.card}>
        <h1 style={s.title}>🎮 Medal Extractor</h1>
        <p style={s.subtitle}>Paste a Medal.tv clip link to get a direct MP4 URL</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://medal.tv/games/.../clips/..."
            required
            style={s.input}
          />
          <button type="submit" disabled={loading} style={s.button}>
            {loading ? 'Extracting…' : 'Extract'}
          </button>
        </form>

        {error && (
          <div style={s.errorBox}>
            <span>⚠️</span> {error}
          </div>
        )}

        {result && (
          <div style={s.result}>
            <video src={result} controls style={s.video} />
            <div style={s.actions}>
              <a href={result} download style={s.actionBtn}>⬇ Download</a>
              <button onClick={handleCopy} style={s.actionBtn}>
                {copied ? '✓ Copied!' : '📋 Copy URL'}
              </button>
            </div>
            <p style={s.urlText}>{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}

const s = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f0f',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '1rem',
  },
  card: {
    background: '#1a1a1a',
    borderRadius: '12px',
    padding: '2rem',
    width: '100%',
    maxWidth: '620px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
  },
  title: { color: '#fff', margin: '0 0 0.3rem', fontSize: '1.8rem', fontWeight: '700' },
  subtitle: { color: '#888', margin: '0 0 1.5rem', fontSize: '0.9rem' },
  form: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  input: {
    flex: 1,
    minWidth: '200px',
    padding: '0.65rem 1rem',
    borderRadius: '8px',
    border: '1px solid #2e2e2e',
    background: '#111',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  button: {
    padding: '0.65rem 1.4rem',
    borderRadius: '8px',
    border: 'none',
    background: '#6366f1',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  errorBox: {
    marginTop: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    background: '#2a1515',
    color: '#f87171',
    fontSize: '0.9rem',
  },
  result: { marginTop: '1.5rem' },
  video: { width: '100%', borderRadius: '8px', background: '#000', display: 'block' },
  actions: { display: 'flex', gap: '0.5rem', marginTop: '0.75rem' },
  actionBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    background: '#2a2a2a',
    color: '#fff',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  urlText: { color: '#555', fontSize: '0.75rem', marginTop: '0.5rem', wordBreak: 'break-all' },
};
