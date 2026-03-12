export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://medal-extractor.vercel.app/sitemap.xml',
  };
}
