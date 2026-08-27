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

interface NewsItem {
  id?: string;
  _id?: string;
  slug: string;
  title: string;

  image?: string;
  imageUrl?: string;

  category?: string;

  dateLabel?: string;
  timeAgo?: string;

  publishedAt?: string;
}

// ============================================================
// NEWS HOMEPAGE COMPONENT
// ============================================================

export default function News() {
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

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');

      const response =
        await fetch(
          `/api/news?v=${Date.now()}`,
          {
            cache: 'no-store',

            headers: {
              'Cache-Control':
                'no-cache, no-store, must-revalidate',

              Pragma:
                'no-cache',

              Accept:
                'application/json',
            },
          }
        );

      const json =
        await response.json();

      if (!response.ok) {
        throw new Error(
          json?.error ||
            'Gagal memuat berita.'
        );
      }

      if (
        json.success &&
        Array.isArray(
          json.data
        )
      ) {
        setNewsList(
          json.data
        );
      } else {
        setNewsList([]);
      }
    } catch (err: any) {
      console.error(
        'News component fetch error:',
        err
      );

      setError(
        err?.message ||
          'Gagal memuat berita terbaru.'
      );

      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL FETCH
  // ==========================================================

  useEffect(() => {
    fetchNews();
  }, []);

  // ==========================================================
  // BATASI HOMEPAGE MAKSIMAL 4 BERITA
  // ==========================================================

  const displayNews =
    newsList.slice(0, 4);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="w-full max-w-md mx-auto space-y-4 pt-2 pb-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-end justify-between gap-3 border-b border-[#d5d5d5] pb-3">

        <div className="flex items-center gap-2.5">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d0d0d0] bg-[#e5e5e5]">

            <Newspaper
              className="h-4 w-4 text-[#666666]"
              strokeWidth={2}
            />

          </div>

          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#888888]">
              Kabar BMA
            </p>

            <h2 className="mt-0.5 text-[18px] font-bold tracking-tight text-[#3f3f3f]">
              Berita Terbaru
            </h2>

          </div>

        </div>

        <Link
          href="/news"
          className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-[#777777] transition hover:text-[#444444]"
        >
          Lihat Semua

          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="space-y-3">

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading ? (
          [1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-3.5 border border-[#dddddd] bg-white p-3 shadow-[0_3px_10px_rgba(0,0,0,0.025)] animate-pulse"
              >

                <div className="h-20 w-28 shrink-0 bg-[#dddddd] sm:w-32" />

                <div className="flex-1 space-y-2">

                  <div className="h-3 w-20 bg-[#e3e3e3]" />

                  <div className="h-3.5 w-full bg-[#dddddd]" />

                  <div className="h-3.5 w-3/4 bg-[#dddddd]" />

                  <div className="mt-2 h-2.5 w-1/3 bg-[#e7e7e7]" />

                </div>

              </div>
            )
          )

        ) : error ? (

          /* ==================================================
              ERROR
          ================================================== */

          <div className="border border-[#d5d5d5] bg-[#e7e7e7] px-5 py-7 text-center">

            <Newspaper className="mx-auto h-6 w-6 text-[#888888]" />

            <p className="mt-3 text-[11px] font-bold text-[#555555]">
              Berita gagal dimuat
            </p>

            <p className="mt-1 text-[9px] leading-relaxed text-[#777777]">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchNews}
              className="mt-4 inline-flex items-center justify-center gap-2 border border-[#c7c7c7] bg-white px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#555555] transition hover:bg-[#f5f5f5]"
            >
              <RefreshCw className="h-3.5 w-3.5" />

              Muat Ulang
            </button>

          </div>

        ) : displayNews.length === 0 ? (

          /* ==================================================
              EMPTY
          ================================================== */

          <div className="border border-[#d5d5d5] bg-[#e7e7e7] px-5 py-7 text-center">

            <Newspaper className="mx-auto h-6 w-6 text-[#888888]" />

            <p className="mt-3 text-[11px] font-bold text-[#555555]">
              Belum Ada Berita
            </p>

            <p className="mt-1 text-[9px] leading-relaxed text-[#777777]">
              Berita terbaru dari Baitul Maal Al Muttaqin akan ditampilkan di sini.
            </p>

          </div>

        ) : (

          /* ==================================================
              NEWS LIST
          ================================================== */

          displayNews.map(
            (news) => {
              const image =
                news.image ||
                news.imageUrl ||
                '/images/placeholder.jpg';

              return (
                <Link
                  key={
                    news.id ||
                    news._id ||
                    news.slug
                  }
                  href={`/news/${news.slug}`}
                  className="group flex items-center gap-3.5 border border-[#dddddd] bg-white p-3 shadow-[0_3px_10px_rgba(0,0,0,0.025)] transition-all duration-300 hover:border-[#c8c8c8] hover:bg-[#fafafa]"
                >

                  {/* ==========================================
                      IMAGE
                  ========================================== */}

                  <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden bg-[#dedede] sm:w-32">

                    <img
                      src={image}
                      alt={
                        news.title ||
                        'Berita BMA'
                      }
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />

                  </div>

                  {/* ==========================================
                      CONTENT
                  ========================================== */}

                  <div className="flex min-w-0 flex-1 flex-col justify-between pr-1">

                    {/* CATEGORY */}
                    <div>

                      {news.category && (
                        <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-[#999999]">
                          {news.category}
                        </span>
                      )}

                      {/* TITLE */}
                      <h3 className="line-clamp-2 text-xs font-semibold leading-snug tracking-normal text-[#555555] transition-colors group-hover:text-[#333333] sm:text-sm">
                        {news.title}
                      </h3>

                    </div>

                    {/* DATE */}
                    <span className="mt-2.5 text-[10px] font-normal text-[#999999] sm:text-[11px]">
                      {news.dateLabel ||
                        news.timeAgo ||
                        'Kabar Terbaru'}
                    </span>

                  </div>

                  {/* ARROW */}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#c0c0c0] transition-all group-hover:translate-x-0.5 group-hover:text-[#777777]" />

                </Link>
              );
            }
          )
        )}

      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      {!loading &&
        !error &&
        newsList.length > 4 && (
          <div className="pt-1 text-center">

            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-1.5 text-[9px] font-bold text-[#666666] transition hover:text-[#333333]"
            >
              Lihat Berita Lainnya

              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

          </div>
        )}

    </section>
  );
}