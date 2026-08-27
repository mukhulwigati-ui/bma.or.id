// components/BottomNav.tsx

'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  HeartHandshake,
  Home,
  Newspaper,
  User,
  X,
} from 'lucide-react';

import { createBrowserClient } from '@supabase/ssr';

// ============================================================
// TYPES
// ============================================================

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
  }>;
  badge?: string;
}

// ============================================================
// COMPONENT
// ============================================================

export default function BottomNav() {
  const pathname = usePathname();

  const [showLoginModal, setShowLoginModal] = useState(false);

  // ==========================================================
  // SUPABASE CLIENT
  // ==========================================================

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  // ==========================================================
  // HIDE NAV
  //
  // Tidak tampil di:
  // - detail campaign
  // - Sanity Studio
  // - callback auth
  // ==========================================================

  if (
    !pathname ||
    pathname.startsWith('/campaign/') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/auth/')
  ) {
    return null;
  }

  // ==========================================================
  // NAVIGATION ITEMS
  // ==========================================================

  const navItems: NavItem[] = [
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

  // ==========================================================
  // AUTH CHECK UNTUK MENU AKUN
  // ==========================================================

  const handleNavClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Menu selain Akun langsung jalan normal
    if (href !== '/akun') {
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Sudah login
      if (user) {
        return;
      }

      // Belum login
      e.preventDefault();
      setShowLoginModal(true);
    } catch (error) {
      console.error('BottomNav auth check error:', error);

      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ======================================================
          BOTTOM NAVIGATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          bottom-0
          left-0
          right-0
          z-50
          flex
          justify-center
          px-3
        "
      >
        <nav
          aria-label="Navigasi bawah"
          className="
            pointer-events-auto
            flex
            w-full
            max-w-[420px]
            items-center
            border-x
            border-t
            border-[#d6ddd9]
            bg-white
            px-1
            py-1
            shadow-[0_-4px_14px_rgba(0,0,0,0.06)]
          "
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;

            // =================================================
            // ACTIVE STATE
            // =================================================

            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  items-center
                  justify-center
                  py-1
                  transition-colors
                  duration-200

                  ${
                    isActive
                      ? 'text-[#073f2e]'
                      : 'text-[#6f8196] hover:text-[#073f2e]'
                  }
                `}
              >
                {/* =============================================
                    ICON
                ============================================== */}

                <div
                  className="
                    relative
                    flex
                    h-6
                    items-center
                    justify-center
                  "
                >
                  <Icon
                    className="
                      h-[21px]
                      w-[21px]
                    "
                    strokeWidth={isActive ? 2.4 : 1.8}
                  />

                  {/* BADGE */}
                  {item.badge && (
                    <span
                      className="
                        absolute
                        -right-[18px]
                        -top-[7px]
                        min-w-[31px]
                        border
                        border-white
                        bg-[#ff315f]
                        px-1
                        py-[2px]
                        text-center
                        text-[9px]
                        font-bold
                        leading-none
                        text-white
                      "
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* =============================================
                    LABEL
                ============================================== */}

                <span
                  className={`
                    mt-0.5
                    max-w-full
                    truncate
                    text-[11px]
                    leading-tight
                    tracking-tight

                    ${
                      isActive
                        ? 'font-semibold'
                        : 'font-normal'
                    }
                  `}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
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
          {/* ==================================================
              BACKDROP
          =================================================== */}

          <button
            type="button"
            aria-label="Tutup modal"
            onClick={() => setShowLoginModal(false)}
            className="
              absolute
              inset-0
              cursor-default
            "
          />

          {/* ==================================================
              MODAL
          =================================================== */}

          <section
            className="
              relative
              z-10
              w-full
              max-w-sm
              border
              border-[#d3d8d5]
              bg-white
              p-5
              text-center
              shadow-[0_24px_60px_rgba(0,0,0,0.24)]
            "
          >
            {/* ================================================
                CLOSE
            ================================================= */}

            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              aria-label="Tutup"
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
                border-[#dddddd]
                bg-[#f5f5f5]
                text-slate-400
                transition
                hover:bg-[#ececec]
                hover:text-slate-700
              "
            >
              <X className="h-4 w-4" />
            </button>

            {/* ================================================
                CONTENT
            ================================================= */}

            <div
              className="
                flex
                flex-col
                items-center
              "
            >
              {/* IMAGE */}

              <img
                src="/images/empty.svg"
                alt="Silakan masuk"
                className="
                  mb-4
                  h-36
                  w-36
                  object-contain
                  sm:h-40
                  sm:w-40
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
                  max-w-[340px]
                  text-[13px]
                  leading-[1.7]
                  text-slate-600
                "
              >
                Anda belum masuk ke akun BMA. Silakan login terlebih
                dahulu untuk melihat profil, riwayat donasi, dan layanan
                akun Anda.
              </p>

              {/* LOGIN BUTTON */}

              <Link
                href="/login"
                onClick={() => setShowLoginModal(false)}
                className="
                  mt-5
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
                  hover:bg-[#f0c900]
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