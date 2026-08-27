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
// IDENTITAS WEBSITE BMA
// ============================================================

const SITE_NAME =
  'Baitul Maal Al Muttaqin';

const SITE_SHORT_NAME =
  'BMA';

const SITE_DOMAIN =
  'bma.or.id';

const SITE_URL =
  'https://bma.or.id';

const SITE_LOCATION =
  'Jepara';

const SITE_REGION =
  'Jawa Tengah';

// ============================================================
// SANITY BMA
//
// DIKUNCI LANGSUNG.
// TIDAK membaca project dari env agar tidak tertukar BDB.
// ============================================================

const SANITY_PROJECT_ID =
  'im4qx3kd';

const SANITY_DATASET =
  'production';

// ============================================================
// SEO HOMEPAGE
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
    canonical:
      SITE_URL,
  },

  openGraph: {
    title:
      'bma.or.id | Baitul Maal Al Muttaqin - Zakat, Infak, Sedekah & Wakaf',

    description:
      'Temukan dan dukung program zakat, infak, sedekah, wakaf, pendidikan, dakwah, sosial, dan kemanusiaan bersama Baitul Maal Al Muttaqin.',

    url:
      SITE_URL,

    siteName:
      SITE_NAME,

    locale:
      'id_ID',

    type:
      'website',

    images: [
      {
        url:
          `${SITE_URL}/images/banner.png`,

        width:
          1200,

        height:
          630,

        type:
          'image/png',

        alt:
          `${SITE_NAME} - Menghubungkan Amanah, Menghadirkan Manfaat`,
      },
    ],
  },

  twitter: {
    card:
      'summary_large_image',

    title:
      'bma.or.id | Baitul Maal Al Muttaqin',

    description:
      'Zakat, infak, sedekah, wakaf, dan berbagai program kebaikan bersama Baitul Maal Al Muttaqin.',

    images: [
      `${SITE_URL}/images/banner.png`,
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

// ============================================================
// SANITY CLIENT BMA
//
// Tidak pakai SANITY_API_TOKEN.
// Data published cukup dibaca secara public.
// ============================================================

const serverClient =
  createClient({
    projectId:
      SANITY_PROJECT_ID,

    dataset:
      SANITY_DATASET,

    apiVersion:
      '2026-08-01',

    useCdn:
      false,

    perspective:
      'published',
  });

// ============================================================
// HOMEPAGE DINAMIS
// ============================================================

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

// ============================================================
// TYPES
// ============================================================

interface ProgramItem {
  id: string;

  title: string;

  slug: string;

  image: string;

  category?: string;

  sectionType:
    | 'mendesak'
    | 'unggulan'
    | 'pilihan';

  collectedAmount: number;

  collectedRaw: number;

  targetAmount: number;

  daysLeft?: number;

  donors?: unknown[];

  donorsCount?: number;
}

interface SanityHeroItem {
  id: string;

  title?: string;

  imageUrl?: string;

  linkUrl?: string;
}

interface HomeSanityData {
  heroBanners?:
    SanityHeroItem[];

  mendesak?:
    ProgramItem[];

  unggulan?:
    ProgramItem[];

  pilihan?:
    ProgramItem[];
}

// ============================================================
// NORMALIZER PROGRAM
// ============================================================

function normalizePrograms(
  items:
    | ProgramItem[]
    | undefined
): ProgramItem[] {
  if (
    !Array.isArray(
      items
    )
  ) {
    return [];
  }

  const result:
    ProgramItem[] = [];

  for (
    const item of items
  ) {
    if (
      !item ||
      !item.id ||
      !item.title ||
      !item.slug
    ) {
      continue;
    }

    const sectionType =
      item.sectionType;

    // ========================================================
    // STRICT:
    // hanya 3 section ini yang diterima.
    // ========================================================

    if (
      sectionType !==
        'mendesak' &&
      sectionType !==
        'unggulan' &&
      sectionType !==
        'pilihan'
    ) {
      continue;
    }

    result.push({
      id:
        String(
          item.id
        ),

      title:
        String(
          item.title
        ),

      slug:
        String(
          item.slug
        ),

      image:
        typeof item.image ===
          'string' &&
        item.image.trim()
          ? item.image
          : '/images/banner.png',

      category:
        typeof item.category ===
          'string'
          ? item.category
          : undefined,

      sectionType,

      collectedAmount:
        Number(
          item.collectedAmount ??
            0
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
        ) ||
        50000000,

      daysLeft:
        item.daysLeft !==
          undefined &&
        item.daysLeft !==
          null
          ? Number(
              item.daysLeft
            )
          : undefined,

      donors:
        Array.isArray(
          item.donors
        )
          ? item.donors
          : [],

      donorsCount:
        item.donorsCount !==
          undefined &&
        item.donorsCount !==
          null
          ? Number(
              item.donorsCount
            ) || 0
          : Array.isArray(
              item.donors
            )
          ? item.donors.length
          : 0,
    });
  }

  return result;
}

// ============================================================
// HOMEPAGE
// ============================================================

export default async function HomePage() {
  let heroBanners:
    HeroBanner[] = [];

  let mendesakPrograms:
    ProgramItem[] = [];

  let unggulanPrograms:
    ProgramItem[] = [];

  let pilihanPrograms:
    ProgramItem[] = [];

  try {
    // ========================================================
    // QUERY SANITY BMA
    //
    // STRICT:
    // mendesak = hanya mendesak
    // unggulan = hanya unggulan
    // pilihan  = hanya pilihan
    //
    // Tidak ada !defined(sectionType)
    // ========================================================

    const query = `
      {
        "heroBanners":
          *[
            _type in [
              "heroBanner",
              "banner"
            ] &&
            active != false
          ]
          | order(
              order asc,
              _createdAt desc
            )
          [0...10]
          {
            "id":
              _id,

            "title":
              coalesce(
                title,
                name,
                "Banner BMA"
              ),

            "imageUrl":
              coalesce(
                image.asset->url,
                banner.asset->url
              ),

            "linkUrl":
              coalesce(
                link,
                linkUrl,
                url
              )
          },


        "mendesak":
          *[
            _type == "program" &&
            sectionType == "mendesak" &&
            defined(slug.current)
          ]
          | order(
              _createdAt desc
            )
          [0...6]
          {
            "id":
              _id,

            title,

            "slug":
              slug.current,

            "image":
              coalesce(
                image.asset->url,
                mainImage.asset->url,
                thumbnail.asset->url
              ),

            "category":
              coalesce(
                category->title,
                category,
                "Program"
              ),

            sectionType,

            "collectedAmount":
              coalesce(
                collectedAmount,
                collectedRaw,
                0
              ),

            "collectedRaw":
              coalesce(
                collectedRaw,
                collectedAmount,
                0
              ),

            "targetAmount":
              coalesce(
                targetAmount,
                targetRaw,
                50000000
              ),

            daysLeft,

            donors,

            "donorsCount":
              coalesce(
                donorsCount,
                count(donors),
                0
              )
          },


        "unggulan":
          *[
            _type == "program" &&
            sectionType == "unggulan" &&
            defined(slug.current)
          ]
          | order(
              _createdAt desc
            )
          [0...6]
          {
            "id":
              _id,

            title,

            "slug":
              slug.current,

            "image":
              coalesce(
                image.asset->url,
                mainImage.asset->url,
                thumbnail.asset->url
              ),

            "category":
              coalesce(
                category->title,
                category,
                "Program"
              ),

            sectionType,

            "collectedAmount":
              coalesce(
                collectedAmount,
                collectedRaw,
                0
              ),

            "collectedRaw":
              coalesce(
                collectedRaw,
                collectedAmount,
                0
              ),

            "targetAmount":
              coalesce(
                targetAmount,
                targetRaw,
                50000000
              ),

            daysLeft,

            donors,

            "donorsCount":
              coalesce(
                donorsCount,
                count(donors),
                0
              )
          },


        "pilihan":
          *[
            _type == "program" &&
            sectionType == "pilihan" &&
            defined(slug.current)
          ]
          | order(
              _createdAt desc
            )
          [0...8]
          {
            "id":
              _id,

            title,

            "slug":
              slug.current,

            "image":
              coalesce(
                image.asset->url,
                mainImage.asset->url,
                thumbnail.asset->url
              ),

            "category":
              coalesce(
                category->title,
                category,
                "Program"
              ),

            sectionType,

            "collectedAmount":
              coalesce(
                collectedAmount,
                collectedRaw,
                0
              ),

            "collectedRaw":
              coalesce(
                collectedRaw,
                collectedAmount,
                0
              ),

            "targetAmount":
              coalesce(
                targetAmount,
                targetRaw,
                50000000
              ),

            daysLeft,

            donors,

            "donorsCount":
              coalesce(
                donorsCount,
                count(donors),
                0
              )
          }
      }
    `;

    // ========================================================
    // FETCH LANGSUNG KE SANITY BMA
    // ========================================================

    const data =
      await serverClient.fetch<HomeSanityData>(
        query,
        {},
        {
          cache:
            'no-store',
        }
      );

    // ========================================================
    // DEBUG
    //
    // Saat deploy, log ini akan memastikan sumbernya BMA.
    // ========================================================

    console.log(
      '=============================================='
    );

    console.log(
      '✅ HOMEPAGE BMA SANITY'
    );

    console.log(
      'PROJECT ID:',
      SANITY_PROJECT_ID
    );

    console.log(
      'DATASET:',
      SANITY_DATASET
    );

    console.log(
      'MENDESAK:',
      Array.isArray(
        data?.mendesak
      )
        ? data.mendesak
            .length
        : 0
    );

    console.log(
      'UNGGULAN:',
      Array.isArray(
        data?.unggulan
      )
        ? data.unggulan
            .length
        : 0
    );

    console.log(
      'PILIHAN:',
      Array.isArray(
        data?.pilihan
      )
        ? data.pilihan
            .length
        : 0
    );

    console.log(
      '=============================================='
    );

    // ========================================================
    // HERO
    // ========================================================

    if (
      Array.isArray(
        data?.heroBanners
      )
    ) {
      const result:
        HeroBanner[] = [];

      for (
        const item of
          data.heroBanners
      ) {
        if (
          !item?.id ||
          !item?.imageUrl
        ) {
          continue;
        }

        result.push({
          _id:
            String(
              item.id
            ),

          title:
            item.title ||
            'Banner BMA',

          imageUrl:
            String(
              item.imageUrl
            ),

          linkUrl:
            item.linkUrl ||
            undefined,
        });
      }

      heroBanners =
        result;
    }

    // ========================================================
    // CAMPAIGN
    // ========================================================

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
      '=============================================='
    );

    console.error(
      '🔥 GAGAL MENGAMBIL HOMEPAGE SANITY BMA'
    );

    console.error(
      'PROJECT:',
      SANITY_PROJECT_ID
    );

    console.error(
      'DATASET:',
      SANITY_DATASET
    );

    console.error(
      error
    );

    console.error(
      '=============================================='
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

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
          mx-auto
          w-full
          max-w-md
          space-y-5
          px-3.5
          pt-4
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
        ===================================================== */}

        <section
          className="
            relative
            overflow-hidden
            border
            border-[#cfcfcf]
            bg-[#dedede]
            px-5
            py-5
            shadow-[0_5px_18px_rgba(0,0,0,0.06)]
          "
        >

          {/* ORNAMEN */}
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
              -bottom-20
              right-2
              h-32
              w-32
              rounded-full
              border
              border-black/[0.045]
            "
          />

          <div
            className="
              relative
              z-10
              flex
              items-center
              gap-4
            "
          >

            {/* ICON */}
            <div
              className="
                flex
                h-12
                w-12
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
                  h-5
                  w-5
                  text-[#4b4b4b]
                "
                strokeWidth={
                  1.8
                }
              />

            </div>

            {/* TEXT */}
            <div
              className="
                min-w-0
                flex-1
              "
            >

              <div
                className="
                  mb-1.5
                  flex
                  items-center
                  gap-1.5
                "
              >

                <MapPin
                  className="
                    h-3.5
                    w-3.5
                    text-[#666666]
                  "
                  strokeWidth={
                    2.2
                  }
                />

                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-[#666666]
                  "
                >
                  {SITE_SHORT_NAME}
                  {' • '}
                  {SITE_LOCATION}
                </p>

              </div>

              <h1
                className="
                  text-[18px]
                  font-bold
                  leading-tight
                  tracking-tight
                  text-[#383838]
                "
              >
                {SITE_NAME}
              </h1>

              <p
                className="
                  mt-1.5
                  text-[12px]
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
            TRUST STRIP
        ===================================================== */}

        <section
          className="
            border
            border-[#d4d4d4]
            bg-[#eeeeee]
            px-4
            py-4
            shadow-[0_4px_14px_rgba(0,0,0,0.035)]
          "
        >

          <div
            className="
              flex
              items-start
              gap-3.5
            "
          >

            <div
              className="
                flex
                h-10
                w-10
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
                  h-5
                  w-5
                  text-[#555555]
                "
                strokeWidth={
                  2
                }
              />

            </div>

            <div
              className="
                min-w-0
                flex-1
              "
            >

              <p
                className="
                  text-[14px]
                  font-bold
                  text-[#414141]
                "
              >
                Gerakan Kebaikan Bersama
              </p>

              <p
                className="
                  mt-1.5
                  text-[12px]
                  leading-[1.65]
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
            CAMPAIGN BMA
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
            pb-3
            pt-5
            text-center
          "
        >

          <p
            className="
              text-[12px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#555555]
            "
          >
            {SITE_NAME}
          </p>

          <p
            className="
              mt-1.5
              text-[11px]
              font-medium
              text-[#777777]
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