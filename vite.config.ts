import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png', 'icons/app-icon.svg'],
      manifest: {
        name: '대한예수교장로회 사랑하는교회',
        short_name: '사랑하는교회',
        description:
          '대한예수교장로회 사랑하는교회 공식 홈페이지 — 예배안내, 교육부서, 선교사역, 교회소식, 오시는길',
        lang: 'ko',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f59342',
        theme_color: '#f59342',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // 앱 셸(JS/CSS/HTML)만 프리캐시한다. 사진·파트너 로고까지 전부 넣으면
        // 첫 방문 시 서비스워커가 수 MB를 백그라운드로 통째로 내려받게 되는데,
        // 콘텐츠 이미지는 이미 hosting 헤더의 1년 immutable 캐시로 재방문 시
        // 충분히 빠르므로 프리캐시할 필요가 없다. Firestore/Firebase Storage는
        // 크로스 오리진 실시간 호출이라 애초에 캐싱 대상에서 제외된다.
        globPatterns: ['**/*.{js,css,html}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/__/],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Storage is dynamically imported only at admin upload time (see
          // src/lib/storage-upload.ts) — leave it out of the eager
          // 'firebase' chunk so it splits into its own async chunk.
          if (id.includes('node_modules/firebase/storage')) return undefined
          if (id.includes('node_modules/firebase')) return 'firebase'
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react/')
          ) {
            return 'vendor'
          }
        },
      },
    },
  },
})
