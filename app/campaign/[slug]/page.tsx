// app/campaign/[slug]/page.tsx

import type { Metadata } from 'next';
import { headers } from 'next/headers';
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

interface ProgramData {
  _id?: string;
  _updatedAt?: string;
  slug?: string;
  title?: string;
  description?: unknown;
  excerpt?: unknown;
  image?: string;
  [key: string]: any;
}

interface ProgramsApiResponse {
  success?: boolean;
  data?: ProgramData[];
}

function normalizeSlug(value: string): string {
  return decodeURIComponent(value).toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function getRequestBaseUrl(): Promise<string> {
  try {
    const headerList = await headers();
    const host = headerList.get('x-forwarded-host') || headerList.get('host');
    if (!host) return SITE_URL;
    const protocol =
      headerList.get('x-forwarded-proto') ||
      (host.includes('localhost') ? 'http' : 'https');
    return `${protocol}://${host}`;
  } catch {
    return SITE_URL;
  }
}

async function getProgram(requestedSlug: string): Promise<ProgramData | null> {
  try {
    const baseUrl = await getRequestBaseUrl();
    const response = await fetch(`${baseUrl}/api/programs?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return null;

    const json = (await response.json()) as ProgramsApiResponse;
    if (!json.success || !Array.isArray(json.data)) return null;

    const cleanParamSlug = normalizeSlug(requestedSlug);

    return json.data.find((program) => {
      const programSlug = String(program?.slug || '');
      const cleanDbSlug = programSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
      return (
        cleanDbSlug === cleanParamSlug ||
        programSlug === requestedSlug ||
        program?._id === requestedSlug
      );
    }) || null;
  } catch (error) {
    console.error('[Metadata] getProgram error:', error);
    return null;
  }
}

// ============================================================
// GENERATE METADATA
// ============================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();

  const DEFAULT_TITLE = `Program Donasi | ${SITE_NAME}`;
  const DEFAULT_DESCRIPTION =
    'Salurkan zakat, infak, sedekah, wakaf, dan donasi melalui Baitul Maal Al Muttaqin.';
  const DEFAULT_IMAGE = `${SITE_URL}/images/banner.png`;

  const program = await getProgram(decodedSlug);

  const title =
    program?.title && String(program.title).trim()
      ? String(program.title).trim()
      : DEFAULT_TITLE;

  const plainDescription = portableTextToPlainText(
    program?.excerpt || program?.description
  );

  const description = createDescription(
    plainDescription,
    DEFAULT_DESCRIPTION
  );

  const originalImage =
    program?.image &&
    typeof program.image === 'string' &&
    program.image.trim()
      ? program.image.trim()
      : DEFAULT_IMAGE;

  const socialImage = makeSocialImage(
    originalImage,
    program?._updatedAt
  );

  const canonicalUrl =
    `${SITE_URL}/campaign/${encodeURIComponent(decodedSlug)}`;

  console.log('[BMA Campaign OpenGraph]', {
    slug: decodedSlug,
    title,
    originalImage,
    socialImage,
  });

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: 'article',
      locale: 'id_ID',
      siteName: SITE_NAME,
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: socialImage,
          secureUrl: socialImage,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: program?.title || title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: socialImage,
          alt: program?.title || title,
        },
      ],
    },

    other: {
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:image:height': '630',
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