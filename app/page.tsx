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
  'https://www.bma.or.id';

const SITE_LOCATION =
  'Jepara';

const SITE_REGION =
  'Jawa Tengah';


const HOME_IMAGE =
  `${SITE_URL}/images/banner.png`;

const HOME_TITLE =
  'Baitul Maal Al Muttaqin | Zakat, Infak, Sedekah, Wakaf & Donasi';

const HOME_DESCRIPTION =
  'Salurkan zakat, infak, sedekah, wakaf, dan donasi terbaik Anda melalui Baitul Maal Al Muttaqin. Dukung program yatim, dhuafa, santri, dakwah, pendidikan, sosial, dan kemanusiaan dari Jepara, Jawa Tengah.';

const HOME_KEYWORDS = [
  'Baitul Maal Al Muttaqin',
  'BMA Jepara',
  'bma.or.id',
  'www.bma.or.id',
  'baitul maal jepara',
  'lembaga zakat jepara',
  'zakat jepara',
  'zakat online',
  'bayar zakat online',
  'infak online',
  'infaq online',
  'sedekah online',
  'sedekah subuh',
  'wakaf online',
  'donasi online',
  'donasi yatim',
  'donasi dhuafa',
  'donasi santri',
  'donasi masjid',
  'donasi dakwah',
  'donasi pendidikan',
  'donasi kemanusiaan',
  'program sosial jepara',
  'amal jariyah',
];

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
  metadataBase:
    new URL(SITE_URL),

  title: {
    default:
      HOME_TITLE,

    template:
      `%s | ${SITE_NAME}`,
  },

  description:
    HOME_DESCRIPTION,

  applicationName:
    SITE_NAME,

  authors: [
    {
      name:
        SITE_NAME,

      url:
        SITE_URL,
    },
  ],

  creator:
    SITE_NAME,

  publisher:
    SITE_NAME,

  category:
    'Charity',

  keywords:
    HOME_KEYWORDS,

  alternates: {
    canonical:
      SITE_URL,

    languages: {
      'id-ID':
        SITE_URL,
    },
  },

  openGraph: {
    type:
      'website',

    locale:
      'id_ID',

    url:
      SITE_URL,

    siteName:
      SITE_NAME,

    title:
      HOME_TITLE,

    description:
      HOME_DESCRIPTION,

    images: [
      {
        url:
          HOME_IMAGE,

        secureUrl:
          HOME_IMAGE,

        alt:
          `${SITE_NAME} - Menghubungkan Amanah, Menghadirkan Manfaat`,
      },
    ],
  },

  twitter: {
    card:
      'summary_large_image',

    title:
      HOME_TITLE,

    description:
      HOME_DESCRIPTION,

    images: [
      HOME_IMAGE,
    ],
  },

  robots: {
    index:
      true,

    follow:
      true,

    nocache:
      false,

    googleBot: {
      index:
        true,

      follow:
        true,

      noimageindex:
        false,

      'max-video-preview':
        -1,

      'max-image-preview':
        'large',

      'max-snippet':
        -1,
    },
  },

  referrer:
    'origin-when-cross-origin',

  formatDetection: {
    email:
      false,

    address:
      false,

    telephone:
      false,
  },

  other: {
    'geo.region':
      'ID-JT',

    'geo.placename':
      `${SITE_LOCATION}, ${SITE_REGION}, Indonesia`,

    'content-language':
      'id-ID',
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

  const organizationJsonLd = {
    '@context':
      'https://schema.org',

    '@type':
      'Organization',

    '@id':
      `${SITE_URL}/#organization`,

    name:
      SITE_NAME,

    alternateName:
      SITE_SHORT_NAME,

    url:
      SITE_URL,

    logo:
      `${SITE_URL}/favicon.ico`,

    image:
      HOME_IMAGE,

    description:
      HOME_DESCRIPTION,

    address: {
      '@type':
        'PostalAddress',

      addressLocality:
        SITE_LOCATION,

      addressRegion:
        SITE_REGION,

      addressCountry:
        'ID',
    },
  };

  const websiteJsonLd = {
    '@context':
      'https://schema.org',

    '@type':
      'WebSite',

    '@id':
      `${SITE_URL}/#website`,

    url:
      SITE_URL,

    name:
      SITE_NAME,

    alternateName:
      SITE_SHORT_NAME,

    inLanguage:
      'id-ID',

    publisher: {
      '@id':
        `${SITE_URL}/#organization`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              organizationJsonLd
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              websiteJsonLd
            ),
        }}
      />

      <main
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#f3f3f3]
        pb-24
        flex
        justify-center
      "
    >

      <div
        className="
          w-full
          max-w-[420px]
          space-y-4
          px-0
          pt-2
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
            border-y
            border-[#073f2e]/20
            bg-[#073f2e]
            px-4
            py-4
            shadow-[0_2px_10px_rgba(7,63,46,0.1)]
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
              border-white/10
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
              border-white/10
            "
          />

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
                border-white/20
                bg-white/10
                shadow-sm
              "
            >

              <Landmark
                className="
                  h-4.5
                  w-4.5
                  text-white
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
                  mb-1
                  flex
                  items-center
                  gap-1.5
                "
              >

                <MapPin
                  className="
                    h-3
                    w-3
                    text-[#d7b66a]
                  "
                  strokeWidth={
                    2.2
                  }
                />

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-[#d7b66a]
                  "
                >
                  {SITE_SHORT_NAME}
                  {' • '}
                  {SITE_LOCATION}
                </p>

              </div>

              <h1
                className="
                  text-[16px]
                  font-bold
                  leading-tight
                  tracking-tight
                  text-white
                "
              >
                {SITE_NAME}
              </h1>

              <p
                className="
                  mt-1
                  text-[11px]
                  font-medium
                  leading-relaxed
                  text-slate-200
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
            border-y
            border-[#d4d4d4]
            bg-[#eeeeee]
            px-4
            py-3.5
            shadow-[0_2px_10px_rgba(0,0,0,0.03)]
          "
        >

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

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
                  h-4.5
                  w-4.5
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
                  text-[13px]
                  font-bold
                  text-[#414141]
                "
              >
                Gerakan Kebaikan Bersama
              </p>

              <p
                className="
                  mt-1
                  text-[11px]
                  leading-[1.6]
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

      </div>

      </main>
    </>
  );
}