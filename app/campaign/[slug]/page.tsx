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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================================
// IDENTITAS WEBSITE BMA
// ============================================================
//
// PENTING:
// Pakai SATU domain canonical saja.
// Kita gunakan non-WWW karena link yang dibagikan memang bma.or.id.
//
// Vercel:
// NEXT_PUBLIC_SITE_URL=https://bma.or.id
// ============================================================

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://bma.or.id'
).replace(/\/$/, '');

const SITE_NAME = 'Baitul Maal Al Muttaqin';

// ============================================================
// SANITY BMA
// ============================================================

const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'im4qx3kd';

const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

// ============================================================
// SANITY PUBLIC CLIENT
//
// Metadata hanya membaca published document.
// Tidak perlu SANITY write token.
// ============================================================

const sanityMetaClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,

  apiVersion: '2026-08-01',

  useCdn: false,

  perspective: 'published',
});

// ============================================================
// PORTABLE TEXT → PLAIN TEXT
// ============================================================

function portableTextToPlainText(
  value: any
): string {
  if (!value) {
    return '';
  }

  // ==========================================================
  // STRING / HTML
  // ==========================================================

  if (typeof value === 'string') {
    return value
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ==========================================================
  // SANITY PORTABLE TEXT
  // ==========================================================

  if (Array.isArray(value)) {
    return value
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

  return '';
}

// ============================================================
// NORMALISASI DESCRIPTION
// ============================================================

function normalizeDescription(
  value: string,
  fallback: string
): string {
  const result = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!result) {
    return fallback;
  }

  // Hindari deskripsi terlalu panjang untuk social crawler
  if (result.length <= 155) {
    return result;
  }

  return `${result.slice(0, 152).trim()}...`;
}

// ============================================================
// NORMALISASI URL IMAGE
// ============================================================
//
// PENTING UNTUK WHATSAPP:
//
// JANGAN gunakan:
//
// &auto=format
//
// karena Sanity bisa mengembalikan WebP / AVIF tergantung User-Agent.
//
// Kita paksa:
//
// fm=jpg
// w=1200
// h=630
// fit=crop
// q=85
//
// Sehingga Content-Type benar-benar JPEG.
// ============================================================

function normalizeImageUrl(
  value:
    | string
    | null
    | undefined
): string {
  // ==========================================================
  // FALLBACK
  // ==========================================================

  const fallback =
    `${SITE_URL}/images/banner.png`;

  if (
    !value ||
    typeof value !== 'string'
  ) {
    return fallback;
  }

  let image = value.trim();

  if (!image) {
    return fallback;
  }

  // ==========================================================
  // BUAT ABSOLUTE URL
  // ==========================================================

  if (image.startsWith('/')) {
    image =
      `${SITE_URL}${image}`;
  } else if (
    !image.startsWith('http://') &&
    !image.startsWith('https://')
  ) {
    image =
      `${SITE_URL}/${image}`;
  }

  // ==========================================================
  // KHUSUS SANITY CDN
  // ==========================================================

  if (
    image.includes(
      'cdn.sanity.io/images/'
    )
  ) {
    // Hapus parameter lama lebih dulu agar URL bersih.
    const baseImage =
      image.split('?')[0];

    image =
      `${baseImage}` +
      `?w=1200` +
      `&h=630` +
      `&fit=crop` +
      `&fm=jpg` +
      `&q=85`;
  }

  return image;
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
  // ==========================================================
  // SLUG
  // ==========================================================

  const { slug } = await params;

  const decodedSlug =
    decodeURIComponent(slug).trim();

  // ==========================================================
  // DEFAULT METADATA
  // ==========================================================

  let title =
    `Program Donasi | ${SITE_NAME}`;

  let description =
    'Salurkan zakat, infak, sedekah, wakaf, dan donasi melalui Baitul Maal Al Muttaqin.';

  let image =
    `${SITE_URL}/images/banner.png`;

  // ==========================================================
  // FETCH SANITY
  // ==========================================================

  try {
    const query = `
      *[
        _type in ["program", "campaign"] &&
        slug.current == $slug
      ][0] {
        _id,

        title,

        excerpt,

        description,

        content,

        "imageUrl": coalesce(
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
          slug: decodedSlug,
        },

        {
          cache: 'no-store',
        }
      );

    // ========================================================
    // DEBUG SERVER
    // ========================================================

    console.log(
      '=============================================='
    );

    console.log(
      'BMA SOCIAL METADATA'
    );

    console.log(
      'Project ID:',
      SANITY_PROJECT_ID
    );

    console.log(
      'Dataset:',
      SANITY_DATASET
    );

    console.log(
      'Slug:',
      decodedSlug
    );

    console.log(
      'Campaign ditemukan:',
      Boolean(campaign)
    );

    console.log(
      'Image Sanity:',
      campaign?.imageUrl ||
        'TIDAK ADA'
    );

    console.log(
      '=============================================='
    );

    // ========================================================
    // TITLE
    // ========================================================

    if (
      campaign?.title &&
      typeof campaign.title === 'string'
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

    if (plainDescription) {
      description =
        normalizeDescription(
          plainDescription,
          description
        );
    }

    // ========================================================
    // IMAGE
    // ========================================================

    if (campaign?.imageUrl) {
      image =
        normalizeImageUrl(
          campaign.imageUrl
        );
    }
  } catch (error) {
    console.error(
      'BMA generateMetadata Sanity Error:',
      error
    );
  }

  // ==========================================================
  // CANONICAL PAGE URL
  // ==========================================================

  const pageUrl =
    `${SITE_URL}/campaign/${encodeURIComponent(
      decodedSlug
    )}`;

  // ==========================================================
  // FINAL DEBUG
  // ==========================================================

  console.log(
    'FINAL OG URL:',
    pageUrl
  );

  console.log(
    'FINAL OG IMAGE:',
    image
  );

  // ==========================================================
  // RETURN METADATA
  // ==========================================================

  return {
    // ========================================================
    // BASE
    // ========================================================

    metadataBase:
      new URL(SITE_URL),

    // ========================================================
    // BASIC SEO
    // ========================================================

    title,

    description,

    // ========================================================
    // CANONICAL
    // ========================================================

    alternates: {
      canonical: pageUrl,
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

        'max-snippet':
          -1,

        'max-video-preview':
          -1,
      },
    },

    // ========================================================
    // OPEN GRAPH
    //
    // Ini yang paling penting untuk:
    //
    // WhatsApp
    // Facebook
    // Messenger
    // Telegram
    // ========================================================

    openGraph: {
      type: 'website',

      url: pageUrl,

      siteName: SITE_NAME,

      locale: 'id_ID',

      title,

      description,

      images: [
        {
          url: image,

          secureUrl: image,

          width: 1200,

          height: 630,

          type: 'image/jpeg',

          alt: title,
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