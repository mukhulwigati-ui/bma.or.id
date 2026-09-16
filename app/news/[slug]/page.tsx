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

interface NewsMetadata {
  title?: string;
  excerpt?: string;
  description?: string;
  summary?: string;
  content?: any[];
  publishedAt?: string;
  imageUrl?: string;
  imageAlt?: string;
}

// ============================================================
// IDENTITAS BMA
// ============================================================

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_DOMAIN = 'www.bma.or.id';
const SITE_URL = 'https://www.bma.or.id';

const PROJECT_ID = 'im4qx3kd';
const DATASET = 'production';

// ============================================================
// SANITY BMA - SERVER ONLY
// ============================================================

const serverClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-08-01',
  useCdn: false,
  perspective: 'published',
});

// ============================================================
// DYNAMIC / CACHE
// ============================================================

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================================
// NORMALIZE SLUG
// ============================================================

function normalizeSlug(value: string): string {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

// ============================================================
// PORTABLE TEXT -> PLAIN TEXT
// ============================================================

function portableTextToPlainText(
  content: unknown
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
        block?._type === 'block' &&
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
  value: unknown,
  maxLength = 180
): string {
  if (typeof value !== 'string') {
    return '';
  }

  const clean = value
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) {
    return '';
  }

  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean
    .slice(0, maxLength)
    .trimEnd()}...`;
}

// ============================================================
// NORMALIZE IMAGE
// ============================================================

function normalizeImageUrl(
  value: unknown
): string {
  const fallback =
    `${SITE_URL}/images/banner.png`;

  if (
    typeof value !== 'string' ||
    !value.trim()
  ) {
    return fallback;
  }

  const image = value.trim();

  // URL asli Sanity dipertahankan.
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
// FETCH ARTICLE UNTUK METADATA
//
// Metadata mengambil data LANGSUNG dari Sanity.
// Tidak melalui /api/news/[slug].
// ============================================================

async function getNewsMetadata(
  slug: string
): Promise<NewsMetadata | null> {
  if (!slug) {
    return null;
  }

  try {
    return await serverClient.fetch<
      NewsMetadata | null
    >(
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
            ),

          "imageAlt":
            coalesce(
              image.alt,
              mainImage.alt,
              thumbnail.alt,
              coverImage.alt,
              banner.alt,
              title
            )
        }
      `,
      {
        slug,
      },
      {
        cache: 'no-store',
      }
    );
  } catch (error) {
    console.error(
      '🔥 BMA NEWS METADATA FETCH ERROR:',
      error
    );

    return null;
  }
}

// ============================================================
// GENERATE METADATA
// ============================================================

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const cleanSlug =
    normalizeSlug(slug);

  const canonicalUrl =
    `${SITE_URL}/news/${encodeURIComponent(
      cleanSlug
    )}`;

  const article =
    await getNewsMetadata(
      cleanSlug
    );

  // ==========================================================
  // TITLE
  // ==========================================================

  const articleTitle =
    typeof article?.title === 'string' &&
    article.title.trim()
      ? article.title.trim()
      : `Berita | ${SITE_NAME}`;

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  let articleDescription = '';

  if (article?.excerpt) {
    articleDescription =
      makeExcerpt(article.excerpt);
  }

  if (
    !articleDescription &&
    article?.description
  ) {
    articleDescription =
      makeExcerpt(
        article.description
      );
  }

  if (
    !articleDescription &&
    article?.summary
  ) {
    articleDescription =
      makeExcerpt(
        article.summary
      );
  }

  if (!articleDescription) {
    const plainText =
      portableTextToPlainText(
        article?.content
      );

    articleDescription =
      makeExcerpt(
        plainText
      );
  }

  if (!articleDescription) {
    articleDescription =
      `Baca berita "${articleTitle}" selengkapnya melalui ${SITE_DOMAIN}.`;
  }

  // ==========================================================
  // IMAGE
  //
  // ORIGINAL SANITY IMAGE.
  // Tidak resize.
  // Tidak crop.
  // Tidak convert JPG/WEBP.
  // ==========================================================

  const imageUrl =
    normalizeImageUrl(
      article?.imageUrl
    );

  const imageAlt =
    typeof article?.imageAlt === 'string' &&
    article.imageAlt.trim()
      ? article.imageAlt.trim()
      : articleTitle;

  // ==========================================================
  // DEBUG VERCEL
  // ==========================================================

  console.log(
    '========================================'
  );

  console.log(
    '📰 BMA NEWS METADATA'
  );

  console.log(
    'Slug:',
    cleanSlug
  );

  console.log(
    'Article found:',
    Boolean(article)
  );

  console.log(
    'Title:',
    articleTitle
  );

  console.log(
    'OG Image:',
    imageUrl
  );

  console.log(
    'Canonical:',
    canonicalUrl
  );

  console.log(
    '========================================'
  );

  // ==========================================================
  // METADATA
  // ==========================================================

  return {
    metadataBase:
      new URL(SITE_URL),

    title:
      articleTitle,

    description:
      articleDescription,

    alternates: {
      canonical:
        canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        'max-image-preview':
          'large',
      },
    },

    // ========================================================
    // OPEN GRAPH
    // ========================================================

    openGraph: {
      type:
        'article',

      title:
        articleTitle,

      description:
        articleDescription,

      url:
        canonicalUrl,

      siteName:
        SITE_NAME,

      locale:
        'id_ID',

      publishedTime:
        article?.publishedAt ||
        undefined,

      images: [
        {
          url:
            imageUrl,

          secureUrl:
            imageUrl,

          alt:
            imageAlt,
        },
      ],
    },

    // ========================================================
    // TWITTER / X
    // ========================================================

    twitter: {
      card:
        'summary_large_image',

      title:
        articleTitle,

      description:
        articleDescription,

      images: [
        imageUrl,
      ],
    },

    // ========================================================
    // META TAMBAHAN
    // ========================================================

    other: {
      'og:image':
        imageUrl,

      'og:image:url':
        imageUrl,

      'og:image:secure_url':
        imageUrl,

      'twitter:image':
        imageUrl,
    },
  };
}

// ============================================================
// SERVER COMPONENT
// ============================================================

export default async function NewsDetailPage({
  params,
}: Props) {
  const { slug } = await params;

  const cleanSlug =
    normalizeSlug(slug);

  return (
    <BlogDetailClient
      slug={cleanSlug}
    />
  );
}