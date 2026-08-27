// app/news/[slug]/page.tsx

import type { Metadata } from 'next';
import { createClient } from '@sanity/client';
import BlogDetailClient from '@/components/BlogDetailClient';

// ============================================================
// TYPES
// ============================================================

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// ============================================================
// IDENTITAS BMA
// ============================================================

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_DOMAIN = 'bma.or.id';
const SITE_URL = 'https://bma.or.id';

// ============================================================
// SANITY BMA
//
// Dikunci langsung ke project BMA.
// Tidak memakai SANITY_API_TOKEN untuk read published.
// ============================================================

const serverClient = createClient({
  projectId: 'im4qx3kd',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-08-01',
  perspective: 'published',
});

// ============================================================
// CACHE / DYNAMIC
// ============================================================

export const dynamic = 'force-dynamic';
export const revalidate = 60;

// ============================================================
// HELPER: PORTABLE TEXT KE PLAIN TEXT
// ============================================================

function portableTextToPlainText(
  content: any
): string {
  if (!content) {
    return '';
  }

  if (
    typeof content === 'string'
  ) {
    return content.trim();
  }

  if (
    !Array.isArray(content)
  ) {
    return '';
  }

  return content
    .filter(
      (block: any) =>
        block &&
        block._type === 'block' &&
        Array.isArray(
          block.children
        )
    )
    .map(
      (block: any) =>
        block.children
          .map(
            (child: any) =>
              typeof child?.text ===
              'string'
                ? child.text
                : ''
          )
          .join('')
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================
// HELPER: EXCERPT SEO
// ============================================================

function makeExcerpt(
  text: string,
  maxLength = 160
): string {
  const clean =
    text
      .replace(/\s+/g, ' ')
      .trim();

  if (!clean) {
    return '';
  }

  if (
    clean.length <=
    maxLength
  ) {
    return clean;
  }

  return (
    clean
      .slice(
        0,
        maxLength
      )
      .trimEnd() + '...'
  );
}

// ============================================================
// DYNAMIC METADATA
// ============================================================

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } =
    await params;

  const cleanSlug =
    decodeURIComponent(
      slug
    ).trim();

  const fallbackImage =
    `${SITE_URL}/images/banner.png`;

  let articleTitle =
    `Berita | ${SITE_NAME}`;

  let articleExcerpt =
    `Baca kabar terbaru, laporan program, dan informasi resmi ${SITE_NAME} melalui ${SITE_DOMAIN}.`;

  let imageUrl =
    fallbackImage;

  try {
    const article =
      await serverClient.fetch(
        `
          *[
            _type == "news" &&
            defined(slug.current) &&
            lower(slug.current) == lower($slug)
          ][0] {

            title,

            excerpt,

            description,

            summary,

            content,

            publishedAt,

            "imageUrl":
              coalesce(
                image.asset->url,
                mainImage.asset->url,
                thumbnail.asset->url,
                coverImage.asset->url,
                banner.asset->url
              )
          }
        `,
        {
          slug:
            cleanSlug,
        },
        {
          next: {
            revalidate: 60,
          },
        }
      );

    if (article) {
      // ======================================================
      // TITLE
      // ======================================================

      if (
        typeof article.title ===
          'string' &&
        article.title.trim()
      ) {
        articleTitle =
          article.title.trim();
      }

      // ======================================================
      // DESCRIPTION / EXCERPT
      // ======================================================

      if (
        typeof article.excerpt ===
          'string' &&
        article.excerpt.trim()
      ) {
        articleExcerpt =
          makeExcerpt(
            article.excerpt
          );
      } else if (
        typeof article.description ===
          'string' &&
        article.description.trim()
      ) {
        articleExcerpt =
          makeExcerpt(
            article.description
          );
      } else if (
        typeof article.summary ===
          'string' &&
        article.summary.trim()
      ) {
        articleExcerpt =
          makeExcerpt(
            article.summary
          );
      } else {
        const plainText =
          portableTextToPlainText(
            article.content
          );

        if (plainText) {
          articleExcerpt =
            makeExcerpt(
              plainText
            );
        }
      }

      if (!articleExcerpt) {
        articleExcerpt =
          `Baca berita lengkap "${articleTitle}" secara resmi melalui ${SITE_DOMAIN}.`;
      }

      // ======================================================
      // IMAGE
      // ======================================================

      if (
        typeof article.imageUrl ===
          'string' &&
        article.imageUrl.trim()
      ) {
        imageUrl =
          article.imageUrl.startsWith(
            'http'
          )
            ? article.imageUrl
            : `${SITE_URL}${
                article.imageUrl.startsWith(
                  '/'
                )
                  ? ''
                  : '/'
              }${article.imageUrl}`;
      }
    }
  } catch (error) {
    console.error(
      '🔥 BMA metadata news fetch error:',
      error
    );

    articleExcerpt =
      `Baca kabar terbaru dan informasi resmi ${SITE_NAME} melalui ${SITE_DOMAIN}.`;
  }

  // ==========================================================
  // METADATA
  // ==========================================================

  return {
    title:
      articleTitle,

    description:
      articleExcerpt,

    alternates: {
      canonical:
        `/news/${cleanSlug}`,
    },

    openGraph: {
      title:
        articleTitle,

      description:
        articleExcerpt,

      url:
        `${SITE_URL}/news/${cleanSlug}`,

      siteName:
        SITE_NAME,

      locale:
        'id_ID',

      type:
        'article',

      images: [
        {
          url:
            imageUrl,

          width:
            1200,

          height:
            630,

          alt:
            articleTitle,
        },
      ],
    },

    twitter: {
      card:
        'summary_large_image',

      title:
        articleTitle,

      description:
        articleExcerpt,

      images: [
        imageUrl,
      ],
    },
  };
}

// ============================================================
// SERVER COMPONENT ENTRY
// ============================================================

export default async function NewsDetailPage({
  params,
}: Props) {
  const { slug } =
    await params;

  const cleanSlug =
    decodeURIComponent(
      slug
    ).trim();

  return (
    <BlogDetailClient
      slug={cleanSlug}
    />
  );
}