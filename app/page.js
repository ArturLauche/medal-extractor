'use client';

import { useState } from 'react';

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07l-1.67 1.67" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-2.92 2.92a5 5 0 0 0 7.07 7.07l1.67-1.67" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const STEPS = [
  'Copy a clip link from Medal.tv',
  'Paste it into the input above',
  <span key="step-3">Click <strong>Extract video</strong></span>,
  'Preview, copy, or download',
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult('');
    setError('');
    setCopied(false);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (data.success) setResult(data.url);
      else setError(data.error ?? 'Something went wrong.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setError('');
      }
    } catch {
      setError('Clipboard access was denied. Paste the URL manually.');
    }
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Could not copy — select the URL below and copy it manually.');
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <span className="eyebrow">
          <span className="status-dot" />
          Medal.tv · Direct link extractor
        </span>

        <div className="hero-grid">
          <div className="hero-copy">
            <h1>
              Get the <span className="sparkle-word">direct link</span>
              <br />
              to any clip.
            </h1>
            <p className="lead">
              Paste a Medal.tv clip URL to get a clean CDN-direct MP4 — up to 1080p.
              Fast, simple, and a little more delightful than it needs to be.
            </p>
          </div>

          <div className="hero-notes">
            <div className="note-card">
              <p className="note-kicker">Feels nice</p>
              <p className="note-value">Fast flow</p>
              <p className="note-copy">Paste, extract, copy, done.</p>
            </div>
            <div className="note-card">
              <p className="note-kicker">Personal touch</p>
              <p className="note-value">Soft sparkle</p>
              <p className="note-copy">A cleaner UI with subtle personality.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="workspace">
        <div className="card card-main">
          <form className="form" onSubmit={handleSubmit}>
            <div className="field-top">
              <label htmlFor="clip-url" className="field-label">Clip URL</label>
              <span className="field-meta">Ready for public Medal links</span>
            </div>

            <div className="input-shell">
              <span className="field-icon"><IconLink /></span>
              <input
                id="clip-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://medal.tv/games/.../clips/..."
                className="url-field"
                required
                autoComplete="off"
              />
              <span className="shell-divider" />
              <button type="button" onClick={handlePaste} className="paste-btn">
                Paste
              </button>
            </div>

            <div className="input-help">
              <span>Supports the standard clip pattern</span>
              <span className="code-pill">medal.tv/games/[game]/clips/[clip-id]</span>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? <><span className="spinner" />Extracting…</> : 'Extract video'}
            </button>

            <div className="trust-row">
              <span>Free</span>
              <span className="trust-sep">·</span>
              <span>Up to 1080p</span>
              <span className="trust-sep">·</span>
              <span>No account required</span>
            </div>
          </form>

          {error && (
            <div className="feedback feedback-error" role="alert">{error}</div>
          )}

          {result && (
            <div className="result-panel">
              <div className="result-top">
                <div>
                  <p className="section-label">Preview</p>
                  <h2>Ready to use</h2>
                </div>
                <span className="status-pill">Direct URL</span>
              </div>

              <div className="player-wrap">
                <video src={result} controls />
              </div>

              <div className="result-toolbar">
                <button type="button" onClick={handleCopy} className="action-btn">
                  {copied ? <IconCheck /> : <IconCopy />}
                  {copied ? 'Copied' : 'Copy link'}
                </button>
                <a href={result} target="_blank" rel="noreferrer" className="action-btn">
                  <IconExternal /> Open file
                </a>
                <a href={result} download className="action-btn action-btn-solid">
                  <IconDownload /> Download
                </a>
              </div>

              <div className="url-output">
                <label htmlFor="result-url">Direct video URL</label>
                <input
                  id="result-url"
                  type="text"
                  readOnly
                  value={result}
                  onClick={(e) => e.target.select()}
                />
              </div>
            </div>
          )}
        </div>

        <aside className="card card-aside">
          <p className="section-label">Supported format</p>
          <h2>URL structure</h2>
          <pre className="code-block">{`medal.tv/games/[game]\n  /clips/[clip-id]`}</pre>

          <div className="aside-divider" />

          <p className="section-label">How it works</p>
          <ol className="steps-list">
            {STEPS.map((step, i) => (
              <li key={i} className="step-item">
                <span className="step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="aside-note">
            If a clip returns “not found”, verify it is still public on Medal before trying again.
          </div>
        </aside>
      </div>
    </div>
  );
}
