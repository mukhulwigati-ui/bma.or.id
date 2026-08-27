// middleware.ts

import {
  createServerClient,
} from '@supabase/ssr';

import {
  NextResponse,
  type NextRequest,
} from 'next/server';

// ============================================================
// ROUTE YANG MEMBUTUHKAN LOGIN
// ============================================================

const PROTECTED_ROUTES = [
  '/akun',
  '/donasi-saya',
  '/favorit',
  '/kuitansi',
  '/pengaturan',
  '/notifikasi',
];

// ============================================================
// HELPER
// ============================================================

function isProtectedRoute(
  pathname: string
) {
  return PROTECTED_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(
        `${route}/`
      )
  );
}

// ============================================================
// COPY COOKIE DARI RESPONSE SUPABASE KE RESPONSE REDIRECT
// ============================================================

function redirectWithCookies(
  url: URL,
  sourceResponse: NextResponse
) {
  const redirectResponse =
    NextResponse.redirect(url);

  sourceResponse.cookies
    .getAll()
    .forEach(
      ({
        name,
        value,
        ...options
      }) => {
        redirectResponse.cookies.set({
          name,
          value,
          ...options,
        });
      }
    );

  return redirectResponse;
}

// ============================================================
// MIDDLEWARE (Wajib menggunakan nama 'middleware' agar terbaca Next.js)
// ============================================================

export async function middleware(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname;

  // ==========================================================
  // RESPONSE AWAL
  // ==========================================================

  let response =
    NextResponse.next({
      request,
    });

  // ==========================================================
  // SUPABASE SERVER CLIENT
  // ==========================================================

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet
          ) {
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

            response =
              NextResponse.next({
                request,
              });

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

  // ==========================================================
  // VALIDASI USER
  // ==========================================================

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (error) {
    console.warn(
      '[BMA Middleware] Auth:',
      error.message
    );
  }

  // ==========================================================
  // 1. PROTECTED ROUTES (Belum login -> lempar ke /login)
  // ==========================================================

  if (
    !user &&
    isProtectedRoute(
      pathname
    )
  ) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname =
      '/login';

    loginUrl.searchParams.set(
      'next',
      pathname
    );

    return redirectWithCookies(
      loginUrl,
      response
    );
  }

  // ==========================================================
  // 2. SUDAH LOGIN TAPI MEMBUKA /login -> lempar ke /akun
  // ==========================================================

  if (
    user &&
    (
      pathname ===
        '/login' ||
      pathname.startsWith(
        '/login/'
      )
    )
  ) {
    const accountUrl =
      request.nextUrl.clone();

    accountUrl.pathname =
      '/akun';

    accountUrl.search =
      '';

    return redirectWithCookies(
      accountUrl,
      response
    );
  }

  // ==========================================================
  // RESPONSE NORMAL
  // ==========================================================

  return response;
}

// ============================================================
// MATCHER
// ============================================================

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
};