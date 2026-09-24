// app/api/checkout/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================================
// CONFIG
// ============================================================

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.bma.or.id'
).replace(/\/$/, '');

const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'im4qx3kd';

const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

const sanityWriteToken =
  process.env.SANITY_API_WRITE_TOKEN;

const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: '2026-09-24',
  useCdn: false,
  token: sanityWriteToken,
});

// ============================================================
// HELPERS
// ============================================================

function cleanNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value)
      ? Math.floor(value)
      : 0;
  }

  const result = String(value || '').replace(
    /[^0-9]/g,
    ''
  );

  return Number(result || 0);
}

function cleanString(
  value: unknown,
  fallback = ''
): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const result = value.trim();

  return result || fallback;
}

function cleanPhoneNumber(
  value: unknown
): string {
  return String(value || '').replace(
    /[^0-9]/g,
    ''
  );
}

// ============================================================
// PAYMENT METHOD
//
// Frontend BMA masih mengirim pilihan metode.
// Kita simpan pilihan tersebut sebagai preferredPaymentMethod.
//
// Untuk API Pakasir v2 checkout menggunakan payment_link,
// karena metode inilah yang mengembalikan URL pembayaran.
// ============================================================

function normalizePaymentMethod(
  value: unknown
): string {
  const method = String(
    value || 'qris'
  )
    .toLowerCase()
    .trim();

  const allowedMethods = [
    'qris',
    'bri_va',
    'bni_va',
    'cimb_niaga_va',
    'permata_va',
    'maybank_va',
    'bnc_va',
    'artha_graha_va',
    'sampoerna_va',
    'payment_link',
  ];

  return allowedMethods.includes(method)
    ? method
    : 'qris';
}

// ============================================================
// INVOICE PREFIX
// ============================================================

function buildInvoicePrefix(
  slug: string
): string {
  const normalized = slug
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-');

  if (normalized.includes('BERAS')) {
    return 'BERAS';
  }

  if (normalized.includes('ZAKAT')) {
    return 'ZAKAT';
  }

  if (normalized.includes('YATIM')) {
    return 'YATIM';
  }

  if (normalized.includes('DHUAFA')) {
    return 'DHUAFA';
  }

  if (normalized.includes('WAKAF')) {
    return 'WAKAF';
  }

  if (normalized.includes('SUBUH')) {
    return 'SUBUH';
  }

  if (normalized.includes('FIDYAH')) {
    return 'FIDYAH';
  }

  if (normalized.includes('MUALAF')) {
    return 'MUALAF';
  }

  return 'DONASI';
}

// ============================================================
// ORDER ID
// ============================================================

function generateOrderId(
  slug: string
): string {
  const prefix =
    buildInvoicePrefix(slug);

  const timestamp =
    Date.now();

  const random =
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

  return (
    `INV-BMA-${prefix}-` +
    `${timestamp}-${random}`
  );
}

// ============================================================
// POST CHECKOUT
// ============================================================

