// sanity.config.ts

import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import React from 'react';
import { schemaTypes } from './sanity/schemaTypes';

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

    projectId: 'im4qx3kd',
    dataset: 'production',

    // Studio tersedia di:
    // https://bma.or.id/studio

    basePath: '/studio',

    // ========================================================
    // PLUGINS
    // ========================================================

    plugins: [
      structureTool(),
    ],

    // ========================================================
    // SCHEMA
    // ========================================================

    schema: {
      types: schemaTypes,
    },

    // ========================================================
    // THEME
    // ========================================================

    theme: bmaTheme,

    // ========================================================
    // CUSTOM SANITY STUDIO
    // ========================================================

    studio: {
      components: {
        navbar: (props) => {
          return React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              },
            },

            // ==================================================
            // HEADER IDENTITAS BMA
            // ==================================================

            React.createElement(
              'div',
              {
                style: {
                  // KUNING BMA
                  background: '#facc15',

                  padding: '16px 24px',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',

                  // Garis bawah sedikit lebih gelap
                  borderBottom: '1px solid #eab308',

                  // Shadow sangat tipis
                  boxShadow:
                    '0 2px 6px rgba(0, 0, 0, 0.08)',
                },
              },

              // ==================================================
              // LOGO + IDENTITAS
              // ==================================================

              React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    minWidth: 0,
                  },
                },

                // ==================================================
                // LOGO BMA
                // ==================================================

                React.createElement('img', {
                  src: '/images/logo-bma.png',

                  alt:
                    'Baitul Maal Al Muttaqin',

                  style: {
                    height: '52px',
                    width: 'auto',

                    objectFit: 'contain',
                    display: 'block',

                    flexShrink: 0,
                  },
                }),

                // ==================================================
                // IDENTITAS LEMBAGA
                // ==================================================

                React.createElement(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: 0,
                    },
                  },

                  // Nama lembaga
                  React.createElement(
                    'span',
                    {
                      style: {
                        // Tidak hitam pekat
                        color: '#292929',

                        fontSize: '16px',
                        fontWeight: '800',

                        lineHeight: '1.2',
                        letterSpacing: '-0.01em',

                        whiteSpace: 'nowrap',
                      },
                    },

                    'Baitul Maal Al Muttaqin'
                  ),

                  // Lokasi + domain
                  React.createElement(
                    'span',
                    {
                      style: {
                        color: '#525252',

                        fontSize: '12px',
                        fontWeight: '600',

                        marginTop: '4px',
                        lineHeight: '1.2',
                      },
                    },

                    'Jepara • bma.or.id'
                  )
                )
              )
            ),

            // ==================================================
            // NAVBAR BAWAAN SANITY
            // ==================================================

            props.renderDefault(props)
          );
        },
      },
    },
  },
]);