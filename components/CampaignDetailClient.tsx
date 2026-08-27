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
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#043524] bg-[#073f2e] shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex h-14 w-full max-w-[420px] items-center justify-between px-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>

        <div className="min-w-0 flex-1 px-3 text-center">
          <p className="truncate text-[8px] font-bold uppercase tracking-[0.16em] text-emerald-200/80">
            {SITE_DOMAIN}
          </p>
          <h1 className="truncate text-[13px] font-bold tracking-tight text-white sm:text-[14px]">
            {title}
          </h1>
        </div>

        <button
          type="button"
          onClick={onOpenShare}
          className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
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
  onApplyAmount: (value: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'penghasilan' | 'maal' | 'emas'>('penghasilan');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const HARGA_EMAS = 1400000;
  const NISHAB_TAHUNAN = 85 * HARGA_EMAS;
  const NISHAB_BULANAN = Math.round(NISHAB_TAHUNAN / 12);

  const formatInput = (value: string) => {
    const raw = value.replace(/[^0-9]/g, '');
    return raw ? Number(raw).toLocaleString('id-ID') : '';
  };

  const getNum = (value: string) => Number(value.replace(/\./g, '')) || 0;

  let totalZakat = 0;
  let isWajib = false;
  let nishabText = '';

  if (activeTab === 'penghasilan') {
    const total = getNum(input1) + getNum(input2);
    isWajib = total >= NISHAB_BULANAN;
    totalZakat = isWajib ? Math.round(total * 0.025) : 0;
    nishabText = `Nishab bulanan sekitar Rp ${formatRupiah(NISHAB_BULANAN)}.`;
  }

  if (activeTab === 'maal') {
    const total = getNum(input1) + getNum(input2);
    isWajib = total >= NISHAB_TAHUNAN;
    totalZakat = isWajib ? Math.round(total * 0.025) : 0;
    nishabText = `Nishab tahunan sekitar Rp ${formatRupiah(NISHAB_TAHUNAN)}.`;
  }

  if (activeTab === 'emas') {
    const weight = Number(input1) || 0;
    isWajib = weight >= 85;
    totalZakat = isWajib ? Math.round(weight * HARGA_EMAS * 0.025) : 0;
    nishabText = 'Nishab emas adalah 85 gram.';
  }

  const switchTab = (tab: 'penghasilan' | 'maal' | 'emas') => {
    setActiveTab(tab);
    setInput1('');
    setInput2('');
  };

  return (
    <section className="my-4 overflow-hidden border border-slate-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-3 border-b border-[#06452f] bg-[#073f2e] px-4 py-3.5">
        <Calculator className="h-5 w-5 text-emerald-200" />
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-emerald-200/80">
            Fasilitas BMA
          </p>
          <h3 className="text-[12px] font-bold text-white">
            Kalkulator Zakat
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-3 border-b border-slate-200 bg-[#f8f8f6]">
        {[
          { id: 'penghasilan', label: 'Penghasilan' },
          { id: 'maal', label: 'Maal' },
          { id: 'emas', label: 'Emas' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => switchTab(tab.id as 'penghasilan' | 'maal' | 'emas')}
            className={`border-r border-slate-200 px-2 py-2.5 text-[9px] font-bold uppercase tracking-[0.1em] transition last:border-r-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-[#073f2e] border-b-[2px] border-b-[#073f2e]'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3.5 p-4">
        {activeTab !== 'emas' ? (
          <>
            <div>
              <label className="mb-1 block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                {activeTab === 'maal' ? 'Tabungan / Harta Tersimpan' : 'Penghasilan Utama'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={input1}
                  onChange={(e) => setInput1(formatInput(e.target.value))}
                  placeholder="0"
                  className="w-full border border-slate-200 bg-[#f8f8f6] py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#073f2e] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                {activeTab === 'maal' ? 'Investasi / Aset Likuid' : 'Tunjangan / Bonus / THR'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={input2}
                  onChange={(e) => setInput2(formatInput(e.target.value))}
                  placeholder="0"
                  className="w-full border border-slate-200 bg-[#f8f8f6] py-2.5 pl-10 pr-3.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#073f2e] focus:bg-white"
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="mb-1 block text-[8px] font-bold uppercase tracking-wider text-slate-400">
              Total Berat Emas
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Contoh: 90"
                className="w-full border border-slate-200 bg-[#f8f8f6] py-2.5 pl-3 pr-16 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#073f2e] focus:bg-white"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase text-slate-400">
                gram
              </span>
            </div>
          </div>
        )}

        <div className="border border-[#eadfca] bg-[#f7f2e7]/60 p-3">
          <p className="text-[8px] leading-relaxed text-slate-600">{nishabText}</p>
        </div>

        <div className="border border-[#073f2e]/20 bg-[#073f2e] p-4 text-center shadow-sm">
          <span className="block text-[8px] font-bold uppercase tracking-[0.16em] text-emerald-200/80">
            Estimasi Zakat
          </span>
          <strong className="mt-1 block text-xl font-extrabold text-white">
            Rp {formatRupiah(totalZakat)}
          </strong>
          <p className="mt-1 text-[8px] text-emerald-100/80">
            {isWajib ? 'Perhitungan telah mencapai batas nishab.' : 'Nilai belum mencapai batas nishab.'}
          </p>
          <button
            type="button"
            disabled={totalZakat <= 0}
            onClick={() => onApplyAmount(formatRupiah(totalZakat))}
            className="mt-3 w-full bg-[#d7b66a] hover:bg-[#c8a658] py-2.5 text-[8px] font-bold uppercase tracking-[0.15em] text-[#073f2e] transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 cursor-pointer shadow-sm"
          >
            Gunakan Nominal Ini
          </button>
        </div>

        <p className="text-center text-[8px] leading-relaxed text-slate-400">
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
  const PRESET_AMOUNTS = [10000, 15000, 25000, 50000, 100000, 250000];
  const cleanAmountNum = cleanNumber(amount);
  const hasPhone = Boolean(profile?.phone && String(profile.phone).trim().length >= 9);

  return (
    <div className="space-y-4 text-left">
      <div>
        <label className="mb-2 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
          Pilih Nominal Donasi
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_AMOUNTS.map((value) => {
            const selected = cleanAmountNum === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(formatRupiah(value))}
                className={`border px-2 py-2.5 text-[10px] font-bold transition cursor-pointer ${
                  selected
                    ? 'border-[#073f2e] bg-[#f0f8f4] text-[#073f2e]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Rp {value >= 1000000 ? `${value / 1000000}jt` : `${value / 1000}rb`}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
          Masukkan Donasi Lainnya
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
            Rp
          </span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Minimal 1.000"
            value={amount}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              setAmount(raw ? Number(raw).toLocaleString('id-ID') : '');
            }}
            className="w-full border border-slate-200 bg-[#f8f8f6] py-3 pl-10 pr-3.5 text-xs font-bold text-slate-800 outline-none transition focus:border-[#073f2e] focus:bg-white"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
          Metode Pembayaran
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-slate-200 bg-[#f8f8f6] px-3.5 py-3 text-[10px] font-semibold text-slate-700 outline-none focus:border-[#073f2e] focus:bg-white"
        >
          <option value="qris">QRIS — E-Wallet / Mobile Banking</option>
          <option value="bni_va">Virtual Account BNI</option>
          <option value="bri_va">Virtual Account BRI</option>
          <option value="mandiri_va">Virtual Account Mandiri</option>
          <option value="permata_va">Virtual Account Permata</option>
        </select>
      </div>

      <div className="border-t border-slate-100" />

      {isLoggedIn ? (
        hasPhone ? (
          <div className="flex items-center justify-between gap-3 border border-emerald-100 bg-[#f0f8f4] p-3.5">
            <div className="min-w-0">
              <span className="block text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                Akun Terverifikasi
              </span>
              <p className="mt-0.5 truncate text-[11px] font-bold text-slate-800">
                {profile?.name || 'Dermawan'}
              </p>
              <p className="mt-0.5 truncate text-[8px] text-slate-500">
                WhatsApp: {profile?.phone}
              </p>
            </div>
            <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
          </div>
        ) : (
          <div className="space-y-2.5 border border-amber-100 bg-amber-50/50 p-3.5">
            <div>
              <p className="text-[11px] font-bold text-slate-800">
                Lengkapi Nomor WhatsApp
              </p>
              <p className="mt-0.5 text-[8px] leading-relaxed text-slate-500">
                Nomor digunakan untuk informasi transaksi, kuitansi, dan laporan program.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="081234567890"
                value={inlinePhone}
                onChange={(e) => setInlinePhone(e.target.value)}
                className="min-w-0 flex-1 border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-800 outline-none focus:border-[#073f2e]"
              />
              <button
                type="button"
                onClick={handleInlineSavePhone}
                disabled={savingPhone}
                className="shrink-0 bg-[#073f2e] px-3.5 py-2 text-[8px] font-bold uppercase tracking-wider text-white transition hover:bg-[#052e21] disabled:opacity-50 cursor-pointer"
              >
                {savingPhone ? 'Menyimpan' : 'Simpan'}
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Nama Donatur
            </label>
            <input
              type="text"
              placeholder="Hamba Allah (boleh kosong)"
              value={profile?.name || ''}
              onChange={(e) =>
                setProfile((previous: any) => ({
                  ...previous,
                  name: e.target.value,
                }))
              }
              className="w-full border border-slate-200 bg-[#f8f8f6] px-3.5 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#073f2e] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Nomor WhatsApp *
            </label>
            <input
              type="tel"
              placeholder="081234567890"
              value={profile?.phone || ''}
              onChange={(e) =>
                setProfile((previous: any) => ({
                  ...previous,
                  phone: e.target.value,
                }))
              }
              className="w-full border border-slate-200 bg-[#f8f8f6] px-3.5 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#073f2e] focus:bg-white"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleDonate}
        disabled={submitting || (isLoggedIn && !hasPhone)}
        className="flex w-full items-center justify-center gap-2 bg-[#e91e63] py-3.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#d81b60] active:scale-[0.995] disabled:cursor-not-allowed disabled:bg-slate-300 cursor-pointer shadow-md"
      >
        {submitting ? 'Memproses Tagihan...' : 'DONASI SEKARANG'}
        {!submitting && <ChevronRight className="h-4 w-4" />}
      </button>

      <p className="text-center text-[8px] leading-relaxed text-slate-400">
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
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('10.000');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inlinePhone, setInlinePhone] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'cerita' | 'donatur' | 'laporan'>('cerita');

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (!session) {
          setIsLoggedIn(false);
          setProfile({ name: '', phone: '' });
          return;
        }

        const user = session.user;
        setIsLoggedIn(true);
        const meta = user.user_metadata || {};

        let { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!mounted) return;

        if (!prof) {
          prof = {
            id: user.id,
            email: user.email,
            name: meta.full_name || meta.name || user.email?.split('@')[0] || 'Dermawan',
            avatar: meta.avatar_url || meta.picture || '',
            phone: '',
          };
          await supabase.from('profiles').upsert(prof);
        }

        setProfile(prof);
      } catch (error) {
        console.error('Profile load error:', error);
        if (mounted) setIsLoggedIn(false);
      }
    }

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleInlineSavePhone = async () => {
    const clean = inlinePhone.replace(/[^0-9]/g, '');
    if (clean.length < 9) {
      alert('Masukkan nomor WhatsApp yang valid.');
      return;
    }

    setSavingPhone(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Sesi habis. Silakan login kembali.');

      const updatePayload = {
        id: session.user.id,
        email: session.user.email,
        name: profile?.name?.trim() || session.user.email?.split('@')[0] || 'Dermawan',
        phone: clean,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updatePayload);

      if (error) throw error;

      setProfile((previous: any) => ({
        ...(previous || {}),
        phone: clean,
      }));

      setInlinePhone('');
      alert('Nomor WhatsApp berhasil disimpan.');
    } catch (error: any) {
      alert(`Gagal menyimpan: ${error?.message || 'Terjadi kesalahan.'}`);
    } finally {
      setSavingPhone(false);
    }
  };

  const handleDonate = async () => {
    const cleanAmount = cleanNumber(amount);
    if (!cleanAmount || cleanAmount < 1000) {
      alert('Masukkan nominal minimal Rp 1.000.');
      return;
    }

    const activePhone = profile?.phone || inlinePhone;
    const cleanPhone = String(activePhone || '').replace(/[^0-9]/g, '');

    if (cleanPhone.length < 9) {
      alert('Nomor WhatsApp wajib diisi.');
      return;
    }

    const projectSlug = process.env.NEXT_PUBLIC_PAKASIR_PROJECT_SLUG;
    if (!projectSlug) {
      alert('Konfigurasi payment gateway BMA belum lengkap. NEXT_PUBLIC_PAKASIR_PROJECT_SLUG belum disetel.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: program?.slug || slug,
          donorName: profile?.name?.trim() || 'Hamba Allah',
          donorPhone: cleanPhone,
          amount: cleanAmount,
          paymentMethod,
          fundraiserPhone: referral,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error || 'Gagal memproses transaksi.');
      }

      if (json.success && json.orderId) {
        const siteUrl = window.location.origin;
        const returnUrl = `${siteUrl}/thank-you?order_id=${encodeURIComponent(json.orderId)}`;

        let paymentUrl =
          `https://app.pakasir.com/pay/` +
          `${encodeURIComponent(projectSlug)}/` +
          `${cleanAmount}` +
          `?order_id=${encodeURIComponent(json.orderId)}` +
          `&redirect=${encodeURIComponent(returnUrl)}`;

        if (paymentMethod === 'qris') {
          paymentUrl += '&qris_only=1';
        }

        window.location.href = paymentUrl;
        return;
      }

      throw new Error(json?.error || 'Gagal memproses transaksi.');
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error?.message || 'Terjadi kesalahan koneksi.');
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadProgram() {
      try {
        setLoading(true);
        const response = await fetch(`/api/programs?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Accept: 'application/json',
          },
        });

        const json = await response.json();
        if (!response.ok) throw new Error(json?.error || 'Gagal mengambil program.');
        if (cancelled) return;

        if (json.success && Array.isArray(json.data)) {
          const cleanParam = normalizeSlug(slug);
          const found = json.data.find((item: any) => {
            const databaseSlug = normalizeSlug(item?.slug);
            return (
              databaseSlug === cleanParam ||
              item?.slug === slug ||
              item?._id === slug ||
              item?.id === slug
            );
          });

          setProgram(found || null);
        } else {
          setProgram(null);
        }
      } catch (error) {
        console.error('Fetch detail campaign error:', error);
        if (!cancelled) setProgram(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProgram();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleCopyLink = async () => {
    try {
      if (typeof window === 'undefined') return;
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy link error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6]">
        <DetailHeader title="Program Donasi" onOpenShare={() => setIsShareModalOpen(true)} />
        <div className="mx-auto w-full max-w-[420px] space-y-3 px-0 pt-2 animate-pulse">
          <div className="aspect-[16/10] bg-[#d8d8d8]" />
          <div className="h-5 w-4/5 bg-[#dddddd]" />
          <div className="h-4 w-2/3 bg-[#dddddd]" />
          <div className="h-24 bg-[#e1e1e1]" />
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-[#f8f8f6]">
        <DetailHeader title="Program Donasi" onOpenShare={() => setIsShareModalOpen(true)} />
        <div className="mx-auto w-full max-w-[420px] px-0 pt-2">
          <div className="border border-[#d3d3d3] bg-white px-5 py-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold text-slate-800">Program tidak ditemukan</p>
            <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
              Program mungkin telah dipindahkan atau belum diterbitkan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const rawTarget = Number(program.targetAmount ?? program.targetRaw ?? 50000000) || 50000000;
  const currentCollected = Number(program.collectedAmount ?? program.collectedRaw ?? 0) || 0;
  const percentage = rawTarget > 0 ? Math.min(Math.max(Math.round((currentCollected / rawTarget) * 100), 0), 100) : 0;
  const donors = Array.isArray(program.donors) ? program.donors : [];
  const reports = Array.isArray(program.reports) ? program.reports : [];
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const category = String(program.category || '').toUpperCase();

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-slate-900 pb-28 pt-2 flex justify-center">
      <div className="w-full max-w-[420px] space-y-3 px-0">
        <DetailHeader title={program.title || 'Program Donasi'} onOpenShare={() => setIsShareModalOpen(true)} />

        <article className="bg-white border-y border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="aspect-[16/10] w-full overflow-hidden border-b border-slate-100 bg-slate-100">
            <img
              src={program.image || '/images/banner.png'}
              alt={program.title || 'Program BMA'}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            <h1 className="text-[18px] font-bold leading-snug tracking-tight text-slate-800">
              {program.title}
            </h1>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[22px] font-extrabold tracking-tight text-[#073f2e]">
                  Rp {formatRupiah(currentCollected)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>
                  Terkumpul dari <strong className="font-bold text-slate-700">Rp {formatRupiah(rawTarget)}</strong>
                </span>
                {typeof program.daysLeft === 'number' && program.daysLeft <= 7 ? (
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200">
                    Mendesak
                  </span>
                ) : null}
              </div>

              <div className="h-2 w-full overflow-hidden bg-slate-100">
                <div
                  className="h-full bg-[#073f2e] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 border border-slate-200 bg-[#f8f8f6]">
              {[
                { id: 'cerita', label: 'Cerita' },
                { id: 'donatur', label: `Donatur (${donors.length})` },
                { id: 'laporan', label: `Laporan (${reports.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as 'cerita' | 'donatur' | 'laporan')}
                  className={`border-r border-slate-200 px-1 py-2.5 text-[9px] font-bold uppercase tracking-wider transition last:border-r-0 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-b-[2px] border-b-[#073f2e] bg-white text-[#073f2e]'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'cerita' && (
              <div className="pt-1">
                {category === 'ZAKAT' && (
                  <EmbeddedZakatCalculator onApplyAmount={(value) => setAmount(value)} />
                )}

                {program.description ? (
                  typeof program.description === 'string' ? (
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      {program.description}
                    </p>
                  ) : (
                    <PortableText value={program.description} components={portableTextComponents} />
                  )
                ) : (
                  <p className="py-6 text-center text-[9px] italic text-slate-400">
                    Belum ada cerita detail.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'donatur' && (
              <div className="space-y-2">
                {donors.length > 0 ? (
                  [...donors].reverse().map((donor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 border border-slate-200 bg-[#f8f8f6] p-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#f7f2e7] border border-[#eadfca] text-xs font-bold text-[#a37c32]">
                          {String(donor.name || 'H').toUpperCase().slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-bold text-slate-800">
                            {donor.name || 'Hamba Allah'}
                          </p>
                          <p className="mt-0.5 text-[8px] text-slate-400">
                            {donor.date || 'Baru saja'}
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 text-[10px] font-bold text-emerald-600">
                        +Rp {formatRupiah(Number(donor.amount || 0))}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-[9px] text-slate-400">
                    Belum ada donatur.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'laporan' && (
              <div className="space-y-2.5">
                {reports.length > 0 ? (
                  [...reports].reverse().map((report, index) => (
                    <article key={index} className="border border-slate-200 bg-[#f8f8f6] p-3.5">
                      <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-2">
                        <h4 className="text-[10px] font-bold text-slate-800">
                          {report.title || 'Laporan Penyaluran'}
                        </h4>
                        <span className="shrink-0 text-[8px] text-slate-400">
                          {report.date || ''}
                        </span>
                      </div>
                      <div className="pt-2 text-[9px] leading-relaxed text-slate-600">
                        {typeof report.content === 'string' ? (
                          <p>{report.content}</p>
                        ) : report.content ? (
                          <PortableText value={report.content} components={portableTextComponents} />
                        ) : null}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="py-6 text-center text-[9px] text-slate-400">
                    Belum ada pembaruan laporan.
                  </p>
                )}
              </div>
            )}
          </div>
        </article>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur-sm">
        <div className="pointer-events-auto w-full max-w-[420px]">
          <button
            type="button"
            onClick={() => setIsMobileFormOpen(true)}
            className="w-full bg-[#d81b60] py-4 text-[12px] font-extrabold uppercase tracking-[0.15em] text-white shadow-lg transition hover:bg-[#c2185b] active:scale-[0.995] cursor-pointer"
          >
            DONASI SEKARANG
          </button>
        </div>
      </div>

      {isMobileFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-3">
          <div className="absolute inset-0" onClick={() => setIsMobileFormOpen(false)} />
          <section className="relative z-10 max-h-[92vh] w-full max-w-[420px] overflow-y-auto border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#043524] bg-[#073f2e] px-4 py-3.5">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-200/80">
                  {SITE_DOMAIN}
                </p>
                <h3 className="text-[13px] font-bold text-white">
                  Pilih Nominal Donasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFormOpen(false)}
                className="flex h-8 w-8 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 sm:p-5">
              <DonationFormFields
                profile={profile}
                setProfile={setProfile}
                amount={amount}
                setAmount={setAmount}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                handleDonate={handleDonate}
                handleInlineSavePhone={handleInlineSavePhone}
                submitting={submitting}
                isLoggedIn={isLoggedIn}
                inlinePhone={inlinePhone}
                setInlinePhone={setInlinePhone}
                savingPhone={savingPhone}
              />
            </div>
          </section>
        </div>
      )}

      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3">
          <div className="absolute inset-0" onClick={() => setIsShareModalOpen(false)} />
          <section className="relative z-10 w-full max-w-[420px] border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#043524] bg-[#073f2e] px-4 py-3.5">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-200/80">
                  Bagikan Kebaikan
                </p>
                <h3 className="text-[13px] font-bold text-white">
                  Bagikan Program
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Tautan Program
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="min-w-0 flex-1 border border-r-0 border-slate-200 bg-[#f8f8f6] px-3 py-2.5 text-[9px] font-mono text-slate-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex shrink-0 items-center gap-1.5 bg-[#073f2e] ix-3.5 py-2.5 text-[9px] font-bold uppercase tracking-wider text-white transition hover:bg-[#052f22] cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Ayo bantu program kebaikan ini: ${program.title || ''}\n${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center border border-slate-200 bg-[#f8f8f6] px-2 py-3 text-slate-700 transition hover:bg-slate-100"
                >
                  <MessageCircle className="h-4.5 w-4.5 text-emerald-600" />
                  <span className="mt-1.5 text-[9px] font-bold">WhatsApp</span>
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center border border-slate-200 bg-[#f8f8f6] px-2 py-3 text-slate-700 transition hover:bg-slate-100"
                >
                  <svg className="h-4.5 w-4.5 fill-current text-blue-600" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="mt-1.5 text-[9px] font-bold">Facebook</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(program.title || '')}`}
                  text-slate-700
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center border border-slate-200 bg-[#f8f8f6] px-2 py-3 text-slate-700 transition hover:bg-slate-100"
                >
                  <svg className="h-4 w-4 fill-current text-slate-800" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="mt-1.5 text-[9px] font-bold">Twitter/X</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}