import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Με το base: './' η εφαρμογή θα λειτουργεί σωστά σε οποιοδήποτε υποφάκελο (subpath)
  // στο GitHub Pages (π.χ. https://username.github.io/OrthoRadio/)
  base: './',
  plugins: [
    VitePWA({
      registerType: 'prompt', // Enables prompt for update when new version is available
      includeAssets: ['orthoradio-favicon.svg', 'mount_athos.jpg'], // assets to precache
      manifest: {
        name: 'OrthoRadio',
        short_name: 'OrthoRadio',
        description: 'Ορθόδοξο Διαδικτυακό Ραδιόφωνο',
        theme_color: '#050814',
        background_color: '#050814',
        display: 'standalone',
        icons: [
          {
            src: 'orthoradio-favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Caching strategies for runtime assets if needed
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}']
      }
    })
  ]
});
