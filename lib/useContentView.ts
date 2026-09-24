'use client';

import { useEffect, useState } from 'react';

export type ContentViewType =
  | 'blog'
  | 'campaign'
  | 'referral';

type ViewResponse = {
  success?: boolean;
  views?: number;
  counted?: boolean;
};

const DEDUPE_HOURS = 6;
const DEDUPE_MS =
  DEDUPE_HOURS * 60 * 60 * 1000;

export function useContentView(
  type: ContentViewType,
  slug?: string | null,
  enabled = true
) {
  const [views, setViews] = useState(0);
  const [loadingViews, setLoadingViews] =
    useState(true);

  useEffect(() => {
    if (!enabled || !slug) {
      setLoadingViews(false);
      return;
    }

    let active = true;

    const safeSlug = String(slug).trim();

    if (!safeSlug) {
      setLoadingViews(false);
      return;
    }

    const run = async () => {
      setLoadingViews(true);

      const storageKey =
        `bma:view:${type}:${safeSlug}`;

      let shouldIncrement = true;

      try {
        const previous =
          window.localStorage.getItem(
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
            shouldIncrement = false;
          }
        }
      } catch {
        // localStorage mungkin tidak tersedia.
        // Counter tetap dapat dibaca.
      }

      try {
        const url =
          `/api/views?type=${encodeURIComponent(
            type
          )}&slug=${encodeURIComponent(
            safeSlug
          )}`;

        const response =
          await fetch(
            url,
            shouldIncrement
              ? {
                  method: 'POST',
                  cache: 'no-store',
                  headers: {
                    'Content-Type':
                      'application/json',
                  },
                  body: JSON.stringify({
                    type,
                    slug: safeSlug,
                  }),
                }
              : {
                  method: 'GET',
                  cache: 'no-store',
                }
          );

        const data: ViewResponse =
          await response.json();

        if (
          active &&
          response.ok &&
          data.success
        ) {
          setViews(
            Number(data.views || 0)
          );

          if (
            shouldIncrement &&
            data.counted !== false
          ) {
            try {
              window.localStorage.setItem(
                storageKey,
                String(Date.now())
              );
            } catch {
              // Abaikan error localStorage.
            }
          }
        }
      } catch (error) {
        console.error(
          '[VIEWS] Gagal memuat views:',
          error
        );
      } finally {
        if (active) {
          setLoadingViews(false);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [type, slug, enabled]);

  return {
    views,
    loadingViews,
  };
}

export function formatViews(
  value: number
) {
  return Number(value || 0)
    .toLocaleString('id-ID');
}
