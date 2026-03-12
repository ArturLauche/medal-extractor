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
      setError('Clipboard access denied. Please paste manually.');
    }
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Could not copy. Please select the URL and copy manually.');
    }
  }

  return (
    <main className="page">
      <header className="header">
        <h1>Medal Extractor</h1>
        <p>
          Extract direct MP4 links from Medal.tv clips. Supports all regions and URL formats.
        </p>
      </header>

      <div className="card card-main">
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="clip-url" className="field-label">
              Clip URL
            </label>
            <div className="input-group">
              <span className="field-icon">
                <IconLink />
              </span>
              <input
                id="clip-url"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                placeholder="https://medal.tv/games/.../clips/..."
                className="url-field"
                autoComplete="off"
                spellCheck="false"
              />
              <span className="input-divider" />
              <button type="button" onClick={handlePaste} className="paste-btn">
                Paste
              </button>
            </div>
            <p className="input-hint">
              Supports regional URLs (<code>/de/</code>, <code>/en/</code>) and invite links
            </p>
          </div>

          <button type="submit" disabled={loading || !url.trim()} className="submit-btn">
            {loading ? (
              <>
                <span className="spinner" />
                Extracting...
              </>
            ) : (
              'Extract video'
            )}
          </button>
        </form>

        {error && (
          <div className="feedback feedback-error" role="alert">
            {error}
          </div>
        )}

        {result && (
          <div className="result-panel">
            <div className="result-header">
              <h2>Video ready</h2>
              <span className="status-badge">Direct URL</span>
            </div>

            <div className="player-container">
              <video src={result} controls />
            </div>

            <div className="actions">
              <button type="button" onClick={handleCopy} className="action-btn">
                {copied ? <IconCheck /> : <IconCopy />}
                {copied ? 'Copied' : 'Copy link'}
              </button>
              <a href={result} target="_blank" rel="noreferrer" className="action-btn">
                <IconExternal />
                Open in new tab
              </a>
              <a href={result} download className="action-btn action-btn-primary">
                <IconDownload />
                Download
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

      <section className="info-section">
        <h3>Supported formats</h3>
        <ul className="info-list">
          <li>Standard clips: medal.tv/games/[game]/clips/[id]</li>
          <li>Regional URLs: medal.tv/[locale]/games/[game]/clips/[id]</li>
          <li>Invite links with query parameters (?invite=, &amp;v=, &amp;tab=)</li>
        </ul>
      </section>

    </main>
  );
}
