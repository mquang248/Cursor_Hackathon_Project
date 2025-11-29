import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';

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
  title: 'Việt Sử Ký | VietChronicle - Lịch Sử Việt Nam',
  description: 'Trải nghiệm lịch sử Việt Nam được tái hiện như mạng xã hội hiện đại. Experience Vietnamese historical events reimagined as a modern social media feed.',
  keywords: ['lịch sử', 'việt nam', 'history', 'vietnam', 'social media', 'timeline', 'giáo dục', 'education', 'việt sử ký', 'vietchronicle'],
  authors: [{ name: 'Việt Sử Ký / VietChronicle Team' }],
  openGraph: {
    title: 'Việt Sử Ký | VietChronicle',
    description: 'Khám phá lịch sử Việt Nam qua góc nhìn mạng xã hội hiện đại. Explore Vietnamese history through a modern social media lens.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
