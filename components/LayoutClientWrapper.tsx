// components/LayoutClientWrapper.tsx

'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  usePathname,
} from 'next/navigation';

import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

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

const SITE_NAME =
  'Baitul Maal Al Muttaqin';

const SITE_SHORT_NAME =
  'BMA';

const SITE_DOMAIN =
  'bma.or.id';

const SITE_LOCATION =
  'Jepara';

// ============================================================
// TYPES
// ============================================================

interface LayoutClientWrapperProps {
  children:
    React.ReactNode;
}

interface BeforeInstallPromptEvent
  extends Event {
  prompt:
    () => Promise<void>;

  userChoice:
    Promise<{
      outcome:
        | 'accepted'
        | 'dismissed';

      platform:
        string;
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

  // ==========================================================
  // PATH CHECK
  // ==========================================================

  const isStudioPage =
    pathname?.startsWith(
      '/studio'
    );

  const isHomePage =
    pathname === '/';

  const isLoginPage =
    pathname ===
      '/login' ||
    pathname?.startsWith(
      '/login/'
    );

  const isAuthPage =
    pathname?.startsWith(
      '/auth/'
    );

  // ==========================================================
  // HALAMAN YANG TIDAK BOLEH MEMUNCULKAN BOTTOM NAV
  //
  // Ini penting supaya modal login dari BottomNav tidak
  // muncul lagi di halaman login / OAuth callback.
  // ==========================================================

  const hideBottomNav =
    isStudioPage ||
    isLoginPage ||
    isAuthPage;

  const hideHeader =
    isStudioPage;

  // ==========================================================
  // PWA STATE
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
  // CEK STANDALONE PWA
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
  // CLEAR TIMERS
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
  // PWA PROMPT
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
      isStudioPage ||
      isLoginPage ||
      isAuthPage
    ) {
      setShowPrompt(
        false
      );

      return;
    }

    // ========================================================
    // JIKA SUDAH PWA
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
    // DEVICE DETECTION
    // ========================================================

    const userAgent =
      window.navigator
        .userAgent
        .toLowerCase();

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
    // SESSION CLOSE
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
    // SHOW
    // ========================================================

    const checkAndShow =
      () => {
        if (
          isRunningStandalone()
        ) {
          return;
        }

        const closed =
          sessionStorage.getItem(
            'bma_pwa_prompt_closed'
          );

        if (
          closed ===
          'true'
        ) {
          return;
        }

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
    // ANDROID
    // ========================================================

    const handleBeforeInstallPrompt =
      (
        event:
          Event
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
    // INSTALLED
    // ========================================================

    const handleAppInstalled =
      () => {
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
    isLoginPage,
    isAuthPage,
  ]);

  // ==========================================================
  // INSTALL
  // ==========================================================

  const handleInstallClick =
    async () => {
      if (
        isIOS
      ) {
        setShowIOSGuide(
          true
        );

        return;
      }

      if (
        !deferredPrompt
      ) {
        return;
      }

      try {
        await deferredPrompt.prompt();

        await deferredPrompt
          .userChoice;
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
  // CLOSE PWA
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
      ====================================================== */}

      {!hideHeader && (
        <Header />
      )}

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className="flex-grow">
        {children}
      </main>

      {/* ======================================================
          BOTTOM NAV

          TIDAK ADA DI:
          /login
          /auth/*
          /studio/*
      ====================================================== */}

      {!hideBottomNav && (
        <BottomNav />
      )}

      {/* ======================================================
          PWA MODAL
      ====================================================== */}

      {isHomePage &&
        !isStudioPage &&
        !isLoginPage &&
        !isAuthPage &&
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

            <button
              type="button"
              onClick={
                handleClose
              }
              className="absolute inset-0 cursor-default"
              aria-label="Tutup modal instalasi"
            />

            <section
              className="
                relative
                z-10
                w-full
                max-w-sm
                overflow-hidden
                border
                border-[#cfcfc9]
                bg-white
                shadow-[0_24px_60px_rgba(0,0,0,0.22)]
              "
            >

              {/* HEADER */}

              <div
                className="
                  relative
                  border-b
                  border-[#d4b300]
                  bg-[#ffd600]
                  px-5
                  py-5
                "
              >

                <div className="absolute left-0 top-0 h-[4px] w-full bg-[#2e2e2e]" />

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
                  "
                  aria-label="Tutup"
                >
                  <X className="h-4 w-4" />
                </button>

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

                <div className="mt-4 pr-10">

                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-black/55">
                    Aplikasi Resmi {SITE_SHORT_NAME}
                  </p>

                  <h2 className="mt-1 text-[21px] font-extrabold text-[#303030]">
                    Install {SITE_DOMAIN}
                  </h2>

                  <p className="mt-2 text-[12px] font-medium text-[#514b31]">
                    {SITE_NAME}
                    {' • '}
                    {SITE_LOCATION}
                  </p>

                </div>

              </div>

              {/* CONTENT */}

              <div className="space-y-5 p-5">

                {showIOSGuide ? (
                  <>

                    <div>

                      <div className="flex items-center gap-2">

                        <Share2 className="h-5 w-5 text-[#555555]" />

                        <h3 className="text-[15px] font-bold text-[#3d3d3d]">
                          Tambahkan ke Layar Utama
                        </h3>

                      </div>

                      <p className="mt-3 text-[13px] leading-[1.75] text-[#666666]">
                        Ketuk tombol Bagikan di Safari,
                        kemudian pilih Tambah ke Layar Utama.
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleClose
                      }
                      className="
                        w-full
                        border
                        border-[#cccccc]
                        bg-[#efefed]
                        px-4
                        py-3.5
                        text-[12px]
                        font-bold
                        uppercase
                        text-[#4a4a4a]
                      "
                    >
                      Mengerti
                    </button>

                  </>
                ) : (
                  <>

                    <div>

                      <h3 className="text-[15px] font-bold text-[#3d3d3d]">
                        Akses BMA lebih mudah dari HP
                      </h3>

                      <p className="mt-2 text-[13px] leading-[1.75] text-[#666666]">
                        Pasang {SITE_DOMAIN} untuk mengakses program BMA lebih cepat.
                      </p>

                    </div>

                    <div className="border border-[#e0e0dc] bg-[#f5f5f2] p-4">

                      <div className="flex items-start gap-3">

                        <ShieldCheck className="mt-0.5 h-5 w-5 text-[#666666]" />

                        <p className="text-[12px] leading-[1.7] text-[#5f5f5f]">
                          Terhubung langsung dengan layanan resmi {SITE_NAME}.
                        </p>

                      </div>

                    </div>

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
                        border-[#c7a700]
                        bg-[#ffd600]
                        px-4
                        py-4
                        text-[12px]
                        font-extrabold
                        uppercase
                        text-[#292929]
                        disabled:bg-[#e6e6e3]
                        disabled:text-[#999999]
                      "
                    >

                      <Download className="h-[18px] w-[18px]" />

                      {isIOS
                        ? 'Cara Install di iPhone'
                        : deferredPrompt
                        ? 'Install Aplikasi BMA'
                        : 'Belum Tersedia untuk Install'}

                    </button>

                  </>
                )}

              </div>

            </section>

          </div>
        )}

    </>
  );
}