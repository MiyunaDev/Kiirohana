import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: './',
  build: {
    outDir: 'cordova/www',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    host: "0.0.0.0"
  }
});