import { NextResponse } from 'next/server';

export const runtime = 'edge';

const URL_REGEX = /^(https?:\/\/)?medal\.tv\/games\/.*\/clips?(\/[\w\d-_]+){1,2}$/;
const QUALITIES = [1080, 720, 480, 360, 240, 144];

function getHighestQuality(clipData) {
  for (const q of QUALITIES) {
    if (clipData[`contentUrl${q}p`]) return clipData[`contentUrl${q}p`];
  }
  return clipData.socialMediaVideo ?? null;
}

async function getBuildPath() {
  const res = await fetch('https://medal.tv', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  const html = await res.text();
  const match = html.match(/\/_next\/static\/(\w+)\/_ssgManifest/);
  if (!match) throw new Error('Could not determine Medal build path');
  return match[1];
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body?.url) {
    return NextResponse.json({ success: false, error: 'No URL provided' }, { status: 400 });
  }

  if (!URL_REGEX.test(body.url)) {
    return NextResponse.json({ success: false, error: 'Invalid Medal.tv clip URL' }, { status: 400 });
  }

  let buildPath;
  try {
    buildPath = await getBuildPath();
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to contact Medal.tv' }, { status: 502 });
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    const apiUrl =
      body.url
        .replace('medal.tv', `medal.tv/_next/data/${buildPath}/en`)
        .replace('/clip/', '/clips/')
        .replace(/(\?.*)/, '') + '.json';

    let res;
    try {
      res = await fetch(apiUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });
    } catch {
      return NextResponse.json({ success: false, error: 'Network error contacting Medal' }, { status: 502 });
    }

    if (res.status === 404) {
      const data = await res.json().catch(() => null);
      if (data?.notFound) {
        return NextResponse.json({ success: false, error: 'Clip not found' }, { status: 404 });
      }
      if (attempt === 0) {
        try {
          buildPath = await getBuildPath();
        } catch {
          break;
        }
        continue;
      }
      break;
    }

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Unexpected Medal API response: ${res.status}` },
        { status: 502 }
      );
    }

    let data;
    try {
      data = await res.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Malformed response from Medal' }, { status: 502 });
    }

    const clipData = data?.pageProps?.clip;
    if (!clipData) {
      return NextResponse.json({ success: false, error: 'No clip data in Medal response' }, { status: 502 });
    }

    const videoUrl = getHighestQuality(clipData);
    if (!videoUrl) {
      return NextResponse.json({ success: false, error: 'No video URL found in clip data' }, { status: 502 });
    }

    return NextResponse.json({ success: true, url: videoUrl });
  }

  return NextResponse.json(
    { success: false, error: 'Medal may have changed their API — please open an issue' },
    { status: 502 }
  );
}
