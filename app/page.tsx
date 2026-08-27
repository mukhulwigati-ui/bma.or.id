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

// ============================================================
// IDENTITAS WEBSITE
// ============================================================
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
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'im4qx3kd';

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
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

  // WAJIB STRING AGAR SESUAI DENGAN CampaignItem
  image: string;

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
// NORMALIZER PROGRAM
// ============================================================
function normalizePrograms(
  items: any[] | undefined
): ProgramItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (item) =>
        item &&
        item.id &&
        item.title &&
        item.slug
    )
    .map((item) => ({
      id: String(item.id),

      title: String(item.title),

      slug: String(item.slug),

      // SELALU STRING
      // Mencegah error:
      // string | undefined is not assignable to string
      image:
        typeof item.image === 'string' &&
        item.image.trim()
          ? item.image
          : '/images/banner.png',

      collectedAmount:
        Number(
          item.collectedAmount ?? 0
        ) || 0,

      collectedRaw:
        Number(
          item.collectedRaw ??
            item.collectedAmount ??
            0
        ) || 0,

      targetAmount:
        Number(
          item.targetAmount ??
            50000000
        ) || 50000000,

      daysLeft:
        item.daysLeft !== undefined &&
        item.daysLeft !== null
          ? Number(item.daysLeft)
          : undefined,

      donors:
        Array.isArray(item.donors)
          ? item.donors
          : [],

      donorsCount:
        item.donorsCount !== undefined &&
        item.donorsCount !== null
          ? Number(item.donorsCount)
          : Array.isArray(item.donors)
          ? item.donors.length
          : 0,
    }));
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
    // ==========================================================
    // QUERY SANITY
    // ==========================================================
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

          "image": coalesce(
            image.asset->url,
            "/images/banner.png"
          ),

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

          "donorsCount":
            count(donors)
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

          "image": coalesce(
            image.asset->url,
            "/images/banner.png"
          ),

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

          "donorsCount":
            count(donors)
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

          "image": coalesce(
            image.asset->url,
            "/images/banner.png"
          ),

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

          "donorsCount":
            count(donors)
        }
    }`;

    // ==========================================================
    // FETCH DATA
    // ==========================================================
    const data =
      await serverClient.fetch<HomeSanityData>(
        query
      );

    // ==========================================================
    // HERO BANNERS
    // ==========================================================
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
            _id:
              String(item.id),

            title:
              item.title || '',

            imageUrl:
              String(
                item.imageUrl
              ),

            linkUrl:
              item.linkUrl ||
              undefined,
          }));
    }

    // ==========================================================
    // PROGRAMS
    // ==========================================================
    mendesakPrograms =
      normalizePrograms(
        data?.mendesak
      );

    unggulanPrograms =
      normalizePrograms(
        data?.unggulan
      );

    pilihanPrograms =
      normalizePrograms(
        data?.pilihan
      );

  } catch (error) {
    console.error(
      'Gagal mengambil data homepage BMA dari Sanity:',
      error
    );
  }

  // ============================================================
  // RENDER HOMEPAGE
  // ============================================================
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#fffdf5] pb-24">

      <div className="w-full max-w-md mx-auto px-3.5 pt-4 space-y-4">

        {/* =====================================================
            HERO BANNER
        ====================================================== */}
        <Hero
          initialBanners={
            heroBanners
          }
        />

        {/* =====================================================
            BRAND INTRO
            IDENTITAS BMA:
            KUNING + PUTIH + HITAM
            TANPA ROUNDED CORNER
        ====================================================== */}
        <section className="relative overflow-hidden border border-[#e3c200] bg-[#FFD900] px-5 py-4 shadow-[0_8px_24px_rgba(180,145,0,0.12)]">

          {/* Dekorasi lingkaran sangat halus */}
          <div className="pointer-events-none absolute -right-10 -top-14 h-28 w-28 rounded-full border border-black/[0.06]" />

          <div className="pointer-events-none absolute right-2 -bottom-16 h-28 w-28 rounded-full border border-black/[0.05]" />

          {/* Highlight transparan */}
          <div className="pointer-events-none absolute -left-8 -bottom-12 h-24 w-24 rounded-full bg-white/20 blur-xl" />

          <div className="relative z-10 flex items-center gap-3">

            {/* ICON BOX */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 bg-white/50">

              <Sparkles className="h-4 w-4 text-black" />

            </div>

            {/* BRAND INFORMATION */}
            <div className="min-w-0">

              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-black/55">
                {SITE_SHORT_NAME} • {SITE_LOCATION}
              </p>

              <h1 className="mt-0.5 text-[14px] font-black tracking-tight text-black">
                {SITE_NAME}
              </h1>

              <p className="mt-1 text-[8px] font-medium leading-relaxed text-black/60">
                Menghubungkan amanah, menghadirkan manfaat.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            TOTAL AKUMULASI DONASI
        ====================================================== */}
        <TotalAccumulationWidget />

        {/* =====================================================
            TRUST STRIP
            TANPA ROUNDED CORNER
        ====================================================== */}
        <section className="border border-[#eadb8b] bg-[#fff8cf] px-4 py-3.5">

          <div className="flex items-start gap-3">

            {/* ICON */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#FFD900]">

              <ShieldCheck className="h-4 w-4 text-black" />

            </div>

            {/* CONTENT */}
            <div className="min-w-0">

              <p className="text-[9px] font-black text-stone-900">
                Gerakan Kebaikan Bersama
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-stone-600">
                Temukan program zakat,
                infak, sedekah, wakaf,
                pendidikan, dakwah, dan
                kemanusiaan melalui{' '}

                <span className="font-bold text-stone-800">
                  {SITE_DOMAIN}
                </span>
                .
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
        <div className="border-t border-[#eee5bd] pb-2 pt-4 text-center">

          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#9a7b00]">
            {SITE_NAME}
          </p>

          <p className="mt-1 text-[7px] font-medium text-stone-400">
            {SITE_DOMAIN} •{' '}
            {SITE_LOCATION},{' '}
            {SITE_REGION}
          </p>

        </div>

      </div>

    </main>
  );
}