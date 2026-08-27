// app/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@sanity/client';
import {
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import Hero, {
  HeroBanner,
} from '@/components/Hero';
import TotalAccumulationWidget from '@/components/TotalAccumulationWidget';
import Campaign from '@/components/Campaign';
import News from '@/components/News';
import Footer from '@/components/Footer';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_URL = 'https://bma.or.id';
const SITE_LOCATION = 'Jepara';
const SITE_REGION = 'Jawa Tengah';

// ============================================================
// MASTER SEO HOMEPAGE
// ============================================================
export const metadata: Metadata = {
  title:
    'bma.or.id | Baitul Maal Al Muttaqin - Zakat, Infak, Sedekah & Wakaf',

  description:
    'Salurkan zakat, infak, sedekah, wakaf, dan donasi program sosial melalui Baitul Maal Al Muttaqin di bma.or.id. Bersama menghadirkan manfaat untuk yatim, dhuafa, santri, dakwah, pendidikan, dan kemanusiaan.',

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
    'donasi yatim',
    'donasi dhuafa',
    'donasi santri',
    'donasi kemanusiaan',
    'program sosial jepara',
  ],

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title:
      'bma.or.id | Baitul Maal Al Muttaqin - Zakat, Infak, Sedekah & Wakaf',

    description:
      'Temukan dan dukung program zakat, infak, sedekah, wakaf, pendidikan, dakwah, sosial, dan kemanusiaan bersama Baitul Maal Al Muttaqin.',

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
      'Zakat, infak, sedekah, wakaf, dan berbagai program kebaikan bersama Baitul Maal Al Muttaqin.',

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
};

// ============================================================
// SANITY CONFIG
// ============================================================
const projectId =
  process.env
    .NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'im4qx3kd';

const dataset =
  process.env
    .NEXT_PUBLIC_SANITY_DATASET ||
  'production';

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_SANITY_PROJECT_ID belum disetel.'
  );
}

const serverClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2026-08-01',

  // Token hanya dipakai apabila memang tersedia.
  // Untuk dataset publik, fetch tetap bisa berjalan
  // tanpa token.
  token:
    process.env.SANITY_API_TOKEN ||
    undefined,

  perspective: 'published',
});

// ============================================================
// HOMEPAGE SELALU DINAMIS
// ============================================================
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================================
// TYPES
// ============================================================
interface ProgramItem {
  id: string;
  title: string;
  slug: string;
  image?: string;
  collectedAmount: number;
  collectedRaw: number;
  targetAmount: number;
  daysLeft?: number;
  donors?: any[];
  donorsCount?: number;
}

interface HomeSanityData {
  heroBanners?: Array<{
    id: string;
    title?: string;
    imageUrl?: string;
    linkUrl?: string;
  }>;

  mendesak?: ProgramItem[];
  unggulan?: ProgramItem[];
  pilihan?: ProgramItem[];
}

