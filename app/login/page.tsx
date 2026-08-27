// app/login/page.tsx
'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [mode, setMode] = useState<
    'login' | 'register'
  >('login');

  const [showPassword, setShowPassword] =
    useState(false);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const router = useRouter();

  // ============================================================
  // CEK SESSION USER
  // ============================================================
  useEffect(() => {
    async function checkUserSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          router.replace('/akun');
          return;
        }
      } catch (err) {
        console.error(
          'Error checking session:',
          err
        );
      } finally {
        setCheckingAuth(false);
      }
    }

    checkUserSession();
  }, [supabase, router]);

  // ============================================================
  // LOGIN / REGISTER EMAIL
  // ============================================================
  const handleAuth = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (mode === 'register') {
        const {
          data,
          error,
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          alert(error.message);
          return;
        }

        if (data.session) {
          router.push('/akun');
          router.refresh();
        } else {
          alert(
            'Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi sebelum masuk.'
          );

          setMode('login');
        }
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) {
          alert(error.message);
          return;
        }

        router.push('/akun');
        router.refresh();
      }
    } catch (err: any) {
      alert(
        err?.message ||
          'Terjadi kesalahan. Silakan coba kembali.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // GOOGLE OAUTH
  // ============================================================
  const handleGoogleAuth = async () => {
    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo:
              `${window.location.origin}/auth/callback`,
          },
        });

      if (error) {
        alert(error.message);
      }
    } catch (err: any) {
      alert(
        err?.message ||
          'Gagal terhubung dengan Google.'
      );
    }
  };

  // ============================================================
  // CHECKING SESSION
  // ============================================================
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4">

        <div className="flex flex-col items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-[#102a43] flex items-center justify-center shadow-lg">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>

          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Memeriksa sesi {SITE_SHORT_NAME}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-5 sm:py-10 flex items-center justify-center">

      <div className="w-full max-w-md space-y-4">

        {/* =====================================================
            PREMIUM BRAND HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[30px] bg-[#102a43] shadow-[0_20px_55px_rgba(16,42,67,0.18)]">

          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

          <div className="absolute right-4 bottom-[-80px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

          <div className="relative z-10 p-5 sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-[#d7b66a]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Member Area
                  </p>

                  <h1 className="mt-1 text-[18px] font-bold tracking-tight text-white">
                    {mode === 'login'
                      ? 'Selamat Datang Kembali'
                      : 'Buat Akun Donatur'}
                  </h1>
                </div>

              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-2.5 py-1.5">
                <LockKeyhole className="w-3 h-3 text-[#d7b66a]" />

                <span className="text-[7px] font-bold uppercase tracking-wider text-[#e7d5a4]">
                  Secure
                </span>
              </div>

            </div>

            <p className="mt-5 text-[10px] leading-relaxed text-slate-300">
              {mode === 'login'
                ? 'Masuk untuk melihat riwayat donasi, kuitansi, program favorit, dan aktivitas akun Anda.'
                : 'Daftar untuk memudahkan pencatatan donasi dan mengakses layanan digital Baitul Maal Al Muttaqin.'}
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
            AUTH CARD
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 p-5 sm:p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          {/* MODE HEADER */}
          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {mode === 'login'
                  ? 'Akses Akun'
                  : 'Pendaftaran'}
              </p>

              <h2 className="mt-1 text-[15px] font-bold text-[#102a43]">
                {mode === 'login'
                  ? 'Masuk ke Akun'
                  : 'Daftar Akun Baru'}
              </h2>

            </div>

            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#a37c32]" />
            </div>

          </div>

          {/* MODE SWITCH */}
          <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">

            <button
              type="button"
              onClick={() =>
                setMode('login')
              }
              className={`rounded-xl py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] transition ${
                mode === 'login'
                  ? 'bg-white text-[#102a43] shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              Masuk
            </button>

            <button
              type="button"
              onClick={() =>
                setMode('register')
              }
              className={`rounded-xl py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] transition ${
                mode === 'register'
                  ? 'bg-white text-[#102a43] shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              Daftar
            </button>

          </div>

          {/* ===================================================
              FORM
          =================================================== */}
          <form
            onSubmit={handleAuth}
            className="mt-5 space-y-4"
          >

            {/* EMAIL */}
            <div>

              <label className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 block">
                Alamat Email
              </label>

              <div className="relative mt-2">

                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="email"
                  autoComplete="email"
                  className="w-full h-12 pl-11 pr-4 bg-[#f8f8f6] border border-slate-200 rounded-2xl focus:border-[#a37c32] focus:bg-white focus:ring-4 focus:ring-[#a37c32]/8 focus:outline-none transition text-slate-800 text-[11px] font-semibold placeholder:text-slate-400"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div>

              <label className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 block">
                Kata Sandi
              </label>

              <div className="relative mt-2">

                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  autoComplete={
                    mode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                  className="w-full h-12 pl-11 pr-12 bg-[#f8f8f6] border border-slate-200 rounded-2xl focus:border-[#a37c32] focus:bg-white focus:ring-4 focus:ring-[#a37c32]/8 focus:outline-none transition text-slate-800 text-[11px] font-semibold placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                  minLength={6}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Sembunyikan kata sandi'
                      : 'Tampilkan kata sandi'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

              {mode === 'register' && (
                <p className="mt-2 text-[8px] leading-relaxed text-slate-400">
                  Gunakan minimal 6 karakter untuk
                  membantu menjaga keamanan akun.
                </p>
              )}

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-[#102a43] hover:bg-[#173d5d] disabled:bg-slate-300 text-white font-bold text-[9px] uppercase tracking-[0.16em] transition shadow-lg shadow-[#102a43]/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses
                </>
              ) : (
                <>
                  {mode === 'login'
                    ? 'Masuk ke Akun'
                    : 'Daftar dengan Email'}

                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* ===================================================
              DIVIDER
          =================================================== */}
          <div className="relative my-6">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>

            <div className="relative flex justify-center">

              <span className="bg-white px-3 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Atau lanjutkan dengan
              </span>

            </div>

          </div>

          {/* ===================================================
              GOOGLE
          =================================================== */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full h-12 flex items-center justify-center gap-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl font-semibold text-slate-700 transition text-[10px] shadow-sm cursor-pointer"
          >
            <img
              src="/google-icon.svg"
              alt="Google"
              className="w-5 h-5"
            />

            <span>
              {mode === 'login'
                ? 'Masuk dengan Google'
                : 'Daftar dengan Google'}
            </span>
          </button>

          {/* ===================================================
              SWITCH TEXT
          =================================================== */}
          <div className="mt-5 text-center">

            <p className="text-[9px] text-slate-400">

              {mode === 'login'
                ? 'Belum memiliki akun?'
                : 'Sudah memiliki akun?'}

              {' '}

              <button
                type="button"
                onClick={() =>
                  setMode(
                    mode === 'login'
                      ? 'register'
                      : 'login'
                  )
                }
                className="font-bold text-[#a37c32] hover:text-[#876725] transition cursor-pointer"
              >
                {mode === 'login'
                  ? 'Daftar sekarang'
                  : 'Masuk sekarang'}
              </button>

            </p>

          </div>

        </section>

        {/* =====================================================
            SECURITY INFO
        ====================================================== */}
        <section className="rounded-[22px] border border-[#eadfca] bg-[#f7f2e7]/60 p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <div>

              <p className="text-[9px] font-bold text-[#102a43]">
                Akun & Keamanan
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                Gunakan email aktif dan jangan membagikan
                kata sandi atau akses akun kepada pihak lain.
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