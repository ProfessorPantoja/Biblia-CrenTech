import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icons/*.png', 'og-image.png'],
          manifest: {
            name: 'Bíblia CRENTECH',
            short_name: 'Bíblia IA CrenTech',
            description: 'A ferramenta mais rápida para encontrar versículos. Estudo bíblico ágil com IA.',
            start_url: '/',
            display: 'standalone',
            background_color: '#450a0a',
            theme_color: '#450a0a',
            icons: [
              { src: '/icons/android-launchericon-192-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
              { src: '/icons/android-launchericon-512-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
            ],
          },
          workbox: {
            // Precache só o app shell (js/css/html/ícones). Os JSONs da Bíblia
            // (8 MB) ficam fora do precache e são cacheados em runtime.
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            navigateFallback: '/index.html',
            runtimeCaching: [
              {
                // Livros da Bíblia: nunca mudam -> CacheFirst (offline após 1ª leitura).
                urlPattern: ({ url }) => url.pathname.startsWith('/bible/'),
                handler: 'CacheFirst',
                options: {
                  cacheName: 'bible-json',
                  expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 365 },
                  cacheableResponse: { statuses: [0, 200] },
                },
              },
              {
                // Fontes do Google: StaleWhileRevalidate.
                urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'google-fonts',
                  expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                  cacheableResponse: { statuses: [0, 200] },
                },
              },
            ],
          },
          devOptions: {
            enabled: false,
          },
        }),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
