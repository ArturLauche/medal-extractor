import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Matches medal.tv/games/.../clips/ID and locale variants like
// medal.tv/de/games/.../clips/ID — with or without query params.
const URL_REGEX =
  /^(https?:\/\/)?medal\.tv(\/[a-z]{2})?\/games\/[^/?#]+\/clips\/[\w\d-_]+/i;

function extractClipId(url) {
  // Stops at the first ? or & so query params are ignored
  const match = url.match(/\/clips\/([^/?&]+)/);
  return match ? match[1] : null;
}

async function getVideoUrl(clipId) {
  const pageUrl = `https://medal.tv/clips/${clipId}`;
  const res = await fetch(pageUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Medal returned ${res.status}`);

  const html = await res.text();

  // Primary: contentUrl embedded in Next.js hydration JSON
  const contentUrlMatch = html.split('"contentUrl":"')[1]?.split('"')[0];
  if (contentUrlMatch && contentUrlMatch.startsWith('http'))
    return contentUrlMatch;

  // Fallback 1: og:video:url meta tag
  const ogVideoMatch = html
    .split('property="og:video:url" content="')[1]
    ?.split('"')[0];
  if (ogVideoMatch && ogVideoMatch.startsWith('http')) return ogVideoMatch;

  // Fallback 2: og:video:secure_url meta tag
  const ogSecureMatch = html
    .split('property="og:video:secure_url" content="')[1]
    ?.split('"')[0];
  if (ogSecureMatch && ogSecureMatch.startsWith('http')) return ogSecureMatch;

  return null;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  if (!body?.url) {
    return NextResponse.json(
      { success: false, error: 'No URL provided' },
      { status: 400 }
    );
  }

  const trimmed = body.url.trim();

  if (!URL_REGEX.test(trimmed)) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Invalid Medal.tv URL. Expected: medal.tv/games/[game]/clips/[id] or medal.tv/[locale]/games/[game]/clips/[id]',
      },
      { status: 400 }
    );
  }

  const clipId = extractClipId(trimmed);
  if (!clipId) {
    return NextResponse.json(
      { success: false, error: 'Could not extract clip ID from URL' },
      { status: 400 }
    );
  }

  let videoUrl;
  try {
    videoUrl = await getVideoUrl(clipId);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: `Failed to reach Medal.tv: ${err.message}` },
      { status: 502 }
    );
  }

  if (!videoUrl) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Clip not found or video unavailable. Make sure the clip is still public.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, url: videoUrl });
}
