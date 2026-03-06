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
      if (data.success) setResult(data.url);
      else setError(data.error ?? 'Unknown error');
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
    <>
      <div style={s.bg} />
      <main style={s.main}>
        <div style={s.card}>

          {/* Header */}
          <div style={s.header}>
            <span style={s.badge}>medal.tv</span>
            <h1 style={s.title}>Extract a clip</h1>
            <p style={s.subtitle}>
              Paste any Medal.tv link to get a direct MP4 — no login needed.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.inputWrap}>
              <svg
                style={s.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <input
                className="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://medal.tv/games/.../clips/..."
                required
              />
            </div>
            <button type="submit" disabled={loading} className="extract-btn">
              {loading ? (
                <><span className="spinner" />Extracting…</>
              ) : (
                'Extract →'
              )}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div style={s.errorBox}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="8" cy="8" r="6.5" stroke="#f87171" strokeWidth="1.5" />
                <path d="M8 5v3.5M8 10.5v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div style={s.result} className="result-container">
              <div style={s.videoWrap}>
                <video src={result} controls style={s.video} />
              </div>
              <div style={s.actions}>
                <a href={result} download className="action-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </a>
                <button onClick={handleCopy} className="action-btn">
                  {copied ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy URL
                    </>
                  )}
                </button>
              </div>
              <p style={s.urlText}>{result}</p>
            </div>
          )}
        </div>

        <p style={s.footer}>
          Works with{' '}
          <a href="https://medal.tv" target="_blank" rel="noreferrer" style={s.footerLink}>
            medal.tv
          </a>{' '}
          &middot; Up to 1080p &middot; No login required
        </p>
      </main>
    </>
  );
}

const s = {
  bg: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    background:
      'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(99,102,241,0.22) 0%, transparent 65%), #07070f',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '560px',
    background: 'rgba(11, 11, 19, 0.82)',
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.07)',
    padding: '2.5rem',
    boxShadow:
      '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
  },
  header: {
    marginBottom: '1.75rem',
  },
  badge: {
    display: 'inline-block',
    padding: '0.2rem 0.7rem',
    borderRadius: '999px',
    background: 'rgba(99,102,241,0.14)',
    border: '1px solid rgba(99,102,241,0.28)',
    color: '#a5b4fc',
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '0.85rem',
  },
  title: {
    margin: '0 0 0.45rem',
    fontSize: '2rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
    background: 'linear-gradient(135deg, #e2e8ff 0%, #a78bfa 45%, #67e8f9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    margin: 0,
    color: 'rgba(255,255,255,0.33)',
    fontSize: '0.88rem',
    lineHeight: '1.55',
  },
  form: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap',
  },
  inputWrap: {
    flex: 1,
    minWidth: 0,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '0.85rem',
    width: '15px',
    height: '15px',
    color: 'rgba(255,255,255,0.28)',
    pointerEvents: 'none',
    zIndex: 1,
    flexShrink: 0,
  },
  errorBox: {
    marginTop: '1rem',
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    background: 'rgba(239,68,68,0.07)',
    border: '1px solid rgba(239,68,68,0.18)',
    color: '#fca5a5',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    lineHeight: '1.4',
  },
  result: {
    marginTop: '1.75rem',
  },
  videoWrap: {
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#000',
    boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
  },
  video: {
    width: '100%',
    display: 'block',
    maxHeight: '340px',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.9rem',
    flexWrap: 'wrap',
  },
  urlText: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: '0.7rem',
    marginTop: '0.6rem',
    wordBreak: 'break-all',
    lineHeight: '1.45',
  },
  footer: {
    marginTop: '1.5rem',
    color: 'rgba(255,255,255,0.2)',
    fontSize: '0.78rem',
    textAlign: 'center',
  },
  footerLink: {
    color: 'rgba(165,180,252,0.45)',
    textDecoration: 'none',
  },
};
