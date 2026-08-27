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
          setName(data.name || '');
          setPhone(data.phone || '');
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

      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          phone: cleanPhone,
          updated_at:
            new Date().toISOString(),
        })
        .eq('id', user.id);

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
          <div className="w-12 h-12 rounded-2xl bg-[#102a43] flex items-center justify-center shadow-lg">
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
    <div className="min-h-screen bg-[#f8f8f6] pb-28 pt-5 px-4">
      <div className="max-w-md mx-auto space-y-4">

        {/* =====================================================
            PREMIUM HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[30px] bg-[#102a43] shadow-[0_20px_55px_rgba(16,42,67,0.18)]">

          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

          <div className="absolute right-4 bottom-[-80px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

          <div className="relative z-10 p-5">

            <div className="flex items-center gap-3">

              <Link
                href="/akun"
                aria-label="Kembali ke akun"
                className="w-10 h-10 shrink-0 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center hover:bg-white/15 transition"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </Link>

              <div className="min-w-0 flex-1">

                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                  {SITE_SHORT_NAME} Account Settings
                </p>

                <h1 className="mt-1 text-[17px] font-bold text-white">
                  Pengaturan Akun
                </h1>

              </div>

              <div className="w-10 h-10 shrink-0 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#d7b66a]" />
              </div>

            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-slate-300">
              Kelola informasi profil yang digunakan
              pada layanan digital {SITE_NAME}.
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
            PROFILE INTRO
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[26px] bg-white border border-slate-200/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#f7f2e7]" />

          <div className="relative z-10 flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-[#f7f2e7] flex items-center justify-center">
              <UserRound className="w-5 h-5 text-[#a37c32]" />
            </div>

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Profil Member
              </p>

              <h2 className="mt-0.5 text-[13px] font-bold text-[#102a43]">
                Informasi Akun Anda
              </h2>

            </div>

          </div>

          <p className="relative z-10 mt-4 text-[9px] leading-relaxed text-slate-500">
            Pastikan nama dan nomor WhatsApp Anda
            selalu benar agar pencatatan transaksi,
            referral, dan komunikasi akun berjalan
            dengan baik.
          </p>

        </section>

        {/* =====================================================
            FORM PENGATURAN
        ====================================================== */}
        <form
          onSubmit={handleSave}
          className="rounded-[28px] bg-white border border-slate-200/70 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] space-y-5"
        >

          {/* NAME */}
          <div>

            <label className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 block">
              Nama Lengkap
            </label>

            <div className="relative mt-2">

              <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Nama lengkap"
                className="w-full h-12 pl-11 pr-4 bg-[#f8f8f6] border border-slate-200 rounded-2xl text-[11px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#a37c32] focus:ring-4 focus:ring-[#a37c32]/8"
              />

            </div>

          </div>

          {/* EMAIL */}
          <div>

            <label className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 block">
              Email Terdaftar
            </label>

            <div className="relative mt-2">

              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />

              <input
                type="email"
                disabled
                value={
                  profile?.email || ''
                }
                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-semibold text-slate-400 cursor-not-allowed"
              />

            </div>

            <div className="mt-2 flex items-start gap-2">

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

            <div className="relative mt-2">

              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Contoh: 081234567890"
                className="w-full h-12 pl-11 pr-4 bg-[#f8f8f6] border border-slate-200 rounded-2xl text-[11px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#a37c32] focus:ring-4 focus:ring-[#a37c32]/8"
              />

            </div>

            <p className="mt-2 text-[8px] leading-relaxed text-slate-400">
              Nomor WhatsApp dapat digunakan untuk
              komunikasi layanan dan identitas referral.
            </p>

          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-3.5">

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
            className="w-full h-12 rounded-2xl bg-[#102a43] hover:bg-[#173d5d] disabled:bg-slate-300 text-white font-bold text-[9px] uppercase tracking-[0.16em] transition shadow-lg shadow-[#102a43]/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
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
        ====================================================== */}
        <section className="rounded-[22px] border border-[#eadfca] bg-[#f7f2e7]/60 p-4">

          <div className="flex items-start gap-3">

            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <div>

              <p className="text-[9px] font-bold text-[#102a43]">
                Informasi Profil
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                Perubahan data profil akan tersimpan
                pada akun Anda dan digunakan pada
                layanan terkait di {SITE_DOMAIN}.
              </p>

            </div>

          </div>

        </section>

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