// app/api/programs/route.ts

import { NextResponse } from 'next/server';
import { clientPublik as client } from '@/lib/sanity';

// ============================================================
// NEXT.JS
// ============================================================

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================================
// HELPERS
// ============================================================

function toNumber(value: any, fallback = 0): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function normalizeSlug(value: any): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (
    value &&
    typeof value === 'object' &&
    typeof value.current === 'string'
  ) {
    return value.current.trim();
  }

  return '';
}

function normalizeString(
  value: any,
  fallback = ''
): string {
  if (typeof value === 'string') {
    const result = value.trim();

    return result || fallback;
  }

  return fallback;
}

// ============================================================
// GET PROGRAMS
// ============================================================

export async function GET() {
  try {
    // ========================================================
    // QUERY SANITY
    // ========================================================

    const query = `
      {
        "programs":
          *[
            _type in ["program", "campaign"]
          ]
          | order(_createdAt desc)
          {
            "id": _id,
            "_id": _id,

            "_createdAt": _createdAt,
            "_updatedAt": _updatedAt,

            "slug": slug.current,

            title,

            category,

            sectionType,

            "image": coalesce(
              image.asset->url,
              mainImage.asset->url,
              thumbnail.asset->url,
              banner.asset->url
            ),

            collectedAmount,

            collectedRaw,

            collected,

            targetAmount,

            daysLeft,

            description,

            donors,

            reports
          },

        "transactions":
          *[
            _type == "donationTransaction" &&
            status == "success"
          ]
          {
            _id,

            amount,

            donorName,

            donorPhone,

            _createdAt,

            programId,

            programName,

            slug,

            status
          }
      }
    `;

    // ========================================================
    // FETCH
    // ========================================================

    const result = await client.fetch(
      query,
      {},
      {
        cache: 'no-store',
      }
    );

    const sanityPrograms =
      Array.isArray(result?.programs)
        ? result.programs
        : [];

    const successTransactions =
      Array.isArray(result?.transactions)
        ? result.transactions
        : [];

    // ========================================================
    // FORMAT PROGRAMS
    // ========================================================

    const formattedData =
      sanityPrograms.map(
        (program: any) => {
          const programId =
            normalizeString(
              program?.id ||
                program?._id
            );

          const programSlug =
            normalizeSlug(
              program?.slug
            );

          const programTitle =
            normalizeString(
              program?.title,
              'Program Kebaikan'
            );

          // ==================================================
          // TRANSAKSI YANG SESUAI PROGRAM
          // ==================================================

          const matchingTransactions =
            successTransactions.filter(
              (tx: any) => {
                const txProgramId =
                  typeof tx?.programId === 'string'
                    ? tx.programId
                    : tx?.programId?._ref || '';

                const txProgramName =
                  typeof tx?.programName === 'string'
                    ? tx.programName
                    : '';

                const txSlug =
                  normalizeSlug(
                    tx?.slug
                  );

                return (
                  txProgramId ===
                    programId ||

                  (
                    txSlug &&
                    txSlug ===
                      programSlug
                  ) ||

                  (
                    txProgramName &&
                    txProgramName ===
                      programTitle
                  )
                );
              }
            );

          // ==================================================
          // TRANSAKSI → DONATUR
          // ==================================================

          const formattedTxDonors =
            matchingTransactions.map(
              (tx: any) => ({
                id:
                  tx?._id || '',

                name:
                  normalizeString(
                    tx?.donorName,
                    'Hamba Allah'
                  ),

                amount:
                  toNumber(
                    tx?.amount,
                    0
                  ),

                date:
                  tx?._createdAt
                    ? new Date(
                        tx._createdAt
                      ).toLocaleDateString(
                        'id-ID',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )
                    : 'Baru Saja',
              })
            );

          // ==================================================
          // DONATUR MANUAL
          // ==================================================

          const manualDonors =
            Array.isArray(
              program?.donors
            )
              ? program.donors
              : [];

          // ==================================================
          // GABUNG DONATUR
          // ==================================================

          const combinedDonors = [
            ...manualDonors,
            ...formattedTxDonors,
          ];

          // ==================================================
          // AMOUNT
          // ==================================================

          const rawAmount =
            Math.max(
              0,
              toNumber(
                program?.collectedAmount ??
                  program?.collectedRaw ??
                  program?.collected ??
                  0,
                0
              )
            );

          const targetAmount =
            Math.max(
              1,
              toNumber(
                program?.targetAmount,
                50000000
              )
            );

          // ==================================================
          // DONORS COUNT
          // ==================================================

          let totalDonorsCount =
            combinedDonors.length;

          if (
            totalDonorsCount === 0 &&
            rawAmount > 0
          ) {
            totalDonorsCount =
              Math.max(
                1,
                Math.floor(
                  rawAmount /
                    50000
                )
              );
          }

          // ==================================================
          // UPDATED AT
          //
          // Ini penting untuk cache busting WhatsApp.
          // ==================================================

          const updatedAt =
            normalizeString(
              program?._updatedAt,
              program?._createdAt ||
                new Date(0).toISOString()
            );

          // ==================================================
          // SHARE VERSION
          //
          // Buang karakter aneh agar aman dimasukkan ke URL.
          // ==================================================

          const shareVersion =
            updatedAt
              .replace(
                /[^0-9A-Za-z]/g,
                ''
              )
              .slice(0, 30) ||
            '1';

          // ==================================================
          // FINAL
          // ==================================================

          return {
            id:
              programId,

            _id:
              programId,

            slug:
              programSlug,

            title:
              programTitle,

            category:
              program?.category ||
              'Kemanusiaan',

            sectionType:
              normalizeString(
                program?.sectionType,
                'pilihan'
              ),

            // ================================================
            // Gambar yang sama dipakai homepage dan detail.
            // ================================================

            image:
              normalizeString(
                program?.image,
                '/images/banner.png'
              ),

            // ================================================
            // VERSIONING UNTUK SHARE
            // ================================================

            updatedAt,

            shareVersion,

            // ================================================
            // NOMINAL
            // ================================================

            collected:
              `Rp ${rawAmount.toLocaleString(
                'id-ID'
              )}`,

            collectedRaw:
              rawAmount,

            collectedAmount:
              rawAmount,

            target:
              `Rp ${targetAmount.toLocaleString(
                'id-ID'
              )}`,

            targetAmount,

            // ================================================
            // LAINNYA
            // ================================================

            daysLeft:
              program?.daysLeft ??
              null,

            description:
              program?.description ??
              null,

            donors:
              combinedDonors,

            donorsCount:
              totalDonorsCount,

            reports:
              Array.isArray(
                program?.reports
              )
                ? program.reports
                : [],
          };
        }
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,

        source:
          'Baitul Maal Al Muttaqin',

        count:
          formattedData.length,

        data:
          formattedData,
      },
      {
        status: 200,

        headers: {
          'Content-Type':
            'application/json',

          'Cache-Control':
            'no-store, no-cache, must-revalidate, max-age=0',

          Pragma:
            'no-cache',

          Expires:
            '0',
        },
      }
    );
  } catch (error: any) {
    console.error(
      '🔥 BMA Sanity Programs Fetch Error:',
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ||
          'Gagal mengambil data program.',
      },
      {
        status: 500,

        headers: {
          'Cache-Control':
            'no-store',
        },
      }
    );
  }
}