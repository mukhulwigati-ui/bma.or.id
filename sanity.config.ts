// sanity.config.ts

import React from 'react';

import {
  defineConfig,
  buildLegacyTheme,
} from 'sanity';

import {
  structureTool,
} from 'sanity/structure';

import {
  schemaTypes,
} from './sanity/schemaTypes';

// ============================================================
// THEME BMA
// ============================================================

const bmaTheme = buildLegacyTheme({
  '--black': '#262626',

  '--white': '#ffffff',

  // Warna utama BMA
  '--brand-primary': '#facc15',

  '--component-bg': '#ffffff',

  '--component-text-color': '#262626',

  // Focus Sanity
  '--focus-color': '#eab308',
});

// ============================================================
// SANITY CONFIG
// ============================================================

export default defineConfig([
  {
    // ========================================================
    // IDENTITAS PROJECT
    // ========================================================

    name: 'Baitul-Maal-Al-Muttaqin',

    title: 'bma.or.id',

    // ========================================================
    // SANITY PROJECT
    // ========================================================

    projectId:
      process.env
        .NEXT_PUBLIC_SANITY_PROJECT_ID ||
      'im4qx3kd',

    dataset:
      process.env
        .NEXT_PUBLIC_SANITY_DATASET ||
      'production',

    // Studio:
    // https://bma.or.id/studio

    basePath: '/studio',

    // ========================================================
    // PLUGINS
    // ========================================================

    plugins: [
      structureTool({
        structure: (S) => {
          // ==================================================
          // MENU DEFAULT
          // ==================================================
          //
          // Semua schema existing tetap muncul otomatis.
          //
          // fundraiserWithdrawal dikeluarkan dari menu default
          // karena dibuatkan menu khusus Penarikan Komisi.
          //
          // ==================================================

          const defaultItems =
            S.documentTypeListItems().filter(
              (item) =>
                item.getId() !==
                'fundraiserWithdrawal'
            );

          return S.list()
            .title(
              'Manajemen BMA'
            )
            .items([
              // ==============================================
              // MENU SCHEMA YANG SUDAH ADA
              // ==============================================

              ...defaultItems,

              // ==============================================
              // PEMBATAS
              // ==============================================

              S.divider(),

              // ==============================================
              // PENARIKAN KOMISI
              // ==============================================

              S.listItem()
                .title(
                  '💰 Penarikan Komisi'
                )
                .child(
                  S.list()
                    .title(
                      'Penarikan Komisi Fundraiser'
                    )
                    .items([
                      // ======================================
                      // MENUNGGU
                      // ======================================

                      S.listItem()
                        .title(
                          '⏳ Menunggu'
                        )
                        .child(
                          S.documentList()
                            .title(
                              'Menunggu Persetujuan'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              `_type == "fundraiserWithdrawal" && status == "pending"`
                            )
                            .defaultOrdering([
                              {
                                field:
                                  'requestedAt',

                                direction:
                                  'desc',
                              },
                            ])
                        ),

                      // ======================================
                      // DISETUJUI
                      // ======================================

                      S.listItem()
                        .title(
                          '✅ Disetujui'
                        )
                        .child(
                          S.documentList()
                            .title(
                              'Penarikan Disetujui'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              `_type == "fundraiserWithdrawal" && status == "approved"`
                            )
                            .defaultOrdering([
                              {
                                field:
                                  'requestedAt',

                                direction:
                                  'desc',
                              },
                            ])
                        ),

                      // ======================================
                      // SUDAH DIBAYAR
                      // ======================================

                      S.listItem()
                        .title(
                          '💸 Sudah Dibayar'
                        )
                        .child(
                          S.documentList()
                            .title(
                              'Komisi Sudah Dibayar'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              `_type == "fundraiserWithdrawal" && status == "paid"`
                            )
                            .defaultOrdering([
                              {
                                field:
                                  'paidAt',

                                direction:
                                  'desc',
                              },
                            ])
                        ),

                      // ======================================
                      // DITOLAK
                      // ======================================

                      S.listItem()
                        .title(
                          '❌ Ditolak'
                        )
                        .child(
                          S.documentList()
                            .title(
                              'Penarikan Ditolak'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              `_type == "fundraiserWithdrawal" && status == "rejected"`
                            )
                            .defaultOrdering([
                              {
                                field:
                                  'requestedAt',

                                direction:
                                  'desc',
                              },
                            ])
                        ),

                      // ======================================
                      // DIBATALKAN
                      // ======================================

                      S.listItem()
                        .title(
                          '🚫 Dibatalkan'
                        )
                        .child(
                          S.documentList()
                            .title(
                              'Penarikan Dibatalkan'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              `_type == "fundraiserWithdrawal" && status == "cancelled"`
                            )
                            .defaultOrdering([
                              {
                                field:
                                  'requestedAt',

                                direction:
                                  'desc',
                              },
                            ])
                        ),

                      // ======================================
                      // PEMBATAS
                      // ======================================

                      S.divider(),

                      // ======================================
                      // SEMUA PENARIKAN
                      // ======================================

                      S.listItem()
                        .title(
                          '📋 Semua Penarikan'
                        )
                        .child(
                          S.documentList()
                            .title(
                              'Semua Riwayat Penarikan'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              `_type == "fundraiserWithdrawal"`
                            )
                            .defaultOrdering([
                              {
                                field:
                                  'requestedAt',

                                direction:
                                  'desc',
                              },
                            ])
                        ),
                    ])
                ),
            ]);
        },
      }),
    ],

    // ========================================================
    // SCHEMA
    // ========================================================

    schema: {
      types:
        schemaTypes,
    },

    // ========================================================
    // THEME
    // ========================================================

    theme:
      bmaTheme,

    // ========================================================
    // CUSTOM SANITY STUDIO
    // ========================================================

    studio: {
      components: {
        navbar: (
          props
        ) => {
          return React.createElement(
            'div',

            {
              style: {
                display:
                  'flex',

                flexDirection:
                  'column',

                width:
                  '100%',
              },
            },

            // ==================================================
            // HEADER IDENTITAS BMA
            // ==================================================

            React.createElement(
              'div',

              {
                style: {
                  background:
                    '#facc15',

                  padding:
                    '16px 24px',

                  display:
                    'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'space-between',

                  borderBottom:
                    '1px solid #eab308',

                  boxShadow:
                    '0 2px 6px rgba(0, 0, 0, 0.08)',
                },
              },

              // ================================================
              // LOGO + IDENTITAS
              // ================================================

              React.createElement(
                'div',

                {
                  style: {
                    display:
                      'flex',

                    alignItems:
                      'center',

                    gap:
                      '16px',

                    minWidth:
                      0,
                  },
                },

                // ==============================================
                // LOGO
                // ==============================================

                React.createElement(
                  'img',
                  {
                    src:
                      '/images/logo-bma.png',

                    alt:
                      'Baitul Maal Al Muttaqin',

                    style: {
                      height:
                        '52px',

                      width:
                        'auto',

                      objectFit:
                        'contain',

                      display:
                        'block',

                      flexShrink:
                        0,
                    },
                  }
                ),

                // ==============================================
                // IDENTITAS LEMBAGA
                // ==============================================

                React.createElement(
                  'div',

                  {
                    style: {
                      display:
                        'flex',

                      flexDirection:
                        'column',

                      minWidth:
                        0,
                    },
                  },

                  // Nama lembaga
                  React.createElement(
                    'span',

                    {
                      style: {
                        color:
                          '#292929',

                        fontSize:
                          '16px',

                        fontWeight:
                          '800',

                        lineHeight:
                          '1.2',

                        letterSpacing:
                          '-0.01em',

                        whiteSpace:
                          'nowrap',
                      },
                    },

                    'Baitul Maal Al Muttaqin'
                  ),

                  // Lokasi + domain
                  React.createElement(
                    'span',

                    {
                      style: {
                        color:
                          '#525252',

                        fontSize:
                          '12px',

                        fontWeight:
                          '600',

                        marginTop:
                          '4px',

                        lineHeight:
                          '1.2',
                      },
                    },

                    'Jepara • bma.or.id'
                  )
                )
              )
            ),

            // ==================================================
            // NAVBAR DEFAULT SANITY
            // ==================================================

            props.renderDefault(
              props
            )
          );
        },
      },
    },
  },
]);