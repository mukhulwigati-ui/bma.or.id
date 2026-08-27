// components/Hero.tsx
'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';
import Image from 'next/image';

import {
  X,
  UserPlus,
  ShieldCheck,
  Loader2,
  ImageOff,
} from 'lucide-react';

import {
  createBrowserClient,
} from '@supabase/ssr';

// ============================================================
// IDENTITAS BMA
// ============================================================

const SITE_NAME =
  'Baitul Maal Al Muttaqin';

const SITE_DOMAIN =
  'bma.or.id';

// ============================================================
// HERO TYPE
// ============================================================

export interface HeroBanner {
  _id: string;
  title?: string;
  imageUrl: string;
  linkUrl?: string;
}

// ============================================================
// PROPS
// ============================================================

interface HeroProps {
  initialBanners?: HeroBanner[];
}

// ============================================================
// HELPER IMAGE
// Semua image cdn.sanity.io diproxy melalui domain sendiri
// ============================================================

function getProxiedImageUrl(
  imageUrl: string
) {
  if (!imageUrl) {
    return '';
  }

  // Gambar lokal jangan diproxy
  if (
    imageUrl.startsWith('/')
  ) {
    return imageUrl;
  }

  try {
    const parsed =
      new URL(imageUrl);

    if (
      parsed.hostname ===
      'cdn.sanity.io'
    ) {
      return (
        '/api/sanity-image?src=' +
        encodeURIComponent(
          imageUrl
        )
      );
    }

    return imageUrl;
  } catch {
    return imageUrl;
  }
}

// ============================================================
// HERO
// ============================================================

