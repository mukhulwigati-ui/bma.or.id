// app/campaign/[slug]/page.tsx

import type { Metadata } from 'next';
import { createClient } from '@sanity/client';

import CampaignDetailClient from '@/components/CampaignDetailClient';

// ============================================================
// TYPES
// ============================================================

interface Props {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    ref?: string;
    v?: string;
  }>;
}

interface CampaignMetadata {
  _id?: string;

  title?: string;

  slug?: string;

  description?: unknown;

  excerpt?: unknown;

  shortDescription?: unknown;

  imageUrl?: string;

  imageAlt?: string;

  publishedAt?: string;

  _updatedAt?: string;
}

// ============================================================
// IDENTITAS BMA
// ============================================================

const SITE_NAME =
  'Baitul Maal Al Muttaqin';

const SITE_URL =
  (
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.bma.or.id'
  ).replace(/\/$/, '');

const PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'im4qx3kd';

const DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

// ============================================================
// SANITY SERVER CLIENT
//
// Metadata mengambil data LANGSUNG dari Sanity.
// Tidak melalui /api/programs.
// ============================================================

const serverClient = createClient({
  projectId: PROJECT_ID,

  dataset: DATASET,

  apiVersion: '2026-08-01',

  useCdn: false,

  perspective: 'published',
});

// ============================================================
// NEXT.JS
// ============================================================

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

// ============================================================
// NORMALIZE SLUG
// ============================================================

function normalizeSlug(
  value: string
): string {
  try {
    return decodeURIComponent(
      value
    ).trim();
  } catch {
    return value.trim();
  }
}

// ============================================================
// PORTABLE TEXT -> PLAIN TEXT
// ============================================================

