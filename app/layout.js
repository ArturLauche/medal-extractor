import './globals.css';

export const metadata = {
  title: 'Medal Extractor',
  description: 'Extract direct MP4 URLs from Medal.tv clip links',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
