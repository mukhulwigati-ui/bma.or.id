// app/peta-situs/page.tsx
export const dynamic = 'force-dynamic';

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@sanity/client';
import {
  Map,
  Home,
  Calculator,
  BarChart3,
  Building2,
  MessageCircle,
  FolderOpen,
  Newspaper,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_URL = 'https://bma.or.id';
const SITE_LOCATION = 'Jepara';

// ============================================================
// SANITY CLIENT
// ============================================================
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_SANITY_PROJECT_ID belum disetel di environment variables.'
  );
}

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-06-20',
  useCdn: false,
});

// ============================================================
// SEO METADATA
// ============================================================
export const metadata: Metadata = {
  title: 'Peta Situs Resmi | Baitul Maal Al Muttaqin',
  description:
    'Peta situs resmi Baitul Maal Al Muttaqin di bma.or.id. Temukan seluruh halaman utama, program donasi, zakat, infak, sedekah, wakaf, fundraiser, berita, dan layanan BMA Jepara.',
  keywords: [
    'peta situs bma',
    'sitemap bma.or.id',
    'Baitul Maal Al Muttaqin',
    'baitul maal jepara',
    'program donasi jepara',
    'zakat jepara',
    'sedekah jepara',
    'wakaf jepara',
  ],
  alternates: {
    canonical: `${SITE_URL}/peta-situs`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Peta Situs Resmi | Baitul Maal Al Muttaqin',
    description:
      'Akses struktur halaman, program kebaikan, berita, dan layanan resmi Baitul Maal Al Muttaqin.',
    url: `${SITE_URL}/peta-situs`,
    siteName: SITE_NAME,
    locale: 'id_ID',
    type: 'website',
  },
};

interface SitemapItem {
  title: string;
  slug: string;
  _createdAt?: string;
}

interface CorePageItem {
  title: string;
  url: string;
  description: string;
  icon: React.ElementType;
}

