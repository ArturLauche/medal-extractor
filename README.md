# Medal Extractor

A Next.js web app that extracts direct MP4 video URLs from [Medal.tv](https://medal.tv) clip links.

## How It Works

Paste a Medal.tv clip URL into the form, hit **Extract**, and get a direct video link you can watch inline, copy, or download.

The API:
1. Validates the URL matches `medal.tv/games/.../clips/...`
2. Fetches Medal’s internal `_next/data` endpoint to read clip metadata
3. Auto-detects the current build hash from `medal.tv` if the path is stale
4. Returns the highest available quality (1080p → 720p → … → 144p fallback)

The API route is runtime-agnostic (no forced `edge` runtime export), which keeps it compatible with OpenNext Cloudflare server bundling while still using standard Web APIs (`fetch`, `Response`).

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

Cloudflare has deprecated `@cloudflare/next-on-pages` for modern Next.js apps. Use OpenNext instead:

```bash
pnpm dlx @opennextjs/cloudflare@latest build
```

In the Cloudflare Pages UI set:

- **Build command:** `pnpm dlx @opennextjs/cloudflare@latest build`
- **Build output directory:** `.open-next/assets`

OpenNext also requires `open-next.config.ts` in the project root with Cloudflare-compatible `default.override`/`middleware.override` settings (this repository includes them), otherwise Pages build fails configuration validation.

To avoid interactive OpenNext prompts in CI and satisfy Cloudflare Pages Wrangler config checks, this repository includes a minimal `wrangler.toml` with `pages_build_output_dir`.

Also ensure your project has a static icon in `public/icon.svg` (instead of `app/icon.svg`) so Pages does not treat the icon metadata route as a server route.
