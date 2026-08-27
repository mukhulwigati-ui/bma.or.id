// proxy.ts

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
//
// Ini penting.
//
// Jika Supabase melakukan refresh token/session,
// cookie baru harus ikut dibawa saat kita redirect.
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
// PROXY
// ============================================================

export async function proxy(
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
  //
  // Gunakan getAll / setAll.
  // Ini pola yang lebih aman untuk @supabase/ssr.
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
            // ================================================
            // Update cookie di request
            // ================================================

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

            // ================================================
            // Buat response baru menggunakan request terbaru
            // ================================================

            response =
              NextResponse.next({
                request,
              });

            // ================================================
            // Set cookie baru pada browser
            // ================================================

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
  //
  // Jangan pakai getSession() untuk proteksi server.
  // getUser() memvalidasi session terhadap Supabase Auth.
  // ==========================================================

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (error) {
    // Jangan langsung dianggap fatal.
    // Bisa terjadi ketika belum login.
    console.warn(
      '[BMA Proxy] Auth:',
      error.message
    );
  }

  // ==========================================================
  // DEBUG SEMENTARA
  //
  // Bisa dihapus setelah auth benar-benar stabil.
  // ==========================================================

  if (
    process.env.NODE_ENV !==
    'production'
  ) {
    console.log(
      '[BMA Proxy]',
      {
        pathname,
        authenticated:
          Boolean(user),

        userId:
          user?.id ||
          null,

        email:
          user?.email ||
          null,
      }
    );
  }

  // ==========================================================
  // 1. PROTECTED ROUTES
  //
  // Belum login:
  // /akun
  // /donasi-saya
  // /favorit
  // /kuitansi
  // /pengaturan
  // /notifikasi
  //
  // diarahkan ke /login
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

    // Simpan tujuan awal.
    // Setelah login nanti bisa dikembangkan agar kembali
    // ke halaman yang sebelumnya ingin dibuka.
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
  // 2. JIKA SUDAH LOGIN TAPI MEMBUKA /login
  //
  // Jangan tampilkan form login lagi.
  // Langsung arahkan ke /akun.
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
  // 3. AUTH CALLBACK
  //
  // Tidak diberi proteksi.
  // app/auth/callback/route.ts akan menangani:
  //
  // exchangeCodeForSession(code)
  //
  // Jadi jangan redirect route ini ke /login.
  // ==========================================================

  // Tidak perlu kondisi tambahan.
  // Cukup biarkan lewat.

  // ==========================================================
  // RESPONSE NORMAL
  // ==========================================================

  return response;
}

// ============================================================
// MATCHER
//
// Login sengaja TIDAK dikecualikan.
//
// Alasannya:
// jika user sudah punya session dan membuka /login,
// proxy harus bisa mengarahkannya ke /akun.
//
// /auth juga tetap boleh lewat proxy,
// tetapi TIDAK termasuk protected route.
// ============================================================

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
};