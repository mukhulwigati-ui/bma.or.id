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

// ============================================================
// NEXT.JS
// ============================================================

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

// ============================================================
// IDENTITAS WEBSITE
// ============================================================

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.bma.or.id'
).replace(/\/$/, '');

const SITE_NAME =
  'Baitul Maal Al Muttaqin';

// ============================================================
// SANITY BMA
// ============================================================

const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'im4qx3kd';

const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

const sanityMetaClient =
  createClient({
    projectId:
      SANITY_PROJECT_ID,

    dataset:
      SANITY_DATASET,

    apiVersion:
      '2026-08-01',

    useCdn:
      false,

    perspective:
      'published',
  });

// ============================================================
// PORTABLE TEXT → STRING
// ============================================================

function portableTextToPlainText(
  value: any
): string {
  if (!value) {
    return '';
  }

  if (
    typeof value ===
    'string'
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
// DESCRIPTION
// ============================================================

function createDescription(
  value: string,
  fallback: string
): string {
  const clean =
    String(value || '')
      .replace(
        /\s+/g,
        ' '
      )
      .trim();

  if (!clean) {
    return fallback;
  }

  if (
    clean.length <= 155
  ) {
    return clean;
  }

  return (
    clean
      .slice(0, 152)
      .trim() +
    '...'
  );
}

// ============================================================
// SOCIAL IMAGE
// ============================================================

function makeSocialImage(
  originalImage: string | undefined,
  updatedAt?: string
): string {
  const fallback = `${SITE_URL}/images/banner.png`;
  const source = String(originalImage || fallback).trim() || fallback;

  try {
    const url = new URL(
      source.startsWith('http://') || source.startsWith('https://')
        ? source
        : `${SITE_URL}${source.startsWith('/') ? '' : '/'}${source}`
    );

    if (
      url.hostname === 'cdn.sanity.io' ||
      url.hostname.endsWith('.sanity.io')
    ) {
      [
        'w', 'h', 'width', 'height',
        'q', 'quality',
        'fm', 'format',
        'fit', 'crop', 'rect'
      ].forEach((key) => url.searchParams.delete(key));

      url.searchParams.set('w', '1200');
      url.searchParams.set('h', '630');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('fm', 'jpg');
      url.searchParams.set('q', '70');
    }

    if (updatedAt) {
      const timestamp = new Date(updatedAt).getTime();
      if (!Number.isNaN(timestamp)) {
        url.searchParams.set('v', String(timestamp));
      }
    }

    return url.toString();
  } catch {
    return source;
  }
}

// ============================================================
// SHARE VERSION
// ============================================================

function createShareVersion(
  updatedAt?: string
): string {
  if (!updatedAt) {
    return '1';
  }

  const clean =
    updatedAt.replace(
      /[^0-9A-Za-z]/g,
      ''
    );

  return (
    clean.slice(
      0,
      40
    ) || '1'
  );
}

// ============================================================
// GENERATE METADATA
// ============================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } =
    await params;

  const decodedSlug =
    decodeURIComponent(
      slug
    ).trim();

  // ==========================================================
  // DEFAULT
  // ==========================================================

  let title =
    `Program Donasi | ${SITE_NAME}`;

  let description =
    'Salurkan zakat, infak, sedekah, wakaf, dan donasi melalui Baitul Maal Al Muttaqin.';

  let updatedAt =
    '1';

  let campaignImage =
    `${SITE_URL}/images/banner.png`;

  // ==========================================================
  // SANITY
  // ==========================================================

  try {
    const query = `
      *[
        _type in ["program", "campaign"] &&
        slug.current == $slug
      ][0] {
        _id,

        _updatedAt,

        title,

        excerpt,

        description,

        content,

        "image": coalesce(
          image.asset->url,
          mainImage.asset->url,
          thumbnail.asset->url,
          banner.asset->url
        )
      }
    `;

    const campaign =
      await sanityMetaClient.fetch(
        query,

        {
          slug:
            decodedSlug,
        },

        {
          cache:
            'no-store',
        }
      );

    // ========================================================
    // TITLE
    // ========================================================

    if (
      campaign?.title &&
      typeof campaign.title ===
        'string'
    ) {
      title =
        campaign.title.trim();
    }

    if (
      campaign?.image &&
      typeof campaign.image === 'string' &&
      campaign.image.trim()
    ) {
      campaignImage = campaign.image.trim();
    }

    // ========================================================
    // DESCRIPTION
    // ========================================================

    const source =
      campaign?.excerpt ||
      campaign?.description ||
      campaign?.content;

    const plainText =
      portableTextToPlainText(
        source
      );

    if (plainText) {
      description =
        createDescription(
          plainText,
          description
        );
    }

    // ========================================================
    // VERSION
    // ========================================================

    if (
      campaign?._updatedAt
    ) {
      updatedAt =
        createShareVersion(
          campaign._updatedAt
        );
    }

    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
      '=============================================='
    );

    console.log(
      'BMA CAMPAIGN METADATA'
    );

    console.log(
      'Slug:',
      decodedSlug
    );

    console.log(
      'Title:',
      title
    );

    console.log(
      'Updated:',
      updatedAt
    );

    console.log(
      '=============================================='
    );
  } catch (
    error
  ) {
    console.error(
      '🔥 BMA metadata error:',
      error
    );
  }

  // ==========================================================
  // PAGE URL
  // ==========================================================

  const pageUrl =
    `${SITE_URL}/campaign/${encodeURIComponent(
      decodedSlug
    )}`;

  // ==========================================================
  // OG IMAGE
  // ==========================================================
  // Sama seperti web BDB yang sudah bekerja:
  // gambar langsung dari Sanity, hanya dioptimasi untuk social preview.

  const ogImageUrl =
    makeSocialImage(
      campaignImage,
      updatedAt === '1' ? undefined : updatedAt
    );

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    metadataBase:
      new URL(
        SITE_URL
      ),

    // ========================================================
    // BASIC
    // ========================================================

    title,

    description,

    // ========================================================
    // CANONICAL
    // ========================================================

    alternates: {
      canonical:
        pageUrl,
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

        'max-snippet':
          -1,
      },
    },

    // ========================================================
    // OPEN GRAPH
    // ========================================================

    openGraph: {
      type:
        'website',

      url:
        pageUrl,

      title,

      description,

      siteName:
        SITE_NAME,

      locale:
        'id_ID',

      images: [
        {
          url:
            ogImageUrl,

          secureUrl:
            ogImageUrl,

          width:
            1200,

          height:
            630,

          type:
            'image/jpeg',

          alt:
            title,
        },
      ],
    },

    // ========================================================
    // X / TWITTER
    // ========================================================

    twitter: {
      card:
        'summary_large_image',

      title,

      description,

      images: [
        ogImageUrl,
      ],
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

  return (
    <CampaignDetailClient
      slug={slug}
      referral={
        ref ?? null
      }
    />
  );
}