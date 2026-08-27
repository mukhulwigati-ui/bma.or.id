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

// ============================================================
// TYPES
// ============================================================

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

// ============================================================
// COMPONENT
// ============================================================

export default function BottomNav() {
  const pathname =
    usePathname();

  const [
    showLoginModal,
    setShowLoginModal,
  ] =
    useState(false);

  // ==========================================================
  // SUPABASE
  // ==========================================================

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

  // ==========================================================
  // HIDE NAVIGATION
  // ==========================================================

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

  // ==========================================================
  // NAV ITEMS
  // ==========================================================

  const navItems:
    NavItem[] = [
    {
      label:
        'Home',
      href:
        '/',
      icon:
        Home,
    },
    {
      label:
        'Donasi Saya',
      href:
        '/donasi-saya',
      icon:
        HeartHandshake,
    },
    {
      label:
        'Berita',
      href:
        '/news',
      icon:
        Newspaper,
      badge:
        '21.8k',
    },
    {
      label:
        'Akun',
      href:
        '/akun',
      icon:
        User,
    },
  ];

  // ==========================================================
  // CHECK AUTH
  // ==========================================================

  const handleNavClick =
    async (
      e:
        React.MouseEvent<HTMLAnchorElement>,
      href:
        string
    ) => {
      // Hanya menu Akun yang butuh pengecekan login
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

        // Sudah login:
        // biarkan Link navigasi normal.
        if (
          user
        ) {
          return;
        }

        // Belum login:
        // tahan navigasi dan tampilkan modal.
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

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ======================================================
          FIXED BOTTOM NAV
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
            w-[calc(100%-0.75rem)]
            max-w-[35rem]
            items-center
            justify-around
            border-x
            border-t
            border-[#d8dedb]
            bg-white
            px-1
            py-2
            shadow-[0_-5px_18px_rgba(0,0,0,0.08)]
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
                    py-1.5
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
                      className="h-[21px] w-[21px]"
                      strokeWidth={
                        isActive
                          ? 2.4
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
                      mt-1
                      truncate
                      text-[12px]
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

          {/* BACKDROP CLICK */}
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

          {/* MODAL */}
          <section
            className="
              relative
              z-10
              w-[calc(100%-0.75rem)]
              max-w-[35rem]
              border
              border-[#d4d8d5]
              bg-white
              p-6
              text-center
              shadow-[0_24px_60px_rgba(0,0,0,0.24)]
            "
          >

            {/* CLOSE */}
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

            {/* IMAGE */}
            <div className="flex flex-col items-center">

              <img
                src="/images/empty.svg"
                alt="Silakan masuk"
                className="
                  mb-5
                  h-44
                  w-44
                  object-contain
                  sm:h-48
                  sm:w-48
                "
              />

              {/* TITLE */}
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

              {/* DESCRIPTION */}
              <p
                className="
                  mt-2
                  max-w-[420px]
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

              {/* LOGIN BUTTON */}
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