// app/bantuan/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pusat Bantuan | Baitul Maal Al Muttaqin',
  description:
    'Butuh bantuan terkait donasi, metode pembayaran, akun, atau layanan digital Baitul Maal Al Muttaqin? Tim Admin bma.or.id siap membantu kebutuhan Anda.',
  alternates: {
    canonical: '/bantuan',
  },
};

export default function BantuanPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-4 px-3 pb-28">
      <div className="w-full max-w-md mx-auto bg-white border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
        
        {/* HEADER BANTUAN */}
        <div className="border-b border-emerald-600 pb-3 space-y-1.5">
          <span className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-widest block">
            PUSAT LAYANAN BMA
          </span>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#333333] tracking-tight">
            Bagaimana Kami Bisa Membantu?
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Temukan panduan cepat atau hubungi tim Baitul Maal Al Muttaqin
            untuk kendala seputar donasi, pembayaran, akun, dan layanan digital
            di bma.or.id.
          </p>
        </div>

        {/* GRID OPSI BANTUAN */}
        <div className="grid grid-cols-1 gap-3.5">
          
          {/* Card 1: Kendala Akun & Donasi */}
          <div className="border border-slate-200 p-3.5 space-y-1.5 hover:border-emerald-500 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Kendala Akun & Donasi
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mengalami kendala saat verifikasi WhatsApp, masuk ke akun,
              atau riwayat donasi belum terupdate? Tim kami siap membantu
              memeriksa data dan transaksi Anda.
            </p>
          </div>

          {/* Card 2: Metode Pembayaran */}
          <div className="border border-slate-200 p-3.5 space-y-1.5 hover:border-emerald-500 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Metode Pembayaran
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Informasi seputar metode pembayaran yang tersedia, seperti QRIS,
              Virtual Account, transfer bank, dan metode pembayaran digital
              lainnya yang didukung di bma.or.id.
            </p>
          </div>

          {/* Card 3: Transparansi Penyaluran */}
          <div className="border border-slate-200 p-3.5 space-y-1.5 hover:border-emerald-500 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Transparansi Penyaluran
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dana yang dihimpun melalui Baitul Maal Al Muttaqin disalurkan
              sesuai program dan dilaporkan secara berkala sebagai bentuk
              transparansi kepada para dermawan.
            </p>
          </div>

          {/* Card 4: FAQ */}
          <div className="border border-slate-200 p-3.5 space-y-1.5 hover:border-emerald-500 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              FAQ Umum
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Temukan jawaban atas pertanyaan yang paling sering diajukan
              terkait donasi, akun, pembayaran, program, dan layanan
              Baitul Maal Al Muttaqin.
            </p>
          </div>
        </div>

        {/* SECTION KONTAK LANGSUNG */}
        <div className="bg-[#064e3b] text-white p-4 sm:p-5 space-y-4 mt-6">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide">
              Hubungi Tim Layanan BMA
            </h2>

            <p className="text-xs text-emerald-100 font-medium">
              Tim Baitul Maal Al Muttaqin siap membantu kebutuhan informasi
              dan layanan Anda.
            </p>

            <p className="text-[11px] text-emerald-200">
              Jepara, Jawa Tengah
            </p>
          </div>
          
          <div className="flex flex-col gap-2.5">
            <Link 
              href="https://wa.me/6281225147373"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs sm:text-sm uppercase tracking-wider py-3 transition shadow-sm"
            >
              Chat via WhatsApp 💬
            </Link>

            <div className="text-center text-xs text-emerald-100">
              Email: support@bma.or.id
            </div>
          </div>
        </div>

        {/* IDENTITAS LEMBAGA */}
        <div className="border border-slate-200 bg-slate-50 p-4 text-center space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            Baitul Maal Al Muttaqin
          </p>

          <p className="text-xs font-medium text-slate-600">
            bma.or.id
          </p>

          <p className="text-[11px] text-slate-400">
            Jepara, Jawa Tengah
          </p>
        </div>

        {/* TOMBOL KEMBALI KE AKUN */}
        <div className="pt-2">
          <Link 
            href="/akun"
            className="w-full block text-center border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wider py-3 transition"
          >
            ← Kembali ke Menu Akun
          </Link>
        </div>

      </div>
    </div>
  );
}