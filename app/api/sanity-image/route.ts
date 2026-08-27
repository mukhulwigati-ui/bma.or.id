// app/api/sanity-image/route.ts

import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// HOST YANG DIIZINKAN
// ============================================================

const ALLOWED_HOSTS = new Set([
  'cdn.sanity.io',
]);

// ============================================================
// GET IMAGE
// ============================================================

export async function GET(
  request: NextRequest
) {
  try {
    const src =
      request.nextUrl.searchParams.get(
        'src'
      );

    if (!src) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Parameter src diperlukan.',
        },
        {
          status: 400,
        }
      );
    }

    let imageUrl: URL;

    try {
      imageUrl = new URL(src);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            'URL gambar tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // SECURITY
    // Hanya izinkan CDN Sanity
    // ========================================================

    if (
      !ALLOWED_HOSTS.has(
        imageUrl.hostname
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Host gambar tidak diizinkan.',
        },
        {
          status: 403,
        }
      );
    }

    // ========================================================
    // FETCH SANITY IMAGE
    // ========================================================

    const response = await fetch(
      imageUrl.toString(),
      {
        cache: 'force-cache',

        headers: {
          Accept: 'image/*',
        },
      }
    );

    if (!response.ok) {
      console.error(
        'Sanity image error:',
        response.status,
        imageUrl.toString()
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Gambar Sanity tidak dapat dimuat.',
        },
        {
          status: response.status,
        }
      );
    }

    const contentType =
      response.headers.get(
        'content-type'
      ) || 'image/jpeg';

    const imageBuffer =
      await response.arrayBuffer();

    // ========================================================
    // RETURN IMAGE
    // ========================================================

    return new NextResponse(
      imageBuffer,
      {
        status: 200,

        headers: {
          'Content-Type':
            contentType,

          'Cache-Control':
            'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error(
      '❌ Sanity image proxy error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          'Terjadi kesalahan saat memuat gambar.',
      },
      {
        status: 500,
      }
    );
  }
}