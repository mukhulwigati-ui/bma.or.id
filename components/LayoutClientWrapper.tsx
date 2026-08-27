// components/LayoutClientWrapper.tsx
'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

import {
  CheckCircle2,
  Download,
  Share2,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';

// ============================================================
// IDENTITAS BMA
// ============================================================

const SITE_NAME = 'Baitul Maal Al Muttaqin';
const SITE_SHORT_NAME = 'BMA';
const SITE_DOMAIN = 'bma.or.id';
const SITE_LOCATION = 'Jepara';

// ============================================================
// TYPES
// ============================================================

interface LayoutClientWrapperProps {
  children: React.ReactNode;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;

  userChoice: Promise<{
    outcome:
      | 'accepted'
      | 'dismissed';

    platform: string;
  }>;
}

// ============================================================
// COMPONENT
// ============================================================

export default function LayoutClientWrapper({
  children,
}: LayoutClientWrapperProps) {
  const pathname =
    usePathname();

  const isStudioPage =
    pathname?.startsWith(
      '/studio'
    );

  const isHomePage =
    pathname === '/';

  // ==========================================================
  // PWA STATES
  // ==========================================================

  const [
    deferredPrompt,
    setDeferredPrompt,
  ] =
    useState<BeforeInstallPromptEvent | null>(
      null
    );

  const [
    showPrompt,
    setShowPrompt,
  ] =
    useState(false);

  const [
    isIOS,
    setIsIOS,
  ] =
    useState(false);

  const [
    showIOSGuide,
    setShowIOSGuide,
  ] =
    useState(false);

  const [
    hasClosedPrompt,
    setHasClosedPrompt,
  ] =
    useState(false);

  const timerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const retryTimerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  // ==========================================================
  // HELPER: APAKAH PWA SUDAH BERJALAN STANDALONE?
  // ==========================================================

  const isRunningStandalone =
    () => {
      if (
        typeof window ===
        'undefined'
      ) {
        return false;
      }

      const standalone =
        window.matchMedia(
          '(display-mode: standalone)'
        ).matches;

      const iosStandalone =
        Boolean(
          (
            window.navigator as Navigator & {
              standalone?: boolean;
            }
          ).standalone
        );

      return (
        standalone ||
        iosStandalone
      );
    };

  // ==========================================================
  // HELPER: BERSIHKAN TIMER
  // ==========================================================

  const clearTimers =
    () => {
      if (
        timerRef.current
      ) {
        clearTimeout(
          timerRef.current
        );

        timerRef.current =
          null;
      }

      if (
        retryTimerRef.current
      ) {
        clearTimeout(
          retryTimerRef.current
        );

        retryTimerRef.current =
          null;
      }
    };

  // ==========================================================
  // PWA PROMPT EFFECT
  // ==========================================================

  useEffect(() => {
    if (
      typeof window ===
        'undefined' ||
      typeof document ===
        'undefined'
    ) {
      return;
    }

    clearTimers();

    // ========================================================
    // HANYA HOMEPAGE
    // ========================================================

    if (
      !isHomePage ||
      isStudioPage
    ) {
      setShowPrompt(
        false
      );

      return;
    }

    // ========================================================
    // JANGAN TAMPILKAN JIKA SUDAH STANDALONE
    // ========================================================

    if (
      isRunningStandalone()
    ) {
      setShowPrompt(
        false
      );

      return;
    }

    // ========================================================
    // DETEKSI DEVICE
    // ========================================================

    const userAgent =
      window.navigator.userAgent.toLowerCase();

    const isMobileDevice =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );

    if (
      !isMobileDevice
    ) {
      setShowPrompt(
        false
      );

      return;
    }

    // ========================================================
    // SESSION CLOSED
    // ========================================================

    const closedInSession =
      sessionStorage.getItem(
        'bma_pwa_prompt_closed'
      );

    if (
      closedInSession ===
      'true'
    ) {
      setHasClosedPrompt(
        true
      );

      setShowPrompt(
        false
      );

      return;
    }

    const isIOSDevice =
      /iphone|ipad|ipod/i.test(
        userAgent
      );

    setIsIOS(
      isIOSDevice
    );

    // ========================================================
    // CEK MODAL LAIN
    // ========================================================

    const checkAndShow =
      () => {
        if (
          isRunningStandalone()
        ) {
          setShowPrompt(
            false
          );

          return;
        }

        const closed =
          sessionStorage.getItem(
            'bma_pwa_prompt_closed'
          );

        if (
          closed === 'true'
        ) {
          return;
        }

        // Hindari tabrakan dengan modal lain
        const activeModals =
          document.querySelectorAll(
            '[data-app-modal="true"]'
          );

        if (
          activeModals.length ===
          0
        ) {
          setShowPrompt(
            true
          );

          return;
        }

        retryTimerRef.current =
          setTimeout(
            checkAndShow,
            1500
          );
      };

    // ========================================================
    // IOS
    //
    // iOS tidak memakai beforeinstallprompt.
    // ========================================================

    if (
      isIOSDevice
    ) {
      timerRef.current =
        setTimeout(
          checkAndShow,
          10000
        );
    }

    // ========================================================
    // ANDROID / CHROME
    // ========================================================

    const handleBeforeInstallPrompt =
      (
        event: Event
      ) => {
        event.preventDefault();

        const installEvent =
          event as BeforeInstallPromptEvent;

        setDeferredPrompt(
          installEvent
        );

        clearTimers();

        timerRef.current =
          setTimeout(
            checkAndShow,
            10000
          );
      };

    // ========================================================
    // APP INSTALLED
    // ========================================================

    const handleAppInstalled =
      () => {
        console.log(
          '✅ PWA BMA berhasil diinstal'
        );

        setDeferredPrompt(
          null
        );

        setShowPrompt(
          false
        );

        setShowIOSGuide(
          false
        );

        setHasClosedPrompt(
          true
        );

        sessionStorage.setItem(
          'bma_pwa_prompt_closed',
          'true'
        );

        clearTimers();
      };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      'appinstalled',
      handleAppInstalled
    );

    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {
      clearTimers();

      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        'appinstalled',
        handleAppInstalled
      );
    };
  }, [
    isHomePage,
    isStudioPage,
  ]);

  // ==========================================================
  // INSTALL
  // ==========================================================

  const handleInstallClick =
    async () => {
      // ======================================================
      // IOS
      // ======================================================

      if (isIOS) {
        setShowIOSGuide(
          true
        );

        return;
      }

      // ======================================================
      // ANDROID
      // ======================================================

      if (
        !deferredPrompt
      ) {
        return;
      }

      try {
        await deferredPrompt.prompt();

        const {
          outcome,
        } =
          await deferredPrompt.userChoice;

        if (
          outcome ===
          'accepted'
        ) {
          console.log(
            '✅ User menerima instalasi PWA BMA'
          );
        } else {
          console.log(
            'ℹ️ User membatalkan instalasi PWA BMA'
          );
        }
      } catch (
        error
      ) {
        console.error(
          'PWA install error:',
          error
        );
      } finally {
        setDeferredPrompt(
          null
        );

        setShowPrompt(
          false
        );

        setHasClosedPrompt(
          true
        );

        sessionStorage.setItem(
          'bma_pwa_prompt_closed',
          'true'
        );
      }
    };

  // ==========================================================
  // CLOSE
  // ==========================================================

  const handleClose =
    () => {
      clearTimers();

      setShowPrompt(
        false
      );

      setShowIOSGuide(
        false
      );

      setHasClosedPrompt(
        true
      );

      sessionStorage.setItem(
        'bma_pwa_prompt_closed',
        'true'
      );
    };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>

      {/* ======================================================
          HEADER

          Header tidak ditampilkan di Sanity Studio.
      ====================================================== */}

      {!isStudioPage && (
        <Header />
      )}

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="flex-grow">
        {children}
      </main>

      {/* ======================================================
          PWA INSTALL MODAL
      ====================================================== */}

      {isHomePage &&
        !isStudioPage &&
        showPrompt &&
        !hasClosedPrompt && (

          <div
            data-app-modal="true"
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-black/50
              px-4
              py-6
              backdrop-blur-[2px]
            "
          >

            {/* BACKDROP */}
            <button
              type="button"
              onClick={
                handleClose
              }
              className="absolute inset-0 cursor-default"
              aria-label="Tutup modal instalasi"
            />

            {/* =================================================
                MODAL
            ================================================== */}

            <section
              className="
                relative
                z-10
                w-full
                max-w-sm
                overflow-hidden
                border
                border-[#CFCFC9]
                bg-white
                shadow-[0_24px_60px_rgba(0,0,0,0.22)]
              "
            >

              {/* ===============================================
                  HEADER KUNING BMA
              =============================================== */}

              <div
                className="
                  relative
                  border-b
                  border-[#D4B300]
                  bg-[#FFD600]
                  px-5
                  py-5
                "
              >

                {/* TOP DARK LINE */}
                <div className="absolute left-0 top-0 h-[4px] w-full bg-[#2E2E2E]" />

                {/* CLOSE */}
                <button
                  type="button"
                  onClick={
                    handleClose
                  }
                  className="
                    absolute
                    right-3
                    top-3
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    border
                    border-black/15
                    bg-white/55
                    text-[#555555]
                    transition
                    hover:bg-white
                    hover:text-black
                  "
                  aria-label="Tutup"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* ICON */}
                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    border
                    border-black/15
                    bg-white/55
                  "
                >
                  <Smartphone className="h-6 w-6 text-[#333333]" />
                </div>

                {/* BRAND */}
                <div className="mt-4 pr-10">

                  <p
                    className="
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-[0.16em]
                      text-black/55
                    "
                  >
                    Aplikasi Resmi {SITE_SHORT_NAME}
                  </p>

                  <h2
                    className="
                      mt-1
                      text-[21px]
                      font-extrabold
                      leading-tight
                      tracking-tight
                      text-[#303030]
                    "
                  >
                    Install {SITE_DOMAIN}
                  </h2>

                  <p
                    className="
                      mt-2
                      text-[12px]
                      font-medium
                      leading-[1.65]
                      text-[#514B31]
                    "
                  >
                    {SITE_NAME}
                    {' • '}
                    {SITE_LOCATION}
                  </p>

                </div>

              </div>

              {/* ===============================================
                  CONTENT
              =============================================== */}

              <div className="space-y-5 p-5">

                {showIOSGuide ? (
                  <>
                    {/* IOS GUIDE */}

                    <div>

                      <div className="flex items-center gap-2">

                        <Share2 className="h-5 w-5 text-[#555555]" />

                        <h3 className="text-[15px] font-bold text-[#3D3D3D]">
                          Tambahkan ke Layar Utama
                        </h3>

                      </div>

                      <p className="mt-3 text-[13px] leading-[1.75] text-[#666666]">
                        Di Safari, ketuk tombol
                        {' '}
                        <strong className="font-bold text-[#444444]">
                          Bagikan
                        </strong>
                        , kemudian pilih
                        {' '}
                        <strong className="font-bold text-[#444444]">
                          Tambah ke Layar Utama
                        </strong>
                        {' '}
                        atau
                        {' '}
                        <strong className="font-bold text-[#444444]">
                          Add to Home Screen
                        </strong>
                        .
                      </p>

                    </div>

                    <div
                      className="
                        border
                        border-[#D8D8D3]
                        bg-[#EEEEEB]
                        p-4
                      "
                    >

                      <div className="flex items-start gap-3">

                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#555555]" />

                        <p className="text-[12px] leading-[1.7] text-[#5F5F5F]">
                          Setelah ditambahkan, ikon
                          {' '}
                          <strong className="text-[#3F3F3F]">
                            BMA
                          </strong>
                          {' '}
                          akan tersedia langsung di layar utama perangkat Anda.
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleClose
                      }
                      className="
                        w-full
                        border
                        border-[#CCCCCC]
                        bg-[#EFEFED]
                        px-4
                        py-3.5
                        text-[12px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-[#4A4A4A]
                        transition
                        hover:bg-[#E4E4E1]
                      "
                    >
                      Mengerti
                    </button>
                  </>
                ) : (
                  <>
                    {/* =========================================
                        DESCRIPTION
                    ========================================== */}

                    <div>

                      <h3 className="text-[15px] font-bold text-[#3D3D3D]">
                        Akses BMA lebih mudah dari HP
                      </h3>

                      <p
                        className="
                          mt-2
                          text-[13px]
                          leading-[1.75]
                          text-[#666666]
                        "
                      >
                        Pasang
                        {' '}
                        <strong className="font-bold text-[#444444]">
                          {SITE_DOMAIN}
                        </strong>
                        {' '}
                        di perangkat Anda untuk mengakses program zakat, infak, sedekah, wakaf, riwayat donasi, dan layanan BMA dengan lebih cepat.
                      </p>

                    </div>

                    {/* =========================================
                        BENEFIT
                    ========================================== */}

                    <div
                      className="
                        border-y
                        border-[#E0E0DC]
                        bg-[#F5F5F2]
                      "
                    >

                      <div className="flex items-start gap-3 border-b border-[#E0E0DC] px-4 py-3.5">

                        <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-[#666666]" />

                        <div>

                          <p className="text-[12px] font-bold text-[#444444]">
                            Akses Cepat
                          </p>

                          <p className="mt-1 text-[11px] leading-relaxed text-[#777777]">
                            Buka BMA langsung dari layar utama tanpa mengetik alamat website.
                          </p>

                        </div>

                      </div>

                      <div className="flex items-start gap-3 px-4 py-3.5">

                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#666666]" />

                        <div>

                          <p className="text-[12px] font-bold text-[#444444]">
                            Aplikasi Resmi
                          </p>

                          <p className="mt-1 text-[11px] leading-relaxed text-[#777777]">
                            Terhubung langsung dengan layanan digital resmi {SITE_NAME}.
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* =========================================
                        INSTALL BUTTON
                    ========================================== */}

                    <button
                      type="button"
                      onClick={
                        handleInstallClick
                      }
                      disabled={
                        !isIOS &&
                        !deferredPrompt
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2.5
                        border
                        border-[#C7A700]
                        bg-[#FFD600]
                        px-4
                        py-4
                        text-[12px]
                        font-extrabold
                        uppercase
                        tracking-[0.12em]
                        text-[#292929]
                        shadow-[0_5px_12px_rgba(120,100,0,0.12)]
                        transition
                        hover:bg-[#F2CA00]
                        disabled:cursor-not-allowed
                        disabled:border-[#D5D5D0]
                        disabled:bg-[#E6E6E3]
                        disabled:text-[#999999]
                        disabled:shadow-none
                      "
                    >
                      <Download className="h-[18px] w-[18px]" />

                      {isIOS
                        ? 'Cara Install di iPhone'
                        : deferredPrompt
                        ? 'Install Aplikasi BMA'
                        : 'Belum Tersedia untuk Install'}
                    </button>

                    {/* =========================================
                        FOOTER NOTE
                    ========================================== */}

                    <p
                      className="
                        text-center
                        text-[10px]
                        leading-relaxed
                        text-[#999999]
                      "
                    >
                      Instalasi tidak memerlukan unduhan melalui Play Store.
                    </p>

                  </>
                )}

              </div>

            </section>

          </div>
        )}

    </>
  );
}