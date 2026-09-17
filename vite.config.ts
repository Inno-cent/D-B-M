import { fileURLToPath, URL } from 'node:url'
import { createRequire } from 'node:module'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { allPrerenderRoutes } from './scripts/static-routes.mjs'

// vite-plugin-prerender's own dist/index.mjs is broken as of v1.0.8 — it
// `import`s at the top but calls raw `require(...)` further down, which
// only works in CommonJS. Since this project's package.json has
// "type": "module", Vite loads vite.config.ts as ESM and Node's ESM
// loader has no `require`, so `import Prerender from 'vite-plugin-prerender'`
// crashes with "require is not defined in ES module scope". Loading the
// package's dist/index.cjs directly via createRequire sidesteps their
// broken .mjs file entirely and works fine.
const require = createRequire(import.meta.url)
const Prerender = require('vite-plugin-prerender')

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    // Prerendering only matters for the production build — running it
    // in `vite dev` would spin up a headless Chromium on every save.
    // vite-plugin-prerender renders each route in a real browser after
    // `vite build` finishes and writes the resulting HTML (with the
    // useHead()-generated title/meta/canonical/JSON-LD already baked
    // in) to dist/<route>/index.html, so crawlers that don't execute
    // JS still see full per-page SEO tags.
    //
    // Only static + known dynamic-by-slug routes are listed (see
    // scripts/static-routes.mjs) — routes gated by auth
    // (dashboard/checkout/orders/admin) or that are inherently
    // per-user (cart) are deliberately left out since there's nothing
    // useful to prerender for a logged-out crawler there.
    command === 'build' &&
      Prerender({
        staticDir: fileURLToPath(new URL('./dist', import.meta.url)),
        routes: allPrerenderRoutes(),
        renderer: new Prerender.PuppeteerRenderer({
          renderAfterDocumentEvent: 'app-rendered',
          maxConcurrentRoutes: 4,
          headless: true,
        }),
      }),
  ].filter(Boolean),
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
}))