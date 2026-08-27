// public/sw.js

// ============================================================
// SERVICE WORKER BMA.OR.ID
// ============================================================

const CACHE_PREFIX = 'bma-pwa-cache';
const CACHE_VERSION = 'v3';

const CACHE_NAME =
  `${CACHE_PREFIX}-${CACHE_VERSION}`;

const OFFLINE_URL = '/offline';

// ============================================================
// ASET INTI
//
// Pastikan file berikut benar-benar tersedia di /public.
// ============================================================

const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/images/logo-bma.png',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
];

// ============================================================
// HOST / PATH YANG TIDAK BOLEH DICACHE
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

function shouldBypassRequest(url) {
  // ==========================================================
  // PATH INTERNAL
  // ==========================================================

  if (
    url.pathname.startsWith('/studio') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/')
  ) {
    return true;
  }

  // ==========================================================
  // HOST EKSTERNAL
  // ==========================================================

  return BYPASS_HOSTS.some(
    (host) =>
      url.hostname === host ||
      url.hostname.endsWith(`.${host}`)
  );
}

// ============================================================
// VALID RESPONSE UNTUK CACHE
// ============================================================

function isCacheableResponse(response) {
  if (!response) {
    return false;
  }

  if (!response.ok) {
    return false;
  }

  return (
    response.type === 'basic' ||
    response.type === 'cors'
  );
}

// ============================================================
// INSTALL
// ============================================================

