// app/pengaturan/page.tsx
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
  CheckCircle2,
  Loader2,
  ShieldCheck,
  UserRound,
  Mail,
  Phone,
  Save,
  Sparkles,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

export default function PengaturanPage() {
  const [profile, setProfile] =
    useState<any>(null);

  const [name, setName] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  // ============================================================
  // LOAD PROFILE
  // ============================================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setProfile(data);
          setName(data.name || data.full_name || '');
          setPhone(data.phone || '');
        } else {
          const meta = user.user_metadata || {};
          const defaultName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Dermawan';
          
          const newProf = {
            id: user.id,
            email: user.email,
            name: defaultName,
            avatar: meta.avatar_url || meta.picture || '',
            phone: '',
          };

          await supabase.from('profiles').upsert(newProf);
          setProfile(newProf);
          setName(defaultName);
          setPhone('');
        }
      } catch (error) {
        console.error(
          'Gagal memuat profil:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  // ============================================================
  // SAVE PROFILE
  // ============================================================
  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSaving(true);
    setMessage('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          'Sesi login telah berakhir. Silakan masuk kembali.'
        );
      }

      const cleanPhone =
        phone.replace(/[^0-9]/g, '');

      if (
        cleanPhone &&
        cleanPhone.length < 9
      ) {
        throw new Error(
          'Nomor WhatsApp tidak valid.'
        );
      }

      const updatePayload = {
        id: user.id,
        email: user.email,
        name: name.trim(),
        phone: cleanPhone,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updatePayload);

      if (error) {
        throw error;
      }

      setPhone(cleanPhone);

      setProfile(
        (prev: any) => ({
          ...prev,
          name: name.trim(),
          phone: cleanPhone,
        })
      );

      setMessage(
        'Pengaturan akun berhasil disimpan.'
      );

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err: any) {
      alert(
        'Gagal menyimpan: ' +
          (err?.message ||
            'Terjadi kesalahan.')
      );
    } finally {
      setSaving(false);
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

          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Memuat pengaturan {SITE_SHORT_NAME}
          </p>
        </div>
      </div>
    );
  }

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

            <div className="flex items-center gap-3">

              <Link
                href="/akun"
                aria-label="Kembali ke akun"
                className="w-9 h-9 shrink-0 bg-white/8 border border-white/15 flex items-center justify-center hover:bg-white/20 transition"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </Link>

              <div className="min-w-0 flex-1">

                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                  {SITE_SHORT_NAME} Account Settings
                </p>

                <h1 className="mt-0.5 text-[15px] font-bold text-white">
                  Pengaturan Akun
                </h1>

              </div>

              <div className="w-9 h-9 shrink-0 bg-white/8 border border-white/15 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#d7b66a]" />
              </div>

            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-200">
              Kelola informasi profil yang digunakan
              pada layanan digital {SITE_NAME}.
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
            PROFILE INTRO
        ===================================================== */}
        <section className="relative overflow-hidden bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#f7f2e7]" />

          <div className="relative z-10 flex items-center gap-3">

            <div className="w-9 h-9 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
              <UserRound className="w-4 h-4 text-[#a37c32]" />
            </div>

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Profil Member
              </p>

              <h2 className="mt-0.5 text-[12px] font-bold text-slate-800">
                Informasi Akun Anda
              </h2>

            </div>

          </div>

          <p className="relative z-10 mt-2.5 text-[9px] leading-relaxed text-slate-500">
            Pastikan nama dan nomor WhatsApp Anda
            selalu benar agar pencatatan transaksi,
            referral, dan komunikasi akun berjalan
            dengan baik.
          </p>

        </section>

        {/* =====================================================
            FORM PENGATURAN
        ===================================================== */}
        <form
          onSubmit={handleSave}
          className="bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4"
        >

          {/* NAME */}
          <div>

            <label className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 block">
              Nama Lengkap
            </label>

            <div className="relative mt-1.5">

              <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Nama lengkap"
                className="w-full h-11 pl-10 pr-4 bg-[#f8f8f6] border border-slate-200 text-[11px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#073f2e]"
              />

            </div>

          </div>

          {/* EMAIL */}
          <div>

            <label className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 block">
              Email Terdaftar
            </label>

            <div className="relative mt-1.5">

              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />

              <input
                type="email"
                disabled
                value={
                  profile?.email || ''
                }
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-400 cursor-not-allowed"
              />

            </div>

            <div className="mt-2 flex items-start gap-1.5">

              <ShieldCheck className="w-3 h-3 shrink-0 mt-0.5 text-[#a37c32]" />

              <p className="text-[8px] leading-relaxed text-slate-400">
                Email digunakan sebagai identitas
                autentikasi akun dan tidak dapat
                diubah melalui halaman ini.
              </p>

            </div>

          </div>

          {/* PHONE */}
          <div>

            <label className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 block">
              Nomor WhatsApp
            </label>

            <div className="relative mt-1.5">

              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Contoh: 081234567890"
                className="w-full h-11 pl-10 pr-4 bg-[#f8f8f6] border border-slate-200 text-[11px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#073f2e]"
              />

            </div>

            <p className="mt-1.5 text-[8px] leading-relaxed text-slate-400">
              Nomor WhatsApp dapat digunakan untuk
              komunikasi layanan dan identitas referral.
            </p>

          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 p-3">

              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />

              <p className="text-[9px] font-semibold leading-relaxed text-emerald-700">
                {message}
              </p>

            </div>
          )}

          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="w-full h-11 bg-[#073f2e] hover:bg-[#052e21] disabled:bg-slate-300 text-white font-bold text-[9px] uppercase tracking-[0.16em] transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </button>

        </form>

        {/* =====================================================
            SECURITY CARD
        ===================================================== */}
        <section className="border border-[#eadfca] bg-[#f7f2e7]/60 p-3.5">

          <div className="flex items-start gap-3">

            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <div>

              <p className="text-[9px] font-bold text-slate-800">
                Informasi Profil
              </p>

              <p className="mt-0.5 text-[8px] leading-relaxed text-slate-500">
                Perubahan data profil akan tersimpan
                pada akun Anda dan digunakan pada
                layanan terkait di {SITE_DOMAIN}.
              </p>

            </div>

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
    </main>
  );
}