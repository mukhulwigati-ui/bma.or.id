// app/api/news/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// ============================================================
// SANITY BMA
// ============================================================

const PROJECT_ID = 'im4qx3kd';
const DATASET = 'production';

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-08-01',

  // Penting untuk berita:
  // baca langsung data published terbaru.
  useCdn: false,

  perspective: 'published',
});

// ============================================================
// CACHE
// ============================================================

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  if (Number.isNaN(past.getTime())) {
    return 'Kabar Terbaru';
  }

  const diffMs = Math.max(
    0,
    now.getTime() - past.getTime()
  );

  const diffMins = Math.floor(
    diffMs / 60000
  );

  const diffHours = Math.floor(
    diffMins / 60
  );

  const diffDays = Math.floor(
    diffHours / 24
  );

  const diffMonths = Math.floor(
    diffDays / 30
  );

  const diffYears = Math.floor(
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
  updatedAt?: string;
}

// ============================================================
// HELPER IMAGE
//
// Jangan resize / convert gambar Sanity di sini.
// URL asset asli dipertahankan agar sumber gambar daftar berita
// sama dengan sumber gambar Open Graph / WhatsApp.
// ============================================================

function normalizeImage(
  image?: string
): string {
  if (
    typeof image === 'string' &&
    image.trim()
  ) {
    return image.trim();
  }

  return '/images/placeholder.jpg';
}

// ============================================================
// GET NEWS
// ============================================================

export async function GET() {
  try {
    // ========================================================
    // QUERY
    //
    // Urutan sumber gambar HARUS sama dengan:
    // app/news/[slug]/page.tsx
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
            coverImage.asset->url,
            banner.asset->url
          ),

        "category":
          coalesce(
            category->title,
            category,
            "Kabar Terbaru"
          ),

        publishedAt,

        "createdAt":
          _createdAt,

        "updatedAt":
          _updatedAt
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
          cache: 'no-store',
        }
      );

    // ========================================================
    // FORMAT
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

              const image =
                normalizeImage(
                  item.image
                );

              return {
                id:
                  String(item.id),

                _id:
                  String(item.id),

                slug:
                  String(item.slug),

                title:
                  String(item.title),

                // URL gambar ASLI Sanity.
                image,

                category:
                  item.category ||
                  'Kabar Terbaru',

                publishedAt:
                  date || null,

                createdAt:
                  item.createdAt ||
                  null,

                updatedAt:
                  item.updatedAt ||
                  null,

                timeAgo:
                  timeAgo(date),

                dateLabel:
                  timeAgo(date),
              };
            })
        : [];

    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
      '======================================'
    );

    console.log(
      '✅ BMA NEWS API'
    );

    console.log(
      'Project:',
      PROJECT_ID
    );

    console.log(
      'Dataset:',
      DATASET
    );

    console.log(
      'Total:',
      formattedNews.length
    );

    if (formattedNews.length > 0) {
      console.log(
        'Contoh gambar:',
        formattedNews[0].image
      );
    }

    console.log(
      '======================================'
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

        count:
          formattedNews.length,

        data:
          formattedNews,
      },
      {
        status: 200,

        headers: {
          'Content-Type':
            'application/json; charset=utf-8',

          // Jangan simpan response lama.
          'Cache-Control':
            'no-store, no-cache, must-revalidate',

          Pragma:
            'no-cache',

          Expires:
            '0',
        },
      }
    );
  } catch (error: any) {
    console.error(
      '🔥 BMA NEWS API ERROR:',
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
            'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}