// app/api/views/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ContentType =
  | 'blog'
  | 'campaign'
  | 'referral';

function isValidType(
  value: unknown
): value is ContentType {
  return (
    value === 'blog' ||
    value === 'campaign' ||
    value === 'referral'
  );
}

function cleanSlug(
  value: unknown
): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .trim()
    .slice(0, 300);
}

function isBot(
  userAgent: string
) {
  return /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|meta-externalagent|meta-externalfetcher|whatsapp|telegrambot|discordbot|twitterbot|linkedinbot|pinterest|preview|headless/i.test(
    userAgent
  );
}

function noStoreJson(
  body: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(
    body,
    {
      status,
      headers: {
        'Cache-Control':
          'no-store, no-cache, must-revalidate',
      },
    }
  );
}

// ============================================================
// GET: hanya membaca jumlah views
// ============================================================

export async function GET(
  request: NextRequest
) {
  try {
    const type =
      request.nextUrl.searchParams.get(
        'type'
      );

    const slug =
      cleanSlug(
        request.nextUrl.searchParams.get(
          'slug'
        )
      );

    if (!isValidType(type) || !slug) {
      return noStoreJson(
        {
          success: false,
          error:
            'Parameter views tidak valid.',
        },
        400
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from('content_views')
        .select('views')
        .eq('content_type', type)
        .eq('slug', slug)
        .maybeSingle();

    if (error) {
      console.error(
        '[VIEWS GET] Supabase:',
        error
      );

      return noStoreJson(
        {
          success: false,
          error:
            'Gagal membaca jumlah views.',
        },
        500
      );
    }

    return noStoreJson({
      success: true,
      views: Number(
        data?.views || 0
      ),
    });
  } catch (error) {
    console.error(
      '[VIEWS GET] Error:',
      error
    );

    return noStoreJson(
      {
        success: false,
        error:
          'Terjadi kesalahan server.',
      },
      500
    );
  }
}

// ============================================================
// POST: tambah view secara atomic
// ============================================================

export async function POST(
  request: NextRequest
) {
  try {
    const userAgent =
      request.headers.get(
        'user-agent'
      ) || '';

    let body: Record<
      string,
      unknown
    >;

    try {
      body =
        await request.json();
    } catch {
      return noStoreJson(
        {
          success: false,
          error:
            'Request tidak valid.',
        },
        400
      );
    }

    const type =
      body.type;

    const slug =
      cleanSlug(
        body.slug
      );

    if (!isValidType(type) || !slug) {
      return noStoreJson(
        {
          success: false,
          error:
            'Data views tidak valid.',
        },
        400
      );
    }

    // Bot / crawler tidak menambah angka.
    // Namun tetap kembalikan jumlah saat ini.
    if (isBot(userAgent)) {
      const { data } =
        await supabaseAdmin
          .from('content_views')
          .select('views')
          .eq(
            'content_type',
            type
          )
          .eq(
            'slug',
            slug
          )
          .maybeSingle();

      return noStoreJson({
        success: true,
        counted: false,
        views: Number(
          data?.views || 0
        ),
      });
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin.rpc(
        'increment_content_view',
        {
          p_content_type:
            type,

          p_slug:
            slug,
        }
      );

    if (error) {
      console.error(
        '[VIEWS POST] Supabase:',
        error
      );

      return noStoreJson(
        {
          success: false,
          error:
            'Gagal menambah views.',
        },
        500
      );
    }

    return noStoreJson({
      success: true,
      counted: true,
      views: Number(
        data || 0
      ),
    });
  } catch (error) {
    console.error(
      '[VIEWS POST] Error:',
      error
    );

    return noStoreJson(
      {
        success: false,
        error:
          'Terjadi kesalahan server.',
      },
      500
    );
  }
}
