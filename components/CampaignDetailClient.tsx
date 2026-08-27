// components/CampaignDetailClient.tsx
'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import { PortableText } from '@portabletext/react';

import {
  ArrowLeft,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Clock3,
  Users,
  ShieldCheck,
  Calculator,
  X,
  ChevronRight,
} from 'lucide-react';

import { supabase } from '@/lib/supabase/client';

// ============================================================
// IDENTITAS BMA
// ============================================================

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_DOMAIN = 'bma.or.id';

// ============================================================
// TYPES
// ============================================================

interface CampaignDetailClientProps {
  slug: string;
  referral: string | null;
}

interface Donor {
  name?: string;
  date?: string;
  amount?: number;
}

interface Report {
  title?: string;
  date?: string;
  content?: any;
}

interface Program {
  _id?: string;
  id?: string;

  slug?: string;
  title?: string;
  image?: string;
  category?: string;

  description?: any;

  collectedAmount?: number;
  collectedRaw?: number;

  targetAmount?: number;
  targetRaw?: number;

  daysLeft?: number;

  donors?: Donor[];
  reports?: Report[];
}

interface Profile {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  phone?: string;
}

// ============================================================
// HELPERS
// ============================================================

function formatRupiah(
  value: number
): string {
  return Number(
    value || 0
  ).toLocaleString('id-ID');
}

function cleanNumber(
  value: string | number
): number {
  return (
    Number(
      String(value || '')
        .replace(/[^0-9]/g, '')
    ) || 0
  );
}

