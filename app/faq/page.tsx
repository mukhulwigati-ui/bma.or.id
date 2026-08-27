// app/faq/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

// ============================================================
// MASTER SEO METADATA
// ============================================================
export const metadata: Metadata = {
  title: 'FAQ / Pertanyaan Umum | Baitul Maal Al Muttaqin',
  description:
    'Temukan jawaban atas pertanyaan seputar cara berdonasi, pembayaran QRIS, penyaluran zakat, infak, sedekah, wakaf, dan program sosial melalui Baitul Maal Al Muttaqin di bma.or.id.',
  keywords: [
    'faq bma',
    'Baitul Maal Al Muttaqin',
    'bma.or.id',
    'baitul maal jepara',
    'sedekah jepara',
    'zakat jepara',
    'cara sedekah online',
    'cara donasi online',
    'pertanyaan seputar zakat',
    'bantuan donasi',
  ],
  alternates: {
    canonical: '/faq',
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

const faqList: FaqItem[] = [
  {
    question:
      'Bagaimana cara melakukan donasi atau sedekah di bma.or.id?',
    answer:
      'Anda cukup memilih program kebaikan atau campaign yang ingin didukung, menentukan nominal donasi, mengisi data diri atau memilih opsi Hamba Allah, kemudian mengikuti instruksi pembayaran melalui metode yang tersedia.',
  },
  {
    question:
      'Apakah transaksi donasi di bma.or.id aman dan terpercaya?',
    answer:
      'Baitul Maal Al Muttaqin berupaya mengelola setiap transaksi secara aman, tertib, dan transparan. Setiap donasi yang masuk dicatat sebagai bagian dari penghimpunan dana untuk program sosial, dakwah, pendidikan, dan kemanusiaan yang dijalankan.',
  },
  {
    question:
      'Metode pembayaran apa saja yang didukung?',
    answer:
      'Metode pembayaran dapat mencakup QRIS, Virtual Account, transfer bank, maupun metode pembayaran digital lain yang tersedia pada halaman pembayaran. Pilihan metode pembayaran dapat berbeda sesuai layanan yang sedang aktif.',
  },
  {
    question:
      'Bagaimana cara mengonfirmasi donasi jika terjadi kendala?',
    answer:
      'Jika Anda mengalami kendala teknis, pembayaran belum terverifikasi, atau memiliki pertanyaan seputar transaksi, silakan menghubungi tim layanan Baitul Maal Al Muttaqin melalui halaman Kontak atau WhatsApp resmi di nomor +62 812-2514-7373.',
  },
  {
    question:
      'Apakah dana donasi disalurkan kepada penerima manfaat?',
    answer:
      'Dana yang terkumpul melalui setiap program akan dihimpun dan disalurkan sesuai tujuan campaign kepada penerima manfaat yang berhak, seperti fakir, miskin, yatim, dhuafa, santri, kegiatan dakwah, pendidikan, kemanusiaan, serta program kemaslahatan umat lainnya.',
  },
  {
    question:
      'Apakah saya harus memiliki akun untuk berdonasi?',
    answer:
      'Tidak selalu. Pada program tertentu Anda dapat berdonasi tanpa membuat akun. Namun, memiliki akun bma.or.id dapat memudahkan Anda melihat riwayat donasi, status transaksi, program yang pernah didukung, serta layanan lainnya yang tersedia.',
  },
  {
    question:
      'Apakah saya bisa berdonasi sebagai Hamba Allah?',
    answer:
      'Ya. Jika tersedia pada formulir donasi, Anda dapat memilih opsi Hamba Allah agar nama Anda tidak ditampilkan secara publik pada halaman program.',
  },
  {
    question:
      'Bagaimana saya mengetahui status donasi saya?',
    answer:
      'Jika Anda melakukan donasi menggunakan akun, status transaksi dapat dilihat melalui menu Riwayat Donasi. Untuk transaksi tertentu, status pembayaran juga akan diperbarui secara otomatis setelah pembayaran berhasil diverifikasi.',
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-4 px-3 pb-28">
      <div className="w-full max-w-md mx-auto bg-white border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
        
        {/* ========================================================
            HEADER FAQ
        ======================================================== */}
        <div className="border-b border-emerald-600 pb-3 space-y-1.5">
          <span className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-widest block">
            PUSAT BANTUAN BMA
          </span>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#333333] tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Temukan jawaban seputar prosedur donasi, pembayaran,
            transparansi penyaluran, akun, dan layanan
            Baitul Maal Al Muttaqin melalui bma.or.id.
          </p>

          <p className="text-[10px] text-slate-400 font-medium">
            Baitul Maal Al Muttaqin • Jepara, Jawa Tengah
          </p>
        </div>

        {/* ========================================================
            DAFTAR FAQ
        ======================================================== */}
        <div className="space-y-4">
          {faqList.map((item, index) => (
            <div
              key={index}
              className="border border-slate-200 bg-gray-50/50 p-4 space-y-2 hover:border-emerald-500 transition-colors text-left"
            >
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2.5">
                <span className="text-emerald-600 font-extrabold shrink-0">
                  Q{index + 1}.
                </span>

                <span>{item.question}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        {/* ========================================================
            CALL TO ACTION
        ======================================================== */}
        <div className="bg-[#064e3b] text-white p-4 sm:p-5 text-center space-y-3 mt-6">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide">
            Masih memiliki pertanyaan lain?
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Tim layanan Baitul Maal Al Muttaqin siap membantu
            memberikan informasi mengenai donasi, program,
            pembayaran, dan layanan bma.or.id.
          </p>

          <div className="pt-1 flex flex-col gap-2.5">
            <Link
              href="/kontak"
              className="w-full inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-3 transition shadow-sm"
            >
              Hubungi Kami 💬
            </Link>

            <Link
              href="/bantuan"
              className="w-full inline-flex items-center justify-center border border-emerald-400/40 bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-3 transition"
            >
              Pusat Bantuan
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wider py-3 transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* ========================================================
            IDENTITAS
        ======================================================== */}
        <div className="border border-slate-200 bg-slate-50 p-4 text-center space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            Baitul Maal Al Muttaqin
          </p>

          <p className="text-xs font-semibold text-slate-600">
            bma.or.id
          </p>

          <p className="text-[11px] text-slate-400">
            Jepara, Jawa Tengah
          </p>
        </div>

      </div>
    </div>
  );
}