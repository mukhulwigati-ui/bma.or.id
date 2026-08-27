// app/layout.tsx

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import LayoutClientWrapper from '@/components/LayoutClientWrapper';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bma.or.id'),

  title: {
    default:
      'bma.or.id | Baitul Maal Al Muttaqin',
    template:
      '%s | bma.or.id',
  },

  description:
    'Platform resmi Baitul Maal Al Muttaqin Jepara untuk zakat, infak, sedekah, wakaf, dan berbagai program kebaikan.',

  manifest:
    '/manifest.json',

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BMA',
  },

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

  authors: [
    {
      name:
        'Baitul Maal Al Muttaqin',
      url:
        'https://bma.or.id',
    },
  ],

  creator:
    'Baitul Maal Al Muttaqin',

  publisher:
    'Baitul Maal Al Muttaqin',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title:
      'bma.or.id | Baitul Maal Al Muttaqin',

    description:
      'Zakat, infak, sedekah, wakaf, dan berbagai program kebaikan bersama Baitul Maal Al Muttaqin Jepara.',

    url:
      'https://bma.or.id',

    siteName:
      'Baitul Maal Al Muttaqin',

    locale:
      'id_ID',

    type:
      'website',

    images: [
      {
        url:
          'https://bma.or.id/images/banner.png',

        width:
          1200,

        height:
          630,

        type:
          'image/png',

        alt:
          'Baitul Maal Al Muttaqin',
      },
    ],
  },

  twitter: {
    card:
      'summary_large_image',

    title:
      'bma.or.id | Baitul Maal Al Muttaqin',

    description:
      'Platform resmi Baitul Maal Al Muttaqin Jepara.',

    images: [
      'https://bma.or.id/images/banner.png',
    ],
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      'max-video-preview':
        -1,

      'max-image-preview':
        'large',

      'max-snippet':
        -1,
    },
  },
};

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

        {/* =====================================================
            GOOGLE ANALYTICS
        ====================================================== */}

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
                  page_path:
                    window.location.pathname
                }
              );
            `,
          }}
        />

        {/* =====================================================
            MIDTRANS
        ====================================================== */}

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

        {/* =====================================================
            GLOBAL CLIENT LAYOUT

            Header + BottomNav sekarang dikontrol dari sini.
        ====================================================== */}

        <LayoutClientWrapper>
          {children}
        </LayoutClientWrapper>

      </body>

    </html>
  );
}