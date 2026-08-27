// app/syarat-ketentuan/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Building2,
  LockKeyhole,
  Mail,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';
const OFFICIAL_WA_DISPLAY = '+62 813-2518-2875';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | Baitul Maal Al Muttaqin',
  description:
    'Syarat dan ketentuan resmi penggunaan layanan digital Baitul Maal Al Muttaqin di bma.or.id. Pelajari hak, kewajiban pengguna, transaksi, pengelolaan program, dan perlindungan data.',
  keywords: [
    'syarat ketentuan bma',
    'syarat ketentuan bma.or.id',
    'Baitul Maal Al Muttaqin',
    'baitul maal jepara',
    'ketentuan donasi online',
    'regulasi donasi',
    'kebijakan layanan donatur',
  ],
  alternates: {
    canonical: '/syarat-ketentuan',
  },
};

export default function SyaratKetentuanPage() {
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
                  <FileText className="w-5 h-5 text-[#d7b66a]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Legal Center
                  </p>

                  <h1 className="mt-1 text-[18px] font-bold tracking-tight text-white">
                    Syarat & Ketentuan
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
              Ketentuan penggunaan layanan digital
              Baitul Maal Al Muttaqin untuk menjaga
              transparansi, keamanan, dan kenyamanan
              seluruh pengguna.
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
              Dokumen Ketentuan
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
              Ketentuan Penggunaan
            </p>

            <h2 className="mt-1 text-[14px] font-bold text-[#102a43]">
              Harap Dibaca Sebelum Menggunakan Layanan
            </h2>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
              Selamat datang di platform digital resmi
              {' '}
              <strong className="font-bold text-slate-700">
                {SITE_NAME}
              </strong>
              . Dengan mengakses, menggunakan, atau melakukan
              transaksi melalui {SITE_DOMAIN}, Anda dianggap telah
              membaca dan memahami ketentuan yang berlaku.
            </p>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
              Ketentuan ini dibuat untuk membantu menjaga penggunaan
              layanan secara tertib, aman, transparan, dan sesuai
              dengan tujuan sosial serta kemaslahatan yang dijalankan
              oleh Baitul Maal Al Muttaqin.
            </p>

          </div>

        </section>

        {/* =====================================================
            TERMS CONTENT
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          {/* 01 */}
          <div className="p-5 border-b border-slate-100">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    01.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#102a43]">
                    Ketentuan Pengguna
                  </h2>

                </div>

                <ul className="mt-3 space-y-2.5">

                  {[
                    'Pengguna wajib menggunakan layanan sesuai tujuan yang sah dan tidak bertentangan dengan ketentuan yang berlaku.',
                    'Informasi yang diberikan melalui platform harus benar, wajar, dan tidak digunakan untuk tindakan yang merugikan pihak lain.',
                    'Pengguna bertanggung jawab menjaga keamanan akun, email, kata sandi, dan akses autentikasi miliknya.',
                    'Nomor WhatsApp dan informasi kontak dapat digunakan untuk kebutuhan komunikasi layanan, verifikasi, dan pencatatan aktivitas.',
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

          {/* 02 */}
          <div className="p-5 border-b border-slate-100">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    02.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#102a43]">
                    Layanan & Transaksi
                  </h2>

                </div>

                <ul className="mt-3 space-y-2.5">

                  {[
                    'Transaksi dapat diproses melalui metode pembayaran yang tersedia pada sistem.',
                    'Status pembayaran mengikuti hasil verifikasi sistem dan penyedia layanan pembayaran yang digunakan.',
                    'Nominal minimal, metode pembayaran, dan ketentuan teknis lainnya dapat disesuaikan berdasarkan kebutuhan operasional.',
                    'Transaksi yang telah dinyatakan berhasil akan tercatat sebagai transaksi pada program yang dipilih pengguna.',
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
                <Building2 className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    03.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#102a43]">
                    Pengelolaan Platform
                  </h2>

                </div>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  {SITE_NAME} berhak mengelola, memperbarui, menambah,
                  mengurangi, atau menyesuaikan fitur layanan, program,
                  tampilan, maupun mekanisme teknis berdasarkan kebutuhan
                  operasional dan pengembangan platform.
                </p>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Pengelolaan program dilakukan dengan mempertimbangkan
                  tujuan program, kebutuhan penerima manfaat, ketersediaan
                  dana, kemampuan operasional, dan prioritas kemaslahatan.
                </p>

              </div>

            </div>

          </div>

          {/* 04 */}
          <div className="p-5 border-b border-slate-100">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <LockKeyhole className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    04.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#102a43]">
                    Perlindungan Data
                  </h2>

                </div>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Kami berupaya menjaga data pribadi pengguna, termasuk
                  nama, email, nomor kontak, serta informasi aktivitas
                  dan transaksi yang tersimpan dalam sistem.
                </p>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Data tidak diperjualbelikan untuk kepentingan komersial
                  pihak lain. Namun, data tertentu dapat diproses oleh
                  penyedia layanan teknologi yang diperlukan untuk
                  menjalankan autentikasi, pembayaran, penyimpanan,
                  keamanan, atau fungsi operasional platform.
                </p>

                <Link
                  href="/kebijakan-privasi"
                  className="mt-4 inline-flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#a37c32] hover:text-[#876725] transition"
                >
                  Baca Kebijakan Privasi
                </Link>

              </div>

            </div>

          </div>

          {/* 05 */}
          <div className="p-5">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    05.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#102a43]">
                    Perubahan Ketentuan
                  </h2>

                </div>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Syarat dan Ketentuan ini dapat diperbarui dari waktu
                  ke waktu untuk menyesuaikan perkembangan layanan,
                  operasional, teknologi, maupun kebutuhan organisasi.
                </p>

                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Versi terbaru yang ditampilkan pada halaman ini menjadi
                  rujukan ketentuan penggunaan layanan {SITE_DOMAIN}.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            RELATED POLICY
        ====================================================== */}
        <section className="rounded-[22px] border border-[#eadfca] bg-[#f7f2e7]/60 p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <div>

              <p className="text-[9px] font-bold text-[#102a43]">
                Ketentuan Transaksi
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                Untuk ketentuan mengenai pembatalan atau pengembalian
                transaksi, silakan membaca Kebijakan Pengembalian Dana.
              </p>

              <Link
                href="/refund-policy"
                className="mt-2 inline-flex text-[8px] font-bold uppercase tracking-[0.14em] text-[#a37c32] hover:text-[#876725] transition"
              >
                Lihat Kebijakan Refund
              </Link>

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
              Memerlukan Penjelasan Lebih Lanjut?
            </h3>

            <p className="mt-2 text-[9px] leading-relaxed text-slate-300">
              Hubungi tim Baitul Maal Al Muttaqin apabila Anda
              membutuhkan informasi mengenai ketentuan penggunaan,
              transaksi, atau layanan digital kami.
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