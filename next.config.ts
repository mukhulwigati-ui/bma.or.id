// next.config.ts

import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

// ============================================================================
// NEXT.JS CONFIGURATION - BMA
// ============================================================================

const nextConfig: NextConfig = {
  // ==========================================================================
  // IMAGE OPTIMIZATION
  // ==========================================================================

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // ==========================================================================
  // TURBOPACK
  // ==========================================================================

  turbopack: {},

  // ==========================================================================
  // HTML LIMITED BOTS
  //
  // PENTING UNTUK:
  // WhatsApp
  // Facebook
  // Twitter / X
  // Telegram
  // LinkedIn
  //
  // Bot yang cocok regex ini akan menunggu generateMetadata()
  // selesai sehingga OG metadata tersedia di <head> HTML awal.
  // ==========================================================================

  htmlLimitedBots:
    /facebookexternalhit|Facebot|WhatsApp|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|Googlebot|bingbot/i,

  // ==========================================================================
  // SECURITY HEADERS
  // ==========================================================================

  async headers() {
    return [
      {
        source: "/:path*",

        headers: [
          {
            key: "Content-Security-Policy",

            value: `
              default-src 'self';

              script-src
                'self'
                'unsafe-inline'
                'unsafe-eval'
                https://app.midtrans.com
                https://app.sandbox.midtrans.com
                https://snap-assets.midtrans.com
                https://www.googletagmanager.com
                https://*.sanity.io;

              style-src
                'self'
                'unsafe-inline';

              font-src
                'self'
                data:
                https://design-system-static.sanity.io;

              img-src
                'self'
                data:
                blob:
                https://cdn.sanity.io
                https://www.google-analytics.com
                https://app.midtrans.com
                https://app.sandbox.midtrans.com
                https://*.googleusercontent.com
                https://*.gstatic.com
                https://*.sanity.io;

              frame-src
                'self'
                https://app.midtrans.com
                https://app.sandbox.midtrans.com
                https://api.midtrans.com;

              connect-src
                'self'
                https://hpzirilbnkrzcsryzdqn.supabase.co
                https://vnneqinjvfxqkukvcyzm.supabase.co
                https://api.midtrans.com
                https://api.sandbox.midtrans.com
                https://app.midtrans.com
                https://app.sandbox.midtrans.com
                https://www.google-analytics.com
                https://stats.g.doubleclick.net
                https://*.sanity.io
                wss://*.sanity.io;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

// ============================================================================
// PWA
// ============================================================================

export default withPWA({
  dest: "public",

  cacheOnFrontEndNav: true,

  aggressiveFrontEndNavCaching: true,

  reloadOnOnline: true,

  disable:
    process.env.NODE_ENV === "development",
})(nextConfig);