'use client';

import { useState } from 'react';

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
      <div className="container">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">
              <IconPlay />
            </div>
            <h1>Medal Extractor</h1>
          </div>
          <p>Extract direct MP4 links from Medal.tv clips</p>
        </header>

        <div className="card card-main">
          <form className="form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="clip-url" className="field-label">
                <span className="label-icon"><IconLink /></span>
                Clip URL
              </label>
              <div className="input-wrapper">
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
                'Extract Video'
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
                <h2>Ready to download</h2>
                <span className="status-badge">MP4</span>
              </div>

              <div className="player-container">
                <video src={result} controls />
              </div>

              <div className="actions">
                <button type="button" onClick={handleCopy} className="action-btn">
                  {copied ? <IconCheck /> : <IconCopy />}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
                <a href={result} target="_blank" rel="noreferrer" className="action-btn">
                  <IconExternal />
                  Open
                </a>
                <a href={result} download className="action-btn action-btn-primary">
                  <IconDownload />
                  Download
                </a>
              </div>

              <div className="url-output">
                <label htmlFor="result-url">Direct URL</label>
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
          <button
            type="button"
            className="info-toggle"
            onClick={() => setShowInfo(!showInfo)}
            aria-expanded={showInfo}
          >
            Supported URL formats
            <IconChevron />
          </button>
          {showInfo && (
            <div className="info-content">
              <h3>Examples</h3>
              <ul className="info-list">
                <li>medal.tv/games/[game]/clips/[id]</li>
                <li>medal.tv/[locale]/games/[game]/clips/[id]</li>
                <li>Invite links with ?invite= or &amp;v= params</li>
              </ul>
            </div>
          )}
        </section>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>Free and open source</p>
          <a
            href="https://github.com/ArturLauche/medal-extractor"
            target="_blank"
            rel="noreferrer"
          >
            <IconGitHub />
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
