// app/kuitansi/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  Award,
  ShieldCheck,
  CalendarDays,
  ReceiptText,
  Loader2,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

export default function KuitansiPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    const fetchSuccessDonations = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('donations')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['success', 'paid', 'completed'])
          .order('created_at', { ascending: false });

        if (data) {
          setDonations(data);
        }
      }

      setLoading(false);
    };

    fetchSuccessDonations();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#102a43] flex items-center justify-center shadow-lg">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>

          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Memuat kuitansi {SITE_SHORT_NAME}
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

          <div className="absolute right-3 bottom-[-76px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

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
                  {SITE_SHORT_NAME} Receipt Center
                </p>

                <h1 className="mt-1 text-[17px] font-bold text-white">
                  Kuitansi & Sertifikat Amal
                </h1>
              </div>

            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-slate-300">
              Akses bukti donasi yang telah berhasil dan tercatat melalui
              layanan digital {SITE_NAME}.
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
            INFO CARD
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[26px] bg-white border border-slate-200/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#f7f2e7]" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <ReceiptText className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Dokumen Donasi
                </p>

                <h2 className="mt-0.5 text-[13px] font-bold text-[#102a43]">
                  Bukti Kebaikan Anda
                </h2>
              </div>

            </div>

            <p className="mt-4 text-[9px] leading-relaxed text-slate-500">
              Setiap transaksi donasi yang telah berhasil dapat memiliki
              kuitansi sebagai bukti pencatatan donasi melalui Baitul Maal Al Muttaqin.
            </p>

          </div>

        </section>

        {/* =====================================================
            LIST KUITANSI
        ====================================================== */}
        {donations.length === 0 ? (
          <section className="rounded-[28px] bg-white border border-slate-200/70 p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="w-14 h-14 rounded-2xl bg-[#f7f2e7] flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6 text-[#a37c32]" />
            </div>

            <h3 className="mt-5 text-[13px] font-bold text-[#102a43]">
              Belum Ada Kuitansi
            </h3>

            <p className="mt-2 text-[9px] leading-relaxed text-slate-400">
              Belum ada transaksi donasi berhasil yang tercatat
              pada akun Anda.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#102a43] px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-white hover:bg-[#173d5d] transition shadow-lg shadow-[#102a43]/10"
            >
              Lihat Program Donasi
            </Link>

          </section>
        ) : (
          <section className="space-y-3">

            {donations.map((d) => {
              const programTitle =
                d.program_name ||
                d.programTitle ||
                'Sedekah Umum BMA';

              const amount =
                Number(d.amount || 0);

              return (
                <article
                  key={d.id}
                  className="rounded-[24px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_7px_25px_rgba(15,23,42,0.035)] hover:border-[#d7b66a]/60 hover:shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all"
                >

                  <div className="p-4">

                    {/* TOP */}
                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          Donasi Terverifikasi
                        </span>

                        <h3 className="mt-2 text-[13px] font-bold leading-snug text-[#102a43]">
                          {programTitle}
                        </h3>

                      </div>

                      <div className="w-9 h-9 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                        <Award className="w-4 h-4 text-[#a37c32]" />
                      </div>

                    </div>

                    {/* AMOUNT */}
                    <div className="mt-4 rounded-2xl bg-[#f8f8f6] border border-slate-100 p-4">

                      <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-slate-400">
                        Nominal Donasi
                      </p>

                      <p className="mt-1.5 text-[20px] font-bold tracking-tight text-[#102a43]">
                        Rp {amount.toLocaleString('id-ID')}
                      </p>

                    </div>

                    {/* DATE */}
                    <div className="mt-3 flex items-center justify-between gap-3">

                      <div className="flex items-center gap-2 text-slate-400">
                        <CalendarDays className="w-3.5 h-3.5" />

                        <span className="text-[9px] font-medium">
                          {new Date(d.created_at).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>

                      <span className="text-[7px] font-semibold uppercase tracking-wider text-[#a37c32]">
                        {SITE_SHORT_NAME}
                      </span>

                    </div>

                    {/* INVOICE */}
                    <div className="mt-3 border-t border-slate-100 pt-3">

                      <div className="flex items-center justify-between gap-4">

                        <span className="text-[8px] text-slate-400">
                          ID Transaksi
                        </span>

                        <span className="font-mono text-[8px] text-slate-500 text-right truncate max-w-[190px]">
                          {d.invoice_id || d.id}
                        </span>

                      </div>

                    </div>

                    {/* ACTION */}
                    <div className="mt-4">

                      <button
                        onClick={() =>
                          alert(
                            'Fitur unduh kuitansi PDF resmi BMA segera tersedia.'
                          )
                        }
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#102a43] hover:bg-[#173d5d] text-white font-bold px-4 py-3 text-[9px] uppercase tracking-[0.15em] transition shadow-sm cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Kuitansi PDF
                      </button>

                    </div>

                  </div>

                  <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#dfc27e] to-[#a37c32]" />

                </article>
              );
            })}

          </section>
        )}

        {/* =====================================================
            SECURITY NOTE
        ====================================================== */}
        <section className="rounded-[22px] border border-[#eadfca] bg-[#f7f2e7]/60 p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <div>

              <p className="text-[9px] font-bold text-[#102a43]">
                Dokumen Transaksi
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                Kuitansi hanya ditampilkan untuk transaksi dengan status
                berhasil, dibayar, atau selesai yang tercatat pada akun Anda.
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