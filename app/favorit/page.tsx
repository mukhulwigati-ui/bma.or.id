// app/favorit/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

export default function FavoritPage() {
  // Simulasi data favorit.
  // Bisa dihubungkan ke localStorage atau tabel favorit di Supabase.
  const [favorites] = useState([
    {
      id: '1',
      title: 'Bantu Pembangunan Masjid Pelosok',
      category: 'Infrastruktur',
      slug: 'pembangunan-masjid',
      target: 50000000,
      collected: 32000000,
    },
    {
      id: '2',
      title: 'Sedekah Pangan Santri Penghafal Quran',
      category: 'Pendidikan',
      slug: 'sedekah-pangan-santri',
      target: 25000000,
      collected: 18500000,
    },
  ]);

  return (
    <div className="min-h-screen bg-[#f8f8f6] pb-28 pt-5 px-4">
      <div className="max-w-md mx-auto space-y-4">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#102a43] p-5 shadow-[0_18px_45px_rgba(16,42,67,0.16)]">

          <div className="absolute -right-14 -top-16 w-44 h-44 rounded-full border border-white/8" />

          <div className="absolute -right-4 -bottom-16 w-32 h-32 rounded-full border border-[#d7b66a]/15" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">
              <Link
                href="/akun"
                aria-label="Kembali ke akun"
                className="w-10 h-10 shrink-0 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center hover:bg-white/15 transition"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </Link>

              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                  {SITE_SHORT_NAME} Member Area
                </p>

                <h1 className="mt-1 text-[17px] font-bold text-white">
                  Program Favorit Saya
                </h1>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

              <span className="text-[8px] font-semibold uppercase tracking-wider text-[#e7d5a4]">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </span>
            </div>

          </div>
        </section>

        {/* =====================================================
            INTRO
        ====================================================== */}
        <section className="rounded-[24px] bg-white border border-slate-200/70 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Program Tersimpan
          </p>

          <h2 className="mt-1 text-[13px] font-bold text-[#102a43]">
            Kebaikan yang Ingin Anda Dukung
          </h2>

          <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
            Simpan program pilihan Anda agar lebih mudah ditemukan kembali
            dan didukung melalui {SITE_NAME}.
          </p>

        </section>

        {/* =====================================================
            FAVORITES
        ====================================================== */}
        {favorites.length === 0 ? (
          <section className="rounded-[28px] bg-white border border-slate-200/70 p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="w-14 h-14 rounded-2xl bg-[#f7f2e7] flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6 text-[#a37c32]" />
            </div>

            <h3 className="mt-5 text-[13px] font-bold text-[#102a43]">
              Belum Ada Program Favorit
            </h3>

            <p className="mt-2 text-[9px] leading-relaxed text-slate-400">
              Anda belum menandai program apa pun sebagai favorit.
              Temukan program kebaikan yang ingin Anda dukung bersama BMA.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#102a43] px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-white hover:bg-[#173d5d] transition shadow-lg shadow-[#102a43]/10"
            >
              Lihat Program
            </Link>

          </section>
        ) : (
          <section className="space-y-3">

            {favorites.map((fav) => {
              const progressPercent = Math.min(
                Math.round((fav.collected / fav.target) * 100),
                100
              );

              return (
                <article
                  key={fav.id}
                  className="rounded-[24px] bg-white border border-slate-200/70 p-4 shadow-[0_7px_25px_rgba(15,23,42,0.035)] hover:border-[#d7b66a]/60 hover:shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all"
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <span className="inline-flex items-center rounded-full bg-[#f7f2e7] border border-[#eadfca] px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider text-[#98752d]">
                        {fav.category}
                      </span>

                      <h3 className="mt-2 text-[13px] font-bold leading-snug text-[#102a43]">
                        {fav.title}
                      </h3>

                    </div>

                    <div className="w-9 h-9 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                      <Bookmark className="w-4 h-4 text-[#a37c32] fill-[#a37c32]" />
                    </div>

                  </div>

                  {/* PROGRESS */}
                  <div className="mt-4">

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-[8px] font-semibold text-slate-400">
                        Terkumpul
                      </span>

                      <span className="text-[8px] font-bold text-[#a37c32]">
                        {progressPercent}%
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#a37c32] to-[#d6b96f] transition-all duration-700"
                        style={{
                          width: `${progressPercent}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* AMOUNT */}
                  <div className="mt-3 flex items-end justify-between gap-3">

                    <div>
                      <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Dana Terkumpul
                      </p>

                      <p className="mt-1 text-[14px] font-bold text-[#102a43]">
                        Rp {fav.collected.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Target
                      </p>

                      <p className="mt-1 text-[9px] font-semibold text-slate-500">
                        Rp {fav.target.toLocaleString('id-ID')}
                      </p>
                    </div>

                  </div>

                  {/* ACTION */}
                  <div className="mt-4 border-t border-slate-100 pt-3">

                    <Link
                      href={`/campaign/${fav.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#102a43] hover:bg-[#173d5d] text-white font-bold px-4 py-3 text-[9px] uppercase tracking-wider transition shadow-sm"
                    >
                      Donasi Sekarang
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                  </div>

                </article>
              );
            })}

          </section>
        )}

        {/* =====================================================
            BRAND FOOTER
        ====================================================== */}
        <div className="pt-2 text-center">

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