// app/search/page.tsx
'use client';

import React, {
  Suspense,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  Globe,
  Search,
  Sparkles,
  ArrowRight,
  FileText,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

function SearchResultsContent() {
  const searchParams = useSearchParams();

  const queryParam =
    searchParams.get('q') || '';

  const [results, setResults] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!queryParam.trim()) {
      setResults([]);
      return;
    }

    const controller =
      new AbortController();

    const fetchSearchResults =
      async () => {
        setLoading(true);

        try {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(
              queryParam
            )}`,
            {
              signal:
                controller.signal,
            }
          );

          if (!response.ok) {
            throw new Error(
              'Gagal memuat hasil pencarian.'
            );
          }

          const json =
            await response.json();

          if (
            json.success &&
            Array.isArray(json.data)
          ) {
            setResults(json.data);
          } else {
            setResults([]);
          }
        } catch (error: any) {
          if (
            error?.name !==
            'AbortError'
          ) {
            console.error(
              'Search error:',
              error
            );

            setResults([]);
          }
        } finally {
          setLoading(false);
        }
      };

    fetchSearchResults();

    return () =>
      controller.abort();
  }, [queryParam]);

  return (
    <div className="min-h-screen bg-[#f8f8f6] pb-28 pt-5 px-4">
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
                  <Search className="w-5 h-5 text-[#d7b66a]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Search
                  </p>

                  <h1 className="mt-1 text-[18px] font-bold tracking-tight text-white">
                    Pencarian
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
              Temukan program kebaikan,
              campaign, berita, dan informasi
              yang tersedia di {SITE_DOMAIN}.
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
            QUERY SUMMARY
        ====================================================== */}
        <section className="rounded-[24px] bg-white border border-slate-200/70 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          {loading ? (
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-[#a37c32]" />
              </div>

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Pencarian Berlangsung
                </p>

                <p className="mt-1 text-[11px] font-bold text-[#102a43]">
                  Mencari data di sistem...
                </p>

              </div>

            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Hasil Pencarian
                </p>

                <h2 className="mt-1 text-[13px] font-bold text-[#102a43]">
                  {queryParam.trim()
                    ? `"${queryParam}"`
                    : 'Masukkan kata kunci'}
                </h2>

              </div>

              {queryParam.trim() && (
                <span className="inline-flex items-center rounded-full bg-[#f7f2e7] border border-[#eadfca] px-2.5 py-1 text-[8px] font-bold text-[#98752d]">
                  {results.length} hasil
                </span>
              )}

            </div>
          )}

        </section>

        {/* =====================================================
            SEARCH RESULTS
        ====================================================== */}
        {!loading &&
        results.length > 0 ? (
          <section className="space-y-3">

            {results.map(
              (item) => {
                const isNews =
                  item.type === 'news';

                const targetUrl =
                  isNews
                    ? `/news/${item.slug}`
                    : `/campaign/${item.slug}`;

                const displayUrl =
                  isNews
                    ? `${SITE_DOMAIN} › news › ${item.slug}`
                    : `${SITE_DOMAIN} › campaign › ${item.slug}`;

                return (
                  <article
                    key={item.id}
                    className="group rounded-[24px] bg-white border border-slate-200/70 p-4 shadow-[0_7px_25px_rgba(15,23,42,0.035)] hover:border-[#d7b66a]/60 hover:shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all"
                  >

                    {/* TYPE */}
                    <div className="flex items-center justify-between gap-3">

                      <div className="flex items-center gap-2 min-w-0">

                        <div className="w-8 h-8 shrink-0 rounded-xl bg-[#f7f2e7] flex items-center justify-center">

                          {isNews ? (
                            <FileText className="w-3.5 h-3.5 text-[#a37c32]" />
                          ) : (
                            <HeartHandshake className="w-3.5 h-3.5 text-[#a37c32]" />
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-[#98752d]">
                            {isNews
                              ? 'Berita & Kabar'
                              : 'Program Kebaikan'}
                          </p>

                          <div className="mt-0.5 flex items-center gap-1 text-[7px] text-slate-400 min-w-0">

                            <Globe className="w-3 h-3 shrink-0" />

                            <span className="truncate font-mono">
                              {displayUrl}
                            </span>

                          </div>

                        </div>

                      </div>

                      <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-300 group-hover:text-[#a37c32] group-hover:translate-x-0.5 transition" />

                    </div>

                    {/* TITLE */}
                    <Link
                      href={targetUrl}
                      className="mt-3 block text-[13px] sm:text-[14px] font-bold leading-snug text-[#102a43] group-hover:text-[#98752d] transition"
                    >
                      {item.title}
                    </Link>

                    {/* SNIPPET */}
                    <p className="mt-2 text-[9px] sm:text-[10px] leading-relaxed text-slate-500 line-clamp-3">

                      {isNews
                        ? `Kabar dan informasi terbaru dari ${SITE_NAME} mengenai ${item.title}. Baca informasi selengkapnya melalui ${SITE_DOMAIN}.`
                        : `Program kebaikan ${SITE_NAME}${
                            item.category
                              ? ` dalam kategori ${item.category}`
                              : ''
                          }. Lihat informasi program dan salurkan dukungan Anda melalui ${SITE_DOMAIN}.`
                      }

                    </p>

                    {/* CTA */}
                    <div className="mt-3 border-t border-slate-100 pt-3">

                      <Link
                        href={targetUrl}
                        className="inline-flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#a37c32] hover:text-[#876725] transition"
                      >
                        {isNews
                          ? 'Baca Selengkapnya'
                          : 'Lihat Program'}

                        <ArrowRight className="w-3 h-3" />
                      </Link>

                    </div>

                  </article>
                );
              }
            )}

          </section>
        ) : null}

        {/* =====================================================
            EMPTY RESULT
        ====================================================== */}
        {!loading &&
          results.length === 0 &&
          queryParam.trim() !== '' && (
            <section className="rounded-[28px] bg-white border border-slate-200/70 p-7 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

              <div className="w-14 h-14 rounded-2xl bg-[#f7f2e7] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-[#a37c32]" />
              </div>

              <h3 className="mt-5 text-[13px] font-bold text-[#102a43]">
                Hasil Tidak Ditemukan
              </h3>

              <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
                Kami tidak menemukan hasil
                untuk kata kunci{' '}
                <strong className="font-bold text-slate-700">
                  “{queryParam}”
                </strong>{' '}
                di {SITE_DOMAIN}.
              </p>

              <div className="mt-5 rounded-2xl bg-[#f8f8f6] border border-slate-100 p-4 text-left">

                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Coba pencarian lain
                </p>

                <ul className="mt-3 space-y-2">

                  {[
                    'Pastikan ejaan kata kunci sudah benar.',
                    'Gunakan kata kunci yang lebih singkat.',
                    'Coba kata seperti Zakat, Santri, Sedekah, Yatim, atau Masjid.',
                  ].map(
                    (item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[9px] leading-relaxed text-slate-500"
                      >
                        <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[#a37c32] shrink-0" />
                        <span>{item}</span>
                      </li>
                    )
                  )}

                </ul>

              </div>

              <Link
                href="/"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#102a43] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-white hover:bg-[#173d5d] transition"
              >
                Kembali ke Beranda
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </section>
          )}

        {/* =====================================================
            NO QUERY
        ====================================================== */}
        {!loading &&
          !queryParam.trim() && (
            <section className="rounded-[28px] bg-white border border-slate-200/70 p-7 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

              <div className="w-14 h-14 rounded-2xl bg-[#f7f2e7] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-[#a37c32]" />
              </div>

              <h3 className="mt-5 text-[13px] font-bold text-[#102a43]">
                Temukan Program Kebaikan
              </h3>

              <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
                Gunakan kolom pencarian untuk menemukan
                program, campaign, atau berita yang
                tersedia di {SITE_DOMAIN}.
              </p>

            </section>
          )}

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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4">

          <div className="flex flex-col items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-[#102a43] flex items-center justify-center shadow-lg">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Menyiapkan pencarian BMA
            </p>

          </div>

        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}