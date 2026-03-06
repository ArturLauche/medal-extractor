# Medal Extractor

A Next.js web app that extracts direct MP4 video URLs from [Medal.tv](https://medal.tv) clip links.

## How It Works

Paste a Medal.tv clip URL into the form, hit **Extract**, and get a direct video link you can watch inline, copy, or download.

The API:
1. Validates the URL matches `medal.tv/games/.../clips/...`
2. Fetches Medal’s internal `_next/data` endpoint to read clip metadata
3. Auto-detects the current build hash from `medal.tv` if the path is stale
4. Returns the highest available quality (1080p → 720p → … → 144p fallback)

The API route uses the **Edge runtime** (`export const runtime = 'edge'`), which means it runs on Cloudflare’s V8 isolates, Netlify Edge Functions, and Vercel Edge — only standard Web APIs (`fetch`, `Response`) are used.

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

### Vercel (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ArturLauche/medal-extractor)

Zero configuration needed.

### Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir .next
```

Or connect the repo in the Netlify dashboard — it auto-detects Next.js.

### Cloudflare Pages

```bash
npm install -D @cloudflare/next-on-pages
npx @cloudflare/next-on-pages
```

Set the build command to `npx @cloudflare/next-on-pages` and output directory to `.vercel/output/static` in your Cloudflare Pages project settings. The Edge runtime on the API route is already configured.
