// app/news/[slug]/BlogDetailClient.tsx
'use client';

import React, {
  useEffect,
  useState,
} from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import {
  ArrowLeft,
  CalendarDays,
  Copy,
  Newspaper,
  RefreshCw,
} from 'lucide-react';

import RelatedNews from '@/components/RelatedNews';

// ============================================================
// IDENTITAS
// ============================================================

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_DOMAIN = 'bma.or.id';

// ============================================================
// PORTABLE TEXT COMPONENTS
// ============================================================

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?.url) {
        return null;
      }

      return (
        <div className="my-6 w-full space-y-2 text-left">
          <div className="aspect-[16/9] overflow-hidden border border-[#d8d8d8] bg-[#eeeeee]">
            <img
              src={value.asset.url}
              alt={
                typeof value.alt === 'string'
                  ? value.alt
                  : 'Gambar Berita BMA'
              }
              className="h-full w-full object-cover"
            />
          </div>

          {value.caption &&
            typeof value.caption === 'string' && (
              <p className="text-center text-[11px] italic leading-relaxed text-[#777777] sm:text-xs">
                {value.caption}
              </p>
            )}
        </div>
      );
    },
  },

  marks: {
    link: ({
      children,
      value,
    }: any) => {
      const href =
        typeof value?.href === 'string'
          ? value.href
          : '#';

      const external =
        href.startsWith('http://') ||
        href.startsWith('https://');

      return (
        <a
          href={href}
          rel={
            external
              ? 'noreferrer noopener'
              : undefined
          }
          target={
            external
              ? '_blank'
              : undefined
          }
          className="font-semibold text-[#555555] underline decoration-[#aaaaaa] underline-offset-2 transition hover:text-[#2f2f2f]"
        >
          {children}
        </a>
      );
    },
  },

  block: {
    normal: ({
      children,
    }: any) => (
      <p className="mb-5 text-[15px] leading-[1.85] text-[#444444] sm:text-[16px]">
        {children}
      </p>
    ),

    h1: ({
      children,
    }: any) => (
      <h1 className="mb-4 mt-8 text-xl font-extrabold leading-tight tracking-tight text-[#343434] sm:text-2xl">
        {children}
      </h1>
    ),

    h2: ({
      children,
    }: any) => (
      <h2 className="mb-3 mt-7 text-lg font-bold leading-snug tracking-tight text-[#383838] sm:text-xl">
        {children}
      </h2>
    ),

    h3: ({
      children,
    }: any) => (
      <h3 className="mb-2.5 mt-6 text-base font-bold leading-snug text-[#444444] sm:text-lg">
        {children}
      </h3>
    ),

    blockquote: ({
      children,
    }: any) => (
      <blockquote className="my-5 border-l-4 border-[#9a9a9a] bg-[#eeeeee] px-4 py-3 text-[14px] italic leading-relaxed text-[#555555]">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({
      children,
    }: any) => (
      <ul className="mb-5 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-[#444444] sm:text-[16px]">
        {children}
      </ul>
    ),

    number: ({
      children,
    }: any) => (
      <ol className="mb-5 list-decimal space-y-2 pl-6 text-[15px] leading-relaxed text-[#444444] sm:text-[16px]">
        {children}
      </ol>
    ),
  },
};

// ============================================================
// TYPES
// ============================================================

interface BlogDetailClientProps {
  slug: string;
}

interface ArticleData {
  id?: string;
  title?: string;
  slug?: string;
  imageUrl?: string;
  caption?: string;
  alt?: string;
  publishedAt?: string;
  category?: string;
  content?: any[];
}

interface DetailResponseData {
  article?: ArticleData;
  allNews?: any[];
  sidebarCampaigns?: any[];
}

// ============================================================
// COMPONENT
// ============================================================