function normalizeSlug(
  value?: string
): string {
  return decodeURIComponent(
    value || ''
  )
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// ============================================================
// PORTABLE TEXT STYLE
// ============================================================

const portableTextComponents = {
  types: {
    image: ({
      value,
    }: any) => {
      const imageUrl =
        value?.asset?.url;

      if (!imageUrl) {
        return null;
      }

      return (
        <div className="my-5 space-y-2">

          <div className="aspect-[16/9] w-full overflow-hidden border border-[#d7d7d7] bg-[#e5e5e5]">

            <img
              src={imageUrl}
              alt={
                typeof value?.alt ===
                'string'
                  ? value.alt
                  : 'Gambar Program BMA'
              }
              className="h-full w-full object-cover"
            />

          </div>

          {typeof value?.caption ===
            'string' &&
            value.caption && (
              <p className="text-center text-[10px] italic leading-relaxed text-[#888888]">
                {value.caption}
              </p>
            )}

        </div>
      );
    },
  },

  block: {
    normal: ({
      children,
    }: any) => (
      <p className="mb-5 text-[15px] leading-[1.85] text-[#4a4a4a] sm:text-base">
        {children}
      </p>
    ),

    h1: ({
      children,
    }: any) => (
      <h2 className="mb-3 mt-7 text-xl font-bold leading-snug tracking-tight text-[#3a3a3a]">
        {children}
      </h2>
    ),

    h2: ({
      children,
    }: any) => (
      <h2 className="mb-3 mt-6 text-lg font-bold leading-snug text-[#3f3f3f]">
        {children}
      </h2>
    ),

    h3: ({
      children,
    }: any) => (
      <h3 className="mb-2 mt-5 text-base font-bold text-[#444444]">
        {children}
      </h3>
    ),

    blockquote: ({
      children,
    }: any) => (
      <blockquote className="my-5 border-l-4 border-[#0b6b45] bg-[#eef6f1] px-4 py-3 text-sm italic leading-relaxed text-[#555555]">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({
      children,
    }: any) => (
      <ul className="mb-5 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-[#4a4a4a]">
        {children}
      </ul>
    ),

    number: ({
      children,
    }: any) => (
      <ol className="mb-5 list-decimal space-y-2 pl-6 text-[15px] leading-relaxed text-[#4a4a4a]">
        {children}
      </ol>
    ),
  },
};

// ============================================================
// 1. HEADER DETAIL PROGRAM
// ============================================================

function DetailHeader({
  title = 'Program Donasi',
  onOpenShare,
}: {
  title?: string;
  onOpenShare: () => void;
}) {
  const router =
    useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#043524] bg-[#073f2e] shadow-[0_2px_12px_rgba(0,0,0,0.12)]">

      <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between px-3">

        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>

        {/* TITLE */}
        <div className="min-w-0 flex-1 px-3 text-center">

          <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/80">
            {SITE_DOMAIN}
          </p>

          <h1 className="truncate text-[14px] font-bold tracking-tight text-white sm:text-[15px]">
            {title}
          </h1>

        </div>

        {/* SHARE */}
        <button
          type="button"
          onClick={
            onOpenShare
          }
          className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Bagikan"
        >
          <Share2 className="h-4.5 w-4.5" />
        </button>

      </div>

    </header>
  );
}

// ============================================================
// 2. INLINE ZAKAT CALCULATOR
// ============================================================

function EmbeddedZakatCalculator({
  onApplyAmount,
}: {
  onApplyAmount: (
    value: string
  ) => void;
}) {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<
      'penghasilan' |
      'maal' |
      'emas'
    >('penghasilan');

  const [
    input1,
    setInput1,
  ] = useState('');

  const [
    input2,
    setInput2,
  ] = useState('');

  const HARGA_EMAS =
    1400000;

  const NISHAB_TAHUNAN =
    85 * HARGA_EMAS;

  const NISHAB_BULANAN =
    Math.round(
      NISHAB_TAHUNAN /
        12
    );

  const formatInput =
    (value: string) => {
      const raw =
        value.replace(
          /[^0-9]/g,
          ''
        );

      return raw
        ? Number(
            raw
          ).toLocaleString(
            'id-ID'
          )
        : '';
    };

  const getNum = (
    value: string
  ) =>
    Number(
      value.replace(
        /\./g,
        ''
      )
    ) || 0;

  let totalZakat = 0;
  let isWajib = false;
  let nishabText = '';

  if (
    activeTab ===
    'penghasilan'
  ) {
    const total =
      getNum(input1) +
      getNum(input2);

    isWajib =
      total >=
      NISHAB_BULANAN;

    totalZakat =
      isWajib
        ? Math.round(
            total * 0.025
          )
        : 0;

    nishabText =
      `Nishab bulanan sekitar Rp ${formatRupiah(
        NISHAB_BULANAN
      )}.`;
  }

  if (
    activeTab === 'maal'
  ) {
    const total =
      getNum(input1) +
      getNum(input2);

    isWajib =
      total >=
      NISHAB_TAHUNAN;

    totalZakat =
      isWajib
        ? Math.round(
            total * 0.025
          )
        : 0;

    nishabText =
      `Nishab tahunan sekitar Rp ${formatRupiah(
        NISHAB_TAHUNAN
      )}.`;
  }

  if (
    activeTab === 'emas'
  ) {
    const weight =
      Number(input1) ||
      0;

    isWajib =
      weight >= 85;

    totalZakat =
      isWajib
        ? Math.round(
            weight *
              HARGA_EMAS *
              0.025
          )
        : 0;

    nishabText =
      'Nishab emas adalah 85 gram.';
  }

  const switchTab = (
    tab:
      | 'penghasilan'
      | 'maal'
      | 'emas'
  ) => {
    setActiveTab(tab);
    setInput1('');
    setInput2('');
  };

  return (
    <section className="my-5 overflow-hidden border border-[#d4d4d4] bg-white">

      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-[#06452f] bg-[#073f2e] px-4 py-3.5">

        <Calculator className="h-5 w-5 text-emerald-200" />

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-200/80">
            Fasilitas BMA
          </p>

          <h3 className="text-[14px] font-bold text-white">
            Kalkulator Zakat
          </h3>

        </div>

      </div>

      {/* TABS */}
      <div className="grid grid-cols-3 border-b border-[#d8e2dc] bg-[#eef4f0]">

        {[
          {
            id:
              'penghasilan',
            label:
              'Penghasilan',
          },
          {
            id: 'maal',
            label: 'Maal',
          },
          {
            id: 'emas',
            label: 'Emas',
          },
        ].map(
          (tab) => (
            <button
              key={
                tab.id
              }
              type="button"
              onClick={() =>
                switchTab(
                  tab.id as
                    | 'penghasilan'
                    | 'maal'
                    | 'emas'
                )
              }
              className={`border-r border-[#d4d4d4] px-2 py-3 text-[11px] font-bold uppercase tracking-[0.1em] transition last:border-r-0 ${
                activeTab ===
                tab.id
                  ? 'bg-white text-[#073f2e] border-b-[3px] border-b-[#0b6b45]'
                  : 'text-[#65736b] hover:bg-[#e5eee9]'
              }`}
            >
              {tab.label}
            </button>
          )
        )}

      </div>

      {/* FORM */}
      <div className="space-y-4 p-4">

        {activeTab !==
        'emas' ? (
          <>
            <div>

              <label className="mb-1.5 block text-[10px] font-semibold text-[#666666]">
                {activeTab ===
                'maal'
                  ? 'Tabungan / Harta Tersimpan'
                  : 'Penghasilan Utama'}
              </label>

              <div className="relative">

                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#999999]">
                  Rp
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    input1
                  }
                  onChange={(
                    e
                  ) =>
                    setInput1(
                      formatInput(
                        e.target
                          .value
                      )
                    )
                  }
                  placeholder="0"
                  className="w-full border border-[#cccccc] bg-[#fafafa] py-3 pl-10 pr-3 text-sm font-semibold text-[#444444] outline-none transition focus:border-[#999999] focus:bg-white"
                />

              </div>

            </div>

            <div>

              <label className="mb-1.5 block text-[10px] font-semibold text-[#666666]">
                {activeTab ===
                'maal'
                  ? 'Investasi / Aset Likuid'
                  : 'Tunjangan / Bonus / THR'}
              </label>

              <div className="relative">

                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#999999]">
                  Rp
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    input2
                  }
                  onChange={(
                    e
                  ) =>
                    setInput2(
                      formatInput(
                        e.target
                          .value
                      )
                    )
                  }
                  placeholder="0"
                  className="w-full border border-[#cccccc] bg-[#fafafa] py-3 pl-10 pr-3 text-sm font-semibold text-[#444444] outline-none transition focus:border-[#999999] focus:bg-white"
                />

              </div>

            </div>
          </>
        ) : (
          <div>

            <label className="mb-1.5 block text-[10px] font-semibold text-[#666666]">
              Total Berat Emas
            </label>

            <div className="relative">

              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  input1
                }
                onChange={(
                  e
                ) =>
                  setInput1(
                    e.target
                      .value
                  )
                }
                placeholder="Contoh: 90"
                className="w-full border border-[#cccccc] bg-[#fafafa] py-3 pl-3 pr-16 text-sm font-semibold text-[#444444] outline-none transition focus:border-[#999999] focus:bg-white"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-[#888888]">
                gram
              </span>

            </div>

          </div>
        )}

        {/* NISHAB */}
        <div className="border border-[#d5e1da] bg-[#eef5f1] px-3 py-3">

          <p className="text-[11px] leading-relaxed text-[#777777]">
            {nishabText}
          </p>

        </div>

        {/* RESULT */}
        <div className="border border-[#06452f] bg-[#073f2e] p-5 text-center shadow-sm">

          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200/80">
            Estimasi Zakat
          </span>

          <strong className="mt-1.5 block text-2xl font-extrabold text-white">
            Rp{' '}
            {formatRupiah(
              totalZakat
            )}
          </strong>

          <p className="mt-1.5 text-[11px] text-emerald-100/80">
            {isWajib
              ? 'Perhitungan telah mencapai batas nishab.'
              : 'Nilai belum mencapai batas nishab.'}
          </p>

          <button
            type="button"
            disabled={
              totalZakat <=
              0
            }
            onClick={() =>
              onApplyAmount(
                formatRupiah(
                  totalZakat
                )
              )
            }
            className="mt-4 w-full border border-[#d3b300] bg-[#ffd600] py-3.5 text-[11px] font-bold uppercase tracking-[0.13em] text-[#26352d] transition hover:bg-[#f0ca00] disabled:cursor-not-allowed disabled:border-[#9aa69f] disabled:bg-[#9aa69f] disabled:text-white"
          >
            Gunakan Nominal Ini
          </button>

        </div>

        <p className="text-center text-[11px] leading-relaxed text-[#999999]">
          Kalkulator merupakan estimasi awal. Ketentuan zakat tetap memperhatikan nishab, haul, dan kondisi harta.
        </p>

      </div>

    </section>
  );
}

