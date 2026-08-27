// app/fundraiser/stats/page.tsx
'use client';

import React, {
  useState,
  useEffect,
  Suspense,
} from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Smartphone,
  Check,
  Copy,
  ArrowRight,
  TrendingUp,
  Users,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Wallet,
  Link2,
  CircleDollarSign,
  Sparkles,
} from 'lucide-react';

// ============================================================
// WAJIB:
// Memaksa halaman ini bersifat dinamis agar Next.js tidak
// melakukan static pre-rendering saat build.
// ============================================================
export const dynamic = 'force-dynamic';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

function FundraiserStatsContent() {
  const searchParams = useSearchParams();

  const phoneParam =
    searchParams.get('phone') || '';

  const [phone, setPhone] =
    useState(phoneParam);

  const [loading, setLoading] =
    useState(false);

  const [stats, setStats] =
    useState<any>(null);

  const [error, setError] =
    useState('');

  const [selectedSlug, setSelectedSlug] =
    useState('');

  const [copied, setCopied] =
    useState(false);

  // ============================================================
  // FETCH STATISTIK
  // ============================================================
  const fetchStats = async (
    targetPhone: string
  ) => {
    if (!targetPhone) return;

    setLoading(true);
    setError('');
    setStats(null);
    setSelectedSlug('');
    setCopied(false);

    try {
      const cleanPhone =
        targetPhone.replace(
          /[^0-9]/g,
          ''
        );

      const res = await fetch(
        `/api/fundraiser/stats?phone=${cleanPhone}`
      );

      const json = await res.json();

      if (json.success) {
        setStats(json);
      } else {
        setError(
          json.message ||
            'Gagal mengambil data statistik. Pastikan nomor WhatsApp sudah terdaftar.'
        );
      }
    } catch (err) {
      setError(
        'Terjadi gangguan jaringan saat memuat data.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // AUTO FETCH JIKA ADA PARAMETER PHONE
  // ============================================================
  useEffect(() => {
    if (phoneParam) {
      setPhone(phoneParam);
      fetchStats(phoneParam);
    }
  }, [phoneParam]);

  // ============================================================
  // SUBMIT FORM
  // ============================================================
  const handleCheckStats = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!phone) return;

    fetchStats(phone);
  };

  // ============================================================
  // COPY LINK
  // ============================================================
  const handleCopy = async (
    text: string
  ) => {
    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  // ============================================================
  // DATA KEUANGAN
  // ============================================================
  const totalEarnings =
    Number(stats?.totalEarnings || 0);

  const feePaid =
    Number(
      stats?.profile?.feePaid || 0
    );

  const totalUjrah =
    Math.round(
      totalEarnings * 0.1
    );

  const availableFee =
    Math.max(
      0,
      totalUjrah - feePaid
    );

  return (
    <div className="w-full max-w-md space-y-4">

      {/* ========================================================
          HERO HEADER
      ======================================================== */}
      <section className="relative overflow-hidden rounded-[30px] bg-[#102a43] shadow-[0_20px_55px_rgba(16,42,67,0.18)]">

        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

        <div className="absolute right-4 bottom-[-80px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

        <div className="relative z-10 p-5 sm:p-6">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-[#d7b66a]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                  {SITE_SHORT_NAME} Fundraiser Center
                </p>

                <h1 className="mt-1 text-[17px] font-bold text-white">
                  Performa Fundraiser
                </h1>
              </div>

            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-2.5 py-1.5">
              <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

              <span className="text-[7px] font-bold uppercase tracking-wider text-[#e6d19d]">
                Official
              </span>
            </div>

          </div>

          <p className="mt-4 text-[10px] leading-relaxed text-slate-300">
            Pantau perolehan donasi dari tautan referral
            Anda di {SITE_DOMAIN}, lihat ujrah yang
            tersedia, dan kelola tautan program dengan
            lebih mudah.
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#d7b66a]">
            <ShieldCheck className="w-3 h-3" />
            {SITE_NAME} • {SITE_LOCATION}
          </div>

        </div>

        <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#e0c37e] to-[#a37c32]" />

      </section>

      {/* ========================================================
          FORM PENGECEKAN
      ======================================================== */}
      <section className="rounded-[26px] bg-white border border-slate-200/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-[#a37c32]" />
          </div>

          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Akses Statistik
            </p>

            <h2 className="mt-0.5 text-[13px] font-bold text-[#102a43]">
              Masukkan Nomor WhatsApp
            </h2>
          </div>

        </div>

        <form
          onSubmit={handleCheckStats}
          className="space-y-3"
        >

          <div className="space-y-1.5">

            <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 block">
              Nomor WhatsApp Terdaftar
            </label>

            <div className="relative">

              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Smartphone className="w-4 h-4" />
              </span>

              <input
                type="tel"
                required
                placeholder="Contoh: 08123456789"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                className="w-full h-12 pl-11 pr-4 bg-[#f8f8f6] border border-slate-200 rounded-2xl text-[11px] font-semibold focus:outline-none focus:border-[#a37c32] focus:bg-white focus:ring-4 focus:ring-[#a37c32]/8 text-slate-800 transition"
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-[#102a43] hover:bg-[#173d5d] disabled:bg-slate-300 text-white font-bold text-[9px] uppercase tracking-[0.16em] transition shadow-lg shadow-[#102a43]/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memuat Data
              </>
            ) : (
              <>
                Lihat Statistik
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </section>

      {/* ========================================================
          ERROR
      ======================================================== */}
      {error && (
        <div className="flex items-start gap-3 p-4 text-[10px] font-semibold leading-relaxed text-rose-600 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm">

          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

          <span>{error}</span>

        </div>
      )}

      {/* ========================================================
          HASIL STATISTIK
      ======================================================== */}
      {stats && stats.profile && (
        <div className="space-y-4 animate-in fade-in duration-300">

          {/* =====================================================
              PROFILE CARD
          ====================================================== */}
          <section className="rounded-[26px] bg-white border border-slate-200/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#102a43] flex items-center justify-center text-white font-bold">
                  {(stats.profile.name || 'R')
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Fundraiser BMA
                  </p>

                  <h2 className="mt-1 text-[13px] font-bold text-[#102a43] truncate">
                    {stats.profile.name}
                  </h2>

                  <p className="mt-0.5 text-[8px] text-slate-400">
                    {SITE_DOMAIN}
                  </p>

                </div>

              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-wider text-emerald-600">

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                Aktif

              </span>

            </div>

          </section>

          {/* =====================================================
              TOTAL DANA
          ====================================================== */}
          <section className="relative overflow-hidden rounded-[28px] bg-[#102a43] shadow-[0_18px_45px_rgba(16,42,67,0.15)]">

            <div className="absolute -right-10 -top-12 w-36 h-36 rounded-full border border-white/8" />

            <div className="relative z-10 p-5">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Total Dana Dihimpun
                  </p>

                  <p className="mt-2 text-[27px] leading-none font-bold tracking-tight text-white">
                    Rp{' '}
                    {totalEarnings.toLocaleString(
                      'id-ID'
                    )}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center">
                  <CircleDollarSign className="w-4 h-4 text-[#d7b66a]" />
                </div>

              </div>

              <div className="mt-5 grid grid-cols-2 border-t border-white/10 pt-4">

                <div>
                  <p className="text-[7px] uppercase tracking-wider text-slate-400">
                    Donatur
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-[14px] font-bold text-white">
                    <Users className="w-3.5 h-3.5 text-[#d7b66a]" />
                    {stats.donationCount}
                  </p>
                </div>

                <div className="border-l border-white/10 pl-5">
                  <p className="text-[7px] uppercase tracking-wider text-slate-400">
                    Transaksi
                  </p>

                  <p className="mt-1 text-[14px] font-bold text-white">
                    {stats.donationCount}x
                  </p>
                </div>

              </div>

            </div>

            <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#dfc27e] to-[#a37c32]" />

          </section>

          {/* =====================================================
              UJRAH
          ====================================================== */}
          <section className="rounded-[26px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="p-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#a37c32]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Ujrah Fundraiser
                  </p>

                  <h2 className="mt-0.5 text-[13px] font-bold text-[#102a43]">
                    Ringkasan Fee
                  </h2>
                </div>

              </div>

              <div className="mt-5 divide-y divide-slate-100">

                <div className="flex items-center justify-between gap-4 py-3">

                  <div>
                    <p className="text-[9px] font-semibold text-slate-500">
                      Total Ujrah Hak Anda
                    </p>

                    <p className="mt-0.5 text-[7px] text-slate-400">
                      10% dari dana terhimpun
                    </p>
                  </div>

                  <span className="text-[12px] font-bold text-slate-700">
                    Rp{' '}
                    {totalUjrah.toLocaleString(
                      'id-ID'
                    )}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 py-3">

                  <span className="text-[9px] font-semibold text-slate-500">
                    Sudah Dibayarkan BMA
                  </span>

                  <span className="text-[12px] font-bold text-amber-600">
                    -Rp{' '}
                    {feePaid.toLocaleString(
                      'id-ID'
                    )}
                  </span>

                </div>

              </div>

              <div className="mt-3 rounded-2xl bg-[#f7f2e7] border border-[#eadfca] p-4">

                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#98752d]">
                  Saldo Ujrah Tersedia
                </p>

                <p className="mt-1.5 text-[20px] font-bold tracking-tight text-[#102a43]">
                  Rp{' '}
                  {availableFee.toLocaleString(
                    'id-ID'
                  )}
                </p>

              </div>

            </div>

          </section>

          {/* =====================================================
              LINK REFERRAL
          ====================================================== */}
          <section className="rounded-[26px] bg-white border border-slate-200/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <Link2 className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Referral Program
                </p>

                <h2 className="mt-0.5 text-[13px] font-bold text-[#102a43]">
                  Tautan Fundraiser Anda
                </h2>
              </div>

            </div>

            <p className="mt-3 text-[9px] leading-relaxed text-slate-500">
              Pilih program Baitul Maal Al Muttaqin,
              lalu salin tautan unik Anda untuk dibagikan.
            </p>

            {stats.programs &&
            stats.programs.length > 0 ? (
              <div className="mt-4 space-y-3">

                <select
                  value={selectedSlug}
                  onChange={(e) => {
                    setSelectedSlug(
                      e.target.value
                    );

                    setCopied(false);
                  }}
                  className="w-full h-12 px-4 bg-[#f8f8f6] border border-slate-200 rounded-2xl text-[10px] font-semibold focus:outline-none focus:border-[#a37c32] focus:bg-white text-slate-700"
                >

                  <option value="">
                    -- Pilih Program Donasi --
                  </option>

                  {stats.programs.map(
                    (
                      prog: any,
                      index: number
                    ) => (
                      <option
                        key={index}
                        value={
                          prog.slug
                        }
                      >
                        {prog.title}
                      </option>
                    )
                  )}

                </select>

                {selectedSlug &&
                  (() => {
                    const cleanPhone =
                      phone.replace(
                        /[^0-9]/g,
                        ''
                      );

                    const baseUrl =
                      typeof window !==
                      'undefined'
                        ? window.location
                            .origin
                        : '';

                    const affiliateUrl =
                      `${baseUrl}/campaign/${selectedSlug}?ref=${cleanPhone}`;

                    return (
                      <div className="rounded-2xl border border-[#eadfca] bg-[#f7f2e7]/60 p-3.5 space-y-3">

                        <div className="flex items-center justify-between gap-3">

                          <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#98752d]">
                            Tautan Siap Dibagikan
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                affiliateUrl
                              )
                            }
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[8px] font-bold uppercase tracking-wider text-white transition ${
                              copied
                                ? 'bg-emerald-600'
                                : 'bg-[#102a43] hover:bg-[#173d5d]'
                            }`}
                          >
                            {copied ? (
                              <>
                                <Check className="w-3 h-3" />
                                Tersalin
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Salin
                              </>
                            )}
                          </button>

                        </div>

                        <div className="bg-white border border-slate-200 px-3 py-2.5 text-[9px] font-mono text-slate-500 rounded-xl truncate select-all">
                          {affiliateUrl}
                        </div>

                      </div>
                    );
                  })()}

              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">

                <Link2 className="w-5 h-5 text-slate-300 mx-auto" />

                <p className="mt-2 text-[9px] text-slate-400">
                  Belum ada program yang tersedia untuk dibagikan.
                </p>

              </div>
            )}

          </section>

          {/* =====================================================
              RIWAYAT TRANSAKSI
          ====================================================== */}
          <section className="rounded-[26px] bg-white border border-slate-200/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Aktivitas
                </p>

                <h2 className="mt-1 text-[13px] font-bold text-[#102a43]">
                  Riwayat Dukungan
                </h2>
              </div>

              <Sparkles className="w-4 h-4 text-[#a37c32]" />

            </div>

            <div className="mt-4 max-h-60 overflow-y-auto pr-1">

              {stats.history &&
              stats.history.length > 0 ? (

                <div className="divide-y divide-slate-100">

                  {stats.history.map(
                    (
                      item: any,
                      idx: number
                    ) => (
                      <div
                        key={idx}
                        className="py-3 flex items-center justify-between gap-3"
                      >

                        <div className="min-w-0 flex-1">

                          <p className="text-[10px] font-bold text-slate-700 truncate">
                            {item.donorName}
                          </p>

                          <p className="mt-1 text-[8px] font-medium text-slate-400 truncate">
                            {item.programTitle ||
                              'Sedekah Umum'}
                          </p>

                        </div>

                        <span className="shrink-0 text-[10px] font-bold text-emerald-600">
                          +Rp{' '}
                          {Number(
                            item.amount
                          ).toLocaleString(
                            'id-ID'
                          )}
                        </span>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="py-8 text-center">

                  <Users className="w-7 h-7 text-slate-200 mx-auto" />

                  <p className="mt-3 text-[9px] text-slate-400">
                    Belum ada donasi masuk dari
                    tautan fundraiser Anda.
                  </p>

                </div>
              )}

            </div>

          </section>

          {/* =====================================================
              BRAND FOOTER
          ====================================================== */}
          <div className="pt-1 pb-3 text-center">

            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              {SITE_NAME}
            </p>

            <p className="mt-1 text-[7px] text-slate-300">
              {SITE_DOMAIN} • {SITE_LOCATION}
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default function FundraiserStatsPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f6] py-5 px-4 sm:py-10 flex flex-col items-center justify-start">

      <Suspense
        fallback={
          <div className="w-full max-w-md flex flex-col items-center justify-center py-16">

            <div className="w-12 h-12 rounded-2xl bg-[#102a43] flex items-center justify-center shadow-lg">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            </div>

            <span className="mt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Memuat statistik {SITE_SHORT_NAME}
            </span>

          </div>
        }
      >

        <FundraiserStatsContent />

      </Suspense>

    </div>
  );
}