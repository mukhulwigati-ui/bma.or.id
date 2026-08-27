// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import LayoutClientWrapper from '@/components/LayoutClientWrapper';
import BottomNav from '@/components/BottomNav';
import Script from 'next/script';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_URL = 'https://bma.or.id';
const SITE_LOCATION = 'Jepara';

// ============================================================
// MASTER SEO & PWA METADATA BMA.OR.ID
// ============================================================
export const metadata: Metadata = {
  title: {
    default:
      'bma.or.id | Baitul Maal Al Muttaqin - Zakat, Infak, Sedekah & Wakaf',
    template: '%s | bma.or.id',
  },

  description:
    'Salurkan zakat, infak, sedekah, wakaf, dan donasi program sosial melalui Baitul Maal Al Muttaqin di bma.or.id. Berpusat di Jepara dan hadir untuk memperluas manfaat bagi umat dan masyarakat.',

  manifest: '/manifest.json',

  applicationName: SITE_NAME,

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
  },

  keywords: [
    'Baitul Maal Al Muttaqin',
    'BMA Jepara',
    'bma.or.id',
    'baitul maal jepara',
    'zakat jepara',
    'zakat online',
    'infak online',
    'sedekah online',
    'sedekah subuh',
    'wakaf online',
    'wakaf quran',
    'donasi yatim dhuafa',
    'donasi santri',
    'donasi kemanusiaan',
    'donasi online jepara',
    'kalkulator zakat',
  ],

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  metadataBase: new URL(SITE_URL),

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title:
      'bma.or.id | Baitul Maal Al Muttaqin - Zakat, Infak, Sedekah & Wakaf',

    description:
      'Bersama Baitul Maal Al Muttaqin, tunaikan zakat, infak, sedekah, wakaf, dan dukung berbagai program sosial, pendidikan, dakwah, serta kemanusiaan melalui layanan digital bma.or.id.',

    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'id_ID',
    type: 'website',

    images: [
      {
        url: `${SITE_URL}/images/banner.png`,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: `${SITE_NAME} - Menghubungkan Amanah, Menghadirkan Manfaat`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'bma.or.id | Baitul Maal Al Muttaqin',

    description:
      'Platform digital Baitul Maal Al Muttaqin untuk zakat, infak, sedekah, wakaf, dan berbagai program kebaikan.',

    images: [
      `${SITE_URL}/images/banner.png`,
    ],
  },

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

  verification: {
    google:
      'google-site-verification-token-anda',
  },

  category: 'Nonprofit Organization',

  other: {
    'organization-name': SITE_NAME,
    'organization-short-name':
      SITE_SHORT_NAME,
    'organization-location':
      `${SITE_LOCATION}, Jawa Tengah, Indonesia`,
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
        className="min-h-screen bg-[#f8f8f6] flex flex-col text-slate-800"
        suppressHydrationWarning
      >

        {/* =====================================================
            GOOGLE ANALYTICS GA4
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

              gtag('config', 'G-FG813S8GLF', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* =====================================================
            MIDTRANS SNAP
        ====================================================== */}
        <Script
          src="https://app.midtrans.com/snap/snap.js"
          data-client-key={
            process.env
              .NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ||
            'Mid-client-NVjY5ccbH7M47czA'
          }
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        {/* =====================================================
            MAIN APPLICATION
        ====================================================== */}
        <LayoutClientWrapper>
          {children}
        </LayoutClientWrapper>

        {/* =====================================================
            GLOBAL BOTTOM NAVIGATION
        ====================================================== */}
        <BottomNav />

      </body>
    </html>
  );
}