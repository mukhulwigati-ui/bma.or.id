// middleware.ts

import {
  createServerClient,
} from '@supabase/ssr';

import {
  NextResponse,
  type NextRequest,
} from 'next/server';

const PROTECTED_ROUTES = [
  '/akun',
  '/donasi-saya',
  '/favorit',
  '/kuitansi',
  '/pengaturan',
  '/notifikasi',
];

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}

function redirectWithCookies(
  url: URL,
  sourceResponse: NextResponse
) {
  const redirectResponse = NextResponse.redirect(url);

  sourceResponse.cookies
    .getAll()
    .forEach(({ name, value, ...options }) => {
      redirectResponse.cookies.set({
        name,
        value,
        ...options,
      });
    });

  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ==========================================================
  // BERSIHKAN URL JIKA ADA PARAMETER NEXT YANG RUSAK (%2F)
  // ==========================================================
  const nextParam = request.nextUrl.searchParams.get('next');
  if (nextParam && nextParam.includes('%2F')) {
    const cleanedUrl = request.nextUrl.clone();
    cleanedUrl.searchParams.set(
      'next',
      decodeURIComponent(nextParam).replace(/^%2F/, '/')
    );
    return NextResponse.redirect(cleanedUrl);
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Jika belum login dan buka halaman protected -> lempar ke login
  if (!user && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return redirectWithCookies(loginUrl, response);
  }

  // 2. Jika sudah login tapi buka /login -> lempar langsung ke /akun (Bersihkan parameter)
  if (user && (pathname === '/login' || pathname.startsWith('/login/'))) {
    const accountUrl = request.nextUrl.clone();
    accountUrl.pathname = '/akun';
    accountUrl.search = ''; // Hapus semua query parameter agar tidak looping
    return redirectWithCookies(accountUrl, response);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
};