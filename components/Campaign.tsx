// components/Campaign.tsx
'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import {
  ArrowRight,
  Clock3,
  HeartHandshake,
  Loader2,
  RefreshCw,
  Users,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

type SectionType =
  | 'mendesak'
  | 'unggulan'
  | 'pilihan'
  | '';

interface CampaignItem {
  id: string;
  _id?: string;

  title: string;
  slug: string;
  image: string;

  category?: string;
  sectionType?: SectionType;

  collectedAmount?: number;
  collectedRaw?: number;

  targetAmount?: number;
  targetRaw?: number;

  daysLeft?: number;

  donorsCount?: number;
  donors?: unknown[];
}

interface CampaignProps {
  initialData?: CampaignItem[];

  mendesak?: CampaignItem[];
  unggulan?: CampaignItem[];
  pilihan?: CampaignItem[];
}

interface ApiResponse {
  success?: boolean;
  data?: unknown[];
  error?: string;
}

// ============================================================
// HELPERS
// ============================================================

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null
  );
}

function getNumber(
  value: unknown,
  fallback = 0
): number {
  const result =
    Number(value);

  return Number.isFinite(result)
    ? result
    : fallback;
}

function formatRupiah(
  value: number
): string {
  return Number(
    value || 0
  ).toLocaleString('id-ID');
}

function normalizeSectionType(
  value: unknown
): SectionType {
  if (
    typeof value !== 'string'
  ) {
    return '';
  }

  const section =
    value
      .trim()
      .toLowerCase();

  if (
    section === 'mendesak'
  ) {
    return 'mendesak';
  }

  if (
    section === 'unggulan'
  ) {
    return 'unggulan';
  }

  if (
    section === 'pilihan'
  ) {
    return 'pilihan';
  }

  return '';
}

function getCollected(
  item: CampaignItem
): number {
  return Math.max(
    0,
    getNumber(
      item.collectedAmount ??
        item.collectedRaw,
      0
    )
  );
}

function getTarget(
  item: CampaignItem
): number {
  const target =
    getNumber(
      item.targetAmount ??
        item.targetRaw,
      50000000
    );

  return target > 0
    ? target
    : 50000000;
}

function getPercentage(
  item: CampaignItem
): number {
  const collected =
    getCollected(item);

  const target =
    getTarget(item);

  if (
    collected <= 0 ||
    target <= 0
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (collected /
          target) *
          100
      )
    )
  );
}

function getDonorsCount(
  item: CampaignItem
): number {
  const explicit =
    getNumber(
      item.donorsCount,
      0
    );

  if (explicit > 0) {
    return explicit;
  }

  if (
    Array.isArray(
      item.donors
    )
  ) {
    return item.donors.length;
  }

  return 0;
}

function getImage(
  image?: string
): string {
  if (
    typeof image === 'string' &&
    image.trim()
  ) {
    return image.trim();
  }

  return '/images/banner.png';
}

// ============================================================
// NORMALIZER
// ============================================================

