// app/api/checkout/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// ============================================================
// NEXT.JS
// ============================================================

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================================
// IDENTITAS BMA
// ============================================================

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://bma.or.id';

// ============================================================
// SANITY BMA
//
// JANGAN hardcode token di source code.
//
// Vercel Environment Variables:
//
// NEXT_PUBLIC_SANITY_PROJECT_ID=im4qx3kd
// NEXT_PUBLIC_SANITY_DATASET=production
// SANITY_API_WRITE_TOKEN=skHrEa1F7Gk1tz5okfVRPhSsU1mitr6EtoCOvFUj6fF7sKMbJOmYNaWTyDIpSZFthB67Z7nRudr7BFhmWYOeLftuWHHIlX5GXKzhIOcRhlWAmxxkk6lZgKUivUDpiP1NRB4JVXIhr4LWdqDih9mgDY24RijPmUHRRRmjMtOaYI5fGCw4iK9r
// ============================================================

const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'im4qx3kd';

const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

const sanityWriteToken =
  process.env.SANITY_API_WRITE_TOKEN;

const sanityClient =
  createClient({
    projectId:
      sanityProjectId,

    dataset:
      sanityDataset,

    apiVersion:
      '2026-07-18',

    useCdn:
      false,

    token:
      sanityWriteToken,
  });

// ============================================================
// HELPER: NOMOR
// ============================================================

function cleanNumber(
  value: unknown
): number {
  if (
    typeof value === 'number'
  ) {
    return Number.isFinite(value)
      ? Math.floor(value)
      : 0;
  }

  const result =
    String(value || '')
      .replace(/[^0-9]/g, '');

  return Number(result || 0);
}

// ============================================================
// HELPER: STRING
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

// ============================================================
// HELPER: PHONE
// ============================================================

function cleanPhoneNumber(
  value: unknown
): string {
  return String(
    value || ''
  ).replace(
    /[^0-9]/g,
    ''
  );
}

// ============================================================
// HELPER: PAYMENT METHOD
// ============================================================

function normalizePaymentMethod(
  value: unknown
): string {
  const method =
    String(
      value || 'qris'
    )
      .toLowerCase()
      .trim();

  const allowedMethods = [
    'qris',
    'cimb_niaga_va',
    'bni_va',
    'sampoerna_va',
    'bnc_va',
    'maybank_va',
    'permata_va',
    'atm_bersama_va',
    'artha_graha_va',
    'bri_va',
  ];

  if (
    allowedMethods.includes(
      method
    )
  ) {
    return method;
  }

  return 'qris';
}

// ============================================================
// HELPER: PREFIX INVOICE
// ============================================================

function buildInvoicePrefix(
  slug: string
): string {
  const normalized =
    slug
      .toUpperCase()
      .replace(
        /[^A-Z0-9]+/g,
        '-'
      );

  if (
    normalized.includes(
      'BERAS'
    )
  ) {
    return 'BERAS';
  }

  if (
    normalized.includes(
      'ZAKAT'
    )
  ) {
    return 'ZAKAT';
  }

  if (
    normalized.includes(
      'YATIM'
    )
  ) {
    return 'YATIM';
  }

  if (
    normalized.includes(
      'DHUAFA'
    )
  ) {
    return 'DHUAFA';
  }

  if (
    normalized.includes(
      'WAKAF'
    )
  ) {
    return 'WAKAF';
  }

  if (
    normalized.includes(
      'SUBUH'
    )
  ) {
    return 'SUBUH';
  }

  if (
    normalized.includes(
      'FIDYAH'
    )
  ) {
    return 'FIDYAH';
  }

  if (
    normalized.includes(
      'MUALAF'
    )
  ) {
    return 'MUALAF';
  }

  return 'DONASI';
}

// ============================================================
// HELPER: ORDER ID
// ============================================================

