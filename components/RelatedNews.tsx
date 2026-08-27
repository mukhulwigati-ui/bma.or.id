// components/RelatedNews.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Newspaper,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface RelatedNewsItem {
  id?: string;
  _id?: string;
  slug?: string | {
    current?: string;
  };
  title?: string;
  image?: string;
  imageUrl?: string;
  publishedAt?: string;
  category?: string | {
    current?: string;
    title?: string;
  };
}

interface RelatedNewsProps {
  currentSlug: string;
  category: string;
  allNews: RelatedNewsItem[];
}

// ============================================================
// HELPERS
// ============================================================

function extractString(
  value: unknown
): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (
    typeof value === 'object' &&
    value !== null
  ) {
    const object =
      value as Record<
        string,
        unknown
      >;

    if (
      typeof object.current ===
      'string'
    ) {
      return object.current.trim();
    }

    if (
      typeof object.title ===
      'string'
    ) {
      return object.title.trim();
    }
  }

  return '';
}

function formatDate(
  dateString?: string
): string {
  if (!dateString) {
    return 'Kabar Terbaru';
  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Kabar Terbaru';
  }

  return date.toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function RelatedNews({
  currentSlug,
  category,
  allNews,
}: RelatedNewsProps) {
  // ==========================================================
  // VALIDASI DATA
  // ==========================================================

  if (
    !Array.isArray(allNews) ||
    allNews.length === 0
  ) {
    return null;
  }

  const activeSlug =
    extractString(
      currentSlug
    ).toLowerCase();

  const targetCategory =
    extractString(
      category
    ).toLowerCase();

  // ==========================================================
  // DATA VALID
  // ==========================================================

  const validNews =
    allNews.filter(
      (post) => {
        const postSlug =
          extractString(
            post?.slug
          ).toLowerCase();

        return (
          postSlug !== '' &&
          postSlug !==
            activeSlug
        );
      }
    );

  if (
    validNews.length === 0
  ) {
    return null;
  }

  // ==========================================================
  // ARTIKEL DENGAN KATEGORI SAMA
  // ==========================================================

  const related =
    validNews.filter(
      (post) => {
        const postCategory =
          extractString(
            post?.category
          ).toLowerCase();

        return (
          targetCategory !==
            '' &&
          postCategory !==
            '' &&
          postCategory ===
            targetCategory
        );
      }
    );

  // ==========================================================
  // ID / SLUG RELATED
  // ==========================================================

  const relatedKeys =
    new Set(
      related.map(
        (post) =>
          extractString(
            post.slug
          )
      )
    );

  // ==========================================================
  // FALLBACK BERITA TERBARU
  // ==========================================================

  const fallback =
    validNews.filter(
      (post) => {
        const postSlug =
          extractString(
            post.slug
          );

        return (
          postSlug !== '' &&
          !relatedKeys.has(
            postSlug
          )
        );
      }
    );

  // ==========================================================
  // GABUNGKAN MAKSIMAL 3
  // ==========================================================

  const posts = [
    ...related,
    ...fallback,
  ].slice(0, 3);

  if (
    posts.length === 0
  ) {
    return null;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="w-full border-t border-[#d5d5d5] pt-5">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-4 flex items-end justify-between gap-3">

        <div className="flex items-center gap-2.5">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#d0d0d0] bg-[#e5e5e5]">

            <Newspaper
              className="h-4 w-4 text-[#666666]"
              strokeWidth={2}
            />

          </div>

          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#8a8a8a]">
              Kabar Lainnya
            </p>

            <h3 className="mt-0.5 text-[17px] font-bold tracking-tight text-[#404040]">
              Artikel Terkait
            </h3>

          </div>

        </div>

        <Link
          href="/news"
          className="inline-flex shrink-0 items-center gap-1 text-[9px] font-bold text-[#777777] transition hover:text-[#444444]"
        >
          Semua Berita

          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

      </div>

      {/* ======================================================
          LIST
          
          Karena layout website max-w-md, lebih nyaman dibuat
          vertikal daripada dipaksa 3 kolom sempit.
      ====================================================== */}

      <div className="space-y-3">

        {posts.map(
          (post) => {
            const postSlug =
              extractString(
                post?.slug
              );

            if (!postSlug) {
              return null;
            }

            const title =
              extractString(
                post?.title
              ) ||
              'Berita BMA';

            const image =
              extractString(
                post?.imageUrl
              ) ||
              extractString(
                post?.image
              ) ||
              '/images/placeholder.jpg';

            const postDate =
              formatDate(
                post?.publishedAt
              );

            const postCategory =
              extractString(
                post?.category
              );

            return (
              <Link
                href={`/news/${postSlug}`}
                key={
                  post.id ||
                  post._id ||
                  postSlug
                }
                className="
                  group
                  flex
                  items-center
                  gap-3.5
                  border
                  border-[#dddddd]
                  bg-white
                  p-3
                  shadow-[0_3px_10px_rgba(0,0,0,0.025)]
                  transition-all
                  duration-300
                  hover:border-[#c7c7c7]
                  hover:bg-[#fafafa]
                "
              >

                {/* ============================================
                    THUMBNAIL
                ============================================ */}

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
                    alt={title}
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

                {/* ============================================
                    CONTENT
                ============================================ */}

                <div className="min-w-0 flex-1">

                  {/* CATEGORY */}
                  {postCategory && (
                    <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#999999]">
                      {postCategory}
                    </p>
                  )}

                  {/* TITLE */}
                  <h4
                    className="
                      line-clamp-2
                      text-xs
                      font-semibold
                      leading-snug
                      tracking-normal
                      text-[#505050]
                      transition-colors
                      group-hover:text-[#303030]
                      sm:text-sm
                    "
                  >
                    {title}
                  </h4>

                  {/* DATE */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-medium text-[#999999]">

                    <CalendarDays
                      className="h-3 w-3"
                      strokeWidth={2}
                    />

                    <span>
                      {postDate}
                    </span>

                  </div>

                </div>

                {/* ============================================
                    ARROW
                ============================================ */}

                <ArrowRight
                  className="
                    h-3.5
                    w-3.5
                    shrink-0
                    text-[#bbbbbb]
                    transition-all
                    duration-200
                    group-hover:translate-x-0.5
                    group-hover:text-[#777777]
                  "
                />

              </Link>
            );
          }
        )}

      </div>

    </section>
  );
}