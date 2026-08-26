// components/Header.tsx
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

  // 🚀 SEMBUNYIKAN HEADER UTAMA SAAT BERADA DI HALAMAN DETAIL CAMPAIGN
  if (pathname.startsWith('/campaign/')) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white text-stone-800 shadow-xs border-b border-stone-200">
      {/* Container utama dikunci di max-w-md agar sejajar presisi dengan konten app mobile */}
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between gap-3">
        
        {/* 1. Logo Yayasan */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="relative h-8 w-auto flex items-center overflow-hidden">
            <img 
              src="/images/logo-bma.png" 
              alt="Logo bma.or.id" 
              className="h-full w-auto object-contain" 
            />
          </div>
        </Link>

        {/* 2. Search Bar Rounded (Pill Shape) dengan Warna Abu-abu Tipis Elegan */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none stroke-[2]" />
            <input
              type="text"
              placeholder="Cari Nama Program"
              className="w-full bg-stone-100/80 text-stone-900 text-xs font-medium pl-9 pr-4 py-2 rounded-full placeholder-stone-400 border border-stone-200/60 focus:outline-none focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* 3. Komponen Dropdown Notifikasi */}
        <NotificationDropdown />

      </div>
    </header>
  );
}