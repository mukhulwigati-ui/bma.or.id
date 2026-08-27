// components/BottomNav.tsx

'use client';

import React, {
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import {
  usePathname,
} from 'next/navigation';

import {
  HeartHandshake,
  Home,
  Newspaper,
  User,
  X,
} from 'lucide-react';

import {
  createBrowserClient,
} from '@supabase/ssr';

interface NavItem {
  label: string;
  href: string;
  icon:
    React.ComponentType<{
      className?: string;
      strokeWidth?: number;
    }>;
  badge?: string;
}

export default function BottomNav() {
  const pathname =
    usePathname();

  const [
    showLoginModal,
    setShowLoginModal,
  ] =
    useState(false);

  const supabase =
    useMemo(
      () =>
        createBrowserClient(
          process.env
            .NEXT_PUBLIC_SUPABASE_URL!,
          process.env
            .NEXT_PUBLIC_SUPABASE_ANON_KEY!
        ),
      []
    );

  // Sembunyikan di detail campaign & studio
  if (
    !pathname ||
    pathname.startsWith(
      '/campaign/'
    ) ||
    pathname.startsWith(
      '/studio'
    )
  ) {
    return null;
  }

  const navItems:
    NavItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
    },
    {
      label: 'Donasi Saya',
      href: '/donasi-saya',
      icon: HeartHandshake,
    },
    {
      label: 'Berita',
      href: '/news',
      icon: Newspaper,
      badge: '21.8k',
    },
    {
      label: 'Akun',
      href: '/akun',
      icon: User,
    },
  ];

  const handleNavClick =
    async (
      e:
        React.MouseEvent<HTMLAnchorElement>,
      href:
        string
    ) => {
      if (
        href !==
        '/akun'
      ) {
        return;
      }

      try {
        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        if (
          user
        ) {
          return;
        }

        e.preventDefault();

        setShowLoginModal(
          true
        );
      } catch (
        error
      ) {
        console.error(
          'BottomNav auth check error:',
          error
        );

        e.preventDefault();

        setShowLoginModal(
          true
        );
      }
    };

  return (
    <>
      {/* ======================================================
          BOTTOM NAV
      ====================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          bottom-0
          left-0
          right-0
          z-40
          flex
          justify-center
        "
      >
        <nav
          aria-label="Navigasi bawah"
          className="
            pointer-events-auto
            flex
            w-[calc(100%-0.5rem)]
            max-w-[29rem]
            items-center
            justify-around
            border-x
            border-t
            border-[#d8dedb]
            bg-white
            px-1
            py-1.5
            shadow-[0_-4px_14px_rgba(0,0,0,0.07)]
          "
        >
          {navItems.map(
            (
              item,
              index
            ) => {
              const Icon =
                item.icon;

              const isActive =
                pathname ===
                item.href;

              return (
                <Link
                  key={
                    `${item.href}-${index}`
                  }
                  href={
                    item.href
                  }
                  onClick={(
                    e
                  ) =>
                    handleNavClick(
                      e,
                      item.href
                    )
                  }
                  className={`
                    flex
                    min-w-0
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    px-1
                    py-1
                    transition-colors
                    ${
                      isActive
                        ? 'text-[#073f2e]'
                        : 'text-slate-500 hover:text-[#073f2e]'
                    }
                  `}
                >
                  <div className="relative">

                    <Icon
                      className="h-5 w-5"
                      strokeWidth={
                        isActive
                          ? 2.3
                          : 1.8
                      }
                    />

                    {item.badge && (
                      <span
                        className="
                          absolute
                          -right-4
                          -top-2
                          border
                          border-white
                          bg-rose-500
                          px-1.5
                          py-0.5
                          text-[9px]
                          font-bold
                          leading-none
                          text-white
                        "
                      >
                        {
                          item.badge
                        }
                      </span>
                    )}

                  </div>

                  <span
                    className={`
                      mt-0.5
                      truncate
                      text-[11px]
                      tracking-tight
                      ${
                        isActive
                          ? 'font-semibold'
                          : 'font-normal'
                      }
                    `}
                  >
                    {
                      item.label
                    }
                  </span>

                </Link>
              );
            }
          )}
        </nav>
      </div>

      {/* ======================================================
          LOGIN MODAL
      ====================================================== */}

      {showLoginModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-[2px]
          "
        >

          <button
            type="button"
            aria-label="Tutup modal"
            onClick={() =>
              setShowLoginModal(
                false
              )
            }
            className="
              absolute
              inset-0
              cursor-default
            "
          />

          <section
            className="
              relative
              z-10
              w-[calc(100%-1rem)]
              max-w-md
              border
              border-[#d4d8d5]
              bg-white
              p-6
              text-center
              shadow-[0_24px_60px_rgba(0,0,0,0.24)]
            "
          >

            <button
              type="button"
              onClick={() =>
                setShowLoginModal(
                  false
                )
              }
              className="
                absolute
                right-3
                top-3
                flex
                h-9
                w-9
                items-center
                justify-center
                border
                border-[#dedede]
                bg-[#f5f5f5]
                text-slate-400
                transition
                hover:bg-[#ececec]
                hover:text-slate-700
              "
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center">

              <img
                src="/images/empty.svg"
                alt="Silakan masuk"
                className="
                  mb-5
                  h-40
                  w-40
                  object-contain
                  sm:h-44
                  sm:w-44
                "
              />

              <h2
                className="
                  text-[18px]
                  font-bold
                  tracking-tight
                  text-[#333333]
                "
              >
                Silakan Masuk
              </h2>

              <p
                className="
                  mt-2
                  max-w-[390px]
                  px-2
                  text-[13px]
                  leading-[1.7]
                  text-slate-600
                "
              >
                Anda belum masuk ke akun BMA.
                Silakan login terlebih dahulu
                untuk melihat profil, riwayat
                aktivitas, dan layanan akun Anda.
              </p>

              <Link
                href="/login"
                onClick={() =>
                  setShowLoginModal(
                    false
                  )
                }
                className="
                  mt-6
                  flex
                  w-full
                  items-center
                  justify-center
                  border
                  border-[#c7a700]
                  bg-[#ffd600]
                  py-3.5
                  text-[12px]
                  font-extrabold
                  uppercase
                  tracking-[0.14em]
                  text-[#292929]
                  shadow-[0_5px_14px_rgba(140,115,0,0.14)]
                  transition
                  hover:bg-[#f1ca00]
                "
              >
                Masuk ke Akun
              </Link>

            </div>

          </section>

        </div>
      )}
    </>
  );
}