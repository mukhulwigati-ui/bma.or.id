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
    <div className="w-full max-w-[420px] space-y-3">

      {/* ========================================================
          HERO HEADER
      ======================================================== */}
      <section className="relative overflow-hidden bg-[#073f2e] shadow-[0_4px_20px_rgba(7,63,46,0.12)] border-y border-[#073f2e]/20">

        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

        <div className="absolute right-4 bottom-[-80px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

        <div className="relative z-10 p-4">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-white/10 border border-white/15 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-4 h-4 text-[#d7b66a]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                  {SITE_SHORT_NAME} Fundraiser Center
                </p>

                <h1 className="mt-0.5 text-[15px] font-bold text-white">
                  Performa Fundraiser
                </h1>
              </div>

            </div>

            <div className="inline-flex items-center gap-1.5 border border-white/15 bg-white/8 px-2.5 py-1">
              <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

              <span className="text-[7px] font-bold uppercase tracking-wider text-[#e6d19d]">
                Official
              </span>
            </div>

          </div>

          <p className="mt-3 text-[10px] leading-relaxed text-slate-200">
            Pantau perolehan donasi dari tautan referral
            Anda di {SITE_DOMAIN}, lihat ujrah yang
            tersedia, dan kelola tautan program dengan
            lebih mudah.
          </p>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#d7b66a]">
            <ShieldCheck className="w-3 h-3" />
            {SITE_NAME} • {SITE_LOCATION}
          </div>

        </div>

        <div className="h-[3px] bg-gradient-to-r from-[#b08a3d] via-[#dfc27e] to-[#b08a3d]" />

      </section>

      {/* ========================================================
          FORM PENGECEKAN
      ======================================================== */}
      <section className="bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

        <div className="flex items-center gap-3 mb-3.5">

          <div className="w-9 h-9 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-[#a37c32]" />
          </div>

          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Akses Statistik
            </p>

            <h2 className="mt-0.5 text-[12px] font-bold text-slate-800">
              Masukkan Nomor WhatsApp
            </h2>
          </div>

        </div>

        <form
          onSubmit={handleCheckStats}
          className="space-y-3"
        >

          <div className="space-y-1">

            <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 block">
              Nomor WhatsApp Terdaftar
            </label>

            <div className="relative">

              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
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
                className="w-full h-11 pl-10 pr-4 bg-[#f8f8f6] border border-slate-200 text-[11px] font-semibold focus:outline-none focus:border-[#073f2e] focus:bg-white text-slate-800 transition"
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#073f2e] hover:bg-[#052e21] disabled:bg-slate-300 text-white font-bold text-[9px] uppercase tracking-[0.16em] transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
        <div className="flex items-start gap-3 p-3.5 text-[10px] font-semibold leading-relaxed text-rose-600 bg-rose-50 border border-rose-100 shadow-sm">

          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

          <span>{error}</span>

        </div>
      )}

      {/* ========================================================
          HASIL STATISTIK
      ======================================================== */}
      {stats && stats.profile && (
        <div className="space-y-3 animate-in fade-in duration-300">

          {/* =====================================================
              PROFILE CARD
          ===================================================== */}
          <section className="bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-10 h-10 shrink-0 bg-[#073f2e] flex items-center justify-center text-white font-bold text-sm">
                  {(stats.profile.name || 'R')
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Fundraiser BMA
                  </p>

                  <h2 className="mt-0.5 text-[13px] font-bold text-slate-800 truncate">
                    {stats.profile.name}
                  </h2>

                  <p className="mt-0.5 text-[8px] text-slate-400">
                    {SITE_DOMAIN}
                  </p>

                </div>

              </div>

              <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-emerald-600">

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                Aktif

              </span>

            </div>

          </section>

          {/* =====================================================
              TOTAL DANA
          ===================================================== */}
          <section className="relative overflow-hidden bg-[#073f2e] shadow-[0_4px_20px_rgba(7,63,46,0.12)] border-y border-[#073f2e]/20">

            <div className="absolute -right-10 -top-12 w-36 h-36 rounded-full border border-white/8" />

            <div className="relative z-10 p-4">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-300">
                    Total Dana Dihimpun
                  </p>

                  <p className="mt-1.5 text-[24px] leading-none font-bold tracking-tight text-white">
                    Rp{' '}
                    {totalEarnings.toLocaleString(
                      'id-ID'
                    )}
                  </p>
                </div>

                <div className="w-9 h-9 bg-white/8 border border-white/15 flex items-center justify-center">
                  <CircleDollarSign className="w-4 h-4 text-[#d7b66a]" />
                </div>

              </div>

              <div className="mt-4 grid grid-cols-2 border-t border-white/10 pt-3">

                <div>
                  <p className="text-[7px] uppercase tracking-wider text-slate-300">
                    Donatur
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-[13px] font-bold text-white">
                    <Users className="w-3.5 h-3.5 text-[#d7b66a]" />
                    {stats.donationCount}
                  </p>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <p className="text-[7px] uppercase tracking-wider text-slate-300">
                    Transaksi
                  </p>

                  <p className="mt-1 text-[13px] font-bold text-white">
                    {stats.donationCount}x
                  </p>
                </div>

              </div>

            </div>

            <div className="h-[3px] bg-gradient-to-r from-[#b08a3d] via-[#dfc27e] to-[#b08a3d]" />

          </section>

          {/* =====================================================
              UJRAH
          ===================================================== */}
          <section className="bg-white border-y border-slate-200/70 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

            <div className="p-4">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#a37c32]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Ujrah Fundraiser
                  </p>

                  <h2 className="mt-0.5 text-[12px] font-bold text-slate-800">
                    Ringkasan Fee
                  </h2>
                </div>

              </div>

              <div className="mt-4 divide-y divide-slate-100">

                <div className="flex items-center justify-between gap-4 py-2.5">

                  <div>
                    <p className="text-[9px] font-semibold text-slate-500">
                      Total Ujrah Hak Anda
                    </p>

                    <p className="mt-0.5 text-[7px] text-slate-400">
                      10% dari dana terhimpun
                    </p>
                  </div>

                  <span className="text-[11px] font-bold text-slate-700">
                    Rp{' '}
                    {totalUjrah.toLocaleString(
                      'id-ID'
                    )}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 py-2.5">

                  <span className="text-[9px] font-semibold text-slate-500">
                    Sudah Dibayarkan BMA
                  </span>

                  <span className="text-[11px] font-bold text-amber-600">
                    -Rp{' '}
                    {feePaid.toLocaleString(
                      'id-ID'
                    )}
                  </span>

                </div>

              </div>

              <div className="mt-3 bg-[#f7f2e7] border border-[#eadfca] p-3.5">

                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#98752d]">
                  Saldo Ujrah Tersedia
                </p>

                <p className="mt-1 text-[18px] font-bold tracking-tight text-[#073f2e]">
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
          ===================================================== */}
          <section className="bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                <Link2 className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Referral Program
                </p>

                <h2 className="mt-0.5 text-[12px] font-bold text-slate-800">
                  Tautan Fundraiser Anda
                </h2>
              </div>

            </div>

            <p className="mt-2.5 text-[9px] leading-relaxed text-slate-500">
              Pilih program Baitul Maal Al Muttaqin,
              lalu salin tautan unik Anda untuk dibagikan.
            </p>

            {stats.programs &&
            stats.programs.length > 0 ? (
              <div className="mt-3.5 space-y-3">

                <select
                  value={selectedSlug}
                  onChange={(e) => {
                    setSelectedSlug(
                      e.target.value
                    );

                    setCopied(false);
                  }}
                  className="w-full h-11 px-3.5 bg-[#f8f8f6] border border-slate-200 text-[10px] font-semibold focus:outline-none focus:border-[#073f2e] focus:bg-white text-slate-700"
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
                      <div className="border border-[#eadfca] bg-[#f7f2e7]/60 p-3 space-y-2.5">

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
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-white transition cursor-pointer ${
                              copied
                                ? 'bg-emerald-600'
                                : 'bg-[#073f2e] hover:bg-[#052e21]'
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

                        <div className="bg-white border border-slate-200 px-3 py-2 text-[9px] font-mono text-slate-500 truncate select-all">
                          {affiliateUrl}
                        </div>

                      </div>
                    );
                  })()}

              </div>
            ) : (
              <div className="mt-3.5 bg-slate-50 border border-slate-200 p-4 text-center">

                <Link2 className="w-5 h-5 text-slate-300 mx-auto" />

                <p className="mt-2 text-[9px] text-slate-400">
                  Belum ada program yang tersedia untuk dibagikan.
                </p>

              </div>
            )}

          </section>

          {/* =====================================================
              RIWAYAT TRANSAKSI
          ===================================================== */}
          <section className="bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Aktivitas
                </p>

                <h2 className="mt-0.5 text-[12px] font-bold text-slate-800">
                  Riwayat Dukungan
                </h2>
              </div>

              <Sparkles className="w-4 h-4 text-[#a37c32]" />

            </div>

            <div className="mt-3 max-h-60 overflow-y-auto pr-1">

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
                        className="py-2.5 flex items-center justify-between gap-3"
                      >

                        <div className="min-w-0 flex-1">

                          <p className="text-[10px] font-bold text-slate-700 truncate">
                            {item.donorName}
                          </p>

                          <p className="mt-0.5 text-[8px] font-medium text-slate-400 truncate">
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
                <div className="py-6 text-center">

                  <Users className="w-6 h-6 text-slate-200 mx-auto" />

                  <p className="mt-2.5 text-[9px] text-slate-400">
                    Belum ada donasi masuk dari
                    tautan fundraiser Anda.
                  </p>

                </div>
              )}

            </div>

          </section>

          {/* =====================================================
              BRAND FOOTER
          ===================================================== */}
          <div className="pt-1 pb-2 text-center">

            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {SITE_NAME}
            </p>

            <p className="mt-0.5 text-[7px] text-slate-400">
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
    <main className="min-h-screen bg-[#f8f8f6] py-4 px-0 flex flex-col items-center justify-start">

      <Suspense
        fallback={
          <div className="w-full max-w-[420px] flex flex-col items-center justify-center py-16">

            <div className="w-11 h-11 bg-[#073f2e] flex items-center justify-center shadow-lg">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            </div>

            <span className="mt-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Memuat statistik {SITE_SHORT_NAME}
            </span>

          </div>
        }
      >

        <FundraiserStatsContent />

      </Suspense>

    </main>
  );
}