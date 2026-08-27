// app/kebijakan-privasi/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  LockKeyhole,
  Database,
  UserRoundCheck,
  ExternalLink,
  Mail,
  ArrowLeft,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Baitul Maal Al Muttaqin',
  description:
    'Kebijakan Privasi resmi Baitul Maal Al Muttaqin. Pelajari bagaimana bma.or.id mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi serta informasi transaksi pengguna.',
  keywords: [
    'kebijakan privasi bma',
    'Baitul Maal Al Muttaqin',
    'bma.or.id',
    'baitul maal jepara',
    'keamanan data donatur',
    'perlindungan data donatur',
    'privasi donasi online',
    'kebijakan privasi donasi',
  ],
  alternates: {
    canonical: '/kebijakan-privasi',
  },
};

export default function KebijakanPrivasiPage() {
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
                  <ShieldCheck className="w-4 h-4 text-[#d7b66a]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Legal Center
                  </p>

                  <h1 className="mt-0.5 text-[15px] font-bold tracking-tight text-white">
                    Kebijakan Privasi
                  </h1>
                </div>
              </div>

              <span className="shrink-0 inline-flex items-center border border-white/15 bg-white/8 px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider text-[#e6d19d]">
                Privacy
              </span>
            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-200">
              Komitmen Baitul Maal Al Muttaqin dalam menjaga keamanan,
              kerahasiaan, dan penggunaan data pribadi pengguna layanan
              digital bma.or.id.
            </p>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#e6d19d]">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </span>
            </div>
          </div>

          <div className="h-[3px] bg-gradient-to-r from-[#b08a3d] via-[#dfc27e] to-[#b08a3d]" />
        </section>

        {/* =====================================================
            LAST UPDATE
        ===================================================== */}
        <section className="bg-white border-y border-slate-200/70 px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
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
        ===================================================== */}
        <section className="relative overflow-hidden bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#f7f2e7]" />

          <div className="relative z-10">
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Perlindungan Data
            </p>

            <h2 className="mt-0.5 text-[12px] font-bold text-slate-800">
              Privasi Anda Menjadi Perhatian Kami
            </h2>

            <p className="mt-2.5 text-[9px] leading-relaxed text-slate-500">
              <strong className="font-bold text-slate-700">
                {SITE_NAME}
              </strong>{' '}
              melalui {SITE_DOMAIN} berkomitmen menjaga setiap informasi
              pribadi yang dipercayakan kepada kami. Kebijakan ini
              menjelaskan cara kami mengumpulkan, menggunakan, menyimpan,
              dan melindungi data saat Anda menggunakan layanan digital kami.
            </p>

            <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
              Pengelolaan data dilakukan untuk menunjang pelayanan,
              pencatatan transaksi, komunikasi, keamanan sistem, dan
              peningkatan kualitas layanan kepada para donatur serta pengguna.
            </p>
          </div>

        </section>

        {/* =====================================================
            POLICY CONTENT
        ===================================================== */}
        <section className="bg-white border-y border-slate-200/70 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-y divide-slate-100">

          {/* 01 */}
          <div className="p-4">
            <div className="flex items-start gap-3">

              <div className="w-9 h-9 shrink-0 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                <Database className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    01.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800">
                    Informasi yang Kami Kumpulkan
                  </h2>
                </div>

                <p className="mt-2.5 text-[9px] leading-relaxed text-slate-500">
                  Saat Anda menggunakan atau melakukan transaksi melalui
                  platform BMA, kami dapat mengumpulkan informasi yang Anda
                  berikan secara sukarela, antara lain:
                </p>

                <div className="mt-3 space-y-2.5">

                  <div className="bg-[#f8f8f6] border border-slate-200 p-3">
                    <p className="text-[9px] font-bold text-slate-700">
                      Identitas Pengguna
                    </p>

                    <p className="mt-0.5 text-[8px] leading-relaxed text-slate-500">
                      Nama lengkap, nama tampilan, atau pilihan identitas
                      anonim seperti Hamba Allah.
                    </p>
                  </div>

                  <div className="bg-[#f8f8f6] border border-slate-200 p-3">
                    <p className="text-[9px] font-bold text-slate-700">
                      Informasi Kontak
                    </p>

                    <p className="mt-0.5 text-[8px] leading-relaxed text-slate-500">
                      Nomor WhatsApp, alamat email, atau data kontak lain yang
                      digunakan untuk komunikasi dan kebutuhan layanan.
                    </p>
                  </div>

                  <div className="bg-[#f8f8f6] border border-slate-200 p-3">
                    <p className="text-[9px] font-bold text-slate-700">
                      Data Aktivitas & Transaksi
                    </p>

                    <p className="mt-0.5 text-[8px] leading-relaxed text-slate-500">
                      Detail transaksi, waktu transaksi, status pembayaran,
                      program yang didukung, serta aktivitas terkait layanan
                      digital.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* 02 */}
          <div className="p-4">
            <div className="flex items-start gap-3">

              <div className="w-9 h-9 shrink-0 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                <UserRoundCheck className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    02.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800">
                    Penggunaan Informasi
                  </h2>
                </div>

                <p className="mt-2.5 text-[9px] leading-relaxed text-slate-500">
                  Informasi yang dikumpulkan dapat digunakan untuk:
                </p>

                <ul className="mt-2.5 space-y-2">
                  {[
                    'Memproses dan mencatat transaksi donasi secara tertib.',
                    'Menyediakan riwayat aktivitas dan layanan akun pengguna.',
                    'Mengirimkan konfirmasi, pemberitahuan, atau informasi penting terkait transaksi.',
                    'Membantu pelayanan dan penanganan kendala pengguna.',
                    'Meningkatkan keamanan, kualitas, dan kinerja layanan bma.or.id.',
                    'Menghasilkan statistik internal untuk evaluasi layanan dan program.',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[9px] leading-relaxed text-slate-500"
                    >
                      <span className="mt-[4px] w-1.5 h-1.5 rounded-full bg-[#a37c32] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* 03 */}
          <div className="p-4">
            <div className="flex items-start gap-3">

              <div className="w-9 h-9 shrink-0 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                <LockKeyhole className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    03.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800">
                    Keamanan & Penyimpanan Data
                  </h2>
                </div>

                <p className="mt-2.5 text-[9px] leading-relaxed text-slate-500">
                  Kami menerapkan langkah-langkah keamanan yang wajar untuk
                  membantu melindungi data pengguna dari akses tidak sah,
                  perubahan, penyalahgunaan, pengungkapan, atau kehilangan.
                </p>

                <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
                  Akses terhadap data dibatasi sesuai kebutuhan operasional
                  dan hanya diberikan kepada pihak yang memiliki kewenangan
                  dalam pengelolaan layanan.
                </p>

                <div className="mt-3 border border-[#eadfca] bg-[#f7f2e7]/60 p-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

                    <p className="text-[8px] leading-relaxed text-slate-500">
                      Meskipun kami berupaya menerapkan perlindungan yang
                      memadai, tidak ada sistem digital yang dapat menjamin
                      keamanan absolut terhadap seluruh risiko teknologi.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 04 */}
          <div className="p-4">
            <div className="flex items-start gap-3">

              <div className="w-9 h-9 shrink-0 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    04.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800">
                    Pihak Ketiga
                  </h2>
                </div>

                <p className="mt-2.5 text-[9px] leading-relaxed text-slate-500">
                  Kami tidak menjual atau memperdagangkan data pribadi pengguna
                  untuk kepentingan komersial pihak lain.
                </p>

                <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
                  Dalam menjalankan layanan, data tertentu dapat diproses oleh
                  penyedia layanan teknologi yang diperlukan, seperti sistem
                  pembayaran, penyimpanan data, autentikasi, atau layanan
                  infrastruktur digital, sepanjang diperlukan untuk
                  penyelenggaraan layanan.
                </p>
              </div>

            </div>
          </div>

          {/* 05 */}
          <div className="p-4">
            <div className="flex items-start gap-3">

              <div className="w-9 h-9 shrink-0 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                <UserRoundCheck className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                    05.
                  </span>

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800">
                    Hak Pengguna
                  </h2>
                </div>

                <p className="mt-2.5 text-[9px] leading-relaxed text-slate-500">
                  Pengguna dapat menghubungi kami untuk meminta informasi,
                  memperbarui data, memperbaiki informasi yang tidak tepat,
                  atau mengajukan permintaan penghapusan data sesuai ketentuan
                  dan kebutuhan administratif yang berlaku.
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* =====================================================
            CONTACT CTA
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#073f2e] shadow-[0_4px_20px_rgba(7,63,46,0.12)] border-y border-[#073f2e]/20 text-center">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full border border-white/8" />

          <div className="relative z-10 p-4">

            <div className="w-9 h-9 bg-white/8 border border-white/15 flex items-center justify-center mx-auto">
              <Mail className="w-4 h-4 text-[#d7b66a]" />
            </div>

            <h3 className="mt-3 text-[12px] font-bold text-white">
              Pertanyaan Tentang Privasi?
            </h3>

            <p className="mt-1.5 text-[9px] leading-relaxed text-slate-200">
              Jika Anda memiliki pertanyaan mengenai pengelolaan data pribadi
              atau layanan digital Baitul Maal Al Muttaqin, silakan hubungi
              tim kami.
            </p>

            <div className="mt-3.5 space-y-2">

              <Link
                href="/kontak"
                className="w-full inline-flex items-center justify-center bg-[#d7b66a] hover:bg-[#c8a658] text-[#073f2e] font-bold text-[9px] uppercase tracking-[0.15em] py-3 transition shadow-sm"
              >
                Hubungi Admin
              </Link>

              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 border border-white/15 bg-white/8 hover:bg-white/15 text-white font-bold text-[9px] uppercase tracking-[0.15em] py-3 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Beranda
              </Link>

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