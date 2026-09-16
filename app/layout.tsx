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
  'Baitul Maal Al Muttaqin | Zakat, Infak, Sedekah, Wakaf & Donasi';

const DEFAULT_DESCRIPTION =
  'Salurkan zakat, infak, sedekah, wakaf, dan donasi terbaik Anda melalui Baitul Maal Al Muttaqin.';

// ============================================================
// OPEN GRAPH IMAGE
//
// File:
// public/images/og-home.jpg
//
// Ukuran:
// 1200 x 630
//
// Format:
// JPEG
//
// File dibuat khusus lebih ringan untuk crawler WhatsApp,
// Facebook, Telegram, LinkedIn, dan media sosial lainnya.
// ============================================================

const DEFAULT_IMAGE =
  `${SITE_URL}/images/og-home.jpg`;

// ============================================================
// ROOT METADATA
// ============================================================

export const metadata: Metadata = {
  // ==========================================================
  // METADATA BASE
  // ==========================================================

  metadataBase: new URL(SITE_URL),

  // ==========================================================
  // TITLE
  // ==========================================================

  title: {
    default: DEFAULT_TITLE,
    template: '%s | bma.or.id',
  },

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  description: DEFAULT_DESCRIPTION,

  // ==========================================================
  // APPLICATION
  // ==========================================================

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
    'Baitul Maal Jepara',
    'zakat online',
    'infak online',
    'infaq online',
    'sedekah online',
    'wakaf online',
    'donasi online',
    'sedekah Jepara',
    'zakat Jepara',
  ],

  // ==========================================================
  // CANONICAL HOMEPAGE
  //
  // Child page seperti:
  //
  // /campaign/[slug]
  // /news/[slug]
  //
  // dapat menimpa canonical ini melalui generateMetadata().
  // ==========================================================

  alternates: {
    canonical: SITE_URL,
  },

  // ==========================================================
  // OPEN GRAPH
  //
  // Digunakan oleh:
  //
  // - WhatsApp
  // - Facebook
  // - Telegram
  // - LinkedIn
  // - crawler sosial lainnya
  //
  // Campaign dan News dapat menimpa metadata ini.
  // ==========================================================

  openGraph: {
    type: 'website',

    locale: 'id_ID',

    url: SITE_URL,

    siteName: SITE_NAME,

    title: DEFAULT_TITLE,

    description: DEFAULT_DESCRIPTION,

    images: [
      {
        url: DEFAULT_IMAGE,

        secureUrl: DEFAULT_IMAGE,

        width: 1200,

        height: 630,

        type: 'image/jpeg',

        alt:
          'Baitul Maal Al Muttaqin - Zakat, Infak, Sedekah, Wakaf dan Donasi',
      },
    ],
  },

  // ==========================================================
  // TWITTER / X
  // ==========================================================

  twitter: {
    card: 'summary_large_image',

    title: DEFAULT_TITLE,

    description: DEFAULT_DESCRIPTION,

    images: [
      {
        url: DEFAULT_IMAGE,

        width: 1200,

        height: 630,

        alt:
          'Baitul Maal Al Muttaqin - Zakat, Infak, Sedekah, Wakaf dan Donasi',
      },
    ],
  },

  // ==========================================================
  // META TAMBAHAN UNTUK CRAWLER SOSIAL
  //
  // Pola ini sama dengan yang berhasil pada Mukhlasin.
  //
  // Selain:
  //
  // <meta property="og:image" ...>
  //
  // dari openGraph.images, Next.js juga akan menghasilkan:
  //
  // <meta name="og:image" ...>
  // <meta name="og:image:secure_url" ...>
  //
  // Ini sengaja dipertahankan untuk kompatibilitas crawler.
  // ==========================================================

  other: {
    'og:image': DEFAULT_IMAGE,

    'og:image:secure_url': DEFAULT_IMAGE,
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

              function gtag() {
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
            process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
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