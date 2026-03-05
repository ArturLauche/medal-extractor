# Medal Video Extractor

A web application that extracts direct video links from [Medal.tv](https://medal.tv/) clips. This project consists of:

1. **Frontend**: A React + Vite application that provides a user-friendly interface
2. **Backend**: A Cloudflare Worker that handles the video extraction logic

## Project Structure

```
medal/
├── frontend/          # React + Vite frontend (hostable on Vercel)
│   ├── src/
│   │   ├── App.jsx    # Main application component
│   │   ├── App.css    # Styles
│   │   └── main.jsx   # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vercel.json    # Vercel configuration
│   └── .env.example   # Environment variables template
├── src/
│   └── index.js       # Cloudflare Worker backend
├── package.json
└── wrangler.toml      # Cloudflare Workers configuration
```

## Frontend Setup (Vercel)

### Prerequisites
- Node.js 18+ installed
- A deployed backend URL (Cloudflare Worker or similar)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your backend URL:
   ```
   VITE_API_URL=https://your-backend-url.workers.dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Deploying to Vercel

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   
   Option A - Using Vercel CLI:
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```

   Option B - Using Vercel Dashboard:
   - Push your code to GitHub/GitLab/Bitbucket
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set the root directory to `frontend`
   - Add environment variable `VITE_API_URL` with your backend URL
   - Deploy

3. **Environment Variables on Vercel**:
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables"
   - Add `VITE_API_URL` with your backend URL value
   - Redeploy if needed

## Backend Setup (Cloudflare Workers)

### Prerequisites
- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure `wrangler.toml` with your Cloudflare account ID and KV namespace IDs.

3. Create KV namespaces:
   ```bash
   wrangler kv:namespace create "KEYS"
   wrangler kv:namespace create "KEYS" --preview
   ```

4. Update `wrangler.toml` with the returned IDs.

5. Deploy:
   ```bash
   wrangler deploy
   ```

## Usage

1. Open the frontend application (either locally or on Vercel)
2. Paste a Medal.tv clip URL (e.g., `https://medal.tv/games/minecraft/clip/...`)
3. Click "Extract Video"
4. Get the direct video URL, copy it, or watch it directly in the player

## API

### Request
```json
POST /
{
  "url": "https://medal.tv/games/minecraft/clip/<id>"
}
```

### Response
```json
{
  "success": true,
  "url": "https://cdn.medal.tv/source/xxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.mp4"
}
```

## Technologies Used

- **Frontend**: React, Vite, CSS
- **Backend**: Cloudflare Workers, JavaScript
- **Deployment**: Vercel (frontend), Cloudflare Workers (backend)

## License

MIT