function portableTextToPlainText(
  value: unknown
): string {
  if (!value) {
    return '';
  }

  // ==========================================================
  // STRING / HTML
  // ==========================================================

  if (
    typeof value === 'string'
  ) {
    return value
      .replace(
        /<[^>]*>/g,
        ' '
      )
      .replace(
        /\s+/g,
        ' '
      )
      .trim();
  }

  // ==========================================================
  // PORTABLE TEXT
  // ==========================================================

  if (
    Array.isArray(value)
  ) {
    return value
      .filter(
        (block: any) =>
          block?._type ===
            'block' &&
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
      .replace(
        /\s+/g,
        ' '
      )
      .trim();
  }

  return '';
}

// ============================================================
// DESCRIPTION SEO
// ============================================================

function makeDescription(
  value: unknown,
  fallback: string,
  maxLength = 180
): string {
  const plainText =
    portableTextToPlainText(
      value
    );

  if (!plainText) {
    return fallback;
  }

  if (
    plainText.length <=
    maxLength
  ) {
    return plainText;
  }

  return `${plainText
    .slice(
      0,
      maxLength
    )
    .trimEnd()}...`;
}

// ============================================================
// NORMALIZE ORIGINAL IMAGE URL
// ============================================================

function normalizeImageUrl(
  value: unknown
): string {
  const fallback =
    `${SITE_URL}/images/banner.png`;

  if (
    typeof value !==
      'string' ||
    !value.trim()
  ) {
    return fallback;
  }

  const image =
    value.trim();

  if (
    image.startsWith(
      'https://'
    ) ||
    image.startsWith(
      'http://'
    )
  ) {
    return image;
  }

  return `${SITE_URL}${
    image.startsWith('/')
      ? ''
      : '/'
  }${image}`;
}

// ============================================================
// SOCIAL / WHATSAPP IMAGE
//
// PENTING:
//
// Gambar asli campaign TIDAK diubah.
//
// Jika sumber berasal dari Sanity:
//
// PNG/JPG asli
//        ↓
// Sanity Image CDN
//        ↓
// JPEG 1200x630
// quality 85
// fit crop
//
// Hasil ini HANYA digunakan untuk:
// - Open Graph
// - WhatsApp
// - Facebook
// - Twitter / X
//
// Gambar pada CampaignDetailClient tetap menggunakan file asli.
// ============================================================

function createSocialImageUrl(
  originalImage: string
): string {
  if (!originalImage) {
    return `${SITE_URL}/images/banner.png`;
  }

  // Hanya transform gambar Sanity.
  if (
    originalImage.includes(
      'cdn.sanity.io/images/'
    )
  ) {
    try {
      const url =
        new URL(
          originalImage
        );

      // --------------------------------------------------------
      // Format JPEG
      // --------------------------------------------------------

      url.searchParams.set(
        'fm',
        'jpg'
      );

      // --------------------------------------------------------
      // Ukuran standar social preview
      // --------------------------------------------------------

      url.searchParams.set(
        'w',
        '1200'
      );

      url.searchParams.set(
        'h',
        '630'
      );

      // --------------------------------------------------------
      // Crop proporsional
      // --------------------------------------------------------

      url.searchParams.set(
        'fit',
        'crop'
      );

      // --------------------------------------------------------
      // Kualitas cukup tinggi tetapi lebih ringan dari PNG
      // --------------------------------------------------------

      url.searchParams.set(
        'q',
        '85'
      );

      return url.toString();
    } catch {
      return originalImage;
    }
  }

  return originalImage;
}

// ============================================================
// FETCH CAMPAIGN DIRECT FROM SANITY
// ============================================================

async function getCampaignMetadata(
  slug: string
): Promise<CampaignMetadata | null> {
  if (!slug) {
    return null;
  }

  try {
    const campaign =
      await serverClient.fetch<
        CampaignMetadata | null
      >(
        `
          *[
            _type in ["program", "campaign"] &&
            defined(slug.current) &&
            lower(slug.current) == lower($slug)
          ][0] {

            _id,

            title,

            "slug":
              slug.current,

            description,

            excerpt,

            shortDescription,

            publishedAt,

            _updatedAt,

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
          cache:
            'no-store',
        }
      );

    return (
      campaign ||
      null
    );
  } catch (error) {
    console.error(
      '🔥 BMA CAMPAIGN METADATA FETCH ERROR:',
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
  const { slug } =
    await params;

  const cleanSlug =
    normalizeSlug(
      slug
    );

  // ==========================================================
  // CANONICAL
  // ==========================================================

  const canonicalUrl =
    `${SITE_URL}/campaign/${encodeURIComponent(
      cleanSlug
    )}`;

  // ==========================================================
  // FETCH SANITY
  // ==========================================================

  const campaign =
    await getCampaignMetadata(
      cleanSlug
    );

  // ==========================================================
  // TITLE
  // ==========================================================

  const title =
    typeof campaign?.title ===
      'string' &&
    campaign.title.trim()
      ? campaign.title.trim()
      : `Program Donasi | ${SITE_NAME}`;

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  const fallbackDescription =
    `Salurkan zakat, infak, sedekah, wakaf, dan donasi melalui ${SITE_NAME}.`;

  let description =
    '';

  if (
    campaign?.excerpt
  ) {
    description =
      makeDescription(
        campaign.excerpt,
        ''
      );
  }

  if (
    !description &&
    campaign?.shortDescription
  ) {
    description =
      makeDescription(
        campaign.shortDescription,
        ''
      );
  }

  if (
    !description &&
    campaign?.description
  ) {
    description =
      makeDescription(
        campaign.description,
        ''
      );
  }

  if (!description) {
    description =
      fallbackDescription;
  }

  // ==========================================================
  // ORIGINAL IMAGE
  //
  // Ini tetap URL asli dari Sanity.
  // ==========================================================

  const originalImage =
    normalizeImageUrl(
      campaign?.imageUrl
    );

  // ==========================================================
  // SOCIAL IMAGE
  //
  // Ini khusus WhatsApp / Facebook / Open Graph.
  // ==========================================================

  const socialImage =
    createSocialImageUrl(
      originalImage
    );

  const imageAlt =
    typeof campaign?.imageAlt ===
      'string' &&
    campaign.imageAlt.trim()
      ? campaign.imageAlt.trim()
      : title;

  // ==========================================================
  // DEBUG VERCEL
  // ==========================================================

  console.log(
    '========================================'
  );

  console.log(
    '💚 BMA CAMPAIGN METADATA'
  );

  console.log(
    'Slug:',
    cleanSlug
  );

  console.log(
    'Campaign found:',
    Boolean(
      campaign
    )
  );

  console.log(
    'Campaign ID:',
    campaign?._id ||
      'NOT FOUND'
  );

  console.log(
    'Title:',
    title
  );

  console.log(
    'Original Image:',
    originalImage
  );

  console.log(
    'Social OG Image:',
    socialImage
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
      new URL(
        SITE_URL
      ),

    title,

    description,

    // ========================================================
    // CANONICAL
    // ========================================================

    alternates: {
      canonical:
        canonicalUrl,
    },

    // ========================================================
    // ROBOTS
    // ========================================================

    robots: {
      index:
        true,

      follow:
        true,

      googleBot: {
        index:
          true,

        follow:
          true,

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

      title,

      description,

      url:
        canonicalUrl,

      siteName:
        SITE_NAME,

      locale:
        'id_ID',

      images: [
        {
          url:
            socialImage,

          secureUrl:
            socialImage,

          width:
            1200,

          height:
            630,

          type:
            'image/jpeg',

          alt:
            imageAlt,
        },
      ],

      ...(campaign?.publishedAt
        ? {
            publishedTime:
              campaign.publishedAt,
          }
        : {}),
    },

    // ========================================================
    // TWITTER / X
    // ========================================================

    twitter: {
      card:
        'summary_large_image',

      title,

      description,

      images: [
        {
          url:
            socialImage,

          alt:
            imageAlt,
        },
      ],
    },

    // ========================================================
    // TIDAK ADA metadata.other
    //
    // Next.js otomatis menghasilkan:
    //
    // property="og:image"
    // property="og:image:secure_url"
    // property="og:image:width"
    // property="og:image:height"
    // property="og:image:type"
    //
    // dari openGraph.images di atas.
    // ========================================================
  };
}

// ============================================================
// PAGE
// ============================================================

export default async function CampaignPage({
  params,
  searchParams,
}: Props) {
  const { slug } =
    await params;

  const { ref } =
    await searchParams;

  const cleanSlug =
    normalizeSlug(
      slug
    );

  return (
    <CampaignDetailClient
      slug={cleanSlug}
      referral={
        ref ?? null
      }
    />
  );
}