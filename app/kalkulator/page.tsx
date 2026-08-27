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
    <main className="min-h-screen bg-[#f8f8f6] text-slate-900 pb-28 pt-2 flex justify-center">
      <div className="w-full max-w-[420px] space-y-3 px-0">

        {/* =====================================================
            PREMIUM HEADER
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#073f2e] shadow-[0_4px_20px_rgba(7,63,46,0.12)] border-y border-[#073f2e]/20">

          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

          <div className="absolute right-3 bottom-[-78px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

          <div className="absolute left-8 top-8 w-20 h-20 rounded-full bg-white/[0.02]" />

          <div className="relative z-10 p-4">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-9 h-9 shrink-0 bg-white/8 border border-white/15 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-[#d7b66a]" />
                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Zakat Center
                  </p>

                  <h1 className="mt-0.5 text-[15px] font-bold tracking-tight text-white">
                    Kalkulator Zakat
                  </h1>

                </div>

              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 border border-white/15 bg-white/8 px-2.5 py-1">
                <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

                <span className="text-[7px] font-bold uppercase tracking-wider text-[#e6d19d]">
                  Digital
                </span>
              </div>

            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-200">
              Hitung estimasi kewajiban zakat Anda secara mudah,
              cepat, dan terstruktur melalui layanan digital
              Baitul Maal Al Muttaqin.
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
            INTRO CARD
        ===================================================== */}
        <section className="relative overflow-hidden bg-white border-y border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#f7f2e7]" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 bg-[#f7f2e7] border border-[#eadfca] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Hitung Zakat Anda
                </p>

                <h2 className="mt-0.5 text-[12px] font-bold text-slate-800">
                  Tunaikan Amanah dengan Lebih Mudah
                </h2>
              </div>

            </div>

            <p className="mt-2.5 text-[9px] leading-relaxed text-slate-500">
              Masukkan nilai harta atau penghasilan Anda pada
              kalkulator di bawah. Sistem akan membantu menghitung
              estimasi zakat berdasarkan jenis zakat yang dipilih.
            </p>

            <div className="mt-3.5 grid grid-cols-3 gap-2">

              <div className="bg-[#f8f8f6] border border-slate-200 px-2 py-2.5 text-center">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Zakat
                </p>

                <p className="mt-0.5 text-[10px] font-bold text-slate-800">
                  Maal
                </p>
              </div>

              <div className="bg-[#f8f8f6] border border-slate-200 px-2 py-2.5 text-center">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Zakat
                </p>

                <p className="mt-0.5 text-[10px] font-bold text-slate-800">
                  Penghasilan
                </p>
              </div>

              <div className="bg-[#f8f8f6] border border-slate-200 px-2 py-2.5 text-center">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Zakat
                </p>

                <p className="mt-0.5 text-[10px] font-bold text-slate-800">
                  Emas
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            KALKULATOR UTAMA
        ===================================================== */}
        <section className="bg-white border-y border-slate-200/70 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">

          <div className="px-4 pt-4 pb-3 border-b border-slate-100">

            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Kalkulator Digital
            </p>

            <h2 className="mt-0.5 text-[13px] font-bold text-slate-800">
              Hitung Kewajiban Zakat
            </h2>

            <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
              Isi data yang diperlukan sesuai jenis zakat Anda.
            </p>

          </div>

          <div className="p-4">
            <ZakatCalculator />
          </div>

          <div className="h-[3px] bg-gradient-to-r from-[#b08a3d] via-[#dfc27e] to-[#b08a3d]" />

        </section>

        {/* =====================================================
            CATATAN
        ===================================================== */}
        <section className="border border-[#eadfca] bg-[#f7f2e7]/60 p-3.5">

          <div className="flex items-start gap-3">

            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <div>
              <p className="text-[9px] font-bold text-slate-800">
                Catatan Perhitungan
              </p>

              <p className="mt-0.5 text-[8px] leading-relaxed text-slate-500">
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