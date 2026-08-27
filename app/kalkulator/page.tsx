// app/zakat/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import {
  Calculator,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import ZakatCalculator from '@/components/ZakatCalculator';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

export const metadata: Metadata = {
  title: 'Kalkulator Zakat Online | Baitul Maal Al Muttaqin',
  description:
    'Hitung zakat maal, zakat penghasilan, dan zakat emas secara mudah melalui kalkulator zakat digital Baitul Maal Al Muttaqin di bma.or.id.',
  keywords: [
    'kalkulator zakat',
    'kalkulator zakat online',
    'zakat maal',
    'zakat penghasilan',
    'zakat emas',
    'zakat jepara',
    'Baitul Maal Al Muttaqin',
    'bma.or.id',
  ],
  alternates: {
    canonical: '/zakat',
  },
};

export default function KalkulatorPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-5 sm:py-10">
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* =====================================================
            PREMIUM HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[30px] bg-[#102a43] shadow-[0_20px_55px_rgba(16,42,67,0.18)]">

          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

          <div className="absolute right-3 bottom-[-78px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

          <div className="absolute left-8 top-8 w-20 h-20 rounded-full bg-white/[0.02]" />

          <div className="relative z-10 p-5 sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg">
                  <Calculator className="w-5 h-5 text-[#d7b66a]" />
                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Zakat Center
                  </p>

                  <h1 className="mt-1 text-[18px] font-bold tracking-tight text-white">
                    Kalkulator Zakat
                  </h1>

                </div>

              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-2.5 py-1.5">
                <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

                <span className="text-[7px] font-bold uppercase tracking-wider text-[#e7d5a4]">
                  Digital
                </span>
              </div>

            </div>

            <p className="mt-5 text-[10px] leading-relaxed text-slate-300">
              Hitung estimasi kewajiban zakat Anda secara mudah,
              cepat, dan terstruktur melalui layanan digital
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
            INTRO CARD
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[26px] bg-white border border-slate-200/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#f7f2e7]" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Hitung Zakat Anda
                </p>

                <h2 className="mt-0.5 text-[13px] font-bold text-[#102a43]">
                  Tunaikan Amanah dengan Lebih Mudah
                </h2>
              </div>

            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-slate-500">
              Masukkan nilai harta atau penghasilan Anda pada
              kalkulator di bawah. Sistem akan membantu menghitung
              estimasi zakat berdasarkan jenis zakat yang dipilih.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">

              <div className="rounded-2xl border border-slate-100 bg-[#fafaf8] px-2 py-3 text-center">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Zakat
                </p>

                <p className="mt-1 text-[10px] font-bold text-[#102a43]">
                  Maal
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-[#fafaf8] px-2 py-3 text-center">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Zakat
                </p>

                <p className="mt-1 text-[10px] font-bold text-[#102a43]">
                  Penghasilan
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-[#fafaf8] px-2 py-3 text-center">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Zakat
                </p>

                <p className="mt-1 text-[10px] font-bold text-[#102a43]">
                  Emas
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            KALKULATOR UTAMA
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="px-5 pt-5 pb-4 border-b border-slate-100">

            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Kalkulator Digital
            </p>

            <h2 className="mt-1 text-[14px] font-bold text-[#102a43]">
              Hitung Kewajiban Zakat
            </h2>

            <p className="mt-1.5 text-[9px] leading-relaxed text-slate-400">
              Isi data yang diperlukan sesuai jenis zakat Anda.
            </p>

          </div>

          <div className="p-4 sm:p-5">
            <ZakatCalculator />
          </div>

          <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#dfc27e] to-[#a37c32]" />

        </section>

        {/* =====================================================
            CATATAN
        ====================================================== */}
        <section className="rounded-[22px] border border-[#eadfca] bg-[#f7f2e7]/60 p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <div>
              <p className="text-[9px] font-bold text-[#102a43]">
                Catatan Perhitungan
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                Hasil kalkulator merupakan estimasi untuk membantu
                perhitungan awal. Jika terdapat kondisi harta atau
                kewajiban yang lebih kompleks, Anda dapat berkonsultasi
                lebih lanjut dengan pihak yang memahami fikih zakat.
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