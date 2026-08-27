// app/bantuan/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Mail,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Building2,
  ArrowLeft,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';
const OFFICIAL_WA_DISPLAY = '+62 812-2514-7373';
const OFFICIAL_WA = '6281225147373';

export const metadata: Metadata = {
  title: 'Pusat Bantuan | Baitul Maal Al Muttaqin',
  description:
    'Butuh bantuan terkait donasi, metode pembayaran, akun, atau layanan digital Baitul Maal Al Muttaqin? Tim Admin bma.or.id siap membantu kebutuhan Anda.',
  alternates: {
    canonical: '/bantuan',
  },
};

export default function BantuanPage() {
  const defaultText = encodeURIComponent(
    `Assalamualaikum Admin ${SITE_DOMAIN}, saya ingin bertanya mengenai layanan Baitul Maal Al Muttaqin.`
  );

  const waChatUrl = `https://api.whatsapp.com/send?phone=${OFFICIAL_WA}&text=${defaultText}`;

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

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-9 h-9 shrink-0 bg-white/8 border border-white/15 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-[#d7b66a]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    PUSAT LAYANAN BMA
                  </p>

                  <h1 className="mt-0.5 text-[15px] font-bold tracking-tight text-white">
                    Bagaimana Kami Bisa Membantu?
                  </h1>
                </div>

              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 border border-white/15 bg-white/8 px-2.5 py-1">
                <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

                <span className="text-[7px] font-bold uppercase tracking-wider text-[#e6d19d]">
                  Official
                </span>
              </div>

            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-200">
              Temukan panduan cepat atau hubungi tim Baitul Maal Al Muttaqin
              untuk kendala seputar donasi, pembayaran, akun, dan layanan digital
              di bma.or.id.
            </p>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5">

              <Building2 className="w-3 h-3 text-[#d7b66a]" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#e6d19d]">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </span>

            </div>

          </div>

          <div className="h-[3px] bg-gradient-to-r from-[#b08a3d] via-[#dfc27e] to-[#b08a3d]" />

        </section>

        {/* =====================================================
            GRID OPSI BANTUAN
        ===================================================== */}
        <section className="bg-white border-y border-slate-200/70 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-y divide-slate-100">

          {/* Card 1: Kendala Akun & Donasi */}
          <div className="p-4">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Kendala Akun & Donasi
            </h3>

            <p className="mt-1.5 text-[9px] leading-relaxed text-slate-500">
              Mengalami kendala saat verifikasi WhatsApp, masuk ke akun,
              atau riwayat donasi belum terupdate? Tim kami siap membantu
              memeriksa data dan transaksi Anda.
            </p>
          </div>

          {/* Card 2: Metode Pembayaran */}
          <div className="p-4">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Metode Pembayaran
            </h3>

            <p className="mt-1.5 text-[9px] leading-relaxed text-slate-500">
              Informasi seputar metode pembayaran yang tersedia, seperti QRIS,
              Virtual Account, transfer bank, dan metode pembayaran digital
              lainnya yang didukung di bma.or.id.
            </p>
          </div>

          {/* Card 3: Transparansi Penyaluran */}
          <div className="p-4">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Transparansi Penyaluran
            </h3>

            <p className="mt-1.5 text-[9px] leading-relaxed text-slate-500">
              Dana yang dihimpun melalui Baitul Maal Al Muttaqin disalurkan
              sesuai program dan dilaporkan secara berkala sebagai bentuk
              transparansi kepada para dermawan.
            </p>
          </div>

          {/* Card 4: FAQ */}
          <div className="p-4">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              FAQ Umum
            </h3>

            <p className="mt-1.5 text-[9px] leading-relaxed text-slate-500">
              Temukan jawaban atas pertanyaan yang paling sering diajukan
              terkait donasi, akun, pembayaran, program, dan layanan
              Baitul Maal Al Muttaqin.
            </p>
          </div>

        </section>

        {/* =====================================================
            SECTION KONTAK LANGSUNG
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#073f2e] shadow-[0_4px_20px_rgba(7,63,46,0.12)] border-y border-[#073f2e]/20">

          <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full border border-white/10" />

          <div className="relative z-10 p-4">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 bg-white/8 border border-white/15 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#d7b66a]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#d7b66a]">
                  Hubungi Tim Layanan BMA
                </p>

                <h2 className="mt-0.5 text-[12px] font-bold text-white">
                  Konsultasi & Layanan Donatur
                </h2>
              </div>

            </div>

            <p className="mt-3 text-[9px] leading-relaxed text-slate-200">
              Tim Baitul Maal Al Muttaqin siap membantu kebutuhan informasi
              dan layanan Anda.
            </p>

            <div className="mt-3 bg-white/8 border border-white/15 p-3">

              <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-[#d7b66a]">
                Hotline Care
              </p>

              <p className="mt-1 text-[16px] font-bold tracking-tight text-white">
                {OFFICIAL_WA_DISPLAY}
              </p>

              <div className="mt-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

                <span className="text-[7px] font-semibold uppercase tracking-wider text-[#e6d19d]">
                  {SITE_DOMAIN} • {SITE_LOCATION}
                </span>
              </div>

            </div>

            <div className="mt-3.5 space-y-2">

              <a
                href={waChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-[9px] uppercase tracking-[0.16em] py-3 transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Chat via WhatsApp
              </a>

              <div className="text-center text-[9px] font-semibold text-emerald-100 pt-1">
                Email: support@bma.or.id
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            TOMBOL KEMBALI KE AKUN
        ===================================================== */}
        <Link
          href="/akun"
          className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[9px] uppercase tracking-[0.16em] py-3 transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Menu Akun
        </Link>

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