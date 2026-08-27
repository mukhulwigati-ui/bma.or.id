// app/api/hero-banners/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'im4qx3kd',
  dataset: 'production',
  apiVersion: '2026-08-01',
  useCdn: false,
  perspective: 'published',

  // PENTING:
  // JANGAN pakai SANITY_API_TOKEN di sini
});

export async function GET() {
  try {
    const query = `
      *[
        _type in ["heroBanner", "banner"] &&
        active != false
      ]
      | order(order asc, _createdAt desc)
      [0...20] {
        "_id": _id,
        "title": coalesce(title, name, "Banner BMA"),
        "imageUrl": coalesce(
          image.asset->url,
          banner.asset->url
        ),
        "linkUrl": coalesce(
          link,
          linkUrl,
          url
        ),
        "active": coalesce(active, true),
        "order": coalesce(order, 999)
      }
    `;

    const data = await sanityClient.fetch(
      query,
      {},
      {
        cache: 'no-store',
      }
    );

    const banners = Array.isArray(data)
      ? data.filter(
          (item: any) =>
            item?._id &&
            typeof item?.imageUrl === 'string' &&
            item.imageUrl.trim() !== ''
        )
      : [];

    return NextResponse.json(
      {
        success: true,
        projectId: 'im4qx3kd',
        dataset: 'production',
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
      'Gagal membaca banner Sanity BMA:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        projectId: 'im4qx3kd',
        dataset: 'production',
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