// app/api/og/campaign/[slug]/route.ts

import { createClient } from '@sanity/client';

// ============================================================
// NEXT.JS
// ============================================================

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// ============================================================
// SANITY BMA
// ============================================================

const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'im4qx3kd';

const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-08-01',
  useCdn: false,
  perspective: 'published',
});

// ============================================================
// HELPER
// ============================================================

function buildSanitySocialImageUrl(
  source: string
): string {
  try {
    const url = new URL(source);

    // Hapus transformasi lama
    url.search = '';

    // ========================================================
    // Format yang aman untuk crawler WhatsApp
    // ========================================================

    url.searchParams.set('w', '1200');
    url.searchParams.set('h', '630');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('fm', 'jpg');
    url.searchParams.set('q', '85');

    return url.toString();
  } catch {
    return source;
  }
}

// ============================================================
// GET
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
    const { slug } =
      await context.params;

    const decodedSlug =
      decodeURIComponent(
        slug
      ).trim();

    if (!decodedSlug) {
      return new Response(
        'Slug tidak valid.',
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // AMBIL GAMBAR CAMPAIGN YANG SAMA DENGAN /api/programs
    // ========================================================

    const query = `
      *[
        _type in ["program", "campaign"] &&
        slug.current == $slug
      ][0] {
        _id,
        _updatedAt,
        title,

        "imageUrl": coalesce(
          image.asset->url,
          mainImage.asset->url,
          thumbnail.asset->url,
          banner.asset->url
        )
      }
    `;

    const campaign =
      await sanityClient.fetch(
        query,
        {
          slug:
            decodedSlug,
        },
        {
          cache:
            'no-store',
        }
      );

    // ========================================================
    // JIKA CAMPAIGN / IMAGE TIDAK ADA
    // ========================================================

    if (
      !campaign ||
      !campaign.imageUrl
    ) {
      console.warn(
        'OG campaign image tidak ditemukan:',
        decodedSlug
      );

      // Gunakan fallback image milik website
      const fallbackUrl =
        new URL(
          '/images/banner.png',
          request.url
        );

      const fallbackResponse =
        await fetch(
          fallbackUrl,
          {
            cache:
              'no-store',
          }
        );

      if (
        !fallbackResponse.ok
      ) {
        return new Response(
          'Gambar campaign tidak ditemukan.',
          {
            status: 404,
          }
        );
      }

      const fallbackBuffer =
        await fallbackResponse.arrayBuffer();

      return new Response(
        fallbackBuffer,
        {
          status: 200,

          headers: {
            'Content-Type':
              fallbackResponse.headers.get(
                'content-type'
              ) ||
              'image/png',

            'Cache-Control':
              'public, max-age=300, s-maxage=300',

            'X-Content-Type-Options':
              'nosniff',
          },
        }
      );
    }

    // ========================================================
    // TRANSFORM SANITY → JPEG 1200x630
    // ========================================================

    const socialImageUrl =
      buildSanitySocialImageUrl(
        campaign.imageUrl
      );

    console.log(
      '=============================================='
    );

    console.log(
      'BMA OG IMAGE PROXY'
    );

    console.log(
      'Slug:',
      decodedSlug
    );

    console.log(
      'Source:',
      campaign.imageUrl
    );

    console.log(
      'Final:',
      socialImageUrl
    );

    console.log(
      '=============================================='
    );

    // ========================================================
    // FETCH IMAGE DARI SANITY
    // ========================================================

    const imageResponse =
      await fetch(
        socialImageUrl,
        {
          method: 'GET',

          cache:
            'no-store',

          headers: {
            Accept:
              'image/jpeg,image/*;q=0.9,*/*;q=0.8',

            'User-Agent':
              'BMA-OG-Image-Proxy/1.0',
          },
        }
      );

    if (
      !imageResponse.ok
    ) {
      console.error(
        'Sanity image response:',
        imageResponse.status,
        imageResponse.statusText
      );

      return new Response(
        'Gagal mengambil gambar campaign.',
        {
          status: 502,
        }
      );
    }

    // ========================================================
    // VALIDASI CONTENT TYPE
    // ========================================================

    const sourceContentType =
      imageResponse.headers.get(
        'content-type'
      ) || '';

    if (
      !sourceContentType.startsWith(
        'image/'
      )
    ) {
      console.error(
        'OG source bukan image:',
        sourceContentType
      );

      return new Response(
        'Respons gambar tidak valid.',
        {
          status: 502,
        }
      );
    }

    // ========================================================
    // BUFFER
    // ========================================================

    const imageBuffer =
      await imageResponse.arrayBuffer();

    // ========================================================
    // RETURN KE WHATSAPP / FACEBOOK
    // ========================================================

    return new Response(
      imageBuffer,
      {
        status: 200,

        headers: {
          // Kita memang meminta fm=jpg dari Sanity
          'Content-Type':
            'image/jpeg',

          // Boleh dicache karena metadata akan memakai ?v=_updatedAt
          'Cache-Control':
            'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',

          'X-Content-Type-Options':
            'nosniff',

          'Content-Disposition':
            `inline; filename="campaign-${decodedSlug}.jpg"`,
        },
      }
    );
  } catch (error: any) {
    console.error(
      '🔥 BMA OG CAMPAIGN IMAGE ERROR:',
      error
    );

    return new Response(
      'Terjadi kesalahan saat membuat gambar preview.',
      {
        status: 500,
      }
    );
  }
}