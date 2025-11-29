import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'ChronoFeed | History as Social Media',
  description: 'Experience historical events reimagined as a modern social media feed. Travel through time with ChronoFeed.',
  keywords: ['history', 'social media', 'timeline', 'historical events', 'education'],
  authors: [{ name: 'ChronoFeed Team' }],
  openGraph: {
    title: 'ChronoFeed | History as Social Media',
    description: 'Experience historical events reimagined as a modern social media feed.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
