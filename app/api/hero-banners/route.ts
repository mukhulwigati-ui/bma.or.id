// app/api/hero-banners/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// ============================================================
// BMA SANITY — DIKUNCI KE PROJECT YANG BENAR
// Jangan ambil NEXT_PUBLIC_SANITY_PROJECT_ID lama.
// ============================================================

const PROJECT_ID = 'im4qx3kd';
const DATASET = 'production';

const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-08-01',
  useCdn: false,
  perspective: 'published',

  // Token digunakan jika tersedia.
  // Aman karena route ini SERVER ONLY.
  token: process.env.SANITY_API_TOKEN || undefined,
});

// ============================================================
// GET HERO BANNER
// ============================================================

export async function GET() {
  try {
    const query = `
      *[
        _type in ["heroBanner", "banner"] &&
        active != false &&
        defined(image.asset)
      ]
      | order(order asc, _createdAt desc)
      [0...20] {
        "_id": _id,

        "title": coalesce(
          title,
          name,
          "Banner BMA"
        ),

        "imageUrl": image.asset->url,

        "linkUrl": coalesce(
          link,
          linkUrl,
          url
        ),

        "active": coalesce(
          active,
          true
        ),

        "order": coalesce(
          order,
          999
        )
      }
    `;

    const data = await sanityClient.fetch(query, {}, {
      cache: 'no-store',
    });

    const banners = Array.isArray(data)
      ? data.filter(
          (item: any) =>
            item &&
            item._id &&
            typeof item.imageUrl === 'string' &&
            item.imageUrl.trim() !== ''
        )
      : [];

    console.log(
      `✅ BMA Sanity Hero: ${banners.length} banner ditemukan`
    );

    return NextResponse.json(
      {
        success: true,
        projectId: PROJECT_ID,
        dataset: DATASET,
        count: banners.length,
        data: banners,
      },
      {
        status: 200,

        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error(
      '❌ Gagal mengambil Hero Banner BMA:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        projectId: PROJECT_ID,
        dataset: DATASET,
        count: 0,
        data: [],
        error:
          error?.message ||
          'Gagal mengambil banner dari Sanity.',
      },
      {
        status: 500,
      }
    );
  }
}