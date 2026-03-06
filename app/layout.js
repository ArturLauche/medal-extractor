export const metadata = {
  title: 'Medal Extractor',
  description: 'Extract direct MP4 URLs from Medal.tv clip links',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
