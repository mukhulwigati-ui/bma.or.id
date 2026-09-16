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
const SITE_DOMAIN = 'www.bma.or.id';
const SITE_URL = 'https://www.bma.or.id';

// ============================================================
// SANITY BMA
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
export const revalidate = 0;

// ============================================================
// PORTABLE TEXT -> PLAIN TEXT
// ============================================================

function portableTextToPlainText(
  content: any
): string {
  if (!content) {
    return '';
  }

  if (typeof content === 'string') {
    return content.trim();
  }

  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .filter(
      (block: any) =>
        block &&
        block._type === 'block' &&
        Array.isArray(block.children)
    )
    .map((block: any) =>
      block.children
        .map((child: any) =>
          typeof child?.text === 'string'
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
// EXCERPT SEO
// ============================================================

function makeExcerpt(
  text: string,
  maxLength = 160
): string {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) {
    return '';
  }

  if (clean.length <= maxLength) {
    return clean;
  }

  return (
    clean
      .slice(0, maxLength)
      .trimEnd() + '...'
  );
}

// ============================================================
// NORMALIZE IMAGE
//
// PENTING:
// Untuk gambar Sanity jangan tambahkan:
// ?w=1200&h=630&fit=crop&fm=jpg
//
// URL asset asli diberikan langsung ke WhatsApp.
// ============================================================

function normalizeImageUrl(
  value: unknown
): string {
  if (
    typeof value !== 'string' ||
    !value.trim()
  ) {
    return `${SITE_URL}/images/banner.png`;
  }

  const image = value.trim();

  if (
    image.startsWith('https://') ||
    image.startsWith('http://')
  ) {
    return image;
  }

  return `${SITE_URL}${
    image.startsWith('/') ? '' : '/'
  }${image}`;
}

// ============================================================
// DYNAMIC METADATA
// ============================================================

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const cleanSlug =
    decodeURIComponent(slug).trim();

  const pageUrl =
    `${SITE_URL}/news/${encodeURIComponent(
      cleanSlug
    )}`;

  const fallbackImage =
    `${SITE_URL}/images/banner.png`;

  let articleTitle =
    `Berita | ${SITE_NAME}`;

  let articleExcerpt =
    `Baca kabar terbaru, laporan program, dan informasi resmi ${SITE_NAME} melalui ${SITE_DOMAIN}.`;

  let imageUrl = fallbackImage;

  try {
    const article =
      await serverClient.fetch(
        `
          *[
            _type == "news" &&
            defined(slug.current) &&
            lower(slug.current) == lower($slug)
          ][0] {
            _id,
            title,
            excerpt,
            description,
            summary,
            content,
            publishedAt,
            _updatedAt,

            "imageUrl": coalesce(
              image.asset->url,
              mainImage.asset->url,
              thumbnail.asset->url,
              coverImage.asset->url,
              banner.asset->url
            )
          }
        `,
        {
          slug: cleanSlug,
        },
        {
          cache: 'no-store',
        }
      );

    if (article) {
      // ======================================================
      // TITLE
      // ======================================================

      if (
        typeof article.title === 'string' &&
        article.title.trim()
      ) {
        articleTitle =
          article.title.trim();
      }

      // ======================================================
      // DESCRIPTION
      // ======================================================

      if (
        typeof article.excerpt === 'string' &&
        article.excerpt.trim()
      ) {
        articleExcerpt =
          makeExcerpt(article.excerpt);
      } else if (
        typeof article.description === 'string' &&
        article.description.trim()
      ) {
        articleExcerpt =
          makeExcerpt(article.description);
      } else if (
        typeof article.summary === 'string' &&
        article.summary.trim()
      ) {
        articleExcerpt =
          makeExcerpt(article.summary);
      } else {
        const plainText =
          portableTextToPlainText(
            article.content
          );

        if (plainText) {
          articleExcerpt =
            makeExcerpt(plainText);
        }
      }

      if (!articleExcerpt) {
        articleExcerpt =
          `Baca berita lengkap "${articleTitle}" melalui ${SITE_DOMAIN}.`;
      }

      // ======================================================
      // IMAGE
      //
      // Gunakan URL ASLI Sanity.
      // Jangan resize / convert format di URL metadata.
      // ======================================================

      if (article.imageUrl) {
        imageUrl =
          normalizeImageUrl(
            article.imageUrl
          );
      }
    }
  } catch (error) {
    console.error(
      'BMA NEWS METADATA ERROR:',
      error
    );
  }

  // ==========================================================
  // METADATA
  // ==========================================================

  return {
    metadataBase: new URL(SITE_URL),

    title: articleTitle,

    description: articleExcerpt,

    alternates: {
      canonical: pageUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },

    // ========================================================
    // OPEN GRAPH
    //
    // Sengaja TIDAK menentukan:
    // width
    // height
    // type
    //
    // WhatsApp membaca asset asli.
    // ========================================================

    openGraph: {
      type: 'article',

      url: pageUrl,

      siteName: SITE_NAME,

      locale: 'id_ID',

      title: articleTitle,

      description: articleExcerpt,

      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          alt: articleTitle,
        },
      ],
    },

    // ========================================================
    // TWITTER / X
    // ========================================================

    twitter: {
      card: 'summary_large_image',

      title: articleTitle,

      description: articleExcerpt,

      images: [
        imageUrl,
      ],
    },

    // ========================================================
    // EXTRA META
    // ========================================================

    other: {
      'og:image:secure_url':
        imageUrl,

      'twitter:image':
        imageUrl,
    },
  };
}

// ============================================================
// SERVER COMPONENT ENTRY
// ============================================================

export default async function NewsDetailPage({
  params,
}: Props) {
  const { slug } = await params;

  const cleanSlug =
    decodeURIComponent(slug).trim();

  return (
    <BlogDetailClient
      slug={cleanSlug}
    />
  );
}