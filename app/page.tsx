// app/page.tsx

import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@sanity/client';
import {
  ShieldCheck,
  Landmark,
  MapPin,
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
// HOMEPAGE DINAMIS
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

  let mendesakPrograms: ProgramItem[] = [];
  let unggulanPrograms: ProgramItem[] = [];
  let pilihanPrograms: ProgramItem[] = [];

  try {
    const query = `{
      "heroBanners":
        *[
          _type in ["heroBanner", "banner"] &&
          active != false
        ]
        | order(order asc, _createdAt desc)
        [0...10] {

          "id": _id,

          "title":
            coalesce(
              title,
              name
            ),

          "imageUrl":
            coalesce(
              image.asset->url,
              banner.asset->url
            ),

          "linkUrl":
            link
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

          "slug":
            slug.current,

          "image":
            coalesce(
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

          "slug":
            slug.current,

          "image":
            coalesce(
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

          "slug":
            slug.current,

          "image":
            coalesce(
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

    const data =
      await serverClient.fetch<HomeSanityData>(
        query
      );

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

  return (
    <main
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#f3f3f3]
        pb-24
      "
    >

      <div
        className="
          w-full
          max-w-md
          mx-auto
          px-3.5
          pt-4
          space-y-4
        "
      >

        {/* ====================================================
            HERO
        ===================================================== */}

        <Hero
          initialBanners={
            heroBanners
          }
        />


        {/* ====================================================
            IDENTITAS BMA
            ABU-ABU LEBIH TEGAS
            TANPA GARIS HIJAU
            TANPA ROUNDED CORNER
        ===================================================== */}

        <section
          className="
            relative
            overflow-hidden
            border
            border-[#cfcfcf]
            bg-[#dedede]
            px-5
            py-4
            shadow-[0_5px_18px_rgba(0,0,0,0.06)]
          "
        >

          {/* Ornamen lingkaran */}
          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-14
              h-32
              w-32
              rounded-full
              border
              border-black/[0.05]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-2
              -bottom-20
              h-32
              w-32
              rounded-full
              border
              border-black/[0.045]
            "
          />

          {/* CONTENT */}
          <div
            className="
              relative
              z-10
              flex
              items-center
              gap-3.5
            "
          >

            {/* ICON */}
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                border
                border-[#c3c3c3]
                bg-[#f7f7f7]
                shadow-sm
              "
            >

              <Landmark
                className="
                  h-[18px]
                  w-[18px]
                  text-[#4b4b4b]
                "
                strokeWidth={1.8}
              />

            </div>

            {/* TEXT */}
            <div className="min-w-0 flex-1">

              <div
                className="
                  mb-1
                  flex
                  items-center
                  gap-1.5
                "
              >

                <MapPin
                  className="
                    h-2.5
                    w-2.5
                    text-[#6b6b6b]
                  "
                  strokeWidth={2.4}
                />

                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-[#666666]
                  "
                >
                  {SITE_SHORT_NAME} • {SITE_LOCATION}
                </p>

              </div>

              <h1
                className="
                  text-[14px]
                  font-extrabold
                  leading-tight
                  tracking-tight
                  text-[#2f2f2f]
                "
              >
                {SITE_NAME}
              </h1>

              <p
                className="
                  mt-1
                  text-[8px]
                  font-medium
                  leading-relaxed
                  text-[#666666]
                "
              >
                Menghubungkan amanah,
                menghadirkan manfaat.
              </p>

            </div>

          </div>

        </section>


        {/* ====================================================
            TOTAL AKUMULASI
        ===================================================== */}

        <TotalAccumulationWidget />


        {/* ====================================================
            TRUST / INFORMATION STRIP
        ===================================================== */}

        <section
          className="
            border
            border-[#d4d4d4]
            bg-[#eeeeee]
            px-4
            py-3.5
            shadow-[0_4px_14px_rgba(0,0,0,0.035)]
          "
        >

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            {/* ICON */}
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                border
                border-[#d0d0d0]
                bg-[#f7f7f7]
              "
            >

              <ShieldCheck
                className="
                  h-4
                  w-4
                  text-[#555555]
                "
                strokeWidth={2}
              />

            </div>

            {/* CONTENT */}
            <div
              className="
                min-w-0
                flex-1
              "
            >

              <p
                className="
                  text-[9px]
                  font-extrabold
                  text-[#333333]
                "
              >
                Gerakan Kebaikan Bersama
              </p>

              <p
                className="
                  mt-1
                  text-[8px]
                  leading-relaxed
                  text-[#666666]
                "
              >
                Temukan program zakat,
                infak, sedekah, wakaf,
                pendidikan, dakwah, dan
                kemanusiaan melalui{' '}

                <span
                  className="
                    font-bold
                    text-[#444444]
                  "
                >
                  {SITE_DOMAIN}
                </span>
                .
              </p>

            </div>

          </div>

        </section>


        {/* ====================================================
            CAMPAIGN
        ===================================================== */}

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


        {/* ====================================================
            NEWS
        ===================================================== */}

        <News />


        {/* ====================================================
            FOOTER
        ===================================================== */}

        <Footer />


        {/* ====================================================
            BRAND SIGNATURE
        ===================================================== */}

        <div
          className="
            border-t
            border-[#d8d8d8]
            pb-2
            pt-4
            text-center
          "
        >

          <p
            className="
              text-[8px]
              font-extrabold
              uppercase
              tracking-[0.16em]
              text-[#555555]
            "
          >
            {SITE_NAME}
          </p>

          <p
            className="
              mt-1
              text-[7px]
              font-medium
              text-[#888888]
            "
          >
            {SITE_DOMAIN}
            {' • '}
            {SITE_LOCATION}
            {', '}
            {SITE_REGION}
          </p>

        </div>

      </div>

    </main>
  );
}