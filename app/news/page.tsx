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

  // ============================================================
  // FETCH NEWS
  // ============================================================

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
        '🔥 Client Fetch BMA News Error:',
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

  // ============================================================
  // INITIAL FETCH
  // ============================================================

  useEffect(() => {
    fetchNews();
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main
      className="
        min-h-screen
        bg-[#f2f2f2]
        pb-28
        pt-5
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-md
          space-y-4
          px-3
        "
      >

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <section
          className="
            border
            border-[#d6d6d6]
            bg-[#dedede]
            px-5
            py-4
            shadow-[0_4px_14px_rgba(0,0,0,0.04)]
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                border
                border-[#c9c9c9]
                bg-[#f7f7f7]
              "
            >
              <Newspaper
                className="
                  h-4
                  w-4
                  text-[#555555]
                "
              />
            </div>

            <div>
              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#777777]
                "
              >
                Kabar BMA
              </p>

              <h1
                className="
                  mt-0.5
                  text-[18px]
                  font-extrabold
                  tracking-tight
                  text-[#363636]
                "
              >
                Berita Terbaru
              </h1>

              <p
                className="
                  mt-1
                  text-[8px]
                  leading-relaxed
                  text-[#777777]
                "
              >
                Informasi, kabar, dan
                pembaruan program
                Baitul Maal Al Muttaqin.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(
              (item) => (
                <div
                  key={item}
                  className="
                    flex
                    animate-pulse
                    items-center
                    gap-3.5
                    border
                    border-[#dddddd]
                    bg-white
                    p-3
                  "
                >
                  <div
                    className="
                      h-20
                      w-28
                      shrink-0
                      bg-[#dddddd]
                      sm:w-32
                    "
                  />

                  <div
                    className="
                      flex-1
                      space-y-2
                    "
                  >
                    <div
                      className="
                        h-3.5
                        w-full
                        bg-[#dddddd]
                      "
                    />

                    <div
                      className="
                        h-3.5
                        w-3/4
                        bg-[#dddddd]
                      "
                    />

                    <div
                      className="
                        mt-2
                        h-2.5
                        w-1/3
                        bg-[#e7e7e7]
                      "
                    />
                  </div>
                </div>
              )
            )}
          </div>
        ) : error ? (

          /* ===================================================
              ERROR
          =================================================== */

          <section
            className="
              border
              border-[#d4d4d4]
              bg-[#e6e6e6]
              px-5
              py-8
              text-center
            "
          >
            <Newspaper
              className="
                mx-auto
                h-7
                w-7
                text-[#888888]
              "
            />

            <h2
              className="
                mt-3
                text-[12px]
                font-bold
                text-[#444444]
              "
            >
              Berita gagal dimuat
            </h2>

            <p
              className="
                mt-1
                text-[9px]
                leading-relaxed
                text-[#777777]
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={fetchNews}
              className="
                mt-4
                inline-flex
                items-center
                justify-center
                gap-2
                border
                border-[#c5c5c5]
                bg-white
                px-4
                py-2.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#555555]
                transition
                hover:bg-[#f5f5f5]
              "
            >
              <RefreshCw
                className="
                  h-3.5
                  w-3.5
                "
              />

              Muat Ulang
            </button>
          </section>

        ) : newsList.length === 0 ? (

          /* ===================================================
              EMPTY STATE
          =================================================== */

          <section
            className="
              border
              border-[#d4d4d4]
              bg-[#e7e7e7]
              px-5
              py-10
              text-center
            "
          >
            <Newspaper
              className="
                mx-auto
                h-7
                w-7
                text-[#888888]
              "
            />

            <h2
              className="
                mt-3
                text-[12px]
                font-bold
                text-[#444444]
              "
            >
              Belum Ada Berita
            </h2>

            <p
              className="
                mt-1
                text-[9px]
                leading-relaxed
                text-[#777777]
              "
            >
              Berita terbaru dari
              Baitul Maal Al Muttaqin
              akan ditampilkan di sini.
            </p>
          </section>

        ) : (

          /* ===================================================
              NEWS LIST
          =================================================== */

          <div className="space-y-3">

            {newsList.map(
              (post) => {
                const image =
                  post.image ||
                  post.imageUrl ||
                  '/images/placeholder.jpg';

                return (
                  <Link
                    key={
                      post.id ||
                      post._id ||
                      post.slug
                    }
                    href={`/news/${post.slug}`}
                    className="
                      group
                      flex
                      items-center
                      gap-3.5
                      border
                      border-[#dddddd]
                      bg-white
                      p-3
                      shadow-[0_3px_10px_rgba(0,0,0,0.03)]
                      transition-all
                      duration-300
                      hover:border-[#c6c6c6]
                      hover:bg-[#fafafa]
                    "
                  >

                    {/* ==============================
                        IMAGE
                    ============================== */}

                    <div
                      className="
                        relative
                        aspect-[16/10]
                        w-28
                        shrink-0
                        overflow-hidden
                        bg-[#dedede]
                        sm:w-32
                      "
                    >
                      <img
                        src={image}
                        alt={
                          post.title
                        }
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-300
                          group-hover:scale-[1.03]
                        "
                      />
                    </div>

                    {/* ==============================
                        CONTENT
                    ============================== */}

                    <div
                      className="
                        flex
                        min-w-0
                        flex-1
                        flex-col
                        justify-between
                        py-0.5
                        pr-1
                        text-left
                      "
                    >

                      {/* CATEGORY */}
                      {post.category && (
                        <span
                          className="
                            mb-1
                            block
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-[#888888]
                          "
                        >
                          {post.category}
                        </span>
                      )}

                      {/* TITLE */}
                      <h2
                        className="
                          line-clamp-2
                          text-xs
                          font-semibold
                          leading-snug
                          tracking-normal
                          text-[#474747]
                          transition-colors
                          group-hover:text-[#2f2f2f]
                          sm:text-sm
                        "
                      >
                        {post.title}
                      </h2>

                      {/* DATE */}
                      <span
                        className="
                          mt-2.5
                          block
                          text-[10px]
                          font-normal
                          text-[#999999]
                          sm:text-[11px]
                        "
                      >
                        {post.dateLabel ||
                          post.timeAgo ||
                          'Kabar Terbaru'}
                      </span>

                    </div>

                    {/* ARROW */}
                    <ArrowRight
                      className="
                        h-3.5
                        w-3.5
                        shrink-0
                        text-[#bbbbbb]
                        transition
                        group-hover:translate-x-0.5
                        group-hover:text-[#777777]
                      "
                    />
                  </Link>
                );
              }
            )}

          </div>
        )}

        {/* =====================================================
            FOOTER SOURCE
        ====================================================== */}

        <div
          className="
            border-t
            border-[#d7d7d7]
            pt-3
            text-center
          "
        >
          <p
            className="
              text-[7px]
              font-medium
              uppercase
              tracking-[0.13em]
              text-[#999999]
            "
          >
            Sumber berita resmi •
            bma.or.id
          </p>
        </div>

      </div>
    </main>
  );
}