function normalizeCampaign(
  raw: unknown
): CampaignItem | null {
  if (
    !isRecord(raw)
  ) {
    return null;
  }

  const rawId =
    raw.id ??
    raw._id;

  const id =
    rawId !== undefined &&
    rawId !== null
      ? String(rawId)
      : '';

  let slug = '';

  if (
    typeof raw.slug ===
    'string'
  ) {
    slug =
      raw.slug.trim();
  } else if (
    isRecord(raw.slug) &&
    typeof raw.slug.current ===
      'string'
  ) {
    slug =
      raw.slug.current.trim();
  }

  const title =
    typeof raw.title ===
      'string'
      ? raw.title.trim()
      : '';

  if (
    !id ||
    !slug ||
    !title
  ) {
    return null;
  }

  let image = '';

  if (
    typeof raw.image ===
    'string'
  ) {
    image =
      raw.image;
  } else if (
    typeof raw.imageUrl ===
    'string'
  ) {
    image =
      raw.imageUrl;
  }

  let category = '';

  if (
    typeof raw.category ===
    'string'
  ) {
    category =
      raw.category.trim();
  } else if (
    isRecord(
      raw.category
    ) &&
    typeof raw.category.title ===
      'string'
  ) {
    category =
      raw.category.title.trim();
  }

  const donors =
    Array.isArray(
      raw.donors
    )
      ? raw.donors
      : [];

  return {
    id,

    _id:
      raw._id !== undefined &&
      raw._id !== null
        ? String(raw._id)
        : undefined,

    title,
    slug,

    image:
      getImage(image),

    category:
      category ||
      undefined,

    sectionType:
      normalizeSectionType(
        raw.sectionType
      ),

    collectedAmount:
      getNumber(
        raw.collectedAmount ??
          raw.collectedRaw,
        0
      ),

    collectedRaw:
      getNumber(
        raw.collectedRaw ??
          raw.collectedAmount,
        0
      ),

    targetAmount:
      getNumber(
        raw.targetAmount ??
          raw.targetRaw,
        50000000
      ),

    targetRaw:
      getNumber(
        raw.targetRaw ??
          raw.targetAmount,
        50000000
      ),

    daysLeft:
      raw.daysLeft !==
        undefined &&
      raw.daysLeft !== null
        ? getNumber(
            raw.daysLeft,
            0
          )
        : undefined,

    donorsCount:
      raw.donorsCount !==
        undefined &&
      raw.donorsCount !== null
        ? getNumber(
            raw.donorsCount,
            0
          )
        : donors.length,

    donors,
  };
}

function normalizeCampaignList(
  items: readonly unknown[]
): CampaignItem[] {
  const result:
    CampaignItem[] = [];

  for (
    const rawItem of items
  ) {
    const normalized =
      normalizeCampaign(
        rawItem
      );

    if (normalized) {
      result.push(
        normalized
      );
    }
  }

  return result;
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">

      <div className="flex items-end justify-between gap-3">

        <div className="min-w-0">

          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#777777]">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-[21px] font-bold leading-tight tracking-tight text-[#414141]">
            {title}
          </h2>

        </div>

        <Link
          href="/program"
          className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-[#666666] transition hover:text-[#333333]"
        >
          Lihat Semua

          <ArrowRight className="h-4 w-4" />
        </Link>

      </div>

      <p className="max-w-[92%] text-[13px] leading-[1.65] text-[#737373]">
        {description}
      </p>

    </div>
  );
}

// ============================================================
// PROGRESS
// ============================================================

function ProgressBar({
  percentage,
}: {
  percentage: number;
}) {
  return (
    <div className="h-2 w-full overflow-hidden bg-[#dddddd]">

      <div
        className="h-full bg-[#d9232e] transition-all duration-500"
        style={{
          width:
            `${percentage}%`,
        }}
      />

    </div>
  );
}

// ============================================================
// FEATURED CARD
// ============================================================

