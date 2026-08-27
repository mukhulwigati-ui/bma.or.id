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

          <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">

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
              <p className="text-center text-[11px] italic leading-relaxed text-slate-400">
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
      <p className="mb-4 text-[14px] sm:text-[15px] leading-[1.8] text-slate-700">
        {children}
      </p>
    ),

    h1: ({
      children,
    }: any) => (
      <h2 className="mb-3 mt-6 text-lg sm:text-xl font-bold leading-snug tracking-tight text-slate-900">
        {children}
      </h2>
    ),

    h2: ({
      children,
    }: any) => (
      <h2 className="mb-3 mt-5 text-base sm:text-lg font-bold leading-snug text-slate-900">
        {children}
      </h2>
    ),

    h3: ({
      children,
    }: any) => (
      <h3 className="mb-2 mt-4 text-sm sm:text-base font-bold text-slate-900">
        {children}
      </h3>
    ),

    blockquote: ({
      children,
    }: any) => (
      <blockquote className="my-4 border-l-4 border-emerald-800 bg-emerald-50 px-4 py-3 text-xs sm:text-sm italic leading-relaxed text-slate-700">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({
      children,
    }: any) => (
      <ul className="mb-4 list-disc space-y-2 pl-5 text-[14px] sm:text-[15px] leading-relaxed text-slate-700">
        {children}
      </ul>
    ),

    number: ({
      children,
    }: any) => (
      <ol className="mb-4 list-decimal space-y-2 pl-5 text-[14px] sm:text-[15px] leading-relaxed text-slate-700">
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
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900 bg-emerald-950 shadow-sm">
      <div className="mx-auto flex h-14 w-full max-w-[420px] items-center justify-between px-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1 px-3 text-center">
          <h1 className="truncate text-[13px] font-bold tracking-tight text-white sm:text-[14px]">
            {title}
          </h1>
        </div>

        <button
          type="button"
          onClick={onOpenShare}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
          aria-label="Bagikan"
        >
          <Share2 className="h-5 w-5" />
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
    <section className="my-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
        {[
          { id: 'penghasilan', label: 'PENGHASILAN' },
          { id: 'maal', label: 'MAAL' },
          { id: 'emas', label: 'EMAS' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => switchTab(tab.id as 'penghasilan' | 'maal' | 'emas')}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-900 bg-white text-emerald-900 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4 text-left">
        {activeTab !== 'emas' ? (
          <>
            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-slate-600">
                {activeTab === 'maal' ? 'Tabungan / Harta Tersimpan (Rp)' : 'Pendapatan Utama / Tabungan Per Bulan (Rp)'}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={input1}
                onChange={(e) => setInput1(formatInput(e.target.value))}
                placeholder="0"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-800 focus:outline-emerald-900 bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-slate-600">
                {activeTab === 'maal' ? 'Investasi / Aset Likuid (Rp)' : 'Tunjangan / Bonus / THR (Rp)'}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={input2}
                onChange={(e) => setInput2(formatInput(e.target.value))}
                placeholder="0"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-800 focus:outline-emerald-900 bg-white"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-medium text-slate-600">
              Total Berat Emas (Gram)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="Contoh: 90"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-800 focus:outline-emerald-900 bg-white"
            />
          </div>
        )}

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-center space-y-2">
          <span className="block text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-500">
            Estimasi Wajib Zakat Anda
          </span>
          <span className="block text-xl sm:text-2xl font-extrabold text-emerald-900">
            Rp {formatRupiah(totalZakat)}
          </span>
          <button
            type="button"
            disabled={totalZakat <= 0}
            onClick={() => onApplyAmount(formatRupiah(totalZakat))}
            className="w-full rounded-lg bg-emerald-900 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition hover:bg-emerald-950 disabled:bg-gray-300 shadow-sm cursor-pointer"
          >
            Masukkan ke Form Nominal 📥
          </button>
        </div>

        <p className="text-center text-[11px] sm:text-xs text-slate-400">
          {nishabText} Nilai di atas adalah estimasi. Zakat wajib ditunaikan jika harta mencapai nishab dan haul.
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
        <label className="mb-2 block text-xs sm:text-sm font-extrabold text-slate-900">
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
                className={`rounded-xl border px-2 py-3 text-xs font-bold transition cursor-pointer ${
                  selected
                    ? 'border-emerald-900 bg-emerald-50 text-emerald-900 shadow-2xs ring-1 ring-emerald-900'
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
        <label className="mb-1 block text-xs font-semibold text-slate-600">
          Masukkan Donasi Lainnya
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-sm font-bold text-slate-400">
            Rp
          </span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Min. 1.000"
            value={amount}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              setAmount(raw ? Number(raw).toLocaleString('id-ID') : '');
            }}
            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-sm sm:text-base font-bold text-slate-900 outline-none focus:outline-emerald-900"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs sm:text-sm font-extrabold text-slate-900">
          Metode Pembayaran
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:outline-emerald-900"
        >
          <option value="qris">QRIS (Semua E-Wallet / Mobile Banking)</option>
          <option value="bni_va">Virtual Account BNI</option>
          <option value="bri_va">Virtual Account BRI</option>
          <option value="mandiri_va">Virtual Account Mandiri</option>
          <option value="permata_va">Virtual Account Permata</option>
        </select>
      </div>

      <hr className="my-2 border-slate-100" />

      {isLoggedIn ? (
        hasPhone ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50 p-3.5">
            <div className="space-y-0.5 overflow-hidden">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                Login ✓ • {profile?.name}
              </span>
              <p className="truncate text-xs font-extrabold text-slate-900">
                WhatsApp: {profile?.phone}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">
              Siap Donasi
            </span>
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div>
              <span className="mb-0.5 block text-xs font-bold text-amber-900">
                Halo, {profile?.name || 'Dermawan'}!
              </span>
              <p className="text-[11px] text-amber-700">
                Lengkapi nomor WhatsApp Anda sekali ini saja untuk pengiriman kuitansi dan laporan donasi.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={inlinePhone}
                onChange={(e) => setInlinePhone(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:outline-emerald-900"
              />
              <button
                type="button"
                onClick={handleInlineSavePhone}
                disabled={savingPhone}
                className="shrink-0 cursor-pointer rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700 disabled:opacity-50"
              >
                {savingPhone ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Nama Donatur
            </label>
            <input
              type="text"
              placeholder="Hamba Allah (Boleh Kosong)"
              value={profile?.name || ''}
              onChange={(e) =>
                setProfile((prev: any) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Nomor WhatsApp *
            </label>
            <input
              type="tel"
              placeholder="Contoh: 081234567890"
              value={profile?.phone || ''}
              onChange={(e) =>
                setProfile((prev: any) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleDonate}
        disabled={submitting || (isLoggedIn && !hasPhone)}
        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#e91e63] py-4 text-sm sm:text-base font-extrabold uppercase tracking-wider text-white shadow-md transition-all hover:bg-pink-700 active:scale-[0.99] disabled:bg-gray-300"
      >
        {submitting ? 'Memproses Tagihan...' : 'Lanjut pembayaran'}
      </button>
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

    const projectSlug = process.env.NEXT_PUBLIC_PAKASIR_PROJECT_SLUG || 'balai-dakwah-banjarnegara';

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          slug: program?.slug || slug,
          donorName: profile?.name?.trim() || 'Hamba Allah',
          donorPhone: cleanPhone,
          amount: cleanAmount,
          paymentMethod,
          fundraiserPhone: referral,
          userId: session?.user?.id || null,
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
      <div className="min-h-screen bg-gray-50">
        <DetailHeader title="Program Donasi" onOpenShare={() => setIsShareModalOpen(true)} />
        <div className="mx-auto w-full max-w-md px-4 py-20 text-center text-sm font-medium text-slate-500">
          Memuat detail program...
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DetailHeader title="Program Donasi" onOpenShare={() => setIsShareModalOpen(true)} />
        <div className="mx-auto w-full max-w-md px-4 py-20 text-center text-sm font-medium text-red-500">
          Program tidak ditemukan.
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
    <main className="min-h-screen bg-gray-50 text-slate-900 pb-28 pt-2 flex justify-center">
      <div className="w-full max-w-md px-3 space-y-4">
        <DetailHeader title="Program Donasi" onOpenShare={() => setIsShareModalOpen(true)} />

        <div className="bg-white p-4 sm:p-6 shadow-sm border border-gray-200/90 space-y-4 rounded-xl">
          <div className="overflow-hidden bg-gray-100 aspect-[16/10] w-full border border-gray-100 shadow-inner rounded-xl">
            <img
              src={program.image || '/images/banner.png'}
              alt={program.title || 'Program BMA'}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-base sm:text-xl font-bold text-slate-900 leading-snug tracking-tight">
            {program.title}
          </h1>

          <div className="space-y-2 pt-1">
            <p className="text-lg sm:text-xl font-extrabold text-emerald-900">
              Rp {formatRupiah(currentCollected)}
            </p>
            <div className="flex justify-between items-center text-xs sm:text-sm text-slate-500 font-medium">
              <span>
                Terkumpul dari <strong className="text-slate-800">Rp {formatRupiah(rawTarget)}</strong>
              </span>
              {typeof program.daysLeft === 'number' && program.daysLeft <= 7 ? (
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded">
                  Mendesak
                </span>
              ) : (
                <span>{program.daysLeft ? `${program.daysLeft} hari lagi` : ''}</span>
              )}
            </div>

            <div className="w-full bg-gray-100 h-2.5 overflow-hidden shadow-inner rounded-full">
              <div
                className="bg-emerald-900 h-full transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex border-b border-gray-200 text-xs sm:text-sm font-bold text-slate-500 space-x-6 pt-2">
            {[
              { id: 'cerita', label: 'Cerita' },
              { id: 'donatur', label: `Donatur (${donors.length})` },
              { id: 'laporan', label: `Laporan (${reports.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'cerita' | 'donatur' | 'laporan')}
                className={`pb-2.5 transition focus:outline-none cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-emerald-900 border-b-2 border-emerald-900'
                    : 'border-b-2 border-transparent hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-2 text-left">
            {activeTab === 'cerita' && (
              <div className="space-y-4">
                {category === 'ZAKAT' && (
                  <EmbeddedZakatCalculator onApplyAmount={(val) => setAmount(val)} />
                )}

                <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                  {program.description ? (
                    typeof program.description === 'string' ? (
                      <p>{program.description}</p>
                    ) : (
                      <PortableText value={program.description} components={portableTextComponents} />
                    )
                  ) : (
                    <p className="text-slate-400 italic">Belum ada cerita detail.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'donatur' && (
              <div className="space-y-3 py-1">
                {donors.length > 0 ? (
                  [...donors].reverse().map((donor: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200/80 p-3.5 flex items-center justify-between rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold text-base shadow-inner rounded-full">
                          {(donor.name || 'H').toUpperCase().slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-bold text-slate-800">
                            {donor.name || 'Hamba Allah'}
                          </p>
                          <p className="text-xs text-slate-400 font-normal">
                            {donor.date || 'Baru Saja'}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-emerald-900">
                        {`+Rp ${Number(donor.amount || 0).toLocaleString('id-ID')}`}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-sm sm:text-base text-slate-400">
                    Belum ada donatur.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'laporan' && (
              <div className="space-y-4 py-1">
                {reports.length > 0 ? (
                  [...reports].reverse().map((report: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200/80 p-4 space-y-2.5 rounded-xl">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                        <h4 className="text-sm sm:text-base font-bold text-slate-800">
                          {report.title || 'Laporan Penyaluran'}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium">{report.date}</span>
                      </div>
                      <div className="text-sm sm:text-base text-slate-800 leading-relaxed">
                        {typeof report.content === 'string' ? (
                          <p>{report.content}</p>
                        ) : (
                          <PortableText value={report.content} components={portableTextComponents} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-sm sm:text-base text-slate-400">
                    Belum ada pembaruan laporan.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-3">
        <div className="w-[calc(100%-1.5rem)] max-w-md bg-white border border-gray-200 p-3.5 shadow-xl pointer-events-auto rounded-2xl">
          <button
            onClick={() => setIsMobileFormOpen(true)}
            className="w-full bg-[#e91e63] hover:bg-pink-700 active:scale-[0.99] text-white text-sm sm:text-base font-extrabold py-4 shadow-md transition-all uppercase tracking-wide cursor-pointer rounded-xl"
          >
            DONASI SEKARANG
          </button>
        </div>
      </div>

      {isMobileFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-3">
          <div className="absolute inset-0" onClick={() => setIsMobileFormOpen(false)} />
          <div className="relative w-full max-w-md bg-white p-5 space-y-4 max-h-[90vh] overflow-y-auto z-10 shadow-2xl border border-gray-200 rounded-t-2xl sm:rounded-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                Pilih Nominal Donasi
              </h3>
              <button
                onClick={() => setIsMobileFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
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
        </div>
      )}

      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3">
          <div className="absolute inset-0" onClick={() => setIsShareModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white p-5 space-y-4 z-10 shadow-2xl border border-gray-200 text-left rounded-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                Bagikan Program Kebaikan
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-600 block">
                Tautan Program
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-gray-50 border border-gray-300 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-700 truncate focus:outline-none rounded-lg"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-emerald-900 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shrink-0 flex items-center gap-1.5 hover:bg-emerald-950 transition shadow-sm cursor-pointer rounded-lg"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Ayo bantu program kebaikan ini: ${program?.title || ''}\n${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1.5 hover:bg-emerald-100 transition shadow-2xs rounded-xl"
              >
                <MessageCircle className="w-6 h-6 text-emerald-600" />
                <span className="text-xs sm:text-sm font-bold">WhatsApp</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 bg-blue-50 border border-blue-200 text-blue-800 space-y-1.5 hover:bg-blue-100 transition shadow-2xs rounded-xl"
              >
                <svg className="w-6 h-6 fill-current text-blue-600" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-xs sm:text-sm font-bold">Facebook</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(program?.title || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 bg-gray-100 border border-gray-200 text-slate-800 space-y-1.5 hover:bg-gray-200 transition shadow-2xl rounded-xl"
              >
                <svg className="w-5 h-5 fill-current text-slate-900 mt-0.5" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-xs sm:text-sm font-bold mt-0.5">Twitter/X</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}