// app/api/news/[slug]/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// ============================================================
// SANITY BMA
// Dikunci langsung ke project BMA agar tidak tertukar
// dengan project Sanity website lama.
// ============================================================

const PROJECT_ID = 'im4qx3kd';
const DATASET = 'production';

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-08-01',
  useCdn: true,
  perspective: 'published',

  // ==========================================================
  // PENTING
  // Tidak perlu SANITY_API_TOKEN untuk membaca data Published.
  // Token lama justru bisa menyebabkan:
  // Unauthorized - Session does not match project host
  // ==========================================================
});

// ============================================================
// CACHE CONFIG
// ============================================================

export const dynamic = 'force-dynamic';
export const revalidate = 60;

// ============================================================
// TYPES
// ============================================================

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  caption?: string;
  alt?: string;
  publishedAt?: string;
  category?: string;
  content?: any[];
}

interface RelatedNews {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  publishedAt?: string;
  category?: string;
}

interface SidebarCampaign {
  id: string;
  slug: string;
  title: string;
  image?: string;
  collectedRaw?: number;
  collectedAmount?: number;
  targetAmount?: number;
}

interface NewsDetailResponse {
  article?: NewsArticle;
  allNews?: RelatedNews[];
  sidebarCampaigns?: SidebarCampaign[];
}

