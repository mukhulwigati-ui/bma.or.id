// app/api/news/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// ============================================================
// SANITY BMA
// Dikunci langsung ke project BMA agar tidak tertukar
// dengan konfigurasi Sanity website lama.
// ============================================================

const PROJECT_ID = 'im4qx3kd';
const DATASET = 'production';

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-08-01',
  useCdn: true,
  perspective: 'published',

  // Untuk membaca data published tidak perlu token
});

// ============================================================
// CACHE
// ============================================================

export const dynamic = 'force-dynamic';
export const revalidate = 60;

// ============================================================
// HELPER TIME AGO
// ============================================================

function timeAgo(
  dateString?: string
): string {
  if (!dateString) {
    return 'Kabar Terbaru';
  }

  const now = new Date();
  const past = new Date(dateString);

  if (
    Number.isNaN(
      past.getTime()
    )
  ) {
    return 'Kabar Terbaru';
  }

  const diffMs =
    Math.max(
      0,
      now.getTime() -
        past.getTime()
    );

  const diffMins =
    Math.floor(
      diffMs / 60000
    );

  const diffHours =
    Math.floor(
      diffMins / 60
    );

  const diffDays =
    Math.floor(
      diffHours / 24
    );

  const diffMonths =
    Math.floor(
      diffDays / 30
    );

  const diffYears =
    Math.floor(
      diffDays / 365
    );

  if (diffMins < 1) {
    return 'Baru saja';
  }

  if (diffMins < 60) {
    return `${diffMins} menit lalu`;
  }

  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }

  if (diffDays < 30) {
    return `${diffDays} hari lalu`;
  }

  if (diffMonths < 12) {
    return `${diffMonths} bulan lalu`;
  }

  return `${diffYears} tahun lalu`;
}

// ============================================================
// TYPE DATA SANITY
// ============================================================

interface SanityNewsItem {
  id: string;
  slug?: string;
  title?: string;
  image?: string;
  category?: string;
  publishedAt?: string;
  createdAt?: string;
}

// ============================================================
// GET NEWS
// ============================================================

export async function GET() {
  try {
    // ========================================================
    // QUERY GROQ
    // Hanya mengambil news published yang punya slug
    // ========================================================

    const query = `
      *[
        _type == "news" &&
        defined(slug.current)
      ]
      | order(
          coalesce(
            publishedAt,
            _createdAt
          ) desc
        )
      [0...12] {

        "id": _id,

        "slug":
          slug.current,

        title,

        "image":
          coalesce(
            image.asset->url,
            mainImage.asset->url,
            thumbnail.asset->url,
            coverImage.asset->url
          ),

        "category":
          coalesce(
            category->title,
            category,
            "Kabar Terbaru"
          ),

        publishedAt,

        "createdAt":
          _createdAt
      }
    `;

    // ========================================================
    // FETCH SANITY
    // ========================================================

    const sanityNews =
      await client.fetch<
        SanityNewsItem[]
      >(
        query,
        {},
        {
          next: {
            revalidate: 60,
          },
        }
      );

    // ========================================================
    // FORMAT DATA
    // ========================================================

    const formattedNews =
      Array.isArray(sanityNews)
        ? sanityNews
            .filter(
              (item) =>
                item &&
                item.id &&
                item.slug &&
                item.title
            )
            .map((item) => {
              const date =
                item.publishedAt ||
                item.createdAt;

              return {
                id:
                  String(item.id),

                slug:
                  String(item.slug),

                title:
                  String(item.title),

                image:
                  typeof item.image ===
                    'string' &&
                  item.image.trim()
                    ? item.image
                    : '/images/placeholder.jpg',

                category:
                  item.category ||
                  'Kabar Terbaru',

                publishedAt:
                  date || null,

                timeAgo:
                  timeAgo(date),

                dateLabel:
                  timeAgo(date),
              };
            })
        : [];

    // ========================================================
    // DEBUG SERVER
    // ========================================================

    console.log(
      '======================================'
    );

    console.log(
      '✅ BMA NEWS API'
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
      'Total berita:',
      formattedNews.length
    );

    console.log(
      '======================================'
    );

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,

        source: 'Sanity BMA',

        projectId:
          PROJECT_ID,

        dataset:
          DATASET,

        count:
          formattedNews.length,

        data:
          formattedNews,
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
      '🔥 Fetch BMA News API Error:',
      error
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

        count: 0,

        data: [],

        error:
          error?.message ||
          'Gagal mengambil berita dari Sanity BMA.',
      },
      {
        status: 500,

        headers: {
          'Cache-Control':
            'no-store',
        },
      }
    );
  }
}