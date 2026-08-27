// app/refund-policy/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  RefreshCcw,
  ShieldCheck,
  AlertTriangle,
  Mail,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';
const OFFICIAL_WA_DISPLAY = '+62 813-2518-2875';

export const metadata: Metadata = {
  title: 'Kebijakan Pengembalian Dana | Baitul Maal Al Muttaqin',
  description:
    'Pelajari kebijakan pengembalian dana untuk transaksi donasi, infak, zakat, sedekah, wakaf, dan program sosial melalui Baitul Maal Al Muttaqin di bma.or.id.',
  keywords: [
    'kebijakan refund bma',
    'refund bma.or.id',
    'Baitul Maal Al Muttaqin',
    'pengembalian dana donasi',
    'refund donasi',
    'syarat refund',
    'bantuan transaksi',
    'baitul maal jepara',
  ],
  alternates: {
    canonical: '/refund-policy',
  },
};

export default function RefundPolicyPage() {
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
                  <RefreshCcw className="w-5 h-5 text-[#d7b66a]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Financial Policy
                  </p>

                  <h1 className="mt-1 text-[18px] font-bold tracking-tight text-white">
                    Kebijakan Pengembalian Dana
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
              Ketentuan pengajuan dan proses pengembalian dana
              atas transaksi melalui layanan digital
              Baitul Maal Al Muttaqin.
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
            LAST UPDATE
        ====================================================== */}
        <section className="rounded-[22px] bg-white border border-slate-200/70 px-4 py-3 shadow-[0_6px_22px_rgba(15,23,42,0.035)]">

          <div className="flex items-center justify-between gap-3">

            <span className="text-[8px] font-bold uppercase tracking-[0.17em] text-slate-400">
              Dokumen Kebijakan
            </span>

            <span className="text-[8px] font-semibold text-[#a37c32]">
              Diperbarui Agustus 2026
            </span>

          </div>

        </section>

        {/* =====================================================
            INTRO
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[26px] bg-white border border-slate-200/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#f7f2e7]" />

          <div className="relative z-10">

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Kebijakan Transaksi
            </p>

            <h2 className="mt-1 text-[14px] font-bold text-[#102a43]">
              Transparansi dalam Setiap Transaksi
            </h2>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
              Terima kasih telah menyalurkan kebaikan melalui
              <strong className="font-bold text-slate-700">
                {' '}
                {SITE_NAME}
              </strong>
              . Kami berupaya menjaga prinsip amanah,
              transparansi, dan akuntabilitas dalam pengelolaan
              setiap transaksi melalui {SITE_DOMAIN}.
            </p>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
              Karena transaksi pada platform dapat berupa zakat,
              infak, sedekah, wakaf, maupun donasi program sosial,
              pengembalian dana hanya dapat dipertimbangkan pada
              kondisi tertentu setelah melalui proses verifikasi.
            </p>

          </div>

        </section>

        {/* =====================================================
            POLICY CONTENT
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          {/* 01 */}
          <div className="p-5 border-b border-slate-100">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <CircleDollarSign className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    01.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#102a43]">
                    Sifat Transaksi Donasi
                  </h2>

                </div>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Transaksi yang telah berhasil diproses dan
                  dikonfirmasi oleh sistem pembayaran pada
                  umumnya bersifat final, terutama apabila dana
                  telah masuk dalam proses penghimpunan atau
                  penyaluran program.
                </p>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Hal ini berlaku untuk transaksi melalui QRIS,
                  Virtual Account, transfer bank, maupun metode
                  pembayaran digital lainnya yang tersedia pada
                  platform.
                </p>

              </div>

            </div>

          </div>

          {/* 02 */}
          <div className="p-5 border-b border-slate-100">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    02.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#102a43]">
                    Kondisi Pengajuan Refund
                  </h2>

                </div>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Pengembalian dana dapat dipertimbangkan apabila
                  ditemukan kondisi tertentu yang dapat
                  diverifikasi, antara lain:
                </p>

                <ul className="mt-3 space-y-2.5">

                  {[
                    'Terjadi transaksi atau pendebetan ganda akibat gangguan teknis sistem.',
                    'Terjadi kesalahan nominal pembayaran yang dapat dibuktikan melalui data transaksi.',
                    'Transaksi dinyatakan bermasalah oleh penyedia layanan pembayaran.',
                    'Kondisi khusus lain yang berdasarkan hasil pemeriksaan dinilai layak untuk diproses.',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[9px] leading-relaxed text-slate-500"
                    >
                      <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[#a37c32] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}

                </ul>

              </div>

            </div>

          </div>

          {/* 03 */}
          <div className="p-5 border-b border-slate-100">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <FileCheck2 className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    03.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#102a43]">
                    Prosedur Pengajuan
                  </h2>

                </div>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Donatur yang mengalami kendala transaksi
                  disarankan segera menghubungi tim Baitul Maal
                  Al Muttaqin dengan menyertakan informasi yang
                  diperlukan untuk proses pemeriksaan.
                </p>

                <div className="mt-4 space-y-3">

                  <div className="rounded-2xl bg-[#fafaf8] border border-slate-100 p-3">
                    <p className="text-[9px] font-bold text-slate-700">
                      Bukti Pembayaran
                    </p>

                    <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                      Screenshot, bukti transfer, atau
                      bukti pembayaran dari bank maupun
                      aplikasi pembayaran.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fafaf8] border border-slate-100 p-3">
                    <p className="text-[9px] font-bold text-slate-700">
                      Informasi Transaksi
                    </p>

                    <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                      Nomor transaksi atau invoice,
                      nominal, tanggal pembayaran,
                      serta program yang dituju.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fafaf8] border border-slate-100 p-3">
                    <p className="text-[9px] font-bold text-slate-700">
                      Identitas Kontak
                    </p>

                    <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                      Nama dan nomor WhatsApp yang dapat
                      dihubungi untuk proses verifikasi.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* 04 */}
          <div className="p-5">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <Clock3 className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    04.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#102a43]">
                    Proses & Waktu Pengembalian
                  </h2>

                </div>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Setiap permohonan akan diperiksa berdasarkan
                  data transaksi yang tersedia. Apabila
                  pengembalian dana disetujui, proses akan
                  disesuaikan dengan mekanisme penyedia layanan
                  pembayaran dan sistem perbankan yang digunakan.
                </p>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Waktu pengembalian dapat berbeda tergantung
                  metode pembayaran, bank tujuan, penyedia payment
                  gateway, serta proses verifikasi terkait.
                </p>

                <div className="mt-4 rounded-2xl border border-[#eadfca] bg-[#f7f2e7]/60 p-3.5">

                  <div className="flex items-start gap-2.5">

                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

                    <p className="text-[8px] leading-relaxed text-slate-500">
                      Persetujuan pengembalian dana tidak bersifat
                      otomatis dan tetap bergantung pada hasil
                      pemeriksaan transaksi oleh tim BMA.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            CONTACT CTA
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#102a43] p-5 shadow-[0_16px_45px_rgba(16,42,67,0.14)]">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full border border-white/8" />

          <div className="relative z-10 text-center">

            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto">
              <Mail className="w-4 h-4 text-[#d7b66a]" />
            </div>

            <h3 className="mt-4 text-[13px] font-bold text-white">
              Mengalami Kendala Transaksi?
            </h3>

            <p className="mt-2 text-[9px] leading-relaxed text-slate-300">
              Jika terdapat pembayaran ganda, kesalahan nominal,
              atau masalah transaksi lainnya, silakan segera
              hubungi tim Baitul Maal Al Muttaqin.
            </p>

            <div className="mt-3 rounded-2xl bg-white/8 border border-white/10 p-3">

              <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-[#d7b66a]">
                WhatsApp Layanan
              </p>

              <p className="mt-1 text-[13px] font-bold text-white">
                {OFFICIAL_WA_DISPLAY}
              </p>

            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5">

              <Link
                href="/kontak"
                className="w-full inline-flex items-center justify-center rounded-xl bg-[#d7b66a] hover:bg-[#c8a658] text-[#102a43] font-bold text-[9px] uppercase tracking-[0.15em] py-3 transition"
              >
                Hubungi Admin
              </Link>

              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 hover:bg-white/15 text-white font-bold text-[9px] uppercase tracking-[0.15em] py-3 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Beranda
              </Link>

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