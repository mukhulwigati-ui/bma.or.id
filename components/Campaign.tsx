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

interface CampaignItem {
  id: string;
  _id?: string;

  title: string;
  slug: string;
  image: string;

  category?: string;

  sectionType?:
    | 'mendesak'
    | 'unggulan'
    | 'pilihan'
    | string;

  collectedAmount?: number;
  collectedRaw?: number;

  targetAmount?: number;
  targetRaw?: number;

  daysLeft?: number;

  donorsCount?: number;
  donors?: any[];
}

interface CampaignProps {
  initialData?: CampaignItem[];

  mendesak?: CampaignItem[];
  unggulan?: CampaignItem[];
  pilihan?: CampaignItem[];
}

// ============================================================
// HELPERS
// ============================================================

function getCollected(
  item: CampaignItem
): number {
  return Math.max(
    0,
    Number(
      item.collectedAmount ??
        item.collectedRaw ??
        0
    ) || 0
  );
}

function getTarget(
  item: CampaignItem
): number {
  const target =
    Number(
      item.targetAmount ??
        item.targetRaw ??
        50000000
    ) || 50000000;

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
    Math.max(
      Math.round(
        (collected / target) *
          100
      ),
      0
    ),
    100
  );
}

function getDonorsCount(
  item: CampaignItem
): number {
  const explicit =
    Number(
      item.donorsCount ?? 0
    ) || 0;

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

function formatRupiah(
  value: number
): string {
  return Number(
    value || 0
  ).toLocaleString('id-ID');
}

function getImage(
  image?: string
): string {
  if (
    typeof image ===
      'string' &&
    image.trim()
  ) {
    return image.trim();
  }

  return '/images/banner.png';
}

function normalizeSectionType(
  value: unknown
): string {
  if (
    typeof value !==
    'string'
  ) {
    return '';
  }

  return value
    .trim()
    .toLowerCase();
}

// ============================================================
// NORMALIZE CAMPAIGN
// ============================================================

function normalizeCampaign(
  item: any
): CampaignItem | null {
  if (!item) {
    return null;
  }

  const id =
    item.id ||
    item._id;

  const slug =
    typeof item.slug ===
      'string'
      ? item.slug
      : item.slug?.current;

  const title =
    typeof item.title ===
      'string'
      ? item.title.trim()
      : '';

  if (
    !id ||
    !slug ||
    !title
  ) {
    return null;
  }

  const rawImage =
    typeof item.image ===
      'string'
      ? item.image
      : typeof item.imageUrl ===
          'string'
      ? item.imageUrl
      : '';

  const rawCategory =
    typeof item.category ===
      'string'
      ? item.category
      : typeof item.category?.title ===
          'string'
      ? item.category.title
      : '';

  return {
    id:
      String(id),

    _id:
      item._id
        ? String(
            item._id
          )
        : undefined,

    title,

    slug:
      String(slug),

    image:
      getImage(
        rawImage
      ),

    category:
      rawCategory ||
      undefined,

    // ========================================================
    // PENTING:
    // Tidak ada fallback "pilihan".
    // Kalau kosong, tetap kosong.
    // ========================================================
    sectionType:
      normalizeSectionType(
        item.sectionType
      ),

    collectedAmount:
      Number(
        item.collectedAmount ??
          item.collectedRaw ??
          0
      ) || 0,

    collectedRaw:
      Number(
        item.collectedRaw ??
          item.collectedAmount ??
          0
      ) || 0,

    targetAmount:
      Number(
        item.targetAmount ??
          item.targetRaw ??
          50000000
      ) || 50000000,

    targetRaw:
      Number(
        item.targetRaw ??
          item.targetAmount ??
          50000000
      ) || 50000000,

    daysLeft:
      item.daysLeft !==
        undefined &&
      item.daysLeft !==
        null
        ? Number(
            item.daysLeft
          )
        : undefined,

    donorsCount:
      item.donorsCount !==
        undefined &&
      item.donorsCount !==
        null
        ? Number(
            item.donorsCount
          ) || 0
        : Array.isArray(
            item.donors
          )
        ? item.donors.length
        : 0,

    donors:
      Array.isArray(
        item.donors
      )
        ? item.donors
        : [],
  };
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
    <div className="space-y-2">

      <div className="flex items-end justify-between gap-3">

        <div className="min-w-0">

          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#8b8b8b]">
            {eyebrow}
          </p>

          <h2 className="mt-0.5 text-[17px] font-bold tracking-tight text-[#414141] sm:text-lg">
            {title}
          </h2>

        </div>

        <Link
          href="/program"
          className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-[#777777] transition hover:text-[#3f3f3f]"
        >
          Lihat Semua

          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

      </div>

      <p className="text-[10px] leading-relaxed text-[#888888] sm:text-xs">
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
    <div className="h-1.5 w-full overflow-hidden bg-[#dddddd]">

      <div
        className="h-full bg-[#d9232e] transition-all duration-500"
        style={{
          width: `${percentage}%`,
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
      className="group block border border-[#dddddd] bg-[#f7f7f7] p-3 transition hover:border-[#c5c5c5] hover:bg-white"
    >

      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#dddddd]">

        <img
          src={getImage(
            item.image
          )}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          onError={(
            e
          ) => {
            e.currentTarget.src =
              '/images/banner.png';
          }}
        />

        {urgent &&
          typeof item.daysLeft ===
            'number' &&
          item.daysLeft > 0 && (
            <div className="absolute left-2 top-2 flex items-center gap-1 bg-[#555555] px-2 py-1 text-[8px] font-bold text-white">

              <Clock3 className="h-3 w-3" />

              {item.daysLeft}{' '}
              hari lagi

            </div>
          )}

      </div>

      {/* CONTENT */}
      <div className="mt-3">

        {item.category && (
          <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#999999]">
            {item.category}
          </p>
        )}

        <h3 className="line-clamp-2 min-h-[34px] text-xs font-semibold leading-snug text-[#4c4c4c] transition group-hover:text-[#2f2f2f] sm:text-sm">
          {item.title}
        </h3>

      </div>

      {/* AMOUNT */}
      <div className="mt-3">

        <div className="mb-2 flex items-end justify-between gap-2">

          <div>

            <span className="block text-[8px] font-medium text-[#999999]">
              Terkumpul
            </span>

            <strong className="text-[11px] font-bold text-[#555555]">
              Rp{' '}
              {formatRupiah(
                collected
              )}
            </strong>

          </div>

          <div className="text-right">

            <span className="block text-[8px] text-[#999999]">
              Donatur
            </span>

            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#555555]">

              <Users className="h-3 w-3" />

              {donorCount}

            </span>

          </div>

        </div>

        <ProgressBar
          percentage={
            percentage
          }
        />

        <div className="mt-1.5 flex justify-between gap-2 text-[8px] text-[#999999]">

          <span>
            {percentage}%
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
      className="group flex items-center gap-3.5 border-b border-[#e1e1e1] pb-3.5 transition last:border-b-0 last:pb-0"
    >

      {/* IMAGE */}
      <div className="aspect-[16/10] w-28 shrink-0 overflow-hidden bg-[#dedede] sm:w-32">

        <img
          src={getImage(
            item.image
          )}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          onError={(
            e
          ) => {
            e.currentTarget.src =
              '/images/banner.png';
          }}
        />

      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">

        {item.category && (
          <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#999999]">
            {item.category}
          </p>
        )}

        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-[#505050] transition group-hover:text-[#303030] sm:text-sm">
          {item.title}
        </h3>

        <div className="mt-2.5">

          <div className="mb-1.5 flex items-center justify-between gap-3">

            <strong className="text-[11px] font-bold text-[#555555]">
              Rp{' '}
              {formatRupiah(
                collected
              )}
            </strong>

            <span className="flex items-center gap-1 text-[9px] text-[#888888]">

              <Users className="h-3 w-3" />

              {donorCount}

            </span>

          </div>

          <ProgressBar
            percentage={
              percentage
            }
          />

        </div>

      </div>

      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#bbbbbb] transition group-hover:translate-x-0.5 group-hover:text-[#777777]" />

    </Link>
  );
}

// ============================================================
// MAIN COMPONENT
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

  // ==========================================================
  // NORMALIZE PROPS
  // ==========================================================

  const normalizedInitial =
    useMemo(
      () =>
        initialData
          .map(
            normalizeCampaign
          )
          .filter(
            (
              item
            ): item is CampaignItem =>
              item !== null
          ),
      [initialData]
    );

  const normalizedMendesak =
    useMemo(
      () =>
        mendesak
          .map(
            normalizeCampaign
          )
          .filter(
            (
              item
            ): item is CampaignItem =>
              item !== null
          ),
      [mendesak]
    );

  const normalizedUnggulan =
    useMemo(
      () =>
        unggulan
          .map(
            normalizeCampaign
          )
          .filter(
            (
              item
            ): item is CampaignItem =>
              item !== null
          ),
      [unggulan]
    );

  const normalizedPilihan =
    useMemo(
      () =>
        pilihan
          .map(
            normalizeCampaign
          )
          .filter(
            (
              item
            ): item is CampaignItem =>
              item !== null
          ),
      [pilihan]
    );

  // ==========================================================
  // APAKAH SUDAH ADA DATA DARI SERVER?
  // ==========================================================

  const hasServerData =
    normalizedMendesak.length >
      0 ||
    normalizedUnggulan.length >
      0 ||
    normalizedPilihan.length >
      0 ||
    normalizedInitial.length >
      0;

  // ==========================================================
  // FALLBACK FETCH API
  // Hanya jika semua props kosong
  // ==========================================================

  const fetchPrograms =
    async () => {
      try {
        setLoadingApi(
          true
        );

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

        const json =
          await response.json();

        console.log(
          '📦 RESPONSE /api/programs:',
          json
        );

        if (
          !response.ok
        ) {
          throw new Error(
            json?.error ||
              'Gagal mengambil program.'
          );
        }

        const rawData =
          Array.isArray(
            json?.data
          )
            ? json.data
            : Array.isArray(
                json
              )
            ? json
            : [];

        const normalized =
          rawData
            .map(
              normalizeCampaign
            )
            .filter(
              (
                item
              ): item is CampaignItem =>
                item !== null
            );

        console.log(
          '✅ TOTAL PROGRAM TERBACA:',
          normalized.length
        );

        console.log(
          '🔥 MENDESAK:',
          normalized.filter(
            (item) =>
              normalizeSectionType(
                item.sectionType
              ) ===
              'mendesak'
          ).length
        );

        console.log(
          '⭐ UNGGULAN:',
          normalized.filter(
            (item) =>
              normalizeSectionType(
                item.sectionType
              ) ===
              'unggulan'
          ).length
        );

        console.log(
          '❤️ PILIHAN:',
          normalized.filter(
            (item) =>
              normalizeSectionType(
                item.sectionType
              ) ===
              'pilihan'
          ).length
        );

        setApiPrograms(
          normalized
        );
      } catch (
        error: any
      ) {
        console.error(
          '🔥 Campaign fetch error:',
          error
        );

        setApiPrograms(
          []
        );

        setApiError(
          error?.message ||
            'Gagal memuat program.'
        );
      } finally {
        setLoadingApi(
          false
        );
      }
    };

  useEffect(() => {
    if (
      !hasServerData
    ) {
      fetchPrograms();
    }
  }, [
    hasServerData,
  ]);

  // ==========================================================
  // STRICT FILTER DARI API
  //
  // HANYA sectionType:
  // - mendesak
  // - unggulan
  // - pilihan
  //
  // Yang kosong / lainnya TIDAK ditampilkan.
  // ==========================================================

  const apiMendesak =
    useMemo(
      () =>
        apiPrograms.filter(
          (item) =>
            normalizeSectionType(
              item.sectionType
            ) ===
            'mendesak'
        ),
      [apiPrograms]
    );

  const apiUnggulan =
    useMemo(
      () =>
        apiPrograms.filter(
          (item) =>
            normalizeSectionType(
              item.sectionType
            ) ===
            'unggulan'
        ),
      [apiPrograms]
    );

  const apiPilihan =
    useMemo(
      () =>
        apiPrograms.filter(
          (item) =>
            normalizeSectionType(
              item.sectionType
            ) ===
            'pilihan'
        ),
      [apiPrograms]
    );

  // ==========================================================
  // FINAL DATA
  // ==========================================================

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
  // INITIAL DATA MODE
  //
  // Hanya untuk halaman yang memang mengirim initialData.
  // Homepage tidak menggunakan mode ini bila 3 section tersedia.
  // ==========================================================

  if (
    normalizedInitial.length >
      0 &&
    finalMendesak.length ===
      0 &&
    finalUnggulan.length ===
      0 &&
    finalPilihan.length ===
      0
  ) {
    return (
      <section className="w-full space-y-4 text-left">

        <div className="border-b border-[#d5d5d5] pb-3">

          <div className="flex items-center gap-2.5">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#d0d0d0] bg-[#e5e5e5]">

              <HeartHandshake className="h-4 w-4 text-[#666666]" />

            </div>

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#888888]">
                Program Kebaikan
              </p>

              <h2 className="mt-0.5 text-[18px] font-bold tracking-tight text-[#414141]">
                Daftar Program
              </h2>

            </div>

          </div>

        </div>

        <div className="space-y-3">

          {normalizedInitial.map(
            (item) => (
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
    !hasServerData &&
    loadingApi
  ) {
    return (
      <section className="w-full border border-[#d5d5d5] bg-[#e7e7e7] px-5 py-8 text-center">

        <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#777777]" />

        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.13em] text-[#666666]">
          Memuat Program BMA
        </p>

      </section>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    !hasServerData &&
    apiError &&
    apiPrograms.length ===
      0
  ) {
    return (
      <section className="w-full border border-[#d5d5d5] bg-[#e7e7e7] px-5 py-8 text-center">

        <HeartHandshake className="mx-auto h-7 w-7 text-[#888888]" />

        <p className="mt-3 text-[11px] font-bold text-[#555555]">
          Program gagal dimuat
        </p>

        <p className="mt-1 text-[9px] leading-relaxed text-[#777777]">
          {apiError}
        </p>

        <button
          type="button"
          onClick={
            fetchPrograms
          }
          className="mt-4 inline-flex items-center gap-2 border border-[#c5c5c5] bg-white px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#555555]"
        >

          <RefreshCw className="h-3.5 w-3.5" />

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
      <section className="w-full border border-[#d5d5d5] bg-[#e7e7e7] px-5 py-8 text-center">

        <HeartHandshake className="mx-auto h-7 w-7 text-[#888888]" />

        <p className="mt-3 text-[11px] font-bold text-[#555555]">
          Belum Ada Program Homepage
        </p>

        <p className="mt-1 text-[9px] leading-relaxed text-[#777777]">
          Pastikan field sectionType di Sanity diisi dengan mendesak, unggulan, atau pilihan.
        </p>

      </section>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full space-y-6 text-left">

      {/* ======================================================
          MENDESAK
      ====================================================== */}

      {finalMendesak.length >
        0 && (
        <section className="space-y-4 border border-[#d8d8d8] bg-white p-4 shadow-[0_3px_12px_rgba(0,0,0,0.025)] sm:p-5">

          <SectionHeader
            eyebrow="Butuh Dukungan Segera"
            title="Penggalangan Dana Mendesak"
            description="Bantu program yang membutuhkan dukungan segera agar manfaat dapat tersalurkan lebih cepat."
          />

          <div className="grid grid-cols-1 gap-3.5 pt-1 sm:grid-cols-2">

            {finalMendesak.map(
              (item) => (
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

      {/* ======================================================
          UNGGULAN
      ====================================================== */}

      {finalUnggulan.length >
        0 && (
        <section className="space-y-4 border border-[#d8d8d8] bg-white p-4 shadow-[0_3px_12px_rgba(0,0,0,0.025)] sm:p-5">

          <SectionHeader
            eyebrow="Rekomendasi Program"
            title="Program Unggulan"
            description="Program unggulan Baitul Maal Al Muttaqin yang dapat Anda dukung."
          />

          <div className="grid grid-cols-1 gap-3.5 pt-1 sm:grid-cols-2">

            {finalUnggulan.map(
              (item) => (
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

      {/* ======================================================
          PILIHAN
      ====================================================== */}

      {finalPilihan.length >
        0 && (
        <section className="space-y-4 border border-[#d8d8d8] bg-white p-4 shadow-[0_3px_12px_rgba(0,0,0,0.025)] sm:p-5">

          <SectionHeader
            eyebrow="Pilihan Kebaikan"
            title="Program Pilihan"
            description="Program pilihan yang telah ditentukan melalui pengaturan sectionType di Sanity."
          />

          <div className="space-y-3.5 pt-1">

            {finalPilihan.map(
              (item) => (
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