// ============================================================
// HOMEPAGE
// ============================================================
export default async function HomePage() {
  let heroBanners: HeroBanner[] = [];
  let mendesakPrograms: ProgramItem[] =
    [];
  let unggulanPrograms: ProgramItem[] =
    [];
  let pilihanPrograms: ProgramItem[] =
    [];

  try {
    // ========================================================
    // MASTER QUERY HOMEPAGE
    // ========================================================
    const query = `{
      "heroBanners":
        *[
          _type in ["heroBanner", "banner"] &&
          active != false
        ]
        | order(order asc, _createdAt desc)
        [0...10] {
          "id": _id,
          "title": coalesce(title, name),
          "imageUrl": coalesce(
            image.asset->url,
            banner.asset->url
          ),
          "linkUrl": link
        },

      "mendesak":
        *[
          _type == "program" &&
          sectionType == "mendesak" &&
          defined(slug.current)
        ]
        | order(_createdAt desc)
        [0...5] {
          "id": _id,
          title,
          "slug": slug.current,
          "image": image.asset->url,

          "collectedAmount":
            coalesce(
              collectedAmount,
              collectedRaw,
              0
            ),

          "collectedRaw":
            coalesce(
              collectedAmount,
              collectedRaw,
              0
            ),

          "targetAmount":
            coalesce(
              targetAmount,
              50000000
            ),

          daysLeft,
          donors,
          "donorsCount": count(donors)
        },

      "unggulan":
        *[
          _type == "program" &&
          sectionType == "unggulan" &&
          defined(slug.current)
        ]
        | order(_createdAt desc)
        [0...5] {
          "id": _id,
          title,
          "slug": slug.current,
          "image": image.asset->url,

          "collectedAmount":
            coalesce(
              collectedAmount,
              collectedRaw,
              0
            ),

          "collectedRaw":
            coalesce(
              collectedAmount,
              collectedRaw,
              0
            ),

          "targetAmount":
            coalesce(
              targetAmount,
              50000000
            ),

          daysLeft,
          donors,
          "donorsCount": count(donors)
        },

      "pilihan":
        *[
          _type == "program" &&
          (
            sectionType == "pilihan" ||
            !defined(sectionType)
          ) &&
          defined(slug.current)
        ]
        | order(_createdAt desc)
        [0...5] {
          "id": _id,
          title,
          "slug": slug.current,
          "image": image.asset->url,

          "collectedAmount":
            coalesce(
              collectedAmount,
              collectedRaw,
              0
            ),

          "collectedRaw":
            coalesce(
              collectedAmount,
              collectedRaw,
              0
            ),

          "targetAmount":
            coalesce(
              targetAmount,
              50000000
            ),

          daysLeft,
          donors,
          "donorsCount": count(donors)
        }
    }`;

    const data =
      await serverClient.fetch<HomeSanityData>(
        query
      );

    // ========================================================
    // HERO BANNERS
    // ========================================================
    if (
      Array.isArray(
        data?.heroBanners
      )
    ) {
      heroBanners =
        data.heroBanners
          .filter(
            (item) =>
              Boolean(
                item?.id &&
                  item?.imageUrl
              )
          )
          .map((item) => ({
            _id: item.id,
            title:
              item.title || '',
            imageUrl:
              item.imageUrl!,
            linkUrl:
              item.linkUrl ||
              undefined,
          }));
    }

    // ========================================================
    // PROGRAMS
    // ========================================================
    mendesakPrograms =
      Array.isArray(
        data?.mendesak
      )
        ? data.mendesak
        : [];

    unggulanPrograms =
      Array.isArray(
        data?.unggulan
      )
        ? data.unggulan
        : [];

    pilihanPrograms =
      Array.isArray(
        data?.pilihan
      )
        ? data.pilihan
        : [];
  } catch (error) {
    console.error(
      'Gagal mengambil data homepage BMA dari Sanity:',
      error
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f8f8f6] pb-24">

      <div className="w-full max-w-md mx-auto px-3.5 pt-4 space-y-4">

        {/* =====================================================
            HERO
        ====================================================== */}
        <Hero
          initialBanners={
            heroBanners
          }
        />

        {/* =====================================================
            BRAND INTRO
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[26px] bg-[#102a43] px-5 py-4 shadow-[0_12px_35px_rgba(16,42,67,0.12)]">

          <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full border border-white/8" />

          <div className="absolute -right-2 -bottom-16 h-28 w-28 rounded-full border border-[#d7b66a]/15" />

          <div className="relative z-10 flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
              <Sparkles className="h-4 w-4 text-[#d7b66a]" />
            </div>

            <div className="min-w-0">

              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#d7b66a]">
                {SITE_SHORT_NAME} • Jepara
              </p>

              <h1 className="mt-0.5 text-[13px] font-bold text-white">
                Baitul Maal Al Muttaqin
              </h1>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-300">
                Menghubungkan amanah,
                menghadirkan manfaat.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            TOTAL ACCUMULATION
        ====================================================== */}
        <TotalAccumulationWidget />

        {/* =====================================================
            TRUST STRIP
        ====================================================== */}
        <section className="rounded-[22px] border border-[#eadfca] bg-[#f7f2e7]/60 px-4 py-3.5">

          <div className="flex items-start gap-3">

            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#a37c32]" />

            <div>

              <p className="text-[9px] font-bold text-[#102a43]">
                Gerakan Kebaikan Bersama
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                Temukan program zakat,
                infak, sedekah, wakaf,
                pendidikan, dakwah, dan
                kemanusiaan melalui
                {' '}
                {SITE_DOMAIN}.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            CAMPAIGN
        ====================================================== */}
        <Campaign
          mendesak={
            mendesakPrograms
          }
          unggulan={
            unggulanPrograms
          }
          pilihan={
            pilihanPrograms
          }
        />

        {/* =====================================================
            NEWS
        ====================================================== */}
        <News />

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <Footer />

        {/* =====================================================
            MINI BRAND SIGNATURE
        ====================================================== */}
        <div className="pb-2 pt-1 text-center">

          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-300">
            {SITE_NAME}
          </p>

          <p className="mt-1 text-[7px] text-slate-300">
            {SITE_DOMAIN} •{' '}
            {SITE_LOCATION},{' '}
            {SITE_REGION}
          </p>

        </div>

      </div>

    </main>
  );
}