// app/referral/page.tsx
'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  Loader2,
  Search,
  Lock,
  Wallet,
  Users,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Link2,
  CircleDollarSign,
  HeartHandshake,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

export default function ReferralPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [allPrograms, setAllPrograms] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  const [selectedSlug, setSelectedSlug] = useState('');
  const [searchProgram, setSearchProgram] = useState('');
  const [copiedText, setCopiedText] = useState('');

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  // ============================================================
  // LOAD PROFILE, STATS, DAN PROGRAM
  // ============================================================
  useEffect(() => {
    const fetchProfileStatsAndPrograms = async () => {
      setLoading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          let { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (!prof) {
            const meta = user.user_metadata || {};
            prof = {
              id: user.id,
              email: user.email,
              name: meta.full_name || meta.name || user.email?.split('@')[0] || 'Dermawan',
              avatar: meta.avatar_url || meta.picture || '',
              phone: '',
            };
            await supabase.from('profiles').upsert(prof);
          }

          if (prof) {
            setProfile(prof);

            const phoneClean = String(prof.phone || '').replace(/[^0-9]/g, '');

            if (phoneClean.length >= 8) {
              setStatsLoading(true);

              try {
                const resStats = await fetch(
                  `/api/fundraiser/stats?phone=${phoneClean}`
                );

                const jsonStats =
                  await resStats.json();

                if (jsonStats.success) {
                  setStats(jsonStats);
                } else {
                  setStats({
                    totalEarnings: 0,
                    donationCount: 0,
                    history: [],
                    profile: {
                      ...prof,
                      feePaid:
                        prof?.feePaid || 0,
                    },
                  });
                }
              } catch (err) {
                console.error(
                  'Gagal memuat statistik fundraiser:',
                  err
                );

                setStats({
                  totalEarnings: 0,
                  donationCount: 0,
                  history: [],
                  profile: {
                    ...prof,
                    feePaid:
                      prof?.feePaid || 0,
                  },
                });
              } finally {
                setStatsLoading(false);
              }
            } else {
              setStats({
                totalEarnings: 0,
                donationCount: 0,
                history: [],
                profile: {
                  ...prof,
                  feePaid:
                    prof?.feePaid || 0,
                },
              });
            }
          }
        }

        const resProg =
          await fetch('/api/programs');

        const jsonProg =
          await resProg.json();

        if (
          jsonProg.success &&
          Array.isArray(jsonProg.data)
        ) {
          setAllPrograms(jsonProg.data);
        }
      } catch (err) {
        console.error(
          'Error loading referral data:',
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStatsAndPrograms();
  }, [supabase]);

  // ============================================================
  // COPY LINK
  // ============================================================
  const handleCopy = async (
    text: string
  ) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopiedText(text);

      setTimeout(() => {
        setCopiedText('');
      }, 2000);
    } catch (error) {
      console.error(
        'Gagal menyalin tautan:',
        error
      );
    }
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4">

        <div className="flex flex-col items-center gap-4">

          <div className="w-11 h-11 bg-[#073f2e] flex items-center justify-center shadow-lg">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>

          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Memuat Fundraiser BMA
          </span>

        </div>

      </div>
    );
  }

  // ============================================================
  // DATA REFERRAL
  // ============================================================
  const cleanPhone = String(profile?.phone || '').replace(/[^0-9]/g, '');
  const hasPhone = Boolean(cleanPhone && cleanPhone.length >= 8);

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : '';

  const defaultReferralLink =
    hasPhone
      ? `${baseUrl}/?ref=${cleanPhone}`
      : '';

  const filteredPrograms =
    allPrograms.filter((program) => {
      const title = String(
        program?.title || ''
      ).toLowerCase();

      return title.includes(
        searchProgram.toLowerCase()
      );
    });

  const totalEarnings =
    Number(stats?.totalEarnings || 0);

  const donationCount =
    Number(stats?.donationCount || 0);

  const totalUjrah =
    Math.round(totalEarnings * 0.1);

  const feePaid =
    Number(
      stats?.profile?.feePaid || 0
    );

  const availableFee =
    Math.max(
      0,
      totalUjrah - feePaid
    );

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-slate-900 pb-28 pt-2 flex justify-center">

      <div className="w-full max-w-[420px] space-y-3 px-0">

        {/* =====================================================
            PREMIUM HEADER
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#073f2e] shadow-[0_4px_20px_rgba(7,63,46,0.12)] border-y border-[#073f2e]/20">

          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

          <div className="absolute right-4 bottom-[-80px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

          <div className="relative z-10 p-4">

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3 min-w-0">

                <Link
                  href="/akun"
                  aria-label="Kembali ke akun"
                  className="w-9 h-9 shrink-0 bg-white/8 border border-white/15 flex items-center justify-center hover:bg-white/20 transition"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                </Link>

                <div className="min-w-0">

                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Fundraiser Center
                  </p>

                  <h1 className="mt-0.5 text-[15px] font-bold text-white">
                    Referral & Performa
                  </h1>

                </div>

              </div>

              <div className="w-9 h-9 shrink-0 bg-white/8 border border-white/15 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4 text-[#d7b66a]" />
              </div>

            </div>

            <div className="mt-3.5 inline-flex items-center gap-2 bg-white/8 border border-white/15 px-2.5 py-1">

              <span className="w-1.5 h-1.5 rounded-full bg-[#d7b66a]" />

              <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#e7d5a4]">
                Gerakan Kebaikan Bersama
              </span>

            </div>

            <h2 className="mt-3 text-[20px] leading-[1.25] font-bold tracking-tight text-white">
              Sebarkan Kebaikan.
              <br />
              Perluas Manfaat.
            </h2>

            <p className="mt-2.5 max-w-[310px] text-[10px] leading-[1.7] text-slate-200">
              Bagikan program Baitul Maal Al Muttaqin
              melalui tautan referral pribadi Anda dan
              pantau setiap dukungan yang berhasil
              dihimpun.
            </p>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5">

              <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#e6d19d]">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </span>

            </div>

          </div>

          <div className="h-[3px] bg-gradient-to-r from-[#b08a3d] via-[#dfc27e] to-[#b08a3d]" />

        </section>

        {/* =====================================================
            LOCKED STATE
        ===================================================== */}
        {!hasPhone ? (
          <section className="relative overflow-hidden bg-white border-y border-slate-200/70 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center">

            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#f7f2e7]" />

            <div className="relative z-10 flex flex-col items-center">

              <div className="w-12 h-12 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#a37c32]" />
              </div>

              <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Aktivasi Fundraiser
              </p>

              <h3 className="mt-0.5 text-[13px] font-bold text-slate-800">
                Nomor WhatsApp Diperlukan
              </h3>

              <p className="mt-2 text-[9px] leading-[1.7] text-slate-500 max-w-[290px]">
                Lengkapi nomor WhatsApp pada profil
                Anda. Nomor tersebut akan digunakan
                sebagai kode referral unik untuk
                menghasilkan tautan fundraiser.
              </p>

              <Link
                href="/pengaturan"
                className="mt-4 inline-flex items-center justify-center gap-2 bg-[#073f2e] px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white shadow-md transition hover:bg-[#052e21]"
              >
                Lengkapi Profil
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>

            </div>

          </section>
        ) : (
          <>

            {/* =================================================
                PROFILE STATUS
            ================================================= */}
            <section className="bg-white border-y border-slate-200/70 p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3 min-w-0">

                  <div className="w-10 h-10 shrink-0 bg-[#073f2e] flex items-center justify-center text-white font-bold text-sm">
                    {(profile?.name || 'F')
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">

                    <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-slate-400">
                      Fundraiser BMA
                    </p>

                    <h2 className="mt-0.5 text-[12px] font-bold text-slate-800 truncate">
                      {profile?.name ||
                        'Sahabat Kebaikan'}
                    </h2>

                    <p className="mt-0.5 text-[8px] text-slate-400">
                      {profile?.phone}
                    </p>

                  </div>

                </div>

                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-emerald-600">

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                  Aktif

                </span>

              </div>

            </section>

            {/* =================================================
                PERFORMANCE
            ================================================= */}
            {statsLoading ? (
              <section className="bg-white border-y border-slate-200/70 p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

                <Loader2 className="w-5 h-5 text-[#073f2e] animate-spin mx-auto" />

                <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Mengambil statistik
                </p>

              </section>
            ) : (
              <section className="bg-white border-y border-slate-200/70 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

                <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">

                  <div>

                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Performance Overview
                    </p>

                    <h3 className="mt-0.5 text-[13px] font-bold text-slate-800">
                      Statistik Penghimpunan
                    </h3>

                  </div>

                  <div className="w-9 h-9 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#a37c32]" />
                  </div>

                </div>

                {/* MAIN STATS */}
                <div className="grid grid-cols-2 border-t border-slate-100">

                  <div className="p-4 border-r border-slate-100">

                    <div className="flex items-center gap-1.5 text-slate-400">

                      <CircleDollarSign className="w-3.5 h-3.5" />

                      <span className="text-[8px] font-bold uppercase tracking-wider">
                        Dana Dihimpun
                      </span>

                    </div>

                    <p className="mt-2 text-[18px] font-bold tracking-tight text-[#073f2e]">
                      Rp{' '}
                      {totalEarnings.toLocaleString(
                        'id-ID'
                      )}
                    </p>

                  </div>

                  <div className="p-4">

                    <div className="flex items-center gap-1.5 text-slate-400">

                      <Users className="w-3.5 h-3.5" />

                      <span className="text-[8px] font-bold uppercase tracking-wider">
                        Transaksi
                      </span>

                    </div>

                    <p className="mt-2 text-[18px] font-bold tracking-tight text-[#073f2e]">
                      {donationCount}
                    </p>

                    <p className="mt-0.5 text-[8px] text-slate-400">
                      transaksi berhasil
                    </p>

                  </div>

                </div>

                {/* UJRAH */}
                <div className="m-3.5 bg-[#f7f2e7]/60 border border-[#eadfca] p-3.5">

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#98752d]">
                        Ringkasan Ujrah
                      </p>

                      <p className="mt-0.5 text-[7px] text-slate-400">
                        Berdasarkan 10% perolehan
                      </p>

                    </div>

                    <span className="inline-flex items-center bg-white border border-[#eadfca] px-2 py-0.5 text-[8px] font-bold text-[#98752d]">
                      10%
                    </span>

                  </div>

                  <div className="mt-3 divide-y divide-[#e9e3d4]">

                    <div className="flex justify-between items-center gap-4 py-2">

                      <span className="text-[9px] text-slate-500">
                        Total hak Anda
                      </span>

                      <span className="text-[11px] font-bold text-slate-700">
                        Rp{' '}
                        {totalUjrah.toLocaleString(
                          'id-ID'
                        )}
                      </span>

                    </div>

                    <div className="flex justify-between items-center gap-4 py-2">

                      <span className="text-[9px] text-slate-500">
                        Telah dibayarkan BMA
                      </span>

                      <span className="text-[11px] font-semibold text-slate-600">
                        Rp{' '}
                        {feePaid.toLocaleString(
                          'id-ID'
                        )}
                      </span>

                    </div>

                  </div>

                  <div className="mt-2.5 bg-white border border-[#eadfca] p-3">

                    <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Saldo Ujrah Tersedia
                    </p>

                    <p className="mt-0.5 text-[16px] font-bold text-[#073f2e]">
                      Rp{' '}
                      {availableFee.toLocaleString(
                        'id-ID'
                      )}
                    </p>

                  </div>

                </div>

              </section>
            )}

            {/* =================================================
                LINK GENERATOR
            ================================================= */}
            <section className="bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

              <div className="flex items-start justify-between gap-3">

                <div>

                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Referral Tools
                  </p>

                  <h3 className="mt-0.5 text-[13px] font-bold text-slate-800">
                    Tautan Fundraiser
                  </h3>

                </div>

                <div className="w-9 h-9 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-[#a37c32]" />
                </div>

              </div>

              <p className="mt-2.5 text-[9px] leading-relaxed text-slate-500">
                Gunakan tautan umum untuk mengarahkan
                orang ke beranda BMA atau pilih campaign
                tertentu untuk membuat tautan referral
                khusus.
              </p>

              {/* GENERAL LINK */}
              <div className="mt-4">

                <label className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Tautan Umum {SITE_DOMAIN}
                </label>

                <div className="mt-1.5 flex items-center gap-2 p-1 bg-[#f8f8f6] border border-slate-200">

                  <input
                    type="text"
                    readOnly
                    value={defaultReferralLink}
                    className="min-w-0 flex-1 bg-transparent px-2 text-[9px] font-mono text-slate-500 outline-none truncate"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        defaultReferralLink
                      )
                    }
                    className={`shrink-0 px-3.5 py-2 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-white transition cursor-pointer ${
                      copiedText ===
                      defaultReferralLink
                        ? 'bg-emerald-600'
                        : 'bg-[#073f2e] hover:bg-[#052e21]'
                    }`}
                  >
                    {copiedText ===
                    defaultReferralLink ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}

                    {copiedText ===
                    defaultReferralLink
                      ? 'Tersalin'
                      : 'Salin'}
                  </button>

                </div>

              </div>

              {/* CAMPAIGN SELECTOR */}
              <div className="mt-4 pt-4 border-t border-slate-100">

                <label className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Campaign Spesifik
                </label>

                {/* SEARCH */}
                <div className="relative mt-1.5">

                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

                  <input
                    type="text"
                    placeholder="Cari program BMA..."
                    value={searchProgram}
                    onChange={(e) =>
                      setSearchProgram(
                        e.target.value
                      )
                    }
                    className="w-full h-10 bg-[#f8f8f6] border border-slate-200 pl-9 pr-3 text-[9px] font-medium text-slate-700 outline-none transition focus:bg-white focus:border-[#073f2e]"
                  />

                </div>

                {/* SELECT */}
                <div className="relative mt-2">

                  <select
                    value={selectedSlug}
                    onChange={(e) => {
                      setSelectedSlug(
                        e.target.value
                      );

                      setCopiedText('');
                    }}
                    className="appearance-none w-full h-10 bg-[#f8f8f6] border border-slate-200 px-3 pr-8 text-[9px] font-semibold text-slate-700 outline-none transition focus:bg-white focus:border-[#073f2e]"
                  >

                    <option value="">
                      -- Pilih dari{' '}
                      {filteredPrograms.length}{' '}
                      program --
                    </option>

                    {filteredPrograms.map(
                      (
                        prog: any,
                        index: number
                      ) => (
                        <option
                          key={
                            prog._id || index
                          }
                          value={
                            prog.slug
                          }
                        >
                          {prog.title}
                        </option>
                      )
                    )}

                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />

                </div>

                {/* GENERATED LINK */}
                {selectedSlug &&
                  (() => {
                    const affiliateUrl =
                      `${baseUrl}/campaign/${selectedSlug}?ref=${cleanPhone}`;

                    const isCopied =
                      copiedText ===
                      affiliateUrl;

                    return (
                      <div className="mt-3 border border-[#eadfca] bg-[#f7f2e7]/60 p-3">

                        <div className="flex items-center justify-between gap-3">

                          <div>

                            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#98752d]">
                              Tautan Campaign
                            </p>

                            <p className="mt-0.5 text-[7px] text-slate-400">
                              Siap dibagikan
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                affiliateUrl
                              )
                            }
                            className={`px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-white transition cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-600'
                                : 'bg-[#073f2e] hover:bg-[#052e21]'
                            }`}
                          >
                            {isCopied ? (
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

                        <div className="mt-2.5 bg-white border border-slate-200 px-3 py-2">

                          <p className="text-[8px] font-mono text-slate-500 truncate select-all">
                            {affiliateUrl}
                          </p>

                        </div>

                      </div>
                    );
                  })()}

              </div>

            </section>

            {/* =================================================
                HISTORY
            ================================================= */}
            <section className="bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Aktivitas
                  </p>

                  <h3 className="mt-0.5 text-[12px] font-bold text-slate-800">
                    Riwayat Dukungan
                  </h3>

                </div>

                <div className="w-8 h-8 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-[#a37c32]" />
                </div>

              </div>

              <div className="mt-3 max-h-72 overflow-y-auto pr-1">

                {stats?.history &&
                stats.history.length > 0 ? (
                  <div className="divide-y divide-slate-100">

                    {stats.history.map(
                      (
                        item: any,
                        idx: number
                      ) => (
                        <div
                          key={idx}
                          className="py-2.5 flex items-center gap-3"
                        >

                          <div className="w-8 h-8 bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          </div>

                          <div className="flex-1 min-w-0">

                            <p className="text-[10px] font-bold text-slate-700 truncate">
                              {item.donorName ||
                                'Hamba Allah'}
                            </p>

                            <p className="mt-0.5 text-[8px] text-slate-400 truncate">
                              {item.programTitle ||
                                'Sedekah Umum BMA'}
                            </p>

                          </div>

                          <div className="text-right shrink-0">

                            <p className="text-[10px] font-bold text-emerald-600">
                              +Rp{' '}
                              {Number(
                                item.amount || 0
                              ).toLocaleString(
                                'id-ID'
                              )}
                            </p>

                            <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-wider text-slate-400">
                              Berhasil
                            </p>

                          </div>

                        </div>
                      )
                    )}

                  </div>
                ) : (
                  <div className="py-6 text-center">

                    <div className="w-10 h-10 bg-[#f7f2e7] border border-[#eadfca] mx-auto flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-[#a37c32]" />
                    </div>

                    <h4 className="mt-3 text-[11px] font-bold text-slate-800">
                      Belum Ada Transaksi
                    </h4>

                    <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
                      Donasi yang masuk melalui
                      tautan fundraiser Anda akan
                      tampil pada bagian ini.
                    </p>

                  </div>
                )}

              </div>

            </section>

            {/* =================================================
                INFO
            ================================================= */}
            <section className="border border-[#eadfca] bg-[#f7f2e7]/60 p-3.5">

              <div className="flex items-start gap-3">

                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

                <div>

                  <p className="text-[9px] font-bold text-slate-800">
                    Tautan Referral Pribadi
                  </p>

                  <p className="mt-0.5 text-[8px] leading-relaxed text-slate-500">
                    Parameter referral dibuat dari
                    nomor WhatsApp yang tersimpan pada
                    akun Anda. Pastikan nomor tersebut
                    benar agar pencatatan fundraiser
                    berjalan sesuai sistem.
                  </p>

                </div>

              </div>

            </section>

          </>
        )}

        {/* =====================================================
            BRAND FOOTER
        ===================================================== */}
        <div className="text-center px-4 pt-1 pb-2">

          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {SITE_NAME}
          </p>

          <p className="mt-0.5 text-[7px] text-slate-400">
            {SITE_DOMAIN} • {SITE_LOCATION}
          </p>

          <p className="mt-1.5 text-[8px] leading-relaxed text-slate-400">
            Terima kasih telah membantu memperluas
            manfaat dan gerakan kebaikan bersama BMA.
          </p>

        </div>

      </div>

    </main>
  );
}