export default function Hero({
  initialBanners = [],
}: HeroProps) {

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    banners,
    setBanners,
  ] = useState<HeroBanner[]>(
    initialBanners
  );

  const [
    loadingBanner,
    setLoadingBanner,
  ] = useState(true);

  const [
    bannerError,
    setBannerError,
  ] = useState('');

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    isExpanded,
    setIsExpanded,
  ] = useState(false);

  const [
    showAuthModal,
    setShowAuthModal,
  ] = useState(false);

  // ==========================================================
  // SUPABASE
  // ==========================================================

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env
          .NEXT_PUBLIC_SUPABASE_URL!,
        process.env
          .NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  // ==========================================================
  // CATEGORY
  // ==========================================================

  const allCategories = [
    {
      name: 'Zakat',
      icon:
        '/images/zakat.jpg',
      href:
        '/campaign/zakat-maal',
      glowing: true,
    },

    {
      name: 'Infaq',
      icon:
        '/images/infaq.jpg',
      href:
        '/campaign/infaq-syiar-dakwah',
      glowing: false,
    },

    {
      name:
        'Sedekah Subuh',
      icon:
        '/images/sedekah-subuh.jpg',
      href:
        '/campaign/sedekah-subuh',
      glowing: false,
    },

    {
      name: 'Bencana',
      icon:
        '/images/bencana.webp',
      href:
        '/program?cat=bencana',
      glowing: false,
    },

    {
      name: 'Fidyah',
      icon:
        '/images/fidyah.jpg',
      href:
        '/campaign/bayar-fidyah-untuk-dhuafa-pelosok',
      glowing: true,
    },

    {
      name: 'Wakaf',
      icon:
        '/images/wakaf.jpg',
      href:
        '/campaign/wakaf',
      glowing: false,
    },

    {
      name: 'ORTA',
      icon:
        '/images/orta.png',
      href:
        '/campaign/jadi-orang-tua-asuh-selamatkan-masa-depan-ribuan-yatim',
      glowing: false,
    },

    {
      name:
        'Sedekah Jumat',
      icon:
        '/images/sedekah-jumat.png',
      href:
        '/program?cat=sedekah-jumat',
      glowing: false,
    },

    {
      name: 'Kifarat',
      icon:
        '/images/kifarat.jpeg',
      href:
        '/program?cat=kifarat',
      glowing: false,
    },

    {
      name:
        'Donasi Dari Bunga Bank',
      icon:
        '/images/bunga.jpg',
      href:
        '/program?cat=bunga-bank',
      glowing: false,
    },

    {
      name:
        'Gabung Member',
      icon:
        '/images/fundraiser.png',
      href: '#',
      isAuthBtn: true,
      glowing: false,
    },
  ];

  const displayedCategories =
    isExpanded
      ? allCategories
      : allCategories.slice(
          0,
          7
        );

  // ==========================================================
  // FETCH HERO VIA INTERNAL API
  //
  // Sengaja SELALU fetch.
  // Jadi meskipun app/page.tsx membawa data lama,
  // data terbaru Sanity akan menimpanya.
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    async function fetchHeroBanners() {
      try {
        setLoadingBanner(
          true
        );

        setBannerError('');

        const response =
          await fetch(
            '/api/hero-banners',
            {
              method: 'GET',

              cache:
                'no-store',

              headers: {
                Accept:
                  'application/json',
              },
            }
          );

        const json =
          await response.json();

        if (!response.ok) {
          throw new Error(
            json?.error ||
              'Gagal mengambil banner.'
          );
        }

        if (cancelled) {
          return;
        }

        const result =
          Array.isArray(
            json?.data
          )
            ? json.data
            : [];

        const valid =
          result.filter(
            (
              item: HeroBanner
            ) =>
              item &&
              item._id &&
              typeof item.imageUrl ===
                'string' &&
              item.imageUrl.trim() !==
                ''
          );

        console.log(
          '✅ BMA HERO SANITY:',
          {
            projectId:
              json?.projectId,
            dataset:
              json?.dataset,
            count:
              valid.length,
            data: valid,
          }
        );

        setBanners(valid);

        setCurrentIndex(0);

        if (
          valid.length === 0
        ) {
          setBannerError(
            'Belum ada banner aktif dari Sanity.'
          );
        }
      } catch (error: any) {
        console.error(
          '❌ Hero BMA error:',
          error
        );

        if (!cancelled) {
          // Jika initialBanners
          // memang ada, tetap gunakan.
          if (
            initialBanners.length >
            0
          ) {
            setBanners(
              initialBanners
            );
          } else {
            setBanners([]);
          }

          setBannerError(
            error?.message ||
              'Gagal terhubung ke Sanity.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingBanner(
            false
          );
        }
      }
    }

    fetchHeroBanners();

    return () => {
      cancelled = true;
    };
  }, [initialBanners]);

  // ==========================================================
  // RESET INDEX
  // ==========================================================

  useEffect(() => {
    if (
      banners.length === 0
    ) {
      setCurrentIndex(0);
      return;
    }

    if (
      currentIndex >=
      banners.length
    ) {
      setCurrentIndex(0);
    }
  }, [
    banners.length,
    currentIndex,
  ]);

  // ==========================================================
  // AUTO SLIDER
  // ==========================================================

  useEffect(() => {
    if (
      banners.length <= 1
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setCurrentIndex(
            (previous) =>
              (previous + 1) %
              banners.length
          );
        },
        4000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [banners.length]);

  // ==========================================================
  // GOOGLE LOGIN
  // ==========================================================

  const handleGoogleLogin =
    async () => {
      try {
        const { error } =
          await supabase.auth.signInWithOAuth(
            {
              provider:
                'google',

              options: {
                redirectTo:
                  `${window.location.origin}/auth/callback`,
              },
            }
          );

        if (error) {
          throw error;
        }
      } catch (error: any) {
        alert(
          'Gagal masuk dengan Google: ' +
            error.message
        );
      }
    };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        w-full
        max-w-md
        mx-auto
        bg-white
        border
        border-gray-200
        shadow-sm
        overflow-hidden
        p-4
        space-y-4
      "
    >

      {/* ======================================================
          HERO SLIDER
      ====================================================== */}

      <div>

        <div
          className="
            relative
            w-full
            aspect-[16/9]
            overflow-hidden
            border
            border-gray-200
            bg-[#e5e5e5]
          "
        >

          {/* LOADING */}
          {loadingBanner && (
            <div
              className="
                absolute
                inset-0
                z-30
                flex
                flex-col
                items-center
                justify-center
                bg-[#e5e5e5]
              "
            >

              <Loader2
                className="
                  h-6
                  w-6
                  animate-spin
                  text-[#555555]
                "
              />

              <span
                className="
                  mt-3
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-[#666666]
                "
              >
                Memuat banner BMA
              </span>

            </div>
          )}

          {/* EMPTY / ERROR */}
          {!loadingBanner &&
            banners.length ===
              0 && (
              <div
                className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                  bg-[#e5e5e5]
                  px-6
                  text-center
                "
              >

                <ImageOff
                  className="
                    h-7
                    w-7
                    text-[#777777]
                  "
                />

                <p
                  className="
                    mt-3
                    text-[11px]
                    font-bold
                    text-[#444444]
                  "
                >
                  Banner belum tersedia
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    leading-relaxed
                    text-[#777777]
                  "
                >
                  {bannerError ||
                    'Tidak ada banner aktif.'}
                </p>

              </div>
            )}

          {/* BANNER */}
          {!loadingBanner &&
            banners.map(
              (
                banner,
                index
              ) => {
                const active =
                  index ===
                  currentIndex;

                const src =
                  getProxiedImageUrl(
                    banner.imageUrl
                  );

                return (
                  <div
                    key={
                      banner._id
                    }
                    className={`
                      absolute
                      inset-0
                      transition-opacity
                      duration-700
                      ${
                        active
                          ? 'z-10 opacity-100'
                          : 'z-0 opacity-0 pointer-events-none'
                      }
                    `}
                  >

                    <Link
                      href={
                        banner.linkUrl ||
                        '#'
                      }
                      className="
                        relative
                        block
                        h-full
                        w-full
                      "
                    >

                      <Image
                        src={src}
                        alt={
                          banner.title ||
                          'Banner BMA'
                        }
                        fill
                        sizes="(max-width: 448px) 100vw, 448px"
                        className="
                          object-cover
                          object-center
                        "
                        priority={
                          index === 0
                        }
                        unoptimized
                      />

                    </Link>

                  </div>
                );
              }
            )}

        </div>

        {/* DOT SLIDER */}
        {!loadingBanner &&
          banners.length > 1 && (
            <div
              className="
                mt-3
                flex
                items-center
                justify-center
                gap-1.5
              "
            >

              {banners.map(
                (
                  banner,
                  index
                ) => (
                  <button
                    key={
                      banner._id
                    }
                    type="button"
                    onClick={() =>
                      setCurrentIndex(
                        index
                      )
                    }
                    aria-label={`Banner ${
                      index + 1
                    }`}
                    className={`
                      h-2
                      transition-all
                      duration-300
                      ${
                        index ===
                        currentIndex
                          ? 'w-8 bg-[#555555]'
                          : 'w-2 bg-[#cccccc] hover:bg-[#999999]'
                      }
                    `}
                  />
                )
              )}

            </div>
          )}

      </div>

      {/* ======================================================
          CATEGORY
      ====================================================== */}

      <div className="pt-2 pb-1">

        <h3
          className="
            mb-4
            text-sm
            font-extrabold
            tracking-tight
            text-[#333333]
            sm:text-base
          "
        >
          Raih Keberkahan di Hari Ini!
        </h3>

        <div
          className="
            grid
            grid-cols-4
            gap-x-2
            gap-y-4
            text-center
          "
        >

          {displayedCategories.map(
            (cat, index) => {

              if (
                cat.isAuthBtn
              ) {
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setShowAuthModal(
                        true
                      )
                    }
                    className="
                      group
                      flex
                      cursor-pointer
                      flex-col
                      items-center
                      focus:outline-none
                    "
                  >

                    <div
                      className="
                        relative
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        border
                        border-gray-200
                        bg-[#f3f3f3]
                        shadow-sm
                        transition-transform
                        group-hover:scale-105
                        group-active:scale-95
                        sm:h-16
                        sm:w-16
                      "
                    >

                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        width={64}
                        height={64}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />

                    </div>

                    <span
                      className="
                        mt-2
                        text-[11px]
                        font-bold
                        leading-tight
                        tracking-tight
                        text-[#555555]
                        group-hover:text-[#333333]
                        sm:text-xs
                      "
                    >
                      {cat.name}
                    </span>

                  </button>
                );
              }

              return (
                <Link
                  key={index}
                  href={cat.href}
                  className="
                    group
                    flex
                    flex-col
                    items-center
                  "
                >

                  <div
                    className="
                      relative
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-full
                      border
                      border-gray-200
                      bg-[#f3f3f3]
                      shadow-sm
                      transition-transform
                      group-hover:scale-105
                      group-active:scale-95
                      sm:h-16
                      sm:w-16
                    "
                  >

                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      width={64}
                      height={64}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />

                  </div>

                  <span
                    className="
                      mt-2
                      text-[11px]
                      font-bold
                      leading-tight
                      tracking-tight
                      text-[#555555]
                      group-hover:text-[#333333]
                      sm:text-xs
                    "
                  >
                    {cat.name}
                  </span>

                </Link>
              );
            }
          )}

          {/* LAINNYA */}
          {!isExpanded && (
            <button
              type="button"
              onClick={() =>
                setIsExpanded(
                  true
                )
              }
              className="
                group
                flex
                cursor-pointer
                flex-col
                items-center
                focus:outline-none
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  bg-[#f3f3f3]
                  shadow-sm
                  transition-transform
                  group-hover:scale-105
                  sm:h-16
                  sm:w-16
                "
              >

                <svg
                  className="
                    h-6
                    w-6
                    text-[#555555]
                  "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={
                      2.5
                    }
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>

              </div>

              <span
                className="
                  mt-2
                  text-[11px]
                  font-bold
                  text-[#555555]
                  sm:text-xs
                "
              >
                Lainnya
              </span>

            </button>
          )}

          {/* TUTUP */}
          {isExpanded && (
            <button
              type="button"
              onClick={() =>
                setIsExpanded(
                  false
                )
              }
              className="
                group
                flex
                cursor-pointer
                flex-col
                items-center
                focus:outline-none
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  bg-[#f3f3f3]
                  shadow-sm
                  sm:h-16
                  sm:w-16
                "
              >

                <X
                  className="
                    h-6
                    w-6
                    text-[#555555]
                  "
                />

              </div>

              <span
                className="
                  mt-2
                  text-[11px]
                  font-bold
                  text-[#555555]
                  sm:text-xs
                "
              >
                Tutup
              </span>

            </button>
          )}

        </div>

      </div>

      {/* ======================================================
          MEMBER MODAL
      ====================================================== */}

      {showAuthModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/55
            p-4
            backdrop-blur-xs
          "
        >

          <div
            className="
              relative
              w-full
              max-w-sm
              space-y-5
              border
              border-gray-200
              bg-white
              p-6
              text-left
              shadow-2xl
            "
          >

            <button
              type="button"
              onClick={() =>
                setShowAuthModal(
                  false
                )
              }
              aria-label="Tutup"
              className="
                absolute
                right-3.5
                top-3.5
                cursor-pointer
                bg-[#eeeeee]
                p-1.5
                text-gray-500
                transition
                hover:bg-[#dddddd]
                hover:text-gray-700
              "
            >

              <X className="h-4 w-4" />

            </button>

            <div
              className="
                space-y-2
                pt-1
                text-center
              "
            >

              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  border
                  border-gray-200
                  bg-[#eeeeee]
                  text-[#444444]
                "
              >

                <UserPlus className="h-6 w-6" />

              </div>

              <h4
                className="
                  text-base
                  font-extrabold
                  tracking-tight
                  text-[#333333]
                  sm:text-lg
                "
              >
                Gabung Member BMA
              </h4>

              <p
                className="
                  text-xs
                  leading-relaxed
                  text-[#666666]
                "
              >
                Nikmati kemudahan berdonasi,
                catat riwayat amal, dan pantau
                program kebaikan melalui akun{' '}
                {SITE_DOMAIN}.
              </p>

            </div>

            <div className="space-y-3 pt-2">

              <button
                type="button"
                onClick={
                  handleGoogleLogin
                }
                className="
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  justify-center
                  gap-3
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-[#444444]
                  shadow-xs
                  transition
                  hover:bg-[#f5f5f5]
                  sm:text-sm
                "
              >

                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.3 7.28 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.12 0 9.87 0 12s.43 3.88 1.19 5.42l4.09-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.28 0 3.17 2.7 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>

                <span>
                  Masuk / Daftar dengan Google
                </span>

              </button>

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  pt-1
                  text-[10px]
                  text-gray-400
                "
              >

                <ShieldCheck
                  className="
                    h-3.5
                    w-3.5
                    text-[#555555]
                  "
                />

                <span>
                  Autentikasi aman & terverifikasi otomatis
                </span>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}