// app/donasi-saya/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import {
  Heart,
  CheckCircle2,
  Clock,
  Search,
  Download,
  RefreshCw,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  X,
  ShieldCheck,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

export default function DonasiSayaPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    'semua' | 'pending' | 'sukses'
  >('semua');

  const [selectedCategory, setSelectedCategory] =
    useState<string>('Semua');

  const [searchQuery, setSearchQuery] = useState('');

  const [sortBy, setSortBy] = useState<
    'terbaru' | 'terlama' | 'terbesar' | 'terkecil'
  >('terbaru');

  const [selectedDonation, setSelectedDonation] =
    useState<any>(null);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (prof) {
          setProfile(prof);
        }

        const { data: donData } = await supabase
          .from('donations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', {
            ascending: false,
          });

        if (donData) {
          setDonations(donData);
        }
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [supabase]);

  const successfulStatuses = [
    'success',
    'paid',
    'completed',
  ];

  const totalAmount = donations
    .filter((d) =>
      successfulStatuses.includes(
        (d.status || '').toLowerCase()
      )
    )
    .reduce(
      (acc, curr) => acc + Number(curr.amount || 0),
      0
    );

  const successfulDonationsCount = donations.filter((d) =>
    successfulStatuses.includes(
      (d.status || '').toLowerCase()
    )
  ).length;

  const uniqueProgramsCount = new Set(
    donations.map(
      (d) => d.program_name || d.programTitle
    )
  ).size;

  let donorBadge = {
    title: 'Sahabat Kebaikan',
    level: 'LEVEL 1',
    icon: '♡',
  };

  if (totalAmount > 2000000) {
    donorBadge = {
      title: 'Donatur Istimewa',
      level: 'LEVEL 3',
      icon: '✦',
    };
  } else if (totalAmount >= 500000) {
    donorBadge = {
      title: 'Donatur Peduli',
      level: 'LEVEL 2',
      icon: '◆',
    };
  }

  const filteredDonations = donations
    .filter((d) => {
      const status = (
        d.status || 'pending'
      ).toLowerCase();

      const title = (
        d.program_name ||
        d.programTitle ||
        ''
      ).toLowerCase();

      const category = (
        d.category || ''
      ).toLowerCase();

      if (
        activeTab === 'pending' &&
        !['pending', 'unpaid'].includes(status)
      ) {
        return false;
      }

      if (
        activeTab === 'sukses' &&
        !successfulStatuses.includes(status)
      ) {
        return false;
      }

      if (
        selectedCategory !== 'Semua' &&
        category !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      if (
        searchQuery &&
        !title.includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'terbaru') {
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      }

      if (sortBy === 'terlama') {
        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        );
      }

      if (sortBy === 'terbesar') {
        return Number(b.amount) - Number(a.amount);
      }

      if (sortBy === 'terkecil') {
        return Number(a.amount) - Number(b.amount);
      }

      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 bg-[#073f2e] flex items-center justify-center shadow-lg">
            <RefreshCw className="w-4 h-4 text-white animate-spin" />
          </div>

          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Memuat riwayat donasi {SITE_SHORT_NAME}
          </p>
        </div>
      </div>
    );
  }

  const memberSince = profile?.created_at
    ? new Date(
        profile.created_at
      ).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      })
    : '2026';

  const displayName = profile?.name?.trim() || profile?.email?.split('@')[0] || profile?.full_name || profile?.user_metadata?.full_name || profile?.user_metadata?.name || 'Dermawan BMA';

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-slate-900 pb-28 pt-2 flex justify-center">
      <div className="w-full max-w-[420px] space-y-3 px-0">

        {/* =====================================================
            PREMIUM HEADER
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#073f2e] shadow-[0_4px_20px_rgba(7,63,46,0.12)] border-y border-[#073f2e]/20">

          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

          <div className="absolute right-5 bottom-[-70px] w-40 h-40 rounded-full border border-[#d8b76c]/10" />

          <div className="relative z-10 p-4">

            <div className="flex items-start justify-between gap-3">

              <div className="flex items-center gap-3 min-w-0">

                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={displayName}
                    className="w-[58px] h-[58px] rounded-full object-cover border border-[#d7b66a]/50 shadow-xl"
                  />
                ) : (
                  <div className="w-[58px] h-[58px] shrink-0 rounded-full bg-white/10 border border-[#d7b66a]/40 flex items-center justify-center text-white font-bold text-xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">

                  <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#d7b66a]">
                    {SITE_SHORT_NAME} Donation Center
                  </p>

                  <h1 className="mt-1 text-[16px] font-bold text-white truncate">
                    {displayName}
                  </h1>

                  <p className="mt-0.5 text-[9px] text-slate-200">
                    Member sejak {memberSince}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

                    <span className="text-[7px] font-semibold uppercase tracking-wider text-[#e6d19d]">
                      Member {SITE_DOMAIN}
                    </span>
                  </div>

                </div>
              </div>

              <div className="shrink-0 text-right">

                <div className="inline-flex items-center gap-1.5 bg-white/8 border border-white/15 px-2.5 py-1.5">

                  <span className="text-[#d7b66a] text-[10px]">
                    {donorBadge.icon}
                  </span>

                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#e6d19d]">
                    {donorBadge.level}
                  </span>

                </div>

                <p className="mt-1 text-[8px] text-slate-200">
                  {donorBadge.title}
                </p>

              </div>
            </div>

            {/* TOTAL DONASI */}
            <div className="mt-4 pt-4 border-t border-white/10">

              <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-slate-300">
                Total Donasi Berhasil
              </p>

              <div className="mt-1.5 flex items-end justify-between gap-3">

                <p className="text-[24px] leading-none font-bold tracking-tight text-white">
                  Rp{' '}
                  {totalAmount.toLocaleString(
                    'id-ID'
                  )}
                </p>

                <div className="flex items-center gap-1.5 text-[8px] text-[#d7b66a] font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  Terverifikasi
                </div>

              </div>

            </div>

            {/* STATISTICS */}
            <div className="mt-4 grid grid-cols-3 border-t border-white/10 pt-3">

              <div>
                <p className="text-[8px] uppercase tracking-wider text-slate-300">
                  Berhasil
                </p>

                <p className="mt-1 text-[14px] font-bold text-white">
                  {successfulDonationsCount}x
                </p>
              </div>

              <div className="border-x border-white/10 px-3">

                <p className="text-[8px] uppercase tracking-wider text-slate-300">
                  Program
                </p>

                <p className="mt-1 text-[14px] font-bold text-white">
                  {uniqueProgramsCount}
                </p>

              </div>

              <div className="pl-3">

                <p className="text-[8px] uppercase tracking-wider text-slate-300">
                  Transaksi
                </p>

                <p className="mt-1 text-[14px] font-bold text-white">
                  {donations.length}
                </p>

              </div>

            </div>
          </div>

          <div className="h-[3px] bg-gradient-to-r from-[#b08a3d] via-[#dfc27e] to-[#b08a3d]" />

        </section>

        {/* =====================================================
            IMPACT CARD
        ===================================================== */}
        <section className="relative overflow-hidden bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

          <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-[#f7f2e7] -translate-y-1/2 translate-x-1/2" />

          <div className="relative">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div>

                <p className="text-[8px] uppercase tracking-[0.18em] font-bold text-slate-400">
                  Dampak Kebaikan
                </p>

                <h2 className="mt-0.5 text-[12px] font-bold text-slate-800">
                  Kebaikan yang Anda Titipkan
                </h2>

              </div>

            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
              Alhamdulillah, setiap donasi yang Anda titipkan melalui
              {' '}
              {SITE_NAME}
              {' '}
              menjadi bagian dari ikhtiar menghadirkan manfaat bagi
              masyarakat yang membutuhkan.
            </p>

            <div className="mt-3 space-y-2">

              {[
                'Program sosial untuk yatim, dhuafa, dan masyarakat membutuhkan',
                'Dukungan dakwah dan fasilitas ibadah umat',
                'Program pendidikan, santri, dan kegiatan kemaslahatan',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 bg-[#f5f8f6] border border-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>

                  <span className="text-[9px] font-medium text-slate-600">
                    {item}
                  </span>
                </div>
              ))}

            </div>

            <div className="mt-3.5 border-t border-slate-100 pt-2.5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </p>
            </div>
          </div>

        </section>

        {/* =====================================================
            SEARCH & FILTER
        ===================================================== */}
        <section className="space-y-3 px-0">

          <div className="flex items-center justify-between px-1">

            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-slate-400">
                Aktivitas Donasi
              </p>

              <h2 className="mt-0.5 text-[13px] font-bold text-slate-800">
                Riwayat Donasi
              </h2>
            </div>

            <span className="text-[9px] font-semibold text-slate-400">
              {filteredDonations.length} transaksi
            </span>

          </div>

          {/* SEARCH */}
          <div className="relative">

            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Cari program donasi..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full h-11 bg-white border border-slate-200/80 pl-10 pr-4 text-[10px] font-medium text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#073f2e]"
            />

          </div>

          {/* STATUS TABS */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70">

            <button
              onClick={() => setActiveTab('semua')}
              className={`py-2 text-[9px] font-bold transition ${
                activeTab === 'semua'
                  ? 'bg-white text-[#073f2e] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
              <span className="ml-1 opacity-60">
                {donations.length}
              </span>
            </button>

            <button
              onClick={() =>
                setActiveTab('pending')
              }
              className={`py-2 text-[9px] font-bold transition ${
                activeTab === 'pending'
                  ? 'bg-white text-[#a37c32] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pending
            </button>

            <button
              onClick={() =>
                setActiveTab('sukses')
              }
              className={`py-2 text-[9px] font-bold transition ${
                activeTab === 'sukses'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Berhasil
            </button>

          </div>

          {/* SELECTS */}
          <div className="grid grid-cols-2 gap-2">

            <div className="relative">

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value
                  )
                }
                className="appearance-none w-full h-10 bg-white border border-slate-200 px-3 pr-8 text-[9px] font-semibold text-slate-600 outline-none focus:border-[#073f2e]"
              >
                <option value="Semua">
                  Semua Kategori
                </option>

                <option value="zakat">
                  Zakat
                </option>

                <option value="infak">
                  Infak
                </option>

                <option value="sedekah">
                  Sedekah
                </option>

                <option value="wakaf">
                  Wakaf
                </option>

                <option value="kemanusiaan">
                  Kemanusiaan
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />

            </div>

            <div className="relative">

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | 'terbaru'
                      | 'terlama'
                      | 'terbesar'
                      | 'terkecil'
                  )
                }
                className="appearance-none w-full h-10 bg-white border border-slate-200 px-3 pr-8 text-[9px] font-semibold text-slate-600 outline-none focus:border-[#073f2e]"
              >
                <option value="terbaru">
                  Terbaru
                </option>

                <option value="terlama">
                  Terlama
                </option>

                <option value="terbesar">
                  Nomor Terbesar
                </option>

                <option value="terkecil">
                  Nomor Terkecil
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />

            </div>

          </div>
        </section>

        {/* =====================================================
            TRANSACTION LIST
        ===================================================== */}
        {filteredDonations.length === 0 ? (
          <section className="bg-white border-y border-slate-200/70 p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

            <div className="w-12 h-12 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5 text-[#a37c32]" />
            </div>

            <h3 className="mt-4 text-[13px] font-bold text-slate-800">
              Belum ada riwayat ditemukan
            </h3>

            <p className="mt-1.5 text-[9px] leading-relaxed text-slate-400">
              Coba ubah filter pencarian atau mulailah menebar
              kebaikan bersama {SITE_NAME}.
            </p>

            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 bg-[#073f2e] px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#052e21] transition"
            >
              Mulai Berdonasi
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

          </section>
        ) : (
          <section className="space-y-2.5">

            {filteredDonations.map((d: any) => {
              const status = (
                d.status || 'pending'
              ).toLowerCase();

              const isPending =
                status === 'pending' ||
                status === 'unpaid';

              const isSuccessful =
                successfulStatuses.includes(
                  status
                );

              return (
                <article
                  key={d.id}
                  className="group bg-white border-y border-slate-200/70 p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#073f2e]/40 transition-all"
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <span className="inline-flex items-center bg-[#f7f2e7] border border-[#eadfca] px-2.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-[#98752d]">
                        {d.category ||
                          'Kemanusiaan'}
                      </span>

                      <h3 className="mt-1.5 text-[12px] font-bold leading-snug text-slate-800">
                        {d.program_name ||
                          d.programTitle ||
                          'Sedekah Umum BMA'}
                      </h3>

                    </div>

                    {isPending ? (
                      <span className="shrink-0 inline-flex items-center gap-1 bg-[#fff8e9] border border-[#f0dfb7] px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-[#a37c32]">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    ) : isSuccessful ? (
                      <span className="shrink-0 inline-flex items-center gap-1 bg-[#f0f8f4] border border-[#d6ebe0] px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        Berhasil
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex bg-slate-50 border border-slate-200 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-slate-500">
                        {d.status ||
                          'Diproses'}
                      </span>
                    )}

                  </div>

                  {/* AMOUNT */}
                  <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-2.5">

                    <div>
                      <p className="text-[7px] uppercase tracking-[0.18em] font-bold text-slate-400">
                        Nominal Donasi
                      </p>

                      <p className="mt-0.5 text-[15px] font-bold tracking-tight text-[#073f2e]">
                        Rp{' '}
                        {Number(
                          d.amount || 0
                        ).toLocaleString(
                          'id-ID'
                        )}
                      </p>
                    </div>

                    <div className="text-right">

                      <p className="text-[7px] uppercase tracking-wider font-bold text-slate-400">
                        Tanggal
                      </p>

                      <p className="mt-0.5 text-[9px] font-semibold text-slate-500">
                        {new Date(
                          d.created_at
                        ).toLocaleDateString(
                          'id-ID',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </p>

                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="mt-3 flex items-center justify-between gap-2 pt-1">

                    <button
                      onClick={() =>
                        setSelectedDonation(d)
                      }
                      className="text-[8px] font-bold uppercase tracking-wider text-slate-400 hover:text-[#073f2e] transition cursor-pointer"
                    >
                      Lihat Detail
                    </button>

                    <div className="flex items-center gap-2">

                      {isPending &&
                        d.payment_url && (
                          <a
                            href={
                              d.payment_url
                            }
                            className="inline-flex items-center gap-1 bg-[#073f2e] hover:bg-[#052e21] text-white px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider transition shadow-sm"
                          >
                            Bayar
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        )}

                      {!isPending && (
                        <Link
                          href={`/campaign/${
                            d.slug || ''
                          }`}
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider transition"
                        >
                          Donasi Lagi
                        </Link>
                      )}

                    </div>

                  </div>

                </article>
              );
            })}

          </section>
        )}

        {/* =====================================================
            BRAND FOOTER
        ===================================================== */}
        <div className="pt-2 text-center pb-2">
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {SITE_NAME}
          </p>

          <p className="mt-0.5 text-[7px] text-slate-400">
            {SITE_DOMAIN} • {SITE_LOCATION}
          </p>
        </div>

      </div>

      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-[#071521]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white border border-slate-200 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">

            <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#dfc27e] to-[#a37c32]" />

            <div className="p-4">

              {/* MODAL HEADER */}
              <div className="flex items-start justify-between gap-3">

                <div>

                  <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-slate-400">
                    Rincian Donasi {SITE_SHORT_NAME}
                  </p>

                  <h3 className="mt-0.5 text-[14px] font-bold text-slate-800">
                    Rincian Transaksi
                  </h3>

                </div>

                <button
                  onClick={() =>
                    setSelectedDonation(null)
                  }
                  aria-label="Tutup rincian transaksi"
                  className="w-8 h-8 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>

              {/* PROGRAM HERO */}
              <div className="mt-4 bg-[#073f2e] p-4 text-white">

                <p className="text-[7px] uppercase tracking-[0.18em] font-bold text-[#d7b66a]">
                  Program {SITE_NAME}
                </p>

                <p className="mt-1 text-[12px] leading-relaxed font-bold text-white">
                  {selectedDonation.program_name ||
                    selectedDonation.programTitle ||
                    'Sedekah Umum BMA'}
                </p>

                <div className="mt-3.5">

                  <p className="text-[7px] uppercase tracking-wider text-slate-300">
                    Nominal
                  </p>

                  <p className="mt-0.5 text-[18px] font-bold text-white">
                    Rp{' '}
                    {Number(
                      selectedDonation.amount || 0
                    ).toLocaleString(
                      'id-ID'
                    )}
                  </p>

                </div>

                <div className="mt-3 border-t border-white/10 pt-2.5">
                  <p className="text-[7px] uppercase tracking-[0.15em] font-semibold text-[#d7b66a]">
                    {SITE_DOMAIN} • {SITE_LOCATION}
                  </p>
                </div>

              </div>

              {/* DETAILS */}
              <div className="mt-3.5 border border-slate-200/80 bg-white overflow-hidden">

                <div className="divide-y divide-slate-100">

                  <div className="flex justify-between gap-4 px-3.5 py-2.5">

                    <span className="text-[9px] text-slate-400">
                      Status
                    </span>

                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      {selectedDonation.status ||
                        'Berhasil'}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4 px-3.5 py-2.5">

                    <span className="text-[9px] text-slate-400">
                      Metode Pembayaran
                    </span>

                    <span className="text-[9px] font-bold uppercase text-slate-700 text-right">
                      {selectedDonation.payment_method ||
                        'QRIS / VA'}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4 px-3.5 py-2.5">

                    <span className="text-[9px] text-slate-400">
                      Waktu Transaksi
                    </span>

                    <span className="text-[9px] font-semibold text-slate-700 text-right">
                      {new Date(
                        selectedDonation.created_at
                      ).toLocaleString(
                        'id-ID'
                      )}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4 px-3.5 py-2.5">

                    <span className="text-[9px] text-slate-400">
                      Invoice ID
                    </span>

                    <span className="font-mono text-[8px] text-slate-600 text-right break-all">
                      {selectedDonation.invoice_id ||
                        selectedDonation.id}
                    </span>

                  </div>

                </div>

              </div>

              {/* BUTTONS */}
              <div className="mt-3.5 grid grid-cols-2 gap-2">

                <button
                  onClick={() =>
                    alert(
                      'Fitur unduh kuitansi PDF BMA segera hadir.'
                    )
                  }
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 text-[8px] uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  Kuitansi
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.origin
                    );

                    alert(
                      `Tautan ${SITE_DOMAIN} berhasil disalin untuk dibagikan!`
                    );
                  }}
                  className="bg-[#073f2e] hover:bg-[#052e21] text-white font-bold py-2.5 text-[8px] uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  Bagikan profil
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}