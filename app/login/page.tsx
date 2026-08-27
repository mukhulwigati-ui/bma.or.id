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
    useState<'login' | 'register'>('login');

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
    e: React.FormEvent<HTMLFormElement>
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
            'Pendaftaran berhasil! Silakan periksa email Anda untuk melakukan verifikasi sebelum masuk.'
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
  // GOOGLE AUTH
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
  // LOADING SESSION
  // ============================================================

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center px-4">

        <div className="flex flex-col items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center border border-[#D8B400] bg-[#FFD600] shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-[#242424]" />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">
            Memeriksa sesi {SITE_SHORT_NAME}
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-[#F3F3F1] px-3 py-5 pb-28 sm:px-4 sm:py-8">

      <div className="mx-auto w-full max-w-md space-y-4">

        {/* =====================================================
            BRAND HERO
        ====================================================== */}

        <section className="relative overflow-hidden border border-[#D5B300] bg-[#FFD600] shadow-[0_10px_30px_rgba(45,45,45,0.08)]">

          {/* dekorasi geometris */}
          <div className="pointer-events-none absolute right-[-65px] top-[-70px] h-44 w-44 border border-black/[0.06]" />

          <div className="pointer-events-none absolute bottom-[-80px] right-8 h-40 w-40 border border-black/[0.06]" />

          {/* garis aksen atas */}
          <div className="absolute left-0 top-0 h-[4px] w-full bg-[#242424]" />

          <div className="relative z-10 p-5 sm:p-6">

            {/* header hero */}
            <div className="flex items-start justify-between gap-4">

              <div className="flex min-w-0 items-center gap-3.5">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-black/15 bg-white/55 shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-[#292929]" />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-black/55">
                    {SITE_SHORT_NAME} MEMBER AREA
                  </p>

                  <h1 className="mt-1 text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-[#292929]">
                    {mode === 'login'
                      ? 'Selamat Datang Kembali'
                      : 'Daftar Akun BMA'}
                  </h1>

                </div>

              </div>

              <div className="flex shrink-0 items-center gap-1.5 border border-black/15 bg-white/40 px-2.5 py-2">

                <LockKeyhole className="h-3.5 w-3.5 text-[#292929]" />

                <span className="hidden text-[8px] font-extrabold uppercase tracking-[0.12em] text-black/65 sm:inline">
                  Secure
                </span>

              </div>

            </div>

            {/* description */}
            <p className="mt-5 max-w-[365px] text-[13px] font-medium leading-6 text-[#4B4530]">

              {mode === 'login'
                ? 'Masuk untuk melihat riwayat donasi, kuitansi, program favorit, dan aktivitas akun Anda.'
                : 'Daftar untuk memudahkan pencatatan donasi dan mengakses layanan digital Baitul Maal Al Muttaqin.'}

            </p>

            {/* footer hero */}
            <div className="mt-5 flex items-center gap-2 border-t border-black/10 pt-4">

              <CheckCircle2 className="h-4 w-4 text-[#333333]" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-black/60">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </span>

            </div>

          </div>

        </section>

        {/* =====================================================
            LOGIN CARD
        ====================================================== */}

        <section className="border border-[#D7D7D2] bg-white shadow-[0_10px_30px_rgba(35,35,35,0.06)]">

          {/* HEADER CARD */}
          <div className="border-b border-[#E3E3DF] px-5 py-5 sm:px-6">

            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#A08200]">

              {mode === 'login'
                ? 'AKSES AKUN'
                : 'PENDAFTARAN'}

            </p>

            <h2 className="mt-1.5 text-[20px] font-extrabold tracking-tight text-[#303030]">

              {mode === 'login'
                ? 'Masuk ke Akun'
                : 'Buat Akun Baru'}

            </h2>

            <p className="mt-1 text-[12px] leading-relaxed text-stone-500">

              {mode === 'login'
                ? 'Gunakan email dan kata sandi akun Anda.'
                : 'Buat akun BMA untuk mengakses layanan donatur.'}

            </p>

          </div>

          <div className="p-5 sm:p-6">

            {/* =================================================
                MODE SWITCH
            ================================================== */}

            <div className="grid grid-cols-2 border border-[#DADAD5] bg-[#F2F2EF]">

              <button
                type="button"
                onClick={() =>
                  setMode('login')
                }
                className={`border-r border-[#DADAD5] py-3.5 text-[11px] font-extrabold uppercase tracking-[0.14em] transition ${
                  mode === 'login'
                    ? 'bg-[#FFD600] text-[#252525]'
                    : 'bg-transparent text-stone-500 hover:bg-white'
                }`}
              >
                Masuk
              </button>

              <button
                type="button"
                onClick={() =>
                  setMode('register')
                }
                className={`py-3.5 text-[11px] font-extrabold uppercase tracking-[0.14em] transition ${
                  mode === 'register'
                    ? 'bg-[#FFD600] text-[#252525]'
                    : 'bg-transparent text-stone-500 hover:bg-white'
                }`}
              >
                Daftar
              </button>

            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleAuth}
              className="mt-6 space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-stone-600">
                  Alamat Email
                </label>

                <div className="relative mt-2">

                  <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400" />

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
                      h-[54px]
                      w-full
                      border
                      border-[#D9D9D4]
                      bg-[#F8F8F6]
                      py-3
                      pl-12
                      pr-4
                      text-[14px]
                      font-semibold
                      text-[#333333]
                      outline-none
                      transition
                      placeholder:font-normal
                      placeholder:text-stone-400
                      hover:border-[#C8C8C2]
                      focus:border-[#C5A400]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#FFD600]/30
                    "
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-stone-600">
                  Kata Sandi
                </label>

                <div className="relative mt-2">

                  <LockKeyhole className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400" />

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
                      h-[54px]
                      w-full
                      border
                      border-[#D9D9D4]
                      bg-[#F8F8F6]
                      py-3
                      pl-12
                      pr-12
                      text-[14px]
                      font-semibold
                      text-[#333333]
                      outline-none
                      transition
                      placeholder:text-stone-400
                      hover:border-[#C8C8C2]
                      focus:border-[#C5A400]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#FFD600]/30
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
                    className="absolute right-0 top-0 flex h-full w-12 items-center justify-center border-l border-[#E0E0DC] text-stone-400 transition hover:bg-[#FFF6C5] hover:text-[#333333]"
                  >

                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}

                  </button>

                </div>

                {mode === 'register' && (

                  <p className="mt-2 text-[11px] leading-relaxed text-stone-500">
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
                  h-[54px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  border
                  border-[#CBAA00]
                  bg-[#FFD600]
                  px-4
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-[#272727]
                  shadow-[0_5px_12px_rgba(120,100,0,0.12)]
                  transition
                  hover:bg-[#F3CA00]
                  active:bg-[#E8C100]
                  disabled:cursor-not-allowed
                  disabled:border-stone-200
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

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="relative my-6">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E2DE]" />
              </div>

              <div className="relative flex justify-center">

                <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-400">
                  Atau lanjutkan dengan
                </span>

              </div>

            </div>

            {/* =================================================
                GOOGLE
            ================================================== */}

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="
                flex
                h-[54px]
                w-full
                items-center
                justify-center
                gap-3
                border
                border-[#D8D8D3]
                bg-white
                px-4
                text-[13px]
                font-bold
                text-stone-700
                transition
                hover:border-[#BABAB4]
                hover:bg-[#F7F7F5]
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

            {/* =================================================
                SWITCH ACCOUNT MODE
            ================================================== */}

            <div className="mt-6 border-t border-[#E7E7E3] pt-5 text-center">

              <p className="text-[12px] text-stone-500">

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
                  className="font-extrabold text-[#927800] transition hover:text-[#333333]"
                >

                  {mode === 'login'
                    ? 'Daftar sekarang'
                    : 'Masuk sekarang'}

                </button>

              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            SECURITY INFO
        ====================================================== */}

        <section className="border border-[#D8D8D2] bg-[#E9E9E6]">

          <div className="flex items-start gap-3 p-4 sm:p-5">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#CFCFC9] bg-white">

              <ShieldCheck className="h-[18px] w-[18px] text-[#555555]" />

            </div>

            <div>

              <p className="text-[12px] font-extrabold text-[#393939]">
                Akun & Keamanan
              </p>

              <p className="mt-1 text-[11px] leading-[1.7] text-stone-500">
                Gunakan email aktif dan jangan pernah membagikan kata sandi atau akses akun kepada pihak lain.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            BRAND FOOTER
        ====================================================== */}

        <footer className="border-t border-[#D7D7D2] pb-3 pt-4 text-center">

          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#6F6F69]">
            {SITE_NAME}
          </p>

          <p className="mt-1 text-[10px] font-medium text-stone-400">
            {SITE_DOMAIN} • {SITE_LOCATION}
          </p>

        </footer>

      </div>

    </main>
  );
}