self.addEventListener(
  'install',
  (event) => {
    console.log(
      '[BMA Service Worker] Installing:',
      CACHE_NAME
    );

    event.waitUntil(
      (async () => {
        const cache =
          await caches.open(
            CACHE_NAME
          );

        // ====================================================
        // Cache aset satu per satu.
        //
        // Jika satu file gagal, install SW tidak ikut gagal total.
        // ====================================================

        await Promise.allSettled(
          PRECACHE_ASSETS.map(
            async (asset) => {
              try {
                await cache.add(
                  asset
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
            }
          )
        );
      })()
    );

    self.skipWaiting();
  }
);

// ============================================================
// ACTIVATE
//
// Hapus:
// - cache BDB lama
// - cache Islami lama
// - cache BMA versi lama
// ============================================================

self.addEventListener(
  'activate',
  (event) => {
    console.log(
      '[BMA Service Worker] Activating:',
      CACHE_NAME
    );

    event.waitUntil(
      (async () => {
        const cacheNames =
          await caches.keys();

        await Promise.all(
          cacheNames.map(
            async (
              cacheName
            ) => {
              const isOldBmaCache =
                cacheName.startsWith(
                  CACHE_PREFIX
                ) &&
                cacheName !==
                  CACHE_NAME;

              const isOldBdbCache =
                cacheName
                  .toLowerCase()
                  .includes(
                    'bdb'
                  );

              const isOldIslamiCache =
                cacheName
                  .toLowerCase()
                  .includes(
                    'islami'
                  );

              if (
                isOldBmaCache ||
                isOldBdbCache ||
                isOldIslamiCache
              ) {
                console.log(
                  '[BMA Service Worker] Menghapus cache lama:',
                  cacheName
                );

                await caches.delete(
                  cacheName
                );
              }
            }
          )
        );

        await self.clients.claim();
      })()
    );
  }
);

// ============================================================
// NETWORK FIRST
//
// Digunakan untuk:
// - navigasi
// - halaman campaign
// - berita
// - halaman dinamis
//
// Tujuan:
// data baru BMA tidak tertahan cache lama.
// ============================================================

async function networkFirst(
  request
) {
  const cache =
    await caches.open(
      CACHE_NAME
    );

  try {
    const networkResponse =
      await fetch(
        request
      );

    if (
      isCacheableResponse(
        networkResponse
      )
    ) {
      await cache.put(
        request,
        networkResponse.clone()
      );
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse =
      await cache.match(
        request
      );

    if (
      cachedResponse
    ) {
      return cachedResponse;
    }

    // ========================================================
    // OFFLINE FALLBACK UNTUK NAVIGATION
    // ========================================================

    if (
      request.mode ===
      'navigate'
    ) {
      const offlinePage =
        await cache.match(
          OFFLINE_URL
        );

      if (
        offlinePage
      ) {
        return offlinePage;
      }

      const homePage =
        await cache.match(
          '/'
        );

      if (
        homePage
      ) {
        return homePage;
      }
    }

    // ========================================================
    // Response fallback valid
    // ========================================================

    return new Response(
      'Anda sedang offline.',
      {
        status: 503,

        statusText:
          'Service Unavailable',

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
//
// Untuk:
// - gambar lokal
// - icon
// - font
// - css/js statis
// ============================================================

async function cacheFirst(
  request
) {
  const cache =
    await caches.open(
      CACHE_NAME
    );

  const cachedResponse =
    await cache.match(
      request
    );

  if (
    cachedResponse
  ) {
    return cachedResponse;
  }

  try {
    const networkResponse =
      await fetch(
        request
      );

    if (
      isCacheableResponse(
        networkResponse
      )
    ) {
      await cache.put(
        request,
        networkResponse.clone()
      );
    }

    return networkResponse;
  } catch (error) {
    return new Response(
      '',
      {
        status: 504,
        statusText:
          'Gateway Timeout',
      }
    );
  }
}

// ============================================================
// FETCH
// ============================================================

self.addEventListener(
  'fetch',
  (event) => {
    const request =
      event.request;

    // ========================================================
    // HANYA GET
    // ========================================================

    if (
      request.method !==
      'GET'
    ) {
      return;
    }

    const url =
      new URL(
        request.url
      );

    // ========================================================
    // HANYA HTTP / HTTPS
    // ========================================================

    if (
      url.protocol !==
        'http:' &&
      url.protocol !==
        'https:'
    ) {
      return;
    }

    // ========================================================
    // JANGAN CACHE DATA DINAMIS / EKSTERNAL
    // ========================================================

    if (
      shouldBypassRequest(
        url
      )
    ) {
      return;
    }

    // ========================================================
    // REQUEST DARI DOMAIN LAIN
    //
    // Jangan intercept resource eksternal yang tidak perlu.
    // ========================================================

    if (
      url.origin !==
      self.location.origin
    ) {
      return;
    }

    // ========================================================
    // NAVIGATION = NETWORK FIRST
    // ========================================================

    if (
      request.mode ===
        'navigate' ||
      request.destination ===
        'document'
    ) {
      event.respondWith(
        networkFirst(
          request
        )
      );

      return;
    }

    // ========================================================
    // ASET STATIS = CACHE FIRST
    // ========================================================

    const staticDestinations = [
      'image',
      'style',
      'script',
      'font',
      'manifest',
    ];

    if (
      staticDestinations.includes(
        request.destination
      )
    ) {
      event.respondWith(
        cacheFirst(
          request
        )
      );

      return;
    }

    // ========================================================
    // REQUEST INTERNAL LAINNYA
    // NETWORK FIRST
    // ========================================================

    event.respondWith(
      networkFirst(
        request
      )
    );
  }
);

// ============================================================
// MESSAGE
//
// Bisa digunakan dari client untuk langsung aktivasi SW baru.
// ============================================================

self.addEventListener(
  'message',
  (event) => {
    if (
      event.data?.type ===
      'SKIP_WAITING'
    ) {
      self.skipWaiting();
    }

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
              (
                cacheName
              ) => {
                if (
                  cacheName.startsWith(
                    CACHE_PREFIX
                  )
                ) {
                  return caches.delete(
                    cacheName
                  );
                }

                return Promise.resolve(
                  false
                );
              }
            )
          );
        })()
      );
    }
  }
);