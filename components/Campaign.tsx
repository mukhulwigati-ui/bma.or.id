// components/Campaign.tsx

'use client';

import React from 'react';
import Link from 'next/link';

import {
  ArrowRight,
  Clock3,
  HeartHandshake,
  Users,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface CampaignItem {
  id: string;
  title: string;
  slug: string;
  image: string;

  category?: string;

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
    target <= 0 ||
    collected <= 0
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
  const explicitCount =
    Number(
      item.donorsCount ??
        0
    ) || 0;

  if (
    explicitCount > 0
  ) {
    return explicitCount;
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
  return value.toLocaleString(
    'id-ID'
  );
}

function getImage(
  image?: string
): string {
  if (
    typeof image ===
      'string' &&
    image.trim()
  ) {
    return image;
  }

  return '/images/banner.png';
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  eyebrow,
  title,
  description,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">

        <div className="min-w-0">

          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#858585]
            "
          >
            {eyebrow}
          </p>

          <h2
            className="
              mt-0.5
              text-[20px]
              font-bold
              tracking-tight
              text-[#353535]
            "
          >
            {title}
          </h2>

        </div>

        <Link
          href={href}
          className="
            flex
            shrink-0
            items-center
            gap-1
            text-[10px]
            font-semibold
            text-[#666666]
            transition
            hover:text-[#222222]
          "
        >
          Lihat Semua

          <ArrowRight
            className="
              h-3.5
              w-3.5
            "
          />
        </Link>

      </div>

      <p
        className="
          text-[12px]
          leading-relaxed
          text-[#777777]
        "
      >
        {description}
      </p>
    </div>
  );
}

// ============================================================
// PROGRESS BAR
// ============================================================

function ProgressBar({
  percentage,
}: {
  percentage: number;
}) {
  return (
    <div
      className="
        h-[5px]
        w-full
        overflow-hidden
        bg-[#dedede]
      "
    >
      <div
        className="
          h-full
          bg-[#d9232e]
          transition-all
          duration-500
        "
        style={{
          width:
            `${percentage}%`,
        }}
      />
    </div>
  );
}

// ============================================================
// GENERAL CARD
// ============================================================

function GeneralCampaignCard({
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
      className="
        group
        flex
        items-center
        gap-3.5
        border
        border-[#dddddd]
        bg-white
        p-3
        shadow-[0_3px_10px_rgba(0,0,0,0.025)]
        transition
        hover:border-[#c8c8c8]
        hover:bg-[#fafafa]
      "
    >

      <div
        className="
          aspect-[16/10]
          w-28
          shrink-0
          overflow-hidden
          bg-[#dedede]
        "
      >
        <img
          src={getImage(
            item.image
          )}
          alt={item.title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-[1.03]
          "
        />
      </div>

      <div
        className="
          min-w-0
          flex-1
          space-y-2
        "
      >

        {item.category && (
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#999999]
            "
          >
            {item.category}
          </p>
        )}

        <h3
          className="
            line-clamp-2
            text-[13px]
            font-semibold
            leading-snug
            text-[#4b4b4b]
          "
        >
          {item.title}
        </h3>

        <div>

          <div
            className="
              mb-1.5
              flex
              items-end
              justify-between
              gap-2
            "
          >

            <div>
              <span
                className="
                  block
                  text-[9px]
                  text-[#999999]
                "
              >
                Terkumpul
              </span>

              <span
                className="
                  text-[11px]
                  font-bold
                  text-[#555555]
                "
              >
                Rp{' '}
                {formatRupiah(
                  collected
                )}
              </span>
            </div>

            <div
              className="
                text-right
              "
            >
              <span
                className="
                  block
                  text-[9px]
                  text-[#999999]
                "
              >
                Donatur
              </span>

              <span
                className="
                  text-[11px]
                  font-bold
                  text-[#555555]
                "
              >
                {donorCount}
              </span>
            </div>

          </div>

          <ProgressBar
            percentage={
              percentage
            }
          />

        </div>

      </div>

    </Link>
  );
}

// ============================================================
// MENDESAK CARD
// ============================================================

function UrgentCampaignCard({
  item,
}: {
  item: CampaignItem;
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
      className="
        group
        block
        border
        border-[#dddddd]
        bg-[#f7f7f7]
        p-3
        transition
        hover:border-[#c5c5c5]
        hover:bg-white
      "
    >

      <div
        className="
          relative
          aspect-[16/10]
          overflow-hidden
          bg-[#dddddd]
        "
      >

        <img
          src={getImage(
            item.image
          )}
          alt={item.title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-[1.03]
          "
        />

        {typeof item.daysLeft ===
          'number' &&
          item.daysLeft > 0 && (

            <div
              className="
                absolute
                left-2
                top-2
                flex
                items-center
                gap-1
                bg-[#505050]
                px-2
                py-1
                text-[8px]
                font-bold
                text-white
              "
            >
              <Clock3
                className="
                  h-3
                  w-3
                "
              />

              {item.daysLeft}
              {' '}
              hari lagi
            </div>
          )}

      </div>

      <div className="mt-3">

        {item.category && (
          <p
            className="
              mb-1
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#999999]
            "
          >
            {item.category}
          </p>
        )}

        <h3
          className="
            line-clamp-2
            min-h-[36px]
            text-[13px]
            font-semibold
            leading-snug
            text-[#4c4c4c]
          "
        >
          {item.title}
        </h3>

      </div>

      <div className="mt-3">

        <div
          className="
            mb-2
            flex
            items-end
            justify-between
            gap-2
          "
        >

          <div>
            <span
              className="
                block
                text-[9px]
                text-[#999999]
              "
            >
              Terkumpul
            </span>

            <strong
              className="
                text-[11px]
                font-bold
                text-[#555555]
              "
            >
              Rp{' '}
              {formatRupiah(
                collected
              )}
            </strong>
          </div>

          <div className="text-right">

            <span
              className="
                block
                text-[9px]
                text-[#999999]
              "
            >
              Donatur
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1
                text-[10px]
                font-bold
                text-[#555555]
              "
            >
              <Users
                className="
                  h-3
                  w-3
                "
              />

              {donorCount}
            </span>

          </div>

        </div>

        <ProgressBar
          percentage={
            percentage
          }
        />

        <div
          className="
            mt-1.5
            flex
            justify-between
            text-[8px]
            text-[#999999]
          "
        >
          <span>
            {percentage}%
          </span>

          <span>
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
// PROGRAM UNGGULAN
//
// KHUSUS MODEL KOTAK 2 KOLOM
// ============================================================

function FeaturedSquareCard({
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
      className="
        group
        flex
        min-w-0
        flex-col
        border
        border-[#dddddd]
        bg-[#fafafa]
        p-3
        transition
        hover:border-[#c7c7c7]
        hover:bg-white
        hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)]
      "
    >

      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div
        className="
          aspect-square
          w-full
          overflow-hidden
          bg-[#e1e1e1]
        "
      >
        <img
          src={getImage(
            item.image
          )}
          alt={item.title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-[1.025]
          "
        />
      </div>

      {/* ======================================================
          CATEGORY
      ====================================================== */}

      {item.category && (
        <p
          className="
            mt-3
            truncate
            text-[9px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-[#969696]
          "
        >
          {item.category}
        </p>
      )}

      {/* ======================================================
          TITLE
      ====================================================== */}

      <h3
        className="
          mt-1
          line-clamp-2
          min-h-[40px]
          text-[14px]
          font-bold
          leading-[1.35]
          text-[#3c3c3c]
          transition
          group-hover:text-[#222222]
        "
      >
        {item.title}
      </h3>

      {/* ======================================================
          AMOUNT / DONOR
      ====================================================== */}

      <div
        className="
          mt-auto
          pt-4
        "
      >

        <div
          className="
            mb-2.5
            flex
            items-end
            justify-between
            gap-2
          "
        >

          <div className="min-w-0">

            <span
              className="
                block
                text-[9px]
                text-[#999999]
              "
            >
              Terkumpul
            </span>

            <strong
              className="
                block
                truncate
                text-[12px]
                font-bold
                text-[#4a4a4a]
              "
            >
              Rp{' '}
              {formatRupiah(
                collected
              )}
            </strong>

          </div>

          <div
            className="
              shrink-0
              text-right
            "
          >

            <span
              className="
                block
                text-[9px]
                text-[#999999]
              "
            >
              Donatur
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1
                text-[11px]
                font-semibold
                text-[#555555]
              "
            >
              <Users
                className="
                  h-3
                  w-3
                "
              />

              {donorCount}
            </span>

          </div>

        </div>

        <ProgressBar
          percentage={
            percentage
          }
        />

      </div>

    </Link>
  );
}

// ============================================================
// COMPACT CARD PILIHAN
// ============================================================

function CompactCampaignCard({
  item,
}: {
  item: CampaignItem;
}) {
  const collected =
    getCollected(item);

  const donorCount =
    getDonorsCount(item);

  return (
    <Link
      href={`/campaign/${item.slug}`}
      className="
        group
        flex
        items-center
        gap-3.5
        border-b
        border-[#e1e1e1]
        pb-3.5
        transition
        last:border-b-0
        last:pb-0
        hover:opacity-90
      "
    >

      <div
        className="
          aspect-[16/10]
          w-28
          shrink-0
          overflow-hidden
          bg-[#dedede]
        "
      >
        <img
          src={getImage(
            item.image
          )}
          alt={item.title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-[1.03]
          "
        />
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >

        {item.category && (
          <p
            className="
              mb-1
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#999999]
            "
          >
            {item.category}
          </p>
        )}

        <h3
          className="
            line-clamp-2
            text-[13px]
            font-semibold
            leading-snug
            text-[#505050]
          "
        >
          {item.title}
        </h3>

        <div
          className="
            mt-3
            flex
            items-end
            justify-between
            gap-3
          "
        >

          <div>
            <span
              className="
                block
                text-[9px]
                text-[#999999]
              "
            >
              Terkumpul
            </span>

            <strong
              className="
                text-[11px]
                font-bold
                text-[#555555]
              "
            >
              Rp{' '}
              {formatRupiah(
                collected
              )}
            </strong>
          </div>

          <div className="text-right">

            <span
              className="
                block
                text-[9px]
                text-[#999999]
              "
            >
              Donatur
            </span>

            <strong
              className="
                text-[11px]
                font-bold
                text-[#555555]
              "
            >
              {donorCount}
            </strong>

          </div>

        </div>

      </div>

      <ArrowRight
        className="
          h-3.5
          w-3.5
          shrink-0
          text-[#c0c0c0]
        "
      />

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

  // ==========================================================
  // GENERAL MODE
  // ==========================================================

  if (
    initialData.length > 0 &&
    mendesak.length === 0 &&
    unggulan.length === 0 &&
    pilihan.length === 0
  ) {
    return (
      <section
        className="
          w-full
          space-y-4
          text-left
        "
      >

        <div
          className="
            border-b
            border-[#d5d5d5]
            pb-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2.5
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                border
                border-[#d0d0d0]
                bg-[#e5e5e5]
              "
            >
              <HeartHandshake
                className="
                  h-4
                  w-4
                  text-[#666666]
                "
              />
            </div>

            <div>

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#888888]
                "
              >
                Program Kebaikan
              </p>

              <h2
                className="
                  mt-0.5
                  text-[18px]
                  font-bold
                  tracking-tight
                  text-[#414141]
                "
              >
                Daftar Program
              </h2>

            </div>

          </div>

        </div>

        <div className="space-y-3">

          {initialData.map(
            (item) => (
              <GeneralCampaignCard
                key={item.id}
                item={item}
              />
            )
          )}

        </div>

      </section>
    );
  }

  // ==========================================================
  // HOMEPAGE
  // ==========================================================

  return (
    <div
      className="
        w-full
        space-y-6
        text-left
      "
    >

      {/* ======================================================
          MENDESAK
      ====================================================== */}

      {mendesak.length >
        0 && (

        <section
          className="
            space-y-4
            border
            border-[#d8d8d8]
            bg-white
            p-4
            shadow-[0_3px_12px_rgba(0,0,0,0.025)]
          "
        >

          <SectionHeader
            eyebrow="Butuh Dukungan Segera"
            title="Penggalangan Dana Mendesak"
            description="Bantu program yang membutuhkan dukungan segera agar manfaat dapat tersalurkan lebih cepat."
            href="/campaign/mendesak"
          />

          <div
            className="
              grid
              grid-cols-1
              gap-3.5
              pt-1
              sm:grid-cols-2
            "
          >

            {mendesak.map(
              (item) => (
                <UrgentCampaignCard
                  key={item.id}
                  item={item}
                />
              )
            )}

          </div>

        </section>
      )}

      {/* ======================================================
          UNGGULAN
      ====================================================== */}

      {unggulan.length >
        0 && (

        <section
          className="
            space-y-4
            border
            border-[#d8d8d8]
            bg-white
            p-4
            shadow-[0_3px_12px_rgba(0,0,0,0.025)]
          "
        >

          <SectionHeader
            eyebrow="Rekomendasi Program"
            title="Program Unggulan"
            description="Pilih program yang berarti bagi Anda dan Mereka"
            href="/campaign/unggulan"
          />

          {/* ==================================================
              KHUSUS UNGGULAN:
              SELALU 2 KOLOM SEPERTI CONTOH
          =================================================== */}

          <div
            className="
              grid
              grid-cols-2
              gap-3.5
              pt-1
            "
          >

            {unggulan.map(
              (item) => (
                <FeaturedSquareCard
                  key={item.id}
                  item={item}
                />
              )
            )}

          </div>

        </section>
      )}

      {/* ======================================================
          PILIHAN
      ====================================================== */}

      {pilihan.length >
        0 && (

        <section
          className="
            space-y-4
            border
            border-[#d8d8d8]
            bg-white
            p-4
            shadow-[0_3px_12px_rgba(0,0,0,0.025)]
          "
        >

          <SectionHeader
            eyebrow="Pilihan Kebaikan"
            title="Program Pilihan"
            description="Temukan program kebaikan lainnya yang dapat menjadi jalan untuk berbagi dan menghadirkan manfaat."
            href="/campaign/pilihan"
          />

          <div
            className="
              space-y-3.5
              pt-1
            "
          >

            {pilihan.map(
              (item) => (
                <CompactCampaignCard
                  key={item.id}
                  item={item}
                />
              )
            )}

          </div>

        </section>
      )}

    </div>
  );
}