// app/tentang-kami/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  HandHeart,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react';

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';
const SITE_REGION = 'Jawa Tengah';

export const metadata: Metadata = {
  title: 'Tentang Kami | Baitul Maal Al Muttaqin Jepara',
  description:
    'Mengenal lebih dekat Baitul Maal Al Muttaqin (bma.or.id), lembaga yang berkhidmat dalam penghimpunan dan penyaluran zakat, infak, sedekah, wakaf, pendidikan, dakwah, serta program sosial kemanusiaan di Jepara.',
  keywords: [
    'Baitul Maal Al Muttaqin',
    'BMA Jepara',
    'bma.or.id',
    'baitul maal jepara',
    'lembaga sosial jepara',
    'zakat jepara',
    'sedekah jepara',
    'infak jepara',
    'wakaf jepara',
    'donasi online jepara',
  ],
  alternates: {
    canonical: '/tentang-kami',
  },
};

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-5 pb-28 sm:py-10">
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* =====================================================
            PREMIUM HERO
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#102a43] shadow-[0_22px_60px_rgba(16,42,67,0.2)]">

          <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full border border-white/8" />

          <div className="absolute right-5 bottom-[-90px] w-48 h-48 rounded-full border border-[#d7b66a]/15" />

          <div className="absolute left-[-55px] bottom-[-60px] w-40 h-40 rounded-full bg-[#d7b66a]/5 blur-2xl" />

          <div className="relative z-10 p-6 sm:p-7">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg">
                  <Building2 className="w-5 h-5 text-[#d7b66a]" />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#d7b66a]">
                    Profil {SITE_SHORT_NAME}
                  </p>

                  <h1 className="mt-1 text-[18px] font-bold tracking-tight text-white">
                    Tentang Kami
                  </h1>
                </div>

              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-2.5 py-1.5">
                <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

                <span className="text-[7px] font-bold uppercase tracking-wider text-[#e7d5a4]">
                  Jepara
                </span>
              </div>

            </div>

            <div className="mt-7">

              <div className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/10 px-3 py-1.5">

                <span className="w-1.5 h-1.5 rounded-full bg-[#d7b66a]" />

                <span className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#e7d5a4]">
                  Amanah • Peduli • Berkelanjutan
                </span>

              </div>

              <h2 className="mt-4 text-[24px] sm:text-[27px] leading-[1.22] font-bold tracking-tight text-white">
                Menghubungkan Amanah,
                <br />
                Menghadirkan Manfaat.
              </h2>

              <p className="mt-4 text-[10px] sm:text-[11px] leading-[1.85] text-slate-300">
                Baitul Maal Al Muttaqin hadir sebagai jembatan kebaikan
                untuk membantu masyarakat menunaikan zakat, infak,
                sedekah, wakaf, serta mendukung berbagai program sosial,
                pendidikan, dakwah, dan kemanusiaan.
              </p>

            </div>

            <div className="mt-5 flex items-center gap-1.5">

              <ShieldCheck className="w-3 h-3 text-[#d7b66a]" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#e7d5a4]">
                {SITE_DOMAIN} • {SITE_LOCATION}, {SITE_REGION}
              </span>

            </div>

          </div>

          <div className="h-[3px] bg-gradient-to-r from-[#a37c32] via-[#e0c37e] to-[#a37c32]" />

        </section>

        {/* =====================================================
            WHO WE ARE
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-white border border-slate-200/70 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#f7f2e7]" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                <HeartHandshake className="w-4 h-4 text-[#a37c32]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Mengenal BMA
                </p>

                <h2 className="mt-0.5 text-[14px] font-bold text-[#102a43]">
                  Siapa Kami?
                </h2>
              </div>

            </div>

            <p className="mt-4 text-[10px] leading-[1.85] text-slate-500">
              <strong className="font-bold text-slate-700">
                {SITE_NAME}
              </strong>{' '}
              adalah lembaga yang berpusat di Jepara dan berkhidmat
              dalam menghimpun serta menyalurkan berbagai bentuk
              dana kebajikan untuk menghadirkan manfaat bagi umat
              dan masyarakat.
            </p>

            <p className="mt-3 text-[10px] leading-[1.85] text-slate-500">
              Melalui {SITE_DOMAIN}, kami berupaya menghadirkan
              layanan digital yang memudahkan masyarakat untuk
              berpartisipasi dalam program zakat, infak, sedekah,
              wakaf, pendidikan, dakwah, sosial, dan kemanusiaan
              secara lebih praktis dan terstruktur.
            </p>

            <p className="mt-3 text-[10px] leading-[1.85] text-slate-500">
              Pemanfaatan teknologi menjadi bagian dari ikhtiar kami
              untuk meningkatkan kualitas pelayanan, pencatatan
              transaksi, penyampaian informasi, serta transparansi
              pelaksanaan program kepada para donatur.
            </p>

          </div>

        </section>

        {/* =====================================================
            FOCUS AREAS
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#a37c32]" />
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Bidang Khidmat
              </p>

              <h2 className="mt-0.5 text-[14px] font-bold text-[#102a43]">
                Program Kebaikan BMA
              </h2>
            </div>

          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">

            {[
              {
                title: 'Zakat',
                desc: 'Mendukung kemudahan penunaian zakat.',
                icon: HandHeart,
              },
              {
                title: 'Infak & Sedekah',
                desc: 'Menguatkan berbagai gerakan sosial.',
                icon: HeartHandshake,
              },
              {
                title: 'Pendidikan',
                desc: 'Mendukung santri dan pendidikan umat.',
                icon: BookOpenCheck,
              },
              {
                title: 'Kemanusiaan',
                desc: 'Membantu masyarakat yang membutuhkan.',
                icon: UsersRound,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-[#fafaf8] p-3.5"
                >

                  <div className="w-8 h-8 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-[#a37c32]" />
                  </div>

                  <h3 className="mt-3 text-[10px] font-bold text-[#102a43]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[8px] leading-relaxed text-slate-400">
                    {item.desc}
                  </p>

                </div>
              );
            })}

          </div>

        </section>

        {/* =====================================================
            VISION
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#102a43] p-5 shadow-[0_16px_45px_rgba(16,42,67,0.14)]">

          <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full border border-white/8" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-[#d7b66a]" />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#d7b66a]">
                  Arah Gerak
                </p>

                <h2 className="mt-0.5 text-[14px] font-bold text-white">
                  Visi Kami
                </h2>
              </div>

            </div>

            <p className="mt-4 text-[10px] leading-[1.85] text-slate-300">
              Menjadi lembaga yang amanah, profesional, dan
              berkelanjutan dalam mengelola potensi zakat, infak,
              sedekah, wakaf, serta gerakan sosial untuk menghadirkan
              manfaat yang lebih luas bagi umat dan masyarakat.
            </p>

          </div>

        </section>

        {/* =====================================================
            MISSION
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#f7f2e7] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#a37c32]" />
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Ikhtiar Kami
              </p>

              <h2 className="mt-0.5 text-[14px] font-bold text-[#102a43]">
                Misi Baitul Maal Al Muttaqin
              </h2>
            </div>

          </div>

          <div className="mt-5 space-y-3">

            {[
              'Memberikan kemudahan kepada masyarakat dalam menunaikan zakat, infak, sedekah, wakaf, dan donasi melalui layanan yang mudah diakses.',
              'Mengembangkan program sosial, pendidikan, dakwah, dan kemanusiaan yang relevan dengan kebutuhan masyarakat.',
              'Meningkatkan kualitas pencatatan, pengelolaan, dan informasi penyaluran dana secara tertib dan transparan.',
              'Mendorong budaya kepedulian, gotong royong, serta keberlanjutan gerakan kebaikan di tengah masyarakat.',
              'Memanfaatkan teknologi digital untuk meningkatkan kualitas pelayanan kepada donatur dan penerima manfaat.',
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-[#fafaf8] p-3.5"
              >

                <div className="w-6 h-6 shrink-0 rounded-full bg-[#f7f2e7] flex items-center justify-center">
                  <span className="text-[8px] font-black text-[#a37c32]">
                    {index + 1}
                  </span>
                </div>

                <p className="text-[9px] leading-[1.75] text-slate-500">
                  {item}
                </p>

              </div>
            ))}

          </div>

        </section>

        {/* =====================================================
            VALUES
        ====================================================== */}
        <section className="rounded-[28px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.05)]">

          <div className="px-5 py-4 border-b border-slate-100">

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Nilai Dasar
            </p>

            <h2 className="mt-1 text-[14px] font-bold text-[#102a43]">
              Prinsip dalam Menjalankan Amanah
            </h2>

          </div>

          <div className="divide-y divide-slate-100">

            {[
              {
                number: '01',
                title: 'Amanah',
                description:
                  'Menjaga setiap titipan masyarakat dengan tanggung jawab dan kehati-hatian.',
              },
              {
                number: '02',
                title: 'Transparan',
                description:
                  'Mendorong pencatatan dan penyampaian informasi program secara terbuka dan terstruktur.',
              },
              {
                number: '03',
                title: 'Profesional',
                description:
                  'Mengembangkan pelayanan dan tata kelola yang rapi, responsif, dan terus ditingkatkan.',
              },
              {
                number: '04',
                title: 'Berkelanjutan',
                description:
                  'Mendorong program yang tidak hanya membantu sesaat, tetapi berupaya menghadirkan dampak jangka panjang.',
              },
            ].map((item) => (
              <div
                key={item.number}
                className="px-5 py-4 flex items-start gap-3"
              >

                <span className="text-[8px] font-black tracking-wider text-[#a37c32]">
                  {item.number}.
                </span>

                <div>
                  <h3 className="text-[10px] font-bold text-[#102a43]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </section>

        {/* =====================================================
            LEGAL / GOVERNANCE INFO
        ====================================================== */}
        <section className="rounded-[24px] border border-[#eadfca] bg-[#f7f2e7]/60 p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#a37c32]" />

            <div>

              <p className="text-[9px] font-bold text-[#102a43]">
                Tata Kelola & Kelembagaan
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                Baitul Maal Al Muttaqin berupaya menjalankan kegiatan
                penghimpunan, pengelolaan, dan penyaluran program
                berdasarkan tata kelola internal, prinsip amanah,
                transparansi, serta ketentuan yang berlaku.
              </p>

              <p className="mt-2 text-[8px] leading-relaxed text-slate-500">
                Informasi legalitas, struktur pengelola, atau dokumen
                kelembagaan dapat ditampilkan lebih lengkap apabila
                telah tersedia pada kanal resmi {SITE_DOMAIN}.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            CTA
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[30px] bg-[#102a43] p-6 text-center shadow-[0_18px_50px_rgba(16,42,67,0.16)]">

          <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full border border-white/8" />

          <div className="relative z-10">

            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto">
              <HandHeart className="w-5 h-5 text-[#d7b66a]" />
            </div>

            <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.18em] text-[#d7b66a]">
              Bersama dalam Kebaikan
            </p>

            <h2 className="mt-1.5 text-[16px] font-bold text-white">
              Mari Hadirkan Manfaat Bersama
            </h2>

            <p className="mt-3 text-[9px] leading-[1.8] text-slate-300">
              Dukungan Anda menjadi bagian dari ikhtiar untuk
              memperluas manfaat bagi masyarakat melalui berbagai
              program Baitul Maal Al Muttaqin.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-2.5">

              <Link
                href="/program"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#d7b66a] hover:bg-[#c8a658] text-[#102a43] font-bold text-[9px] uppercase tracking-[0.15em] py-3.5 transition"
              >
                Lihat Program Kebaikan
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/kontak"
                className="w-full inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/8 hover:bg-white/15 text-white font-bold text-[9px] uppercase tracking-[0.15em] py-3.5 transition"
              >
                Hubungi BMA
              </Link>

            </div>

          </div>

        </section>

        {/* =====================================================
            BRAND FOOTER
        ====================================================== */}
        <div className="pt-2 pb-3 text-center">

          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-300">
            {SITE_NAME}
          </p>

          <p className="mt-1 text-[7px] text-slate-300">
            {SITE_DOMAIN} • {SITE_LOCATION}, {SITE_REGION}
          </p>

        </div>

      </div>
    </div>
  );
}