// ============================================================
// 3. DONATION FORM
// ============================================================

const DonationFormFields = ({
  profile,
  setProfile,
  amount,
  setAmount,
  paymentMethod,
  setPaymentMethod,
  handleDonate,
  handleInlineSavePhone,
  submitting,
  isLoggedIn,
  inlinePhone,
  setInlinePhone,
  savingPhone,
}: any) => {
  const PRESET_AMOUNTS =
    [
      10000,
      15000,
      25000,
      50000,
      100000,
      250000,
    ];

  const cleanAmountNum =
    cleanNumber(amount);

  const hasPhone =
    Boolean(
      profile?.phone &&
        String(
          profile.phone
        ).trim().length >=
          9
    );

  return (
    <div className="space-y-5 text-left">

      {/* NOMINAL */}
      <div>

        <label className="mb-2 block text-[11px] font-bold text-[#454545]">
          Pilih Nominal Donasi
        </label>

        <div className="grid grid-cols-3 gap-2">

          {PRESET_AMOUNTS.map(
            (value) => {
              const selected =
                cleanAmountNum ===
                value;

              return (
                <button
                  key={
                    value
                  }
                  type="button"
                  onClick={() =>
                    setAmount(
                      formatRupiah(
                        value
                      )
                    )
                  }
                  className={`border px-2 py-3 text-[10px] font-bold transition ${
                    selected
                      ? 'border-[#0b6b45] bg-[#e8f2ec] text-[#073f2e]'
                      : 'border-[#d4ddd8] bg-white text-[#59665f] hover:bg-[#f0f5f2]'
                  }`}
                >
                  Rp{' '}
                  {value >=
                  1000000
                    ? `${value / 1000000}jt`
                    : `${value / 1000}rb`}
                </button>
              );
            }
          )}

        </div>

      </div>

      {/* CUSTOM NOMINAL */}
      <div>

        <label className="mb-1.5 block text-[10px] font-semibold text-[#666666]">
          Masukkan Donasi Lainnya
        </label>

        <div className="relative">

          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#999999]">
            Rp
          </span>

          <input
            type="text"
            inputMode="numeric"
            placeholder="Minimal 1.000"
            value={amount}
            onChange={(
              e
            ) => {
              const raw =
                e.target.value.replace(
                  /[^0-9]/g,
                  ''
                );

              setAmount(
                raw
                  ? Number(
                      raw
                    ).toLocaleString(
                      'id-ID'
                    )
                  : ''
              );
            }}
            className="w-full border border-[#cccccc] bg-[#fafafa] py-3 pl-10 pr-3.5 text-sm font-bold text-[#444444] outline-none transition focus:border-[#999999] focus:bg-white"
          />

        </div>

      </div>

      {/* PAYMENT */}
      <div>

        <label className="mb-1.5 block text-[10px] font-semibold text-[#666666]">
          Metode Pembayaran
        </label>

        <select
          value={
            paymentMethod
          }
          onChange={(
            e
          ) =>
            setPaymentMethod(
              e.target.value
            )
          }
          className="w-full border border-[#cccccc] bg-[#fafafa] px-3.5 py-3 text-xs font-semibold text-[#555555] outline-none focus:border-[#999999] focus:bg-white"
        >
          <option value="qris">
            QRIS — E-Wallet / Mobile Banking
          </option>

          <option value="bni_va">
            Virtual Account BNI
          </option>

          <option value="bri_va">
            Virtual Account BRI
          </option>

          <option value="mandiri_va">
            Virtual Account Mandiri
          </option>

          <option value="permata_va">
            Virtual Account Permata
          </option>
        </select>

      </div>

      <div className="border-t border-[#dddddd]" />

      {/* ====================================================
          LOGIN STATUS
      ==================================================== */}

      {isLoggedIn ? (
        hasPhone ? (
          <div className="flex items-center justify-between gap-3 border border-[#cdded4] bg-[#edf5f0] p-4">

            <div className="min-w-0">

              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#777777]">
                Akun Terverifikasi
              </span>

              <p className="mt-1 truncate text-[11px] font-bold text-[#444444]">
                {profile?.name ||
                  'Dermawan'}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-[#777777]">
                WhatsApp:{' '}
                {profile?.phone}
              </p>

            </div>

            <ShieldCheck className="h-5 w-5 shrink-0 text-[#666666]" />

          </div>
        ) : (
          <div className="space-y-3 border border-[#cdded4] bg-[#edf5f0] p-4">

            <div>

              <p className="text-[11px] font-bold text-[#444444]">
                Lengkapi Nomor WhatsApp
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-[#777777]">
                Nomor digunakan untuk informasi transaksi, kuitansi, dan laporan program.
              </p>

            </div>

            <div className="flex gap-2">

              <input
                type="tel"
                placeholder="081234567890"
                value={
                  inlinePhone
                }
                onChange={(
                  e
                ) =>
                  setInlinePhone(
                    e.target
                      .value
                  )
                }
                className="min-w-0 flex-1 border border-[#cccccc] bg-white px-3 py-2.5 text-xs font-semibold text-[#444444] outline-none focus:border-[#999999]"
              />

              <button
                type="button"
                onClick={
                  handleInlineSavePhone
                }
                disabled={
                  savingPhone
                }
                className="shrink-0 bg-[#073f2e] px-4 py-2.5 text-[11px] font-bold uppercase text-white transition hover:bg-[#052f22] disabled:opacity-50"
              >
                {savingPhone
                  ? 'Menyimpan'
                  : 'Simpan'}
              </button>

            </div>

          </div>
        )
      ) : (
        <div className="space-y-4">

          <div>

            <label className="mb-1.5 block text-[10px] font-semibold text-[#666666]">
              Nama Donatur
            </label>

            <input
              type="text"
              placeholder="Hamba Allah (boleh kosong)"
              value={
                profile?.name ||
                ''
              }
              onChange={(
                e
              ) =>
                setProfile(
                  (
                    previous: any
                  ) => ({
                    ...previous,
                    name:
                      e.target
                        .value,
                  })
                )
              }
              className="w-full border border-[#cccccc] bg-[#fafafa] px-3.5 py-3 text-sm text-[#444444] outline-none focus:border-[#999999] focus:bg-white"
            />

          </div>

          <div>

            <label className="mb-1.5 block text-[10px] font-semibold text-[#666666]">
              Nomor WhatsApp *
            </label>

            <input
              type="tel"
              placeholder="081234567890"
              value={
                profile?.phone ||
                ''
              }
              onChange={(
                e
              ) =>
                setProfile(
                  (
                    previous: any
                  ) => ({
                    ...previous,
                    phone:
                      e.target
                        .value,
                  })
                )
              }
              className="w-full border border-[#cccccc] bg-[#fafafa] px-3.5 py-3 text-sm text-[#444444] outline-none focus:border-[#999999] focus:bg-white"
            />

          </div>

        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={
          handleDonate
        }
        disabled={
          submitting ||
          (isLoggedIn &&
            !hasPhone)
        }
        className="flex w-full items-center justify-center gap-2 bg-[#d9232e] py-4 text-xs font-bold uppercase tracking-[0.13em] text-white shadow-sm transition hover:bg-[#c41f29] active:scale-[0.995] disabled:cursor-not-allowed disabled:bg-[#bdbdbd] sm:text-sm"
      >

        {submitting
          ? 'Memproses Tagihan...'
          : 'Lanjut Pembayaran'}

        {!submitting && (
          <ChevronRight className="h-4 w-4" />
        )}

      </button>

      <p className="text-center text-[10px] leading-relaxed text-[#999999]">
        Transaksi diproses melalui sistem pembayaran yang terintegrasi dengan {SITE_DOMAIN}.
      </p>

    </div>
  );
};

// ============================================================
// 4. MAIN COMPONENT
// ============================================================

export default function CampaignDetailClient({
  slug,
  referral,
}: CampaignDetailClientProps) {
  const [
    program,
    setProgram,
  ] =
    useState<Program | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    amount,
    setAmount,
  ] =
    useState('10.000');

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState('qris');

  const [
    profile,
    setProfile,
  ] =
    useState<Profile | null>(
      null
    );

  const [
    isLoggedIn,
    setIsLoggedIn,
  ] =
    useState(false);

  const [
    inlinePhone,
    setInlinePhone,
  ] = useState('');

  const [
    savingPhone,
    setSavingPhone,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    isMobileFormOpen,
    setIsMobileFormOpen,
  ] = useState(false);

  const [
    isShareModalOpen,
    setIsShareModalOpen,
  ] = useState(false);

  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<
      | 'cerita'
      | 'donatur'
      | 'laporan'
    >('cerita');

  // ==========================================================
  // USER PROFILE
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const {
          data: {
            session,
          },
        } =
          await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (!session) {
          setIsLoggedIn(
            false
          );

          setProfile({
            name: '',
            phone: '',
          });

          return;
        }

        const user =
          session.user;

        setIsLoggedIn(
          true
        );

        const meta =
          user.user_metadata ||
          {};

        const {
          data: prof,
        } =
          await supabase
            .from(
              'profiles'
            )
            .select('*')
            .eq(
              'id',
              user.id
            )
            .maybeSingle();

        if (!mounted) {
          return;
        }

        if (prof) {
          setProfile(
            prof
          );
        } else {
          setProfile({
            id:
              user.id,

            name:
              meta.full_name ||
              meta.name ||
              user.email?.split(
                '@'
              )[0] ||
              'Dermawan',

            email:
              user.email,

            avatar:
              meta.avatar_url ||
              meta.picture ||
              '',

            phone: '',
          });
        }
      } catch (
        error
      ) {
        console.error(
          'Profile load error:',
          error
        );

        if (mounted) {
          setIsLoggedIn(
            false
          );
        }
      }
    }

    loadProfile();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        () => {
          loadProfile();
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================================
  // SAVE PHONE
  // ==========================================================

  const handleInlineSavePhone =
    async () => {
      const clean =
        inlinePhone.replace(
          /[^0-9]/g,
          ''
        );

      if (
        clean.length < 9
      ) {
        alert(
          'Masukkan nomor WhatsApp yang valid.'
        );

        return;
      }

      setSavingPhone(true);

      try {
        const {
          data: {
            session,
          },
        } =
          await supabase.auth.getSession();

        if (
          !session?.user
        ) {
          throw new Error(
            'Sesi habis. Silakan login kembali.'
          );
        }

        const {
          error,
        } =
          await supabase
            .from(
              'profiles'
            )
            .update({
              phone: clean,
              updated_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              session.user.id
            );

        if (error) {
          throw error;
        }

        setProfile(
          (previous) => ({
            ...(previous ||
              {}),
            phone: clean,
          })
        );

        setInlinePhone('');

        alert(
          'Nomor WhatsApp berhasil disimpan.'
        );
      } catch (
        error: any
      ) {
        alert(
          `Gagal menyimpan: ${
            error?.message ||
            'Terjadi kesalahan.'
          }`
        );
      } finally {
        setSavingPhone(
          false
        );
      }
    };

  // ==========================================================
  // DONATION CHECKOUT
  // ==========================================================

  const handleDonate =
    async () => {
      const cleanAmount =
        cleanNumber(
          amount
        );

      if (
        !cleanAmount ||
        cleanAmount <
          1000
      ) {
        alert(
          'Masukkan nominal minimal Rp 1.000.'
        );

        return;
      }

      const activePhone =
        profile?.phone ||
        inlinePhone;

      const cleanPhone =
        String(
          activePhone ||
            ''
        ).replace(
          /[^0-9]/g,
          ''
        );

      if (
        cleanPhone.length <
        9
      ) {
        alert(
          'Nomor WhatsApp wajib diisi.'
        );

        return;
      }

      // ======================================================
      // PAKASIR PROJECT
      //
      // Tidak lagi fallback ke project web lama.
      // NEXT_PUBLIC_PAKASIR_PROJECT_SLUG wajib diisi
      // di environment Vercel untuk BMA.
      // ======================================================

      const projectSlug =
        process.env
          .NEXT_PUBLIC_PAKASIR_PROJECT_SLUG;

      if (
        !projectSlug
      ) {
        alert(
          'Konfigurasi payment gateway BMA belum lengkap. NEXT_PUBLIC_PAKASIR_PROJECT_SLUG belum disetel.'
        );

        return;
      }

      setSubmitting(true);

      try {
        const response =
          await fetch(
            '/api/checkout',
            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify(
                  {
                    slug:
                      program?.slug ||
                      slug,

                    donorName:
                      profile?.name?.trim() ||
                      'Hamba Allah',

                    donorPhone:
                      cleanPhone,

                    amount:
                      cleanAmount,

                    paymentMethod,

                    fundraiserPhone:
                      referral,
                  }
                ),
            }
          );

        const json =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            json?.error ||
              'Gagal memproses transaksi.'
          );
        }

        if (
          json.success &&
          json.orderId
        ) {
          const siteUrl =
            window.location.origin;

          const returnUrl =
            `${siteUrl}/thank-you?order_id=${encodeURIComponent(
              json.orderId
            )}`;

          let paymentUrl =
            `https://app.pakasir.com/pay/` +
            `${encodeURIComponent(
              projectSlug
            )}/` +
            `${cleanAmount}` +
            `?order_id=${encodeURIComponent(
              json.orderId
            )}` +
            `&redirect=${encodeURIComponent(
              returnUrl
            )}`;

          if (
            paymentMethod ===
            'qris'
          ) {
            paymentUrl +=
              '&qris_only=1';
          }

          window.location.href =
            paymentUrl;

          return;
        }

        throw new Error(
          json?.error ||
            'Gagal memproses transaksi.'
        );
      } catch (
        error: any
      ) {
        console.error(
          'Checkout error:',
          error
        );

        alert(
          error?.message ||
            'Terjadi kesalahan koneksi.'
        );

        setSubmitting(
          false
        );
      }
    };

  // ==========================================================
  // LOAD PROGRAM
  // ==========================================================

  useEffect(() => {
    let cancelled =
      false;

    async function loadProgram() {
      try {
        setLoading(true);

        const response =
          await fetch(
            `/api/programs?t=${Date.now()}`,
            {
              cache:
                'no-store',

              headers: {
                'Cache-Control':
                  'no-cache, no-store, must-revalidate',

                Accept:
                  'application/json',
              },
            }
          );

        const json =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            json?.error ||
              'Gagal mengambil program.'
          );
        }

        if (
          cancelled
        ) {
          return;
        }

        if (
          json.success &&
          Array.isArray(
            json.data
          )
        ) {
          const cleanParam =
            normalizeSlug(
              slug
            );

          const found =
            json.data.find(
              (
                item: any
              ) => {
                const databaseSlug =
                  normalizeSlug(
                    item?.slug
                  );

                return (
                  databaseSlug ===
                    cleanParam ||
                  item?.slug ===
                    slug ||
                  item?._id ===
                    slug ||
                  item?.id ===
                    slug
                );
              }
            );

          setProgram(
            found ||
              null
          );
        } else {
          setProgram(null);
        }
      } catch (
        error
      ) {
        console.error(
          'Fetch detail campaign error:',
          error
        );

        if (
          !cancelled
        ) {
          setProgram(null);
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false
          );
        }
      }
    }

    loadProgram();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ==========================================================
  // COPY
  // ==========================================================

  const handleCopyLink =
    async () => {
      try {
        if (
          typeof window ===
          'undefined'
        ) {
          return;
        }

        await navigator.clipboard.writeText(
          window.location.href
        );

        setCopied(true);

        window.setTimeout(
          () =>
            setCopied(
              false
            ),
          2000
        );
      } catch (
        error
      ) {
        console.error(
          'Copy link error:',
          error
        );
      }
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f5]">

        <DetailHeader
          title="Program Donasi"
          onOpenShare={() =>
            setIsShareModalOpen(
              true
            )
          }
        />

        <div className="mx-auto w-full max-w-md space-y-4 px-3 py-5 animate-pulse">

          <div className="aspect-[16/10] bg-[#d8d8d8]" />

          <div className="h-5 w-4/5 bg-[#dddddd]" />

          <div className="h-4 w-2/3 bg-[#dddddd]" />

          <div className="h-24 bg-[#e1e1e1]" />

        </div>

      </div>
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!program) {
    return (
      <div className="min-h-screen bg-[#f4f7f5]">

        <DetailHeader
          title="Program Donasi"
          onOpenShare={() =>
            setIsShareModalOpen(
              true
            )
          }
        />

        <div className="mx-auto w-full max-w-md px-3 py-12">

          <div className="border border-[#d3d3d3] bg-[#e5e5e5] px-5 py-10 text-center">

            <p className="text-sm font-bold text-[#555555]">
              Program tidak ditemukan
            </p>

            <p className="mt-2 text-[10px] leading-relaxed text-[#777777]">
              Program mungkin telah dipindahkan atau belum diterbitkan.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // PROGRAM VALUES
  // ==========================================================

  const rawTarget =
    Number(
      program.targetAmount ??
        program.targetRaw ??
        50000000
    ) || 50000000;

  const currentCollected =
    Number(
      program.collectedAmount ??
        program.collectedRaw ??
        0
    ) || 0;

  const percentage =
    rawTarget > 0
      ? Math.min(
          Math.max(
            Math.round(
              (currentCollected /
                rawTarget) *
                100
            ),
            0
          ),
          100
        )
      : 0;

  const donors =
    Array.isArray(
      program.donors
    )
      ? program.donors
      : [];

  const reports =
    Array.isArray(
      program.reports
    )
      ? program.reports
      : [];

  const shareUrl =
    typeof window !==
    'undefined'
      ? window.location.href
      : '';

  const category =
    String(
      program.category ||
        ''
    ).toUpperCase();

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f4f7f5] pb-28">

      <DetailHeader
        title={
          program.title ||
          'Program Donasi'
        }
        onOpenShare={() =>
          setIsShareModalOpen(
            true
          )
        }
      />

      <div className="mx-auto w-full max-w-md space-y-4 px-3 pt-4">

        {/* ====================================================
            MAIN PROGRAM CARD
        ===================================================== */}

        <article className="border border-[#d5d5d5] bg-white">

          {/* IMAGE */}
          <div className="aspect-[16/10] w-full overflow-hidden border-b border-[#dddddd] bg-[#dedede]">

            <img
              src={
                program.image ||
                '/images/banner.png'
              }
              alt={
                program.title ||
                'Program BMA'
              }
              className="h-full w-full object-cover"
            />

          </div>

          {/* INFORMATION */}
          <div className="space-y-4 p-4 sm:p-5">

            {program.category && (
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#65736b]">
                {program.category}
              </p>
            )}

            <h1 className="text-[22px] font-bold leading-[1.3] tracking-tight text-[#2f3c35] sm:text-2xl">
              {program.title}
            </h1>

           {/* DONATION SUMMARY */}
<div className="border border-[#06452f] bg-[#073f2e] p-5 shadow-sm">

  {/* LABEL */}
  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-200/80">
    Dana Terkumpul
  </p>

  {/* NOMINAL */}
  <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-white sm:text-[26px]">
    Rp {formatRupiah(currentCollected)}
  </p>

  {/* TARGET & SISA HARI */}
  <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-emerald-100/80">

    <span>
      Target{' '}
      <strong className="font-bold text-white">
        Rp {formatRupiah(rawTarget)}
      </strong>
    </span>

    {typeof program.daysLeft === 'number' &&
    program.daysLeft > 0 ? (
      <span className="flex items-center gap-1.5 font-semibold text-emerald-100">
        <Clock3 className="h-3.5 w-3.5" />
        {program.daysLeft} hari lagi
      </span>
    ) : null}

  </div>

  {/* PROGRESS BAR */}
  <div className="mt-4 h-2.5 w-full overflow-hidden bg-white/15">

    <div
      className="h-full bg-[#27c463] transition-all duration-500"
      style={{
        width: `${percentage}%`,
      }}
    />

  </div>

  {/* PROGRESS INFO */}
  <div className="mt-3 flex items-center justify-between text-[11px]">

    <span className="font-semibold text-emerald-100">
      {percentage}% tercapai
    </span>

    <span className="flex items-center gap-1.5 font-semibold text-emerald-100">
      <Users className="h-4 w-4" />
      {donors.length} Donatur
    </span>

  </div>

            </div>

            {/* ==================================================
                TABS
            ================================================== */}

            <div className="grid grid-cols-3 border border-[#d8e2dc] bg-[#eef4f0]">

              {[
                {
                  id:
                    'cerita',
                  label:
                    'Cerita',
                },
                {
                  id:
                    'donatur',
                  label:
                    `Donatur (${donors.length})`,
                },
                {
                  id:
                    'laporan',
                  label:
                    `Laporan (${reports.length})`,
                },
              ].map(
                (tab) => (
                  <button
                    key={
                      tab.id
                    }
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        tab.id as
                          | 'cerita'
                          | 'donatur'
                          | 'laporan'
                      )
                    }
                    className={`border-r border-[#d4d4d4] px-1 py-3 text-[11px] font-bold transition last:border-r-0 ${
                      activeTab ===
                      tab.id
                        ? 'border-b-[3px] border-b-[#0b6b45] bg-white text-[#073f2e]'
                        : 'text-[#65736b] hover:bg-[#e5eee9]'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              )}

            </div>

            {/* ==================================================
                CERITA
            ================================================== */}

            {activeTab ===
              'cerita' && (
              <div className="pt-1">

                {category ===
                  'ZAKAT' && (
                  <EmbeddedZakatCalculator
                    onApplyAmount={(
                      value
                    ) =>
                      setAmount(
                        value
                      )
                    }
                  />
                )}

                {program.description ? (
                  typeof program.description ===
                  'string' ? (
                    <p className="text-[15px] leading-[1.85] text-[#4a4a4a]">
                      {
                        program.description
                      }
                    </p>
                  ) : (
                    <PortableText
                      value={
                        program.description
                      }
                      components={
                        portableTextComponents
                      }
                    />
                  )
                ) : (
                  <p className="py-8 text-center text-xs italic text-[#999999]">
                    Belum ada cerita detail.
                  </p>
                )}

              </div>
            )}

            {/* ==================================================
                DONATUR
            ================================================== */}

            {activeTab ===
              'donatur' && (
              <div className="space-y-2.5">

                {donors.length >
                0 ? (
                  [
                    ...donors,
                  ]
                    .reverse()
                    .map(
                      (
                        donor,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="flex items-center justify-between gap-3 border border-[#d7e1db] bg-[#f3f7f5] p-3.5"
                        >

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#dcebe2] text-sm font-bold text-[#073f2e]">

                              {String(
                                donor.name ||
                                  'H'
                              )
                                .toUpperCase()
                                .slice(
                                  0,
                                  1
                                )}

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-[11px] font-bold text-[#4a4a4a]">
                                {donor.name ||
                                  'Hamba Allah'}
                              </p>

                              <p className="mt-0.5 text-[11px] text-[#999999]">
                                {donor.date ||
                                  'Baru saja'}
                              </p>

                            </div>

                          </div>

                          <p className="shrink-0 text-[11px] font-bold text-[#555555]">
                            +Rp{' '}
                            {formatRupiah(
                              Number(
                                donor.amount ||
                                  0
                              )
                            )}
                          </p>

                        </div>
                      )
                    )
                ) : (
                  <p className="py-8 text-center text-xs text-[#999999]">
                    Belum ada donatur.
                  </p>
                )}

              </div>
            )}

            {/* ==================================================
                LAPORAN
            ================================================== */}

            {activeTab ===
              'laporan' && (
              <div className="space-y-3">

                {reports.length >
                0 ? (
                  [
                    ...reports,
                  ]
                    .reverse()
                    .map(
                      (
                        report,
                        index
                      ) => (
                        <article
                          key={
                            index
                          }
                          className="border border-[#d7e1db] bg-[#f3f7f5] p-4"
                        >

                          <div className="flex items-start justify-between gap-3 border-b border-[#dddddd] pb-2.5">

                            <h4 className="text-[11px] font-bold text-[#444444]">
                              {report.title ||
                                'Laporan Penyaluran'}
                            </h4>

                            <span className="shrink-0 text-[11px] text-[#999999]">
                              {report.date ||
                                ''}
                            </span>

                          </div>

                          <div className="pt-3 text-sm leading-relaxed text-[#555555]">

                            {typeof report.content ===
                            'string' ? (
                              <p>
                                {
                                  report.content
                                }
                              </p>
                            ) : report.content ? (
                              <PortableText
                                value={
                                  report.content
                                }
                                components={
                                  portableTextComponents
                                }
                              />
                            ) : null}

                          </div>

                        </article>
                      )
                    )
                ) : (
                  <p className="py-8 text-center text-xs text-[#999999]">
                    Belum ada pembaruan laporan.
                  </p>
                )}

              </div>
            )}

          </div>

        </article>

      </div>

      {/* ======================================================
          FLOATING DONATION BAR
      ====================================================== */}

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center border-t border-[#d3d3d3] bg-white/95 px-3 py-3 backdrop-blur-sm">

        <div className="pointer-events-auto w-full max-w-md">

          <button
            type="button"
            onClick={() =>
              setIsMobileFormOpen(
                true
              )
            }
            className="w-full bg-[#d9232e] py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_4px_14px_rgba(217,35,46,0.22)] transition hover:bg-[#c51f29] active:scale-[0.995] sm:text-sm"
          >
            Donasi Sekarang
          </button>

        </div>

      </div>

      {/* ======================================================
          DONATION MODAL
      ====================================================== */}

      {isMobileFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 sm:items-center sm:p-3">

          <div
            className="absolute inset-0"
            onClick={() =>
              setIsMobileFormOpen(
                false
              )
            }
          />

          <section className="relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto border border-[#cccccc] bg-white shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#043524] bg-[#073f2e] px-4 py-4">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                  {SITE_DOMAIN}
                </p>

                <h3 className="text-[15px] font-bold text-white">
                  Pilih Nominal Donasi
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsMobileFormOpen(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            <div className="p-4 sm:p-5">

              <DonationFormFields
                profile={
                  profile
                }
                setProfile={
                  setProfile
                }
                amount={
                  amount
                }
                setAmount={
                  setAmount
                }
                paymentMethod={
                  paymentMethod
                }
                setPaymentMethod={
                  setPaymentMethod
                }
                handleDonate={
                  handleDonate
                }
                handleInlineSavePhone={
                  handleInlineSavePhone
                }
                submitting={
                  submitting
                }
                isLoggedIn={
                  isLoggedIn
                }
                inlinePhone={
                  inlinePhone
                }
                setInlinePhone={
                  setInlinePhone
                }
                savingPhone={
                  savingPhone
                }
              />

            </div>

          </section>

        </div>
      )}

      {/* ======================================================
          SHARE MODAL
      ====================================================== */}

      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3">

          <div
            className="absolute inset-0"
            onClick={() =>
              setIsShareModalOpen(
                false
              )
            }
          />

          <section className="relative z-10 w-full max-w-md border border-[#cccccc] bg-white shadow-2xl">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#043524] bg-[#073f2e] px-4 py-4">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                  Bagikan Kebaikan
                </p>

                <h3 className="text-[15px] font-bold text-white">
                  Bagikan Program
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsShareModalOpen(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            <div className="space-y-5 p-4 sm:p-5">

              {/* URL */}
              <div>

                <label className="mb-1.5 block text-[11px] font-semibold text-[#777777]">
                  Tautan Program
                </label>

                <div className="flex">

                  <input
                    type="text"
                    readOnly
                    value={
                      shareUrl
                    }
                    className="min-w-0 flex-1 border border-r-0 border-[#cccccc] bg-[#f5f5f5] px-3 py-2.5 text-[10px] font-mono text-[#666666] outline-none"
                  />

                  <button
                    type="button"
                    onClick={
                      handleCopyLink
                    }
                    className="flex shrink-0 items-center gap-1.5 bg-[#073f2e] px-3.5 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#052f22]"
                  >

                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}

                    {copied
                      ? 'Tersalin'
                      : 'Salin'}

                  </button>

                </div>

              </div>

              {/* SOCIAL */}
              <div className="grid grid-cols-3 gap-2">

                {/* WHATSAPP */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Ayo bantu program kebaikan ini: ${
                      program.title ||
                      ''
                    }\n${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center border border-[#d5e0d9] bg-[#eef5f1] px-2 py-3.5 text-[#073f2e] transition hover:bg-[#e4eee8]"
                >

                  <MessageCircle className="h-5 w-5" />

                  <span className="mt-1.5 text-[11px] font-bold">
                    WhatsApp
                  </span>

                </a>

                {/* FACEBOOK */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center border border-[#d5e0d9] bg-[#eef5f1] px-2 py-3.5 text-[#073f2e] transition hover:bg-[#e4eee8]"
                >

                  <svg
                    className="h-5 w-5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>

                  <span className="mt-1.5 text-[11px] font-bold">
                    Facebook
                  </span>

                </a>

                {/* X */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    shareUrl
                  )}&text=${encodeURIComponent(
                    program.title ||
                      ''
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center border border-[#d5e0d9] bg-[#eef5f1] px-2 py-3.5 text-[#073f2e] transition hover:bg-[#e4eee8]"
                >

                  <svg
                    className="h-[18px] w-[18px] fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>

                  <span className="mt-1.5 text-[11px] font-bold">
                    Twitter/X
                  </span>

                </a>

              </div>

            </div>

          </section>

        </div>
      )}

    </div>
  );
}