// lib/sanity.ts

import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { Image } from 'sanity';

// ============================================================
// IDENTITAS SANITY BMA
//
// Dikunci langsung agar tidak tertukar dengan project lama
// yang mungkin masih tersimpan di environment Vercel.
// ============================================================

export const SANITY_PROJECT_ID = 'im4qx3kd';
export const SANITY_DATASET = 'production';
export const SANITY_API_VERSION = '2026-08-01';

// ============================================================
// CONFIG DASAR
// ============================================================

const sanityConfig = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
};

// ============================================================
// CLIENT PUBLIC
//
// Digunakan untuk:
// - Homepage
// - Campaign
// - News
// - Hero
// - Sitemap
// - Data published lainnya
//
// Menggunakan CDN untuk efisiensi request.
// ============================================================

export const clientPublik = createClient({
  ...sanityConfig,

  useCdn: true,

  perspective: 'published',
});

// ============================================================
// CLIENT SERVER / REALTIME
//
// Digunakan ketika ingin membaca data published terbaru
// tanpa menunggu CDN.
//
// Tidak memakai token.
// ============================================================

export const clientServer = createClient({
  ...sanityConfig,

  useCdn: false,

  perspective: 'published',
});

// ============================================================
// CLIENT INTERNAL / WRITE
//
// Hanya untuk operasi server-side yang benar-benar membutuhkan
// create / update / patch / delete.
//
// JANGAN gunakan client ini di Client Component.
// Token harus server-only.
// ============================================================

export const clientInternal = createClient({
  ...sanityConfig,

  useCdn: false,

  perspective: 'published',

  token:
    process.env.SANITY_API_WRITE_TOKEN,

  ignoreBrowserTokenWarning: true,
});

// ============================================================
// IMAGE URL BUILDER
// ============================================================

const builder =
  createImageUrlBuilder(
    clientPublik
  );

// ============================================================
// URL FOR IMAGE
//
// Contoh:
// urlFor(program.image)
//   .width(1200)
//   .height(630)
//   .quality(90)
//   .url()
// ============================================================

export function urlFor(
  source: Image | any
) {
  return builder.image(source);
}

// ============================================================
// HELPER DEBUG
//
// Bisa dipakai sementara untuk memastikan aplikasi benar-benar
// membaca project BMA.
// ============================================================

export const sanityInfo = {
  projectId:
    SANITY_PROJECT_ID,

  dataset:
    SANITY_DATASET,

  apiVersion:
    SANITY_API_VERSION,
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default clientPublik;