'use client';

import { useState } from 'react';

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07l-1.67 1.67" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-2.92 2.92a5 5 0 0 0 7.07 7.07l1.67-1.67" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
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
      if (data.success) {
        setResult(data.url);
      } else {
        setError(data.error ?? 'Unknown error');
      }
    } catch {
      setError('Network error. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Clipboard access was blocked. You can still copy the link manually below.');
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
      setError('Clipboard access was blocked. Paste the clip URL manually instead.');
    }
  }

  return (
    <main className="page-shell">
      <div className="background-orb background-orb-a" />
      <div className="background-orb background-orb-b" />

      <div className="page-frame">
        <section className="hero-block">
          <span className="eyebrow">Professional Medal.tv extractor</span>
          <h1>Clean direct links, without the clutter.</h1>
          <p>
            Paste a Medal.tv clip URL and get the highest available direct video link,
            ready to preview, copy, open, or download.
          </p>
        </section>

        <section className="workspace-grid">
          <div className="surface-card surface-card-main">
            <form onSubmit={handleSubmit} className="extract-form">
              <div className="label-row">
                <label htmlFor="clip-url">Clip URL</label>
                <span>Server-side extraction</span>
              </div>

              <div className="input-shell">
                <div className="input-icon">
                  <LinkIcon />
                </div>
                <input
                  id="clip-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://medal.tv/games/.../clips/..."
                  className="url-field"
                  required
                />
                <button type="button" onClick={handlePaste} className="paste-btn">
                  Paste
                </button>
              </div>

              <div className="form-actions-row">
                <button type="submit" disabled={loading} className="primary-btn">
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Extracting
                    </>
                  ) : (
                    'Extract video'
                  )}
                </button>

                <div className="hint-list">
                  <span className="hint-pill">Highest available quality</span>
                  <span className="hint-pill">No login required</span>
                </div>
              </div>
            </form>

            {error ? (
              <div className="feedback-banner feedback-error" role="alert">
                {error}
              </div>
            ) : null}

            {result ? (
              <section className="result-panel">
                <div className="result-heading-row">
                  <div>
                    <p className="section-kicker">Preview</p>
                    <h2>Your video is ready</h2>
                  </div>
                  <span className="status-badge">Live URL</span>
                </div>

                <div className="video-frame">
                  <video src={result} controls className="result-video" />
                </div>

                <div className="result-toolbar">
                  <button type="button" onClick={handleCopy} className="secondary-btn">
                    <CopyIcon />
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                  <a href={result} target="_blank" rel="noreferrer" className="secondary-btn secondary-btn-link">
                    <ExternalIcon />
                    Open file
                  </a>
                  <a href={result} download className="secondary-btn secondary-btn-link secondary-btn-strong">
                    <DownloadIcon />
                    Download
                  </a>
                </div>

                <div className="url-output-block">
                  <label htmlFor="result-url">Direct video URL</label>
                  <input id="result-url" readOnly value={result} className="result-url" />
                </div>
              </section>
            ) : null}
          </div>

          <aside className="surface-card surface-card-side">
            <p className="section-kicker">Why this feels better</p>
            <h2>Less gimmick, more product.</h2>
            <ul className="feature-list">
              <li>Clear hierarchy with a proper hero, workspace, and result state.</li>
              <li>Cleaner actions for paste, preview, copy, open, and download.</li>
              <li>More restrained visual style, so it feels modern instead of template-generated.</li>
            </ul>
            <div className="mini-note">
              Tip: if a clip fails, try opening it on Medal first to verify the link still exists.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
