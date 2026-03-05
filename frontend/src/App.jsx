import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Replace with your deployed backend URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.url)
      } else {
        setError(data.error || 'Failed to extract video URL')
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the video URL')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🎬 Medal Video Extractor</h1>
        <p>Extract direct video links from Medal.tv clips</p>
      </header>

      <main className="main">
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://medal.tv/games/.../clips/..."
              className="input"
              required
            />
            <button type="submit" disabled={loading} className="button">
              {loading ? 'Extracting...' : 'Extract Video'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result">
            <div className="result-header">
              <span className="success-icon">✅</span>
              <h2>Video URL Extracted!</h2>
            </div>
            <div className="url-container">
              <input
                type="text"
                value={result}
                readOnly
                className="url-input"
                id="video-url"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result)
                  alert('URL copied to clipboard!')
                }}
                className="copy-button"
              >
                Copy
              </button>
            </div>
            <a href={result} target="_blank" rel="noopener noreferrer" className="download-link">
              Open in New Tab
            </a>
            <video controls className="video-player">
              <source src={result} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with React & Vite</p>
      </footer>
    </div>
  )
}

export default App
