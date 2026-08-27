// app/notifikasi/page.tsx
'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Info,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export default function NotifikasiPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const router = useRouter();

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  // ============================================================
  // CEK USER
  // ============================================================
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);
      } catch (error) {
        console.error(
          'Gagal memeriksa user:',
          error
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [supabase]);

  // ============================================================
  // MARK ALL READ
  // ============================================================
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4">

        <div className="flex flex-col items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-[#102a43] flex items-center justify-center shadow-lg">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>

          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Memuat notifikasi {SITE_SHORT_NAME}
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // BELUM LOGIN
  // ============================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] px-4 py-6 flex items-center justify-center">

        <div className="w-full max-w-md space-y-4">

          {/* PREMIUM CARD */}
          <section className="relative overflow-hidden rounded-[30px] bg-[#102a43] shadow-[0_20px_55px_rgba(16,42,67,0.18)]">

            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

            <div className="absolute right-4 bottom-[-80px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

            <div className="relative z-10 p-6 text-center">

              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto shadow-lg">
                <Info className="w-6 h-6 text-[#d7b66a]" />
              </div>

              <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                {SITE_SHORT_NAME} Member Area
              </p>

              <h1 className="mt-1.5 text-[18px] font-bold text-white">
                Akses Terbatas
              </h1>

              <p className="mt-3 text-[10px] leading-relaxed text-slate-300">
                Silakan masuk terlebih dahulu untuk melihat
                notifikasi, informasi transaksi, dan aktivitas
                akun Anda di {SITE_DOMAIN}.
              </p>

              <div className="mt-5 space-y-2.5">

                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d7b66a] hover:bg-[#c8a658] text-[#102a43] font-bold text-[9px] uppercase tracking-[0.16em] py-3.5 transition"
                >
                  Masuk Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/"
                  className="w-full inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/8 hover:bg-white/15 text-white font-bold text-[9px] uppercase tracking-[0.16em] py-3.5 transition"
                >
                  Kembali ke Beranda
                </Link>

              </div>

            </div>

            <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#e0c37e] to-[#a37c32]" />

          </section>

          <div className="text-center">

            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              {SITE_NAME}
            </p>

            <p className="mt-1 text-[7px] text-slate-300">
              {SITE_DOMAIN} • {SITE_LOCATION}
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // USER LOGIN
  // ============================================================
  return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 pt-5 pb-28">

      <div className="w-full max-w-md mx-auto space-y-4">

        {/* =====================================================
            PREMIUM HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[30px] bg-[#102a43] shadow-[0_20px_55px_rgba(16,42,67,0.18)]">

          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

          <div className="absolute right-4 bottom-[-80px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

          <div className="relative z-10 p-5">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3 min-w-0">

                <button
                  type="button"
                  onClick={() =>
                    router.back()
                  }
                  aria-label="Kembali"
                  className="w-10 h-10 shrink-0 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center hover:bg-white/15 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>

                <div className="min-w-0">

                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Notification Center
                  </p>

                  <h1 className="mt-1 text-[17px] font-bold text-white">
                    Pusat Notifikasi
                  </h1>

                </div>

              </div>

              <div className="relative w-10 h-10 shrink-0 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center">

                <Bell className="w-4 h-4 text-[#d7b66a]" />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 flex items-center justify-center text-[7px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}

              </div>

            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-slate-300">
              Pantau pemberitahuan penting seputar transaksi,
              akun, program, dan layanan
              {' '}
              {SITE_NAME}.
            </p>

            <div className="mt-4 flex items-center gap-1.5">

              <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#e7d5a4]">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </span>

            </div>

          </div>

          <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#e0c37e] to-[#a37c32]" />

        </section>

        {/* =====================================================
            STATUS CARD
        ====================================================== */}
        <section className="rounded-[24px] bg-white border border-slate-200/70 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Pemberitahuan
                </p>

                <h2 className="mt-0.5 text-[12px] font-bold text-[#102a43]">
                  {unreadCount > 0
                    ? `${unreadCount} Belum Dibaca`
                    : 'Semua Sudah Dibaca'}
                </h2>

              </div>

            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#f7f2e7] hover:bg-[#eee4cf] px-3 py-2 text-[8px] font-bold uppercase tracking-wider text-[#98752d] transition cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Baca Semua
              </button>
            )}

          </div>

        </section>

        {/* =====================================================
            NOTIFICATION LIST
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="px-5 py-4 border-b border-slate-100">

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Aktivitas Terbaru
            </p>

            <h2 className="mt-1 text-[13px] font-bold text-[#102a43]">
              Riwayat Notifikasi
            </h2>

          </div>

          {notifications.length === 0 ? (
            <div className="px-6 py-12 text-center">

              <div className="w-14 h-14 rounded-2xl bg-[#f7f2e7] flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6 text-[#a37c32]" />
              </div>

              <h3 className="mt-5 text-[13px] font-bold text-[#102a43]">
                Belum Ada Notifikasi
              </h3>

              <p className="mt-2 text-[9px] leading-relaxed text-slate-400">
                Saat ini belum ada pemberitahuan baru.
                Informasi penting mengenai transaksi dan
                akun Anda akan tampil di halaman ini.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {notifications.map(
                (item) => {

                  const isSuccess =
                    item.type === 'success';

                  const isWarning =
                    item.type === 'warning';

                  return (
                    <article
                      key={item.id}
                      className={`p-4 flex gap-3.5 transition-colors ${
                        !item.read
                          ? 'bg-[#f7f2e7]/35'
                          : 'bg-white'
                      }`}
                    >

                      <div className="pt-0.5">

                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSuccess
                              ? 'bg-emerald-50 text-emerald-600'
                              : isWarning
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-[#f7f2e7] text-[#a37c32]'
                          }`}
                        >
                          {isSuccess ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : isWarning ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <h2 className="text-[11px] font-bold text-[#102a43]">
                            {item.title}
                          </h2>

                          <span className="shrink-0 text-[8px] font-medium text-slate-400">
                            {item.date}
                          </span>

                        </div>

                        <p className="mt-1.5 text-[9px] leading-relaxed text-slate-500">
                          {item.message}
                        </p>

                        {!item.read && (
                          <div className="mt-2 inline-flex items-center gap-1.5">

                            <span className="w-1.5 h-1.5 rounded-full bg-[#a37c32]" />

                            <span className="text-[7px] font-bold uppercase tracking-wider text-[#98752d]">
                              Belum Dibaca
                            </span>

                          </div>
                        )}

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* =====================================================
            SECURITY INFO
        ====================================================== */}
        <section className="rounded-[22px] border border-[#eadfca] bg-[#f7f2e7]/60 p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <div>

              <p className="text-[9px] font-bold text-[#102a43]">
                Informasi Akun
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                Informasi penting terkait aktivitas akun dan
                transaksi Anda ditampilkan melalui layanan
                digital resmi {SITE_DOMAIN}.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            BACK HOME
        ====================================================== */}
        <Link
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[9px] uppercase tracking-[0.16em] py-3.5 transition shadow-sm"
        >
          Kembali ke Beranda
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* =====================================================
            BRAND FOOTER
        ====================================================== */}
        <div className="pt-2 pb-3 text-center">

          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-300">
            {SITE_NAME}
          </p>

          <p className="mt-1 text-[7px] text-slate-300">
            {SITE_DOMAIN} • {SITE_LOCATION}
          </p>

        </div>

      </div>
    </div>
  );
}