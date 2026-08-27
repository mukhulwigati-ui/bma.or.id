// app/login/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, Sparkles, ArrowRight } from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);
  
  const router = useRouter();

  useEffect(() => {
    async function checkUserSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/akun');
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkUserSession();
  }, [supabase, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (mode === 'register') {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        alert(error.message);
      } else {
        if (data.session) {
          router.push('/');
          router.refresh();
        } else {
          alert('Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi atau langsung masuk.');
          setMode('login');
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        alert(error.message);
      } else {
        router.push('/');
        router.refresh();
      }
    }
    
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/auth/callback` 
      }
    });

    if (error) {
      alert(error.message);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-11 h-11 bg-[#073f2e] flex items-center justify-center shadow-lg">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Memeriksa sesi...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-slate-900 pb-28 pt-2 flex justify-center items-center px-0">
      <div className="w-full max-w-[420px] space-y-3 px-0">

        {/* =====================================================
            PREMIUM HEADER
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#073f2e] shadow-[0_4px_20px_rgba(7,63,46,0.12)] border-y border-[#073f2e]/20 text-center">
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />
          <div className="absolute right-4 bottom-[-80px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

          <div className="relative z-10 p-5 sm:p-6">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
              {SITE_SHORT_NAME} Account Center
            </p>
            <h1 className="mt-1 text-[20px] font-bold text-white">
              {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
            </h1>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-200">
              Akses riwayat donasi, program pilihan, dan kelola akun {SITE_NAME} Anda.
            </p>
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />
              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#e6d19d]">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </span>
            </div>
          </div>
          <div className="h-[3px] bg-gradient-to-r from-[#b08a3d] via-[#dfc27e] to-[#b08a3d]" />
        </section>

        {/* =====================================================
            FORM CARD
        ===================================================== */}
        <section className="bg-white border-y border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">

          {/* Header Tab Mode */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {mode === 'login' ? 'Silakan Masuk' : 'Pendaftaran Member'}
            </span>
            <button 
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[9px] font-bold text-[#073f2e] hover:underline cursor-pointer uppercase tracking-wider"
            >
              {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-3.5">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                className="w-full h-11 px-3.5 bg-[#f8f8f6] border border-slate-200 text-[11px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#073f2e]"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 block mb-1">Kata Sandi</label>
              <input
                type="password"
                className="w-full h-11 px-3.5 bg-[#f8f8f6] border border-slate-200 text-[11px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#073f2e]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#073f2e] hover:bg-[#052e21] text-white font-bold text-[9px] uppercase tracking-[0.16em] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Masuk' : 'Daftar dengan Email'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[8px] uppercase tracking-wider">
              <span className="bg-white px-2 text-slate-400 font-bold">Atau lanjutkan dengan</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-2.5 border border-slate-200 bg-[#f8f8f6] hover:bg-white h-11 font-bold text-slate-700 transition text-[9px] uppercase tracking-wider cursor-pointer"
          >
            <img src="/google-icon.svg" alt="Google" className="w-4 h-4" />
            <span>Daftar / Masuk dengan Google</span>
          </button>

        </section>

        {/* =====================================================
            SECURITY NOTE
        ===================================================== */}
        <section className="border border-[#eadfca] bg-[#f7f2e7]/60 p-3.5">
          <div className="flex items-start gap-3">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />
            <div>
              <p className="text-[9px] font-bold text-slate-800">Aman & Terverifikasi</p>
              <p className="mt-0.5 text-[8px] leading-relaxed text-slate-500">
                Data akun dan transaksi Anda dilindungi dengan standar keamanan tinggi di {SITE_DOMAIN}.
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