export default function BlogDetailClient({
  slug,
}: BlogDetailClientProps) {
  const [data, setData] =
    useState<DetailResponseData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [copied, setCopied] =
    useState(false);

  // ==========================================================
  // FETCH DETAIL NEWS
  // ==========================================================

  const fetchDetail =
    async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          await fetch(
            `/api/news/${encodeURIComponent(
              slug
            )}?v=${Date.now()}`,
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
          json.data
        ) {
          setData(
            json.data
          );
        } else {
          setData(null);

          setError(
            json?.error ||
              'Artikel tidak ditemukan.'
          );
        }
      } catch (err: any) {
        console.error(
          'Fetch BMA news detail error:',
          err
        );

        setData(null);

        setError(
          err?.message ||
            'Gagal memuat detail berita.'
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDetail();
  }, [slug]);

  // ==========================================================
  // SAFE STRING
  // ==========================================================

  const renderSafeString = (
    value: any,
    fallback = ''
  ): string => {
    if (!value) {
      return fallback;
    }

    if (
      typeof value === 'string'
    ) {
      return value;
    }

    if (
      typeof value === 'object' &&
      value.current
    ) {
      return String(
        value.current
      );
    }

    return fallback;
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f2f2f2] pb-28 pt-5">
        <div className="mx-auto w-full max-w-md space-y-4 px-3 animate-pulse">

          <div className="border border-[#d5d5d5] bg-[#dedede] p-4">
            <div className="h-3 w-24 bg-[#c9c9c9]" />
            <div className="mt-3 h-5 w-4/5 bg-[#c9c9c9]" />
            <div className="mt-2 h-4 w-2/3 bg-[#d0d0d0]" />
          </div>

          <div className="aspect-[16/9] w-full bg-[#d8d8d8]" />

          <div className="space-y-3 bg-white p-4">
            <div className="h-4 w-full bg-[#dddddd]" />
            <div className="h-4 w-full bg-[#dddddd]" />
            <div className="h-4 w-5/6 bg-[#dddddd]" />
            <div className="h-4 w-3/4 bg-[#dddddd]" />
          </div>

        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR / NOT FOUND
  // ==========================================================

  if (
    !data ||
    !data.article
  ) {
    return (
      <main className="min-h-screen bg-[#f2f2f2] pb-28 pt-10">
        <div className="mx-auto w-full max-w-md px-3">

          <section className="border border-[#d4d4d4] bg-[#e4e4e4] px-5 py-10 text-center">

            <Newspaper className="mx-auto h-8 w-8 text-[#777777]" />

            <h1 className="mt-4 text-[15px] font-bold text-[#444444]">
              Artikel Tidak Ditemukan
            </h1>

            <p className="mt-2 text-[10px] leading-relaxed text-[#777777]">
              {error ||
                'Berita yang Anda cari tidak tersedia atau telah dipindahkan.'}
            </p>

            <div className="mt-5 flex flex-col gap-2.5">

              <button
                type="button"
                onClick={
                  fetchDetail
                }
                className="inline-flex w-full items-center justify-center gap-2 border border-[#c9c9c9] bg-white px-4 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#555555] transition hover:bg-[#f7f7f7]"
              >
                <RefreshCw className="h-3.5 w-3.5" />

                Coba Lagi
              </button>

              <Link
                href="/news"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#4a4a4a] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#333333]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />

                Kembali ke Berita
              </Link>

            </div>

          </section>

        </div>
      </main>
    );
  }

  // ==========================================================
  // ARTICLE
  // ==========================================================

  const {
    article,
    allNews,
  } = data;

  const titleString =
    renderSafeString(
      article.title,
      'Detail Berita'
    );

  const categoryString =
    renderSafeString(
      article.category,
      'Kabar Terbaru'
    );

  const formattedDate =
    article.publishedAt
      ? new Date(
          article.publishedAt
        ).toLocaleDateString(
          'id-ID',
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }
        )
      : 'Berita Terbaru';

  const imageUrl =
    typeof article.imageUrl ===
      'string' &&
    article.imageUrl.trim()
      ? article.imageUrl
      : '/images/placeholder.jpg';

  // ==========================================================
  // COPY LINK
  // ==========================================================

  const handleCopyLink =
    async () => {
      try {
        if (
          typeof window ===
            'undefined' ||
          !navigator.clipboard
        ) {
          return;
        }

        await navigator.clipboard.writeText(
          window.location.href
        );

        setCopied(true);

        window.setTimeout(
          () => {
            setCopied(false);
          },
          2000
        );
      } catch (err) {
        console.error(
          'Copy link error:',
          err
        );
      }
    };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#f2f2f2] pb-28 pt-4">

      <div className="mx-auto w-full max-w-md space-y-4 px-3">

        {/* ====================================================
            ARTICLE HEADER
        ===================================================== */}

        <article className="border border-[#d7d7d7] bg-white">

          {/* BREADCRUMB */}
          <div className="border-b border-[#e3e3e3] bg-[#eeeeee] px-4 py-3">

            <nav className="flex items-center gap-2 text-[9px] font-medium text-[#777777]">

              <Link
                href="/"
                className="transition hover:text-[#444444]"
              >
                Beranda
              </Link>

              <span>/</span>

              <Link
                href="/news"
                className="transition hover:text-[#444444]"
              >
                Berita
              </Link>

              <span>/</span>

              <span className="truncate text-[#555555]">
                {categoryString}
              </span>

            </nav>

          </div>

          {/* TITLE AREA */}
          <div className="px-4 py-5 sm:px-5">

            <div className="mb-2">

              <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                {categoryString}
              </span>

            </div>

            <h1 className="text-[22px] font-extrabold leading-[1.25] tracking-tight text-[#363636] sm:text-[25px]">
              {titleString}
            </h1>

            <div className="mt-4 flex items-center gap-2 border-t border-[#eeeeee] pt-3">

              <CalendarDays className="h-3.5 w-3.5 text-[#888888]" />

              <span className="text-[10px] font-medium text-[#777777]">
                {formattedDate}
              </span>

              <span className="text-[#bbbbbb]">
                •
              </span>

              <span className="text-[10px] font-medium text-[#777777]">
                {SITE_DOMAIN}
              </span>

            </div>

          </div>

          {/* ==================================================
              MAIN IMAGE
          ================================================== */}

          <div className="space-y-2 px-4 pb-4 sm:px-5">

            <div className="aspect-[16/9] w-full overflow-hidden border border-[#dddddd] bg-[#e5e5e5]">

              <img
                src={imageUrl}
                alt={renderSafeString(
                  article.alt,
                  titleString
                )}
                className="h-full w-full object-cover"
              />

            </div>

            {article.caption && (
              <p className="text-center text-[10px] italic leading-relaxed text-[#888888]">
                Foto:{' '}
                {renderSafeString(
                  article.caption,
                  ''
                )}
              </p>
            )}

          </div>

          {/* ==================================================
              ARTICLE CONTENT
          ================================================== */}

          <div className="border-t border-[#eeeeee] px-4 py-5 sm:px-5">

            {Array.isArray(
              article.content
            ) &&
            article.content.length >
              0 ? (
              <PortableText
                value={
                  article.content
                }
                components={
                  portableTextComponents
                }
              />
            ) : (
              <p className="text-[14px] italic text-[#888888]">
                Isi berita belum diunggah.
              </p>
            )}

          </div>

          {/* ==================================================
              SHARE
          ================================================== */}

          <div className="flex items-center justify-between gap-3 border-t border-[#e5e5e5] bg-[#eeeeee] px-4 py-3 sm:px-5">

            <span className="text-[9px] font-semibold text-[#666666]">
              Bagikan berita ini
            </span>

            <button
              type="button"
              onClick={
                handleCopyLink
              }
              className="inline-flex items-center gap-1.5 border border-[#cccccc] bg-white px-3 py-2 text-[9px] font-bold text-[#555555] transition hover:bg-[#f7f7f7]"
            >
              <Copy className="h-3.5 w-3.5" />

              {copied
                ? 'Tersalin'
                : 'Salin Link'}
            </button>

          </div>

        </article>

        {/* ====================================================
            RELATED NEWS
        ===================================================== */}

        <section className="pt-1">
          <RelatedNews
            currentSlug={slug}
            category={
              categoryString
            }
            allNews={
              Array.isArray(
                allNews
              )
                ? allNews
                : []
            }
          />
        </section>

        {/* ====================================================
            FOOTER SOURCE
        ===================================================== */}

        <div className="border-t border-[#d6d6d6] pb-2 pt-3 text-center">

          <p className="text-[7px] font-medium uppercase tracking-[0.13em] text-[#999999]">
            Berita resmi • {SITE_NAME} • {SITE_DOMAIN}
          </p>

        </div>

      </div>

    </main>
  );
}