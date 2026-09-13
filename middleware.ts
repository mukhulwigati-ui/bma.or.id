// middleware.ts

import { createServerClient } from '@supabase/ssr';
import {
  NextResponse,
  type NextRequest,
} from 'next/server';

export async function middleware(
  request: NextRequest
) {
  const response = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Jangan sampai middleware crash jika ENV belum tersedia.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'Supabase environment variables belum tersedia.'
    );

    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname = '/login';

    return NextResponse.redirect(
      loginUrl
    );
  }

  let supabaseResponse =
    response;

  const supabase =
    createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value
                );
              }
            );

            supabaseResponse =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                supabaseResponse.cookies.set(
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
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {
      const loginUrl =
        request.nextUrl.clone();

      loginUrl.pathname =
        '/login';

      loginUrl.searchParams.set(
        'redirect',
        request.nextUrl.pathname
      );

      return NextResponse.redirect(
        loginUrl
      );
    }

    return supabaseResponse;
  } catch (error) {
    console.error(
      'Middleware Supabase error:',
      error
    );

    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname =
      '/login';

    return NextResponse.redirect(
      loginUrl
    );
  }
}

export const config = {
  matcher: [
    '/akun/:path*',
    '/donasi-saya/:path*',
  ],
};