function FeaturedCampaignCard({
  item,
  urgent = false,
}: {
  item: CampaignItem;
  urgent?: boolean;
}) {
  const collected =
    getCollected(item);

  const target =
    getTarget(item);

  const percentage =
    getPercentage(item);

  const donorCount =
    getDonorsCount(item);

  return (
    <Link
      href={`/campaign/${item.slug}`}
      className="group block border border-[#d3d3d3] bg-[#fafafa] p-3.5 transition hover:border-[#bdbdbd] hover:bg-white"
    >

      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#dddddd]">

        <img
          src={
            getImage(
              item.image
            )
          }
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
          onError={(
            event
          ) => {
            event.currentTarget.src =
              '/images/banner.png';
          }}
        />

        {urgent &&
          typeof item.daysLeft ===
            'number' &&
          item.daysLeft > 0 && (
            <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 bg-[#555555] px-2.5 py-1.5 text-[11px] font-bold text-white">

              <Clock3 className="h-3.5 w-3.5" />

              {item.daysLeft}{' '}
              hari lagi

            </div>
          )}

      </div>

      {/* CATEGORY + TITLE */}
      <div className="mt-3.5">

        {item.category && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.11em] text-[#888888]">
            {item.category}
          </p>
        )}

        <h3 className="line-clamp-2 min-h-[44px] text-[16px] font-bold leading-[1.4] text-[#494949] transition group-hover:text-[#292929]">
          {item.title}
        </h3>

      </div>

      {/* SUMMARY */}
      <div className="mt-4">

        <div className="mb-2.5 flex items-end justify-between gap-2">

          <div>

            <span className="block text-[11px] font-medium text-[#888888]">
              Terkumpul
            </span>

            <strong className="mt-0.5 block text-[14px] font-bold text-[#4b4b4b]">
              Rp{' '}
              {formatRupiah(
                collected
              )}
            </strong>

          </div>

          <div className="text-right">

            <span className="block text-[11px] font-medium text-[#888888]">
              Donatur
            </span>

            <span className="mt-0.5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#555555]">

              <Users className="h-4 w-4" />

              {donorCount}

            </span>

          </div>

        </div>

        <ProgressBar
          percentage={
            percentage
          }
        />

        <div className="mt-2 flex justify-between gap-2 text-[11px] text-[#888888]">

          <span className="font-medium">
            {percentage}% tercapai
          </span>

          <span className="truncate">
            Target Rp{' '}
            {formatRupiah(
              target
            )}
          </span>

        </div>

      </div>

    </Link>
  );
}

// ============================================================
// COMPACT CARD
// ============================================================

function CompactCampaignCard({
  item,
}: {
  item: CampaignItem;
}) {
  const collected =
    getCollected(item);

  const percentage =
    getPercentage(item);

  const donorCount =
    getDonorsCount(item);

  return (
    <Link
      href={`/campaign/${item.slug}`}
      className="group flex items-center gap-4 border-b border-[#dddddd] pb-4 transition last:border-b-0 last:pb-0"
    >

      {/* IMAGE */}
      <div className="aspect-[16/10] w-[125px] shrink-0 overflow-hidden bg-[#dedede] sm:w-[145px]">

        <img
          src={
            getImage(
              item.image
            )
          }
          alt={
            item.title
          }
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
          onError={(
            event
          ) => {
            event.currentTarget.src =
              '/images/banner.png';
          }}
        />

      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">

        {item.category && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#888888]">
            {item.category}
          </p>
        )}

        <h3 className="line-clamp-2 text-[15px] font-bold leading-[1.4] text-[#4b4b4b] transition group-hover:text-[#292929]">
          {item.title}
        </h3>

        <div className="mt-3">

          <div className="mb-2 flex items-center justify-between gap-3">

            <strong className="text-[13px] font-bold text-[#4d4d4d]">
              Rp{' '}
              {formatRupiah(
                collected
              )}
            </strong>

            <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#777777]">

              <Users className="h-4 w-4" />

              {donorCount}

            </span>

          </div>

          <ProgressBar
            percentage={
              percentage
            }
          />

          <p className="mt-1.5 text-[11px] text-[#888888]">
            {percentage}% tercapai
          </p>

        </div>

      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-[#aaaaaa] transition group-hover:translate-x-0.5 group-hover:text-[#666666]" />

    </Link>
  );
}

// ============================================================
// MAIN
// ============================================================

