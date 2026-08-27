'use client';

import React, { useMemo, useState } from 'react';
import {
  BriefcaseBusiness,
  CircleDollarSign,
  Coins,
  Info,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calculator,
} from 'lucide-react';

type ZakatType = 'penghasilan' | 'maal' | 'emas';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';

export default function ZakatCalculator() {
  const [activeTab, setActiveTab] =
    useState<ZakatType>('penghasilan');

  const [penghasilan, setPenghasilan] =
    useState('');

  const [bonus, setBonus] =
    useState('');

  const [tabungan, setTabungan] =
    useState('');

  const [investasi, setInvestasi] =
    useState('');

  const [beratEmas, setBeratEmas] =
    useState('');

  // ============================================================
  // KONFIGURASI NISHAB
  // ============================================================
  const HARGA_EMAS = 1400000;
  const NISHAB_EMAS_GRAM = 85;

  const NISHAB_TAHUNAN =
    NISHAB_EMAS_GRAM * HARGA_EMAS;

  const NISHAB_BULANAN =
    Math.round(
      NISHAB_TAHUNAN / 12
    );

  // ============================================================
  // FORMAT RUPIAH
  // ============================================================
  const formatRupiah = (
    value: string
  ) => {
    const raw =
      value.replace(/[^0-9]/g, '');

    return raw
      ? Number(
          raw
        ).toLocaleString('id-ID')
      : '';
  };

  const getCleanNumber = (
    value: string
  ) =>
    Number(
      value.replace(/\./g, '')
    ) || 0;

  // ============================================================
  // KALKULASI
  // ============================================================
  const calculation = useMemo(() => {
    let totalWajibZakat = 0;
    let isWajib = false;
    let deskripsiNishab = '';
    let nilaiDasar = 0;

    if (
      activeTab === 'penghasilan'
    ) {
      nilaiDasar =
        getCleanNumber(
          penghasilan
        ) +
        getCleanNumber(
          bonus
        );

      isWajib =
        nilaiDasar >=
        NISHAB_BULANAN;

      totalWajibZakat =
        isWajib
          ? Math.round(
              nilaiDasar * 0.025
            )
          : 0;

      deskripsiNishab =
        `Nishab zakat penghasilan bulanan adalah Rp ${NISHAB_BULANAN.toLocaleString(
          'id-ID'
        )}, setara 1/12 dari nishab 85 gram emas.`;
    }

    if (activeTab === 'maal') {
      nilaiDasar =
        getCleanNumber(
          tabungan
        ) +
        getCleanNumber(
          investasi
        );

      isWajib =
        nilaiDasar >=
        NISHAB_TAHUNAN;

      totalWajibZakat =
        isWajib
          ? Math.round(
              nilaiDasar * 0.025
            )
          : 0;

      deskripsiNishab =
        `Nishab zakat maal tahunan adalah Rp ${NISHAB_TAHUNAN.toLocaleString(
          'id-ID'
        )}, setara 85 gram emas.`;
    }

    if (activeTab === 'emas') {
      const berat =
        Number(beratEmas) || 0;

      nilaiDasar =
        berat * HARGA_EMAS;

      isWajib =
        berat >=
        NISHAB_EMAS_GRAM;

      totalWajibZakat =
        isWajib
          ? Math.round(
              nilaiDasar * 0.025
            )
          : 0;

      deskripsiNishab =
        `Nishab zakat emas simpanan adalah ${NISHAB_EMAS_GRAM} gram emas.`;
    }

    return {
      totalWajibZakat,
      isWajib,
      deskripsiNishab,
      nilaiDasar,
    };
  }, [
    activeTab,
    penghasilan,
    bonus,
    tabungan,
    investasi,
    beratEmas,
    NISHAB_BULANAN,
    NISHAB_TAHUNAN,
  ]);

  const {
    totalWajibZakat,
    isWajib,
    deskripsiNishab,
    nilaiDasar,
  } = calculation;

  // ============================================================
  // REDIRECT ZAKAT
  // ============================================================
  const handleRedirectZakat =
    () => {
      if (
        totalWajibZakat <= 0
      ) {
        return;
      }

      window.location.href =
        `/campaign/zakat-maal-dan-penghasilan?amount=${totalWajibZakat}`;
    };

  // ============================================================
  // TAB CONFIG
  // ============================================================
  const tabs = [
    {
      id: 'penghasilan' as ZakatType,
      title: 'Penghasilan',
      shortTitle: 'Penghasilan',
      icon: BriefcaseBusiness,
    },
    {
      id: 'maal' as ZakatType,
      title: 'Maal',
      shortTitle: 'Maal',
      icon: CircleDollarSign,
    },
    {
      id: 'emas' as ZakatType,
      title: 'Emas',
      shortTitle: 'Emas',
      icon: Coins,
    },
  ];

  return (
    <div className="w-full space-y-4">

      {/* =====================================================
          TAB MENU
      ====================================================== */}
      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1">

        {tabs.map((tab) => {
          const Icon = tab.icon;

          const active =
            activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id
                )
              }
              className={`rounded-xl px-2 py-3 transition ${
                active
                  ? 'bg-white text-[#102a43] shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="flex flex-col items-center gap-1.5">

                <Icon
                  className={`w-4 h-4 ${
                    active
                      ? 'text-[#a37c32]'
                      : 'text-slate-400'
                  }`}
                />

                <span className="text-[8px] font-bold uppercase tracking-[0.12em]">
                  {tab.shortTitle}
                </span>

              </div>
            </button>
          );
        })}

      </div>

      {/* =====================================================
          NISHAB INFO
      ====================================================== */}
      <div className="rounded-2xl border border-[#eadfca] bg-[#f7f2e7]/60 p-4">

        <div className="flex items-start gap-3">

          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#a37c32]" />

          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#98752d]">
              Informasi Nishab
            </p>

            <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
              {deskripsiNishab}
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          FORM
      ====================================================== */}
      <div className="space-y-4">

        {/* ===================================================
            PENGHASILAN
        =================================================== */}
        {activeTab ===
          'penghasilan' && (
          <>
            <div>

              <label className="block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Pendapatan Bulanan
              </label>

              <p className="mt-1 text-[8px] text-slate-400">
                Gaji pokok atau pendapatan utama
              </p>

              <div className="relative mt-2">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  Rp
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="10.000.000"
                  value={
                    penghasilan
                  }
                  onChange={(e) =>
                    setPenghasilan(
                      formatRupiah(
                        e.target
                          .value
                      )
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-[#f8f8f6] pl-11 pr-4 text-[11px] font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#a37c32] focus:bg-white focus:ring-4 focus:ring-[#a37c32]/8"
                />

              </div>

            </div>

            <div>

              <label className="block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Bonus / Pendapatan Lain
              </label>

              <p className="mt-1 text-[8px] text-slate-400">
                Opsional
              </p>

              <div className="relative mt-2">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  Rp
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={bonus}
                  onChange={(e) =>
                    setBonus(
                      formatRupiah(
                        e.target
                          .value
                      )
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-[#f8f8f6] pl-11 pr-4 text-[11px] font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#a37c32] focus:bg-white focus:ring-4 focus:ring-[#a37c32]/8"
                />

              </div>

            </div>
          </>
        )}

        {/* ===================================================
            MAAL
        =================================================== */}
        {activeTab ===
          'maal' && (
          <>
            <div>

              <label className="block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Uang Simpanan
              </label>

              <p className="mt-1 text-[8px] text-slate-400">
                Tabungan, deposito, dan uang tunai
              </p>

              <div className="relative mt-2">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  Rp
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="150.000.000"
                  value={tabungan}
                  onChange={(e) =>
                    setTabungan(
                      formatRupiah(
                        e.target
                          .value
                      )
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-[#f8f8f6] pl-11 pr-4 text-[11px] font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#a37c32] focus:bg-white focus:ring-4 focus:ring-[#a37c32]/8"
                />

              </div>

            </div>

            <div>

              <label className="block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Investasi & Aset Likuid
              </label>

              <p className="mt-1 text-[8px] text-slate-400">
                Saham, reksa dana, emas batangan, dan aset sejenis
              </p>

              <div className="relative mt-2">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  Rp
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={investasi}
                  onChange={(e) =>
                    setInvestasi(
                      formatRupiah(
                        e.target
                          .value
                      )
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-[#f8f8f6] pl-11 pr-4 text-[11px] font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#a37c32] focus:bg-white focus:ring-4 focus:ring-[#a37c32]/8"
                />

              </div>

            </div>
          </>
        )}

        {/* ===================================================
            EMAS
        =================================================== */}
        {activeTab ===
          'emas' && (
          <div>

            <label className="block text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
              Berat Emas Simpanan
            </label>

            <p className="mt-1 text-[8px] text-slate-400">
              Total emas yang dimiliki dalam gram
            </p>

            <div className="relative mt-2">

              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="90"
                value={beratEmas}
                onChange={(e) =>
                  setBeratEmas(
                    e.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-[#f8f8f6] px-4 pr-16 text-[11px] font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#a37c32] focus:bg-white focus:ring-4 focus:ring-[#a37c32]/8"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Gram
              </span>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          RESULT CARD
      ====================================================== */}
      <div className="relative overflow-hidden rounded-[26px] bg-[#102a43] shadow-[0_14px_40px_rgba(16,42,67,0.14)]">

        <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full border border-white/8" />

        <div className="relative z-10 p-5">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                <Calculator className="h-4 w-4 text-[#d7b66a]" />
              </div>

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#d7b66a]">
                  Hasil Perhitungan
                </p>

                <p className="mt-0.5 text-[11px] font-bold text-white">
                  Estimasi Zakat Anda
                </p>

              </div>

            </div>

            <ShieldCheck className="h-4 w-4 text-[#d7b66a]" />

          </div>

          <div className="mt-5">

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Nilai Harta Dihitung
            </p>

            <p className="mt-1 text-[11px] font-semibold text-slate-300">
              Rp{' '}
              {nilaiDasar.toLocaleString(
                'id-ID'
              )}
            </p>

          </div>

          <div className="mt-4 border-t border-white/10 pt-4">

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Besaran Zakat
            </p>

            <p className="mt-2 text-[28px] leading-none font-bold tracking-tight text-white">
              Rp{' '}
              {totalWajibZakat.toLocaleString(
                'id-ID'
              )}
            </p>

            <p className="mt-2 text-[8px] text-slate-400">
              Perhitungan 2,5%
            </p>

          </div>

          <div className="mt-4">

            {isWajib ? (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/10 p-3">

                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />

                <div>

                  <p className="text-[9px] font-bold text-emerald-200">
                    Telah Mencapai Nishab
                  </p>

                  <p className="mt-1 text-[8px] leading-relaxed text-emerald-100/70">
                    Berdasarkan data yang dimasukkan, harta Anda telah
                    mencapai batas nishab pada kalkulator ini.
                  </p>

                </div>

              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3">

                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#d7b66a]" />

                <p className="text-[8px] leading-relaxed text-slate-300">
                  Nilai yang dimasukkan belum mencapai batas nishab
                  yang digunakan pada kalkulator ini.
                </p>

              </div>
            )}

          </div>

        </div>

        <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#dfc27e] to-[#a37c32]" />

      </div>

      {/* =====================================================
          ACTION
      ====================================================== */}
      <button
        type="button"
        onClick={
          handleRedirectZakat
        }
        disabled={
          totalWajibZakat <= 0
        }
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#102a43] text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#102a43]/10 transition hover:bg-[#173d5d] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
      >
        <Sparkles className="h-4 w-4" />

        Tunaikan Zakat Sekarang

        <ArrowRight className="h-4 w-4" />
      </button>

      {/* =====================================================
          FOOTER NOTE
      ====================================================== */}
      <div className="text-center">

        <p className="text-[7px] leading-relaxed text-slate-400">
          Kalkulator zakat digital {SITE_NAME} • {SITE_DOMAIN}
        </p>

      </div>

    </div>
  );
}