export async function POST(
  request: Request
) {
  try {
    // ========================================================
    // 1. ENVIRONMENT
    // ========================================================

    if (!sanityWriteToken) {
      console.error(
        'SANITY_API_WRITE_TOKEN tidak tersedia.'
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Konfigurasi server Sanity belum lengkap.',
        },
        { status: 500 }
      );
    }

    const projectSlug =
      process.env.PAKASIR_PROJECT_SLUG ||
      '';

    const pakasirApiKey =
      process.env.PAKASIR_API_KEY ||
      '';

    if (!projectSlug) {
      console.error(
        'PAKASIR_PROJECT_SLUG belum tersedia.'
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Konfigurasi project Pakasir belum lengkap.',
        },
        { status: 500 }
      );
    }

    if (!pakasirApiKey) {
      console.error(
        'PAKASIR_API_KEY belum tersedia.'
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'API Key Pakasir belum tersedia.',
        },
        { status: 500 }
      );
    }

    // ========================================================
    // 2. BODY
    // ========================================================

    let body: Record<string, any>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            'Request checkout tidak valid.',
        },
        { status: 400 }
      );
    }

    // ========================================================
    // 3. NORMALISASI
    // ========================================================

    const slug =
      cleanString(body.slug);

    const donorName =
      cleanString(
        body.donorName || body.name,
        'Hamba Allah'
      );

    const donorPhone =
      cleanPhoneNumber(
        body.donorPhone ||
          body.phone ||
          body.whatsapp
      );

    const fundraiserPhone =
      cleanPhoneNumber(
        body.fundraiserPhone ||
          body.referral
      );

    const preferredPaymentMethod =
      normalizePaymentMethod(
        body.paymentMethod
      );

    const amount =
      cleanNumber(
        body.amount ||
          body.nominal
      );

    // ========================================================
    // 4. VALIDASI
    // ========================================================

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Program donasi tidak ditemukan.',
        },
        { status: 400 }
      );
    }

    if (!amount || amount < 1000) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Minimal donasi adalah Rp 1.000.',
        },
        { status: 400 }
      );
    }

    if (
      donorPhone &&
      donorPhone.length < 9
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Nomor WhatsApp donatur tidak valid.',
        },
        { status: 400 }
      );
    }

    // ========================================================
    // 5. ORDER ID
    // ========================================================

    const orderId =
      generateOrderId(slug);

    // ========================================================
    // 6. PAKASIR API V2
    //
    // API:
    // POST /api/v2/create-transaction/{slug}/{order_id}
    //
    // Header:
    // X-Api-Key
    //
    // Kita menggunakan payment_link agar frontend BMA
    // tetap bisa redirect langsung tanpa harus membuat
    // renderer QR / Virtual Account sendiri.
    // ========================================================

    const pakasirEndpoint =
      `https://app.pakasir.com` +
      `/api/v2/create-transaction/` +
      `${encodeURIComponent(projectSlug)}/` +
      `${encodeURIComponent(orderId)}`;

    const pakasirResponse =
      await fetch(
        pakasirEndpoint,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            'Accept':
              'application/json',

            'X-Api-Key':
              pakasirApiKey,
          },

          body: JSON.stringify({
            method:
              'payment_link',

            amount:
              amount,
          }),

          cache:
            'no-store',
        }
      );

    // ========================================================
    // 7. PARSE RESPONSE PAKASIR
    // ========================================================

    let pakasirData: any = null;

    try {
      pakasirData =
        await pakasirResponse.json();
    } catch {
      const raw =
        await pakasirResponse
          .text()
          .catch(() => '');

      console.error(
        'Response Pakasir bukan JSON:',
        raw
      );
    }

    if (
      !pakasirResponse.ok ||
      !pakasirData
    ) {
      console.error(
        'Pakasir API v2 error:',
        {
          status:
            pakasirResponse.status,

          data:
            pakasirData,
        }
      );

      return NextResponse.json(
        {
          success: false,

          error:
            pakasirData?.message ||
            pakasirData?.error ||
            'Gagal membuat transaksi Pakasir.',
        },
        {
          status:
            pakasirResponse.status >= 400 &&
            pakasirResponse.status < 500
              ? 400
              : 502,
        }
      );
    }

    const txnId =
      cleanString(
        pakasirData.txn_id
      );

    const paymentUrl =
      cleanString(
        pakasirData.payment_link
      );

    if (!txnId || !paymentUrl) {
      console.error(
        'Response Pakasir v2 tidak lengkap:',
        pakasirData
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Pakasir tidak memberikan link pembayaran.',
        },
        { status: 502 }
      );
    }

    // ========================================================
    // 8. RETURN URL BMA
    //
    // Disimpan untuk kebutuhan aplikasi.
    // API payment_link v2 memberikan URL Pakasir sendiri.
    // ========================================================

    const returnUrl =
      `${SITE_URL}/thank-you` +
      `?order_id=${encodeURIComponent(
        orderId
      )}`;

    // ========================================================
    // 9. SIMPAN PENDING KE SANITY
    // ========================================================

    let transactionDocument: any;

    try {
      transactionDocument =
        await sanityClient.create({
          _type:
            'donationTransaction',

          orderId,

          pakasirTxnId:
            txnId,

          donorName,

          donorPhone,

          amount,

          totalAmount:
            amount,

          status:
            'pending',

          slug,

          programSlug:
            slug,

          // Pilihan yang dipilih user di form BMA.
          paymentMethod:
            preferredPaymentMethod,

          // Gateway dibuat via payment_link v2.
          gatewayPaymentMethod:
            'payment_link',

          paymentUrl,

          returnUrl,

          fundraiserPhone,

          source:
            'bma.or.id',

          gateway:
            'pakasir-v2',

          createdAt:
            new Date()
              .toISOString(),
        });
    } catch (sanityError) {
      console.error(
        'Gagal menyimpan transaksi ke Sanity:',
        sanityError
      );

      /*
       * Transaksi Pakasir sudah berhasil dibuat.
       * Jangan mengarahkan user ke pembayaran jika record
       * internal gagal dibuat, karena webhook nanti tidak
       * mempunyai transaksi untuk dicocokkan.
       */

      return NextResponse.json(
        {
          success: false,
          error:
            'Transaksi pembayaran berhasil dibuat tetapi pencatatan internal gagal. Silakan coba kembali.',
        },
        { status: 500 }
      );
    }

    console.log(
      'TRANSAKSI BMA PAKASIR V2:',
      {
        sanityId:
          transactionDocument?._id,

        txnId,

        orderId,

        slug,

        amount,

        preferredPaymentMethod,

        fundraiser:
          fundraiserPhone ||
          'non-afiliasi',
      }
    );

    // ========================================================
    // 10. GOOGLE SHEET
    // ========================================================

    const googleSheetScriptUrl =
      process.env
        .GOOGLE_SHEET_WEBHOOK_URL ||
      '';

    if (
      googleSheetScriptUrl.trim()
    ) {
      try {
        const sheetResponse =
          await fetch(
            googleSheetScriptUrl.trim(),
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  orderId,

                  txnId,

                  donorName,

                  donorPhone:
                    donorPhone
                      ? `'${donorPhone}`
                      : '',

                  amount,

                  programSlug:
                    slug,

                  paymentMethod:
                    preferredPaymentMethod,

                  gatewayPaymentMethod:
                    'payment_link',

                  fundraiserPhone:
                    fundraiserPhone
                      ? `'${fundraiserPhone}`
                      : '-',

                  status:
                    'pending',

                  source:
                    'bma.or.id',

                  gateway:
                    'pakasir-v2',

                  createdAt:
                    new Date()
                      .toLocaleString(
                        'id-ID',
                        {
                          timeZone:
                            'Asia/Jakarta',
                        }
                      ),
                }),
            }
          );

        if (!sheetResponse.ok) {
          console.warn(
            'Google Sheet merespons:',
            sheetResponse.status
          );
        } else {
          console.log(
            'GOOGLE SHEET SYNC:',
            orderId
          );
        }
      } catch (sheetError) {
        console.error(
          'Google Sheet sync gagal:',
          sheetError
        );
      }
    }

    // ========================================================
    // 11. RESPONSE KE FRONTEND
    // ========================================================

    return NextResponse.json(
      {
        success: true,

        orderId,

        txnId,

        amount,

        totalPayment:
          amount,

        paymentMethod:
          preferredPaymentMethod,

        paymentNumber:
          '',

        expiredAt:
          '',

        returnUrl,

        paymentUrl,

        programSlug:
          slug,
      },
      {
        status: 200,

        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error(
      'BMA CHECKOUT ERROR:',
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ||
          'Terjadi kesalahan saat membuat transaksi.',
      },
      {
        status: 500,

        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}