// ============================================================
// GET NEWS DETAIL
// ============================================================

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    // ========================================================
    // NEXT.JS 15+
    // ========================================================

    const { slug } =
      await context.params;

    // ========================================================
    // VALIDASI SLUG
    // ========================================================

    if (
      !slug ||
      typeof slug !== 'string' ||
      !slug.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          source: 'Sanity BMA',
          projectId: PROJECT_ID,
          dataset: DATASET,
          error:
            'Slug artikel tidak valid.',
        },
        {
          status: 400,
          headers: {
            'Content-Type':
              'application/json',
            'Cache-Control':
              'no-store',
          },
        }
      );
    }

    const cleanSlug =
      slug.trim();

    console.log(
      '======================================'
    );

    console.log(
      '📰 BMA NEWS DETAIL'
    );

    console.log(
      'Project ID:',
      PROJECT_ID
    );

    console.log(
      'Dataset:',
      DATASET
    );

    console.log(
      'Slug:',
      cleanSlug
    );

    console.log(
      '======================================'
    );

    // ========================================================
    // GROQ QUERY
    // ========================================================

    const query = `{
      "article":
        *[
          _type == "news" &&
          defined(slug.current) &&
          lower(slug.current) == lower($slug)
        ][0] {

          "id": _id,

          title,

          "slug":
            slug.current,

          "imageUrl":
            coalesce(
              image.asset->url,
              mainImage.asset->url,
              thumbnail.asset->url,
              coverImage.asset->url
            ),

          "caption":
            coalesce(
              image.caption,
              mainImage.caption,
              thumbnail.caption,
              coverImage.caption
            ),

          "alt":
            coalesce(
              image.alt,
              mainImage.alt,
              thumbnail.alt,
              coverImage.alt,
              title
            ),

          publishedAt,

          "category":
            coalesce(
              category->title,
              category,
              "Kabar Terbaru"
            ),

          content[] {
            ...,

            asset-> {
              ...,
              url
            },

            markDefs[] {
              ...,

              _type == "reference" => {
                "slug":
                  @->slug.current
              }
            }
          }
        },


      "allNews":
        *[
          _type == "news" &&
          defined(slug.current) &&
          lower(slug.current) != lower($slug)
        ]
        | order(
            coalesce(
              publishedAt,
              _createdAt
            ) desc
          )
        [0...6] {

          "id": _id,

          title,

          "slug":
            slug.current,

          "imageUrl":
            coalesce(
              image.asset->url,
              mainImage.asset->url,
              thumbnail.asset->url,
              coverImage.asset->url
            ),

          publishedAt,

          "category":
            coalesce(
              category->title,
              category,
              "Kabar Terbaru"
            )
        },


      "sidebarCampaigns":
        *[
          _type == "program" &&
          defined(slug.current)
        ]
        | order(_createdAt desc)
        [0...3] {

          "id": _id,

          "slug":
            slug.current,

          title,

          "image":
            coalesce(
              image.asset->url,
              mainImage.asset->url,
              thumbnail.asset->url
            ),

          "collectedRaw":
            coalesce(
              collectedAmount,
              collectedRaw,
              0
            ),

          "collectedAmount":
            coalesce(
              collectedAmount,
              collectedRaw,
              0
            ),

          "targetAmount":
            coalesce(
              targetAmount,
              50000000
            )
        }
    }`;

    // ========================================================
    // FETCH SANITY
    // ========================================================

    const data =
      await client.fetch<NewsDetailResponse>(
        query,
        {
          slug:
            cleanSlug,
        },
        {
          next: {
            revalidate: 60,
          },
        }
      );

    // ========================================================
    // ARTICLE NOT FOUND
    // ========================================================

    if (!data?.article) {
      console.warn(
        `⚠️ Artikel '${cleanSlug}' tidak ditemukan di Sanity BMA.`
      );

      return NextResponse.json(
        {
          success: false,

          source:
            'Sanity BMA',

          projectId:
            PROJECT_ID,

          dataset:
            DATASET,

          slug:
            cleanSlug,

          error:
            `Artikel dengan slug '${cleanSlug}' tidak ditemukan di Sanity BMA.`,
        },
        {
          status: 404,

          headers: {
            'Content-Type':
              'application/json',

            'Cache-Control':
              'no-store',
          },
        }
      );
    }

    // ========================================================
    // NORMALIZE ARTICLE
    // ========================================================

    const article = {
      ...data.article,

      imageUrl:
        typeof data.article
          .imageUrl === 'string' &&
        data.article.imageUrl.trim()
          ? data.article.imageUrl
          : '/images/placeholder.jpg',

      alt:
        data.article.alt ||
        data.article.title,

      category:
        data.article.category ||
        'Kabar Terbaru',

      content:
        Array.isArray(
          data.article.content
        )
          ? data.article.content
          : [],
    };

    // ========================================================
    // NORMALIZE RELATED NEWS
    // ========================================================

    const allNews =
      Array.isArray(
        data.allNews
      )
        ? data.allNews
            .filter(
              (item) =>
                item &&
                item.id &&
                item.title &&
                item.slug
            )
            .map(
              (item) => ({
                ...item,

                imageUrl:
                  typeof item.imageUrl ===
                    'string' &&
                  item.imageUrl.trim()
                    ? item.imageUrl
                    : '/images/placeholder.jpg',

                category:
                  item.category ||
                  'Kabar Terbaru',
              })
            )
        : [];

    // ========================================================
    // NORMALIZE CAMPAIGNS
    // ========================================================

    const sidebarCampaigns =
      Array.isArray(
        data.sidebarCampaigns
      )
        ? data.sidebarCampaigns
            .filter(
              (item) =>
                item &&
                item.id &&
                item.title &&
                item.slug
            )
            .map(
              (item) => ({
                ...item,

                image:
                  typeof item.image ===
                    'string' &&
                  item.image.trim()
                    ? item.image
                    : '/images/banner.png',

                collectedRaw:
                  Number(
                    item.collectedRaw ??
                      item.collectedAmount ??
                      0
                  ) || 0,

                collectedAmount:
                  Number(
                    item.collectedAmount ??
                      item.collectedRaw ??
                      0
                  ) || 0,

                targetAmount:
                  Number(
                    item.targetAmount ??
                      50000000
                  ) ||
                  50000000,
              })
            )
        : [];

    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
      `✅ Artikel ditemukan: ${article.title}`
    );

    console.log(
      `✅ Berita terkait: ${allNews.length}`
    );

    console.log(
      `✅ Campaign sidebar: ${sidebarCampaigns.length}`
    );

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,

        source:
          'Sanity BMA',

        projectId:
          PROJECT_ID,

        dataset:
          DATASET,

        data: {
          article,
          allNews,
          sidebarCampaigns,
        },
      },
      {
        status: 200,

        headers: {
          'Content-Type':
            'application/json',

          'Cache-Control':
            'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error: any) {
    console.error(
      '======================================'
    );

    console.error(
      '🔥 BMA API DETAIL NEWS ERROR'
    );

    console.error(
      'Project:',
      PROJECT_ID
    );

    console.error(
      'Dataset:',
      DATASET
    );

    console.error(
      'Message:',
      error?.message
    );

    console.error(
      error
    );

    console.error(
      '======================================'
    );

    return NextResponse.json(
      {
        success: false,

        source:
          'Sanity BMA',

        projectId:
          PROJECT_ID,

        dataset:
          DATASET,

        error:
          error?.message ||
          'Gagal mengambil detail berita dari Sanity BMA.',
      },
      {
        status: 500,

        headers: {
          'Content-Type':
            'application/json',

          'Cache-Control':
            'no-store',
        },
      }
    );
  }
}