export default async function PetaSitusPage() {
  let programs: SitemapItem[] = [];
  let news: SitemapItem[] = [];

  try {
    const query = `{
      "programs": *[
        _type == "program" &&
        defined(slug.current)
      ] | order(_createdAt desc) {
        title,
        "slug": slug.current,
        _createdAt
      },

      "news": *[
        _type == "news" &&
        defined(slug.current)
      ] | order(publishedAt desc) {
        title,
        "slug": slug.current,
        _createdAt
      }
    }`;

    const data =
      await sanityClient.fetch(query);

    programs =
      Array.isArray(data?.programs)
        ? data.programs
        : [];

    news =
      Array.isArray(data?.news)
        ? data.news
        : [];
  } catch (error) {
    console.error(
      'Gagal memuat data peta situs:',
      error
    );
  }

  const halamanInti: CorePageItem[] = [
    {
      title: 'Beranda',
      url: '/',
      description:
        'Halaman utama Baitul Maal Al Muttaqin.',
      icon: Home,
    },
    {
      title: 'Kalkulator Zakat',
      url: '/zakat',
      description:
        'Hitung estimasi zakat secara digital.',
      icon: Calculator,
    },
    {
      title: 'Fundraiser & Statistik',
      url: '/fundraiser/stats',
      description:
        'Pantau performa fundraiser dan referral.',
      icon: BarChart3,
    },
    {
      title: 'Tentang Kami',
      url: '/tentang-kami',
      description:
        'Profil dan informasi Baitul Maal Al Muttaqin.',
      icon: Building2,
    },
    {
      title: 'Hubungi Kami',
      url: '/kontak',
      description:
        'Layanan informasi dan kontak resmi BMA.',
      icon: MessageCircle,
    },
    {
      title: 'FAQ',
      url: '/faq',
      description:
        'Jawaban atas pertanyaan yang sering diajukan.',
      icon: Sparkles,
    },
    {
      title: 'Pusat Bantuan',
      url: '/bantuan',
      description:
        'Panduan layanan pengguna bma.or.id.',
      icon: ShieldCheck,
    },
    {
      title: 'Kebijakan Privasi',
      url: '/kebijakan-privasi',
      description:
        'Informasi perlindungan dan pengelolaan data.',
      icon: ShieldCheck,
    },
  ];

  const totalUrls =
    halamanInti.length +
    programs.length +
    news.length;

  return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-5 pb-28 sm:py-10">
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* =====================================================
            PREMIUM HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[30px] bg-[#102a43] shadow-[0_20px_55px_rgba(16,42,67,0.18)]">

          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-white/8" />

          <div className="absolute right-4 bottom-[-80px] w-44 h-44 rounded-full border border-[#d7b66a]/15" />

          <div className="relative z-10 p-5 sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg">
                  <Map className="w-5 h-5 text-[#d7b66a]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    {SITE_SHORT_NAME} Navigation
                  </p>

                  <h1 className="mt-1 text-[18px] font-bold tracking-tight text-white">
                    Peta Situs Resmi
                  </h1>
                </div>

              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-2.5 py-1.5">
                <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

                <span className="text-[7px] font-bold uppercase tracking-wider text-[#e7d5a4]">
                  Sitemap
                </span>
              </div>

            </div>

            <p className="mt-5 text-[10px] leading-relaxed text-slate-300">
              Temukan seluruh halaman, program kebaikan,
              berita, dan layanan digital resmi
              Baitul Maal Al Muttaqin melalui satu
              direktori yang terstruktur.
            </p>

            <div className="mt-4 flex items-center gap-1.5">

              <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#e7d5a4]">
                {SITE_DOMAIN} • {SITE_LOCATION}
              </span>

            </div>

          </div>

          <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#e0c37e] to-[#a37c32]" />

        </section>

        {/* =====================================================
            INFO CARD
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[26px] bg-white border border-slate-200/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#f7f2e7]" />

          <div className="relative z-10">

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Direktori Website
            </p>

            <h2 className="mt-1 text-[14px] font-bold text-[#102a43]">
              Navigasi Terstruktur bma.or.id
            </h2>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
              Halaman peta situs ini membantu pengguna
              menemukan konten sekaligus memudahkan
              mesin pencari memahami struktur halaman
              publik di {SITE_DOMAIN}.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">

              <div className="rounded-2xl border border-slate-100 bg-[#fafaf8] p-3 text-center">
                <p className="text-[15px] font-bold text-[#102a43]">
                  {halamanInti.length}
                </p>

                <p className="mt-1 text-[7px] font-bold uppercase tracking-wider text-slate-400">
                  Halaman
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-[#fafaf8] p-3 text-center">
                <p className="text-[15px] font-bold text-[#102a43]">
                  {programs.length}
                </p>

                <p className="mt-1 text-[7px] font-bold uppercase tracking-wider text-slate-400">
                  Program
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-[#fafaf8] p-3 text-center">
                <p className="text-[15px] font-bold text-[#102a43]">
                  {news.length}
                </p>

                <p className="mt-1 text-[7px] font-bold uppercase tracking-wider text-slate-400">
                  Berita
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            HALAMAN INTI
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="px-5 py-4 border-b border-slate-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Struktur Utama
                </p>

                <h2 className="mt-0.5 text-[13px] font-bold text-[#102a43]">
                  Halaman & Fitur
                </h2>
              </div>

            </div>

          </div>

          <div className="divide-y divide-slate-100">

            {halamanInti.map(
              (item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    className="group flex items-start gap-3 px-5 py-4 hover:bg-[#fafaf8] transition"
                  >

                    <div className="w-9 h-9 shrink-0 rounded-xl bg-slate-50 group-hover:bg-[#f7f2e7] flex items-center justify-center transition">
                      <Icon className="w-4 h-4 text-[#102a43] group-hover:text-[#a37c32] transition" />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-3">

                        <h3 className="text-[11px] font-bold text-[#102a43]">
                          {item.title}
                        </h3>

                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-300 group-hover:text-[#a37c32] transition" />

                      </div>

                      <p className="mt-1 text-[8px] leading-relaxed text-slate-400">
                        {item.description}
                      </p>

                      <p className="mt-1.5 text-[7px] font-mono text-slate-300 truncate">
                        {`${SITE_URL}${item.url === '/' ? '' : item.url}`}
                      </p>

                    </div>

                  </Link>
                );
              }
            )}

          </div>

        </section>

        {/* =====================================================
            PROGRAM KEBaIKAN
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="px-5 py-4 border-b border-slate-100">

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#a37c32]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Campaign
                  </p>

                  <h2 className="mt-0.5 text-[13px] font-bold text-[#102a43]">
                    Program Kebaikan
                  </h2>
                </div>

              </div>

              <span className="inline-flex items-center rounded-full bg-[#f7f2e7] border border-[#eadfca] px-2.5 py-1 text-[8px] font-bold text-[#98752d]">
                {programs.length}
              </span>

            </div>

          </div>

          {programs.length > 0 ? (
            <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100">

              {programs.map(
                (item) => (
                  <Link
                    key={item.slug}
                    href={`/campaign/${item.slug}`}
                    className="group block px-5 py-4 hover:bg-[#fafaf8] transition"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0 flex-1">

                        <h3 className="text-[11px] font-bold leading-snug text-[#102a43] group-hover:text-[#a37c32] transition">
                          {item.title}
                        </h3>

                        <p className="mt-1.5 text-[7px] font-mono text-slate-300 truncate">
                          {`${SITE_URL}/campaign/${item.slug}`}
                        </p>

                      </div>

                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-300 group-hover:text-[#a37c32] transition" />

                    </div>

                  </Link>
                )
              )}

            </div>
          ) : (
            <div className="px-5 py-10 text-center">

              <FolderOpen className="w-7 h-7 text-slate-200 mx-auto" />

              <p className="mt-3 text-[9px] text-slate-400">
                Belum ada program kampanye aktif.
              </p>

            </div>
          )}

        </section>

        {/* =====================================================
            BERITA
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="px-5 py-4 border-b border-slate-100">

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                  <Newspaper className="w-4 h-4 text-[#a37c32]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Informasi
                  </p>

                  <h2 className="mt-0.5 text-[13px] font-bold text-[#102a43]">
                    Berita & Kabar
                  </h2>
                </div>

              </div>

              <span className="inline-flex items-center rounded-full bg-[#f7f2e7] border border-[#eadfca] px-2.5 py-1 text-[8px] font-bold text-[#98752d]">
                {news.length}
              </span>

            </div>

          </div>

          {news.length > 0 ? (
            <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100">

              {news.map(
                (item) => (
                  <Link
                    key={item.slug}
                    href={`/news/${item.slug}`}
                    className="group block px-5 py-4 hover:bg-[#fafaf8] transition"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0 flex-1">

                        <h3 className="text-[11px] font-bold leading-snug text-[#102a43] group-hover:text-[#a37c32] transition">
                          {item.title}
                        </h3>

                        <p className="mt-1.5 text-[7px] font-mono text-slate-300 truncate">
                          {`${SITE_URL}/news/${item.slug}`}
                        </p>

                      </div>

                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-300 group-hover:text-[#a37c32] transition" />

                    </div>

                  </Link>
                )
              )}

            </div>
          ) : (
            <div className="px-5 py-10 text-center">

              <Newspaper className="w-7 h-7 text-slate-200 mx-auto" />

              <p className="mt-3 text-[9px] text-slate-400">
                Belum ada artikel berita diterbitkan.
              </p>

            </div>
          )}

        </section>

        {/* =====================================================
            INDEX SUMMARY
        ====================================================== */}
        <section className="rounded-[22px] border border-[#eadfca] bg-[#f7f2e7]/60 p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <div>

              <p className="text-[9px] font-bold text-[#102a43]">
                {totalUrls} URL Terpetakan
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                Daftar program dan berita pada halaman
                ini dimuat secara otomatis dari Sanity
                CMS project {SITE_DOMAIN}.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <div className="pt-2 pb-3 text-center">

          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-300">
            {SITE_NAME}
          </p>

          <p className="mt-1 text-[7px] text-slate-300">
            © {new Date().getFullYear()} {SITE_DOMAIN} • {SITE_LOCATION}
          </p>

        </div>

      </div>
    </div>
  );
}