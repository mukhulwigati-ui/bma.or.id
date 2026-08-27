// public/sw.js

// ============================================================
// SERVICE WORKER BMA.OR.ID
// ============================================================

const CACHE_PREFIX = 'bma-pwa-cache';

// WAJIB dinaikkan setiap ada perubahan penting PWA
const CACHE_VERSION = 'v4';

const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

const OFFLINE_URL = '/offline';

// ============================================================
// ASET INTI BMA
// ============================================================

const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/images/logo-bma.png',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
];

// ============================================================
// HOST YANG TIDAK BOLEH DICACHE
// ============================================================

const BYPASS_HOSTS = [
  'sanity.io',
  'cdn.sanity.io',
  'midtrans.com',
  'app.midtrans.com',
  'pakasir.com',
  'app.pakasir.com',
  'supabase.co',
];

// ============================================================
// CEK REQUEST YANG HARUS BYPASS SERVICE WORKER
// ============================================================

function shouldBypassRequest(url) {
  // API dan halaman dinamis sensitif
  if (
    url.pathname.startsWith('/studio') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/')
  ) {
    return true;
  }

  // Host eksternal
  return BYPASS_HOSTS.some(
    (host) =>
      url.hostname === host ||
      url.hostname.endsWith(`.${host}`)
  );
}

// ============================================================
// CEK RESPONSE YANG BOLEH DICACHE
// ============================================================

function isCacheableResponse(response) {
  if (!response) return false;

  if (!response.ok) return false;

  return (
    response.type === 'basic' ||
    response.type === 'cors'
  );
}

// ============================================================
// INSTALL
// ============================================================

self.addEventListener('install', (event) => {
  console.log(
    '[BMA Service Worker] Installing:',
    CACHE_NAME
  );

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Cache satu per satu agar satu aset gagal
      // tidak menggagalkan seluruh instalasi SW.
      await Promise.allSettled(
        PRECACHE_ASSETS.map(async (asset) => {
          try {
            await cache.add(
              new Request(asset, {
                cache: 'reload',
              })
            );

            console.log(
              '[BMA Service Worker] Cached:',
              asset
            );
          } catch (error) {
            console.warn(
              '[BMA Service Worker] Gagal precache:',
              asset,
              error
            );
          }
        })
      );
    })()
  );

  // Langsung gunakan SW terbaru
  self.skipWaiting();
});

// ============================================================
// ACTIVATE
// ============================================================

self.addEventListener('activate', (event) => {
  console.log(
    '[BMA Service Worker] Activating:',
    CACHE_NAME
  );

  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames.map(async (cacheName) => {
          const lowerName =
            cacheName.toLowerCase();

          // Cache BMA versi sebelumnya
          const isOldBmaCache =
            cacheName.startsWith(CACHE_PREFIX) &&
            cacheName !== CACHE_NAME;

          // Bersihkan sisa project BDB
          const isOldBdbCache =
            lowerName.includes('bdb');

          // Bersihkan sisa project Islami
          const isOldIslamiCache =
            lowerName.includes('islami');

          if (
            isOldBmaCache ||
            isOldBdbCache ||
            isOldIslamiCache
          ) {
            console.log(
              '[BMA Service Worker] Menghapus cache lama:',
              cacheName
            );

            await caches.delete(cacheName);
          }
        })
      );

      // Ambil kontrol halaman tanpa menunggu reload berikutnya
      await self.clients.claim();
    })()
  );
});

// ============================================================
// NETWORK FIRST
// ============================================================
//
// Untuk:
// - halaman
// - campaign
// - berita
// - navigasi
//
// Dengan strategi ini data terbaru BMA lebih diprioritaskan.
// ============================================================

async function networkFirst(request) {
  const cache =
    await caches.open(CACHE_NAME);

  try {
    const networkResponse =
      await fetch(request);

    if (
      isCacheableResponse(networkResponse)
    ) {
      await cache.put(
        request,
        networkResponse.clone()
      );
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse =
      await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // ========================================================
    // FALLBACK JIKA OFFLINE
    // ========================================================

    if (request.mode === 'navigate') {
      const offlinePage =
        await cache.match(OFFLINE_URL);

      if (offlinePage) {
        return offlinePage;
      }

      const homePage =
        await cache.match('/');

      if (homePage) {
        return homePage;
      }
    }

    return new Response(
      'Anda sedang offline.',
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type':
            'text/plain; charset=utf-8',
        },
      }
    );
  }
}