export default function Campaign({
  initialData = [],
  mendesak = [],
  unggulan = [],
  pilihan = [],
}: CampaignProps) {
  const [
    apiPrograms,
    setApiPrograms,
  ] =
    useState<
      CampaignItem[]
    >([]);

  const [
    loadingApi,
    setLoadingApi,
  ] =
    useState(false);

  const [
    apiError,
    setApiError,
  ] =
    useState('');

  const normalizedInitial =
    useMemo(
      () =>
        normalizeCampaignList(
          initialData
        ),
      [initialData]
    );

  const normalizedMendesak =
    useMemo(
      () =>
        normalizeCampaignList(
          mendesak
        ),
      [mendesak]
    );

  const normalizedUnggulan =
    useMemo(
      () =>
        normalizeCampaignList(
          unggulan
        ),
      [unggulan]
    );

  const normalizedPilihan =
    useMemo(
      () =>
        normalizeCampaignList(
          pilihan
        ),
      [pilihan]
    );

  const hasSectionData =
    normalizedMendesak.length >
      0 ||
    normalizedUnggulan.length >
      0 ||
    normalizedPilihan.length >
      0;

  const hasAnyServerData =
    hasSectionData ||
    normalizedInitial.length >
      0;

  // ==========================================================
  // FALLBACK API
  // ==========================================================

  const fetchPrograms =
    async () => {
      try {
        setLoadingApi(true);
        setApiError('');

        const response =
          await fetch(
            `/api/programs?v=${Date.now()}`,
            {
              cache:
                'no-store',

              headers: {
                Accept:
                  'application/json',

                'Cache-Control':
                  'no-cache, no-store, must-revalidate',

                Pragma:
                  'no-cache',
              },
            }
          );

        const rawJson:
          unknown =
          await response.json();

        let json:
          ApiResponse = {};

        if (
          isRecord(
            rawJson
          )
        ) {
          json = {
            success:
              typeof rawJson.success ===
              'boolean'
                ? rawJson.success
                : undefined,

            data:
              Array.isArray(
                rawJson.data
              )
                ? rawJson.data
                : undefined,

            error:
              typeof rawJson.error ===
              'string'
                ? rawJson.error
                : undefined,
          };
        }

        if (
          !response.ok
        ) {
          throw new Error(
            json.error ||
              'Gagal mengambil program.'
          );
        }

        const rawData:
          unknown[] =
          Array.isArray(
            json.data
          )
            ? json.data
            : Array.isArray(
                rawJson
              )
            ? rawJson
            : [];

        setApiPrograms(
          normalizeCampaignList(
            rawData
          )
        );

      } catch (
        error: unknown
      ) {
        console.error(
          'Campaign API error:',
          error
        );

        setApiPrograms([]);

        setApiError(
          error instanceof Error
            ? error.message
            : 'Gagal memuat program.'
        );
      } finally {
        setLoadingApi(false);
      }
    };

  useEffect(() => {
    if (
      !hasAnyServerData
    ) {
      void fetchPrograms();
    }
  }, [
    hasAnyServerData,
  ]);

  // ==========================================================
  // STRICT SECTION TYPE
  // ==========================================================

  const apiMendesak =
    useMemo(
      () =>
        apiPrograms.filter(
          (
            item:
              CampaignItem
          ) =>
            item.sectionType ===
            'mendesak'
        ),
      [apiPrograms]
    );

  const apiUnggulan =
    useMemo(
      () =>
        apiPrograms.filter(
          (
            item:
              CampaignItem
          ) =>
            item.sectionType ===
            'unggulan'
        ),
      [apiPrograms]
    );

  const apiPilihan =
    useMemo(
      () =>
        apiPrograms.filter(
          (
            item:
              CampaignItem
          ) =>
            item.sectionType ===
            'pilihan'
        ),
      [apiPrograms]
    );

  const finalMendesak =
    normalizedMendesak.length >
    0
      ? normalizedMendesak
      : apiMendesak;

  const finalUnggulan =
    normalizedUnggulan.length >
    0
      ? normalizedUnggulan
      : apiUnggulan;

  const finalPilihan =
    normalizedPilihan.length >
    0
      ? normalizedPilihan
      : apiPilihan;

  // ==========================================================
  // INITIAL DATA
  // ==========================================================

  if (
    normalizedInitial.length >
      0 &&
    !hasSectionData
  ) {
    return (
      <section className="w-full space-y-5 text-left">

        <div className="border-b border-[#d5d5d5] pb-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#d0d0d0] bg-[#e5e5e5]">

              <HeartHandshake className="h-5 w-5 text-[#666666]" />

            </div>

            <div>

              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#777777]">
                Program Kebaikan
              </p>

              <h2 className="mt-1 text-[21px] font-bold tracking-tight text-[#414141]">
                Daftar Program
              </h2>

            </div>

          </div>

        </div>

        <div className="space-y-4">

          {normalizedInitial.map(
            (
              item:
                CampaignItem
            ) => (
              <CompactCampaignCard
                key={
                  item.id
                }
                item={
                  item
                }
              />
            )
          )}

        </div>

      </section>
    );
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    !hasAnyServerData &&
    loadingApi
  ) {
    return (
      <section className="w-full border border-[#d5d5d5] bg-[#e7e7e7] px-5 py-10 text-center">

        <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#777777]" />

        <p className="mt-3 text-[13px] font-bold text-[#555555]">
          Memuat Program BMA...
        </p>

      </section>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    !hasAnyServerData &&
    apiError &&
    apiPrograms.length ===
      0
  ) {
    return (
      <section className="w-full border border-[#d5d5d5] bg-[#e7e7e7] px-5 py-10 text-center">

        <HeartHandshake className="mx-auto h-8 w-8 text-[#888888]" />

        <p className="mt-3 text-[15px] font-bold text-[#555555]">
          Program gagal dimuat
        </p>

        <p className="mt-2 text-[12px] leading-relaxed text-[#777777]">
          {apiError}
        </p>

        <button
          type="button"
          onClick={() => {
            void fetchPrograms();
          }}
          className="mt-5 inline-flex items-center gap-2 border border-[#c5c5c5] bg-white px-5 py-3 text-[12px] font-bold text-[#555555]"
        >
          <RefreshCw className="h-4 w-4" />

          Muat Ulang
        </button>

      </section>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (
    finalMendesak.length ===
      0 &&
    finalUnggulan.length ===
      0 &&
    finalPilihan.length ===
      0
  ) {
    return (
      <section className="w-full border border-[#d5d5d5] bg-[#e7e7e7] px-5 py-10 text-center">

        <HeartHandshake className="mx-auto h-8 w-8 text-[#888888]" />

        <p className="mt-3 text-[15px] font-bold text-[#555555]">
          Belum Ada Program
        </p>

        <p className="mt-2 text-[12px] leading-relaxed text-[#777777]">
          Pastikan program di Sanity memiliki kategori mendesak, unggulan, atau pilihan.
        </p>

      </section>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full space-y-7 text-left">

      {/* MENDESAK */}
      {finalMendesak.length >
        0 && (
        <section className="space-y-5 border border-[#d8d8d8] bg-white p-5 shadow-[0_3px_12px_rgba(0,0,0,0.025)]">

          <SectionHeader
            eyebrow="Butuh Dukungan Segera"
            title="Penggalangan Dana Mendesak"
            description="Bantu program yang membutuhkan dukungan segera agar manfaat dapat tersalurkan lebih cepat."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {finalMendesak.map(
              (
                item:
                  CampaignItem
              ) => (
                <FeaturedCampaignCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  urgent
                />
              )
            )}

          </div>

        </section>
      )}

      {/* UNGGULAN */}
      {finalUnggulan.length >
        0 && (
        <section className="space-y-5 border border-[#d8d8d8] bg-white p-5 shadow-[0_3px_12px_rgba(0,0,0,0.025)]">

          <SectionHeader
            eyebrow="Rekomendasi Program"
            title="Program Unggulan"
            description="Program unggulan Baitul Maal Al Muttaqin yang dapat Anda dukung."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {finalUnggulan.map(
              (
                item:
                  CampaignItem
              ) => (
                <FeaturedCampaignCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                />
              )
            )}

          </div>

        </section>
      )}

      {/* PILIHAN */}
      {finalPilihan.length >
        0 && (
        <section className="space-y-5 border border-[#d8d8d8] bg-white p-5 shadow-[0_3px_12px_rgba(0,0,0,0.025)]">

          <SectionHeader
            eyebrow="Pilihan Kebaikan"
            title="Program Pilihan"
            description="Program pilihan untuk menemani langkah kebaikan Anda bersama Baitul Maal Al Muttaqin."
          />

          <div className="space-y-4">

            {finalPilihan.map(
              (
                item:
                  CampaignItem
              ) => (
                <CompactCampaignCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                />
              )
            )}

          </div>

        </section>
      )}

    </div>
  );
}