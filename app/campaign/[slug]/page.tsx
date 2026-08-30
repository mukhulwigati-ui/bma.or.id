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
// IDENTITAS BMA
// ============================================================

const SITE_URL =
  (
    process.env
      .NEXT_PUBLIC_SITE_URL ||
    'https://www.bma.or.id'
  ).replace(/\/$/, '');

const SITE_NAME =
  'Baitul Maal Al Muttaqin';

const SITE_DOMAIN =
  'bma.or.id';

// ============================================================
// SANITY BMA
//
// Project ID dikunci ke project BMA agar tidak tertukar lagi
// dengan BDB / Islami / project lama.
// ============================================================

const SANITY_PROJECT_ID =
  'im4qx3kd';

const SANITY_DATASET =
  'production';

// ============================================================
// SANITY CLIENT KHUSUS METADATA
//
// Published data tidak perlu token.
// Ini justru lebih aman untuk metadata publik.
// ============================================================

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
// HELPERS
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

function normalizeImageUrl(
  value:
    | string
    | null
    | undefined
): string {
  const fallback =
    `${SITE_URL}/images/banner.png`;

  if (
    !value ||
    typeof value !==
      'string'
  ) {
    return fallback;
  }

  let image =
    value.trim();

  if (!image) {
    return fallback;
  }

  // ==========================================================
  // ABSOLUTE URL
  // ==========================================================

  if (
    image.startsWith('/')
  ) {
    image =
      `${SITE_URL}${image}`;
  } else if (
    !image.startsWith(
      'http://'
    ) &&
    !image.startsWith(
      'https://'
    )
  ) {
    image =
      `${SITE_URL}/${image}`;
  }

  // ==========================================================
  // SANITY IMAGE
  //
  // WhatsApp lebih aman jika menerima gambar JPEG,
  // ukuran cukup besar, dan URL sederhana.
  // ==========================================================

  if (
    image.includes(
      'cdn.sanity.io/images/'
    )
  ) {
    const separator =
      image.includes('?')
        ? '&'
        : '?';

    image =
      `${image}${separator}` +
      `w=1200` +
      `&h=630` +
      `&fit=crop` +
      `&auto=format`;
  }

  return image;
}

// ============================================================
// METADATA
// ============================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const decodedSlug =
    decodeURIComponent(
      slug
    ).trim();

  // ==========================================================
  // DEFAULT / FALLBACK BMA
  // ==========================================================

  let title =
    `Program Donasi | ${SITE_NAME}`;

  let description =
    'Salurkan zakat, infak, sedekah, wakaf, dan donasi melalui Baitul Maal Al Muttaqin.';

  let image =
    `${SITE_URL}/images/banner.png`;

  // ==========================================================
  // FETCH CAMPAIGN SANITY BMA
  // ==========================================================

  try {
    const query = `
      *[
        _type in [
          "program",
          "campaign"
        ] &&
        slug.current == $slug
      ][0] {
        _id,

        title,

        excerpt,

        description,

        content,

        "image":
          coalesce(
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

    console.log(
      '======================================'
    );

    console.log(
      '✅ BMA CAMPAIGN METADATA'
    );

    console.log(
      'PROJECT:',
      SANITY_PROJECT_ID
    );

    console.log(
      'SLUG:',
      decodedSlug
    );

    console.log(
      'FOUND:',
      Boolean(campaign)
    );

    console.log(
      'IMAGE:',
      campaign?.image ||
        'NO IMAGE'
    );

    console.log(
      '======================================'
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

    // ========================================================
    // DESCRIPTION
    // ========================================================

    const descriptionSource =
      campaign?.excerpt ||
      campaign?.description ||
      campaign?.content;

    const plainDescription =
      portableTextToPlainText(
        descriptionSource
      );

    if (
      plainDescription
    ) {
      description =
        plainDescription
          .slice(
            0,
            160
          )
          .trim();
    }

    // ========================================================
    // IMAGE
    // ========================================================

    if (
      campaign?.image
    ) {
      image =
        normalizeImageUrl(
          campaign.image
        );
    }
  } catch (
    error
  ) {
    console.error(
      '🔥 BMA CAMPAIGN METADATA ERROR:',
      error
    );
  }

  // ==========================================================
  // FINAL URL
  // ==========================================================

  const pageUrl =
    `${SITE_URL}` +
    `/campaign/` +
    `${encodeURIComponent(
      decodedSlug
    )}`;

  // ==========================================================
  // METADATA RESULT
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
      },
    },

    // ========================================================
    // OPEN GRAPH
    //
    // Ini yang dibaca WhatsApp / Facebook
    // ========================================================

    openGraph: {
      type:
        'website',

      url:
        pageUrl,

      siteName:
        SITE_NAME,

      locale:
        'id_ID',

      title,

      description,

      images: [
        {
          url:
            image,

          secureUrl:
            image,

          width:
            1200,

          height:
            630,

          alt:
            title,

          type:
            'image/jpeg',
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
        image,
      ],
    },

    // ========================================================
    // EXTRA META
    //
    // Membantu crawler tertentu.
    // ========================================================

    other: {
      'og:site_name':
        SITE_NAME,

      'og:image':
        image,

      'og:image:secure_url':
        image,

      'og:image:width':
        '1200',

      'og:image:height':
        '630',

      'og:image:type':
        'image/jpeg',
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
  const {
    slug,
  } = await params;

  const {
    ref,
  } = await searchParams;

  return (
    <CampaignDetailClient
      slug={slug}
      referral={
        ref ?? null
      }
    />
  );
}