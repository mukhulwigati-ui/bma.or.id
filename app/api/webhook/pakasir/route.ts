// app/api/webhook/pakasir/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================================
// SANITY
// ============================================================

const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'im4qx3kd';

const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

const sanityWriteToken =
  process.env.SANITY_API_WRITE_TOKEN;

const client = createClient({
  projectId:
    sanityProjectId,

  dataset:
    sanityDataset,

  useCdn:
    false,

  apiVersion:
    '2026-09-24',

  token:
    sanityWriteToken,
});

// ============================================================
// HELPERS
// ============================================================

function cleanString(
  value: unknown,
  fallback = ''
): string {
  if (
    typeof value !== 'string'
  ) {
    return fallback;
  }

  const result =
    value.trim();

  return result || fallback;
}

function cleanAmount(
  value: unknown
): number {
  if (
    typeof value === 'number'
  ) {
    return Number.isFinite(value)
      ? Math.floor(value)
      : 0;
  }

  const cleaned =
    String(value || '')
      .replace(/[^0-9]/g, '');

  return Number(
    cleaned || 0
  );
}

function normalizePhone(
  phone: unknown
): string {
  let result =
    String(phone || '')
      .replace(/\D/g, '');

  if (
    result.startsWith('0')
  ) {
    result =
      '62' + result.slice(1);
  }

  if (
    result.startsWith('8')
  ) {
    result =
      '62' + result;
  }

  return result;
}

// ============================================================
// FONNTE
// ============================================================

