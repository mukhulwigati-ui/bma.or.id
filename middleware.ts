// middleware.ts

import {
  NextResponse,
  type NextRequest,
} from 'next/server';

export function middleware(
  request: NextRequest
) {
  // Middleware dibuat seringan mungkin.
  // Jangan melakukan fetch / auth request ke Supabase dari sini.
  //
  // Proteksi login untuk /akun dan /donasi-saya
  // sebaiknya dilakukan di level halaman / client,
  // supaya request halaman tidak mati jika Supabase lambat.

  return NextResponse.next({
    request,
  });
}

export const config = {
  matcher: [
    '/akun/:path*',
    '/donasi-saya/:path*',
  ],
};