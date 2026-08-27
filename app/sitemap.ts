// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { createClient } from '@sanity/client';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_DOMAIN = 'bma.or.id';
const BASE_URL = 'https://bma.or.id';

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
    'NEXT_PUBLIC_SANITY_PROJECT_ID belum disetel di environment variables.'
  );
}

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-08-01',
  useCdn: true,
  perspective: 'published',
});

// ============================================================
// TYPES
// ============================================================
interface ProgramSitemapItem {
  slug: string;
  _updatedAt?: string;
}

interface NewsSitemapItem {
  slug: string;
  publishedAt?: string;
  _updatedAt?: string;
}

interface SitemapSanityData {
  programs?: ProgramSitemapItem[];
  news?: NewsSitemapItem[];
}

// ============================================================
// HELPER
// ============================================================
function safeDate(
  value?: string
): Date {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);

  return Number.isNaN(
    parsed.getTime()
  )
    ? new Date()
    : parsed;
}

// ============================================================
// SITEMAP
// ============================================================
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ==========================================================
  // STATIC ROUTES
  // ==========================================================
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },

    {
      url: `${BASE_URL}/zakat`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/tentang-kami`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/kontak`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${BASE_URL}/bantuan`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${BASE_URL}/peta-situs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },

    {
      url: `${BASE_URL}/kebijakan-privasi`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    {
      url: `${BASE_URL}/syarat-ketentuan`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  let campaignRoutes: MetadataRoute.Sitemap =
    [];

  let newsRoutes: MetadataRoute.Sitemap =
    [];

  try {
    // ========================================================
    // SANITY QUERY
    // ========================================================
    const query = `{
      "programs":
        *[
          _type == "program" &&
          defined(slug.current)
        ]
        | order(_updatedAt desc) {
          "slug": slug.current,
          _updatedAt
        },

      "news":
        *[
          _type == "news" &&
          defined(slug.current)
        ]
        | order(
          coalesce(
            publishedAt,
            _updatedAt
          ) desc
        ) {
          "slug": slug.current,
          publishedAt,
          _updatedAt
        }
    }`;

    const data =
      await sanityClient.fetch<SitemapSanityData>(
        query
      );

    // ========================================================
    // CAMPAIGN ROUTES
    // ========================================================
    if (
      Array.isArray(
        data?.programs
      )
    ) {
      campaignRoutes =
        data.programs
          .filter(
            (program) =>
              Boolean(
                program?.slug
              )
          )
          .map(
            (
              program
            ): MetadataRoute.Sitemap[number] => ({
              url:
                `${BASE_URL}/campaign/${program.slug}`,

              lastModified:
                safeDate(
                  program._updatedAt
                ),

              changeFrequency:
                'daily',

              priority: 0.9,
            })
          );
    }

    // ========================================================
    // NEWS ROUTES
    // ========================================================
    if (
      Array.isArray(
        data?.news
      )
    ) {
      newsRoutes =
        data.news
          .filter(
            (article) =>
              Boolean(
                article?.slug
              )
          )
          .map(
            (
              article
            ): MetadataRoute.Sitemap[number] => ({
              url:
                `${BASE_URL}/news/${article.slug}`,

              lastModified:
                safeDate(
                  article._updatedAt ||
                    article.publishedAt
                ),

              changeFrequency:
                'weekly',

              priority: 0.7,
            })
          );
    }
  } catch (error) {
    console.error(
      `Gagal mengambil data sitemap ${SITE_NAME} (${SITE_DOMAIN}) dari Sanity:`,
      error
    );
  }

  // ==========================================================
  // FINAL SITEMAP
  // ==========================================================
  return [
    ...staticRoutes,
    ...campaignRoutes,
    ...newsRoutes,
  ];
}