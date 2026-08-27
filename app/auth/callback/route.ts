// app/auth/callback/route.ts

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get('code');
  
  // Ambil parameter next, lalu decode agar karakter seperti %2F kembali normal menjadi '/'
  const rawNext = requestUrl.searchParams.get('next') || '/akun';
  let next = '/akun';
  try {
    next = decodeURIComponent(rawNext);
  } catch {
    next = '/akun';
  }

  // Pastikan path tujuan selalu diawali dengan slash (/) demi keamanan navigasi
  if (!next.startsWith('/')) {
    next = `/${next}`;
  }

  // Kalau Google/Supabase tidak mengirim code
  if (!code) {
    console.error('OAuth callback: code tidak ditemukan');

    return NextResponse.redirect(
      new URL('/login?error=oauth_code_missing', requestUrl.origin)
    );
  }

  // Response redirect INI yang akan membawa cookie auth ke tujuan yang benar
  const response = NextResponse.redirect(
    new URL(next, requestUrl.origin)
  );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.headers
            .get('cookie')
            ?.split(';')
            .map((cookie) => {
              const [name, ...rest] = cookie.trim().split('=');

              return {
                name,
                value: rest.join('='),
              };
            }) || [];
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  try {
    const {
      data,
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(
        'exchangeCodeForSession gagal:',
        error
      );

      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message)}`,
          requestUrl.origin
        )
      );
    }

    if (!data.session || !data.user) {
      console.error(
        'OAuth selesai tetapi session/user kosong'
      );

      return NextResponse.redirect(
        new URL(
          '/login?error=session_not_created',
          requestUrl.origin
        )
      );
    }

    console.log(
      '✅ LOGIN GOOGLE BERHASIL:',
      data.user.email
    );

    return response;
  } catch (error) {
    console.error(
      'OAuth callback fatal:',
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