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

const SITE_DOMAIN =
  'www.bma.or.id';

const SITE_URL =
  'https://www.bma.or.id';

const PROJECT_ID =
  'im4qx3kd';

const DATASET =
  'production';

// ============================================================
// SANITY SERVER CLIENT
//
// Metadata campaign mengambil data LANGSUNG dari Sanity.
// Jangan melalui /api/programs.
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
// NORMALIZE IMAGE URL
//
// PENTING:
//
// Sanity:
// https://cdn.sanity.io/images/...
//
// diberikan LANGSUNG ke Open Graph.
//
// Jangan:
// - resize
// - crop
// - convert jpg
// - image builder
// - proxy
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
  // IMAGE
  //
  // ORIGINAL SANITY IMAGE
  // ==========================================================

  const imageUrl =
    normalizeImageUrl(
      campaign?.imageUrl
    );

  const imageAlt =
    typeof campaign?.imageAlt ===
      'string' &&
    campaign.imageAlt.trim()
      ? campaign.imageAlt.trim()
      : title;

  // ==========================================================
  // DEBUG VERCEL
  //
  // Bisa dilihat di Function Logs Vercel.
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
    //
    // Sama seperti pola NEWS yang berhasil di WhatsApp.
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

      title,

      description,

      images: [
        imageUrl,
      ],
    },

    // ========================================================
    // EXTRA SOCIAL META
    //
    // Kita samakan dengan NEWS yang sekarang sudah berhasil.
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