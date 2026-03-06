# Medal Extractor

A Next.js web app that extracts direct MP4 video URLs from [Medal.tv](https://medal.tv) clip links.

## How It Works

Paste a Medal.tv clip URL into the form, hit **Extract**, and you get a direct video link you can watch inline, copy, or download.

Internally the API:
1. Validates the URL matches `medal.tv/games/.../clips/...`
2. Fetches Medal’s `_next/data` endpoint to read clip metadata
3. Auto-detects the current build hash from `medal.tv` if the path is stale
4. Returns the highest available quality (1080p → 720p → … → 144p fallback)

## API

```
POST /api/extract
Content-Type: application/json

{ "url": "https://medal.tv/games/valorant/clips/abc123" }
```

**Success:**
```json
{ "success": true, "url": "https://cdn.medal.tv/..." }
```

**Error:**
```json
{ "success": false, "error": "Invalid Medal.tv clip URL" }
```

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy to [Vercel](https://vercel.com) — no environment variables required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ArturLauche/medal-extractor)
