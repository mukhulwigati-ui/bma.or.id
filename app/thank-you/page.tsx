// app/thank-you/page.tsx
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ShieldCheck,
  ReceiptText,
  CreditCard,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

function ThankYouContent() {
  const searchParams = useSearchParams();

  const orderId =
    searchParams.get('order_id') ||
    searchParams.get('invoice') ||
    searchParams.get('id') ||
    'INV-BMA-XXXXXX';

  return (
    <div className="w-full max-w-[420px] space-y-3">

      {/* =====================================================
          PREMIUM SUCCESS HEADER
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#073f2e] shadow-[0_4px_20px_rgba(7,63,46,0.12)] border-y border-[#073f2e]/20 text-center">

        <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full border border-white/8" />

        <div className="absolute right-5 bottom-[-90px] w-48 h-48 rounded-full border border-[#d7b66a]/15" />

        <div className="relative z-10 p-5 sm:p-6">

          <div className="w-14 h-14 bg-white/10 border border-white/15 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-7 h-7 text-[#d7b66a]" />
          </div>

          <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
            {SITE_SHORT_NAME} Payment Confirmation
          </p>

          <h1 className="mt-1.5 text-[22px] font-bold tracking-tight text-white">
            Alhamdulillah!
          </h1>

          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.17em] text-emerald-300">
            Donasi Berhasil Diproses
          </p>

          <p className="mt-3 text-[10px] leading-[1.7] text-slate-200">
            Infak, sedekah, atau donasi Anda telah berhasil diproses
            melalui layanan digital resmi {SITE_NAME}.
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
          APPRECIATION CARD
      ===================================================== */}
      <section className="relative overflow-hidden bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center">

        <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#f7f2e7]" />

        <div className="relative z-10">

          <div className="w-10 h-10 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center mx-auto">
            <Sparkles className="w-4 h-4 text-[#a37c32]" />
          </div>

          <h2 className="mt-3 text-[13px] font-bold text-slate-800">
            Terima Kasih atas Amanah Anda
          </h2>

          <p className="mt-2 text-[9px] leading-[1.7] text-slate-500">
            Terima kasih telah mempercayakan kebaikan Anda melalui
            Baitul Maal Al Muttaqin. Semoga setiap harta yang ditunaikan
            menjadi amal yang diterima, membawa keberkahan, serta
            menghadirkan manfaat bagi para penerima manfaat.
          </p>

        </div>

      </section>

      {/* =====================================================
          TRANSACTION DETAILS
      ===================================================== */}
      <section className="bg-white border-y border-slate-200/70 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

        <div className="px-4 py-3.5 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
              <ReceiptText className="w-4 h-4 text-[#a37c32]" />
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Transaksi
              </p>

              <h2 className="mt-0.5 text-[12px] font-bold text-slate-800">
                Detail Pembayaran
              </h2>
            </div>

          </div>

        </div>

        <div className="divide-y divide-slate-100">

          {/* INVOICE */}
          <div className="px-4 py-3 flex items-start justify-between gap-4">

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                No. Invoice
              </p>
            </div>

            <span className="max-w-[210px] text-right font-mono text-[9px] font-bold text-slate-700 break-all">
              {orderId}
            </span>

          </div>

          {/* STATUS */}
          <div className="px-4 py-3 flex items-center justify-between gap-4">

            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Status Dana
            </p>

            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider text-emerald-600">
              <CheckCircle2 className="w-3 h-3" />
              Paid / Success
            </span>

          </div>

          {/* PAYMENT METHOD */}
          <div className="px-4 py-3 flex items-start justify-between gap-4">

            <div className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />

              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Pembayaran
              </p>
            </div>

            <span className="text-right text-[9px] font-bold text-slate-700">
              Pakasir Payment Gateway
            </span>

          </div>

        </div>

      </section>

      {/* =====================================================
          SECURITY NOTE
      ===================================================== */}
      <section className="border border-[#eadfca] bg-[#f7f2e7]/60 p-3.5">

        <div className="flex items-start gap-3">

          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

          <div>

            <p className="text-[9px] font-bold text-slate-800">
              Transaksi Tercatat
            </p>

            <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
              Status pembayaran mengikuti konfirmasi dari sistem
              pembayaran. Riwayat transaksi dapat tersimpan pada akun
              Anda apabila donasi dilakukan dalam keadaan login.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          ACTIONS
      ===================================================== */}
      <section className="bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

        <div className="space-y-2">

          <Link
            href="/akun"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#073f2e] hover:bg-[#052e21] text-white font-bold text-[9px] uppercase tracking-[0.16em] py-3 transition shadow-md"
          >
            Lihat Akun Saya
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[9px] uppercase tracking-[0.16em] py-3 transition"
          >
            Kembali ke Beranda
          </Link>

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
  );
}

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] flex flex-col items-center justify-center px-0 py-4">

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3">

            <div className="w-11 h-11 bg-[#073f2e] flex items-center justify-center shadow-lg">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Memuat konfirmasi pembayaran BMA
            </p>

          </div>
        }
      >
        <ThankYouContent />
      </Suspense>

    </main>
  );
}