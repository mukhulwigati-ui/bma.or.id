// app/login/page.tsx

'use client';

import React, {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createBrowserClient,
} from '@supabase/ssr';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from 'lucide-react';

// 1. Buat komponen utama pembungkus Suspense untuk mengatasi prerender error
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f3f3f1] flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Memuat halaman...
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

// 2. Pindahkan seluruh logika asli ke dalam komponen ini
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================================
  // SUPABASE
  // ==========================================================

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  // ==========================================================
  // CEK ERROR CALLBACK
  // ==========================================================

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      console.error('Auth error:', error);
    }
  }, [searchParams]);

  // ==========================================================
  // CEK SESSION SAAT PAGE DIBUKA
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('getSession error:', error);
        }

        if (session && mounted) {
          router.replace('/akun');
          router.refresh();
          return;
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);

      if (session && event === 'SIGNED_IN') {
        router.replace('/akun');
        router.refresh();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  // ==========================================================
  // EMAIL LOGIN / REGISTER
  // ==========================================================

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/akun`,
          },
        });

        if (error) throw error;

        if (data.session) {
          router.replace('/akun');
          router.refresh();
          return;
        }

        alert('Pendaftaran berhasil. Silakan periksa email untuk verifikasi.');
        setMode('login');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error('Session login tidak terbentuk.');
      }

      router.replace('/akun');
      router.refresh();
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error?.message || 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // GOOGLE OAUTH
  // ==========================================================

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const callbackUrl = `${window.location.origin}/auth/callback?next=/akun`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      alert(error?.message || 'Login Google gagal.');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#f3f3f1] flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memeriksa sesi...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f1] px-3 pb-28 pt-5">
      <div className="mx-auto w-full max-w-sm border border-[#d7d7d2] bg-white shadow-sm">
        {/* HEADER */}
        <div className="border-b border-[#e1e1dd] px-6 py-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a08200]">
            Akses Akun
          </p>
          <h1 className="mt-1 text-[24px] font-extrabold tracking-tight text-[#303030]">
            {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun'}
          </h1>
          <p className="mt-1 text-[13px] text-stone-500">
            {mode === 'login'
              ? 'Gunakan email dan kata sandi akun Anda.'
              : 'Buat akun baru BMA.'}
          </p>
        </div>

        <div className="p-6">
          {/* TAB */}
          <div className="grid grid-cols-2 border border-[#d8d8d3] bg-[#f1f1ee]">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-3.5 text-[11px] font-extrabold uppercase tracking-[0.13em] ${
                mode === 'login'
                  ? 'bg-[#ffd600] text-[#292929]'
                  : 'text-stone-500'
              }`}
            >
              Masuk
            </button>

            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-3.5 text-[11px] font-extrabold uppercase tracking-[0.13em] ${
                mode === 'register'
                  ? 'bg-[#ffd600] text-[#292929]'
                  : 'text-stone-500'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleAuth} className="mt-6 space-y-5">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-stone-600">
                Alamat Email
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="h-[58px] w-full border border-[#d8d8d3] bg-[#fafaf8] pl-12 pr-4 text-[14px] font-semibold text-[#333333] outline-none focus:border-[#c4a300] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-stone-600">
                Kata Sandi
              </label>
              <div className="relative mt-2">
                <LockKeyhole className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-[58px] w-full border border-[#d8d8d3] bg-[#fafaf8] pl-12 pr-14 text-[14px] font-semibold text-[#333333] outline-none focus:border-[#c4a300] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-[#deded9] text-stone-400"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-[58px] w-full items-center justify-center gap-2 border border-[#c7a700] bg-[#ffd600] text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#292929] shadow-sm transition hover:bg-[#f0ca00] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e0e0dc]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-400">
                Atau lanjutkan dengan
              </span>
            </div>
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="flex h-[58px] w-full items-center justify-center gap-3 border border-[#d8d8d3] bg-white text-[14px] font-bold text-stone-700 transition hover:bg-[#f7f7f5] disabled:opacity-60"
          >
            <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
            Masuk dengan Google
          </button>

          {/* MODE SWITCH */}
          <div className="mt-7 border-t border-[#e4e4df] pt-5 text-center">
            <p className="text-[13px] text-stone-500">
              {mode === 'login' ? 'Belum memiliki akun?' : 'Sudah memiliki akun?'}{' '}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="font-extrabold text-[#927800]"
              >
                {mode === 'login' ? 'Daftar sekarang' : 'Masuk sekarang'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}