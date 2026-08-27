// app/auth/callback/route.ts

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get('code');

  // ============================================================
  // TUJUAN SETELAH LOGIN
  // ============================================================

  const next =
    requestUrl.searchParams.get('next') ||
    '/akun';

  if (!code) {
    console.error(
      '🔥 OAuth callback gagal: code tidak ditemukan.'
    );

    return NextResponse.redirect(
      new URL(
        '/login?error=oauth_code_missing',
        requestUrl.origin
      )
    );
  }

  try {
    const cookieStore =
      await cookies();

    // ==========================================================
    // SUPABASE SERVER CLIENT
    // ==========================================================

    const supabase =
      createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },

            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(
                  ({
                    name,
                    value,
                    options,
                  }) => {
                    cookieStore.set(
                      name,
                      value,
                      options
                    );
                  }
                );
              } catch (error) {
                console.warn(
                  'Cookie callback warning:',
                  error
                );
              }
            },
          },
        }
      );

    // ==========================================================
    // TUKAR CODE GOOGLE MENJADI SESSION SUPABASE
    // ==========================================================

    const {
      data,
      error,
    } =
      await supabase.auth.exchangeCodeForSession(
        code
      );

    if (error) {
      console.error(
        '🔥 exchangeCodeForSession error:',
        error
      );

      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(
            error.message
          )}`,
          requestUrl.origin
        )
      );
    }

    // ==========================================================
    // VALIDASI USER
    // ==========================================================

    const user =
      data?.user;

    if (!user) {
      console.error(
        '🔥 OAuth callback selesai tetapi user kosong.'
      );

      return NextResponse.redirect(
        new URL(
          '/login?error=user_not_found',
          requestUrl.origin
        )
      );
    }

    console.log(
      '✅ LOGIN GOOGLE BMA BERHASIL:',
      user.id
    );

    // ==========================================================
    // OPSIONAL:
    // SINKRONKAN PROFILE
    // ==========================================================

    try {
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        '';

      const avatarUrl =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        null;

      await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            email:
              user.email || null,

            name:
              fullName || null,

            avatar_url:
              avatarUrl,

            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        );
    } catch (profileError) {
      // Profile gagal tidak boleh menggagalkan login
      console.warn(
        '⚠️ Sinkronisasi profile gagal:',
        profileError
      );
    }

    // ==========================================================
    // REDIRECT KE BMA
    // ==========================================================

    return NextResponse.redirect(
      new URL(
        next,
        requestUrl.origin
      )
    );
  } catch (error) {
    console.error(
      '🔥 OAuth callback fatal error:',
      error
    );

    return NextResponse.redirect(
      new URL(
        '/login?error=oauth_callback_failed',
        requestUrl.origin
      )
    );
  }
}