function generateOrderId(
  slug: string
): string {
  const prefix =
    buildInvoicePrefix(
      slug
    );

  const timestamp =
    Date.now();

  const random =
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

  return (
    `INV-BMA-` +
    `${prefix}-` +
    `${timestamp}-` +
    `${random}`
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
    // 1. VALIDASI ENVIRONMENT
    // ========================================================

    if (
      !sanityWriteToken
    ) {
      console.error(
        '🔥 SANITY_API_WRITE_TOKEN tidak tersedia.'
      );

      return NextResponse.json(
        {
          success:
            false,

          error:
            'Konfigurasi server Sanity belum lengkap.',
        },
        {
          status:
            500,
        }
      );
    }

    // ========================================================
    // PAKASIR PROJECT
    //
    // SERVER variable utama:
    //
    // PAKASIR_PROJECT_SLUG
    //
    // Bisa fallback ke NEXT_PUBLIC agar kompatibel
    // dengan frontend yang sudah ada.
    // ========================================================

    const projectSlug =
      process.env
        .PAKASIR_PROJECT_SLUG ||
      process.env
        .NEXT_PUBLIC_PAKASIR_PROJECT_SLUG ||
      '';

    if (
      !projectSlug
    ) {
      console.error(
        '🔥 PAKASIR_PROJECT_SLUG belum tersedia.'
      );

      return NextResponse.json(
        {
          success:
            false,

          error:
            'Konfigurasi project Pakasir BMA belum lengkap.',
        },
        {
          status:
            500,
        }
      );
    }

    // ========================================================
    // 2. READ BODY
    // ========================================================

    let body:
      Record<
        string,
        any
      >;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          success:
            false,

          error:
            'Request checkout tidak valid.',
        },
        {
          status:
            400,
        }
      );
    }

    // ========================================================
    // 3. NORMALISASI DATA
    // ========================================================

    const slug =
      cleanString(
        body.slug
      );

    const donorName =
      cleanString(
        body.donorName ||
          body.name,
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

    const paymentMethod =
      normalizePaymentMethod(
        body.paymentMethod
      );

    const amount =
      cleanNumber(
        body.amount ||
          body.nominal
      );

    // ========================================================
    // 4. VALIDASI TRANSAKSI
    // ========================================================

    if (!slug) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            'Program donasi tidak ditemukan.',
        },
        {
          status:
            400,
        }
      );
    }

    if (
      !amount ||
      amount < 1000
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            'Minimal donasi adalah Rp 1.000.',
        },
        {
          status:
            400,
        }
      );
    }

    if (
      donorPhone &&
      donorPhone.length < 9
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            'Nomor WhatsApp donatur tidak valid.',
        },
        {
          status:
            400,
        }
      );
    }

    // ========================================================
    // 5. GENERATE ORDER ID BMA
    // ========================================================

    const orderId =
      generateOrderId(
        slug
      );

    // ========================================================
    // 6. RETURN URL
    // ========================================================

    const returnUrl =
      `${SITE_URL}` +
      `/thank-you` +
      `?order_id=${encodeURIComponent(
        orderId
      )}`;

    // ========================================================
    // 7. BUILD HOSTED PAYMENT URL PAKASIR
    //
    // Kita TIDAK memanggil transactioncreate lagi.
    //
    // Pakasir mendukung pembayaran langsung via URL:
    //
    // /pay/{project}/{amount}?order_id=...
    // ========================================================

    let paymentUrl =
      `https://app.pakasir.com/pay/` +
      `${encodeURIComponent(
        projectSlug
      )}/` +
      `${amount}` +
      `?order_id=${encodeURIComponent(
        orderId
      )}` +
      `&redirect=${encodeURIComponent(
        returnUrl
      )}`;

    // ========================================================
    // QRIS ONLY
    // ========================================================

    if (
      paymentMethod ===
      'qris'
    ) {
      paymentUrl +=
        '&qris_only=1';
    }

    // ========================================================
    // 8. SIMPAN TRANSAKSI KE SANITY BMA
    // ========================================================

    const transactionDocument =
      await sanityClient.create(
        {
          _type:
            'donationTransaction',

          orderId:
            orderId,

          donorName:
            donorName,

          donorPhone:
            donorPhone,

          amount:
            amount,

          totalAmount:
            amount,

          status:
            'pending',

          slug:
            slug,

          programSlug:
            slug,

          paymentMethod:
            paymentMethod,

          paymentUrl:
            paymentUrl,

          fundraiserPhone:
            fundraiserPhone,

          source:
            'bma.or.id',

          gateway:
            'pakasir',

          createdAt:
            new Date()
              .toISOString(),
        }
      );

    console.log(
      '✅ TRANSAKSI BMA DICATAT:',
      {
        sanityId:
          transactionDocument
            ?._id,

        orderId,

        slug,

        amount,

        paymentMethod,

        fundraiser:
          fundraiserPhone ||
          'non-afiliasi',
      }
    );

    // ========================================================
    // 9. SYNC GOOGLE SHEET
    //
    // Kegagalan Sheet TIDAK menggagalkan checkout.
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
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify(
                  {
                    orderId,

                    donorName,

                    donorPhone:
                      donorPhone
                        ? `'${donorPhone}`
                        : '',

                    amount,

                    programSlug:
                      slug,

                    paymentMethod,

                    fundraiserPhone:
                      fundraiserPhone
                        ? `'${fundraiserPhone}`
                        : '-',

                    status:
                      'pending',

                    source:
                      'bma.or.id',

                    createdAt:
                      new Date()
                        .toLocaleString(
                          'id-ID',
                          {
                            timeZone:
                              'Asia/Jakarta',
                          }
                        ),
                  }
                ),
            }
          );

        if (
          !sheetResponse.ok
        ) {
          console.warn(
            '⚠️ Google Sheet merespons:',
            sheetResponse.status
          );
        } else {
          console.log(
            '📊 GOOGLE SHEET SYNC:',
            orderId
          );
        }
      } catch (
        sheetError
      ) {
        console.error(
          '⚠️ Google Sheet sync gagal:',
          sheetError
        );
      }
    }

    // ========================================================
    // 10. RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success:
          true,

        orderId:
          orderId,

        amount:
          amount,

        totalPayment:
          amount,

        paymentMethod:
          paymentMethod,

        paymentNumber:
          '',

        expiredAt:
          '',

        returnUrl:
          returnUrl,

        paymentUrl:
          paymentUrl,

        programSlug:
          slug,
      },
      {
        status:
          200,

        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (
    error: any
  ) {
    console.error(
      '🔥 BMA CHECKOUT ERROR:',
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error?.message ||
          'Terjadi kesalahan saat membuat transaksi.',
      },
      {
        status:
          500,

        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}