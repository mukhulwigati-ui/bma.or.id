'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const STORAGE_PREFIX = 'bma:ref-view:';
const DEDUPE_HOURS = 6;
const DEDUPE_MS =
  DEDUPE_HOURS * 60 * 60 * 1000;

function cleanReferral(
  value: string | null
) {
  if (!value) return '';

  return value
    .replace(/[^0-9]/g, '')
    .slice(0, 30);
}

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const referral =
      cleanReferral(
        searchParams.get('ref')
      );

    if (!referral) {
      return;
    }

    const storageKey =
      `${STORAGE_PREFIX}${referral}`;

    let shouldCount = true;

    try {
      const previous =
        localStorage.getItem(
          storageKey
        );

      if (previous) {
        const previousTime =
          Number(previous);

        if (
          Number.isFinite(previousTime) &&
          Date.now() - previousTime <
            DEDUPE_MS
        ) {
          shouldCount = false;
        }
      }
    } catch {
      // localStorage mungkin diblokir browser.
    }

    if (!shouldCount) {
      return;
    }

    const registerView = async () => {
      try {
        const response =
          await fetch(
            '/api/views',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                type: 'referral',
                slug: referral,
              }),

              cache: 'no-store',
            }
          );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success &&
          data.counted !== false
        ) {
          try {
            localStorage.setItem(
              storageKey,
              String(Date.now())
            );
          } catch {
            // Abaikan error localStorage.
          }
        }
      } catch (error) {
        console.error(
          '[REFERRAL VIEW] Gagal mencatat view:',
          error
        );
      }
    };

    void registerView();
  }, [searchParams]);

  return null;
}