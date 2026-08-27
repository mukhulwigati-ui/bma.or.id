// sanity.config.ts
import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import React from 'react';
import { schemaTypes } from './sanity/schemaTypes';

const emeraldTheme = buildLegacyTheme({
  '--black': '#1f2937',
  '--white': '#ffffff',
  '--brand-primary': '#10b981',
  '--component-bg': '#ffffff',
  '--component-text-color': '#1f2937',
  '--focus-color': '#fbbf24',
});

export default defineConfig([
  {
    // Identitas Project
    name: 'Baitul-Maal-Al-Muttaqin',
    title: 'bma.or.id',

    // Sanity
    projectId: 'im4qx3kd',
    dataset: 'production',

    // Studio tersedia di bma.or.id/studio
    basePath: '/studio',

    plugins: [structureTool()],

    schema: {
      types: schemaTypes,
    },

    theme: emeraldTheme,

    studio: {
      components: {
        navbar: (props) => {
          return React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
              },
            },

            // Header BMA
            React.createElement(
              'div',
              {
                style: {
                  background: '#064e3b',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #022c22',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                },
              },

              // Logo
              React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  },
                },

                React.createElement('img', {
                  src: '/images/logo-bma.png',
                  alt: 'Baitul Maal Al Muttaqin',
                  style: {
                    height: '52px',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  },
                }),

                // Identitas lembaga
                React.createElement(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },
                  },

                  React.createElement(
                    'span',
                    {
                      style: {
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '700',
                        lineHeight: '1.2',
                      },
                    },
                    'Baitul Maal Al Muttaqin'
                  ),

                  React.createElement(
                    'span',
                    {
                      style: {
                        color: '#a7f3d0',
                        fontSize: '12px',
                        marginTop: '3px',
                      },
                    },
                    'Jepara • bma.or.id'
                  )
                )
              )
            ),

            // Navbar bawaan Sanity
            props.renderDefault(props)
          );
        },
      },
    },
  },
]);