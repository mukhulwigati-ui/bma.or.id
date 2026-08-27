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
  CheckCircle2,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] =
    useState(false);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [mode, setMode] =
    useState<'login' | 'register'>(
      'login'
    );

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env
          .NEXT_PUBLIC_SUPABASE_URL!,
        process.env
          .NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
        } =
          await supabase.auth.getSession();

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
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (mode === 'register') {
        const {
          data,
          error,
        } =
          await supabase.auth.signUp({
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
            'Pendaftaran berhasil! Silakan periksa email Anda untuk melakukan verifikasi sebelum masuk.'
          );

          setMode('login');
        }
      } else {
        const { error } =
          await supabase.auth.signInWithPassword(
            {
              email,
              password,
            }
          );

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
  // GOOGLE AUTH
  // ============================================================
  const handleGoogleAuth =
    async () => {
      try {
        const { error } =
          await supabase.auth.signInWithOAuth(
            {
              provider: 'google',
              options: {
                redirectTo:
                  `${window.location.origin}/auth/callback`,
              },
            }
          );

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
  // LOADING SESSION
  // ============================================================
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FFF9DD] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD900] shadow-[0_10px_30px_rgba(234,179,8,0.22)]">
            <Loader2 className="h-5 w-5 animate-spin text-black" />
          </div>

          <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-stone-500">
            Memeriksa sesi {SITE_SHORT_NAME}
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9DD] px-4 py-6 sm:py-10">

      <div className="mx-auto w-full max-w-md space-y-4">

        {/* =====================================================
            BRAND HERO
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[32px] border border-[#F0C900] bg-[#FFD900] shadow-[0_18px_50px_rgba(180,140,0,0.16)]">

          {/* Decorative shapes */}
          <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full border border-black/10" />

          <div className="absolute right-2 bottom-[-70px] h-40 w-40 rounded-full border border-black/10" />

          <div className="absolute -left-10 bottom-[-50px] h-32 w-32 rounded-full bg-white/20 blur-xl" />

          <div className="relative z-10 px-5 py-6 sm:px-6">

            {/* Top */}
            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white/55 shadow-sm backdrop-blur-sm">
                  <ShieldCheck className="h-5 w-5 text-black" />
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-black/55">
                    {SITE_SHORT_NAME} MEMBER AREA
                  </p>

                  <h1 className="mt-1 text-[20px] font-black tracking-tight text-black">
                    {mode === 'login'
                      ? 'Selamat Datang Kembali'
                      : 'Daftar Akun BMA'}
                  </h1>
                </div>

              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/10 bg-white/40 px-2.5 py-1.5 backdrop-blur-sm">
                <LockKeyhole className="h-3 w-3 text-black" />

                <span className="text-[7px] font-black uppercase tracking-wider text-black/70">
                  Secure
                </span>
              </div>

            </div>

            {/* Main copy */}
            <div className="mt-6">

              <p className="max-w-[340px] text-[11px] font-semibold leading-[1.75] text-black/70">
                {mode === 'login'
                  ? 'Masuk untuk melihat riwayat donasi, kuitansi, program favorit, dan aktivitas akun Anda.'
                  : 'Daftar untuk memudahkan pencatatan donasi dan mengakses berbagai layanan digital Baitul Maal Al Muttaqin.'}
              </p>

            </div>

            {/* Footer brand */}
            <div className="mt-5 flex items-center gap-2">

              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-black">
                <CheckCircle2 className="h-3 w-3 text-[#FFD900]" />
              </div>

              <span className="text-[8px] font-black uppercase tracking-[0.16em] text-black/65">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </span>

            </div>

          </div>

        </section>

        {/* =====================================================
            LOGIN / REGISTER CARD
        ====================================================== */}
        <section className="rounded-[30px] border border-[#E9DFC1] bg-white p-5 shadow-[0_18px_50px_rgba(76,60,10,0.08)] sm:p-6">

          {/* Heading */}
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#B89200]">
                {mode === 'login'
                  ? 'AKSES AKUN'
                  : 'PENDAFTARAN'}
              </p>

              <h2 className="mt-1 text-[17px] font-black tracking-tight text-stone-900">
                {mode === 'login'
                  ? 'Masuk ke Akun'
                  : 'Buat Akun Baru'}
              </h2>

              <p className="mt-1 text-[9px] text-stone-400">
                {mode === 'login'
                  ? 'Silakan masukkan data akun Anda.'
                  : 'Daftar hanya dalam beberapa langkah.'}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF5B7]">
              <Sparkles className="h-4 w-4 text-[#A17800]" />
            </div>

          </div>

          {/* ===================================================
              MODE SWITCH
          =================================================== */}
          <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl border border-[#EFE7C9] bg-[#FFF9E5] p-1">

            <button
              type="button"
              onClick={() =>
                setMode('login')
              }
              className={`rounded-xl py-3 text-[9px] font-black uppercase tracking-[0.15em] transition-all ${
                mode === 'login'
                  ? 'bg-[#FFD900] text-black shadow-sm'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Masuk
            </button>

            <button
              type="button"
              onClick={() =>
                setMode('register')
              }
              className={`rounded-xl py-3 text-[9px] font-black uppercase tracking-[0.15em] transition-all ${
                mode === 'register'
                  ? 'bg-[#FFD900] text-black shadow-sm'
                  : 'text-stone-400 hover:text-stone-700'
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
            className="mt-6 space-y-4"
          >

            {/* EMAIL */}
            <div>

              <label className="block text-[9px] font-black uppercase tracking-[0.14em] text-stone-500">
                Alamat Email
              </label>

              <div className="relative mt-2">

                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                  placeholder="nama@email.com"
                  className="
                    h-13
                    w-full
                    rounded-2xl
                    border
                    border-[#E7E0CB]
                    bg-[#FFFDF5]
                    py-3.5
                    pl-11
                    pr-4
                    text-[11px]
                    font-bold
                    text-stone-900
                    outline-none
                    transition-all
                    placeholder:font-medium
                    placeholder:text-stone-300
                    focus:border-[#E0B900]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#FFD900]/20
                  "
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block text-[9px] font-black uppercase tracking-[0.14em] text-stone-500">
                Kata Sandi
              </label>

              <div className="relative mt-2">

                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

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
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="
                    h-13
                    w-full
                    rounded-2xl
                    border
                    border-[#E7E0CB]
                    bg-[#FFFDF5]
                    py-3.5
                    pl-11
                    pr-12
                    text-[11px]
                    font-bold
                    text-stone-900
                    outline-none
                    transition-all
                    placeholder:text-stone-300
                    focus:border-[#E0B900]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#FFD900]/20
                  "
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
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition hover:bg-[#FFF4B8] hover:text-black"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

              {mode === 'register' && (
                <p className="mt-2 text-[8px] leading-relaxed text-stone-400">
                  Gunakan minimal 6 karakter untuk membantu menjaga keamanan akun.
                </p>
              )}

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex
                h-13
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[#FFD900]
                py-3.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.17em]
                text-black
                shadow-[0_10px_25px_rgba(218,173,0,0.20)]
                transition-all
                hover:bg-[#F4C900]
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:bg-stone-200
                disabled:text-stone-400
                disabled:shadow-none
              "
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses
                </>
              ) : (
                <>
                  {mode === 'login'
                    ? 'Masuk ke Akun'
                    : 'Daftar dengan Email'}

                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>

          {/* ===================================================
              DIVIDER
          =================================================== */}
          <div className="relative my-6">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EFE9D8]" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[8px] font-bold uppercase tracking-[0.14em] text-stone-400">
                Atau lanjutkan dengan
              </span>
            </div>

          </div>

          {/* ===================================================
              GOOGLE LOGIN
          =================================================== */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="
              flex
              h-13
              w-full
              items-center
              justify-center
              gap-2.5
              rounded-2xl
              border
              border-[#E7E0CB]
              bg-white
              py-3.5
              text-[10px]
              font-bold
              text-stone-700
              shadow-sm
              transition-all
              hover:border-[#D5C89E]
              hover:bg-[#FFFDF5]
            "
          >
            <img
              src="/google-icon.svg"
              alt="Google"
              className="h-5 w-5"
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

            <p className="text-[9px] text-stone-400">

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
                className="font-black text-[#A17800] transition hover:text-black"
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
        <section className="rounded-[24px] border border-[#EAD88C] bg-[#FFF2A8] p-4">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/60">
              <ShieldCheck className="h-4 w-4 text-black" />
            </div>

            <div>

              <p className="text-[9px] font-black text-stone-900">
                Akun & Keamanan
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-stone-600">
                Gunakan email aktif dan jangan pernah membagikan kata sandi atau akses akun kepada pihak lain.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            BRAND FOOTER
        ====================================================== */}
        <div className="pb-3 pt-1 text-center">

          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#9B7C00]">
            {SITE_NAME}
          </p>

          <p className="mt-1 text-[7px] font-medium text-stone-400">
            {SITE_DOMAIN} • {SITE_LOCATION}
          </p>

        </div>

      </div>
    </div>
  );
}