// ============================================================
// CACHE FIRST
// ============================================================
//
// Khusus aset statis:
// - gambar
// - font
// - CSS
// - JavaScript
// ============================================================

async function cacheFirst(request) {
  const cache =
    await caches.open(CACHE_NAME);

  const cachedResponse =
    await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse =
      await fetch(request);

    if (
      isCacheableResponse(networkResponse)
    ) {
      await cache.put(
        request,
        networkResponse.clone()
      );
    }

    return networkResponse;
  } catch (error) {
    return new Response('', {
      status: 504,
      statusText: 'Gateway Timeout',
    });
  }
}

// ============================================================
// FETCH
// ============================================================

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Hanya intercept GET
  if (request.method !== 'GET') {
    return;
  }

  const url =
    new URL(request.url);

  // Hanya HTTP/HTTPS
  if (
    url.protocol !== 'http:' &&
    url.protocol !== 'https:'
  ) {
    return;
  }

  // ========================================================
  // JANGAN CACHE API / SANITY / PAYMENT / AUTH
  // ========================================================

  if (shouldBypassRequest(url)) {
    return;
  }

  // ========================================================
  // JANGAN INTERCEPT DOMAIN EKSTERNAL
  // ========================================================

  if (
    url.origin !==
    self.location.origin
  ) {
    return;
  }

  // ========================================================
  // MANIFEST
  //
  // Jangan biarkan manifest lama tersangkut di cache SW.
  // Ini penting saat mengganti identitas/theme PWA.
  // ========================================================

  if (
    url.pathname === '/manifest.json' ||
    request.destination === 'manifest'
  ) {
    event.respondWith(
      fetch(request, {
        cache: 'no-store',
      }).catch(() =>
        caches.match('/manifest.json')
      )
    );

    return;
  }

  // ========================================================
  // NAVIGATION = NETWORK FIRST
  // ========================================================

  if (
    request.mode === 'navigate' ||
    request.destination === 'document'
  ) {
    event.respondWith(
      networkFirst(request)
    );

    return;
  }

  // ========================================================
  // STATIC ASSET = CACHE FIRST
  // ========================================================

  const staticDestinations = [
    'image',
    'style',
    'script',
    'font',
  ];

  if (
    staticDestinations.includes(
      request.destination
    )
  ) {
    event.respondWith(
      cacheFirst(request)
    );

    return;
  }

  // ========================================================
  // REQUEST INTERNAL LAIN = NETWORK FIRST
  // ========================================================

  event.respondWith(
    networkFirst(request)
  );
});

// ============================================================
// MESSAGE
// ============================================================

self.addEventListener('message', (event) => {
  // Paksa SW baru aktif
  if (
    event.data?.type ===
    'SKIP_WAITING'
  ) {
    self.skipWaiting();
  }

  // ========================================================
  // CLEAR CACHE BMA
  // ========================================================

  if (
    event.data?.type ===
    'CLEAR_BMA_CACHE'
  ) {
    event.waitUntil(
      (async () => {
        const cacheNames =
          await caches.keys();

        await Promise.all(
          cacheNames.map(
            (cacheName) => {
              if (
                cacheName.startsWith(
                  CACHE_PREFIX
                )
              ) {
                return caches.delete(
                  cacheName
                );
              }

              return Promise.resolve(false);
            }
          )
        );
      })()
    );
  }

  // ========================================================
  // CLEAR SEMUA CACHE PROJECT LAMA
  // ========================================================

  if (
    event.data?.type ===
    'CLEAR_LEGACY_CACHE'
  ) {
    event.waitUntil(
      (async () => {
        const cacheNames =
          await caches.keys();

        await Promise.all(
          cacheNames.map(
            (cacheName) => {
              const lowerName =
                cacheName.toLowerCase();

              if (
                lowerName.includes('bma') ||
                lowerName.includes('bdb') ||
                lowerName.includes('islami')
              ) {
                return caches.delete(
                  cacheName
                );
              }

              return Promise.resolve(false);
            }
          )
        );
      })()
    );
  }
});