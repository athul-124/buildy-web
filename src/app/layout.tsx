import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/Providers';

const geistSans = GeistSans; // Direct assignment
const geistMono = GeistMono; // Direct assignment

export const metadata: Metadata = {
  title: 'Thrissur Home Joy - Your Trusted Home Service Experts',
  description: 'Connect with vetted home service experts in Thrissur. Transparent pricing, instant consultations, and AI-powered scheduling.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
