# Medal Video Extractor

A web application that extracts direct video links from [Medal.tv](https://medal.tv/) clips. This project is now fully hostable on Vercel with both frontend and backend API in a single deployment.

## Project Structure

```
medal/
├── frontend/          # React + Vite application (hostable on Vercel)
│   ├── src/
│   │   ├── App.jsx    # Main application component
│   │   ├── App.css    # Styles
│   │   └── main.jsx   # Entry point
│   ├── api/
│   │   └── index.js   # Vercel Serverless Function (backend API)
│   ├── index.html
│   ├── package.json
│   └── vercel.json    # Vercel configuration
├── src/
│   └── index.js       # Original Cloudflare Worker backend (legacy)
├── package.json
└── wrangler.toml      # Cloudflare Workers configuration (legacy)
```

## Quick Start - Deploy Everything on Vercel

This project can now be deployed entirely on Vercel with no external dependencies!

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set the **Root Directory** to `frontend`
   - Click "Deploy"

3. **That's it!** Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts** to complete deployment

## Local Development

### Prerequisites
- Node.js 18+ installed

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run at `http://localhost:5173` and API calls will be proxied to `/api`.

### Building for Production

```bash
npm run build
npm run preview
```

## How It Works

### Frontend
- Built with React 19 and Vite 7
- Clean, modern UI with purple gradient theme
- Responsive design for mobile devices
- Built-in video player for previewing extracted videos
- Copy-to-clipboard functionality

### Backend API (Vercel Serverless Function)
- Located in `frontend/api/index.js`
- Automatically deployed as a serverless function by Vercel
- Handles Medal.tv URL validation and video extraction
- Uses in-memory caching for better performance
- Includes automatic build code detection for Medal.tv changes

### Deployment Configuration
- `vercel.json` configures rewrites to serve the SPA and route API requests
- No environment variables required for basic functionality
- CORS enabled for cross-origin requests

## Usage

1. Open the application (locally or on Vercel)
2. Paste a Medal.tv clip URL (e.g., `https://medal.tv/games/minecraft/clip/...`)
3. Click "Extract Video"
4. Get the direct video URL, copy it, or watch it directly in the player

## API Endpoint

When deployed on Vercel, the API is available at:
- Production: `https://your-domain.vercel.app/api`
- Development: `http://localhost:5173/api`

### Request
```json
POST /api
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

Error responses:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Technologies Used

- **Frontend**: React 19, Vite 7, CSS
- **Backend**: Vercel Serverless Functions (Node.js)
- **Deployment**: Vercel (both frontend and backend)

## Legacy Setup (Cloudflare Workers)

The original Cloudflare Worker implementation is still available in the `src/` directory for reference. To use it:

1. Install Wrangler CLI: `npm install -g wrangler`
2. Configure `wrangler.toml` with your Cloudflare account
3. Deploy: `wrangler deploy`

However, the Vercel deployment is now recommended for simplicity.

## Troubleshooting

### Build fails on Vercel
- Ensure Node.js version is 18 or higher
- Check that all dependencies are listed in `package.json`

### API returns errors
- Verify the Medal.tv URL format is correct
- The clip might not exist or be private
- Medal.tv may have changed their API (automatic recovery is built-in)

### Video doesn't play
- Some browsers may block mixed content (HTTP video on HTTPS site)
- Try opening the video URL directly in a new tab

## License

MIT
