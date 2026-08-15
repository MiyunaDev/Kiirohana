import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import Inspect from 'vite-plugin-inspect'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // HTTPS sertifikat lokal otomatis
    mkcert(),

    // Optimasi aset gambar saat build
    ViteImageOptimizer(),

    // Inspeksi plugin & state Vite di browser (akses via /__inspect/)
    Inspect(),

    // Progressive Web App support
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Kiirohana PWA',
        short_name: 'Kiirohana',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: './',
  build: {
    outDir: 'cordova/www',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: true,
  },
})