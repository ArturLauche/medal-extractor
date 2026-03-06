'use client';

import { useState } from 'react';

function IconLink() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07l-1.67 1.67" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-2.92 2.92a5 5 0 0 0 7.07 7.07l1.67-1.67" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
        <div className="hero-badge">
          <span className="status-dot" />
          medal.tv extractor
        </div>
        <h1>Get the direct video link</h1>
        <p className="lead">
          Paste any Medal.tv clip URL — including localized links like{' '}
          <code>/de/</code> or <code>/en/</code> — to get a clean MP4 up to
          1080p.
        </p>
      </header>

      <main className="workspace">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <label htmlFor="clip-url">Clip URL</label>
            </div>

            <div className="input-shell">
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
                placeholder="https://medal.tv/de/games/.../clips/..."
                className="url-field"
                autoComplete="off"
                spellCheck="false"
              />
              <button type="button" onClick={handlePaste} className="paste-btn">
                Paste
              </button>
            </div>

            <p className="url-hint">
              Supports <code>medal.tv/games/[game]/clips/[id]</code> and
              localized URLs like{' '}
              <code>medal.tv/de/games/.../clips/[id]</code>. Query params are
              stripped automatically.
            </p>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner" /> Extracting&hellip;
                </>
              ) : (
                'Extract video'
              )}
            </button>
          </form>

          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          {result && (
            <div className="result">
              <video src={result} controls className="player" />

              <div className="result-actions">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn btn-ghost"
                >
                  {copied ? <IconCheck /> : <IconCopy />}
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
                <a
                  href={result}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                >
                  <IconExternal /> Open
                </a>
                <a href={result} download className="btn btn-primary">
                  <IconDownload /> Download
                </a>
              </div>

              <div className="url-box">
                <input
                  type="text"
                  readOnly
                  value={result}
                  onClick={(e) => e.target.select()}
                />
              </div>
            </div>
          )}
        </div>

        <div className="how-it-works">
          <h2>How it works</h2>
          <ol>
            <li>Copy a clip link from Medal.tv</li>
            <li>Paste it into the input above</li>
            <li>
              Click <strong>Extract video</strong>
            </li>
            <li>Preview, copy, or download the MP4</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
