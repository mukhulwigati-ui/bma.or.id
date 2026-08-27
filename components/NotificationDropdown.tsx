// components/NotificationDropdown.tsx
'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Bell,
  CheckCheck,
  Info,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  const [isMounted, setIsMounted] =
    useState(false);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  // ============================================================
  // SUPABASE CLIENT
  // Dibuat sekali agar tidak berubah pada setiap render
  // ============================================================
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  // ============================================================
  // CEK SESSION
  // ============================================================
  useEffect(() => {
    setIsMounted(true);

    const checkUserSession =
      async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          setUser(user);
        } catch (error) {
          console.error(
            'Gagal memeriksa session:',
            error
          );

          setUser(null);
        }
      };

    checkUserSession();
  }, [supabase]);

  // ============================================================
  // CLOSE DROPDOWN JIKA KLIK DI LUAR
  // ============================================================
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // CLOSE DENGAN ESC
  // ============================================================
  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, []);

  // ============================================================
  // DATA NOTIFIKASI
  // ============================================================
  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map(
        (notification) => ({
          ...notification,
          read: true,
        })
      )
    );
  };

  // ============================================================
  // HYDRATION SAFE FALLBACK
  // ICON DIBUAT HITAM AGAR TERLIHAT DI HEADER PUTIH
  // ============================================================
  if (!isMounted) {
    return (
      <div className="relative inline-flex">

        <button
          type="button"
          aria-label="Notifikasi"
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            text-black
            transition
            hover:bg-stone-100
            focus:outline-none
            focus:ring-2
            focus:ring-stone-200
          "
        >
          <Bell
            className="h-5 w-5 text-black stroke-black"
            strokeWidth={2.2}
          />
        </button>

      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="relative inline-flex"
    >

      {/* ========================================================
          NOTIFICATION BUTTON
      ======================================================== */}
      <button
        type="button"
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
        aria-label="Notifikasi"
        aria-expanded={isOpen}
        className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          text-black
          transition
          hover:bg-stone-100
          focus:outline-none
          focus:ring-2
          focus:ring-stone-200
        "
      >
        <Bell
          className="h-5 w-5 text-black stroke-black"
          strokeWidth={2.2}
        />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              right-1
              top-1
              flex
              min-h-[15px]
              min-w-[15px]
              items-center
              justify-center
              rounded-full
              bg-rose-500
              px-1
              text-[7px]
              font-bold
              leading-none
              text-white
              ring-2
              ring-white
            "
          >
            {unreadCount > 9
              ? '9+'
              : unreadCount}
          </span>
        )}
      </button>

      {/* ========================================================
          DROPDOWN
      ======================================================== */}
      {isOpen && (
        <div
          className="
            absolute
            right-0
            top-full
            z-[100]
            mt-2
            w-[320px]
            max-w-[calc(100vw-24px)]
            overflow-hidden
            rounded-[24px]
            border
            border-slate-200/80
            bg-white
            text-left
            shadow-[0_24px_70px_rgba(15,23,42,0.18)]
            animate-in
            fade-in
            slide-in-from-top-2
            duration-200
          "
        >

          {/* ====================================================
              DROPDOWN HEADER
          ==================================================== */}
          <div className="border-b border-slate-100 bg-[#f8f8f6] px-4 py-3.5">

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102a43]">
                  <Bell className="h-4 w-4 text-[#d7b66a]" />
                </div>

                <div>

                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    {SITE_SHORT_NAME} Notification
                  </p>

                  <div className="mt-0.5 flex items-center gap-2">

                    <h3 className="text-[12px] font-bold text-[#102a43]">
                      Notifikasi
                    </h3>

                    {unreadCount > 0 && (
                      <span className="rounded-full bg-[#f7f2e7] px-2 py-0.5 text-[7px] font-bold text-[#98752d]">
                        {unreadCount} Baru
                      </span>
                    )}

                  </div>

                </div>

              </div>

              <div className="flex items-center gap-1">

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    title="Tandai semua dibaca"
                    className="
                      inline-flex
                      h-8
                      items-center
                      gap-1
                      rounded-lg
                      px-2
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#98752d]
                      transition
                      hover:bg-[#f7f2e7]
                    "
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Baca
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  aria-label="Tutup notifikasi"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >
                  <X className="h-4 w-4" />
                </button>

              </div>

            </div>

          </div>

          {/* ====================================================
              CONTENT
          ==================================================== */}
          <div className="max-h-[340px] overflow-y-auto">

            {/* BELUM LOGIN */}
            {!user ? (
              <div className="p-6 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f2e7]">
                  <Info className="h-5 w-5 text-[#a37c32]" />
                </div>

                <h4 className="mt-4 text-[12px] font-bold text-[#102a43]">
                  Anda Belum Masuk
                </h4>

                <p className="mt-2 text-[9px] leading-[1.7] text-slate-500">
                  Silakan masuk untuk melihat
                  notifikasi, status transaksi,
                  dan informasi akun Anda di
                  {' '}
                  {SITE_DOMAIN}.
                </p>

                <Link
                  href="/login"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="
                    mt-4
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#102a43]
                    py-3
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-white
                    transition
                    hover:bg-[#173d5d]
                  "
                >
                  Masuk Sekarang
                </Link>

              </div>
            ) : notifications.length === 0 ? (

              /* EMPTY STATE */
              <div className="px-6 py-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f2e7]">
                  <Bell className="h-5 w-5 text-[#a37c32]" />
                </div>

                <h4 className="mt-4 text-[12px] font-bold text-[#102a43]">
                  Belum Ada Notifikasi
                </h4>

                <p className="mt-2 text-[9px] leading-relaxed text-slate-400">
                  Informasi terbaru mengenai
                  transaksi dan akun Anda akan
                  muncul di sini.
                </p>

              </div>
            ) : (

              /* NOTIFICATION LIST */
              <div className="divide-y divide-slate-100">

                {notifications.map(
                  (item) => (
                    <div
                      key={item.id}
                      className={`flex gap-3 p-4 transition ${
                        !item.read
                          ? 'bg-[#f7f2e7]/35'
                          : 'bg-white hover:bg-slate-50'
                      }`}
                    >

                      <div className="pt-1">

                        <span
                          className={`block h-2 w-2 rounded-full ${
                            !item.read
                              ? 'bg-[#a37c32]'
                              : 'bg-slate-200'
                          }`}
                        />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <h4 className="text-[10px] font-bold text-[#102a43]">
                            {item.title}
                          </h4>

                          <span className="shrink-0 text-[7px] text-slate-400">
                            {item.date}
                          </span>

                        </div>

                        <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                          {item.message}
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* ====================================================
              FOOTER
          ==================================================== */}
          {user && (
            <div className="border-t border-slate-100 bg-[#f8f8f6] p-2.5">

              <Link
                href="/notifikasi"
                onClick={() =>
                  setIsOpen(false)
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  py-2
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#102a43]
                  transition
                  hover:bg-white
                "
              >
                Lihat Semua Notifikasi

                <ChevronRight className="h-3.5 w-3.5" />
              </Link>

            </div>
          )}

          {/* ====================================================
              BRAND STRIP
          ==================================================== */}
          <div className="border-t border-slate-100 px-4 py-2 text-center">

            <div className="flex items-center justify-center gap-1.5">

              <ShieldCheck className="h-3 w-3 text-[#a37c32]" />

              <span className="text-[7px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                {SITE_NAME}
              </span>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}