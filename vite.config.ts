import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
let pwaPlugin = null;
try {
  // Optional dependency - if it's not installed, the build will continue without PWA support
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { VitePWA } = require('vite-plugin-pwa');
  pwaPlugin = VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
    manifest: {
      name: 'Super Agente',
      short_name: 'SuperAgente',
      description: 'Gestor offline para agentes',
      theme_color: '#ffffff',
      icons: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      runtimeCaching: [
        {
          urlPattern: /\/api\//,
          handler: 'NetworkFirst',
          options: { cacheName: 'api-cache', expiration: { maxEntries: 50 } }
        }
      ]
    }
  });
} catch (e) {
  console.warn('vite-plugin-pwa not available; continuing without PWA plugin');
}

export default defineConfig({
  plugins: [
    react(),
    ...(pwaPlugin ? [pwaPlugin] : [])
  ]
});