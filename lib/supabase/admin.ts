// lib/supabase/admin.ts

import { createClient } from '@supabase/supabase-js';

// ============================================================
// ENVIRONMENT
// ============================================================

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

// ============================================================
// VALIDATION
// ============================================================

if (!supabaseUrl) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL belum tersedia.'
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY belum tersedia.'
  );
}

// ============================================================
// SUPABASE ADMIN CLIENT
//
// PERINGATAN:
//
// Client ini HANYA BOLEH digunakan di server:
// - Route Handler
// - Server Action
// - server-side utility
//
// JANGAN import file ini ke komponen "use client".
// Service Role Key dapat melewati RLS.
// ============================================================

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);