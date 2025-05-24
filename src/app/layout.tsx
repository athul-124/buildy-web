import type { Metadata } from 'next';
import { Noto_Sans_Malayalam, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/Providers';

const notoSansMalayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam', 'latin'], // Added latin for better fallback with Inter
  weight: ['400', '500', '600', '700'], // Specify weights you'll use
  variable: '--font-noto-sans-malayalam',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Specify weights
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Buildly - Your Trusted Home Service Experts',
  description: 'Connect with vetted home service experts in Thrissur. Transparent pricing, instant consultations, and AI-powered scheduling.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSansMalayalam.variable} ${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
