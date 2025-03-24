import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

// Use a subset of the font to reduce size
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Use 'swap' to show text immediately with fallback font
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wallet.kofi.finance'),
  title: 'Kofi Wallet ☕️',
  description:
    'Maximize your Aptos staking yields with Kofi. Earn boosted rewards through liquid staking on Aptos.',
  keywords: [
    'Kofi',
    'Aptos',
    'Staking',
    'Liquid Staking',
    'DeFi',
    'Cryptocurrency',
    'Blockchain',
    'APT',
    'kAPT',
    'stkAPT',
  ],
  authors: [{ name: 'Kofi Finance' }],
  openGraph: {
    title: 'Kofi Wallet ☕️',
    description: 'Kofi Wallet ☕️',
    url: 'https://wallet.kofi.finance',
    siteName: 'Kofi Wallet',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kofi Finance - Next-gen Liquid Staking',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kofi Finance | Next-gen Liquid Staking',
    description: 'Maximize your Aptos staking yields with Kofi',
    images: ['/og-image.png'],
    creator: '@kofi_finance',
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#131313',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Preload critical assets */}
        <link rel="preload" href="/background-circles.svg" as="image" type="image/svg+xml" />
      </head>
      <Providers>
        <body className={inter.className}>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col relative">
              <main className="flex-1 bg-transparent">{children}</main>
            </div>
            <Toaster />
          </TooltipProvider>
        </body>
      </Providers>
    </html>
  );
}
