import './globals.css';

export const metadata = {
  metadataBase: new URL('https://medal-extractor.vercel.app'),
  title: {
    default: 'Medal Extractor | Direct Medal.tv MP4 Link Generator',
    template: '%s | Medal Extractor',
  },
  description:
    'Extract direct MP4 video URLs from public Medal.tv clips. Paste a clip URL, generate a CDN link instantly, then preview, copy, or download in seconds.',
  keywords: [
    'Medal.tv downloader',
    'Medal clip extractor',
    'Medal MP4 link',
    'direct video URL',
    'Medal clip download',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Medal Extractor | Direct Medal.tv MP4 Link Generator',
    description:
      'Generate direct MP4 links from public Medal.tv clips and download them quickly.',
    url: '/',
    siteName: 'Medal Extractor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medal Extractor | Direct Medal.tv MP4 Link Generator',
    description:
      'Paste a Medal.tv clip URL and get a direct CDN MP4 link you can preview, copy, or download.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