async function sendFonnteNotification(
  targetPhone: string,
  donorName: string,
  amount: number,
  programTitle: string,
  orderId: string
) {
  const fonnteToken =
    process.env.FONNTE_API_TOKEN ||
    '';

  if (!fonnteToken) {
    console.warn(
      '[Fonnte] FONNTE_API_TOKEN kosong.'
    );

    return;
  }

  const formattedPhone =
    normalizePhone(
      targetPhone
    );

  if (
    !formattedPhone ||
    formattedPhone.length < 10
  ) {
    console.warn(
      '[Fonnte] Nomor WA tidak valid:',
      formattedPhone
    );

    return;
  }

  const message =
    `Alhamdulillah, jazakumullahu khairan *${donorName}*! 🙏\n\n` +
    `Donasi Anda sebesar *Rp ${amount.toLocaleString('id-ID')}* ` +
    `untuk program *${programTitle}* telah berhasil dikonfirmasi ` +
    `dan terverifikasi otomatis.\n\n` +
    `No. Invoice: \`${orderId}\`\n\n` +
    `Semoga menjadi amal jariyah yang berlipat ganda, ` +
    `mendatangkan keberkahan, serta diberikan ganti yang ` +
    `lebih baik oleh Allah SWT. Aamiin ya Rabbal 'alamin. 🤲\n\n` +
    `*Baitul Maal Al Muttaqin*`;

  try {
    console.log(
      `[Fonnte] Mengirim WA ke ${formattedPhone}`
    );

    const response =
      await fetch(
        'https://api.fonnte.com/send',
        {
          method:
            'POST',

          headers: {
            Authorization:
              fonnteToken,

            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify({
              target:
                formattedPhone,

              message,

              countryCode:
                '62',
            }),
        }
      );

    const result =
      await response
        .json()
        .catch(() => null);

    if (!response.ok) {
      console.error(
        '[Fonnte] HTTP Error:',
        response.status,
        result
      );

      return;
    }

    console.log(
      '[Fonnte] Response:',
      result
    );
  } catch (error) {
    console.error(
      '[Fonnte] Exception:',
      error
    );
  }
}

// ============================================================
// WEBHOOK
// ============================================================

export async function POST(
  request: Request
) {
  try {
    // ========================================================
    // 1. ENV
    // ========================================================

    if (!sanityWriteToken) {
      console.error(
        'SANITY_API_WRITE_TOKEN tidak tersedia.'
      );

      return NextResponse.json(
        {
          error:
            'Server configuration error.',
        },
        {
          status:
            500,
        }
      );
    }

    const expectedProject =
      process.env.PAKASIR_PROJECT_SLUG ||
      '';

    // ========================================================
    // 2. BODY
    // ========================================================

    let body: any;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            'Invalid JSON payload.',
        },
        {
          status:
            400,
        }
      );
    }

    console.log(
      '[Pakasir Webhook]',
      JSON.stringify(body)
    );

    // ========================================================
    // 3. NORMALISASI PAYLOAD
    // ========================================================

    const orderId =
      cleanString(
        body?.order_id ||
        body?.orderId
      );

    const status =
      cleanString(
        body?.status
      ).toLowerCase();

    const project =
      cleanString(
        body?.project
      );

    const paymentMethod =
      cleanString(
        body?.payment_method ||
        body?.paymentMethod
      );

    const completedAt =
      cleanString(
        body?.completed_at ||
        body?.completedAt
      );

    const webhookAmount =
      cleanAmount(
        body?.amount
      );

    // ========================================================
    // 4. VALIDASI DASAR
    // ========================================================

    if (
      !orderId ||
      !status
    ) {
      console.warn(
        '[Pakasir] Payload tidak lengkap.'
      );

      return NextResponse.json(
        {
          error:
            'Invalid webhook payload.',
        },
        {
          status:
            400,
        }
      );
    }

    // ========================================================
    // VALIDASI PROJECT
    // ========================================================

    if (
      expectedProject &&
      project &&
      project !== expectedProject
    ) {
      console.warn(
        '[Pakasir] Project tidak cocok:',
        {
          received:
            project,

          expected:
            expectedProject,
        }
      );

      return NextResponse.json(
        {
          error:
            'Invalid project.',
        },
        {
          status:
            400,
        }
      );
    }

    // ========================================================
    // 5. HANYA PROSES SUCCESS / COMPLETED
    // ========================================================

    if (
      status !== 'completed' &&
      status !== 'success'
    ) {
      console.log(
        `[Pakasir] Status ${status} diabaikan untuk ${orderId}`
      );

      return NextResponse.json({
        success:
          true,

        ignored:
          true,

        status,
      });
    }

    // ========================================================
    // 6. CARI TRANSAKSI
    // ========================================================

    const transaction =
      await client.fetch(
        `*[
          _type == "donationTransaction" &&
          orderId == $orderId
        ][0]{
          _id,
          _rev,
          orderId,
          status,
          donorName,
          donorPhone,
          amount,
          totalAmount,
          paymentMethod,
          gatewayPaymentMethod,
          slug,
          programSlug,
          fundraiserPhone,
          pakasirTxnId
        }`,
        {
          orderId,
        }
      );

    if (!transaction) {
      /*
       * Jangan lagi memakai nomor WA fallback.
       *
       * Webhook yang tidak memiliki transaksi internal
       * tidak boleh menambah saldo atau mengirim WA.
       */

      console.warn(
        `[Pakasir] Transaksi ${orderId} tidak ditemukan di Sanity.`
      );

      return NextResponse.json(
        {
          success:
            false,

          error:
            'Transaction not found.',
        },
        {
          status:
            404,
        }
      );
    }

    // ========================================================
    // 7. IDEMPOTENCY
    //
    // Kalau Pakasir mengirim webhook yang sama lagi,
    // jangan tambah saldo dan jangan kirim WA dua kali.
    // ========================================================

    if (
      transaction.status ===
        'success' ||
      transaction.status ===
        'completed'
    ) {
      console.log(
        `[Pakasir] ${orderId} sudah diproses sebelumnya.`
      );

      return NextResponse.json({
        success:
          true,

        duplicate:
          true,

        message:
          'Transaction already processed.',
      });
    }

    // ========================================================
    // 8. VALIDASI NOMINAL
    // ========================================================

    const transactionAmount =
      cleanAmount(
        transaction.amount ||
        transaction.totalAmount
      );

    if (
      !transactionAmount
    ) {
      console.error(
        `[Pakasir] Nominal transaksi ${orderId} tidak valid.`
      );

      return NextResponse.json(
        {
          error:
            'Invalid transaction amount.',
        },
        {
          status:
            400,
        }
      );
    }

    /*
     * Pakasir menyarankan amount dan order_id
     * dicocokkan dengan transaksi merchant.
     */

    if (
      webhookAmount > 0 &&
      webhookAmount !==
        transactionAmount
    ) {
      console.error(
        '[Pakasir] Amount mismatch:',
        {
          orderId,

          webhookAmount,

          transactionAmount,
        }
      );

      return NextResponse.json(
        {
          error:
            'Amount mismatch.',
        },
        {
          status:
            400,
        }
      );
    }

    // ========================================================
    // 9. PROGRAM
    // ========================================================

    const programSlug =
      cleanString(
        transaction.slug ||
        transaction.programSlug
      );

    let programDoc:
      any = null;

    if (programSlug) {
      programDoc =
        await client.fetch(
          `*[
            _type in ["program", "campaign"] &&
            (
              slug.current == $slug ||
              _id == $slug
            )
          ][0]{
            _id,
            _rev,
            title,
            collectedAmount
          }`,
          {
            slug:
              programSlug,
          }
        );
    }

    const donorName =
      cleanString(
        transaction.donorName,
        'Hamba Allah'
      );

    const donorPhone =
      cleanString(
        transaction.donorPhone
      );

    const programTitle =
      cleanString(
        programDoc?.title,
        'Program Kebaikan'
      );

    // ========================================================
    // 10. ATOMIC SANITY TRANSACTION
    //
    // Update status transaksi + saldo program dilakukan
    // dalam SATU transaksi Sanity.
    //
    // ifRevisionId membuat webhook ganda yang datang hampir
    // bersamaan tidak dapat sama-sama lolos.
    // ========================================================

    const processedAt =
      new Date()
        .toISOString();

    let sanityTransaction =
      client.transaction();

    sanityTransaction =
      sanityTransaction.patch(
        transaction._id,
        (patch) =>
          patch
            .ifRevisionId(
              transaction._rev
            )
            .set({
              status:
                'success',

              paymentMethod:
                paymentMethod ||
                transaction.paymentMethod ||
                'payment_link',

              completedAt:
                completedAt ||
                processedAt,

              webhookProcessedAt:
                processedAt,
            })
      );

    // ========================================================
    // TAMBAH SALDO PROGRAM SECARA ATOMIC
    // ========================================================

    if (programDoc?._id) {
      const donorEntry = {
        _key:
          `donor-${orderId}`
            .replace(
              /[^a-zA-Z0-9_-]/g,
              ''
            )
            .slice(-90),

        name:
          donorName,

        amount:
          transactionAmount,

        date:
          new Date()
            .toLocaleDateString(
              'id-ID',
              {
                day:
                  'numeric',

                month:
                  'short',

                year:
                  'numeric',
              }
            ),

        orderId,
      };

      sanityTransaction =
        sanityTransaction.patch(
          programDoc._id,
          (patch) =>
            patch
              .setIfMissing({
                collectedAmount:
                  0,

                donors:
                  [],
              })
              .inc({
                collectedAmount:
                  transactionAmount,
              })
              .append(
                'donors',
                [donorEntry]
              )
        );
    }

    try {
      await sanityTransaction.commit();
    } catch (commitError: any) {
      /*
       * Bisa terjadi apabila webhook identik masuk
       * hampir bersamaan.
       *
       * Cek kembali status terbaru.
       */

      console.warn(
        '[Pakasir] Sanity transaction conflict:',
        commitError?.message ||
          commitError
      );

      const latest =
        await client.fetch(
          `*[
            _type == "donationTransaction" &&
            orderId == $orderId
          ][0]{
            status
          }`,
          {
            orderId,
          }
        );

      if (
        latest?.status ===
          'success' ||
        latest?.status ===
          'completed'
      ) {
        return NextResponse.json({
          success:
            true,

          duplicate:
            true,

          message:
            'Transaction already processed.',
        });
      }

      throw commitError;
    }

    console.log(
      `[Sanity] ${orderId} berhasil diproses.`,
      {
        amount:
          transactionAmount,

        program:
          programSlug,

        paymentMethod,
      }
    );

    // ========================================================
    // 11. FONNTE
    //
    // Dilakukan SETELAH transaksi Sanity sukses.
    // ========================================================

    if (donorPhone) {
      await sendFonnteNotification(
        donorPhone,
        donorName,
        transactionAmount,
        programTitle,
        orderId
      );
    } else {
      console.warn(
        `[Fonnte] ${orderId} tidak memiliki nomor WA.`
      );
    }

    // ========================================================
    // 12. RESPONSE
    // ========================================================

    return NextResponse.json({
      success:
        true,

      message:
        'Webhook processed successfully.',

      orderId,

      amount:
        transactionAmount,
    });
  } catch (error: any) {
    console.error(
      'BMA PAKASIR WEBHOOK ERROR:',
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error?.message ||
          'Internal Server Error',
      },
      {
        status:
          500,
      }
    );
  }
}