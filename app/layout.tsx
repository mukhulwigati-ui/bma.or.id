// app/layout.tsx

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import LayoutClientWrapper from '@/components/LayoutClientWrapper';

import './globals.css';

// ============================================================
// FONT
// ============================================================

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// ============================================================
// IDENTITAS WEBSITE
// ============================================================

const SITE_URL = 'https://www.bma.or.id';

const SITE_NAME = 'Baitul Maal Al Muttaqin';

const DEFAULT_TITLE =
  'bma.or.id | Baitul Maal Al Muttaqin';

const DEFAULT_DESCRIPTION =
  'Platform resmi Baitul Maal Al Muttaqin Jepara untuk zakat, infak, sedekah, wakaf, dan berbagai program kebaikan.';

const DEFAULT_IMAGE =
  `${SITE_URL}/images/banner.png`;

// ============================================================
// ROOT METADATA
// ============================================================

export const metadata: Metadata = {
  // PENTING:
  // sebelumnya salah:
  // https://wwww.bma.or.id
  metadataBase: new URL(SITE_URL),

  title: {
    default: DEFAULT_TITLE,
    template: '%s | bma.or.id',
  },

  description: DEFAULT_DESCRIPTION,

  applicationName: SITE_NAME,

  manifest: '/manifest.json',

  // ==========================================================
  // AUTHOR
  // ==========================================================

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,

  publisher: SITE_NAME,

  // ==========================================================
  // KEYWORDS
  // ==========================================================

  keywords: [
    'bma',
    'bma.or.id',
    'Baitul Maal Al Muttaqin',
    'BMA Jepara',
    'zakat online',
    'infak online',
    'sedekah online',
    'wakaf online',
    'donasi online',
  ],

  // ==========================================================
  // CANONICAL HOMEPAGE
  //
  // Child page seperti /campaign/[slug] dan /news/[slug]
  // dapat menimpa canonical ini melalui generateMetadata().
  // ==========================================================

  alternates: {
    canonical: SITE_URL,
  },

  // ==========================================================
  // OPEN GRAPH DEFAULT HOMEPAGE
  //
  // Campaign dan News akan menimpa bagian ini.
  // ==========================================================

  openGraph: {
    type: 'website',

    locale: 'id_ID',

    url: SITE_URL,

    siteName: SITE_NAME,

    title: DEFAULT_TITLE,

    description:
      'Zakat, infak, sedekah, wakaf, dan berbagai program kebaikan bersama Baitul Maal Al Muttaqin Jepara.',

    images: [
      {
        url: DEFAULT_IMAGE,

        width: 1200,

        height: 630,

        type: 'image/png',

        alt: SITE_NAME,
      },
    ],
  },

  // ==========================================================
  // TWITTER / X
  // ==========================================================

  twitter: {
    card: 'summary_large_image',

    title: DEFAULT_TITLE,

    description:
      'Platform resmi Baitul Maal Al Muttaqin Jepara.',

    images: [
      {
        url: DEFAULT_IMAGE,
        alt: SITE_NAME,
      },
    ],
  },

  // ==========================================================
  // ROBOTS
  // ==========================================================

  robots: {
    index: true,

    follow: true,

    googleBot: {
      index: true,

      follow: true,

      'max-video-preview': -1,

      'max-image-preview': 'large',

      'max-snippet': -1,
    },
  },

  // ==========================================================
  // APPLE / PWA
  // ==========================================================

  appleWebApp: {
    capable: true,

    statusBarStyle: 'default',

    title: 'BMA',
  },
};

// ============================================================
// ROOT LAYOUT
// ============================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body
        className="min-h-screen bg-slate-100 text-slate-800"
        suppressHydrationWarning
      >
        {/* ===================================================
            GOOGLE ANALYTICS
        ==================================================== */}

        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-FG813S8GLF"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];

              function gtag(){
                dataLayer.push(arguments);
              }

              gtag('js', new Date());

              gtag(
                'config',
                'G-FG813S8GLF',
                {
                  page_path: window.location.pathname
                }
              );
            `,
          }}
        />

        {/* ===================================================
            MIDTRANS
        ==================================================== */}

        <Script
          src="https://app.midtrans.com/snap/snap.js"
          data-client-key={
            process.env
              .NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ||
            ''
          }
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        {/* ===================================================
            GLOBAL CLIENT LAYOUT
        ==================================================== */}

        <LayoutClientWrapper>
          {children}
        </LayoutClientWrapper>
      </body>
    </html>
  );
}