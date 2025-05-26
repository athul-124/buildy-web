
import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Malayalam, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/Providers'; // Original Providers
import { AuthProvider } from '@/contexts/AuthContext'; // New AuthProvider

const notoSansMalayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-malayalam',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const APP_NAME = "Buildly";
const APP_DESCRIPTION = "Connect with vetted home service experts in Thrissur. Transparent pricing, instant consultations, and AI-powered scheduling.";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#38a169", // Kerala Green (Primary for UI buttons)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSansMalayalam.variable} ${inter.variable} font-sans antialiased`}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <Providers> {/* Original Providers, if any actual providers were inside */}
            {children}
            <Toaster />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
