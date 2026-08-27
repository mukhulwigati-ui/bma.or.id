// app/kontak/page.tsx
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
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';
const OFFICIAL_WA_DISPLAY = '+62 813-2518-2875';
const OFFICIAL_WA = '6281325182875';

export const metadata: Metadata = {
  title: 'Hubungi Kami | Baitul Maal Al Muttaqin',
  description:
    'Hubungi tim resmi Baitul Maal Al Muttaqin di Jepara untuk informasi zakat, infak, sedekah, program sosial, pembayaran, dan layanan donatur melalui bma.or.id.',
  keywords: [
    'kontak bma',
    'Baitul Maal Al Muttaqin',
    'bma.or.id',
    'baitul maal jepara',
    'whatsapp bma',
    'kontak donasi jepara',
    'layanan donatur',
    'zakat jepara',
    'sedekah jepara',
  ],
  alternates: {
    canonical: '/kontak',
  },
};

export default function KontakPage() {
  const defaultText = encodeURIComponent(
    `Assalamualaikum Admin ${SITE_DOMAIN}, saya ingin bertanya mengenai layanan Baitul Maal Al Muttaqin.`
  );

  const waChatUrl = `https://api.whatsapp.com/send?phone=${OFFICIAL_WA}&text=${defaultText}`;

  return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-5 pb-28 sm:py-10">
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* =====================================================
            PREMIUM HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[30px] bg-[#102a43] shadow-[0_20px_55px_rgba(16,42,67,0.18)]">

          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

          <div className="absolute right-4 bottom-[-80px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

          <div className="relative z-10 p-5 sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-5 h-5 text-[#d7b66a]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Contact Center
                  </p>

                  <h1 className="mt-1 text-[18px] font-bold tracking-tight text-white">
                    Hubungi Tim Kami
                  </h1>
                </div>

              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-2.5 py-1.5">
                <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

                <span className="text-[7px] font-bold uppercase tracking-wider text-[#e7d5a4]">
                  Official
                </span>
              </div>

            </div>

            <p className="mt-5 text-[10px] leading-relaxed text-slate-300">
              Kami siap membantu kebutuhan informasi seputar zakat,
              infak, sedekah, program sosial, pembayaran, dan layanan
              digital Baitul Maal Al Muttaqin.
            </p>

            <div className="mt-4 flex items-center gap-1.5">

              <Building2 className="w-3 h-3 text-[#d7b66a]" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#e7d5a4]">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </span>

            </div>

          </div>

          <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#e0c37e] to-[#a37c32]" />

        </section>

        {/* =====================================================
            INTRO
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[26px] bg-white border border-slate-200/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#f7f2e7]" />

          <div className="relative z-10">

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Pusat Informasi
            </p>

            <h2 className="mt-1 text-[14px] font-bold text-[#102a43]">
              Kami Siap Mendengar dan Membantu
            </h2>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
              Jangan ragu untuk menghubungi tim Baitul Maal Al Muttaqin
              jika Anda membutuhkan informasi mengenai program, konsultasi
              zakat, transaksi donasi, atau kerja sama kebaikan.
            </p>

          </div>

        </section>

        {/* =====================================================
            INFORMASI KONTAK
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="px-5 pt-5 pb-3">

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Saluran Resmi
            </p>

            <h2 className="mt-1 text-[13px] font-bold text-[#102a43]">
              Informasi Kontak BMA
            </h2>

          </div>

          <div className="px-5 pb-5 divide-y divide-slate-100">

            {/* ALAMAT */}
            <div className="flex items-start gap-3 py-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0">

                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Kantor Pusat
                </p>

                <h3 className="mt-1 text-[11px] font-bold text-[#102a43]">
                  Baitul Maal Al Muttaqin
                </h3>

                <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                  Jepara, Jawa Tengah, Indonesia
                </p>

              </div>

            </div>

            {/* EMAIL */}
            <div className="flex items-start gap-3 py-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0">

                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Email
                </p>

                <h3 className="mt-1 text-[11px] font-bold text-[#102a43]">
                  support@bma.or.id
                </h3>

                <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                  Untuk pertanyaan layanan, kerja sama, dan informasi umum.
                </p>

              </div>

            </div>

            {/* OPERASIONAL */}
            <div className="flex items-start gap-3 py-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <Clock3 className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0">

                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Waktu Layanan
                </p>

                <h3 className="mt-1 text-[11px] font-bold text-[#102a43]">
                  Senin – Sabtu
                </h3>

                <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                  08.00 – 16.00 WIB
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            WHATSAPP CARD
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#064e3b] shadow-[0_16px_45px_rgba(6,78,59,0.16)]">

          <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full border border-white/10" />

          <div className="relative z-10 p-5">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-200" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-emerald-200">
                  WhatsApp Official
                </p>

                <h2 className="mt-1 text-[14px] font-bold text-white">
                  Konsultasi & Layanan Donatur
                </h2>
              </div>

            </div>

            <p className="mt-4 text-[9px] leading-relaxed text-emerald-100">
              Untuk layanan yang lebih cepat, Anda dapat langsung
              menghubungi nomor WhatsApp resmi Baitul Maal Al Muttaqin.
            </p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4">

              <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-emerald-200">
                Hotline Care
              </p>

              <p className="mt-1.5 text-[18px] font-bold tracking-tight text-white">
                {OFFICIAL_WA_DISPLAY}
              </p>

              <div className="mt-2 flex items-center gap-1.5">

                <ShieldCheck className="w-3 h-3 text-emerald-200" />

                <span className="text-[7px] font-semibold uppercase tracking-wider text-emerald-100">
                  Nomor Resmi {SITE_DOMAIN}
                </span>

              </div>

            </div>

            <a
              href={waChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-[9px] uppercase tracking-[0.16em] py-3.5 transition shadow-lg shadow-black/10"
            >
              <MessageCircle className="w-4 h-4" />
              Mulai Chat WhatsApp
            </a>

          </div>

        </section>

        {/* =====================================================
            GOOGLE MAPS
        ====================================================== */}
        <section className="rounded-[28px] overflow-hidden bg-white border border-slate-200/70 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="px-5 py-4 border-b border-slate-100">

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Lokasi
            </p>

            <h2 className="mt-1 text-[13px] font-bold text-[#102a43]">
              Baitul Maal Al Muttaqin
            </h2>

            <p className="mt-1 text-[9px] text-slate-400">
              Jepara, Jawa Tengah
            </p>

          </div>

          <div className="w-full bg-slate-100 h-56">
            <iframe
              src="https://www.google.com/maps?q=Jepara%2C%20Jawa%20Tengah&output=embed"
              title="Lokasi Baitul Maal Al Muttaqin Jepara"
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </section>

        {/* =====================================================
            CATATAN LAYANAN
        ====================================================== */}
        <section className="rounded-[22px] border border-[#eadfca] bg-[#f7f2e7]/60 p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <p className="text-[8px] leading-relaxed text-slate-500">
              Konfirmasi transaksi, kendala pembayaran, atau kebutuhan
              administrasi akan diproses sesuai jam layanan dan ketersediaan
              tim Baitul Maal Al Muttaqin.
            </p>

          </div>

        </section>

        {/* =====================================================
            KEMBALI
        ====================================================== */}
        <Link
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[9px] uppercase tracking-[0.16em] py-3.5 transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Beranda
        </Link>

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