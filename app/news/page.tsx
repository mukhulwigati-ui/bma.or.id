// app/news/page.tsx
'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  ArrowRight,
  Newspaper,
  RefreshCw,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface NewsItem {
  id: string;
  slug: string;
  title: string;

  image?: string;
  category?: string;

  publishedAt?: string;

  timeAgo?: string;
  dateLabel?: string;
}

// ============================================================
// PAGE
// ============================================================

export default function NewsPage() {
  const [
    newsList,
    setNewsList,
  ] = useState<NewsItem[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  // ==========================================================
  // FETCH NEWS
  // ==========================================================

  const loadNews =
    async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          await fetch(
            `/api/news?v=${Date.now()}`,
            {
              method: 'GET',

              cache:
                'no-store',

              headers: {
                Accept:
                  'application/json',

                'Cache-Control':
                  'no-cache, no-store, must-revalidate',

                Pragma:
                  'no-cache',
              },
            }
          );

        const json =
          await response.json();

        console.log(
          '📰 RESPONSE API NEWS:',
          json
        );

        if (!response.ok) {
          throw new Error(
            json?.error ||
              'Gagal mengambil berita.'
          );
        }

        if (
          json?.success === true &&
          Array.isArray(
            json?.data
          )
        ) {
          console.log(
            '✅ TOTAL BERITA:',
            json.data.length
          );

          setNewsList(
            json.data
          );

          return;
        }

        setNewsList([]);

      } catch (err: any) {
        console.error(
          '🔥 News Page Fetch Error:',
          err
        );

        setNewsList([]);

        setError(
          err?.message ||
            'Terjadi kesalahan saat memuat berita.'
        );

      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL FETCH
  // ==========================================================

  useEffect(() => {
    loadNews();
  }, []);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#f2f2f2] pb-28 pt-5">

      <div className="mx-auto w-full max-w-md space-y-5 px-3">

        {/* ====================================================
            HEADER
        ===================================================== */}

        <section className="border border-[#d0d0d0] bg-[#dddddd] px-5 py-5 shadow-[0_3px_12px_rgba(0,0,0,0.035)]">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#c9c9c9] bg-[#f7f7f7]">

              <Newspaper
                className="h-5 w-5 text-[#666666]"
                strokeWidth={1.8}
              />

            </div>

            <div className="min-w-0">

              <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#777777]">
                Kabar BMA
              </p>

              <h1 className="mt-1 text-[20px] font-extrabold tracking-tight text-[#373737]">
                Berita Terbaru
              </h1>

              <p className="mt-1 text-[9px] leading-relaxed text-[#777777]">
                Informasi, kabar, dan pembaruan program Baitul Maal Al Muttaqin.
              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div className="space-y-3">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="flex animate-pulse gap-3.5 border border-[#dddddd] bg-white p-3"
                >

                  <div className="h-20 w-28 shrink-0 bg-[#dddddd]" />

                  <div className="flex-1 space-y-2">

                    <div className="h-3 w-20 bg-[#e5e5e5]" />

                    <div className="h-4 w-full bg-[#dddddd]" />

                    <div className="h-4 w-3/4 bg-[#dddddd]" />

                    <div className="h-3 w-1/3 bg-[#e5e5e5]" />

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* ====================================================
            ERROR
        ===================================================== */}

        {!loading &&
          error && (
            <section className="border border-[#d0d0d0] bg-[#e5e5e5] px-5 py-8 text-center">

              <Newspaper className="mx-auto h-7 w-7 text-[#888888]" />

              <h2 className="mt-3 text-[13px] font-bold text-[#555555]">
                Berita Gagal Dimuat
              </h2>

              <p className="mt-2 text-[10px] leading-relaxed text-[#777777]">
                {error}
              </p>

              <button
                type="button"
                onClick={
                  loadNews
                }
                className="mt-4 inline-flex items-center gap-2 border border-[#c5c5c5] bg-white px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#555555]"
              >
                <RefreshCw className="h-3.5 w-3.5" />

                Muat Ulang
              </button>

            </section>
          )}

        {/* ====================================================
            EMPTY
        ===================================================== */}

        {!loading &&
          !error &&
          newsList.length ===
            0 && (
            <section className="border border-[#d0d0d0] bg-[#e5e5e5] px-5 py-12 text-center">

              <Newspaper className="mx-auto h-8 w-8 text-[#888888]" />

              <h2 className="mt-4 text-[13px] font-bold text-[#555555]">
                Belum Ada Berita
              </h2>

              <p className="mt-2 text-[10px] leading-relaxed text-[#777777]">
                Berita terbaru dari Baitul Maal Al Muttaqin akan ditampilkan di sini.
              </p>

            </section>
          )}

        {/* ====================================================
            NEWS LIST
        ===================================================== */}

        {!loading &&
          !error &&
          newsList.length >
            0 && (
            <div className="space-y-3">

              {newsList.map(
                (post) => {
                  const image =
                    typeof post.image ===
                      'string' &&
                    post.image.trim()
                      ? post.image
                      : '/images/placeholder.jpg';

                  return (
                    <Link
                      key={
                        post.id ||
                        post.slug
                      }
                      href={`/news/${post.slug}`}
                      className="group flex items-center gap-3.5 border border-[#dddddd] bg-white p-3 shadow-[0_3px_10px_rgba(0,0,0,0.025)] transition hover:border-[#c5c5c5] hover:bg-[#fafafa]"
                    >

                      {/* ==============================
                          IMAGE
                      ============================== */}

                      <div className="aspect-[16/10] w-28 shrink-0 overflow-hidden bg-[#dedede] sm:w-32">

                        <img
                          src={
                            image
                          }
                          alt={
                            post.title ||
                            'Berita BMA'
                          }
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              '/images/placeholder.jpg';
                          }}
                        />

                      </div>

                      {/* ==============================
                          CONTENT
                      ============================== */}

                      <div className="min-w-0 flex-1">

                        {/* CATEGORY */}

                        {post.category && (
                          <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#999999]">
                            {
                              post.category
                            }
                          </p>
                        )}

                        {/* TITLE */}

                        <h2 className="line-clamp-2 text-[12px] font-semibold leading-snug text-[#4b4b4b] transition group-hover:text-[#303030] sm:text-sm">
                          {
                            post.title
                          }
                        </h2>

                        {/* DATE */}

                        <p className="mt-2.5 text-[10px] text-[#999999]">
                          {post.dateLabel ||
                            post.timeAgo ||
                            'Kabar Terbaru'}
                        </p>

                      </div>

                      {/* ARROW */}

                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#bbbbbb] transition group-hover:translate-x-0.5 group-hover:text-[#777777]" />

                    </Link>
                  );
                }
              )}

            </div>
          )}

        {/* ====================================================
            FOOTER
        ===================================================== */}

        <div className="border-t border-[#d5d5d5] pt-4 text-center">

          <p className="text-[7px] font-medium uppercase tracking-[0.14em] text-[#999999]">
            Sumber berita resmi • bma.or.id
          </p>

        </div>

      </div>

    </main>
  );
}