import { fileURLToPath, URL } from 'node:url'

// Pulls in vite-ssg's `declare module 'vite' { interface UserConfig {
// ssgOptions?: ... } }` augmentation. vite.config.ts is type-checked as
// its own TS project, separate from src/ (where main.ts imports
// vite-ssg for real), so without this import TS never sees that
// augmentation here and `ssgOptions` below looks like an unknown
// property to `defineConfig`.
import type {} from 'vite-ssg'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { allPrerenderRoutes } from './scripts/static-routes.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  // Replaces vite-plugin-prerender + Puppeteer + @sparticuz/chromium
  // entirely. `vite-ssg build` server-renders every route with Vue's
  // own renderToString (no headless browser, no Chromium binary, no
  // CDP-protocol version to match against Puppeteer) and writes the
  // resulting HTML — with useHead()-generated title/meta/canonical/
  // JSON-LD already baked in — to dist/<route>/index.html, same as
  // before.
  ssgOptions: {
    // '/foo' -> '/foo/index.html', matching the old prerender output
    // and what Vercel expects for clean URLs.
    dirStyle: 'nested',
    // vite-ssg's default includedRoutes handler drops any route with a
    // dynamic segment (:slug etc.), so /products/:slug etc. would
    // silently not get generated. Feed it the same expanded slug list
    // (STATIC_ROUTES + every product/meal-kit/blog slug) that the old
    // Puppeteer prerender step used and that generate-sitemap.mjs
    // already uses — one source of truth for "what should be
    // prerendered", same as before.
    includedRoutes() {
      return allPrerenderRoutes()
    },
  },
})