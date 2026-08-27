'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();
  const pathname = usePathname();

  // ============================================================
  // SEMBUNYIKAN HEADER DI HALAMAN DETAIL CAMPAIGN
  // ============================================================
  if (pathname.startsWith('/campaign/')) {
    return null;
  }

  // ============================================================
  // SEARCH
  // ============================================================
  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    router.push(
      `/search?q=${encodeURIComponent(query)}`
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white text-stone-900 shadow-sm">
      
      {/* ========================================================
          HEADER CONTAINER
      ======================================================== */}
      <div className="mx-auto flex h-16 w-full max-w-md items-center gap-3 px-4">

        {/* ======================================================
            LOGO BMA
        ====================================================== */}
        <Link
          href="/"
          aria-label="Beranda Baitul Maal Al Muttaqin"
          className="flex shrink-0 items-center"
        >
          <div className="relative flex h-9 items-center overflow-hidden">
            <img
              src="/images/logo-bma.png"
              alt="Baitul Maal Al Muttaqin"
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>

        {/* ======================================================
            SEARCH BAR
        ====================================================== */}
        <form
          onSubmit={handleSearchSubmit}
          className="min-w-0 flex-1"
        >
          <div className="relative flex w-full items-center">

            <Search
              className="
                pointer-events-none
                absolute
                left-3.5
                h-4
                w-4
                text-stone-500
                stroke-[2]
              "
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Cari program..."
              aria-label="Cari program"
              className="
                w-full
                rounded-full
                border
                border-stone-200
                bg-stone-100
                py-2.5
                pl-9
                pr-4
                text-xs
                font-medium
                text-stone-900
                outline-none
                transition-all
                placeholder:text-stone-400

                focus:border-stone-300
                focus:bg-white
                focus:ring-2
                focus:ring-stone-100
              "
            />

          </div>
        </form>

        {/* ======================================================
            NOTIFICATION
            Paksa SVG / icon di dalam NotificationDropdown hitam
        ====================================================== */}
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center

            [&_button]:flex
            [&_button]:h-10
            [&_button]:w-10
            [&_button]:items-center
            [&_button]:justify-center
            [&_button]:rounded-full

            [&_button]:text-black
            [&_button]:transition-colors

            [&_button:hover]:bg-stone-100

            [&_svg]:text-black
            [&_svg]:stroke-black
          "
        >
          <NotificationDropdown />
        </div>

      </div>
    </header>
  );
}