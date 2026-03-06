import './globals.css';

export const metadata = {
  title: 'Medal Extractor',
  description: 'Get direct MP4 links from any Medal.tv clip. No account required.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
